import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CorperProfile,
  Organization,
  PpaReview,
  AcademicCategory
} from '../types';
import {
  NIGERIAN_STATES,
  SOFT_SKILLS_OPTIONS,
  COURSE_CATEGORIES,
  NYSC_BATCH_OPTIONS,
  NYSC_MOBILIZATION_GROUPS,
  ACCREDITED_FACULTIES,
  ALL_ACCREDITED_DISCIPLINES,
  POPULAR_COURSES
} from '../data/nigeriaStates';
import { calculateMatchScore, formatNaira } from '../utils/helpers';
import {
  User,
  GraduationCap,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Building2,
  Home,
  Banknote,
  Search,
  Filter,
  Check,
  ChevronDown,
  FileText,
  Star,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  Clock,
  Printer,
  X,
  ThumbsUp,
  ThumbsDown,
  Info,
  Camera,
  Upload,
  UserPlus,
  Lock,
  RotateCcw
} from 'lucide-react';
import { NyscBadge } from './NyscBadge';
import { RegisterCorperModal } from './RegisterCorperModal';

interface CorperDashboardProps {
  corper: CorperProfile;
  setCorper: React.Dispatch<React.SetStateAction<CorperProfile>>;
  corpers?: CorperProfile[];
  setCorpers?: React.Dispatch<React.SetStateAction<CorperProfile[]>>;
  organizations: Organization[];
  setOrganizations: React.Dispatch<React.SetStateAction<Organization[]>>;
  reviews: PpaReview[];
  onAddReview: (review: PpaReview) => void;
  onOpenOrgDetail: (org: Organization) => void;
}

