export type UserRole =
  | 'STUDENT'
  | 'VERIFIER'
  | 'SELECTION_OFFICER'
  | 'ADMIN'
  | 'SUPER_ADMIN'
  | 'OFFICER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  state: string;
  district?: string;
  stCommunity?: string;
  certificateNumber?: string;
  aadhaarMasked?: string;
  annualIncome?: number;
  educationLevel?: string;
  university?: string;
  bankAccountMasked?: string;
  ifscCode?: string;
  avatarUrl?: string;
}

export type Operator = '=' | '!=' | '>' | '<' | '>=' | '<=' | 'IN' | 'NOT IN';

export interface EligibilityRule {
  id: string;
  field: string; // e.g. 'annualIncome', 'educationLevel', 'category', 'minDegreeMarks', 'age'
  fieldLabel: string;
  operator: Operator;
  value: any; // number, string, array
  description: string;
  category: 'INCOME' | 'ACADEMIC' | 'SOCIAL' | 'AGE' | 'OTHER';
}

export interface RuleGroup {
  id: string;
  logicalOperator: 'AND' | 'OR';
  rules: EligibilityRule[];
}

export interface RequiredDocumentConfig {
  id: string;
  docType: string; // e.g. 'ST_CERTIFICATE', 'INCOME_CERTIFICATE', 'DEGREE_CERTIFICATE', 'ADMISSION_LETTER', 'PASSPORT', 'BANK_PASSBOOK', 'RESEARCH_PROPOSAL'
  name: string;
  description: string;
  mandatory: boolean;
  allowedFormats: string[]; // ['PDF', 'JPG', 'PNG']
  maxSizeMB: number;
  extractedKeyFields: string[]; // e.g. ['annualIncome', 'certificateNo', 'issueDate', 'issuingAuthority']
}

export interface Scheme {
  id: string;
  code: string; // 'NFST-2026', 'NOS-2026'
  name: string;
  hindiName?: string;
  ministry: string;
  category: 'FELLOWSHIP' | 'OVERSEAS_SCHOLARSHIP' | 'HIGHER_EDUCATION' | 'PRE_MATRIC';
  academicYear: string;
  description: string;
  objectives: string[];
  slots: number;
  stipendAmountText: string;
  stipendAmountNumeric: number;
  contingencyYearly: number;
  applicationStartDate: string;
  applicationDeadline: string;
  isActive: boolean;
  ruleGroups: RuleGroup[];
  requiredDocuments: RequiredDocumentConfig[];
  selectionCriteria: {
    method: 'MERIT_BASED' | 'INCOME_CUM_MERIT' | 'DIRECT_FELLOWSHIP';
    weightageAcademic: number;
    weightageIncome: number;
    interviewRequired: boolean;
  };
}

export type ApplicationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'DOCUMENT_VERIFICATION'
  | 'DEFICIENCY'
  | 'RE_SUBMITTED'
  | 'ELIGIBILITY_CHECK'
  | 'SCREENING'
  | 'SELECTED'
  | 'NOT_SELECTED'
  | 'POST_SELECTION';

export interface FieldMismatch {
  field: string;
  fieldLabel: string;
  applicationValue: any;
  documentValue: any;
  confidence: number; // 0 - 100
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  explanation: string;
}

export interface DocumentVerificationAI {
  confidence: number; // 0 - 100
  classification: string;
  classifiedCorrectly: boolean;
  extractedFields: Record<string, any>;
  mismatches: FieldMismatch[];
  ocrSnippet: string;
  isTamperedSuspected?: boolean;
  verificationTimestamp: string;
}

export interface OfficerReviewRecord {
  officerId: string;
  officerName: string;
  reviewedAt: string;
  decision: 'APPROVED' | 'REJECTED' | 'DEFICIENCY_RAISED' | 'OVERRIDDEN';
  remarks: string;
  overrideReason?: string;
}

