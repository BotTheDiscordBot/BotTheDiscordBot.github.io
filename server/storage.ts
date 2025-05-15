import {
  User, InsertUser, BotConfig, InsertBotConfig, FeatureSettings, InsertFeatureSettings,
  EconomySettings, InsertEconomySettings, ShopItem, InsertShopItem, 
  LevelSettings, InsertLevelSettings, LevelReward, InsertLevelReward,
  MusicSettings, InsertMusicSettings, AnimeGameSettings, InsertAnimeGameSettings,
  AnimeDatabase, InsertAnimeDatabase, BotCommand, InsertBotCommand,
  HelpCommandSettings, InsertHelpCommandSettings, DiscordServer, InsertDiscordServer,
  AnalyticsData, InsertAnalyticsData
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Bot configuration methods
  getBotConfig(): Promise<BotConfig | undefined>;
  createBotConfig(config: InsertBotConfig): Promise<BotConfig>;
  updateBotConfig(config: Partial<BotConfig>): Promise<BotConfig>;

  // Feature settings methods
  getFeatureSettings(): Promise<FeatureSettings | undefined>;
  createFeatureSettings(settings: InsertFeatureSettings): Promise<FeatureSettings>;
  updateFeatureSettings(settings: Partial<FeatureSettings>): Promise<FeatureSettings>;

  // Economy settings methods
  getEconomySettings(): Promise<EconomySettings | undefined>;
  createEconomySettings(settings: InsertEconomySettings): Promise<EconomySettings>;
  updateEconomySettings(settings: Partial<EconomySettings>): Promise<EconomySettings>;

  // Shop item methods
  getShopItems(): Promise<ShopItem[]>;
  getShopItem(id: number): Promise<ShopItem | undefined>;
  createShopItem(item: InsertShopItem): Promise<ShopItem>;
  updateShopItem(id: number, item: Partial<ShopItem>): Promise<ShopItem>;
  deleteShopItem(id: number): Promise<boolean>;

  // Level settings methods
  getLevelSettings(): Promise<LevelSettings | undefined>;
  createLevelSettings(settings: InsertLevelSettings): Promise<LevelSettings>;
  updateLevelSettings(settings: Partial<LevelSettings>): Promise<LevelSettings>;

  // Level reward methods
  getLevelRewards(): Promise<LevelReward[]>;
  getLevelReward(id: number): Promise<LevelReward | undefined>;
  createLevelReward(reward: InsertLevelReward): Promise<LevelReward>;
  updateLevelReward(id: number, reward: Partial<LevelReward>): Promise<LevelReward>;
  deleteLevelReward(id: number): Promise<boolean>;

  // Music settings methods
  getMusicSettings(): Promise<MusicSettings | undefined>;
  createMusicSettings(settings: InsertMusicSettings): Promise<MusicSettings>;
  updateMusicSettings(settings: Partial<MusicSettings>): Promise<MusicSettings>;

  // Anime game settings methods
  getAnimeGameSettings(): Promise<AnimeGameSettings | undefined>;
  createAnimeGameSettings(settings: InsertAnimeGameSettings): Promise<AnimeGameSettings>;
  updateAnimeGameSettings(settings: Partial<AnimeGameSettings>): Promise<AnimeGameSettings>;

  // Anime database methods
  getAnimeDatabase(): Promise<AnimeDatabase[]>;
  getAnimeEntry(id: number): Promise<AnimeDatabase | undefined>;
  createAnimeEntry(anime: InsertAnimeDatabase): Promise<AnimeDatabase>;
  updateAnimeEntry(id: number, anime: Partial<AnimeDatabase>): Promise<AnimeDatabase>;
  deleteAnimeEntry(id: number): Promise<boolean>;

  // Bot commands methods
  getBotCommands(): Promise<BotCommand[]>;
  getBotCommand(id: number): Promise<BotCommand | undefined>;
  createBotCommand(command: InsertBotCommand): Promise<BotCommand>;
  updateBotCommand(id: number, command: Partial<BotCommand>): Promise<BotCommand>;
  deleteBotCommand(id: number): Promise<boolean>;

  // Help command settings methods
  getHelpCommandSettings(): Promise<HelpCommandSettings | undefined>;
  createHelpCommandSettings(settings: InsertHelpCommandSettings): Promise<HelpCommandSettings>;
  updateHelpCommandSettings(settings: Partial<HelpCommandSettings>): Promise<HelpCommandSettings>;

  // Discord server methods
  getDiscordServers(): Promise<DiscordServer[]>;
  getDiscordServer(id: number): Promise<DiscordServer | undefined>;
  createDiscordServer(server: InsertDiscordServer): Promise<DiscordServer>;
  updateDiscordServer(id: number, server: Partial<DiscordServer>): Promise<DiscordServer>;
  deleteDiscordServer(id: number): Promise<boolean>;

  // Analytics data methods
  getAnalyticsData(): Promise<AnalyticsData[]>;
  createAnalyticsData(data: InsertAnalyticsData): Promise<AnalyticsData>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private botConfig: BotConfig | undefined;
  private featureSettings: FeatureSettings | undefined;
  private economySettings: EconomySettings | undefined;
  private shopItems: Map<number, ShopItem>;
  private levelSettings: LevelSettings | undefined;
  private levelRewards: Map<number, LevelReward>;
  private musicSettings: MusicSettings | undefined;
  private animeGameSettings: AnimeGameSettings | undefined;
  private animeDatabase: Map<number, AnimeDatabase>;
  private botCommands: Map<number, BotCommand>;
  private helpCommandSettings: HelpCommandSettings | undefined;
  private discordServers: Map<number, DiscordServer>;
  private analyticsData: AnalyticsData[];
  private currentId: { [key: string]: number };

  constructor() {
    this.users = new Map();
    this.shopItems = new Map();
    this.levelRewards = new Map();
    this.animeDatabase = new Map();
    this.botCommands = new Map();
    this.discordServers = new Map();
    this.analyticsData = [];
    this.currentId = {
      user: 1,
      shopItem: 1,
      levelReward: 1,
      animeDatabase: 1,
      botCommand: 1,
      discordServer: 1,
      analyticsData: 1
    };

    // Initialize with default bot commands
    this.initializeDefaultCommands();
  }

  private initializeDefaultCommands() {
    // General commands
    this.createBotCommand({ name: 'help', description: 'Shows available commands', category: 'General', isEnabled: true });
    this.createBotCommand({ name: 'ping', description: 'Shows bot latency', category: 'General', isEnabled: true });
    
    // Economy commands
    this.createBotCommand({ name: 'balance', description: 'Check your coin balance', category: 'Economy', isEnabled: true });
    this.createBotCommand({ name: 'daily', description: 'Claim daily coin reward', category: 'Economy', isEnabled: true });
    this.createBotCommand({ name: 'shop', description: 'View available items', category: 'Economy', isEnabled: true });
    this.createBotCommand({ name: 'buy', description: 'Purchase an item', category: 'Economy', isEnabled: true });
    
    // Level commands
    this.createBotCommand({ name: 'level', description: 'Check your current level and XP', category: 'Levels', isEnabled: true });
    this.createBotCommand({ name: 'rank', description: 'Check a user\'s level card', category: 'Levels', isEnabled: true });
    this.createBotCommand({ name: 'leaderboard', description: 'Show the server\'s top members', category: 'Levels', isEnabled: true });
    
    // Music commands
    this.createBotCommand({ name: 'play', description: 'Play music from URL or search', category: 'Music', isEnabled: true });
    this.createBotCommand({ name: 'pause', description: 'Pause the current track', category: 'Music', isEnabled: true });
    this.createBotCommand({ name: 'resume', description: 'Resume a paused track', category: 'Music', isEnabled: true });
    this.createBotCommand({ name: 'skip', description: 'Skip to the next song', category: 'Music', isEnabled: true });
    this.createBotCommand({ name: 'queue', description: 'Show current music queue', category: 'Music', isEnabled: true });
    
    // Game commands
    this.createBotCommand({ name: 'anime', description: 'Start a guess that anime game', category: 'Games', isEnabled: true });
    
    // Moderation commands
    this.createBotCommand({ name: 'kick', description: 'Kick a user from the server', category: 'Moderation', isEnabled: false });
    this.createBotCommand({ name: 'ban', description: 'Ban a user from the server', category: 'Moderation', isEnabled: false });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.user++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Bot configuration methods
  async getBotConfig(): Promise<BotConfig | undefined> {
    if (!this.botConfig) {
      // Create a default bot config if none exists
      return this.createBotConfig({
        token: "MTM3MjQyMjI2OTYwMjc2Mjg0Mw.GYuo-c.lS8H-J0B0hXqUzJ7HE0U5vK8Br8dbHI1YKtO4I", // Default to the token from the user request
        prefix: "!!",
        statusType: "Playing",
        statusText: "!!help for commands",
        adminRole: "Administrator",
        isActive: false
      });
    }
    return this.botConfig;
  }

  async createBotConfig(config: InsertBotConfig): Promise<BotConfig> {
    this.botConfig = { 
      ...config, 
      id: 1,
      prefix: config.prefix || "!!",
      statusType: config.statusType || "Playing",
      statusText: config.statusText || "!!help for commands",
      activityType: config.activityType || "PLAYING",
      activityText: config.activityText || "JAH MADE IT",
      adminRole: config.adminRole || "Administrator",
      isActive: config.isActive !== undefined ? config.isActive : false
    };
    return this.botConfig;
  }

  async updateBotConfig(config: Partial<BotConfig>): Promise<BotConfig> {
    if (!this.botConfig) {
      throw new Error("Bot config not found");
    }
    this.botConfig = { ...this.botConfig, ...config };
    return this.botConfig;
  }

  // Feature settings methods
  async getFeatureSettings(): Promise<FeatureSettings | undefined> {
    if (!this.featureSettings) {
      // Create default feature settings if none exists
      return this.createFeatureSettings({
        economyEnabled: true,
        levelSystemEnabled: true,
        musicPlayerEnabled: true,
        miniGamesEnabled: true,
        moderationEnabled: false
      });
    }
    return this.featureSettings;
  }

  async createFeatureSettings(settings: InsertFeatureSettings): Promise<FeatureSettings> {
    this.featureSettings = { ...settings, id: 1 };
    return this.featureSettings;
  }

  async updateFeatureSettings(settings: Partial<FeatureSettings>): Promise<FeatureSettings> {
    if (!this.featureSettings) {
      throw new Error("Feature settings not found");
    }
    this.featureSettings = { ...this.featureSettings, ...settings };
    return this.featureSettings;
  }

  // Economy settings methods
  async getEconomySettings(): Promise<EconomySettings | undefined> {
    if (!this.economySettings) {
      // Create default economy settings if none exists
      return this.createEconomySettings({
        currencyName: "Coins",
        currencySymbol: "🪙",
        startingBalance: 100,
        dailyBonus: 50,
        balanceCommandEnabled: true,
        dailyCommandEnabled: true,
        transferCommandEnabled: true,
        leaderboardCommandEnabled: true
      });
    }
    return this.economySettings;
  }

  async createEconomySettings(settings: InsertEconomySettings): Promise<EconomySettings> {
    this.economySettings = { ...settings, id: 1 };
    return this.economySettings;
  }

  async updateEconomySettings(settings: Partial<EconomySettings>): Promise<EconomySettings> {
    if (!this.economySettings) {
      throw new Error("Economy settings not found");
    }
    this.economySettings = { ...this.economySettings, ...settings };
    return this.economySettings;
  }

  // Shop item methods
  async getShopItems(): Promise<ShopItem[]> {
    // If no shop items, create some defaults
    if (this.shopItems.size === 0) {
      await this.createShopItem({ name: "VIP Role", price: 1000, type: "Role" });
      await this.createShopItem({ name: "Custom Color", price: 500, type: "Role" });
      await this.createShopItem({ name: "XP Boost (1 day)", price: 300, type: "Temporary" });
    }
    return Array.from(this.shopItems.values());
  }

  async getShopItem(id: number): Promise<ShopItem | undefined> {
    return this.shopItems.get(id);
  }

  async createShopItem(item: InsertShopItem): Promise<ShopItem> {
    const id = this.currentId.shopItem++;
    const shopItem: ShopItem = { ...item, id };
    this.shopItems.set(id, shopItem);
    return shopItem;
  }

  async updateShopItem(id: number, item: Partial<ShopItem>): Promise<ShopItem> {
    const existingItem = this.shopItems.get(id);
    if (!existingItem) {
      throw new Error(`Shop item with id ${id} not found`);
    }
    const updatedItem = { ...existingItem, ...item };
    this.shopItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteShopItem(id: number): Promise<boolean> {
    return this.shopItems.delete(id);
  }

  // Level settings methods
  async getLevelSettings(): Promise<LevelSettings | undefined> {
    if (!this.levelSettings) {
      // Create default level settings if none exists
      return this.createLevelSettings({
        xpPerMessage: 15,
        xpCooldown: 60,
        levelMultiplier: 15,
        notificationType: "channel",
        enableRoleRewards: true
      });
    }
    return this.levelSettings;
  }

  async createLevelSettings(settings: InsertLevelSettings): Promise<LevelSettings> {
    this.levelSettings = { ...settings, id: 1 };
    return this.levelSettings;
  }

  async updateLevelSettings(settings: Partial<LevelSettings>): Promise<LevelSettings> {
    if (!this.levelSettings) {
      throw new Error("Level settings not found");
    }
    this.levelSettings = { ...this.levelSettings, ...settings };
    return this.levelSettings;
  }

  // Level reward methods
  async getLevelRewards(): Promise<LevelReward[]> {
    // If no level rewards, create some defaults
    if (this.levelRewards.size === 0) {
      await this.createLevelReward({ level: 5, roleName: "Beginner Role" });
      await this.createLevelReward({ level: 10, roleName: "Regular Role" });
      await this.createLevelReward({ level: 25, roleName: "Expert Role" });
      await this.createLevelReward({ level: 50, roleName: "Master Role" });
    }
    return Array.from(this.levelRewards.values());
  }

  async getLevelReward(id: number): Promise<LevelReward | undefined> {
    return this.levelRewards.get(id);
  }

  async createLevelReward(reward: InsertLevelReward): Promise<LevelReward> {
    const id = this.currentId.levelReward++;
    const levelReward: LevelReward = { ...reward, id };
    this.levelRewards.set(id, levelReward);
    return levelReward;
  }

  async updateLevelReward(id: number, reward: Partial<LevelReward>): Promise<LevelReward> {
    const existingReward = this.levelRewards.get(id);
    if (!existingReward) {
      throw new Error(`Level reward with id ${id} not found`);
    }
    const updatedReward = { ...existingReward, ...reward };
    this.levelRewards.set(id, updatedReward);
    return updatedReward;
  }

  async deleteLevelReward(id: number): Promise<boolean> {
    return this.levelRewards.delete(id);
  }

  // Music settings methods
  async getMusicSettings(): Promise<MusicSettings | undefined> {
    if (!this.musicSettings) {
      // Create default music settings if none exists
      return this.createMusicSettings({
        defaultVolume: 70,
        maxQueueSize: 100,
        disconnectTimeout: 5,
        youtubeEnabled: true,
        spotifyEnabled: true,
        soundcloudEnabled: true,
        djRoleName: "DJ",
        restrictVolumeCommand: true,
        restrictSkipCommand: false,
        restrictClearCommand: true
      });
    }
    return this.musicSettings;
  }

  async createMusicSettings(settings: InsertMusicSettings): Promise<MusicSettings> {
    this.musicSettings = { ...settings, id: 1 };
    return this.musicSettings;
  }

  async updateMusicSettings(settings: Partial<MusicSettings>): Promise<MusicSettings> {
    if (!this.musicSettings) {
      throw new Error("Music settings not found");
    }
    this.musicSettings = { ...this.musicSettings, ...settings };
    return this.musicSettings;
  }

  // Anime game settings methods
  async getAnimeGameSettings(): Promise<AnimeGameSettings | undefined> {
    if (!this.animeGameSettings) {
      // Create default anime game settings if none exists
      return this.createAnimeGameSettings({
        difficulty: "Medium",
        timeLimit: 60,
        reward: 50,
        cooldown: 30,
        channels: ["main-chat", "gaming"]
      });
    }
    return this.animeGameSettings;
  }

  async createAnimeGameSettings(settings: InsertAnimeGameSettings): Promise<AnimeGameSettings> {
    this.animeGameSettings = { ...settings, id: 1 };
    return this.animeGameSettings;
  }

  async updateAnimeGameSettings(settings: Partial<AnimeGameSettings>): Promise<AnimeGameSettings> {
    if (!this.animeGameSettings) {
      throw new Error("Anime game settings not found");
    }
    this.animeGameSettings = { ...this.animeGameSettings, ...settings };
    return this.animeGameSettings;
  }

  // Anime database methods
  async getAnimeDatabase(): Promise<AnimeDatabase[]> {
    // If no anime entries, create some defaults
    if (this.animeDatabase.size === 0) {
      await this.createAnimeEntry({ title: "Naruto", difficulty: "Easy", imageCount: 12 });
      await this.createAnimeEntry({ title: "One Piece", difficulty: "Easy", imageCount: 15 });
      await this.createAnimeEntry({ title: "Attack on Titan", difficulty: "Medium", imageCount: 8 });
      await this.createAnimeEntry({ title: "Demon Slayer", difficulty: "Medium", imageCount: 10 });
    }
    return Array.from(this.animeDatabase.values());
  }

  async getAnimeEntry(id: number): Promise<AnimeDatabase | undefined> {
    return this.animeDatabase.get(id);
  }

  async createAnimeEntry(anime: InsertAnimeDatabase): Promise<AnimeDatabase> {
    const id = this.currentId.animeDatabase++;
    const animeEntry: AnimeDatabase = { ...anime, id };
    this.animeDatabase.set(id, animeEntry);
    return animeEntry;
  }

  async updateAnimeEntry(id: number, anime: Partial<AnimeDatabase>): Promise<AnimeDatabase> {
    const existingEntry = this.animeDatabase.get(id);
    if (!existingEntry) {
      throw new Error(`Anime entry with id ${id} not found`);
    }
    const updatedEntry = { ...existingEntry, ...anime };
    this.animeDatabase.set(id, updatedEntry);
    return updatedEntry;
  }

  async deleteAnimeEntry(id: number): Promise<boolean> {
    return this.animeDatabase.delete(id);
  }

  // Bot commands methods
  async getBotCommands(): Promise<BotCommand[]> {
    return Array.from(this.botCommands.values());
  }

  async getBotCommand(id: number): Promise<BotCommand | undefined> {
    return this.botCommands.get(id);
  }

  async createBotCommand(command: InsertBotCommand): Promise<BotCommand> {
    const id = this.currentId.botCommand++;
    const botCommand: BotCommand = { ...command, id };
    this.botCommands.set(id, botCommand);
    return botCommand;
  }

  async updateBotCommand(id: number, command: Partial<BotCommand>): Promise<BotCommand> {
    const existingCommand = this.botCommands.get(id);
    if (!existingCommand) {
      throw new Error(`Bot command with id ${id} not found`);
    }
    const updatedCommand = { ...existingCommand, ...command };
    this.botCommands.set(id, updatedCommand);
    return updatedCommand;
  }

  async deleteBotCommand(id: number): Promise<boolean> {
    return this.botCommands.delete(id);
  }

  // Help command settings methods
  async getHelpCommandSettings(): Promise<HelpCommandSettings | undefined> {
    if (!this.helpCommandSettings) {
      // Create default help command settings if none exists
      return this.createHelpCommandSettings({
        appearance: "embed",
        organization: "category",
        embedColor: "#5865F2",
        footerText: "Powered by jahceere's Discord Bot"
      });
    }
    return this.helpCommandSettings;
  }

  async createHelpCommandSettings(settings: InsertHelpCommandSettings): Promise<HelpCommandSettings> {
    this.helpCommandSettings = { ...settings, id: 1 };
    return this.helpCommandSettings;
  }

  async updateHelpCommandSettings(settings: Partial<HelpCommandSettings>): Promise<HelpCommandSettings> {
    if (!this.helpCommandSettings) {
      throw new Error("Help command settings not found");
    }
    this.helpCommandSettings = { ...this.helpCommandSettings, ...settings };
    return this.helpCommandSettings;
  }

  // Discord server methods
  async getDiscordServers(): Promise<DiscordServer[]> {
    // If no servers, create a default one
    if (this.discordServers.size === 0) {
      await this.createDiscordServer({
        serverId: "123456789012345678",
        serverName: "Sample Server",
        memberCount: 5732,
        joinedAt: new Date()
      });
    }
    return Array.from(this.discordServers.values());
  }

  async getDiscordServer(id: number): Promise<DiscordServer | undefined> {
    return this.discordServers.get(id);
  }

  async createDiscordServer(server: InsertDiscordServer): Promise<DiscordServer> {
    const id = this.currentId.discordServer++;
    const discordServer: DiscordServer = { ...server, id };
    this.discordServers.set(id, discordServer);
    return discordServer;
  }

  async updateDiscordServer(id: number, server: Partial<DiscordServer>): Promise<DiscordServer> {
    const existingServer = this.discordServers.get(id);
    if (!existingServer) {
      throw new Error(`Discord server with id ${id} not found`);
    }
    const updatedServer = { ...existingServer, ...server };
    this.discordServers.set(id, updatedServer);
    return updatedServer;
  }

  async deleteDiscordServer(id: number): Promise<boolean> {
    return this.discordServers.delete(id);
  }

  // Analytics data methods
  async getAnalyticsData(): Promise<AnalyticsData[]> {
    // If no analytics data, create some sample data
    if (this.analyticsData.length === 0) {
      const now = new Date();
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(now.getDate() - i);
        await this.createAnalyticsData({
          timestamp: date,
          commandsUsed: Math.floor(Math.random() * 1000) + 500,
          activeUsers: Math.floor(Math.random() * 100) + 50,
          uptime: 99 + Math.floor(Math.random() * 2)
        });
      }
    }
    return this.analyticsData;
  }

  async createAnalyticsData(data: InsertAnalyticsData): Promise<AnalyticsData> {
    const id = this.currentId.analyticsData++;
    const analyticsData: AnalyticsData = { ...data, id };
    this.analyticsData.push(analyticsData);
    return analyticsData;
  }
}

export const storage = new MemStorage();
