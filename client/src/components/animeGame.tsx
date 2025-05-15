import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface AnimeGameProps {
  imageUrl?: string;
  reward?: number;
  timeLimit?: number;
}

const AnimeGame: React.FC<AnimeGameProps> = ({ 
  imageUrl = "https://images.unsplash.com/photo-1578632767115-351597cf2477?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
  reward = 50, 
  timeLimit = 60
}) => {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit / 2); // Start halfway through for the preview
  const [progress, setProgress] = useState(50);
  const [answers, setAnswers] = useState([
    { user: "User#1234", answer: "Is it Dragon Ball?", correct: false },
    { user: "Bot", answer: "Incorrect! Try again.", correct: false, isBot: true },
    { user: "User#5678", answer: "Naruto?", correct: false },
    { user: "Bot", answer: "Incorrect! Try again.", correct: false, isBot: true }
  ]);

  // For the demo, we're not actually counting down
  useEffect(() => {
    setProgress((timeRemaining / timeLimit) * 100);
  }, [timeRemaining, timeLimit]);

  return (
    <Card className="border border-gray-700 rounded-lg overflow-hidden">
      {/* Anime screenshot for guessing */}
      <img 
        src={imageUrl} 
        alt="Anime screenshot for guessing game" 
        className="w-full h-64 object-cover"
      />
      
      <CardContent className="p-4 bg-gray-900">
        <div className="flex justify-between items-center mb-3">
          <p className="text-white font-medium">Guess That Anime!</p>
          <span className="text-gray-400 text-sm">Reward: {reward} 🪙</span>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Time remaining</span>
            <span>{Math.floor(timeRemaining)}s</span>
          </div>
          <Progress value={progress} className="h-2 bg-gray-700">
            <div 
              className="h-full bg-red-500 rounded-full" 
              style={{ width: `${progress}%` }}
            />
          </Progress>
        </div>
        
        <div className="text-sm text-gray-300 mb-3">Type your answer in this channel!</div>
        
        <div className="bg-gray-800 p-2 rounded text-gray-300 text-sm">
          {answers.map((answer, index) => (
            <p key={index}>
              <span className={`font-medium ${answer.isBot ? 'text-discord-blurple' : 'text-discord-blurple'}`}>
                {answer.user}:
              </span> {answer.answer}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnimeGame;
