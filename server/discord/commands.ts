import { Client, Events, Message } from "discord.js";
import { IStorage } from "../storage";

export async function registerCommands(client: Client, storage: IStorage) {
  // Get bot configuration for prefix
  const botConfig = await storage.getBotConfig();
  const prefix = botConfig?.prefix || "!!";
  
  // Get help command settings
  const helpSettings = await storage.getHelpCommandSettings();
  
  // Track command usage
  let commandsUsed = 0;
  
  client.on(Events.MessageCreate, async (message: Message) => {
    // Ignore messages from bots
    if (message.author.bot) return;
    
    // Ignore messages that don't start with the prefix
    if (!message.content.startsWith(prefix)) return;
    
    // Parse command and arguments
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();
    
    if (!commandName) return;
    
    // Get all available commands
    const commands = await storage.getBotCommands();
    const command = commands.find(cmd => cmd.name.toLowerCase() === commandName);
    
    // If command exists and is enabled
    if (command && command.isEnabled) {
      commandsUsed++;
      
      // Handle different command categories
      try {
        switch (command.category) {
          case "General":
            await handleGeneralCommand(command.name, args, message, storage);
            break;
          // Other categories are handled in their respective modules
          default:
            // Send a message if command exists but handler isn't implemented
            if (!["Economy", "Levels", "Music", "Games", "Moderation"].includes(command.category)) {
              message.reply(`Command \`${command.name}\` is recognized but hasn't been implemented yet.`);
            }
            break;
        }
      } catch (error) {
        console.error(`Error executing command ${command.name}:`, error);
        message.reply("There was an error trying to execute that command!");
      }
    }
  });
  
  return commandsUsed;
}

async function handleGeneralCommand(commandName: string, args: string[], message: Message, storage: IStorage) {
  switch (commandName) {
    case "help":
      await handleHelpCommand(args, message, storage);
      break;
    case "ping":
      await handlePingCommand(message);
      break;
    case "info":
      await handleInfoCommand(message);
      break;
    default:
      message.reply(`Unknown general command: ${commandName}`);
      break;
  }
}

async function handleHelpCommand(args: string[], message: Message, storage: IStorage) {
  const helpSettings = await storage.getHelpCommandSettings();
  const commands = await storage.getBotCommands();
  const enabledCommands = commands.filter(cmd => cmd.isEnabled);
  
  // Group commands by category
  const commandsByCategory: Record<string, {name: string, description: string}[]> = {};
  
  enabledCommands.forEach(cmd => {
    if (!commandsByCategory[cmd.category]) {
      commandsByCategory[cmd.category] = [];
    }
    commandsByCategory[cmd.category].push({
      name: cmd.name,
      description: cmd.description
    });
  });
  
  // Specific category help if provided
  if (args.length > 0) {
    const category = args[0].charAt(0).toUpperCase() + args[0].slice(1).toLowerCase(); // Capitalize first letter
    if (commandsByCategory[category]) {
      return message.reply({
        embeds: [{
          title: `${category} Commands`,
          description: `Here are the available ${category.toLowerCase()} commands:`,
          color: parseInt(helpSettings?.embedColor?.replace('#', '') || '5865F2', 16),
          fields: commandsByCategory[category].map(cmd => ({
            name: `!${cmd.name}`,
            value: cmd.description
          })),
          footer: { text: helpSettings?.footerText || "Powered by jahceere's Discord Bot" }
        }]
      });
    } else {
      return message.reply(`No commands found for category "${category}".`);
    }
  }
  
  // General help command (list all categories)
  if (helpSettings?.appearance === "embed") {
    // Rich embed format
    const embed = {
      title: "Help Menu",
      color: parseInt(helpSettings.embedColor.replace('#', ''), 16),
      description: "Here are the available command categories:",
      fields: Object.entries(commandsByCategory).map(([category, cmds]) => ({
        name: getCategoryEmoji(category) + " " + category,
        value: cmds.map(cmd => `!${cmd.name}`).join(", ")
      })),
      footer: { text: helpSettings.footerText }
    };
    
    message.reply({ embeds: [embed] });
  } else if (helpSettings?.appearance === "text") {
    // Simple text format
    let helpText = "**Help Menu**\n\n";
    
    Object.entries(commandsByCategory).forEach(([category, cmds]) => {
      helpText += `**${getCategoryEmoji(category)} ${category}**\n`;
      helpText += cmds.map(cmd => `\`!${cmd.name}\``).join(", ") + "\n\n";
    });
    
    helpText += helpSettings.footerText;
    
    message.reply(helpText);
  } else {
    // Default to embed if settings are incorrect
    message.reply({
      embeds: [{
        title: "Help Menu",
        description: "Here are the available command categories:",
        color: 0x5865F2,
        fields: Object.entries(commandsByCategory).map(([category, cmds]) => ({
          name: getCategoryEmoji(category) + " " + category,
          value: cmds.map(cmd => `!${cmd.name}`).join(", ")
        })),
        footer: { text: "Powered by jahceere's Discord Bot" }
      }]
    });
  }
}

function getCategoryEmoji(category: string): string {
  switch (category) {
    case "General": return "🔷";
    case "Economy": return "💰";
    case "Levels": return "⭐";
    case "Music": return "🎵";
    case "Games": return "🎮";
    case "Moderation": return "🛡️";
    default: return "📌";
  }
}

async function handlePingCommand(message: Message) {
  const sent = await message.reply("Pinging...");
  sent.edit(`Pong! Latency is ${sent.createdTimestamp - message.createdTimestamp}ms`);
}

async function handleInfoCommand(message: Message) {
  message.reply({
    embeds: [{
      title: "Bot Information",
      description: "Bot created by jahceere on Discord.",
      color: 0x5865F2,
      fields: [
        { name: "Version", value: "1.0.0", inline: true },
        { name: "Library", value: "Discord.js", inline: true },
        { name: "Creator", value: "jahceere", inline: true },
        { name: "Server Count", value: message.client.guilds.cache.size.toString(), inline: true },
        { name: "Commands", value: "Use !help to see all commands", inline: false }
      ],
      thumbnail: { url: message.client.user?.displayAvatarURL() },
      timestamp: new Date().toISOString()
    }]
  });
}
