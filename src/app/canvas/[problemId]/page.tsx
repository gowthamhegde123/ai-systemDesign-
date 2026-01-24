'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DesignCanvas } from '@/components/canvas/DesignCanvas';
import { useStore } from '@/lib/hooks/useStore';
import { AIAnalysisResult } from '@/types';
import { PROBLEMS } from '@/lib/data/problems';
import {
    Play, CheckCircle, AlertCircle, Loader2,
    ChevronLeft, Send, Search as SearchIcon,
    Trophy, Sparkles, BrainCircuit, History,
    ArrowRight, Info, Maximize
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

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
    const [searchQuery, setSearchQuery] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
    const [showRequirements, setShowRequirements] = useState(true);

    useEffect(() => {
        const problem = PROBLEMS.find(p => p.id === problemId);
        if (problem) {
            setProblem(problem);
        }
    }, [problemId, setProblem]);

    const filteredProblems = useMemo(() => {
        return PROBLEMS.filter(p => {
            const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesDifficulty = !difficultyFilter || p.difficulty === difficultyFilter;
            return matchesSearch && matchesDifficulty;
        });
    }, [searchQuery, difficultyFilter]);

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
        <div className={clsx("flex h-screen bg-background overflow-hidden transition-colors duration-500", theme === 'dark' ? 'dark' : '')}>
            {/* Left Sidebar: Problem List */}
            <aside className="w-80 border-r border-border bg-card flex flex-col shadow-2xl z-30">
                <div className="p-6 border-b border-border space-y-4 bg-muted/30">
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold text-xl flex items-center gap-3">
                            <div className="p-2 bg-yellow-500/10 rounded-lg">
                                <Trophy className="w-5 h-5 text-yellow-500" />
                            </div>
                            Challenges
                        </h2>
                    </div>
                    <div className="relative group">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search problems..."
                            className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        {['Easy', 'Medium', 'Hard'].map(d => (
                            <button
                                key={d}
                                onClick={() => setDifficultyFilter(difficultyFilter === d ? null : d)}
                                className={clsx(
                                    "flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg border transition-all",
                                    difficultyFilter === d
                                        ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                                        : "bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                                )}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex-grow overflow-y-auto custom-scrollbar">
                    <AnimatePresence mode="popLayout">
                        {filteredProblems.map((p, idx) => (
                            <motion.button
                                key={p.id}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                onClick={() => router.push(`/canvas/${p.id}`)}
                                className={clsx(
                                    "w-full text-left p-5 border-b border-border hover:bg-muted/50 transition-all relative group",
                                    p.id === problemId && "bg-primary/5"
                                )}
                            >
                                {p.id === problemId && (
                                    <motion.div
                                        layoutId="active-problem"
                                        className="absolute left-0 top-0 bottom-0 w-1 bg-primary"
                                    />
                                )}
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-sm group-hover:text-primary transition-colors">{p.title}</span>
                                    <span className={clsx(
                                        "text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter",
                                        p.difficulty === 'Easy' ? "bg-green-500/10 text-green-500" :
                                            p.difficulty === 'Medium' ? "bg-yellow-500/10 text-yellow-500" :
                                                "bg-red-500/10 text-red-500"
                                    )}>
                                        {p.difficulty}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{p.description}</p>
                            </motion.button>
                        ))}
                    </AnimatePresence>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-grow flex flex-col min-w-0 relative">
                {/* Header */}
                <header className="h-20 border-b border-border flex items-center justify-between px-8 bg-card/50 backdrop-blur-xl z-20">
                    <div className="flex items-center gap-6">
                        <motion.button
                            whileHover={{ scale: 1.1, x: -2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => router.push('/')}
                            className="p-2.5 hover:bg-muted rounded-xl transition-colors border border-border"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </motion.button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-xl font-black tracking-tight truncate max-w-[400px]">{currentProblem.title}</h1>
                                <div className={clsx(
                                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest",
                                    currentProblem.difficulty === 'Easy' ? "bg-green-500/10 text-green-500" :
                                        currentProblem.difficulty === 'Medium' ? "bg-yellow-500/10 text-yellow-500" :
                                            "bg-red-500/10 text-red-500"
                                )}>
                                    {currentProblem.difficulty}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <Sparkles className="w-3 h-3 text-primary" />
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                    {currentProblem.category || 'System Design'} • {currentProblem.constraints[0]}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleAnalyze}
                            disabled={analyzing}
                            className="flex items-center gap-2 px-5 py-2.5 bg-muted hover:bg-muted/80 text-foreground rounded-xl disabled:opacity-50 transition-all text-sm font-bold border border-border shadow-sm"
                        >
                            {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <BrainCircuit className="w-4 h-4 text-primary" />}
                            AI Analysis
                        </motion.button>
                        <motion.button
                            whileHover={isPassed ? { scale: 1.05 } : {}}
                            whileTap={isPassed ? { scale: 0.95 } : {}}
                            onClick={handleSubmit}
                            disabled={!isPassed || isSubmitted}
                            className={clsx(
                                "flex items-center gap-2 px-8 py-2.5 rounded-xl transition-all text-sm font-black shadow-2xl uppercase tracking-widest",
                                isPassed
                                    ? "bg-primary text-primary-foreground shadow-primary/30"
                                    : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                            )}
                        >
                            <Send className="w-4 h-4" />
                            {isSubmitted ? 'Submitted' : 'Submit'}
                        </motion.button>
                    </div>
                </header>

                {/* Canvas Area */}
                <div className="flex-grow flex overflow-hidden relative">
                    <div className="flex-grow relative">
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

                    {/* Right Sidebar: Requirements Toggle */}
                    <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
                        <button
                            onClick={() => setShowRequirements(!showRequirements)}
                            className={clsx(
                                "p-3 rounded-2xl shadow-xl border border-border backdrop-blur-md transition-all",
                                showRequirements ? "bg-primary text-primary-foreground" : "bg-card text-foreground hover:bg-muted"
                            )}
                        >
                            <Info className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Requirements Panel */}
                    <AnimatePresence>
                        {showRequirements && (
                            <motion.aside
                                initial={{ x: 400 }}
                                animate={{ x: 0 }}
                                exit={{ x: 400 }}
                                className="w-[350px] border-l border-border bg-card/80 backdrop-blur-2xl p-8 overflow-y-auto z-10 shadow-[-20px_0_40px_rgba(0,0,0,0.1)]"
                            >
                                <div className="space-y-10">
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
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
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
                                        <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-3">Architect's Tip</h4>
                                        <p className="text-[11px] text-foreground/70 leading-relaxed font-medium">
                                            For high-throughput systems, consider using a **Message Queue** to decouple services and **Caching** to reduce database load.
                                        </p>
                                    </motion.div>
                                </div>
                            </motion.aside>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
