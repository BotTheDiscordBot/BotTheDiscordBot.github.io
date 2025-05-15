import { Client, Events, Message, EmbedBuilder } from "discord.js";
import { IStorage } from "../storage";

// In-memory maps to store user level data
// In a real implementation, this would be stored in a database
interface UserLevel {
  userId: string;
  username: string;
  xp: number;
  level: number;
  lastXpEarned: Date | null;
}

const userLevelData = new Map<string, UserLevel>();
const xpCooldowns = new Map<string, Date>();

export async function setupLevels(client: Client, storage: IStorage) {
  // Get bot configuration for prefix
  const botConfig = await storage.getBotConfig();
  const prefix = botConfig?.prefix || "!!";
  
  // Get level settings
  const levelSettings = await storage.getLevelSettings();
  
  // Set up event listener for commands
  client.on(Events.MessageCreate, async (message: Message) => {
    if (message.author.bot) return;
    
    // Handle XP for every message
    await handleMessageXp(message, storage);
    
    // Handle level commands
    if (message.content.startsWith(prefix)) {
      const args = message.content.slice(prefix.length).trim().split(/ +/);
      const commandName = args.shift()?.toLowerCase();
      
      if (!commandName) return;
      
      // Level system commands
      if (commandName === "level" || commandName === "rank") {
        await handleLevelCommand(message, args, storage);
      } else if (commandName === "leaderboard") {
        await handleLeaderboardCommand(message, storage);
      } else if (commandName === "rewards") {
        await handleRewardsCommand(message, storage);
      }
    }
  });
}

async function handleMessageXp(message: Message, storage: IStorage) {
  // Get level settings
  const levelSettings = await storage.getLevelSettings();
  const now = new Date();
  
  // Check cooldown
  const lastXp = xpCooldowns.get(message.author.id);
  if (lastXp) {
    const cooldownTime = (levelSettings?.xpCooldown || 60) * 1000; // Convert to milliseconds
    const timeElapsed = now.getTime() - lastXp.getTime();
    if (timeElapsed < cooldownTime) {
      return; // Still on cooldown
    }
  }
  
  // Get or initialize user level data
  let userData = getUserLevelData(message.author.id, message.author.username);
  
  // Add XP
  const xpGained = levelSettings?.xpPerMessage || 15;
  userData.xp += xpGained;
  userData.lastXpEarned = now;
  xpCooldowns.set(message.author.id, now);
  
  // Check for level up
  const oldLevel = userData.level;
  userData.level = calculateLevel(userData.xp, levelSettings?.levelMultiplier || 15);
  
  // Save updated user data
  userLevelData.set(message.author.id, userData);
  
  // Handle level up notification if user leveled up
  if (userData.level > oldLevel) {
    await handleLevelUp(message, userData, storage);
  }
}

async function handleLevelUp(message: Message, userData: UserLevel, storage: IStorage) {
  const levelSettings = await storage.getLevelSettings();
  const notificationType = levelSettings?.notificationType || "channel";
  
  // Create level up message
  const levelUpEmbed = new EmbedBuilder()
    .setTitle("Level Up!")
    .setDescription(`${message.author}, you've leveled up to **Level ${userData.level}**!`)
    .setColor(0x9B59B6)
    .setTimestamp();
  
  // Send notification based on setting
  if (notificationType === "dm") {
    message.author.send({ embeds: [levelUpEmbed] }).catch(() => {
      // Fall back to channel if DM fails
      message.channel.send({ embeds: [levelUpEmbed] });
    });
  } else if (notificationType === "channel") {
    message.channel.send({ embeds: [levelUpEmbed] });
  } else if (notificationType === "both") {
    message.channel.send({ embeds: [levelUpEmbed] });
    message.author.send({ embeds: [levelUpEmbed] }).catch(() => {
      // Ignore if DM fails
    });
  }
  
  // Check for role rewards if enabled
  if (levelSettings?.enableRoleRewards) {
    await checkLevelRewards(message, userData, storage);
  }
}

