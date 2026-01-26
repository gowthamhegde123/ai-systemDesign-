'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DesignCanvas } from '@/components/canvas/DesignCanvas';
import { useStore } from '@/lib/hooks/useStore';
import { useUserProgress } from '@/lib/hooks/useUserProgress';
import { SystemDesignQuestion } from '@/lib/data/system-design-questions';
import { AIAnalysisResult } from '@/types';
import {
  CheckCircle2, AlertCircle, Loader2,
  ChevronLeft, Send, Search as SearchIcon,
  Trophy, Sparkles, BrainCircuit, History,
  ArrowRight, Info, Maximize, Clock, Users, Code, Target, Lightbulb, Wrench, MessageSquareText,
  Timer, Rocket, Star, PartyPopper, Zap, BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { getSolution, ProblemSolution } from '@/lib/data/solutions';
import { BookOpen, Map, X } from 'lucide-react';

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
  const [solution, setSolution] = useState<ProblemSolution | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [askingAI, setAskingAI] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [startTime] = useState(Date.now());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [performanceResults, setPerformanceResults] = useState<{
    totalScore: number;
    timeLabel: string;
    designScore: number;
    efficiencyScore: number;
    optimizationScore: number;
  } | null>(null);

  useEffect(() => {
    if (params.id) {
      const sol = getSolution(params.id as string);
      setSolution(sol || null);
    }
  }, [params.id]);

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

      if (!response.ok) {
        setResult({
          status: 'Fail',
          feedback: `Analysis Error: ${data.message || data.error || 'Server error'}`,
          score: 0,
          suggestions: ['Check your API key in .env.local', 'Verify your internet connection']
        });
        return;
      }

      setResult(data);
      if (data.status === 'Pass') {
        setPassed(true);
      } else {
        setPassed(false);
      }
    } catch (error: unknown) {
      console.error('Analysis failed', error);
      const message = error instanceof Error ? error.message : 'The AI service is currently unavailable.';
      setResult({
        status: 'Fail',
        feedback: `Connection Error: ${message}`,
        score: 0,
        suggestions: ['Try again in a few moments']
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAskAI = async () => {
    if (!currentProblem || !question) return;

    setAskingAI(true);
    setAiHint(null);

    try {
      const response = await fetch('/api/ai-evaluator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          design: { nodes, edges },
          problem: currentProblem,
          type: 'hint'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to get AI hint');
      }

      if (data.feedback) {
        setAiHint(data.feedback);
      } else if (typeof data === 'string') {
        setAiHint(data);
      } else {
        setAiHint("I've analyzed your design, but I'm struggling to put the hint into words. Try adding another component!");
      }
    } catch (error: unknown) {
      console.error('AI Hint failed', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      setAiHint(`I encountered an error: ${message}. Please check your API key and connection.`);
    } finally {
      setAskingAI(false);
    }
  };

  const handleSubmit = async () => {
    if (!isPassed || !question) return;

    const endTime = Date.now();
    const durationSeconds = Math.floor((endTime - startTime) / 1000);

    // Heuristic Score Calculation
    // 1. Design Quality (40 points) - Nodes and Edges density
    const designRawWeight = (nodes.length * 3) + (edges.length * 2);
    const designScore = Math.min(40, designRawWeight);

    // 2. Optimization Score (30 points) - Specific optimization nodes
    const optimizationNodeTypes = ['REDIS', 'CDN', 'LB', 'API_GATEWAY', 'KAFKA', 'MONITORING', 'WAF'];
    const optCount = nodes.filter(n => optimizationNodeTypes.includes(n.data.type)).length;
    const optimizationScore = Math.min(30, optCount * 7.5);

    // 3. Efficiency/Time (30 points)
    const targetSeconds = 1800; // 30 mins
    let timeFactor = 1.0;
    if (durationSeconds < targetSeconds) timeFactor = 1.0;
    else if (durationSeconds < targetSeconds * 2) timeFactor = 0.8;
    else timeFactor = 0.6;

    const efficiencyScore = Math.round(30 * timeFactor);

    const totalScore = Math.round(designScore + optimizationScore + efficiencyScore);

    setPerformanceResults({
      totalScore,
      timeLabel: `${Math.floor(durationSeconds / 60)}m ${durationSeconds % 60}s`,
      designScore: Math.round(designScore),
      efficiencyScore,
      optimizationScore: Math.round(optimizationScore)
    });

    // Mark question as solved
    const success = await markQuestionSolved(question.id);

    if (success) {
      setSubmitted(true);
      setShowCompletionModal(true);
    } else {
      setShowCompletionModal(true);
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
          {solution && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowSolution(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-all text-xs font-bold border border-primary/20 shadow-sm"
            >
              <BookOpen className="w-3 h-3" />
              View Solution
            </motion.button>
          )}
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
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAskAI}
            disabled={askingAI}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 rounded-lg disabled:opacity-50 transition-all text-xs font-bold border border-indigo-500/20 shadow-sm"
          >
            {askingAI ? <Loader2 className="w-3 h-3 animate-spin" /> : <MessageSquareText className="w-3 h-3" />}
            Ask AI for Hint
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
              <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-3">Architect&apos;s Tip</h4>
              <p className="text-[11px] text-foreground/70 leading-relaxed font-medium">
                Start with the core components and data flow. Consider scalability, consistency, and fault tolerance from the beginning.
              </p>
            </motion.div>
          </div>
        </aside>

        {/* Right Panel: Canvas */}
        <div className="flex-grow relative bg-background">
          <DesignCanvas />

          {/* Guided Solution Overlay */}
          <AnimatePresence>
            {showSolution && solution && (
              <motion.div
                initial={{ x: 500, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 500, opacity: 0 }}
                className="absolute top-4 right-4 bottom-4 w-[400px] bg-card/95 backdrop-blur-2xl border border-border shadow-2xl rounded-3xl flex flex-col z-[60] overflow-hidden"
              >
                <div className="p-6 border-b border-border flex items-center justify-between bg-primary/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Map className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Guided Solution</h3>
                      <p className="text-[10px] text-muted-foreground font-bold">Step {currentStep + 1} of {solution.steps.length}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowSolution(false)}
                    className="p-2 hover:bg-muted rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                <div className="flex-grow overflow-y-auto p-8 space-y-8 custom-scrollbar">
                  <motion.div
                    key={currentStep}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                  >
                    <div className="mb-6">
                      <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Step {currentStep + 1}</div>
                      <h4 className="text-xl font-black tracking-tight mb-4">{solution.steps[currentStep].title}</h4>
                      <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                        {solution.steps[currentStep].description}
                      </p>
                    </div>

                    <div className="p-6 bg-muted/50 rounded-2xl border border-border/50 relative overflow-hidden group">
                      <div className="absolute -right-2 -top-2 opacity-5 group-hover:scale-110 transition-transform">
                        <Lightbulb className="w-16 h-16 text-primary" />
                      </div>
                      <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-3">Why this specifically?</div>
                      <p className="text-xs text-muted-foreground leading-relaxed font-medium italic">
                        &quot;{solution.steps[currentStep].reasoning}&quot;
                      </p>
                    </div>
                  </motion.div>
                </div>

                <div className="p-6 border-t border-border bg-card/50 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                    disabled={currentStep === 0}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground disabled:opacity-30 flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                  <div className="flex gap-1">
                    {solution.steps.map((_, i) => (
                      <div
                        key={i}
                        className={clsx(
                          "w-1.5 h-1.5 rounded-full transition-all duration-300",
                          i === currentStep ? "bg-primary w-4" : "bg-muted"
                        )}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      if (currentStep < solution.steps.length - 1) {
                        setCurrentStep(prev => prev + 1);
                      } else {
                        setShowSolution(false);
                      }
                    }}
                    className="px-4 py-2 bg-primary text-primary-foreground text-xs font-black rounded-xl uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center gap-2"
                  >
                    {currentStep < solution.steps.length - 1 ? 'Next' : 'Finish'}
                    {currentStep < solution.steps.length - 1 && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Hint Overlay */}
          <AnimatePresence>
            {aiHint && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="absolute top-24 right-8 w-[350px] bg-indigo-500/10 backdrop-blur-xl border border-indigo-500/20 shadow-2xl rounded-2xl p-6 z-[55]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-500/20 rounded-lg">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-indigo-500">AI Architect Hint</h3>
                  <button onClick={() => setAiHint(null)} className="ml-auto p-1.5 hover:bg-indigo-500/10 rounded-full transition-colors">
                    <X className="w-3 h-3 text-indigo-500" />
                  </button>
                </div>
                <div className="space-y-3">
                  {aiHint.split('\n').filter(line => line.trim()).map((line, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                      <p className="text-sm text-foreground/90 leading-relaxed font-medium">
                        {line.replace(/^[•\s*-]+/, '').trim()}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-indigo-500/10 text-[10px] text-indigo-500/70 font-bold italic">
                  &quot;Keep designing, you&apos;re getting there!&quot;
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Completion Celebration Modal */}
          <AnimatePresence>
            {showCompletionModal && performanceResults && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                  onClick={() => setShowCompletionModal(false)}
                />

                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  className="relative w-full max-w-xl bg-card border border-border shadow-2xl rounded-[2.5rem] overflow-hidden"
                >
                  {/* Top Header Section */}
                  <div className="bg-primary/10 p-10 flex flex-col items-center text-center relative">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6"
                    >
                      <Trophy className="w-10 h-10 text-primary" />
                    </motion.div>
                    <h2 className="text-3xl font-black tracking-tighter mb-2">Architect Milestone!</h2>
                    <p className="text-muted-foreground font-medium">Your design for <span className="text-foreground font-bold">{question?.title}</span> has been certified.</p>

                    {/* Floating Icons for decoration */}
                    <div className="absolute top-10 left-10 opacity-20"><Zap className="w-8 h-8 text-yellow-500" /></div>
                    <div className="absolute bottom-10 right-10 opacity-20"><Star className="w-8 h-8 text-primary" /></div>
                  </div>

                  <div className="p-10 space-y-8">
                    {/* Score Ring */}
                    <div className="flex flex-col items-center">
                      <div className="relative w-40 h-40 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90">
                          <circle
                            cx="80" cy="80" r="70"
                            fill="transparent"
                            stroke="currentColor"
                            strokeWidth="12"
                            className="text-muted/20"
                          />
                          <motion.circle
                            cx="80" cy="80" r="70"
                            fill="transparent"
                            stroke="currentColor"
                            strokeWidth="12"
                            strokeDasharray={440}
                            initial={{ strokeDashoffset: 440 }}
                            animate={{ strokeDashoffset: 440 - (440 * performanceResults.totalScore) / 100 }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                            className="text-primary"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-5xl font-black tracking-tighter">{performanceResults.totalScore}</span>
                          <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Mastery Score</span>
                        </div>
                      </div>
                    </div>

                    {/* Stats Breakdown */}
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: 'Complexity', value: performanceResults.designScore, max: 40, icon: BarChart3, color: 'text-blue-500' },
                        { label: 'Optimization', value: performanceResults.optimizationScore, max: 30, icon: Rocket, color: 'text-purple-500' },
                        { label: 'Time', value: performanceResults.timeLabel, total: true, icon: Timer, color: 'text-orange-500' }
                      ].map((stat, i) => (
                        <div key={i} className="bg-muted/50 p-4 rounded-3xl border border-border/50 text-center">
                          <stat.icon className={clsx("w-5 h-5 mx-auto mb-2", stat.color)} />
                          <div className="text-xs font-black tracking-widest text-muted-foreground uppercase mb-1">{stat.label}</div>
                          <div className="text-sm font-bold">
                            {stat.total ? stat.value : `${stat.value}/${stat.max}`}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
                      <div className="flex items-center gap-3 mb-2">
                        <PartyPopper className="w-4 h-4 text-primary" />
                        <span className="text-xs font-black uppercase tracking-widest text-primary">Architect&apos;s Review</span>
                      </div>
                      <p className="text-xs text-foreground/80 leading-relaxed font-medium transition-all">
                        {performanceResults.totalScore > 80
                          ? "Exceptional work! You've balanced scalability, caching, and infrastructure brilliantly. This is a production-grade blueprint."
                          : performanceResults.totalScore > 60
                            ? "Strong design. You have a solid grasp of the core flow. Adding more failover mechanisms or observability would take this to the next level."
                            : "Successful submission. You managed to solve the functional requirements. Continue exploring distributed patterns to improve the score!"}
                      </p>
                    </div>

                    <button
                      onClick={() => setShowCompletionModal(false)}
                      className="w-full py-4 bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      Continue Training
                    </button>
                  </div>
                </motion.div>

                {/* Confetti (CSS-based) - simplified for this implementation */}
                <div className="pointer-events-none fixed inset-0 z-[110] overflow-hidden opacity-50">
                  {/* Decorative sparkles */}
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: -20, x: Math.random() * 100 + "%", opacity: 0 }}
                      animate={{ y: "100vh", opacity: [0, 1, 0] }}
                      transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 5 }}
                      className="absolute w-2 h-2 rounded-full bg-primary"
                    />
                  ))}
                </div>
              </div>
            )}
          </AnimatePresence>

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
                    {result.status === 'Pass' ? <CheckCircle2 className="w-7 h-7" /> : <AlertCircle className="w-7 h-7" />}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-black text-xl leading-none tracking-tight">
                      {result.status === 'Pass' ? 'Design Approved' : 'Critique Received'}
                    </h3>
                    <div className="mt-2">
                      <span className={clsx(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                        result.rating === 'Excellent' ? "bg-green-500/10 text-green-500 border-green-500/20" :
                          result.rating === 'Improving' ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                            "bg-red-500/10 text-red-500 border-red-500/20"
                      )}>
                        {result.rating || (result.score > 70 ? 'Excellent' : result.score > 40 ? 'Improving' : 'Incomplete')}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-6 leading-relaxed font-medium italic">
                  &quot;{result.feedback}&quot;
                </p>

                {result.suggestions && result.suggestions.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-primary" />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Architect&apos;s Suggestions</p>
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