import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search')?.toLowerCase();
  const role = searchParams.get('role');

  let logs = db.getAuditLogs();

  if (search) {
    logs = logs.filter(
      l =>
        l.action.toLowerCase().includes(search) ||
        l.details.toLowerCase().includes(search) ||
        l.userEmail.toLowerCase().includes(search) ||
        l.entityId.toLowerCase().includes(search)
    );
  }

  if (role && role !== 'ALL') {
    logs = logs.filter(l => l.userRole === role);
  }

  return NextResponse.json({
    success: true,
    total: logs.length,
    logs,
  });
}

