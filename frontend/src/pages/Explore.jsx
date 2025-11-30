import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, Bookmark, User, ShoppingCart, Map, Sparkles, Lock, CheckCircle2 } from 'lucide-react';
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
  },
];

function DestinationCard({ destination, onClick, isActive }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`absolute left-1/2 -translate-x-1/2 cursor-pointer ${isActive ? 'z-30' : 'z-10'}`}
      style={{ top: `${destination.position}%` }}
      onClick={() => onClick(destination)}
    >
      <div className={`relative w-32 h-32 rounded-full bg-gradient-to-br ${destination.color} shadow-2xl border-4 ${
        isActive ? 'border-white' : 'border-gray-800'
      } flex flex-col items-center justify-center transition-all duration-300`}>
        {!destination.unlocked && (
          <div className="absolute inset-0 bg-black/60 rounded-full backdrop-blur-sm flex items-center justify-center">
            <Lock className="w-8 h-8 text-gray-300" />
          </div>
        )}
        
        <div className="text-5xl mb-2">{destination.emoji}</div>
        
        {destination.unlocked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1"
          >
            <CheckCircle2 className="w-5 h-5 text-white" />
          </motion.div>
        )}
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mt-3"
      >
        <p className="text-white font-bold text-sm">{destination.name}</p>
      </motion.div>
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
  const scrollRef = useRef(null);

  const handleDestinationClick = (destination) => {
    if (!destination.unlocked) {
      // Show locked message
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

  return (
    <div className="h-screen bg-gray-950 flex flex-col overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
      </div>

      {/* Header */}
      <header className="px-4 py-3 sm:py-4 sm:px-6 border-b border-gray-800/50 backdrop-blur-sm bg-gray-900/50 relative z-10">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Map className="w-6 h-6 text-purple-500" />
              Fashion Odyssey
            </h1>
            <p className="text-xs sm:text-sm text-gray-400">Explore your style journey</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-purple-600/20 border-purple-500/50 text-purple-300">
              <Sparkles className="w-3 h-3 mr-1" />
              Level 1
            </Badge>
          </div>
        </div>
      </header>

      {/* Journey Map */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col-reverse" ref={scrollRef}>
        <div className="relative min-h-[200vh] w-full">
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
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#ec4899" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
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
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-full p-4 shadow-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <p className="text-white font-bold text-center mt-2 whitespace-nowrap">Start</p>
          </motion.div>

          {/* End Point */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: 'spring' }}
            className="absolute left-1/2 -translate-x-1/2 top-[2%] flex flex-col items-center"
          >
            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full p-4 shadow-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <p className="text-white font-bold text-center mt-2 whitespace-nowrap">Style Master</p>
          </motion.div>
        </div>
      </div>

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
      <nav className="border-t border-gray-800/50 bg-gray-900/80 backdrop-blur-lg">
        <div className="max-w-md mx-auto flex justify-around py-2 sm:py-3 px-4">
          <Link to="/feed" className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300 transition-colors py-2 px-4 rounded-lg hover:bg-gray-800/50">
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Feed</span>
          </Link>
          <Link to="/saved" className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300 transition-colors py-2 px-4 rounded-lg hover:bg-gray-800/50">
            <Bookmark className="w-6 h-6" />
            <span className="text-xs font-medium">Saved</span>
          </Link>
          <Link to="/explore" className="flex flex-col items-center gap-1 text-purple-400 py-2 px-4 rounded-lg">
            <Map className="w-6 h-6" />
            <span className="text-xs font-medium">Explore</span>
          </Link>
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
