import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Pencil } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import MusicPlayer from "@/components/musicPlayer";

interface MusicSettings {
  id: number;
  defaultVolume: number;
  maxQueueSize: number;
  disconnectTimeout: number;
  youtubeEnabled: boolean;
  spotifyEnabled: boolean;
  soundcloudEnabled: boolean;
  djRoleName: string;
  restrictVolumeCommand: boolean;
  restrictSkipCommand: boolean;
  restrictClearCommand: boolean;
}

export default function Music() {
  const queryClient = useQueryClient();
  const [volume, setVolume] = useState(70);
  
  // Music settings state
  const [musicSettings, setMusicSettings] = useState<Partial<MusicSettings>>({
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

  // Fetch music settings
  const { data: fetchedSettings, isLoading } = useQuery<MusicSettings>({
    queryKey: ['/api/music/settings'],
    onSuccess: (data) => {
      setMusicSettings(data);
      setVolume(data.defaultVolume);
    }
  });

  // Update music settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (data: Partial<MusicSettings>) => {
      const response = await apiRequest('POST', '/api/music/settings', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/music/settings'] });
      toast({
        title: "Settings Updated",
        description: "Music player settings have been saved successfully.",
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

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    setMusicSettings({
      ...musicSettings,
      defaultVolume: newVolume
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setMusicSettings({
      ...musicSettings,
      [name]: type === 'number' ? parseInt(value) : value
    });
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setMusicSettings({
      ...musicSettings,
      [name]: checked
    });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettingsMutation.mutate(musicSettings);
  };

  if (isLoading) {
    return (
      <section className="mb-12">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-white mb-2">Music Player</h1>
          <p className="text-gray-400">Configure music player settings and commands</p>
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
        <h1 className="text-3xl font-semibold text-white mb-2">Music Player</h1>
        <p className="text-gray-400">Configure music player settings and commands</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-discord-dark rounded-lg shadow-lg p-6">
          <CardContent className="p-0">
            <h2 className="text-xl font-semibold text-white mb-6">Music Settings</h2>
            
            <form onSubmit={handleSaveSettings}>
              <div className="mb-6">
                <Label htmlFor="defaultVolume" className="block text-sm font-medium text-gray-300 mb-2">Default Volume</Label>
                <div className="flex items-center">
                  <div className="flex-1 mr-4">
                    <Slider
                      id="defaultVolume"
                      value={[volume]}
                      onValueChange={handleVolumeChange}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <span className="ml-3 text-white min-w-[40px] text-center">{volume}%</span>
                </div>
              </div>
              
              <div className="mb-6">
                <Label htmlFor="maxQueueSize" className="block text-sm font-medium text-gray-300 mb-2">Maximum Queue Size</Label>
                <Input
                  type="number"
                  id="maxQueueSize"
                  name="maxQueueSize"
                  min="10"
                  max="500"
                  value={musicSettings.maxQueueSize}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 text-white rounded-md border-gray-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-discord-blurple"
                />
              </div>
              
              <div className="mb-6">
                <Label htmlFor="disconnectTimeout" className="block text-sm font-medium text-gray-300 mb-2">Disconnect Timeout</Label>
                <div className="flex items-center">
                  <Input
                    type="number"
                    id="disconnectTimeout"
                    name="disconnectTimeout"
                    min="0"
                    max="60"
                    value={musicSettings.disconnectTimeout}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 text-white rounded-md border-gray-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-discord-blurple"
                  />
                  <span className="ml-2 text-gray-400">minutes</span>
                </div>
                <p className="mt-1 text-xs text-gray-400">Time before disconnecting from empty voice channel</p>
              </div>
              
              <div className="mb-6">
                <Label className="block text-sm font-medium text-gray-300 mb-2">Music Sources</Label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox 
                      id="youtubeEnabled" 
                      checked={musicSettings.youtubeEnabled}
                      onCheckedChange={(checked) => handleCheckboxChange('youtubeEnabled', checked as boolean)}
                      className="h-4 w-4 text-discord-blurple bg-gray-800 border-gray-700 rounded focus:ring-discord-blurple"
                    />
                    <label htmlFor="youtubeEnabled" className="ml-2 text-sm text-gray-300">YouTube</label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox 
                      id="spotifyEnabled" 
                      checked={musicSettings.spotifyEnabled}
                      onCheckedChange={(checked) => handleCheckboxChange('spotifyEnabled', checked as boolean)}
                      className="h-4 w-4 text-discord-blurple bg-gray-800 border-gray-700 rounded focus:ring-discord-blurple"
                    />
                    <label htmlFor="spotifyEnabled" className="ml-2 text-sm text-gray-300">Spotify</label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox 
                      id="soundcloudEnabled" 
                      checked={musicSettings.soundcloudEnabled}
                      onCheckedChange={(checked) => handleCheckboxChange('soundcloudEnabled', checked as boolean)}
                      className="h-4 w-4 text-discord-blurple bg-gray-800 border-gray-700 rounded focus:ring-discord-blurple"
                    />
                    <label htmlFor="soundcloudEnabled" className="ml-2 text-sm text-gray-300">SoundCloud</label>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <Label className="block text-sm font-medium text-gray-300 mb-2">DJ Role</Label>
                <div className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-md">
                  <span className="text-gray-300">{musicSettings.djRoleName}</span>
                  <div className="flex items-center">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      className="text-gray-400 hover:text-white"
                      onClick={() => {
                        const newRoleName = prompt("Enter new DJ role name:", musicSettings.djRoleName);
                        if (newRoleName) {
                          setMusicSettings({
                            ...musicSettings,
                            djRoleName: newRoleName
                          });
                        }
                      }}
                    >
                      <Pencil size={16} />
                    </Button>
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-400">Role required to use certain music commands</p>
              </div>
              
              <div className="mb-6">
                <Label className="block text-sm font-medium text-gray-300 mb-2">Restricted Commands</Label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox 
                      id="restrictVolumeCommand" 
                      checked={musicSettings.restrictVolumeCommand}
                      onCheckedChange={(checked) => handleCheckboxChange('restrictVolumeCommand', checked as boolean)}
                      className="h-4 w-4 text-discord-blurple bg-gray-800 border-gray-700 rounded focus:ring-discord-blurple"
                    />
                    <label htmlFor="restrictVolumeCommand" className="ml-2 text-sm text-gray-300">!volume - DJ role only</label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox 
                      id="restrictSkipCommand" 
                      checked={musicSettings.restrictSkipCommand}
                      onCheckedChange={(checked) => handleCheckboxChange('restrictSkipCommand', checked as boolean)}
                      className="h-4 w-4 text-discord-blurple bg-gray-800 border-gray-700 rounded focus:ring-discord-blurple"
                    />
                    <label htmlFor="restrictSkipCommand" className="ml-2 text-sm text-gray-300">!skip - DJ role only</label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox 
                      id="restrictClearCommand" 
                      checked={musicSettings.restrictClearCommand}
                      onCheckedChange={(checked) => handleCheckboxChange('restrictClearCommand', checked as boolean)}
                      className="h-4 w-4 text-discord-blurple bg-gray-800 border-gray-700 rounded focus:ring-discord-blurple"
                    />
                    <label htmlFor="restrictClearCommand" className="ml-2 text-sm text-gray-300">!clear - DJ role only</label>
                  </div>
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
            <h2 className="text-xl font-semibold text-white mb-6">Music Commands & Preview</h2>
            
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <h3 className="text-white font-medium mb-3">Player Example</h3>
              
              <MusicPlayer />
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-white font-medium mb-4">Available Commands</h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <code className="text-amber-300 font-semibold">!play [song]</code>
                  <p className="text-gray-300 mt-1">Play a song or add to queue</p>
                </div>
                <div>
                  <code className="text-amber-300 font-semibold">!pause</code>
                  <p className="text-gray-300 mt-1">Pause the current track</p>
                </div>
                <div>
                  <code className="text-amber-300 font-semibold">!resume</code>
                  <p className="text-gray-300 mt-1">Resume a paused track</p>
                </div>
                <div>
                  <code className="text-amber-300 font-semibold">!skip</code>
                  <p className="text-gray-300 mt-1">Skip to the next song</p>
                </div>
                <div>
                  <code className="text-amber-300 font-semibold">!queue</code>
                  <p className="text-gray-300 mt-1">Show current music queue</p>
                </div>
                <div>
                  <code className="text-amber-300 font-semibold">!volume [1-100]</code>
                  <p className="text-gray-300 mt-1">Adjust player volume</p>
                </div>
                <div>
                  <code className="text-amber-300 font-semibold">!stop</code>
                  <p className="text-gray-300 mt-1">Stop music and clear queue</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
