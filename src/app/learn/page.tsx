'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BrainCircuit, ArrowLeft, BookOpen, CheckCircle, Lock, Play, Clock, Award, ChevronRight, Lightbulb, Target, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const learningPath = [
  {
    id: 1,
    category: 'Fundamentals',
    title: 'What is System Design?',
    duration: '15 min',
    level: 'Beginner',
    locked: false,
    completed: false,
    lessons: [
      'Understanding System Design',
      'Why System Design Matters',
      'Real-World Examples',
      'Career Impact'
    ]
  },
  {
    id: 2,
    category: 'Fundamentals',
    title: 'Core Concepts & Building Blocks',
    duration: '25 min',
    level: 'Beginner',
    locked: false,
    completed: false,
    lessons: [
      'Client-Server Architecture',
      'APIs and Protocols',
      'Databases Basics',
      'Networking Fundamentals'
    ]
  },
  {
    id: 3,
    category: 'Fundamentals',
    title: 'Scalability Principles',
    duration: '30 min',
    level: 'Beginner',
    locked: false,
    completed: false,
    lessons: [
      'Vertical vs Horizontal Scaling',
      'Load Balancing',
      'Caching Strategies',
      'CDN Basics'
    ]
  },
  {
    id: 4,
    category: 'Intermediate',
    title: 'Database Design & Management',
    duration: '40 min',
    level: 'Intermediate',
    locked: false,
    completed: false,
    lessons: [
      'SQL vs NoSQL',
      'Database Sharding',
      'Replication Strategies',
      'Indexing & Query Optimization'
    ]
  },
  {
    id: 5,
    category: 'Intermediate',
    title: 'Distributed Systems',
    duration: '45 min',
    level: 'Intermediate',
    locked: false,
    completed: false,
    lessons: [
      'CAP Theorem',
      'Consistency Models',
      'Distributed Transactions',
      'Consensus Algorithms'
    ]
  },
  {
    id: 6,
    category: 'Intermediate',
    title: 'Microservices Architecture',
    duration: '35 min',
    level: 'Intermediate',
    locked: false,
    completed: false,
    lessons: [
      'Monolith vs Microservices',
      'Service Communication',
      'API Gateway Pattern',
      'Service Discovery'
    ]
  },
  {
    id: 7,
    category: 'Advanced',
    title: 'High Availability & Reliability',
    duration: '50 min',
    level: 'Advanced',
    locked: false,
    completed: false,
    lessons: [
      'Fault Tolerance',
      'Circuit Breakers',
      'Disaster Recovery',
      'Chaos Engineering'
    ]
  },
  {
    id: 8,
    category: 'Advanced',
    title: 'Performance Optimization',
    duration: '45 min',
    level: 'Advanced',
    locked: false,
    completed: false,
    lessons: [
      'Profiling & Monitoring',
      'Query Optimization',
      'Caching Layers',
      'Async Processing'
    ]
  },
  {
    id: 9,
    category: 'Advanced',
    title: 'Security & Compliance',
    duration: '40 min',
    level: 'Advanced',
    locked: false,
    completed: false,
    lessons: [
      'Authentication & Authorization',
      'Encryption at Rest & Transit',
      'Rate Limiting & DDoS Protection',
      'Compliance (GDPR, SOC2)'
    ]
  },
  {
    id: 10,
    category: 'Expert',
    title: 'Real-Time Systems',
    duration: '55 min',
    level: 'Expert',
    locked: false,
    completed: false,
    lessons: [
      'WebSocket Architecture',
      'Message Queues',
      'Event-Driven Design',
      'Stream Processing'
    ]
  }
];

const whySystemDesign = [
  {
    icon: Target,
    title: 'Career Growth',
    description: 'System design skills are essential for senior engineering roles and technical leadership positions.'
  },
  {
    icon: Zap,
    title: 'Problem Solving',
    description: 'Learn to break down complex problems into manageable, scalable solutions that serve millions.'
  },
  {
    icon: Award,
    title: 'Interview Success',
    description: 'Master the most critical part of FAANG interviews and land your dream job at top tech companies.'
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Understand how the world\'s best products are built and create your own innovative solutions.'
  }
];

