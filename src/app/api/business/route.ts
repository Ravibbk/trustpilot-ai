import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { BusinessProfile } from '@/types';
import { MockAMLProvider } from '@/lib/providers/aml';

export async function GET() {
  const businesses = db.getBusinesses();
  return NextResponse.json({ success: true, businesses });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { legalName, registrationNumber, taxId, jurisdiction, registeredAddress, directors, beneficialOwners } = body;

    if (!legalName || !registrationNumber) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Legal name and registration number are required.' } },
        { status: 400 }
      );
    }

    // Screen entity and UBOs
    const aml = await MockAMLProvider.screenSubject(legalName, registeredAddress?.country || jurisdiction || 'United States', 'BUSINESS');

    const biz: BusinessProfile = {
      id: body.id || 'biz_' + Math.random().toString(36).substring(2, 8),
      legalName,
      tradeName: body.tradeName,
      registrationNumber,
      taxId: taxId || 'PENDING',
      jurisdiction: jurisdiction || 'United States',
      incorporationDate: body.incorporationDate || new Date().toISOString().split('T')[0],
      registeredAddress: registeredAddress || {
        street: '100 Enterprise Way',
        city: 'New York',
        postalCode: '10001',
        country: 'United States',
      },
      industryCode: body.industryCode || 'TECH_541512',
      website: body.website,
      directors: directors || [],
      beneficialOwners: beneficialOwners || [],
      onboardingStatus: aml.sanctionsMatch ? 'MANUAL_REVIEW' : 'DOCUMENT_VERIFIED',
      riskScore: aml.sanctionsMatch ? 85 : 24,
      riskLevel: aml.sanctionsMatch ? 'CRITICAL' : 'LOW',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = db.upsertBusiness(biz);

    db.addAuditLog({
      userId: saved.id,
      userEmail: 'compliance@' + (legalName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'company') + '.com',
      userRole: 'BUSINESS_USER',
      action: 'KYB_SUBMISSION',
      entityType: 'BUSINESS',
      entityId: saved.id,
      details: `Business profile registered: ${legalName} (${jurisdiction}). Status: ${saved.onboardingStatus}.`,
      ipAddress: '127.0.0.1',
    });

    return NextResponse.json({ success: true, business: saved });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'KYB_ERROR', message: err.message } },
      { status: 500 }
    );
  }
}
