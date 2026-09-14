import React, { useState } from 'react';
import { NyscBadge, NigeriaFlagIcon } from './NyscBadge';
import {
  Music,
  ShieldCheck,
  Heart,
  Mail,
  Phone,
  Share2,
  ExternalLink,
  SlidersHorizontal,
  User,
  Globe
} from 'lucide-react';
import { NIGERIAN_STATES } from '../data/nigeriaStates';
import { SocialHandles } from '../types';

interface FooterProps {
  onSelectState: (state: string) => void;
  onSelectTab: (tab: 'corper' | 'organization' | 'committee' | 'directory' | 'contact' | 'admin' | 'author') => void;
  socialHandles?: SocialHandles;
}

export const Footer: React.FC<FooterProps> = ({ onSelectState, onSelectTab, socialHandles }) => {
  const [showAnthem, setShowAnthem] = useState(false);

  const email = socialHandles?.email || 'anashasamuel@outlook.com';
  const whatsapp = socialHandles?.whatsapp || '+2347064207685';

  return (
    <footer id="main-footer" className="bg-slate-950 text-slate-300 border-t border-emerald-900/60 pt-12 pb-8 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: NYSC Identity & Anthem */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 shadow-sm shrink-0">
                <NyscBadge size={44} />
              </div>
              <div>
                <span className="font-bold text-white text-base block font-sans">Ease My NYSC</span>
                <span className="text-emerald-400 text-xs font-semibold">Service and Humility</span>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed text-xs">
              National Youth Service Corps (NYSC) Primary Assignment (PPA) Recommendation, Quota Monitoring, and State Committee LGI Auditing System for all 36 States & FCT Abuja.
            </p>

            <button
              onClick={() => setShowAnthem(!showAnthem)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-800/80 text-emerald-300 hover:text-white text-xs font-bold cursor-pointer transition-colors"
            >
              <Music className="w-3.5 h-3.5 text-[#C89D3C]" />
              <span>{showAnthem ? 'Hide NYSC Anthem' : 'View NYSC Anthem Lyrics'}</span>
            </button>
          </div>

          {/* Col 2: Fast Portals */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs border-b border-white/10 pb-1.5">
              Portal Directory
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => onSelectTab('corper')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Corper PPA Recommendation & Registration
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('organization')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Employer / Company Quota Registration
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('committee')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  State Committee & Local Government Inspectors (LGIs)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('directory')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  National PPA Quota Directory & 10-Month Reviews
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('contact')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left flex items-center gap-1.5 text-emerald-400 font-semibold"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Contact Help Desk & LGI Complaints</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('admin')}
                  className="hover:text-[#f6d884] transition-colors cursor-pointer text-left flex items-center gap-1.5 text-[#f6d884] font-semibold"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Admin Governance Panel</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Official Social Handles & Support Desk */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs border-b border-white/10 pb-1.5 flex items-center justify-between">
              <span>Official Socials & Support</span>
              <Share2 className="w-3.5 h-3.5 text-[#C89D3C]" />
            </h4>
            <p className="text-slate-400 text-xs">
              For support, LGI re-postings, or quota inquiries, reach out through official channels:
            </p>

            <div className="space-y-2 text-xs">
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{email}</span>
              </a>

              <a
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>WhatsApp: {whatsapp}</span>
              </a>

              {socialHandles?.twitter && (
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="font-bold text-sky-400 font-mono text-[11px]">X:</span>
                  <span>{socialHandles.twitter}</span>
                </div>
              )}

              {socialHandles?.telegram && (
                <a
                  href={socialHandles.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-slate-400 hover:text-sky-300"
                >
                  <Globe className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>Telegram Community Channel</span>
                </a>
              )}
            </div>
          </div>

          {/* Col 4: About The Author (Relocated to bottom section/footer as requested) */}
          <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10">
            <h4 className="font-bold text-[#f6d884] uppercase tracking-wider text-xs border-b border-white/10 pb-1.5 flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#f6d884]" />
              <span>About The Author</span>
            </h4>
            <p className="text-slate-300 text-xs leading-relaxed">
              <strong>Samuel Anasha</strong> is a Nigerian technology enthusiast, Computer Instructor, and emerging social innovator passionate about youth development and digital education.
            </p>
            <button
              onClick={() => onSelectTab('author')}
              className="w-full py-2 px-3 rounded-xl bg-[#008751] hover:bg-[#007043] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <span>Read Samuel Anasha&apos;s Full Bio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Expandable NYSC Anthem */}
        {showAnthem && (
          <div className="p-5 rounded-2xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-100 max-w-2xl mx-auto text-center space-y-2">
            <h5 className="font-bold text-[#f6d884] uppercase tracking-widest text-xs">
              The National Youth Service Corps (NYSC) Anthem
            </h5>
            <p className="italic text-xs leading-relaxed font-serif">
              Youths obey the clarion call, <br />
              Let us lift our high nation, <br />
              Under the sun or in the rain, <br />
              With dedication and selflessness, <br />
              Nigeria&apos;s ours, Nigeria we serve.
            </p>
            <p className="italic text-xs leading-relaxed font-serif pt-1">
              Members, take the great salute, <br />
              Put the Nation first in all, <br />
              Social justice, code of conduct, <br />
              Together we lift our nation high!
            </p>
          </div>
        )}

        {/* Bottom copyright line */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div className="flex items-center gap-2">
            <NigeriaFlagIcon className="w-4 h-3" />
            <span>Ease My NYSC • Developed for Nigerian Youth Service Corpers across 36 States & FCT</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectTab('author')}
              className="text-slate-400 hover:text-[#f6d884] transition-colors cursor-pointer"
            >
              Author Biography
            </button>
            <span>•</span>
            <button
              onClick={() => onSelectTab('contact')}
              className="text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Contact Support
            </button>
            <span>•</span>
            <div className="flex items-center gap-1 text-slate-400">
              <span>Nigeria We Serve</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
