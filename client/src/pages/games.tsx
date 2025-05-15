import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import AnimeGame from "@/components/animeGame";
import { animeCharacters, availableGames, difficulties } from "@/lib/animeData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

interface AnimeGameSettings {
  id: number;
  difficulty: string;
  timeLimit: number;
  reward: number;
  cooldown: number;
  channels: string[];
}

interface AnimeDatabase {
  id: number;
  title: string;
  difficulty: string;
  imageCount: number;
}

export default function Games() {
  const queryClient = useQueryClient();
  const [isAddAnimeDialogOpen, setIsAddAnimeDialogOpen] = useState(false);
  const [animeFormData, setAnimeFormData] = useState<Partial<AnimeDatabase>>({
    title: "",
    difficulty: "Medium",
    imageCount: 0
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Game settings state
  const [animeGameSettings, setAnimeGameSettings] = useState<Partial<AnimeGameSettings>>({
    difficulty: "Medium",
    timeLimit: 60,
    reward: 50,
    cooldown: 30,
    channels: ["main-chat", "gaming"]
  });

  // Fetch anime game settings
  const { data: fetchedSettings, isLoading: isLoadingSettings } = useQuery<AnimeGameSettings>({
    queryKey: ['/api/games/anime/settings'],
    onSuccess: (data) => {
      setAnimeGameSettings(data);
    }
  });

  // Fetch anime database
  const { data: animeDatabase, isLoading: isLoadingDatabase } = useQuery<AnimeDatabase[]>({
    queryKey: ['/api/games/anime/database'],
  });

  // Update anime game settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (data: Partial<AnimeGameSettings>) => {
      const response = await apiRequest('POST', '/api/games/anime/settings', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/games/anime/settings'] });
      toast({
        title: "Settings Updated",
        description: "Anime game settings have been saved successfully.",
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

  // Add anime entry mutation
  const addAnimeMutation = useMutation({
    mutationFn: async (data: Partial<AnimeDatabase>) => {
      const response = await apiRequest('POST', '/api/games/anime/database', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/games/anime/database'] });
      setIsAddAnimeDialogOpen(false);
      setAnimeFormData({ title: "", difficulty: "Medium", imageCount: 0 });
      toast({
        title: "Anime Added",
        description: "Anime entry has been added successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add anime: ${error}`,
        variant: "destructive",
      });
    }
  });

  // Update anime entry mutation
  const updateAnimeMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<AnimeDatabase> }) => {
      const response = await apiRequest('PUT', `/api/games/anime/database/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/games/anime/database'] });
      toast({
        title: "Anime Updated",
        description: "Anime entry has been updated successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update anime: ${error}`,
        variant: "destructive",
      });
    }
  });

  // Delete anime entry mutation
  const deleteAnimeMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/games/anime/database/${id}`, undefined);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/games/anime/database'] });
      toast({
        title: "Anime Deleted",
        description: "Anime entry has been deleted successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete anime: ${error}`,
        variant: "destructive",
      });
    }
  });

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setAnimeGameSettings({
      ...animeGameSettings,
      [name]: type === 'number' ? parseInt(value) : value
    });
  };

  const handleDifficultyChange = (value: string) => {
    setAnimeGameSettings({
      ...animeGameSettings,
      difficulty: value
    });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettingsMutation.mutate(animeGameSettings);
  };

  const handleAnimeFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setAnimeFormData({
      ...animeFormData,
      [name]: type === 'number' ? parseInt(value) : value
    });
  };

  const handleAnimeDifficultyChange = (value: string) => {
    setAnimeFormData({
      ...animeFormData,
      difficulty: value
    });
  };

  const handleAddAnime = (e: React.FormEvent) => {
    e.preventDefault();
    addAnimeMutation.mutate(animeFormData);
  };

  const handleEditAnime = (anime: AnimeDatabase) => {
    setAnimeFormData({
      id: anime.id,
      title: anime.title,
      difficulty: anime.difficulty,
      imageCount: anime.imageCount
    });
    setIsAddAnimeDialogOpen(true);
  };

  const handleDeleteAnime = (id: number) => {
    if (confirm("Are you sure you want to delete this anime entry?")) {
      deleteAnimeMutation.mutate(id);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredAnime = animeDatabase?.filter(anime => 
    anime.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoadingSettings || isLoadingDatabase) {
    return (
      <section className="mb-12">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-white mb-2">Mini-Games</h1>
          <p className="text-gray-400">Configure fun games for your server</p>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
          <div className="bg-discord-dark rounded-lg shadow-lg p-6 lg:col-span-2">
            <div className="h-6 bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gray-700 rounded w-full mb-6"></div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-700 rounded w-full"></div>
              <div className="h-10 bg-gray-700 rounded w-full"></div>
            </div>
          </div>
          <div className="bg-discord-dark rounded-lg shadow-lg p-6">
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
        <h1 className="text-3xl font-semibold text-white mb-2">Mini-Games</h1>
        <p className="text-gray-400">Configure fun games for your server</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Guess That Anime Game */}
        <Card className="bg-discord-dark rounded-lg shadow-lg p-6 lg:col-span-2">
          <CardContent className="p-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Guess That Anime</h2>
              <Switch 
                checked={true} 
                className="data-[state=checked]:bg-discord-blurple"
              />
            </div>
            
            <div className="mb-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-white font-medium mb-3">Game Preview</h3>
                
                <AnimeGame />
              </div>
            </div>
            
            <form onSubmit={handleSaveSettings}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="difficulty" className="block text-sm font-medium text-gray-300 mb-2">Difficulty</Label>
                  <Select
                    value={animeGameSettings.difficulty}
                    onValueChange={handleDifficultyChange}
                  >
                    <SelectTrigger id="difficulty" className="w-full bg-gray-800 text-white border-gray-700">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {difficulties.map((difficulty) => (
                        <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="timeLimit" className="block text-sm font-medium text-gray-300 mb-2">Time Limit (seconds)</Label>
                  <Input
                    type="number"
                    id="timeLimit"
                    name="timeLimit"
                    min="10"
                    max="120"
                    value={animeGameSettings.timeLimit}
                    onChange={handleSettingsChange}
                    className="w-full bg-gray-800 text-white rounded-md border-gray-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-discord-blurple"
                  />
                </div>
                
                <div>
                  <Label htmlFor="reward" className="block text-sm font-medium text-gray-300 mb-2">Reward (Coins)</Label>
                  <Input
                    type="number"
                    id="reward"
                    name="reward"
                    min="10"
                    max="1000"
                    value={animeGameSettings.reward}
                    onChange={handleSettingsChange}
                    className="w-full bg-gray-800 text-white rounded-md border-gray-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-discord-blurple"
                  />
                </div>
                
                <div>
                  <Label htmlFor="cooldown" className="block text-sm font-medium text-gray-300 mb-2">Cooldown (minutes)</Label>
                  <Input
                    type="number"
                    id="cooldown"
                    name="cooldown"
                    min="1"
                    max="120"
                    value={animeGameSettings.cooldown}
                    onChange={handleSettingsChange}
                    className="w-full bg-gray-800 text-white rounded-md border-gray-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-discord-blurple"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label className="block text-sm font-medium text-gray-300 mb-2">Game Channels</Label>
                  <select 
                    multiple 
                    id="anime-channels" 
                    className="w-full bg-gray-800 text-white rounded-md border-gray-700 px-4 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-discord-blurple"
                  >
                    <option selected>📌 main-chat</option>
                    <option selected>🎮 gaming</option>
                    <option>❓ quiz-time</option>
                    <option>🎯 fun-stuff</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-400">Select channels where the game can be played</p>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <Button 
                  type="submit" 
                  disabled={updateSettingsMutation.isPending}
                  className="bg-discord-blurple hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
                >
                  {updateSettingsMutation.isPending ? "Saving..." : "Save Game Settings"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        {/* Other Games List */}
        <Card className="bg-discord-dark rounded-lg shadow-lg p-6">
          <CardContent className="p-0">
            <h2 className="text-xl font-semibold text-white mb-6">Available Games</h2>
            
            <div className="space-y-4">
              {availableGames.map((game) => (
                <div key={game.id} className={`p-3 rounded-lg border ${game.isActive ? 'bg-discord-blurple bg-opacity-20 border-discord-blurple border-opacity-50' : 'bg-gray-800 border-gray-700'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-medium">{game.name}</h3>
                    {game.isActive ? (
                      <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">Active</span>
                    ) : (
                      <Button variant="link" size="sm" className="text-xs text-discord-blurple">Enable</Button>
                    )}
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{game.description}</p>
                  <div className="text-xs text-gray-400">Command: <code>{game.command}</code></div>
                </div>
              ))}
              
              {/* Add New Game */}
              <div className="mt-6">
                <Button 
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-md transition-colors flex items-center justify-center"
                  onClick={() => {
                    toast({
                      title: "Coming Soon",
                      description: "This feature will be available in a future update.",
                      variant: "default",
                    });
                  }}
                >
                  <Plus size={16} className="mr-2" /> Add New Game
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Anime Collection Management */}
      <Card className="mt-8 bg-discord-dark rounded-lg shadow-lg p-6">
        <CardContent className="p-0">
          <h2 className="text-xl font-semibold text-white mb-6">Manage Anime Collection</h2>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Anime Images</h3>
              <Button
                className="bg-discord-blurple hover:bg-blue-700 text-white text-sm py-1 px-3 rounded-md transition-colors flex items-center"
                onClick={() => {
                  toast({
                    title: "Feature Coming Soon",
                    description: "Image upload functionality will be available in a future update.",
                    variant: "default",
                  });
                }}
              >
                <Plus size={16} className="mr-1" /> Add Images
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {animeCharacters.map((character) => (
                <div key={character.id} className="relative group">
                  <img 
                    src={character.imageUrl} 
                    alt={character.title} 
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-white p-1"
                      onClick={() => {
                        toast({
                          title: "Coming Soon",
                          description: "Image management will be available in a future update.",
                          variant: "default",
                        });
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-medium text-white mb-4">Anime Database</h3>
            
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="Search anime titles..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="flex-1 bg-gray-700 text-white border-none rounded-md px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-discord-blurple"
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    <Search size={16} />
                  </div>
                </div>
                <Dialog open={isAddAnimeDialogOpen} onOpenChange={setIsAddAnimeDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="ml-2 bg-discord-blurple hover:bg-blue-700 text-white rounded-md transition-colors"
                      onClick={() => {
                        setAnimeFormData({ title: "", difficulty: "Medium", imageCount: 0 });
                      }}
                    >
                      <Plus size={16} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-discord-dark border-gray-700">
                    <DialogHeader>
                      <DialogTitle className="text-white">{animeFormData.id ? 'Edit Anime Entry' : 'Add Anime Entry'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddAnime}>
                      <div className="space-y-4 py-2">
                        <div className="space-y-2">
                          <Label htmlFor="title" className="text-gray-300">Title</Label>
                          <Input 
                            id="title" 
                            name="title" 
                            value={animeFormData.title} 
                            onChange={handleAnimeFormChange} 
                            className="bg-gray-800 border-gray-700 text-white"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="animeDifficulty" className="text-gray-300">Difficulty</Label>
                          <Select
                            value={animeFormData.difficulty}
                            onValueChange={handleAnimeDifficultyChange}
                          >
                            <SelectTrigger id="animeDifficulty" className="w-full bg-gray-800 text-white border-gray-700">
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              {difficulties.map((difficulty) => (
                                <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="imageCount" className="text-gray-300">Image Count</Label>
                          <Input 
                            id="imageCount" 
                            name="imageCount" 
                            type="number" 
                            min="0"
                            value={animeFormData.imageCount} 
                            onChange={handleAnimeFormChange} 
                            className="bg-gray-800 border-gray-700 text-white"
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter className="mt-4">
                        <Button 
                          type="submit" 
                          disabled={addAnimeMutation.isPending}
                          className="bg-discord-blurple hover:bg-blue-700 text-white"
                        >
                          {addAnimeMutation.isPending ? "Saving..." : (animeFormData.id ? "Update" : "Add")}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="max-h-64 overflow-y-auto pr-2">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Difficulty</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Images</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredAnime && filteredAnime.length > 0 ? (
                      filteredAnime.map((anime) => (
                        <tr key={anime.id}>
                          <td className="px-4 py-3 text-sm text-white">{anime.title}</td>
                          <td className="px-4 py-3 text-sm text-white">{anime.difficulty}</td>
                          <td className="px-4 py-3 text-sm text-white">{anime.imageCount}</td>
                          <td className="px-4 py-3 text-sm text-white">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEditAnime(anime)} 
                              className="text-blue-400 hover:text-blue-300 mr-2"
                            >
                              <Pencil size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteAnime(anime.id)} 
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-4 py-3 text-sm text-gray-400 text-center">
                          {searchQuery ? "No matching anime found." : "No anime entries found. Add some to get started."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
