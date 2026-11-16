import {
  User,
  CustomerProfile,
  BusinessProfile,
  CaseReview,
  AuditLog,
  SystemRule,
  Experiment,
  FunnelStepMetric,
  VerificationDocument,
  LivenessCheck,
  CaseStatus,
  OnboardingStatus
} from '@/types';
import {
  SEED_USERS,
  SEED_CUSTOMERS,
  SEED_BUSINESSES,
  SEED_CASES,
  SEED_EXPERIMENTS,
  SEED_FUNNEL,
  SEED_RULES,
  SEED_AUDIT_LOGS,
} from './seed';

// Singleton database simulation holding full transactional state
class MemoryDatabase {
  private users: User[] = [...SEED_USERS];
  private customers: CustomerProfile[] = [...SEED_CUSTOMERS];
  private businesses: BusinessProfile[] = [...SEED_BUSINESSES];
  private cases: CaseReview[] = [...SEED_CASES];
  private documents: VerificationDocument[] = [];
  private livenessChecks: LivenessCheck[] = [];
  private experiments: Experiment[] = [...SEED_EXPERIMENTS];
  private funnel: FunnelStepMetric[] = [...SEED_FUNNEL];
  private rules: SystemRule[] = [...SEED_RULES];
  private auditLogs: AuditLog[] = [...SEED_AUDIT_LOGS];

  // Users & RBAC
  public getUsers(): User[] {
    return this.users;
  }

