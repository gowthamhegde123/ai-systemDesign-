'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BrainCircuit, Github, Mail, Lock,
    ArrowRight, Sparkles, ChevronLeft,
    Chrome, User, Hash
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

type AuthMode = 'login' | 'signup' | 'forgot' | 'reset';

export default function AuthPage() {
    const [mode, setMode] = useState<AuthMode>('login');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const router = useRouter();

    // Form states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        if (result?.error) {
            setError('Invalid email or password');
            setIsLoading(false);
        } else {
            router.push('/');
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, fullName, username }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Something went wrong');

            setSuccess('Account created! You can now log in.');
            setMode('login');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgot = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Something went wrong');

            setSuccess('Reset code sent to your email.');
            setMode('reset');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code, newPassword }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Something went wrong');

            setSuccess('Password reset successfully! You can now log in.');
            setMode('login');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = async (provider: string) => {
        await signIn(provider, { callbackUrl: '/' });
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full animate-pulse delay-700" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Logo */}
                <div className="flex flex-col items-center mb-12">
                    <Link href="/" className="flex items-center gap-2 mb-4 group">
                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 shadow-xl shadow-primary/20">
                            <BrainCircuit className="w-7 h-7 text-primary-foreground" />
                        </div>
                    </Link>
                    <h1 className="text-3xl font-black tracking-tighter">
                        {mode === 'login' && 'Welcome Back'}
                        {mode === 'signup' && 'Create Account'}
                        {mode === 'forgot' && 'Forgot Password'}
                        {mode === 'reset' && 'Reset Password'}
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium mt-2 text-center">
                        {mode === 'login' && 'Enter your credentials to access your workspace'}
                        {mode === 'signup' && 'Join the next generation of system architects'}
                        {mode === 'forgot' && 'Enter your email to receive a reset code'}
                        {mode === 'reset' && 'Enter the code and your new password'}
                    </p>
                </div>

                <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-8 shadow-2xl shadow-black/50 relative overflow-hidden">
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-500 text-xs font-bold">
                            {success}
                        </div>
                    )}

                    {(mode === 'login' || mode === 'signup') && (
                        <>
                            {/* Social Auth */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <button
                                    onClick={() => handleSocialLogin('google')}
                                    className="flex items-center justify-center gap-3 px-4 py-3 bg-muted/50 hover:bg-muted rounded-2xl border border-border transition-all group"
                                >
                                    <Chrome className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs font-black uppercase tracking-widest">Google</span>
                                </button>
                                <button
                                    onClick={() => handleSocialLogin('github')}
                                    className="flex items-center justify-center gap-3 px-4 py-3 bg-muted/50 hover:bg-muted rounded-2xl border border-border transition-all group"
                                >
                                    <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs font-black uppercase tracking-widest">Github</span>
                                </button>
                            </div>

                            <div className="relative mb-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-border/50"></div>
                                </div>
                                <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                                    <span className="bg-background/0 px-4 backdrop-blur-sm">Or continue with email</span>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Form */}
                    <form
                        onSubmit={
                            mode === 'login' ? handleLogin :
                                mode === 'signup' ? handleSignup :
                                    mode === 'forgot' ? handleForgot :
                                        handleReset
                        }
                        className="space-y-4"
                    >
                        {mode === 'signup' && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="John Doe"
                                            className="w-full bg-muted/30 border border-border/50 rounded-2xl pl-12 pr-5 py-4 text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Username</label>
                                    <div className="relative group">
                                        <Hash className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="johndoe"
                                            className="w-full bg-muted/30 border border-border/50 rounded-2xl pl-12 pr-5 py-4 text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors"
                                            required
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {(mode !== 'reset') && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@company.com"
                                        className="w-full bg-muted/30 border border-border/50 rounded-2xl pl-12 pr-5 py-4 text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {mode === 'reset' && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Verification Code</label>
                                <div className="relative group">
                                    <Hash className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="text"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        placeholder="123456"
                                        className="w-full bg-muted/30 border border-border/50 rounded-2xl pl-12 pr-5 py-4 text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {(mode === 'login' || mode === 'signup') && (
                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Password</label>
                                    {mode === 'login' && (
                                        <button
                                            type="button"
                                            onClick={() => setMode('forgot')}
                                            className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-accent transition-colors"
                                        >
                                            Forgot?
                                        </button>
                                    )}
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-muted/30 border border-border/50 rounded-2xl pl-12 pr-5 py-4 text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {mode === 'reset' && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">New Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-muted/30 border border-border/50 rounded-2xl pl-12 pr-5 py-4 text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            disabled={isLoading}
                            className="w-full bg-primary text-primary-foreground rounded-2xl py-4 font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 relative overflow-hidden group"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            ) : (
                                <>
                                    {mode === 'login' && 'Sign In'}
                                    {mode === 'signup' && 'Create Account'}
                                    {mode === 'forgot' && 'Send Code'}
                                    {mode === 'reset' && 'Reset Password'}
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        {mode === 'login' && (
                            <button
                                onClick={() => setMode('signup')}
                                className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
                            >
                                Don't have an account? <span className="text-primary underline underline-offset-4">Sign up for free</span>
                            </button>
                        )}
                        {mode !== 'login' && (
                            <button
                                onClick={() => setMode('login')}
                                className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
                            >
                                Back to <span className="text-primary underline underline-offset-4">Login</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Back to Home */}
                <Link
                    href="/"
                    className="flex items-center justify-center gap-2 mt-8 text-muted-foreground hover:text-foreground transition-colors group"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Back to Home</span>
                </Link>
            </motion.div>
        </div>
    );
}
