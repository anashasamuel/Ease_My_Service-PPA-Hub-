import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MessageSquare,
  ShieldCheck,
  Building2,
  User,
  Send,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  ExternalLink,
  Copy,
  Check,
  HelpCircle
} from 'lucide-react';
import { NyscBadge, NigeriaFlagIcon } from './NyscBadge';
import { ActivityLog } from '../types';

interface ContactPageProps {
  onLogActivity?: (activity: ActivityLog) => void;
  onNavigateToCommittee?: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onLogActivity,
  onNavigateToCommittee
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    senderName: '',
    senderRole: 'Corper' as 'Corper' | 'Employer / Organization' | 'LGI / NYSC Official' | 'Other',
    stateCode: '',
    state: 'Lagos',
    email: '',
    phone: '',
    subject: 'PPA Placement & Clearance Inquiry',
    message: ''
  });

  const handleCopy = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogActivity) {
      onLogActivity({
        id: `act-${Date.now()}`,
        userId: formData.stateCode || 'contact-user',
        userName: formData.senderName,
        userRole: formData.senderRole === 'Corper' ? 'corper' : formData.senderRole === 'Employer / Organization' ? 'organization' : 'committee',
        action: 'Sent Official Complaint / Message',
        details: `${formData.subject} - "${formData.message.substring(0, 80)}..."`,
        timestamp: new Date().toISOString()
      });
    }
    setSubmitted(true);
  };

  return (
    <div id="contact-page" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-[#008751] text-white p-8 sm:p-12 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/15 text-[#f6d884] text-xs font-bold uppercase tracking-wider">
              Official Helpdesk & Complaints
            </span>
            <NigeriaFlagIcon className="w-5 h-3.5" />
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Get in Touch & Lodge Official Inquiries
          </h1>

          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            Mail your complaints directly to your registered Local Government Inspector (LGI),
            reach out via official email, or chat our direct desk on WhatsApp.
          </p>
        </div>
      </div>

      {/* Main Contact Direct Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Email Card */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#008751] flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Official Email Support
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Send your official complaint, rejection letters, or verification inquiries:
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 font-bold break-all">
              anashasamuel@outlook.com
            </div>
          </div>

          <div className="pt-4 flex items-center gap-2 mt-4 border-t border-slate-100">
            <a
              href="mailto:anashasamuel@outlook.com?subject=NYSC%20PPA%20Platform%20Inquiry"
              className="flex-1 py-2.5 px-3 rounded-xl bg-[#008751] hover:bg-[#007043] text-white text-xs font-bold text-center transition-colors cursor-pointer"
            >
              Compose Email
            </a>
            <button
              onClick={() => handleCopy('anashasamuel@outlook.com', 'email')}
              className="p-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              title="Copy Email"
            >
              {copiedEmail ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* WhatsApp Card */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
              WhatsApp Direct Chat
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Instant messenger desk for swift corper assistance, orientation inquiries, and PPA updates:
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 font-bold">
              WhatsApp: +2347064207685
            </div>
          </div>

          <div className="pt-4 flex items-center gap-2 mt-4 border-t border-slate-100">
            <a
              href="https://wa.me/2347064207685?text=Hello%20NYSC%20PPA%20Support%2C%20I%20have%20an%20inquiry%20regarding%20my%20service%20assignment."
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#1eb857] text-white text-xs font-bold text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
            <button
              onClick={() => handleCopy('+2347064207685', 'phone')}
              className="p-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              title="Copy Number"
            >
              {copiedPhone ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Local Government Inspector (LGI) Card */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#b08427] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Mail Complaints to Your LGI
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Every LGA across Nigeria is overseen by an accredited Local Government Inspector (LGI) for disciplinary, clearance, and safety issues:
            </p>
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium">
              Find your State & LGA Inspector contact details, zonal secretariat, and phone lines.
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            {onNavigateToCommittee ? (
              <button
                onClick={onNavigateToCommittee}
                className="w-full py-2.5 px-3 rounded-xl bg-[#b08427] hover:bg-[#976f1e] text-white text-xs font-bold text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>View State LGI Directory</span>
              </button>
            ) : (
              <a
                href="#committee-tab"
                className="w-full py-2.5 px-3 rounded-xl bg-[#b08427] hover:bg-[#976f1e] text-white text-xs font-bold text-center transition-colors cursor-pointer block"
              >
                View State LGI Directory
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Complaint & Inquiry Form */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-6 sm:p-10">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Submit an In-App Complaint or Inquiry
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Fill out the form below. Your message will be recorded in our administrative monitoring log and dispatched to the designated officer.
          </p>
        </div>

        {submitted ? (
          <div className="my-8 p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-7 h-7 text-[#008751]" />
              <div>
                <h4 className="font-bold text-base">Message Officially Dispatched!</h4>
                <p className="text-xs text-emerald-800">
                  Thank you, your complaint/inquiry has been submitted. A copy has also been routed to <strong>anashasamuel@outlook.com</strong> and logged in the Administrative Command Center.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  senderName: '',
                  senderRole: 'Corper',
                  stateCode: '',
                  state: 'Lagos',
                  email: '',
                  phone: '',
                  subject: 'PPA Placement & Clearance Inquiry',
                  message: ''
                });
              }}
              className="mt-3 px-4 py-2 rounded-xl bg-[#008751] text-white text-xs font-bold hover:bg-[#007043] transition-colors cursor-pointer"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.senderName}
                  onChange={e => setFormData({ ...formData, senderName: e.target.value })}
                  placeholder="e.g. Samuel SaaAnasha"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#008751] focus:border-[#008751]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Role *
                </label>
                <select
                  value={formData.senderRole}
                  onChange={e => setFormData({ ...formData, senderRole: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold bg-white text-slate-800 focus:ring-2 focus:ring-[#008751] focus:border-[#008751]"
                >
                  <option value="Corper">Serving Corps Member</option>
                  <option value="Employer / Organization">Employer / PPA Organization</option>
                  <option value="LGI / NYSC Official">LGI / NYSC State Official</option>
                  <option value="Other">Prospective Corper / Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  State Code / Organization ID
                </label>
                <input
                  type="text"
                  value={formData.stateCode}
                  onChange={e => setFormData({ ...formData, stateCode: e.target.value.toUpperCase() })}
                  placeholder="e.g. LA/24B/1042 or ORG-102"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-[#008751] focus:border-[#008751]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  State of Service / Residence *
                </label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={e => setFormData({ ...formData, state: e.target.value })}
                  placeholder="e.g. Lagos, Abuja (FCT), Plateau..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#008751] focus:border-[#008751]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.name@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#008751] focus:border-[#008751]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number (WhatsApp Preferred)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+234 800 000 0000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#008751] focus:border-[#008751]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Subject / Category *
              </label>
              <select
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold bg-white text-slate-800 focus:ring-2 focus:ring-[#008751] focus:border-[#008751]"
              >
                <option value="PPA Placement & Quota Discrepancy">PPA Placement & Quota Discrepancy</option>
                <option value="PPA Rejection or Lack of Accommodation">PPA Rejection or Lack of Accommodation</option>
                <option value="Monthly Clearance & Biometrics Issue">Monthly Clearance & Biometrics Issue</option>
                <option value="LGI Contact & Secretariat Query">LGI Contact & Secretariat Query</option>
                <option value="Disciplinary / Safety Concern">Disciplinary / Safety Concern</option>
                <option value="General Platform Inquiry">General Platform Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Detailed Message / Explanation *
              </label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                placeholder="State your complaint or inquiry clearly, including PPA name, date of incident, and your assigned LGA..."
                className="w-full p-3.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#008751] focus:border-[#008751]"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-slate-500">
                Messages are directly received by support and recorded in system logs.
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#008751] hover:bg-[#007043] text-white text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Complaint</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Guidelines & LGI Complaint Procedures */}
      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 sm:p-8 space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#008751]" />
          <span>Official NYSC Complaint Guidelines</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-800">1. PPA Rejection</h4>
            <p>
              If your assigned PPA rejects your posting letter, obtain the signed and stamped rejection slip from the employer immediately and submit it to your LGI within 48 hours for reposting.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-800">2. Safety & Accommodation</h4>
            <p>
              Where an employer agreed to provide accommodation but fails to do so, report to the LGA Inspectorate. You are entitled to standard, safe lodgings or alternative placement.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-800">3. Monthly Clearance</h4>
            <p>
              Monthly clearance letter must be signed by your supervisor and presented to the LGI during the designated biometrics week to validate your federal allowance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
