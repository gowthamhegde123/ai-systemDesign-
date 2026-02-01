'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Target,
  TrendingUp,
  CheckCircle2,
  Circle,
  Lock,
  ArrowRight,
  AlertCircle,
  Calendar,
  Flame,
  Award,
  ChevronRight,
  Brain,
  Zap
} from 'lucide-react';
import Link from 'next/link';

interface RecommendedProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  estimatedTime: string;
  points: number;
  reason: string;
  isLocked?: boolean;
}

interface WeakArea {
  category: string;
  score: number;
  problemsSolved: number;
  totalProblems: number;
  improvement: string;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  deadline: string;
  status: 'active' | 'completed' | 'overdue';
}

interface LearningPathProps {
  problemsSolved: number;
  className?: string;
}

export function LearningPath({ problemsSolved, className = '' }: LearningPathProps) {
  const [activeTab, setActiveTab] = useState<'recommended' | 'weakAreas' | 'goals'>('recommended');

  // Mock data - in production, fetch from API based on user's history
  const recommendedProblems: RecommendedProblem[] = [
    {
      id: '1',
      title: 'Design a URL Shortener',
      difficulty: 'Easy',
      category: 'System Design Basics',
      estimatedTime: '45 min',
      points: 50,
      reason: 'Great starting point for learning system design fundamentals',
      isLocked: false,
    },
    {
      id: '2',
      title: 'Design a Rate Limiter',
      difficulty: 'Medium',
      category: 'Infrastructure',
      estimatedTime: '1.5 hrs',
      points: 100,
      reason: 'Build on your understanding of distributed systems',
      isLocked: problemsSolved < 3,
    },
    {
      id: '3',
      title: 'Design Instagram',
      difficulty: 'Hard',
      category: 'Social Media',
      estimatedTime: '3 hrs',
      points: 200,
      reason: 'Challenge yourself with a complex real-world system',
      isLocked: problemsSolved < 10,
    },
  ];

  const weakAreas: WeakArea[] = [
    {
      category: 'Database Design',
      score: 45,
      problemsSolved: 2,
      totalProblems: 15,
      improvement: 'Focus on sharding and replication strategies',
    },
    {
      category: 'Caching Strategies',
      score: 60,
      problemsSolved: 3,
      totalProblems: 12,
      improvement: 'Practice cache invalidation patterns',
    },
    {
      category: 'Load Balancing',
      score: 72,
      problemsSolved: 5,
      totalProblems: 10,
      improvement: 'Good progress! Try advanced load balancing algorithms',
    },
  ];

  const goals: Goal[] = [
    {
      id: '1',
      title: 'Complete 10 Easy Problems',
      description: 'Build a strong foundation in system design basics',
      progress: problemsSolved >= 10 ? 10 : problemsSolved,
      target: 10,
      deadline: '2024-03-15',
      status: problemsSolved >= 10 ? 'completed' : 'active',
    },
    {
      id: '2',
      title: 'Master Database Design',
      description: 'Complete all database-related problems',
      progress: 2,
      target: 15,
      deadline: '2024-04-01',
      status: 'active',
    },
    {
      id: '3',
      title: '30-Day Streak',
      description: 'Solve at least one problem every day for 30 days',
      progress: 5,
      target: 30,
      deadline: '2024-03-30',
      status: 'active',
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-600 bg-green-500/10 border border-green-500/20';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-500/10 border border-yellow-500/20';
      case 'Hard':
        return 'text-red-600 bg-red-500/10 border border-red-500/20';
      default:
        return 'text-muted-foreground bg-muted border border-border';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const tabs = [
    { id: 'recommended', label: 'Recommended', icon: <Target className="w-4 h-4" /> },
    { id: 'weakAreas', label: 'Weak Areas', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'goals', label: 'Goals', icon: <Award className="w-4 h-4" /> },
  ];

  return (
    <div className={`bg-card rounded-2xl shadow-sm border border-border overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <Brain className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Learning Path</h3>
              <p className="text-xs text-muted-foreground">Personalized recommendations</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === tab.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Recommended Problems */}
        {activeTab === 'recommended' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {problemsSolved === 0 && (
              <div className="mb-3 p-3 bg-primary/5 border border-primary/20 rounded-xl">
                <div className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-foreground mb-0.5">Start Your Journey!</h4>
                    <p className="text-xs text-muted-foreground">
                      Complete your first problem to unlock personalized recommendations.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {recommendedProblems.map((problem, index) => (
              <motion.div
                key={problem.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-xl border transition-all ${
                  problem.isLocked
                    ? 'border-border bg-muted/30 opacity-60'
                    : 'border-border hover:border-primary/50 hover:shadow-md cursor-pointer bg-card'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {problem.isLocked ? (
                        <Lock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      )}
                      <h4 className="font-bold text-sm text-foreground truncate">{problem.title}</h4>
                      <span
                        className={`px-1.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider flex-shrink-0 ${getDifficultyColor(
                          problem.difficulty
                        )}`}
                      >
                        {problem.difficulty}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{problem.reason}</p>

                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {problem.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {problem.estimatedTime}
                      </span>
                      <span className="flex items-center gap-1 text-primary font-bold">
                        <Award className="w-3 h-3" />
                        +{problem.points}
                      </span>
                    </div>
                  </div>

                  {!problem.isLocked && (
                    <Link
                      href={`/canvas/${problem.id}`}
                      className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-xs font-bold flex items-center gap-1 flex-shrink-0"
                    >
                      Start
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}

                  {problem.isLocked && (
                    <div className="px-3 py-1.5 bg-muted text-muted-foreground rounded-lg text-xs font-bold flex-shrink-0">
                      Locked
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Weak Areas */}
        {activeTab === 'weakAreas' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {problemsSolved === 0 ? (
              <div className="text-center py-6">
                <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                <h4 className="font-bold text-sm text-foreground mb-1">No Data Yet</h4>
                <p className="text-xs text-muted-foreground">
                  Solve problems to identify areas for improvement
                </p>
              </div>
            ) : (
              weakAreas.map((area, index) => (
                <motion.div
                  key={area.category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-xl border border-border hover:border-primary/50 transition-all bg-card"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-foreground mb-0.5">{area.category}</h4>
                      <p className="text-xs text-muted-foreground">{area.improvement}</p>
                    </div>
                    <div className={`text-xl font-black ${getScoreColor(area.score)}`}>
                      {area.score}%
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                    <span>
                      {area.problemsSolved} / {area.totalProblems} solved
                    </span>
                    <span className="font-bold">{Math.round((area.problemsSolved / area.totalProblems) * 100)}%</span>
                  </div>

                  <div className="w-full bg-muted rounded-full h-1.5 mb-2">
                    <motion.div
                      className={`h-1.5 rounded-full ${
                        area.score >= 80
                          ? 'bg-green-500'
                          : area.score >= 60
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(area.problemsSolved / area.totalProblems) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>

                  <Link
                    href={`/questions?category=${encodeURIComponent(area.category)}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80"
                  >
                    Practice {area.category}
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {/* Goals */}
        {activeTab === 'goals' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {goals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-xl border ${
                  goal.status === 'completed'
                    ? 'border-green-500/30 bg-green-500/5'
                    : goal.status === 'overdue'
                    ? 'border-red-500/30 bg-red-500/5'
                    : 'border-border bg-card'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-2 flex-1">
                    {goal.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-foreground mb-0.5">{goal.title}</h4>
                      <p className="text-xs text-muted-foreground">{goal.description}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1 flex-shrink-0">
                    <Calendar className="w-3 h-3" />
                    {new Date(goal.deadline).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Progress</span>
                  <span className="font-bold text-foreground">
                    {goal.progress} / {goal.target}
                  </span>
                </div>

                <div className="w-full bg-muted rounded-full h-1.5">
                  <motion.div
                    className={`h-1.5 rounded-full ${
                      goal.status === 'completed'
                        ? 'bg-green-500'
                        : goal.status === 'overdue'
                        ? 'bg-red-500'
                        : 'bg-primary'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(goal.progress / goal.target) * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>

                {goal.status === 'completed' && (
                  <div className="mt-2 flex items-center gap-1 text-xs font-bold text-green-600">
                    <CheckCircle2 className="w-3 h-3" />
                    Completed!
                  </div>
                )}
              </motion.div>
            ))}

            <button className="w-full p-3 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 font-bold text-xs">
              <Target className="w-4 h-4" />
              Set New Goal
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