  public getUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  public getUserByEmail(email: string): User | undefined {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  // Customers
  public getCustomers(): CustomerProfile[] {
    return this.customers;
  }

  public getCustomerById(id: string): CustomerProfile | undefined {
    return this.customers.find(c => c.id === id);
  }

  public upsertCustomer(customer: CustomerProfile): CustomerProfile {
    const idx = this.customers.findIndex(c => c.id === customer.id);
    if (idx >= 0) {
      this.customers[idx] = { ...customer, updatedAt: new Date().toISOString() };
      return this.customers[idx];
    } else {
      const created = {
        ...customer,
        id: customer.id || 'cust_' + Math.random().toString(36).substring(2, 8),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.customers.push(created);
      return created;
    }
  }

  // Businesses
  public getBusinesses(): BusinessProfile[] {
    return this.businesses;
  }

  public getBusinessById(id: string): BusinessProfile | undefined {
    return this.businesses.find(b => b.id === id);
  }

  public upsertBusiness(business: BusinessProfile): BusinessProfile {
    const idx = this.businesses.findIndex(b => b.id === business.id);
    if (idx >= 0) {
      this.businesses[idx] = { ...business, updatedAt: new Date().toISOString() };
      return this.businesses[idx];
    } else {
      const created = {
        ...business,
        id: business.id || 'biz_' + Math.random().toString(36).substring(2, 8),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.businesses.push(created);
      return created;
    }
  }

  // Cases
  public getCases(): CaseReview[] {
    return this.cases;
  }

  public getCaseById(id: string): CaseReview | undefined {
    return this.cases.find(c => c.id === id || c.caseNumber.toLowerCase() === id.toLowerCase());
  }

  public createCase(caseData: Omit<CaseReview, 'id' | 'createdAt' | 'updatedAt'>): CaseReview {
    const newCase: CaseReview = {
      ...caseData,
      id: 'case_' + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.cases.unshift(newCase);
    return newCase;
  }

  public updateCaseStatus(
    caseId: string,
    status: CaseStatus,
    performedBy: string,
    reason: string,
    overrideAi: boolean = false
  ): CaseReview | null {
    const caseItem = this.getCaseById(caseId);
    if (!caseItem) return null;

    const actionId = 'act_' + Math.random().toString(36).substring(2, 8);
    caseItem.status = status;
    caseItem.updatedAt = new Date().toISOString();
    caseItem.actions.push({
      id: actionId,
      action: overrideAi ? `OVERRIDE_AND_${status}` : status,
      performedBy,
      reason,
      timestamp: new Date().toISOString(),
    });

    // Mirror status change on linked customer or business
    if (caseItem.entityType === 'CUSTOMER') {
      const cust = this.getCustomerById(caseItem.entityId);
      if (cust) {
        if (status === 'APPROVED') cust.onboardingStatus = 'APPROVED';
        else if (status === 'REJECTED') cust.onboardingStatus = 'REJECTED';
        else if (status === 'INFO_REQUESTED') cust.onboardingStatus = 'DOCUMENT_REQUIRED';
      }
    } else if (caseItem.entityType === 'BUSINESS') {
      const biz = this.getBusinessById(caseItem.entityId);
      if (biz) {
        if (status === 'APPROVED') biz.onboardingStatus = 'APPROVED';
        else if (status === 'REJECTED') biz.onboardingStatus = 'REJECTED';
      }
    }

    // Add immutable audit log
    this.addAuditLog({
      userId: performedBy,
      userEmail: performedBy.includes('@') ? performedBy : 'analyst@trustpilot-ai.internal',
      userRole: 'ANALYST',
      action: overrideAi ? `CASE_AI_OVERRIDE_${status}` : `CASE_DECISION_${status}`,
      entityType: 'CASE',
      entityId: caseItem.caseNumber,
      details: `Analyst decision: ${status}. Reason: ${reason}${overrideAi ? ' [AI Recommendation Overridden]' : ''}`,
      ipAddress: '127.0.0.1',
    });

    return caseItem;
  }

  public addCaseNote(caseId: string, author: string, authorRole: string, content: string): boolean {
    const caseItem = this.getCaseById(caseId);
    if (!caseItem) return false;

    caseItem.notes.push({
      id: 'note_' + Math.random().toString(36).substring(2, 8),
      author,
      authorRole,
      content,
      timestamp: new Date().toISOString(),
    });
    caseItem.updatedAt = new Date().toISOString();

    this.addAuditLog({
      userId: author,
      userEmail: author.includes('@') ? author : 'analyst@trustpilot-ai.internal',
      userRole: (authorRole as any) || 'ANALYST',
      action: 'ADD_CASE_NOTE',
      entityType: 'CASE',
      entityId: caseItem.caseNumber,
      details: `Added case note: "${content.substring(0, 50)}..."`,
      ipAddress: '127.0.0.1',
    });

    return true;
  }

  // Documents
  public addDocument(doc: VerificationDocument): VerificationDocument {
    this.documents.push(doc);
    return doc;
  }

  public getDocumentsByCustomer(customerId: string): VerificationDocument[] {
    return this.documents.filter(d => d.customerId === customerId);
  }

  // Liveness
  public recordLiveness(check: LivenessCheck): LivenessCheck {
    this.livenessChecks.push(check);
    return check;
  }

  // Experiments
  public getExperiments(): Experiment[] {
    return this.experiments;
  }

  public createExperiment(exp: Omit<Experiment, 'id' | 'startDate'>): Experiment {
    const created: Experiment = {
      ...exp,
      id: 'exp_' + Math.random().toString(36).substring(2, 8),
      startDate: new Date().toISOString(),
    };
    this.experiments.push(created);
    return created;
  }

  public updateExperimentStatus(id: string, status: Experiment['status']): boolean {
    const exp = this.experiments.find(e => e.id === id);
    if (!exp) return false;
    exp.status = status;
    return true;
  }

  // Funnel
  public getFunnelMetrics(): FunnelStepMetric[] {
    return this.funnel;
  }

  // System Rules
  public getRules(): SystemRule[] {
    return this.rules;
  }

  public createRule(rule: Omit<SystemRule, 'id' | 'createdAt'>): SystemRule {
    const created: SystemRule = {
      ...rule,
      id: 'rule_' + Math.random().toString(36).substring(2, 8),
      createdAt: new Date().toISOString(),
    };
    this.rules.unshift(created);

    this.addAuditLog({
      userId: 'usr_admin_1',
      userEmail: 'admin@trustpilot-ai.internal',
      userRole: 'ADMIN',
      action: 'CREATE_SYSTEM_RULE',
      entityType: 'SYSTEM_RULE',
      entityId: created.id,
      details: `Created rule "${created.name}" (Action: ${created.action})`,
      ipAddress: '127.0.0.1',
    });

    return created;
  }

  public toggleRule(id: string, isActive: boolean): boolean {
    const r = this.rules.find(rule => rule.id === id);
    if (!r) return false;
    r.isActive = isActive;
    return true;
  }

  // Audit Logs
  public getAuditLogs(): AuditLog[] {
    return this.auditLogs;
  }

  public addAuditLog(entry: Omit<AuditLog, 'id' | 'timestamp'>): AuditLog {
    const log: AuditLog = {
      ...entry,
      id: 'aud_' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
    return log;
  }
}

// Global singleton instance
const globalForDb = globalThis as unknown as { db: MemoryDatabase };
export const db = globalForDb.db || new MemoryDatabase();
if (process.env.NODE_ENV !== 'production') globalForDb.db = db;

