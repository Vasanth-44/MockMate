'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Play,
  Mic,
  MicOff,
  Send,
  Loader2,
  ChevronRight,
  AlertCircle,
  HelpCircle,
  Clock,
  CheckCircle,
  ArrowLeft,
  Settings,
  Info,
  UploadCloud,
  FileText,
  Sparkles,
  Check,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import GridBackground from '@/components/GridBackground';
import { evaluateAnswer, uploadResume, ResumeAnalysisResponse } from '@/lib/api';

interface Message {
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

interface QuestionScript {
  question: string;
  sampleTranscriptions: string[];
}

const INTERVIEW_SCRIPTS: Record<string, QuestionScript[]> = {
  frontend: [
    {
      question: "Welcome! Let's start with React internals. Can you explain how the Virtual DOM works and why React uses it?",
      sampleTranscriptions: [
        "The Virtual DOM is a lightweight JS copy of the real DOM. When state changes, React creates a new virtual tree, diffs it with the previous one to find differences, and only updates those changed parts in the actual DOM. This is much faster than full page re-renders.",
        "React uses a virtual DOM to minimize direct updates to the DOM tree, which are expensive. By comparing virtual nodes via reconciliation, it updates the browser efficiently."
      ]
    },
    {
      question: "Good. Following up on rendering, what is the difference between client-side rendering (CSR) and server-side rendering (SSR)? When would you choose one over the other?",
      sampleTranscriptions: [
        "CSR renders HTML in the browser using JavaScript, while SSR pre-renders pages on the server for each request. I would choose SSR for public pages needing high SEO and faster initial load, and CSR for private client dashboards.",
        "SSR is better for SEO and initial page load because the server returns fully formed HTML. CSR is better for highly interactive apps where page loading layout shifts must be avoided."
      ]
    },
    {
      question: "Excellent. Let's talk about performance. What is React Hydration, and what are common hydration errors you might run into in a Next.js app?",
      sampleTranscriptions: [
        "Hydration is the process of attaching event listeners to the server-rendered HTML. Common hydration errors happen when the server-rendered markup doesn't match the client markup, like using window check or Date objects that differ.",
        "Hydration errors occur when the pre-rendered HTML on server differs from the initial client render. This can be caused by conditional styling based on browser API before component mounts."
      ]
    },
    {
      question: "Perfect. How do you optimize image loading and general Core Web Vitals (like LCP and CLS) in Next.js applications?",
      sampleTranscriptions: [
        "In Next.js, we use the next/image component which handles lazy loading, responsive sizes, and WebP format automatically. To avoid Cumulative Layout Shift (CLS), we should always specify width and height values.",
        "We optimize Core Web Vitals using Next.js Image component, font optimization via Google variable fonts, and utilizing dynamic imports for large client components to reduce bundle size."
      ]
    },
    {
      question: "Great. Last question: How do you approach state management in a large-scale React application? When do you choose Context API vs. Zustand/Redux?",
      sampleTranscriptions: [
        "For global themes or auth status, I use React Context. For complex, high-frequency state updates like maps, filters, or gaming UI, I choose Zustand or Redux to prevent unnecessary re-renders of the component tree.",
        "I use Context API for simpler state that doesn't update frequently. For fast state updates across many disconnected views, I prefer Zustand because it has a smaller footprint and handles selectors better."
      ]
    }
  ],
  backend: [
    {
      question: "Welcome! Let's start with API architecture. What is the difference between REST, GraphQL, and gRPC? In what scenarios would you choose each?",
      sampleTranscriptions: [
        "REST is standard HTTP using JSON for resource endpoints. GraphQL is query-based, letting clients ask for exactly what they need. gRPC uses HTTP/2 and protocol buffers, which is excellent for high-performance internal microservices.",
        "I would choose REST for standard public APIs, GraphQL for mobile clients with low bandwidth, and gRPC for backend-to-backend communication inside microservices."
      ]
    },
    {
      question: "Nice. Let's discuss database performance. Explain the differences between SQL indexes, when you should apply them, and how they can affect write performance.",
      sampleTranscriptions: [
        "SQL indexes speed up read operations by creating lookup tables, but they slow down write operations (like INSERT, UPDATE) because the index needs to be rebuilt on every write. Apply them on frequently queried fields.",
        "Indexes should be placed on foreign keys or fields in WHERE clauses. Avoid indexing every column because it consumes storage and increases transaction times."
      ]
    },
    {
      question: "Good. How do you handle distributed transactions across multiple microservices to maintain data consistency? Have you worked with the Saga Pattern?",
      sampleTranscriptions: [
        "To maintain consistency, we can use the Saga Pattern, which splits a transaction into a sequence of local service transactions. Each service publishes an event, and if one fails, compensating transactions undo previous steps.",
        "I prefer using event-driven architectures with transactional outbox patterns or Saga orchestrations to manage rolling back steps in secondary services when a step fails."
      ]
    },
    {
      question: "Excellent. Let's talk caching. What is cache stampede, and what strategies do you implement in a Redis-backed API to mitigate it?",
      sampleTranscriptions: [
        "Cache stampede occurs when many concurrent requests query a cache miss simultaneously, overloading the DB. We can mitigate this using locking, probabilistic early expiration, or pre-populating background workers.",
        "To avoid stampedes, we set up mutex locks around cache misses so only one worker queries the database while others wait, or we run background crons to refresh keys before they expire."
      ]
    },
    {
      question: "Great. Last question: How do you design APIs for high rate-limiting and handle protection against distributed DDoS attacks?",
      sampleTranscriptions: [
        "We implement rate-limiting using Token Bucket or Leaky Bucket algorithms, often stored in Redis. For DDoS, we set up Web Application Firewalls (WAF), Cloudflare protections, and API gateways for request throttling.",
        "Rate-limiting is implemented at the API Gateway level using Redis. We can block abusive IPs, throttle excessive requests, and set up load balancers to distribute traffic."
      ]
    }
  ]
};

const DEFAULT_SCRIPT: QuestionScript[] = [
  {
    question: "Welcome to your behavioral and technical screening. Let's start with your background. Can you describe a challenging project you worked on recently, what obstacles you faced, and how you resolved them?",
    sampleTranscriptions: [
      "In my recent project, we faced a memory leak in our WebSocket server that caused containers to crash under heavy load. I used heap profiling and discovered a listener leak in our event emitter, which I fixed by cleaning up listeners during teardown.",
      "I built a real-time tracking dashboard. The obstacle was handling 10k ticks per second without blocking the main loop. I resolved it by implementing batching and rendering updates on a requestAnimationFrame scheduler."
    ]
  },
  {
    question: "Thank you. How do you handle constructive criticism or technical disagreements when designing system architectures with other senior developers?",
    sampleTranscriptions: [
      "I focus on objective trade-offs: performance, scalability, and code maintainability. I set up small benchmarks to let data guide our decisions, and always compromise if it aligns with the project goals.",
      "I listen first to understand their rationale. Technical differences are normal; documenting the pros/cons of both choices helps align the team without personal arguments."
    ]
  },
  {
    question: "Good. Can you describe a scenario where you had to ship a feature under tight deadlines but had to balance it against accumulative technical debt? How did you manage?",
    sampleTranscriptions: [
      "We had to ship an analytics MVP in a week. I chose to use a monolithic service instead of microservices. I documented the trade-offs, created Jira tickets for code cleanup, and refactored the pipeline two weeks later.",
      "I balance urgency by writing clean interfaces. Even if the internal implementation is simple or hacked, keeping clean APIs lets us rewrite the underlying queries later without breaking other dependencies."
    ]
  },
  {
    question: "Excellent. Where do you see your technical skillset evolving over the next two years? What frameworks or methodologies are you looking to master?",
    sampleTranscriptions: [
      "I am focusing on distributed systems and AI integration, specifically understanding vector databases and LLM orchestration tools like LangChain to build semantic search engines.",
      "I plan to deepen my knowledge in DevOps, specifically Terraform and Kubernetes clustering, to better architect zero-downtime microservices and manage scaling."
    ]
  },
  {
    question: "Great. Finally, why do you want to join our engineering organization, and what key values do you bring to a fast-scaling tech team?",
    sampleTranscriptions: [
      "I value engineering excellence and shipping features fast. Your focus on developer tooling aligns with my passion for building high-performance client interfaces and scalable architectures.",
      "I bring a mix of strong technical ownership, mentorship for junior devs, and a product-focused mind that values shipping stable code that delivers user value."
    ]
  }
];

export default function InterviewPage() {
  const params = useParams();
  const router = useRouter();
  const roleId = (params.role as string) || 'frontend';

  // Setup / Resume upload states
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'success' | 'error'>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [customQuestions, setCustomQuestions] = useState<string[]>([]);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResponse | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Active Interview States
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeQuestion, setActiveQuestion] = useState<string>('');
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Derive active script based on custom resume questions or defaults
  const currentScript = customQuestions.length > 0
    ? customQuestions.map(q => ({
        question: q,
        sampleTranscriptions: [
          "This is a personalized question based on my resume projects. I solved this by choosing suitable database schemas and standard optimizations.",
          "Based on my experience, I resolved this by coordinating with developers, dividing tasks, and scheduling clear review checkpoints."
        ]
      }))
    : (INTERVIEW_SCRIPTS[roleId] || DEFAULT_SCRIPT);

