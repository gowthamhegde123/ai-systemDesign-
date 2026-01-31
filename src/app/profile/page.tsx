'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  MapPin, 
  Calendar, 
  Trophy, 
  Target, 
  Zap, 
  Award,
  Edit3,
  Camera,
  Github,
  Linkedin,
  Globe,
  Mail,
  Settings,
  Plus,
  BookOpen,
  Clock,
  Twitter,
  Instagram,
  ExternalLink,
  Shield,
  ShieldCheck,
  Link as LinkIcon,
  Briefcase,
  Upload,
  X,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import ActivityHeatmap from '@/components/ActivityHeatmap';
import ThemeToggle from '@/components/ThemeToggle';
import Toast from '@/components/Toast';
import { useToast } from '@/hooks/useToast';

// Enhanced user data structure with OAuth and social accounts
const mockUser = {
  id: '1',
  name: 'New User',
  username: 'newuser',
  email: 'user@example.com',
  bio: '',
  location: '',
  joinedDate: new Date().toISOString().split('T')[0], // Today
  profilePicture: null as string | null,
  coverImage: null as string | null,
  
  // OAuth information
  oauthProvider: null as string | null, // 'google', 'github', 'linkedin'
  oauthAvatar: null as string | null,
  oauthName: null as string | null,
  isOAuthUser: false,
  
  stats: {
    problemsSolved: 0,
    totalSubmissions: 0,
    points: 0,
    currentStreak: 0,
    maxStreak: 0,
    rank: 'Beginner'
  },
  
  // Enhanced social accounts with verification status
  socialAccounts: [
    {
      platform: 'github',
      username: '',
      displayName: '',
      profileUrl: '',
      isVerified: false,
      isLinked: false,
      isPublic: true
    },
    {
      platform: 'linkedin',
      username: '',
      displayName: '',
      profileUrl: '',
      isVerified: false,
      isLinked: false,
      isPublic: true
    },
    {
      platform: 'twitter',
      username: '',
      displayName: '',
      profileUrl: '',
      isVerified: false,
      isLinked: false,
      isPublic: true
    },
    {
      platform: 'instagram',
      username: '',
      displayName: '',
      profileUrl: '',
      isVerified: false,
      isLinked: false,
      isPublic: true
    },
    {
      platform: 'website',
      username: '',
      displayName: 'Personal Website',
      profileUrl: '',
      isVerified: false,
      isLinked: false,
      isPublic: true
    },
    {
      platform: 'portfolio',
      username: '',
      displayName: 'Portfolio',
      profileUrl: '',
      isVerified: false,
      isLinked: false,
      isPublic: true
    }
  ]
};

// Helper function to get social platform icon
const getSocialIcon = (platform: string, size: number = 20) => {
  const iconProps = { size, className: "text-muted-foreground" };
  
  switch (platform) {
    case 'github':
      return <Github {...iconProps} />;
    case 'linkedin':
      return <Linkedin {...iconProps} />;
    case 'twitter':
      return <Twitter {...iconProps} />;
    case 'instagram':
      return <Instagram {...iconProps} />;
    case 'website':
      return <Globe {...iconProps} />;
    case 'portfolio':
      return <Briefcase {...iconProps} />;
    default:
      return <LinkIcon {...iconProps} />;
  }
};

// Helper function to get platform display name
const getPlatformDisplayName = (platform: string) => {
  const names: Record<string, string> = {
    github: 'GitHub',
    linkedin: 'LinkedIn',
    twitter: 'Twitter',
    instagram: 'Instagram',
    website: 'Website',
    portfolio: 'Portfolio'
  };
  return names[platform] || platform;
};

// Helper function to validate social URLs
const validateSocialUrl = (platform: string, url: string): boolean => {
  if (!url) return true; // Empty is valid
  
  const patterns: Record<string, RegExp> = {
    github: /^https?:\/\/(www\.)?github\.com\/[\w-]+\/?$/,
    linkedin: /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/,
    twitter: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[\w-]+\/?$/,
    instagram: /^https?:\/\/(www\.)?instagram\.com\/[\w.-]+\/?$/,
    website: /^https?:\/\/.+/,
    portfolio: /^https?:\/\/.+/
  };
  
  return patterns[platform]?.test(url) ?? /^https?:\/\/.+/.test(url);
};

// Helper function to extract username from social URL
const extractUsernameFromUrl = (platform: string, url: string): string => {
  if (!url) return '';
  
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    switch (platform) {
      case 'github':
        return pathname.split('/')[1] || '';
      case 'linkedin':
        return pathname.split('/in/')[1]?.replace('/', '') || '';
      case 'twitter':
        return pathname.split('/')[1] || '';
      case 'instagram':
        return pathname.split('/')[1] || '';
      default:
        return urlObj.hostname;
    }
  } catch {
    return '';
  }
};

