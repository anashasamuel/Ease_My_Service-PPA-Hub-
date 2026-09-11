import React, { useState } from 'react';
import {
  RotateCcw,
  Sparkles,
  Code2,
  GraduationCap,
  Sprout,
  Palette,
  HeartHandshake,
  Compass,
  ArrowRight,
  ExternalLink,
  MapPin,
  Mail,
  Award,
  CheckCircle2,
  Briefcase
} from 'lucide-react';
import authorImg from '../assets/images/samuel_anasha_1789123011988.jpg';
import { NigeriaFlagIcon, NyscBadge } from './NyscBadge';

interface AboutAuthorProps {
  onBackToApp: () => void;
}

export const AboutAuthor: React.FC<AboutAuthorProps> = ({ onBackToApp }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div id="about-author-page" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Breadcrumb & Page Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#008751]/10 text-[#008751] font-bold text-xs uppercase tracking-wider">
              Profile & Visionary
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 text-xs font-semibold">Ease My NYSC Platform Creator</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
            About The Author
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Meet the innovator behind Ease My NYSC, bridging Nigerian university graduates with transformative service opportunities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="px-4 py-2 rounded-xl bg-[#008751] hover:bg-[#007043] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isFlipped ? 'Flip to Photo Front' : 'Flip to Read Biography'}</span>
          </button>

          <button
            onClick={onBackToApp}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            Back to PPA Directory
          </button>
        </div>
      </div>

      {/* Main Flip Card Container */}
      <div className="flex justify-center items-center py-4">
        {/* 3D Perspective Card Wrapper */}
        <div
          className="w-full max-w-2xl min-h-[640px] perspective-1200 cursor-pointer"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div
            className={`relative w-full h-full duration-700 rounded-3xl transition-transform transform-style-3d shadow-xl border border-slate-200 ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
          >
            {/* FRONT OF THE FLIP CARD */}
            <div
              className={`w-full h-full bg-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between backface-hidden ${
                isFlipped ? 'pointer-events-none' : ''
              }`}
            >
              {/* Header inside Front */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <NyscBadge size={32} />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#008751]">
                    Creator & Social Innovator
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                  <RotateCcw className="w-3.5 h-3.5 text-[#008751]" />
                  <span>Click Anywhere to Flip</span>
                </div>
              </div>

              {/* Author Image */}
              <div className="flex-1 flex flex-col items-center justify-center my-4">
                <div className="relative group max-w-[340px] w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border-2 border-emerald-800/20">
                  <img
                    src={authorImg}
                    alt="Shirgba Samuel SaaAnasha"
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-300 font-semibold mb-0.5">
                      <NigeriaFlagIcon className="w-3.5 h-2.5" />
                      <span>Nigeria • Computer Science & Innovation</span>
                    </div>
                  </div>
                </div>

                {/* Name in Front below the image as requested */}
                <div className="text-center mt-5 space-y-1">
                  <h2
                    className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    Shirgba Samuel SaaAnasha
                  </h2>
                  <p className="text-xs sm:text-sm font-semibold text-[#008751]">
                    Nigerian Technology Enthusiast • Computer Instructor • Social Innovator
                  </p>
                </div>
              </div>

              {/* Front Footer CTA */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Passionate about AI, EdTech & Youth Empowerment</span>
                <span className="inline-flex items-center gap-1 font-bold text-[#008751] hover:underline">
                  <span>Read Full Bio (Flip)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* BACK OF THE FLIP CARD */}
            <div
              className={`absolute inset-0 w-full h-full bg-gradient-to-b from-white via-slate-50 to-emerald-50/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between backface-hidden rotate-y-180 overflow-y-auto ${
                !isFlipped ? 'pointer-events-none' : ''
              }`}
            >
              {/* Back Card Header */}
              <div className="pb-4 border-b border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl overflow-hidden border-2 border-[#008751] shrink-0 shadow-xs">
                    <img
                      src={authorImg}
                      alt="Thumbnail"
                      className="w-full h-full object-cover object-top"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      Shirgba Samuel SaaAnasha
                    </h3>
                    <span className="text-[11px] text-[#008751] font-semibold block">
                      Biography & Impact Philosophy
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-bold">
                  <RotateCcw className="w-3.5 h-3.5 text-[#008751]" />
                  <span>Flip to Photo</span>
                </div>
              </div>

              {/* Exact Requested About Text */}
              <div className="py-4 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <p>
                  <strong>Samuel Anasha</strong> is a Nigerian technology enthusiast, Computer Instructor, and emerging social innovator with a strong passion for using digital technology to create meaningful solutions to real-world challenges. With a background in Computer Science, he is particularly interested in artificial intelligence, software development, digital education, innovation, entrepreneurship, and youth development.
                </p>

                <p>
                  As a Computer Instructor, Samuel is committed to helping young people gain practical digital skills, especially in communities where access to technology and digital knowledge remains limited. His interests extend to developing technology-driven solutions in areas such as education, healthcare, agriculture, employment, and community empowerment.
                </p>

                <p>
                  Samuel has explored several technology projects, including machine-learning applications, online booking platforms, educational technology, and AI-powered agricultural solutions. One of his notable innovation concepts, <strong>AgroShield AI</strong>, seeks to use artificial intelligence, computer vision, weather intelligence, and mobile technologies to help farmers detect crop diseases, anticipate risks, reduce losses, and improve access to market information.
                </p>

                <p>
                  Beyond technology, Samuel has a creative side expressed through graphic design, photography concepts, fashion branding, and visual communication. He is also passionate about youth leadership, volunteering, innovation, and entrepreneurship.
                </p>

                <p className="font-medium text-slate-900 bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200/80">
                  Driven by creativity, learning, and social impact, Samuel aspires to become a technology-driven change-maker who empowers young people and builds scalable solutions capable of improving communities across Nigeria and beyond.
                </p>
              </div>

              {/* Back Card Footer */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                  <NigeriaFlagIcon className="w-4 h-3" />
                  <span>Nigeria • Serving Fatherland with Innovation</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#008751] text-[11px] flex items-center gap-1">
                    <RotateCcw className="w-3 h-3" /> Click card to flip back
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Innovation Highlights Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-[#008751]">
            <Sprout className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">AgroShield AI</h4>
          <p className="text-slate-600 leading-relaxed text-xs">
            Using AI, computer vision, and weather intelligence to detect crop diseases and empower Nigerian smallholder farmers.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-[#C89D3C]">
            <GraduationCap className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Digital Instruction</h4>
          <p className="text-slate-600 leading-relaxed text-xs">
            Democratizing digital skills and practical programming for young people in underserved communities across Nigeria.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
            <Code2 className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Software Innovation</h4>
          <p className="text-slate-600 leading-relaxed text-xs">
            Architect of Ease My NYSC, educational booking systems, and scalable web solutions targeting real-world challenges.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
            <Palette className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Creative Design</h4>
          <p className="text-slate-600 leading-relaxed text-xs">
            Graphic design, visual communication, photography concepts, and youth leadership advocacy.
          </p>
        </div>
      </div>
    </div>
  );
};
