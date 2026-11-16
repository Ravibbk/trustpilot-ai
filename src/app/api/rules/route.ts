import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const rules = db.getRules();
  return NextResponse.json({ success: true, rules });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, conditionField, conditionOperator, conditionValue, action, priority } = body;

    if (!name || !conditionField || !conditionOperator || conditionValue === undefined || !action) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Missing required rule fields.' } },
        { status: 400 }
      );
    }

    const created = db.createRule({
      name,
      description: description || '',
      conditionField,
      conditionOperator,
      conditionValue,
      action,
      isActive: true,
      priority: priority || 5,
    });

    return NextResponse.json({ success: true, rule: created });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: err.message } },
      { status: 500 }
    );
  }
}
