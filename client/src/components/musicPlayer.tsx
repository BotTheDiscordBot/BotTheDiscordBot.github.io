import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

const MusicPlayer: React.FC = () => {
  // Demo data
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState("1:42");
  const [totalTime, setTotalTime] = useState("3:45");
  const [progress, setProgress] = useState(45);
  const [queue, setQueue] = useState([
    { position: 1, title: "Another Great Song - Other Artist" },
    { position: 2, title: "Third Track Name - Different Artist" }
  ]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <div className="bg-gray-900 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center text-white mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            </div>
            <div>
              <h4 className="text-white font-medium">Now Playing</h4>
              <p className="text-gray-400 text-sm">Playing in: General Voice</p>
            </div>
          </div>
          <div>
            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">PLAYING</span>
          </div>
        </div>
        
        <div className="mb-4">
          <h5 className="text-white font-medium">Some Popular Song</h5>
          <p className="text-gray-400 text-sm">Artist Name - {totalTime}</p>
        </div>
        
        <div className="mb-4">
          <div className="w-full bg-gray-700 rounded-full h-1.5 mb-1">
            <div 
              className="bg-discord-blurple h-1.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>{currentTime}</span>
            <span>{totalTime}</span>
          </div>
        </div>
        
        <div className="flex justify-center space-x-4">
          <button className="text-gray-300 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m19 20-10-8 10-8v16Z" />
              <path d="M5 19V5" />
            </svg>
          </button>
          <button className="text-gray-300 hover:text-white" onClick={togglePlay}>
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="4" height="16" x="6" y="4" />
                <rect width="4" height="16" x="14" y="4" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </button>
          <button className="text-gray-300 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m5 4 10 8-10 8V4Z" />
              <path d="M19 5v14" />
            </svg>
          </button>
          <button className="text-gray-300 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="6" height="16" x="4" y="4" rx="1" />
              <rect width="6" height="16" x="14" y="4" rx="1" />
            </svg>
          </button>
          <button className="text-gray-300 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 8 12 22 21 22 3" />
              <polygon points="11 3 2 9.31 2 14.69 11 21 11 3" />
            </svg>
          </button>
          <button className="text-gray-300 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 0 1-9 9" />
              <path d="M3 12a9 9 0 0 1 9-9" />
              <path d="m21 3-9 9" />
              <path d="M3 21 12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="p-3 border-t border-gray-700">
        <h5 className="text-white font-medium mb-2">Queue ({queue.length})</h5>
        <ul className="space-y-2">
          {queue.map((item) => (
            <li key={item.position} className="flex items-center">
              <span className="w-5 h-5 flex items-center justify-center bg-gray-600 text-white rounded-full text-xs mr-2">
                {item.position}
              </span>
              <span className="text-sm text-gray-300">{item.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MusicPlayer;
