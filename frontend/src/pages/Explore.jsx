import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { X, Home, Bookmark, User, ShoppingCart, Map, Sparkles, Lock, CheckCircle2, Trophy, Star, Crown, ChevronRight, ScrollText, Heart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { api } from '../lib/api';

// Realm definitions with quests
const REALMS = [
  {
    slug: "realm_minimalism",
    name: "Realm of Minimalism",
    shortTitle: "Minimalism",
    emoji: "⚪",
    description: "Clean lines, neutral tones, and quiet confidence.",
    lore: "Minimalism is all about quiet confidence. Clean lines, neutral tones, and timeless pieces come together to create a look that feels effortless but intentional. It’s style that speaks softly—yet says everything.",
    unlockEssence: 0,
    orderIndex: 1,
    position: 78,
    color: "from-gray-400 to-gray-600",
    primaryTags: ["minimal", "neutral", "clean"],
    quests: [
      {
        id: "discover_3_items",
        label: "Discover 3 Artifacts",
        description: "Open three items that align with minimalist style.",
        essenceReward: 3,
      },
      {
        id: "like_3_items",
        label: "Choose Your Favorites",
        description: "Like three minimalist items on your path.",
        essenceReward: 5,
      },
      {
        id: "read_lore",
        label: "Read the Realm Lore",
        description: "Open and read the lore scroll of this realm.",
        essenceReward: 2,
      },
    ],
  },
  {
    slug: "realm_streetwear",
    name: "Realm of Streetwear Docks",
    shortTitle: "Streetwear",
    emoji: "🏙️",
    description: "Bold logos, layered fits, and city-born attitude.",
    lore: "Streetwear is built on attitude and ease. Oversized layers, bold graphics, and worn-in sneakers come together to create a look that feels effortless but full of personality. It’s style that moves with you",
    unlockEssence: 10,
    prerequisiteSlug: "realm_minimalism",
    orderIndex: 2,
    position: 65,
    color: "from-orange-500 to-red-500",
    primaryTags: ["streetwear", "casual", "bold"],
    quests: [
      { id: "discover_3_items", label: "Scout the Docks", description: "View three streetwear items.", essenceReward: 3 },
      { id: "like_3_items", label: "Claim Your Look", description: "Like three streetwear pieces.", essenceReward: 5 },
      { id: "read_lore", label: "Hear the Pulse", description: "Read the lore of the Streetwear Docks.", essenceReward: 2 },
    ],
  },
  {
    slug: "realm_soft_academia",
    name: "Realm of Soft Academia",
    shortTitle: "Soft Academia",
    emoji: "📚",
    description: "Cozy knits, warm tones, and quiet study vibes.",
    lore: "Soft Academia is all about warmth and quiet charm. Cozy knits, pleats, and well loved layers create a look that feels thoughtful and intimate, like a favorite story you keep returning to. It’s style that’s gentle, nostalgic, and deeply personal.",
    unlockEssence: 20,
    prerequisiteSlug: "realm_minimalism",
    orderIndex: 3,
    position: 52,
    color: "from-amber-500 to-yellow-600",
    primaryTags: ["soft", "cozy", "neutral"],
    quests: [
      { id: "discover_3_items", label: "Browse the Library", description: "View three soft academia items.", essenceReward: 3 },
      { id: "like_3_items", label: "Choose Your Study Fit", description: "Like three items from this realm.", essenceReward: 5 },
      { id: "read_lore", label: "Read the Lore", description: "Open the lore scroll of this realm.", essenceReward: 2 },
    ],
  },
  {
    slug: "realm_monochrome",
    name: "Realm of Monochrome",
    shortTitle: "Monochrome",
    emoji: "🖤",
    description: "Black, white, and the spectrum between.",
    lore: "With a monochrome style, color fades to shadow and light. Every garment is a study in contrast- bold, sharp, and timeless. With monochrome, less is always more.",
    unlockEssence: 35,
    prerequisiteSlug: "realm_minimalism",
    orderIndex: 4,
    position: 39,
    color: "from-slate-700 to-zinc-900",
    primaryTags: ["monochrome", "black", "white"],
    quests: [
      { id: "discover_3_items", label: "See in Black & White", description: "View three monochrome items.", essenceReward: 3 },
      { id: "like_3_items", label: "Embrace Contrast", description: "Like three monochrome pieces.", essenceReward: 5 },
      { id: "read_lore", label: "Read the Lore", description: "Discover the monochrome philosophy.", essenceReward: 2 },
    ],
  },
  {
    slug: "realm_earthbound",
    name: "Realm of Earthbound Neutrals",
    shortTitle: "Earthbound",
    emoji: "🌾",
    description: "Warm tones inspired by nature.",
    lore: "The earthbound style embraces soft tones like terracotta, sage, and sand. Express yourself through organic, grounded, and endlessly comforting styles.",
    unlockEssence: 50,
    prerequisiteSlug: "realm_soft_academia",
    orderIndex: 5,
    position: 26,
    color: "from-amber-600 to-green-700",
    primaryTags: ["earth", "natural", "warm"],
    quests: [
      { id: "discover_3_items", label: "Walk the Earth", description: "View three earthbound items.", essenceReward: 3 },
      { id: "like_3_items", label: "Ground Yourself", description: "Like three earth-toned pieces.", essenceReward: 5 },
      { id: "read_lore", label: "Read the Lore", description: "Learn about earthbound style.", essenceReward: 2 },
    ],
  },
  {
    slug: "realm_techwear",
    name: "Realm of Techwear",
    shortTitle: "Techwear",
    emoji: "🔮",
    description: "Futuristic utility meets urban armor.",
    lore: "Transport yourself to the future with techwear. Functional zippers, waterproof fabrics, and modular designs turn clothing into equipment",
    unlockEssence: 70,
    prerequisiteSlug: "realm_streetwear",
    orderIndex: 6,
    position: 13,
    color: "from-cyan-600 to-blue-800",
    primaryTags: ["tech", "functional", "future"],
    quests: [
      { id: "discover_3_items", label: "Scout the Tech", description: "View three techwear items.", essenceReward: 3 },
      { id: "like_3_items", label: "Gear Up", description: "Like three techwear pieces.", essenceReward: 5 },
      { id: "read_lore", label: "Read the Lore", description: "Understand techwear philosophy.", essenceReward: 2 },
    ],
  },
];

// Initialize progress state from localStorage
const INITIAL_PROGRESS = {
  totalEssence: 0,
  realmProgress: REALMS.reduce((acc, realm) => {
    acc[realm.slug] = {
      status: realm.slug === "realm_minimalism" ? "UNLOCKED" : "LOCKED",
      questsCompleted: [],
      viewedCount: 0,
      likedCount: 0,
    };
    return acc;
  }, {}),
};

// Hook for managing odyssey progress
function useOdysseyProgress() {
  const [progress, setProgress] = useState(() => {
    try {
      const stored = localStorage.getItem("odyssey_progress");
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_PROGRESS;
  });

  useEffect(() => {
    localStorage.setItem("odyssey_progress", JSON.stringify(progress));
  }, [progress]);

  const addEssence = (amount) => {
    setProgress((prev) => {
      const updated = {
        ...prev,
        totalEssence: prev.totalEssence + amount,
      };
      return unlockRealmsFromEssence(updated);
    });
  };

  const completeQuest = (realmSlug, questId, rewardEssence) => {
    setProgress((prev) => {
      const realmProg = prev.realmProgress[realmSlug];
      if (!realmProg || realmProg.questsCompleted.includes(questId)) return prev;

      const realm = REALMS.find(r => r.slug === realmSlug);
      if (!realm) return prev;

      const updatedRealmProg = {
        ...realmProg,
        questsCompleted: [...realmProg.questsCompleted, questId],
      };

      const updatedTotalEssence = prev.totalEssence + rewardEssence;

      // Check if all quests are completed (MASTERED)
      const allQuestIds = realm.quests.map((q) => q.id);
      const allCompleted = allQuestIds.every((id) =>
        updatedRealmProg.questsCompleted.includes(id)
      );

      if (allCompleted) {
        updatedRealmProg.status = "MASTERED";
      }

      const updated = {
        ...prev,
        totalEssence: updatedTotalEssence,
        realmProgress: {
          ...prev.realmProgress,
          [realmSlug]: updatedRealmProg,
        },
      };

      return unlockRealmsFromEssence(updated);
    });
  };

  const unlockRealmsFromEssence = (state) => {
    const updatedRealmProgress = { ...state.realmProgress };
    REALMS.forEach((realm) => {
      const current = updatedRealmProgress[realm.slug];
      if (current.status === "LOCKED") {
        const prereqOk =
          !realm.prerequisiteSlug ||
          updatedRealmProgress[realm.prerequisiteSlug]?.status !== "LOCKED";
        if (prereqOk && state.totalEssence >= realm.unlockEssence) {
          updatedRealmProgress[realm.slug] = {
            ...current,
            status: "UNLOCKED",
          };
        }
      }
    });
    return {
      ...state,
      realmProgress: updatedRealmProgress,
    };
  };

  const trackItemView = (realmSlug) => {
    setProgress((prev) => {
      const realmProg = prev.realmProgress[realmSlug];
      if (!realmProg) return prev;

      const newCount = realmProg.viewedCount + 1;
      const updated = {
        ...prev,
        realmProgress: {
          ...prev.realmProgress,
          [realmSlug]: {
            ...realmProg,
            viewedCount: newCount,
          },
        },
      };

      // Check if discover quest should be completed (3 views)
      if (newCount === 3 && !realmProg.questsCompleted.includes('discover_3_items')) {
        const realm = REALMS.find(r => r.slug === realmSlug);
        const quest = realm?.quests.find(q => q.id === 'discover_3_items');
        if (quest) {
          return completeQuestInternal(updated, realmSlug, 'discover_3_items', quest.essenceReward);
        }
      }

      return updated;
    });
  };

  const trackItemLike = (realmSlug) => {
    setProgress((prev) => {
      const realmProg = prev.realmProgress[realmSlug];
      if (!realmProg) return prev;

      const newCount = realmProg.likedCount + 1;
      const updated = {
        ...prev,
        realmProgress: {
          ...prev.realmProgress,
          [realmSlug]: {
            ...realmProg,
            likedCount: newCount,
          },
        },
      };

      // Check if like quest should be completed (3 likes)
      if (newCount === 3 && !realmProg.questsCompleted.includes('like_3_items')) {
        const realm = REALMS.find(r => r.slug === realmSlug);
        const quest = realm?.quests.find(q => q.id === 'like_3_items');
        if (quest) {
          return completeQuestInternal(updated, realmSlug, 'like_3_items', quest.essenceReward);
        }
      }

      return updated;
    });
  };

  const completeQuestInternal = (state, realmSlug, questId, rewardEssence) => {
    const realmProg = state.realmProgress[realmSlug];
    if (realmProg.questsCompleted.includes(questId)) return state;

    const realm = REALMS.find(r => r.slug === realmSlug);
    if (!realm) return state;

    const updatedRealmProg = {
      ...realmProg,
      questsCompleted: [...realmProg.questsCompleted, questId],
    };

    const updatedTotalEssence = state.totalEssence + rewardEssence;

    // Check if all quests are completed (MASTERED)
    const allQuestIds = realm.quests.map((q) => q.id);
    const allCompleted = allQuestIds.every((id) =>
      updatedRealmProg.questsCompleted.includes(id)
    );

    if (allCompleted) {
      updatedRealmProg.status = "MASTERED";
    }

    const updated = {
      ...state,
      totalEssence: updatedTotalEssence,
      realmProgress: {
        ...state.realmProgress,
        [realmSlug]: updatedRealmProg,
      },
    };

    return unlockRealmsFromEssence(updated);
  };

  return {
    progress,
    addEssence,
    completeQuest,
    trackItemView,
    trackItemLike,
  };
}

// Particle animation component
function FloatingParticle({ delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 0, x: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [-100, -200, -300, -400],
        x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
        scale: [0, 1, 1, 0],
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 3,
      }}
      className="absolute bottom-0 left-1/2 w-2 h-2 bg-purple-400 rounded-full blur-sm"
      style={{ left: `${Math.random() * 100}%` }}
    />
  );
}

