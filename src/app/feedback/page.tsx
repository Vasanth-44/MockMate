'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Brain,
  Sparkles,
  RotateCcw,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  ArrowRight
} from 'lucide-react';
import GridBackground from '@/components/GridBackground';
import confetti from 'canvas-confetti';

interface SavedFeedback {
  role: string;
  question: string;
  answer: string;
  evaluation: {
    overall_score: number;
    technical_score: number;
    communication_score: number;
    confidence_score: number;
    strengths: string[];
    improvements: string[];
    summary: string;
  };
  timestamp: string;
  timeElapsed: string;
}

export default function FeedbackDashboard() {
  const router = useRouter();
  const [data, setData] = useState<SavedFeedback | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rawData = localStorage.getItem('mockmate-feedback');
    if (rawData) {
      try {
        const parsed = JSON.parse(rawData) as SavedFeedback;
        setData(parsed);
      } catch (e) {
        console.error("Failed to parse feedback data", e);
      }
    }
    setLoading(false);

    // Fire success confetti!
    const timer = setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8b5cf6', '#6366f1', '#a78bfa']
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleExportPDF = () => {
    alert("Generating PDF Report... Starting download shortly!");
    window.print();
  };

  const getRoleTitle = (id: string) => {
    switch (id) {
      case 'frontend': return 'Frontend Developer';
      case 'backend': return 'Backend Developer';
      case 'fullstack': return 'Full Stack Developer';
      case 'python': return 'Python Developer';
      case 'data-analyst': return 'Data Analyst';
      case 'hr': return 'HR & Behavioral';
      case 'ml-engineer': return 'Machine Learning Engineer';
      default: return 'Software Engineer';
    }
  };

  const getOverallEvaluation = (score: number) => {
    if (score >= 90) return { title: "Excellent Performance", text: "You demonstrate advanced knowledge, clear communication, and precise technical structure. Ready to interview at top tech firms." };
    if (score >= 80) return { title: "Strong Competency", text: "Solid foundations across all criteria. Minor logic adjustments or deeper architectural rationale will push you to staff level." };
    return { title: "Ready for Polish", text: "Good initial performance. Review the weak areas and focus on the suggested vocabulary adjustments to increase credibility signals." };
  };

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-bg-darker">
        <GridBackground />
        <div className="text-center space-y-4">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 font-semibold">Loading your evaluation...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="relative min-h-screen flex items-center justify-center p-4 bg-bg-darker">
        <GridBackground />
        <div className="glass-panel rounded-3xl p-10 text-center max-w-md w-full space-y-6">
          <div className="h-14 w-14 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-primary mx-auto shadow-inner">
            <Brain className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-white">No Evaluation Data Found</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            It looks like you haven&apos;t completed an interview session yet. Start a new session to get live AI feedback.
          </p>
          <Link
            href="/roles"
            className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-accent py-3 text-sm font-semibold text-white shadow-lg"
          >
            Choose a Role
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  const evaluation = getOverallEvaluation(data.evaluation.overall_score);

  // Circular progress helper
  const CircularScore = ({ score, label, colorClass, size = 120 }: { score: number; label: string; colorClass: string; size?: number }) => {
    const radius = size * 0.4;
    const strokeWidth = size * 0.08;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
      <div className="flex flex-col items-center gap-3">
        <div className="relative" style={{ width: size, height: size }}>
          <svg className="w-full h-full transform -rotate-90">
            {/* Background ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              className="stroke-white/5 fill-transparent"
              strokeWidth={strokeWidth}
            />
            {/* Active ring */}
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              className={`fill-transparent ${colorClass}`}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold tracking-tight text-white">{score}%</span>
          </div>
        </div>
        <span className="text-xs font-bold text-gray-400 text-center">{label}</span>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen py-12 px-4 md:px-8 bg-bg-darker">
      <GridBackground />

      <div className="mx-auto max-w-7xl">
        
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="text-center md:text-left space-y-2.5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary-glow px-4 py-1 text-xs font-semibold text-primary">
              <Award className="h-3.5 w-3.5 animate-bounce" /> Interview Completed
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Feedback & Performance Dashboard
            </h1>
            <p className="text-gray-400 text-sm font-medium">
              Results summary for your <strong className="text-gray-200">{getRoleTitle(data.role)}</strong> evaluation.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link
              href={`/interview/${data.role}`}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 px-6 py-3.5 text-xs font-bold text-white transition-all hover:bg-white/10 hover:border-white/20 active:scale-[0.98]"
            >
              <RotateCcw className="h-4 w-4" />
              Retry Practice
            </Link>
            <button
              onClick={handleExportPDF}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-primary to-accent px-6 py-3.5 text-xs font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="h-4 w-4" />
              Download Report
            </button>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-8">
          
          {/* Circular Gauges Panel */}
          <div className="lg:col-span-8 glass-panel rounded-3xl p-8 flex flex-col justify-between space-y-8">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" /> Evaluation Metrics
              </h3>
              <div className="text-xs text-gray-500 font-semibold flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> Prep session duration: {data.timeElapsed || '00:00'}
              </div>
            </div>

            {/* Gauges Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center py-4">
              <CircularScore score={data.evaluation.overall_score} label="Overall Score" colorClass="stroke-primary" size={130} />
              <CircularScore score={data.evaluation.technical_score} label="Technical Depth" colorClass="stroke-sky-400" />
              <CircularScore score={data.evaluation.communication_score} label="Communication" colorClass="stroke-emerald-400" />
              <CircularScore score={data.evaluation.confidence_score} label="Confidence Metric" colorClass="stroke-fuchsia-400" />
            </div>

            {/* Summary Evaluation Card */}
            <div className="rounded-2xl bg-white/3 border border-white/5 p-5">
              <div className="text-sm font-bold text-gray-200 mb-1.5">{evaluation.title}</div>
              <p className="text-xs text-gray-400 leading-relaxed font-medium">
                {evaluation.text}
              </p>
            </div>
          </div>

          {/* Strengths & Weaknesses (Right panel) */}
          <div className="lg:col-span-4 glass-panel rounded-3xl p-8 space-y-6 flex flex-col justify-between">
            <h3 className="text-base font-bold text-white border-b border-white/5 pb-4">
              Core Competencies
            </h3>

            {/* Strengths */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" /> Key Strengths
              </div>
              <ul className="space-y-2 text-xs text-gray-300 font-medium">
                {data.evaluation.strengths.map((str, idx) => (
                  <li key={idx}>&bull; {str}</li>
                ))}
              </ul>
            </div>

            {/* Weak Areas */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                <XCircle className="h-4.5 w-4.5 text-rose-500" /> Areas of Improvement
              </div>
              <ul className="space-y-2 text-xs text-gray-300 font-medium">
                {data.evaluation.improvements.map((imp, idx) => (
                  <li key={idx}>&bull; {imp}</li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* AI Recommendations & detailed answer view */}
        <div className="glass-panel rounded-3xl p-8 space-y-8">
          <h3 className="text-base font-bold text-white border-b border-white/5 pb-4 flex items-center gap-2">
            <Brain className="h-4.5 w-4.5 text-primary" /> Question-by-Question Response Audit
          </h3>

          <div className="rounded-2xl bg-white/2 border border-white/5 p-6 space-y-4">
            {/* Header score block */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
              <span className="text-xs font-bold text-white">Question: {data.question}</span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full text-right ${
                data.evaluation.overall_score >= 90
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : data.evaluation.overall_score >= 80
                  ? 'bg-amber-500/10 text-amber-400'
                  : 'bg-red-500/10 text-red-400'
              }`}>
                Answer Score: {data.evaluation.overall_score}%
              </span>
            </div>

            {/* Response Text */}
            <div className="space-y-2">
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Your Response:</div>
              <p className="text-xs text-gray-300 font-medium italic leading-relaxed">
                &ldquo;{data.answer}&rdquo;
              </p>
            </div>

            {/* AI Summary and Recommendation */}
            <div className="space-y-2 bg-primary-glow/5 border border-primary/10 rounded-xl p-4">
              <div className="text-[10px] text-primary font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 animate-pulse" /> AI recommendation & summary
              </div>
              <p className="text-xs text-gray-400 leading-relaxed font-medium">
                {data.evaluation.summary}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
