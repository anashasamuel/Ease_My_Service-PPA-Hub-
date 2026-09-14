import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MapPin,
  Building2,
  GraduationCap,
  ClipboardCheck,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Users,
  Mail
} from 'lucide-react';
import { NyscBadge } from './NyscBadge';
import nyscCampDrill from '../assets/images/nysc_camp_drill_1789128517338.jpg';
import nyscPopCelebration from '../assets/images/nysc_pop_celebration_1789128531337.jpg';
import nyscPpaWorkplace from '../assets/images/nysc_ppa_workplace_1789128544100.jpg';
import nyscCdsCommunity from '../assets/images/nysc_cds_community_1789128557903.jpg';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  location: string;
  imageUrl: string;
  description: string;
  stats: { label: string; value: string };
}

const SLIDES: Slide[] = [
  {
    id: 1,
    title: 'Pride of the Nation: NYSC Orientation Drills',
    subtitle: 'Building Discipline, National Unity & Youth Leadership',
    badge: 'Real-time Orientation Camp',
    location: 'Lagos, Kaduna & FCT NYSC Permanent Camps',
    // Authentic real-time generated photography of Nigerian corps members on parade ground
    imageUrl: nyscCampDrill,
    description: 'Over 350,000 university graduates deployed each service year across all 36 Nigerian states to foster brotherhood, selflessness, and national patriotism.',
    stats: { label: 'Active Corps Members', value: '350,000+' }
  },
  {
    id: 2,
    title: 'The Triumphant Passing Out Parade (P.O.P)',
    subtitle: 'Celebrating 12 Months of Unflinching Dedication',
    badge: 'Discharge & Honors',
    location: 'Eagle Square & State Secretariats Across Nigeria',
    // Authentic real-time generated photography of corpers in green khaki holding NYSC certificates
    imageUrl: nyscPopCelebration,
    description: 'From orientation camp to PPA completion and 10-month reviews. Corpers proudly receive their NYSC Certificate of National Service.',
    stats: { label: 'Annual Completion Rate', value: '98.6%' }
  },
  {
    id: 3,
    title: 'Impact in Primary Assignment (PPA)',
    subtitle: 'Empowering Tech, Healthcare, Schools & Industries',
    badge: 'Direct Value to Economy',
    location: '36 States & Federal Capital Territory',
    // Real-time photo of corpers collaborating in professional modern working environment
    imageUrl: nyscPpaWorkplace,
    description: 'Matching corpers based on discipline: Computer Scientists in tech hubs, Doctors in rural general hospitals, and Engineers in national infrastructure.',
    stats: { label: 'Registered PPAs', value: '14,200+' }
  },
  {
    id: 4,
    title: 'Community Development Service (CDS)',
    subtitle: 'Touching Grassroots Lives with Dedication and Humility',
    badge: 'Selfless Community Service',
    location: 'All 774 Local Government Areas',
    // Real-time photo of corpers in 7/7 uniform during Community Development Service
    imageUrl: nyscCdsCommunity,
    description: 'Weekly CDS groups combatting health challenges, building community solar libraries, and mentoring younger generations across all geopolitical zones.',
    stats: { label: 'Grassroot LGAs Impacted', value: '774 LGAs' }
  }
];

interface HeroSliderProps {
  onSelectTab: (tab: 'corper' | 'organization' | 'committee' | 'directory' | 'contact' | 'admin' | 'author') => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ onSelectTab }) => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % SLIDES.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  const slide = SLIDES[current];

  return (
    <div
      id="hero-slider-section"
      className="relative w-full overflow-hidden bg-slate-950 text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slider Visual Container */}
      <div className="relative h-[560px] md:h-[640px] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            {/* Background Image with Dark Vignette / Gradient Overlay */}
            <img
              src={slide.imageUrl}
              alt={slide.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-105"
            />
            
            {/* Nigerian Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#022f1a]/85 via-slate-950/70 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Content Box Over Slide */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-between py-12 md:py-16">
          {/* Top Bar inside hero */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-[#C89D3C]/40 text-[#f6d884] text-xs font-semibold tracking-wide shadow-md">
              <NyscBadge size={22} className="shrink-0" />
              <span>{slide.badge}</span>
              <span className="text-white/40">•</span>
              <span className="flex items-center gap-1 text-emerald-200">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {slide.location}
              </span>
            </div>

            {/* Live Stats Pill */}
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
              <div className="text-right">
                <div className="text-xs text-emerald-300 font-medium">{slide.stats.label}</div>
                <div className="text-lg font-bold text-white font-mono">{slide.stats.value}</div>
              </div>
              <div className="p-2 rounded-lg bg-[#008751] text-white">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Main Slide Title & Call to Actions */}
          <div className="max-w-3xl my-auto pt-6">
            <motion.div
              key={`text-${slide.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="inline-block text-emerald-400 font-semibold text-sm md:text-base tracking-wider uppercase mb-2">
                {slide.subtitle}
              </span>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {slide.title}
              </h2>
              <p className="text-slate-200 text-sm sm:text-base md:text-lg leading-relaxed mb-8 max-w-2xl font-normal">
                {slide.description}
              </p>
            </motion.div>

            {/* Quick Action Navigation Buttons */}
            <div className="flex flex-wrap gap-3 sm:gap-4 items-center">
              <button
                id="btn-hero-corper-match"
                onClick={() => onSelectTab('corper')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#008751] hover:bg-[#007043] text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-950/60 border border-emerald-400/40 transition-all hover:scale-105 cursor-pointer"
              >
                <GraduationCap className="w-5 h-5 text-[#f6d884]" />
                <span>Corper PPA Matching Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="btn-hero-org-register"
                onClick={() => onSelectTab('organization')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold text-sm sm:text-base border border-white/20 transition-all cursor-pointer"
              >
                <Building2 className="w-5 h-5 text-emerald-400" />
                <span>Employers & PPA Quota</span>
              </button>

              <button
                id="btn-hero-committee-lgi"
                onClick={() => onSelectTab('committee')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#C89D3C]/20 hover:bg-[#C89D3C]/30 backdrop-blur-md text-[#f6d884] font-semibold text-sm sm:text-base border border-[#C89D3C]/40 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5 text-[#f6d884]" />
                <span>State Committee & LGIs</span>
              </button>

              <button
                id="btn-hero-contact"
                onClick={() => onSelectTab('contact')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/90 backdrop-blur-md text-emerald-200 font-semibold text-sm sm:text-base border border-emerald-500/30 transition-all cursor-pointer"
              >
                <Mail className="w-5 h-5 text-[#f6d884]" />
                <span>Contact & Complaints</span>
              </button>
            </div>
          </div>

          {/* Bottom Controls: Indicators & Navigation Arrows */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrent(idx)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    current === idx
                      ? 'w-9 bg-[#C89D3C]'
                      : 'w-2.5 bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
              <span className="text-xs text-slate-400 font-mono ml-2">
                0{current + 1} / 0{SLIDES.length}
              </span>
            </div>

            {/* Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                aria-label="Previous Slide"
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/15 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next Slide"
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/15 transition-all cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlighting Strip directly under Slider */}
      <div className="bg-emerald-900 border-y border-emerald-800/80 px-4 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-emerald-100">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#f6d884] shrink-0" />
            <span><strong>36 States & FCT Coverage:</strong> Direct access to accredited government, private, and NGO PPAs.</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#f6d884] shrink-0" />
            <span><strong>Discipline & Soft Skills Matcher:</strong> Automatic scoring based on degree and practical skills.</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#f6d884] shrink-0" />
            <span><strong>Quota Transparency:</strong> Live tracking of open vs occupied corper slots per company.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
