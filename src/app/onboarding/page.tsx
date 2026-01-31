'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Camera,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Globe,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Upload
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Toast from '@/components/Toast';
import { useToast } from '@/hooks/useToast';

export default function OnboardingPage() {
  const router = useRouter();
  const { toast, showToast, hideToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const profilePictureInputRef = useRef<HTMLInputElement>(null);

  const [userData, setUserData] = useState({
    // Step 1: Basic Info
    name: '',
    username: '',
    bio: '',
    
    // Step 2: Profile Picture & Location
    profilePicture: null as string | null,
    location: '',
    
    // Step 3: Social Links (Optional)
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: '',
      instagram: '',
      website: '',
      portfolio: ''
    }
  });

  // Load email from signup
  React.useEffect(() => {
    const signupEmail = localStorage.getItem('signupEmail');
    if (signupEmail) {
      // Email is available for use if needed
      console.log('Signup email:', signupEmail);
    }
  }, []);

  const totalSteps = 3;

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setUserData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  // Handle profile picture upload
  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Please select an image file', 'error');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be less than 5MB', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData(prev => ({
          ...prev,
          profilePicture: reader.result as string
        }));
        showToast('Profile picture uploaded!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveProfilePicture = () => {
    setUserData(prev => ({
      ...prev,
      profilePicture: null
    }));
  };

  // Validation
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!userData.name.trim()) {
          showToast('Please enter your name', 'error');
          return false;
        }
        if (!userData.username.trim()) {
          showToast('Please enter a username', 'error');
          return false;
        }
        if (userData.username.length < 3) {
          showToast('Username must be at least 3 characters', 'error');
          return false;
        }
        return true;
      case 2:
        // Profile picture and location are optional
        return true;
      case 3:
        // Social links are optional
        return true;
      default:
        return true;
    }
  };

  // Navigation
  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        handleComplete();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    
    try {
      // Get email from signup
      const signupEmail = localStorage.getItem('signupEmail') || 'user@example.com';
      
      // Save to localStorage
      const profileData = {
        id: '1',
        name: userData.name,
        username: userData.username,
        email: signupEmail,
        bio: userData.bio,
        location: userData.location,
        company: '',
        jobTitle: '',
        profilePicture: userData.profilePicture,
        coverImage: null,
        joinedDate: new Date().toISOString().split('T')[0],
        oauthProvider: null,
        oauthAvatar: null,
        oauthName: null,
        isOAuthUser: false,
        stats: {
          problemsSolved: 0,
          totalSubmissions: 0,
          points: 0,
          currentStreak: 0,
          maxStreak: 0,
          rank: 'Beginner'
        },
        socialAccounts: [
          {
            platform: 'github',
            username: userData.socialLinks.github ? extractUsername(userData.socialLinks.github) : '',
            displayName: '',
            profileUrl: userData.socialLinks.github,
            isVerified: false,
            isLinked: !!userData.socialLinks.github,
            isPublic: true
          },
          {
            platform: 'linkedin',
            username: userData.socialLinks.linkedin ? extractUsername(userData.socialLinks.linkedin) : '',
            displayName: '',
            profileUrl: userData.socialLinks.linkedin,
            isVerified: false,
            isLinked: !!userData.socialLinks.linkedin,
            isPublic: true
          },
          {
            platform: 'twitter',
            username: userData.socialLinks.twitter ? extractUsername(userData.socialLinks.twitter) : '',
            displayName: '',
            profileUrl: userData.socialLinks.twitter,
            isVerified: false,
            isLinked: !!userData.socialLinks.twitter,
            isPublic: true
          },
          {
            platform: 'instagram',
            username: userData.socialLinks.instagram ? extractUsername(userData.socialLinks.instagram) : '',
            displayName: '',
            profileUrl: userData.socialLinks.instagram,
            isVerified: false,
            isLinked: !!userData.socialLinks.instagram,
            isPublic: true
          },
          {
            platform: 'website',
            username: '',
            displayName: 'Personal Website',
            profileUrl: userData.socialLinks.website,
            isVerified: false,
            isLinked: !!userData.socialLinks.website,
            isPublic: true
          },
          {
            platform: 'portfolio',
            username: '',
            displayName: 'Portfolio',
            profileUrl: userData.socialLinks.portfolio,
            isVerified: false,
            isLinked: !!userData.socialLinks.portfolio,
            isPublic: true
          }
        ],
        preferences: {
          emailNotifications: true,
          pushNotifications: true,
          weeklyDigest: true,
          achievementNotifications: true,
          publicProfile: true,
          showStats: true,
          showActivity: true,
          language: 'en',
          timezone: 'UTC'
        }
      };

      localStorage.setItem('userProfileData', JSON.stringify(profileData));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showToast('Profile setup complete! Welcome aboard! 🎉', 'success');
      
      // Redirect to profile page
      setTimeout(() => {
        router.push('/profile');
      }, 1500);
    } catch (error) {
      showToast('Failed to save profile. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const extractUsername = (url: string): string => {
    if (!url) return '';
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      return pathname.split('/').filter(Boolean)[0] || '';
    } catch {
      return '';
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={3000}
      />

      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <motion.div
              className="bg-primary h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-card rounded-lg border border-border shadow-lg p-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User size={32} className="text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Welcome! Let's set up your profile
                  </h2>
                  <p className="text-muted-foreground">
                    Tell us a bit about yourself to get started
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Full Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={userData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                      placeholder="Enter your full name"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Username <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={userData.username}
                      onChange={(e) => handleInputChange('username', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                      placeholder="Choose a unique username"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Lowercase letters, numbers, and underscores only
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Bio (Optional)
                    </label>
                    <textarea
                      value={userData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground resize-none"
                      placeholder="Tell others about yourself and your system design journey..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {userData.bio.length}/500 characters
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Profile Picture & Location */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera size={32} className="text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Add a profile picture
                  </h2>
                  <p className="text-muted-foreground">
                    Help others recognize you (optional)
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Profile Picture Upload */}
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center overflow-hidden border-4 border-border">
                        {userData.profilePicture ? (
                          <img
                            src={userData.profilePicture}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User size={48} className="text-muted-foreground" />
                        )}
                      </div>
                      {userData.profilePicture && (
                        <button
                          onClick={handleRemoveProfilePicture}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground p-2 rounded-full shadow-lg hover:bg-destructive/90 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>

                    <input
                      ref={profilePictureInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="hidden"
                    />
                    <button
                      onClick={() => profilePictureInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Upload size={16} />
                      {userData.profilePicture ? 'Change Photo' : 'Upload Photo'}
                    </button>
                    <p className="text-xs text-muted-foreground mt-2">
                      JPG, PNG or GIF. Max size 5MB
                    </p>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Location (Optional)
                    </label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        value={userData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                        placeholder="City, Country"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Social Links */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe size={32} className="text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Connect your social accounts
                  </h2>
                  <p className="text-muted-foreground">
                    Share your online presence (all optional)
                  </p>
                </div>

                <div className="space-y-4">
                  {/* GitHub */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      GitHub
                    </label>
                    <div className="relative">
                      <Github size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="url"
                        value={userData.socialLinks.github}
                        onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                        placeholder="https://github.com/username"
                      />
                    </div>
                  </div>

                  {/* LinkedIn */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      LinkedIn
                    </label>
                    <div className="relative">
                      <Linkedin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="url"
                        value={userData.socialLinks.linkedin}
                        onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </div>

                  {/* Twitter */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Twitter
                    </label>
                    <div className="relative">
                      <Twitter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="url"
                        value={userData.socialLinks.twitter}
                        onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                  </div>

                  {/* Instagram */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Instagram
                    </label>
                    <div className="relative">
                      <Instagram size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="url"
                        value={userData.socialLinks.instagram}
                        onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                        placeholder="https://instagram.com/username"
                      />
                    </div>
                  </div>

                  {/* Website */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Personal Website
                    </label>
                    <div className="relative">
                      <Globe size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="url"
                        value={userData.socialLinks.website}
                        onChange={(e) => handleSocialLinkChange('website', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>

                  {/* Portfolio */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Portfolio
                    </label>
                    <div className="relative">
                      <Briefcase size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="url"
                        value={userData.socialLinks.portfolio}
                        onChange={(e) => handleSocialLinkChange('portfolio', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                        placeholder="https://portfolio.com"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={16} />
              Back
            </button>

            <div className="flex items-center gap-3">
              {currentStep < totalSteps && (
                <button
                  onClick={handleSkip}
                  className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Skip
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Setting up...
                  </>
                ) : currentStep === totalSteps ? (
                  <>
                    <Check size={16} />
                    Complete Setup
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index + 1 === currentStep
                  ? 'bg-primary w-8'
                  : index + 1 < currentStep
                  ? 'bg-primary/50'
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
