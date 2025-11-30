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
    <div className="h-screen w-full overflow-y-auto bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 scrollbar-hide">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center justify-center">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-700/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Glassmorphic Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-xl bg-white/5 border border-white/10 text-purple-300 text-sm mb-8 shadow-lg"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="font-medium">Embark on Your Style Journey</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight tracking-tight"
            >
              Fashion
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600">
                Odyssey
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed"
            >
              Swipe. Discover. Style. Your personalized fashion journey awaits.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link to={startLink} className="w-full sm:w-auto">
                <Button 
                  size="xl" 
                  className="w-full sm:w-auto text-lg px-8 py-6 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 border-0 shadow-2xl shadow-purple-500/40 backdrop-blur-xl group transition-all duration-300"
                >
                  Begin Your Journey
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </Button>
              </Link>
              
              <Link to="/explore" className="w-full sm:w-auto">
                <Button 
                  size="xl"
                  variant="outline"
                  className="w-full sm:w-auto text-lg px-8 py-6 backdrop-blur-xl bg-white/5 border-white/10 hover:bg-white/10 text-white shadow-lg"
                >
                  Explore Realms
                  <Heart className="w-5 h-5" />
                </Button>
              </Link>
            </motion.div>

            {/* Floating Cards Preview */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="mt-20 grid grid-cols-3 gap-4 max-w-3xl mx-auto"
            >
              {['Minimalism', 'Streetwear', 'Academia'].map((realm, i) => (
                <motion.div
                  key={realm}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 + i * 0.1, duration: 0.6 }}
                  whileHover={{ y: -8, scale: 1.05 }}
                  className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl hover:shadow-purple-500/20 transition-all duration-300"
                >
                  <div className="text-3xl mb-3">
                    {i === 0 ? '⚪' : i === 1 ? '🎨' : '📚'}
                  </div>
                  <h3 className="text-white font-semibold text-sm">{realm}</h3>
                  <p className="text-gray-400 text-xs mt-1">Realm of Style</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-2"
          >
            <motion.div 
              className="w-1.5 h-1.5 bg-purple-400 rounded-full"
              animate={{ y: [0, 16, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </motion.div>
        </motion.div>
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
      <section className="py-8 md:py-10 lg:py-12 px-4 overflow-visible">
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

          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide overflow-y-visible">
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
                  <Card className="overflow-visible hover:border-purple-500/50 transition-all cursor-pointer">
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
              <h3 className="text-white font-bold text-xl mb-4">TrendSwipe</h3>
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
            © 2025 TrendSwipe. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
