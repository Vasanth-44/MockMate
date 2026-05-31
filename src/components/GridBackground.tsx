'use client';

import { motion } from 'framer-motion';

export default function GridBackground() {
  return (
    <div className="absolute inset-0 -z-50 overflow-hidden bg-bg-darker">
      {/* Animated Glowing blobs */}
      <motion.div
        className="absolute -top-[20%] -left-[10%] h-[600px] w-[600px] rounded-full bg-primary/20 blur-[140px]"
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -50, 30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute -bottom-[20%] -right-[10%] h-[600px] w-[600px] rounded-full bg-accent/15 blur-[140px]"
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 60, -30, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute top-[30%] left-[40%] h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[120px]"
        animate={{
          scale: [1, 1.2, 0.8, 1],
          opacity: [0.3, 0.6, 0.3, 0.3],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Grid Overlay with moving effect */}
      <div className="absolute inset-0 bg-grid-dots bg-repeat opacity-75" />

      {/* Linear overlay gradient that provides bottom fade and dark backdrop */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-darker via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg-darker/50 via-transparent to-bg-darker/80" />
    </div>
  );
}