  // Initialize Interview Chat once Setup is Complete
  useEffect(() => {
    if (!isSetupComplete) return;

    // Start timer
    timerRef.current = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    // Get the first question from script
    const firstQ = currentScript[0]?.question || "Welcome! Let's begin the interview.";
    setActiveQuestion(firstQ);

    // Initial AI message
    setIsThinking(true);
    const welcomeTimer = setTimeout(() => {
      setMessages([
        {
          sender: 'ai',
          text: firstQ,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsThinking(false);
    }, 1500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      clearTimeout(welcomeTimer);
    };
  }, [isSetupComplete, customQuestions]);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Format Timer
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Drag and Drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setUploadError(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type !== "application/pdf") {
        setUploadError("Please upload a valid PDF resume.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        setUploadError("Please upload a valid PDF resume.");
        return;
      }
      setSelectedFile(file);
    }
  };

  // Call API to analyze resume
  const handleAnalyzeResume = async () => {
    if (!selectedFile) return;
    setUploadError(null);
    setUploadStatus('uploading');

    try {
      // Simulate progress indicator ticks
      const progressTimer = setTimeout(() => {
        setUploadStatus('analyzing');
      }, 1500);

      const response = await uploadResume(selectedFile, roleId);
      clearTimeout(progressTimer);

      setUploadStatus('success');
      setAnalysisResult(response);
      
      // Combine 5 technical and 3 behavioral questions
      const combinedQs = [...response.technical_questions, ...response.behavioral_questions];
      setCustomQuestions(combinedQs);

      // Save in localStorage for the feedback system or persistence
      localStorage.setItem('mockmate-resume-analysis', JSON.stringify({
        role: roleId,
        analysis: response
      }));

      // Delay transition to chat so success animation can be seen
      setTimeout(() => {
        setIsSetupComplete(true);
      }, 1500);

    } catch (err: any) {
      console.error(err);
      setUploadStatus('error');
      setUploadError(err.message || "Resume analysis failed. Try again.");
    }
  };

  const handleSkipSetup = () => {
    setCustomQuestions([]);
    setIsSetupComplete(true);
  };

  // Mock Voice Recording - Populates input with realistic text
  const handleVoiceToggle = () => {
    if (isVoiceRecording) {
      setIsVoiceRecording(false);
      const questionObj = currentScript.find(q => q.question === activeQuestion) || currentScript[0];
      const randomAns = questionObj.sampleTranscriptions[
        Math.floor(Math.random() * questionObj.sampleTranscriptions.length)
      ];
      setInputText(randomAns);
    } else {
      setIsVoiceRecording(true);
      setInputText('');
    }
  };

  // Submit Answer
  const handleSendMessage = async () => {
    if (!inputText.trim() || isThinking) return;

    setError(null);
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage = inputText;
    
    // Append user message
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage, timestamp }]);
    setInputText('');
    setIsThinking(true);

