import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Heart, X, Info, Home, Bookmark, User, ShoppingCart, Map } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFeedStore } from '../state/useFeedStore';
import { useProfileStore } from '../state/useProfileStore';
import { useCheckoutStore } from '../state/useCheckoutStore';
import { api } from '../lib/api';
import { getProductImage, normalizeProduct } from '../lib/productUtils';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

// ========== SWIPE CONFIGURATION ==========
// Adjust this threshold to change swipe sensitivity
// Lower value = easier to trigger swipe (more sensitive)
// Higher value = harder to trigger swipe (less sensitive)
// Recommended range: 50-150px
const SWIPE_THRESHOLD = 80;

// Exit animation speed (in ms) - smooth but responsive
const EXIT_ANIMATION_DURATION = 500;
// ========================================

function ProductCard({ product, onSwipe, onDetail }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-20, 20]);
  
  const [exitX, setExitX] = useState(0);
  const [exitRotate, setExitRotate] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const handleDragEnd = (event, info) => {
    if (Math.abs(info.offset.x) > SWIPE_THRESHOLD) {
      const direction = info.offset.x > 0 ? 'like' : 'dislike';
      // Calculate exit position from CURRENT position, not from center
      const currentX = x.get();
      setExitX(direction === 'like' ? currentX + 1000 : currentX - 1000);
      setExitRotate(direction === 'like' ? 30 : -30);
      setIsExiting(true);
      // Trigger swipe immediately for synchronized animations
      onSwipe(direction);
    }
  };

  const imageUrl = getProductImage(product) || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

  return (
    <motion.div
      className="absolute w-full h-full cursor-grab active:cursor-grabbing"
      style={{ x, rotate, zIndex: isExiting ? 20 : 10 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 1, opacity: 1 }}
      animate={isExiting ? {} : { x: 0, rotate: 0 }}
      exit={{ 
        x: exitX, 
        rotate: exitRotate,
        opacity: 0.3, 
        transition: { 
          duration: EXIT_ANIMATION_DURATION / 1000,
          ease: [0.4, 0.0, 0.2, 1]
        } 
      }}
      transition={isExiting ? {} : { 
        x: { type: "spring", stiffness: 300, damping: 30 },
        rotate: { type: "spring", stiffness: 300, damping: 30 }
      }}
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl flex! flex-col! gap-4!">
        {/* Product Image */}
        <div className="absolute inset-0">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-gray-900/95" />
        </div>

        {/* Top Info */}
        <div className="absolute top-4 inset-x-4 sm:top-6 sm:inset-x-6 md:top-8 md:inset-x-8 flex justify-between items-start gap-3">
          <Badge variant="default" className="backdrop-blur-md shadow-lg px-2! py-1!">
            {product.category}
          </Badge>
          <Badge variant="secondary" className="backdrop-blur-md shadow-lg text-base sm:text-lg font-bold px-2!">
            ${product.price}
          </Badge>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-4 inset-x-4 sm:bottom-6 sm:inset-x-6 md:bottom-8 md:inset-x-8 text-white space-y-3">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
              {product.name}
            </h2>
          </div>
          
          <p className="text-gray-200 text-sm sm:text-base line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {product.id && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDetail();
              }}
              className="text-sm text-purple-300 hover:text-purple-200 flex items-center gap-1.5 transition-colors font-medium pt-1"
            >
              <Info className="w-4 h-4" />
              View details
            </button>
          )}
        </div>


      </div>
    </motion.div>
  );
}

