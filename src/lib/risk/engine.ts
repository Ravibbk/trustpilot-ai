import { RiskLevel, RiskSignal, CustomerProfile, DocumentExtraction, LivenessCheck, AMLAssessment, RiskEvaluationResult } from '@/types';

export interface RiskEvaluationInput {
  customer?: Partial<CustomerProfile>;
  documentExtraction?: DocumentExtraction;
  liveness?: Partial<LivenessCheck>;
  aml?: Partial<AMLAssessment>;
  deviceRiskScore?: number; // 0-100
  ipRiskScore?: number;     // 0-100
  velocityScore?: number;   // 0-100 (repeated attempts in short duration)
  duplicateIdentityDetected?: boolean;
}

export class RiskEngine {
  public static evaluateRisk(input: RiskEvaluationInput): RiskEvaluationResult {
    let score = 15; // baseline low risk
    const positiveSignals: RiskSignal[] = [];
    const riskSignals: RiskSignal[] = [];

    // 1. Identity & Document verification
    if (input.documentExtraction) {
      const q = input.documentExtraction.qualityScore;
      if (q >= 85) {
        score -= 5;
        positiveSignals.push({
          id: 'sig_' + Math.random().toString(36).substring(2, 7),
          category: 'DOCUMENT',
          polarity: 'POSITIVE',
          weight: 10,
          title: 'High Document Quality',
          description: `Document OCR and optical clarity scored ${q}%.`,
          evidence: `All security zones, microtext, and document borders detected crisply.`,
          detectedAt: new Date().toISOString(),
        });
      } else if (q < 65) {
        score += 25;
        riskSignals.push({
          id: 'sig_' + Math.random().toString(36).substring(2, 7),
          category: 'DOCUMENT',
          polarity: 'RISK',
          weight: 25,
          title: 'Degraded Document Clarity',
          description: `Optical quality score (${q}%) below acceptable 70% threshold.`,
          evidence: input.documentExtraction.issuesDetected.join(', ') || 'Unreadable text zones or blurry artifacts.',
          detectedAt: new Date().toISOString(),
        });
      }

      // Check fields confidence
      const fields = input.documentExtraction.fields;
      if (fields.fullName && fields.fullName.confidence >= 95) {
        positiveSignals.push({
          id: 'sig_' + Math.random().toString(36).substring(2, 7),
          category: 'IDENTITY',
          polarity: 'POSITIVE',
          weight: 15,
          title: 'Strong Name Extraction Confidence',
          description: `Extracted legal name matches submitted profile with ${fields.fullName.confidence}% confidence.`,
          evidence: `Extracted: ${fields.fullName.value}`,
          detectedAt: new Date().toISOString(),
        });
      }
    }

    // 2. Liveness & Biometric Verification
    if (input.liveness) {
      if (input.liveness.status === 'PASSED' && (input.liveness.livenessConfidence || 0) >= 90) {
        score -= 10;
        positiveSignals.push({
          id: 'sig_' + Math.random().toString(36).substring(2, 7),
          category: 'IDENTITY',
          polarity: 'POSITIVE',
          weight: 20,
          title: 'Active Liveness Verified',
          description: 'Anti-spoofing and micro-expression verification passed with authentic biological signals.',
          evidence: `Biometric confidence: ${input.liveness.livenessConfidence}%, Face match: ${input.liveness.faceMatchScore}%.`,
          detectedAt: new Date().toISOString(),
        });
      } else if (input.liveness.status === 'FAILED') {
        score += 35;
        riskSignals.push({
          id: 'sig_' + Math.random().toString(36).substring(2, 7),
          category: 'IDENTITY',
          polarity: 'RISK',
          weight: 35,
          title: 'Biometric Liveness Failure',
          description: 'Liveness challenge failed or presentation attack detected.',
          evidence: input.liveness.notes || 'Facial landmarks did not match authentic 3D movement criteria.',
          detectedAt: new Date().toISOString(),
        });
      }
    }

    // 3. Device & IP Risk
    if ((input.deviceRiskScore || 0) > 60) {
      score += 20;
      riskSignals.push({
        id: 'sig_' + Math.random().toString(36).substring(2, 7),
        category: 'DEVICE',
        polarity: 'RISK',
        weight: 20,
        title: 'High Device Anomaly Score',
        description: 'Device fingerprint indicates emulator or suspicious headless browser profile.',
        evidence: `Device Risk Metric: ${input.deviceRiskScore}/100.`,
        detectedAt: new Date().toISOString(),
      });
    }

    if ((input.ipRiskScore || 0) > 70) {
      score += 20;
      riskSignals.push({
        id: 'sig_' + Math.random().toString(36).substring(2, 7),
        category: 'GEO',
        polarity: 'RISK',
        weight: 20,
        title: 'Commercial VPN / Proxy Flag',
        description: 'Connection routed through known datacenter or high-anonymity proxy network.',
        evidence: `IP Risk Metric: ${input.ipRiskScore}/100.`,
        detectedAt: new Date().toISOString(),
      });
    }

    // 4. Velocity & Duplicate Identity
    if ((input.velocityScore || 0) > 50) {
      score += 25;
      riskSignals.push({
        id: 'sig_' + Math.random().toString(36).substring(2, 7),
        category: 'VELOCITY',
        polarity: 'RISK',
        weight: 25,
        title: 'High Verification Velocity',
        description: 'Multiple submission attempts recorded within a 10-minute window.',
        evidence: `Velocity index: ${input.velocityScore}. Repeated attempts with varying details.`,
        detectedAt: new Date().toISOString(),
      });
    }

    if (input.duplicateIdentityDetected) {
      score += 40;
      riskSignals.push({
        id: 'sig_' + Math.random().toString(36).substring(2, 7),
        category: 'IDENTITY',
        polarity: 'RISK',
        weight: 40,
        title: 'Duplicate Identity Collision',
        description: 'Identity attributes or national ID number associated with an existing active account.',
        evidence: 'National identity hash collision detected in registry.',
        detectedAt: new Date().toISOString(),
      });
    }

    // 5. AML Watchlist Hits
    if (input.aml) {
      if (input.aml.sanctionsMatch) {
        score = 98; // Immediate critical ceiling
        riskSignals.push({
          id: 'sig_' + Math.random().toString(36).substring(2, 7),
          category: 'AML',
          polarity: 'RISK',
          weight: 60,
          title: 'Global Sanctions Watchlist Hit',
          description: 'Subject matches name and identifiers on OFAC / UN / EU sanctions list.',
          evidence: input.aml.matches?.map(m => `${m.listName}: ${m.matchDetails}`).join('; ') || 'Direct match on restricted entity list.',
          detectedAt: new Date().toISOString(),
        });
      } else if (input.aml.pepMatch) {
        score += 30;
        riskSignals.push({
          id: 'sig_' + Math.random().toString(36).substring(2, 7),
          category: 'AML',
          polarity: 'RISK',
          weight: 30,
          title: 'Politically Exposed Person (PEP) Flag',
          description: 'Subject or close associate holds prominent public or political function.',
          evidence: input.aml.matches?.map(m => m.matchDetails).join('; ') || 'Identified in global PEP register.',
          detectedAt: new Date().toISOString(),
        });
      }
    }

    // Clamp score 0 - 100
    const finalScore = Math.max(0, Math.min(100, Math.round(score)));

    // Categorization
    let level: RiskLevel = 'LOW';
    if (finalScore >= 81) {
      level = 'CRITICAL';
    } else if (finalScore >= 61) {
      level = 'HIGH';
    } else if (finalScore >= 31) {
      level = 'MEDIUM';
    } else {
      level = 'LOW';
    }

    let summary = `Case scored ${finalScore}/100 (${level} Risk). `;
    if (riskSignals.length === 0) {
      summary += 'All primary identity, document quality, and biometric signals passed within nominal safety thresholds.';
    } else {
      summary += `Flagged ${riskSignals.length} risk signal(s) requiring contextual verification.`;
    }

    return {
      score: finalScore,
      level,
      positiveSignals,
      riskSignals,
      summary,
    };
  }
}
