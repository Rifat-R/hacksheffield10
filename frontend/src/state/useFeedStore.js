import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFeedStore = create(
  persist(
    (set) => ({
      products: [],
      currentIndex: 0,
      likes: [],
      passes: [],
      cursor: null,
      
      setProducts: (products) => set({ products }),
      
      nextProduct: () => set((state) => ({ 
        currentIndex: state.currentIndex + 1 
      })),
      
      addLike: (product) => set((state) => ({ 
        likes: [...state.likes, product] 
      })),
      
      addPass: (product) => set((state) => ({ 
        passes: [...state.passes, product] 
      })),
      
      setCursor: (cursor) => set({ cursor }),
      
      reset: () => set({ 
        products: [], 
        currentIndex: 0, 
        likes: [], 
        passes: [],
        cursor: null 
      }),
    }),
    {
      name: 'feed-storage',
    }
  )
);
