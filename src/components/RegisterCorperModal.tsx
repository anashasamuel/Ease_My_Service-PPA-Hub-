import React, { useState } from 'react';
import {
  CorperProfile,
  AcademicCategory,
  ServiceBatch
} from '../types';
import {
  NIGERIAN_STATES,
  SOFT_SKILLS_OPTIONS,
  NYSC_BATCH_OPTIONS,
  NYSC_MOBILIZATION_GROUPS,
  ACCREDITED_FACULTIES,
  ALL_ACCREDITED_DISCIPLINES,
  COURSE_CATEGORIES
} from '../data/nigeriaStates';
import {
  X,
  User,
  Upload,
  GraduationCap,
  Sparkles,
  Camera,
  CheckCircle2,
  Calendar,
  Layers,
  MapPin,
  Clock,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { NyscBadge, NigeriaFlagIcon } from './NyscBadge';

interface RegisterCorperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (corper: CorperProfile) => void;
  existingCount: number;
}

export const RegisterCorperModal: React.FC<RegisterCorperModalProps> = ({
  isOpen,
  onClose,
  onRegister,
  existingCount
}) => {
  const defaultState = NIGERIAN_STATES[0];

  const [name, setName] = useState('');
  const [stateOfService, setStateOfService] = useState('Lagos');
  const [lgaOfService, setLgaOfService] = useState('Ikeja');
  const [stateCode, setStateCode] = useState('');
  const [callUpNo, setCallUpNo] = useState('');
  const [serviceBatch, setServiceBatch] = useState<ServiceBatch>('2024 Batch B Stream 2');
  const [servingMonth, setServingMonth] = useState<number>(1);
  const [courseSelectionType, setCourseSelectionType] = useState<'dropdown' | 'manual'>('dropdown');
  const [selectedCourse, setSelectedCourse] = useState(ALL_ACCREDITED_DISCIPLINES[0]);
  const [secondaryDiscipline, setSecondaryDiscipline] = useState('');
  const [manualCourse, setManualCourse] = useState('');
  const [category, setCategory] = useState<AcademicCategory>('Science & Tech');
  const [softSkills, setSoftSkills] = useState<string[]>([
    'Python & Programming',
    'Data Analysis & PowerBI/Excel'
  ]);
  const [phone, setPhone] = useState('+234 ');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');

  if (!isOpen) return null;

  const activeStateObj = NIGERIAN_STATES.find(s => s.name === stateOfService) || defaultState;

  // Handle Image Upload with Base64 FileReader
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('File size exceeds 3MB. Please choose a smaller photo.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarUrl(result);
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleSkill = (skill: string) => {
    if (softSkills.includes(skill)) {
      setSoftSkills(prev => prev.filter(s => s !== skill));
    } else {
      setSoftSkills(prev => [...prev, skill]);
    }
  };

  const handleCourseChange = (course: string) => {
    setSelectedCourse(course);
    const foundCat = COURSE_CATEGORIES[course]?.category as AcademicCategory;
    if (foundCat) {
      setCategory(foundCat);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCourse = courseSelectionType === 'dropdown' ? selectedCourse : (manualCourse.trim() || 'General Studies');
    
    // Auto generate state code if empty
    const finalStateCode = stateCode.trim() || `${activeStateObj.code}/24B/${Math.floor(1000 + Math.random() * 9000)}`;
    const finalCallUp = callUpNo.trim() || `NYSC/UNI/2024/${Math.floor(100000 + Math.random() * 900000)}`;

    const newCorper: CorperProfile = {
      id: `corp-${Date.now()}`,
      name: name.trim() || `Corps Member #${existingCount + 1}`,
      stateCode: finalStateCode,
      callUpNo: finalCallUp,
      stateOfService,
      lgaOfService: lgaOfService || activeStateObj.lgas[0] || 'Municipal',
      courseOfStudy: finalCourse,
      secondaryDiscipline: secondaryDiscipline.trim() || undefined,
      category,
      softSkills,
      assignedPpaId: undefined,
      assignmentStatus: 'unassigned',
      servingMonth,
      serviceBatch,
      avatarUrl: avatarUrl || undefined,
      phone,
      email
    };

    onRegister(newCorper);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#008751] to-emerald-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <NyscBadge size={40} />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
                  NYSC Portal
                </span>
                <NigeriaFlagIcon className="w-4 h-3" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Register New Corps Member
              </h2>
              <p className="text-emerald-100 text-xs">
                Enroll a new graduate profile into the NYSC PPA recommendation engine.
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Profile Photo Upload */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-200 border-2 border-emerald-600/40 flex items-center justify-center shrink-0 shadow-inner group">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User className="w-10 h-10 text-slate-400" />
              )}
              <label
                htmlFor="corper-image-upload"
                className="absolute inset-0 bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold"
              >
                <Camera className="w-5 h-5 mb-0.5" />
                Change
              </label>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1.5">
              <h4 className="font-bold text-slate-900 text-sm flex items-center justify-center sm:justify-start gap-1.5">
                <span>Upload Corper Profile Photo</span>
                <Sparkles className="w-3.5 h-3.5 text-[#C89D3C]" />
              </h4>
              <p className="text-slate-500 text-xs">
                Upload your official white vest orientation camp or formal portrait (JPG, PNG up to 3MB).
              </p>
              <label
                htmlFor="corper-image-upload"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:border-emerald-600 text-slate-700 text-xs font-bold cursor-pointer transition-colors shadow-xs"
              >
                <Upload className="w-3.5 h-3.5 text-[#008751]" />
                <span>Choose Image File</span>
              </label>
              <input
                id="corper-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Full Name & Identification */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name (Surname First) *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Abubakar Fatima Chioma"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#008751] focus:border-[#008751]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                NYSC Call-up Number
              </label>
              <input
                type="text"
                value={callUpNo}
                onChange={e => setCallUpNo(e.target.value)}
                placeholder="e.g. NYSC/UNN/2024/782109"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#008751] focus:border-[#008751]"
              />
            </div>
          </div>

          {/* State of Service (Dropdown) & LGA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                State of Deployment / Service (36 States + FCT) *
              </label>
              <select
                value={stateOfService}
                onChange={e => {
                  const newState = e.target.value;
                  setStateOfService(newState);
                  const st = NIGERIAN_STATES.find(s => s.name === newState);
                  if (st && st.lgas.length > 0) {
                    setLgaOfService(st.lgas[0]);
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-[#008751] focus:border-[#008751]"
              >
                {NIGERIAN_STATES.map(s => (
                  <option key={s.name} value={s.name}>
                    {s.name} ({s.zone})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                LGA of Primary Assignment ({activeStateObj.lgas.length} LGAs in {activeStateObj.name}) *
              </label>
              <select
                value={lgaOfService}
                onChange={e => setLgaOfService(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-[#008751] focus:border-[#008751]"
              >
                {activeStateObj.lgas.map(lga => (
                  <option key={lga} value={lga}>
                    {lga} Local Government Area
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* State Code & Mobilization Batch Stream */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                State Code (e.g. {activeStateObj.code}/24B/1042)
              </label>
              <input
                type="text"
                value={stateCode}
                onChange={e => setStateCode(e.target.value)}
                placeholder={`${activeStateObj.code}/24B/1042`}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#008751] focus:border-[#008751]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                NYSC Mobilization Batch & Stream *
              </label>
              <select
                value={serviceBatch}
                onChange={e => setServiceBatch(e.target.value as ServiceBatch)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-[#008751] focus:border-[#008751]"
              >
                {NYSC_MOBILIZATION_GROUPS.map(group => (
                  <optgroup key={group.year} label={group.year}>
                    {group.batches.map(batch => (
                      <option key={batch} value={batch}>
                        {batch}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>

          {/* Optional Range: Service Month (1 to 12) */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#008751]" />
                <span>Service Month (Optional Range Selector):</span>
              </label>
              <span className="px-2.5 py-1 rounded-full bg-emerald-700 text-white text-xs font-bold">
                Month {servingMonth} of 12
              </span>
            </div>

            <input
              type="range"
              min={1}
              max={12}
              value={servingMonth}
              onChange={e => setServingMonth(Number(e.target.value))}
              className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-[#008751]"
            />

            <div className="flex justify-between text-[11px] text-emerald-800 font-medium">
              <span>Month 1 (Camp / Induction)</span>
              <span>Month 6 (Mid-Service)</span>
              <span>Month 10 (Review)</span>
              <span>Month 12 (POP)</span>
            </div>
          </div>

          {/* Academic Faculty / Discipline Category optional drop_down */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-[#008751]" />
                <span>Academic Faculty / Discipline Category (Ministry of Education Accredited)</span>
              </label>
              <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                Accreditation Directory
              </span>
            </div>

            <select
              value={category}
              onChange={e => {
                const newCat = e.target.value as AcademicCategory;
                setCategory(newCat);
                const facultyObj = ACCREDITED_FACULTIES.find(f => f.category === newCat);
                if (facultyObj && facultyObj.disciplines.length > 0) {
                  setSelectedCourse(facultyObj.disciplines[0]);
                }
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-[#008751] focus:border-[#008751]"
            >
              {ACCREDITED_FACULTIES.map(fac => (
                <option key={fac.category} value={fac.category}>
                  {fac.name} ({fac.disciplines.length} Accredited Disciplines)
                </option>
              ))}
            </select>

            {/* Course of Study: Dropdown OR Manual Typing */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Primary Course of Study / Academic Discipline *
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCourseSelectionType('dropdown')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      courseSelectionType === 'dropdown'
                        ? 'bg-[#008751] text-white'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    Accredited List
                  </button>
                  <button
                    type="button"
                    onClick={() => setCourseSelectionType('manual')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      courseSelectionType === 'manual'
                        ? 'bg-[#008751] text-white'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    Type Custom
                  </button>
                </div>
              </div>

              {courseSelectionType === 'dropdown' ? (
                <select
                  value={selectedCourse}
                  onChange={e => handleCourseChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-[#008751] focus:border-[#008751]"
                >
                  {/* Show disciplines for currently selected faculty first, followed by others */}
                  <optgroup label={`Faculty: ${category}`}>
                    {(ACCREDITED_FACULTIES.find(f => f.category === category)?.disciplines || []).map(course => (
                      <option key={course} value={course}>
                        {course}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Other Ministry Accredited Disciplines">
                    {ALL_ACCREDITED_DISCIPLINES.filter(
                      c => !(ACCREDITED_FACULTIES.find(f => f.category === category)?.disciplines || []).includes(c)
                    ).map(course => (
                      <option key={course} value={course}>
                        {course}
                      </option>
                    ))}
                  </optgroup>
                </select>
              ) : (
                <div>
                  <input
                    type="text"
                    required
                    value={manualCourse}
                    onChange={e => setManualCourse(e.target.value)}
                    placeholder="e.g. Robotics & Artificial Intelligence, Human Anatomy, etc."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#008751] focus:border-[#008751]"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Type your degree title if unlisted in the standard Ministry of Education accredited directory.
                  </p>
                </div>
              )}
            </div>

            {/* Optional Secondary Discipline / Minor */}
            <div className="pt-2 border-t border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Secondary / Minor Academic Discipline (Optional Second Discipline)
              </label>
              <select
                value={secondaryDiscipline}
                onChange={e => setSecondaryDiscipline(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-700 bg-white focus:ring-2 focus:ring-[#008751]"
              >
                <option value="">-- None (Single Discipline) --</option>
                {ALL_ACCREDITED_DISCIPLINES.map(course => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-500 mt-1">
                Select an additional accredited major/minor to broaden your PPA matching opportunities.
              </p>
            </div>
          </div>

          {/* Soft Skills Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Select Soft Skills & Technical Competencies
            </label>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-3 rounded-2xl bg-slate-50 border border-slate-200">
              {SOFT_SKILLS_OPTIONS.map(skill => {
                const isSelected = softSkills.includes(skill);
                return (
                  <button
                    type="button"
                    key={skill}
                    onClick={() => handleToggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#008751] text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span>{skill}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phone Number (WhatsApp)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+234 800 000 0000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#008751] focus:border-[#008751]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="corper.name@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#008751] focus:border-[#008751]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#008751] hover:bg-[#007043] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete Corper Registration</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
