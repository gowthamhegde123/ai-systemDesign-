'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Camera, Shield, Award,
    CheckCircle2, Lock, Mail, X,
    LogOut, Settings, ChevronRight,
    Zap, BrainCircuit, Sparkles
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { clsx } from 'clsx';

interface ProfileDashboardProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ProfileDashboard({ isOpen, onClose }: ProfileDashboardProps) {
    const { data: session } = useSession();
    const [showOTPModal, setShowOTPModal] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [step, setStep] = useState<'otp' | 'new-password'>('otp');

    if (!session) return null;

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const verifyOTP = () => {
        if (otp.join('').length === 6) {
            setStep('new-password');
        }
    };

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
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                    />

                    {/* Dashboard Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-border z-[101] shadow-2xl overflow-y-auto custom-scrollbar"
                    >
                        <div className="p-8">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-12">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Settings className="w-5 h-5 text-primary" />
                                    </div>
                                    <h2 className="text-sm font-black uppercase tracking-widest">Account Dashboard</h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-muted rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Profile Identity */}
                            <div className="flex flex-col items-center text-center mb-12">
                                <div className="relative group mb-6">
                                    <div className="w-32 h-32 rounded-full border-4 border-primary/20 p-1 relative overflow-hidden">
                                        <div className="w-full h-full rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                            {session.user?.image ? (
                                                <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-12 h-12 text-muted-foreground" />
                                            )}
                                        </div>
                                    </div>
                                    <button className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                        <Camera className="w-6 h-6 text-white" />
                                        <span className="text-[10px] font-black uppercase text-white tracking-widest">Update</span>
                                    </button>
                                </div>
                                <h3 className="text-2xl font-black tracking-tight mb-2">{session.user?.name || 'Architect'}</h3>
                                <p className="text-sm text-muted-foreground font-medium max-w-[250px]">
                                    Senior System Architect specializing in distributed systems and high-throughput engines.
                                </p>
                            </div>

                            {/* Stats Section */}
                            <div className="grid grid-cols-2 gap-4 mb-12">
                                <div className="p-6 bg-muted/30 rounded-3xl border border-border/50 relative overflow-hidden group hover:border-primary/30 transition-colors">
                                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                                        <Award className="w-12 h-12 text-primary" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Solved Problems</p>
                                    <div className="flex items-end gap-2 mb-4">
                                        <span className="text-3xl font-black leading-none">42</span>
                                        <span className="text-xs font-bold text-muted-foreground mb-1">/ 150</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '28%' }}
                                            className="h-full bg-primary rounded-full"
                                        />
                                    </div>
                                </div>
                                <div className="p-6 bg-muted/30 rounded-3xl border border-border/50 relative overflow-hidden group hover:border-accent/30 transition-colors">
                                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                                        <Zap className="w-12 h-12 text-accent" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Current Rank</p>
                                    <div className="flex items-end gap-2">
                                        <span className="text-3xl font-black leading-none text-accent">Pro</span>
                                    </div>
                                    <p className="text-[10px] font-bold text-muted-foreground mt-4 uppercase tracking-widest">Top 5% of Users</p>
                                </div>
                            </div>

                            {/* Skills Section */}
                            <div className="mb-12">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-6 flex items-center gap-2">
                                    <Sparkles className="w-3 h-3 text-primary" />
                                    Technical Skills
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {['Distributed Systems', 'Microservices', 'Kafka', 'Redis', 'Kubernetes', 'System Design'].map((skill) => (
                                        <span
                                            key={skill}
                                            className="px-4 py-2 bg-muted/50 border border-border/50 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:border-primary/30 hover:text-primary transition-all cursor-default"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Security Actions */}
                            <div className="space-y-3 mb-12">
                                <button
                                    onClick={() => setShowOTPModal(true)}
                                    className="w-full flex items-center justify-between p-5 bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-2xl group transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-primary/20 rounded-lg group-hover:scale-110 transition-transform">
                                            <Lock className="w-4 h-4 text-primary" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs font-black uppercase tracking-widest">Change Password</p>
                                            <p className="text-[10px] text-muted-foreground font-medium">Secure your account with OTP</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                </button>

                                <button
                                    onClick={() => signOut()}
                                    className="w-full flex items-center justify-between p-5 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 rounded-2xl group transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-red-500/20 rounded-lg group-hover:scale-110 transition-transform">
                                            <LogOut className="w-4 h-4 text-red-500" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs font-black uppercase tracking-widest text-red-500">Sign Out</p>
                                            <p className="text-[10px] text-muted-foreground font-medium">End your current session</p>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* OTP Verification Modal */}
                    <AnimatePresence>
                        {showOTPModal && (
                            <div className="fixed inset-0 flex items-center justify-center z-[110] p-6">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setShowOTPModal(false)}
                                    className="absolute inset-0 bg-black/60 backdrop-blur-md"
                                />
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                    className="relative w-full max-w-sm bg-card border border-border rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-10 opacity-5 -mr-10 -mt-10">
                                        <Shield className="w-40 h-40 text-primary" />
                                    </div>

                                    <div className="relative z-10">
                                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8">
                                            <Lock className="w-8 h-8 text-primary" />
                                        </div>

                                        <h3 className="text-2xl font-black tracking-tight mb-4">
                                            {step === 'otp' ? 'Verify Identity' : 'Set New Password'}
                                        </h3>
                                        <p className="text-sm text-muted-foreground font-medium mb-10 leading-relaxed">
                                            {step === 'otp'
                                                ? 'We\'ve sent a 6-digit verification code to your registered email address.'
                                                : 'Enter your new secure password below.'}
                                        </p>

                                        {step === 'otp' ? (
                                            <div className="space-y-8">
                                                <div className="flex justify-between gap-2">
                                                    {otp.map((digit, i) => (
                                                        <input
                                                            key={i}
                                                            id={`otp-${i}`}
                                                            type="text"
                                                            maxLength={1}
                                                            value={digit}
                                                            onChange={(e) => handleOtpChange(i, e.target.value)}
                                                            className="w-12 h-14 bg-muted/50 border border-border rounded-xl text-center text-xl font-black focus:border-primary focus:outline-none transition-colors"
                                                        />
                                                    ))}
                                                </div>
                                                <button
                                                    onClick={verifyOTP}
                                                    disabled={otp.join('').length !== 6}
                                                    className="w-full bg-primary text-primary-foreground rounded-2xl py-4 font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 disabled:opacity-50 transition-all"
                                                >
                                                    Verify Code
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">New Password</label>
                                                    <input
                                                        type="password"
                                                        placeholder="••••••••"
                                                        className="w-full bg-muted/30 border border-border rounded-2xl px-5 py-4 text-sm font-medium focus:border-primary/50 outline-none transition-colors"
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setShowOTPModal(false);
                                                        setStep('otp');
                                                        setOtp(['', '', '', '', '', '']);
                                                    }}
                                                    className="w-full bg-primary text-primary-foreground rounded-2xl py-4 font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 transition-all"
                                                >
                                                    Update Password
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </AnimatePresence>
    );
}
