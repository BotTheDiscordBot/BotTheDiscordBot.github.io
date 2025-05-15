import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Play, 
  Trophy, 
  Music, 
  Users, 
  Shield, 
  Zap, 
  ChevronRight, 
  HeartHandshake, 
  Gamepad2, 
  Coins,
  BarChart,
  Star,
  Settings,
  MessageCircle
} from "lucide-react";

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const features = [
    { 
      icon: <Trophy className="h-6 w-6 text-yellow-400" />, 
      title: "Advanced Leveling", 
      description: "Customizable XP rates, level-up notifications, and role rewards for active members" 
    },
    { 
      icon: <Coins className="h-6 w-6 text-yellow-500" />, 
      title: "Economy System", 
      description: "Currency, daily rewards, shop items, and interactive economy games" 
    },
    { 
      icon: <Music className="h-6 w-6 text-purple-400" />, 
      title: "High-Quality Music", 
      description: "Stream music from YouTube, Spotify, and SoundCloud with DJ controls" 
    },
    { 
      icon: <Gamepad2 className="h-6 w-6 text-green-400" />, 
      title: "Fun Minigames", 
      description: "Anime guessing games, trivia, rock-paper-scissors, and more" 
    },
    { 
      icon: <Shield className="h-6 w-6 text-blue-400" />, 
      title: "Server Moderation", 
      description: "Advanced moderation tools to keep your server safe and friendly" 
    },
    { 
      icon: <Settings className="h-6 w-6 text-gray-400" />, 
      title: "Full Customization", 
      description: "Configure every aspect of the bot through the admin dashboard" 
    },
  ];

  const stats = [
    { value: "20,000+", label: "Custom Features" },
    { value: "99.9%", label: "Uptime" },
    { value: "24/7", label: "Support" },
    { value: "Unlimited", label: "Potential" },
  ];

  const testimonials = [
    { 
      name: "Server Owner", 
      role: "Gaming Community", 
      content: "This bot has transformed our server! The economy system keeps our members engaged every day." 
    },
    { 
      name: "Anime Fan", 
      role: "Anime Server Admin", 
      content: "The anime guessing game is addictive. Our members love competing to identify characters!" 
    },
    { 
      name: "Music Lover", 
      role: "Music Server", 
      content: "Best music quality I've experienced with any Discord bot. No lag and perfect controls." 
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/30 to-black text-white overflow-x-hidden">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-2"
        >
          <div className="bg-purple-600 rounded-full p-2">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white via-purple-300 to-purple-500 text-transparent bg-clip-text">
            JahBot
          </span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-6"
        >
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#games" className="text-gray-300 hover:text-white transition-colors">Games</a>
            <a href="#economy" className="text-gray-300 hover:text-white transition-colors">Economy</a>
            <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Testimonials</a>
          </nav>
          <Link href="/auth">
            <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-950 hover:text-purple-200">
              Dashboard
            </Button>
          </Link>
        </motion.div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-white via-purple-300 to-purple-600 text-transparent bg-clip-text">
            The Ultimate Discord Bot for Your Server
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Enhance your Discord server with advanced economy, levels, music, anime games, and moderation features.
            All developed with ❤️ by Jahceere.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="https://discord.com/oauth2/authorize?client_id=1372422269602762843"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Button className="px-8 py-6 text-lg bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 rounded-xl">
                Add Bot to Discord
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </motion.a>
            <motion.a
              href="#features"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Button variant="outline" className="px-8 py-6 text-lg border-purple-500 text-white hover:bg-purple-950 hover:border-purple-400 rounded-xl">
                Explore Features
              </Button>
            </motion.a>
          </div>
        </motion.div>
        
        {/* Bot Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 relative w-full max-w-5xl"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-75"></div>
          <div className="relative bg-black rounded-2xl p-4">
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="flex items-center mb-4 border-b border-gray-800 pb-4">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <div className="text-gray-400 text-sm ml-2">JahBot - Discord</div>
              </div>
              <div className="space-y-4">
                <div className="flex">
                  <div className="bg-purple-600 rounded-full h-8 w-8 flex items-center justify-center mr-3">
                    <span className="text-white font-bold">J</span>
                  </div>
                  <div className="bg-gray-800 rounded-lg px-4 py-2 flex-grow">
                    <span className="text-gray-300">!!help</span>
                  </div>
                </div>
                <div className="flex">
                  <div className="bg-blue-600 rounded-full h-8 w-8 flex items-center justify-center mr-3">
                    <span className="text-white font-bold">B</span>
                  </div>
                  <div className="bg-gray-800 rounded-lg px-4 py-2 flex-grow">
                    <div className="border-l-4 border-purple-500 pl-3">
                      <div className="text-purple-400 font-medium">📚 JahBot Help Menu</div>
                      <div className="text-gray-300 mt-2">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>🎮 !!games - Minigames</div>
                          <div>💰 !!economy - Currency</div>
                          <div>🎵 !!play - Music</div>
                          <div>📊 !!level - Rank</div>
                          <div>🛡️ !!mod - Moderation</div>
                          <div>⚙️ !!settings - Config</div>
                        </div>
                        <div className="text-gray-400 text-xs mt-2">Developed by Jahceere • v2.1.0</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <motion.section
        initial="hidden"
        animate={isVisible ? "show" : "hidden"}
        variants={container}
        className="bg-black/50 backdrop-blur-sm py-16"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div 
                key={i} 
                variants={item} 
                className="text-center"
              >
                <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text mb-2">
                  {stat.value}
                </h3>
                <p className="text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Feature Section */}
      <section id="features" className="container mx-auto px-4 py-24">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-purple-300 to-purple-600 text-transparent bg-clip-text">
            Powerful Features for Your Discord Server
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            JahBot comes packed with everything you need to create an engaging community experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { 
                  opacity: 1, 
                  y: 0,
                  transition: { 
                    duration: 0.5,
                    delay: i * 0.1 
                  }
                }
              }}
              className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 hover:shadow-xl hover:shadow-purple-900/20 transition-all duration-300"
            >
              <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Games Section */}
      <section id="games" className="py-24 bg-gradient-to-br from-purple-950/20 via-black to-purple-950/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-purple-300 to-purple-600 text-transparent bg-clip-text">
              Exciting Mini-Games Collection
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Entertain your server members with a variety of interactive games
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-black/50 backdrop-blur-sm border border-purple-900/50 rounded-xl overflow-hidden"
            >
              <div className="h-48 bg-gradient-to-br from-purple-800 to-purple-950 flex items-center justify-center">
                <div className="text-5xl">🎮</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-white">Anime Guess</h3>
                <p className="text-gray-400 mb-4">Test your anime knowledge by guessing characters and series from images. Compete with friends for the highest score!</p>
                <div className="text-sm text-purple-400">
                  Commands: !!anime, !!animequiz, !!animeguess
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-black/50 backdrop-blur-sm border border-purple-900/50 rounded-xl overflow-hidden"
            >
              <div className="h-48 bg-gradient-to-br from-blue-800 to-blue-950 flex items-center justify-center">
                <div className="text-5xl">🎯</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-white">Trivia Challenge</h3>
                <p className="text-gray-400 mb-4">Multi-category trivia with thousands of questions. Challenge your server in various difficulty levels.</p>
                <div className="text-sm text-purple-400">
                  Commands: !!trivia, !!quiz, !!challenge
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-black/50 backdrop-blur-sm border border-purple-900/50 rounded-xl overflow-hidden"
            >
              <div className="h-48 bg-gradient-to-br from-green-800 to-green-950 flex items-center justify-center">
                <div className="text-5xl">🎲</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-white">Casino Games</h3>
                <p className="text-gray-400 mb-4">Play blackjack, slots, roulette and more to win in-server currency and climb the wealth leaderboard.</p>
                <div className="text-sm text-purple-400">
                  Commands: !!blackjack, !!slots, !!roulette
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <p className="text-gray-300 mb-6">And many more games: Rock-Paper-Scissors, Word Scramble, Hangman, and 20+ others!</p>
            <Button className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900">
              <Play className="h-4 w-4 mr-2" />
              View All Games
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Economy Section */}
      <section id="economy" className="container mx-auto px-4 py-24">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-purple-300 to-purple-600 text-transparent bg-clip-text">
            Advanced Economy System
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Create a thriving virtual economy in your Discord server
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6">
              <h3 className="flex items-center text-xl font-bold mb-3 text-white">
                <Coins className="h-5 w-5 mr-2 text-yellow-400" />
                Virtual Currency
              </h3>
              <p className="text-gray-400">
                Customizable currency name and symbol with balance tracking for all server members. Set starting balance and determine reward rates.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6">
              <h3 className="flex items-center text-xl font-bold mb-3 text-white">
                <HeartHandshake className="h-5 w-5 mr-2 text-green-400" />
                Daily Rewards
              </h3>
              <p className="text-gray-400">
                Incentivize daily activity with customizable daily reward amounts. Add streak bonuses to keep members coming back.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6">
              <h3 className="flex items-center text-xl font-bold mb-3 text-white">
                <Users className="h-5 w-5 mr-2 text-blue-400" />
                Transfer System
              </h3>
              <p className="text-gray-400">
                Allow members to send currency to each other, fostering community interactions and trade economies.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-75"></div>
            <div className="relative bg-black rounded-2xl p-4">
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-xl font-bold text-white">Server Shop</div>
                  <div className="text-sm text-yellow-400 flex items-center">
                    <Coins className="h-4 w-4 mr-1" />
                    1,250 Coins
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-800/50 p-4 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">VIP Role</div>
                      <div className="text-xs text-gray-400">Special access and colored name</div>
                    </div>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      <Coins className="h-3 w-3 mr-1" />
                      500
                    </Button>
                  </div>
                  
                  <div className="bg-gray-800/50 p-4 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">Custom Command</div>
                      <div className="text-xs text-gray-400">Create your own server command</div>
                    </div>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      <Coins className="h-3 w-3 mr-1" />
                      750
                    </Button>
                  </div>
                  
                  <div className="bg-gray-800/50 p-4 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">Rare Background</div>
                      <div className="text-xs text-gray-400">Exclusive profile background</div>
                    </div>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      <Coins className="h-3 w-3 mr-1" />
                      300
                    </Button>
                  </div>
                </div>
                
                <div className="mt-6 text-sm text-center text-gray-500">
                  Use !!shop to view all items
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-black/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-purple-300 to-purple-600 text-transparent bg-clip-text">
              What Server Owners Say
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Don't take our word for it - hear from Discord communities already using JahBot
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6"
              >
                <div className="flex items-center space-x-1 mb-4 text-yellow-400">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
                <p className="text-gray-300 mb-6">"{testimonial.content}"</p>
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-600 rounded-full h-10 w-10 flex items-center justify-center">
                    <span className="text-white font-bold">{testimonial.name[0]}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto text-center bg-gradient-to-br from-purple-900/50 to-purple-950/30 backdrop-blur-sm rounded-2xl p-12 border border-purple-800/30"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white via-purple-300 to-purple-600 text-transparent bg-clip-text">
            Ready to Transform Your Discord Server?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Join thousands of Discord communities already enjoying JahBot's extensive features and games.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="https://discord.com/oauth2/authorize?client_id=1372422269602762843"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Button className="px-8 py-6 text-lg bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 rounded-xl">
                Add JahBot to Discord
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </motion.a>
            <Link href="/auth">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <Button variant="outline" className="px-8 py-6 text-lg border-purple-500 text-white hover:bg-purple-950 hover:border-purple-400 rounded-xl">
                  Access Dashboard
                </Button>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-black/80 backdrop-blur-sm border-t border-gray-800 pt-12 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-purple-600 rounded-full p-2">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-white via-purple-300 to-purple-500 text-transparent bg-clip-text">
                  JahBot
                </span>
              </div>
              <p className="text-gray-400 mb-4">
                The ultimate Discord bot for community engagement, developed with passion by Jahceere.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Economy System</li>
                <li>Level Progression</li>
                <li>Music Player</li>
                <li>Anime Games</li>
                <li>Server Moderation</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>Command List</li>
                <li>Support Server</li>
                <li>Status Page</li>
                <li>Development Blog</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-4">Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="https://discord.com/oauth2/authorize?client_id=1372422269602762843" className="hover:text-purple-400 transition-colors">
                    Add to Discord
                  </a>
                </li>
                <li>
                  <Link href="/auth" className="hover:text-purple-400 transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm order-2 md:order-1">
              &copy; {new Date().getFullYear()} JahBot. All rights reserved. Developed by{" "}
              <span className="text-purple-400 font-medium">Jahceere</span>
            </p>
            <div className="flex space-x-4 mb-4 md:mb-0 order-1 md:order-2">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}