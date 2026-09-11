import React, { useState } from 'react';
import { ModeratorUser, AppFault } from '../../types';
import { NIGERIAN_STATES } from '../../data/nigeriaStates';
import {
  Wrench,
  Bug,
  AlertTriangle,
  CheckCircle2,
  Clock,
  UserCheck,
  UserPlus,
  Filter,
  Plus,
  X,
  MessageSquare,
  Shield,
  ShieldAlert,
  Search,
  Check
} from 'lucide-react';

interface ModeratorFaultsManagerProps {
  moderators: ModeratorUser[];
  onAddModerator: (mod: ModeratorUser) => void;
  faults: AppFault[];
  onUpdateFault: (fault: AppFault) => void;
  onAddFault: (fault: AppFault) => void;
  canManageModerators: boolean;
}

export const ModeratorFaultsManager: React.FC<ModeratorFaultsManagerProps> = ({
  moderators,
  onAddModerator,
  faults,
  onUpdateFault,
  onAddFault,
  canManageModerators
}) => {
  const [activeSection, setActiveSection] = useState<'faults' | 'moderators'>('faults');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'under_review' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showAddModModal, setShowAddModModal] = useState(false);
  const [showReportFaultModal, setShowReportFaultModal] = useState(false);
  const [selectedFaultForResolution, setSelectedFaultForResolution] = useState<AppFault | null>(null);

  // New Moderator Form State
  const [modName, setModName] = useState('');
  const [modEmail, setModEmail] = useState('');
  const [modPhone, setModPhone] = useState('+234 ');
  const [modFocus, setModFocus] = useState<ModeratorUser['focusArea']>('Fault & Bug Review');
  const [modState, setModState] = useState('All States (National)');

  // New Fault Form State
  const [faultTitle, setFaultTitle] = useState('');
  const [faultCategory, setFaultCategory] = useState<AppFault['category']>('Bug / System Glitch');
  const [faultSeverity, setFaultSeverity] = useState<AppFault['severity']>('medium');
  const [faultDesc, setFaultDesc] = useState('');
  const [faultState, setFaultState] = useState('Lagos');

  // Resolve Fault Form State
  const [resolveNotes, setResolveNotes] = useState('');
  const [resolveStatus, setResolveStatus] = useState<AppFault['status']>('resolved');
  const [assignedModId, setAssignedModId] = useState(moderators[0]?.id || '');

  // Handle Add Moderator
  const handleCreateModeratorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modName.trim()) return;

    const newMod: ModeratorUser = {
      id: `mod-${Date.now()}`,
      name: modName.trim(),
      email: modEmail.trim() || `${modName.toLowerCase().replace(/\s+/g, '')}@nysc.gov.ng`,
      phone: modPhone.trim(),
      focusArea: modFocus,
      assignedState: modState,
      activeFaultsAssigned: 0,
      totalResolvedFaults: 0,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    onAddModerator(newMod);
    setShowAddModModal(false);
    setModName('');
    setModEmail('');
    setModPhone('+234 ');
    alert(`Moderator ${newMod.name} added successfully to the application diagnostics team!`);
  };

  // Handle Report Fault
  const handleReportFaultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faultTitle.trim() || !faultDesc.trim()) return;

    const newFault: AppFault = {
      id: `fault-${Date.now()}`,
      title: faultTitle.trim(),
      category: faultCategory,
      severity: faultSeverity,
      description: faultDesc.trim(),
      reportedBy: 'Admin Diagnostic Console',
      reporterRole: 'admin',
      state: faultState,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    onAddFault(newFault);
    setShowReportFaultModal(false);
    setFaultTitle('');
    setFaultDesc('');
    alert('App fault registered. Our assigned moderators will inspect and triage this ticket.');
  };

  // Handle Resolve Fault
  const handleResolveFaultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFaultForResolution) return;

    const selectedMod = moderators.find(m => m.id === assignedModId);

    const updated: AppFault = {
      ...selectedFaultForResolution,
      status: resolveStatus,
      moderatorNotes: resolveNotes.trim(),
      assignedModeratorId: selectedMod?.id,
      assignedModeratorName: selectedMod?.name,
      resolvedAt: resolveStatus === 'resolved' ? new Date().toISOString() : undefined
    };

    onUpdateFault(updated);
    setSelectedFaultForResolution(null);
    setResolveNotes('');
  };

  const filteredFaults = faults.filter(f => {
    const matchesStatus = statusFilter === 'all' || f.status === statusFilter;
    const matchesSearch =
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Bar with Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-[#b08427] font-bold text-xs">
              Quality Assurance & Diagnostics
            </span>
            <span className="text-xs text-slate-500">• {faults.filter(f => f.status !== 'resolved').length} Open Faults</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Moderators & App Faults Helpdesk
          </h3>
          <p className="text-xs text-slate-500">
            Designate authorized moderators to investigate bugs, resolve corper complaints, and audit PPA violations.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setShowReportFaultModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Bug className="w-4 h-4 text-rose-600" />
            <span>Report Fault</span>
          </button>

          {canManageModerators && (
            <button
              type="button"
              onClick={() => setShowAddModModal(true)}
              className="px-4 py-2 rounded-xl bg-[#008751] hover:bg-[#007043] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Moderator</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-Section Switcher */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
        <button
          onClick={() => setActiveSection('faults')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSection === 'faults'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Bug className="w-4 h-4 text-amber-600" />
          <span>App Faults & Diagnostics ({faults.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('moderators')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSection === 'moderators'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserCheck className="w-4 h-4 text-[#008751]" />
          <span>Moderator Team Directory ({moderators.length})</span>
        </button>
      </div>

      {/* SECTION 1: APP FAULTS */}
      {activeSection === 'faults' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
              {(['all', 'pending', 'under_review', 'resolved'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-[#008751] text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search faults or bugs..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white outline-none focus:ring-2 focus:ring-[#008751]"
              />
            </div>
          </div>

          {/* Faults Cards List */}
          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-xs">
            {filteredFaults.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No app faults found for the selected status.
              </div>
            ) : (
              filteredFaults.map(fault => (
                <div key={fault.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        fault.severity === 'critical'
                          ? 'bg-rose-100 text-rose-700 border border-rose-300'
                          : fault.severity === 'high'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-blue-100 text-blue-700 border border-blue-200'
                      }`}>
                        {fault.severity} Severity
                      </span>

                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold">
                        {fault.category}
                      </span>

                      {fault.state && (
                        <span className="text-[11px] text-slate-500 font-medium">
                          • {fault.state} State
                        </span>
                      )}

                      <span className="text-[10px] text-slate-400 font-mono">
                        ID: {fault.id}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">{fault.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">{fault.description}</p>

                    <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
                      <span>Reported by: <strong className="text-slate-700">{fault.reportedBy}</strong> ({fault.reporterRole})</span>
                      <span>•</span>
                      <span>{new Date(fault.createdAt).toLocaleDateString()}</span>
                      {fault.assignedModeratorName && (
                        <>
                          <span>•</span>
                          <span className="text-[#008751] font-medium">Assigned: {fault.assignedModeratorName}</span>
                        </>
                      )}
                    </div>

                    {fault.moderatorNotes && (
                      <div className="mt-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950">
                        <span className="font-bold text-[#008751] block mb-0.5">Moderator Resolution Notes:</span>
                        <p>{fault.moderatorNotes}</p>
                      </div>
                    )}
                  </div>

                  {/* Status & Resolve Button */}
                  <div className="flex sm:flex-col items-end gap-2 shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${
                      fault.status === 'resolved'
                        ? 'bg-emerald-100 text-[#008751]'
                        : fault.status === 'under_review'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-700'
                    }`}>
                      {fault.status.replace('_', ' ')}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFaultForResolution(fault);
                        setResolveStatus(fault.status);
                        setResolveNotes(fault.moderatorNotes || '');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer transition-colors"
                    >
                      Inspect & Triage
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SECTION 2: MODERATORS DIRECTORY */}
      {activeSection === 'moderators' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Moderator Name</th>
                  <th className="py-3 px-4">Focus Domain</th>
                  <th className="py-3 px-4">Assigned State</th>
                  <th className="py-3 px-4">Active Tickets</th>
                  <th className="py-3 px-4">Total Resolved</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {moderators.map(mod => (
                  <tr key={mod.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                          {mod.name.charAt(0)}
                        </div>
                        <div>
                          <div>{mod.name}</div>
                          <div className="text-[11px] text-slate-400 font-normal">{mod.email} • {mod.phone}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#008751] font-semibold text-[11px] border border-emerald-200">
                        {mod.focusArea}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-700">
                      {mod.assignedState}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-amber-700">
                      {mod.activeFaultsAssigned} open
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                      {mod.totalResolvedFaults} resolved
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#008751] text-[10px] font-bold uppercase">
                        {mod.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD MODERATOR MODAL */}
      {showAddModModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative my-8">
            <button
              onClick={() => setShowAddModModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 bg-amber-100 text-[#b08427] rounded-xl">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Add Quality Moderator</h3>
                <p className="text-xs text-slate-500">Moderators triage faults and mediate disputes.</p>
              </div>
            </div>

            <form onSubmit={handleCreateModeratorSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Moderator Full Name *</label>
                <input
                  type="text"
                  required
                  value={modName}
                  onChange={e => setModName(e.target.value)}
                  placeholder="e.g. Barrister Tunde Alabi"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Email</label>
                <input
                  type="email"
                  value={modEmail}
                  onChange={e => setModEmail(e.target.value)}
                  placeholder="e.g. t.alabi@nysc.gov.ng"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={modPhone}
                  onChange={e => setModPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Primary Focus Area</label>
                <select
                  value={modFocus}
                  onChange={e => setModFocus(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none cursor-pointer"
                >
                  <option value="Fault & Bug Review">Fault & Bug Review</option>
                  <option value="Corper Complaints">Corper Complaints & Welfare</option>
                  <option value="PPA Compliance">PPA Compliance & Accommodation</option>
                  <option value="System Verification">System Verification & Data Integrity</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned State Jurisdiction</label>
                <select
                  value={modState}
                  onChange={e => setModState(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none cursor-pointer"
                >
                  <option value="All States (National)">All States (National Oversight)</option>
                  {NIGERIAN_STATES.map(s => (
                    <option key={s.code} value={s.name}>{s.name} State</option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#008751] hover:bg-[#007043] text-white font-bold cursor-pointer shadow-md"
                >
                  Add Moderator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REPORT FAULT MODAL */}
      {showReportFaultModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative my-8">
            <button
              onClick={() => setShowReportFaultModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 bg-rose-100 text-rose-700 rounded-xl">
                <Bug className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Report App Fault or Issue</h3>
                <p className="text-xs text-slate-500">Log an issue for moderator triage and investigation.</p>
              </div>
            </div>

            <form onSubmit={handleReportFaultSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Issue Title *</label>
                <input
                  type="text"
                  required
                  value={faultTitle}
                  onChange={e => setFaultTitle(e.target.value)}
                  placeholder="e.g. Photo upload failing on slow network"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={faultCategory}
                    onChange={e => setFaultCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#008751] outline-none"
                  >
                    <option value="Bug / System Glitch">Bug / Glitch</option>
                    <option value="PPA Violation / Hardship">PPA Violation</option>
                    <option value="Corper Conduct">Corper Conduct</option>
                    <option value="Clearance Dispute">Clearance Dispute</option>
                    <option value="Portal Error">Portal Error</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Severity</label>
                  <select
                    value={faultSeverity}
                    onChange={e => setFaultSeverity(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#008751] outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description & Reproduction Steps *</label>
                <textarea
                  required
                  rows={3}
                  value={faultDesc}
                  onChange={e => setFaultDesc(e.target.value)}
                  placeholder="Describe what occurred, expected outcome, and affected user or state..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#008751] outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowReportFaultModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer shadow-md"
                >
                  Submit Fault Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INSPECT & RESOLVE FAULT MODAL */}
      {selectedFaultForResolution && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
            <button
              onClick={() => setSelectedFaultForResolution(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-mono text-slate-400 block mb-1">Ticket: {selectedFaultForResolution.id}</span>
              <h3 className="text-lg font-bold text-slate-900">{selectedFaultForResolution.title}</h3>
              <p className="text-xs text-slate-500 mt-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                {selectedFaultForResolution.description}
              </p>
            </div>

            <form onSubmit={handleResolveFaultSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={resolveStatus}
                    onChange={e => setResolveStatus(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="under_review">Under Review / Investigating</option>
                    <option value="resolved">Resolved</option>
                    <option value="dismissed">Dismissed</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assign Moderator</label>
                  <select
                    value={assignedModId}
                    onChange={e => setAssignedModId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none"
                  >
                    {moderators.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.focusArea})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Moderator Resolution Notes</label>
                <textarea
                  rows={3}
                  value={resolveNotes}
                  onChange={e => setResolveNotes(e.target.value)}
                  placeholder="Explain steps taken, patches applied, or advice rendered to the user..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedFaultForResolution(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#008751] hover:bg-[#007043] text-white font-bold cursor-pointer shadow-md"
                >
                  Save Triage Decision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
