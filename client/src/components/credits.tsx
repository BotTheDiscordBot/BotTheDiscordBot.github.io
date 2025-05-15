import { Card, CardContent } from "@/components/ui/card";
import { FaDiscord } from "react-icons/fa";

const Credits: React.FC = () => {
  return (
    <Card className="bg-discord-dark rounded-lg shadow-lg p-6 text-center">
      <CardContent className="p-0">
        <h2 className="text-2xl font-semibold text-white mb-2">Credits</h2>
        <p className="text-gray-400 mb-6">Developed and designed with ❤️</p>
        
        <div className="inline-flex items-center justify-center bg-gray-800 px-6 py-3 rounded-full">
          <div className="flex items-center">
            <FaDiscord className="text-discord-blurple text-xl mr-2" />
            <span className="text-white font-medium">jahceere on Discord</span>
          </div>
        </div>
        
        <div className="mt-8 text-sm text-gray-400">
          <p>This bot was created with Discord.js and Express. Special thanks to everyone who contributed to this project.</p>
          <p className="mt-2">© 2023 All Rights Reserved</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Credits;
