import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BotConfig, FeatureSettings, updateBotConfig, updateFeatureSettings } from "@/lib/discordBot";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

export default function Configuration() {
  const [showToken, setShowToken] = useState(false);
  const queryClient = useQueryClient();

  // Fetch bot configuration
  const { data: botConfig, isLoading: isLoadingConfig } = useQuery<BotConfig>({
    queryKey: ['/api/bot/config'],
  });

  // Fetch feature settings
  const { data: featureSettings, isLoading: isLoadingFeatures } = useQuery<FeatureSettings>({
    queryKey: ['/api/features'],
  });

  // Form state
  const [configFormData, setConfigFormData] = useState<Partial<BotConfig>>({
    token: "",
    prefix: "!",
    statusType: "Playing",
    statusText: "!help for commands",
    adminRole: "Administrator"
  });

  // Update form state when data is loaded
  useState(() => {
    if (botConfig) {
      setConfigFormData({
        token: botConfig.token,
        prefix: botConfig.prefix,
        statusType: botConfig.statusType,
        statusText: botConfig.statusText,
        adminRole: botConfig.adminRole
      });
    }
  });

  // Update bot config mutation
  const updateConfigMutation = useMutation({
    mutationFn: updateBotConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bot/config'] });
      toast({
        title: "Configuration Updated",
        description: "Bot configuration has been saved successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update configuration: ${error}`,
        variant: "destructive",
      });
    }
  });

  // Update feature settings mutation
  const updateFeaturesMutation = useMutation({
    mutationFn: updateFeatureSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/features'] });
      toast({
        title: "Features Updated",
        description: "Feature settings have been saved successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update features: ${error}`,
        variant: "destructive",
      });
    }
  });

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfigFormData({
      ...configFormData,
      [name]: value
    });
  };

  const handleStatusTypeChange = (value: string) => {
    setConfigFormData({
      ...configFormData,
      statusType: value
    });
  };

  const handlePermissionChange = (value: string) => {
    setConfigFormData({
      ...configFormData,
      adminRole: value
    });
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfigMutation.mutate(configFormData);
  };

  const handleFeatureToggle = (feature: keyof FeatureSettings, value: boolean) => {
    if (!featureSettings) return;
    
    const updatedSettings = {
      ...featureSettings,
      [feature]: value
    };
    
    updateFeaturesMutation.mutate(updatedSettings);
  };

  const toggleTokenVisibility = () => {
    setShowToken(!showToken);
  };

  if (isLoadingConfig || isLoadingFeatures) {
    return (
      <section className="mb-12">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-white mb-2">Bot Configuration</h1>
          <p className="text-gray-400">Set up and configure your Discord bot</p>
        </header>
        <div className="bg-discord-dark rounded-lg shadow-lg p-6 animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-700 rounded w-full"></div>
            <div className="h-10 bg-gray-700 rounded w-full"></div>
            <div className="h-10 bg-gray-700 rounded w-full"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-white mb-2">Bot Configuration</h1>
        <p className="text-gray-400">Set up and configure your Discord bot</p>
      </header>

      <Card className="bg-discord-dark rounded-lg shadow-lg p-6 mb-8">
        <CardContent className="p-0">
          <h2 className="text-xl font-semibold text-white mb-6">Connection Settings</h2>
          
          <form onSubmit={handleSaveConfig}>
            <div className="mb-6">
              <Label htmlFor="token" className="block text-sm font-medium text-gray-300 mb-2">Bot Token</Label>
              <div className="flex">
                <Input
                  type={showToken ? "text" : "password"}
                  id="token"
                  name="token"
                  value={configFormData.token}
                  onChange={handleConfigChange}
                  className="flex-1 bg-gray-800 text-white rounded-l-md border-gray-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-discord-blurple"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={toggleTokenVisibility}
                  className="bg-gray-700 text-white px-4 rounded-r-md hover:bg-gray-600"
                >
                  {showToken ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
              <p className="mt-2 text-sm text-gray-400">Never share your token with anyone else.</p>
            </div>
            
            <div className="mb-6">
              <Label htmlFor="prefix" className="block text-sm font-medium text-gray-300 mb-2">Command Prefix</Label>
              <Input
                type="text"
                id="prefix"
                name="prefix"
                value={configFormData.prefix}
                onChange={handleConfigChange}
                className="w-full bg-gray-800 text-white rounded-md border-gray-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-discord-blurple"
              />
              <p className="mt-2 text-sm text-gray-400">Character that triggers bot commands (e.g., !help)</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="statusType" className="block text-sm font-medium text-gray-300 mb-2">Status Type</Label>
                <Select
                  value={configFormData.statusType}
                  onValueChange={handleStatusTypeChange}
                >
                  <SelectTrigger id="statusType" className="w-full bg-gray-800 text-white border-gray-700">
                    <SelectValue placeholder="Select status type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="Playing">Playing</SelectItem>
                    <SelectItem value="Watching">Watching</SelectItem>
                    <SelectItem value="Listening to">Listening to</SelectItem>
                    <SelectItem value="Competing in">Competing in</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="statusText" className="block text-sm font-medium text-gray-300 mb-2">Status Text</Label>
                <Input
                  type="text"
                  id="statusText"
                  name="statusText"
                  value={configFormData.statusText}
                  onChange={handleConfigChange}
                  className="w-full bg-gray-800 text-white rounded-md border-gray-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-discord-blurple"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="permissionLevel" className="text-sm font-medium text-gray-300">Admin Role Permission Level</Label>
                <Select
                  value={configFormData.adminRole}
                  onValueChange={handlePermissionChange}
                >
                  <SelectTrigger id="permissionLevel" className="w-40 bg-gray-800 text-white border-gray-700">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="Administrator">Administrator</SelectItem>
                    <SelectItem value="Moderator">Moderator</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <Button 
                type="submit" 
                disabled={updateConfigMutation.isPending} 
                className="bg-discord-blurple hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
              >
                {updateConfigMutation.isPending ? "Saving..." : "Save Configuration"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-discord-dark rounded-lg shadow-lg p-6">
        <CardContent className="p-0">
          <h2 className="text-xl font-semibold text-white mb-6">Feature Management</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-700">
              <div>
                <h3 className="text-white font-medium">Economy System</h3>
                <p className="text-sm text-gray-400">Virtual currency and shop features</p>
              </div>
              <Switch 
                checked={featureSettings?.economyEnabled} 
                onCheckedChange={(checked) => handleFeatureToggle('economyEnabled', checked)}
                className="data-[state=checked]:bg-discord-blurple"
              />
            </div>
            
            <div className="flex items-center justify-between pb-4 border-b border-gray-700">
              <div>
                <h3 className="text-white font-medium">Level System</h3>
                <p className="text-sm text-gray-400">User XP tracking and ranking</p>
              </div>
              <Switch 
                checked={featureSettings?.levelSystemEnabled} 
                onCheckedChange={(checked) => handleFeatureToggle('levelSystemEnabled', checked)}
                className="data-[state=checked]:bg-discord-blurple"
              />
            </div>
            
            <div className="flex items-center justify-between pb-4 border-b border-gray-700">
              <div>
                <h3 className="text-white font-medium">Music Player</h3>
                <p className="text-sm text-gray-400">Play music in voice channels</p>
              </div>
              <Switch 
                checked={featureSettings?.musicPlayerEnabled} 
                onCheckedChange={(checked) => handleFeatureToggle('musicPlayerEnabled', checked)}
                className="data-[state=checked]:bg-discord-blurple"
              />
            </div>
            
            <div className="flex items-center justify-between pb-4 border-b border-gray-700">
              <div>
                <h3 className="text-white font-medium">Mini-Games</h3>
                <p className="text-sm text-gray-400">Fun games like "Guess that Anime"</p>
              </div>
              <Switch 
                checked={featureSettings?.miniGamesEnabled} 
                onCheckedChange={(checked) => handleFeatureToggle('miniGamesEnabled', checked)}
                className="data-[state=checked]:bg-discord-blurple"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Moderation Tools</h3>
                <p className="text-sm text-gray-400">Ban, kick, and warning systems</p>
              </div>
              <Switch 
                checked={featureSettings?.moderationEnabled} 
                onCheckedChange={(checked) => handleFeatureToggle('moderationEnabled', checked)}
                className="data-[state=checked]:bg-discord-blurple"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
