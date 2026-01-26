'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User, Camera, Shield, Award, Trophy, Target, Zap, BrainCircuit,
    Sparkles, Calendar, Clock, TrendingUp, Star, Medal, Crown,
    CheckCircle2, Lock, Mail, Settings, ChevronRight, ArrowLeft,
    Github, Twitter, Linkedin, Globe, MapPin, Edit3, Save, X, LogOut
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { clsx } from 'clsx';
import Link from 'next/link';
import ActivityGrid from '@/components/ActivityGrid';
import { AvatarUpload } from '@/components/AvatarUpload';
import { useUserProgress } from '@/lib/hooks/useUserProgress';

export default function ProfilePage() {
    const { data: session } = useSession();
    const { progress } = useUserProgress();
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'achievements' | 'settings'>('overview');
    const [profileData, setProfileData] = useState({
        name: session?.user?.name || 'System Architect',
        role: 'Senior System Design Engineer',
        location: 'San Francisco, CA',
        bio: 'Passionate system architect with 8+ years of experience designing scalable distributed systems. Love solving complex problems and building high-performance applications.',
        socialLinks: {
            github: 'https://github.com/gowthamhegde123',
            twitter: 'https://twitter.com/gowthamhegde',
            linkedin: 'https://linkedin.com/in/gowthamhegde',
            website: 'https://gowthamhegde.dev'
        },
        avatar: session?.user?.image || ''
    });

    const handleSaveProfile = () => {
        // In a real app, this would save to the database
        console.log('Saving profile data:', profileData);
        setIsEditing(false);
        // You could add an API call here to save the data
    };

    const handleInputChange = (field: string, value: string) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSocialLinkChange = (platform: string, value: string) => {
        setProfileData(prev => ({
            ...prev,
            socialLinks: {
                ...prev.socialLinks,
                [platform]: value
            }
        }));
    };

    const handleAvatarChange = (imageUrl: string) => {
        setProfileData(prev => ({
            ...prev,
            avatar: imageUrl
        }));
    };

    if (!session) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-6 mx-auto">
                        <User className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-black text-foreground mb-2">Sign in required</h3>
                    <p className="text-muted-foreground mb-6">Please sign in to view your profile</p>
                    <Link
                        href="/login"
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    const achievements = [
        {
            id: 1,
            title: 'First Steps',
            description: 'Solved your first system design problem',
            icon: <Target className="w-6 h-6" />,
            unlocked: (progress?.totalSolved || 0) >= 1,
            date: (progress?.totalSolved || 0) >= 1 ? '2024-01-15' : null,
            threshold: 1
        },
        {
            id: 2,
            title: 'Problem Solver',
            description: 'Solved 5 system design problems',
            icon: <CheckCircle2 className="w-6 h-6" />,
            unlocked: (progress?.totalSolved || 0) >= 5,
            date: (progress?.totalSolved || 0) >= 5 ? '2024-01-20' : null,
            threshold: 5
        },
        {
            id: 3,
            title: 'Architect',
            description: 'Solved 10 system design problems',
            icon: <BrainCircuit className="w-6 h-6" />,
            unlocked: (progress?.totalSolved || 0) >= 10,
            date: (progress?.totalSolved || 0) >= 10 ? '2024-02-01' : null,
            threshold: 10
        },
        {
            id: 4,
            title: 'System Master',
            description: 'Solved 15 system design problems',
            icon: <Award className="w-6 h-6" />,
            unlocked: (progress?.totalSolved || 0) >= 15,
            date: (progress?.totalSolved || 0) >= 15 ? '2024-02-15' : null,
            threshold: 15
        },
        {
            id: 5,
            title: 'Design Expert',
            description: 'Solved 20 system design problems',
            icon: <Trophy className="w-6 h-6" />,
            unlocked: (progress?.totalSolved || 0) >= 20,
            date: (progress?.totalSolved || 0) >= 20 ? '2024-02-20' : null,
            threshold: 20
        },
        {
            id: 6,
            title: 'Streak Master',
            description: 'Maintain a 7-day solving streak',
            icon: <Zap className="w-6 h-6" />,
            unlocked: (progress?.currentStreak || 0) >= 7,
            date: (progress?.currentStreak || 0) >= 7 ? '2024-03-01' : null,
            threshold: 7,
            type: 'streak'
        },
        {
            id: 7,
            title: 'Speed Demon',
            description: 'Solve 3 problems in one day',
            icon: <TrendingUp className="w-6 h-6" />,
            unlocked: false,
            date: null,
            threshold: 3,
            type: 'daily'
        },
        {
            id: 8,
            title: 'Perfectionist',
            description: 'Get 100% score on 5 problems',
            icon: <Star className="w-6 h-6" />,
            unlocked: false,
            date: null,
            threshold: 5,
            type: 'score'
        },
        {
            id: 9,
            title: 'Category Master',
            description: 'Solve problems from all categories',
            icon: <Medal className="w-6 h-6" />,
            unlocked: false,
            date: null,
            threshold: 10,
            type: 'category'
        },
        {
            id: 10,
            title: 'Legend',
            description: 'Solve all 29 system design problems',
            icon: <Crown className="w-6 h-6" />,
            unlocked: (progress?.totalSolved || 0) >= 29,
            date: (progress?.totalSolved || 0) >= 29 ? '2024-03-15' : null,
            threshold: 29
        },
    ];

    const skillCategories = [
        {
            name: 'Storage & Databases',
            skills: ['Distributed Cache', 'Key-Value Stores', 'SQL Optimization', 'NoSQL Design'],
            progress: 85,
            solved: 4,
            total: 5
        },
        {
            name: 'Real-time Systems',
            skills: ['WebSockets', 'Event Streaming', 'Live Updates', 'Presence Systems'],
            progress: 67,
            solved: 2,
            total: 3
        },
        {
            name: 'Infrastructure',
            skills: ['Load Balancing', 'Task Scheduling', 'Message Queues', 'Service Mesh'],
            progress: 75,
            solved: 3,
            total: 4
        },
        {
            name: 'Content & Media',
            skills: ['CDN Design', 'Image Processing', 'Video Streaming', 'Content Delivery'],
            progress: 33,
            solved: 1,
            total: 3
        }
    ];

    const recentActivity = [
        { type: 'solved', question: 'Design a Distributed Cache', date: '2024-03-05', score: 92 },
        { type: 'solved', question: 'Design Flash Sale System', date: '2024-03-03', score: 88 },
        { type: 'achievement', title: 'Streak Master', date: '2024-03-01' },
        { type: 'solved', question: 'Design Load Balancer', date: '2024-02-28', score: 95 },
        { type: 'solved', question: 'Design Image Service', date: '2024-02-25', score: 87 },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/"
                                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
                            >
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                <span className="font-medium">Back to Home</span>
                            </Link>
                            <div className="w-px h-6 bg-border" />
                            <h1 className="text-lg font-black tracking-tight">Profile</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={isEditing ? handleSaveProfile : () => setIsEditing(!isEditing)}
                                className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl font-medium transition-colors"
                            >
                                {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                                {isEditing ? 'Save Changes' : 'Edit Profile'}
                            </button>
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-medium transition-colors"
                                title="Sign Out"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Left Sidebar - Profile Info */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Profile Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-card border border-border rounded-3xl p-8 shadow-xl"
                        >
                            <div className="text-center">
                                <AvatarUpload
                                    currentImage={profileData.avatar}
                                    onImageChange={handleAvatarChange}
                                    isEditing={isEditing}
                                />

                                <h2 className="text-2xl font-black tracking-tight mb-2">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profileData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            className="bg-transparent border-b-2 border-primary/30 focus:border-primary outline-none text-2xl font-black tracking-tight"
                                        />
                                    ) : (
                                        profileData.name
                                    )}
                                </h2>
                                <p className="text-muted-foreground font-medium mb-4">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profileData.role}
                                            onChange={(e) => handleInputChange('role', e.target.value)}
                                            className="bg-transparent border-b border-primary/30 focus:border-primary outline-none w-full"
                                        />
                                    ) : (
                                        profileData.role
                                    )}
                                </p>

                                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
                                    <MapPin className="w-4 h-4" />
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profileData.location}
                                            onChange={(e) => handleInputChange('location', e.target.value)}
                                            className="bg-transparent border-b border-primary/30 focus:border-primary outline-none"
                                        />
                                    ) : (
                                        <span>{profileData.location}</span>
                                    )}
                                </div>

                                {/* Social Links */}
                                <div className="flex justify-center gap-3 mb-6">
                                    {[
                                        { icon: <Github className="w-4 h-4" />, key: 'github', label: 'GitHub' },
                                        { icon: <Twitter className="w-4 h-4" />, key: 'twitter', label: 'Twitter' },
                                        { icon: <Linkedin className="w-4 h-4" />, key: 'linkedin', label: 'LinkedIn' },
                                        { icon: <Globe className="w-4 h-4" />, key: 'website', label: 'Website' },
                                    ].map((social, index) => (
                                        <div key={index} className="relative group">
                                            {isEditing ? (
                                                <input
                                                    type="url"
                                                    value={profileData.socialLinks[social.key as keyof typeof profileData.socialLinks]}
                                                    onChange={(e) => handleSocialLinkChange(social.key, e.target.value)}
                                                    placeholder={`${social.label} URL`}
                                                    className="w-20 p-2 bg-muted/50 border border-border rounded-xl text-xs focus:border-primary outline-none"
                                                />
                                            ) : (
                                                <a
                                                    href={profileData.socialLinks[social.key as keyof typeof profileData.socialLinks]}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 bg-muted/50 hover:bg-primary/10 rounded-xl transition-colors group"
                                                    title={social.label}
                                                >
                                                    <div className="text-muted-foreground group-hover:text-primary transition-colors">
                                                        {social.icon}
                                                    </div>
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Bio */}
                                <div className="text-left">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-3">About</h3>
                                    {isEditing ? (
                                        <textarea
                                            value={profileData.bio}
                                            onChange={(e) => handleInputChange('bio', e.target.value)}
                                            rows={4}
                                            className="w-full text-sm bg-muted/30 border border-border rounded-xl p-3 focus:border-primary outline-none resize-none"
                                        />
                                    ) : (
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {profileData.bio}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Quick Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-card border border-border rounded-3xl p-6 shadow-xl"
                        >
                            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-6">Quick Stats</h3>
                            <div className="space-y-4">
                                {[
                                    { label: 'Problems Solved', value: progress?.totalSolved || 0, max: 29, icon: <CheckCircle2 className="w-4 h-4 text-green-500" /> },
                                    { label: 'Current Streak', value: progress?.currentStreak || 0, max: null, icon: <Zap className="w-4 h-4 text-yellow-500" /> },
                                    { label: 'Achievements', value: achievements.filter(a => a.unlocked).length, max: achievements.length, icon: <Trophy className="w-4 h-4 text-purple-500" /> },
                                    { label: 'Avg Score', value: 89, max: 100, icon: <Star className="w-4 h-4 text-blue-500" /> },
                                ].map((stat, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {stat.icon}
                                            <span className="text-sm font-medium text-foreground">{stat.label}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-black text-foreground">{stat.value}</span>
                                            {stat.max && <span className="text-sm text-muted-foreground">/ {stat.max}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Tab Navigation */}
                        <div className="flex gap-2 p-1 bg-muted/30 rounded-2xl">
                            {[
                                { id: 'overview', label: 'Overview', icon: <User className="w-4 h-4" /> },
                                { id: 'activity', label: 'Activity', icon: <Calendar className="w-4 h-4" /> },
                                { id: 'achievements', label: 'Achievements', icon: <Trophy className="w-4 h-4" /> },
                                { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={clsx(
                                        'flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all',
                                        activeTab === tab.id
                                            ? 'bg-card text-foreground shadow-lg border border-border'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                    )}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {activeTab === 'overview' && (
                                <>
                                    {/* Activity Tracker */}
                                    <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-xl font-black tracking-tight">Activity Tracker</h3>
                                            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 rounded-full border border-green-500/20">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Active System Designer</span>
                                            </div>
                                        </div>
                                        <ActivityGrid />
                                    </div>

                                    {/* Progress Overview */}
                                    <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
                                        <h3 className="text-xl font-black tracking-tight mb-6">Progress Overview</h3>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            {skillCategories.map((category, index) => (
                                                <div key={index} className="p-6 bg-muted/30 rounded-2xl border border-border/50">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h4 className="font-black text-foreground">{category.name}</h4>
                                                        <span className="text-sm font-bold text-muted-foreground">
                                                            {category.solved}/{category.total}
                                                        </span>
                                                    </div>
                                                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-4">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${category.progress}%` }}
                                                            className="h-full bg-primary rounded-full"
                                                            transition={{ delay: index * 0.1 }}
                                                        />
                                                    </div>
                                                    <div className="flex flex-wrap gap-1">
                                                        {category.skills.map((skill, skillIndex) => (
                                                            <span
                                                                key={skillIndex}
                                                                className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-lg font-medium"
                                                            >
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Recent Activity */}
                                    <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
                                        <h3 className="text-xl font-black tracking-tight mb-6">Recent Activity</h3>
                                        <div className="space-y-4">
                                            {recentActivity.map((activity, index) => (
                                                <div key={index} className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl">
                                                    <div className={clsx(
                                                        'w-10 h-10 rounded-xl flex items-center justify-center',
                                                        activity.type === 'solved' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                                                    )}>
                                                        {activity.type === 'solved' ? <CheckCircle2 className="w-5 h-5" /> : <Trophy className="w-5 h-5" />}
                                                    </div>
                                                    <div className="flex-grow">
                                                        <p className="font-bold text-foreground">
                                                            {activity.type === 'solved' ? 'Solved' : 'Unlocked'} {activity.type === 'solved' ? activity.question : activity.title}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">{activity.date}</p>
                                                    </div>
                                                    {activity.type === 'solved' && activity.score && (
                                                        <div className="text-right">
                                                            <p className="font-black text-foreground">{activity.score}%</p>
                                                            <p className="text-xs text-muted-foreground">Score</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {activeTab === 'activity' && (
                                <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-black tracking-tight">Activity Calendar</h3>
                                        <span className="text-sm text-muted-foreground">Last 12 months</span>
                                    </div>
                                    <ActivityGrid />

                                    {/* Activity Stats */}
                                    <div className="grid md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-border">
                                        <div className="text-center">
                                            <div className="text-3xl font-black text-primary mb-2">{progress?.totalSolved || 0}</div>
                                            <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Total Solved</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-black text-green-500 mb-2">{progress?.currentStreak || 0}</div>
                                            <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Current Streak</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-black text-yellow-500 mb-2">{progress?.longestStreak || 0}</div>
                                            <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Best Streak</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'achievements' && (
                                <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
                                    <h3 className="text-xl font-black tracking-tight mb-6">Achievements</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {achievements.map((achievement, index) => (
                                            <motion.div
                                                key={achievement.id}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: index * 0.05 }}
                                                className={clsx(
                                                    'p-6 rounded-2xl border transition-all',
                                                    achievement.unlocked
                                                        ? 'bg-primary/5 border-primary/20 text-foreground'
                                                        : 'bg-muted/30 border-border/50 text-muted-foreground'
                                                )}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className={clsx(
                                                        'p-3 rounded-xl',
                                                        achievement.unlocked
                                                            ? 'bg-primary/10 text-primary'
                                                            : 'bg-muted text-muted-foreground'
                                                    )}>
                                                        {achievement.icon}
                                                    </div>
                                                    <div className="flex-grow">
                                                        <h4 className="font-black mb-1">{achievement.title}</h4>
                                                        <p className="text-sm mb-2">{achievement.description}</p>
                                                        {achievement.unlocked && achievement.date && (
                                                            <p className="text-xs text-muted-foreground">
                                                                Unlocked on {new Date(achievement.date).toLocaleDateString()}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {achievement.unlocked && (
                                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'settings' && (
                                <div className="space-y-6">
                                    {/* Account Settings */}
                                    <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
                                        <h3 className="text-xl font-black tracking-tight mb-6">Account Settings</h3>
                                        <div className="space-y-6">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-bold text-foreground mb-2">Full Name</label>
                                                    <input
                                                        type="text"
                                                        defaultValue={session.user?.name || ''}
                                                        className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-foreground mb-2">Email</label>
                                                    <input
                                                        type="email"
                                                        defaultValue={session.user?.email || ''}
                                                        className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-foreground mb-2">Bio</label>
                                                <textarea
                                                    rows={4}
                                                    defaultValue="Passionate system architect with 8+ years of experience designing scalable distributed systems."
                                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Privacy Settings */}
                                    <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
                                        <h3 className="text-xl font-black tracking-tight mb-6">Privacy & Notifications</h3>
                                        <div className="space-y-4">
                                            {[
                                                { label: 'Make profile public', description: 'Allow others to view your profile and progress' },
                                                { label: 'Email notifications', description: 'Receive emails about new challenges and achievements' },
                                                { label: 'Weekly progress reports', description: 'Get weekly summaries of your learning progress' },
                                                { label: 'Achievement notifications', description: 'Get notified when you unlock new achievements' },
                                            ].map((setting, index) => (
                                                <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
                                                    <div>
                                                        <p className="font-bold text-foreground">{setting.label}</p>
                                                        <p className="text-sm text-muted-foreground">{setting.description}</p>
                                                    </div>
                                                    <button className="w-12 h-6 bg-primary rounded-full relative transition-colors">
                                                        <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Account Actions */}
                                    <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
                                        <h3 className="text-xl font-black tracking-tight mb-6">Account Actions</h3>
                                        <div className="space-y-4">
                                            {/* Change Password */}
                                            <button className="w-full flex items-center justify-between p-5 bg-muted/30 hover:bg-muted/50 border border-border/50 rounded-2xl group transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2 bg-muted rounded-lg group-hover:scale-110 transition-transform">
                                                        <Lock className="w-4 h-4 text-muted-foreground" />
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="font-bold text-foreground">Change Password</p>
                                                        <p className="text-sm text-muted-foreground">Update your account password</p>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                            </button>

                                            {/* Export Data */}
                                            <button className="w-full flex items-center justify-between p-5 bg-muted/30 hover:bg-muted/50 border border-border/50 rounded-2xl group transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2 bg-muted rounded-lg group-hover:scale-110 transition-transform">
                                                        <Shield className="w-4 h-4 text-muted-foreground" />
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="font-bold text-foreground">Export Data</p>
                                                        <p className="text-sm text-muted-foreground">Download your progress and data</p>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                            </button>

                                            {/* Logout Button */}
                                            <button
                                                onClick={() => signOut({ callbackUrl: '/' })}
                                                className="w-full flex items-center justify-between p-5 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 rounded-2xl group transition-all"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2 bg-red-500/20 rounded-lg group-hover:scale-110 transition-transform">
                                                        <LogOut className="w-4 h-4 text-red-500" />
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="font-bold text-red-500">Sign Out</p>
                                                        <p className="text-sm text-muted-foreground">End your current session</p>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-red-500/70 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}