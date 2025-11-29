import { create } from 'zustand';

export const useProfileStore = create((set, get) => ({
  // User profile data
  name: '',
  age: '',
  gender: '',
  preferredStyles: [],
  isProfileComplete: false,
  hasSeenWelcome: false,

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
    });
  },
}));
