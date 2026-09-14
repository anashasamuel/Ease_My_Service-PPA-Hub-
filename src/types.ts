export type ServiceBatch =
  | '2024 Batch A Stream 1'
  | '2024 Batch A Stream 2'
  | '2024 Batch B Stream 1'
  | '2024 Batch B Stream 2'
  | '2024 Batch C Stream 1'
  | '2024 Batch C Stream 2'
  | '2025 Batch A Stream 1'
  | '2025 Batch A Stream 2'
  | '2025 Batch B Stream 1'
  | '2025 Batch B Stream 2'
  | string;

export type AcademicCategory =
  | 'Engineering'
  | 'Science & Tech'
  | 'Medical & Health'
  | 'Management & Social Sciences'
  | 'Arts & Humanities'
  | 'Education'
  | 'Agriculture'
  | 'Law'
  | 'Environmental Sciences';

export interface CorperProfile {
  id: string;
  name: string;
  stateCode: string; // e.g., LA/24B/1042
  callUpNo: string; // e.g., NYSC/UNILAG/2024/90214
  stateOfService: string;
  lgaOfService: string;
  courseOfStudy: string;
  secondaryDiscipline?: string; // Optional secondary discipline accredited by Ministry of Education
  category: AcademicCategory;
  softSkills: string[];
  assignedPpaId?: string;
  assignmentStatus: 'unassigned' | 'applied' | 'accepted' | 'rejected';
  servingMonth: number; // 1 to 12 optional range
  serviceBatch: ServiceBatch;
  reviewedPpa?: boolean;
  avatarUrl?: string;
  phone?: string;
  email?: string;
}

export type OrganizationSector =
  | 'Education (Secondary/College)'
  | 'Information Technology & Software'
  | 'Banking & Financial Services'
  | 'Healthcare & Hospital'
  | 'Engineering & Construction'
  | 'Government Ministry / Parastatal'
  | 'Agriculture & Agro-allied'
  | 'Media & Communications'
  | 'Legal & Professional Services'
  | 'Manufacturing & FMCG'
  | string;

export type AccommodationType =
  | 'Provided (Free Corpers Lodge)'
  | 'Subsidized Housing'
  | 'None (Transport Allowance)'
  | 'None (Accommodation Allowance)'
  | 'None';

export type StandardGrade =
  | 'Grade A - Accredited Model PPA'
  | 'Grade B - Standard Approved'
  | 'Grade C - Provisional Approval'
  | 'Flagged / Disciplinary Watch';

export interface Organization {
  id: string;
  name: string;
  state: string;
  lga: string;
  address: string;
  phone: string;
  email: string;
  sector: OrganizationSector;
  customSector?: string;
  departments: string[];
  slotsNeeded: number;
  slotsOccupied: number;
  accommodation: AccommodationType;
  accommodationOffered?: 'Yes' | 'No';
  stipendMonthly: number; // in Naira e.g. 40000
  preferredDisciplines: string[];
  preferredSkills: string[];
  standardRating: StandardGrade;
  nyscConditionsCompliant: boolean;
  nyscInspectionNotes?: string;
  safetyRating: number; // 1 to 5
  description: string;
  verifiedByNysc: boolean;
  featured?: boolean;
  logoUrl?: string;
}

export interface PpaReview {
  id: string;
  ppaId: string;
  ppaName: string;
  corperName: string;
  corperStateCode: string;
  serviceBatch: string;
  monthsServed: number; // 10 or 12
  overallRating: number; // 1 to 5
  accommodationRating: number;
  stipendPromptnessRating: number;
  workCultureRating: number;
  mentorshipRating: number;
  comment: string;
  adviceToNextCorpers: string;
  wouldRecommend: boolean;
  createdAt: string;
}

export interface BehavioralRecord {
  id: string;
  corperId: string;
  corperName: string;
  corperStateCode: string;
  ppaId: string;
  ppaName: string;
  month: string;
  punctuality: 'Outstanding' | 'Satisfactory' | 'Needs Improvement' | 'Unsatisfactory';
  discipline: 'Exemplary' | 'Good' | 'Fair' | 'Queried';
  workEthics: 'High Dedication' | 'Average' | 'Poor';
  integrity: 'Trustworthy' | 'Fair' | 'Questionable';
  monthlyClearanceStatus: 'Approved - Eligible for Federal Allowance' | 'Withheld - Pending Explanation' | 'Queried - Disciplinary Action';
  remarks: string;
  supervisorName: string;
  submittedDate: string;
}

