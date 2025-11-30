import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Zap, TrendingUp, Sparkles, ShoppingBag, BarChart3 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { api } from '../lib/api';
import { useProfileStore } from '../state/useProfileStore';

export default function LandingPage() {
  const [products, setProducts] = useState([]);
  const [isPrefetching, setIsPrefetching] = useState(false);
  const { isProfileComplete } = useProfileStore();
  
  // Determine where to send users based on profile completion
  const startLink = isProfileComplete ? '/feed' : '/setup';

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Load preview products for landing page
        const response = await api.getProducts(8, 0);
        const data = response.products || response;
        if (Array.isArray(data)) {
          setProducts(data);
        }
        
        // Prefetch full initial batch for feed in background
        if (!isPrefetching) {
          setIsPrefetching(true);
          api.getProducts(20, 0).catch(err => 
            console.error('Background prefetch failed:', err)
          );
        }
      } catch (error) {
        console.error('Failed to load preview products:', error);
      }
    };

    loadProducts();
  }, []);

  const previewProducts = products.slice(0, 8);

  return (
    <div className="h-screen overflow-y-auto bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[400px]">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-700/10 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 py-6 md:py-8 lg:py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs sm:text-sm mb-3 sm:mb-4"
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              AI-Powered Product Discovery
            </motion.div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-white mb-2 sm:mb-3 leading-tight">
              Swipe, Like, Shop
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">
                The Future of Shopping
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-4 sm:mb-6 max-w-2xl mx-auto">
              Discover products tailored to your style. Swipe through an endless feed of curated items, powered by AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={startLink}>
                <Button size="xl" className="group">
                  Start Swiping
                  <Heart className="w-5 h-5 group-hover:fill-current transition-all" />
                </Button>
              </Link>
              <Link to="/auth?role=brand">
                <Button size="xl" variant="outline">
                  For Brands
                  <BarChart3 className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-8 md:py-10 lg:py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-6 md:mb-8"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
              How It Works
            </h2>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg">
              Three simple steps to your perfect shopping experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: "Tell Us Your Vibe",
                description: "Quick chat with our AI to understand your style, preferences, and budget.",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: Zap,
                title: "Swipe Through Smart Feed",
                description: "Browse an infinite feed of products curated just for you. Like what you see, skip what you don't.",
                color: "from-purple-500 to-blue-500"
              },
              {
                icon: ShoppingBag,
                title: "Shop in One Tap",
                description: "Found something you love? Buy instantly or try it on virtually with our AI try-on feature.",
                color: "from-purple-500 to-purple-700"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="h-full hover:border-purple-500/50 transition-all duration-300 group">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle>{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Benefits Section */}
      <section className="py-8 md:py-10 lg:py-12 px-4 bg-gradient-to-b from-transparent to-purple-950/20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-6 md:mb-8"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
              Built for Brands
            </h2>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg">
              Powerful analytics and AI-driven insights to grow your business
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: BarChart3,
                title: "Deep Analytics",
                description: "Track views, engagement, CTR, and conversions in real-time. Understand what resonates with your audience.",
              },
              {
                icon: Sparkles,
                title: "AI Insights",
                description: "Get actionable recommendations powered by AI. Know what's working and what to optimize.",
              },
              {
                icon: TrendingUp,
                title: "Easy Upload",
                description: "Upload products and creatives in seconds. Our AI helps with descriptions and tagging.",
              },
              {
                icon: Heart,
                title: "Engaged Audience",
                description: "Reach shoppers actively looking for products like yours. Higher intent, better conversions.",
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:border-purple-500/50 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                        <benefit.icon className="w-5 h-5 text-purple-300" />
                      </div>
                      <div>
                        <CardTitle className="text-lg mb-2">{benefit.title}</CardTitle>
                        <CardDescription>{benefit.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/auth?role=brand">
              <Button size="xl" variant="outline" className="border-purple-500/50 hover:bg-purple-500/10">
                Get Started as a Brand
                <TrendingUp className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Live Preview Strip */}
      <section className="py-8 md:py-10 lg:py-12 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-4 md:mb-6"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
              Discover Amazing Products
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm md:text-base">
              Just a glimpse of what's waiting for you
            </p>
          </motion.div>

          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {previewProducts.length === 0 ? (
              <p className="text-gray-400">Products are loading...</p>
            ) : (
              previewProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="flex-shrink-0 w-64"
                >
                  <Card className="overflow-hidden hover:border-purple-500/50 transition-all cursor-pointer">
                    <div className="aspect-square overflow-hidden bg-gray-800">
                      <img
                        src={product.image_url || product.media?.[0]?.url || 'https://via.placeholder.com/300?text=No+Image'}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <CardHeader className="p-4">
                      {product.category && (
                        <CardDescription className="text-xs text-purple-300">
                          {product.category}
                        </CardDescription>
                      )}
                      <CardTitle className="text-base">{product.name}</CardTitle>
                      <p className="text-lg font-bold text-white">${product.price}</p>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6 md:py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-4 md:gap-6 mb-4 md:mb-6">
            <div>
              <h3 className="text-white font-bold text-xl mb-4">Swipey</h3>
              <p className="text-gray-400 text-sm">
                AI-powered shopping experience for the modern consumer.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/feed" className="hover:text-purple-400 transition-colors">Shop Feed</Link></li>
                <li><Link to="/auth" className="hover:text-purple-400 transition-colors">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">For Brands</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/auth?role=brand" className="hover:text-purple-400 transition-colors">Brand Login</Link></li>
                <li><Link to="/auth?role=brand" className="hover:text-purple-400 transition-colors">Get Started</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-purple-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-3 md:pt-4 text-center text-gray-500 text-xs sm:text-sm">
            © 2025 Swipey. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
