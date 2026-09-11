import React, { useState } from 'react';
import { SubAdminUser } from '../../types';
import { ShieldCheck, Lock, User, Key, Sparkles, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
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

export const AdminLoginGateway: React.FC<AdminLoginGatewayProps> = ({
  subAdmins,
  onLoginSuccess
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeMode, setActiveMode] = useState<'super' | 'sub'>('super');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1. Check Super Admin (Lead Application Builder)
    if (
      (cleanUser === 'admin' || cleanUser === 'admin@nysc.gov.ng' || cleanUser === 'builder') &&
      (cleanPass === 'admin' || cleanPass === 'nyscadmin2026' || cleanPass === 'builder123')
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

    setError('Invalid credentials. Please verify your username and password, or use 1-click demo login below.');
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
            Unique password login for the <strong>Lead Application Builder / Super Admin</strong> and authorized <strong>Sub-Admins</strong>.
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
                setPassword('admin');
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
                setUsername('subadmin_placement');
                setPassword('subadmin123');
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
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter authorized password..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-[#008751] outline-none"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {activeMode === 'super'
                  ? 'Default super credentials: username "admin", password "admin" (or "nyscadmin2026")'
                  : 'Sub-Admins log in using the custom credentials generated by the Super Admin.'}
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

          {/* Instant 1-Click Demo Logins */}
          <div className="pt-4 border-t border-slate-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5 text-center">
              1-Click Instant Demo Access
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
    </div>
  );
};