async function checkLevelRewards(message: Message, userData: UserLevel, storage: IStorage) {
  // Only works in guild channels
  if (!message.guild) return;
  
  // Get level rewards
  const levelRewards = await storage.getLevelRewards();
  const rewards = levelRewards.filter(reward => reward.level <= userData.level);
  
  // Apply role rewards if not already applied
  const member = message.guild.members.cache.get(message.author.id);
  if (!member) return;
  
  for (const reward of rewards) {
    const role = message.guild.roles.cache.find(r => r.name === reward.roleName);
    if (role && !member.roles.cache.has(role.id)) {
      try {
        await member.roles.add(role);
        message.channel.send(`Congratulations ${message.author}! You've earned the **${reward.roleName}** role for reaching Level ${reward.level}!`);
      } catch (error) {
        console.error(`Error adding role ${reward.roleName} to user ${message.author.tag}:`, error);
      }
    }
  }
}

async function handleLevelCommand(message: Message, args: string[], storage: IStorage) {
  const targetUser = message.mentions.users.first() || message.author;
  
  // Get user level data
  let userData = getUserLevelData(targetUser.id, targetUser.username);
  
  // Calculate XP for next level
  const levelSettings = await storage.getLevelSettings();
  const multiplier = levelSettings?.levelMultiplier || 15;
  const currentLevelXp = calculateXpForLevel(userData.level, multiplier);
  const nextLevelXp = calculateXpForLevel(userData.level + 1, multiplier);
  const xpNeeded = nextLevelXp - currentLevelXp;
  const xpProgress = userData.xp - currentLevelXp;
  const progressPercentage = Math.floor((xpProgress / xpNeeded) * 100);
  
  // Create level card
  const levelEmbed = new EmbedBuilder()
    .setTitle(`${targetUser.username}'s Level`)
    .setThumbnail(targetUser.displayAvatarURL())
    .setColor(0x9B59B6)
    .addFields(
      { name: "Level", value: userData.level.toString(), inline: true },
      { name: "XP", value: `${userData.xp.toLocaleString()} XP`, inline: true },
      { name: "Next Level", value: `${xpNeeded - xpProgress} XP needed`, inline: true },
      { name: "Progress", value: `${progressPercentage}%`, inline: true }
    )
    .setFooter({ text: "Level System" })
    .setTimestamp();
  
  message.reply({ embeds: [levelEmbed] });
}

async function handleLeaderboardCommand(message: Message, storage: IStorage) {
  // Get top 10 users by XP
  const sortedUsers = [...userLevelData.values()]
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 10);
  
  if (sortedUsers.length === 0) {
    return message.reply("No users have earned XP yet!");
  }
  
  // Create leaderboard embed
  const leaderboardEmbed = new EmbedBuilder()
    .setTitle("XP Leaderboard")
    .setColor(0x9B59B6)
    .setDescription(
      sortedUsers.map((user, index) => 
        `**${index + 1}.** ${user.username} - Level ${user.level} (${user.xp.toLocaleString()} XP)`
      ).join("\n")
    )
    .setFooter({ text: "Level System" })
    .setTimestamp();
  
  message.reply({ embeds: [leaderboardEmbed] });
}

async function handleRewardsCommand(message: Message, storage: IStorage) {
  const levelSettings = await storage.getLevelSettings();
  
  if (!levelSettings?.enableRoleRewards) {
    return message.reply("Level rewards are currently disabled.");
  }
  
  // Get level rewards
  const levelRewards = await storage.getLevelRewards();
  
  if (levelRewards.length === 0) {
    return message.reply("No level rewards have been set up yet.");
  }
  
  // Sort rewards by level
  const sortedRewards = [...levelRewards].sort((a, b) => a.level - b.level);
  
  // Create rewards embed
  const rewardsEmbed = new EmbedBuilder()
    .setTitle("Level Rewards")
    .setColor(0x9B59B6)
    .setDescription(
      sortedRewards.map(reward => 
        `**Level ${reward.level}** - ${reward.roleName}`
      ).join("\n")
    )
    .setFooter({ text: "Level System" })
    .setTimestamp();
  
  message.reply({ embeds: [rewardsEmbed] });
}

// Helper function to get or initialize user level data
function getUserLevelData(userId: string, username: string): UserLevel {
  if (!userLevelData.has(userId)) {
    userLevelData.set(userId, {
      userId,
      username,
      xp: 0,
      level: 0,
      lastXpEarned: null
    });
  }
  
  return userLevelData.get(userId)!;
}

// Helper function to calculate level based on XP
function calculateLevel(xp: number, multiplier: number): number {
  return Math.floor(Math.sqrt(xp / multiplier));
}

// Helper function to calculate XP needed for a level
function calculateXpForLevel(level: number, multiplier: number): number {
  return level * level * multiplier;
}
