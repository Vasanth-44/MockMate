'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  ArrowRight,
  Code,
  Server,
  Layers,
  Terminal,
  Database,
  Users,
  Cpu,
  Brain,
  Star,
  Activity
} from 'lucide-react';
import GridBackground from '@/components/GridBackground';

interface Role {
  id: string;
  title: string;
  category: 'Technical' | 'Data' | 'Behavioral';
  icon: React.ReactNode;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questionCount: number;
  durationMin: number;
  tags: string[];
}

export default function RolesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Technical' | 'Data' | 'Behavioral'>('All');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roles: Role[] = [
    {
      id: 'frontend',
      title: 'Frontend Developer',
      category: 'Technical',
      icon: <Code className="h-6 w-6 text-sky-400" />,
      description: 'Test your knowledge on React, Next.js architecture, Hydration, rendering performance, state management, and CSS.',
      difficulty: 'Medium',
      questionCount: 5,
      durationMin: 20,
      tags: ['React', 'Next.js', 'Web Perf', 'CSS']
    },
    {
      id: 'backend',
      title: 'Backend Developer',
      category: 'Technical',
      icon: <Server className="h-6 w-6 text-emerald-400" />,
      description: 'Focuses on databases, REST APIs, GraphQL, microservices, load balancing, caching, and server security setups.',
      difficulty: 'Hard',
      questionCount: 6,
      durationMin: 25,
      tags: ['Node.js', 'PostgreSQL', 'Caching', 'APIs']
    },
    {
      id: 'fullstack',
      title: 'Full Stack Developer',
      category: 'Technical',
      icon: <Layers className="h-6 w-6 text-purple-400" />,
      description: 'Covers database schemas, server structures, client caching, state pipelines, authentication, and hosting models.',
      difficulty: 'Hard',
      questionCount: 6,
      durationMin: 25,
      tags: ['React', 'Node.js', 'Auth', 'Deployment']
    },
    {
      id: 'python',
      title: 'Python Developer',
      category: 'Technical',
      icon: <Terminal className="h-6 w-6 text-yellow-400" />,
      description: 'Practice algorithms, data structures, asyncio, OOP design patterns, clean coding styles, and Python internals.',
      difficulty: 'Medium',
      questionCount: 5,
      durationMin: 15,
      tags: ['Python', 'Django', 'Asyncio', 'OOP']
    },
    {
      id: 'data-analyst',
      category: 'Data',
      title: 'Data Analyst',
      icon: <Database className="h-6 w-6 text-fuchsia-400" />,
      description: 'Sharpen your skills in SQL querying, join structures, indexing, data visualization principles, and dashboard metrics.',
      difficulty: 'Medium',
      questionCount: 5,
      durationMin: 20,
      tags: ['SQL', 'Tableau', 'Metrics', 'Analytics']
    },
    {
      id: 'hr',
      title: 'HR & Behavioral',
      category: 'Behavioral',
      icon: <Users className="h-6 w-6 text-pink-400" />,
      description: 'Standard HR competency screening. Focuses on leadership principles, conflict management, career vision, and salary expectations.',
      difficulty: 'Easy',
      questionCount: 5,
      durationMin: 15,
      tags: ['Leadership', 'STAR Method', 'EQ', 'Culture Fit']
    },
    {
      id: 'ml-engineer',
      title: 'Machine Learning Engineer',
      category: 'Technical',
      icon: <Cpu className="h-6 w-6 text-violet-400" />,
      description: 'Covers deep learning nodes, neural network architectures, model training, bias mitigation, data pipelines, and PyTorch.',
      difficulty: 'Hard',
      questionCount: 6,
      durationMin: 30,
      tags: ['PyTorch', 'CNNs', 'NLP', 'Data Pipelines']
    }
  ];

  const filteredRoles = roles.filter((role) => {
    const matchesSearch = role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || role.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative min-h-screen py-12 px-4 md:px-8">
      <GridBackground />

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center md:text-left space-y-4 mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary-glow px-4 py-1 text-xs font-semibold text-primary">
            <Brain className="h-3.5 w-3.5" />
            Interview Catalog
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Choose Your Interview Persona
          </h1>
          <p className="text-gray-400 max-w-xl font-medium">
            Select a specialized role track. Each scenario generates unique questions, rubrics, and difficulty profiles.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="glass-panel rounded-2xl p-4 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-500" />
            <input
              type="text"
              placeholder="Search roles or technologies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Category Filters */}
          <div className="flex bg-white/5 border border-white/5 p-1 rounded-xl w-full md:w-auto overflow-x-auto gap-1">
            {(['All', 'Technical', 'Data', 'Behavioral'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-semibold px-4.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-primary to-accent text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Roles */}
        {filteredRoles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoles.map((role) => {
              const isSelected = selectedRole === role.id;
              return (
                <motion.div
                  key={role.id}
                  layoutId={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`glass-panel rounded-3xl p-6.5 text-left transition-all duration-300 flex flex-col justify-between min-h-[290px] relative cursor-pointer group ${
                    isSelected
                      ? 'border-primary ring-[1px] ring-primary bg-bg-dark border-[1.5px] shadow-[0_0_30px_rgba(139,92,246,0.2)]'
                      : 'hover:border-white/15'
                  }`}
                  whileHover={{ y: -4 }}
                >
                  {/* Selected glow indicator */}
                  {isSelected && (
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-primary/5 to-accent/5 pointer-events-none" />
                  )}

                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className={`h-11 w-11 rounded-2xl flex items-center justify-center bg-white/5 border border-white/5 text-gray-300 group-hover:scale-105 transition-transform duration-300 ${
                        isSelected ? 'bg-primary-glow border-primary/20 text-primary' : ''
                      }`}>
                        {role.icon}
                      </div>
                      <div className="flex gap-2">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${
                          role.difficulty === 'Easy'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : role.difficulty === 'Medium'
                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                            : 'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}>
                          {role.difficulty}
                        </span>
                        <span className="text-[10px] text-gray-500 bg-white/5 px-2.5 py-1 rounded-md font-bold">
                          {role.category}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors duration-300">
                        {role.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-2.5 leading-relaxed">
                        {role.description}
                      </p>
                    </div>
                  </div>

                  {/* Footer tags and start action */}
                  <div className="mt-6 border-t border-white/5 pt-4">
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {role.tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-mono font-medium bg-white/5 border border-white/5 text-gray-500 px-2 py-0.5 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs font-semibold text-gray-400">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Activity className="h-3.5 w-3.5" />
                          {role.questionCount} Questions
                        </span>
                      </div>

                      <Link
                        href={`/interview/${role.id}`}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-primary to-accent text-white shadow-md'
                            : 'bg-white/5 border border-white/5 text-white hover:bg-white/10'
                        }`}
                      >
                        Launch
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="glass-panel rounded-3xl p-16 text-center max-w-lg mx-auto space-y-4">
            <div className="h-14 w-14 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 mx-auto">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">No roles found</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              We couldn&apos;t find any roles matching &ldquo;{searchQuery}&rdquo;. Try adjusting filters or search queries.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