    try {
      const evaluation = await evaluateAnswer(activeQuestion, userMessage);
      
      const feedbackData = {
        role: roleId,
        question: activeQuestion,
        answer: userMessage,
        evaluation: evaluation,
        timestamp: new Date().toISOString(),
        timeElapsed: formatTime(secondsElapsed)
      };
      
      localStorage.setItem('mockmate-feedback', JSON.stringify(feedbackData));
      router.push('/feedback');
    } catch (err) {
      console.error(err);
      setError('Unable to evaluate response right now.');
      setIsThinking(false);
    }
  };

  // End Interview Early
  const handleEndInterview = () => {
    const confirmEnd = window.confirm("Are you sure you want to end the interview? You will return to role selection.");
    if (confirmEnd) {
      router.push('/roles');
    }
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

  return (
    <div className="relative min-h-screen flex flex-col">
      <GridBackground />

      <AnimatePresence mode="wait">
        {!isSetupComplete ? (
          <motion.div
            key="setup-screen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="flex-grow flex items-center justify-center p-4 md:p-6"
          >
            <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-6 pb-12">
              
              {/* Left Column: Dropzone */}
              <div className="lg:col-span-7 flex flex-col justify-between glass-panel rounded-3xl p-6 md:p-8 space-y-6">
                
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Link
                      href="/roles"
                      className="h-8 w-8 rounded-lg border border-white/5 bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Configure Track</span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                    Personalize with your Resume
                  </h1>
                  <p className="text-xs text-gray-400 font-medium">
                    Upload your resume to let MockMate AI generate custom interview scenarios based on your projects, background, and tech stack.
                  </p>
                </div>

                {/* Dropzone area */}
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center space-y-4 relative overflow-hidden ${
                    dragActive
                      ? 'border-primary bg-primary-glow/10 shadow-[0_0_25px_rgba(139,92,246,0.15)] scale-[1.01]'
                      : 'border-white/10 bg-white/2 hover:border-white/20 hover:bg-white/5'
                  } ${uploadStatus !== 'idle' && uploadStatus !== 'error' ? 'pointer-events-none' : ''}`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf"
                    className="hidden"
                  />
                  
                  {uploadStatus === 'idle' || uploadStatus === 'error' ? (
                    <>
                      <div className="h-14 w-14 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 shadow-inner">
                        <UploadCloud className="h-7 w-7" />
                      </div>
                      <div>
                        {selectedFile ? (
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-white flex items-center justify-center gap-1.5">
                              <FileText className="h-4 w-4 text-primary" /> {selectedFile.name}
                            </p>
                            <p className="text-[10px] text-gray-500">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-gray-200">
                              Drag & Drop your resume here, or <span className="text-primary hover:underline">browse</span>
                            </p>
                            <p className="text-[10px] text-gray-500">Supports PDF only (Max 5MB)</p>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4 w-full max-w-xs py-4">
                      <div className="h-10 w-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                      <div className="space-y-1.5">
                        <p className="text-sm font-bold text-white uppercase tracking-wider animate-pulse">
                          {uploadStatus === 'uploading' ? 'Uploading PDF...' : 'AI Analyzing Profile...'}
                        </p>
                        <div className="text-[10px] text-gray-400 space-y-1">
                          <p className="flex items-center justify-center gap-1">
                            {uploadStatus === 'analyzing' ? <Check className="h-3 w-3 text-emerald-400" /> : <Loader2 className="h-3 w-3 animate-spin text-primary" />}
                            Extracting PDF document structure
                          </p>
                          <p className="flex items-center justify-center gap-1">
                            {uploadStatus === 'analyzing' ? <Loader2 className="h-3 w-3 animate-spin text-primary" /> : <div className="h-1.5 w-1.5 rounded-full bg-gray-500" />}
                            Analyzing skills and experience tags via Gemini
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Glass overlay on success */}
                  {uploadStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-bg-dark/95 backdrop-blur-sm flex flex-col items-center justify-center space-y-3"
                    >
                      <div className="h-12 w-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-bounce">
                        <Check className="h-6 w-6" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-sm font-bold text-white">Analysis Complete!</h3>
                        <p className="text-[10px] text-gray-500">8 personalized questions generated.</p>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Error Banner */}
                {uploadError && (
                  <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* Bottom Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleAnalyzeResume}
                    disabled={!selectedFile || uploadStatus !== 'idle'}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-accent py-4 text-sm font-bold text-white shadow-lg transition-transform active:scale-98 disabled:opacity-40 disabled:scale-100 disabled:shadow-none"
                  >
                    <Sparkles className="h-4 w-4" />
                    Analyze Resume
                  </button>
                  <button
                    onClick={handleSkipSetup}
                    disabled={uploadStatus !== 'idle' && uploadStatus !== 'error'}
                    className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-xs font-semibold text-white hover:bg-white/10 disabled:opacity-40"
                  >
                    Skip & Use Defaults
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

              </div>

              {/* Right Column: Information panel */}
              <div className="lg:col-span-5 flex flex-col justify-between glass-panel rounded-3xl p-6.5 bg-gradient-to-br from-violet-950/20 via-indigo-950/10 to-transparent border-violet-500/10 space-y-6">
                
                {/* Features List */}
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
                    <Brain className="h-4.5 w-4.5 text-primary animate-pulse" />
                    AI Personalization Engine
                  </h3>

                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0 mt-0.5">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-200 leading-tight">Tailored Tech Stack</h4>
                        <p className="text-[10px] text-gray-400 mt-1 leading-normal">
                          Gemini extracts tools and frameworks listed in your projects to formulate specific syntax and architectural questions.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
                        <Settings className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-200 leading-tight">Seniority Calibration</h4>
                        <p className="text-[10px] text-gray-400 mt-1 leading-normal">
                          Adjusts the depth and technical complexity of the questions according to your detected years of experience.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-lg bg-fuchsia-500/20 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 shrink-0 mt-0.5">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-200 leading-tight">Project-Based Drilling</h4>
                        <p className="text-[10px] text-gray-400 mt-1 leading-normal">
                          Generates behavioral questions directly tied to projects listed on your resume, challenging your decision-making boundary.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Default Script Preview */}
                <div className="rounded-2xl bg-white/3 border border-white/5 p-4.5 space-y-2.5">
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                    Or select default {getRoleTitle(roleId)} track:
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                    Skip setup to practice generic developer track (5 standardized questions covering hydration, state, rendering, and performance caching rubrics).
                  </p>
                </div>

              </div>

            </div>
          </motion.div>
        ) : (
          <motion.div
            key="interview-screen"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-grow flex flex-col"
          >
            <div className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Sidebar */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* Back button and title */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (window.confirm("Return to setup page? This will reset the active chat.")) {
                        setIsSetupComplete(false);
                        setMessages([]);
                        setSelectedFile(null);
                        setUploadStatus('idle');
                      }
                    }}
                    className="h-9 w-9 rounded-xl border border-white/5 bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="h-4.5 w-4.5" />
                  </button>
                  <div>
                    <span className="text-[10px] text-primary font-bold uppercase tracking-wider">
                      {analysisResult ? `Seniority: ${analysisResult.experience_level}` : 'Live Simulator'}
                    </span>
                    <h2 className="text-base font-bold text-white leading-tight">{getRoleTitle(roleId)}</h2>
                  </div>
                </div>

                {/* Status Panel */}
                <div className="glass-panel rounded-3xl p-6 space-y-6">
                  {/* Timer */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <span className="text-xs text-gray-400 font-semibold flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-primary" /> Elapsed Time
                    </span>
                    <span className="text-base font-mono font-bold text-white">{formatTime(secondsElapsed)}</span>
                  </div>

                  {/* Progress */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-semibold text-gray-400">
                      <span>Questions Completed</span>
                      <span className="text-white">{messages.some(m => m.sender === 'user') ? 1 : 0} of 1</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-accent"
                        initial={{ width: 0 }}
                        animate={{ width: messages.some(m => m.sender === 'user') ? '100%' : '50%' }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                  </div>

                  {/* Question Checklist */}
                  <div className="space-y-3">
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center justify-between">
                      <span>Interview Checklist</span>
                      <span className="text-primary">{currentScript.length} total</span>
                    </div>
                    
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                      {currentScript.map((scriptItem, idx) => {
                        const isCurrent = scriptItem.question === activeQuestion;
                        return (
                          <button
                            key={idx}
                            disabled={isThinking}
                            onClick={() => {
                              setActiveQuestion(scriptItem.question);
                              setMessages([
                                {
                                  sender: 'ai',
                                  text: scriptItem.question,
                                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                }
                              ]);
                            }}
                            className={`w-full text-left flex items-start gap-2 p-2 rounded-xl border transition-all text-[11px] font-semibold ${
                              isCurrent
                                ? 'border-primary/30 bg-primary-glow/10 text-primary shadow-[0_0_10px_rgba(139,92,246,0.15)]'
                                : 'border-white/5 bg-white/2 text-gray-400 hover:border-white/10 hover:text-gray-300 disabled:opacity-50'
                            }`}
                          >
                            <span className="shrink-0 mr-1.5 text-gray-500 font-mono">Q{idx + 1}:</span>
                            <span className="truncate flex-1">{scriptItem.question}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Resume Summary Card */}
                {analysisResult && (
                  <div className="glass-panel rounded-3xl p-6 bg-gradient-to-br from-violet-950/20 via-indigo-950/10 to-transparent border-violet-500/10 space-y-3">
                    <h3 className="text-xs font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" /> AI Candidate Profile
                    </h3>
                    <p className="text-[11px] text-gray-300 leading-relaxed font-semibold italic">
                      &ldquo;{analysisResult.summary}&rdquo;
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {analysisResult.skills.slice(0, 5).map((skill) => (
                        <span key={skill} className="text-[9px] font-mono bg-white/5 border border-white/5 text-gray-400 px-1.5 py-0.5 rounded">
                          #{skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tips Card */}
                <div className="glass-panel rounded-3xl p-6 bg-gradient-to-br from-violet-950/20 via-indigo-950/10 to-transparent border-violet-500/10 space-y-3">
                  <h3 className="text-xs font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Info className="h-3.5 w-3.5" /> Interviewer Tips
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed font-medium">
                    Structure technical answers using the <strong className="text-gray-300">STAR Method</strong> (Situation, Task, Action, Result) or discuss performance trade-offs directly to score higher.
                  </p>
                </div>
              </div>

              {/* Main Chat Interface */}
              <div className="lg:col-span-8 flex flex-col justify-between glass-panel rounded-3xl overflow-hidden border border-white/5">
                
                {/* Chat Header */}
                <div className="bg-white/3 border-b border-white/5 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <div>
                      <span className="text-xs font-bold text-gray-200">AI Interviewer — Active</span>
                      <p className="text-[10px] text-gray-500 font-medium">Evaluating response clarity</p>
                    </div>
                  </div>
                  <button
                    onClick={handleEndInterview}
                    className="text-xs font-bold border border-red-500/20 bg-red-500/10 text-red-400 px-3.5 py-1.5 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-[0.98]"
                  >
                    End Interview
                  </button>
                </div>

                {/* Chat Bubble Stream */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 max-h-[500px]">
                  <AnimatePresence mode="popLayout">
                    {messages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl p-4.5 text-sm font-medium leading-relaxed relative ${
                            msg.sender === 'user'
                              ? 'bg-gradient-to-r from-primary to-accent text-white rounded-br-none shadow-[0_5px_15px_rgba(139,92,246,0.15)]'
                              : 'bg-white/5 border border-white/5 text-gray-300 rounded-bl-none'
                          }`}
                        >
                          <p>{msg.text}</p>
                          <span className="absolute bottom-1 right-3.5 text-[8px] text-white/40 font-mono">
                            {msg.timestamp}
                          </span>
                        </div>
                      </motion.div>
                    ))}

                    {/* AI Thinking Animation */}
                    {isThinking && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex justify-start"
                      >
                        <div className="bg-white/5 border border-white/5 text-gray-400 rounded-2xl rounded-bl-none p-4 flex items-center gap-3">
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          <span className="text-xs font-semibold tracking-wide">Analyzing your response...</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div ref={chatEndRef} />
                </div>

                {/* Input Panel */}
                <div className="border-t border-white/5 p-4.5 bg-white/2">
                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-semibold flex items-center gap-2"
                      >
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Listening state wave visualizer */}
                  <AnimatePresence>
                    {isVoiceRecording && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 50 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center justify-center gap-1.5 mb-4 overflow-hidden"
                      >
                        {[...Array(9)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-1 rounded-full bg-primary"
                            animate={{
                              height: [12, 38, 12],
                            }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: 'easeInOut',
                              delay: i * 0.1,
                            }}
                          />
                        ))}
                        <span className="text-xs text-primary font-bold ml-3 animate-pulse">
                          Listening... Speak your answer now. Click mic again to finish.
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex gap-3">
                    {/* Mic toggle */}
                    <button
                      onClick={handleVoiceToggle}
                      disabled={isThinking}
                      className={`h-12 w-12 rounded-xl flex items-center justify-center border transition-all ${
                        isVoiceRecording
                          ? 'bg-red-500 border-red-600 text-white animate-pulse'
                          : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-40'
                      }`}
                    >
                      {isVoiceRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </button>

                    {/* Text input */}
                    <input
                      type="text"
                      placeholder={isThinking ? "Analyzing your response..." : isVoiceRecording ? "Speaking... speak clearly" : "Type your answer here..."}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      disabled={isVoiceRecording || isThinking}
                      className="flex-1 bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
                    />

                    {/* Send Button */}
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputText.trim() || isVoiceRecording || isThinking}
                      className="h-12 w-12 rounded-xl bg-gradient-to-r from-primary to-accent text-white flex items-center justify-center shadow-lg transition-transform active:scale-95 disabled:opacity-40 disabled:scale-100 disabled:shadow-none"
                    >
                      <Send className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
