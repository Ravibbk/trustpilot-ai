import { NextResponse } from 'next/server';
import { RiskEngine } from '@/lib/risk/engine';
import { TrustPathAI } from '@/lib/risk/trustpath';
import { MockAMLProvider } from '@/lib/providers/aml';
import { db } from '@/lib/db';
import { CaseReview } from '@/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerId, documentExtraction, liveness, deviceRiskScore, ipRiskScore, velocityScore, duplicateIdentityDetected } = body;

    const customer = customerId ? db.getCustomerById(customerId) : undefined;
    const name = customer ? `${customer.firstName} ${customer.lastName}` : (body.name || 'Sample User');
    const country = customer?.nationality || body.country || 'United States';

    // AML Screening
    const aml = await MockAMLProvider.screenSubject(name, country, 'CUSTOMER');

    // Risk Engine evaluation
    const riskResult = RiskEngine.evaluateRisk({
      customer,
      documentExtraction,
      liveness,
      aml,
      deviceRiskScore: deviceRiskScore ?? 12,
      ipRiskScore: ipRiskScore ?? 15,
      velocityScore: velocityScore ?? 10,
      duplicateIdentityDetected: duplicateIdentityDetected ?? false,
    });

    // TrustPath Next Best Action
    const recommendation = TrustPathAI.recommendAction(riskResult, {
      hasLivenessPassed: liveness?.status === 'PASSED',
      hasDocumentPassed: documentExtraction?.qualityScore >= 70,
      addressConfidence: documentExtraction?.fields?.address?.confidence,
      isSanctioned: aml.sanctionsMatch,
    });

    // Update customer in database
    if (customer) {
      customer.riskScore = riskResult.score;
      customer.riskLevel = riskResult.level;
      if (recommendation.targetStep === 'APPROVED') {
        customer.onboardingStatus = 'APPROVED';
      } else if (recommendation.targetStep === 'MANUAL_REVIEW') {
        customer.onboardingStatus = 'MANUAL_REVIEW';

        // Auto-generate a case for human-in-the-loop queue if not already existing
        const existingCase = db.getCases().find(c => c.entityId === customer.id && c.status !== 'APPROVED' && c.status !== 'REJECTED');
        if (!existingCase) {
          db.createCase({
            caseNumber: 'CASE-' + Math.floor(10000 + Math.random() * 90000),
            entityType: 'CUSTOMER',
            entityId: customer.id,
            customerName: `${customer.firstName} ${customer.lastName}`,
            customerEmail: customer.email,
            riskScore: riskResult.score,
            riskLevel: riskResult.level,
            status: 'PENDING',
            signals: [...riskResult.positiveSignals, ...riskResult.riskSignals],
            fraudTimeline: [
              {
                id: 'ev_' + Date.now(),
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                event: `Onboarding initiated with risk score ${riskResult.score}/100`,
                severity: riskResult.level === 'CRITICAL' ? 'HIGH' : riskResult.level === 'HIGH' ? 'MEDIUM' : 'LOW',
                metadata: { score: riskResult.score },
              },
            ],
            amlAssessment: aml,
            recommendation,
            aiSummary: {
              overview: riskResult.summary,
              positiveSignals: riskResult.positiveSignals.map(s => s.title),
              riskSignals: riskResult.riskSignals.map(s => s.title),
              missingEvidence: recommendation.suggestedRequirements,
              recommendedNextStep: recommendation.recommendedAction,
            },
            notes: [],
            actions: [],
          });
        }
      }
      db.upsertCustomer(customer);
    }

    return NextResponse.json({
      success: true,
      riskResult,
      aml,
      recommendation,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'RISK_ASSESSMENT_ERROR', message: err.message } },
      { status: 500 }
    );
  }
}