export default function SwipeFeed() {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const viewStartTime = useRef(null);

  const { addLike, addPass, likes, passes, hasMore, isLoading: storeIsLoading, loadMoreProducts, setProducts: setStoreProducts, setHasMore, setTotalProducts } = useFeedStore();
  const { hasSeenWelcome, markWelcomeSeen, name, addSavedItem, removeSavedItem, isItemSaved } = useProfileStore();
  const { addToCart } = useCheckoutStore();

  useEffect(() => {
    loadInitialProducts();
    viewStartTime.current = Date.now();
    
    // Show welcome alert if first time
    if (!hasSeenWelcome) {
      setShowWelcome(true);
      // Auto-hide after 4 seconds
      setTimeout(() => {
        setShowWelcome(false);
        markWelcomeSeen();
      }, 4000);
    }
  }, []);

  // Auto-prefetch when approaching end of current products
  useEffect(() => {
    if (products.length > 0 && currentIndex >= products.length - 5 && hasMore && !storeIsLoading) {
      loadMoreProducts(api);
    }
  }, [currentIndex, products.length, hasMore, storeIsLoading]);

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    markWelcomeSeen();
  };

  const handleSave = () => {
    const product = products[currentIndex];
    if (!product) return;

    if (isItemSaved(product.id)) {
      removeSavedItem(product.id);
      setNotification({ type: 'unsaved', product });
    } else {
      addSavedItem(product);
      addToCart(product); // Also add to cart when saved
      setNotification({ type: 'saved', product });
    }

    setTimeout(() => setNotification(null), 2000);
  };

  const loadInitialProducts = async () => {
    // Check if we have cached products
    const cachedProducts = useFeedStore.getState().products;
    if (cachedProducts && cachedProducts.length > 0) {
      setProducts(cachedProducts);
      setCurrentIndex(useFeedStore.getState().currentIndex || 0);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await api.getProducts(20, 0);
      const data = response.products || response;
      
      if (Array.isArray(data) && data.length > 0) {
        const normalized = data.map((product, idx) => normalizeProduct(product, idx));
        setProducts(normalized);
        setStoreProducts(normalized);
        setHasMore(response.hasMore !== undefined ? response.hasMore : data.length === 20);
        setTotalProducts(response.total || data.length);
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error('Failed to load feed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sync store products with local state when new products are loaded
  useEffect(() => {
    const storeProducts = useFeedStore.getState().products;
    if (storeProducts.length > products.length) {
      setProducts(storeProducts);
    }
  }, [storeIsLoading]);

  const handleSwipe = (direction) => {
    const product = products[currentIndex];
    if (!product) return;

    // Trigger edge lighting effect immediately
    setSwipeDirection(direction);
    
    // Show notification
    setNotification({ type: direction, product });
    
    // Clear the lighting effect after animation completes
    setTimeout(() => setSwipeDirection(null), EXIT_ANIMATION_DURATION);
    
    // Clear notification after 2 seconds
    setTimeout(() => setNotification(null), 2000);

    // Update state immediately for instant visual feedback
    if (direction === 'like') {
      addLike(product);
      // Add to cart when liked
      addToCart(product);
    } else {
      addPass(product);
    }

    setCurrentIndex((prev) => prev + 1);
    
    // Track view duration (non-blocking)
    if (viewStartTime.current) {
      const duration = Date.now() - viewStartTime.current;
      api.recordView(product.id, duration).catch(error => {
        console.error('Failed to record view:', error);
      });
    }

    // Record swipe (non-blocking)
    api.recordSwipe(product.id, direction).catch(error => {
      console.error('Failed to record swipe:', error);
    });

    viewStartTime.current = Date.now();

    // Preload more products if near the end
    if (currentIndex >= products.length - 2) {
      loadProducts();
    }
  };

  const currentProduct = products[currentIndex];

  return (
    <div className="h-screen w-full bg-gray-950 flex flex-col relative overflow-hidden">
      {/* Welcome Alert */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-auto max-w-sm mx-4"
          >
            <div className="bg-purple-600/30 border-2 border-purple-400/40 rounded-2xl shadow-2xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">✨</span>
                    <h3 className="text-white font-bold text-lg">Welcome{name ? `, ${name}` : ''}!</h3>
                  </div>
                  <p className="text-white/90 text-sm">
                    🎯 Showing tailored products just for you based on your style preferences
                  </p>
                </div>
                <button
                  onClick={handleCloseWelcome}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Alert */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-[100] pointer-events-none"
          >
            <div className={`px-6 py-3 rounded-xl shadow-2xl backdrop-blur-md border-2 flex items-center gap-3 ${
              notification.type === 'like'
                ? 'bg-green-500/20 border-green-400 text-green-100'
                : notification.type === 'saved'
                ? 'bg-purple-500/20 border-purple-400 text-purple-100'
                : notification.type === 'unsaved'
                ? 'bg-gray-500/20 border-gray-400 text-gray-100'
                : notification.type === 'cart'
                ? 'bg-blue-500/20 border-blue-400 text-blue-100'
                : 'bg-red-500/20 border-red-400 text-red-100'
            }`}>
              {notification.type === 'like' ? (
                <Heart className="w-5 h-5 fill-current" />
              ) : notification.type === 'saved' ? (
                <Bookmark className="w-5 h-5 fill-current" />
              ) : notification.type === 'unsaved' ? (
                <Bookmark className="w-5 h-5" />
              ) : notification.type === 'cart' ? (
                <ShoppingCart className="w-5 h-5 fill-current" />
              ) : (
                <X className="w-5 h-5" />
              )}
              <div>
                <p className="font-bold text-sm">
                  {notification.type === 'like' ? '👍 Liked!' : 
                   notification.type === 'saved' ? '💜 Saved & Added to Cart!' :
                   notification.type === 'unsaved' ? '🗑️ Removed from Saved' :
                   notification.type === 'cart' ? '🛒 Added to Cart!' :
                   '❌ Passed'}
                </p>
                <p className="text-xs opacity-90">{notification.product.name}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edge Lighting Effects */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 right-0 w-2 h-[600px] bg-linear-to-l from-green-500 to-transparent z-50 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: swipeDirection === 'like' ? 1 : 0 }}
        transition={{ duration: swipeDirection === 'like' ? 0.15 : 0.2, ease: "easeOut" }}
      />
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 right-0 w-20 h-[600px] bg-linear-to-l from-green-500/20 to-transparent z-40 pointer-events-none blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: swipeDirection === 'like' ? 1 : 0 }}
        transition={{ duration: swipeDirection === 'like' ? 0.15 : 0.2, ease: "easeOut" }}
      />
      
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 left-0 w-2 h-[600px] bg-linear-to-r from-red-500 to-transparent z-50 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: swipeDirection === 'dislike' ? 1 : 0 }}
        transition={{ duration: swipeDirection === 'dislike' ? 0.15 : 0.2, ease: "easeOut" }}
      />
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 left-0 w-20 h-[600px] bg-linear-to-r from-red-500/20 to-transparent z-40 pointer-events-none blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: swipeDirection === 'dislike' ? 1 : 0 }}
        transition={{ duration: swipeDirection === 'dislike' ? 0.15 : 0.2, ease: "easeOut" }}
      />

      {/* Header */}
      <header className="px-4! py-2 sm:py-3 md:py-4 sm:px-6 border-b border-gray-800/50 backdrop-blur-sm bg-gray-900/50 ">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">TrendSwipe</h1>
            <p className="text-xs sm:text-sm text-gray-400">Discover your style</p>
          </div>
          <div className="flex gap-3 sm:gap-4 items-center">
            <Link to="/" className="text-gray-400 hover:text-white transition-colors">
              <Info className="w-6 h-6" />
            </Link>
            <div className="flex gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2 px-2! py-1! rounded-full bg-green-500/10 border border-green-500/20">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
                <span className="text-gray-300 font-medium">{likes.length}</span>
              </div>
              <div className="flex items-center gap-2 px-2! py-1! rounded-full bg-red-500/10 border border-red-500/20">
                <div className="w-2 h-2 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
                <span className="text-gray-300 font-medium">{passes.length}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Card Stack */}
      <div className="flex-1 flex items-center justify-center px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 min-h-0">
        <div className="relative w-full max-w-md aspect-[3/4] max-h-[calc(100vh-200px)]">
          <AnimatePresence mode="popLayout">
            {loading && products.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 rounded-3xl bg-gray-800/50 border-2 border-gray-700/50 overflow-hidden"
              >
                <div className="animate-pulse h-full flex flex-col">
                  {/* Skeleton Image */}
                  <div className="w-full h-64 bg-gray-700/50" />
                  
                  {/* Skeleton Content */}
                  <div className="p-6 space-y-4 flex-1">
                    <div className="h-8 bg-gray-700/50 rounded w-3/4" />
                    <div className="h-6 bg-gray-700/50 rounded w-1/4" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-700/50 rounded" />
                      <div className="h-4 bg-gray-700/50 rounded w-5/6" />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <div className="h-6 w-16 bg-gray-700/50 rounded-full" />
                      <div className="h-6 w-20 bg-gray-700/50 rounded-full" />
                    </div>
                  </div>
                  
                  {/* Loading text */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
                    <p className="text-purple-400 text-sm font-medium">Loading products...</p>
                  </div>
                </div>
              </motion.div>
            ) : currentProduct ? (
              <ProductCard
                key={currentProduct.id}
                product={currentProduct}
                onSwipe={handleSwipe}
                onDetail={() => window.location.href = `/product/${currentProduct.id}`}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex items-center justify-center "
              >
                <div className="text-center p-8">
                  <Heart className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">No more products!</h2>
                  <p className="text-gray-400 mb-6">Check back soon for more amazing finds</p>
                  <Button onClick={() => window.location.reload()}>
                    Reload Feed
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next Card Preview - shows actual product */}
          {products[currentIndex + 1] && (
            <motion.div 
              className="absolute inset-0 pointer-events-none"
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 0.95, y: 10 }}
              style={{ zIndex: 2 }}
            >
              <div className="w-full h-full rounded-3xl overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl opacity-60">
                <div className="absolute inset-0 p-10">
                  <img
                    src={getProductImage(products[currentIndex + 1]) || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='}
                    alt={products[currentIndex + 1].name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/30 to-black/60" />
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Second Card Preview - shows actual product */}
          {products[currentIndex + 2] && (
            <motion.div 
              className="absolute inset-0 pointer-events-none"
              initial={{ scale: 0.90, y: 20 }}
              animate={{ scale: 0.90, y: 20 }}
              style={{ zIndex: 1 }}
            >
              <div className="w-full h-full rounded-3xl overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl opacity-30">
                <div className="absolute inset-0">
                  <img
                    src={getProductImage(products[currentIndex + 2]) || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='}
                    alt={products[currentIndex + 2].name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/50 to-black/70" />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* TikTok-Style Vertical Action Buttons - Bottom Right */}
      <div className="absolute bottom-24 right-4 sm:right-6 z-30 flex flex-col gap-4">
        <Button
          size="icon"
          variant="outline"
          className="w-14 h-14 rounded-full border-2 border-purple-500 hover:bg-purple-500/20 hover:scale-110 transition-all duration-200 shadow-lg bg-gray-900/50 backdrop-blur-md"
          onClick={() => handleSwipe('like')}
          disabled={!currentProduct}
        >
          <Heart className="w-7 h-7 text-purple-500" />
        </Button>

        <Button
          size="icon"
          variant="outline"
          className="w-14 h-14 rounded-full border-2 border-purple-500 hover:bg-purple-500/20 hover:scale-110 transition-all duration-200 shadow-lg bg-gray-900/50 backdrop-blur-md"
          onClick={() => handleSwipe('dislike')}
          disabled={!currentProduct}
        >
          <X className="w-7 h-7 text-purple-500" />
        </Button>

        <Button
          size="icon"
          variant="outline"
          className={`w-14 h-14 rounded-full border-2 border-purple-500 hover:bg-purple-500/20 hover:scale-110 transition-all duration-200 shadow-lg bg-gray-900/50 backdrop-blur-md ${
            currentProduct && isItemSaved(currentProduct.id) ? 'bg-purple-500/30' : ''
          }`}
          onClick={handleSave}
          disabled={!currentProduct}
        >
          <Bookmark className={`w-6 h-6 text-purple-500 ${
            currentProduct && isItemSaved(currentProduct.id) ? 'fill-purple-500' : ''
          }`} />
        </Button>

        <Button
          size="icon"
          variant="outline"
          className="w-14 h-14 rounded-full border-2 border-purple-500 hover:bg-purple-500/20 hover:scale-110 transition-all duration-200 shadow-lg bg-gray-900/50 backdrop-blur-md"
          onClick={() => {
            if (currentProduct) {
              addToCart(currentProduct);
              setNotification({ type: 'cart', product: currentProduct });
              setTimeout(() => setNotification(null), 2000);
            }
          }}
          disabled={!currentProduct}
        >
          <ShoppingCart className="w-6 h-6 text-purple-500" />
        </Button>
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