export interface LgiOfficer {
  id: string;
  name: string;
  lga: string;
  phone: string;
  email: string;
  zone?: string;
  officeAddress?: string;
  corpersCount?: number;
}

export interface StateCommittee {
  id?: string;
  stateName: string;
  stateCapital?: string;
  stateCodePrefix: string;
  stateCoordinator: string;
  secretariatAddress: string;
  hotline?: string;
  phone?: string;
  email?: string;
  orientationCampLocation: string;
  activeLgis?: number;
  totalCorpersInState?: number;
  totalPpasRegistered?: number;
  totalPpasOccupied?: number;
  complianceAuditScore?: number;
  isRegistered?: boolean;
  registeredDate?: string;
  registeredAt?: string;
  registeredLgis?: LgiOfficer[];
  lgisList?: LgiOfficer[];
  lastAuditDate?: string;
  totalAccreditedPpas?: number;
  activeCorpersInState?: number;
  clearanceStatus?: string;
  lgis?: {
    lgaName: string;
    inspectorName: string;
    phone: string;
    officeAddress: string;
    registeredCorpersCount: number;
    registeredPpasCount: number;
  }[];
  zonalOffices?: {
    zoneName: string;
    lgiName: string;
    contact: string;
    email?: string;
    headquarters: string;
    corpersCount: number;
  }[];
}

export interface AdminMessage {
  id: string;
  recipientId: string;
  recipientName: string;
  recipientEmail: string;
  recipientType?: 'corper' | 'organization' | 'committee';
  recipientRole?: string;
  channel: 'in_app' | 'email' | 'both';
  subject: string;
  message?: string;
  content?: string;
  timestamp?: string;
  sentAt?: string;
  status?: 'sent' | 'delivered';
  read?: boolean;
}

export interface ActivityLog {
  id: string;
  action: string;
  userName: string;
  role?: string;
  userRole?: string;
  userId?: string;
  details: string;
  timestamp: string;
  type?: 'registration' | 'application' | 'review' | 'report' | 'committee' | 'message';
}

export interface SocialHandles {
  twitter?: string;
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
  linkedin?: string;
  youtube?: string;
  email?: string;
  telegram?: string;
  website?: string;
}

export interface SubAdminPermissions {
  canManageCorpers: boolean;
  canManageOrganizations: boolean;
  canAuditCommittees: boolean;
  canBroadcastMessages: boolean;
  canManageModerators: boolean;
  canDeleteRecords: boolean;
  canManageSettings: boolean;
}

export interface SubAdminUser {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string; // login detail created by super admin
  role: 'sub_admin';
  assignedZone?: string;
  permissions: SubAdminPermissions;
  createdAt: string;
  lastLogin?: string;
  status: 'active' | 'suspended';
}

export interface ModeratorUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  focusArea: 'Fault & Bug Review' | 'Corper Complaints' | 'PPA Compliance' | 'System Verification';
  assignedState: string; // 'All States' or state name
  activeFaultsAssigned: number;
  totalResolvedFaults: number;
  createdAt: string;
  status: 'active' | 'inactive';
}

export interface AppFault {
  id: string;
  title: string;
  category: 'Bug / System Glitch' | 'PPA Violation / Hardship' | 'Corper Conduct' | 'Clearance Dispute' | 'Portal Error';
  reportedBy: string;
  reporterRole: 'corper' | 'organization' | 'committee' | 'admin' | 'moderator';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  state?: string;
  status: 'pending' | 'under_review' | 'resolved' | 'dismissed';
  assignedModeratorId?: string;
  assignedModeratorName?: string;
  moderatorNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface StateLoginCredential {
  stateName: string;
  stateCode: string;
  uniqueId: string; // e.g. NYSC-STATE-LA-2026
  password: string; // e.g. nysc@lagos2026
  coordinatorEmail: string;
  coordinatorName: string;
  lastLogin?: string;
}

export interface PlacementRequest {
  id: string;
  corperId: string;
  corperName: string;
  corperStateCode: string;
  courseOfStudy: string;
  category: string;
  ppaId: string;
  ppaName: string;
  requestDate: string;
  status: 'pending' | 'accepted' | 'rejected';
  rejectionReason?: string;
  decisionDate?: string;
  notes?: string;
}
