import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search')?.toLowerCase();
  const status = searchParams.get('status');
  const riskLevel = searchParams.get('riskLevel');
  const entityType = searchParams.get('entityType');

  let cases = db.getCases();

  if (search) {
    cases = cases.filter(
      c =>
        c.caseNumber.toLowerCase().includes(search) ||
        c.customerName.toLowerCase().includes(search) ||
        c.customerEmail.toLowerCase().includes(search)
    );
  }

  if (status && status !== 'ALL') {
    cases = cases.filter(c => c.status === status);
  }

  if (riskLevel && riskLevel !== 'ALL') {
    cases = cases.filter(c => c.riskLevel === riskLevel);
  }

  if (entityType && entityType !== 'ALL') {
    cases = cases.filter(c => c.entityType === entityType);
  }

  return NextResponse.json({
    success: true,
    total: cases.length,
    cases,
  });
}
