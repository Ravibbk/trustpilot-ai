import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { CaseStatus } from '@/types';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const caseItem = db.getCaseById(params.id);
  if (!caseItem) {
    return NextResponse.json(
      { success: false, error: { code: 'CASE_NOT_FOUND', message: `Case ${params.id} does not exist.` } },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, case: caseItem });
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { action, status, performedBy, reason, overrideAi, note } = body;

    // Handle adding note
    if (note) {
      const added = db.addCaseNote(
        params.id,
        performedBy || 'Elena Rostova (Analyst)',
        'Compliance Analyst',
        note
      );
      if (!added) {
        return NextResponse.json(
          { success: false, error: { code: 'CASE_NOT_FOUND', message: 'Case not found' } },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, message: 'Note added successfully' });
    }

    // Handle decision
    const targetStatus = (status || action) as CaseStatus;
    if (!targetStatus) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_DECISION', message: 'Target status/action is required.' } },
        { status: 400 }
      );
    }

    if (!reason || reason.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: { code: 'REASON_REQUIRED', message: 'A substantive reason is required for compliance audit logs.' } },
        { status: 400 }
      );
    }

    const updated = db.updateCaseStatus(
      params.id,
      targetStatus,
      performedBy || 'analyst@trustpilot-ai.internal',
      reason,
      overrideAi || false
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, error: { code: 'CASE_NOT_FOUND', message: 'Case not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      case: updated,
      message: `Case ${updated.caseNumber} updated to ${targetStatus}.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'DECISION_PROCESSING_ERROR', message: err.message } },
      { status: 500 }
    );
  }
}