export const CorperDashboard: React.FC<CorperDashboardProps> = ({
  corper,
  setCorper,
  corpers = [],
  setCorpers,
  organizations,
  setOrganizations,
  reviews,
  onAddReview,
  onOpenOrgDetail
}) => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [ignoreCourseMatching, setIgnoreCourseMatching] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'occupied'>('all');
  const [accommodationFilter, setAccommodationFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState(corper.stateOfService);
  const [lgaFilter, setLgaFilter] = useState<string>('all');
  const [facultyFilter, setFacultyFilter] = useState<string>('all');
  const [courseMode, setCourseMode] = useState<'dropdown' | 'manual'>('dropdown');

  // Modals
  const [selectedPpaForLetter, setSelectedPpaForLetter] = useState<Organization | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Review Form State (After 10 months or after service)
  const [reviewForm, setReviewForm] = useState({
    ppaId: corper.assignedPpaId || organizations[0]?.id || '',
    overallRating: 5,
    accommodationRating: 4,
    stipendPromptnessRating: 5,
    workCultureRating: 4,
    mentorshipRating: 5,
    comment: '',
    adviceToNextCorpers: '',
    wouldRecommend: true
  });

  // Edit Profile Form State
  const [profileForm, setProfileForm] = useState<CorperProfile>({ ...corper });

  // Handle direct avatar photo upload
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('File size exceeds 3MB. Please choose a smaller photo.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setCorper(prev => ({ ...prev, avatarUrl: base64 }));
        setProfileForm(prev => ({ ...prev, avatarUrl: base64 }));
        if (setCorpers) {
          setCorpers(prev => prev.map(c => c.id === corper.id ? { ...c, avatarUrl: base64 } : c));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegisterNewCorper = (newProfile: CorperProfile) => {
    if (setCorpers) {
      setCorpers(prev => [newProfile, ...prev]);
    }
    setCorper(newProfile);
    setStateFilter(newProfile.stateOfService);
    setShowRegisterModal(false);
    alert(`Welcome, ${newProfile.name}! Your new corps member dashboard (${newProfile.stateCode}) is now ready.`);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setCorper({ ...profileForm });
    setStateFilter(profileForm.stateOfService);
    if (setCorpers) {
      setCorpers(prev => prev.map(c => c.id === profileForm.id ? profileForm : c));
    }
    setIsEditingProfile(false);
  };

  const handleToggleSkill = (skill: string) => {
    setProfileForm(prev => {
      const exists = prev.softSkills.includes(skill);
      if (exists) {
        return { ...prev, softSkills: prev.softSkills.filter(s => s !== skill) };
      } else {
        return { ...prev, softSkills: [...prev.softSkills, skill] };
      }
    });
  };

  const handleApplyForPpa = (org: Organization) => {
    if (org.slotsOccupied >= org.slotsNeeded) {
      alert('This organization has already met its corper quota. Please choose an available organization.');
      return;
    }
    // Assign PPA to Corper
    setCorper(prev => ({
      ...prev,
      assignedPpaId: org.id,
      assignmentStatus: 'accepted'
    }));

    // Increment slot count
    setOrganizations(prev =>
      prev.map(item =>
        item.id === org.id
          ? { ...item, slotsOccupied: Math.min(item.slotsOccupied + 1, item.slotsNeeded) }
          : item
      )
    );

    setSelectedPpaForLetter(org);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    const targetOrg = organizations.find(o => o.id === reviewForm.ppaId);
    const newRev: PpaReview = {
      id: `rev-${Date.now()}`,
      ppaId: reviewForm.ppaId,
      ppaName: targetOrg ? targetOrg.name : 'PPA Organization',
      corperName: corper.name,
      corperStateCode: corper.stateCode,
      serviceBatch: corper.serviceBatch,
      monthsServed: corper.servingMonth,
      overallRating: reviewForm.overallRating,
      accommodationRating: reviewForm.accommodationRating,
      stipendPromptnessRating: reviewForm.stipendPromptnessRating,
      workCultureRating: reviewForm.workCultureRating,
      mentorshipRating: reviewForm.mentorshipRating,
      comment: reviewForm.comment,
      adviceToNextCorpers: reviewForm.adviceToNextCorpers,
      wouldRecommend: reviewForm.wouldRecommend,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onAddReview(newRev);
    setCorper(prev => ({ ...prev, reviewedPpa: true }));
    setShowReviewModal(false);
    alert('Thank you, Corp Member! Your transparent 10-month PPA review has been officially recorded for incoming corpers and the State Committee.');
  };

  // Filter and score organizations
  const processedOrgs = organizations
    .map(org => {
      const match = calculateMatchScore(corper, org);
      return {
        ...org,
        matchScore: match.score,
        matchReasons: match.reasons,
        isOccupied: org.slotsOccupied >= org.slotsNeeded,
        availableSlots: Math.max(0, org.slotsNeeded - org.slotsOccupied)
      };
    })
    .filter(org => {
      // Search
      const matchesSearch =
        searchQuery.trim() === '' ||
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.lga.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.departments.some(d => d.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (org.preferredDisciplines && org.preferredDisciplines.some(p => p.toLowerCase().includes(searchQuery.toLowerCase())));

      // State matching (All 36 States+ FCT)
      const orgStateNorm = org.state.toLowerCase().trim();
      const filterStateNorm = stateFilter.toLowerCase().trim();
      const matchesState =
        stateFilter === 'all' ||
        orgStateNorm === filterStateNorm ||
        (filterStateNorm.includes('abuja') && (orgStateNorm.includes('abuja') || orgStateNorm.includes('fct'))) ||
        (filterStateNorm.includes('fct') && (orgStateNorm.includes('abuja') || orgStateNorm.includes('fct')));

      // LGA of Primary Assignment Possibilities matching
      const matchesLga =
        lgaFilter === 'all' ||
        org.lga.toLowerCase().trim() === lgaFilter.toLowerCase().trim();

      // Academic Faculty / Discipline Category filter
      let matchesFaculty = true;
      if (facultyFilter !== 'all') {
        const facObj = ACCREDITED_FACULTIES.find(f => f.category === facultyFilter);
        const facDisciplines = facObj ? facObj.disciplines.map(d => d.toLowerCase()) : [];
        const orgPrefers = (org.preferredDisciplines || []).map(p => p.toLowerCase());
        const orgSector = org.sector.toLowerCase();
        
        matchesFaculty =
          orgPrefers.some(p => facDisciplines.some(fd => fd.includes(p) || p.includes(fd))) ||
          (facultyFilter === 'Science & Tech' && (orgSector.includes('tech') || orgSector.includes('telecom') || orgSector.includes('data') || orgSector.includes('software'))) ||
          (facultyFilter === 'Engineering' && (orgSector.includes('eng') || orgSector.includes('energy') || orgSector.includes('oil') || orgSector.includes('construct') || orgSector.includes('power'))) ||
          (facultyFilter === 'Medical & Health' && (orgSector.includes('health') || orgSector.includes('medic') || orgSector.includes('hospital') || orgSector.includes('pharm') || orgSector.includes('clinic'))) ||
          (facultyFilter === 'Management & Social Sciences' && (orgSector.includes('bank') || orgSector.includes('financ') || orgSector.includes('consult') || orgSector.includes('insur') || orgSector.includes('commerce') || orgSector.includes('revenue') || orgSector.includes('tax'))) ||
          (facultyFilter === 'Education' && (orgSector.includes('educ') || orgSector.includes('school') || orgSector.includes('acad') || orgSector.includes('teach') || orgSector.includes('college'))) ||
          (facultyFilter === 'Agriculture' && (orgSector.includes('agri') || orgSector.includes('farm') || orgSector.includes('food') || orgSector.includes('vet'))) ||
          (facultyFilter === 'Law' && (orgSector.includes('law') || orgSector.includes('legal') || orgSector.includes('judic') || orgSector.includes('ministry of justice'))) ||
          (facultyFilter === 'Arts & Humanities' && (orgSector.includes('media') || orgSector.includes('comm') || orgSector.includes('arts') || orgSector.includes('journal') || orgSector.includes('broadcast') || orgSector.includes('culture'))) ||
          (facultyFilter === 'Environmental Sciences' && (orgSector.includes('env') || orgSector.includes('urban') || orgSector.includes('geo') || orgSector.includes('survey') || orgSector.includes('housing')));
      }

      // Availability status (All Availability: open & occupied)
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'available' && !org.isOccupied) ||
        (statusFilter === 'occupied' && org.isOccupied);

      // Accommodation (Any Accomodation)
      const orgAccom = (org.accommodation || '').toLowerCase();
      const orgOffered = (org.accommodationOffered || '').toLowerCase();
      const matchesAccom =
        accommodationFilter === 'all' ||
        (accommodationFilter === 'provided' && (orgAccom.includes('provided') || orgAccom.includes('lodge') || orgAccom.includes('free') || orgOffered === 'yes')) ||
        (accommodationFilter === 'subsidized' && orgAccom.includes('subsidized')) ||
        (accommodationFilter === 'allowance' && (orgAccom.includes('allowance') || orgAccom.includes('transport'))) ||
        (accommodationFilter === 'none' && (orgAccom.includes('none') || orgAccom === '' || orgOffered === 'no'));

      return matchesSearch && matchesState && matchesLga && matchesFaculty && matchesStatus && matchesAccom;
    })
    .sort((a, b) => {
      if (ignoreCourseMatching) {
        // Sort by available slots first
        return b.availableSlots - a.availableSlots;
      }
      // Sort by Match Score
      return b.matchScore - a.matchScore;
    });

  const assignedOrganization = organizations.find(o => o.id === corper.assignedPpaId);

  return (
    <div id="corper-dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Personalized Corper Security & Account Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-200/70 text-[#008751]">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold">Private Corps Member Workspace</span>
            <p className="text-[11px] text-emerald-800">
              You are currently viewing and managing your own profile: <strong>{corper.name}</strong> ({corper.stateCode}).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {corpers.length > 1 && (
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-emerald-300">
              <span className="text-[11px] font-semibold text-slate-500">Switch Corper:</span>
              <select
                value={corper.id}
                onChange={e => {
                  const target = corpers.find(c => c.id === e.target.value);
                  if (target) {
                    setCorper(target);
                    setStateFilter(target.stateOfService);
                  }
                }}
                className="bg-transparent font-bold text-[#008751] outline-none text-xs cursor-pointer"
              >
                {corpers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.stateCode})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowRegisterModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-[#008751] hover:bg-[#007043] text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register as New Corper</span>
          </button>
        </div>
      </div>

      {/* Top Banner & Corper Profile Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#008751] via-[#086c43] to-[#044a2c] text-white p-6 sm:p-8 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start gap-4">
              {/* Profile Avatar with Photo Upload */}
              <div className="relative group shrink-0">
                {corper.avatarUrl ? (
                  <img
                    src={corper.avatarUrl}
                    alt={corper.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-300 shadow-md bg-white/20"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-800/80 border-2 border-white/20 flex items-center justify-center text-white text-2xl font-black shadow-md">
                    {corper.name.charAt(0)}
                  </div>
                )}
                <label
                  htmlFor="corper-banner-photo-upload"
                  className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-bold cursor-pointer transition-opacity text-center p-1"
                  title="Upload profile image to dashboard"
                >
                  <Camera className="w-4 h-4 mb-0.5" />
                  <span>Upload Photo</span>
                </label>
                <input
                  id="corper-banner-photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileChange}
                  className="hidden"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {corper.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#C89D3C] text-slate-950 font-bold text-xs uppercase tracking-wider">
                    {corper.serviceBatch}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-emerald-100 text-xs sm:text-sm font-medium">
                  <span className="font-mono bg-black/20 px-2 py-0.5 rounded border border-white/10">
                    State Code: <strong>{corper.stateCode}</strong>
                  </span>
                  <span>•</span>
                  <span className="font-mono bg-black/20 px-2 py-0.5 rounded border border-white/10">
                    Call-up: <strong>{corper.callUpNo}</strong>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#f6d884]" />
                    {corper.lgaOfService ? `${corper.lgaOfService} LGA, ` : ''}{corper.stateOfService} State
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                id="btn-edit-corper-profile"
                onClick={() => {
                  setProfileForm({ ...corper });
                  setIsEditingProfile(true);
                }}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <User className="w-4 h-4 text-emerald-200" />
                <span>Edit Registration Details</span>
              </button>

              {/* 10-month / Post-service Review Trigger */}
              <button
                id="btn-trigger-review-modal"
                onClick={() => setShowReviewModal(true)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                  corper.servingMonth >= 10
                    ? 'bg-[#C89D3C] hover:bg-[#b08427] text-slate-950'
                    : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-950/80 border border-emerald-500/30'
                }`}
              >
                <Star className="w-4 h-4 fill-current text-amber-900" />
                <span>
                  {corper.reviewedPpa
                    ? 'Update 10-Month PPA Review'
                    : corper.servingMonth >= 10
                    ? 'Give Review (Month 10 / Post-Service)'
                    : `PPA Review (Active: Month ${corper.servingMonth}/12)`}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Profile Details Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-5 bg-slate-50 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-500 font-semibold block uppercase tracking-wider text-[10px]">Course of Study</span>
            <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5 mt-0.5">
              <GraduationCap className="w-4 h-4 text-[#008751] shrink-0" />
              <span className="truncate" title={corper.courseOfStudy}>{corper.courseOfStudy}</span>
            </span>
            {corper.secondaryDiscipline && (
              <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5 truncate" title={`Secondary: ${corper.secondaryDiscipline}`}>
                + {corper.secondaryDiscipline} (2nd Disc)
              </span>
            )}
          </div>

          <div>
            <span className="text-slate-500 font-semibold block uppercase tracking-wider text-[10px]">Academic Faculty</span>
            <span className="font-semibold text-slate-800 mt-0.5 block truncate" title={corper.category}>
              {corper.category}
            </span>
          </div>

          <div>
            <span className="text-slate-500 font-semibold block uppercase tracking-wider text-[10px]">LGA of Primary Assignment</span>
            <span className="font-bold text-slate-800 text-xs flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#008751] shrink-0" />
              <span>{corper.lgaOfService || 'Assigned Council'} LGA</span>
            </span>
            <span className="text-[10px] text-slate-500 block">{corper.stateOfService} State</span>
          </div>

          <div>
            <span className="text-slate-500 font-semibold block uppercase tracking-wider text-[10px]">Assigned PPA Status</span>
            {assignedOrganization ? (
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] truncate">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span className="truncate">{assignedOrganization.name}</span>
                </span>
                <button
                  onClick={() => setSelectedPpaForLetter(assignedOrganization)}
                  className="text-emerald-700 underline text-[10px] font-semibold hover:text-emerald-900 cursor-pointer shrink-0"
                >
                  Letter
                </button>
              </div>
            ) : (
              <span className="inline-flex items-center gap-1 text-amber-700 font-semibold mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                Seeking Placement
              </span>
            )}
          </div>

          <div>
            <span className="text-slate-500 font-semibold block uppercase tracking-wider text-[10px]">Service Progress</span>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#008751] h-full rounded-full"
                  style={{ width: `${(corper.servingMonth / 12) * 100}%` }}
                />
              </div>
              <span className="font-bold text-slate-700">{corper.servingMonth} / 12 Mos</span>
            </div>
          </div>
        </div>

        {/* Soft Skills Tags */}
        <div className="px-5 py-3 bg-white border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold text-[11px] mr-1">Registered Soft Skills:</span>
          {corper.softSkills.map((skill, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/60 font-medium text-[11px]"
            >
              <Sparkles className="w-3 h-3 text-[#008751]" />
              {skill}
            </span>
          ))}
          <button
            onClick={() => setIsEditingProfile(true)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold ml-1 cursor-pointer"
          >
            + Add/Edit Skills
          </button>
        </div>
      </div>

      {/* Course Matching Controls & Quota Explainer */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
                PPA Recommendation & Quota Discovery
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#008751] text-xs font-bold">
                {processedOrgs.length} Found
              </span>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Recommending verified organisations across Nigeria based on required corper quota and vacancy occupancy.
            </p>
          </div>

          {/* Ignore Matching Toggle */}
          <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <div className="text-right">
              <div className="text-xs font-bold text-slate-800">
                {ignoreCourseMatching ? 'Discipline Match: Ignored' : 'Course & Skills Matcher: Active'}
              </div>
              <div className="text-[10px] text-slate-500">
                {ignoreCourseMatching
                  ? 'Showing all PPAs regardless of your course'
                  : `Filtering by ${corper.courseOfStudy} priority`}
              </div>
            </div>

            <button
              id="toggle-ignore-course-match"
              type="button"
              role="switch"
              aria-checked={ignoreCourseMatching}
              onClick={() => setIgnoreCourseMatching(!ignoreCourseMatching)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                ignoreCourseMatching ? 'bg-amber-600' : 'bg-[#008751]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  ignoreCourseMatching ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 pt-4">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search PPA, LGA, sector..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#008751] focus:bg-white outline-none"
            />
          </div>

          {/* State of Service filter: All 36 States+ FCT */}
          <div>
            <select
              value={stateFilter}
              onChange={e => {
                const newState = e.target.value;
                setStateFilter(newState);
                setLgaFilter('all');
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#008751] focus:bg-white outline-none cursor-pointer"
            >
              <option value="all">All 36 States+ FCT</option>
              {NIGERIAN_STATES.map(s => (
                <option key={s.code} value={s.name}>
                  {s.name.includes('FCT') ? s.name : `${s.name} State`} {s.name === corper.stateOfService ? '(Your State)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* LGA of Primary Assignment Possibilities filter */}
          <div>
            <select
              value={lgaFilter}
              onChange={e => setLgaFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#008751] focus:bg-white outline-none cursor-pointer"
            >
              {stateFilter !== 'all' ? (
                <>
                  <option value="all">
                    All LGAs in {stateFilter} ({(NIGERIAN_STATES.find(s => s.name === stateFilter)?.lgas || []).length} LGAs)
                  </option>
                  {(NIGERIAN_STATES.find(s => s.name === stateFilter)?.lgas || []).map(lga => (
                    <option key={lga} value={lga}>
                      {lga} LGA
                    </option>
                  ))}
                </>
              ) : (
                <>
                  <option value="all">All LGAs across Nigeria</option>
                  {Array.from(new Set(organizations.map(o => o.lga))).sort().map(lga => (
                    <option key={lga} value={lga}>
                      {lga} LGA
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          {/* Academic Faculty / Discipline Category optional drop_down */}
          <div>
            <select
              value={facultyFilter}
              onChange={e => setFacultyFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#008751] focus:bg-white outline-none cursor-pointer"
            >
              <option value="all">All Academic Faculties & Disciplines</option>
              {ACCREDITED_FACULTIES.map(fac => (
                <option key={fac.category} value={fac.category}>
                  {fac.name}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Filter: All Availability (open & occupied) */}
          <div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#008751] focus:bg-white outline-none cursor-pointer"
            >
              <option value="all">All Availability (open & occupied)</option>
              <option value="available">🟢 Open Slots Only (Available)</option>
              <option value="occupied">🔴 Fully Occupied (Quota Met)</option>
            </select>
          </div>

          {/* Accommodation Filter: Any Accomodation */}
          <div>
            <select
              value={accommodationFilter}
              onChange={e => setAccommodationFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#008751] focus:bg-white outline-none cursor-pointer"
            >
              <option value="all">Any Accomodation</option>
              <option value="provided">Free Corpers Lodge Provided</option>
              <option value="subsidized">Subsidized Housing</option>
              <option value="allowance">Transport / Housing Allowance</option>
              <option value="none">None / No Accommodation</option>
            </select>
          </div>
        </div>

        {/* Active Filter Chips Bar */}
        {(searchQuery.trim() !== '' || stateFilter !== 'all' || lgaFilter !== 'all' || facultyFilter !== 'all' || statusFilter !== 'all' || accommodationFilter !== 'all') && (
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Filters:</span>
            {stateFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                <MapPin className="w-3 h-3 text-emerald-600" />
                <span>State: {stateFilter}</span>
                <button
                  type="button"
                  onClick={() => {
                    setStateFilter('all');
                    setLgaFilter('all');
                  }}
                  className="hover:text-emerald-950 p-0.5 cursor-pointer"
                  title="Remove state filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {lgaFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-900 font-bold border border-teal-200">
                <MapPin className="w-3 h-3 text-teal-600" />
                <span>LGA: {lgaFilter}</span>
                <button
                  type="button"
                  onClick={() => setLgaFilter('all')}
                  className="hover:text-teal-950 p-0.5 cursor-pointer"
                  title="Remove LGA filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {facultyFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-900 font-bold border border-indigo-200">
                <GraduationCap className="w-3 h-3 text-indigo-600" />
                <span>Faculty: {facultyFilter}</span>
                <button
                  type="button"
                  onClick={() => setFacultyFilter('all')}
                  className="hover:text-indigo-950 p-0.5 cursor-pointer"
                  title="Remove faculty filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 font-bold border border-blue-200">
                <CheckCircle2 className="w-3 h-3 text-blue-600" />
                <span>Availability: {statusFilter === 'available' ? 'Open Slots Only' : 'Fully Occupied'}</span>
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className="hover:text-blue-950 p-0.5 cursor-pointer"
                  title="Remove availability filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {accommodationFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 font-bold border border-amber-200">
                <Home className="w-3 h-3 text-amber-600" />
                <span>
                  Accommodation:{' '}
                  {accommodationFilter === 'provided'
                    ? 'Free Lodge'
                    : accommodationFilter === 'subsidized'
                    ? 'Subsidized'
                    : accommodationFilter === 'allowance'
                    ? 'Allowance'
                    : 'None'}
                </span>
                <button
                  type="button"
                  onClick={() => setAccommodationFilter('all')}
                  className="hover:text-amber-950 p-0.5 cursor-pointer"
                  title="Remove accommodation filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchQuery.trim() !== '' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold border border-slate-200">
                <Search className="w-3 h-3 text-slate-500" />
                <span>Keyword: "{searchQuery}"</span>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="hover:text-slate-950 p-0.5 cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setSearchQuery('');
                setStateFilter('all');
                setLgaFilter('all');
                setFacultyFilter('all');
                setStatusFilter('all');
                setAccommodationFilter('all');
              }}
              className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer ml-auto bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* PPA Recommendations Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
          <span>
            Displaying <strong>{processedOrgs.length}</strong> organisations in{' '}
            <strong>{stateFilter === 'all' ? 'All Nigerian States' : `${stateFilter} State`}</strong>
          </span>
          <span className="flex items-center gap-1 text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Verified NYSC Safe PPAs
          </span>
        </div>

        {processedOrgs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No matching organizations found</h3>
            <p className="text-slate-500 text-xs max-w-md mx-auto mt-1">
              Try adjusting your search criteria, switching to &apos;All States&apos;, or turning on &apos;Ignore Course Matching&apos; to view every open slot.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStateFilter('all');
                setStatusFilter('all');
                setAccommodationFilter('all');
                setIgnoreCourseMatching(true);
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-[#008751] text-white text-xs font-bold cursor-pointer hover:bg-emerald-800 transition-colors"
            >
              Reset Filters & Show All
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {processedOrgs.map(org => {
              const isCurrentPpa = corper.assignedPpaId === org.id;
              const orgReviews = reviews.filter(r => r.ppaId === org.id);
              const avgRating =
                orgReviews.length > 0
                  ? (orgReviews.reduce((acc, r) => acc + r.overallRating, 0) / orgReviews.length).toFixed(1)
                  : '4.8';

              return (
                <div
                  key={org.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md ${
                    isCurrentPpa
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                      : org.isOccupied
                      ? 'border-slate-200 opacity-90'
                      : 'border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="p-5 sm:p-6 space-y-4">
                    {/* Top Row: Sector, Match Score, & Quota Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-bold text-[#008751] tracking-wide uppercase">
                          {org.sector}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5 leading-snug">
                          {org.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                          <span className="flex items-center gap-1 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            {org.lga} LGA, {org.state} State
                          </span>
                        </div>
                      </div>

                      {/* Quota Status Badge */}
                      <div className="shrink-0 text-right">
                        {org.isOccupied ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold">
                            <AlertCircle className="w-3 h-3 text-rose-500" />
                            Occupied (Full)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            {org.availableSlots} Slot{org.availableSlots > 1 ? 's' : ''} Open
                          </span>
                        )}

                        {!ignoreCourseMatching && (
                          <div className="mt-1 text-[11px] font-bold text-emerald-700">
                            {org.matchScore}% Match
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Organization Quota Progress Bar */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          Corper Quota Allocation:
                        </span>
                        <span className="font-mono">
                          {org.slotsOccupied} of {org.slotsNeeded} Filled
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            org.isOccupied ? 'bg-rose-500' : 'bg-[#008751]'
                          }`}
                          style={{ width: `${Math.min(100, (org.slotsOccupied / org.slotsNeeded) * 100)}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
                        <span>{org.slotsNeeded} Corp members needed</span>
                        <span className={org.isOccupied ? 'text-rose-600 font-bold' : 'text-emerald-700 font-bold'}>
                          {org.isOccupied ? 'All slots taken' : `${org.availableSlots} available for posting`}
                        </span>
                      </div>
                    </div>

                    {/* Key Perks: Accommodation, Monthly Stipend, & Standard Rating */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
                        <Home className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] font-semibold text-slate-400 block uppercase">Accommodation</span>
                          <span className="font-bold text-slate-800 text-[11px] leading-tight">
                            {org.accommodation}
                          </span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
                        <Banknote className="w-4 h-4 text-[#C89D3C] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] font-semibold text-slate-400 block uppercase">Monthly Stipend</span>
                          <span className="font-bold text-emerald-800 text-[11px] leading-tight">
                            {formatNaira(org.stipendMonthly)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Matching explanation reasons */}
                    {!ignoreCourseMatching && org.matchReasons && org.matchReasons.length > 0 && (
                      <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-[11px] text-emerald-900 space-y-1">
                        <div className="font-bold flex items-center gap-1 text-emerald-800">
                          <Sparkles className="w-3.5 h-3.5 text-[#008751]" />
                          Why this matches you:
                        </div>
                        <ul className="list-disc list-inside space-y-0.5 text-emerald-800/90 pl-1">
                          {org.matchReasons.slice(0, 2).map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Corper reviews preview */}
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-1 text-amber-600 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{avgRating}</span>
                        <span className="text-slate-400 font-normal">
                          ({orgReviews.length} Corper Review{orgReviews.length !== 1 ? 's' : ''})
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Standard: <strong className="text-slate-700">{org.standardRating.split('-')[0]}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                    <button
                      onClick={() => onOpenOrgDetail(org)}
                      className="text-xs font-bold text-slate-700 hover:text-[#008751] transition-colors cursor-pointer"
                    >
                      View Details & Reviews
                    </button>

                    {isCurrentPpa ? (
                      <button
                        onClick={() => setSelectedPpaForLetter(org)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-emerald-200"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Accepted PPA</span>
                      </button>
                    ) : org.isOccupied ? (
                      <button
                        disabled
                        className="px-3.5 py-1.5 rounded-xl bg-slate-200 text-slate-500 text-xs font-bold cursor-not-allowed"
                      >
                        Quota Occupied
                      </button>
                    ) : (
                      <button
                        id={`btn-apply-ppa-${org.id}`}
                        onClick={() => handleApplyForPpa(org)}
                        className="px-4 py-2 rounded-xl bg-[#008751] hover:bg-[#007043] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer hover:scale-102"
                      >
                        <span>Select for PPA</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Corper 10-Month / Post-Service Review Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h2 className="text-xl font-black text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
                10-Month & Post-Service PPA Experiences
              </h2>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Transparent feedback submitted by serving corps members after 10+ months or post-POP.
            </p>
          </div>

          <button
            onClick={() => setShowReviewModal(true)}
            className="px-5 py-2.5 rounded-xl bg-[#C89D3C] hover:bg-[#b08427] text-slate-950 text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Write Your 10-Month Review</span>
          </button>
        </div>

        {/* Existing Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.slice(0, 4).map(rev => (
            <div key={rev.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{rev.ppaName}</h4>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>{rev.corperName}</span>
                    <span>•</span>
                    <span className="font-mono text-emerald-700">{rev.corperStateCode}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/60">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{rev.overallRating}.0</span>
                </div>
              </div>

              <p className="text-slate-700 text-xs leading-relaxed italic">
                &ldquo;{rev.comment}&rdquo;
              </p>

              {rev.adviceToNextCorpers && (
                <div className="text-[11px] bg-white p-2.5 rounded-xl border border-slate-200/60 text-slate-600">
                  <strong className="text-slate-800">Advice for upcoming corpers:</strong> {rev.adviceToNextCorpers}
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-200/60">
                <span>Served: <strong>{rev.monthsServed} Months</strong></span>
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <ThumbsUp className="w-3 h-3" />
                  {rev.wouldRecommend ? 'Recommends this PPA' : 'Does not recommend'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Edit Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-[#008751]" />
                <h3 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  Register / Update Corper Profile
                </h3>
              </div>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 pt-4 text-xs">
              {/* Profile Photo Upload Field */}
              <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                {profileForm.avatarUrl ? (
                  <img
                    src={profileForm.avatarUrl}
                    alt="Preview"
                    className="w-14 h-14 rounded-xl object-cover border border-emerald-300 shadow-xs"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-emerald-100 text-[#008751] flex items-center justify-center font-bold text-lg">
                    {profileForm.name.charAt(0) || 'C'}
                  </div>
                )}
                <div className="flex-1">
                  <label className="block font-bold text-slate-700 text-xs mb-1">
                    Upload Profile Picture / Passport
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setProfileForm(prev => ({ ...prev, avatarUrl: reader.result as string }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="text-[11px] text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-[#008751] hover:file:bg-emerald-100 cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-400 mt-0.5">JPG, PNG or WEBP up to 3MB</p>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name (as registered with NYSC)</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">State Code (e.g. LA/24B/1042)</label>
                  <input
                    type="text"
                    required
                    value={profileForm.stateCode}
                    onChange={e => setProfileForm({ ...profileForm, stateCode: e.target.value.toUpperCase() })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-[#008751] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Call-Up Number (e.g. NYSC/UNILAG/...)</label>
                  <input
                    type="text"
                    required
                    value={profileForm.callUpNo}
                    onChange={e => setProfileForm({ ...profileForm, callUpNo: e.target.value.toUpperCase() })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-[#008751] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">State of Service (36 States + FCT)</label>
                  <select
                    value={profileForm.stateOfService}
                    onChange={e => {
                      const newState = e.target.value;
                      const stateObj = NIGERIAN_STATES.find(s => s.name === newState);
                      const defaultLga = stateObj && stateObj.lgas.length > 0 ? stateObj.lgas[0] : '';
                      setProfileForm({
                        ...profileForm,
                        stateOfService: newState,
                        lgaOfService: stateObj?.lgas.includes(profileForm.lgaOfService || '') ? profileForm.lgaOfService : defaultLga
                      });
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#008751] outline-none cursor-pointer"
                  >
                    {NIGERIAN_STATES.map(s => (
                      <option key={s.code} value={s.name}>
                        {s.name.includes('FCT') ? s.name : `${s.name} State`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    LGA of Primary Assignment ({(NIGERIAN_STATES.find(s => s.name === profileForm.stateOfService)?.lgas || []).length} LGAs in {profileForm.stateOfService})
                  </label>
                  <select
                    value={profileForm.lgaOfService || (NIGERIAN_STATES.find(s => s.name === profileForm.stateOfService)?.lgas[0] || '')}
                    onChange={e => setProfileForm({ ...profileForm, lgaOfService: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#008751] outline-none cursor-pointer"
                  >
                    {(NIGERIAN_STATES.find(s => s.name === profileForm.stateOfService)?.lgas || []).map(lga => (
                      <option key={lga} value={lga}>
                        {lga} Local Government Area
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Academic Faculty / Discipline Category
                  </label>
                  <select
                    value={profileForm.category}
                    onChange={e => {
                      const newCategory = e.target.value as AcademicCategory;
                      const facObj = ACCREDITED_FACULTIES.find(f => f.category === newCategory);
                      const defaultCourse = facObj && facObj.disciplines.length > 0 ? facObj.disciplines[0] : profileForm.courseOfStudy;
                      setProfileForm({
                        ...profileForm,
                        category: newCategory,
                        courseOfStudy: defaultCourse
                      });
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#008751] outline-none cursor-pointer"
                  >
                    {ACCREDITED_FACULTIES.map(fac => (
                      <option key={fac.category} value={fac.category}>
                        {fac.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">Course of Study / Academic Discipline *</label>
                    <button
                      type="button"
                      onClick={() => setCourseMode(m => m === 'dropdown' ? 'manual' : 'dropdown')}
                      className="text-[10px] text-[#008751] hover:underline font-semibold cursor-pointer"
                    >
                      {courseMode === 'dropdown' ? 'Type Manually' : 'Select from List'}
                    </button>
                  </div>
                  {courseMode === 'dropdown' ? (
                    <select
                      value={profileForm.courseOfStudy}
                      onChange={e => {
                        const val = e.target.value;
                        const foundFac = ACCREDITED_FACULTIES.find(f => f.disciplines.includes(val));
                        const cat = foundFac ? foundFac.category : (COURSE_CATEGORIES[val]?.category || profileForm.category);
                        setProfileForm({ ...profileForm, courseOfStudy: val, category: cat as AcademicCategory });
                      }}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#008751] outline-none cursor-pointer"
                    >
                      {(ACCREDITED_FACULTIES.find(f => f.category === profileForm.category)?.disciplines || ALL_ACCREDITED_DISCIPLINES).map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      value={profileForm.courseOfStudy}
                      onChange={e => {
                        const val = e.target.value;
                        const foundFac = ACCREDITED_FACULTIES.find(f => f.disciplines.includes(val));
                        const cat = foundFac ? foundFac.category : (COURSE_CATEGORIES[val]?.category || profileForm.category);
                        setProfileForm({ ...profileForm, courseOfStudy: val, category: cat as AcademicCategory });
                      }}
                      placeholder="e.g. Computer Science, Accounting, Medicine..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#008751] outline-none"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Secondary / Minor Academic Discipline (Optional accreditation for cross-matching)
                </label>
                <select
                  value={profileForm.secondaryDiscipline || ''}
                  onChange={e => setProfileForm({ ...profileForm, secondaryDiscipline: e.target.value || undefined })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#008751] outline-none cursor-pointer"
                >
                  <option value="">None (Single Discipline / Major Only)</option>
                  {ACCREDITED_FACULTIES.map(fac => (
                    <optgroup key={fac.category} label={`-- ${fac.name} --`}>
                      {fac.disciplines.map(discipline => (
                        <option key={`sec-${fac.category}-${discipline}`} value={discipline}>
                          {discipline}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Soft Skills (Select all relevant skills to boost PPA match)
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {SOFT_SKILLS_OPTIONS.map(skill => {
                    const selected = profileForm.softSkills.includes(skill);
                    return (
                      <button
                        type="button"
                        key={skill}
                        onClick={() => handleToggleSkill(skill)}
                        className={`p-2 rounded-lg text-left text-[11px] font-medium transition-all flex items-center justify-between cursor-pointer ${
                          selected
                            ? 'bg-[#008751] text-white'
                            : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        <span>{skill}</span>
                        {selected && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Service Month (1 to 12)</label>
                  <select
                    value={profileForm.servingMonth}
                    onChange={e => setProfileForm({ ...profileForm, servingMonth: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#008751] outline-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                      <option key={m} value={m}>
                        Month {m} {m >= 10 ? '(Eligible for 10-month review)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Service Batch & Stream</label>
                  <select
                    value={profileForm.serviceBatch}
                    onChange={e => setProfileForm({ ...profileForm, serviceBatch: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#008751] outline-none cursor-pointer"
                  >
                    {NYSC_MOBILIZATION_GROUPS.map(group => (
                      <optgroup key={group.group} label={`-- ${group.group} --`}>
                        {group.batches.map(batchOption => (
                          <option key={batchOption} value={batchOption}>
                            {batchOption}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#008751] hover:bg-[#007043] text-white font-bold cursor-pointer shadow-md"
                >
                  Save Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 10-Month / Post-Service Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 text-[#C89D3C] fill-[#C89D3C]" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    10-Month / Post-Service PPA Review
                  </h3>
                  <p className="text-xs text-slate-500">
                    Share transparent feedback on your primary assignment experience to guide future corpers.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Organization to Review</label>
                <select
                  value={reviewForm.ppaId}
                  onChange={e => setReviewForm({ ...reviewForm, ppaId: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#008751] outline-none cursor-pointer"
                >
                  {organizations.map(o => (
                    <option key={o.id} value={o.id}>
                      {o.name} ({o.state} State - {o.lga})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Overall (1-5)</label>
                  <select
                    value={reviewForm.overallRating}
                    onChange={e => setReviewForm({ ...reviewForm, overallRating: Number(e.target.value) })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                  >
                    {[5, 4, 3, 2, 1].map(n => (
                      <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Accommodation</label>
                  <select
                    value={reviewForm.accommodationRating}
                    onChange={e => setReviewForm({ ...reviewForm, accommodationRating: Number(e.target.value) })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                  >
                    {[5, 4, 3, 2, 1].map(n => (
                      <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Stipend Prompt</label>
                  <select
                    value={reviewForm.stipendPromptnessRating}
                    onChange={e => setReviewForm({ ...reviewForm, stipendPromptnessRating: Number(e.target.value) })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                  >
                    {[5, 4, 3, 2, 1].map(n => (
                      <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Mentorship</label>
                  <select
                    value={reviewForm.mentorshipRating}
                    onChange={e => setReviewForm({ ...reviewForm, mentorshipRating: Number(e.target.value) })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                  >
                    {[5, 4, 3, 2, 1].map(n => (
                      <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  10-Month Serving Review & Work Experience
                </label>
                <textarea
                  required
                  rows={3}
                  value={reviewForm.comment}
                  onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="How were you treated as a corp member? Was accommodation safe? Did they pay stipend promptly? Did you gain valuable hands-on skills?"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Advice to Incoming Corps Members Posted Here
                </label>
                <input
                  type="text"
                  value={reviewForm.adviceToNextCorpers}
                  onChange={e => setReviewForm({ ...reviewForm, adviceToNextCorpers: e.target.value })}
                  placeholder="e.g. Bring your own laptop, negotiate transport allowance early, prepare for weekend calls..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none text-xs"
                />
              </div>

              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700">Would you recommend this PPA to other Corpers?</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewForm({ ...reviewForm, wouldRecommend: true })}
                    className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer ${
                      reviewForm.wouldRecommend ? 'bg-[#008751] text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewForm({ ...reviewForm, wouldRecommend: false })}
                    className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer ${
                      !reviewForm.wouldRecommend ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#008751] hover:bg-[#007043] text-white font-bold cursor-pointer shadow-md"
                >
                  Submit Official Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official NYSC PPA Posting Letter Modal */}
      {selectedPpaForLetter && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border-4 border-[#008751] my-8 relative">
            <button
              onClick={() => setSelectedPpaForLetter(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Official Letterhead */}
            <div className="text-center pb-4 border-b-2 border-[#008751]">
              <div className="flex items-center justify-center gap-3 mb-2">
                <NyscBadge size={52} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase" style={{ fontFamily: "'Outfit', sans-serif" }}>
                National Youth Service Corps
              </h2>
              <div className="text-xs font-bold text-[#008751] uppercase tracking-widest">
                Directorate Headquarters, Abuja • {selectedPpaForLetter.state} State Secretariat
              </div>
              <div className="text-[11px] text-slate-500 font-medium italic mt-0.5">
                Motto: &ldquo;Service and Humility&rdquo;
              </div>
            </div>

            {/* Letter Body */}
            <div className="py-6 space-y-4 text-xs text-slate-800 leading-relaxed font-serif">
              <div className="flex justify-between font-mono font-bold text-slate-600 text-[11px]">
                <span>Ref: NYSC/{selectedPpaForLetter.state.substring(0, 2).toUpperCase()}/PPA/{corper.stateCode}</span>
                <span>Date: {new Date().toLocaleDateString('en-GB')}</span>
              </div>

              <div>
                <p className="font-bold">The Managing Director / Head of Organization,</p>
                <p className="font-bold text-slate-900">{selectedPpaForLetter.name}</p>
                <p className="text-slate-600">{selectedPpaForLetter.address}</p>
                <p className="text-slate-600">{selectedPpaForLetter.lga} LGA, {selectedPpaForLetter.state} State</p>
              </div>

              <div className="text-center font-bold text-sm tracking-wide border-b border-slate-300 pb-1 uppercase font-sans text-[#008751]">
                Letter of Primary Assignment Posting
              </div>

              <p>
                I am directed to convey the posting of the underlisted Corp Member to your establishment for their
                National Service Primary Assignment in accordance with the NYSC Act Decree No. 51 of 1993:
              </p>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 font-sans grid grid-cols-2 gap-2 text-xs">
                <div><strong>Corper Name:</strong> {corper.name}</div>
                <div><strong>State Code:</strong> {corper.stateCode}</div>
                <div><strong>Call-up No:</strong> {corper.callUpNo}</div>
                <div><strong>Course of Study:</strong> {corper.courseOfStudy}</div>
                <div><strong>Stipend Offered:</strong> {formatNaira(selectedPpaForLetter.stipendMonthly)}</div>
                <div><strong>Accommodation:</strong> {selectedPpaForLetter.accommodation}</div>
              </div>

              <p>
                You are kindly requested to complete the attached acceptance slip and return to the Local Government
                Inspector (LGI) within seven (7) days of reporting.
              </p>

              <div className="flex justify-between items-end pt-4 font-sans text-xs">
                <div className="text-center">
                  <div className="w-32 border-b border-slate-400 mb-1" />
                  <span className="text-[10px] text-slate-500 font-bold block">Corp Member Signature</span>
                </div>

                <div className="text-center">
                  <div className="inline-block p-1 border-2 border-emerald-700 text-emerald-800 text-[9px] font-mono font-bold rounded rotate-[-4deg] mb-1">
                    NYSC STATE SECRETARIAT VERIFIED
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold block">For: State Coordinator</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Letter</span>
              </button>

              <button
                onClick={() => setSelectedPpaForLetter(null)}
                className="px-5 py-2 rounded-xl bg-[#008751] hover:bg-[#007043] text-white text-xs font-bold cursor-pointer"
              >
                Close & Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Register New Corper Separate Modal */}
      <RegisterCorperModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegister={handleRegisterNewCorper}
        existingCount={corpers.length}
      />
    </div>
  );
};
