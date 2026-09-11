import React, { useState } from 'react';
import {
  Organization,
  BehavioralRecord,
  CorperProfile,
  AccommodationType,
  OrganizationSector
} from '../types';
import { NIGERIAN_STATES } from '../data/nigeriaStates';
import { formatNaira } from '../utils/helpers';
import {
  Building2,
  PlusCircle,
  Users,
  Home,
  MapPin,
  FileCheck,
  Send,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Mail,
  ShieldCheck,
  Clock,
  Award,
  X,
  Briefcase,
  ChevronRight,
  UserCheck,
  Upload,
  Camera,
  Image as ImageIcon,
  Check,
  FileText
} from 'lucide-react';
import { NyscBadge } from './NyscBadge';

interface OrganizationDashboardProps {
  organizations: Organization[];
  setOrganizations: React.Dispatch<React.SetStateAction<Organization[]>>;
  behavioralRecords: BehavioralRecord[];
  setBehavioralRecords: React.Dispatch<React.SetStateAction<BehavioralRecord[]>>;
  corpers: CorperProfile[];
  setCorpers?: React.Dispatch<React.SetStateAction<CorperProfile[]>>;
  placementRequests?: import('../types').PlacementRequest[];
  setPlacementRequests?: React.Dispatch<React.SetStateAction<import('../types').PlacementRequest[]>>;
  currentOrgId?: string;
  onOpenOrgDetail: (org: Organization) => void;
  onLogActivity?: (act: import('../types').ActivityLog) => void;
}

