import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { Plus, X } from "lucide-react";
import LevelCard from "@/components/levelCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

interface LevelSettings {
  id: number;
  xpPerMessage: number;
  xpCooldown: number;
  levelMultiplier: number;
  notificationType: string;
  enableRoleRewards: boolean;
}

interface LevelReward {
  id: number;
  level: number;
  roleName: string;
}

export default function Levels() {
  const queryClient = useQueryClient();
  const [isAddRewardDialogOpen, setIsAddRewardDialogOpen] = useState(false);
  const [rewardFormData, setRewardFormData] = useState<Partial<LevelReward>>({
    level: 0,
    roleName: ""
  });

  // Level settings state
  const [levelSettings, setLevelSettings] = useState<Partial<LevelSettings>>({
    xpPerMessage: 15,
    xpCooldown: 60,
    levelMultiplier: 15,
    notificationType: "channel",
    enableRoleRewards: true
  });

  // Fetch level settings
  const { data: fetchedSettings, isLoading: isLoadingSettings } = useQuery<LevelSettings>({
    queryKey: ['/api/levels/settings'],
    onSuccess: (data) => {
      setLevelSettings(data);
    }
  });

  // Fetch level rewards
  const { data: levelRewards, isLoading: isLoadingRewards } = useQuery<LevelReward[]>({
    queryKey: ['/api/levels/rewards'],
  });

  // Update level settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (data: Partial<LevelSettings>) => {
      const response = await apiRequest('POST', '/api/levels/settings', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/levels/settings'] });
      toast({
        title: "Settings Updated",
        description: "Level system settings have been saved successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update settings: ${error}`,
        variant: "destructive",
      });
    }
  });

  // Add level reward mutation
  const addRewardMutation = useMutation({
    mutationFn: async (data: Partial<LevelReward>) => {
      const response = await apiRequest('POST', '/api/levels/rewards', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/levels/rewards'] });
      setIsAddRewardDialogOpen(false);
      setRewardFormData({ level: 0, roleName: "" });
      toast({
        title: "Reward Added",
        description: "Level reward has been added successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add reward: ${error}`,
        variant: "destructive",
      });
    }
  });

  // Delete level reward mutation
  const deleteRewardMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/levels/rewards/${id}`, undefined);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/levels/rewards'] });
      toast({
        title: "Reward Deleted",
        description: "Level reward has been deleted successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete reward: ${error}`,
        variant: "destructive",
      });
    }
  });

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setLevelSettings({
      ...levelSettings,
      [name]: type === 'number' ? parseInt(value) : value
    });
  };

  const handleNotificationTypeChange = (value: string) => {
    setLevelSettings({
      ...levelSettings,
      notificationType: value
    });
  };

  const handleEnableRoleRewardsChange = (checked: boolean) => {
    setLevelSettings({
      ...levelSettings,
      enableRoleRewards: checked
    });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettingsMutation.mutate(levelSettings);
  };

  const handleRewardFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setRewardFormData({
      ...rewardFormData,
      [name]: type === 'number' ? parseInt(value) : value
    });
  };

  const handleAddReward = (e: React.FormEvent) => {
    e.preventDefault();
    addRewardMutation.mutate(rewardFormData);
  };

  const handleDeleteReward = (id: number) => {
    deleteRewardMutation.mutate(id);
  };

  // Calculate the color based on level
  const getLevelColor = (level: number): string => {
    if (level >= 50) return 'bg-yellow-600';
    if (level >= 25) return 'bg-purple-600';
    if (level >= 10) return 'bg-green-600';
    return 'bg-blue-600';
  };

  if (isLoadingSettings || isLoadingRewards) {
    return (
      <section className="mb-12">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-white mb-2">Level System</h1>
          <p className="text-gray-400">Configure level and XP progression</p>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-discord-dark rounded-lg shadow-lg p-6 animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-700 rounded w-full"></div>
              <div className="h-10 bg-gray-700 rounded w-full"></div>
              <div className="h-10 bg-gray-700 rounded w-full"></div>
            </div>
          </div>
          <div className="bg-discord-dark rounded-lg shadow-lg p-6 animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="h-32 bg-gray-700 rounded w-full"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-white mb-2">Level System</h1>
        <p className="text-gray-400">Configure level and XP progression</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-discord-dark rounded-lg shadow-lg p-6">
          <CardContent className="p-0">
            <h2 className="text-xl font-semibold text-white mb-6">Level Settings</h2>
            
            <form onSubmit={handleSaveSettings}>
              <div className="mb-6">
                <Label htmlFor="xpPerMessage" className="block text-sm font-medium text-gray-300 mb-2">XP Per Message</Label>
                <div className="flex items-center">
                  <Input
                    type="number"
                    id="xpPerMessage"
                    name="xpPerMessage"
                    min="1"
                    max="50"
                    value={levelSettings.xpPerMessage}
                    onChange={handleSettingsChange}
                    className="w-full bg-gray-800 text-white rounded-md border-gray-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-discord-blurple"
                  />
                  <span className="ml-2 text-gray-400">XP</span>
                </div>
                <p className="mt-1 text-xs text-gray-400">Amount of XP users earn per message (1-50)</p>
              </div>
              
              <div className="mb-6">
                <Label htmlFor="xpCooldown" className="block text-sm font-medium text-gray-300 mb-2">XP Cooldown</Label>
                <div className="flex items-center">
                  <Input
                    type="number"
                    id="xpCooldown"
                    name="xpCooldown"
                    min="0"
                    max="120"
                    value={levelSettings.xpCooldown}
                    onChange={handleSettingsChange}
                    className="w-full bg-gray-800 text-white rounded-md border-gray-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-discord-blurple"
                  />
                  <span className="ml-2 text-gray-400">seconds</span>
                </div>
                <p className="mt-1 text-xs text-gray-400">Time between XP rewards for messages</p>
              </div>
              
              <div className="mb-6">
                <Label htmlFor="levelMultiplier" className="block text-sm font-medium text-gray-300 mb-2">Level Multiplier</Label>
                <Input
                  type="number"
                  id="levelMultiplier"
                  name="levelMultiplier"
                  min="1"
                  step="0.1"
                  value={levelSettings.levelMultiplier}
                  onChange={handleSettingsChange}
                  className="w-full bg-gray-800 text-white rounded-md border-gray-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-discord-blurple"
                />
                <p className="mt-1 text-xs text-gray-400">XP required for each level = (current level × multiplier)</p>
              </div>
              
              <div className="mb-6">
                <Label className="block text-sm font-medium text-gray-300 mb-2">Level-Up Notification</Label>
                <RadioGroup 
                  value={levelSettings.notificationType} 
                  onValueChange={handleNotificationTypeChange}
                  className="space-y-2"
                >
                  <div className="flex items-center">
                    <RadioGroupItem id="notify-dm" value="dm" className="text-discord-blurple" />
                    <Label htmlFor="notify-dm" className="ml-2 text-sm text-gray-300">Send DM</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem id="notify-channel" value="channel" className="text-discord-blurple" />
                    <Label htmlFor="notify-channel" className="ml-2 text-sm text-gray-300">Send in channel</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem id="notify-both" value="both" className="text-discord-blurple" />
                    <Label htmlFor="notify-both" className="ml-2 text-sm text-gray-300">Both DM and channel</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="mb-6">
                <Label className="block text-sm font-medium text-gray-300 mb-2">Level Rewards</Label>
                <div className="flex items-center mb-2">
                  <Switch 
                    id="enable-rewards" 
                    checked={levelSettings.enableRoleRewards} 
                    onCheckedChange={handleEnableRoleRewardsChange}
                    className="data-[state=checked]:bg-discord-blurple"
                  />
                  <Label htmlFor="enable-rewards" className="ml-2 text-sm text-gray-300">Enable role rewards for levels</Label>
                </div>
                
                <div className="mt-4 bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-white">Role Rewards</h4>
                    <Dialog open={isAddRewardDialogOpen} onOpenChange={setIsAddRewardDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          disabled={!levelSettings.enableRoleRewards}
                          className="text-xs bg-discord-blurple text-white px-2 py-1 rounded hover:bg-blue-700"
                        >
                          + Add Reward
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-discord-dark border-gray-700">
                        <DialogHeader>
                          <DialogTitle className="text-white">Add Level Reward</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddReward}>
                          <div className="space-y-4 py-2">
                            <div className="space-y-2">
                              <Label htmlFor="level" className="text-gray-300">Level Required</Label>
                              <Input 
                                id="level" 
                                name="level" 
                                type="number" 
                                min="1"
                                value={rewardFormData.level} 
                                onChange={handleRewardFormChange} 
                                className="bg-gray-800 border-gray-700 text-white"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="roleName" className="text-gray-300">Role Name</Label>
                              <Input 
                                id="roleName" 
                                name="roleName" 
                                value={rewardFormData.roleName} 
                                onChange={handleRewardFormChange} 
                                className="bg-gray-800 border-gray-700 text-white"
                                required
                              />
                            </div>
                          </div>
                          <DialogFooter className="mt-4">
                            <Button 
                              type="submit" 
                              disabled={addRewardMutation.isPending}
                              className="bg-discord-blurple hover:bg-blue-700 text-white"
                            >
                              {addRewardMutation.isPending ? "Adding..." : "Add Reward"}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  <ul className="space-y-2">
                    {levelRewards && levelRewards.length > 0 ? (
                      levelRewards.map((reward) => (
                        <li key={reward.id} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className={`w-8 h-8 flex items-center justify-center ${getLevelColor(reward.level)} text-white rounded-full text-xs`}>
                              {reward.level}
                            </span>
                            <span className="ml-2 text-gray-300">Level {reward.level}: {reward.roleName}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteReward(reward.id)}
                            className="text-red-400 hover:text-red-300"
                            disabled={deleteRewardMutation.isPending}
                          >
                            <X size={16} />
                          </Button>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-400 text-sm text-center py-2">
                        No role rewards configured. Add some rewards to get started.
                      </li>
                    )}
                  </ul>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={updateSettingsMutation.isPending}
                  className="bg-discord-blurple hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
                >
                  {updateSettingsMutation.isPending ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <Card className="bg-discord-dark rounded-lg shadow-lg p-6">
          <CardContent className="p-0">
            <h2 className="text-xl font-semibold text-white mb-6">Level Preview</h2>
            
            <div className="mb-6">
              <LevelCard />
              
              <div className="bg-gray-800 rounded-lg overflow-hidden mt-4">
                <div className="px-4 py-3 bg-gray-700">
                  <h3 className="text-sm font-medium text-white">Leaderboard Preview</h3>
                </div>
                <ul className="divide-y divide-gray-700">
                  <li className="px-4 py-3 flex items-center">
                    <span className="w-6 h-6 flex items-center justify-center bg-yellow-500 text-white rounded-full text-xs mr-3">1</span>
                    <img 
                      src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48" 
                      alt="User avatar" 
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-white">TopUser#5555</p>
                      <p className="text-xs text-gray-400">Level 42 • 42,890 XP</p>
                    </div>
                  </li>
                  <li className="px-4 py-3 flex items-center">
                    <span className="w-6 h-6 flex items-center justify-center bg-gray-500 text-white rounded-full text-xs mr-3">2</span>
                    <img 
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48" 
                      alt="User avatar" 
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-white">Active#1234</p>
                      <p className="text-xs text-gray-400">Level 38 • 36,750 XP</p>
                    </div>
                  </li>
                  <li className="px-4 py-3 flex items-center">
                    <span className="w-6 h-6 flex items-center justify-center bg-amber-700 text-white rounded-full text-xs mr-3">3</span>
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48" 
                      alt="User avatar" 
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-white">ChattyUser#9999</p>
                      <p className="text-xs text-gray-400">Level 36 • 33,210 XP</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium text-white mb-4">Level Commands</h3>
              <div className="bg-gray-800 rounded-lg p-4">
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><code>!level</code> - Check your current level and XP</li>
                  <li><code>!rank [@user]</code> - Check a user's level card</li>
                  <li><code>!leaderboard</code> - Show the server's top members</li>
                  <li><code>!rewards</code> - View available level rewards</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
