'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BrainCircuit, ArrowLeft, Book, Code, Database, Network, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const docSections = [
  {
    icon: Book,
    title: 'Getting Started',
    description: 'Learn the basics of system design and how to use our platform',
    topics: ['Introduction to System Design', 'Platform Overview', 'Your First Design', 'Best Practices']
  },
  {
    icon: Database,
    title: 'Database Design',
    description: 'Master database architecture and scaling strategies',
    topics: ['SQL vs NoSQL', 'Sharding & Partitioning', 'Replication', 'Indexing Strategies']
  },
  {
    icon: Network,
    title: 'Distributed Systems',
    description: 'Build scalable and reliable distributed architectures',
    topics: ['CAP Theorem', 'Consistency Models', 'Load Balancing', 'Service Discovery']
  },
  {
    icon: Zap,
    title: 'Performance',
    description: 'Optimize your systems for speed and efficiency',
    topics: ['Caching Strategies', 'CDN Usage', 'Query Optimization', 'Async Processing']
  },
  {
    icon: Shield,
    title: 'Security',
    description: 'Implement security best practices in your designs',
    topics: ['Authentication', 'Authorization', 'Encryption', 'Rate Limiting']
  },
  {
    icon: Code,
    title: 'API Design',
    description: 'Design robust and scalable APIs',
    topics: ['REST vs GraphQL', 'Versioning', 'Documentation', 'Error Handling']
  }
];

export default function DocsPage() {
  const [selectedSection, setSelectedSection] = useState(0);

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
          <h1 className="text-5xl md:text-6xl font-black mb-4">Documentation</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to know about system design and our platform
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docSections.map((section, i) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedSection(i)}
                className={`bg-card border rounded-3xl p-6 cursor-pointer transition-all hover:shadow-xl hover:scale-105 ${
                  selectedSection === i ? 'border-primary shadow-lg' : 'border-border'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                  selectedSection === i ? 'bg-primary' : 'bg-primary/10'
                }`}>
                  <Icon className={`w-6 h-6 ${selectedSection === i ? 'text-primary-foreground' : 'text-primary'}`} />
                </div>
                <h3 className="text-xl font-black mb-2">{section.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{section.description}</p>
                <ul className="space-y-2">
                  {section.topics.map((topic, j) => (
                    <li key={j} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {topic}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-16 bg-card border border-border rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-black mb-4">Need Help?</h2>
          <p className="text-muted-foreground mb-6">
            Can't find what you're looking for? Our community is here to help!
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/community"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:scale-105 transition-transform"
            >
              Join Community
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 bg-muted text-foreground rounded-xl font-bold hover:scale-105 transition-transform"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
