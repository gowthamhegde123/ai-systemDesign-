'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Server, Shield, Zap,
  BrainCircuit, Globe, Layers, Trophy,
  MousePointer2, Sparkles, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROBLEMS } from '@/lib/data/problems';
import { clsx } from 'clsx';
import { useSession } from 'next-auth/react';
import { ProfileDashboard } from '@/components/ProfileDashboard';
import { User as UserIcon } from 'lucide-react';

export default function Home() {
  const { data: session } = useSession();
  const [selectedProblemId, setSelectedProblemId] = useState<string>(PROBLEMS[0].id);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const selectedProblem = useMemo(() =>
    PROBLEMS.find(p => p.id === selectedProblemId),
    [selectedProblemId]
  );

  const featuredProblems = PROBLEMS.slice(0, 3);

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
            {['Features', 'Challenges', 'About'].map((item) => (
              <button
                key={item}
                onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
                className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
              >
                {item}
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
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center overflow-hidden">
                {session.user?.image ? (
                  <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-4 h-4 text-primary-foreground" />
                )}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Profile</p>
                <div className="flex items-center gap-2">
                  <p className="text-[9px] font-bold text-muted-foreground leading-none truncate max-w-[80px]">
                    {session.user?.name || 'Architect'}
                  </p>
                  <span className="px-1.5 py-0.5 bg-accent/20 text-accent text-[8px] font-black rounded-md border border-accent/20">
                    42
                  </span>
                </div>
              </div>
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
            Practice designing scalable systems on a professional canvas.
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
                title: "300+ Problems",
                desc: "A vast library of real-world system design challenges from top tech companies."
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

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-muted/30">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <BrainCircuit className="w-6 h-6 text-primary" />
            <span className="text-xl font-black tracking-tighter">SystemDesign.AI</span>
          </div>
          <p className="text-muted-foreground font-medium text-sm">
            © 2024 System Design AI. Built for the next generation of architects.
          </p>
        </div>
      </footer>
    </div>
  );
}
