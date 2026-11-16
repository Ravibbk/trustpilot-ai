import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { CustomerProfile, OnboardingStatus } from '@/types';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (id) {
    const customer = db.getCustomerById(id);
    if (!customer) {
      return NextResponse.json(
        { success: false, error: { code: 'CUSTOMER_NOT_FOUND', message: 'Customer record not found' } },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, customer });
  }

  const customers = db.getCustomers();
  return NextResponse.json({ success: true, customers });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, dateOfBirth, nationality, address, onboardingStatus } = body;

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'First name, last name, and email are required.' } },
        { status: 400 }
      );
    }

    const customer: CustomerProfile = {
      id: body.id || 'cust_' + Math.random().toString(36).substring(2, 8),
      firstName,
      lastName,
      email,
      phone: phone || '',
      dateOfBirth: dateOfBirth || '1990-01-01',
      nationality: nationality || 'United States',
      address: address || { street: '', city: '', postalCode: '', country: nationality || 'United States' },
      onboardingStatus: onboardingStatus || 'PROFILE_COMPLETED',
      riskScore: body.riskScore ?? 15,
      riskLevel: body.riskLevel ?? 'LOW',
      tags: ['Progressive Flow'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = db.upsertCustomer(customer);

    db.addAuditLog({
      userId: saved.id,
      userEmail: saved.email,
      userRole: 'CUSTOMER',
      action: 'ONBOARDING_STATE_UPDATED',
      entityType: 'CUSTOMER',
      entityId: saved.id,
      details: `Customer profile updated to status ${saved.onboardingStatus}.`,
      ipAddress: '127.0.0.1',
    });

    return NextResponse.json({ success: true, customer: saved });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: err.message } },
      { status: 500 }
    );
  }
}

