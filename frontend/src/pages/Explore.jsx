import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { X, Home, Bookmark, User, ShoppingCart, Map, Sparkles, Lock, CheckCircle2, Trophy, Star, Zap, Crown, Gift, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

// Fashion destination data with styles and coordinates
const FASHION_DESTINATIONS = [
  {
    id: 'streetwear',
    name: 'Urban Streets',
    emoji: '🏙️',
    description: 'Bold, casual, and edgy street fashion',
    position: 78,
    color: 'from-orange-500 to-red-500',
    styles: ['streetwear', 'urban', 'hip-hop', 'skater'],
    unlocked: true,
    level: 1,
    xpRequired: 0,
  },
  {
    id: 'minimalist',
    name: 'Minimalist Haven',
    emoji: '⚪',
    description: 'Clean lines, neutral colors, timeless elegance',
    position: 65,
    color: 'from-gray-400 to-gray-600',
    styles: ['minimalist', 'modern', 'scandinavian'],
    unlocked: true,
    level: 2,
    xpRequired: 100,
  },
  {
    id: 'vintage',
    name: 'Vintage Valley',
    emoji: '🕰️',
    description: 'Retro vibes from the golden eras',
    position: 52,
    color: 'from-amber-500 to-yellow-600',
    styles: ['vintage', 'retro', '70s', '80s', '90s'],
    unlocked: false,
    level: 3,
    xpRequired: 250,
  },
  {
    id: 'bohemian',
    name: 'Boho Beach',
    emoji: '🌺',
    description: 'Free-spirited, artistic, and eclectic',
    position: 39,
    color: 'from-pink-500 to-purple-500',
    styles: ['bohemian', 'boho', 'hippie', 'festival'],
    unlocked: false,
    level: 4,
    xpRequired: 450,
  },
  {
    id: 'formal',
    name: 'Elegance Plaza',
    emoji: '👔',
    description: 'Sophisticated, refined, and professional',
    position: 26,
    color: 'from-blue-600 to-indigo-700',
    styles: ['formal', 'business', 'professional', 'elegant'],
    unlocked: false,
    level: 5,
    xpRequired: 700,
  },
  {
    id: 'athletic',
    name: 'Sporty Summit',
    emoji: '⚡',
    description: 'Performance meets style',
    position: 13,
    color: 'from-green-500 to-teal-600',
    styles: ['athletic', 'sporty', 'activewear', 'performance'],
    unlocked: false,
    level: 6,
    xpRequired: 1000,
  },
];

// Particle animation component
function FloatingParticle({ delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 0, x: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [-100, -200, -300, -400],
        x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
        scale: [0, 1, 1, 0],
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 3,
      }}
      className="absolute bottom-0 left-1/2 w-2 h-2 bg-purple-400 rounded-full blur-sm"
      style={{ left: `${Math.random() * 100}%` }}
    />
  );
}

