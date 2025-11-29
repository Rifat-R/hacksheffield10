import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, ShoppingBag, Sparkles, Share2, ChevronLeft, ChevronRight, ShoppingCart, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { api } from '../lib/api';
import { useCheckoutStore } from '../state/useCheckoutStore';

// Mock product data
const MOCK_PRODUCT = {
  id: "1",
  name: "Lumen Linen Shirt",
  brand: "North & Co",
  price: 78,
  description: "This breathable linen shirt is perfect for warm summer days. Made from 100% premium European linen, it offers exceptional comfort and a refined, relaxed aesthetic.",
  media: [
    {
      type: "image",
      url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80"
    },
    {
      type: "image",
      url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80"
    },
    {
      type: "image",
      url: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80"
    }
  ],
  style_tags: ["casual", "summer", "minimal", "breathable"],
  external_url: "https://example.com/product/1",
  ai_styling_tips: "Pairs perfectly with light chinos or linen trousers. Roll up the sleeves for a more casual look. Great for beach outings or summer brunches.",
  specifications: {
    material: "100% European Linen",
    fit: "Regular Fit",
    care: "Machine wash cold, hang dry",
    origin: "Made in Portugal"
  },
  sizes: ["XS", "S", "M", "L", "XL", "XXL"]
};

const RELATED_PRODUCTS = [
  {
    id: "2",
    name: "Linen Trousers",
    brand: "North & Co",
    price: 89,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "3",
    name: "Canvas Sneakers",
    brand: "Urban Step",
    price: 65,
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "4",
    name: "Minimalist Watch",
    brand: "Timepiece Co",
    price: 145,
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=400&q=80"
  }
];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(MOCK_PRODUCT);
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [showAddedNotification, setShowAddedNotification] = useState(false);
  
  const { addToCart } = useCheckoutStore();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const data = await api.getProduct(id);
      setProduct(data);
    } catch (error) {
      console.error('Failed to load product:', error);
      // Use mock data on error
      setProduct(MOCK_PRODUCT);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyClick = async () => {
    try {
      await api.recordClick(product.id, 'buy_link');
      window.open(product.external_url, '_blank');
    } catch (error) {
      console.error('Failed to record click:', error);
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // TODO: Implement save to wishlist API call
  };
  
  const handleAddToCart = () => {
    addToCart(product);
    setShowAddedNotification(true);
    setTimeout(() => setShowAddedNotification(false), 3000);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.media.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.media.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Added to Cart Notification */}
      <AnimatePresence>
        {showAddedNotification && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] pointer-events-none"
          >
            <div className="px-6 py-3 rounded-xl shadow-2xl backdrop-blur-md border-2 bg-green-500/20 border-green-400 text-green-100 flex items-center gap-3">
              <Check className="w-5 h-5" />
              <div>
                <p className="font-bold text-sm">Added to Cart!</p>
                <p className="text-xs opacity-90">{product.name}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-gray-800/50"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <Link to="/checkout">
              <Button size="icon" variant="ghost" className="hover:text-purple-400">
                <ShoppingCart className="w-5 h-5" />
              </Button>
            </Link>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleSave}
              className={isSaved ? "text-red-500 hover:text-red-400" : "hover:text-red-500"}
            >
              <Heart className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
            </Button>
            <Button size="icon" variant="ghost" className="hover:text-purple-400">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-900 border border-gray-800 shadow-xl">
              <motion.img
                key={currentImageIndex}
                src={product.media[currentImageIndex].url}
                alt={product.name}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              
              {product.media.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors shadow-lg"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors shadow-lg"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Image Indicators */}
              {product.media.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {product.media.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentImageIndex
                          ? "bg-white w-6"
                          : "bg-white/50 hover:bg-white/70 w-2"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.media.length > 1 && (
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {product.media.map((media, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`aspect-square rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all ${
                      idx === currentImageIndex
                        ? "border-purple-500 shadow-lg shadow-purple-500/20"
                        : "border-transparent hover:border-gray-600"
                    }`}
                  >
                    <img
                      src={media.url}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-5 sm:space-y-6">
            <div className="space-y-2 sm:space-y-3">
              <p className="text-purple-400 text-sm sm:text-base font-semibold tracking-wide uppercase">
                {product.brand}
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                {product.name}
              </h1>
              <p className="text-3xl sm:text-4xl font-bold text-white">${product.price}</p>
            </div>

            {/* Style Tags */}
            <div className="flex gap-2 flex-wrap">
              {product.style_tags?.map((tag, idx) => (
                <Badge key={idx} variant="secondary" className="px-3 py-1.5 text-sm">
                  #{tag}
                </Badge>
              ))}
            </div>

            {/* Description */}
            <div className="space-y-2 sm:space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold text-white">Description</h2>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                {product.description}
              </p>
            </div>

            {/* AI Styling Tips */}
            {product.ai_styling_tips && (
              <Card className="bg-purple-500/10 border-purple-500/30">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <CardTitle className="text-base sm:text-lg">AI Styling Tips</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    {product.ai_styling_tips}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Specifications */}
            {product.specifications && (
              <div className="space-y-3">
                <h2 className="text-lg sm:text-xl font-semibold text-white">Specifications</h2>
                <div className="space-y-2 bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm sm:text-base py-2 border-b border-gray-800 last:border-b-0">
                      <span className="text-gray-400 capitalize font-medium">{key}:</span>
                      <span className="text-gray-200 text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && (
              <div className="space-y-3">
                <h2 className="text-lg sm:text-xl font-semibold text-white">Available Sizes</h2>
                <div className="flex gap-2 sm:gap-3 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border border-gray-700 hover:border-purple-500 hover:bg-purple-500/10 text-gray-300 hover:text-white transition-all font-medium"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 sm:pt-6">
              <Button
                size="lg"
                className="w-full text-base sm:text-lg h-12 sm:h-14 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full text-base sm:text-lg h-12 sm:h-14 border-purple-500/50 hover:bg-purple-500/10 hover:border-purple-500 transition-all"
                onClick={handleBuyClick}
              >
                <ShoppingBag className="w-5 h-5" />
                Buy Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full text-base sm:text-lg h-12 sm:h-14 border-purple-500/50 hover:bg-purple-500/10 hover:border-purple-500 transition-all"
                onClick={() => alert('Virtual try-on feature coming soon!')}
              >
                <Sparkles className="w-5 h-5" />
                Try On Virtually
              </Button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {RELATED_PRODUCTS.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {RELATED_PRODUCTS.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/product/${relatedProduct.id}`}
                  className="group"
                >
                  <Card className="overflow-hidden hover:border-purple-500/50 transition-all">
                    <div className="aspect-square overflow-hidden bg-gray-800">
                      <img
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <CardHeader className="p-4">
                      <CardDescription className="text-xs text-purple-300">
                        {relatedProduct.brand}
                      </CardDescription>
                      <CardTitle className="text-sm">{relatedProduct.name}</CardTitle>
                      <p className="text-base font-bold text-white">${relatedProduct.price}</p>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
