import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Line, Bar } from "recharts";
import { 
  Chart, 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent, 
  ChartArea,
  ChartLine,
  ChartXAxis,
  ChartYAxis,
  ChartLegend, 
  ChartBar
} from "@/components/ui/chart";
import { useState } from "react";
import { formatDistance } from "date-fns";

interface DiscordServer {
  id: number;
  serverId: string;
  serverName: string;
  memberCount: number;
  joinedAt: string;
}

interface AnalyticsData {
  id: number;
  timestamp: string;
  commandsUsed: number;
  activeUsers: number;
  uptime: number;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  return formatDistance(date, new Date(), { addSuffix: true });
};

export default function Analytics() {
  const [chartView, setChartView] = useState<'commands' | 'users'>('commands');

  // Fetch server stats
  const { data: serverData, isLoading: isLoadingServers } = useQuery<{ count: number; servers: DiscordServer[] }>({
    queryKey: ['/api/analytics/servers'],
  });

  // Fetch analytics data
  const { data: analyticsData, isLoading: isLoadingAnalytics } = useQuery<AnalyticsData[]>({
    queryKey: ['/api/analytics/data'],
  });

  const formattedData = analyticsData?.map(item => ({
    date: formatDate(item.timestamp),
    commands: item.commandsUsed,
    users: item.activeUsers,
    uptime: item.uptime
  }));

  if (isLoadingServers || isLoadingAnalytics) {
    return (
      <section className="mb-12">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-white mb-2">Analytics</h1>
          <p className="text-gray-400">View statistics and metrics for your Discord bot</p>
        </header>
        <div className="grid grid-cols-1 gap-8 animate-pulse">
          <div className="bg-discord-dark rounded-lg shadow-lg p-6">
            <div className="h-6 bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gray-700 rounded w-full"></div>
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
        <h1 className="text-3xl font-semibold text-white mb-2">Analytics</h1>
        <p className="text-gray-400">View statistics and metrics for your Discord bot</p>
      </header>

      {/* Usage Metrics */}
      <Card className="bg-discord-dark rounded-lg shadow-lg p-6 mb-8">
        <CardContent className="p-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Usage Metrics</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setChartView('commands')}
                className={`px-3 py-1 rounded text-sm ${chartView === 'commands' ? 'bg-discord-blurple text-white' : 'bg-gray-700 text-gray-300'}`}
              >
                Commands
              </button>
              <button
                onClick={() => setChartView('users')}
                className={`px-3 py-1 rounded text-sm ${chartView === 'users' ? 'bg-discord-blurple text-white' : 'bg-gray-700 text-gray-300'}`}
              >
                Users
              </button>
            </div>
          </div>

          <div className="h-[350px] w-full">
            {formattedData && (
              <ChartContainer
                data={formattedData}
                className="h-full"
              >
                <ChartTooltip>
                  <ChartTooltipContent />
                </ChartTooltip>
                <ChartLegend className="text-gray-400" />
                <ChartXAxis 
                  dataKey="date" 
                  tickLine={false}
                  axisLine={true}
                  tickFormatter={(value) => value}
                  className="text-gray-500"
                />
                <ChartYAxis 
                  tickLine={false}
                  axisLine={true}
                  className="text-gray-500"
                />
                {chartView === 'commands' ? (
                  <ChartArea key="commands">
                    <ChartLine 
                      dataKey="commands"
                      strokeWidth={2}
                      activeDot={{
                        r: 6,
                        style: { fill: "var(--chart-1)" }
                      }}
                    />
                  </ChartArea>
                ) : (
                  <ChartBar
                    dataKey="users"
                    className="fill-blue-500"
                  />
                )}
              </ChartContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Server Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card className="bg-discord-dark rounded-lg shadow-lg p-6">
          <CardContent className="p-0">
            <h2 className="text-xl font-semibold text-white mb-6">Server Statistics</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-discord-blurple bg-opacity-20 text-discord-blurple mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="M6 8h.01" />
                      <path d="M2 12h20" />
                      <path d="M6 16h.01" />
                      <path d="M18 8h.01" />
                      <path d="M18 16h.01" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Total Servers</p>
                    <p className="text-2xl font-bold text-white">{serverData?.count || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-500 bg-opacity-20 text-purple-500 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Total Members</p>
                    <p className="text-2xl font-bold text-white">
                      {serverData?.servers.reduce((sum, server) => sum + server.memberCount, 0) || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <h3 className="text-white font-medium mb-3">Recently Joined Servers</h3>
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Server</th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Members</th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {serverData?.servers.slice(0, 5).map((server) => (
                    <tr key={server.id}>
                      <td className="px-4 py-3 text-sm text-white">{server.serverName}</td>
                      <td className="px-4 py-3 text-sm text-white">{server.memberCount}</td>
                      <td className="px-4 py-3 text-sm text-gray-400">{timeAgo(server.joinedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-discord-dark rounded-lg shadow-lg p-6">
          <CardContent className="p-0">
            <h2 className="text-xl font-semibold text-white mb-6">Feature Usage</h2>
            
            <div className="space-y-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-white">Economy Commands</h3>
                  <span className="text-sm text-gray-400">32%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '32%' }}></div>
                </div>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-white">Level Commands</h3>
                  <span className="text-sm text-gray-400">28%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '28%' }}></div>
                </div>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-white">Music Commands</h3>
                  <span className="text-sm text-gray-400">20%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-white">Game Commands</h3>
                  <span className="text-sm text-gray-400">15%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-white">Utility Commands</h3>
                  <span className="text-sm text-gray-400">5%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '5%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Uptime Stats */}
      <Card className="bg-discord-dark rounded-lg shadow-lg p-6">
        <CardContent className="p-0">
          <h2 className="text-xl font-semibold text-white mb-6">Bot Uptime</h2>
          
          <div className="h-[250px] w-full">
            {formattedData && (
              <ChartContainer
                data={formattedData}
                className="h-full"
              >
                <ChartTooltip>
                  <ChartTooltipContent />
                </ChartTooltip>
                <ChartXAxis 
                  dataKey="date" 
                  tickLine={false}
                  axisLine={true}
                  tickFormatter={(value) => value}
                  className="text-gray-500"
                />
                <ChartYAxis 
                  tickLine={false}
                  axisLine={true}
                  tickFormatter={(value) => `${value}%`}
                  className="text-gray-500"
                />
                <ChartLine 
                  dataKey="uptime"
                  stroke="#10b981"
                  strokeWidth={2}
                  activeDot={{
                    r: 6,
                    style: { fill: "#10b981" }
                  }}
                />
              </ChartContainer>
            )}
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-white">Last 24 hours</h3>
                <span className="text-sm text-green-400 font-semibold">100%</span>
              </div>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-white">Last 7 days</h3>
                <span className="text-sm text-green-400 font-semibold">99.8%</span>
              </div>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-white">Last 30 days</h3>
                <span className="text-sm text-green-400 font-semibold">99.5%</span>
              </div>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-white">All time</h3>
                <span className="text-sm text-green-400 font-semibold">98.7%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
