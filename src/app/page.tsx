'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Server, Zap,
  BrainCircuit, Globe, Layers, Trophy,
  MousePointer2, Sparkles, ChevronRight, Github
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROBLEMS } from '@/lib/data/problems';
import { clsx } from 'clsx';
import { useSession } from 'next-auth/react';
import { ProfileDashboard } from '@/components/ProfileDashboard';
import { User as UserIcon } from 'lucide-react';
import { PricingSection } from '@/components/PricingSection';
import { UserRankBadge, getRankByPoints } from '@/components/UserRankBadge';

export default function Home() {
  const { data: session } = useSession();
  const [selectedProblemId, setSelectedProblemId] = useState<string>(PROBLEMS[0].id);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Mock user stats - in production, fetch from API
  const userPoints = 0; // Start at 0 for new users - will be fetched from user profile
  const userRank = getRankByPoints(userPoints);

  const selectedProblem = useMemo(() =>
    PROBLEMS.find(p => p.id === selectedProblemId),
    [selectedProblemId]
  );

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-accent/30">
      {/* Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-6">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl px-6 py-3 flex items-center justify-between shadow-2xl shadow-black/50"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-black tracking-tighter text-lg">SystemDesign.AI</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {[
              { name: 'Features', id: 'features' },
              { name: 'Questions', href: '/questions' },
              { name: 'Challenges', id: 'challenges' },
              { name: 'Pricing', id: 'pricing' },
              { name: 'About', id: 'about' }
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  if (item.href) {
                    window.location.href = item.href;
                  } else if (item.id) {
                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                {item.name}
              </button>
            ))}
          </div>

          {session ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-3 pl-2 pr-4 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-xl transition-all group"
            >
              <Link href="/profile" className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center overflow-hidden">
                  {session.user?.image ? (
                    <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-4 h-4 text-primary-foreground" />
                  )}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">
                    {userRank.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-[9px] font-bold text-muted-foreground leading-none truncate max-w-[80px]">
                      {session.user?.name || 'Architect'}
                    </p>
                    <span className="px-1.5 py-0.5 bg-accent/20 text-accent text-[8px] font-black rounded-md border border-accent/20">
                      {userPoints}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.button>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-black uppercase tracking-widest transition-all border border-primary/20"
            >
              Get Started
            </Link>
          )}
        </motion.div>
      </nav>

      <ProfileDashboard
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      {/* Hero Section */}
      <section id="about" className="relative pt-48 pb-32 px-6 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 blur-[120px] rounded-full animate-pulse delay-700" />
        </div>

        <div className="container mx-auto text-center max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>The Future of System Design Interviews</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl md:text-9xl font-black tracking-tighter mb-8 bg-gradient-to-b from-foreground via-foreground to-muted-foreground/50 bg-clip-text text-transparent leading-[0.85]"
          >
            Master Architecture <br />
            <span className="text-accent">with AI Guidance.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
          >
            Practice designing scalable systems with 540+ curated questions on a professional canvas.
            Get instant, high-fidelity feedback from our AI architect on your designs.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href={session ? "/canvas/1" : "/login"}
              className="group relative px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black text-lg shadow-2xl shadow-primary/30 hover:scale-105 transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative flex items-center gap-2">
                Start Architecting <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <button
              onClick={() => document.getElementById('challenges')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-muted hover:bg-muted/80 rounded-2xl font-black text-lg transition-all border border-border"
            >
              View All Challenges
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-primary/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <MousePointer2 className="w-8 h-8 text-blue-500" />,
                title: "Professional Canvas",
                desc: "Industry-standard components and drag-and-drop interface powered by React Flow."
              },
              {
                icon: <BrainCircuit className="w-8 h-8 text-purple-500" />,
                title: "AI Feedback",
                desc: "Get detailed critiques on scalability, availability, and performance from our LLM engine."
              },
              {
                icon: <Trophy className="w-8 h-8 text-yellow-500" />,
                title: "540+ Curated Questions",
                desc: "Comprehensive system design questions across 15+ categories with detailed requirements and learning outcomes."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-card border border-border shadow-xl hover:border-primary/30 transition-all group"
              >
                <div className="mb-6 p-4 bg-muted rounded-2xl w-fit group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black mb-4">{feature.title}</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Learn System Design Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <div className="container mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-16">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-black uppercase tracking-widest text-primary">New Learning Path</span>
              </motion.div>
              <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter">
                Master System Design
                <br />
                <span className="text-primary">From Zero to Hero</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Comprehensive learning path covering fundamentals to advanced concepts. Understand why system design is irreplaceable by AI.
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-3xl p-8 hover:shadow-2xl hover:scale-105 transition-all group"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BrainCircuit className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-black mb-3">10 Modules</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Structured learning from fundamentals to expert-level concepts with 40+ lessons
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-3xl p-8 hover:shadow-2xl hover:scale-105 transition-all group"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Trophy className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-black mb-3">6+ Hours</h3>
                <p className="text-muted-foreground leading-relaxed">
                  In-depth content covering databases, distributed systems, and more
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-3xl p-8 hover:shadow-2xl hover:scale-105 transition-all group"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-black mb-3">AI vs Human</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Learn why system design requires human judgment that AI can't replace
                </p>
              </motion.div>
            </div>

            {/* Topics Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card/50 backdrop-blur-sm border border-border rounded-3xl p-8 mb-12"
            >
              <h3 className="text-2xl font-black mb-6 text-center">What You'll Learn</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  'Core System Design Concepts',
                  'Database Design & Scaling',
                  'Distributed Systems & CAP Theorem',
                  'Microservices Architecture',
                  'High Availability & Reliability',
                  'Performance Optimization',
                  'Security Best Practices',
                  'Real-Time Systems'
                ].map((topic, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="font-medium">{topic}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Link
                href="/learn"
                className="group inline-flex items-center gap-3 px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-black text-lg shadow-2xl shadow-primary/20 hover:scale-105 transition-all"
              >
                Start Learning Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-sm text-muted-foreground mt-4">
                No credit card required • 10 modules • 40+ lessons
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* System Design Questions Section */}
      <section className="py-32 px-6 bg-muted/30 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-blue-500/5" />
        <div className="container mx-auto relative">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-8"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>System Design Mastery</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-black tracking-tight mb-6"
            >
              540+ Curated Questions
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed"
            >
              Master system design with carefully curated questions from industry experts.
              Each question includes detailed requirements, learning outcomes, and recommended tech stacks.
            </motion.p>
          </div>

          {/* Categories Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              {
                title: "Storage & Databases",
                count: "60+",
                description: "Distributed caches, KV stores, and database systems",
                icon: <Server className="w-6 h-6" />,
                color: "from-blue-500 to-cyan-500",
                examples: ["Distributed Cache", "Superfast KV Store", "S3 Design"]
              },
              {
                title: "Real-time Systems",
                count: "50+",
                description: "Live updates, presence, and real-time communication",
                icon: <Zap className="w-6 h-6" />,
                color: "from-yellow-500 to-orange-500",
                examples: ["Live Commentary", "Online Indicators", "Real-time Claps"]
              },
              {
                title: "Infrastructure",
                count: "70+",
                description: "Load balancers, schedulers, and core infrastructure",
                icon: <Layers className="w-6 h-6" />,
                color: "from-purple-500 to-pink-500",
                examples: ["Load Balancer", "Task Scheduler", "Message Broker"]
              },
              {
                title: "Content & Media",
                count: "50+",
                description: "Image processing, video pipelines, and content delivery",
                icon: <Globe className="w-6 h-6" />,
                color: "from-green-500 to-teal-500",
                examples: ["Image Service", "Video Pipeline", "Blogging Platform"]
              },
              {
                title: "Search & Discovery",
                count: "50+",
                description: "Search engines, indexing, and discovery systems",
                icon: <BrainCircuit className="w-6 h-6" />,
                color: "from-indigo-500 to-blue-500",
                examples: ["Search Engine", "Word Dictionary", "Recent Searches"]
              },
              {
                title: "E-commerce & Business",
                count: "100+",
                description: "Flash sales, analytics, and business-critical systems",
                icon: <Trophy className="w-6 h-6" />,
                color: "from-red-500 to-pink-500",
                examples: ["Flash Sale", "Impression Counting", "Airline Check-in"]
              }
            ].map((category, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative overflow-hidden"
              >
                <Link
                  href={`/questions?category=${encodeURIComponent(category.title)}`}
                  className="block p-8 rounded-3xl bg-card border border-border shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                  {/* Icon */}
                  <div className={`mb-6 p-4 rounded-2xl bg-gradient-to-br ${category.color} text-white w-fit group-hover:scale-110 transition-transform duration-300`}>
                    {category.icon}
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-black group-hover:text-primary transition-colors">
                        {category.title}
                      </h3>
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-bold">
                        {category.count}
                      </span>
                    </div>
                    <p className="text-muted-foreground font-medium mb-4 leading-relaxed">
                      {category.description}
                    </p>

                    {/* Examples */}
                    <div className="space-y-2">
                      {category.examples.map((example, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                          <span className="font-medium">{example}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hover Arrow */}
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="w-5 h-5 text-primary" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Stats and CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              {[
                { label: "Total Questions", value: "540+" },
                { label: "Categories", value: "15+" },
                { label: "Difficulty Levels", value: "3" },
                { label: "Avg. Time", value: "5-7h" }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-black text-primary mb-2">{stat.value}</div>
                  <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/questions"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-all"
            >
              <span>Explore All Questions</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Challenge Explorer Section */}
      <section id="challenges" className="py-32 px-6 bg-background">
        <div className="container mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Challenge Explorer</h2>
            <p className="text-muted-foreground font-medium text-lg">Select a system to design and view its full requirements.</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left: Problem List */}
            <div className="lg:col-span-4 space-y-3 h-[600px] overflow-y-auto pr-4 custom-scrollbar">
              {PROBLEMS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProblemId(p.id)}
                  className={clsx(
                    "w-full text-left p-6 rounded-2xl border transition-all group relative overflow-hidden",
                    selectedProblemId === p.id
                      ? "bg-primary/10 border-primary shadow-lg shadow-primary/5"
                      : "bg-card border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className={clsx(
                      "text-[10px] font-black uppercase tracking-widest",
                      p.difficulty === 'Easy' ? "text-green-500" :
                        p.difficulty === 'Medium' ? "text-yellow-500" :
                          "text-red-500"
                    )}>
                      {p.difficulty}
                    </span>
                    {selectedProblemId === p.id && (
                      <motion.div layoutId="active-indicator" className="w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </div>
                  <h3 className="font-black text-lg group-hover:text-primary transition-colors">{p.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">{p.category}</p>
                </button>
              ))}
            </div>

            {/* Right: Problem Details */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedProblemId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-card border border-border rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden min-h-[600px] flex flex-col"
                >
                  {/* Decorative Background */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -mr-32 -mt-32" />

                  {selectedProblem ? (
                    <>
                      <div className="relative z-10 flex-grow">
                        <div className="flex items-center gap-4 mb-8">
                          <div className={clsx(
                            "px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border",
                            selectedProblem.difficulty === 'Easy' ? "border-green-500/20 text-green-500 bg-green-500/5" :
                              selectedProblem.difficulty === 'Medium' ? "border-yellow-500/20 text-yellow-500 bg-yellow-500/5" :
                                "border-red-500/20 text-red-500 bg-red-500/5"
                          )}>
                            {selectedProblem.difficulty}
                          </div>
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            {selectedProblem.category}
                          </span>
                        </div>

                        <h3 className="text-4xl font-black mb-6 tracking-tight">{selectedProblem.title}</h3>
                        <p className="text-lg text-muted-foreground mb-10 font-medium leading-relaxed">
                          {selectedProblem.description}
                        </p>

                        <div className="grid md:grid-cols-2 gap-10">
                          <div>
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-6 flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-primary" />
                              Functional Requirements
                            </h4>
                            <ul className="space-y-4">
                              {selectedProblem.requirements.map((r, i) => (
                                <li key={i} className="flex gap-3 text-sm font-medium text-foreground/80">
                                  <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                  {r}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-6 flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-primary" />
                              Constraints & Scale
                            </h4>
                            <ul className="space-y-4">
                              {selectedProblem.constraints.map((c, i) => (
                                <li key={i} className="flex gap-3 text-sm font-medium text-foreground/80">
                                  <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                  {c}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="mt-12 pt-8 border-t border-border flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <BrainCircuit className="w-5 h-5" />
                          <span className="text-xs font-bold uppercase tracking-widest">AI Evaluation Ready</span>
                        </div>
                        <Link
                          href={`/canvas/${selectedProblem.id}`}
                          className="group px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2"
                        >
                          Start Architecting <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </>
                  ) : (
                    <div className="flex-grow flex flex-col items-center justify-center text-center">
                      <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mb-6">
                        <Layers className="w-10 h-10 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-black mb-2">Select a Challenge</h3>
                      <p className="text-muted-foreground font-medium">Choose a problem from the list to view its details.</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* Footer */}
      <footer className="relative py-20 border-t border-border bg-gradient-to-b from-background to-muted/30 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center">
                  <BrainCircuit className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-black tracking-tighter">SystemDesign.AI</span>
              </div>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                Master system design through AI-powered practice and real-world challenges.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground mb-4">Platform</h3>
              <ul className="space-y-3">
                <li><Link href="/problems" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Problems</Link></li>
                <li><Link href="/canvas" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Design Canvas</Link></li>
                <li><Link href="/profile" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Profile</Link></li>
                <li><Link href="/leaderboard" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Leaderboard</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><Link href="/learn" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Learn System Design</Link></li>
                <li><Link href="/docs" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Documentation</Link></li>
                <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Blog</Link></li>
                <li><Link href="/tutorials" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Tutorials</Link></li>
                <li><Link href="/community" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Community</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground mb-4">Company</h3>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">About</Link></li>
                <li><Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Pricing</Link></li>
                <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Contact</Link></li>
                <li><Link href="/careers" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Careers</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium">Privacy Policy</Link>
              <Link href="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium">Terms of Service</Link>
              <Link href="/cookies" className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium">Cookie Policy</Link>
            </div>
            
            <div className="flex items-center gap-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors group">
                <svg className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors group">
                <Github className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors group">
                <svg className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
