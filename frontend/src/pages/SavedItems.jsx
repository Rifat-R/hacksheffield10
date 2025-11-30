import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, ShoppingCart, Trash2, Home, Bookmark, User, Map } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useProfileStore } from '../state/useProfileStore';
import { useCheckoutStore } from '../state/useCheckoutStore';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

export default function SavedItems() {
  const navigate = useNavigate();
  const { savedItems, removeSavedItem } = useProfileStore();
  const { addToCart } = useCheckoutStore();
  const [removingId, setRemovingId] = useState(null);
  const [notification, setNotification] = useState(null);

  const handleAddToCart = (product) => {
    addToCart(product);
    setNotification({ type: 'cart', product });
    setTimeout(() => setNotification(null), 2000);
  };

  const handleRemove = (productId) => {
    setRemovingId(productId);
    setTimeout(() => {
      removeSavedItem(productId);
      setRemovingId(null);
    }, 300);
  };

  return (
    <div className="h-screen w-full bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex flex-col relative">
      {/* Notification Alert */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-[200] pointer-events-none"
          >
            <div className="px-6 py-3 rounded-xl shadow-2xl backdrop-blur-md border-2 flex items-center gap-3 bg-purple-500/20 border-purple-400 text-purple-100">
              <ShoppingCart className="w-5 h-5 fill-current" />
              <div>
                <p className="font-bold text-sm">🛒 Added to Cart!</p>
                <p className="text-xs opacity-90">{notification.product.name}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="px-4 py-2 sm:py-3 md:py-4 sm:px-6 border-b border-gray-800/50 backdrop-blur-sm bg-gray-900/50 sticky top-0 z-10 flex-shrink-0">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Saved Items</h1>
            <p className="text-xs sm:text-sm text-gray-400">{savedItems.length} items</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
        <div className="px-4 py-4 sm:px-6 sm:py-6 md:py-8">
        <div className="max-w-6xl mx-auto">
          {savedItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">No saved items yet</h2>
              <p className="text-gray-400 mb-6">
                Tap the bookmark button on products to save them here
              </p>
              <Link to="/feed">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  Start Swiping
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <AnimatePresence mode="popLayout">
                {savedItems.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="group relative bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square">
                      <img
                        src={product.media?.[0]?.url || product.image_url || 'https://via.placeholder.com/400?text=No+Image'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />
                      
                      {/* Tag and Price */}
                      <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                        {product.tag && (
                          <Badge variant="default" className="backdrop-blur-md shadow-lg px-3 py-1">
                            {product.tag}
                          </Badge>
                        )}
                        <Badge variant="secondary" className="backdrop-blur-md shadow-lg font-bold px-3 py-1">
                          ${product.price}
                        </Badge>
                      </div>

                      {/* Hover Overlay with Actions */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                        <Button
                          size="icon"
                          onClick={() => handleAddToCart(product)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <ShoppingCart className="w-5 h-5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleRemove(product.id)}
                          className="border-red-500 text-red-500 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <p className="text-purple-300 text-xs font-semibold uppercase mb-1">
                        {product.brand}
                      </p>
                      <h3 className="text-white font-bold text-lg mb-2 line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                        {product.description}
                      </p>
                      
                      {/* Style Tags */}
                      {product.style_tags && product.style_tags.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {product.style_tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 rounded-full bg-purple-500/20 text-xs font-medium text-purple-300 border border-purple-500/30"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="border-t border-gray-800/50 bg-gray-900/80 backdrop-blur-lg flex-shrink-0">
        <div className="max-w-md mx-auto flex justify-around py-2 sm:py-3 px-4">
          <Link to="/saved" className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300 transition-colors py-2 px-4 rounded-lg hover:bg-gray-800/50">
            <Bookmark className="w-6 h-6" />
            <span className="text-xs font-medium">Saved</span>
          </Link>
          <Link to="/explore" className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300 transition-colors py-2 px-4 rounded-lg hover:bg-gray-800/50">
            <Map className="w-6 h-6" />
            <span className="text-xs font-medium">Explore</span>
          </Link>
          <Link to="/feed" className="relative flex flex-col items-center gap-1 text-purple-400 py-2 px-4 rounded-lg">
            {/* Glowing animated ring */}
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-12 pointer-events-none z-0">
              <span className="absolute inset-0 rounded-full bg-purple-500/30 blur-xl animate-pulse" />
              <span className="absolute inset-1 rounded-full bg-purple-400/40 blur-lg animate-pulse" />
            </span>
            <span className="relative z-10">
              <Home className="w-6 h-6 drop-shadow-[0_0_6px_rgba(168,85,247,0.7)] animate-glow" />
            </span>
            <span className="relative z-10 font-bold animate-glow-text">Feed</span>
            <style>{`
              @keyframes glow {
                0%, 100% { filter: drop-shadow(0 0 6px #a855f7) drop-shadow(0 0 12px #a855f7aa); }
                50% { filter: drop-shadow(0 0 16px #a855f7) drop-shadow(0 0 32px #a855f7cc); }
              }
              .animate-glow { animation: glow 2s infinite alternate; }
              @keyframes glowText {
                0%, 100% { text-shadow: 0 0 6px #a855f7, 0 0 12px #a855f7aa; }
                50% { text-shadow: 0 0 16px #a855f7, 0 0 32px #a855f7cc; }
              }
              .animate-glow-text { animation: glowText 2s infinite alternate; }
            `}</style>
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
