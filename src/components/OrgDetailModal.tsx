import React from 'react';
import { Organization, PpaReview, BehavioralRecord } from '../types';
import { formatNaira } from '../utils/helpers';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Home,
  Banknote,
  Star,
  CheckCircle2,
  AlertTriangle,
  Users,
  Briefcase,
  X,
  MessageSquare
} from 'lucide-react';

interface OrgDetailModalProps {
  org: Organization | null;
  onClose: () => void;
  reviews: PpaReview[];
  behavioralRecords: BehavioralRecord[];
  onApply?: (org: Organization) => void;
}

export const OrgDetailModal: React.FC<OrgDetailModalProps> = ({
  org,
  onClose,
  reviews,
  behavioralRecords,
  onApply
}) => {
  if (!org) return null;

  const orgReviews = reviews.filter(r => r.ppaId === org.id);
  const orgReports = behavioralRecords.filter(b => b.ppaId === org.id);
  const isOccupied = org.slotsOccupied >= org.slotsNeeded;
  const availableSlots = Math.max(0, org.slotsNeeded - org.slotsOccupied);

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 relative overflow-hidden">
        {/* Top green accent border */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-[#008751]" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6 pt-2">
          {/* Header */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-bold text-[#008751] uppercase tracking-wider">
                {org.sector}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-semibold text-slate-500">
                {org.lga} LGA, {org.state} State
              </span>
            </div>

            <h2 className="text-2xl font-black text-slate-900 leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {org.name}
            </h2>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-bold text-xs">
                {org.standardRating.split('-')[0]}
              </span>

              {org.nyscConditionsCompliant ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  NYSC Conditions Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-xs">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Flagged by Committee
                </span>
              )}

              {isOccupied ? (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-xs">
                  Quota Met / Occupied
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                  {availableSlots} Slot{availableSlots > 1 ? 's' : ''} Available
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-slate-600 text-sm leading-relaxed">
            {org.description}
          </p>

          {/* Quota Progress Bar */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-500" />
                NYSC Corpers Quota:
              </span>
              <span className="font-mono">
                {org.slotsOccupied} of {org.slotsNeeded} Slots Occupied
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full ${isOccupied ? 'bg-rose-500' : 'bg-[#008751]'}`}
                style={{ width: `${Math.min(100, (org.slotsOccupied / org.slotsNeeded) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Required: <strong>{org.slotsNeeded} corpers</strong></span>
              <span className={isOccupied ? 'text-rose-600 font-bold' : 'text-emerald-700 font-bold'}>
                {isOccupied ? 'No vacancies left' : `${availableSlots} openings remaining`}
              </span>
            </div>
          </div>

          {/* Key Facts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
              <Home className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Accommodation</span>
                <span className="font-bold text-slate-800">{org.accommodation}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
              <Banknote className="w-4 h-4 text-[#C89D3C] shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Monthly PPA Allowance</span>
                <span className="font-bold text-emerald-800">{formatNaira(org.stipendMonthly)}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Physical Address</span>
                <span className="font-bold text-slate-800">{org.address}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Contact Details</span>
                <span className="font-bold text-slate-800">{org.phone} • {org.email}</span>
              </div>
            </div>
          </div>

          {/* Departments */}
          {org.departments.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Departments Seeking Corpers:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {org.departments.map((dept, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                    {dept}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Preferred Courses */}
          {org.preferredDisciplines.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Preferred Courses of Study:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {org.preferredDisciplines.map((course, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-semibold">
                    {course}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Reviews by Corpers */}
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-[#C89D3C]" />
                10-Month / Post-Service Corper Reviews ({orgReviews.length})
              </span>
            </div>

            <div className="space-y-3 mt-3 max-h-48 overflow-y-auto">
              {orgReviews.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  No 10-month serving reviews recorded yet for this organization.
                </p>
              ) : (
                orgReviews.map(rev => (
                  <div key={rev.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">{rev.corperName} ({rev.corperStateCode})</span>
                      <div className="flex items-center gap-1 text-amber-600 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{rev.overallRating}.0</span>
                      </div>
                    </div>
                    <p className="text-slate-700 italic">&ldquo;{rev.comment}&rdquo;</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
            >
              Close
            </button>

            {onApply && !isOccupied && (
              <button
                onClick={() => {
                  onApply(org);
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl bg-[#008751] hover:bg-[#007043] text-white font-bold text-xs cursor-pointer shadow-md"
              >
                Select This Organization For PPA
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
