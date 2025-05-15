import { Client, Events, Message, TextChannel, VoiceChannel, EmbedBuilder } from "discord.js";
import { IStorage } from "../storage";

// This is a simplified mock implementation of music functionality
// In a real bot, you would use a library like discord-player or similar

interface QueueItem {
  title: string;
  requestedBy: string;
  duration: string;
  url: string;
}

interface GuildQueue {
  textChannel: string;
  voiceChannel: string;
  playing: boolean;
  songs: QueueItem[];
  volume: number;
}

const queues = new Map<string, GuildQueue>();

export async function setupMusic(client: Client, storage: IStorage) {
  // Get bot configuration for prefix
  const botConfig = await storage.getBotConfig();
  const prefix = botConfig?.prefix || "!!";
  
  // Get music settings
  const musicSettings = await storage.getMusicSettings();
  
  // Set up event listener
  client.on(Events.MessageCreate, async (message: Message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();
    
    if (!commandName) return;
    
    // Music commands
    if (commandName === "play") {
      await handlePlayCommand(message, args, storage);
    } else if (commandName === "skip") {
      await handleSkipCommand(message, storage);
    } else if (commandName === "stop") {
      await handleStopCommand(message, storage);
    } else if (commandName === "queue") {
      await handleQueueCommand(message, storage);
    } else if (commandName === "pause") {
      await handlePauseCommand(message, storage);
    } else if (commandName === "resume") {
      await handleResumeCommand(message, storage);
    } else if (commandName === "volume") {
      await handleVolumeCommand(message, args, storage);
    }
  });
  
  // Set up automatic disconnect timer
  setInterval(() => checkInactiveVoiceConnections(client, storage), 60000); // Check every minute
}

async function checkInactiveVoiceConnections(client: Client, storage: IStorage) {
  const musicSettings = await storage.getMusicSettings();
  const disconnectTimeout = (musicSettings?.disconnectTimeout || 5) * 60000; // Convert to milliseconds
  
  // This is a simplified version, in production you'd track last activity times
}

async function handlePlayCommand(message: Message, args: string[], storage: IStorage) {
  if (!message.guild) return;
  
  if (args.length === 0) {
    return message.reply("Please provide a song title or URL to play.");
  }
  
  // Check if user is in a voice channel
  const voiceChannel = message.member?.voice.channel;
  if (!voiceChannel) {
    return message.reply("You need to be in a voice channel to play music!");
  }
  
  // For demo, just simulate adding a song to queue
  const query = args.join(" ");
  const songInfo = {
    title: `Song matching "${query}"`, // In a real bot, this would be the actual song title
    requestedBy: message.author.username,
    duration: "3:45", // Mock duration
    url: "https://example.com" // Mock URL
  };
  
  // Get or create queue for this guild
  let queue = queues.get(message.guild.id);
  if (!queue) {
    queue = {
      textChannel: message.channel.id,
      voiceChannel: voiceChannel.id,
      playing: false,
      songs: [],
      volume: 70 // Default volume
    };
    queues.set(message.guild.id, queue);
  }
  
  // Add song to queue
  queue.songs.push(songInfo);
  
  const musicSettings = await storage.getMusicSettings();
  
  if (queue.songs.length === 1) {
    // This is the first song, start playing
    queue.playing = true;
    
    message.channel.send({
      embeds: [{
        title: "🎵 Now Playing",
        description: `[${songInfo.title}](${songInfo.url})`,
        fields: [
          { name: "Duration", value: songInfo.duration, inline: true },
          { name: "Requested By", value: songInfo.requestedBy, inline: true }
        ],
        color: 0x3498DB,
        footer: { text: "Music Player" }
      }]
    });
  } else {
    // Added to queue
    message.channel.send({
      embeds: [{
        title: "🎵 Added to Queue",
        description: `[${songInfo.title}](${songInfo.url})`,
        fields: [
          { name: "Position", value: queue.songs.length.toString(), inline: true },
          { name: "Duration", value: songInfo.duration, inline: true },
          { name: "Requested By", value: songInfo.requestedBy, inline: true }
        ],
        color: 0x3498DB,
        footer: { text: "Music Player" }
      }]
    });
  }
}

async function handleSkipCommand(message: Message, storage: IStorage) {
  if (!message.guild) return;
  
  // Check if user is in correct voice channel
  const voiceChannel = message.member?.voice.channel;
  if (!voiceChannel) {
    return message.reply("You need to be in a voice channel to skip music!");
  }
  
  const queue = queues.get(message.guild.id);
  if (!queue) {
    return message.reply("There is no song playing.");
  }
  
  // Check if user has DJ role if restriction is enabled
  const musicSettings = await storage.getMusicSettings();
  const isDJRestricted = musicSettings?.restrictSkipCommand;
  
  if (isDJRestricted) {
    const djRole = message.guild.roles.cache.find(r => r.name === musicSettings?.djRoleName);
    const hasDJRole = djRole && message.member?.roles.cache.has(djRole.id);
    
    if (!hasDJRole) {
      return message.reply(`You need the ${musicSettings?.djRoleName} role to use this command.`);
    }
  }
  
  // Skip the song
  const skippedSong = queue.songs.shift();
  
  if (queue.songs.length === 0) {
    queue.playing = false;
    message.channel.send("⏭️ Skipped the song. Queue is now empty.");
  } else {
    const nextSong = queue.songs[0];
    message.channel.send({
      embeds: [{
        title: "⏭️ Skipped",
        description: `Skipped [${skippedSong?.title}](${skippedSong?.url})`,
        fields: [
          { name: "Now Playing", value: `[${nextSong.title}](${nextSong.url})` }
        ],
        color: 0x3498DB,
        footer: { text: "Music Player" }
      }]
    });
  }
}

