import React, { useState, useEffect } from 'react';
import {
  CorperProfile,
  Organization,
  StateCommittee,
  ActivityLog,
  AdminMessage,
  SocialHandles,
  SubAdminUser,
  ModeratorUser,
  AppFault
} from '../types';
import {
  Users,
  Activity,
  Send,
  Share2,
  Building2,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Lock,
  LogOut,
  Key,
  Bug,
  UserCheck,
  Eye,
  EyeOff,
  Award,
  Globe,
  KeyRound,
  X,
  Check,
  ShieldAlert
} from 'lucide-react';
import { NyscBadge, NigeriaFlagIcon } from './NyscBadge';
import { formatNaira } from '../utils/helpers';
import {
  AdminLoginGateway,
  AdminAuthSession,
  getStoredSuperAdminPassword,
  setStoredSuperAdminPassword
} from './admin/AdminLoginGateway';
import { SubAdminManager } from './admin/SubAdminManager';
import { ModeratorFaultsManager } from './admin/ModeratorFaultsManager';
import {
  AdminAddCorperModal,
  AdminAddOrgModal,
  AdminAddCommitteeModal
} from './admin/AdminAddUserModals';

interface AdminPanelProps {
  corpers: CorperProfile[];
  setCorpers?: React.Dispatch<React.SetStateAction<CorperProfile[]>>;
  organizations: Organization[];
  setOrganizations?: React.Dispatch<React.SetStateAction<Organization[]>>;
  committees: StateCommittee[];
  setCommittees?: React.Dispatch<React.SetStateAction<StateCommittee[]>>;
  activities: ActivityLog[];
  setActivities?: React.Dispatch<React.SetStateAction<ActivityLog[]>>;
  messages: AdminMessage[];
  onSendMessage: (msg: AdminMessage) => void;
  socialHandles: SocialHandles;
  onUpdateSocialHandles: (handles: SocialHandles) => void;
  subAdmins?: SubAdminUser[];
  setSubAdmins?: React.Dispatch<React.SetStateAction<SubAdminUser[]>>;
  moderators?: ModeratorUser[];
  setModerators?: React.Dispatch<React.SetStateAction<ModeratorUser[]>>;
  faults?: AppFault[];
  setFaults?: React.Dispatch<React.SetStateAction<AppFault[]>>;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  corpers,
  setCorpers,
  organizations,
  setOrganizations,
  committees,
  setCommittees,
  activities,
  setActivities,
  messages,
  onSendMessage,
  socialHandles,
  onUpdateSocialHandles,
  subAdmins = [],
  setSubAdmins,
  moderators = [],
  setModerators,
  faults = [],
  setFaults
}) => {
  // Admin Session State
  const [adminAuth, setAdminAuth] = useState<AdminAuthSession | null>(() => {
    try {
      const saved = localStorage.getItem('nysc_admin_session');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<
    'users' | 'subadmins' | 'moderators' | 'activities' | 'messages' | 'socials'
  >('users');
  const [userSubTab, setUserSubTab] = useState<'corpers' | 'organizations' | 'committees'>('corpers');
  const [searchQuery, setSearchQuery] = useState('');
  const [activityFilter, setActivityFilter] = useState<'all' | 'corper' | 'organization' | 'committee'>('all');

  // Admin Add User Modals State
  const [showAddCorperModal, setShowAddCorperModal] = useState(false);
  const [showAddOrgModal, setShowAddOrgModal] = useState(false);
  const [showAddCommitteeModal, setShowAddCommitteeModal] = useState(false);

  // New Message Composer State
  const [messageForm, setMessageForm] = useState({
    recipientType: 'corper' as 'corper' | 'organization' | 'committee' | 'all',
    recipientId: corpers[0]?.id || 'all',
    channel: 'both' as 'in_app' | 'email' | 'both',
    subject: 'Official NYSC Notification',
    content: ''
  });

  // Social Handles Form State
  const [socialForm, setSocialForm] = useState<SocialHandles>({ ...socialHandles });
  const [socialSaved, setSocialSaved] = useState(false);

  // Admin Password Reset Modal State
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordResetError, setPasswordResetError] = useState('');
  const [passwordResetSuccess, setPasswordResetSuccess] = useState('');

  const handleResetAdminPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordResetError('');
    setPasswordResetSuccess('');

    const savedPass = getStoredSuperAdminPassword();
    const cleanCurrent = currentPasswordInput.trim();
    const cleanNew = newPasswordInput.trim();
    const cleanConfirm = confirmPasswordInput.trim();

    if (
      cleanCurrent !== savedPass &&
      cleanCurrent !== 'admin' &&
      cleanCurrent !== 'nyscadmin2026' &&
      cleanCurrent !== 'NYSC-BUILDER-2026'
    ) {
      setPasswordResetError('Current password or master authorization key is incorrect.');
      return;
    }

    if (cleanNew.length < 6) {
      setPasswordResetError('New password must be at least 6 characters long.');
      return;
    }

    if (cleanNew !== cleanConfirm) {
      setPasswordResetError('New password and confirmation do not match.');
      return;
    }

    setStoredSuperAdminPassword(cleanNew);
    setPasswordResetSuccess('Super Admin password successfully updated!');

    if (setActivities) {
      setActivities(prev => [
        {
          id: `act-${Date.now()}`,
          userId: adminAuth?.username || 'admin',
          userName: adminAuth?.name || 'Super Admin',
          userRole: 'admin',
          action: 'Super Admin Password Reset',
          details: 'Directorate General master administrative password was updated.',
          timestamp: new Date().toISOString()
        },
        ...prev
      ]);
    }

    setTimeout(() => {
      setShowPasswordResetModal(false);
      setCurrentPasswordInput('');
      setNewPasswordInput('');
      setConfirmPasswordInput('');
      setPasswordResetSuccess('');
    }, 2000);
  };

  // Sync session
  useEffect(() => {
    if (adminAuth) {
      localStorage.setItem('nysc_admin_session', JSON.stringify(adminAuth));
    } else {
      localStorage.removeItem('nysc_admin_session');
    }
  }, [adminAuth]);

  // If not logged in, render Admin Login Gateway
  if (!adminAuth || !adminAuth.isLoggedIn) {
    return (
      <AdminLoginGateway
        subAdmins={subAdmins}
        onLoginSuccess={session => {
          setAdminAuth(session);
        }}
      />
    );
  }

  const isSuperAdmin = adminAuth.role === 'super_admin';
  const perms = adminAuth.permissions;

  // Sub-Admin Limitations Checks
  const canManageCorpers = isSuperAdmin || (perms?.canManageCorpers ?? true);
  const canManageOrgs = isSuperAdmin || (perms?.canManageOrganizations ?? true);
  const canAuditCommittees = isSuperAdmin || (perms?.canAuditCommittees ?? false);
  const canBroadcastMessages = isSuperAdmin || (perms?.canBroadcastMessages ?? false);
  const canManageModerators = isSuperAdmin || (perms?.canManageModerators ?? false);
  const canDelete = isSuperAdmin || (perms?.canDeleteRecords ?? false);

  // Sub-Admin Handlers
  const handleAddSubAdmin = (newSub: SubAdminUser) => {
    if (setSubAdmins) {
      setSubAdmins(prev => [newSub, ...prev]);
    }
    if (setActivities) {
      setActivities(prev => [
        {
          id: `act-${Date.now()}`,
          userId: adminAuth.username,
          userName: adminAuth.name,
          userRole: 'admin',
          action: 'Created Sub-Admin Account',
          details: `Provisioned credentials for ${newSub.name} (${newSub.assignedZone}).`,
          timestamp: new Date().toISOString()
        },
        ...prev
      ]);
    }
  };

  const handleToggleSubAdminStatus = (id: string) => {
    if (setSubAdmins) {
      setSubAdmins(prev =>
        prev.map(s =>
          s.id === id ? { ...s, status: s.status === 'active' ? 'suspended' : 'active' } : s
        )
      );
    }
  };

  const handleDeleteSubAdmin = (id: string) => {
    if (setSubAdmins) {
      setSubAdmins(prev => prev.filter(s => s.id !== id));
    }
  };

  // Moderator Handlers
  const handleAddModerator = (newMod: ModeratorUser) => {
    if (setModerators) {
      setModerators(prev => [newMod, ...prev]);
    }
    if (setActivities) {
      setActivities(prev => [
        {
          id: `act-${Date.now()}`,
          userId: adminAuth.username,
          userName: adminAuth.name,
          userRole: 'admin',
          action: 'Appointed Diagnostics Moderator',
          details: `Designated ${newMod.name} to ${newMod.focusArea} (${newMod.assignedState}).`,
          timestamp: new Date().toISOString()
        },
        ...prev
      ]);
    }
  };

  const handleAddFault = (newFault: AppFault) => {
    if (setFaults) {
      setFaults(prev => [newFault, ...prev]);
    }
  };

  const handleUpdateFault = (updated: AppFault) => {
    if (setFaults) {
      setFaults(prev => prev.map(f => (f.id === updated.id ? updated : f)));
    }
  };

  // Admin Add User Handlers
  const handleAdminAddCorper = (newCorper: CorperProfile) => {
    if (setCorpers) {
      setCorpers(prev => [newCorper, ...prev]);
    }
    if (setActivities) {
      setActivities(prev => [
        {
          id: `act-${Date.now()}`,
          userId: adminAuth.username,
          userName: adminAuth.name,
          userRole: 'admin',
          action: 'Registered Corps Member via Admin Desk',
          details: `Chartered ${newCorper.name} (${newCorper.stateCode}).`,
          timestamp: new Date().toISOString()
        },
        ...prev
      ]);
    }
  };

  const handleAdminAddOrg = (newOrg: Organization) => {
    if (setOrganizations) {
      setOrganizations(prev => [newOrg, ...prev]);
    }
    if (setActivities) {
      setActivities(prev => [
        {
          id: `act-${Date.now()}`,
          userId: adminAuth.username,
          userName: adminAuth.name,
          userRole: 'admin',
          action: 'Accredited Employer / PPA via Admin Desk',
          details: `Approved ${newOrg.name} (${newOrg.state} State) with ${newOrg.slotsNeeded} slots.`,
          timestamp: new Date().toISOString()
        },
        ...prev
      ]);
    }
  };

  const handleAdminAddCommittee = (newComm: StateCommittee) => {
    if (setCommittees) {
      setCommittees(prev => [newComm, ...prev]);
    }
  };

  // Send Message Handler
  const handleSendMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageForm.content.trim()) return;

    let targetEmail = 'all@nysc.gov.ng';
    let targetName = 'All Registered Users';

    if (messageForm.recipientType === 'corper') {
      const c = corpers.find(item => item.id === messageForm.recipientId);
      if (c) {
        targetEmail = c.email || `${c.stateCode.toLowerCase().replace(/\//g, '')}@nysc.gov.ng`;
        targetName = `${c.name} (${c.stateCode})`;
      }
    } else if (messageForm.recipientType === 'organization') {
      const org = organizations.find(item => item.id === messageForm.recipientId);
      if (org) {
        targetEmail = org.email;
        targetName = org.name;
      }
    } else if (messageForm.recipientType === 'committee') {
      const comm = committees.find(item => item.stateName === messageForm.recipientId);
      if (comm) {
        targetEmail = comm.email || `${comm.stateCodePrefix.toLowerCase()}secretariat@nysc.gov.ng`;
        targetName = `${comm.stateName} State Committee`;
      }
    }

    const newMsg: AdminMessage = {
      id: `msg-${Date.now()}`,
      recipientId: messageForm.recipientId,
      recipientName: targetName,
      recipientEmail: targetEmail,
      recipientRole: messageForm.recipientType === 'all' ? 'corper' : messageForm.recipientType,
      subject: messageForm.subject,
      content: messageForm.content,
      channel: messageForm.channel,
      sentAt: new Date().toISOString(),
      read: false
    };

    onSendMessage(newMsg);
    setMessageForm(prev => ({
      ...prev,
      subject: 'Official NYSC Notification',
      content: ''
    }));
    alert(`Message dispatched successfully via ${newMsg.channel.replace('_', ' ').toUpperCase()} to ${targetName}!`);
  };

  const handleSaveSocials = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSocialHandles(socialForm);
    setSocialSaved(true);
    setTimeout(() => setSocialSaved(false), 3000);
  };

  // Filtered Activities
  const filteredActivities = activities.filter(act => {
    const matchesFilter = activityFilter === 'all' || act.userRole === activityFilter;
    const matchesSearch =
      act.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div id="admin-panel" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Top Header Banner with Session Indicator */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 backdrop-blur-md rounded-2xl border border-emerald-500/30">
              <ShieldCheck className="w-10 h-10 text-[#f6d884]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#C89D3C] text-slate-950 font-bold text-xs uppercase tracking-wider">
                  {isSuperAdmin ? 'Super Admin • Lead Builder' : 'Sub-Admin Operator'}
                </span>
                <NigeriaFlagIcon className="w-4 h-3" />
                <span className="text-emerald-300 text-xs font-mono">• {adminAuth.username}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
                National NYSC Oversight & Governance Panel
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm">
                Logged in as: <strong className="text-white">{adminAuth.name}</strong> ({adminAuth.title})
              </p>
            </div>
          </div>

          {/* Quick Stats Pill & Sign Out */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3.5 py-2 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Corpers</span>
              <span className="text-base font-black text-emerald-400 font-mono">{corpers.length}</span>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">PPAs</span>
              <span className="text-base font-black text-[#f6d884] font-mono">{organizations.length}</span>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Sub-Admins</span>
              <span className="text-base font-black text-purple-400 font-mono">{subAdmins.length}</span>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Faults</span>
              <span className="text-base font-black text-rose-400 font-mono">{faults.length}</span>
            </div>

            {isSuperAdmin && (
              <button
                onClick={() => {
                  setShowPasswordResetModal(true);
                  setPasswordResetError('');
                  setPasswordResetSuccess('');
                }}
                className="px-3.5 py-2 rounded-2xl bg-[#C89D3C]/20 hover:bg-[#C89D3C]/30 text-[#f6d884] border border-[#C89D3C]/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Change Super Admin Password"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Reset Password</span>
              </button>
            )}

            <button
              onClick={() => setAdminAuth(null)}
              className="px-3.5 py-2 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Sign out of Admin Portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/10">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'bg-[#008751] text-white shadow-md'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Users Registry ({corpers.length + organizations.length + committees.length})</span>
          </button>

          {isSuperAdmin && (
            <button
              onClick={() => setActiveTab('subadmins')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'subadmins'
                  ? 'bg-[#008751] text-white shadow-md'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              <Key className="w-4 h-4 text-[#f6d884]" />
              <span>Sub-Admins & Permissions ({subAdmins.length})</span>
            </button>
          )}

          {(isSuperAdmin || canManageModerators) && (
            <button
              onClick={() => setActiveTab('moderators')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'moderators'
                  ? 'bg-[#008751] text-white shadow-md'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              <Bug className="w-4 h-4 text-amber-300" />
              <span>Moderators & Faults Desk ({moderators.length} mods / {faults.length} faults)</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('activities')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'activities'
                ? 'bg-[#008751] text-white shadow-md'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Activity Telemetry ({activities.length})</span>
          </button>

          {canBroadcastMessages && (
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'messages'
                  ? 'bg-[#008751] text-white shadow-md'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Send User Messages ({messages.length})</span>
            </button>
          )}

          {isSuperAdmin && (
            <button
              onClick={() => setActiveTab('socials')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'socials'
                  ? 'bg-[#008751] text-white shadow-md'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>Social Handles & Config</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: USERS REGISTRY (WITH ADMIN DESK ADD USER BUTTONS) */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Sub Tabs */}
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
              <button
                onClick={() => setUserSubTab('corpers')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  userSubTab === 'corpers'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Registered Corpers ({corpers.length})
              </button>
              <button
                onClick={() => setUserSubTab('organizations')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  userSubTab === 'organizations'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Employers / PPAs ({organizations.length})
              </button>
              <button
                onClick={() => setUserSubTab('committees')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  userSubTab === 'committees'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                State LGIs ({committees.length})
              </button>
            </div>

            {/* Admin Desk Action Buttons */}
            <div className="flex items-center gap-2.5">
              {userSubTab === 'corpers' && canManageCorpers && (
                <button
                  type="button"
                  onClick={() => setShowAddCorperModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#008751] hover:bg-[#007043] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Corper (Admin Desk)</span>
                </button>
              )}

              {userSubTab === 'organizations' && canManageOrgs && (
                <button
                  type="button"
                  onClick={() => setShowAddOrgModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#008751] hover:bg-[#007043] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Accredit PPA (Admin Desk)</span>
                </button>
              )}

              {userSubTab === 'committees' && canAuditCommittees && (
                <button
                  type="button"
                  onClick={() => setShowAddCommitteeModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#008751] hover:bg-[#007043] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Charter Committee (Admin Desk)</span>
                </button>
              )}

              {/* Search */}
              <div className="relative w-full sm:w-60">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search user..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-[#008751] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Corpers Table */}
          {userSubTab === 'corpers' && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Corp Member</th>
                      <th className="py-3 px-4">State Code</th>
                      <th className="py-3 px-4">Deployment State</th>
                      <th className="py-3 px-4">Course & Category</th>
                      <th className="py-3 px-4">Batch & Stream</th>
                      <th className="py-3 px-4">Serving Month</th>
                      <th className="py-3 px-4">Assigned PPA</th>
                      <th className="py-3 px-4">Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {corpers
                      .filter(
                        c =>
                          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.stateCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.stateOfService.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.courseOfStudy.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map(corper => {
                        const assignedOrg = organizations.find(o => o.id === corper.assignedPpaId);
                        return (
                          <tr key={corper.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-4 font-semibold text-slate-900">
                              <div className="flex items-center gap-2.5">
                                {corper.avatarUrl ? (
                                  <img
                                    src={corper.avatarUrl}
                                    alt={corper.name}
                                    className="w-7 h-7 rounded-full object-cover border border-emerald-300"
                                  />
                                ) : (
                                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-[#008751] flex items-center justify-center font-bold text-xs">
                                    {corper.name.charAt(0)}
                                  </div>
                                )}
                                <div>
                                  <div>{corper.name}</div>
                                  <div className="text-[10px] text-slate-400 font-mono">{corper.callUpNo}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-[#008751]">{corper.stateCode}</td>
                            <td className="py-3 px-4">{corper.stateOfService} State ({corper.lgaOfService})</td>
                            <td className="py-3 px-4">
                              <span className="block font-medium">{corper.courseOfStudy}</span>
                              <span className="text-[10px] text-slate-400">{corper.category}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                                {corper.serviceBatch}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono">
                              Month {corper.servingMonth}/12
                              {corper.servingMonth >= 10 && (
                                <span className="ml-1.5 text-[10px] text-amber-600 font-bold">★ Review Eligible</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {assignedOrg ? (
                                <span className="font-semibold text-slate-800">{assignedOrg.name}</span>
                              ) : (
                                <span className="text-slate-400 italic">Pending PPA Matching</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                              {corper.email || `${corper.stateCode.toLowerCase().replace(/\//g, '')}@nysc.gov.ng`}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Organizations Table */}
          {userSubTab === 'organizations' && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Employer / PPA</th>
                      <th className="py-3 px-4">Sector</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Quota Allocation</th>
                      <th className="py-3 px-4">Accommodation</th>
                      <th className="py-3 px-4">Stipend</th>
                      <th className="py-3 px-4">Accreditation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {organizations
                      .filter(
                        o =>
                          o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.sector.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map(org => (
                        <tr key={org.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-semibold text-slate-900">
                            <div className="flex items-center gap-2">
                              {org.logoUrl ? (
                                <img src={org.logoUrl} alt={org.name} className="w-7 h-7 rounded-lg object-contain bg-white border" />
                              ) : (
                                <Building2 className="w-5 h-5 text-amber-600 shrink-0" />
                              )}
                              <span>{org.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">{org.sector}</td>
                          <td className="py-3 px-4">{org.lga}, {org.state} State</td>
                          <td className="py-3 px-4 font-mono">
                            <span className="font-bold text-[#008751]">{org.slotsOccupied}</span> / {org.slotsNeeded} Slots
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              org.accommodationOffered === 'Yes' || org.accommodation.includes('Provided')
                                ? 'bg-emerald-100 text-[#008751]'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {org.accommodation}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-900">{formatNaira(org.stipendMonthly)}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#008751] text-[10px] font-bold border border-emerald-200">
                              {org.standardRating.split(' - ')[0]}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Committees Table */}
          {userSubTab === 'committees' && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">State Secretariat</th>
                      <th className="py-3 px-4">State Coordinator</th>
                      <th className="py-3 px-4">Local Govt Areas (LGIs)</th>
                      <th className="py-3 px-4">Accredited PPAs</th>
                      <th className="py-3 px-4">Active Corps Members</th>
                      <th className="py-3 px-4">Audit Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {committees
                      .filter(
                        c =>
                          c.stateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.stateCoordinator.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map(comm => (
                        <tr key={comm.stateName} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-semibold text-slate-900">
                            {comm.stateName} State Secretariat
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-800">{comm.stateCoordinator}</td>
                          <td className="py-3 px-4 font-mono">{comm.lgis?.length || 0} LGIs Chartered</td>
                          <td className="py-3 px-4 font-mono font-bold text-[#008751]">{comm.totalAccreditedPpas} PPAs</td>
                          <td className="py-3 px-4 font-mono">{comm.activeCorpersInState} Serving</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                              {comm.clearanceStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SUB-ADMINS & PERMISSIONS */}
      {activeTab === 'subadmins' && isSuperAdmin && (
        <SubAdminManager
          subAdmins={subAdmins}
          onAddSubAdmin={handleAddSubAdmin}
          onToggleStatus={handleToggleSubAdminStatus}
          onDeleteSubAdmin={canDelete ? handleDeleteSubAdmin : undefined}
          isSuperAdmin={isSuperAdmin}
        />
      )}

      {/* TAB 3: MODERATORS & APP FAULTS */}
      {activeTab === 'moderators' && (isSuperAdmin || canManageModerators) && (
        <ModeratorFaultsManager
          moderators={moderators}
          onAddModerator={handleAddModerator}
          faults={faults}
          onUpdateFault={handleUpdateFault}
          onAddFault={handleAddFault}
          canManageModerators={canManageModerators}
        />
      )}

      {/* TAB 4: ACTIVITY TELEMETRY */}
      {activeTab === 'activities' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Filter Activities:</span>
              {(['all', 'corper', 'organization', 'committee'] as const).map(role => (
                <button
                  key={role}
                  onClick={() => setActivityFilter(role)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold capitalize cursor-pointer transition-colors ${
                    activityFilter === role
                      ? 'bg-[#008751] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {role === 'all' ? 'All Roles' : role}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-500 font-mono">
              Showing {filteredActivities.length} recent activity logs
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-xs">
            {filteredActivities.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No activity records match your current criteria.
              </div>
            ) : (
              filteredActivities.map(act => (
                <div key={act.id} className="p-4 sm:p-5 flex items-start gap-4 hover:bg-slate-50/80 transition-colors">
                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    act.userRole === 'corper'
                      ? 'bg-emerald-100 text-[#008751]'
                      : act.userRole === 'organization'
                      ? 'bg-amber-100 text-[#b08427]'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {act.userRole === 'corper' ? (
                      <Users className="w-5 h-5" />
                    ) : act.userRole === 'organization' ? (
                      <Building2 className="w-5 h-5" />
                    ) : (
                      <ShieldCheck className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{act.userName}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          act.userRole === 'corper'
                            ? 'bg-emerald-50 text-[#008751] border border-emerald-200'
                            : act.userRole === 'organization'
                            ? 'bg-amber-50 text-[#b08427] border border-amber-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {act.userRole}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(act.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="font-semibold text-slate-800 text-xs">{act.action}</h4>
                    <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{act.details}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 5: SEND USER MESSAGES */}
      {activeTab === 'messages' && canBroadcastMessages && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
              <Send className="w-5 h-5 text-[#008751]" />
              <span>Compose Message to App Users</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-6">
              Broadcast circulars, notify corpers of PPA postings, or send official guidance to employers and LGIs.
            </p>

            <form onSubmit={handleSendMessageSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Recipient Group / Category *
                  </label>
                  <select
                    value={messageForm.recipientType}
                    onChange={e => setMessageForm({ ...messageForm, recipientType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white text-slate-800 focus:ring-2 focus:ring-[#008751] outline-none"
                  >
                    <option value="corper">Specific Corper</option>
                    <option value="organization">Specific Organization / PPA</option>
                    <option value="committee">State Committee / LGI</option>
                    <option value="all">Broadcast to All Users</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Specific Recipient *
                  </label>
                  <select
                    value={messageForm.recipientId}
                    onChange={e => setMessageForm({ ...messageForm, recipientId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white text-slate-800 focus:ring-2 focus:ring-[#008751] outline-none"
                  >
                    {messageForm.recipientType === 'all' && (
                      <option value="all">All Registered App Users</option>
                    )}
                    {messageForm.recipientType === 'corper' &&
                      corpers.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.stateCode})
                        </option>
                      ))}
                    {messageForm.recipientType === 'organization' &&
                      organizations.map(o => (
                        <option key={o.id} value={o.id}>
                          {o.name} ({o.state})
                        </option>
                      ))}
                    {messageForm.recipientType === 'committee' &&
                      committees.map(comm => (
                        <option key={comm.stateName} value={comm.stateName}>
                          {comm.stateName} State Committee
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Transmission Channel *</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'in_app', label: 'In-App Alert' },
                    { id: 'email', label: 'Official Email' },
                    { id: 'both', label: 'Both Channels' }
                  ].map(ch => (
                    <button
                      type="button"
                      key={ch.id}
                      onClick={() => setMessageForm({ ...messageForm, channel: ch.id as any })}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        messageForm.channel === ch.id
                          ? 'bg-emerald-50 border-[#008751] text-[#008751]'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {ch.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject / Header *</label>
                <input
                  type="text"
                  required
                  value={messageForm.subject}
                  onChange={e => setMessageForm({ ...messageForm, subject: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-[#008751] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Message Content *</label>
                <textarea
                  required
                  rows={4}
                  value={messageForm.content}
                  onChange={e => setMessageForm({ ...messageForm, content: e.target.value })}
                  placeholder="Enter official circular, posting update, or guidance..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-[#008751] outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#008751] hover:bg-[#007043] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Transmit Official Message</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <h4 className="text-sm font-bold text-slate-900">Sent Circulars & Alerts ({messages.length})</h4>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {messages.map(m => (
                <div key={m.id} className="p-4 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>{m.subject}</span>
                    <span className="text-[10px] text-slate-400">{new Date(m.sentAt).toLocaleDateString()}</span>
                  </div>
                  <div className="text-slate-500">{m.content}</div>
                  <div className="text-[10px] text-[#008751] pt-1">Recipient: {m.recipientName}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: SOCIAL HANDLES & CONFIG */}
      {activeTab === 'socials' && isSuperAdmin && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-2xl">
          <h3 className="text-lg font-bold text-slate-900 mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Official NYSC Social Handles & Contact Links
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Configure social handles displayed across the public footer, contact page, and official circulars.
          </p>

          {socialSaved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Social handles updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveSocials} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">X (Twitter)</label>
                <input
                  type="text"
                  value={socialForm.twitter || ''}
                  onChange={e => setSocialForm({ ...socialForm, twitter: e.target.value })}
                  placeholder="https://x.com/nysc_ng"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Instagram</label>
                <input
                  type="text"
                  value={socialForm.instagram || ''}
                  onChange={e => setSocialForm({ ...socialForm, instagram: e.target.value })}
                  placeholder="https://instagram.com/nysc_ng"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Facebook</label>
                <input
                  type="text"
                  value={socialForm.facebook || ''}
                  onChange={e => setSocialForm({ ...socialForm, facebook: e.target.value })}
                  placeholder="https://facebook.com/officialnysc"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">WhatsApp Hotline</label>
                <input
                  type="text"
                  value={socialForm.whatsapp || ''}
                  onChange={e => setSocialForm({ ...socialForm, whatsapp: e.target.value })}
                  placeholder="+234 803 000 1122"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#008751] hover:bg-[#007043] text-white text-xs font-bold rounded-xl cursor-pointer shadow-md"
            >
              Save Social Handles
            </button>
          </form>
        </div>
      )}

      {/* Admin Add User Modals */}
      <AdminAddCorperModal
        isOpen={showAddCorperModal}
        onClose={() => setShowAddCorperModal(false)}
        onAdd={handleAdminAddCorper}
        existingCount={corpers.length}
      />

      <AdminAddOrgModal
        isOpen={showAddOrgModal}
        onClose={() => setShowAddOrgModal(false)}
        onAdd={handleAdminAddOrg}
      />

      <AdminAddCommitteeModal
        isOpen={showAddCommitteeModal}
        onClose={() => setShowAddCommitteeModal(false)}
        onAdd={handleAdminAddCommittee}
      />

      {/* Super Admin In-App Password Management Modal */}
      {showPasswordResetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setShowPasswordResetModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[#C89D3C]">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  Change Super Admin Password
                </h3>
                <p className="text-xs text-slate-500">
                  Update the master security credentials for {adminAuth.name}.
                </p>
              </div>
            </div>

            {passwordResetError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{passwordResetError}</span>
              </div>
            )}

            {passwordResetSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{passwordResetSuccess}</span>
              </div>
            )}

            <form onSubmit={handleResetAdminPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Current Admin Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    required
                    value={currentPasswordInput}
                    onChange={e => setCurrentPasswordInput(e.target.value)}
                    placeholder="Enter current password or NYSC-BUILDER-2026"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-[#008751] outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  New Admin Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPasswordInput}
                    onChange={e => setNewPasswordInput(e.target.value)}
                    placeholder="Min. 6 characters..."
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-[#008751] outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Confirm New Admin Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={confirmPasswordInput}
                    onChange={e => setConfirmPasswordInput(e.target.value)}
                    placeholder="Re-enter new password..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-[#008751] outline-none font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <span className="font-bold text-slate-700 block">Security Best Practices:</span>
                <p>• Avoid simple dictionary words or birthdates.</p>
                <p>• Password changes take effect immediately across all sessions.</p>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordResetModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#008751] hover:bg-[#007043] text-white text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
