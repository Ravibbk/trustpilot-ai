import { NextResponse } from 'next/server';
import { MockDocumentProvider } from '@/lib/providers/document';
import { db } from '@/lib/db';
import { VerificationDocument } from '@/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerId, fileName, fileSize, mimeType, documentType, fileUrl } = body;

    if (!fileName) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'fileName is required.' } },
        { status: 400 }
      );
    }

    const validation = await MockDocumentProvider.analyzeDocument(
      fileName,
      fileSize || 1024 * 1024,
      mimeType || 'image/jpeg',
      fileUrl,
      documentType || 'PASSPORT'
    );

    const docId = 'doc_' + Math.random().toString(36).substring(2, 9);
    const docRecord: VerificationDocument = {
      id: docId,
      customerId,
      type: documentType || 'PASSPORT',
      fileName,
      fileSize: fileSize || 1024 * 1024,
      mimeType: mimeType || 'image/jpeg',
      fileUrl: fileUrl || '/placeholder-doc.png',
      status: validation.isValid ? 'VERIFIED' : 'NEEDS_RETRY',
      rejectionReason: validation.issues.length > 0 ? validation.issues.join('; ') : undefined,
      extraction: {
        id: 'ext_' + docId,
        documentId: docId,
        documentType: documentType || 'PASSPORT',
        fields: validation.extractedFields,
        qualityScore: validation.qualityScore,
        issuesDetected: validation.issues,
      },
      uploadedAt: new Date().toISOString(),
    };

    db.addDocument(docRecord);

    if (customerId) {
      const cust = db.getCustomerById(customerId);
      if (cust) {
        cust.onboardingStatus = validation.isValid ? 'DOCUMENT_VERIFIED' : 'DOCUMENT_REQUIRED';
        db.upsertCustomer(cust);
      }
    }

    return NextResponse.json({
      success: true,
      document: docRecord,
      validation,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'OCR_PROCESSING_ERROR', message: err.message } },
      { status: 500 }
    );
  }
}

