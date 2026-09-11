import React from 'react';
import { NyscBadge, NigeriaFlagIcon } from './NyscBadge';
import {
  GraduationCap,
  Building2,
  ShieldCheck,
  Search,
  Sparkles,
  RefreshCw,
  Award,
  Bell,
  Mail,
  SlidersHorizontal,
  MessageSquare
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'corper' | 'organization' | 'committee' | 'directory' | 'contact' | 'admin' | 'author';
  setActiveTab: (tab: 'corper' | 'organization' | 'committee' | 'directory' | 'contact' | 'admin' | 'author') => void;
  onReplayLoader: () => void;
  selectedState: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onReplayLoader,
  selectedState
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top green utility band */}
      <div className="bg-[#008751] text-white px-4 py-1.5 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <NigeriaFlagIcon className="w-4 h-3" />
            <span className="font-semibold tracking-wide">NATIONAL YOUTH SERVICE CORPS (NYSC)</span>
            <span className="hidden sm:inline text-emerald-200">•</span>
            <span className="hidden sm:inline text-emerald-100 italic">&ldquo;Service and Humility&rdquo;</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1.5 text-emerald-100">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live State: <strong>{selectedState}</strong>
            </span>
            <button
              onClick={onReplayLoader}
              title="Replay intro loader"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-800/60 hover:bg-emerald-800 text-emerald-100 text-[11px] transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Intro Loader</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo & NYSC Emblem */}
          <div
            onClick={() => setActiveTab('directory')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <NyscBadge size={44} className="group-hover:scale-105 transition-transform" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  Ease My <span className="text-[#008751]">NYSC</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#C89D3C]/20 border border-[#C89D3C]/40 text-[#966b14] text-[10px] font-bold tracking-wider uppercase">
                  PPA Hub
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium -mt-0.5">
                Primary Assignment Matcher & Quota Management
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-2xl border border-slate-200">
            <button
              id="nav-tab-directory"
              onClick={() => setActiveTab('directory')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'directory'
                  ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Search className="w-4 h-4 text-emerald-600" />
              <span>All 36 States PPAs</span>
            </button>

            <button
              id="nav-tab-corper"
              onClick={() => setActiveTab('corper')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'corper'
                  ? 'bg-[#008751] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <GraduationCap className={`w-4 h-4 ${activeTab === 'corper' ? 'text-[#f6d884]' : 'text-emerald-600'}`} />
              <span>Corper Dashboard & Matcher</span>
            </button>

            <button
              id="nav-tab-organization"
              onClick={() => setActiveTab('organization')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'organization'
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Building2 className={`w-4 h-4 ${activeTab === 'organization' ? 'text-emerald-300' : 'text-slate-500'}`} />
              <span>Organization / Employer Portal</span>
            </button>

            <button
              id="nav-tab-committee"
              onClick={() => setActiveTab('committee')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'committee'
                  ? 'bg-[#b08427] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 ${activeTab === 'committee' ? 'text-amber-100' : 'text-amber-600'}`} />
              <span>NYSC Committee & LGIs</span>
            </button>

            <button
              id="nav-tab-contact"
              onClick={() => setActiveTab('contact')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'contact'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Mail className={`w-4 h-4 ${activeTab === 'contact' ? 'text-emerald-200' : 'text-[#008751]'}`} />
              <span>Contact Support</span>
            </button>

            <button
              id="nav-tab-admin"
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <SlidersHorizontal className={`w-4 h-4 ${activeTab === 'admin' ? 'text-[#f6d884]' : 'text-slate-600'}`} />
              <span>Admin Panel</span>
            </button>
          </nav>

          {/* Quick Badges / Action */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('contact')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold cursor-pointer transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#008751]" />
              <span>Help Desk: WhatsApp / Email</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex lg:hidden overflow-x-auto gap-2 pt-3 pb-1 no-scrollbar border-t border-slate-100 mt-2">
          <button
            onClick={() => setActiveTab('directory')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 cursor-pointer ${
              activeTab === 'directory' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            All PPAs
          </button>
          <button
            onClick={() => setActiveTab('corper')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 cursor-pointer ${
              activeTab === 'corper' ? 'bg-[#008751] text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Corper Portal
          </button>
          <button
            onClick={() => setActiveTab('organization')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 cursor-pointer ${
              activeTab === 'organization' ? 'bg-emerald-900 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Organization Portal
          </button>
          <button
            onClick={() => setActiveTab('committee')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 cursor-pointer ${
              activeTab === 'committee' ? 'bg-[#b08427] text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Committee / LGIs
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 cursor-pointer ${
              activeTab === 'contact' ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Contact
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 cursor-pointer ${
              activeTab === 'admin' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Admin Panel
          </button>
        </div>
      </div>
    </header>
  );
};
