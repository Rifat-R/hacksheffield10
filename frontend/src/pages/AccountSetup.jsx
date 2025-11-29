import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, Users, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../state/useProfileStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';

const STYLE_OPTIONS = [
  { id: 'casual', label: 'Casual', emoji: '👕' },
  { id: 'formal', label: 'Formal', emoji: '👔' },
  { id: 'sporty', label: 'Sporty', emoji: '👟' },
  { id: 'luxury', label: 'Luxury', emoji: '💎' },
  { id: 'minimal', label: 'Minimal', emoji: '⚪' },
  { id: 'vintage', label: 'Vintage', emoji: '🕰️' },
  { id: 'streetwear', label: 'Streetwear', emoji: '🧢' },
  { id: 'bohemian', label: 'Bohemian', emoji: '🌸' },
  { id: 'classic', label: 'Classic', emoji: '🎩' },
  { id: 'modern', label: 'Modern', emoji: '✨' },
];

export default function AccountSetup() {
  const navigate = useNavigate();
  const { setProfile } = useProfileStore();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    preferredStyles: [],
  });
  const [errors, setErrors] = useState({});

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.age || formData.age < 13 || formData.age > 120) {
      newErrors.age = 'Please enter a valid age (13-120)';
    }
    if (!formData.gender) {
      newErrors.gender = 'Please select a gender';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleStyleToggle = (styleId) => {
    setFormData(prev => ({
      ...prev,
      preferredStyles: prev.preferredStyles.includes(styleId)
        ? prev.preferredStyles.filter(s => s !== styleId)
        : [...prev.preferredStyles, styleId]
    }));
  };

  const handleSubmit = () => {
    setProfile(formData);
    navigate('/feed');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4 py-8">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-700/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-2xl"
      >
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-xl">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Sparkles className="w-10 h-10 text-purple-400" />
            </motion.div>
            <CardTitle className="text-3xl font-bold text-white mb-2">
              {step === 1 ? '✨ Welcome to Swipeify' : '🎨 Your Style Preferences'}
            </CardTitle>
            <CardDescription className="text-gray-400 text-lg">
              {step === 1
                ? "Let's get to know you better"
                : 'Select your favorite styles (optional)'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 1 ? (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Name Input */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <User className="w-4 h-4" />
                    Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 ${
                      errors.name ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-400">{errors.name}</p>
                  )}
                </div>

                {/* Age Input */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <Calendar className="w-4 h-4" />
                    Age
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className={`bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 ${
                      errors.age ? 'border-red-500' : ''
                    }`}
                    min="13"
                    max="120"
                  />
                  {errors.age && (
                    <p className="text-sm text-red-400">{errors.age}</p>
                  )}
                </div>

                {/* Gender Selection */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <Users className="w-4 h-4" />
                    Gender
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Male', 'Female', 'Other'].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setFormData({ ...formData, gender: option })}
                        className={`py-3 px-4 rounded-lg border-2 transition-all ${
                          formData.gender === option
                            ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                            : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  {errors.gender && (
                    <p className="text-sm text-red-400">{errors.gender}</p>
                  )}
                </div>

                <Button
                  onClick={handleNext}
                  size="lg"
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Next Step
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Style Selection */}
                <div className="space-y-4">
                  <p className="text-sm text-gray-400 text-center">
                    Select as many styles as you like. This helps us personalize your feed!
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {STYLE_OPTIONS.map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => handleStyleToggle(style.id)}
                        className={`py-4 px-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                          formData.preferredStyles.includes(style.id)
                            ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                            : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        <span className="text-2xl">{style.emoji}</span>
                        <span className="text-sm font-medium">{style.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setStep(1)}
                    size="lg"
                    variant="outline"
                    className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    size="lg"
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    Complete Setup
                    <Sparkles className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-2 pt-4">
              <div className={`w-2 h-2 rounded-full ${step === 1 ? 'bg-purple-500' : 'bg-gray-600'}`} />
              <div className={`w-2 h-2 rounded-full ${step === 2 ? 'bg-purple-500' : 'bg-gray-600'}`} />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
