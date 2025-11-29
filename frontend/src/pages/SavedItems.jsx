import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useFeedStore } from '../state/useFeedStore';
import { useCheckoutStore } from '../state/useCheckoutStore';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

export default function SavedItems() {
  const navigate = useNavigate();
  const { likes } = useFeedStore();
  const { addToCart } = useCheckoutStore();
  const [removingId, setRemovingId] = useState(null);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleRemove = (productId) => {
    setRemovingId(productId);
    // Animation will handle removal
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <header className="px-4 py-4 sm:px-6 sm:py-5 border-b border-gray-800/50 backdrop-blur-sm bg-gray-900/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Saved Items</h1>
            <p className="text-xs sm:text-sm text-gray-400">{likes.length} items</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-6 sm:px-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          {likes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">No saved items yet</h2>
              <p className="text-gray-400 mb-6">
                Start swiping to save products you love
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
                {likes.map((product) => (
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
                        src={product.media?.[0]?.url || product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />
                      
                      {/* Tag and Price */}
                      <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                        {product.tag && (
                          <Badge variant="default" className="backdrop-blur-md shadow-lg">
                            {product.tag}
                          </Badge>
                        )}
                        <Badge variant="secondary" className="backdrop-blur-md shadow-lg font-bold">
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
  );
}
