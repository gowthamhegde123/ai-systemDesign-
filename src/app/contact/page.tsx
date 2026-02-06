'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BrainCircuit, ArrowLeft, Mail, MessageSquare, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

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
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4">Get in Touch</h1>
          <p className="text-muted-foreground text-lg">We'd love to hear from you. Send us a message!</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-3xl p-6">
              <Mail className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-black text-xl mb-2">Email Us</h3>
              <p className="text-muted-foreground mb-2">For general inquiries</p>
              <a href="mailto:hello@systemdesign.ai" className="text-primary hover:underline">
                hello@systemdesign.ai
              </a>
            </div>

            <div className="bg-card border border-border rounded-3xl p-6">
              <MessageSquare className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-black text-xl mb-2">Support</h3>
              <p className="text-muted-foreground mb-2">Need help?</p>
              <a href="mailto:support@systemdesign.ai" className="text-primary hover:underline">
                support@systemdesign.ai
              </a>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-3xl p-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
              {submitted && (
                <p className="text-green-600 text-sm text-center font-bold">Message sent successfully!</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
