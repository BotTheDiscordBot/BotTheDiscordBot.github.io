import StatusCard from "@/components/status-card";
import QuickActions from "@/components/quick-actions";
import Credits from "@/components/credits";
import { useQuery } from "@tanstack/react-query";
import { BotStatus } from "@/lib/discordBot";

export default function Dashboard() {
  const { data: statusData } = useQuery<BotStatus>({
    queryKey: ['/api/bot/status'],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const isOnline = statusData?.isConnected || false;

  return (
    <section className="mb-12">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-white mb-2">Bot Dashboard</h1>
        <p className="text-gray-400">Manage and monitor your Discord bot</p>
      </header>

      {/* Status Card */}
      <StatusCard />

      {/* Quick Actions */}
      <QuickActions />

      {/* System Overview */}
      <div className="bg-discord-dark rounded-lg shadow-lg p-6 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">System Overview</h2>
          <span className={`px-2 py-1 rounded text-xs font-medium ${isOnline ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
            {isOnline ? 'System Online' : 'System Offline'}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-5 rounded-lg">
            <h3 className="text-lg font-medium text-white mb-4">Active Features</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Economy System</span>
                <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Level System</span>
                <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Music Player</span>
                <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Mini-Games</span>
                <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Moderation Tools</span>
                <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 p-5 rounded-lg">
            <h3 className="text-lg font-medium text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-start text-sm">
                <div className="min-w-8 mt-0.5">
                  <span className="h-2 w-2 rounded-full bg-blue-500 inline-block"></span>
                </div>
                <div>
                  <p className="text-gray-300">User gained a level</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start text-sm">
                <div className="min-w-8 mt-0.5">
                  <span className="h-2 w-2 rounded-full bg-yellow-500 inline-block"></span>
                </div>
                <div>
                  <p className="text-gray-300">Shop item purchased</p>
                  <p className="text-xs text-gray-500">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start text-sm">
                <div className="min-w-8 mt-0.5">
                  <span className="h-2 w-2 rounded-full bg-green-500 inline-block"></span>
                </div>
                <div>
                  <p className="text-gray-300">New server joined</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start text-sm">
                <div className="min-w-8 mt-0.5">
                  <span className="h-2 w-2 rounded-full bg-purple-500 inline-block"></span>
                </div>
                <div>
                  <p className="text-gray-300">Music session ended</p>
                  <p className="text-xs text-gray-500">3 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-400">
          <p>For detailed analytics and server statistics, visit the <a href="/analytics" className="text-discord-blurple hover:underline">Analytics</a> page.</p>
        </div>
      </div>

      {/* Credits */}
      <div className="mt-8">
        <Credits />
      </div>
    </section>
  );
}