const aiVsHuman = [
  {
    aspect: 'Trade-off Analysis',
    human: 'Understands business context, user needs, and makes nuanced decisions',
    ai: 'Can suggest patterns but lacks business context and real-world constraints'
  },
  {
    aspect: 'Creativity',
    human: 'Innovates novel solutions for unique problems',
    ai: 'Limited to patterns seen in training data'
  },
  {
    aspect: 'Communication',
    human: 'Explains decisions, collaborates with teams, handles ambiguity',
    ai: 'Cannot effectively communicate trade-offs or justify decisions'
  },
  {
    aspect: 'Adaptability',
    human: 'Adapts to changing requirements and unexpected challenges',
    ai: 'Struggles with novel situations outside training scope'
  }
];

export default function LearnPage() {
  const [selectedModule, setSelectedModule] = useState<number | null>(null);

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

      {/* Hero */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              Master <span className="text-primary">System Design</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              From fundamentals to expert-level concepts. Learn why system design is irreplaceable by AI and essential for your engineering career.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why System Design Matters */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-black text-center mb-12">Why System Design Matters</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whySystemDesign.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border border-border rounded-3xl p-6"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-black mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Learning Path */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">Your Learning Journey</h2>
            <p className="text-muted-foreground text-lg">
              Structured path from beginner to expert. Start anywhere, learn at your own pace.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {learningPath.map((module, i) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedModule(selectedModule === module.id ? null : module.id)}
                className={`bg-card border rounded-3xl p-6 cursor-pointer transition-all hover:shadow-xl ${
                  selectedModule === module.id ? 'border-primary shadow-lg' : 'border-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      module.completed ? 'bg-green-500/10' : 
                      module.locked ? 'bg-muted' : 'bg-primary/10'
                    }`}>
                      {module.completed ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : module.locked ? (
                        <Lock className="w-6 h-6 text-muted-foreground" />
                      ) : (
                        <BookOpen className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">
                          {module.category}
                        </span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          module.level === 'Beginner' ? 'bg-green-500/10 text-green-600' :
                          module.level === 'Intermediate' ? 'bg-yellow-500/10 text-yellow-600' :
                          module.level === 'Advanced' ? 'bg-orange-500/10 text-orange-600' :
                          'bg-red-500/10 text-red-600'
                        }`}>
                          {module.level}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {module.duration}
                        </span>
                      </div>
                      <h3 className="text-lg font-black">{module.title}</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {!module.locked && (
                      <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:scale-105 transition-transform flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Start
                      </button>
                    )}
                    <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${
                      selectedModule === module.id ? 'rotate-90' : ''
                    }`} />
                  </div>
                </div>

                {selectedModule === module.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-6 border-t border-border"
                  >
                    <h4 className="text-sm font-bold mb-3">Lessons in this module:</h4>
                    <ul className="space-y-2">
                      {module.lessons.map((lesson, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {lesson}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why AI Can't Replace System Design */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-black mb-4">Why AI Can't Replace System Design Skills</h2>
              <p className="text-muted-foreground text-lg">
                While AI is powerful, system design requires human judgment, creativity, and contextual understanding that AI cannot replicate.
              </p>
            </motion.div>

            <div className="space-y-6">
              {aiVsHuman.map((comparison, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border border-border rounded-3xl p-6"
                >
                  <h3 className="text-xl font-black mb-4">{comparison.aspect}</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-sm font-bold text-green-600">Human Engineer</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{comparison.human}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        <span className="text-sm font-bold text-orange-600">AI Limitation</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{comparison.ai}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-3xl p-8">
              <h3 className="text-2xl font-black mb-4 text-center">The Bottom Line</h3>
              <p className="text-muted-foreground leading-relaxed text-center max-w-2xl mx-auto">
                AI is a powerful tool that can assist in system design, but it cannot replace the critical thinking, business understanding, and creative problem-solving that human engineers bring. System design is about making informed trade-offs based on real-world constraints—something that requires human judgment and experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-black mb-6">Ready to Start Your Journey?</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of engineers mastering system design through structured learning and hands-on practice.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold hover:scale-105 transition-transform"
            >
              Start Learning Free
            </Link>
            <Link
              href="/tutorials"
              className="px-8 py-4 bg-muted text-foreground rounded-xl font-bold hover:scale-105 transition-transform"
            >
              Browse Tutorials
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
