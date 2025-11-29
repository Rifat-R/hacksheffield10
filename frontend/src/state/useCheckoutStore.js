import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCheckoutStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      
      // Add item to cart
      addToCart: (product) => {
        const { cartItems } = get();
        const existingItem = cartItems.find(item => item.id === product.id);
        
        if (existingItem) {
          // Increase quantity if item already exists
          set({
            cartItems: cartItems.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          });
        } else {
          // Add new item with quantity 1
          set({
            cartItems: [...cartItems, { ...product, quantity: 1 }]
          });
        }
      },
      
      // Remove item from cart
      removeFromCart: (productId) => {
        set({
          cartItems: get().cartItems.filter(item => item.id !== productId)
        });
      },
      
      // Update item quantity
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        
        set({
          cartItems: get().cartItems.map(item =>
            item.id === productId
              ? { ...item, quantity }
              : item
          )
        });
      },
      
      // Clear cart
      clearCart: () => {
        set({ cartItems: [] });
      },
      
      // Get total price
      getTotal: () => {
        return get().cartItems.reduce(
          (total, item) => total + (item.price * item.quantity),
          0
        );
      },
      
      // Get total items count
      getTotalItems: () => {
        return get().cartItems.reduce(
          (total, item) => total + item.quantity,
          0
        );
      }
    }),
    {
      name: 'checkout-storage',
    }
  )
);
