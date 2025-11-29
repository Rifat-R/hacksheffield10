import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFeedStore = create(
  persist(
    (set, get) => ({
      products: [],
      currentIndex: 0,
      likes: [],
      passes: [],
      cursor: null,
      hasMore: true,
      isLoading: false,
      totalProducts: 0,
      
      setProducts: (products) => set({ products }),
      
      appendProducts: (newProducts) => set((state) => ({
        products: [...state.products, ...newProducts]
      })),
      
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
      
      setHasMore: (hasMore) => set({ hasMore }),
      
      setIsLoading: (isLoading) => set({ isLoading }),
      
      setTotalProducts: (total) => set({ totalProducts: total }),
      
      loadMoreProducts: async (api) => {
        const state = get();
        if (state.isLoading || !state.hasMore) return;
        
        set({ isLoading: true });
        try {
          const offset = state.products.length;
          const response = await api.getProducts(20, offset);
          
          const newProducts = response.products || response;
          set((state) => ({
            products: [...state.products, ...newProducts],
            hasMore: response.hasMore !== undefined ? response.hasMore : newProducts.length === 20,
            totalProducts: response.total || state.totalProducts,
            isLoading: false
          }));
        } catch (error) {
          console.error('Failed to load more products:', error);
          set({ isLoading: false });
        }
      },
      
      reset: () => set({ 
        products: [], 
        currentIndex: 0, 
        likes: [], 
        passes: [],
        cursor: null,
        hasMore: true,
        isLoading: false,
        totalProducts: 0
      }),
    }),
    {
      name: 'feed-storage',
      partialize: (state) => ({
        products: state.products,
        currentIndex: state.currentIndex,
        likes: state.likes,
        passes: state.passes,
        totalProducts: state.totalProducts
      })
    }
  )
);
