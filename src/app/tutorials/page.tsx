'use client';

import React from 'react';
import Link from 'next/link';
import { BrainCircuit, ArrowLeft, Play, Clock, BarChart } from 'lucide-react';
import { motion } from 'framer-motion';

const tutorials = [
  {
    id: 1,
    title: 'Design a Twitter-like Social Media Platform',
    description: 'Learn to design a scalable social media platform with feeds, followers, and real-time updates',
    duration: '45 min',
    level: 'Intermediate',
    topics: ['Feed Generation', 'Fanout', 'Caching', 'Real-time Updates'],
    icon: '🐦'
  },
  {
    id: 2,
    title: 'Build a Video Streaming Service like Netflix',
    description: 'Design a video streaming platform handling millions of concurrent users with adaptive bitrate streaming',
    duration: '60 min',
    level: 'Advanced',
    topics: ['CDN', 'Transcoding', 'Adaptive Streaming', 'Recommendations'],
    icon: '🎬'
  },
  {
    id: 3,
    title: 'Create a Ride-Sharing App like Uber',
    description: 'Design a real-time location-based service with matching algorithms and surge pricing',
    duration: '50 min',
    level: 'Advanced',
    topics: ['Geospatial Indexing', 'Matching Algorithm', 'Real-time Tracking', 'Payment Processing'],
    icon: '🚗'
  },
  {
    id: 4,
    title: 'Design an E-commerce Platform like Amazon',
    description: 'Build a scalable e-commerce system with inventory management, search, and recommendations',
    duration: '55 min',
    level: 'Intermediate',
    topics: ['Product Catalog', 'Search', 'Cart Management', 'Order Processing'],
    icon: '🛒'
  },
  {
    id: 5,
    title: 'Build a Messaging App like WhatsApp',
    description: 'Design an end-to-end encrypted messaging system with group chats and media sharing',
    duration: '40 min',
    level: 'Intermediate',
    topics: ['WebSocket', 'Message Queue', 'Encryption', 'Media Storage'],
    icon: '💬'
  },
  {
    id: 6,
    title: 'Create a URL Shortener like bit.ly',
    description: 'Design a simple yet scalable URL shortening service with analytics',
    duration: '30 min',
    level: 'Beginner',
    topics: ['Hash Generation', 'Database Design', 'Caching', 'Analytics'],
    icon: '🔗'
  }
];

export default function TutorialsPage() {
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
          <h1 className="text-5xl md:text-6xl font-black mb-4">Tutorials</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Step-by-step guides to design real-world systems from scratch
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {tutorials.map((tutorial, i) => (
            <motion.div
              key={tutorial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-3xl p-8 hover:shadow-xl hover:scale-105 transition-all group cursor-pointer"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="text-5xl">{tutorial.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      tutorial.level === 'Beginner' ? 'bg-green-500/10 text-green-600' :
                      tutorial.level === 'Intermediate' ? 'bg-yellow-500/10 text-yellow-600' :
                      'bg-red-500/10 text-red-600'
                    }`}>
                      {tutorial.level}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {tutorial.duration}
                    </span>
                  </div>
                  <h3 className="text-xl font-black mb-2 group-hover:text-primary transition-colors">
                    {tutorial.title}
                  </h3>
                </div>
              </div>
              
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                {tutorial.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {tutorial.topics.map((topic, j) => (
                  <span key={j} className="text-xs bg-muted px-3 py-1 rounded-full font-medium">
                    {topic}
                  </span>
                ))}
              </div>

              <button className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2">
                <Play className="w-4 h-4" />
                Start Tutorial
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-3xl p-8 text-center">
          <BarChart className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-black mb-4">Track Your Progress</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Complete tutorials, earn badges, and climb the leaderboard as you master system design
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:scale-105 transition-transform"
          >
            Start Learning
          </Link>
        </div>
      </div>
    </div>
  );
}
