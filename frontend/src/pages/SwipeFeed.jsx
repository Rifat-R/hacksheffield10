import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Heart, X, Info, Home, Bookmark, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFeedStore } from '../state/useFeedStore';
import { api } from '../lib/api';
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

// Mock data for initial development
const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Lumen Linen Shirt",
    brand: "North & Co",
    price: 78,
    tag: "New Arrival",
    media: [{
      type: "image",
      url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80"
    }],
    description: "Breathable linen shirt perfect for summer days",
    style_tags: ["casual", "summer", "minimal"]
  },
  {
    id: "2",
    name: "Aero Knit Sneakers",
    brand: "Strata",
    price: 120,
    tag: "Best Seller",
    media: [{
      type: "image",
      url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
    }],
    description: "Lightweight knit sneakers with premium comfort",
    style_tags: ["sporty", "comfort", "urban"]
  },
  {
    id: "3",
    name: "Everyday Carry Tote",
    brand: "Field Studio",
    price: 64,
    tag: "Limited",
    media: [{
      type: "image",
      url: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80"
    }],
    description: "Versatile tote bag for all your daily essentials",
    style_tags: ["minimal", "practical", "eco-friendly"]
  },
  {
    id: "4",
    name: "Quartz Analog Watch",
    brand: "Midnight",
    price: 210,
    tag: "Editor's Pick",
    media: [{
      type: "image",
      url: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80"
    }],
    description: "Timeless elegance with precision craftsmanship",
    style_tags: ["luxury", "classic", "formal"]
  },
  {
    id: "5",
    name: "Merino Wool Sweater",
    brand: "Nordic Thread",
    price: 95,
    tag: "Trending",
    media: [{
      type: "image",
      url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80"
    }],
    description: "Soft merino wool for ultimate warmth and comfort",
    style_tags: ["cozy", "winter", "premium"]
  }
];

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

  const imageUrl = product.media?.[0]?.url || product.image;

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
            {product.tag}
          </Badge>
          <Badge variant="secondary" className="backdrop-blur-md shadow-lg text-base sm:text-lg font-bold px-2!">
            ${product.price}
          </Badge>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-4 inset-x-4 sm:bottom-6 sm:inset-x-6 md:bottom-8 md:inset-x-8 text-white space-y-3">
          <div className="space-y-1">
            <p className="text-purple-300 text-xs sm:text-sm font-semibold tracking-wide uppercase">
              {product.brand}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
              {product.name}
            </h2>
          </div>
          
          <p className="text-gray-200 text-sm sm:text-base line-clamp-2 leading-relaxed">
            {product.description}
          </p>
          
          {/* Style Tags */}
          <div className="flex gap-2 flex-wrap pt-1">
            {product.style_tags?.map((tag, idx) => (
              <span
                key={idx}
                className="px-2! rounded-full bg-white/20 backdrop-blur-md text-xs font-medium text-gray-100 border border-white/10"
              >
                #{tag}
              </span>
            ))}
          </div>

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
        </div>

        {/* Swipe Indicators */}
        <motion.div
          className="absolute top-1/3 right-6 sm:right-8 transform rotate-12 pointer-events-none"
          style={{
            opacity: useTransform(x, [0, 100], [0, 1]),
            scale: useTransform(x, [0, 100], [0.8, 1.1]),
          }}
        >
          <div className="px-4 sm:px-6 py-2 sm:py-3 border-4 border-green-500 bg-green-500/10 text-green-500 font-bold text-2xl sm:text-3xl rounded-xl shadow-lg backdrop-blur-sm">
            LIKE
          </div>
        </motion.div>
        
        <motion.div
          className="absolute top-1/3 left-6 sm:left-8 transform -rotate-12 pointer-events-none"
          style={{
            opacity: useTransform(x, [-100, 0], [1, 0]),
            scale: useTransform(x, [-100, 0], [1.1, 0.8]),
          }}
        >
          <div className="px-4 sm:px-6 py-2 sm:py-3 border-4 border-red-500 bg-red-500/10 text-red-500 font-bold text-2xl sm:text-3xl rounded-xl shadow-lg backdrop-blur-sm">
            NOPE
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function SwipeFeed() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const viewStartTime = useRef(null);

  const { addLike, addPass, likes, passes } = useFeedStore();

  useEffect(() => {
    loadProducts();
    viewStartTime.current = Date.now();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getFeed();
      if (data.products && data.products.length > 0) {
        setProducts(data.products);
      }
      // Otherwise use mock data
    } catch (error) {
      console.error('Failed to load feed:', error);
      // Use mock data on error
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = (direction) => {
    const product = products[currentIndex];
    if (!product) return;

    // Trigger edge lighting effect immediately
    setSwipeDirection(direction);
    
    // Clear the lighting effect after animation completes
    setTimeout(() => setSwipeDirection(null), EXIT_ANIMATION_DURATION);

    // Update state immediately for instant visual feedback
    if (direction === 'like') {
      addLike(product);
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
    <div className="min-h-screen bg-gray-950 flex flex-col relative overflow-hidden">
      {/* Edge Lighting Effects */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 right-0 w-2 h-[70vh] bg-linear-to-l from-green-500 to-transparent z-50 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: swipeDirection === 'like' ? 1 : 0 }}
        transition={{ duration: swipeDirection === 'like' ? 0.15 : 0.2, ease: "easeOut" }}
      />
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 right-0 w-20 h-[70vh] bg-linear-to-l from-green-500/20 to-transparent z-40 pointer-events-none blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: swipeDirection === 'like' ? 1 : 0 }}
        transition={{ duration: swipeDirection === 'like' ? 0.15 : 0.2, ease: "easeOut" }}
      />
      
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 left-0 w-2 h-[70vh] bg-linear-to-r from-red-500 to-transparent z-50 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: swipeDirection === 'dislike' ? 1 : 0 }}
        transition={{ duration: swipeDirection === 'dislike' ? 0.15 : 0.2, ease: "easeOut" }}
      />
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 left-0 w-20 h-[70vh] bg-linear-to-r from-red-500/20 to-transparent z-40 pointer-events-none blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: swipeDirection === 'dislike' ? 1 : 0 }}
        transition={{ duration: swipeDirection === 'dislike' ? 0.15 : 0.2, ease: "easeOut" }}
      />

      {/* Header */}
      <header className="px-4! py-4 sm:px-6 sm:py-5 border-b border-gray-800/50 backdrop-blur-sm bg-gray-900/50 ">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Swipey</h1>
            <p className="text-xs sm:text-sm text-gray-400">Discover your style</p>
          </div>
          <div className="flex gap-3 sm:gap-4 text-xs sm:text-sm">
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
      </header>

      {/* Card Stack */}
      <div className="flex-1 flex items-center justify-center px-6 py-6 sm:px-8 sm:py-8 ">
        <div className="relative w-full max-w-md aspect-[3/4]">
          <AnimatePresence mode="popLayout">
            {currentProduct ? (
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
                    src={products[currentIndex + 1].media?.[0]?.url || products[currentIndex + 1].image}
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
                    src={products[currentIndex + 2].media?.[0]?.url || products[currentIndex + 2].image}
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

      {/* Action Buttons */}
      <div className="px-4 pb-6 sm:px-6 sm:pb-8">
        <div className="max-w-md mx-auto flex justify-center items-center gap-6 sm:gap-8">
          <Button
            size="icon"
            variant="outline"
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-red-500 hover:bg-red-500/10 hover:scale-110 transition-all duration-200 shadow-lg shadow-red-500/20"
            onClick={() => handleSwipe('dislike')}
            disabled={!currentProduct}
          >
            <X className="w-7 h-7 sm:w-8 sm:h-8 text-red-500" />
          </Button>
          
          <Button
            size="icon"
            variant="outline"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-green-500 hover:bg-green-500/10 hover:scale-110 transition-all duration-200 shadow-lg shadow-green-500/20"
            onClick={() => handleSwipe('like')}
            disabled={!currentProduct}
          >
            <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
          </Button>
        </div>
        
        <p className="text-center text-xs text-gray-500 mt-4 sm:mt-6">
          Swipe right to like • Swipe left to pass
        </p>
      </div>

      {/* Bottom Navigation */}
      <nav className="border-t border-gray-800/50 bg-gray-900/80 backdrop-blur-lg">
        <div className="max-w-md mx-auto flex justify-around py-3 px-4">
          <Link to="/feed" className="flex flex-col items-center gap-1 text-purple-400 py-2 px-4 rounded-lg">
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Feed</span>
          </Link>
          <Link to="/saved" className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300 transition-colors py-2 px-4 rounded-lg hover:bg-gray-800/50">
            <Bookmark className="w-6 h-6" />
            <span className="text-xs font-medium">Saved</span>
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
