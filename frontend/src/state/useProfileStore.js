import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useProfileStore = create(
  persist(
    (set, get) => ({
      // User profile data
      name: '',
      age: '',
      gender: '',
      preferredStyles: [],
      isProfileComplete: false,
      hasSeenWelcome: false,

      // Saved items (bookmark button)
      savedItems: [],

      // Add item to saved list
      addSavedItem: (product) => {
        const { savedItems } = get();
        // Check if already saved
        if (!savedItems.find(item => item.id === product.id)) {
          set({ savedItems: [...savedItems, product] });
        }
      },

      // Remove item from saved list
      removeSavedItem: (productId) => {
        set({ savedItems: get().savedItems.filter(item => item.id !== productId) });
      },

      // Check if item is saved
      isItemSaved: (productId) => {
        return get().savedItems.some(item => item.id === productId);
      },

      // Set profile data
      setProfile: (profileData) => {
        set({
          ...profileData,
          isProfileComplete: true,
        });
      },

      // Update specific profile fields
      updateProfile: (updates) => {
        set((state) => ({
          ...state,
          ...updates,
        }));
      },

      // Add preferred style
      addPreferredStyle: (style) => {
        const { preferredStyles } = get();
        if (!preferredStyles.includes(style)) {
          set({
            preferredStyles: [...preferredStyles, style],
          });
        }
      },

      // Remove preferred style
      removePreferredStyle: (style) => {
        set({
          preferredStyles: get().preferredStyles.filter(s => s !== style),
        });
      },

      // Set preferred styles array
      setPreferredStyles: (styles) => {
        set({ preferredStyles: styles });
      },

      // Mark welcome as seen
      markWelcomeSeen: () => {
        set({ hasSeenWelcome: true });
      },

      // Clear profile (for testing/reset)
      clearProfile: () => {
        set({
          name: '',
          age: '',
          gender: '',
          preferredStyles: [],
          isProfileComplete: false,
          hasSeenWelcome: false,
          savedItems: [],
        });
      },
    }),
    {
      name: 'profile-storage',
    }
  )
);
