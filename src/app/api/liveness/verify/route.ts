import { NextResponse } from 'next/server';
import { MockLivenessProvider } from '@/lib/providers/liveness';
import { db } from '@/lib/db';
import { LivenessCheck } from '@/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerId, challenges, simulateSpoof, simulateLowLight } = body;

    const result = await MockLivenessProvider.executeLivenessChallenge(
      challenges || ['center_face', 'blink_detected', 'head_turn_right'],
      { simulateSpoof, simulateLowLight }
    );

    const checkRecord: LivenessCheck = {
      id: 'live_' + Math.random().toString(36).substring(2, 9),
      customerId: customerId || 'cust_temp',
      status: result.passed ? 'PASSED' : (result.antiSpoofScore < 30 ? 'FAILED' : 'RETRY'),
      livenessConfidence: result.livenessConfidence,
      faceMatchScore: result.faceMatchScore,
      antiSpoofScore: result.antiSpoofScore,
      challengesCompleted: result.completedChallenges,
      notes: result.notes,
      performedAt: new Date().toISOString(),
    };

    db.recordLiveness(checkRecord);

    if (customerId) {
      const cust = db.getCustomerById(customerId);
      if (cust) {
        cust.onboardingStatus = result.passed ? 'LIVENESS_VERIFIED' : 'LIVENESS_REQUIRED';
        db.upsertCustomer(cust);
      }
    }

    return NextResponse.json({
      success: true,
      livenessCheck: checkRecord,
      remediation: result.remediation,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'LIVENESS_VERIFICATION_FAILED', message: err.message } },
      { status: 500 }
    );
  }
}