// Achievement unlock animation
function AchievementUnlock({ realm, onComplete }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        className="text-center"
      >
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            ease: 'easeInOut',
          }}
        >
          <Trophy className="w-32 h-32 text-yellow-500 mx-auto mb-6" />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-5xl font-bold text-white mb-4"
        >
          Realm Unlocked!
        </motion.h2>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.7, type: 'spring' }}
          className="text-7xl mb-4"
        >
          {realm.emoji}
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-3xl text-purple-300 mb-8"
        >
          {realm.name}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <Button
            onClick={onComplete}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-xl"
          >
            Continue Journey
            <ChevronRight className="ml-2" />
          </Button>
        </motion.div>
        
        {/* Celebration particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: [0, (Math.random() - 0.5) * 400],
              y: [0, (Math.random() - 0.5) * 400],
            }}
            transition={{
              duration: 2,
              delay: 0.5 + Math.random() * 0.5,
            }}
            className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full"
            style={{
              background: ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][Math.floor(Math.random() * 4)],
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

// Essence Progress Bar
function EssenceProgressBar({ currentEssence, nextUnlockEssence }) {
  const progress = nextUnlockEssence > 0 ? (currentEssence / nextUnlockEssence) * 100 : 100;
  
  return (
    <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden relative">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(progress, 100)}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="h-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 relative"
      >
        <motion.div
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />
      </motion.div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-white drop-shadow-lg">
          {currentEssence} Essence
        </span>
      </div>
    </div>
  );
}

function RealmCard({ realm, onClick, isActive, realmProgress }) {
  const [isHovered, setIsHovered] = useState(false);
  const isUnlocked = realmProgress.status !== "LOCKED";
  const isMastered = realmProgress.status === "MASTERED";
  const questsCompleted = realmProgress.questsCompleted.length;
  const totalQuests = realm.quests.length;
  
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: isUnlocked ? 1.1 : 1.05 }}
      whileTap={{ scale: isUnlocked ? 0.95 : 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`absolute left-1/2 -translate-x-1/2 cursor-pointer ${isActive ? 'z-30' : 'z-10'}`}
      style={{ top: `${realm.position}%` }}
      onClick={() => onClick(realm)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className={`relative w-32 h-32 rounded-full bg-gradient-to-br ${realm.color} shadow-2xl border-4 ${
        isActive ? 'border-white' : isMastered ? 'border-yellow-500' : 'border-gray-800'
      } flex flex-col items-center justify-center transition-all duration-300 overflow-hidden`}>
        
        {/* Animated ring effect for unlocked realms */}
        {isUnlocked && (
          <>
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className={`absolute inset-0 rounded-full border-4 ${isMastered ? 'border-yellow-500' : 'border-white'}`}
            />
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute inset-0"
            >
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute w-1 h-1 rounded-full ${isMastered ? 'bg-yellow-400' : 'bg-white'}`}
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${i * 45}deg) translateY(-60px)`,
                  }}
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </>
        )}
        
        {!isUnlocked && (
          <div className="absolute inset-0 bg-black/60 rounded-full backdrop-blur-sm flex items-center justify-center z-20">
            <motion.div
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Lock className="w-8 h-8 text-gray-300" />
            </motion.div>
          </div>
        )}
        
        <motion.div
          className="text-5xl mb-2 relative z-10"
          animate={{
            rotate: isHovered && isUnlocked ? [0, -10, 10, -10, 0] : 0,
          }}
          transition={{
            duration: 0.5,
          }}
        >
          {realm.emoji}
        </motion.div>
        
        {isMastered && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-1 z-20"
          >
            <Crown className="w-5 h-5 text-white" />
          </motion.div>
        )}
        
        {isUnlocked && !isMastered && questsCompleted > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1 z-20"
          >
            <CheckCircle2 className="w-5 h-5 text-white" />
          </motion.div>
        )}
        
        {/* Quest progress badge */}
        {isUnlocked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`absolute -bottom-2 ${isMastered ? 'bg-yellow-500 border-yellow-600' : 'bg-purple-900 border-purple-500'} border-2 rounded-full px-3 py-1 z-20`}
          >
            <span className="text-white text-xs font-bold">{questsCompleted}/{totalQuests} Quests</span>
          </motion.div>
        )}
      </div>
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-center mt-3 bg-gray-900/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-purple-500/50"
          >
            <p className="text-white font-bold text-sm">{realm.name}</p>
            {!isUnlocked && (
              <p className="text-purple-400 text-xs mt-1">{realm.unlockEssence} Essence Required</p>
            )}
            {isMastered && (
              <p className="text-yellow-400 text-xs mt-1">✨ Mastered</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function RealmDetail({ realm, onClose, realmProgress, onCompleteQuest, onTrackView, onTrackLike }) {
  const [showLore, setShowLore] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedProducts, setLikedProducts] = useState(new Set());
  const [viewedProducts, setViewedProducts] = useState(new Set());
  const isUnlocked = realmProgress.status !== "LOCKED";
  const isMastered = realmProgress.status === "MASTERED";

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.getProducts(50, 0);
      const allProducts = response.products || response;
      
      // Randomly select 6 products for this realm
      const shuffled = [...allProducts].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, 6);
      setProducts(selected);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isUnlocked) {
      fetchProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUnlocked]);

  const handleViewLore = () => {
    setShowLore(true);
    if (!realmProgress.questsCompleted.includes("read_lore")) {
      const loreQuest = realm.quests.find(q => q.id === "read_lore");
      if (loreQuest) {
        onCompleteQuest(realm.slug, "read_lore", loreQuest.essenceReward);
      }
    }
  };

  const handleViewProduct = (productId) => {
    if (!viewedProducts.has(productId)) {
      setViewedProducts(prev => new Set([...prev, productId]));
      onTrackView(realm.slug);
    }
  };

  const handleLikeProduct = (productId) => {
    if (!likedProducts.has(productId)) {
      setLikedProducts(prev => new Set([...prev, productId]));
      onTrackLike(realm.slug);
    } else {
      setLikedProducts(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="bg-gray-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden border-2 border-purple-500/50 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`bg-gradient-to-br ${realm.color} p-6 relative overflow-hidden`}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.5 }}
            className="text-8xl absolute right-4 top-1/2 -translate-y-1/2 opacity-20"
          >
            {realm.emoji}
          </motion.div>
          
          <div className="relative z-10">
            <Badge className="mb-3 bg-white/20 backdrop-blur-md border-white/30">
              {isMastered ? '👑 Mastered' : isUnlocked ? '✓ Unlocked' : '🔒 Locked'}
            </Badge>
            <h2 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <span className="text-5xl">{realm.emoji}</span>
              {realm.name}
            </h2>
            <p className="text-white/90 text-lg">{realm.description}</p>
            <p className="text-white/70 text-sm mt-2 italic">Part of your TrendSwipe journey</p>
          </div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors z-20"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {isUnlocked ? (
            <>
              {/* Lore Section */}
              <div className="mb-6">
                <Button
                  onClick={handleViewLore}
                  variant="outline"
                  className="w-full justify-start border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                >
                  <ScrollText className="w-5 h-5 mr-2" />
                  {showLore ? 'Lore Revealed' : 'View Realm Lore'}
                  {realmProgress.questsCompleted.includes("read_lore") && (
                    <CheckCircle2 className="w-4 h-4 ml-auto text-green-500" />
                  )}
                </Button>
                
                {showLore && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 p-4 bg-gray-800/50 rounded-lg border border-purple-500/30"
                  >
                    <p className="text-gray-300 leading-relaxed italic">{realm.lore}</p>
                  </motion.div>
                )}
              </div>

              {/* Quests Section */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  Realm Quests
                </h3>
                <div className="space-y-3">
                  {realm.quests.map((quest) => {
                    const isCompleted = realmProgress.questsCompleted.includes(quest.id);
                    return (
                      <motion.div
                        key={quest.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 rounded-lg border ${
                          isCompleted 
                            ? 'bg-green-500/10 border-green-500/50' 
                            : 'bg-gray-800/50 border-gray-700'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-white font-semibold flex items-center gap-2">
                              {isCompleted && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                              {quest.label}
                            </h4>
                            <p className="text-gray-400 text-sm mt-1">{quest.description}</p>
                          </div>
                          <Badge variant="outline" className="ml-2 border-purple-500/50 text-purple-300">
                            +{quest.essenceReward} Essence
                          </Badge>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Products Section */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-purple-500" />
                  Realm Artifacts ({realmProgress.viewedCount}/3 viewed, {realmProgress.likedCount}/3 liked)
                </h3>
                
                {loading ? (
                  <div className="text-center py-12">
                    <Sparkles className="w-16 h-16 text-purple-500 mx-auto mb-4 animate-spin" />
                    <p className="text-gray-400">Discovering artifacts...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {products.map((product) => {
                      const isViewed = viewedProducts.has(product.id);
                      const isLiked = likedProducts.has(product.id);
                      
                      return (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500/50 transition-all group relative"
                          onClick={() => handleViewProduct(product.id)}
                        >
                          <div className="aspect-square bg-gray-700 relative overflow-hidden">
                            <img
                              src={product.images?.[0] || product.image || 'https://via.placeholder.com/300?text=Fashion'}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            {isViewed && (
                              <div className="absolute top-2 left-2 bg-purple-600 rounded-full p-1">
                                <Eye className="w-4 h-4 text-white" />
                              </div>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLikeProduct(product.id);
                              }}
                              className="absolute top-2 right-2 bg-gray-900/80 hover:bg-gray-900 rounded-full p-2 transition-colors"
                            >
                              <Heart
                                className={`w-5 h-5 transition-colors ${
                                  isLiked ? 'fill-red-500 text-red-500' : 'text-white'
                                }`}
                              />
                            </button>
                          </div>
                          <div className="p-3">
                            <p className="text-white font-semibold text-sm line-clamp-1">{product.name || product.title}</p>
                            <p className="text-purple-400 text-xs">${product.price || '0.00'}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Style Tags */}
              <div className="flex gap-2 flex-wrap">
                {realm.primaryTags.map((tag, idx) => (
                  <Badge key={idx} variant="outline" className="border-purple-500/50 text-purple-300">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Lock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Realm Locked</h3>
              <p className="text-gray-400 mb-4">
                Gather {realm.unlockEssence} Essence to unlock this realm
              </p>
              {realm.prerequisiteSlug && (
                <p className="text-purple-400 text-sm">
                  Prerequisite: Master {REALMS.find(r => r.slug === realm.prerequisiteSlug)?.name}
                </p>
              )}
              <Button className="bg-purple-600 hover:bg-purple-700 mt-6" onClick={onClose}>
                Continue Journey
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Explore() {
  const [selectedRealm, setSelectedRealm] = useState(null);
  const [showAchievement, setShowAchievement] = useState(false);
  const [unlockedRealm, setUnlockedRealm] = useState(null);
  const scrollRef = useRef(null);
  const scrollY = useMotionValue(0);
  
  const { progress, completeQuest, trackItemView, trackItemLike } = useOdysseyProgress();
  
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        scrollY.set(scrollRef.current.scrollTop);
      }
    };
    
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, [scrollY]);

  const handleRealmClick = (realm) => {
    const realmProg = progress.realmProgress[realm.slug];
    if (realmProg.status === "LOCKED") {
      return;
    }
    setSelectedRealm(realm);
  };
  
  const handleUnlockRealm = (realm) => {
    setUnlockedRealm(realm);
    setShowAchievement(true);
  };
  
  // Get next realm to unlock for progress bar
  const lockedRealms = REALMS.filter(r => progress.realmProgress[r.slug].status === "LOCKED")
    .sort((a, b) => a.unlockEssence - b.unlockEssence);
  const nextUnlockEssence = lockedRealms.length > 0 ? lockedRealms[0].unlockEssence : progress.totalEssence;

  return (
    <div className="h-screen w-full bg-gray-950 flex flex-col overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.3} />
        ))}
        
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [180, 0, 180],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Header */}
      <header className="px-4 py-3 sm:py-4 sm:px-6 border-b border-gray-800/50 backdrop-blur-sm bg-gray-900/50 relative z-10">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-start mb-3">
            <div>
              <motion.h1
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2"
              >
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Map className="w-6 h-6 text-purple-500" />
                </motion.div>
                TrendSwipe
              </motion.h1>
              <motion.p
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-xs sm:text-sm text-gray-400"
              >
                Explore your style journey
              </motion.p>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="flex flex-col items-end gap-2"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1 bg-purple-500/20 border border-purple-500/50 rounded-full px-3 py-1"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-bold text-purple-300">{progress.totalEssence} Essence</span>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Essence Progress Bar */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3 }}
            className="origin-left"
          >
            <EssenceProgressBar currentEssence={progress.totalEssence} nextUnlockEssence={nextUnlockEssence} />
          </motion.div>
        </div>
      </header>

      {/* Journey Map */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col-reverse" ref={scrollRef}>
        <motion.div
          className="relative min-h-[200vh] w-full"
          style={{
            y: useTransform(scrollY, [0, 1000], [0, -50]),
          }}
        >
          {/* Journey Path */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ minHeight: '200vh' }}
          >
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: 'easeInOut' }}
              d="M 50% 5% Q 30% 20%, 50% 25% T 50% 45% T 50% 65% T 50% 85% T 50% 95%"
              stroke="url(#gradient)"
              strokeWidth="4"
              fill="none"
              strokeDasharray="10 5"
              className="drop-shadow-lg"
            />
            
            {/* Animated glow on the path */}
            <motion.path
              animate={{
                strokeDashoffset: [0, -100],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
              d="M 50% 5% Q 30% 20%, 50% 25% T 50% 45% T 50% 65% T 50% 85% T 50% 95%"
              stroke="url(#glowGradient)"
              strokeWidth="6"
              fill="none"
              strokeDasharray="20 80"
              className="opacity-70"
              style={{ filter: 'blur(4px)' }}
            />
            
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#ec4899" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="glowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.8" />
              </linearGradient>
            </defs>
          </svg>

          {/* Realms */}
          {REALMS.map((realm) => (
            <RealmCard
              key={realm.slug}
              realm={realm}
              onClick={handleRealmClick}
              isActive={selectedRealm?.slug === realm.slug}
              realmProgress={progress.realmProgress[realm.slug]}
            />
          ))}

          {/* Start Point */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="absolute left-1/2 -translate-x-1/2 bottom-[2%] flex flex-col items-center"
          >
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 20px rgba(168, 85, 247, 0.4)',
                  '0 0 40px rgba(168, 85, 247, 0.8)',
                  '0 0 20px rgba(168, 85, 247, 0.4)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-full p-4 shadow-2xl flex items-center justify-center relative"
            >
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              
              {/* Orbiting particles */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: i * 0.75,
                  }}
                  style={{
                    top: '50%',
                    left: '50%',
                    transformOrigin: '0 0',
                    transform: `rotate(${i * 90}deg) translateX(40px) translateY(-50%)`,
                  }}
                />
              ))}
            </motion.div>
            <motion.p
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="text-white font-bold text-center mt-2 whitespace-nowrap"
            >
              Start Your Journey
            </motion.p>
          </motion.div>

          {/* End Point */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: 'spring' }}
            className="absolute left-1/2 -translate-x-1/2 top-[2%] flex flex-col items-center"
          >
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 30px rgba(251, 191, 36, 0.6)',
                  '0 0 60px rgba(251, 191, 36, 1)',
                  '0 0 30px rgba(251, 191, 36, 0.6)',
                ],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full p-4 shadow-2xl flex items-center justify-center relative"
            >
              <Crown className="w-8 h-8 text-white" />
              
              {/* Sparkle effects around crown */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${i * 60}deg) translateY(-50px)`,
                  }}
                >
                  <Star className="w-4 h-4 text-yellow-300" />
                </motion.div>
              ))}
            </motion.div>
            <motion.p
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5,
              }}
              className="text-white font-bold text-center mt-2 whitespace-nowrap"
            >
              🏆 Style Master
            </motion.p>
          </motion.div>
        </motion.div>
      </div>

      {/* Achievement Unlock Animation */}
      <AnimatePresence>
        {showAchievement && unlockedRealm && (
          <AchievementUnlock
            realm={unlockedRealm}
            onComplete={() => {
              setShowAchievement(false);
              setUnlockedRealm(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Realm Detail Modal */}
      <AnimatePresence>
        {selectedRealm && (
          <RealmDetail
            realm={selectedRealm}
            realmProgress={progress.realmProgress[selectedRealm.slug]}
            onClose={() => setSelectedRealm(null)}
            onCompleteQuest={completeQuest}
            onTrackView={trackItemView}
            onTrackLike={trackItemLike}
          />
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <nav className="border-t border-gray-800/50 bg-gray-900/80 backdrop-blur-lg relative z-10 flex-shrink-0">
        <div className="max-w-md mx-auto flex justify-around py-2 sm:py-3 px-4">
          <Link to="/feed" className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300 transition-colors py-2 px-4 rounded-lg hover:bg-gray-800/50">
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Feed</span>
          </Link>
          <Link to="/saved" className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300 transition-colors py-2 px-4 rounded-lg hover:bg-gray-800/50">
            <Bookmark className="w-6 h-6" />
            <span className="text-xs font-medium">Saved</span>
          </Link>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/explore" className="flex flex-col items-center gap-1 text-purple-400 py-2 px-4 rounded-lg relative">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Map className="w-6 h-6" />
              </motion.div>
              <span className="text-xs font-medium">Explore</span>
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full"
              />
            </Link>
          </motion.div>
          <Link to="/checkout" className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300 transition-colors py-2 px-4 rounded-lg hover:bg-gray-800/50">
            <ShoppingCart className="w-6 h-6" />
            <span className="text-xs font-medium">Cart</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300 transition-colors py-2 px-4 rounded-lg hover:bg-gray-800/50">
            <User className="w-6 h-6" />
            <span className="text-xs font-medium">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
