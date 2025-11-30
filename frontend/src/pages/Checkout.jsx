import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, CreditCard } from 'lucide-react';
import { useCheckoutStore } from '../state/useCheckoutStore';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';

export default function Checkout() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotal, getTotalItems } = useCheckoutStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const displayItems = cartItems;
  const total = getTotal();
  const itemCount = getTotalItems();

  const handleCheckout = async () => {
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setOrderComplete(true);
      clearCart();
    }, 2000);
  };

  if (orderComplete) {
    return (
      <div className="h-screen w-full bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CreditCard className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Order Placed!</h1>
          <p className="text-gray-400 mb-8">
            Thank you for your purchase. We'll send you a confirmation email shortly.
          </p>
          <div className="flex flex-col gap-3">
            <Link to="/feed">
              <Button size="lg" className="w-full">
                Continue Shopping
              </Button>
            </Link>
            <Link to="/">
              <Button size="lg" variant="outline" className="w-full">
                Back to Home
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-40 flex-shrink-0">
        <div className="container mx-auto px-4 py-4 max-w-6xl">
          <div className="flex items-center justify-between">
            <Link to="/feed" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Feed</span>
            </Link>
            <h1 className="text-xl font-bold text-white">Checkout</h1>
            <div className="w-24" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8 max-w-6xl">
        {displayItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <ShoppingCart className="w-20 h-20 text-gray-700 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
            <p className="text-gray-400 mb-8">Start swiping to find products you love!</p>
            <Link to="/feed">
              <Button size="lg">
                Start Shopping
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                </h2>
                {cartItems.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs sm:text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    Clear Cart
                  </button>
                )}
              </div>

              <AnimatePresence>
                {displayItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="overflow-hidden">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex gap-3 sm:gap-4">
                          {/* Product Image */}
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                            <img
                              src={item.media?.[0]?.url || item.image_url || item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              {item.category && (
                                <p className="text-xs text-purple-300 font-semibold mb-1">
                                  {item.category}
                                </p>
                              )}
                              <h3 className="text-sm sm:text-base text-white font-semibold mb-1 sm:mb-2 line-clamp-2">
                                {item.name}
                              </h3>
                            </div>
                            <p className="text-base sm:text-lg font-bold text-white">
                              ${item.price}
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex flex-col items-end justify-between flex-shrink-0">
                            <button
                              onClick={() => cartItems.length > 0 ? removeFromCart(item.id) : null}
                              className="text-gray-400 hover:text-red-400 transition-colors p-1"
                              disabled={cartItems.length === 0}
                            >
                              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>

                            <div className="flex items-center gap-1 sm:gap-2">
                              <button
                                onClick={() => cartItems.length > 0 ? updateQuantity(item.id, item.quantity - 1) : null}
                                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-white transition-colors"
                                disabled={cartItems.length === 0}
                              >
                                <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                              <span className="text-white font-medium w-6 sm:w-8 text-center text-sm sm:text-base">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => cartItems.length > 0 ? updateQuantity(item.id, item.quantity + 1) : null}
                                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-white transition-colors"
                                disabled={cartItems.length === 0}
                              >
                                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <Card>
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="text-lg sm:text-xl">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm sm:text-base text-gray-400">
                        <span>Subtotal</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm sm:text-base text-gray-400">
                        <span>Shipping</span>
                        <span>Free</span>
                      </div>
                      <div className="flex justify-between text-sm sm:text-base text-gray-400">
                        <span>Tax</span>
                        <span>${(total * 0.1).toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="border-t border-gray-800 pt-3 sm:pt-4">
                      <div className="flex justify-between text-white text-lg sm:text-xl font-bold">
                        <span>Total</span>
                        <span>${(total * 1.1).toFixed(2)}</span>
                      </div>
                    </div>

                    <Button
                      size="lg"
                      className="w-full"
                      onClick={handleCheckout}
                      disabled={isProcessing || displayItems.length === 0}
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
                          Proceed to Payment
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-gray-400 text-center">
                      Secure checkout powered by TrendSwipe
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
