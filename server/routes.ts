import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { Client, Events, GatewayIntentBits, ActivityType } from "discord.js";
import { z } from "zod";
import { 
  insertBotConfigSchema, 
  insertFeatureSettingsSchema, 
  insertEconomySettingsSchema,
  insertShopItemSchema,
  insertLevelSettingsSchema,
  insertLevelRewardSchema,
  insertMusicSettingsSchema,
  insertAnimeGameSettingsSchema,
  insertAnimeDatabaseSchema,
  insertBotCommandSchema,
  insertHelpCommandSettingsSchema,
  insertUserSchema
} from "@shared/schema";
import { setupBotConnection } from "./discord/bot";

let discordClient: Client | null = null;

// Authentication middleware
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const { session } = req as any;
  if (!session || !session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Authentication routes
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // For this specific application, we only allow one user as requested
      if (username !== 'Jahceere' || password !== 'JAHCEERE123') {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Store user in session
      (req as any).session.user = { username: 'Jahceere', isAdmin: true };
      
      res.json({ username: 'Jahceere', isAdmin: true });
    } catch (error) {
      res.status(500).json({ message: 'Authentication failed' });
    }
  });
  
  app.post('/api/auth/logout', (req, res) => {
    (req as any).session.destroy();
    res.status(200).json({ message: 'Logged out successfully' });
  });
  
  app.get('/api/auth/user', (req, res) => {
    const user = (req as any).session.user;
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ message: 'Not authenticated' });
    }
  });
  
  // Get bot status
  app.get("/api/bot/status", async (req, res) => {
    try {
      const botConfig = await storage.getBotConfig();
      const discordServers = await storage.getDiscordServers();
      const isConnected = discordClient !== null && discordClient.isReady();
      
      res.json({
        isConnected,
        isActive: botConfig?.isActive || false,
        serverCount: discordServers.length,
        uptime: isConnected && discordClient ? discordClient.uptime : 0,
        activityType: botConfig?.activityType || "PLAYING",
        activityStatus: botConfig?.activityText || "JAH MADE IT"
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get bot status" });
    }
  });
  
  // Update bot activity
  app.post("/api/bot/activity", requireAuth, async (req, res) => {
    try {
      const { activityType, activityText } = req.body;
      
      // Validate activity type
      const validActivityTypes = ["PLAYING", "WATCHING", "LISTENING", "STREAMING", "COMPETING"];
      if (activityType && !validActivityTypes.includes(activityType)) {
        return res.status(400).json({ 
          message: "Invalid activity type. Valid types are: " + validActivityTypes.join(", ") 
        });
      }
      
      // Get current config
      const botConfig = await storage.getBotConfig();
      if (!botConfig) {
        return res.status(404).json({ message: "Bot configuration not found" });
      }
      
      // Update the bot config
      const updatedConfig = await storage.updateBotConfig({
        activityType: activityType || botConfig.activityType,
        activityText: activityText || botConfig.activityText
      });
      
      // Update the activity if the bot is connected
      if (discordClient && discordClient.isReady()) {
        const type = activityType as keyof typeof ActivityType || botConfig.activityType;
        discordClient.user.setActivity(activityText || botConfig.activityText, { 
          type: ActivityType[type] 
        });
      }
      
      res.json({
        message: "Bot activity updated successfully",
        activityType: updatedConfig.activityType,
        activityText: updatedConfig.activityText
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to update bot activity" });
    }
  });

  // Get bot configuration
  app.get("/api/bot/config", async (req, res) => {
    try {
      const config = await storage.getBotConfig();
      if (!config) {
        return res.status(404).json({ message: "Bot configuration not found" });
      }
      // Return a masked token for security
      const maskedConfig = {
        ...config,
        token: config.token.substring(0, 10) + "..." + config.token.substring(config.token.length - 10),
      };
      res.json(maskedConfig);
    } catch (error) {
      res.status(500).json({ message: "Failed to get bot configuration" });
    }
  });

  // Update bot configuration
  app.post("/api/bot/config", async (req, res) => {
    try {
      const data = insertBotConfigSchema.parse(req.body);
      const existingConfig = await storage.getBotConfig();
      
      if (existingConfig) {
        const updatedConfig = await storage.updateBotConfig(data);
        res.json(updatedConfig);
      } else {
        const newConfig = await storage.createBotConfig(data);
        res.json(newConfig);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update bot configuration" });
    }
  });

  // Start the bot
  app.post("/api/bot/start", async (req, res) => {
    try {
      const botConfig = await storage.getBotConfig();
      if (!botConfig) {
        return res.status(404).json({ message: "Bot configuration not found" });
      }

      if (discordClient && discordClient.isReady()) {
        return res.status(400).json({ message: "Bot is already running" });
      }

      // Update the bot status to active
      await storage.updateBotConfig({ isActive: true });
      
      // Initialize and connect the bot
      discordClient = new Client({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.GuildMembers,
          GatewayIntentBits.GuildVoiceStates,
          GatewayIntentBits.MessageContent,
        ],
      });

      setupBotConnection(discordClient, botConfig.token, storage);

      discordClient.once(Events.ClientReady, (readyClient) => {
        res.json({ message: "Bot started successfully", botId: readyClient.user.id });
      });

      discordClient.on(Events.Error, (error) => {
        console.error("Discord client error:", error);
        discordClient = null;
      });

      discordClient.login(botConfig.token);
    } catch (error) {
      console.error("Failed to start bot:", error);
      res.status(500).json({ message: "Failed to start bot" });
    }
  });

  // Stop the bot
  app.post("/api/bot/stop", async (req, res) => {
    try {
      if (!discordClient || !discordClient.isReady()) {
        return res.status(400).json({ message: "Bot is not running" });
      }

      // Update the bot status to inactive
      await storage.updateBotConfig({ isActive: false });
      
      // Disconnect the client
      await discordClient.destroy();
      discordClient = null;
      
      res.json({ message: "Bot stopped successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to stop bot" });
    }
  });

  // Get feature settings
  app.get("/api/features", async (req, res) => {
    try {
      const features = await storage.getFeatureSettings();
      res.json(features);
    } catch (error) {
      res.status(500).json({ message: "Failed to get feature settings" });
    }
  });

  // Update feature settings
  app.post("/api/features", async (req, res) => {
    try {
      const data = insertFeatureSettingsSchema.parse(req.body);
      const existingFeatures = await storage.getFeatureSettings();
      
      if (existingFeatures) {
        const updatedFeatures = await storage.updateFeatureSettings(data);
        res.json(updatedFeatures);
      } else {
        const newFeatures = await storage.createFeatureSettings(data);
        res.json(newFeatures);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update feature settings" });
    }
  });

  // Economy System Routes
  // Get economy settings
  app.get("/api/economy/settings", async (req, res) => {
    try {
      const settings = await storage.getEconomySettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to get economy settings" });
    }
  });

  // Update economy settings
  app.post("/api/economy/settings", async (req, res) => {
    try {
      const data = insertEconomySettingsSchema.parse(req.body);
      const existingSettings = await storage.getEconomySettings();
      
      if (existingSettings) {
        const updatedSettings = await storage.updateEconomySettings(data);
        res.json(updatedSettings);
      } else {
        const newSettings = await storage.createEconomySettings(data);
        res.json(newSettings);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update economy settings" });
    }
  });

  // Get shop items
  app.get("/api/economy/shop", async (req, res) => {
    try {
      const items = await storage.getShopItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to get shop items" });
    }
  });

  // Create shop item
  app.post("/api/economy/shop", async (req, res) => {
    try {
      const data = insertShopItemSchema.parse(req.body);
      const item = await storage.createShopItem(data);
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create shop item" });
    }
  });

  // Update shop item
  app.put("/api/economy/shop/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertShopItemSchema.partial().parse(req.body);
      const item = await storage.updateShopItem(id, data);
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update shop item" });
    }
  });

  // Delete shop item
  app.delete("/api/economy/shop/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteShopItem(id);
      if (success) {
        res.json({ message: "Shop item deleted successfully" });
      } else {
        res.status(404).json({ message: "Shop item not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete shop item" });
    }
  });

  // Level System Routes
  // Get level settings
  app.get("/api/levels/settings", async (req, res) => {
    try {
      const settings = await storage.getLevelSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to get level settings" });
    }
  });

  // Update level settings
  app.post("/api/levels/settings", async (req, res) => {
    try {
      const data = insertLevelSettingsSchema.parse(req.body);
      const existingSettings = await storage.getLevelSettings();
      
      if (existingSettings) {
        const updatedSettings = await storage.updateLevelSettings(data);
        res.json(updatedSettings);
      } else {
        const newSettings = await storage.createLevelSettings(data);
        res.json(newSettings);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update level settings" });
    }
  });

  // Get level rewards
  app.get("/api/levels/rewards", async (req, res) => {
    try {
      const rewards = await storage.getLevelRewards();
      res.json(rewards);
    } catch (error) {
      res.status(500).json({ message: "Failed to get level rewards" });
    }
  });

  // Create level reward
  app.post("/api/levels/rewards", async (req, res) => {
    try {
      const data = insertLevelRewardSchema.parse(req.body);
      const reward = await storage.createLevelReward(data);
      res.json(reward);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create level reward" });
    }
  });

  // Update level reward
  app.put("/api/levels/rewards/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertLevelRewardSchema.partial().parse(req.body);
      const reward = await storage.updateLevelReward(id, data);
      res.json(reward);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update level reward" });
    }
  });

  // Delete level reward
  app.delete("/api/levels/rewards/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteLevelReward(id);
      if (success) {
        res.json({ message: "Level reward deleted successfully" });
      } else {
        res.status(404).json({ message: "Level reward not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete level reward" });
    }
  });

  // Music System Routes
  // Get music settings
  app.get("/api/music/settings", async (req, res) => {
    try {
      const settings = await storage.getMusicSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to get music settings" });
    }
  });

  // Update music settings
  app.post("/api/music/settings", async (req, res) => {
    try {
      const data = insertMusicSettingsSchema.parse(req.body);
      const existingSettings = await storage.getMusicSettings();
      
      if (existingSettings) {
        const updatedSettings = await storage.updateMusicSettings(data);
        res.json(updatedSettings);
      } else {
        const newSettings = await storage.createMusicSettings(data);
        res.json(newSettings);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update music settings" });
    }
  });

  // Games System Routes
  // Get anime game settings
  app.get("/api/games/anime/settings", async (req, res) => {
    try {
      const settings = await storage.getAnimeGameSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to get anime game settings" });
    }
  });

  // Update anime game settings
  app.post("/api/games/anime/settings", async (req, res) => {
    try {
      const data = insertAnimeGameSettingsSchema.parse(req.body);
      const existingSettings = await storage.getAnimeGameSettings();
      
      if (existingSettings) {
        const updatedSettings = await storage.updateAnimeGameSettings(data);
        res.json(updatedSettings);
      } else {
        const newSettings = await storage.createAnimeGameSettings(data);
        res.json(newSettings);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update anime game settings" });
    }
  });

  // Get anime database
  app.get("/api/games/anime/database", async (req, res) => {
    try {
      const database = await storage.getAnimeDatabase();
      res.json(database);
    } catch (error) {
      res.status(500).json({ message: "Failed to get anime database" });
    }
  });

  // Create anime entry
  app.post("/api/games/anime/database", async (req, res) => {
    try {
      const data = insertAnimeDatabaseSchema.parse(req.body);
      const entry = await storage.createAnimeEntry(data);
      res.json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create anime entry" });
    }
  });

  // Update anime entry
  app.put("/api/games/anime/database/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertAnimeDatabaseSchema.partial().parse(req.body);
      const entry = await storage.updateAnimeEntry(id, data);
      res.json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update anime entry" });
    }
  });

  // Delete anime entry
  app.delete("/api/games/anime/database/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteAnimeEntry(id);
      if (success) {
        res.json({ message: "Anime entry deleted successfully" });
      } else {
        res.status(404).json({ message: "Anime entry not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete anime entry" });
    }
  });

  // Bot Commands Routes
  // Get all bot commands
  app.get("/api/commands", async (req, res) => {
    try {
      const commands = await storage.getBotCommands();
      res.json(commands);
    } catch (error) {
      res.status(500).json({ message: "Failed to get bot commands" });
    }
  });

  // Create bot command
  app.post("/api/commands", async (req, res) => {
    try {
      const data = insertBotCommandSchema.parse(req.body);
      const command = await storage.createBotCommand(data);
      res.json(command);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create bot command" });
    }
  });

  // Update bot command
  app.put("/api/commands/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertBotCommandSchema.partial().parse(req.body);
      const command = await storage.updateBotCommand(id, data);
      res.json(command);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update bot command" });
    }
  });

  // Delete bot command
  app.delete("/api/commands/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteBotCommand(id);
      if (success) {
        res.json({ message: "Bot command deleted successfully" });
      } else {
        res.status(404).json({ message: "Bot command not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete bot command" });
    }
  });

  // Get help command settings
  app.get("/api/commands/help", async (req, res) => {
    try {
      const settings = await storage.getHelpCommandSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to get help command settings" });
    }
  });

  // Update help command settings
  app.post("/api/commands/help", async (req, res) => {
    try {
      const data = insertHelpCommandSettingsSchema.parse(req.body);
      const existingSettings = await storage.getHelpCommandSettings();
      
      if (existingSettings) {
        const updatedSettings = await storage.updateHelpCommandSettings(data);
        res.json(updatedSettings);
      } else {
        const newSettings = await storage.createHelpCommandSettings(data);
        res.json(newSettings);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update help command settings" });
    }
  });

  // Analytics Routes
  // Get server stats
  app.get("/api/analytics/servers", async (req, res) => {
    try {
      const servers = await storage.getDiscordServers();
      res.json({
        count: servers.length,
        servers: servers
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get server stats" });
    }
  });

  // Get analytics data
  app.get("/api/analytics/data", async (req, res) => {
    try {
      const data = await storage.getAnalyticsData();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to get analytics data" });
    }
  });
  
  return httpServer;
}