async function handleStopCommand(message: Message, storage: IStorage) {
  if (!message.guild) return;
  
  // Check if user is in correct voice channel
  const voiceChannel = message.member?.voice.channel;
  if (!voiceChannel) {
    return message.reply("You need to be in a voice channel to stop music!");
  }
  
  const queue = queues.get(message.guild.id);
  if (!queue) {
    return message.reply("There is no song playing.");
  }
  
  // Clear queue and stop playing
  queue.songs = [];
  queue.playing = false;
  
  message.channel.send("⏹️ Stopped music and cleared the queue.");
}

async function handleQueueCommand(message: Message, storage: IStorage) {
  if (!message.guild) return;
  
  const queue = queues.get(message.guild.id);
  if (!queue) {
    return message.reply("There is no music playing.");
  }
  
  if (queue.songs.length === 0) {
    return message.reply("The queue is empty.");
  }
  
  const currentSong = queue.songs[0];
  const upcomingSongs = queue.songs.slice(1, 10); // Show up to 10 songs in queue
  
  const queueEmbed = new EmbedBuilder()
    .setTitle("Music Queue")
    .setColor(0x3498DB)
    .addFields(
      { name: "Now Playing", value: `[${currentSong.title}](${currentSong.url}) | Requested by: ${currentSong.requestedBy}` }
    );
  
  if (upcomingSongs.length > 0) {
    queueEmbed.addFields(
      { name: "Up Next", value: upcomingSongs.map((song, index) => 
        `${index + 1}. [${song.title}](${song.url}) | Requested by: ${song.requestedBy}`
      ).join("\n") }
    );
  }
  
  if (queue.songs.length > 11) {
    queueEmbed.setFooter({ text: `And ${queue.songs.length - 11} more songs in queue` });
  } else {
    queueEmbed.setFooter({ text: "Music Player" });
  }
  
  message.channel.send({ embeds: [queueEmbed] });
}

async function handlePauseCommand(message: Message, storage: IStorage) {
  if (!message.guild) return;
  
  // Check if user is in correct voice channel
  const voiceChannel = message.member?.voice.channel;
  if (!voiceChannel) {
    return message.reply("You need to be in a voice channel to pause music!");
  }
  
  const queue = queues.get(message.guild.id);
  if (!queue) {
    return message.reply("There is no music playing.");
  }
  
  if (!queue.playing) {
    return message.reply("The music is already paused.");
  }
  
  // Pause the music
  queue.playing = false;
  
  message.channel.send("⏸️ Paused the music.");
}

async function handleResumeCommand(message: Message, storage: IStorage) {
  if (!message.guild) return;
  
  // Check if user is in correct voice channel
  const voiceChannel = message.member?.voice.channel;
  if (!voiceChannel) {
    return message.reply("You need to be in a voice channel to resume music!");
  }
  
  const queue = queues.get(message.guild.id);
  if (!queue) {
    return message.reply("There is no music in the queue.");
  }
  
  if (queue.playing) {
    return message.reply("The music is already playing.");
  }
  
  // Resume the music
  queue.playing = true;
  
  message.channel.send("▶️ Resumed the music.");
}

async function handleVolumeCommand(message: Message, args: string[], storage: IStorage) {
  if (!message.guild) return;
  
  // Check if user is in correct voice channel
  const voiceChannel = message.member?.voice.channel;
  if (!voiceChannel) {
    return message.reply("You need to be in a voice channel to change the volume!");
  }
  
  // Check if user has DJ role if restriction is enabled
  const musicSettings = await storage.getMusicSettings();
  const isDJRestricted = musicSettings?.restrictVolumeCommand;
  
  if (isDJRestricted) {
    const djRole = message.guild.roles.cache.find(r => r.name === musicSettings?.djRoleName);
    const hasDJRole = djRole && message.member?.roles.cache.has(djRole.id);
    
    if (!hasDJRole) {
      return message.reply(`You need the ${musicSettings?.djRoleName} role to use this command.`);
    }
  }
  
  const queue = queues.get(message.guild.id);
  if (!queue) {
    return message.reply("There is no music playing.");
  }
  
  if (args.length === 0) {
    return message.reply(`The current volume is: **${queue.volume}%**`);
  }
  
  const volume = parseInt(args[0]);
  if (isNaN(volume) || volume < 0 || volume > 100) {
    return message.reply("Please provide a valid volume between 0 and 100.");
  }
  
  // Set the volume
  queue.volume = volume;
  
  message.channel.send(`🔊 Volume set to: **${volume}%**`);
}
