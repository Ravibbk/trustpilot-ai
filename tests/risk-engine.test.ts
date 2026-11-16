import { describe, it, expect } from 'vitest';
import { RiskEngine } from '../src/lib/risk/engine';
import { TrustPathAI } from '../src/lib/risk/trustpath';
import { MockIdentityProvider } from '../src/lib/providers/identity';

describe('Risk Engine & TrustPath AI Tests', () => {
  it('should score clean documents and authentic liveness as Low Risk', () => {
    const result = RiskEngine.evaluateRisk({
      customer: { firstName: 'Sarah', lastName: 'Jenkins' },
      documentExtraction: {
        id: 'ext_test',
        documentId: 'doc_1',
        documentType: 'PASSPORT',
        fields: {
          fullName: { value: 'Sarah Jenkins', confidence: 98 },
          dateOfBirth: { value: '1993-04-19', confidence: 97 },
        },
        qualityScore: 95,
        issuesDetected: [],
      },
      liveness: {
        status: 'PASSED',
        livenessConfidence: 96,
        faceMatchScore: 94,
      },
      deviceRiskScore: 10,
      ipRiskScore: 10,
      velocityScore: 5,
    });

    expect(result.score).toBeLessThanOrEqual(30);
    expect(result.level).toBe('LOW');
    expect(result.positiveSignals.length).toBeGreaterThan(0);
    expect(result.riskSignals.length).toBe(0);

    const recommendation = TrustPathAI.recommendAction(result);
    expect(recommendation.targetStep).toBe('APPROVED');
    expect(recommendation.recommendedAction).toContain('Auto-Approve');
  });

  it('should flag duplicate identity and emulator as Critical Risk', () => {
    const result = RiskEngine.evaluateRisk({
      deviceRiskScore: 85,
      ipRiskScore: 80,
      velocityScore: 70,
      duplicateIdentityDetected: true,
    });

    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.level).toBe('CRITICAL');
    expect(result.riskSignals.some(s => s.title.includes('Duplicate Identity'))).toBe(true);
    expect(result.riskSignals.some(s => s.category === 'DEVICE')).toBe(true);

    const recommendation = TrustPathAI.recommendAction(result);
    expect(recommendation.targetStep).toBe('MANUAL_REVIEW');
    expect(recommendation.recommendedAction).toContain('Fraud Analyst');
  });

  it('should recommend address verification when identity is authentic but address confidence is low', () => {
    const result = RiskEngine.evaluateRisk({
      documentExtraction: {
        id: 'ext_test',
        documentId: 'doc_2',
        documentType: 'PASSPORT',
        fields: {
          fullName: { value: 'Rahul Kumar', confidence: 95 },
          address: { value: 'Baker Road NW1', confidence: 64 },
        },
        qualityScore: 88,
        issuesDetected: [],
      },
      liveness: {
        status: 'PASSED',
        livenessConfidence: 94,
      },
    });

    const recommendation = TrustPathAI.recommendAction(result, {
      hasLivenessPassed: true,
      hasDocumentPassed: true,
      addressConfidence: 64,
    });

    expect(recommendation.recommendedAction).toContain('Request Additional Proof of Address');
    expect(recommendation.targetStep).toBe('DOCUMENT_REQUIRED');
    expect(recommendation.expectedOutcome).toContain('manual analyst review');
  });

  it('should accurately compare declared identity with extracted credentials', async () => {
    const matchResult = await MockIdentityProvider.verifyIdentity(
      { firstName: 'Rahul', lastName: 'Kumar', dateOfBirth: '1991-08-25' },
      { fullName: 'Rahul Kumar', dateOfBirth: '1991-08-25' }
    );

    expect(matchResult.isMatch).toBe(true);
    expect(matchResult.nameMatchScore).toBe(100);
    expect(matchResult.discrepancies.length).toBe(0);
  });
});
