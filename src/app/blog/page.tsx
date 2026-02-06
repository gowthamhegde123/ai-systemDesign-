'use client';

import React from 'react';
import Link from 'next/link';
import { BrainCircuit, ArrowLeft, Calendar, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const blogPosts = [
  {
    id: 1,
    title: 'Designing a URL Shortener: A Complete Guide',
    excerpt: 'Learn how to design a scalable URL shortening service like bit.ly, covering database design, API architecture, and caching strategies.',
    date: 'Feb 1, 2026',
    readTime: '8 min read',
    category: 'System Design',
    image: '🔗'
  },
  {
    id: 2,
    title: 'Microservices vs Monolith: When to Choose What',
    excerpt: 'A practical guide to deciding between microservices and monolithic architecture based on your team size, scale, and requirements.',
    date: 'Jan 28, 2026',
    readTime: '6 min read',
    category: 'Architecture',
    image: '🏗️'
  },
  {
    id: 3,
    title: 'Database Sharding Strategies Explained',
    excerpt: 'Deep dive into horizontal and vertical sharding, consistent hashing, and how to handle cross-shard queries efficiently.',
    date: 'Jan 25, 2026',
    readTime: '10 min read',
    category: 'Databases',
    image: '🗄️'
  },
  {
    id: 4,
    title: 'Building Real-Time Chat Systems at Scale',
    excerpt: 'Explore WebSocket architecture, message queuing, and presence management for building chat applications like Slack or Discord.',
    date: 'Jan 22, 2026',
    readTime: '12 min read',
    category: 'Real-Time Systems',
    image: '💬'
  },
  {
    id: 5,
    title: 'CDN Architecture: How Content Delivery Networks Work',
    excerpt: 'Understanding edge servers, cache invalidation, and how CDNs like Cloudflare deliver content globally with low latency.',
    date: 'Jan 19, 2026',
    readTime: '7 min read',
    category: 'Infrastructure',
    image: '🌐'
  },
  {
    id: 6,
    title: 'Rate Limiting Algorithms: Token Bucket vs Leaky Bucket',
    excerpt: 'Compare different rate limiting strategies and learn when to use each algorithm for API protection and traffic management.',
    date: 'Jan 16, 2026',
    readTime: '5 min read',
    category: 'API Design',
    image: '⏱️'
  }
];

export default function BlogPage() {
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
          <h1 className="text-5xl md:text-6xl font-black mb-4">Blog</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Insights, tutorials, and best practices for mastering system design
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-3xl p-6 hover:shadow-xl hover:scale-105 transition-all group cursor-pointer"
            >
              <div className="text-6xl mb-4">{post.image}</div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">{post.category}</span>
              </div>
              <h2 className="text-xl font-black mb-3 group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.article>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">Want to contribute?</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:scale-105 transition-transform"
          >
            Write for Us
          </Link>
        </div>
      </div>
    </div>
  );
}
