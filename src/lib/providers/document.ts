import { DocumentType, DocumentExtraction } from '@/types';

export interface DocumentValidationResult {
  isValid: boolean;
  qualityScore: number;
  extractedFields: DocumentExtraction['fields'];
  issues: string[];
  userFriendlyRemediation?: string;
  documentType: DocumentType;
}

export class MockDocumentProvider {
  public static async analyzeDocument(
    fileName: string,
    fileSize: number,
    mimeType: string,
    fileContentPreview?: string,
    targetType: DocumentType = 'PASSPORT'
  ): Promise<DocumentValidationResult> {
    const issues: string[] = [];
    const lowerName = fileName.toLowerCase();

    // Size validation
    if (fileSize > 15 * 1024 * 1024) {
      issues.push('File exceeds the 15MB size limit.');
    }

    // Format validation
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedMimeTypes.includes(mimeType) && !lowerName.endsWith('.jpg') && !lowerName.endsWith('.png') && !lowerName.endsWith('.pdf')) {
      issues.push('Unsupported file format. Please upload JPG, PNG, or PDF.');
    }

    // Quality simulation heuristics
    const isBlurry = lowerName.includes('blur') || lowerName.includes('low_res');
    const isCropped = lowerName.includes('crop') || lowerName.includes('corner');
    const isExpired = lowerName.includes('expired');

    let qualityScore = 94;

    if (isBlurry) {
      qualityScore -= 45;
      issues.push('Document image is too blurry. Text cannot be reliably parsed.');
    }
    if (isCropped) {
      qualityScore -= 30;
      issues.push('Corners or document edges are cut off.');
    }
    if (isExpired) {
      issues.push('Document expiration date indicates the credential has lapsed.');
    }

    let remediation: string | undefined;
    if (issues.length > 0) {
      if (isBlurry) {
        remediation = 'Please take a well-lit photo without camera shake. Ensure all text and document borders are sharp and readable.';
      } else if (isCropped) {
        remediation = 'Place your document flat on a contrasting surface and capture the full frame, ensuring all four corners are visible.';
      } else if (isExpired) {
        remediation = 'Please provide an unexpired government-issued document with a valid future expiry date.';
      } else {
        remediation = 'Please verify document format and lighting, then try uploading again.';
      }
    }

    // Simulated OCR field extraction with high confidence metrics
    const sampleDocNumber = 'P' + Math.floor(10000000 + Math.random() * 90000000);
    const extractedFields: DocumentExtraction['fields'] = {
      fullName: {
        value: 'Jane Eleanor Smith',
        confidence: isBlurry ? 62 : 98,
      },
      dateOfBirth: {
        value: '1992-06-14',
        confidence: isBlurry ? 58 : 97,
      },
      documentNumber: {
        value: sampleDocNumber,
        confidence: isBlurry ? 55 : 99,
      },
      expiryDate: {
        value: isExpired ? '2023-01-15' : '2031-08-22',
        confidence: isBlurry ? 60 : 96,
      },
      issueDate: {
        value: '2021-08-23',
        confidence: 94,
      },
      address: {
        value: '742 Evergreen Terrace, Springfield, OR',
        confidence: isBlurry ? 50 : 88,
      },
      country: {
        value: 'United States',
        confidence: 99,
      },
    };

    return {
      isValid: issues.length === 0 && qualityScore >= 70,
      qualityScore: Math.max(10, Math.min(100, qualityScore)),
      extractedFields,
      issues,
      userFriendlyRemediation: remediation,
      documentType: targetType,
    };
  }
}

