'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DesignCanvas } from '@/components/canvas/DesignCanvas';
import { useStore } from '@/lib/hooks/useStore';
import { useUserProgress } from '@/lib/hooks/useUserProgress';
import { SystemDesignQuestion } from '@/lib/data/system-design-questions';
import { AIAnalysisResult } from '@/types';
import {
    Play, CheckCircle, AlertCircle, Loader2,
    ChevronLeft, Send, Search as SearchIcon,
    Trophy, Sparkles, BrainCircuit, History,
    ArrowRight, Info, Maximize, Clock, Users, Code, Target, Lightbulb, Wrench
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

// Convert SystemDesignQuestion to Problem format for the store
const convertToProblem = (question: SystemDesignQuestion) => ({
  id: question.id,
  title: question.title,
  description: question.description,
  difficulty: question.difficulty as 'Easy' | 'Medium' | 'Hard',
  category: question.category,
  requirements: question.coreRequirements,
  constraints: [
    ...question.highLevelRequirements,
    ...question.microRequirements
  ]
});

export default function SystemDesignCanvas() {
  const params = useParams();
  const router = useRouter();
  const { markQuestionSolved, isQuestionSolved } = useUserProgress();
  const [question, setQuestion] = useState<SystemDesignQuestion | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    setProblem, currentProblem, nodes, edges,
    isPassed, setPassed, isSubmitted, setSubmitted,
    theme
  } = useStore();

  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (params.id) {
        await fetchQuestion(params.id as string);
      }
    };
    fetchData();
  }, [params.id]);

  const fetchQuestion = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/questions/${id}`);
      if (response.ok) {
        const data: SystemDesignQuestion = await response.json();
        setQuestion(data);
        // Convert and set the problem in the store (this will clear the canvas)
        setProblem(convertToProblem(data));
      } else {
        console.error('Question not found');
        router.push('/questions');
      }
    } catch (error) {
      console.error('Error fetching question:', error);
      router.push('/questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!currentProblem || !question) return;

    setAnalyzing(true);
    setResult(null);

    try {
      const response = await fetch('/api/ai-evaluator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          design: { nodes, edges },
          problem: currentProblem
        })
      });

      const data = await response.json();
      setResult(data);
      if (data.status === 'Pass') {
        setPassed(true);
      } else {
        setPassed(false);
      }
    } catch (error) {
      console.error('Analysis failed', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async () => {
    if (!isPassed || !question) return;
    
    // Mark question as solved
    const success = await markQuestionSolved(question.id);
    
    if (success) {
      setSubmitted(true);
      alert('Congratulations! Your system design has been submitted successfully and marked as solved.');
    } else {
      alert('Design submitted successfully!');
      setSubmitted(true);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/10 text-green-500';
      case 'Intermediate': return 'bg-yellow-500/10 text-yellow-500';
      case 'Advanced': return 'bg-red-500/10 text-red-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (loading || !question || !currentProblem) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-12 h-12 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className={clsx("flex flex-col h-screen bg-background overflow-hidden transition-colors duration-500", theme === 'dark' ? 'dark' : '')}>
      {/* Header */}
      <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card/50 backdrop-blur-xl z-30">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/questions')}
            className="p-2 hover:bg-muted rounded-lg transition-colors border border-border"
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.button>
          <div className="w-px h-6 bg-border mx-2" />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-sm font-black tracking-tight truncate max-w-[300px]">{question.title}</h1>
              {isQuestionSolved(question.id) && (
                <div className="flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-500 rounded-lg border border-green-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Solved</span>
                </div>
              )}
              <div className={clsx(
                "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest",
                getDifficultyColor(question.difficulty)
              )}>
                {question.difficulty}
              </div>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                {question.category}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAnalyze}
            disabled={analyzing}
            className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg disabled:opacity-50 transition-all text-xs font-bold border border-border shadow-sm"
          >
            {analyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <BrainCircuit className="w-3 h-3 text-primary" />}
            Run AI Analysis
          </motion.button>
          <motion.button
            whileHover={isPassed ? { scale: 1.05 } : {}}
            whileTap={isPassed ? { scale: 0.95 } : {}}
            onClick={handleSubmit}
            disabled={!isPassed || isSubmitted}
            className={clsx(
              "flex items-center gap-2 px-6 py-2 rounded-lg transition-all text-xs font-black shadow-lg uppercase tracking-widest",
              isPassed
                ? "bg-primary text-primary-foreground shadow-primary/20"
                : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
            )}
          >
            <Send className="w-3 h-3" />
            {isSubmitted ? 'Submitted' : 'Submit Design'}
          </motion.button>
        </div>
      </header>

      <div className="flex-grow flex overflow-hidden">
        {/* Left Panel: Problem Details */}
        <aside className="w-[450px] border-r border-border bg-card flex flex-col overflow-hidden z-20 shadow-xl">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-border bg-muted/20">
            <div className="p-1.5 bg-primary/10 rounded-md">
              <Info className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-xs font-black uppercase tracking-widest text-foreground">System Design Challenge</h2>
          </div>

          <div className="flex-grow overflow-y-auto p-8 space-y-8 custom-scrollbar">
            {/* Problem Statement */}
            <section>
              <h3 className="text-2xl font-black mb-4 tracking-tight">{question.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium mb-4">
                {question.description}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {question.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-lg font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            {/* Core Requirements */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Core Requirements</h3>
              </div>
              <ul className="space-y-4">
                {question.coreRequirements.map((req, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="text-sm flex gap-4 items-start group"
                  >
                    <div className="w-6 h-6 rounded-lg bg-muted text-muted-foreground flex items-center justify-center flex-shrink-0 text-[10px] font-black group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {i + 1}
                    </div>
                    <span className="text-foreground/80 font-medium leading-relaxed">{req}</span>
                  </motion.li>
                ))}
              </ul>
            </section>

            {/* High Level Requirements */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Target className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">High Level Requirements</h3>
              </div>
              <div className="space-y-3">
                {question.highLevelRequirements.map((req, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + 0.1 * i }}
                    className="p-4 bg-muted/50 rounded-2xl border border-border/50 text-xs font-bold flex items-center gap-3 group hover:border-primary/30 transition-colors"
                  >
                    <ArrowRight className="w-3 h-3 text-primary group-hover:translate-x-1 transition-transform" />
                    {req}
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Technical Requirements */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Wrench className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Technical Requirements</h3>
              </div>
              <div className="space-y-3">
                {question.microRequirements.map((req, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + 0.1 * i }}
                    className="p-4 bg-muted/50 rounded-2xl border border-border/50 text-xs font-bold flex items-center gap-3 group hover:border-primary/30 transition-colors"
                  >
                    <ArrowRight className="w-3 h-3 text-primary group-hover:translate-x-1 transition-transform" />
                    {req}
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Learning Outcomes */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Lightbulb className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Learning Outcomes</h3>
              </div>
              <ul className="space-y-2">
                {question.learningOutcomes.map((outcome, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground/70 font-medium">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Tech Stack & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/30 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-xs font-black uppercase tracking-widest text-foreground">Time</span>
                </div>
                <p className="text-sm font-bold text-foreground">{question.estimatedTime}</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <Code className="w-4 h-4 text-primary" />
                  <span className="text-xs font-black uppercase tracking-widest text-foreground">Stack</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {question.techStack.slice(0, 2).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] rounded border border-primary/20 font-bold"
                    >
                      {tech}
                    </span>
                  ))}
                  {question.techStack.length > 2 && (
                    <span className="px-2 py-0.5 bg-muted text-muted-foreground text-[10px] rounded border border-border font-bold">
                      +{question.techStack.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Architect's Tip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="p-6 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-3xl relative overflow-hidden group"
            >
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-24 h-24 text-primary" />
              </div>
              <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-3">Architect's Tip</h4>
              <p className="text-[11px] text-foreground/70 leading-relaxed font-medium">
                Start with the core components and data flow. Consider scalability, consistency, and fault tolerance from the beginning.
              </p>
            </motion.div>
          </div>
        </aside>

        {/* Right Panel: Canvas */}
        <div className="flex-grow relative bg-background">
          <DesignCanvas />

          {/* Analysis Result Overlay */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ y: 100, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 100, opacity: 0, scale: 0.9 }}
                className="absolute bottom-8 right-8 w-[400px] bg-card/95 backdrop-blur-2xl border border-border shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] rounded-3xl p-6 z-50"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={clsx(
                    "p-3 rounded-2xl shadow-inner",
                    result.status === 'Pass' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                  )}>
                    {result.status === 'Pass' ? <CheckCircle className="w-7 h-7" /> : <AlertCircle className="w-7 h-7" />}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-black text-xl leading-none tracking-tight">
                      {result.status === 'Pass' ? 'Design Approved' : 'Critique Received'}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-grow h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${result.score}%` }}
                          className={clsx(
                            "h-full rounded-full",
                            result.score > 70 ? "bg-green-500" : result.score > 40 ? "bg-yellow-500" : "bg-red-500"
                          )}
                        />
                      </div>
                      <span className="text-[10px] font-black font-mono">{result.score}%</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-6 leading-relaxed font-medium italic">
                  "{result.feedback}"
                </p>

                {result.suggestions && result.suggestions.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-primary" />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Architect's Suggestions</p>
                    </div>
                    <ul className="space-y-2">
                      {result.suggestions.map((s, i) => (
                        <motion.li
                          key={i}
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.2 + i * 0.1 }}
                          className="text-xs flex gap-3 items-start bg-muted/30 p-2.5 rounded-xl border border-border/50 group hover:border-primary/30 transition-colors"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 group-hover:scale-125 transition-transform" />
                          <span className="font-medium">{s}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={() => setResult(null)}
                  className="w-full mt-6 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dismiss Analysis
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}