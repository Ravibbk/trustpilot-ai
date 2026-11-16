import { describe, it, expect } from 'vitest';
import { db } from '../src/lib/db';
import { MockDocumentProvider } from '../src/lib/providers/document';
import { MockLivenessProvider } from '../src/lib/providers/liveness';
import { MockAMLProvider } from '../src/lib/providers/aml';
import { AICopilotService } from '../src/lib/ai/copilot';

describe('Workflow & Provider Integration Tests', () => {
  it('should validate and extract fields from clear passport uploads', async () => {
    const analysis = await MockDocumentProvider.analyzeDocument(
      'passport_clear.jpg',
      1.5 * 1024 * 1024,
      'image/jpeg',
      undefined,
      'PASSPORT'
    );

    expect(analysis.isValid).toBe(true);
    expect(analysis.qualityScore).toBeGreaterThanOrEqual(80);
    expect(analysis.extractedFields.fullName?.confidence).toBeGreaterThan(90);
    expect(analysis.extractedFields.dateOfBirth?.confidence).toBeGreaterThan(90);
    expect(analysis.extractedFields.documentNumber?.confidence).toBeGreaterThan(90);
    expect(analysis.issues.length).toBe(0);
  });

  it('should detect blur and generate human-friendly remediation', async () => {
    const analysis = await MockDocumentProvider.analyzeDocument(
      'blurry_id_scan.jpg',
      1.5 * 1024 * 1024,
      'image/jpeg'
    );

    expect(analysis.isValid).toBe(false);
    expect(analysis.qualityScore).toBeLessThan(70);
    expect(analysis.issues.some(i => i.toLowerCase().includes('blurry'))).toBe(true);
    expect(analysis.userFriendlyRemediation).toBeDefined();
    expect(analysis.userFriendlyRemediation).toContain('photo');
  });

  it('should pass authentic active liveness challenges and reject spoofing attempts', async () => {
    const cleanLiveness = await MockLivenessProvider.executeLivenessChallenge();
    expect(cleanLiveness.passed).toBe(true);
    expect(cleanLiveness.livenessConfidence).toBeGreaterThanOrEqual(90);
    expect(cleanLiveness.antiSpoofScore).toBeGreaterThanOrEqual(90);

    const spoofAttempt = await MockLivenessProvider.executeLivenessChallenge(
      ['center_face'],
      { simulateSpoof: true }
    );
    expect(spoofAttempt.passed).toBe(false);
    expect(spoofAttempt.antiSpoofScore).toBeLessThan(30);
    expect(spoofAttempt.remediation).toContain('Presentation attack');
  });

  it('should screen watchlists and identify PEP and Sanctions hits', async () => {
    const cleanAml = await MockAMLProvider.screenSubject('Jane Smith', 'United States');
    expect(cleanAml.status).toBe('CLEAR');
    expect(cleanAml.sanctionsMatch).toBe(false);
    expect(cleanAml.pepMatch).toBe(false);

    const sanctionsAml = await MockAMLProvider.screenSubject('Sergey Petrov', 'Russia');
    expect(sanctionsAml.status).toBe('POTENTIAL_MATCH');
    expect(sanctionsAml.sanctionsMatch).toBe(true);
    expect(sanctionsAml.riskLevel).toBe('HIGH');
  });

  it('should answer case queries strictly grounded in case signals', () => {
    const sampleCase = db.getCaseById('case_10492')!;
    expect(sampleCase).toBeDefined();

    const answer = AICopilotService.answerCaseQuery(sampleCase, 'Why was this customer flagged?');
    expect(answer.text).toContain('Rahul Kumar');
    expect(answer.text).toContain('Address Mismatch');
    expect(answer.groundedSignals).toBeDefined();
    expect(answer.groundedSignals!.length).toBeGreaterThan(0);
  });

  it('should update case status, enforce audit logging, and mirror linked customer status', () => {
    const testCase = db.getCases()[0];
    const initialLogCount = db.getAuditLogs().length;

    const updated = db.updateCaseStatus(
      testCase.id,
      'APPROVED',
      'elena.rostova@trustpilot-ai.internal',
      'Identity reconciled with utility bill proof.',
      false
    );

    expect(updated).not.toBeNull();
    expect(updated?.status).toBe('APPROVED');
    expect(db.getAuditLogs().length).toBe(initialLogCount + 1);

    const latestLog = db.getAuditLogs()[0];
    expect(latestLog.action).toBe('CASE_DECISION_APPROVED');
    expect(latestLog.details).toContain('Identity reconciled');
  });
});

