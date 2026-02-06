'use client';

import React from 'react';
import Link from 'next/link';
import { BrainCircuit, ArrowLeft, Users, MessageCircle, Trophy, Calendar, TrendingUp, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const communityStats = [
  { icon: Users, label: 'Active Members', value: '10,000+' },
  { icon: MessageCircle, label: 'Discussions', value: '5,000+' },
  { icon: Trophy, label: 'Challenges Completed', value: '50,000+' },
  { icon: Heart, label: 'Solutions Shared', value: '25,000+' }
];

const discussions = [
  {
    title: 'How to handle database migrations at scale?',
    author: 'Sarah Chen',
    replies: 24,
    likes: 156,
    category: 'Databases',
    time: '2 hours ago'
  },
  {
    title: 'Best practices for microservices communication',
    author: 'Alex Kumar',
    replies: 18,
    likes: 89,
    category: 'Architecture',
    time: '5 hours ago'
  },
  {
    title: 'Rate limiting strategies for public APIs',
    author: 'Maria Garcia',
    replies: 31,
    likes: 203,
    category: 'API Design',
    time: '1 day ago'
  }
];

const upcomingEvents = [
  {
    title: 'System Design Workshop: Building Scalable APIs',
    date: 'Feb 15, 2026',
    time: '2:00 PM PST',
    attendees: 234
  },
  {
    title: 'Live Coding: Design Instagram Feed',
    date: 'Feb 18, 2026',
    time: '10:00 AM PST',
    attendees: 567
  },
  {
    title: 'Q&A with Senior Engineers from FAANG',
    date: 'Feb 22, 2026',
    time: '3:00 PM PST',
    attendees: 892
  }
];

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
              <BrainCircuit className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-black tracking-tighter">SystemDesign.AI</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-black mb-4">Community</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join thousands of engineers learning and growing together
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {communityStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-3xl p-6 text-center"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-black mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Trending Discussions */}
          <div>
            <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Trending Discussions
            </h2>
            <div className="space-y-4">
              {discussions.map((discussion, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      {discussion.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{discussion.time}</span>
                  </div>
                  <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">
                    {discussion.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>by {discussion.author}</span>
                    <span>•</span>
                    <span>{discussion.replies} replies</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {discussion.likes}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div>
            <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-primary" />
              Upcoming Events
            </h2>
            <div className="space-y-4">
              {upcomingEvents.map((event, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all"
                >
                  <h3 className="font-bold mb-3">{event.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {event.date}
                    </span>
                    <span>•</span>
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {event.attendees} attending
                    </span>
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:scale-105 transition-transform">
                      Register
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-3xl p-12 text-center">
          <Users className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-black mb-4">Join Our Community</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with fellow engineers, share knowledge, and grow together. Get help, give help, and build amazing things.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold hover:scale-105 transition-transform"
            >
              Join Now
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 bg-muted text-foreground rounded-xl font-bold hover:scale-105 transition-transform"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
