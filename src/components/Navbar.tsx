'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Menu, X, ArrowRight, User, Settings, HelpCircle } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Select Role', href: '/roles' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="glass-panel flex items-center justify-between rounded-2xl px-6 py-3.5 shadow-2xl">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-accent shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              <Brain className="h-5 w-5 text-white" />
              <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="font-sans text-xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
              Mock<span className="text-primary font-extrabold">Mate</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative text-sm font-medium transition-colors duration-300 hover:text-white ${
                    isActive ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/roles"
              className="relative inline-flex items-center gap-1.5 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-accent px-4.5 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.25)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.45)] hover:scale-[1.02] active:scale-[0.98] group"
            >
              Start Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                <User className="h-4.5 w-4.5" />
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2.5 w-56 origin-top-right rounded-2xl border border-white/10 bg-bg-darker/95 p-2 shadow-2xl backdrop-blur-xl z-50"
                    >
                      <div className="px-3.5 py-3 border-b border-white/5">
                        <p className="text-xs text-gray-500 font-medium">Signed in as</p>
                        <p className="text-sm font-semibold text-white truncate">vasan@mockmate.ai</p>
                      </div>
                      <div className="py-1">
                        <button className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                          <Settings className="h-4 w-4" />
                          Settings
                        </button>
                        <button className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                          <HelpCircle className="h-4 w-4" />
                          Help Center
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:text-white md:hidden"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-24 z-50 rounded-2xl border border-white/10 bg-bg-darker/95 p-6 shadow-2xl backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-5.5">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-base font-medium transition-colors ${
                    pathname === link.href ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-white/10 my-1" />
              <Link
                href="/roles"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-accent py-3 text-sm font-semibold text-white shadow-lg"
              >
                Start Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
