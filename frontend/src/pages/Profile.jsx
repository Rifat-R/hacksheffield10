import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, Users, Sparkles, Edit2, Save, X, ArrowLeft, RotateCcw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useProfileStore } from '../state/useProfileStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

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

export default function Profile() {
  const navigate = useNavigate();
  const { name, age, gender, preferredStyles, updateProfile, setPreferredStyles, clearProfile } = useProfileStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [editData, setEditData] = useState({
    name,
    age,
    gender,
    preferredStyles: [...preferredStyles],
  });
  const [errors, setErrors] = useState({});

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset form data
      setEditData({
        name,
        age,
        gender,
        preferredStyles: [...preferredStyles],
      });
      setErrors({});
    }
    setIsEditing(!isEditing);
  };

  const handleStyleToggle = (styleId) => {
    setEditData(prev => ({
      ...prev,
      preferredStyles: prev.preferredStyles.includes(styleId)
        ? prev.preferredStyles.filter(s => s !== styleId)
        : [...prev.preferredStyles, styleId]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!editData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!editData.age || editData.age < 13 || editData.age > 120) {
      newErrors.age = 'Please enter a valid age (13-120)';
    }
    if (!editData.gender) {
      newErrors.gender = 'Please select a gender';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      updateProfile({
        name: editData.name,
        age: editData.age,
        gender: editData.gender,
      });
      setPreferredStyles(editData.preferredStyles);
      setIsEditing(false);
    }
  };

  const handleReset = () => {
    clearProfile();
    navigate('/setup');
  };

  return (
    <div className="h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex flex-col overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-700/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative border-b border-gray-800 backdrop-blur-xl bg-gray-900/50 flex-shrink-0">
        <div className="container mx-auto px-4 py-2 sm:py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Link to="/feed">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Feed
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-white">My Profile</h1>
            <div className="w-24" /> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative flex-1 overflow-y-auto min-h-0">
        <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Profile Card */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                  <User className="w-6 h-6 text-purple-400" />
                  Profile Information
                </CardTitle>
                {!isEditing ? (
                  <Button
                    onClick={handleEditToggle}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSave}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      onClick={handleEditToggle}
                      size="sm"
                      variant="outline"
                      className="border-gray-700"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <User className="w-4 h-4" />
                  Name
                </label>
                {isEditing ? (
                  <>
                    <Input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className={`bg-gray-800/50 border-gray-700 text-white ${
                        errors.name ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.name && <p className="text-sm text-red-400">{errors.name}</p>}
                  </>
                ) : (
                  <p className="text-lg text-white font-medium">{name}</p>
                )}
              </div>

              {/* Age */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <Calendar className="w-4 h-4" />
                  Age
                </label>
                {isEditing ? (
                  <>
                    <Input
                      type="number"
                      value={editData.age}
                      onChange={(e) => setEditData({ ...editData, age: e.target.value })}
                      className={`bg-gray-800/50 border-gray-700 text-white ${
                        errors.age ? 'border-red-500' : ''
                      }`}
                      min="13"
                      max="120"
                    />
                    {errors.age && <p className="text-sm text-red-400">{errors.age}</p>}
                  </>
                ) : (
                  <p className="text-lg text-white font-medium">{age} years old</p>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <Users className="w-4 h-4" />
                  Gender
                </label>
                {isEditing ? (
                  <>
                    <div className="grid grid-cols-3 gap-3">
                      {['Male', 'Female', 'Other'].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setEditData({ ...editData, gender: option })}
                          className={`py-3 px-4 rounded-lg border-2 transition-all ${
                            editData.gender === option
                              ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                              : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    {errors.gender && <p className="text-sm text-red-400">{errors.gender}</p>}
                  </>
                ) : (
                  <p className="text-lg text-white font-medium">{gender}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Preferred Styles Card */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-400" />
                Preferred Styles
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {STYLE_OPTIONS.map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => handleStyleToggle(style.id)}
                      className={`py-4 px-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                        editData.preferredStyles.includes(style.id)
                          ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                          : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      <span className="text-2xl">{style.emoji}</span>
                      <span className="text-sm font-medium">{style.label}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div>
                  {preferredStyles.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {preferredStyles.map((styleId) => {
                        const style = STYLE_OPTIONS.find(s => s.id === styleId);
                        return style ? (
                          <div
                            key={styleId}
                            className="bg-purple-500/20 border-2 border-purple-500 text-purple-300 py-2 px-4 rounded-lg flex items-center gap-2"
                          >
                            <span className="text-xl">{style.emoji}</span>
                            <span className="font-medium">{style.label}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-8">
                      No preferred styles selected yet. Click "Edit Profile" to add some!
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reset Profile Button */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-xl">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Reset Profile</h3>
                  <p className="text-sm text-gray-400">Clear all profile data and start fresh</p>
                </div>
                {!showResetConfirm ? (
                  <Button
                    onClick={() => setShowResetConfirm(true)}
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-500/10"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleReset}
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Confirm
                    </Button>
                    <Button
                      onClick={() => setShowResetConfirm(false)}
                      size="sm"
                      variant="outline"
                      className="border-gray-700"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        </div>
      </div>
    </div>
  );
}
