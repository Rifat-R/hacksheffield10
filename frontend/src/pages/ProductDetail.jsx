import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, ShoppingCart, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { api } from '../lib/api';
import { getProductImage, normalizeProduct } from '../lib/productUtils';
import { useCheckoutStore } from '../state/useCheckoutStore';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [showAddedNotification, setShowAddedNotification] = useState(false);

  const { addToCart } = useCheckoutStore();

  const productImages = useMemo(() => {
    if (!product) return [];
    const mediaImages = product.media?.map((item) => item.url || item) || [];
    if (product.image_url && mediaImages.length === 0) {
      mediaImages.push(product.image_url);
    }
    return mediaImages;
  }, [product]);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts();
      const normalized = Array.isArray(data) ? data.map((item, idx) => normalizeProduct(item, idx)) : [];
      const found =
        normalized.find((item) => String(item.id) === String(id)) ||
        normalized.find((item) => String(item.external_id) === String(id));
      setProduct(found || null);
      setCurrentImageIndex(0);
    } catch (error) {
      console.error('Failed to load product:', error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
    setShowAddedNotification(true);
    setTimeout(() => setShowAddedNotification(false), 3000);
  };

  const nextImage = () => {
    if (productImages.length <= 1) return;
    setCurrentImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    if (productImages.length <= 1) return;
    setCurrentImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

  const displayedImage =
    productImages[currentImageIndex] ||
    getProductImage(product) ||
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-300">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Product not found</CardTitle>
            <CardDescription>We couldn't find that product. Try returning to the feed.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button onClick={() => navigate(-1)} variant="outline" className="flex-1">
              Go Back
            </Button>
            <Link to="/feed" className="flex-1">
              <Button className="w-full">Go to Feed</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                src={displayedImage}
                alt={product.name}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              
              {productImages.length > 1 && (
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

              {productImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {productImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-1.5 w-6 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white' : 'bg-white/40'}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant="secondary">{product.category}</Badge>
                <span className="text-lg font-semibold text-white">
                  ${product.price}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                {product.name}
              </h1>
              <p className="text-gray-300 text-base leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="flex gap-3 sm:gap-4">
              <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/checkout')}
              >
                Go to Checkout
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
                <CardDescription>
                  Basic information available from our catalog.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span className="text-gray-400">Category</span>
                  <span>{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Price</span>
                  <span>${product.price}</span>
                </div>
                {product.external_id && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">External ID</span>
                    <span>{product.external_id}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
