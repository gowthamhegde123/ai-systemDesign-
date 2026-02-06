'use client';

import React from 'react';
import Link from 'next/link';
import { BrainCircuit, ArrowLeft, Target, Users, Zap, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
        
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
              About <span className="text-primary">SystemDesign.AI</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed">
              We're building the future of system design education through AI-powered learning and real-world practice.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-black mb-6">Our Mission</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                SystemDesign.AI was created to democratize system design education. We believe that mastering distributed systems shouldn't be limited to those working at big tech companies.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Through AI-powered feedback, real-world challenges, and a supportive community, we're helping the next generation of architects build scalable, reliable systems.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="bg-card border border-border rounded-3xl p-6">
                <Target className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-black text-2xl mb-2">10K+</h3>
                <p className="text-sm text-muted-foreground">Active Learners</p>
              </div>
              <div className="bg-card border border-border rounded-3xl p-6">
                <Users className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-black text-2xl mb-2">50+</h3>
                <p className="text-sm text-muted-foreground">Design Challenges</p>
              </div>
              <div className="bg-card border border-border rounded-3xl p-6">
                <Zap className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-black text-2xl mb-2">AI-Powered</h3>
                <p className="text-sm text-muted-foreground">Real-time Feedback</p>
              </div>
              <div className="bg-card border border-border rounded-3xl p-6">
                <Award className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-black text-2xl mb-2">95%</h3>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-black text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Learn by Doing',
                description: 'We believe the best way to learn system design is through hands-on practice with real-world scenarios.'
              },
              {
                title: 'AI-Enhanced Learning',
                description: 'Our AI provides instant, personalized feedback to help you improve faster than traditional methods.'
              },
              {
                title: 'Community First',
                description: 'Join a supportive community of learners and experts who share knowledge and grow together.'
              }
            ].map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-3xl p-8"
              >
                <h3 className="text-xl font-black mb-4">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-black mb-6">Ready to Start Learning?</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of engineers mastering system design through AI-powered practice.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black text-lg hover:scale-105 transition-transform"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
}