// Achievement unlock animation
function AchievementUnlock({ destination, onComplete }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center"
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        className="text-center"
      >
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            ease: 'easeInOut',
          }}
        >
          <Trophy className="w-32 h-32 text-yellow-500 mx-auto mb-6" />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-5xl font-bold text-white mb-4"
        >
          Destination Unlocked!
        </motion.h2>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.7, type: 'spring' }}
          className="text-7xl mb-4"
        >
          {destination.emoji}
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-3xl text-purple-300 mb-8"
        >
          {destination.name}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <Button
            onClick={onComplete}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-xl"
          >
            Continue Journey
            <ChevronRight className="ml-2" />
          </Button>
        </motion.div>
        
        {/* Celebration particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: [0, (Math.random() - 0.5) * 400],
              y: [0, (Math.random() - 0.5) * 400],
            }}
            transition={{
              duration: 2,
              delay: 0.5 + Math.random() * 0.5,
            }}
            className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full"
            style={{
              background: ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][Math.floor(Math.random() * 4)],
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

// XP Progress Bar
function XPProgressBar({ currentXP, nextLevelXP, level }) {
  const progress = (currentXP / nextLevelXP) * 100;
  
  return (
    <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden relative">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="h-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 relative"
      >
        <motion.div
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />
      </motion.div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-white drop-shadow-lg">
          {currentXP} / {nextLevelXP} XP
        </span>
      </div>
    </div>
  );
}

function DestinationCard({ destination, onClick, isActive }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: destination.unlocked ? 1.1 : 1.05 }}
      whileTap={{ scale: destination.unlocked ? 0.95 : 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`absolute left-1/2 -translate-x-1/2 cursor-pointer ${isActive ? 'z-30' : 'z-10'}`}
      style={{ top: `${destination.position}%` }}
      onClick={() => onClick(destination)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className={`relative w-32 h-32 rounded-full bg-gradient-to-br ${destination.color} shadow-2xl border-4 ${
        isActive ? 'border-white' : 'border-gray-800'
      } flex flex-col items-center justify-center transition-all duration-300 overflow-hidden`}>
        
        {/* Animated ring effect for unlocked destinations */}
        {destination.unlocked && (
          <>
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 rounded-full border-4 border-white"
            />
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute inset-0"
            >
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${i * 45}deg) translateY(-60px)`,
                  }}
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </>
        )}
        
        {!destination.unlocked && (
          <div className="absolute inset-0 bg-black/60 rounded-full backdrop-blur-sm flex items-center justify-center z-20">
            <motion.div
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Lock className="w-8 h-8 text-gray-300" />
            </motion.div>
          </div>
        )}
        
        <motion.div
          className="text-5xl mb-2 relative z-10"
          animate={{
            rotate: isHovered && destination.unlocked ? [0, -10, 10, -10, 0] : 0,
          }}
          transition={{
            duration: 0.5,
          }}
        >
          {destination.emoji}
        </motion.div>
        
        {destination.unlocked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1 z-20"
          >
            <CheckCircle2 className="w-5 h-5 text-white" />
          </motion.div>
        )}
        
        {/* Level badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -bottom-2 bg-purple-900 border-2 border-purple-500 rounded-full px-3 py-1 z-20"
        >
          <span className="text-white text-xs font-bold">LV {destination.level}</span>
        </motion.div>
      </div>
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-center mt-3 bg-gray-900/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-purple-500/50"
          >
            <p className="text-white font-bold text-sm">{destination.name}</p>
            {!destination.unlocked && (
              <p className="text-purple-400 text-xs mt-1">{destination.xpRequired} XP Required</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function DestinationDetail({ destination, onClose, products }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="bg-gray-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden border-2 border-purple-500/50 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`bg-gradient-to-br ${destination.color} p-6 relative overflow-hidden`}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.5 }}
            className="text-8xl absolute right-4 top-1/2 -translate-y-1/2 opacity-20"
          >
            {destination.emoji}
          </motion.div>
          
          <div className="relative z-10">
            <Badge className="mb-3 bg-white/20 backdrop-blur-md border-white/30">
              {destination.unlocked ? '✓ Unlocked' : '🔒 Locked'}
            </Badge>
            <h2 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <span className="text-5xl">{destination.emoji}</span>
              {destination.name}
            </h2>
            <p className="text-white/90 text-lg">{destination.description}</p>
          </div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors z-20"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {destination.unlocked ? (
            <>
              <div className="flex gap-2 flex-wrap mb-6">
                {destination.styles.map((style, idx) => (
                  <Badge key={idx} variant="outline" className="border-purple-500/50 text-purple-300">
                    #{style}
                  </Badge>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {products.map((product, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500/50 transition-all group"
                  >
                    <div className="aspect-square bg-gray-700 relative overflow-hidden">
                      <img
                        src={product.image || 'https://via.placeholder.com/300?text=Fashion'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-3">
                      <p className="text-white font-semibold text-sm line-clamp-1">{product.name}</p>
                      <p className="text-purple-400 text-xs">${product.price}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {products.length === 0 && (
                <div className="text-center py-12">
                  <Sparkles className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                  <p className="text-gray-400">Discovering styles from this destination...</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Lock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Destination Locked</h3>
              <p className="text-gray-400 mb-6">
                Complete previous destinations to unlock this fashion journey
              </p>
              <Button className="bg-purple-600 hover:bg-purple-700">
                Continue Journey
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Explore() {
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [products, setProducts] = useState([]);
  const [showAchievement, setShowAchievement] = useState(false);
  const [unlockedDestination, setUnlockedDestination] = useState(null);
  const [currentXP, setCurrentXP] = useState(150);
  const [currentLevel, setCurrentLevel] = useState(2);
  const scrollRef = useRef(null);
  const scrollY = useMotionValue(0);
  
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        scrollY.set(scrollRef.current.scrollTop);
      }
    };
    
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, [scrollY]);

  const handleDestinationClick = (destination) => {
    if (!destination.unlocked) {
      // Show locked message with animation
      return;
    }
    
    setSelectedDestination(destination);
    
    // Mock products for now - you can integrate with your API
    const mockProducts = Array.from({ length: 6 }, (_, i) => ({
      id: `${destination.id}-${i}`,
      name: `${destination.name} Style ${i + 1}`,
      price: (Math.random() * 100 + 20).toFixed(2),
      image: null,
    }));
    
    setProducts(mockProducts);
  };
  
  const handleUnlockDestination = (destination) => {
    setUnlockedDestination(destination);
    setShowAchievement(true);
  };
  
  const nextLevelXP = currentLevel * 150;

  return (
    <div className="h-screen bg-gray-950 flex flex-col overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.3} />
        ))}
        
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [180, 0, 180],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Header */}
      <header className="px-4 py-3 sm:py-4 sm:px-6 border-b border-gray-800/50 backdrop-blur-sm bg-gray-900/50 relative z-10">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-start mb-3">
            <div>
              <motion.h1
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2"
              >
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Map className="w-6 h-6 text-purple-500" />
                </motion.div>
                Fashion Odyssey
              </motion.h1>
              <motion.p
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-xs sm:text-sm text-gray-400"
              >
                Explore your style journey
              </motion.p>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="flex flex-col items-end gap-2"
            >
              <Badge variant="secondary" className="bg-purple-600/20 border-purple-500/50 text-purple-300">
                <Crown className="w-3 h-3 mr-1" />
                Level {currentLevel}
              </Badge>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1 bg-yellow-500/20 border border-yellow-500/50 rounded-full px-2 py-1"
              >
                <Star className="w-3 h-3 text-yellow-400" />
                <span className="text-xs font-bold text-yellow-400">{currentXP} XP</span>
              </motion.div>
            </motion.div>
          </div>
          
          {/* XP Progress Bar */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3 }}
            className="origin-left"
          >
            <XPProgressBar currentXP={currentXP} nextLevelXP={nextLevelXP} level={currentLevel} />
          </motion.div>
        </div>
      </header>

      {/* Journey Map */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col-reverse" ref={scrollRef}>
        <motion.div
          className="relative min-h-[200vh] w-full"
          style={{
            y: useTransform(scrollY, [0, 1000], [0, -50]),
          }}
        >
          {/* Journey Path */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ minHeight: '200vh' }}
          >
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: 'easeInOut' }}
              d="M 50% 5% Q 30% 20%, 50% 25% T 50% 45% T 50% 65% T 50% 85% T 50% 95%"
              stroke="url(#gradient)"
              strokeWidth="4"
              fill="none"
              strokeDasharray="10 5"
              className="drop-shadow-lg"
            />
            
            {/* Animated glow on the path */}
            <motion.path
              animate={{
                strokeDashoffset: [0, -100],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
              d="M 50% 5% Q 30% 20%, 50% 25% T 50% 45% T 50% 65% T 50% 85% T 50% 95%"
              stroke="url(#glowGradient)"
              strokeWidth="6"
              fill="none"
              strokeDasharray="20 80"
              className="opacity-70"
              style={{ filter: 'blur(4px)' }}
            />
            
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#ec4899" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="glowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.8" />
              </linearGradient>
            </defs>
          </svg>

          {/* Destinations */}
          {FASHION_DESTINATIONS.map((destination, idx) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              onClick={handleDestinationClick}
              isActive={selectedDestination?.id === destination.id}
            />
          ))}

          {/* Start Point */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="absolute left-1/2 -translate-x-1/2 bottom-[2%] flex flex-col items-center"
          >
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 20px rgba(168, 85, 247, 0.4)',
                  '0 0 40px rgba(168, 85, 247, 0.8)',
                  '0 0 20px rgba(168, 85, 247, 0.4)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-full p-4 shadow-2xl flex items-center justify-center relative"
            >
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              
              {/* Orbiting particles */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: i * 0.75,
                  }}
                  style={{
                    top: '50%',
                    left: '50%',
                    transformOrigin: '0 0',
                    transform: `rotate(${i * 90}deg) translateX(40px) translateY(-50%)`,
                  }}
                />
              ))}
            </motion.div>
            <motion.p
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="text-white font-bold text-center mt-2 whitespace-nowrap"
            >
              Start Your Journey
            </motion.p>
          </motion.div>

          {/* End Point */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: 'spring' }}
            className="absolute left-1/2 -translate-x-1/2 top-[2%] flex flex-col items-center"
          >
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 30px rgba(251, 191, 36, 0.6)',
                  '0 0 60px rgba(251, 191, 36, 1)',
                  '0 0 30px rgba(251, 191, 36, 0.6)',
                ],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full p-4 shadow-2xl flex items-center justify-center relative"
            >
              <Crown className="w-8 h-8 text-white" />
              
              {/* Sparkle effects around crown */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${i * 60}deg) translateY(-50px)`,
                  }}
                >
                  <Zap className="w-4 h-4 text-yellow-300" />
                </motion.div>
              ))}
            </motion.div>
            <motion.p
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5,
              }}
              className="text-white font-bold text-center mt-2 whitespace-nowrap"
            >
              🏆 Style Master
            </motion.p>
          </motion.div>
        </motion.div>
      </div>

      {/* Achievement Unlock Animation */}
      <AnimatePresence>
        {showAchievement && unlockedDestination && (
          <AchievementUnlock
            destination={unlockedDestination}
            onComplete={() => {
              setShowAchievement(false);
              setUnlockedDestination(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Destination Detail Modal */}
      <AnimatePresence>
        {selectedDestination && (
          <DestinationDetail
            destination={selectedDestination}
            products={products}
            onClose={() => setSelectedDestination(null)}
          />
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <nav className="border-t border-gray-800/50 bg-gray-900/80 backdrop-blur-lg relative z-10">
        <div className="max-w-md mx-auto flex justify-around py-2 sm:py-3 px-4">
          <Link to="/feed" className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300 transition-colors py-2 px-4 rounded-lg hover:bg-gray-800/50">
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Feed</span>
          </Link>
          <Link to="/saved" className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300 transition-colors py-2 px-4 rounded-lg hover:bg-gray-800/50">
            <Bookmark className="w-6 h-6" />
            <span className="text-xs font-medium">Saved</span>
          </Link>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/explore" className="flex flex-col items-center gap-1 text-purple-400 py-2 px-4 rounded-lg relative">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Map className="w-6 h-6" />
              </motion.div>
              <span className="text-xs font-medium">Explore</span>
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full"
              />
            </Link>
          </motion.div>
          <Link to="/checkout" className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300 transition-colors py-2 px-4 rounded-lg hover:bg-gray-800/50">
            <ShoppingCart className="w-6 h-6" />
            <span className="text-xs font-medium">Cart</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300 transition-colors py-2 px-4 rounded-lg hover:bg-gray-800/50">
            <User className="w-6 h-6" />
            <span className="text-xs font-medium">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
