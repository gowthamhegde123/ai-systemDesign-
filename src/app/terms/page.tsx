'use client';

import React from 'react';
import Link from 'next/link';
import { BrainCircuit, ArrowLeft, FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
              <BrainCircuit className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-black tracking-tighter">SystemDesign.AI</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-6 py-20 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-black">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: February 2026</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-card border border-border rounded-3xl p-8">
            <h2 className="text-2xl font-black mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using SystemDesign.AI, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our service.
            </p>
          </div>

          <div className="bg-card border border-border rounded-3xl p-8">
            <h2 className="text-2xl font-black mb-4">2. Use License</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Permission is granted to temporarily access the materials on SystemDesign.AI for personal, non-commercial use only. This license shall automatically terminate if you violate any of these restrictions.
            </p>
            <p className="text-muted-foreground leading-relaxed font-bold">You may not:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for commercial purposes</li>
              <li>Attempt to reverse engineer any software</li>
              <li>Remove any copyright or proprietary notations</li>
              <li>Transfer the materials to another person</li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-3xl p-8">
            <h2 className="text-2xl font-black mb-4">3. User Accounts</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              You are responsible for safeguarding your password and for all activities that occur under your account.
            </p>
          </div>

          <div className="bg-card border border-border rounded-3xl p-8">
            <h2 className="text-2xl font-black mb-4">4. Content Ownership</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You retain all rights to the system designs and solutions you create on our platform. By submitting content, you grant us a license to use, display, and distribute your content for the purpose of operating and improving the service.
            </p>
          </div>

          <div className="bg-card border border-border rounded-3xl p-8">
            <h2 className="text-2xl font-black mb-4">5. Prohibited Activities</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit malicious code or viruses</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Attempt to gain unauthorized access</li>
              <li>Use automated systems to access the service</li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-3xl p-8">
            <h2 className="text-2xl font-black mb-4">6. Disclaimer</h2>
            <p className="text-muted-foreground leading-relaxed">
              The materials on SystemDesign.AI are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim all other warranties including, without limitation, implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
            </p>
          </div>

          <div className="bg-card border border-border rounded-3xl p-8">
            <h2 className="text-2xl font-black mb-4">7. Limitations</h2>
            <p className="text-muted-foreground leading-relaxed">
              In no event shall SystemDesign.AI or its suppliers be liable for any damages arising out of the use or inability to use the materials on our platform.
            </p>
          </div>

          <div className="bg-card border border-border rounded-3xl p-8">
            <h2 className="text-2xl font-black mb-4">8. Modifications</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may revise these terms of service at any time without notice. By using this platform, you agree to be bound by the current version of these terms.
            </p>
          </div>

          <div className="bg-card border border-border rounded-3xl p-8">
            <h2 className="text-2xl font-black mb-4">9. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms, please contact us at{' '}
              <a href="mailto:legal@systemdesign.ai" className="text-primary hover:underline">
                legal@systemdesign.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
