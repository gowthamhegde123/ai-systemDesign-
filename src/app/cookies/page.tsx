'use client';

import React from 'react';
import Link from 'next/link';
import { BrainCircuit, ArrowLeft, Cookie } from 'lucide-react';

export default function CookiesPage() {
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
            <Cookie className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-black">Cookie Policy</h1>
            <p className="text-muted-foreground">Last updated: February 2026</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-card border border-border rounded-3xl p-8">
            <h2 className="text-2xl font-black mb-4">What Are Cookies?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our platform.
            </p>
          </div>

          <div className="bg-card border border-border rounded-3xl p-8">
            <h2 className="text-2xl font-black mb-4">How We Use Cookies</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold mb-2">Essential Cookies</h3>
                <p className="text-muted-foreground">Required for the website to function properly, including authentication and security.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Performance Cookies</h3>
                <p className="text-muted-foreground">Help us understand how visitors interact with our website by collecting anonymous information.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Functionality Cookies</h3>
                <p className="text-muted-foreground">Remember your preferences and settings to provide a personalized experience.</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-3xl p-8">
            <h2 className="text-2xl font-black mb-4">Managing Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              You can control and manage cookies through your browser settings. However, disabling cookies may affect the functionality of our website.
            </p>
          </div>

          <div className="bg-card border border-border rounded-3xl p-8">
            <h2 className="text-2xl font-black mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about our use of cookies, please contact us at{' '}
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
