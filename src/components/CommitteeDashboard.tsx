import React, { useState, useEffect } from 'react';
import {
  Organization,
  BehavioralRecord,
  StandardGrade,
  CorperProfile,
  StateCommittee,
  LgiOfficer
} from '../types';
import { NIGERIAN_STATES, StateInfo } from '../data/nigeriaStates';
import { getStateCommitteeData } from '../data/mockData';
import { formatNaira } from '../utils/helpers';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Building2,
  Users,
  Search,
  Filter,
  FileCheck,
  Check,
  X,
  ChevronRight,
  Phone,
  Compass,
  FileText,
  BadgeAlert,
  HelpCircle,
  PlusCircle,
  Edit2,
  UserCheck,
  UserX,
  RefreshCw,
  Mail,
  Home,
  GraduationCap,
  Sparkles,
  Info
} from 'lucide-react';
import { NyscBadge, NigeriaFlagIcon } from './NyscBadge';

export interface StateAuthSession {
  isLoggedIn: boolean;
  stateName: string;
  stateCode: string;
  uniqueId: string;
  role: 'coordinator' | 'lgi';
  officerName: string;
}

interface CommitteeDashboardProps {
  organizations: Organization[];
  setOrganizations: React.Dispatch<React.SetStateAction<Organization[]>>;
  behavioralRecords: BehavioralRecord[];
  setBehavioralRecords: React.Dispatch<React.SetStateAction<BehavioralRecord[]>>;
  selectedState: string;
  setSelectedState: (state: string) => void;
  onOpenOrgDetail: (org: Organization) => void;
  corpers?: CorperProfile[];
  setCorpers?: React.Dispatch<React.SetStateAction<CorperProfile[]>>;
  stateCommittees?: StateCommittee[];
  setStateCommittees?: React.Dispatch<React.SetStateAction<StateCommittee[]>>;
}

