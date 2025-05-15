import { Client, Events, GatewayIntentBits, ActivityType } from "discord.js";
import { IStorage } from "../storage";
import { registerCommands } from "./commands";
import { setupEconomy } from "./economy";
import { setupLevels } from "./levels";
import { setupMusic } from "./music";
import { setupGames } from "./games";

export async function setupBotConnection(client: Client, token: string, storage: IStorage) {
  // Get bot configuration
  const botConfig = await storage.getBotConfig();
  
  // Set status activity type based on configuration
  let activityType: ActivityType.Playing | ActivityType.Watching | ActivityType.Listening | ActivityType.Streaming | ActivityType.Competing = ActivityType.Playing;
  
  // First check activityType field, if not present, fall back to statusType for backward compatibility
  if (botConfig?.activityType) {
    switch (botConfig.activityType) {
      case "PLAYING":
        activityType = ActivityType.Playing;
        break;
      case "WATCHING":
        activityType = ActivityType.Watching;
        break;
      case "LISTENING":
        activityType = ActivityType.Listening;
        break;
      case "STREAMING":
        activityType = ActivityType.Streaming;
        break;
      case "COMPETING":
        activityType = ActivityType.Competing;
        break;
      default:
        activityType = ActivityType.Playing;
    }
  } else {
    // Legacy support
    switch (botConfig?.statusType) {
      case "Watching":
        activityType = ActivityType.Watching;
        break;
      case "Listening to":
        activityType = ActivityType.Listening;
        break;
      case "Competing in":
        activityType = ActivityType.Competing;
        break;
      default:
        activityType = ActivityType.Playing;
    }
  }

  // Set up event handlers
  client.once(Events.ClientReady, async (readyClient) => {
    console.log(`Discord bot is ready! Logged in as ${readyClient.user.tag}`);
    
    // Set presence based on the bot config
    const activityText = botConfig?.activityText || "JAH MADE IT";
    
    readyClient.user.setPresence({
      activities: [
        {
          name: activityText,
          type: activityType
        }
      ],
      status: 'online'
    });

    // Store server information
    readyClient.guilds.cache.forEach(async (guild) => {
      try {
        const memberCount = (await guild.fetch()).memberCount;
        
        // Check if server already exists in database
        const servers = await storage.getDiscordServers();
        const existingServer = servers.find(server => server.serverId === guild.id);
        
        if (existingServer) {
          // Update member count
          await storage.updateDiscordServer(existingServer.id, {
            memberCount: memberCount
          });
        } else {
          // Add new server to database
          await storage.createDiscordServer({
            serverId: guild.id,
            serverName: guild.name,
            memberCount: memberCount,
            joinedAt: new Date()
          });
        }
      } catch (error) {
        console.error(`Error handling guild ${guild.id}:`, error);
      }
    });
  });

  // Set up command handlers
  await registerCommands(client, storage);
  
  // Set up feature systems
  const featureSettings = await storage.getFeatureSettings();
  
  if (featureSettings?.economyEnabled) {
    await setupEconomy(client, storage);
  }
  
  if (featureSettings?.levelSystemEnabled) {
    await setupLevels(client, storage);
  }
  
  if (featureSettings?.musicPlayerEnabled) {
    await setupMusic(client, storage);
  }
  
  if (featureSettings?.miniGamesEnabled) {
    await setupGames(client, storage);
  }

  // Error handling
  client.on(Events.Error, (error) => {
    console.error("Discord client error:", error);
  });

  // Server join events
  client.on(Events.GuildCreate, async (guild) => {
    try {
      console.log(`Bot joined a new server: ${guild.name}`);
      await storage.createDiscordServer({
        serverId: guild.id,
        serverName: guild.name,
        memberCount: guild.memberCount,
        joinedAt: new Date()
      });
    } catch (error) {
      console.error("Error handling guild join:", error);
    }
  });

  // Server leave events
  client.on(Events.GuildDelete, async (guild) => {
    try {
      console.log(`Bot left a server: ${guild.name}`);
      const servers = await storage.getDiscordServers();
      const existingServer = servers.find(server => server.serverId === guild.id);
      
      if (existingServer) {
        await storage.deleteDiscordServer(existingServer.id);
      }
    } catch (error) {
      console.error("Error handling guild leave:", error);
    }
  });

  // Log reconnect events
  client.on(Events.Invalidated, () => {
    console.log("Connection to Discord invalidated, reconnecting...");
  });

  client.on(Events.ShardResume, () => {
    console.log("Connection to Discord resumed");
  });

  // Update analytics data every hour
  const updateAnalytics = async () => {
    try {
      const commandsUsed = 0; // This should be tracking actual command usage
      const activeUsers = 0; // This should be tracking active users
      const uptime = Math.floor(client.uptime ? client.uptime / 1000 : 0);
      
      await storage.createAnalyticsData({
        timestamp: new Date(),
        commandsUsed,
        activeUsers,
        uptime: 99 // Just a placeholder, in production you'd calculate actual uptime percentage
      });
    } catch (error) {
      console.error("Error updating analytics:", error);
    }
  };

  setInterval(updateAnalytics, 3600000); // Update every hour
}
