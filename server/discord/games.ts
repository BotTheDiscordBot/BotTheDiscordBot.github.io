import { Client, Events, Message, EmbedBuilder, AttachmentBuilder } from "discord.js";
import { IStorage } from "../storage";

// In-memory maps to store game data
// In a real implementation, this would be stored in a database
const animeGames = new Map<string, {
  channelId: string;
  guildId: string;
  animeName: string;
  imageUrl: string;
  startTime: Date;
  hasEnded: boolean;
  reward: number;
}>();

const cooldowns = new Map<string, Date>();

export async function setupGames(client: Client, storage: IStorage) {
  // Get bot configuration for prefix
  const botConfig = await storage.getBotConfig();
  const prefix = botConfig?.prefix || "!!";
  
  // Set up event listener
  client.on(Events.MessageCreate, async (message: Message) => {
    if (message.author.bot) return;
    
    // Handle existing anime guessing games
    await checkAnimeGuess(message);
    
    // Handle game commands
    if (message.content.startsWith(prefix)) {
      const args = message.content.slice(prefix.length).trim().split(/ +/);
      const commandName = args.shift()?.toLowerCase();
      
      if (!commandName) return;
      
      // Game commands
      if (commandName === "anime") {
        await handleAnimeCommand(message, args, storage);
      }
    }
  });
}

async function checkAnimeGuess(message: Message) {
  if (!message.guild) return;
  
  // Check if there's an active game in this channel
  const activeGame = animeGames.get(message.channel.id);
  if (!activeGame || activeGame.hasEnded) return;
  
  // Check if the message is a guess
  if (message.content.toLowerCase() === activeGame.animeName.toLowerCase()) {
    // Correct guess!
    activeGame.hasEnded = true;
    
    // Award the user with coins (in a real bot, update their economy data)
    message.reply({
      embeds: [{
        title: "🎮 Correct!",
        description: `Congratulations ${message.author}! You guessed correctly: **${activeGame.animeName}**`,
        color: 0x2ECC71,
        footer: { text: `You've earned ${activeGame.reward} coins!` }
      }]
    });
  }
}

async function handleAnimeCommand(message: Message, args: string[], storage: IStorage) {
  if (!message.guild) return;
  
  // Get anime game settings
  const animeSettings = await storage.getAnimeGameSettings();
  
  // Check if the channel is allowed
  const allowedChannels = animeSettings?.channels || ["main-chat", "gaming"];
  if (!allowedChannels.includes(message.channel.name)) {
    return message.reply(`Anime guessing game can only be played in these channels: ${allowedChannels.join(", ")}`);
  }
  
  // Check cooldown
  const now = new Date();
  const cooldownMinutes = animeSettings?.cooldown || 30;
  const userId = message.author.id;
  const cooldownTime = cooldowns.get(userId);
  
  if (cooldownTime) {
    const timeLeft = cooldownMinutes * 60000 - (now.getTime() - cooldownTime.getTime());
    if (timeLeft > 0) {
      const minutesLeft = Math.floor(timeLeft / 60000);
      const secondsLeft = Math.floor((timeLeft % 60000) / 1000);
      return message.reply(`You need to wait ${minutesLeft}m ${secondsLeft}s before starting another anime guessing game.`);
    }
  }
  
  // Check if there's already an active game in this channel
  if (animeGames.get(message.channel.id) && !animeGames.get(message.channel.id)?.hasEnded) {
    return message.reply("There's already an active anime guessing game in this channel!");
  }
  
  // Get random anime from the database
  const animeDatabase = await storage.getAnimeDatabase();
  if (animeDatabase.length === 0) {
    return message.reply("There are no anime entries in the database yet!");
  }
  
  // Filter by difficulty if specified
  const difficulty = args.length > 0 ? args[0] : animeSettings?.difficulty;
  const filteredAnime = animeDatabase.filter(anime => 
    !difficulty || anime.difficulty.toLowerCase() === difficulty.toLowerCase()
  );
  
  if (filteredAnime.length === 0) {
    return message.reply(`No anime found with difficulty: ${difficulty}`);
  }
  
  // Pick a random anime
  const randomAnime = filteredAnime[Math.floor(Math.random() * filteredAnime.length)];
  
  // In a real bot, you would have actual image URLs for each anime
  // Here we're just using a placeholder
  const imageUrl = "https://images.unsplash.com/photo-1578632767115-351597cf2477?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450";
  
  // Create a new game
  animeGames.set(message.channel.id, {
    channelId: message.channel.id,
    guildId: message.guild.id,
    animeName: randomAnime.title,
    imageUrl,
    startTime: now,
    hasEnded: false,
    reward: animeSettings?.reward || 50
  });
  
  // Set cooldown for the user
  cooldowns.set(userId, now);
  
  // Send game message
  const timeLimit = animeSettings?.timeLimit || 60;
  
  const embed = new EmbedBuilder()
    .setTitle("🎮 Guess That Anime!")
    .setDescription(`You have ${timeLimit} seconds to guess the anime from this image.`)
    .setColor(0xFF5733)
    .addFields(
      { name: "Difficulty", value: randomAnime.difficulty, inline: true },
      { name: "Reward", value: `${animeSettings?.reward || 50} coins`, inline: true }
    )
    .setImage(imageUrl)
    .setFooter({ text: "Type your answer in the chat!" })
    .setTimestamp();
  
  const gameMessage = await message.channel.send({ embeds: [embed] });
  
  // Set timer to end the game
  setTimeout(() => {
    const game = animeGames.get(message.channel.id);
    if (game && !game.hasEnded) {
      game.hasEnded = true;
      message.channel.send({
        embeds: [{
          title: "⌛ Time's Up!",
          description: `Nobody guessed correctly! The anime was: **${game.animeName}**`,
          color: 0xE74C3C,
          footer: { text: "Better luck next time!" }
        }]
      });
    }
  }, timeLimit * 1000);
}
