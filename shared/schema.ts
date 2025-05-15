import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Bot Configuration Table
export const botConfig = pgTable("bot_config", {
  id: serial("id").primaryKey(),
  token: text("token").notNull(),
  prefix: text("prefix").notNull().default("!!"),
  statusType: text("status_type").notNull().default("Playing"),
  statusText: text("status_text").notNull().default("!!help for commands"),
  activityType: text("activity_type").notNull().default("PLAYING"),
  activityText: text("activity_text").notNull().default("JAH MADE IT"),
  adminRole: text("admin_role").notNull().default("Administrator"),
  isActive: boolean("is_active").notNull().default(false),
});

export const insertBotConfigSchema = createInsertSchema(botConfig).omit({
  id: true,
});

// Feature Settings Table
export const featureSettings = pgTable("feature_settings", {
  id: serial("id").primaryKey(),
  economyEnabled: boolean("economy_enabled").notNull().default(true),
  levelSystemEnabled: boolean("level_system_enabled").notNull().default(true),
  musicPlayerEnabled: boolean("music_player_enabled").notNull().default(true),
  miniGamesEnabled: boolean("mini_games_enabled").notNull().default(true),
  moderationEnabled: boolean("moderation_enabled").notNull().default(false),
});

export const insertFeatureSettingsSchema = createInsertSchema(featureSettings).omit({
  id: true,
});

// Economy Settings Table
export const economySettings = pgTable("economy_settings", {
  id: serial("id").primaryKey(),
  currencyName: text("currency_name").notNull().default("Coins"),
  currencySymbol: text("currency_symbol").notNull().default("🪙"),
  startingBalance: integer("starting_balance").notNull().default(100),
  dailyBonus: integer("daily_bonus").notNull().default(50),
  balanceCommandEnabled: boolean("balance_command_enabled").notNull().default(true),
  dailyCommandEnabled: boolean("daily_command_enabled").notNull().default(true),
  transferCommandEnabled: boolean("transfer_command_enabled").notNull().default(true),
  leaderboardCommandEnabled: boolean("leaderboard_command_enabled").notNull().default(true),
});

export const insertEconomySettingsSchema = createInsertSchema(economySettings).omit({
  id: true,
});

// Shop Items Table
export const shopItems = pgTable("shop_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  type: text("type").notNull(),
});

export const insertShopItemSchema = createInsertSchema(shopItems).omit({
  id: true,
});

// Level System Settings Table
export const levelSettings = pgTable("level_settings", {
  id: serial("id").primaryKey(),
  xpPerMessage: integer("xp_per_message").notNull().default(15),
  xpCooldown: integer("xp_cooldown").notNull().default(60),
  levelMultiplier: integer("level_multiplier").notNull().default(15),
  notificationType: text("notification_type").notNull().default("channel"),
  enableRoleRewards: boolean("enable_role_rewards").notNull().default(true),
});

export const insertLevelSettingsSchema = createInsertSchema(levelSettings).omit({
  id: true,
});

// Level Rewards Table
export const levelRewards = pgTable("level_rewards", {
  id: serial("id").primaryKey(),
  level: integer("level").notNull(),
  roleName: text("role_name").notNull(),
});

export const insertLevelRewardSchema = createInsertSchema(levelRewards).omit({
  id: true,
});

// Music Settings Table
export const musicSettings = pgTable("music_settings", {
  id: serial("id").primaryKey(),
  defaultVolume: integer("default_volume").notNull().default(70),
  maxQueueSize: integer("max_queue_size").notNull().default(100),
  disconnectTimeout: integer("disconnect_timeout").notNull().default(5),
  youtubeEnabled: boolean("youtube_enabled").notNull().default(true),
  spotifyEnabled: boolean("spotify_enabled").notNull().default(true),
  soundcloudEnabled: boolean("soundcloud_enabled").notNull().default(true),
  djRoleName: text("dj_role_name").notNull().default("DJ"),
  restrictVolumeCommand: boolean("restrict_volume_command").notNull().default(true),
  restrictSkipCommand: boolean("restrict_skip_command").notNull().default(false),
  restrictClearCommand: boolean("restrict_clear_command").notNull().default(true),
});

export const insertMusicSettingsSchema = createInsertSchema(musicSettings).omit({
  id: true,
});

