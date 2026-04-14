import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Barbell, Target } from '@phosphor-icons/react';
import { getProfile, updateProfile } from '../api';
import { toast } from 'sonner';

const ProfileModal = ({ isOpen, onClose, user }) => {
  const [profile, setProfile] = useState({
    age: '', height: '', weight: '', gender: '',
    fitness_goal: '', activity_level: '', dietary_preference: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadProfile();
    }
  }, [isOpen]);

  const loadProfile = async () => {
    try {
      const res = await getProfile();
      const data = res.data;
      setProfile({
        age: data.age || '',
        height: data.height || '',
        weight: data.weight || '',
        gender: data.gender || '',
        fitness_goal: data.fitness_goal || '',
        activity_level: data.activity_level || '',
        dietary_preference: data.dietary_preference || ''
      });
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = {};
      if (profile.age) data.age = parseInt(profile.age);
      if (profile.height) data.height = parseFloat(profile.height);
      if (profile.weight) data.weight = parseFloat(profile.weight);
      if (profile.gender) data.gender = profile.gender;
      if (profile.fitness_goal) data.fitness_goal = profile.fitness_goal;
      if (profile.activity_level) data.activity_level = profile.activity_level;
      if (profile.dietary_preference) data.dietary_preference = profile.dietary_preference;

      await updateProfile(data);
      toast.success('Profile updated!');
      onClose();
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#111111] border border-[#27272A] w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between p-5 border-b border-[#27272A]">
            <div className="flex items-center gap-2">
              <User size={20} className="text-[#FF3B30]" />
              <h2
                className="text-xl font-bold tracking-tight uppercase"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                YOUR PROFILE
              </h2>
            </div>
            <button onClick={onClose} data-testid="close-profile-btn" className="p-2 hover:bg-[#1A1A1A]">
              <X size={18} />
            </button>
          </div>

          <div className="p-5 space-y-4">
            {/* User Info */}
            <div className="flex items-center gap-3 p-3 bg-[#0A0A0A] border border-[#27272A]">
              <div className="w-10 h-10 rounded-full bg-[#FF3B30] flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{user?.name}</p>
                <p className="text-xs text-[#A1A1AA]">{user?.email}</p>
              </div>
            </div>

            {/* Basic Info */}
            <div>
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#A1A1AA] mb-2">Basic Info</p>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-[#A1A1AA] uppercase block mb-1">Age</label>
                  <input
                    type="number"
                    value={profile.age}
                    onChange={(e) => setProfile(p => ({ ...p, age: e.target.value }))}
                    placeholder="25"
                    data-testid="profile-age"
                    className="w-full bg-[#0A0A0A] border border-[#27272A] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FF3B30]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#A1A1AA] uppercase block mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={profile.height}
                    onChange={(e) => setProfile(p => ({ ...p, height: e.target.value }))}
                    placeholder="175"
                    data-testid="profile-height"
                    className="w-full bg-[#0A0A0A] border border-[#27272A] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FF3B30]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#A1A1AA] uppercase block mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={profile.weight}
                    onChange={(e) => setProfile(p => ({ ...p, weight: e.target.value }))}
                    placeholder="75"
                    data-testid="profile-weight"
                    className="w-full bg-[#0A0A0A] border border-[#27272A] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FF3B30]"
                  />
                </div>
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="text-[10px] text-[#A1A1AA] uppercase block mb-2">Gender</label>
              <div className="flex gap-2">
                {['Male', 'Female', 'Other'].map(g => (
                  <button
                    key={g}
                    onClick={() => setProfile(p => ({ ...p, gender: g }))}
                    data-testid={`profile-gender-${g.toLowerCase()}`}
                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wide border transition-all ${
                      profile.gender === g
                        ? 'bg-[#FF3B30] border-[#FF3B30] text-white'
                        : 'border-[#27272A] text-[#A1A1AA] hover:bg-[#1A1A1A]'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Fitness Goal */}
            <div>
              <div className="flex items-center gap-1 mb-2">
                <Target size={14} className="text-[#FF3B30]" />
                <label className="text-[10px] text-[#A1A1AA] uppercase">Fitness Goal</label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {['Weight Loss', 'Muscle Gain', 'General Fitness', 'Endurance'].map(goal => (
                  <button
                    key={goal}
                    onClick={() => setProfile(p => ({ ...p, fitness_goal: goal }))}
                    data-testid={`profile-goal-${goal.toLowerCase().replace(' ', '-')}`}
                    className={`py-2 text-xs font-bold uppercase tracking-wide border transition-all ${
                      profile.fitness_goal === goal
                        ? 'bg-[#007AFF] border-[#007AFF] text-white'
                        : 'border-[#27272A] text-[#A1A1AA] hover:bg-[#1A1A1A]'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>

            {/* Activity Level */}
            <div>
              <div className="flex items-center gap-1 mb-2">
                <Barbell size={14} className="text-[#007AFF]" />
                <label className="text-[10px] text-[#A1A1AA] uppercase">Activity Level</label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active'].map(level => (
                  <button
                    key={level}
                    onClick={() => setProfile(p => ({ ...p, activity_level: level }))}
                    data-testid={`profile-activity-${level.toLowerCase().replace(' ', '-')}`}
                    className={`py-2 text-xs font-bold uppercase tracking-wide border transition-all ${
                      profile.activity_level === level
                        ? 'bg-[#34C759] border-[#34C759] text-white'
                        : 'border-[#27272A] text-[#A1A1AA] hover:bg-[#1A1A1A]'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Dietary Preference */}
            <div>
              <label className="text-[10px] text-[#A1A1AA] uppercase block mb-2">Dietary Preference</label>
              <div className="flex flex-wrap gap-2">
                {['No Preference', 'Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Mediterranean'].map(pref => (
                  <button
                    key={pref}
                    onClick={() => setProfile(p => ({ ...p, dietary_preference: pref }))}
                    data-testid={`profile-diet-${pref.toLowerCase().replace(' ', '-')}`}
                    className={`py-1.5 px-3 text-[10px] font-bold uppercase tracking-wide border transition-all ${
                      profile.dietary_preference === pref
                        ? 'bg-[#FF9500] border-[#FF9500] text-white'
                        : 'border-[#27272A] text-[#A1A1AA] hover:bg-[#1A1A1A]'
                    }`}
                  >
                    {pref}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              data-testid="save-profile-btn"
              className="w-full bg-[#FF3B30] text-white font-bold py-3 uppercase tracking-[0.1em] text-sm hover:bg-[#D32F2F] transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfileModal;
