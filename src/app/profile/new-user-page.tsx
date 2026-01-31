'use client';

import React, { useState } from 'react';
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
  Plus,
  BookOpen,
  Clock,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

// Mock data for a NEW USER (realistic empty state)
const mockNewUser = {
  id: '1',
  name: 'New User',
  username: 'newuser',
  email: 'user@example.com',
  bio: '',
  location: '',
  joinedDate: new Date().toISOString().split('T')[0], // Today
  profilePicture: null,
  coverImage: null,
  stats: {
    problemsSolved: 0,
    totalSubmissions: 0,
    points: 0,
    currentStreak: 0,
    maxStreak: 0,
    rank: 'Beginner'
  },
  socialLinks: {
    github: '',
    linkedin: '',
    website: ''
  }
};

// Empty progress for new user
const emptyProgress = [
  { category: 'Distributed Systems', solved: 0, total: 12, avgScore: 0 },
  { category: 'Database Design', solved: 0, total: 8, avgScore: 0 },
  { category: 'Caching', solved: 0, total: 6, avgScore: 0 },
  { category: 'Load Balancing', solved: 0, total: 7, avgScore: 0 },
  { category: 'Security', solved: 0, total: 5, avgScore: 0 },
  { category: 'Microservices', solved: 0, total: 10, avgScore: 0 },
  { category: 'Message Queues', solved: 0, total: 6, avgScore: 0 },
  { category: 'API Design', solved: 0, total: 12, avgScore: 0 }
];

export default function NewUserProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Cover Image & Profile Header */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-primary/20 to-accent/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10" />
          <button className="absolute top-4 right-16 bg-card/20 hover:bg-card/30 text-foreground p-2 rounded-lg transition-all border border-border/50">
            <Camera size={20} />
          </button>
        </div>

        {/* Profile Info */}
        <div className="relative px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end md:space-x-6">
            {/* Profile Picture */}
            <div className="relative -mt-16 mb-4 md:mb-0">
              <div className="w-32 h-32 rounded-full border-4 border-card shadow-lg overflow-hidden bg-muted flex items-center justify-center">
                <User size={48} className="text-muted-foreground" />
              </div>
              <button className="absolute bottom-2 right-2 bg-primary hover:bg-primary/90 text-primary-foreground p-2 rounded-full shadow-lg transition-colors">
                <Camera size={16} />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">{mockNewUser.name}</h1>
                  <p className="text-muted-foreground">@{mockNewUser.username}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href="/profile/settings"
                    className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors"
                  >
                    <Settings size={16} />
                    Settings
                  </Link>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
                  >
                    <Edit3 size={16} />
                    {isEditing ? 'Save' : 'Edit Profile'}
                  </button>
                </div>
              </div>

              <p className="text-muted-foreground mb-4 max-w-2xl italic">
                Add a bio to tell others about yourself and your system design journey...
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1 text-muted-foreground/60">
                  <MapPin size={16} />
                  Add location
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  Joined {new Date(mockNewUser.joinedDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long' 
                  })}
                </div>
                <div className="flex items-center gap-1">
                  <Mail size={16} />
                  {mockNewUser.email}
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3 mt-3">
                <button className="text-muted-foreground/40 hover:text-muted-foreground transition-colors">
                  <Github size={20} />
                </button>
                <button className="text-muted-foreground/40 hover:text-muted-foreground transition-colors">
                  <Linkedin size={20} />
                </button>
                <button className="text-muted-foreground/40 hover:text-muted-foreground transition-colors">
                  <Globe size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div 
            className="bg-card rounded-lg p-4 shadow-sm border border-border"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Target className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{mockNewUser.stats.problemsSolved}</p>
                <p className="text-sm text-muted-foreground">Problems Solved</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-card rounded-lg p-4 shadow-sm border border-border"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Trophy className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{mockNewUser.stats.points}</p>
                <p className="text-sm text-muted-foreground">Total Points</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-card rounded-lg p-4 shadow-sm border border-border"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Zap className="text-orange-600 dark:text-orange-400" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{mockNewUser.stats.currentStreak}</p>
                <p className="text-sm text-muted-foreground">Current Streak</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-card rounded-lg p-4 shadow-sm border border-border"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Award className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{mockNewUser.stats.rank}</p>
                <p className="text-sm text-muted-foreground">Current Rank</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Activity Heatmap - Empty State */}
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                0 problems solved in 2024
              </h3>
              <div className="text-sm text-muted-foreground">
                Current streak: <span className="font-semibold text-muted-foreground">0 days</span>
              </div>
            </div>
            
            {/* Empty Activity State */}
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <BookOpen size={32} className="text-muted-foreground" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Start Your Journey</h4>
              <p className="text-muted-foreground mb-6 max-w-md">
                Begin solving system design problems to see your activity here. Your progress will be tracked with a GitHub-style contribution graph.
              </p>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                <Plus size={16} />
                Solve First Problem
              </button>
            </div>
          </div>

          {/* Progress by Category - Empty State */}
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Progress by Category</h3>
            <div className="space-y-4">
              {emptyProgress.map((category, index) => (
                <motion.div 
                  key={category.category}
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-foreground">{category.category}</span>
                    <div className="text-sm text-muted-foreground">
                      {category.solved}/{category.total} (0%)
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="h-2 rounded-full bg-gray-300 dark:bg-gray-600 w-0" />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Average Score: {category.avgScore}%
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Achievements - Empty State */}
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Achievements</h3>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                <Trophy size={24} className="text-muted-foreground" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">No Achievements Yet</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Start solving problems to unlock your first achievement!
              </p>
              <div className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                🎯 First achievement: Complete your first design
              </div>
            </div>
          </div>

          {/* Recent Activity - Empty State */}
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                <Clock size={24} className="text-muted-foreground" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">No Activity Yet</h4>
              <p className="text-sm text-muted-foreground">
                Your recent problem-solving activity will appear here
              </p>
            </div>
          </div>

          {/* Getting Started Guide */}
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-6 border border-primary/20">
            <h3 className="text-lg font-semibold text-foreground mb-4">🚀 Getting Started</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Complete your profile</p>
                  <p className="text-sm text-muted-foreground">Add a bio, location, and social links</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">2</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Try the design canvas</p>
                  <p className="text-sm text-muted-foreground">Start with an easy problem like URL Shortener</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">3</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Get AI feedback</p>
                  <p className="text-sm text-muted-foreground">Submit your design for intelligent evaluation</p>
                </div>
              </div>
            </div>
            <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              <BookOpen size={16} />
              Start Learning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}