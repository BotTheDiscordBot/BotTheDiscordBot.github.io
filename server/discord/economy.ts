import { Client, Events, Message } from "discord.js";
import { IStorage } from "../storage";

// In-memory maps to store user economy data
// In a real implementation, this would be stored in a database
interface UserEconomy {
  userId: string;
  username: string;
  balance: number;
  lastDaily: Date | null;
}

const userEconomyData = new Map<string, UserEconomy>();
const dailyCooldowns = new Map<string, Date>();

export async function setupEconomy(client: Client, storage: IStorage) {
  // Get bot configuration for prefix
  const botConfig = await storage.getBotConfig();
  const prefix = botConfig?.prefix || "!!";
  
  // Get economy settings
  const economySettings = await storage.getEconomySettings();
  
  // Set up event listener
  client.on(Events.MessageCreate, async (message: Message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();
    
    if (!commandName) return;
    
    // Economy commands
    if (commandName === "balance" && economySettings?.balanceCommandEnabled) {
      await handleBalanceCommand(message, args, storage);
    } else if (commandName === "daily" && economySettings?.dailyCommandEnabled) {
      await handleDailyCommand(message, storage);
    } else if (commandName === "transfer" && economySettings?.transferCommandEnabled) {
      await handleTransferCommand(message, args, storage);
    } else if (commandName === "shop") {
      await handleShopCommand(message, args, storage);
    } else if (commandName === "buy") {
      await handleBuyCommand(message, args, storage);
    } else if (commandName === "inventory") {
      await handleInventoryCommand(message, storage);
    }
  });
}

async function handleBalanceCommand(message: Message, args: string[], storage: IStorage) {
  const economySettings = await storage.getEconomySettings();
  const targetUser = message.mentions.users.first() || message.author;
  
  // Get or initialize user economy data
  let userData = getUserEconomyData(targetUser.id, targetUser.username);
  
  message.reply({
    embeds: [{
      title: `${targetUser.username}'s Balance`,
      description: `${userData.balance} ${economySettings?.currencySymbol || '🪙'}`,
      color: 0xF1C40F,
      footer: { text: "Economy System" }
    }]
  });
}

async function handleDailyCommand(message: Message, storage: IStorage) {
  const economySettings = await storage.getEconomySettings();
  const now = new Date();
  
  // Get user data
  let userData = getUserEconomyData(message.author.id, message.author.username);
  
  // Check if user has claimed daily reward already
  const lastDaily = dailyCooldowns.get(message.author.id);
  if (lastDaily) {
    const timeLeft = 86400000 - (now.getTime() - lastDaily.getTime());
    if (timeLeft > 0) {
      const hoursLeft = Math.floor(timeLeft / 3600000);
      const minutesLeft = Math.floor((timeLeft % 3600000) / 60000);
      return message.reply(`You've already claimed your daily reward! Come back in ${hoursLeft}h ${minutesLeft}m.`);
    }
  }
  
  // Give daily bonus
  userData.balance += economySettings?.dailyBonus || 50;
  userData.lastDaily = now;
  dailyCooldowns.set(message.author.id, now);
  
  // Save updated user data
  userEconomyData.set(message.author.id, userData);
  
  message.reply({
    embeds: [{
      title: "Daily Reward Claimed!",
      description: `You received ${economySettings?.dailyBonus || 50} ${economySettings?.currencySymbol || '🪙'}`,
      color: 0x2ECC71,
      footer: { text: "Come back tomorrow for another reward!" }
    }]
  });
}

async function handleTransferCommand(message: Message, args: string[], storage: IStorage) {
  const economySettings = await storage.getEconomySettings();
  
  if (args.length < 2) {
    return message.reply("Please specify a user and an amount to transfer. Usage: `!transfer @user amount`");
  }
  
  const targetUser = message.mentions.users.first();
  if (!targetUser) {
    return message.reply("Please mention a user to transfer to.");
  }
  
  if (targetUser.id === message.author.id) {
    return message.reply("You can't transfer money to yourself!");
  }
  
  const amount = parseInt(args[1]);
  if (isNaN(amount) || amount <= 0) {
    return message.reply("Please specify a valid amount to transfer.");
  }
  
  // Get sender data
  let senderData = getUserEconomyData(message.author.id, message.author.username);
  
  // Check if sender has enough balance
  if (senderData.balance < amount) {
    return message.reply(`You don't have enough ${economySettings?.currencyName || 'coins'} to transfer that amount!`);
  }
  
  // Get recipient data
  let recipientData = getUserEconomyData(targetUser.id, targetUser.username);
  
  // Perform transfer
  senderData.balance -= amount;
  recipientData.balance += amount;
  
  // Save updated data
  userEconomyData.set(message.author.id, senderData);
  userEconomyData.set(targetUser.id, recipientData);
  
  message.reply({
    embeds: [{
      title: "Transfer Successful",
      description: `You transferred ${amount} ${economySettings?.currencySymbol || '🪙'} to ${targetUser.username}`,
      color: 0x3498DB,
      footer: { text: `Your new balance: ${senderData.balance} ${economySettings?.currencySymbol || '🪙'}` }
    }]
  });
}

async function handleShopCommand(message: Message, args: string[], storage: IStorage) {
  const economySettings = await storage.getEconomySettings();
  const shopItems = await storage.getShopItems();
  
  if (shopItems.length === 0) {
    return message.reply("The shop is currently empty.");
  }
  
  const embed = {
    title: "Item Shop",
    description: "Use `!buy [item]` to purchase an item.",
    color: 0x9B59B6,
    fields: shopItems.map(item => ({
      name: `${item.name} - ${item.price} ${economySettings?.currencySymbol || '🪙'}`,
      value: `Type: ${item.type}`
    })),
    footer: { text: "Shop System" }
  };
  
  message.reply({ embeds: [embed] });
}

async function handleBuyCommand(message: Message, args: string[], storage: IStorage) {
  if (args.length < 1) {
    return message.reply("Please specify an item to buy. Usage: `!buy [item name]`");
  }
  
  const economySettings = await storage.getEconomySettings();
  const shopItems = await storage.getShopItems();
  const itemName = args.join(" ");
  
  // Find item in shop
  const item = shopItems.find(i => i.name.toLowerCase() === itemName.toLowerCase());
  if (!item) {
    return message.reply(`Item "${itemName}" not found in the shop.`);
  }
  
  // Get user data
  let userData = getUserEconomyData(message.author.id, message.author.username);
  
  // Check if user has enough balance
  if (userData.balance < item.price) {
    return message.reply(`You don't have enough ${economySettings?.currencyName || 'coins'} to buy this item!`);
  }
  
  // Perform purchase
  userData.balance -= item.price;
  
  // Save updated data
  userEconomyData.set(message.author.id, userData);
  
  message.reply({
    embeds: [{
      title: "Purchase Successful",
      description: `You bought ${item.name} for ${item.price} ${economySettings?.currencySymbol || '🪙'}`,
      color: 0x2ECC71,
      footer: { text: `Your new balance: ${userData.balance} ${economySettings?.currencySymbol || '🪙'}` }
    }]
  });
}

async function handleInventoryCommand(message: Message, storage: IStorage) {
  message.reply("You don't have any items in your inventory yet.");
}

// Helper function to get or initialize user economy data
function getUserEconomyData(userId: string, username: string): UserEconomy {
  if (!userEconomyData.has(userId)) {
    userEconomyData.set(userId, {
      userId,
      username,
      balance: 100, // Default starting balance
      lastDaily: null
    });
  }
  
  return userEconomyData.get(userId)!;
}
