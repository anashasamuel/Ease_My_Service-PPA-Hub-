import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NyscBadge } from './NyscBadge';
import { CheckCircle2, ChevronRight, ShieldCheck, Sparkles } from 'lucide-react';

interface LoaderProps {
  onComplete: () => void;
  appName?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  onComplete,
  appName = 'Welcome to Ease My NYSC'
}) => {
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Initializing NYSC 36 States & FCT Registry...');

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 450);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 14) + 6;
        if (next > 25 && next < 50) {
          setStatusMessage('Fetching Accredited PPAs & Quotas across Nigeria...');
        } else if (next >= 50 && next < 80) {
          setStatusMessage('Configuring Course Matching Engine & LGI Desks...');
        } else if (next >= 80) {
          setStatusMessage('Ready! Welcome Corp Members, Employers & Committee.');
        }
        return next > 100 ? 100 : next;
      });
    }, 180);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        id="nysc-app-loader"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-radial from-[#054728] via-[#022f1a] to-[#011a0e] text-white px-4 overflow-hidden"
      >
        {/* Decorative background watermarks */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        
        {/* Ambient glow */}
        <div className="absolute w-96 h-96 rounded-full bg-[#008751]/20 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute w-64 h-64 rounded-full bg-[#C89D3C]/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-lg w-full flex flex-col items-center text-center">
          {/* NYSC Animated Crest */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative mb-6"
          >
            <div className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-[#C89D3C]/40 shadow-2xl ring-8 ring-[#008751]/30">
              <NyscBadge size={84} />
            </div>
            
            {/* Spinning orbital ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
              className="absolute -inset-3 rounded-full border border-dashed border-[#C89D3C]/30 pointer-events-none"
            />
          </motion.div>

          {/* Application Name / Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {appName}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C89D3C]/20 border border-[#C89D3C]/40 text-[#f6d884] text-xs font-semibold uppercase tracking-wider mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C89D3C]" />
            Service and Humility • 36 States & FCT
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-emerald-100/80 text-sm max-w-sm mb-8 leading-relaxed italic"
          >
            &ldquo;Under the sun or in the rain, with dedication and selflessness, Nigeria&apos;s ours, Nigeria we serve.&rdquo;
          </motion.p>

          {/* Progress Bar Container */}
          <div className="w-full bg-black/40 p-1.5 rounded-full border border-emerald-500/20 shadow-inner mb-4">
            <div className="w-full bg-emerald-950/80 rounded-full h-3.5 overflow-hidden relative">
              <motion.div
                className="h-full bg-gradient-to-r from-[#008751] via-[#10B981] to-[#C89D3C] rounded-full transition-all duration-300 relative"
                style={{ width: `${progress}%` }}
              >
                {/* Light shimmer */}
                <div className="absolute inset-0 bg-white/25 animate-[shimmer_2s_infinite] [background-size:200%_100%]" />
              </motion.div>
            </div>
          </div>

          {/* Progress Percent & Dynamic Status */}
          <div className="w-full flex items-center justify-between text-xs text-emerald-200/90 font-medium px-1 mb-8">
            <span className="flex items-center gap-1.5 truncate max-w-[320px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              {statusMessage}
            </span>
            <span className="font-mono text-[#f6d884] font-bold">{progress}%</span>
          </div>

          {/* Skip / Direct Enter button */}
          <motion.button
            id="btn-skip-loader"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onComplete}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#008751] hover:bg-[#007043] border border-emerald-400/40 text-white text-sm font-semibold shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
          >
            <span>Proceed to Portal</span>
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Footer verification note */}
        <div className="absolute bottom-6 text-center text-xs text-emerald-300/60 flex items-center justify-center gap-2">
          <span>Official PPA Placement & NYSC Committee Auditing System</span>
          <span>•</span>
          <span>Federal Republic of Nigeria</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