// Anime Game Settings Table
export const animeGameSettings = pgTable("anime_game_settings", {
  id: serial("id").primaryKey(),
  difficulty: text("difficulty").notNull().default("Medium"),
  timeLimit: integer("time_limit").notNull().default(60),
  reward: integer("reward").notNull().default(50),
  cooldown: integer("cooldown").notNull().default(30),
  channels: jsonb("channels").notNull().default(["main-chat", "gaming"]),
});

export const insertAnimeGameSettingsSchema = createInsertSchema(animeGameSettings).omit({
  id: true,
});

// Anime Database Table
export const animeDatabase = pgTable("anime_database", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  difficulty: text("difficulty").notNull(),
  imageCount: integer("image_count").notNull().default(0),
});

export const insertAnimeDatabaseSchema = createInsertSchema(animeDatabase).omit({
  id: true,
});

// Bot Commands Table
export const botCommands = pgTable("bot_commands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  isEnabled: boolean("is_enabled").notNull().default(true),
});

export const insertBotCommandSchema = createInsertSchema(botCommands).omit({
  id: true,
});

// Help Command Settings Table
export const helpCommandSettings = pgTable("help_command_settings", {
  id: serial("id").primaryKey(),
  appearance: text("appearance").notNull().default("embed"),
  organization: text("organization").notNull().default("category"),
  embedColor: text("embed_color").notNull().default("#5865F2"),
  footerText: text("footer_text").notNull().default("Powered by jahceere's Discord Bot"),
});

export const insertHelpCommandSettingsSchema = createInsertSchema(helpCommandSettings).omit({
  id: true,
});

// Discord Servers Table
export const discordServers = pgTable("discord_servers", {
  id: serial("id").primaryKey(),
  serverId: text("server_id").notNull(),
  serverName: text("server_name").notNull(),
  memberCount: integer("member_count").notNull(),
  joinedAt: timestamp("joined_at").notNull(),
});

export const insertDiscordServerSchema = createInsertSchema(discordServers).omit({
  id: true,
});

// Analytics Data Table
export const analyticsData = pgTable("analytics_data", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull(),
  commandsUsed: integer("commands_used").notNull(),
  activeUsers: integer("active_users").notNull(),
  uptime: integer("uptime").notNull(),
});

export const insertAnalyticsDataSchema = createInsertSchema(analyticsData).omit({
  id: true,
});

// Define export types for all tables
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type BotConfig = typeof botConfig.$inferSelect;
export type InsertBotConfig = z.infer<typeof insertBotConfigSchema>;

export type FeatureSettings = typeof featureSettings.$inferSelect;
export type InsertFeatureSettings = z.infer<typeof insertFeatureSettingsSchema>;

export type EconomySettings = typeof economySettings.$inferSelect;
export type InsertEconomySettings = z.infer<typeof insertEconomySettingsSchema>;

export type ShopItem = typeof shopItems.$inferSelect;
export type InsertShopItem = z.infer<typeof insertShopItemSchema>;

export type LevelSettings = typeof levelSettings.$inferSelect;
export type InsertLevelSettings = z.infer<typeof insertLevelSettingsSchema>;

export type LevelReward = typeof levelRewards.$inferSelect;
export type InsertLevelReward = z.infer<typeof insertLevelRewardSchema>;

export type MusicSettings = typeof musicSettings.$inferSelect;
export type InsertMusicSettings = z.infer<typeof insertMusicSettingsSchema>;

export type AnimeGameSettings = typeof animeGameSettings.$inferSelect;
export type InsertAnimeGameSettings = z.infer<typeof insertAnimeGameSettingsSchema>;

export type AnimeDatabase = typeof animeDatabase.$inferSelect;
export type InsertAnimeDatabase = z.infer<typeof insertAnimeDatabaseSchema>;

export type BotCommand = typeof botCommands.$inferSelect;
export type InsertBotCommand = z.infer<typeof insertBotCommandSchema>;

export type HelpCommandSettings = typeof helpCommandSettings.$inferSelect;
export type InsertHelpCommandSettings = z.infer<typeof insertHelpCommandSettingsSchema>;

export type DiscordServer = typeof discordServers.$inferSelect;
export type InsertDiscordServer = z.infer<typeof insertDiscordServerSchema>;

export type AnalyticsData = typeof analyticsData.$inferSelect;
export type InsertAnalyticsData = z.infer<typeof insertAnalyticsDataSchema>;