const mockActivityData: any[] = [];

const mockAchievements: any[] = [];

const mockProgress = [
  { category: 'Distributed Systems', solved: 0, total: 12, avgScore: 0 },
  { category: 'Database Design', solved: 0, total: 8, avgScore: 0 },
  { category: 'Caching', solved: 0, total: 6, avgScore: 0 },
  { category: 'Load Balancing', solved: 0, total: 7, avgScore: 0 },
  { category: 'Security', solved: 0, total: 5, avgScore: 0 },
  { category: 'Microservices', solved: 0, total: 10, avgScore: 0 },
  { category: 'Message Queues', solved: 0, total: 6, avgScore: 0 },
  { category: 'API Design', solved: 0, total: 12, avgScore: 0 }
];

export default function ProfilePage() {
  const { toast, showToast, hideToast } = useToast();
  const [editedUser, setEditedUser] = useState(mockUser);
  const profilePictureInputRef = useRef<HTMLInputElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUserData = localStorage.getItem('userProfileData');
    if (savedUserData) {
      try {
        const parsedData = JSON.parse(savedUserData);
        setEditedUser(parsedData);
      } catch (error) {
        console.error('Error loading saved profile data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever editedUser changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('userProfileData', JSON.stringify(editedUser));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [editedUser]);

  // Handle profile picture upload
  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showToast('Please select an image file', 'error');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be less than 5MB', 'error');
        return;
      }

      // Convert to base64 for localStorage (in production, upload to cloud storage)
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedUser(prev => ({
          ...prev,
          profilePicture: reader.result as string
        }));
        showToast('Profile picture updated successfully!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle cover image upload
  const handleCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showToast('Please select an image file', 'error');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be less than 5MB', 'error');
        return;
      }

      // Convert to base64 for localStorage (in production, upload to cloud storage)
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedUser(prev => ({
          ...prev,
          coverImage: reader.result as string
        }));
        showToast('Cover image updated successfully!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove profile picture
  const handleRemoveProfilePicture = () => {
    setEditedUser(prev => ({
      ...prev,
      profilePicture: null
    }));
    showToast('Profile picture removed', 'info');
  };

  // Remove cover image
  const handleRemoveCoverImage = () => {
    setEditedUser(prev => ({
      ...prev,
      coverImage: null
    }));
    showToast('Cover image removed', 'info');
  };

  const handleLogout = () => {
    // Only clear auth token, keep user profile data
    localStorage.removeItem('authToken');
    localStorage.removeItem('sessionToken');
    
    // Show toast
    showToast('Logging out...', 'info');
    
    // Redirect to login page
    setTimeout(() => {
      window.location.href = '/login';
    }, 1000);
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'border-gray-300 bg-gray-50',
      rare: 'border-blue-300 bg-blue-50',
      epic: 'border-purple-300 bg-purple-50',
      legendary: 'border-yellow-300 bg-yellow-50'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={3000}
      />

      {/* Hidden file inputs */}
      <input
        ref={profilePictureInputRef}
        type="file"
        accept="image/*"
        onChange={handleProfilePictureChange}
        className="hidden"
      />
      <input
        ref={coverImageInputRef}
        type="file"
        accept="image/*"
        onChange={handleCoverImageChange}
        className="hidden"
      />

      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      {/* Cover Image & Profile Header */}
      <div className="relative">
        {/* Cover Image with Upload */}
        <div className="h-48 relative overflow-hidden">
          {editedUser.coverImage ? (
            <>
              <img 
                src={String(editedUser.coverImage)} 
                alt="Cover" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10" />
            </>
          )}
          
          {/* Cover Image Actions */}
          <div className="absolute top-4 right-16 flex gap-2">
            <button 
              onClick={() => coverImageInputRef.current?.click()}
              className="bg-card/80 hover:bg-card text-foreground p-2 rounded-lg transition-all border border-border/50 backdrop-blur-sm"
              title="Change cover image"
            >
              <Camera size={20} />
            </button>
            {editedUser.coverImage && (
              <button 
                onClick={handleRemoveCoverImage}
                className="bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-lg transition-all backdrop-blur-sm"
                title="Remove cover image"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="relative px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end md:space-x-6">
            {/* Profile Picture */}
            <div className="relative -mt-16 mb-4 md:mb-0">
              <div className="w-32 h-32 rounded-full border-4 border-card shadow-lg overflow-hidden bg-muted flex items-center justify-center">
                {(editedUser.profilePicture || editedUser.oauthAvatar) ? (
                  <img 
                    src={String(editedUser.profilePicture || editedUser.oauthAvatar)} 
                    alt={editedUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={48} className="text-muted-foreground" />
                )}
              </div>
              
              {/* Profile Picture Actions */}
              <div className="absolute bottom-0 right-0 flex gap-1">
                <button 
                  onClick={() => profilePictureInputRef.current?.click()}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground p-2 rounded-full shadow-lg transition-colors"
                  title="Change profile picture"
                >
                  <Camera size={16} />
                </button>
                {editedUser.profilePicture && (
                  <button 
                    onClick={handleRemoveProfilePicture}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
                    title="Remove profile picture"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              
              {/* OAuth Provider Badge */}
              {editedUser.oauthProvider && (
                <div className="absolute -bottom-1 -left-1 bg-card border border-border rounded-full p-1">
                  {editedUser.oauthProvider === 'google' && (
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">G</span>
                    </div>
                  )}
                  {editedUser.oauthProvider === 'github' && (
                    <Github size={16} className="text-foreground" />
                  )}
                  {editedUser.oauthProvider === 'linkedin' && (
                    <Linkedin size={16} className="text-blue-600" />
                  )}
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">{editedUser.name}</h1>
                    <p className="text-muted-foreground">@{editedUser.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors"
                  >
                    <LogOut size={16} />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                  <Link
                    href="/profile/settings"
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
                  >
                    <Settings size={16} />
                    Settings
                  </Link>
                </div>
              </div>

              {/* Bio Section */}
              <p className="text-foreground/80 mb-4 max-w-2xl">
                {editedUser.bio || (
                  <span className="italic text-muted-foreground">
                    No bio yet. Add one in settings to tell others about yourself.
                  </span>
                )}
              </p>

              {/* Location and Details */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  {editedUser.location || 'No location set'}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  Joined {new Date(editedUser.joinedDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long' 
                  })}
                </div>
                <div className="flex items-center gap-1">
                  <Mail size={16} />
                  {editedUser.email}
                </div>
              </div>

              {/* Social Accounts - Read Only */}
              <div className="flex items-center gap-3 flex-wrap">
                  {editedUser.socialAccounts
                    .filter(account => account.isLinked && account.profileUrl && account.isPublic)
                    .map((account) => (
                      <a
                        key={account.platform}
                        href={account.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors group"
                        title={`${account.displayName || account.username} on ${getPlatformDisplayName(account.platform)}`}
                      >
                        {getSocialIcon(account.platform, 20)}
                        {account.isVerified && (
                          <ShieldCheck size={12} className="text-green-500" />
                        )}
                        <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ))}
                  
                  {/* Show empty state if no social accounts are linked */}
                  {editedUser.socialAccounts.filter(account => account.isLinked && account.profileUrl).length === 0 && (
                    <div className="flex items-center gap-2 text-muted-foreground/60">
                      <LinkIcon size={16} />
                      <span className="text-sm italic">No social accounts linked</span>
                    </div>
                  )}
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div 
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{mockUser.stats.problemsSolved}</p>
                <p className="text-sm text-gray-600">Problems Solved</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Trophy className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{mockUser.stats.points}</p>
                <p className="text-sm text-gray-600">Total Points</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Zap className="text-orange-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{mockUser.stats.currentStreak}</p>
                <p className="text-sm text-gray-600">Current Streak</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{mockUser.stats.rank}</p>
                <p className="text-sm text-gray-600">Current Rank</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Activity Heatmap */}
          <ActivityHeatmap 
            data={mockActivityData} 
            year={new Date(editedUser.joinedDate).getFullYear()} 
            startDate={editedUser.joinedDate}
          />

          {/* Progress by Category */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Progress by Category</h3>
            <div className="space-y-4">
              {mockProgress.map((category, index) => {
                const percentage = (category.solved / category.total) * 100;
                return (
                  <motion.div 
                    key={category.category}
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">{category.category}</span>
                      <div className="text-sm text-gray-600">
                        {category.solved}/{category.total} ({Math.round(percentage)}%)
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div 
                        className={`h-2 rounded-full ${getProgressColor(percentage)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      Average Score: {category.avgScore}%
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Achievements */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Achievements</h3>
            <div className="space-y-3">
              {mockAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  className={`p-3 rounded-lg border-2 ${getRarityColor(achievement.rarity)}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{achievement.name}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">
                          {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </span>
                        <span className="text-xs font-semibold text-blue-600">
                          +{achievement.points} pts
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
            
            {/* Check if user has any activity */}
            {editedUser.stats.problemsSolved > 0 ? (
              <div className="space-y-3">
                {/* This will be populated with real activity data from backend */}
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Activity will appear here</p>
                    <p className="text-xs text-muted-foreground">When you solve problems</p>
                  </div>
                </div>
              </div>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                  <Clock size={24} className="text-muted-foreground" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">No Activity Yet</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Your recent problem-solving activity will appear here
                </p>
                <Link
                  href="/questions"
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                  <Plus size={16} />
                  Start Solving Problems
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}