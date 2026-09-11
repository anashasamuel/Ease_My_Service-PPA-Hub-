import React, { useState } from 'react';
import { Organization, PpaReview } from '../types';
import { NIGERIAN_STATES } from '../data/nigeriaStates';
import { formatNaira } from '../utils/helpers';
import {
  Building2,
  Search,
  Filter,
  MapPin,
  Home,
  Banknote,
  Star,
  CheckCircle2,
  AlertCircle,
  Users,
  Briefcase,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface PpaDirectoryProps {
  organizations: Organization[];
  reviews: PpaReview[];
  onOpenOrgDetail: (org: Organization) => void;
  onSelectTab: (tab: 'corper' | 'organization' | 'committee' | 'directory') => void;
}

export const PpaDirectory: React.FC<PpaDirectoryProps> = ({
  organizations,
  reviews,
  onOpenOrgDetail,
  onSelectTab
}) => {
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'occupied'>('all');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [accommodationFilter, setAccommodationFilter] = useState('all');

  // Filter logic
  const filteredOrgs = organizations.filter(org => {
    const matchesSearch =
      org.name.toLowerCase().includes(search.toLowerCase()) ||
      org.lga.toLowerCase().includes(search.toLowerCase()) ||
      org.sector.toLowerCase().includes(search.toLowerCase()) ||
      org.departments.some(d => d.toLowerCase().includes(search.toLowerCase()));

    const matchesState = stateFilter === 'all' || org.state.toLowerCase() === stateFilter.toLowerCase();
    const isOccupied = org.slotsOccupied >= org.slotsNeeded;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'available' && !isOccupied) ||
      (statusFilter === 'occupied' && isOccupied);

    const matchesSector = sectorFilter === 'all' || org.sector === sectorFilter;
    const matchesAccom =
      accommodationFilter === 'all' ||
      (accommodationFilter === 'provided' && org.accommodation.includes('Provided')) ||
      (accommodationFilter === 'subsidized' && org.accommodation.includes('Subsidized')) ||
      (accommodationFilter === 'none' && org.accommodation.includes('None'));

    return matchesSearch && matchesState && matchesStatus && matchesSector && matchesAccom;
  });

  const totalNeeded = organizations.reduce((acc, o) => acc + o.slotsNeeded, 0);
  const totalOccupied = organizations.reduce((acc, o) => acc + o.slotsOccupied, 0);
  const totalOpenSlots = Math.max(0, totalNeeded - totalOccupied);

  return (
    <div id="ppa-directory-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & National Statistics */}
      <div className="bg-gradient-to-r from-[#008751] via-[#096a42] to-[#043b23] rounded-3xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C89D3C]/20 border border-[#C89D3C]/40 text-[#f6d884] text-xs font-bold uppercase tracking-wider">
            <span>Official NYSC Place of Primary Assignment Quota Directory</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Explore Verified PPAs Across 36 States & FCT
          </h1>

          <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
            Real-time tracking of organisations that need university graduates for national service. Check available slots vs occupied quotas, evaluate accommodation options, and read transparent 10-month reviews.
          </p>
        </div>

        {/* National Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/15 text-xs relative z-10">
          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
            <span className="text-emerald-200 font-semibold block text-[10px] uppercase">Registered PPAs</span>
            <span className="text-2xl font-black text-white font-mono mt-0.5 block">{organizations.length}</span>
            <span className="text-[10px] text-emerald-300">Across 36 States & FCT</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
            <span className="text-emerald-200 font-semibold block text-[10px] uppercase">Corpers Needed</span>
            <span className="text-2xl font-black text-white font-mono mt-0.5 block">{totalNeeded}</span>
            <span className="text-[10px] text-emerald-300">Total requested quota</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
            <span className="text-emerald-200 font-semibold block text-[10px] uppercase">Occupied Slots</span>
            <span className="text-2xl font-black text-[#f6d884] font-mono mt-0.5 block">{totalOccupied}</span>
            <span className="text-[10px] text-emerald-300">Filled by serving corpers</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
            <span className="text-emerald-200 font-semibold block text-[10px] uppercase">Open Vacancies</span>
            <span className="text-2xl font-black text-emerald-300 font-mono mt-0.5 block">{totalOpenSlots}</span>
            <span className="text-[10px] text-emerald-300">Ready for posting</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#008751]" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Filter & Search Directory
            </h3>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {filteredOrgs.length} Organisations Matching
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Search Box */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search company name, LGA, or sector..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008751] focus:bg-white outline-none"
            />
          </div>

          {/* State Filter */}
          <div>
            <select
              value={stateFilter}
              onChange={e => setStateFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-[#008751] outline-none cursor-pointer"
            >
              <option value="all">All 36 States + FCT</option>
              {NIGERIAN_STATES.map(s => (
                <option key={s.code} value={s.name}>{s.name} State</option>
              ))}
            </select>
          </div>

          {/* Availability Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-[#008751] outline-none cursor-pointer"
            >
              <option value="all">All Availability (Open & Occupied)</option>
              <option value="available">🟢 Available Only (Open Slots)</option>
              <option value="occupied">🔴 Occupied Only (Quota Met)</option>
            </select>
          </div>

          {/* Accommodation Filter */}
          <div>
            <select
              value={accommodationFilter}
              onChange={e => setAccommodationFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-[#008751] outline-none cursor-pointer"
            >
              <option value="all">Any Accommodation</option>
              <option value="provided">Free Corpers Lodge</option>
              <option value="subsidized">Subsidized Housing</option>
              <option value="none">Transport Allowance / None</option>
            </select>
          </div>
        </div>
      </div>

      {/* Directory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredOrgs.map(org => {
          const isOccupied = org.slotsOccupied >= org.slotsNeeded;
          const openSlots = Math.max(0, org.slotsNeeded - org.slotsOccupied);
          const orgReviews = reviews.filter(r => r.ppaId === org.id);
          const avgRating =
            orgReviews.length > 0
              ? (orgReviews.reduce((acc, r) => acc + r.overallRating, 0) / orgReviews.length).toFixed(1)
              : '4.8';

          return (
            <div
              key={org.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5 space-y-4">
                {/* Sector & Availability Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-[#008751] uppercase tracking-wide">
                      {org.sector}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5 leading-snug">
                      {org.name}
                    </h3>
                  </div>

                  {isOccupied ? (
                    <span className="shrink-0 px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-bold text-[10px] flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-rose-500" />
                      Occupied (Full)
                    </span>
                  ) : (
                    <span className="shrink-0 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {openSlots} Open
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{org.lga} LGA, {org.state} State</span>
                </div>

                {/* Quota Progress Bar */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      Corpers Needed:
                    </span>
                    <span className="font-mono text-[11px]">
                      {org.slotsOccupied} / {org.slotsNeeded} Filled
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isOccupied ? 'bg-rose-500' : 'bg-[#008751]'}`}
                      style={{ width: `${Math.min(100, (org.slotsOccupied / org.slotsNeeded) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Accommodation & Stipend */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Accommodation</span>
                    <span className="font-bold text-slate-800 text-[11px] truncate block">{org.accommodation}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Allowance</span>
                    <span className="font-bold text-emerald-800 text-[11px]">{formatNaira(org.stipendMonthly)}</span>
                  </div>
                </div>

                {/* Rating & Standard */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-1 text-amber-600 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{avgRating}</span>
                    <span className="text-slate-400 font-normal">({orgReviews.length})</span>
                  </div>

                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {org.standardRating.split('-')[0]}
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onOpenOrgDetail(org)}
                  className="text-xs font-bold text-[#008751] hover:underline cursor-pointer"
                >
                  View Details & Reviews
                </button>

                <button
                  onClick={() => onSelectTab('corper')}
                  className="px-3 py-1.5 rounded-xl bg-[#008751] hover:bg-[#007043] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>Apply via Corper Portal</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
