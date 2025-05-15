import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Power, RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Types
type BotStatus = {
  isConnected: boolean;
  isActive: boolean;
  serverCount: number;
  uptime: number;
  activityType: string;
  activityStatus: string;
};

// Activity form schema
const activityFormSchema = z.object({
  activityType: z.string({
    required_error: "Please select an activity type",
  }),
  activityText: z.string()
    .min(1, {
      message: "Activity text is required",
    })
    .max(100, {
      message: "Activity text must be at most 100 characters",
    }),
});

type ActivityFormValues = z.infer<typeof activityFormSchema>;

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch bot status
  const { 
    data: botStatus,
    isLoading: isLoadingStatus,
    refetch: refetchStatus 
  } = useQuery<BotStatus>({
    queryKey: ["/api/bot/status"],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Set up form with current values
  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      activityType: botStatus?.activityType || "PLAYING",
      activityText: botStatus?.activityStatus || "JAH MADE IT",
    },
    values: {
      activityType: botStatus?.activityType || "PLAYING",
      activityText: botStatus?.activityStatus || "JAH MADE IT",
    },
  });

  // Update activity mutation
  const updateActivityMutation = useMutation({
    mutationFn: async (data: ActivityFormValues) => {
      const res = await apiRequest("POST", "/api/bot/activity", data);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update activity");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bot/status"] });
      toast({
        title: "Activity updated",
        description: "Bot activity has been updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  function onSubmit(data: ActivityFormValues) {
    updateActivityMutation.mutate(data);
  }

  // Refresh status handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetchStatus();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Format uptime
  const formatUptime = (ms: number) => {
    if (!ms) return "Not connected";
    
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-purple-950 text-white">
      {/* Header/Navigation */}
      <header className="border-b border-purple-800/30 bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <h1 className="text-xl font-bold bg-gradient-to-r from-white via-purple-300 to-purple-500 text-transparent bg-clip-text">
              Discord Bot Admin
            </h1>
            <a href="/" className="text-gray-300 hover:text-white transition-colors text-sm">
              ← Back to Homepage
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-300">Welcome, {user?.username}</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Logout"
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Bot Status Card */}
          <div className="w-full md:w-1/3">
            <Card className="bg-black/40 border border-purple-800/30 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Bot Status</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRefresh}
                    disabled={isRefreshing || isLoadingStatus}
                  >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                  </Button>
                </div>
                <CardDescription>
                  Current status of your Discord bot
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingStatus ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Connection</span>
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${botStatus?.isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
                        <span>{botStatus?.isConnected ? "Online" : "Offline"}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Status</span>
                      <span>{botStatus?.isActive ? "Active" : "Inactive"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Servers</span>
                      <span>{botStatus?.serverCount || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Uptime</span>
                      <span>{formatUptime(botStatus?.uptime || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Activity</span>
                      <span>{botStatus?.activityType} {botStatus?.activityStatus}</span>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900" 
                  disabled={!botStatus?.isConnected}
                >
                  <Power className="mr-2 h-4 w-4" />
                  {botStatus?.isActive ? "Stop Bot" : "Start Bot"}
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Activity Management Card */}
          <div className="w-full md:w-2/3">
            <Card className="bg-black/40 border border-purple-800/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Bot Activity</CardTitle>
                <CardDescription>
                  Change how your bot appears in Discord
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="activityType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Activity Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select activity type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="PLAYING">Playing</SelectItem>
                              <SelectItem value="WATCHING">Watching</SelectItem>
                              <SelectItem value="LISTENING">Listening to</SelectItem>
                              <SelectItem value="COMPETING">Competing in</SelectItem>
                              <SelectItem value="STREAMING">Streaming</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            This determines how your bot's activity will be displayed
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="activityText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Activity Text</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter activity text" {...field} />
                          </FormControl>
                          <FormDescription>
                            This is the text that will be displayed as your bot's activity
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
                        disabled={updateActivityMutation.isPending || !botStatus?.isConnected}
                      >
                        {updateActivityMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          "Update Activity"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Additional cards can be added here for other functionality */}
            {/* Example: Server Analytics, Command Management, etc. */}
          </div>
        </div>
      </main>
    </div>
  );
}