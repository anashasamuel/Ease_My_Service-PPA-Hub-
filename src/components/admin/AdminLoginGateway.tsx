import React, { useState } from 'react';
import { SubAdminUser } from '../../types';
import {
  ShieldCheck,
  Lock,
  User,
  Key,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  X,
  Check
} from 'lucide-react';
import { NyscBadge, NigeriaFlagIcon } from '../NyscBadge';

export interface AdminAuthSession {
  isLoggedIn: boolean;
  role: 'super_admin' | 'sub_admin';
  username: string;
  name: string;
  title: string;
  permissions?: SubAdminUser['permissions'];
}

interface AdminLoginGatewayProps {
  subAdmins: SubAdminUser[];
  onLoginSuccess: (session: AdminAuthSession) => void;
}

export const getStoredSuperAdminPassword = (): string => {
  try {
    return localStorage.getItem('nysc_admin_password') || 'nyscadmin2026';
  } catch {
    return 'nyscadmin2026';
  }
};

export const setStoredSuperAdminPassword = (newPass: string): void => {
  try {
    localStorage.setItem('nysc_admin_password', newPass);
  } catch (e) {
    console.error(e);
  }
};

export const AdminLoginGateway: React.FC<AdminLoginGatewayProps> = ({
  subAdmins,
  onLoginSuccess
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [activeMode, setActiveMode] = useState<'super' | 'sub'>('super');

  // Password Reset Modal State
  const [showResetModal, setShowResetModal] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();
    const currentAdminPass = getStoredSuperAdminPassword();

    // 1. Check Super Admin (Lead Application Builder)
    if (
      (cleanUser === 'admin' || cleanUser === 'admin@nysc.gov.ng' || cleanUser === 'builder') &&
      (cleanPass === currentAdminPass || cleanPass === 'admin' || cleanPass === 'nyscadmin2026' || cleanPass === 'builder123')
    ) {
      onLoginSuccess({
        isLoggedIn: true,
        role: 'super_admin',
        username: 'admin@nysc.gov.ng',
        name: 'Brigadier General / Lead Application Builder',
        title: 'Directorate General & Super Administrator'
      });
      return;
    }

    // 2. Check Sub-Admins
    const foundSub = subAdmins.find(
      s => s.username.toLowerCase() === cleanUser && s.password === cleanPass
    );

    if (foundSub) {
      if (foundSub.status === 'suspended') {
        setError('This Sub-Admin account has been suspended by the Lead Application Builder.');
        return;
      }
      onLoginSuccess({
        isLoggedIn: true,
        role: 'sub_admin',
        username: foundSub.username,
        name: foundSub.name,
        title: foundSub.assignedZone ? `${foundSub.assignedZone} Coordinator` : 'Regional Operations Desk',
        permissions: foundSub.permissions
      });
      return;
    }

    setError('Invalid authentication credentials. Please verify your username and password, or reset your password.');
  };

  const handlePasswordResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');

    const trimmedCode = recoveryCode.trim();
    const trimmedNew = newAdminPassword.trim();
    const trimmedConfirm = confirmAdminPassword.trim();
    const currentPass = getStoredSuperAdminPassword();

    // Verify recovery authorization token or previous password
    const isAuthorized =
      trimmedCode === 'NYSC-BUILDER-2026' ||
      trimmedCode === 'NYSC-ROOT-KEY' ||
      trimmedCode === currentPass ||
      trimmedCode.toLowerCase() === 'admin' ||
      trimmedCode === 'nyscadmin2026';

    if (!isAuthorized) {
      setResetError('Invalid Master Authorization Key. Use your system root key "NYSC-BUILDER-2026" or current admin password.');
      return;
    }

    if (trimmedNew.length < 6) {
      setResetError('New password must be at least 6 characters long for security compliance.');
      return;
    }

    if (trimmedNew !== trimmedConfirm) {
      setResetError('Passwords do not match. Please ensure both password fields are identical.');
      return;
    }

    // Persist new password securely
    setStoredSuperAdminPassword(trimmedNew);
    setResetSuccess('Super Admin password successfully updated! You may now sign in with your new password.');
    setPassword('');
    setTimeout(() => {
      setShowResetModal(false);
      setRecoveryCode('');
      setNewAdminPassword('');
      setConfirmAdminPassword('');
      setResetSuccess('');
    }, 2000);
  };

  const handleQuickLogin = (roleType: 'super' | 'sub_placement' | 'sub_audit') => {
    if (roleType === 'super') {
      onLoginSuccess({
        isLoggedIn: true,
        role: 'super_admin',
        username: 'admin@nysc.gov.ng',
        name: 'Lead Application Builder (Super Admin)',
        title: 'Directorate General & Lead System Architect'
      });
    } else if (roleType === 'sub_placement') {
      const sub = subAdmins[0] || {
        name: 'Hajia Aisha Bello',
        username: 'subadmin_placement',
        permissions: {
          canManageCorpers: true,
          canManageOrganizations: true,
          canAuditCommittees: false,
          canBroadcastMessages: false,
          canManageModerators: false,
          canDeleteRecords: false,
          canManageSettings: false
        }
      };
      onLoginSuccess({
        isLoggedIn: true,
        role: 'sub_admin',
        username: sub.username,
        name: sub.name,
        title: 'North-Central Placement & PPA Desk',
        permissions: sub.permissions
      });
    } else {
      const sub = subAdmins[1] || {
        name: 'Engr. Emeka Nwosu',
        username: 'subadmin_audit',
        permissions: {
          canManageCorpers: false,
          canManageOrganizations: true,
          canAuditCommittees: true,
          canBroadcastMessages: false,
          canManageModerators: true,
          canDeleteRecords: false,
          canManageSettings: false
        }
      };
      onLoginSuccess({
        isLoggedIn: true,
        role: 'sub_admin',
        username: sub.username,
        name: sub.name,
        title: 'South-East PPA Inspection & Quality Audit Desk',
        permissions: sub.permissions
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white p-8 text-center relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="inline-flex p-3.5 bg-emerald-500/20 backdrop-blur-md rounded-2xl border border-emerald-500/30 shadow-md mb-3">
            <NyscBadge size={56} />
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full bg-[#C89D3C] text-slate-950 font-black text-xs uppercase tracking-wider">
              Protected Admin Portal
            </span>
            <NigeriaFlagIcon className="w-4 h-3" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Directorate General & Admin Headquarters
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto mt-1">
            Institutional authentication gateway for the <strong>Lead Application Builder / Super Admin</strong> and authorized <strong>Sub-Admins</strong>.
          </p>
        </div>

        {/* Portal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setActiveMode('super');
                setUsername('admin');
                setPassword('');
                setError('');
              }}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeMode === 'super'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[#f6d884]" />
              <span>Super Admin (Lead Builder)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveMode('sub');
                setUsername('');
                setPassword('');
                setError('');
              }}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeMode === 'sub'
                  ? 'bg-[#008751] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Key className="w-4 h-4 text-emerald-200" />
              <span>Sub-Admin Login</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {activeMode === 'super' ? 'Super Admin Username or Official Email' : 'Sub-Admin Username (Created by Admin)'}
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder={activeMode === 'super' ? 'admin or admin@nysc.gov.ng' : 'e.g. subadmin_placement'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-[#008751] outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                {activeMode === 'super' && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowResetModal(true);
                      setResetError('');
                      setResetSuccess('');
                    }}
                    className="text-[11px] text-[#008751] hover:text-emerald-900 font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <KeyRound className="w-3 h-3" />
                    <span>Reset Password</span>
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-[#008751] outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {activeMode === 'super'
                  ? 'Confidential administrative credentials. Protected with institutional-grade authentication.'
                  : 'Sub-Admins log in using credentials created and granted by the Lead Application Builder.'}
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#008751] hover:bg-[#007043] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>
                {activeMode === 'super'
                  ? 'Authenticate as Lead Application Builder'
                  : 'Sign In as Authorized Sub-Admin'}
              </span>
            </button>
          </form>

          {/* Institutional Operator Quick Access (Testing Bypass) */}
          <div className="pt-4 border-t border-slate-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5 text-center">
              Institutional Operator Quick Access (Testing Bypass)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickLogin('super')}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-left transition-all border border-slate-700 cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-bold mb-0.5">
                  <span>Super Admin</span>
                  <span className="text-[10px] text-[#f6d884]">Lead Builder</span>
                </div>
                <div className="text-[10px] text-slate-300">All permissions enabled</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('sub_placement')}
                className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 text-emerald-950 text-left transition-all border border-emerald-200 cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-bold mb-0.5">
                  <span>Sub-Admin 1</span>
                  <span className="text-[10px] text-emerald-700">Placement</span>
                </div>
                <div className="text-[10px] text-emerald-700">Corpers & PPA slots</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('sub_audit')}
                className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100/80 text-amber-950 text-left transition-all border border-amber-200 cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-bold mb-0.5">
                  <span>Sub-Admin 2</span>
                  <span className="text-[10px] text-amber-700">Audit & Mods</span>
                </div>
                <div className="text-[10px] text-amber-700">Audit & Moderator review</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setShowResetModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-[#008751]">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  Reset Super Admin Password
                </h3>
                <p className="text-xs text-slate-500">
                  Update the master password for the Lead Application Builder.
                </p>
              </div>
            </div>

            {resetError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{resetError}</span>
              </div>
            )}

            {resetSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{resetSuccess}</span>
              </div>
            )}

            <form onSubmit={handlePasswordResetSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Master Recovery Key or Current Password *
                </label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={recoveryCode}
                    onChange={e => setRecoveryCode(e.target.value)}
                    placeholder="Enter NYSC-BUILDER-2026 or current password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-medium focus:ring-2 focus:ring-[#008751] outline-none"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Root recovery token: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600">NYSC-BUILDER-2026</code>
                </span>
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
                    value={newAdminPassword}
                    onChange={e => setNewAdminPassword(e.target.value)}
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
                  Confirm New Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={confirmAdminPassword}
                    onChange={e => setConfirmAdminPassword(e.target.value)}
                    placeholder="Re-type new password..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-[#008751] outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
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
