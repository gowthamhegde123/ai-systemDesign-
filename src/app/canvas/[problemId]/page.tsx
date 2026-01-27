'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DesignCanvas } from '@/components/canvas/DesignCanvas';
import { useStore } from '@/lib/hooks/useStore';
import { AIAnalysisResult } from '@/types';
import { PROBLEMS } from '@/lib/data/problems';
import {
    CheckCircle, AlertCircle, Loader2,
    ChevronLeft, Send,
    Sparkles, BrainCircuit,
    ArrowRight, Info, BookOpen, MessageSquareText, X, Map, Lightbulb
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { getSolution, ProblemSolution } from '@/lib/data/solutions';

export default function CanvasPage() {
    const params = useParams();
    const router = useRouter();
    const problemId = params.problemId as string;

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

    useEffect(() => {
        const problem = PROBLEMS.find(p => p.id === problemId);
        if (problem) {
            setProblem(problem);
        }
    }, [problemId, setProblem]);

    useEffect(() => {
        if (problemId) {
            const sol = getSolution(problemId as string);
            setSolution(sol || null);
        }
    }, [problemId]);

    const handleAnalyze = async () => {
        if (!currentProblem) return;

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

    const handleAskAI = async () => {
        if (!currentProblem) return;

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
        if (!isPassed) return;
        setSubmitted(true);
        alert('Congratulations! Your design has been submitted successfully.');
    };

    if (!currentProblem) {
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
                        onClick={() => router.push('/')}
                        className="p-2 hover:bg-muted rounded-lg transition-colors border border-border"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </motion.button>
                    <div className="w-px h-6 bg-border mx-2" />
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-sm font-black tracking-tight truncate max-w-[300px]">{currentProblem.title}</h1>
                            <div className={clsx(
                                "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest",
                                currentProblem.difficulty === 'Easy' ? "bg-green-500/10 text-green-500" :
                                    currentProblem.difficulty === 'Medium' ? "bg-yellow-500/10 text-yellow-500" :
                                        "bg-red-500/10 text-red-500"
                            )}>
                                {currentProblem.difficulty}
                            </div>
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
                        onClick={handleAskAI}
                        disabled={askingAI}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 rounded-lg disabled:opacity-50 transition-all text-xs font-bold border border-indigo-500/20 shadow-sm"
                    >
                        {askingAI ? <Loader2 className="w-3 h-3 animate-spin" /> : <MessageSquareText className="w-3 h-3" />}
                        Ask AI for Hint
                    </motion.button>
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
                {/* Left Panel: Problem Details (LeetCode Style) */}
                <aside className="w-[450px] border-r border-border bg-card flex flex-col overflow-hidden z-20 shadow-xl">
                    <div className="flex items-center gap-2 px-6 py-4 border-b border-border bg-muted/20">
                        <div className="p-1.5 bg-primary/10 rounded-md">
                            <Info className="w-4 h-4 text-primary" />
                        </div>
                        <h2 className="text-xs font-black uppercase tracking-widest text-foreground">Problem Description</h2>
                    </div>

                    <div className="flex-grow overflow-y-auto p-8 space-y-10 custom-scrollbar">
                        <section>
                            <h3 className="text-2xl font-black mb-4 tracking-tight">{currentProblem.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                {currentProblem.description}
                            </p>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <History className="w-4 h-4 text-primary" />
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Functional Requirements</h3>
                            </div>
                            <ul className="space-y-4">
                                {currentProblem.requirements.map((r, i) => (
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
                                        <span className="text-foreground/80 font-medium leading-relaxed">{r}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Maximize className="w-4 h-4 text-primary" />
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Constraints & Scale</h3>
                            </div>
                            <div className="space-y-3">
                                {currentProblem.constraints.map((c, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.3 + 0.1 * i }}
                                        className="p-4 bg-muted/50 rounded-2xl border border-border/50 text-xs font-bold flex items-center gap-3 group hover:border-primary/30 transition-colors"
                                    >
                                        <ArrowRight className="w-3 h-3 text-primary group-hover:translate-x-1 transition-transform" />
                                        {c}
                                    </motion.div>
                                ))}
                            </div>
                        </section>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="p-6 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-3xl relative overflow-hidden group"
                        >
                            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                                <BrainCircuit className="w-24 h-24 text-primary" />
                            </div>
                            <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-3">Architect&apos;s Tip</h4>
                            <p className="text-[11px] text-foreground/70 leading-relaxed font-medium">
                                For high-throughput systems, consider using a <strong>Message Queue</strong> to decouple services and <strong>Caching</strong> to reduce database load.
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
                                    &ldquo;{result.feedback}&rdquo;
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
                </div>
            </div>
        </div>
    );
}