export interface UploadedDocument {
  id: string;
  docType: string;
  name: string;
  fileName: string;
  fileSizeKB: number;
  fileType: string;
  uploadedAt: string;
  status: 'PENDING_AI' | 'AI_VERIFIED' | 'MISMATCH_DETECTED' | 'OFFICER_APPROVED' | 'OFFICER_REJECTED' | 'DEFICIENT_RESOLVED';
  aiResult?: DocumentVerificationAI;
  officerReview?: OfficerReviewRecord;
  documentDataUrl?: string; // sample visual preview
  isCorrectedUpload?: boolean;
}

export interface DeficiencyItem {
  id: string;
  documentId?: string;
  docType: string;
  title: string;
  description: string;
  severity: 'CRITICAL' | 'MODERATE';
  createdAt: string;
  status: 'OPEN' | 'RESOLVED';
  resolvedAt?: string;
  officerRemarks: string;
  studentCorrectionNote?: string;
}

export interface RuleEvaluationItem {
  ruleId: string;
  field: string;
  fieldLabel: string;
  operator: Operator;
  expected: any;
  actual: any;
  passed: boolean;
  message: string;
  category: string;
}

export interface EligibilityEvaluation {
  isEligible: boolean;
  evaluatedAt: string;
  passedCount: number;
  totalCount: number;
  ruleResults: RuleEvaluationItem[];
  summaryExplanation: string;
}

export interface TimelineEvent {
  id: string;
  stage: ApplicationStatus;
  title: string;
  description: string;
  timestamp: string;
  actor: string;
  actorRole: UserRole | 'SYSTEM_AI';
  badgeColor?: string;
}

export interface FellowshipDisbursement {
  month: string;
  amount: number;
  status: 'CREDITED' | 'PROCESSING' | 'SCHEDULED';
  transactionId?: string;
  disbursedDate?: string;
}

export interface QuarterlyReport {
  id: string;
  quarter: string;
  academicYear: string;
  title: string;
  status: 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REVISION_NEEDED';
  submittedDate?: string;
  mentorName: string;
  mentorRemarks?: string;
  publicationsCount?: number;
}

export interface FellowshipManagement {
  fellowshipAwardNumber: string;
  awardDate: string;
  tenureYears: number;
  monthlyStipend: number;
  annualContingency: number;
  totalSanctioned: number;
  totalDisbursed: number;
  universityName: string;
  researchTopic: string;
  guideName: string;
  disbursements: FellowshipDisbursement[];
  quarterlyReports: QuarterlyReport[];
}

export interface Application {
  id: string;
  applicationNumber: string; // e.g. "TS-2026-NFST-0089"
  schemeId: string;
  schemeCode: string;
  schemeName: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  studentState: string;
  stCommunity: string;
  status: ApplicationStatus;
  submittedAt: string;
  updatedAt: string;
  
  // Dynamic Form Data filled by student
  formData: {
    annualIncome: number;
    educationLevel: string; // 'PhD', 'MPhil', 'PostGraduate', 'UnderGraduate'
    degreeName: string;
    universityName: string;
    degreePercentage: number;
    age: number;
    stSubCaste: string;
    stCertificateNumber: string;
    issuingDistrict: string;
    issuingState: string;
    bankAccountNumber: string;
    bankIfsc: string;
    bankName: string;
    researchTitle?: string;
    foreignUniversity?: string; // for NOS
    foreignCountry?: string;
    greIeltsScore?: string;
    mentorName?: string;
  };

  documents: UploadedDocument[];
  deficiencies: DeficiencyItem[];
  eligibilityEvaluation?: EligibilityEvaluation;
  timeline: TimelineEvent[];
  officerRemarks?: string;
  fellowshipDetails?: FellowshipManagement;
  score?: number; // Merit score out of 100
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole | 'SYSTEM_AI';
  action: string;
  applicationId?: string;
  applicationNumber?: string;
  documentId?: string;
  aiFinding?: string;
  officerDecision?: string;
  reason?: string;
  ipAddress: string;
}

export interface NotificationItem {
  id: string;
  userId: string; // studentId or 'OFFICER' or 'ALL'
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'ALERT' | 'SUCCESS';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  applicationId?: string;
}
