'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Sparkles,
  ArrowRight,
  Play,
  CheckCircle,
  MessageSquare,
  ShieldAlert,
  BarChart3,
  FileText,
  UserCheck,
  TrendingUp,
  Cpu,
  ChevronRight,
  Star,
  Quote
} from 'lucide-react';
import GridBackground from '@/components/GridBackground';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'feedback' | 'roles' | 'tracking'>('feedback');
  const [demoMessageIndex, setDemoMessageIndex] = useState(0);
  const [showDemoModal, setShowDemoModal] = useState(false);

  // Simulated Chat Demo in Hero
  const demoMessages = [
    { sender: 'ai', text: 'Welcome to your Frontend interview. Can you explain the difference between client-side rendering (CSR) and server-side rendering (SSR)?' },
    { sender: 'user', text: 'Sure! CSR renders pages in the browser using Javascript, which makes transitions fast but initial load slower. SSR renders HTML on the server for each request, offering better SEO and faster first-paint.' },
    { sender: 'ai', text: 'Excellent explanation. How does Hydration fit into SSR, and what are its potential performance pitfalls?' },
    { sender: 'user', text: 'Hydration is when React attaches event listeners to the server-rendered HTML in the browser. Pitfalls include mismatches between server and client markup, which can delay Time to Interactive (TTI).' },
    { sender: 'feedback', text: 'Score: 92% | Strengths: Correctly identified hydration purpose and pitfalls. Suggestion: Mention React 18 Suspense & selective hydration for advanced points.' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setDemoMessageIndex((prev) => (prev + 1) % demoMessages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      id: 'feedback',
      icon: <Sparkles className="h-6 w-6 text-violet-400" />,
      title: 'Real-time AI Feedback',
      description: 'Receive instant, actionable critique on your code efficiency, logic explanation, vocabulary, and communication clarity.',
      badge: 'Advanced AI'
    },
    {
      id: 'roles',
      icon: <Brain className="h-6 w-6 text-indigo-400" />,
      title: 'Role-Based Tracks',
      description: 'Choose from Frontend, Backend, Machine Learning, HR, and custom templates designed by industry experts.',
      badge: '10+ Roles'
    },
    {
      id: 'tracking',
      icon: <BarChart3 className="h-6 w-6 text-fuchsia-400" />,
      title: 'Performance Analytics',
      description: 'Visualize your progress with scores across communication, technical proficiency, and confidence over multiple sessions.',
      badge: 'Insights'
    },
    {
      id: 'resume',
      icon: <FileText className="h-6 w-6 text-emerald-400" />,
      title: 'Resume-Based Questions',
      description: 'Upload your resume, and our AI will dynamically craft custom questions based on your projects and work history.',
      badge: 'New Feature'
    }
  ];

  const testimonials = [
    {
      quote: "MockMate was a game-changer. The feedback on my system design answers helped me land a Senior Staff Engineer role at Stripe.",
      author: "Sarah Jenkins",
      role: "Staff Engineer at Stripe",
      rating: 5,
      avatar: "SJ"
    },
    {
      quote: "The HR interview simulator felt so real. The vocabulary advice helped me overcome my nervousness and present my project history elegantly.",
      author: "David Chen",
      role: "Software Engineer at Vercel",
      rating: 5,
      avatar: "DC"
    },
    {
      quote: "Being able to upload my resume and get grilled on specific React architecture choices made my interview prep incredibly targeted and efficient.",
      author: "Elena Rostova",
      role: "Frontend Dev at Linear",
      rating: 5,
      avatar: "ER"
    }
  ];

  const pricingTiers = [
    {
      name: "Starter",
      price: "$0",
      description: "Perfect for testing the waters and getting basic practice.",
      features: [
        "2 simulated interviews per month",
        "Standard AI feedback report",
        "Access to Front-End and HR templates",
        "Basic performance statistics"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Pro",
      price: "$19",
      period: "/month",
      description: "Accelerate your prep with unlimited interviews and staff-level questions.",
      features: [
        "Unlimited practice interviews",
        "Deep AI cognitive feedback & code reviews",
        "Resume-tailored interview generation",
        "Advanced charts and historical analytics",
        "Priority AI model response times"
      ],
      cta: "Upgrade to Pro",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Tailored mock assessments for hiring teams and bootcamps.",
      features: [
        "Custom role templates and custom rubric",
        "Team dashboards and performance reports",
        "Branded candidate interface",
        "API access to interview records",
        "Dedicated account support"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden px-4 md:px-8">
      <GridBackground />

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl pt-12 pb-24 md:pt-20 md:pb-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary-glow px-4 py-1.5 text-xs font-semibold text-primary-glow text-purple-300 backdrop-blur-md"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Now powered by GPT-4o & Claude 3.5 Sonnet
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-sans text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white"
            >
              Ace Your <br />
              <span className="bg-gradient-to-r from-primary via-purple-400 to-accent bg-clip-text text-transparent">
                Interviews with AI
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-xl text-lg text-gray-400 font-medium leading-relaxed"
            >
              Practice technical coding, system design, and HR behavior challenges with real-time AI critique, analytics, and hints.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Link
                href="/roles"
                className="relative inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-accent px-8 py-4 text-base font-bold text-white shadow-[0_0_30px_rgba(139,92,246,0.35)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(139,92,246,0.55)] hover:scale-[1.03] active:scale-[0.97]"
              >
                Start Interview
                <ArrowRight className="h-5 w-5" />
              </Link>
              <button
                onClick={() => setShowDemoModal(true)}
                className="inline-flex items-center justify-center gap-2.5 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20 active:scale-[0.98]"
              >
                <Play className="h-4 w-4 fill-white text-white" />
                View Demo
              </button>
            </motion.div>
          </div>

          {/* Right Interactive Chat Illustration Column */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="glass-panel relative rounded-3xl p-6 shadow-2xl border border-white/5 w-full max-w-lg mx-auto"
            >
              {/* Header inside mock window */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <div className="text-sm font-semibold text-gray-200">AI Interview Simulator</div>
                </div>
                <div className="flex gap-1.5">
                  <span className="text-[10px] font-mono text-gray-500 bg-white/5 px-2 py-0.5 rounded-md">React Dev Track</span>
                </div>
              </div>

              {/* Chat messages */}
              <div className="space-y-4 min-h-[300px] flex flex-col justify-end">
                <AnimatePresence mode="popLayout">
                  {demoMessages.slice(0, demoMessageIndex + 1).map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-4 text-sm font-medium ${
                          msg.sender === 'user'
                            ? 'bg-gradient-to-r from-primary to-accent text-white rounded-br-none shadow-[0_5px_15px_rgba(139,92,246,0.15)]'
                            : msg.sender === 'feedback'
                            ? 'bg-violet-950/40 border border-violet-500/20 text-violet-300 rounded-bl-none'
                            : 'bg-white/5 border border-white/5 text-gray-300 rounded-bl-none'
                        }`}
                      >
                        {msg.sender === 'feedback' && (
                          <div className="flex items-center gap-1.5 font-bold mb-1.5 text-xs text-violet-400">
                            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                            AI INTERVIEW FEEDBACK
                          </div>
                        )}
                        <p className="leading-relaxed">{msg.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Input bar visual */}
              <div className="mt-6 flex gap-2">
                <div className="flex-1 rounded-xl bg-white/5 border border-white/5 px-4 py-3 text-xs text-gray-500 flex items-center justify-between">
                  <span>Drafting answer...</span>
                  <div className="flex gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-500 animate-bounce" />
                  </div>
                </div>
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-gray-400">
                  <MessageSquare className="h-4.5 w-4.5" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bento Features Section */}
      <section className="mx-auto max-w-7xl py-24 md:py-32 border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1 text-sm font-semibold text-primary uppercase tracking-wider">
            <Cpu className="h-4 w-4" /> Features
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
            An Interviewer Prepared for Any Scenario
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            From technical whiteboards to cultural behavioral screenings, MockMate features modules tailored for deep evaluation.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 - AI Feedback (Wide) */}
          <div className="glass-panel glass-panel-hover rounded-3xl p-8 lg:col-span-2 flex flex-col justify-between space-y-6 relative overflow-hidden group">
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-primary/10 blur-[80px] group-hover:bg-primary/20 transition-colors duration-500" />
            <div className="space-y-4">
              <span className="inline-block bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs px-3 py-1 rounded-full font-semibold">
                Advanced AI
              </span>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">Actionable, Line-By-Line Feedback</h3>
              <p className="text-gray-400 max-w-lg leading-relaxed">
                MockMate parses your response structure, highlighting efficiency flaws in coding syntax, semantic communication improvements, confidence tone levels, and suggests alternative vocabulary to elevate your expertise signals.
              </p>
            </div>
            <div className="flex items-center gap-2.5 text-sm font-semibold text-violet-400 group-hover:text-white transition-colors">
              Explore feedback framework <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2 - Resume questions (Tall) */}
          <div className="glass-panel glass-panel-hover rounded-3xl p-8 flex flex-col justify-between space-y-8 relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 h-36 w-36 rounded-full bg-emerald-500/5 blur-[60px] group-hover:bg-emerald-500/15 transition-colors duration-500" />
            <div className="space-y-4">
              <span className="inline-block bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-3 py-1 rounded-full font-semibold">
                New Release
              </span>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Resume-Tailored Drilling</h3>
              <p className="text-gray-400 leading-relaxed">
                Drag and drop your resume. MockMate automatically analyzes past work, coding tech stacks, and metrics, generating custom questions to probe project boundaries.
              </p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-gray-200">resume_staff.pdf</div>
                  <div className="text-[10px] text-gray-500">Successfully scanned</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-400">Ready</span>
            </div>
          </div>

          {/* Card 3 - Role-Based (Standard) */}
          <div className="glass-panel glass-panel-hover rounded-3xl p-8 flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <span className="inline-block bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs px-3 py-1 rounded-full font-semibold">
                10+ Roles
              </span>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Targeted Role Rubrics</h3>
              <p className="text-gray-400 leading-relaxed">
                Master interviews specifically designed for Frontend, Backend, Machine Learning, HR Leadership, Product Managers, and Data Analytics.
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-mono bg-white/5 border border-white/5 text-gray-400 px-2.5 py-1 rounded-lg">Next.js</span>
              <span className="text-xs font-mono bg-white/5 border border-white/5 text-gray-400 px-2.5 py-1 rounded-lg">Python</span>
              <span className="text-xs font-mono bg-white/5 border border-white/5 text-gray-400 px-2.5 py-1 rounded-lg">SQL</span>
              <span className="text-xs font-mono bg-white/5 border border-white/5 text-gray-400 px-2.5 py-1 rounded-lg">System Design</span>
            </div>
          </div>

          {/* Card 4 - Performance Tracking (Wide) */}
          <div className="glass-panel glass-panel-hover rounded-3xl p-8 lg:col-span-2 flex flex-col justify-between space-y-6 relative overflow-hidden group">
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-fuchsia-500/10 blur-[80px]" />
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-7 space-y-4">
                <span className="inline-block bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 text-xs px-3 py-1 rounded-full font-semibold">
                  Analytics
                </span>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-500/10 text-fuchsia-400">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Progressive Analytics Dashboards</h3>
                <p className="text-gray-400 leading-relaxed">
                  Track score patterns over time. Monitor communication speed, technical explanation depth, confidence metrics, and general progress trends across mock runs.
                </p>
              </div>
              <div className="md:col-span-5 rounded-2xl bg-bg-darker/60 border border-white/5 p-4 space-y-3 shadow-inner">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Confidence growth</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                    <TrendingUp className="h-3 w-3" /> +14%
                  </span>
                </div>
                {/* Visual bar chart representations */}
                <div className="flex items-end justify-between h-20 px-2 pt-2">
                  <div className="w-4 bg-white/10 rounded-t h-[40%]" />
                  <div className="w-4 bg-white/10 rounded-t h-[55%]" />
                  <div className="w-4 bg-white/20 rounded-t h-[65%]" />
                  <div className="w-4 bg-gradient-to-t from-primary to-accent rounded-t h-[90%] shadow-[0_0_10px_rgba(139,92,246,0.3)] animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="mx-auto max-w-7xl py-24 md:py-32 border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1 text-sm font-semibold text-primary uppercase tracking-wider">
            <UserCheck className="h-4 w-4" /> Success Stories
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Chosen by Software Engineers Globally
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            See how developers utilize MockMate simulations to prepare, refine, and secure offers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-panel p-8 rounded-3xl flex flex-col justify-between gap-6 hover:border-white/15 transition-all duration-300 relative group"
            >
              <Quote className="absolute top-6 right-8 h-8 w-8 text-white/5 group-hover:text-white/10 transition-colors" />
              <div className="flex gap-1">
                {[...Array(test.rating)].map((_, i) => (
                  <Star key={i} className="h-4.5 w-4.5 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <p className="text-sm font-medium text-gray-300 leading-relaxed italic">
                &ldquo;{test.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-bold text-sm text-white">
                  {test.avatar}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{test.author}</div>
                  <div className="text-xs text-gray-500 font-medium">{test.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="mx-auto max-w-7xl py-24 md:py-32 border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Flexible Pricing for Every Candidate
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Choose the track that fits your application timeline. Get started for free today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`glass-panel rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
                tier.popular
                  ? 'border-primary bg-bg-dark border-[1.5px] shadow-[0_0_30px_rgba(139,92,246,0.15)] scale-[1.03]'
                  : 'hover:border-white/15'
              }`}
            >
              {tier.popular && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-primary to-accent text-[10px] font-bold text-white px-3 py-1 rounded-full shadow-md uppercase tracking-wider animate-pulse">
                  Most Popular
                </div>
              )}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-400">{tier.name}</h3>
                  <div className="flex items-baseline gap-1 mt-2.5">
                    <span className="text-4xl md:text-5xl font-extrabold text-white">{tier.price}</span>
                    {tier.period && <span className="text-sm font-medium text-gray-500">{tier.period}</span>}
                  </div>
                  <p className="text-xs text-gray-500 font-medium mt-2">{tier.description}</p>
                </div>

                <div className="h-px bg-white/5" />

                <ul className="space-y-3.5">
                  {tier.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-gray-300 font-medium leading-tight">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  href="/roles"
                  className={`w-full inline-flex items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-semibold transition-all duration-300 ${
                    tier.popular
                      ? 'bg-gradient-to-r from-primary to-accent text-white shadow-[0_5px_15px_rgba(139,92,246,0.25)] hover:shadow-[0_8px_20px_rgba(139,92,246,0.4)] hover:scale-[1.02] active:scale-[0.98]'
                      : 'border border-white/10 bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  {tier.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-7xl pt-16 pb-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-500 text-xs font-semibold">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white">
            <Brain className="h-3.5 w-3.5" />
          </div>
          <span className="text-gray-300 font-bold">MockMate &copy; 2026</span>
        </div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Support</a>
        </div>
      </footer>

      {/* Demo Video Modal */}
      <AnimatePresence>
        {showDemoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDemoModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-panel relative rounded-3xl p-6 shadow-2xl border border-white/10 w-full max-w-3xl overflow-hidden z-10"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Play className="h-4 w-4 fill-primary text-primary" /> MockMate Interactive Overview
                </h3>
                <button
                  onClick={() => setShowDemoModal(false)}
                  className="h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white"
                >
                  X
                </button>
              </div>

              {/* Video placeholder display */}
              <div className="relative aspect-video rounded-2xl bg-bg-dark border border-white/5 overflow-hidden flex flex-col items-center justify-center gap-4 text-center p-8 group">
                <div className="h-16 w-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(139,92,246,0.3)] group-hover:scale-110 transition-transform duration-300">
                  <Play className="h-6 w-6 fill-primary text-primary translate-x-0.5" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-gray-200">MockMate Simulation Sandbox Walkthrough</p>
                  <p className="text-xs text-gray-500">Duration: 2 mins • Learn how real-time voice and scoring work</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
