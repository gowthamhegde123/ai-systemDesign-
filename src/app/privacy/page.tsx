'use client';

import React from 'react';
import Link from 'next/link';
import { BrainCircuit, ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPage() {
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
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-black">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: February 2026</p>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-card border border-border rounded-3xl p-8 mb-8">
            <h2 className="text-2xl font-black mb-4">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              At SystemDesign.AI, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>
          </div>

          <div className="bg-card border border-border rounded-3xl p-8 mb-8">
            <h2 className="text-2xl font-black mb-4">Information We Collect</h2>
            <div className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">Personal Information</h3>
                <p>We collect information you provide directly, including:</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Name and email address</li>
                  <li>Profile information and preferences</li>
                  <li>Account credentials</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">Usage Data</h3>
                <p>We automatically collect certain information, including:</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Design submissions and solutions</li>
                  <li>Learning progress and statistics</li>
                  <li>Device and browser information</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-3xl p-8 mb-8">
            <h2 className="text-2xl font-black mb-4">How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Provide and improve our services</li>
              <li>Personalize your learning experience</li>
              <li>Send important updates and notifications</li>
              <li>Analyze usage patterns to enhance the platform</li>
              <li>Ensure security and prevent fraud</li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-3xl p-8 mb-8">
            <h2 className="text-2xl font-black mb-4">Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement industry-standard security measures to protect your data, including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure.
            </p>
          </div>

          <div className="bg-card border border-border rounded-3xl p-8 mb-8">
            <h2 className="text-2xl font-black mb-4">Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Export your data</li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-3xl p-8">
            <h2 className="text-2xl font-black mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@systemdesign.ai" className="text-primary hover:underline">
                privacy@systemdesign.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
