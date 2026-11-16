export type UserRole = 'CUSTOMER' | 'BUSINESS_USER' | 'ANALYST' | 'PRODUCT_MANAGER' | 'ADMIN';

export type OnboardingStatus =
  | 'STARTED'
  | 'PROFILE_COMPLETED'
  | 'DOCUMENT_REQUIRED'
  | 'DOCUMENT_UPLOADED'
  | 'DOCUMENT_VERIFIED'
  | 'LIVENESS_REQUIRED'
  | 'LIVENESS_VERIFIED'
  | 'RISK_ASSESSED'
  | 'DECISION_PENDING'
  | 'APPROVED'
  | 'MANUAL_REVIEW'
  | 'REJECTED';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type DocumentType = 'PASSPORT' | 'DRIVING_LICENSE' | 'NATIONAL_ID' | 'RESIDENCE_PERMIT' | 'CERTIFICATE_OF_INCORPORATION' | 'TAX_DOCUMENT' | 'PROOF_OF_ADDRESS';

export type CaseStatus = 'PENDING' | 'IN_REVIEW' | 'INFO_REQUESTED' | 'ESCALATED' | 'APPROVED' | 'REJECTED';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerProfile {
  id: string;
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  address: {
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  onboardingStatus: OnboardingStatus;
  riskScore: number;
  riskLevel: RiskLevel;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BeneficialOwner {
  id: string;
  businessId: string;
  fullName: string;
  ownershipPercentage: number;
  title: string;
  nationality: string;
  dateOfBirth: string;
  isPep: boolean;
  verificationStatus: 'VERIFIED' | 'PENDING' | 'FLAGGED';
}

export interface Director {
  id: string;
  businessId: string;
  fullName: string;
  role: string;
  appointmentDate: string;
  identificationNumber: string;
  status: 'ACTIVE' | 'RESIGNED';
}

export interface BusinessProfile {
  id: string;
  userId?: string;
  legalName: string;
  tradeName?: string;
  registrationNumber: string;
  taxId: string;
  jurisdiction: string;
  incorporationDate: string;
  registeredAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  industryCode: string;
  website?: string;
  directors: Director[];
  beneficialOwners: BeneficialOwner[];
  onboardingStatus: OnboardingStatus;
  riskScore: number;
  riskLevel: RiskLevel;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentExtraction {
  id: string;
  documentId: string;
  documentType: DocumentType;
  fields: {
    fullName?: { value: string; confidence: number };
    dateOfBirth?: { value: string; confidence: number };
    documentNumber?: { value: string; confidence: number };
    expiryDate?: { value: string; confidence: number };
    issueDate?: { value: string; confidence: number };
    address?: { value: string; confidence: number };
    country?: { value: string; confidence: number };
  };
  qualityScore: number; // 0-100
  issuesDetected: string[];
  rawText?: string;
}

export interface VerificationDocument {
  id: string;
  userId?: string;
  customerId?: string;
  businessId?: string;
  type: DocumentType;
  fileName: string;
  fileSize: number;
  mimeType: string;
  fileUrl: string;
  status: 'PENDING' | 'PROCESSING' | 'VERIFIED' | 'REJECTED' | 'NEEDS_RETRY';
  rejectionReason?: string;
  extraction?: DocumentExtraction;
  uploadedAt: string;
}

export interface LivenessCheck {
  id: string;
  customerId: string;
  status: 'PASSED' | 'FAILED' | 'RETRY' | 'MANUAL_REVIEW';
  livenessConfidence: number; // 0-100
  faceMatchScore: number; // 0-100
  antiSpoofScore: number; // 0-100
  challengesCompleted: string[]; // e.g. ["blink", "turn_left", "smile"]
  liveImageUrl?: string;
  notes?: string;
  performedAt: string;
}

export interface RiskEvaluationResult {
  score: number; // 0-100
  level: RiskLevel;
  positiveSignals: RiskSignal[];
  riskSignals: RiskSignal[];
  summary: string;
}

export interface RiskSignal {
  id: string;
  category: 'IDENTITY' | 'DOCUMENT' | 'DEVICE' | 'VELOCITY' | 'BEHAVIOR' | 'GEO' | 'AML';
  polarity: 'POSITIVE' | 'RISK';
  weight: number; // -100 to +100
  title: string;
  description: string;
  evidence: string;
  detectedAt: string;
}

export interface FraudEvent {
  id: string;
  timestamp: string;
  event: string;
  severity: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH';
  metadata: Record<string, any>;
}

export interface AMLAssessment {
  id: string;
  subjectId: string;
  subjectType: 'CUSTOMER' | 'BUSINESS';
  status: 'CLEAR' | 'POTENTIAL_MATCH' | 'CONFIRMED_MATCH' | 'FALSE_POSITIVE';
  riskLevel: RiskLevel;
  pepMatch: boolean;
  sanctionsMatch: boolean;
  adverseMediaMatch: boolean;
  matches: Array<{
    listName: string;
    matchedName: string;
    similarityScore: number;
    matchDetails: string;
  }>;
  screenedAt: string;
}

export interface TrustPathRecommendation {
  recommendedAction: string;
  reason: string;
  expectedOutcome: string;
  automationConfidence: number;
  suggestedRequirements: string[];
  targetStep?: OnboardingStatus;
}

export interface CaseReview {
  id: string;
  caseNumber: string;
  entityType: 'CUSTOMER' | 'BUSINESS';
  entityId: string;
  customerName: string;
  customerEmail: string;
  riskScore: number;
  riskLevel: RiskLevel;
  status: CaseStatus;
  assignedAnalyst?: string;
  signals: RiskSignal[];
  fraudTimeline: FraudEvent[];
  amlAssessment?: AMLAssessment;
  recommendation: TrustPathRecommendation;
  aiSummary: {
    overview: string;
    positiveSignals: string[];
    riskSignals: string[];
    missingEvidence: string[];
    recommendedNextStep: string;
  };
  notes: Array<{
    id: string;
    author: string;
    authorRole: string;
    content: string;
    timestamp: string;
  }>;
  actions: Array<{
    id: string;
    action: string;
    performedBy: string;
    reason: string;
    timestamp: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userEmail: string;
  userRole: UserRole;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  ipAddress: string;
  previousState?: any;
  newState?: any;
}

export interface SystemRule {
  id: string;
  name: string;
  description: string;
  conditionField: string;
  conditionOperator: 'EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'CONTAINS' | 'IN';
  conditionValue: string | number;
  action: 'APPROVE' | 'REJECT' | 'MANUAL_REVIEW' | 'ENHANCED_VERIFICATION' | 'REQUEST_ADDRESS';
  isActive: boolean;
  priority: number;
  createdAt: string;
}

export interface Experiment {
  id: string;
  name: string;
  description: string;
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  controlName: string;
  variantName: string;
  controlMetrics: {
    participants: number;
    completed: number;
    completionRate: number;
    avgDurationMinutes: number;
    dropoffRate: number;
  };
  variantMetrics: {
    participants: number;
    completed: number;
    completionRate: number;
    avgDurationMinutes: number;
    dropoffRate: number;
  };
  liftPercent: number;
  isSimulated: boolean;
  startDate: string;
  endDate?: string;
}

export interface FunnelStepMetric {
  step: string;
  label: string;
  count: number;
  conversionFromPrevious: number;
  dropOffRate: number;
  avgDurationSec: number;
}
