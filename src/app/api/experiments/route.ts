import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const experiments = db.getExperiments();
  return NextResponse.json({ success: true, experiments });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, controlName, variantName } = body;

    if (!name || !controlName || !variantName) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Name, control name, and variant name are required.' } },
        { status: 400 }
      );
    }

    const created = db.createExperiment({
      name,
      description: description || '',
      status: 'ACTIVE',
      controlName,
      variantName,
      controlMetrics: {
        participants: 120,
        completed: 78,
        completionRate: 65.0,
        avgDurationMinutes: 6.2,
        dropoffRate: 35.0,
      },
      variantMetrics: {
        participants: 125,
        completed: 96,
        completionRate: 76.8,
        avgDurationMinutes: 4.5,
        dropoffRate: 23.2,
      },
      liftPercent: 11.8,
      isSimulated: true,
    });

    return NextResponse.json({ success: true, experiment: created });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: err.message } },
      { status: 500 }
    );
  }
}
