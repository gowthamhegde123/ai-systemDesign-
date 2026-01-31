'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Trophy, Target, Zap } from 'lucide-react';
import Link from 'next/link';

interface ProfileDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileDashboard({ isOpen, onClose }: ProfileDashboardProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Dashboard */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Quick Profile</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Profile Info */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">System Architect</h3>
              <p className="text-sm text-gray-600">@architect</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Target className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-800">12</div>
                <div className="text-xs text-gray-600">Solved</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Trophy className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-800">1,240</div>
                <div className="text-xs text-gray-600">Points</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Zap className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-800">7</div>
                <div className="text-xs text-gray-600">Streak</div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href="/profile"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <User size={16} />
                View Full Profile
              </Link>
              <Link
                href="/canvas"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Start Designing
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}