export const OrganizationDashboard: React.FC<OrganizationDashboardProps> = ({
  organizations,
  setOrganizations,
  behavioralRecords,
  setBehavioralRecords,
  corpers,
  setCorpers,
  placementRequests = [],
  setPlacementRequests,
  onOpenOrgDetail,
  onLogActivity
}) => {
  // Currently active organization in view (allows selecting which employer portal to manage)
  const [activeOrgId, setActiveOrgId] = useState<string>(organizations[0]?.id || '');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Reject modal state
  const [rejectingRequest, setRejectingRequest] = useState<import('../types').PlacementRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Quota capacity already filled (No vacant slots)');
  const [customRejectionReason, setCustomRejectionReason] = useState('');

  // Accepted Letter View Modal
  const [viewingAcceptedRequest, setViewingAcceptedRequest] = useState<import('../types').PlacementRequest | null>(null);

  // New Organization Registration Form
  const [newOrgForm, setNewOrgForm] = useState({
    name: '',
    state: 'Lagos',
    lga: '',
    address: '',
    phone: '',
    email: '',
    sector: 'Information Technology & Software' as OrganizationSector,
    isCustomSector: false,
    customSector: '',
    departments: 'Engineering, Operations, Quality Assurance',
    slotsNeeded: 3,
    accommodation: 'Provided (Free Corpers Lodge)' as AccommodationType,
    stipendMonthly: 50000,
    preferredDisciplines: 'Computer Science, Electrical Engineering',
    description: '',
    logoUrl: ''
  });

  // Behavioral Report Form
  const [reportForm, setReportForm] = useState({
    corperId: corpers[0]?.id || '',
    corperName: corpers[0]?.name || '',
    corperStateCode: corpers[0]?.stateCode || '',
    month: 'Month 6 (June)',
    punctuality: 'Outstanding' as 'Outstanding' | 'Satisfactory' | 'Needs Improvement' | 'Unsatisfactory',
    discipline: 'Exemplary' as 'Exemplary' | 'Good' | 'Fair' | 'Queried',
    workEthics: 'High Dedication' as 'High Dedication' | 'Average' | 'Poor',
    integrity: 'Trustworthy' as 'Trustworthy' | 'Fair' | 'Questionable',
    monthlyClearanceStatus: 'Approved - Eligible for Federal Allowance' as 'Approved - Eligible for Federal Allowance' | 'Withheld - Pending Explanation' | 'Queried - Disciplinary Action',
    remarks: '',
    supervisorName: ''
  });

  const activeOrg = organizations.find(o => o.id === activeOrgId) || organizations[0];
  const activeStateObj = NIGERIAN_STATES.find(s => s.name === newOrgForm.state) || NIGERIAN_STATES[0];

  // Handler for changing the active company's logo directly on the dashboard
  const handleActiveOrgLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setOrganizations(prev =>
          prev.map(o => (o.id === activeOrg.id ? { ...o, logoUrl: dataUrl } : o))
        );
        alert(`Logo for ${activeOrg.name} has been updated successfully!`);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler for uploading logo in the new company registration modal
  const handleModalLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewOrgForm(prev => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegisterOrganization = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSector = (newOrgForm.isCustomSector && newOrgForm.customSector.trim())
      ? (newOrgForm.customSector.trim() as OrganizationSector)
      : newOrgForm.sector;

    const createdOrg: Organization = {
      id: `org-${Date.now()}`,
      name: newOrgForm.name,
      logoUrl: newOrgForm.logoUrl || undefined,
      state: newOrgForm.state,
      lga: newOrgForm.lga || activeStateObj.lgas[0] || 'Municipal',
      address: newOrgForm.address,
      phone: newOrgForm.phone,
      email: newOrgForm.email,
      sector: finalSector,
      departments: newOrgForm.departments.split(',').map(d => d.trim()).filter(Boolean),
      slotsNeeded: Number(newOrgForm.slotsNeeded),
      slotsOccupied: 0,
      accommodation: newOrgForm.accommodation,
      stipendMonthly: Number(newOrgForm.stipendMonthly),
      preferredDisciplines: newOrgForm.preferredDisciplines.split(',').map(d => d.trim()).filter(Boolean),
      preferredSkills: ['Project Management', 'Communication'],
      standardRating: 'Grade B - Standard Approved',
      nyscConditionsCompliant: true,
      safetyRating: 4,
      description: newOrgForm.description || 'Accredited establishment seeking dedicated corpers.',
      verifiedByNysc: true
    };

    setOrganizations(prev => [createdOrg, ...prev]);
    setActiveOrgId(createdOrg.id);
    setShowRegisterModal(false);
    alert(`Success! "${createdOrg.name}" has been registered into the NYSC PPA Quota Directory.`);
  };

  const handleSubmitBehavioralReport = (e: React.FormEvent) => {
    e.preventDefault();
    const newRec: BehavioralRecord = {
      id: `beh-${Date.now()}`,
      corperId: reportForm.corperId || `corp-${Date.now()}`,
      corperName: reportForm.corperName,
      corperStateCode: reportForm.corperStateCode,
      ppaId: activeOrg.id,
      ppaName: activeOrg.name,
      month: reportForm.month,
      punctuality: reportForm.punctuality,
      discipline: reportForm.discipline,
      workEthics: reportForm.workEthics,
      integrity: reportForm.integrity,
      monthlyClearanceStatus: reportForm.monthlyClearanceStatus,
      remarks: reportForm.remarks,
      supervisorName: reportForm.supervisorName || 'Department Head',
      submittedDate: new Date().toISOString().split('T')[0]
    };

    setBehavioralRecords(prev => [newRec, ...prev]);
    setShowReportModal(false);
    alert(`Behavioral Evaluation for Corper ${newRec.corperName} (${newRec.corperStateCode}) has been officially forwarded to the Local Government Inspector (LGI).`);
  };

  const handleAcceptPlacementRequest = (req: import('../types').PlacementRequest) => {
    if (!activeOrg) return;

    if (activeOrg.slotsOccupied >= activeOrg.slotsNeeded) {
      const confirmOver = window.confirm(
        `Notice: ${activeOrg.name} has already reached its allocated NYSC quota (${activeOrg.slotsOccupied}/${activeOrg.slotsNeeded} slots). Do you wish to accept ${req.corperName} as an additional intake?`
      );
      if (!confirmOver) return;
    }

    // 1. Update placement request status
    if (setPlacementRequests) {
      setPlacementRequests(prev =>
        prev.map(r =>
          r.id === req.id
            ? { ...r, status: 'accepted', decisionDate: new Date().toISOString() }
            : r
        )
      );
    }

    // 2. Increment organization slots occupied
    setOrganizations(prev =>
      prev.map(o =>
        o.id === activeOrg.id
          ? { ...o, slotsOccupied: o.slotsOccupied + 1 }
          : o
      )
    );

    // 3. Update corper status if in state
    if (setCorpers) {
      setCorpers(prev =>
        prev.map(c =>
          c.id === req.corperId || c.stateCode === req.corperStateCode
            ? { ...c, assignedPpaId: activeOrg.id, assignmentStatus: 'accepted' as const, rejectionReason: undefined }
            : c
        )
      );
    }

    // 4. Log activity
    if (onLogActivity) {
      onLogActivity({
        id: `act-${Date.now()}`,
        userId: activeOrg.id,
        userName: activeOrg.name,
        userRole: 'organization',
        action: 'Accepted Corps Member Placement',
        details: `Officially accepted and allocated quota slot for ${req.corperName} (${req.corperStateCode}).`,
        timestamp: new Date().toISOString()
      });
    }

    setViewingAcceptedRequest(req);
  };

  const handleConfirmRejection = () => {
    if (!rejectingRequest || !activeOrg) return;

    const finalReason = rejectionReason === 'Other / Custom Justification'
      ? customRejectionReason.trim() || 'Quota constraints'
      : rejectionReason;

    // 1. Update placement request
    if (setPlacementRequests) {
      setPlacementRequests(prev =>
        prev.map(r =>
          r.id === rejectingRequest.id
            ? { ...r, status: 'rejected', decisionDate: new Date().toISOString(), rejectionReason: finalReason }
            : r
        )
      );
    }

    // 2. Update corper status
    if (setCorpers) {
      setCorpers(prev =>
        prev.map(c =>
          c.id === rejectingRequest.corperId || c.stateCode === rejectingRequest.corperStateCode
            ? { ...c, assignmentStatus: 'rejected' as const, rejectionReason: finalReason }
            : c
        )
      );
    }

    // 3. Log activity
    if (onLogActivity) {
      onLogActivity({
        id: `act-${Date.now()}`,
        userId: activeOrg.id,
        userName: activeOrg.name,
        userRole: 'organization',
        action: 'Rejected Corps Member Placement',
        details: `Declined request from ${rejectingRequest.corperName} (${rejectingRequest.corperStateCode}). Reason: ${finalReason}.`,
        timestamp: new Date().toISOString()
      });
    }

    alert(`Placement request from ${rejectingRequest.corperName} has been officially rejected. The Corps member has been notified on their dashboard.`);
    setRejectingRequest(null);
    setCustomRejectionReason('');
  };

  const orgBehavioralRecords = behavioralRecords.filter(r => r.ppaId === activeOrg?.id);
  const slotsRemaining = activeOrg ? Math.max(0, activeOrg.slotsNeeded - activeOrg.slotsOccupied) : 0;
  const isOccupied = activeOrg ? activeOrg.slotsOccupied >= activeOrg.slotsNeeded : false;

  // Filter requests for active organization
  const orgPlacementRequests = placementRequests.filter(r => r.ppaId === activeOrg?.id);
  const pendingRequestsCount = orgPlacementRequests.filter(r => r.status === 'pending').length;

  return (
    <div id="organization-dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Quick Org Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-950 via-[#064228] to-[#008751] text-white p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="relative group shrink-0">
                {activeOrg?.logoUrl ? (
                  <img
                    src={activeOrg.logoUrl}
                    alt={activeOrg.name}
                    className="w-16 h-16 rounded-2xl object-contain bg-white p-1.5 border border-white/30 shadow-md"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-md">
                    <Building2 className="w-10 h-10 text-[#f6d884]" />
                  </div>
                )}
                <label
                  htmlFor="change-company-logo-input"
                  className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-[#C89D3C] hover:bg-[#b08427] text-slate-950 shadow-md cursor-pointer transition-transform hover:scale-110"
                  title="Upload or Change Company Logo"
                >
                  <Camera className="w-3.5 h-3.5" />
                </label>
                <input
                  id="change-company-logo-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleActiveOrgLogoChange}
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#C89D3C] text-slate-950 font-bold text-xs uppercase tracking-wider">
                    Employer & PPA Portal
                  </span>
                  <span className="text-emerald-200 text-xs">• 36 States NYSC Registry</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {activeOrg ? activeOrg.name : 'Organization Workspace'}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-emerald-100 text-xs sm:text-sm">
                    {activeOrg?.sector} • {activeOrg?.lga}, {activeOrg?.state} State
                  </p>
                  <label
                    htmlFor="change-company-logo-input"
                    className="hidden sm:inline-flex items-center gap-1 text-[11px] text-[#f6d884] hover:text-white underline cursor-pointer"
                  >
                    <Camera className="w-3 h-3" />
                    <span>Change Logo</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                id="btn-register-new-org"
                onClick={() => setShowRegisterModal(true)}
                className="px-4 py-2.5 rounded-xl bg-[#C89D3C] hover:bg-[#b08427] text-slate-950 text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Register New Company / PPA</span>
              </button>

              <button
                id="btn-submit-behavioral-report"
                onClick={() => setShowReportModal(true)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <FileCheck className="w-4 h-4 text-[#f6d884]" />
                <span>Send Corper Behavioral Report</span>
              </button>
            </div>
          </div>

          {/* Active Company Selector Pill */}
          <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-emerald-200 font-semibold">Switch Managing Organization:</span>
              <select
                value={activeOrgId}
                onChange={e => setActiveOrgId(e.target.value)}
                className="px-3 py-1.5 bg-black/30 border border-white/20 rounded-xl text-white font-bold text-xs focus:ring-2 focus:ring-[#C89D3C] outline-none cursor-pointer"
              >
                {organizations.map(org => (
                  <option key={org.id} value={org.id} className="bg-slate-900 text-white">
                    {org.name} ({org.state} - {org.lga})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-4 text-emerald-200 text-xs">
              <span>Standard: <strong className="text-white">{activeOrg?.standardRating.split('-')[0]}</strong></span>
              <span>•</span>
              <span>NYSC Verified: <strong className="text-emerald-300">Compliant</strong></span>
            </div>
          </div>
        </div>

        {/* Live Quota & Contact Details */}
        {activeOrg && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-slate-50 border-t border-slate-100 text-xs">
            {/* Quota Tracker */}
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block">Corper Quota Status</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-black text-slate-900 font-mono">
                  {activeOrg.slotsOccupied} / {activeOrg.slotsNeeded}
                </span>
                {isOccupied ? (
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                    Occupied (Full)
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    {slotsRemaining} Slot{slotsRemaining > 1 ? 's' : ''} Open
                  </span>
                )}
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${isOccupied ? 'bg-rose-500' : 'bg-[#008751]'}`}
                  style={{ width: `${Math.min(100, (activeOrg.slotsOccupied / activeOrg.slotsNeeded) * 100)}%` }}
                />
              </div>
            </div>

            {/* Accommodation Provided */}
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block">Accommodation Offered</span>
              <div className="flex items-center gap-2 mt-1 font-bold text-slate-800 text-sm">
                <Home className="w-4 h-4 text-[#008751]" />
                <span className="truncate">{activeOrg.accommodation}</span>
              </div>
              <span className="text-[11px] text-slate-500 block mt-1">
                Monthly Stipend: <strong className="text-emerald-800">{formatNaira(activeOrg.stipendMonthly)}</strong>
              </span>
            </div>

            {/* Contact Location */}
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block">Physical Address & Contact</span>
              <div className="flex items-start gap-1.5 mt-1 text-slate-700 font-medium leading-snug text-xs">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{activeOrg.address}, {activeOrg.lga}, {activeOrg.state}</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1.5">
                <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> {activeOrg.phone}</span>
              </div>
            </div>

            {/* Departments */}
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block">Company Departments</span>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {activeOrg.departments.map((dept, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold">
                    {dept}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* INCOMING CORPS MEMBER PLACEMENT REQUESTS (ACCEPT / REJECT WORKFLOW) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#008751]" />
              <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Corps Member Placement Requests & Applications
              </h2>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Review and act on direct applications submitted by deployed corps members in {activeOrg?.state}. Accept candidates to fill your quota or issue official rejection notifications.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
              pendingRequestsCount > 0
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-emerald-100 text-emerald-800 border-emerald-200'
            }`}>
              {pendingRequestsCount} Pending {pendingRequestsCount === 1 ? 'Request' : 'Requests'}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
              {orgPlacementRequests.length} Total Applications
            </span>
          </div>
        </div>

        {orgPlacementRequests.length === 0 ? (
          <div className="p-8 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No Placement Requests Yet</h4>
            <p className="text-slate-500 text-xs max-w-md mx-auto mt-1">
              When corps members mobilized to {activeOrg?.state} browse the directory and apply to {activeOrg?.name}, their applications will appear here for your review, acceptance, or rejection.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orgPlacementRequests.map(req => {
              const matchingCorper = corpers.find(c => c.id === req.corperId || c.stateCode === req.corperStateCode);

              return (
                <div
                  key={req.id}
                  className={`p-5 rounded-xl border transition-all ${
                    req.status === 'pending'
                      ? 'bg-amber-50/50 border-amber-200 shadow-xs'
                      : req.status === 'accepted'
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-rose-50/40 border-rose-200 opacity-90'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-base">{req.corperName}</span>
                        <span className="font-mono text-xs font-bold bg-white text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300 shadow-2xs">
                          {req.corperStateCode}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {req.category}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          req.status === 'pending'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : req.status === 'accepted'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}>
                          {req.status === 'pending' ? '⏳ Awaiting Decision' : req.status === 'accepted' ? '✓ Accepted & Placed' : '✕ Rejected'}
                        </span>
                      </div>

                      <div className="text-xs text-slate-700 flex flex-wrap items-center gap-x-4 gap-y-1">
                        <span>Course: <strong>{req.courseOfStudy}</strong></span>
                        <span>Applied: <strong>{new Date(req.requestDate).toLocaleDateString()}</strong></span>
                        {matchingCorper?.phone && (
                          <span className="flex items-center gap-1 text-slate-500">
                            <Phone className="w-3 h-3" /> {matchingCorper.phone}
                          </span>
                        )}
                      </div>

                      {/* Soft Skills */}
                      {matchingCorper?.softSkills && matchingCorper.softSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {matchingCorper.softSkills.map((skill, sIdx) => (
                            <span key={sIdx} className="px-2 py-0.5 rounded-md bg-white text-slate-600 border border-slate-200 text-[10px] font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Applicant Note */}
                      {req.notes && (
                        <p className="text-xs text-slate-600 bg-white/80 p-2.5 rounded-lg border border-slate-200 italic">
                          &ldquo;{req.notes}&rdquo;
                        </p>
                      )}

                      {/* Rejection Note Display */}
                      {req.status === 'rejected' && req.rejectionReason && (
                        <div className="text-xs text-rose-700 bg-rose-100/60 p-2.5 rounded-lg border border-rose-200 font-medium">
                          <strong>Official Rejection Justification:</strong> {req.rejectionReason}
                        </div>
                      )}
                    </div>

                    {/* Action Controls for Company */}
                    <div className="flex flex-wrap lg:flex-col items-center lg:items-end gap-2 shrink-0">
                      {req.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleAcceptPlacementRequest(req)}
                            className="px-4 py-2 rounded-xl bg-[#008751] hover:bg-[#007043] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                            <span>Accept Corper</span>
                          </button>

                          <button
                            onClick={() => {
                              setRejectingRequest(req);
                              setRejectionReason('Quota capacity already filled (No vacant slots)');
                            }}
                            className="px-4 py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                            <span>Reject Request</span>
                          </button>
                        </>
                      )}

                      {req.status === 'accepted' && (
                        <button
                          onClick={() => setViewingAcceptedRequest(req)}
                          className="px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <FileText className="w-4 h-4 text-emerald-600" />
                          <span>View Official Acceptance Letter</span>
                        </button>
                      )}

                      {req.status === 'rejected' && (
                        <button
                          onClick={() => handleAcceptPlacementRequest(req)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
                        >
                          Reconsider & Accept
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Behavioral Records Section (Reports sent by company on Corp Members) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#008751]" />
              <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Corp Member Behavioral Evaluations & Clearance Records
              </h2>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Official monthly performance and conduct reviews submitted by {activeOrg?.name} to NYSC Local Government Inspector.
            </p>
          </div>

          <button
            onClick={() => setShowReportModal(true)}
            className="px-4 py-2 rounded-xl bg-[#008751] hover:bg-[#007043] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Send className="w-4 h-4" />
            <span>Submit New Behavioral Record</span>
          </button>
        </div>

        {orgBehavioralRecords.length === 0 ? (
          <div className="p-8 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <UserCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No behavioral evaluations submitted yet</h4>
            <p className="text-slate-500 text-xs max-w-sm mx-auto mt-1">
              Employers submit monthly behavioral evaluations (punctuality, discipline, work ethics, integrity) to authorize the Federal government allowance.
            </p>
            <button
              onClick={() => setShowReportModal(true)}
              className="mt-3 px-4 py-2 rounded-xl bg-[#008751] text-white text-xs font-bold cursor-pointer"
            >
              Evaluate a Corp Member Now
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {orgBehavioralRecords.map(rec => (
              <div
                key={rec.id}
                className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{rec.corperName}</span>
                    <span className="font-mono text-xs text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                      {rec.corperStateCode}
                    </span>
                    <span className="text-slate-400 text-xs">•</span>
                    <span className="text-xs text-slate-600 font-semibold">{rec.month}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                      Punctuality: <strong>{rec.punctuality}</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                      Discipline: <strong>{rec.discipline}</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                      Work Ethics: <strong>{rec.workEthics}</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                      Integrity: <strong>{rec.integrity}</strong>
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 italic">
                    &ldquo;{rec.remarks}&rdquo;
                  </p>
                  <div className="text-[10px] text-slate-400">
                    Evaluated by {rec.supervisorName} on {rec.submittedDate}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {rec.monthlyClearanceStatus}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Sent to Local Government Inspector (LGI)
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Register Organization Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Building2 className="w-6 h-6 text-[#008751]" />
                <h3 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  Register Company / Organization for NYSC PPA
                </h3>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterOrganization} className="space-y-4 pt-4 text-xs">
              {/* Organization Logo Upload */}
              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl border-2 border-dashed border-emerald-300 bg-white flex items-center justify-center overflow-hidden shrink-0">
                  {newOrgForm.logoUrl ? (
                    <img
                      src={newOrgForm.logoUrl}
                      alt="Logo preview"
                      className="w-full h-full object-contain p-1"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <Building2 className="w-6 h-6 text-emerald-400" />
                  )}
                </div>
                <div className="flex-1">
                  <label className="block font-bold text-slate-800 text-xs mb-0.5">
                    Company / Organization Logo (Optional)
                  </label>
                  <p className="text-[11px] text-slate-500 mb-1.5">
                    Upload your official emblem or brand mark. You can also change it later on your dashboard.
                  </p>
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="modal-org-logo-upload"
                      className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{newOrgForm.logoUrl ? 'Change Logo' : 'Upload Logo'}</span>
                    </label>
                    {newOrgForm.logoUrl && (
                      <button
                        type="button"
                        onClick={() => setNewOrgForm(prev => ({ ...prev, logoUrl: '' }))}
                        className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input
                    id="modal-org-logo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleModalLogoChange}
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Company / Organization Name</label>
                <input
                  type="text"
                  required
                  value={newOrgForm.name}
                  onChange={e => setNewOrgForm({ ...newOrgForm, name: e.target.value })}
                  placeholder="e.g. Nigerian National Petroleum Co., Federal Science College, Zenith Hub..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">State of Organization Residence</label>
                  <select
                    value={newOrgForm.state}
                    onChange={e => {
                      const st = e.target.value;
                      const sObj = NIGERIAN_STATES.find(s => s.name === st);
                      setNewOrgForm({
                        ...newOrgForm,
                        state: st,
                        lga: sObj?.lgas[0] || ''
                      });
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#008751] outline-none cursor-pointer"
                  >
                    {NIGERIAN_STATES.map(s => (
                      <option key={s.code} value={s.name}>{s.name} State</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Local Government Area (LGA)</label>
                  <select
                    value={newOrgForm.lga}
                    onChange={e => setNewOrgForm({ ...newOrgForm, lga: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#008751] outline-none cursor-pointer"
                  >
                    {activeStateObj.lgas.map(lga => (
                      <option key={lga} value={lga}>{lga}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Physical Street Address / Location</label>
                <input
                  type="text"
                  required
                  value={newOrgForm.address}
                  onChange={e => setNewOrgForm({ ...newOrgForm, address: e.target.value })}
                  placeholder="Plot 12, Commercial Road, Industrial Estate..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={newOrgForm.phone}
                    onChange={e => setNewOrgForm({ ...newOrgForm, phone: e.target.value })}
                    placeholder="+234 803 000 1122"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official Email Address</label>
                  <input
                    type="email"
                    required
                    value={newOrgForm.email}
                    onChange={e => setNewOrgForm({ ...newOrgForm, email: e.target.value })}
                    placeholder="hr-nysc@organization.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Number of Corpers Needed (PPA Quota)</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    required
                    value={newOrgForm.slotsNeeded}
                    onChange={e => setNewOrgForm({ ...newOrgForm, slotsNeeded: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Accommodation Offered (Optional Dropdown Yes/No)
                  </label>
                  <select
                    value={newOrgForm.accommodation}
                    onChange={e => setNewOrgForm({ ...newOrgForm, accommodation: e.target.value as AccommodationType })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#008751] outline-none cursor-pointer font-medium"
                  >
                    <option value="Provided (Free Corpers Lodge)">Yes - Provided (Free Corpers Lodge)</option>
                    <option value="Subsidized Housing">Yes - Subsidized Housing Allowance</option>
                    <option value="None (Transport Allowance)">No - Transport Allowance Provided Only</option>
                    <option value="None">No - Accommodation Not Offered</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Monthly Stipend Offered (₦)</label>
                  <input
                    type="number"
                    min={0}
                    step={5000}
                    value={newOrgForm.stipendMonthly}
                    onChange={e => setNewOrgForm({ ...newOrgForm, stipendMonthly: Number(e.target.value) })}
                    placeholder="e.g. 50000"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Primary Sector (Dropdown or Type Custom)
                  </label>
                  <select
                    value={newOrgForm.isCustomSector ? 'Other (Type Custom Sector)' : newOrgForm.sector}
                    onChange={e => {
                      if (e.target.value === 'Other (Type Custom Sector)') {
                        setNewOrgForm({ ...newOrgForm, isCustomSector: true });
                      } else {
                        setNewOrgForm({
                          ...newOrgForm,
                          isCustomSector: false,
                          sector: e.target.value as OrganizationSector
                        });
                      }
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#008751] outline-none cursor-pointer"
                  >
                    <option value="Information Technology & Software">Information Technology & Software</option>
                    <option value="Education (Secondary/College)">Education (Secondary/College)</option>
                    <option value="Healthcare & Hospital">Healthcare & Hospital</option>
                    <option value="Banking & Financial Services">Banking & Financial Services</option>
                    <option value="Engineering & Construction">Engineering & Construction</option>
                    <option value="Government Ministry / Parastatal">Government Ministry / Parastatal</option>
                    <option value="Agriculture & Agro-allied">Agriculture & Agro-allied</option>
                    <option value="Manufacturing & FMCG">Manufacturing & FMCG</option>
                    <option value="Media & Communications">Media & Communications</option>
                    <option value="Legal & Professional Services">Legal & Professional Services</option>
                    <option value="Other (Type Custom Sector)">Other (Type Custom Sector)</option>
                  </select>

                  {newOrgForm.isCustomSector && (
                    <input
                      type="text"
                      placeholder="Type your primary sector here..."
                      value={newOrgForm.customSector}
                      onChange={e => setNewOrgForm({ ...newOrgForm, customSector: e.target.value })}
                      className="w-full mt-2 p-2 bg-amber-50 border border-amber-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Company Departments (Optional - comma separated)
                </label>
                <input
                  type="text"
                  value={newOrgForm.departments}
                  onChange={e => setNewOrgForm({ ...newOrgForm, departments: e.target.value })}
                  placeholder="e.g. IT, Admin, Production, Accounts, Legal"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none text-xs"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#008751] hover:bg-[#007043] text-white font-bold cursor-pointer shadow-md"
                >
                  Register Organization
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Behavioral Record Form Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileCheck className="w-6 h-6 text-[#008751]" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Send Corp Member Behavioral Record
                  </h3>
                  <p className="text-xs text-slate-500">
                    Official evaluation submitted to the NYSC Local Government Inspector (LGI).
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitBehavioralReport} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Corp Member Name</label>
                  <input
                    type="text"
                    required
                    value={reportForm.corperName}
                    onChange={e => setReportForm({ ...reportForm, corperName: e.target.value })}
                    placeholder="e.g. Chidubem Emmanuel Okafor"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">State Code</label>
                  <input
                    type="text"
                    required
                    value={reportForm.corperStateCode}
                    onChange={e => setReportForm({ ...reportForm, corperStateCode: e.target.value.toUpperCase() })}
                    placeholder="e.g. LA/24B/1042"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-[#008751] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Evaluation Period / Month</label>
                <input
                  type="text"
                  required
                  value={reportForm.month}
                  onChange={e => setReportForm({ ...reportForm, month: e.target.value })}
                  placeholder="e.g. Month 8 (October 2025)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none text-xs"
                />
              </div>

              {/* 4 Behavioral Criteria */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Punctuality</label>
                  <select
                    value={reportForm.punctuality}
                    onChange={e => setReportForm({ ...reportForm, punctuality: e.target.value as any })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="Outstanding">Outstanding</option>
                    <option value="Satisfactory">Satisfactory</option>
                    <option value="Needs Improvement">Needs Improvement</option>
                    <option value="Unsatisfactory">Unsatisfactory</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discipline</label>
                  <select
                    value={reportForm.discipline}
                    onChange={e => setReportForm({ ...reportForm, discipline: e.target.value as any })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="Exemplary">Exemplary</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Queried">Queried</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Work Ethics</label>
                  <select
                    value={reportForm.workEthics}
                    onChange={e => setReportForm({ ...reportForm, workEthics: e.target.value as any })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="High Dedication">High Dedication</option>
                    <option value="Average">Average</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Integrity</label>
                  <select
                    value={reportForm.integrity}
                    onChange={e => setReportForm({ ...reportForm, integrity: e.target.value as any })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="Trustworthy">Trustworthy</option>
                    <option value="Fair">Fair</option>
                    <option value="Questionable">Questionable</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Monthly NYSC Allowance Clearance Decision</label>
                <select
                  value={reportForm.monthlyClearanceStatus}
                  onChange={e => setReportForm({ ...reportForm, monthlyClearanceStatus: e.target.value as any })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#008751] outline-none"
                >
                  <option value="Approved - Eligible for Federal Allowance">Approved - Eligible for Federal Allowance</option>
                  <option value="Withheld - Pending Explanation">Withheld - Pending Explanation</option>
                  <option value="Queried - Disciplinary Action">Queried - Disciplinary Action</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Behavioral Remarks / Supervisor Notes</label>
                <textarea
                  required
                  rows={3}
                  value={reportForm.remarks}
                  onChange={e => setReportForm({ ...reportForm, remarks: e.target.value })}
                  placeholder="Record observations regarding attendance, assigned task execution, respect for regulations, or commendations..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Supervisor Name & Title</label>
                <input
                  type="text"
                  required
                  value={reportForm.supervisorName}
                  onChange={e => setReportForm({ ...reportForm, supervisorName: e.target.value })}
                  placeholder="e.g. Dr. A. Adebayo (Head of Operations)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none text-xs"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#008751] hover:bg-[#007043] text-white font-bold cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit to NYSC LGI</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REJECTION REASON MODAL */}
      {rejectingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-rose-700">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  Issue Official Placement Rejection
                </h3>
              </div>
              <button
                onClick={() => setRejectingRequest(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-900">
                Candidate: {rejectingRequest.corperName}
              </p>
              <p className="font-mono text-slate-600">
                State Code: {rejectingRequest.corperStateCode} • Discipline: {rejectingRequest.courseOfStudy}
              </p>
              <p className="text-slate-500 pt-1 text-[11px]">
                Under NYSC Regulations, companies must record an objective statutory reason when declining a corps member application so the state committee can reassign the candidate.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <label className="block font-bold text-slate-700">
                Select Statutory Rejection Ground *
              </label>

              {[
                'Quota capacity already filled (No vacant slots)',
                'Course of study does not align with current departmental vacancy',
                'Inability to provide required corpers accommodation at this branch',
                'Security or logistical constraints in operating district',
                'Other / Custom Justification'
              ].map(reason => (
                <label
                  key={reason}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    rejectionReason === reason
                      ? 'bg-rose-50 border-rose-300 text-rose-900 font-semibold'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="rejection-reason"
                    checked={rejectionReason === reason}
                    onChange={() => setRejectionReason(reason)}
                    className="text-rose-600 focus:ring-rose-500"
                  />
                  <span>{reason}</span>
                </label>
              ))}

              {rejectionReason === 'Other / Custom Justification' && (
                <div className="pt-2">
                  <label className="block font-bold text-slate-700 mb-1">Specify Grounds</label>
                  <textarea
                    rows={3}
                    required
                    value={customRejectionReason}
                    onChange={e => setCustomRejectionReason(e.target.value)}
                    placeholder="Provide specific notes regarding why the candidate cannot be absorbed..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none text-xs"
                  />
                </div>
              )}
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRejectingRequest(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRejection}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <X className="w-4 h-4" />
                <span>Confirm & Issue Rejection</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OFFICIAL ACCEPTANCE LETTER MODAL */}
      {viewingAcceptedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-6 h-6 text-[#008751]" />
                <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  Official NYSC Employer Acceptance Slip
                </h3>
              </div>
              <button
                onClick={() => setViewingAcceptedRequest(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document body formatted like authentic NYSC Form */}
            <div className="border-2 border-[#008751]/40 rounded-xl p-6 bg-slate-50/50 space-y-4 text-slate-800">
              <div className="text-center border-b border-slate-200 pb-4">
                <div className="text-xs font-black tracking-widest text-[#008751] uppercase">
                  National Youth Service Corps (NYSC)
                </div>
                <div className="text-xs font-bold text-slate-600 uppercase mt-0.5">
                  Primary Place of Assignment (PPA) Letter of Acceptance
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-1">
                  Document Ref: NYSC/{activeOrg?.state?.substring(0, 3).toUpperCase()}/ACC-{viewingAcceptedRequest.id}
                </div>
              </div>

              <div className="text-xs leading-relaxed space-y-3">
                <p>
                  To: <strong>The State Coordinator</strong>,<br />
                  NYSC Secretariat, {activeOrg?.state} State Command.
                </p>

                <p>
                  Dear Sir / Madam,
                </p>

                <p>
                  This is to certify that <strong>{viewingAcceptedRequest.corperName}</strong> with NYSC State Code <strong>{viewingAcceptedRequest.corperStateCode}</strong> and discipline in <strong>{viewingAcceptedRequest.courseOfStudy}</strong> has been officially <strong>ACCEPTED</strong> for Primary Assignment at <strong>{activeOrg?.name}</strong>.
                </p>

                <div className="bg-white p-3 rounded-lg border border-slate-200 grid grid-cols-2 gap-2 text-[11px]">
                  <div>Employer: <strong>{activeOrg?.name}</strong></div>
                  <div>Location: <strong>{activeOrg?.lga}, {activeOrg?.state}</strong></div>
                  <div>Monthly Stipend: <strong>{formatNaira(activeOrg?.stipendMonthly || 0)}</strong></div>
                  <div>Accommodation: <strong>{activeOrg?.accommodation}</strong></div>
                  <div>Date of Acceptance: <strong>{new Date().toLocaleDateString()}</strong></div>
                  <div>Status: <strong className="text-emerald-700">Duly Placed & Accredited</strong></div>
                </div>

                <p className="text-[11px] text-slate-500 italic">
                  The Corps Member has reported for duty and has been assigned to our technical department in accordance with the NYSC Bye-Laws.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-between items-end text-xs">
                <div>
                  <div className="font-bold text-slate-800">{activeOrg?.name}</div>
                  <div className="text-[11px] text-slate-500">Authorized Human Resources / Officer</div>
                </div>
                <div className="text-right">
                  <div className="inline-block px-3 py-1 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold border border-emerald-300">
                    OFFICIALLY STAMPED & SIGNED
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setViewingAcceptedRequest(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2 rounded-xl bg-[#008751] hover:bg-[#007043] text-white font-bold text-xs cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <FileCheck className="w-4 h-4" />
                <span>Print Official Acceptance Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
