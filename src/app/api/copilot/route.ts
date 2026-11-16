import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AICopilotService } from '@/lib/ai/copilot';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { caseId, query, type } = body;

    if (type === 'PRODUCT_INSIGHTS') {
      const funnel = db.getFunnelMetrics();
      const experiments = db.getExperiments();
      const insight = AICopilotService.generateProductInsights(funnel, experiments);
      return NextResponse.json({ success: true, insight });
    }

    if (!caseId || !query) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'caseId and query are required.' } },
        { status: 400 }
      );
    }

    const caseItem = db.getCaseById(caseId);
    if (!caseItem) {
      return NextResponse.json(
        { success: false, error: { code: 'CASE_NOT_FOUND', message: 'Case not found' } },
        { status: 404 }
      );
    }

    const answer = AICopilotService.answerCaseQuery(caseItem, query);

    return NextResponse.json({
      success: true,
      answer,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'COPILOT_ERROR', message: err.message } },
      { status: 500 }
    );
  }
}

