import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const funnel = db.getFunnelMetrics();
  const cases = db.getCases();
  const customers = db.getCustomers();

  const totalStarted = funnel[0]?.count || 12450;
  const totalApproved = funnel[funnel.length - 1]?.count || 7580;
  const overallConversion = Math.round((totalApproved / totalStarted) * 1000) / 10;

  const lowRiskCount = cases.filter(c => c.riskLevel === 'LOW').length;
  const mediumRiskCount = cases.filter(c => c.riskLevel === 'MEDIUM').length;
  const highRiskCount = cases.filter(c => c.riskLevel === 'HIGH').length;
  const criticalRiskCount = cases.filter(c => c.riskLevel === 'CRITICAL').length;

  return NextResponse.json({
    success: true,
    funnel,
    overview: {
      totalStarted,
      totalApproved,
      overallConversion,
      avgOnboardingDurationMinutes: 4.8,
      manualReviewRate: 9.4,
      fraudBlockRate: 1.2,
      riskDistribution: {
        low: lowRiskCount,
        medium: mediumRiskCount,
        high: highRiskCount,
        critical: criticalRiskCount,
      },
    },
  });
}