export const CommitteeDashboard: React.FC<CommitteeDashboardProps> = ({
  organizations,
  setOrganizations,
  behavioralRecords,
  selectedState,
  setSelectedState,
  onOpenOrgDetail,
  corpers = [],
  setCorpers,
  stateCommittees = [],
  setStateCommittees
}) => {
  // State Official Authentication Session
  const [stateAuth, setStateAuth] = useState<StateAuthSession | null>(() => {
    try {
      const saved = localStorage.getItem('nysc_state_auth');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  // State Login Form State
  const [loginState, setLoginState] = useState<string>(selectedState);
  const [loginUniqueId, setLoginUniqueId] = useState<string>('NYSC-STATE-LA-2026');
  const [loginPassword, setLoginPassword] = useState<string>('nysc@lagos2026');
  const [loginRole, setLoginRole] = useState<'coordinator' | 'lgi'>('coordinator');
  const [loginError, setLoginError] = useState<string>('');

  // LGI output subtab
  const [lgiOutputTab, setLgiOutputTab] = useState<'quota_ppas' | 'corpers_roster' | 'clearance_reports' | 'welfare_audits'>('quota_ppas');

  const [activeTab, setActiveTab] = useState<'ppas' | 'compliance' | 'reports' | 'lgis' | 'reassign'>('ppas');
  const [searchQuery, setSearchQuery] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [selectedAuditOrg, setSelectedAuditOrg] = useState<Organization | null>(null);

  // Popup warning modal state for unregistered state committee
  const [showUnregisteredModal, setShowUnregisteredModal] = useState(false);

  // Committee Registration Modal
  const [showRegisterCommitteeModal, setShowRegisterCommitteeModal] = useState(false);

  // LGI Add / Edit Modals
  const [showAddLgiModal, setShowAddLgiModal] = useState(false);
  const [editingLgi, setEditingLgi] = useState<LgiOfficer | null>(null);

  // Corper Reassignment Modal
  const [reassigningCorper, setReassigningCorper] = useState<CorperProfile | null>(null);
  const [reassignStateFilter, setReassignStateFilter] = useState<string>(selectedState);
  const [reassignSearch, setReassignSearch] = useState('');

  // Update login credentials preview whenever loginState changes
  useEffect(() => {
    const st = NIGERIAN_STATES.find(s => s.name === loginState) || NIGERIAN_STATES[0];
    const code = st.code.toUpperCase();
    const slug = st.name.toLowerCase().replace(/[^a-z]/g, '');
    setLoginUniqueId(`NYSC-STATE-${code}-2026`);
    setLoginPassword(`nysc@${slug}2026`);
  }, [loginState]);

  // Keep selectedState in sync with authenticated session
  useEffect(() => {
    if (stateAuth && stateAuth.stateName !== selectedState) {
      setSelectedState(stateAuth.stateName);
    }
  }, [stateAuth, selectedState, setSelectedState]);

  // State info and registered committee data
  const effectiveState = stateAuth?.isLoggedIn ? stateAuth.stateName : selectedState;
  const currentStateInfo = NIGERIAN_STATES.find(s => s.name === effectiveState) || NIGERIAN_STATES[0];
  const registeredCommittee = stateCommittees.find(
    c => c.stateName.toLowerCase() === effectiveState.toLowerCase()
  );
  const isCommitteeRegistered = !!registeredCommittee?.isRegistered;

  // Fallback committee data if not yet customized
  const fallbackCommitteeData = getStateCommitteeData(currentStateInfo.name, currentStateInfo.code);
  const committeeData = registeredCommittee || fallbackCommitteeData;

  // Check on state change: only for coordinators, if state committee is not registered, show popup note!
  useEffect(() => {
    if (stateAuth?.isLoggedIn && stateAuth.role === 'coordinator' && !isCommitteeRegistered) {
      setShowUnregisteredModal(true);
    } else {
      setShowUnregisteredModal(false);
    }
  }, [effectiveState, isCommitteeRegistered, stateAuth]);

  // Quick State Login Handler
  const handleQuickLoginState = (stateName: string, role: 'coordinator' | 'lgi' = 'coordinator') => {
    const st = NIGERIAN_STATES.find(s => s.name === stateName) || NIGERIAN_STATES[0];
    const code = st.code.toUpperCase();
    const slug = st.name.toLowerCase().replace(/[^a-z]/g, '');
    const session: StateAuthSession = {
      isLoggedIn: true,
      stateName: st.name,
      stateCode: st.code,
      uniqueId: `NYSC-STATE-${code}-2026`,
      role,
      officerName: role === 'coordinator' ? `State Coordinator, ${st.name} Command` : `LGI Officer, ${st.capital || st.name} LGA`
    };
    setStateAuth(session);
    setSelectedState(st.name);
    localStorage.setItem('nysc_state_auth', JSON.stringify(session));
    setLoginError('');
  };

  // State Login Submission Handler
  const handleStateLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const st = NIGERIAN_STATES.find(s => s.name === loginState) || NIGERIAN_STATES[0];
    const expectedId = `NYSC-STATE-${st.code.toUpperCase()}-2026`;

    if (loginUniqueId.trim().toUpperCase() !== expectedId) {
      setLoginError(`Invalid Unique ID for ${st.name}. Expected official ID format: ${expectedId}`);
      return;
    }

    const session: StateAuthSession = {
      isLoggedIn: true,
      stateName: st.name,
      stateCode: st.code,
      uniqueId: expectedId,
      role: loginRole,
      officerName: loginRole === 'coordinator' ? `State Coordinator, ${st.name} Command` : `LGI Officer, ${st.capital || st.name} LGA`
    };

    setStateAuth(session);
    setSelectedState(st.name);
    localStorage.setItem('nysc_state_auth', JSON.stringify(session));
    setLoginError('');
  };

  const handleStateSignOut = () => {
    setStateAuth(null);
    localStorage.removeItem('nysc_state_auth');
  };

  // Form for Registering New State Committee
  const [committeeForm, setCommitteeForm] = useState({
    stateCoordinator: '',
    secretariatAddress: '',
    hotline: '',
    email: '',
    orientationCampLocation: currentStateInfo.campLocation,
    initialLgiName: '',
    initialLgiLga: currentStateInfo.lgas[0] || 'Municipal',
    initialLgiPhone: '',
    initialLgiEmail: ''
  });

  // Form for Adding / Editing LGI Officer
  const [lgiForm, setLgiForm] = useState({
    name: '',
    lga: currentStateInfo.lgas[0] || '',
    phone: '',
    email: '',
    officeAddress: ''
  });

  // Filter organizations in selected state
  const stateOrgs = organizations.filter(o => o.state.toLowerCase() === selectedState.toLowerCase());

  // Filtered organizations based on search/sector
  const filteredOrgs = stateOrgs.filter(o => {
    const matchSearch =
      o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.lga.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.sector.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSector = sectorFilter === 'all' || o.sector === sectorFilter;
    return matchSearch && matchSector;
  });

  // State reports
  const stateBehavioralRecords = behavioralRecords.filter(r => {
    const ppa = organizations.find(o => o.id === r.ppaId);
    return ppa ? ppa.state.toLowerCase() === selectedState.toLowerCase() : true;
  });

  // Corpers for this state (or all)
  const stateCorpers = corpers.filter(
    c => c.stateOfService.toLowerCase() === selectedState.toLowerCase()
  );

  // Handlers for Committee Registration
  const handleRegisterStateCommittee = (e: React.FormEvent) => {
    e.preventDefault();
    const newLgi: LgiOfficer = {
      id: `lgi-${Date.now()}`,
      name: committeeForm.initialLgiName || `LGI Officer (${committeeForm.initialLgiLga})`,
      lga: committeeForm.initialLgiLga,
      phone: committeeForm.initialLgiPhone || committeeForm.hotline,
      email: committeeForm.initialLgiEmail || committeeForm.email,
      officeAddress: committeeForm.secretariatAddress,
      corpersCount: 120
    };

    const newCommittee: StateCommittee = {
      stateName: currentStateInfo.name,
      stateCapital: currentStateInfo.capital,
      stateCodePrefix: currentStateInfo.code,
      stateCoordinator: committeeForm.stateCoordinator || `Coordinator (${currentStateInfo.name})`,
      secretariatAddress: committeeForm.secretariatAddress || `NYSC State Secretariat, ${currentStateInfo.capital}`,
      hotline: committeeForm.hotline || '+234 800 NYSC LGI',
      email: committeeForm.email || `${currentStateInfo.code.toLowerCase()}@nysc.gov.ng`,
      orientationCampLocation: committeeForm.orientationCampLocation || currentStateInfo.campLocation,
      activeLgis: 1,
      totalCorpersInState: 1500,
      totalPpasRegistered: stateOrgs.length,
      totalPpasOccupied: stateOrgs.filter(o => o.slotsOccupied >= o.slotsNeeded).length,
      complianceAuditScore: 92,
      isRegistered: true,
      registeredDate: new Date().toISOString().split('T')[0],
      registeredLgis: [newLgi],
      zonalOffices: [
        {
          zoneName: `${currentStateInfo.name} Central Zone`,
          lgiName: newLgi.name,
          contact: newLgi.phone,
          headquarters: committeeForm.secretariatAddress,
          corpersCount: 120
        }
      ]
    };

    if (setStateCommittees) {
      setStateCommittees(prev => {
        const filtered = prev.filter(c => c.stateName.toLowerCase() !== currentStateInfo.name.toLowerCase());
        return [newCommittee, ...filtered];
      });
    }

    setShowRegisterCommitteeModal(false);
    setShowUnregisteredModal(false);
    alert(`Success! Official State Committee for ${currentStateInfo.name} State has been successfully registered.`);
  };

  // Handlers for Registering / Editing LGI Member
  const handleSaveLgi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!setStateCommittees) return;

    if (editingLgi) {
      // Edit existing LGI
      setStateCommittees(prev =>
        prev.map(comm => {
          if (comm.stateName.toLowerCase() === selectedState.toLowerCase()) {
            const updatedLgis = (comm.registeredLgis || []).map(l =>
              l.id === editingLgi.id ? { ...l, ...lgiForm } : l
            );
            return { ...comm, registeredLgis: updatedLgis };
          }
          return comm;
        })
      );
      setEditingLgi(null);
      alert('LGI Officer contact details updated successfully.');
    } else {
      // Add new LGI
      const newLgi: LgiOfficer = {
        id: `lgi-${Date.now()}`,
        name: lgiForm.name,
        lga: lgiForm.lga,
        phone: lgiForm.phone,
        email: lgiForm.email,
        officeAddress: lgiForm.officeAddress,
        corpersCount: 0
      };

      setStateCommittees(prev =>
        prev.map(comm => {
          if (comm.stateName.toLowerCase() === selectedState.toLowerCase()) {
            const existingLgis = comm.registeredLgis || [];
            return {
              ...comm,
              activeLgis: (comm.activeLgis || 0) + 1,
              registeredLgis: [newLgi, ...existingLgis]
            };
          }
          return comm;
        })
      );
      setShowAddLgiModal(false);
      alert(`LGI Officer ${newLgi.name} registered to ${newLgi.lga} LGA.`);
    }
  };

  // Handlers for Unassigning Corper from PPA
  const handleUnassignCorper = (targetCorper: CorperProfile) => {
    if (!targetCorper.assignedPpaId) {
      alert(`${targetCorper.name} is currently not assigned to any PPA.`);
      return;
    }

    const assignedPpa = organizations.find(o => o.id === targetCorper.assignedPpaId);
    const confirmUnassign = window.confirm(
      `Are you sure you want to unassign ${targetCorper.name} (${targetCorper.stateCode}) from ${assignedPpa ? assignedPpa.name : 'current PPA'}? This will free 1 slot in the organization.`
    );
    if (!confirmUnassign) return;

    // 1. Decrement old PPA slots occupied
    setOrganizations(prev =>
      prev.map(o => {
        if (o.id === targetCorper.assignedPpaId) {
          return { ...o, slotsOccupied: Math.max(0, o.slotsOccupied - 1) };
        }
        return o;
      })
    );

    // 2. Update Corper Profile
    if (setCorpers) {
      setCorpers(prev =>
        prev.map(c => {
          if (c.id === targetCorper.id) {
            return {
              ...c,
              assignedPpaId: undefined,
              assignmentStatus: 'unassigned' as const
            };
          }
          return c;
        })
      );
    }

    alert(`Corps Member ${targetCorper.name} has been unassigned and is now available for reassignment.`);
  };

  // Handlers for Reassigning Corper to New PPA
  const handleReassignCorper = (targetCorper: CorperProfile, targetPpa: Organization) => {
    if (targetPpa.slotsOccupied >= targetPpa.slotsNeeded) {
      alert(`Cannot reassign: ${targetPpa.name} has already occupied all available corper quota.`);
      return;
    }

    const oldPpaId = targetCorper.assignedPpaId;

    // 1. Update organizations: decrement old, increment new
    setOrganizations(prev =>
      prev.map(o => {
        if (oldPpaId && o.id === oldPpaId) {
          return { ...o, slotsOccupied: Math.max(0, o.slotsOccupied - 1) };
        }
        if (o.id === targetPpa.id) {
          return { ...o, slotsOccupied: Math.min(o.slotsNeeded, o.slotsOccupied + 1) };
        }
        return o;
      })
    );

    // 2. Update Corper Profile
    if (setCorpers) {
      setCorpers(prev =>
        prev.map(c => {
          if (c.id === targetCorper.id) {
            return {
              ...c,
              assignedPpaId: targetPpa.id,
              assignmentStatus: 'accepted' as const,
              stateOfService: targetPpa.state
            };
          }
          return c;
        })
      );
    }

    setReassigningCorper(null);
    alert(
      `Official Reassignment Completed!\n\n${targetCorper.name} (${targetCorper.stateCode}) has been successfully reassigned to ${targetPpa.name} in ${targetPpa.lga}, ${targetPpa.state} State.`
    );
  };

  // Stats
  const totalSlotsNeeded = stateOrgs.reduce((acc, o) => acc + o.slotsNeeded, 0);
  const totalSlotsOccupied = stateOrgs.reduce((acc, o) => acc + o.slotsOccupied, 0);
  const compliantCount = stateOrgs.filter(o => o.nyscConditionsCompliant).length;
  const currentLgisList = registeredCommittee?.registeredLgis || [];

  // ==========================================
  // VIEW 1: STATE COMMAND & LGI LOGIN GATEWAY (IF NOT AUTHENTICATED)
  // ==========================================
  if (!stateAuth?.isLoggedIn) {
    return (
      <div id="committee-login-portal" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
        {/* Official Header */}
        <div className="bg-gradient-to-r from-[#173d2a] via-[#008751] to-[#044a2c] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-emerald-700/40 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-md shrink-0">
              <NyscBadge size={64} />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C89D3C] text-slate-950 font-black text-xs uppercase tracking-wider mb-2">
                <NigeriaFlagIcon className="w-4 h-3" />
                <span>Statutory State Command & LGI Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                National Youth Service Corps State Secretariats
              </h1>
              <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
                Official statutory portal for the 36 State Secretariats and FCT Directorate. State Committees must log in with their Unique State Command ID to register, audit, and administer PPA allocations. Local Government Inspectors (LGIs) access inspection outputs.
              </p>
            </div>
          </div>
        </div>

        {/* Login Authentication Form Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
              <ShieldCheck className="w-6 h-6 text-[#008751]" />
              <span>State Command Authentication</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select your Nigerian State of jurisdiction and enter your official Command Unique ID & Password.
            </p>
          </div>

          {loginError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleStateLoginSubmit} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* State Dropdown */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Select State of Service (36 States + FCT) *</span>
                  <NigeriaFlagIcon className="w-3.5 h-2.5" />
                </label>
                <select
                  value={loginState}
                  onChange={e => setLoginState(e.target.value)}
                  className="w-full px-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-[#008751] outline-none cursor-pointer"
                >
                  {NIGERIAN_STATES.map(s => (
                    <option key={s.code} value={s.name}>
                      {s.name} ({s.code}) - {s.capital}
                    </option>
                  ))}
                </select>
              </div>

              {/* Unique State ID */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  State Command Unique ID *
                </label>
                <input
                  type="text"
                  required
                  value={loginUniqueId}
                  onChange={e => setLoginUniqueId(e.target.value.toUpperCase())}
                  placeholder="e.g. NYSC-STATE-LA-2026"
                  className="w-full px-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-[#008751] focus:ring-2 focus:ring-[#008751] outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Format: NYSC-STATE-&#123;CODE&#125;-2026
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* State Password */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  State Access Password *
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-800 focus:ring-2 focus:ring-[#008751] outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Official Secretariat command security key
                </span>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Designated Officer Role / Authority *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLoginRole('coordinator')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      loginRole === 'coordinator'
                        ? 'bg-[#008751] text-white font-bold border-[#008751] shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 font-semibold'
                    }`}
                  >
                    State Coordinator
                    <span className="block text-[10px] opacity-85 font-normal">Full Authority</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLoginRole('lgi')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      loginRole === 'lgi'
                        ? 'bg-[#b08427] text-white font-bold border-[#b08427] shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 font-semibold'
                    }`}
                  >
                    LGI Officer
                    <span className="block text-[10px] opacity-85 font-normal">Outputs View Only</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-[#008751] hover:bg-[#007043] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5 text-[#f6d884]" />
                <span>Sign In to {loginState} State Command Portal</span>
              </button>
            </div>
          </form>

          {/* 1-Click State Demo Shortcuts */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-500 block mb-2">
              Quick 1-Click State Logins (Instant Demonstration):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { name: 'Lagos', code: 'LA' },
                { name: 'Abuja (FCT)', code: 'FC' },
                { name: 'Kano', code: 'KN' },
                { name: 'Rivers', code: 'RV' },
                { name: 'Oyo', code: 'OY' },
                { name: 'Enugu', code: 'EN' },
                { name: 'Kaduna', code: 'KD' },
                { name: 'Delta', code: 'DE' }
              ].map(st => (
                <div key={st.code} className="p-2 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-800 text-[11px] truncate">{st.name}</div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleQuickLoginState(st.name, 'coordinator')}
                      className="flex-1 py-1 px-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-[10px] cursor-pointer text-center"
                      title="Login as State Coordinator"
                    >
                      Coord
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickLoginState(st.name, 'lgi')}
                      className="flex-1 py-1 px-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[10px] cursor-pointer text-center"
                      title="Login as LGI (Outputs Only)"
                    >
                      LGI
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: LGI OUTPUTS ONLY VIEW (IF ROLE === 'LGI')
  // "The LGIs get to see the outputs only."
  // ==========================================
  if (stateAuth?.role === 'lgi') {
    return (
      <div id="lgi-output-dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
        {/* Top LGI Header Banner */}
        <div className="bg-gradient-to-r from-[#173d2a] via-[#008751] to-[#044a2c] text-white p-6 sm:p-8 rounded-3xl shadow-sm border border-emerald-700/40">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-md shrink-0">
                <NyscBadge size={56} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#C89D3C] text-slate-950 font-black text-xs uppercase tracking-wider">
                    LGI Statutory Inspection Outputs Desk
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-emerald-950 font-bold text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Outputs & Monitoring Authority</span>
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {stateAuth.stateName} State • Local Government Inspectorate (LGI)
                </h1>
                <p className="text-emerald-100 text-xs sm:text-sm mt-1">
                  Officer: <strong>{stateAuth.officerName}</strong> • Unique ID: <span className="font-mono text-[#f6d884]">{stateAuth.uniqueId}</span>
                </p>
                <p className="text-emerald-200 text-xs mt-0.5 italic">
                  * Notice: In accordance with NYSC protocol, Local Government Inspectors have read-only inspection access to quota outputs, corper posting rosters, and behavioral clearance determinations.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/30 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <FileText className="w-4 h-4 text-[#f6d884]" />
                <span>Print LGI Inspection Docket</span>
              </button>

              <button
                onClick={handleStateSignOut}
                className="px-4 py-2.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Sign Out of State Command</span>
              </button>
            </div>
          </div>
        </div>

        {/* LGI Summary Output Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Quota Allocated</span>
            <div className="text-2xl font-black text-slate-900 mt-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {totalSlotsNeeded} Slots
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 block">
              Across {stateOrgs.length} Registered PPAs
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Occupied Quota</span>
            <div className="text-2xl font-black text-[#008751] mt-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {totalSlotsOccupied} Placed
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              {totalSlotsNeeded > 0 ? Math.round((totalSlotsOccupied / totalSlotsNeeded) * 100) : 0}% Saturation
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Vacant Slots Available</span>
            <div className="text-2xl font-black text-amber-700 mt-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {Math.max(0, totalSlotsNeeded - totalSlotsOccupied)} Available
            </div>
            <span className="text-[11px] text-amber-600 mt-0.5 block">
              Open for Corper Postings
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Active Corpers in State</span>
            <div className="text-2xl font-black text-blue-800 mt-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {stateCorpers.length} Corpers
            </div>
            <span className="text-[11px] text-blue-600 mt-0.5 block">
              Verified in Command Roster
            </span>
          </div>
        </div>

        {/* LGI Sub-tab navigation */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 overflow-x-auto">
          <button
            onClick={() => setLgiOutputTab('quota_ppas')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              lgiOutputTab === 'quota_ppas'
                ? 'bg-white text-[#008751] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Output 1: PPA Quota & Vacancy Distribution ({stateOrgs.length})
          </button>

          <button
            onClick={() => setLgiOutputTab('corpers_roster')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              lgiOutputTab === 'corpers_roster'
                ? 'bg-white text-[#008751] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Output 2: Deployed Corps Members Roster ({stateCorpers.length})
          </button>

          <button
            onClick={() => setLgiOutputTab('clearance_reports')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              lgiOutputTab === 'clearance_reports'
                ? 'bg-white text-[#008751] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Output 3: Monthly Behavioral Clearance Reports ({stateBehavioralRecords.length})
          </button>

          <button
            onClick={() => setLgiOutputTab('welfare_audits')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              lgiOutputTab === 'welfare_audits'
                ? 'bg-white text-[#008751] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Output 4: PPA Welfare & Safety Audit Scorecards
          </button>
        </div>

        {/* TAB 1: PPA Quota Distribution Outputs */}
        {lgiOutputTab === 'quota_ppas' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  PPA Quota Allocation & Vacancy Output Report
                </h3>
                <p className="text-xs text-slate-500">
                  Listing all accredited organizations and their live quota status in {stateAuth.stateName} State.
                </p>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search establishment or LGA..."
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs w-full sm:w-64 outline-none focus:ring-2 focus:ring-[#008751]"
              />
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Organization / Establishment</th>
                    <th className="p-3">LGA & Sector</th>
                    <th className="p-3">Allocated Quota</th>
                    <th className="p-3">Occupied</th>
                    <th className="p-3">Vacancies</th>
                    <th className="p-3">Accommodation</th>
                    <th className="p-3">Monthly Stipend</th>
                    <th className="p-3">Standard Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrgs.map(org => {
                    const vac = Math.max(0, org.slotsNeeded - org.slotsOccupied);
                    return (
                      <tr key={org.id} className="hover:bg-slate-50">
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{org.name}</div>
                          <div className="text-[11px] text-slate-400">{org.address}</div>
                        </td>
                        <td className="p-3">
                          <span className="font-semibold text-slate-800">{org.lga}</span>
                          <span className="text-slate-400 block text-[10px]">{org.sector}</span>
                        </td>
                        <td className="p-3 font-mono font-bold">{org.slotsNeeded}</td>
                        <td className="p-3 font-mono font-bold text-[#008751]">{org.slotsOccupied}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full font-bold font-mono text-[11px] ${
                            vac > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {vac > 0 ? `${vac} Open` : 'Exhausted'}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`font-semibold ${org.accommodation.toLowerCase().includes('yes') ? 'text-emerald-700' : 'text-slate-600'}`}>
                            {org.accommodation}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-slate-800">
                          {formatNaira(org.stipendMonthly)}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            {org.standardGrade || 'Accredited'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Deployed Corps Members Roster */}
        {lgiOutputTab === 'corpers_roster' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Verified Deployed Corps Members Output Roster
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Corps Member Name</th>
                    <th className="p-3">State Code</th>
                    <th className="p-3">Discipline</th>
                    <th className="p-3">LGA of Service</th>
                    <th className="p-3">Assigned PPA</th>
                    <th className="p-3">Mobilization Batch</th>
                    <th className="p-3">Service Month</th>
                    <th className="p-3">Clearance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stateCorpers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-6 text-center text-slate-400">
                        No Corps members currently recorded for {stateAuth.stateName}.
                      </td>
                    </tr>
                  ) : (
                    stateCorpers.map(c => {
                      const assignedOrg = organizations.find(o => o.id === c.assignedPpaId);
                      return (
                        <tr key={c.id} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{c.name}</td>
                          <td className="p-3 font-mono font-bold text-emerald-800">{c.stateCode}</td>
                          <td className="p-3 text-slate-700">{c.courseOfStudy}</td>
                          <td className="p-3 text-slate-700">{c.lgaOfService}</td>
                          <td className="p-3 font-semibold text-slate-900">{assignedOrg?.name || 'Pending Placement'}</td>
                          <td className="p-3 text-slate-600">{c.serviceBatch || '2024 Batch B'}</td>
                          <td className="p-3 font-mono font-bold">Month {c.servingMonth || 1}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              Eligible / Cleared
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Monthly Behavioral Clearance Reports */}
        {lgiOutputTab === 'clearance_reports' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Employer Monthly Behavioral Evaluations & Clearance Determinations
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Corper Name & State Code</th>
                    <th className="p-3">Evaluating PPA</th>
                    <th className="p-3">Month</th>
                    <th className="p-3">Punctuality</th>
                    <th className="p-3">Discipline</th>
                    <th className="p-3">Work Ethics</th>
                    <th className="p-3">Integrity</th>
                    <th className="p-3">Allowance Clearance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stateBehavioralRecords.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-6 text-center text-slate-400">
                        No monthly evaluations submitted yet for this state.
                      </td>
                    </tr>
                  ) : (
                    stateBehavioralRecords.map(r => (
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{r.corperName}</div>
                          <div className="font-mono text-emerald-700 text-[11px]">{r.corperStateCode}</div>
                        </td>
                        <td className="p-3 font-semibold text-slate-800">{r.ppaName}</td>
                        <td className="p-3 text-slate-600">{r.month}</td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded bg-slate-100">{r.punctuality}</span></td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded bg-slate-100">{r.discipline}</span></td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded bg-slate-100">{r.workEthics}</span></td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded bg-slate-100">{r.integrity}</span></td>
                        <td className="p-3">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                            {r.monthlyClearanceStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Welfare & Safety Audit Outputs */}
        {lgiOutputTab === 'welfare_audits' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              PPA Welfare & Accommodation Statutory Scorecards
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stateOrgs.map(org => (
                <div key={org.id} className="p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold text-slate-900 text-sm">{org.name}</div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C89D3C]/20 text-[#845c11] border border-[#C89D3C]/40 shrink-0">
                      {org.standardGrade || 'Accredited'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">{org.lga}, {org.state}</div>
                  <div className="text-xs space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <div>Accommodation: <strong>{org.accommodation}</strong></div>
                    <div>Stipend: <strong>{formatNaira(org.stipendMonthly)}/mo</strong></div>
                    <div>Compliance: <strong>{org.nyscConditionsCompliant ? 'Fully Certified' : 'Pending Audit'}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW 3: STATE COORDINATOR FULL PORTAL (IF ROLE === 'COORDINATOR')
  // ==========================================
  return (
    <div id="committee-dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* State Session Bar */}
      <div className="bg-emerald-900 text-white px-4 py-2.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs border border-emerald-800 shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <ShieldCheck className="w-4 h-4 text-[#f6d884]" />
          <span>Active Command: <strong>{stateAuth?.stateName || selectedState} NYSC Secretariat</strong></span>
          <span className="text-emerald-300">•</span>
          <span className="font-mono text-emerald-200">Unique ID: {stateAuth?.uniqueId || `NYSC-STATE-${currentStateInfo.code}-2026`}</span>
          <span className="text-emerald-300">•</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-700 text-emerald-100 text-[10px] font-bold uppercase">
            State Coordinator Desk
          </span>
        </div>

        <button
          onClick={handleStateSignOut}
          className="px-3 py-1 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-[11px] font-bold cursor-pointer transition-colors"
        >
          Sign Out of State Command
        </button>
      </div>

      {/* 1. Unregistered State LGI Popup Note / Modal */}
      {showUnregisteredModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-amber-300 space-y-5 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
              <BadgeAlert className="w-8 h-8 text-amber-600" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs uppercase tracking-wider">
                LGI Inspection Notice
              </span>
              <h3 className="text-xl font-black text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {selectedState} State Committee
              </h3>
              <p className="text-slate-700 text-sm font-semibold leading-relaxed bg-amber-50 p-3 rounded-2xl border border-amber-200">
                &ldquo;The Selected State LGI has not registered yet, check-in next time&rdquo;
              </p>
              <p className="text-slate-500 text-xs">
                Official State Committees & Local Government Inspectors (LGIs) for {selectedState} State can register their members and start auditing now.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                id="btn-register-unregistered-committee"
                onClick={() => {
                  setShowUnregisteredModal(false);
                  setShowRegisterCommitteeModal(true);
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#008751] hover:bg-[#007043] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
              >
                <PlusCircle className="w-4 h-4 text-[#f6d884]" />
                <span>Register Official Committee for {selectedState}</span>
              </button>

              <button
                onClick={() => setShowUnregisteredModal(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-all"
              >
                Dismiss & Browse Directory
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Top Header & 36 States Dropdown Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#173d2a] via-[#008751] to-[#044a2c] text-white p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-md shrink-0">
                <NyscBadge size={64} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#C89D3C] text-slate-950 font-black text-xs uppercase tracking-wider">
                    Official State Committee & LGI Inspectorate
                  </span>
                  {isCommitteeRegistered ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-emerald-950 text-[11px] font-black flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified Registered Committee</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[11px] font-black flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Pending LGI Registration</span>
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-4xl font-black tracking-tight flex items-center gap-3 flex-wrap" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  <span>{currentStateInfo.name} State Committee</span>
                  <span className="font-mono text-sm bg-black/30 px-2 py-0.5 rounded border border-white/20">
                    State Code: {currentStateInfo.code}
                  </span>
                </h1>

                <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-2xl">
                  {committeeData.secretariatAddress} • Coordinator: <strong>{committeeData.stateCoordinator}</strong>
                </p>
              </div>
            </div>

            {/* State Selection Dropdown (All 36 States + FCT) */}
            <div className="bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/15 min-w-[300px]">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#f6d884] mb-1.5 flex items-center justify-between">
                <span>Select State (36 States + FCT):</span>
                <NigeriaFlagIcon className="w-4 h-3" />
              </label>
              <select
                id="select-state-committee"
                value={selectedState}
                onChange={e => setSelectedState(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-emerald-400/40 rounded-xl text-white font-bold text-xs focus:ring-2 focus:ring-[#C89D3C] outline-none cursor-pointer"
              >
                {NIGERIAN_STATES.map(s => (
                  <option key={s.code} value={s.name}>
                    {s.name} State ({s.code}) - {s.capital}
                  </option>
                ))}
              </select>

              {!isCommitteeRegistered && (
                <button
                  onClick={() => setShowRegisterCommitteeModal(true)}
                  className="w-full mt-2 py-1.5 px-3 rounded-lg bg-[#C89D3C] hover:bg-[#b08427] text-slate-950 font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Register This State Committee</span>
                </button>
              )}
            </div>
          </div>

          {/* Metric Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-xs">
            <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/10">
              <span className="text-emerald-200 block text-[10px] uppercase tracking-wider font-semibold">Registered PPAs</span>
              <span className="text-xl font-black text-white font-mono mt-0.5 block">{stateOrgs.length}</span>
              <span className="text-[10px] text-emerald-300">{totalSlotsNeeded} total needed quota</span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/10">
              <span className="text-emerald-200 block text-[10px] uppercase tracking-wider font-semibold">Occupied Quota</span>
              <span className="text-xl font-black text-[#f6d884] font-mono mt-0.5 block">
                {totalSlotsOccupied} / {totalSlotsNeeded}
              </span>
              <span className="text-[10px] text-emerald-300">
                {totalSlotsNeeded > 0 ? Math.round((totalSlotsOccupied / totalSlotsNeeded) * 100) : 0}% Filled
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/10">
              <span className="text-emerald-200 block text-[10px] uppercase tracking-wider font-semibold">Registered LGIs</span>
              <span className="text-xl font-black text-white font-mono mt-0.5 block">
                {currentLgisList.length > 0 ? currentLgisList.length : currentStateInfo.lgas.length} LGIs
              </span>
              <span className="text-[10px] text-emerald-300">Across {currentStateInfo.lgas.length} LGAs</span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/10">
              <span className="text-emerald-200 block text-[10px] uppercase tracking-wider font-semibold">Compliant PPAs</span>
              <span className="text-xl font-black text-emerald-300 font-mono mt-0.5 block">
                {compliantCount} / {stateOrgs.length}
              </span>
              <span className="text-[10px] text-emerald-300">NYSC Bye-Laws Verified</span>
            </div>
          </div>
        </div>

        {/* Committee Action Navigation Sub-Tabs */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('ppas')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'ppas'
                  ? 'bg-[#008751] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              1. PPA Quotas ({stateOrgs.length})
            </button>

            <button
              onClick={() => setActiveTab('reassign')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'reassign'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#f6d884]" />
              <span>2. Corper Postings & Reassignment ({corpers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('lgis')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'lgis'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>3. State Committee & LGIs Members Directory</span>
            </button>

            <button
              onClick={() => setActiveTab('compliance')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'compliance'
                  ? 'bg-[#008751] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              4. NYSC Compliance Audit
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'reports'
                  ? 'bg-[#008751] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              5. Monthly Reports ({stateBehavioralRecords.length})
            </button>
          </div>

          <div className="text-xs text-slate-500">
            Inspectorate Hotline: <strong>{committeeData.hotline}</strong>
          </div>
        </div>
      </div>

      {/* TAB 1: PPA Quota Review in Selected State */}
      {activeTab === 'ppas' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Corper Quota Distribution in {currentStateInfo.name} State
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                Monitoring organizations that have occupied their assigned corper quota vs those with open vacancies.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search PPA name, LGA, sector..."
                className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#008751]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrgs.map(org => {
              const isOccupied = org.slotsOccupied >= org.slotsNeeded;
              const slotsLeft = Math.max(0, org.slotsNeeded - org.slotsOccupied);
              return (
                <div
                  key={org.id}
                  className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all bg-slate-50/50 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      {org.logoUrl ? (
                        <img
                          src={org.logoUrl}
                          alt={org.name}
                          className="w-9 h-9 rounded-lg object-contain bg-white p-1 border border-slate-200"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                          <Building2 className="w-4 h-4" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{org.name}</h4>
                        <span className="text-[11px] text-slate-500">{org.lga}, {org.state}</span>
                      </div>
                    </div>

                    {isOccupied ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                        Occupied (Full)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {slotsLeft} Slot{slotsLeft > 1 ? 's' : ''} Open
                      </span>
                    )}
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isOccupied ? 'bg-rose-500' : 'bg-[#008751]'}`}
                      style={{ width: `${Math.min(100, (org.slotsOccupied / org.slotsNeeded) * 100)}%` }}
                    />
                  </div>

                  <div className="text-[11px] text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Quota:</span>
                      <strong className="text-slate-900">{org.slotsOccupied} of {org.slotsNeeded} occupied</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Accommodation:</span>
                      <strong className="text-slate-900">{org.accommodation}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Stipend:</span>
                      <strong className="text-emerald-800 font-mono">{formatNaira(org.stipendMonthly)}</strong>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-200 text-xs">
                    <button
                      onClick={() => onOpenOrgDetail(org)}
                      className="text-emerald-800 hover:text-emerald-950 font-bold underline cursor-pointer"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('reassign');
                        setReassignStateFilter(org.state);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[11px] cursor-pointer"
                    >
                      Post Corpers
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Corper Postings & Reassignment (Unassign / Reassign to PPA) */}
      {activeTab === 'reassign' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-xs uppercase tracking-wider">
                  NYSC Placement Inspectorate
                </span>
                <span className="text-slate-400 text-xs">• 36 States Jurisdiction</span>
              </div>
              <h2 className="text-xl font-black text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Corper Placement, Unassignment & Reassignment Desk
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                Official Committee members can unassign corpers experiencing hardship or rejection and reassign them to available accredited PPAs of their choice.
              </p>
            </div>
          </div>

          {/* List of Corpers */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-200 text-slate-700 uppercase font-bold text-[10px] tracking-wider">
                  <th className="p-3">Corper Name & Code</th>
                  <th className="p-3">Mobilization Batch</th>
                  <th className="p-3">Course of Study</th>
                  <th className="p-3">State of Service</th>
                  <th className="p-3">Currently Assigned PPA</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Committee Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {corpers.map(corp => {
                  const assignedOrg = organizations.find(o => o.id === corp.assignedPpaId);
                  const isAssigned = !!corp.assignedPpaId && corp.assignmentStatus === 'accepted';

                  return (
                    <tr key={corp.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-semibold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={corp.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80'}
                            alt={corp.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-bold block text-slate-900">{corp.name}</span>
                            <span className="text-[11px] font-mono text-emerald-800">{corp.stateCode}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-3 text-slate-600 font-medium">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-[11px]">
                          {corp.serviceBatch || 'Batch B Stream 1'}
                        </span>
                      </td>

                      <td className="p-3 text-slate-700 font-medium">
                        <div className="flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{corp.courseOfStudy}</span>
                        </div>
                      </td>

                      <td className="p-3 text-slate-700">
                        <span className="font-semibold">{corp.stateOfService} State</span>
                      </td>

                      <td className="p-3">
                        {assignedOrg ? (
                          <div>
                            <span className="font-bold text-slate-900 block">{assignedOrg.name}</span>
                            <span className="text-[11px] text-slate-500">{assignedOrg.lga}, {assignedOrg.state}</span>
                          </div>
                        ) : (
                          <span className="text-amber-700 italic font-semibold">Unassigned / No PPA</span>
                        )}
                      </td>

                      <td className="p-3">
                        {isAssigned ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold inline-flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            <span>Placed</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold inline-flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Pending PPA</span>
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isAssigned && (
                            <button
                              onClick={() => handleUnassignCorper(corp)}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-bold text-[11px] cursor-pointer inline-flex items-center gap-1 transition-colors"
                              title="Unassign from current PPA"
                            >
                              <UserX className="w-3 h-3" />
                              <span>Unassign</span>
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setReassigningCorper(corp);
                              setReassignStateFilter(corp.stateOfService || selectedState);
                            }}
                            className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] cursor-pointer inline-flex items-center gap-1 shadow-xs transition-colors"
                            title="Reassign to new available PPA of choice"
                          >
                            <RefreshCw className="w-3 h-3 text-[#f6d884]" />
                            <span>{isAssigned ? 'Reassign' : 'Assign PPA'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Official State Committee & LGIs Members Directory */}
      {activeTab === 'lgis' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Official State Committee Members & LGIs Directory ({currentStateInfo.name} State)
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                Register new committee members or edit the names, telephone numbers and email addresses of each State LGI.
              </p>
            </div>

            <button
              onClick={() => {
                setLgiForm({
                  name: '',
                  lga: currentStateInfo.lgas[0] || '',
                  phone: '',
                  email: '',
                  officeAddress: committeeData.secretariatAddress
                });
                setShowAddLgiModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#008751] hover:bg-[#007043] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4 text-[#f6d884]" />
              <span>Register New LGI Officer</span>
            </button>
          </div>

          {/* LGI Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentLgisList.length > 0 ? (
              currentLgisList.map(lgi => (
                <div
                  key={lgi.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                        {lgi.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{lgi.name}</h4>
                        <span className="text-[11px] text-emerald-800 font-semibold">{lgi.lga}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setEditingLgi(lgi);
                        setLgiForm({
                          name: lgi.name,
                          lga: lgi.lga,
                          phone: lgi.phone,
                          email: lgi.email,
                          officeAddress: lgi.officeAddress || ''
                        });
                      }}
                      className="p-1.5 rounded-lg bg-white hover:bg-emerald-50 text-slate-600 hover:text-emerald-800 border border-slate-200 cursor-pointer transition-colors"
                      title="Edit LGI details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 pt-1 border-t border-slate-200">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <a href={`tel:${lgi.phone}`} className="hover:underline text-slate-800 font-mono">
                        {lgi.phone}
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <a href={`mailto:${lgi.email}`} className="hover:underline text-slate-800 truncate">
                        {lgi.email}
                      </a>
                    </div>

                    {lgi.officeAddress && (
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{lgi.officeAddress}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-10 text-center space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Users className="w-10 h-10 text-slate-400 mx-auto" />
                <h4 className="font-bold text-slate-800 text-sm">No LGI Officers Registered Yet for {currentStateInfo.name}</h4>
                <p className="text-slate-500 text-xs max-w-md mx-auto">
                  Click the button below to register official Local Government Inspectors (LGIs) for each of the {currentStateInfo.lgas.length} local councils in this state.
                </p>
                <button
                  onClick={() => {
                    setLgiForm({
                      name: '',
                      lga: currentStateInfo.lgas[0] || '',
                      phone: '',
                      email: '',
                      officeAddress: committeeData.secretariatAddress
                    });
                    setShowAddLgiModal(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#008751] hover:bg-[#007043] text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4 text-[#f6d884]" />
                  <span>Register First LGI for {currentStateInfo.name}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: NYSC Compliance Audit */}
      {activeTab === 'compliance' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
                NYSC Standard Conditions & Welfare Compliance
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                Audit PPA adherence to the NYSC Welfare Charter (Accommodation, Prompt Stipend, Weekly CDS Release, Biometric Clearance).
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {stateOrgs.map(org => (
              <div key={org.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{org.name}</h4>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {org.lga}, {org.state} • Stipend: {formatNaira(org.stipendMonthly)} • Accommodation: {org.accommodation}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-700">{org.standardRating}</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${org.nyscConditionsCompliant ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                    {org.nyscConditionsCompliant ? 'Compliant' : 'Flagged'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Monthly Reports */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Monthly Behavioral Clearance Reports ({currentStateInfo.name} State)
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Supervisors submit monthly punctuality, integrity, and clearance recommendations directly to this portal.
            </p>
          </div>

          <div className="space-y-3">
            {stateBehavioralRecords.length > 0 ? (
              stateBehavioralRecords.map(rec => (
                <div key={rec.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{rec.corperName}</span>
                    <span className="text-emerald-800 font-mono ml-2">({rec.corperStateCode})</span>
                    <span className="text-slate-500 block">{rec.ppaName} • {rec.month}</span>
                    {rec.remarks && <p className="italic text-slate-600 mt-1">&quot;{rec.remarks}&quot;</p>}
                  </div>

                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold self-start sm:self-auto">
                    {rec.monthlyClearanceStatus}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-xs italic py-6 text-center">
                No monthly clearance reports submitted yet for this state.
              </p>
            )}
          </div>
        </div>
      )}

      {/* MODAL: Register Official State Committee */}
      {showRegisterCommitteeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 my-8 animate-in fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <NyscBadge size={40} />
                <div>
                  <h3 className="text-lg font-black text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Register {currentStateInfo.name} State Committee
                  </h3>
                  <p className="text-slate-500 text-xs">
                    Official Directorate & Local Government Inspectorate Registration
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRegisterCommitteeModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterStateCommittee} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">State Coordinator Full Name</label>
                  <input
                    type="text"
                    required
                    value={committeeForm.stateCoordinator}
                    onChange={e => setCommitteeForm({ ...committeeForm, stateCoordinator: e.target.value })}
                    placeholder="e.g. Mrs. Yetunde Baderinwa"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official Hotline Phone</label>
                  <input
                    type="tel"
                    required
                    value={committeeForm.hotline}
                    onChange={e => setCommitteeForm({ ...committeeForm, hotline: e.target.value })}
                    placeholder="e.g. +234 803 000 1122"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official State NYSC Email</label>
                  <input
                    type="email"
                    required
                    value={committeeForm.email}
                    onChange={e => setCommitteeForm({ ...committeeForm, email: e.target.value })}
                    placeholder={`e.g. ${currentStateInfo.code.toLowerCase()}@nysc.gov.ng`}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Secretariat Office Address</label>
                  <input
                    type="text"
                    required
                    value={committeeForm.secretariatAddress}
                    onChange={e => setCommitteeForm({ ...committeeForm, secretariatAddress: e.target.value })}
                    placeholder={`Bompai Road / Secretariat, ${currentStateInfo.capital}`}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Permanent Orientation Camp Location</label>
                <input
                  type="text"
                  required
                  value={committeeForm.orientationCampLocation}
                  onChange={e => setCommitteeForm({ ...committeeForm, orientationCampLocation: e.target.value })}
                  placeholder="e.g. NYSC Permanent Camp, Iyana-Ipaja, Lagos"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none"
                />
              </div>

              {/* Initial LGI Inspector Detail */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 text-xs block">
                  Lead / Initial Local Government Inspector (LGI) Details
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">LGI Officer Full Name</label>
                    <input
                      type="text"
                      required
                      value={committeeForm.initialLgiName}
                      onChange={e => setCommitteeForm({ ...committeeForm, initialLgiName: e.target.value })}
                      placeholder="e.g. Inspector Aliyu Danjuma"
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Designated LGA</label>
                    <select
                      value={committeeForm.initialLgiLga}
                      onChange={e => setCommitteeForm({ ...committeeForm, initialLgiLga: e.target.value })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-none"
                    >
                      {currentStateInfo.lgas.map(lga => (
                        <option key={lga} value={lga}>{lga} LGA</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">LGI Direct Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={committeeForm.initialLgiPhone}
                      onChange={e => setCommitteeForm({ ...committeeForm, initialLgiPhone: e.target.value })}
                      placeholder="+234 802 333 4455"
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">LGI Official Email</label>
                    <input
                      type="email"
                      required
                      value={committeeForm.initialLgiEmail}
                      onChange={e => setCommitteeForm({ ...committeeForm, initialLgiEmail: e.target.value })}
                      placeholder="lgi.metro@nysc.gov.ng"
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRegisterCommitteeModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#008751] hover:bg-[#007043] text-white font-bold cursor-pointer shadow-md"
                >
                  Confirm & Register Committee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add / Edit LGI Member */}
      {(showAddLgiModal || editingLgi) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {editingLgi ? 'Edit LGI Member Details' : `Register New LGI Officer (${currentStateInfo.name})`}
              </h3>
              <button
                onClick={() => {
                  setShowAddLgiModal(false);
                  setEditingLgi(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLgi} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">LGI Officer Full Name</label>
                <input
                  type="text"
                  required
                  value={lgiForm.name}
                  onChange={e => setLgiForm({ ...lgiForm, name: e.target.value })}
                  placeholder="e.g. Inspector Chukwuma Eze"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Local Government Area (LGA)</label>
                <select
                  value={lgiForm.lga}
                  onChange={e => setLgiForm({ ...lgiForm, lga: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none"
                >
                  {currentStateInfo.lgas.map(lga => (
                    <option key={lga} value={lga}>{lga} LGA</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={lgiForm.phone}
                    onChange={e => setLgiForm({ ...lgiForm, phone: e.target.value })}
                    placeholder="+234 803 111 2233"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    required
                    value={lgiForm.email}
                    onChange={e => setLgiForm({ ...lgiForm, email: e.target.value })}
                    placeholder="lgi.officer@nysc.gov.ng"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Office / Zonal Address</label>
                <input
                  type="text"
                  value={lgiForm.officeAddress}
                  onChange={e => setLgiForm({ ...lgiForm, officeAddress: e.target.value })}
                  placeholder="LGA Council Secretariat, NYSC Inspection Room..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddLgiModal(false);
                    setEditingLgi(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#008751] text-white font-bold cursor-pointer shadow-sm"
                >
                  {editingLgi ? 'Save Changes' : 'Register LGI'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Reassign Corper to New PPA */}
      {reassigningCorper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 my-8 animate-in fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] uppercase tracking-wider">
                  Official NYSC Reassignment Desk
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  Reassign {reassigningCorper.name} ({reassigningCorper.stateCode})
                </h3>
                <p className="text-slate-500 text-xs">
                  Discipline: <strong>{reassigningCorper.courseOfStudy}</strong> • Batch: <strong>{reassigningCorper.serviceBatch}</strong>
                </p>
              </div>
              <button
                onClick={() => setReassigningCorper(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Preferred State & Search */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Corper&apos;s Preferred State / Location
                </label>
                <select
                  value={reassignStateFilter}
                  onChange={e => setReassignStateFilter(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl outline-none font-semibold cursor-pointer"
                >
                  {NIGERIAN_STATES.map(s => (
                    <option key={s.code} value={s.name}>
                      {s.name} State ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Search Organizations</label>
                <input
                  type="text"
                  value={reassignSearch}
                  onChange={e => setReassignSearch(e.target.value)}
                  placeholder="Filter by name, LGA, sector..."
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl outline-none"
                />
              </div>
            </div>

            {/* List of Available PPAs in Target State */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              <span className="font-bold text-slate-800 text-xs block">
                Available PPAs with Open Slots in {reassignStateFilter} State:
              </span>

              {organizations
                .filter(
                  o =>
                    o.state.toLowerCase() === reassignStateFilter.toLowerCase() &&
                    o.slotsOccupied < o.slotsNeeded &&
                    (reassignSearch ? o.name.toLowerCase().includes(reassignSearch.toLowerCase()) || o.sector.toLowerCase().includes(reassignSearch.toLowerCase()) : true)
                )
                .map(targetOrg => {
                  const slotsLeft = targetOrg.slotsNeeded - targetOrg.slotsOccupied;
                  const disciplineMatch = targetOrg.preferredDisciplines?.some(d =>
                    reassigningCorper.courseOfStudy.toLowerCase().includes(d.toLowerCase())
                  );

                  return (
                    <div
                      key={targetOrg.id}
                      className="p-4 rounded-xl border border-slate-200 hover:border-emerald-400 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{targetOrg.name}</h4>
                          {disciplineMatch && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold inline-flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>Course Match</span>
                            </span>
                          )}
                        </div>

                        <p className="text-slate-500 text-xs">
                          {targetOrg.lga}, {targetOrg.state} • Sector: <strong>{targetOrg.sector}</strong>
                        </p>

                        <div className="flex items-center gap-3 text-slate-600 text-[11px] pt-0.5">
                          <span>Accommodation: <strong>{targetOrg.accommodation}</strong></span>
                          <span>•</span>
                          <span>Stipend: <strong className="text-emerald-800">{formatNaira(targetOrg.stipendMonthly)}</strong></span>
                          <span>•</span>
                          <span className="text-emerald-700 font-bold">{slotsLeft} Open Slot{slotsLeft > 1 ? 's' : ''}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleReassignCorper(reassigningCorper, targetOrg)}
                        className="px-4 py-2 rounded-xl bg-[#008751] hover:bg-[#007043] text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs transition-colors"
                      >
                        Reassign to This PPA
                      </button>
                    </div>
                  );
                })}

              {organizations.filter(
                o =>
                  o.state.toLowerCase() === reassignStateFilter.toLowerCase() &&
                  o.slotsOccupied < o.slotsNeeded
              ).length === 0 && (
                <div className="p-6 bg-slate-50 rounded-xl text-center text-slate-500 text-xs">
                  No open PPA quota slots currently available in {reassignStateFilter} State. Try switching to a neighboring state.
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setReassigningCorper(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Close Reassignment Desk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
