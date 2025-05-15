import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { Pencil, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import BotCommands from "@/components/botCommands";

interface BotCommand {
  id: number;
  name: string;
  description: string;
  category: string;
  isEnabled: boolean;
}

interface HelpCommandSettings {
  id: number;
  appearance: string;
  organization: string;
  embedColor: string;
  footerText: string;
}

export default function Commands() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isAddCommandDialogOpen, setIsAddCommandDialogOpen] = useState(false);
  const [commandFormData, setCommandFormData] = useState<Partial<BotCommand>>({
    name: "",
    description: "",
    category: "General",
    isEnabled: true
  });
  
  // Help command settings state
  const [helpSettings, setHelpSettings] = useState<Partial<HelpCommandSettings>>({
    appearance: "embed",
    organization: "category",
    embedColor: "#5865F2",
    footerText: "Powered by jahceere's Discord Bot"
  });

  // Fetch commands
  const { data: commands, isLoading: isLoadingCommands } = useQuery<BotCommand[]>({
    queryKey: ['/api/commands'],
  });

  // Fetch help command settings
  const { data: fetchedHelpSettings, isLoading: isLoadingHelpSettings } = useQuery<HelpCommandSettings>({
    queryKey: ['/api/commands/help'],
    onSuccess: (data) => {
      setHelpSettings(data);
    }
  });

  // Add command mutation
  const addCommandMutation = useMutation({
    mutationFn: async (data: Partial<BotCommand>) => {
      const response = await apiRequest('POST', '/api/commands', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/commands'] });
      setIsAddCommandDialogOpen(false);
      setCommandFormData({ name: "", description: "", category: "General", isEnabled: true });
      toast({
        title: "Command Added",
        description: "Command has been added successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add command: ${error}`,
        variant: "destructive",
      });
    }
  });

  // Update command mutation
  const updateCommandMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<BotCommand> }) => {
      const response = await apiRequest('PUT', `/api/commands/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/commands'] });
      toast({
        title: "Command Updated",
        description: "Command has been updated successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update command: ${error}`,
        variant: "destructive",
      });
    }
  });

  // Update help settings mutation
  const updateHelpSettingsMutation = useMutation({
    mutationFn: async (data: Partial<HelpCommandSettings>) => {
      const response = await apiRequest('POST', '/api/commands/help', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/commands/help'] });
      toast({
        title: "Help Settings Updated",
        description: "Help command settings have been saved successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update help settings: ${error}`,
        variant: "destructive",
      });
    }
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleCommandFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setCommandFormData({
      ...commandFormData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleCommandCategoryChange = (value: string) => {
    setCommandFormData({
      ...commandFormData,
      category: value
    });
  };

  const handleAddCommand = (e: React.FormEvent) => {
    e.preventDefault();
    addCommandMutation.mutate(commandFormData);
  };

  const handleToggleCommand = (command: BotCommand) => {
    updateCommandMutation.mutate({
      id: command.id,
      data: { isEnabled: !command.isEnabled }
    });
  };

  const handleEditCommand = (command: BotCommand) => {
    setCommandFormData({
      id: command.id,
      name: command.name,
      description: command.description,
      category: command.category,
      isEnabled: command.isEnabled
    });
    setIsAddCommandDialogOpen(true);
  };

  const handleHelpAppearanceChange = (value: string) => {
    setHelpSettings({
      ...helpSettings,
      appearance: value
    });
  };

  const handleHelpOrganizationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setHelpSettings({
      ...helpSettings,
      organization: e.target.value
    });
  };

  const handleHelpSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setHelpSettings({
      ...helpSettings,
      [name]: value
    });
  };

  const handleSaveHelpSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateHelpSettingsMutation.mutate(helpSettings);
  };

  // Filter commands based on search query and category
  const filteredCommands = commands?.filter(command => {
    const matchesSearch = command.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         command.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || command.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get available categories from commands
  const categories = commands ? ["All Categories", ...new Set(commands.map(command => command.category))] : ["All Categories"];

  if (isLoadingCommands || isLoadingHelpSettings) {
    return (
      <section className="mb-12">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-white mb-2">Bot Commands</h1>
          <p className="text-gray-400">Manage and customize bot commands</p>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-discord-dark rounded-lg shadow-lg p-6 animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gray-700 rounded w-full"></div>
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
        <h1 className="text-3xl font-semibold text-white mb-2">Bot Commands</h1>
        <p className="text-gray-400">Manage and customize bot commands</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-discord-dark rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">All Commands</h2>
            <div className="flex space-x-2">
              <div className="relative">
                <Input 
                  type="text" 
                  placeholder="Search commands..." 
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="bg-gray-800 text-white border-none rounded-md px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-discord-blurple"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="bg-gray-800 text-white border-none rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-discord-blurple">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <BotCommands 
            commands={filteredCommands || []} 
            onEdit={handleEditCommand} 
            onToggle={handleToggleCommand} 
          />
          
          <div className="mt-4 flex justify-between items-center">
            <Dialog open={isAddCommandDialogOpen} onOpenChange={setIsAddCommandDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-discord-blurple hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors flex items-center"
                >
                  <Plus size={16} className="mr-2" /> Add Command
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-discord-dark border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">{commandFormData.id ? 'Edit Command' : 'Add Command'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddCommand}>
                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-300">Command Name</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={commandFormData.name} 
                        onChange={handleCommandFormChange} 
                        className="bg-gray-800 border-gray-700 text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-gray-300">Description</Label>
                      <Input 
                        id="description" 
                        name="description" 
                        value={commandFormData.description} 
                        onChange={handleCommandFormChange} 
                        className="bg-gray-800 border-gray-700 text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Category</Label>
                      <Select
                        value={commandFormData.category}
                        onValueChange={handleCommandCategoryChange}
                      >
                        <SelectTrigger className="w-full bg-gray-800 text-white border-gray-700">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="General">General</SelectItem>
                          <SelectItem value="Economy">Economy</SelectItem>
                          <SelectItem value="Levels">Levels</SelectItem>
                          <SelectItem value="Music">Music</SelectItem>
                          <SelectItem value="Games">Games</SelectItem>
                          <SelectItem value="Moderation">Moderation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        id="isEnabled" 
                        name="isEnabled" 
                        type="checkbox" 
                        checked={commandFormData.isEnabled} 
                        onChange={handleCommandFormChange} 
                        className="h-4 w-4 text-discord-blurple bg-gray-800 border-gray-700 rounded focus:ring-discord-blurple"
                      />
                      <Label htmlFor="isEnabled" className="text-gray-300">Enabled</Label>
                    </div>
                  </div>
                  <DialogFooter className="mt-4">
                    <Button 
                      type="submit" 
                      disabled={addCommandMutation.isPending}
                      className="bg-discord-blurple hover:bg-blue-700 text-white"
                    >
                      {addCommandMutation.isPending ? "Saving..." : (commandFormData.id ? "Update" : "Add")}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-400 mr-4">Page 1 of 1</span>
              <div className="flex space-x-2">
                <Button disabled variant="outline" size="sm" className="bg-gray-800 text-gray-400 hover:text-white px-3 py-1 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </Button>
                <Button disabled variant="outline" size="sm" className="bg-gray-800 text-gray-400 hover:text-white px-3 py-1 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <Card className="bg-discord-dark rounded-lg shadow-lg p-6">
          <CardContent className="p-0">
            <h2 className="text-xl font-semibold text-white mb-6">Help Command</h2>
            
            <form onSubmit={handleSaveHelpSettings}>
              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <div className="mb-4">
                  <Label className="block text-sm font-medium text-gray-300 mb-2">Help Command Appearance</Label>
                  <RadioGroup 
                    value={helpSettings.appearance} 
                    onValueChange={handleHelpAppearanceChange}
                    className="space-y-2"
                  >
                    <div className="flex items-center">
                      <RadioGroupItem id="help-embed" value="embed" className="text-discord-blurple" />
                      <Label htmlFor="help-embed" className="ml-2 text-sm text-gray-300">Rich Embed</Label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem id="help-text" value="text" className="text-discord-blurple" />
                      <Label htmlFor="help-text" className="ml-2 text-sm text-gray-300">Text Message</Label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem id="help-buttons" value="buttons" className="text-discord-blurple" />
                      <Label htmlFor="help-buttons" className="ml-2 text-sm text-gray-300">Interactive Buttons</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="mb-4">
                  <Label className="block text-sm font-medium text-gray-300 mb-2">Help Organization</Label>
                  <select 
                    value={helpSettings.organization} 
                    onChange={handleHelpOrganizationChange} 
                    className="w-full bg-gray-700 text-white border-none rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-discord-blurple"
                  >
                    <option value="category">Organized by category</option>
                    <option value="alphabetical">Alphabetical order</option>
                    <option value="most_used">Most used commands first</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="embedColor" className="block text-sm font-medium text-gray-300 mb-2">Embed Color</Label>
                  <Input
                    type="color"
                    id="embedColor"
                    name="embedColor"
                    value={helpSettings.embedColor}
                    onChange={handleHelpSettingsChange}
                    className="w-full h-10 bg-gray-700 rounded-md border-none focus:outline-none focus:ring-2 focus:ring-discord-blurple"
                  />
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="footerText" className="block text-sm font-medium text-gray-300 mb-2">Help Footer Text</Label>
                  <Input
                    type="text"
                    id="footerText"
                    name="footerText"
                    value={helpSettings.footerText}
                    onChange={handleHelpSettingsChange}
                    className="w-full bg-gray-700 text-white border-none rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-discord-blurple"
                  />
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <h3 className="text-white font-medium mb-4">Preview</h3>
                
                <div className="border-l-4 border-discord-blurple bg-gray-900 rounded-r-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium">Help Menu</h4>
                    <span className="text-xs text-gray-400">!help</span>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div>
                      <h5 className="text-discord-blurple text-sm font-medium mb-1">🔷 General</h5>
                      <p className="text-gray-300 text-xs">!help, !ping, !info</p>
                    </div>
                    <div>
                      <h5 className="text-yellow-400 text-sm font-medium mb-1">💰 Economy</h5>
                      <p className="text-gray-300 text-xs">!balance, !daily, !shop, !transfer</p>
                    </div>
                    <div>
                      <h5 className="text-purple-400 text-sm font-medium mb-1">⭐ Levels</h5>
                      <p className="text-gray-300 text-xs">!level, !rank, !leaderboard</p>
                    </div>
                    <div>
                      <h5 className="text-green-400 text-sm font-medium mb-1">🎵 Music</h5>
                      <p className="text-gray-300 text-xs">!play, !skip, !queue, !stop</p>
                    </div>
                    <div>
                      <h5 className="text-red-400 text-sm font-medium mb-1">🎮 Games</h5>
                      <p className="text-gray-300 text-xs">!anime, !trivia, !rps</p>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-400 border-t border-gray-700 pt-2">
                    {helpSettings.footerText}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={updateHelpSettingsMutation.isPending}
                  className="bg-discord-blurple hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
                >
                  {updateHelpSettingsMutation.isPending ? "Saving..." : "Save Help Settings"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
