'use client';

import Link from 'next/link';
import {
  ArrowRight, Server, Shield, Zap,
  BrainCircuit, Globe, Layers, Trophy,
  MousePointer2, Sparkles, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { PROBLEMS } from '@/lib/data/problems';
import { clsx } from 'clsx';

export default function Home() {
  const featuredProblems = PROBLEMS.slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter mb-8 bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent leading-[0.9]"
          >
            Master Architecture <br /> with AI Guidance.
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
              href="/canvas/1"
              className="group relative px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black text-lg shadow-2xl shadow-primary/30 hover:scale-105 transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative flex items-center gap-2">
                Start Architecting <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <button className="px-8 py-4 bg-muted hover:bg-muted/80 rounded-2xl font-black text-lg transition-all border border-border">
              View All Challenges
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 bg-muted/30 border-y border-border">
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

      {/* Featured Challenges */}
      <section className="py-32 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Popular Challenges</h2>
              <p className="text-muted-foreground font-medium text-lg">Start with these highly-rated system design problems.</p>
            </div>
            <Link href="/canvas/1" className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-sm hover:gap-4 transition-all">
              Explore Library <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredProblems.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={`/canvas/${p.id}`}
                  className="group block p-8 rounded-[2rem] bg-card border border-border hover:border-primary transition-all shadow-xl hover:shadow-primary/10 relative overflow-hidden h-full"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className={clsx(
                      "p-3 rounded-2xl",
                      p.difficulty === 'Easy' ? "bg-green-500/10 text-green-500" :
                        p.difficulty === 'Medium' ? "bg-yellow-500/10 text-yellow-500" :
                          "bg-red-500/10 text-red-500"
                    )}>
                      {p.difficulty === 'Easy' ? <Zap className="w-6 h-6" /> :
                        p.difficulty === 'Medium' ? <Layers className="w-6 h-6" /> :
                          <Server className="w-6 h-6" />}
                    </div>
                    <span className={clsx(
                      "px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border",
                      p.difficulty === 'Easy' ? "border-green-500/20 text-green-500" :
                        p.difficulty === 'Medium' ? "border-yellow-500/20 text-yellow-500" :
                          "border-red-500/20 text-red-500"
                    )}>
                      {p.difficulty}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors">{p.title}</h3>
                  <p className="text-muted-foreground font-medium text-sm mb-8 leading-relaxed">
                    {p.description}
                  </p>
                  <div className="flex items-center text-sm font-black uppercase tracking-widest text-primary mt-auto">
                    Start Challenge <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
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
