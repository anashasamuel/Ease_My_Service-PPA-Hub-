import React, { useState } from 'react';
import { SubAdminUser, SubAdminPermissions } from '../../types';
import {
  ShieldCheck,
  UserPlus,
  Key,
  Lock,
  Copy,
  Check,
  Eye,
  EyeOff,
  Trash2,
  AlertCircle,
  CheckCircle2,
  X,
  User,
  Mail,
  MapPin,
  Sliders,
  Shield
} from 'lucide-react';

interface SubAdminManagerProps {
  subAdmins: SubAdminUser[];
  onAddSubAdmin: (subAdmin: SubAdminUser) => void;
  onToggleStatus: (id: string) => void;
  onDeleteSubAdmin?: (id: string) => void;
  isSuperAdmin: boolean;
}

export const SubAdminManager: React.FC<SubAdminManagerProps> = ({
  subAdmins,
  onAddSubAdmin,
  onToggleStatus,
  onDeleteSubAdmin,
  isSuperAdmin
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [revealedPasswords, setRevealedPasswords] = useState<{ [id: string]: boolean }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [lastCreated, setLastCreated] = useState<SubAdminUser | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [roleTitle, setRoleTitle] = useState('Zonal Operations Officer');
  const [assignedZone, setAssignedZone] = useState('South West Zone');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Limitations / Permissions
  const [permissions, setPermissions] = useState<SubAdminPermissions>({
    canManageCorpers: true,
    canManageOrganizations: true,
    canAuditCommittees: false,
    canBroadcastMessages: false,
    canManageModerators: false,
    canDeleteRecords: false,
    canManageSettings: false
  });

  const togglePasswordReveal = (id: string) => {
    setRevealedPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyCredentials = (sub: SubAdminUser) => {
    const credText = `NYSC SUB-ADMIN CREDENTIALS\nName: ${sub.name}\nUsername: ${sub.username}\nPassword: ${sub.password}\nPortal: Ease My NYSC Admin Center`;
    navigator.clipboard.writeText(credText);
    setCopiedId(sub.id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim() || !password.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    // Check for username collision
    if (subAdmins.some(s => s.username.toLowerCase() === username.trim().toLowerCase())) {
      alert('This username is already in use by another sub-admin. Please select a unique username.');
      return;
    }

    const newSub: SubAdminUser = {
      id: `sub-${Date.now()}`,
      name: name.trim(),
      email: email.trim() || `${username.trim().toLowerCase()}@nysc.gov.ng`,
      username: username.trim().toLowerCase(),
      password: password.trim(),
      role: 'sub_admin',
      assignedZone: assignedZone.trim(),
      permissions: { ...permissions },
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    onAddSubAdmin(newSub);
    setLastCreated(newSub);
    setShowCreateModal(false);

    // Reset Form
    setName('');
    setEmail('');
    setUsername('');
    setPassword('');
  };

  const generateQuickCredentials = () => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const generatedUser = name ? `sub_${name.toLowerCase().split(' ')[0]}_${randomSuffix}` : `sub_nysc_${randomSuffix}`;
    const generatedPass = `nysc@sub${randomSuffix}!`;
    setUsername(generatedUser);
    setPassword(generatedPass);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#008751] font-bold text-xs">
              Delegated Authority
            </span>
            <span className="text-xs text-slate-500">• {subAdmins.length} Active Sub-Admins</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Sub-Administrators & Access Limitations
          </h3>
          <p className="text-xs text-slate-500">
            Create custom login details for sub-admins and restrict their operational scope across key system aspects.
          </p>
        </div>

        {isSuperAdmin && (
          <button
            type="button"
            onClick={() => {
              generateQuickCredentials();
              setShowCreateModal(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-[#008751] hover:bg-[#007043] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Sub-Admin & Login Details</span>
          </button>
        )}
      </div>

      {/* Success Notification for Last Created Sub-Admin */}
      {lastCreated && (
        <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-emerald-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-[#008751] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">New Sub-Admin Created Successfully!</h4>
              <p className="text-xs text-emerald-800 mt-0.5">
                Login details generated for <strong>{lastCreated.name}</strong> ({lastCreated.assignedZone}). Share these details with the sub-admin:
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2 font-mono text-xs">
                <span className="px-2.5 py-1 rounded bg-white border border-emerald-300">
                  Username: <strong>{lastCreated.username}</strong>
                </span>
                <span className="px-2.5 py-1 rounded bg-white border border-emerald-300">
                  Password: <strong>{lastCreated.password}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleCopyCredentials(lastCreated)}
              className="px-3.5 py-1.5 rounded-xl bg-[#008751] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              {copiedId === lastCreated.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === lastCreated.id ? 'Copied!' : 'Copy Login Details'}</span>
            </button>
            <button
              onClick={() => setLastCreated(null)}
              className="p-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-500 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Sub-Admins Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Sub-Admin Officer</th>
                <th className="py-3 px-4">Role & Zone</th>
                <th className="py-3 px-4">Created {`{Login Details}`}</th>
                <th className="py-3 px-4">Key Aspect Limitations</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subAdmins.map(sub => (
                <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Name & Contact */}
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#008751] flex items-center justify-center font-black">
                        {sub.name.charAt(0)}
                      </div>
                      <div>
                        <div>{sub.name}</div>
                        <div className="text-[11px] text-slate-400 font-normal">{sub.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Role & Zone */}
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-800">{sub.assignedZone || 'National Desk'}</div>
                    <div className="text-[10px] text-slate-400">Created: {new Date(sub.createdAt).toLocaleDateString()}</div>
                  </td>

                  {/* Login Details */}
                  <td className="py-3 px-4">
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 inline-block font-mono text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-sans">User:</span>
                        <strong className="text-[#008751]">{sub.username}</strong>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-slate-400 font-sans">Pass:</span>
                        <span className="font-bold text-slate-700">
                          {revealedPasswords[sub.id] ? sub.password : '••••••••'}
                        </span>
                        <button
                          onClick={() => togglePasswordReveal(sub.id)}
                          className="text-slate-400 hover:text-slate-600 p-0.5"
                          title="Toggle password view"
                        >
                          {revealedPasswords[sub.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Limitations on Key Aspects */}
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        sub.permissions.canManageCorpers ? 'bg-emerald-100 text-[#008751]' : 'bg-slate-100 text-slate-400 line-through'
                      }`}>
                        Corpers
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        sub.permissions.canManageOrganizations ? 'bg-emerald-100 text-[#008751]' : 'bg-slate-100 text-slate-400 line-through'
                      }`}>
                        PPAs
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        sub.permissions.canAuditCommittees ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-400 line-through'
                      }`}>
                        Committees
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        sub.permissions.canBroadcastMessages ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-400 line-through'
                      }`}>
                        Broadcasts
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        sub.permissions.canManageModerators ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-400 line-through'
                      }`}>
                        Moderators
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        sub.permissions.canDeleteRecords ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-400 line-through'
                      }`}>
                        Deletion
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onToggleStatus(sub.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                        sub.status === 'active'
                          ? 'bg-emerald-50 text-[#008751] border border-emerald-200'
                          : 'bg-rose-50 text-rose-600 border border-rose-200'
                      }`}
                      title="Click to toggle active / suspended"
                    >
                      {sub.status}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right space-x-1">
                    <button
                      onClick={() => handleCopyCredentials(sub)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === sub.id ? <Check className="w-3 h-3 text-[#008751]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === sub.id ? 'Copied' : 'Share'}</span>
                    </button>
                    {isSuperAdmin && onDeleteSubAdmin && (
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to remove sub-admin ${sub.name}?`)) {
                            onDeleteSubAdmin(sub.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer"
                        title="Delete Sub-Admin"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE SUB-ADMIN MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-emerald-100 text-[#008751] rounded-2xl">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  Create Sub-Admin & Assign Limitations
                </h3>
                <p className="text-xs text-slate-500">
                  Generate unique credentials and specify permissible aspects of the application.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sub-Admin Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Hajia Fatima Garba"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. f.garba@nysc.gov.ng"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Role Title / Designation</label>
                  <input
                    type="text"
                    value={roleTitle}
                    onChange={e => setRoleTitle(e.target.value)}
                    placeholder="e.g. Zonal PPA Supervisor"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Geopolitical Zone</label>
                  <select
                    value={assignedZone}
                    onChange={e => setAssignedZone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none cursor-pointer"
                  >
                    <option value="North Central Zone">North Central Zone</option>
                    <option value="North East Zone">North East Zone</option>
                    <option value="North West Zone">North West Zone</option>
                    <option value="South East Zone">South East Zone</option>
                    <option value="South South Zone">South South Zone</option>
                    <option value="South West Zone">South West Zone</option>
                    <option value="FCT & Headquarters">FCT & Headquarters</option>
                  </select>
                </div>
              </div>

              {/* Login Details Generation */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-[#008751]" />
                    <span>Create {`{Login Details}`} for Sub-Admin</span>
                  </span>
                  <button
                    type="button"
                    onClick={generateQuickCredentials}
                    className="text-[11px] text-[#008751] hover:underline font-semibold cursor-pointer"
                  >
                    Auto-Generate Credentials
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Sub-Admin Username *</label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      placeholder="e.g. subadmin_fatima"
                      className="w-full p-2 bg-white border border-emerald-300 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Assigned Password *</label>
                    <input
                      type="text"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="e.g. nysc@fatima2026"
                      className="w-full p-2 bg-white border border-emerald-300 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Limitations on Key Aspects */}
              <div>
                <label className="block font-bold text-slate-800 mb-2">
                  Operational Limitations & Permitted Aspects:
                </label>
                <div className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.canManageCorpers}
                      onChange={e => setPermissions({ ...permissions, canManageCorpers: e.target.checked })}
                      className="rounded text-[#008751] focus:ring-[#008751]"
                    />
                    <span className="font-medium text-slate-700">Can Manage & Register Corpers</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.canManageOrganizations}
                      onChange={e => setPermissions({ ...permissions, canManageOrganizations: e.target.checked })}
                      className="rounded text-[#008751] focus:ring-[#008751]"
                    />
                    <span className="font-medium text-slate-700">Can Manage & Inspect Employers / PPAs</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.canAuditCommittees}
                      onChange={e => setPermissions({ ...permissions, canAuditCommittees: e.target.checked })}
                      className="rounded text-[#008751] focus:ring-[#008751]"
                    />
                    <span className="font-medium text-slate-700">Can Audit State Committee & LGI Rosters</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.canBroadcastMessages}
                      onChange={e => setPermissions({ ...permissions, canBroadcastMessages: e.target.checked })}
                      className="rounded text-[#008751] focus:ring-[#008751]"
                    />
                    <span className="font-medium text-slate-700">Can Dispatch Official Broadcast Messages</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.canManageModerators}
                      onChange={e => setPermissions({ ...permissions, canManageModerators: e.target.checked })}
                      className="rounded text-[#008751] focus:ring-[#008751]"
                    />
                    <span className="font-medium text-slate-700">Can Assign & Oversee App Moderators</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.canDeleteRecords}
                      onChange={e => setPermissions({ ...permissions, canDeleteRecords: e.target.checked })}
                      className="rounded text-rose-600 focus:ring-rose-500"
                    />
                    <span className="font-medium text-rose-700">Can Delete Records (High Risk)</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#008751] hover:bg-[#007043] text-white font-bold cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <Key className="w-4 h-4" />
                  <span>Generate Sub-Admin Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
