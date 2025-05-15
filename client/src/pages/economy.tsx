import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

interface EconomySettings {
  id: number;
  currencyName: string;
  currencySymbol: string;
  startingBalance: number;
  dailyBonus: number;
  balanceCommandEnabled: boolean;
  dailyCommandEnabled: boolean;
  transferCommandEnabled: boolean;
  leaderboardCommandEnabled: boolean;
}

interface ShopItem {
  id: number;
  name: string;
  price: number;
  type: string;
}

export default function Economy() {
  const queryClient = useQueryClient();
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [itemFormData, setItemFormData] = useState<Partial<ShopItem>>({
    name: "",
    price: 0,
    type: "Role"
  });

  // Economy settings state
  const [economySettings, setEconomySettings] = useState<Partial<EconomySettings>>({
    currencyName: "Coins",
    currencySymbol: "🪙",
    startingBalance: 100,
    dailyBonus: 50,
    balanceCommandEnabled: true,
    dailyCommandEnabled: true,
    transferCommandEnabled: true,
    leaderboardCommandEnabled: true
  });

  // Fetch economy settings
  const { data: fetchedSettings, isLoading: isLoadingSettings } = useQuery<EconomySettings>({
    queryKey: ['/api/economy/settings'],
    onSuccess: (data) => {
      setEconomySettings(data);
    }
  });

  // Fetch shop items
  const { data: shopItems, isLoading: isLoadingItems } = useQuery<ShopItem[]>({
    queryKey: ['/api/economy/shop'],
  });

  // Update economy settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (data: Partial<EconomySettings>) => {
      const response = await apiRequest('POST', '/api/economy/settings', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/economy/settings'] });
      toast({
        title: "Settings Updated",
        description: "Economy settings have been saved successfully.",
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

  // Add shop item mutation
  const addItemMutation = useMutation({
    mutationFn: async (data: Partial<ShopItem>) => {
      const response = await apiRequest('POST', '/api/economy/shop', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/economy/shop'] });
      setIsAddItemDialogOpen(false);
      setItemFormData({ name: "", price: 0, type: "Role" });
      toast({
        title: "Item Added",
        description: "Shop item has been added successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add item: ${error}`,
        variant: "destructive",
      });
    }
  });

  // Update shop item mutation
  const updateItemMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<ShopItem> }) => {
      const response = await apiRequest('PUT', `/api/economy/shop/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/economy/shop'] });
      setIsAddItemDialogOpen(false);
      setEditingItemId(null);
      setItemFormData({ name: "", price: 0, type: "Role" });
      toast({
        title: "Item Updated",
        description: "Shop item has been updated successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update item: ${error}`,
        variant: "destructive",
      });
    }
  });

  // Delete shop item mutation
  const deleteItemMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/economy/shop/${id}`, undefined);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/economy/shop'] });
      toast({
        title: "Item Deleted",
        description: "Shop item has been deleted successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete item: ${error}`,
        variant: "destructive",
      });
    }
  });

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setEconomySettings({
      ...economySettings,
      [name]: type === 'number' ? parseInt(value) : value
    });
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setEconomySettings({
      ...economySettings,
      [name]: checked
    });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettingsMutation.mutate(economySettings);
  };

  const handleItemFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setItemFormData({
      ...itemFormData,
      [name]: type === 'number' ? parseInt(value) : value
    });
  };

  const handleItemTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemFormData({
      ...itemFormData,
      type: e.target.value
    });
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItemId !== null) {
      updateItemMutation.mutate({ id: editingItemId, data: itemFormData });
    } else {
      addItemMutation.mutate(itemFormData);
    }
  };

  const handleEditItem = (item: ShopItem) => {
    setEditingItemId(item.id);
    setItemFormData({
      name: item.name,
      price: item.price,
      type: item.type
    });
    setIsAddItemDialogOpen(true);
  };

  const handleDeleteItem = (id: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteItemMutation.mutate(id);
    }
  };

  if (isLoadingSettings || isLoadingItems) {
    return (
      <section className="mb-12">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-white mb-2">Economy System</h1>
          <p className="text-gray-400">Configure virtual currency and economy features</p>
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
        <h1 className="text-3xl font-semibold text-white mb-2">Economy System</h1>
        <p className="text-gray-400">Configure virtual currency and economy features</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-discord-dark rounded-lg shadow-lg p-6">
          <CardContent className="p-0">
            <h2 className="text-xl font-semibold text-white mb-6">Currency Settings</h2>
            
            <form onSubmit={handleSaveSettings}>
              <div className="mb-6">
                <Label htmlFor="currencyName" className="block text-sm font-medium text-gray-300 mb-2">Currency Name</Label>
                <Input
                  type="text"
                  id="currencyName"
                  name="currencyName"
                  value={economySettings.currencyName}
                  onChange={handleSettingsChange}
                  className="w-full bg-gray-800 text-white rounded-md border-gray-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-discord-blurple"
                />
              </div>
              
              <div className="mb-6">
                <Label htmlFor="currencySymbol" className="block text-sm font-medium text-gray-300 mb-2">Currency Symbol</Label>
                <Input
                  type="text"
                  id="currencySymbol"
                  name="currencySymbol"
                  value={economySettings.currencySymbol}
                  onChange={handleSettingsChange}
                  className="w-full bg-gray-800 text-white rounded-md border-gray-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-discord-blurple"
                />
              </div>
              
              <div className="mb-6">
                <Label htmlFor="startingBalance" className="block text-sm font-medium text-gray-300 mb-2">Starting Balance</Label>
                <Input
                  type="number"
                  id="startingBalance"
                  name="startingBalance"
                  value={economySettings.startingBalance}
                  onChange={handleSettingsChange}
                  className="w-full bg-gray-800 text-white rounded-md border-gray-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-discord-blurple"
                />
              </div>
              
              <div className="mb-6">
                <Label htmlFor="dailyBonus" className="block text-sm font-medium text-gray-300 mb-2">Daily Bonus Amount</Label>
                <Input
                  type="number"
                  id="dailyBonus"
                  name="dailyBonus"
                  value={economySettings.dailyBonus}
                  onChange={handleSettingsChange}
                  className="w-full bg-gray-800 text-white rounded-md border-gray-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-discord-blurple"
                />
              </div>
              
              <div className="mb-6">
                <Label className="block text-sm font-medium text-gray-300 mb-2">Economy Commands</Label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox 
                      id="balanceCommandEnabled" 
                      checked={economySettings.balanceCommandEnabled} 
                      onCheckedChange={(checked) => handleCheckboxChange('balanceCommandEnabled', checked as boolean)}
                      className="h-4 w-4 text-discord-blurple bg-gray-800 border-gray-700 rounded focus:ring-discord-blurple"
                    />
                    <label htmlFor="balanceCommandEnabled" className="ml-2 text-sm text-gray-300">!balance - Check balance</label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox 
                      id="dailyCommandEnabled" 
                      checked={economySettings.dailyCommandEnabled} 
                      onCheckedChange={(checked) => handleCheckboxChange('dailyCommandEnabled', checked as boolean)}
                      className="h-4 w-4 text-discord-blurple bg-gray-800 border-gray-700 rounded focus:ring-discord-blurple"
                    />
                    <label htmlFor="dailyCommandEnabled" className="ml-2 text-sm text-gray-300">!daily - Claim daily bonus</label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox 
                      id="transferCommandEnabled" 
                      checked={economySettings.transferCommandEnabled} 
                      onCheckedChange={(checked) => handleCheckboxChange('transferCommandEnabled', checked as boolean)}
                      className="h-4 w-4 text-discord-blurple bg-gray-800 border-gray-700 rounded focus:ring-discord-blurple"
                    />
                    <label htmlFor="transferCommandEnabled" className="ml-2 text-sm text-gray-300">!transfer - Send currency to others</label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox 
                      id="leaderboardCommandEnabled" 
                      checked={economySettings.leaderboardCommandEnabled} 
                      onCheckedChange={(checked) => handleCheckboxChange('leaderboardCommandEnabled', checked as boolean)}
                      className="h-4 w-4 text-discord-blurple bg-gray-800 border-gray-700 rounded focus:ring-discord-blurple"
                    />
                    <label htmlFor="leaderboardCommandEnabled" className="ml-2 text-sm text-gray-300">!leaderboard - Show richest users</label>
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
            <h2 className="text-xl font-semibold text-white mb-6">Shop Management</h2>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-white">Shop Items</h3>
                <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => {
                        setEditingItemId(null);
                        setItemFormData({ name: "", price: 0, type: "Role" });
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white text-sm py-1 px-3 rounded-md transition-colors flex items-center"
                    >
                      <Plus size={16} className="mr-1" /> Add Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-discord-dark border-gray-700">
                    <DialogHeader>
                      <DialogTitle className="text-white">{editingItemId ? 'Edit Shop Item' : 'Add Shop Item'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddItem}>
                      <div className="space-y-4 py-2">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-gray-300">Item Name</Label>
                          <Input 
                            id="name" 
                            name="name" 
                            value={itemFormData.name} 
                            onChange={handleItemFormChange} 
                            className="bg-gray-800 border-gray-700 text-white"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="price" className="text-gray-300">Price</Label>
                          <Input 
                            id="price" 
                            name="price" 
                            type="number" 
                            value={itemFormData.price} 
                            onChange={handleItemFormChange} 
                            className="bg-gray-800 border-gray-700 text-white"
                            required
                            min={1}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="type" className="text-gray-300">Type</Label>
                          <select 
                            id="type" 
                            name="type" 
                            value={itemFormData.type} 
                            onChange={handleItemTypeChange} 
                            className="w-full bg-gray-800 text-white rounded-md border border-gray-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-discord-blurple"
                            required
                          >
                            <option value="Role">Role</option>
                            <option value="Temporary">Temporary</option>
                            <option value="Consumable">Consumable</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                      <DialogFooter className="mt-4">
                        <Button 
                          type="submit" 
                          disabled={addItemMutation.isPending || updateItemMutation.isPending}
                          className="bg-discord-blurple hover:bg-blue-700 text-white"
                        >
                          {addItemMutation.isPending || updateItemMutation.isPending ? "Saving..." : (editingItemId ? "Update" : "Add")}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Item</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700 bg-gray-800">
                    {shopItems && shopItems.length > 0 ? (
                      shopItems.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{item.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{item.price} {economySettings.currencySymbol}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{item.type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEditItem(item)} 
                              className="text-blue-400 hover:text-blue-300 mr-3"
                            >
                              <Pencil size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteItem(item.id)} 
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 text-center">
                          No shop items found. Add some items to get started.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium text-white mb-4">Shop Commands</h3>
              <div className="bg-gray-800 rounded-lg p-4">
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><code>!shop</code> - View available items</li>
                  <li><code>!buy [item]</code> - Purchase an item</li>
                  <li><code>!inventory</code> - View owned items</li>
                  <li><code>!use [item]</code> - Use an item from inventory</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
