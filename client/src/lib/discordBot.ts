import { apiRequest } from "./queryClient";

export interface BotStatus {
  isConnected: boolean;
  isActive: boolean;
  serverCount: number;
  uptime: number;
  activityStatus?: string;
}

export interface BotConfig {
  id: number;
  token: string;
  prefix: string;
  statusType: string;
  statusText: string;
  adminRole: string;
  isActive: boolean;
}

export interface FeatureSettings {
  id: number;
  economyEnabled: boolean;
  levelSystemEnabled: boolean;
  musicPlayerEnabled: boolean;
  miniGamesEnabled: boolean;
  moderationEnabled: boolean;
}

// Bot control functions
export async function startBot(): Promise<{ message: string; botId: string }> {
  const response = await apiRequest('POST', '/api/bot/start', undefined);
  return response.json();
}

export async function stopBot(): Promise<{ message: string }> {
  const response = await apiRequest('POST', '/api/bot/stop', undefined);
  return response.json();
}

export async function restartBot(): Promise<{ message: string; botId: string }> {
  await stopBot();
  return startBot();
}

// Bot configuration functions
export async function updateBotConfig(config: Partial<BotConfig>): Promise<BotConfig> {
  const response = await apiRequest('POST', '/api/bot/config', config);
  return response.json();
}

export async function updateFeatureSettings(settings: Partial<FeatureSettings>): Promise<FeatureSettings> {
  const response = await apiRequest('POST', '/api/features', settings);
  return response.json();
}

// Format uptime in a human-readable format
export function formatUptime(ms: number): string {
  if (!ms) return "0s";
  
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

// Helper to convert base64 token to a more readable form
export function formatToken(token: string): string {
  if (!token) return "";
  
  // Show first 5 and last 5 characters, hide the rest
  if (token.length > 10) {
    return `${token.substring(0, 5)}...${token.substring(token.length - 5)}`;
  }
  
  return token;
}
