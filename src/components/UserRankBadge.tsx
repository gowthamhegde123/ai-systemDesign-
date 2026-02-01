'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Award, Crown, Star, Zap, Circle } from 'lucide-react';

export interface UserRank {
  name: string;
  level: number;
  minPoints: number;
  maxPoints: number;
  color: string;
  icon: React.ReactNode;
  benefits: string[];
}

export const RANKS: UserRank[] = [
  {
    name: 'Unranked',
    level: 0,
    minPoints: 0,
    maxPoints: 0,
    color: 'from-gray-400 to-gray-500',
    icon: <Circle className="w-5 h-5" />,
    benefits: ['Complete your first problem to start earning rank'],
  },
  {
    name: 'Beginner',
    level: 1,
    minPoints: 1,
    maxPoints: 99,
    color: 'from-gray-500 to-gray-600',
    icon: <Star className="w-5 h-5" />,
    benefits: ['Access to basic problems', 'Community support'],
  },
  {
    name: 'Apprentice',
    level: 2,
    minPoints: 100,
    maxPoints: 299,
    color: 'from-green-500 to-emerald-600',
    icon: <Zap className="w-5 h-5" />,
    benefits: ['Unlock medium problems', 'Profile badge'],
  },
  {
    name: 'Architect',
    level: 3,
    minPoints: 300,
    maxPoints: 599,
    color: 'from-blue-500 to-cyan-600',
    icon: <Award className="w-5 h-5" />,
    benefits: ['Unlock hard problems', 'Priority support', 'Custom profile theme'],
  },
  {
    name: 'Senior Architect',
    level: 4,
    minPoints: 600,
    maxPoints: 999,
    color: 'from-purple-500 to-pink-600',
    icon: <Trophy className="w-5 h-5" />,
    benefits: ['Exclusive challenges', 'Mentor badge', 'Early feature access'],
  },
  {
    name: 'Principal Architect',
    level: 5,
    minPoints: 1000,
    maxPoints: 1999,
    color: 'from-orange-500 to-red-600',
    icon: <Crown className="w-5 h-5" />,
    benefits: ['Create custom problems', 'Featured profile', 'Direct support line'],
  },
  {
    name: 'Legend',
    level: 6,
    minPoints: 2000,
    maxPoints: Infinity,
    color: 'from-yellow-400 via-yellow-500 to-orange-500',
    icon: <Crown className="w-6 h-6" />,
    benefits: ['Hall of Fame', 'Lifetime Pro access', 'Exclusive community'],
  },
];

export function getRankByPoints(points: number): UserRank {
  return RANKS.find(rank => points >= rank.minPoints && points <= rank.maxPoints) || RANKS[0];
}

export function getNextRank(currentPoints: number): UserRank | null {
  const currentRank = getRankByPoints(currentPoints);
  const nextRankIndex = RANKS.findIndex(r => r.level === currentRank.level) + 1;
  return nextRankIndex < RANKS.length ? RANKS[nextRankIndex] : null;
}

export function getProgressToNextRank(points: number): number {
  const currentRank = getRankByPoints(points);
  const nextRank = getNextRank(points);
  
  if (!nextRank) return 100;
  
  const pointsInCurrentRank = points - currentRank.minPoints;
  const pointsNeededForNextRank = nextRank.minPoints - currentRank.minPoints;
  
  return Math.min(100, (pointsInCurrentRank / pointsNeededForNextRank) * 100);
}

interface UserRankBadgeProps {
  points: number;
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function UserRankBadge({ 
  points, 
  showProgress = false, 
  size = 'md',
  className = '' 
}: UserRankBadgeProps) {
  const rank = getRankByPoints(points);
  const nextRank = getNextRank(points);
  const progress = getProgressToNextRank(points);
  const pointsToNext = nextRank ? nextRank.minPoints - points : 0;

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <div className={className}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r ${rank.color} text-white font-black uppercase tracking-widest shadow-lg ${sizeClasses[size]}`}
      >
        {rank.icon}
        <span>{rank.name}</span>
        <span className="opacity-75">Lv.{rank.level}</span>
      </motion.div>

      {showProgress && nextRank && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Progress to {nextRank.name}
            </span>
            <span className="text-xs font-black text-primary">
              {pointsToNext} points to go
            </span>
          </div>
          
          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`absolute inset-y-0 left-0 bg-gradient-to-r ${rank.color} rounded-full`}
            />
          </div>

          <div className="mt-2 text-xs text-muted-foreground font-medium">
            {points} / {nextRank.minPoints} points
          </div>
        </motion.div>
      )}
    </div>
  );
}

interface RankCardProps {
  points: number;
  problemsSolved: number;
  globalRank?: number;
  className?: string;
}

export function RankCard({ points, problemsSolved, globalRank, className = '' }: RankCardProps) {
  const rank = getRankByPoints(points);
  const nextRank = getNextRank(points);
  const progress = getProgressToNextRank(points);
  const pointsToNext = nextRank ? nextRank.minPoints - points : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-8 rounded-3xl bg-card border border-border shadow-xl relative overflow-hidden ${className}`}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${rank.color} opacity-5`} />

      <div className="relative z-10">
        {/* Current Rank */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">
              Your Rank
            </div>
            <div className={`inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r ${rank.color} text-white shadow-lg`}>
              {rank.icon}
              <div>
                <div className="font-black text-xl">{rank.name}</div>
                <div className="text-xs opacity-75">Level {rank.level}</div>
              </div>
            </div>
          </div>

          {globalRank && (
            <div className="text-right">
              <div className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">
                Global Rank
              </div>
              <div className="text-3xl font-black text-primary">#{globalRank}</div>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-muted">
            <div className="text-2xl font-black text-primary mb-1">{points}</div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Total Points
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-muted">
            <div className="text-2xl font-black text-primary mb-1">{problemsSolved}</div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Problems Solved
            </div>
          </div>
        </div>

        {/* Progress to Next Rank */}
        {nextRank ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                Next: {nextRank.name}
              </div>
              <div className="flex items-center gap-2 text-xs font-black text-primary">
                <TrendingUp className="w-4 h-4" />
                {pointsToNext} points needed
              </div>
            </div>
            
            <div className="relative h-4 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                className={`absolute inset-y-0 left-0 bg-gradient-to-r ${rank.color} rounded-full`}
              />
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-foreground/80">
                {Math.round(progress)}%
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <Crown className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-sm font-black text-yellow-500">Maximum Rank Achieved!</div>
            <div className="text-xs text-muted-foreground mt-1">You're a legend! 🎉</div>
          </div>
        )}

        {/* Benefits */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">
            Your Benefits
          </div>
          <div className="space-y-2">
            {rank.benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                {benefit}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
