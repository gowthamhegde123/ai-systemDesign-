'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, Mail } from 'lucide-react';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. Please check your email and try again.');
      return;
    }

    verifyEmail(token);
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/auth/verify-email?token=${verificationToken}`
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setMessage('Your email has been verified successfully!');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.message || 'Verification failed. The link may have expired.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred during verification. Please try again.');
      console.error('Verification error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-card rounded-3xl shadow-2xl border border-border p-8 text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="mb-6 flex justify-center"
          >
            {status === 'loading' && (
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
            )}
            {status === 'success' && (
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
            )}
            {status === 'error' && (
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
            )}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-black text-foreground mb-4"
          >
            {status === 'loading' && 'Verifying Email...'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
          </motion.h1>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground mb-8"
          >
            {message}
          </motion.p>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-3"
          >
            {status === 'success' && (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  Redirecting to login page in 3 seconds...
                </p>
                <Link
                  href="/login"
                  className="block w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors"
                >
                  Go to Login
                </Link>
              </>
            )}

            {status === 'error' && (
              <>
                <Link
                  href="/login"
                  className="block w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors"
                >
                  Go to Login
                </Link>
                <button
                  onClick={() => window.location.reload()}
                  className="block w-full px-6 py-3 bg-muted text-foreground rounded-xl font-bold hover:bg-muted/80 transition-colors"
                >
                  Try Again
                </button>
              </>
            )}

            <Link
              href="/"
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to Home
            </Link>
          </motion.div>

          {/* Help Text */}
          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 p-4 bg-muted/50 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-bold text-foreground mb-1">
                    Need a new verification link?
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Log in to your account and request a new verification email from your profile settings.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
