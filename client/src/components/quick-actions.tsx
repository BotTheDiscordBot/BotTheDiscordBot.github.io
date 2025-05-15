import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { startBot, stopBot, restartBot } from "@/lib/discordBot";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const QuickActions: React.FC = () => {
  const [isStartingBot, setIsStartingBot] = useState(false);
  const [isStoppingBot, setIsStoppingBot] = useState(false);
  const [isRestartingBot, setIsRestartingBot] = useState(false);
  const queryClient = useQueryClient();

  const handleStartBot = async () => {
    setIsStartingBot(true);
    try {
      const result = await startBot();
      toast({
        title: "Bot Started",
        description: result.message || "The bot has been started successfully.",
        variant: "default",
      });
      // Refresh the bot status
      queryClient.invalidateQueries({ queryKey: ['/api/bot/status'] });
    } catch (error) {
      console.error("Failed to start bot:", error);
      toast({
        title: "Error",
        description: "Failed to start the bot. Please check the token and try again.",
        variant: "destructive",
      });
    } finally {
      setIsStartingBot(false);
    }
  };

  const handleStopBot = async () => {
    setIsStoppingBot(true);
    try {
      const result = await stopBot();
      toast({
        title: "Bot Stopped",
        description: result.message || "The bot has been stopped successfully.",
        variant: "default",
      });
      // Refresh the bot status
      queryClient.invalidateQueries({ queryKey: ['/api/bot/status'] });
    } catch (error) {
      console.error("Failed to stop bot:", error);
      toast({
        title: "Error",
        description: "Failed to stop the bot. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsStoppingBot(false);
    }
  };

  const handleRestartBot = async () => {
    setIsRestartingBot(true);
    try {
      const result = await restartBot();
      toast({
        title: "Bot Restarted",
        description: result.message || "The bot has been restarted successfully.",
        variant: "default",
      });
      // Refresh the bot status
      queryClient.invalidateQueries({ queryKey: ['/api/bot/status'] });
    } catch (error) {
      console.error("Failed to restart bot:", error);
      toast({
        title: "Error",
        description: "Failed to restart the bot. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRestartingBot(false);
    }
  };

  const handleUpdateSettings = () => {
    toast({
      title: "Settings Updated",
      description: "Bot settings have been updated successfully.",
      variant: "default",
    });
  };

  return (
    <Card className="bg-discord-dark rounded-lg shadow-lg p-6">
      <CardContent className="p-0">
        <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button 
            disabled={isStartingBot}
            onClick={handleStartBot}
            className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
          >
            {isStartingBot ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Starting...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
                <span>Start Bot</span>
              </>
            )}
          </Button>
          
          <Button
            disabled={isStoppingBot}
            onClick={handleStopBot}
            className="bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
          >
            {isStoppingBot ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Stopping...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <rect width="6" height="16" x="4" y="4" rx="1" />
                  <rect width="6" height="16" x="14" y="4" rx="1" />
                </svg>
                <span>Stop Bot</span>
              </>
            )}
          </Button>
          
          <Button
            disabled={isRestartingBot}
            onClick={handleRestartBot}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
          >
            {isRestartingBot ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Restarting...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                  <path d="M16 21h5v-5" />
                </svg>
                <span>Restart Bot</span>
              </>
            )}
          </Button>
          
          <Button
            onClick={handleUpdateSettings}
            className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>Update Settings</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
