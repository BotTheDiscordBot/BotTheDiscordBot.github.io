import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { BotStatus, formatUptime } from "@/lib/discordBot";

const StatusCard: React.FC = () => {
  const { data: statusData, isLoading, error } = useQuery<BotStatus>({
    queryKey: ['/api/bot/status'],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  if (isLoading) {
    return (
      <Card className="bg-discord-dark p-6 rounded-lg shadow-lg mb-8">
        <CardContent className="p-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Bot Status</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-300">Status:</span>
              <span className="px-2 py-1 rounded text-xs font-medium bg-gray-500 text-white">Loading...</span>
            </div>
          </div>
          
          <div className="flex flex-wrap animate-pulse">
            {Array(4).fill(0).map((_, index) => (
              <div key={index} className="w-full md:w-1/2 lg:w-1/4 p-2">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-gray-700 mr-4 w-10 h-10"></div>
                    <div>
                      <div className="h-4 bg-gray-700 rounded w-16 mb-2"></div>
                      <div className="h-6 bg-gray-700 rounded w-12"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !statusData) {
    return (
      <Card className="bg-discord-dark p-6 rounded-lg shadow-lg mb-8">
        <CardContent className="p-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Bot Status</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-300">Status:</span>
              <span className="px-2 py-1 rounded text-xs font-medium bg-red-500 text-white">Error</span>
            </div>
          </div>
          <p className="text-red-400">Failed to load bot status. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-discord-dark p-6 rounded-lg shadow-lg mb-8">
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">Bot Status</h2>
            {statusData.activityStatus && (
              <div className="mt-1 text-sm text-purple-400 font-medium">
                Activity: {statusData.activityStatus}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-300">Status:</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${statusData.isConnected ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
              {statusData.isConnected ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/2 lg:w-1/4 p-2">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-discord-blurple bg-opacity-20 text-discord-blurple mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="M6 8h.01" />
                    <path d="M2 12h20" />
                    <path d="M6 16h.01" />
                    <path d="M18 8h.01" />
                    <path d="M18 16h.01" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Servers</p>
                  <p className="text-2xl font-bold text-white">{statusData.serverCount}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 lg:w-1/4 p-2">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-500 bg-opacity-20 text-purple-500 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Users</p>
                  <p className="text-2xl font-bold text-white">5,732</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 lg:w-1/4 p-2">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-500 bg-opacity-20 text-blue-500 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m4 17 6-6-6-6" />
                    <path d="M12 19h8" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Commands Used</p>
                  <p className="text-2xl font-bold text-white">18,349</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 lg:w-1/4 p-2">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-amber-500 bg-opacity-20 text-amber-500 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Uptime</p>
                  <p className="text-lg font-bold text-white">
                    {statusData.isConnected
                      ? formatUptime(statusData.uptime)
                      : "Offline"
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusCard;
