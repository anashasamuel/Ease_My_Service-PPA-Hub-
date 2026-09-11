import React, { useState } from 'react';
import {
  CorperProfile,
  Organization,
  StateCommittee,
  AcademicCategory,
  ServiceBatch,
  OrganizationSector,
  AccommodationType
} from '../../types';
import {
  NIGERIAN_STATES,
  NYSC_BATCH_OPTIONS,
  POPULAR_COURSES,
  COURSE_CATEGORIES,
  PRIMARY_SECTOR_OPTIONS
} from '../../data/nigeriaStates';
import {
  X,
  UserPlus,
  Building2,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  MapPin,
  Home,
  Banknote,
  Users
} from 'lucide-react';

/* -------------------------------------------------------------
 * 1. ADMIN ADD CORPS MEMBER MODAL
 * ----------------------------------------------------------- */
interface AdminAddCorperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (corper: CorperProfile) => void;
  existingCount: number;
}

export const AdminAddCorperModal: React.FC<AdminAddCorperModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  existingCount
}) => {
  const [name, setName] = useState('');
  const [stateOfService, setStateOfService] = useState('Lagos');
  const [lgaOfService, setLgaOfService] = useState('Ikeja');
  const [course, setCourse] = useState(POPULAR_COURSES[0]);
  const [category, setCategory] = useState<AcademicCategory>('Science & Tech');
  const [batch, setBatch] = useState<ServiceBatch>('2024 Batch B Stream 2');
  const [servingMonth, setServingMonth] = useState<number>(1);
  const [stateCode, setStateCode] = useState(`LA/24B/${1100 + existingCount}`);
  const [callUpNo, setCallUpNo] = useState(`NYSC/UNILAG/2024/${20000 + existingCount}`);
  const [phone, setPhone] = useState('+234 ');
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const activeStateObj = NIGERIAN_STATES.find(s => s.name === stateOfService) || NIGERIAN_STATES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCorper: CorperProfile = {
      id: `corp-${Date.now()}`,
      name: name.trim(),
      stateCode: stateCode.trim() || `LA/24B/${1100 + existingCount}`,
      callUpNo: callUpNo.trim() || `NYSC/FED/${Date.now().toString().slice(-5)}`,
      stateOfService,
      lgaOfService,
      courseOfStudy: course,
      category,
      softSkills: ['Communications & Teamwork', 'Problem Solving'],
      assignmentStatus: 'unassigned',
      servingMonth,
      serviceBatch: batch,
      phone: phone.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@nysc.gov.ng`
    };

    onAdd(newCorper);
    onClose();
    alert(`Corps Member ${newCorper.name} (${newCorper.stateCode}) registered successfully via Admin Desk!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer p-1">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-emerald-100 text-[#008751] rounded-2xl">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Register Corps Member (Admin Desk)
            </h3>
            <p className="text-xs text-slate-500">Add a new verified corps member directly to the national database.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Corps Member Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => {
                setName(e.target.value);
                if (!email) setEmail(`${e.target.value.toLowerCase().replace(/\s+/g, '')}@nysc.gov.ng`);
              }}
              placeholder="e.g. Victor Kelechi Okafor"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">State Code *</label>
              <input
                type="text"
                required
                value={stateCode}
                onChange={e => setStateCode(e.target.value)}
                placeholder="e.g. LA/24B/1042"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Call-up Number *</label>
              <input
                type="text"
                required
                value={callUpNo}
                onChange={e => setCallUpNo(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">State of Service</label>
              <select
                value={stateOfService}
                onChange={e => {
                  setStateOfService(e.target.value);
                  const st = NIGERIAN_STATES.find(s => s.name === e.target.value);
                  if (st && st.lgas.length > 0) setLgaOfService(st.lgas[0]);
                }}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              >
                {NIGERIAN_STATES.map(s => (
                  <option key={s.code} value={s.name}>{s.name} State</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">LGA of Service</label>
              <select
                value={lgaOfService}
                onChange={e => setLgaOfService(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              >
                {activeStateObj.lgas.map(lga => (
                  <option key={lga} value={lga}>{lga}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Course of Study</label>
              <select
                value={course}
                onChange={e => {
                  setCourse(e.target.value);
                  const cat = COURSE_CATEGORIES[e.target.value]?.category;
                  if (cat) setCategory(cat as AcademicCategory);
                }}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              >
                {POPULAR_COURSES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">NYSC Batch & Stream</label>
              <select
                value={batch}
                onChange={e => setBatch(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              >
                {NYSC_BATCH_OPTIONS.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Service Month (1 to 12)</label>
              <select
                value={servingMonth}
                onChange={e => setServingMonth(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                  <option key={m} value={m}>Month {m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#008751] hover:bg-[#007043] text-white font-bold cursor-pointer shadow-md">
              Register Corper
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------
 * 2. ADMIN ADD EMPLOYER / PPA MODAL
 * ----------------------------------------------------------- */
interface AdminAddOrgModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (org: Organization) => void;
}

export const AdminAddOrgModal: React.FC<AdminAddOrgModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const [name, setName] = useState('');
  const [state, setState] = useState('Lagos');
  const [lga, setLga] = useState('Ikeja');
  const [address, setAddress] = useState('');
  const [sector, setSector] = useState<OrganizationSector>('Information Technology & Software');
  const [slotsNeeded, setSlotsNeeded] = useState(4);
  const [accommodation, setAccommodation] = useState<AccommodationType>('Provided (Free Corpers Lodge)');
  const [accommodationOffered, setAccommodationOffered] = useState<'Yes' | 'No'>('Yes');
  const [stipendMonthly, setStipendMonthly] = useState(45000);
  const [phone, setPhone] = useState('+234 ');
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const activeStateObj = NIGERIAN_STATES.find(s => s.name === state) || NIGERIAN_STATES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newOrg: Organization = {
      id: `org-${Date.now()}`,
      name: name.trim(),
      state,
      lga,
      address: address.trim() || `${lga}, ${state} State`,
      phone: phone.trim(),
      email: email.trim() || `hr@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.ng`,
      sector,
      departments: ['General Operations', 'Technical & Client Support'],
      slotsNeeded: Number(slotsNeeded) || 2,
      slotsOccupied: 0,
      accommodation,
      accommodationOffered,
      stipendMonthly: Number(stipendMonthly) || 30000,
      preferredDisciplines: ['Computer Science', 'Engineering', 'Accounting'],
      preferredSkills: ['Microsoft Office', 'Communications'],
      standardRating: 'Grade A - Accredited Model PPA',
      nyscConditionsCompliant: true,
      safetyRating: 5,
      description: `${name} is an approved primary place of assignment verified by NYSC Directorate Headquarters.`,
      verifiedByNysc: true
    };

    onAdd(newOrg);
    onClose();
    alert(`Employer / PPA "${newOrg.name}" registered successfully with ${newOrg.slotsNeeded} corper quota slots!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer p-1">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-amber-100 text-[#b08427] rounded-2xl">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Accredit Employer / PPA (Admin Desk)
            </h3>
            <p className="text-xs text-slate-500">Provision official quota allocation and statutory verification.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Organization / School / Firm Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Apex Global Technologies Ltd"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Primary Sector</label>
              <select
                value={sector}
                onChange={e => setSector(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              >
                {PRIMARY_SECTOR_OPTIONS.map(sec => (
                  <option key={sec} value={sec}>{sec}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Corper Slots Needed *</label>
              <input
                type="number"
                min="1"
                max="50"
                value={slotsNeeded}
                onChange={e => setSlotsNeeded(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">State Location</label>
              <select
                value={state}
                onChange={e => {
                  setState(e.target.value);
                  const st = NIGERIAN_STATES.find(s => s.name === e.target.value);
                  if (st && st.lgas.length > 0) setLga(st.lgas[0]);
                }}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              >
                {NIGERIAN_STATES.map(s => (
                  <option key={s.code} value={s.name}>{s.name} State</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">LGA</label>
              <select
                value={lga}
                onChange={e => setLga(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              >
                {activeStateObj.lgas.map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Accommodation Offered? (Yes/No)</label>
              <select
                value={accommodationOffered}
                onChange={e => {
                  const val = e.target.value as 'Yes' | 'No';
                  setAccommodationOffered(val);
                  setAccommodation(val === 'Yes' ? 'Provided (Free Corpers Lodge)' : 'None (Transport Allowance)');
                }}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="Yes">Yes (Accommodation Provided)</option>
                <option value="No">No (Allowance Only)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Monthly Stipend (₦)</label>
              <input
                type="number"
                step="5000"
                value={stipendMonthly}
                onChange={e => setStipendMonthly(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#008751] hover:bg-[#007043] text-white font-bold cursor-pointer shadow-md">
              Accredit Employer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------
 * 3. ADMIN ADD STATE COMMITTEE / LGI MODAL
 * ----------------------------------------------------------- */
interface AdminAddCommitteeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (comm: StateCommittee) => void;
}

export const AdminAddCommitteeModal: React.FC<AdminAddCommitteeModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const [stateName, setStateName] = useState('Enugu');
  const [coordinator, setCoordinator] = useState('Mrs. Gladys Chika');
  const [address, setAddress] = useState('NYSC State Secretariat, Independence Layout');
  const [email, setEmail] = useState('enugusecretariat@nysc.gov.ng');
  const [phone, setPhone] = useState('+234 803 111 2233');

  if (!isOpen) return null;

  const stObj = NIGERIAN_STATES.find(s => s.name === stateName) || NIGERIAN_STATES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newComm: StateCommittee = {
      stateName,
      stateCodePrefix: stObj.code,
      stateCoordinator: coordinator.trim(),
      secretariatAddress: address.trim(),
      email: email.trim(),
      phone: phone.trim(),
      orientationCampLocation: stObj.campLocation,
      lastAuditDate: new Date().toISOString().split('T')[0],
      totalAccreditedPpas: 12,
      activeCorpersInState: 450,
      clearanceStatus: 'Verified',
      lgis: stObj.lgas.slice(0, 5).map((lga, idx) => ({
        lgaName: lga,
        inspectorName: `Officer ${lga.split(' ')[0]} ${idx + 1}`,
        phone: `+234 802 ${Math.floor(100 + Math.random() * 900)} ${Math.floor(1000 + Math.random() * 9000)}`,
        officeAddress: `LGI Secretariat, ${lga} Local Govt Council Headquarters`,
        registeredCorpersCount: Math.floor(40 + Math.random() * 80),
        registeredPpasCount: Math.floor(10 + Math.random() * 25)
      }))
    };

    onAdd(newComm);
    onClose();
    alert(`State Committee for ${newComm.stateName} registered successfully!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer p-1">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-blue-100 text-blue-700 rounded-2xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Register State Committee & LGIs
            </h3>
            <p className="text-xs text-slate-500">Charter an official State Coordinator desk and local inspectorate.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">State Jurisdiction</label>
            <select
              value={stateName}
              onChange={e => {
                setStateName(e.target.value);
                const s = NIGERIAN_STATES.find(item => item.name === e.target.value);
                if (s) {
                  setEmail(`${s.name.toLowerCase().replace(/[^a-z]/g, '')}secretariat@nysc.gov.ng`);
                }
              }}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
            >
              {NIGERIAN_STATES.map(s => (
                <option key={s.code} value={s.name}>{s.name} State</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">State Coordinator Name *</label>
            <input
              type="text"
              required
              value={coordinator}
              onChange={e => setCoordinator(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Secretariat Office Address</label>
            <input
              type="text"
              required
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Hotline / Contact</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#008751] hover:bg-[#007043] text-white font-bold cursor-pointer shadow-md">
              Charter Committee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
