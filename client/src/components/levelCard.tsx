import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const LevelCard: React.FC = () => {
  // Demo data
  const userData = {
    username: "User#1234",
    level: 15,
    currentXP: 5432,
    maxXP: 8000,
    nextLevelXP: 2568,
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&h=128"
  };

  // Calculate progress percentage
  const progressPercentage = Math.floor((userData.currentXP / userData.maxXP) * 100);

  return (
    <Card className="bg-gray-800 rounded-lg p-4 mb-4">
      <CardContent className="p-0">
        <div className="flex items-center mb-3">
          <img 
            src={userData.avatarUrl} 
            alt="User avatar" 
            className="w-16 h-16 rounded-full mr-3"
          />
          <div>
            <h4 className="text-white font-semibold">{userData.username}</h4>
            <p className="text-gray-400 text-sm">Level {userData.level}</p>
          </div>
        </div>
        
        <div className="mb-2">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{userData.currentXP.toLocaleString()} / {userData.maxXP.toLocaleString()} XP</span>
            <span>{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="w-full h-2.5 bg-gray-700">
            <div 
              className="h-full bg-discord-blurple rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            />
          </Progress>
        </div>
        
        <div className="text-xs text-gray-400">
          <p>Next level: {userData.nextLevelXP.toLocaleString()} XP needed</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LevelCard;
