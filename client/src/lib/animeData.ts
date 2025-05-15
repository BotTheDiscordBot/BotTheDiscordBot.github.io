// Sample URLs for anime characters
export const animeCharacters = [
  {
    id: 1,
    imageUrl: "https://images.unsplash.com/photo-1580477667995-2b94f01c9516?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
    title: "Naruto",
    difficulty: "Easy"
  },
  {
    id: 2,
    imageUrl: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
    title: "One Piece",
    difficulty: "Easy"
  },
  {
    id: 3,
    imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
    title: "Attack on Titan",
    difficulty: "Medium"
  },
  {
    id: 4,
    imageUrl: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
    title: "Demon Slayer",
    difficulty: "Medium"
  },
  {
    id: 5,
    imageUrl: "https://images.unsplash.com/photo-1580477667995-2b94f01c9516?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
    title: "My Hero Academia",
    difficulty: "Medium"
  },
  {
    id: 6,
    imageUrl: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
    title: "Dragon Ball",
    difficulty: "Easy"
  }
];

// Demo data for anime game settings
export const defaultAnimeGameSettings = {
  difficulty: "Medium",
  timeLimit: 60,
  reward: 50,
  cooldown: 30,
  channels: ["main-chat", "gaming"]
};

// List of available difficulties
export const difficulties = ["Easy", "Medium", "Hard"];

// List of available anime games
export const availableGames = [
  {
    id: 1,
    name: "Guess That Anime",
    description: "Guess anime from screenshots",
    command: "!anime",
    isActive: true
  },
  {
    id: 2,
    name: "Trivia",
    description: "Answer trivia questions",
    command: "!trivia",
    isActive: false
  },
  {
    id: 3,
    name: "Rock Paper Scissors",
    description: "Play against the bot or others",
    command: "!rps",
    isActive: false
  },
  {
    id: 4,
    name: "Hangman",
    description: "Guess the word before time runs out",
    command: "!hangman",
    isActive: false
  }
];
