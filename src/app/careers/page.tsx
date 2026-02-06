'use client';

import React from 'react';
import Link from 'next/link';
import { BrainCircuit, ArrowLeft, Briefcase, MapPin, Clock, DollarSign, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const jobOpenings = [
  {
    title: 'Senior Full-Stack Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    salary: '$150k - $200k',
    description: 'Build and scale our AI-powered learning platform. Work with React, Node.js, and cutting-edge AI technologies.',
    requirements: ['5+ years experience', 'React & Node.js', 'System Design expertise', 'AI/ML knowledge']
  },
  {
    title: 'Product Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    salary: '$120k - $160k',
    description: 'Design beautiful, intuitive experiences for engineers learning system design. Shape the future of technical education.',
    requirements: ['4+ years experience', 'Figma expert', 'Design systems', 'User research']
  },
  {
    title: 'DevOps Engineer',
    department: 'Infrastructure',
    location: 'Remote',
    type: 'Full-time',
    salary: '$140k - $180k',
    description: 'Build and maintain our cloud infrastructure. Ensure 99.99% uptime for thousands of concurrent users.',
    requirements: ['AWS/GCP experience', 'Kubernetes', 'CI/CD pipelines', 'Monitoring & observability']
  },
  {
    title: 'Content Creator - System Design',
    department: 'Content',
    location: 'Remote',
    type: 'Full-time',
    salary: '$100k - $140k',
    description: 'Create engaging system design problems, tutorials, and educational content for our community.',
    requirements: ['System design expertise', 'Technical writing', 'FAANG experience preferred', 'Teaching passion']
  },
  {
    title: 'Machine Learning Engineer',
    department: 'AI/ML',
    location: 'Remote',
    type: 'Full-time',
    salary: '$160k - $220k',
    description: 'Develop AI models to evaluate system designs and provide personalized feedback to learners.',
    requirements: ['ML/AI expertise', 'Python & TensorFlow', 'NLP experience', 'PhD preferred']
  },
  {
    title: 'Community Manager',
    department: 'Community',
    location: 'Remote',
    type: 'Full-time',
    salary: '$80k - $110k',
    description: 'Build and nurture our community of engineers. Organize events, moderate discussions, and foster engagement.',
    requirements: ['Community building', 'Technical background', 'Excellent communication', 'Event planning']
  }
];

const benefits = [
  '🏠 Fully Remote',
  '💰 Competitive Salary',
  '🏥 Health Insurance',
  '🌴 Unlimited PTO',
  '📚 Learning Budget',
  '💻 Latest Equipment',
  '🚀 Equity Options',
  '🎯 Impact-Driven Work'
];

export default function CareersPage() {
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

      <div className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-black mb-4">Join Our Team</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Help us democratize system design education and empower the next generation of engineers
          </p>
        </motion.div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-black text-center mb-8">Why Work With Us?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-2xl p-4 text-center font-medium"
              >
                {benefit}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Job Openings */}
        <div>
          <h2 className="text-3xl font-black mb-8">Open Positions</h2>
          <div className="space-y-6">
            {jobOpenings.map((job, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-3xl p-8 hover:shadow-xl transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-black mb-2 group-hover:text-primary transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {job.salary}
                      </span>
                    </div>
                  </div>
                  <button className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2 whitespace-nowrap">
                    Apply Now
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {job.description}
                </p>

                <div>
                  <p className="text-sm font-bold mb-2">Requirements:</p>
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.map((req, j) => (
                      <span key={j} className="text-xs bg-muted px-3 py-1 rounded-full font-medium">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-black mb-4">Don't See a Perfect Fit?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            We're always looking for talented people. Send us your resume and tell us how you'd like to contribute!
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold hover:scale-105 transition-transform"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
}
