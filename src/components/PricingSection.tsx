'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Crown, Zap } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    description: 'Perfect for getting started with system design',
    icon: <Zap className="w-6 h-6" />,
    color: 'from-blue-500 to-cyan-500',
    features: [
      '50 system design questions',
      'Basic canvas with drag & drop',
      '5 AI evaluations per month',
      'Community support',
      'Basic components library',
      'Save up to 3 designs',
    ],
    limitations: [
      'Limited AI feedback',
      'No advanced analytics',
      'No priority support',
    ],
    cta: 'Get Started Free',
    href: '/login',
    popular: false,
  },
  {
    name: 'Pro',
    price: '₹999',
    period: 'per month',
    description: 'For serious learners preparing for interviews',
    icon: <Sparkles className="w-6 h-6" />,
    color: 'from-purple-500 to-pink-500',
    features: [
      'All 540+ system design questions',
      'Unlimited AI evaluations',
      'Advanced analytics & insights',
      'Detailed performance metrics',
      'Priority support',
      'Unlimited saved designs',
      'Export designs as images',
      'Interview preparation guides',
      'Mock interview mode',
      'Progress tracking dashboard',
    ],
    cta: 'Start Pro Trial',
    href: '/login?plan=pro',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    description: 'For teams and organizations',
    icon: <Crown className="w-6 h-6" />,
    color: 'from-yellow-500 to-orange-500',
    features: [
      'Everything in Pro',
      'Team collaboration features',
      'Custom question creation',
      'White-label solution',
      'Dedicated account manager',
      'Custom integrations',
      'SSO & advanced security',
      'Usage analytics & reporting',
      'Custom training sessions',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
    href: '/contact',
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-32 px-6 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[150px] rounded-full" />

      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-8"
          >
            <Crown className="w-4 h-4" />
            <span>Simple, Transparent Pricing</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black tracking-tight mb-6"
          >
            Choose Your Path to Mastery
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed"
          >
            Start free and upgrade when you're ready. All plans include access to our AI-powered feedback system.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                  <div className="px-4 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                    Most Popular
                  </div>
                </div>
              )}

              <div
                className={`relative h-full p-8 rounded-3xl border transition-all duration-300 ${
                  plan.popular
                    ? 'bg-card border-primary shadow-2xl shadow-primary/20 scale-105'
                    : 'bg-card border-border hover:border-primary/50 hover:shadow-xl'
                }`}
              >
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-3xl`}
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className={`mb-6 p-4 rounded-2xl bg-gradient-to-br ${plan.color} text-white w-fit`}
                  >
                    {plan.icon}
                  </div>

                  {/* Plan Name */}
                  <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground font-medium mb-6">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black tracking-tight">{plan.price}</span>
                      <span className="text-muted-foreground font-medium">/{plan.period}</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={plan.href}
                    className={`block w-full text-center px-6 py-4 rounded-2xl font-black text-base transition-all mb-8 ${
                      plan.popular
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:scale-105'
                        : 'bg-muted hover:bg-muted/80 border border-border'
                    }`}
                  >
                    {plan.cta}
                  </Link>

                  {/* Features */}
                  <div className="space-y-4">
                    <div className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">
                      What's Included
                    </div>
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="mt-0.5 p-1 rounded-full bg-primary/10">
                          <Check className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-foreground/80">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ or Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <p className="text-muted-foreground font-medium mb-4">
            All plans include a 14-day money-back guarantee. No questions asked.
          </p>
          <p className="text-sm text-muted-foreground">
            Need help choosing? <Link href="/contact" className="text-primary font-bold hover:underline">Contact our team</Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
