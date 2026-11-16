export interface IdentityVerificationResult {
  isMatch: boolean;
  overallScore: number; // 0-100
  nameMatchScore: number;
  dobMatchScore: number;
  addressMatchScore: number;
  discrepancies: string[];
  remediation?: string;
}

export class MockIdentityProvider {
  /**
   * Calculates similarity between two strings using normalized Levenshtein-like token matching
   */
  private static calculateSimilarity(str1: string, str2: string): number {
    const clean1 = (str1 || '').toLowerCase().trim().replace(/[^a-z0-9 ]/g, '');
    const clean2 = (str2 || '').toLowerCase().trim().replace(/[^a-z0-9 ]/g, '');

    if (clean1 === clean2) return 100;
    if (!clean1 || !clean2) return 0;

    const tokens1 = clean1.split(/\s+/);
    const tokens2 = clean2.split(/\s+/);

    let matchCount = 0;
    tokens1.forEach(t => {
      if (tokens2.some(t2 => t2.includes(t) || t.includes(t2))) {
        matchCount++;
      }
    });

    const tokenRatio = (2 * matchCount) / (tokens1.length + tokens2.length);
    return Math.round(tokenRatio * 100);
  }

  public static async verifyIdentity(
    providedData: { firstName: string; lastName: string; dateOfBirth: string; address?: string },
    extractedData: { fullName?: string; dateOfBirth?: string; address?: string }
  ): Promise<IdentityVerificationResult> {
    const declaredFullName = `${providedData.firstName} ${providedData.lastName}`.trim();
    const extractedFullName = extractedData.fullName || '';

    const nameScore = this.calculateSimilarity(declaredFullName, extractedFullName);
    const dobScore = (providedData.dateOfBirth && extractedData.dateOfBirth && 
      providedData.dateOfBirth.replace(/-/g, '') === extractedData.dateOfBirth.replace(/[-/]/g, '')) ? 100 : 
      (providedData.dateOfBirth && extractedData.dateOfBirth ? 40 : 80);

    const addressScore = providedData.address && extractedData.address 
      ? this.calculateSimilarity(providedData.address, extractedData.address) 
      : 85;

    const overallScore = Math.round(nameScore * 0.5 + dobScore * 0.3 + addressScore * 0.2);
    const discrepancies: string[] = [];

    if (nameScore < 85) {
      discrepancies.push(`Name discrepancy: Declared '${declaredFullName}' vs Extracted '${extractedFullName}' (Similarity ${nameScore}%)`);
    }
    if (dobScore < 90 && extractedData.dateOfBirth) {
      discrepancies.push(`DOB mismatch: Declared '${providedData.dateOfBirth}' vs Extracted '${extractedData.dateOfBirth}'`);
    }
    if (addressScore < 70 && extractedData.address) {
      discrepancies.push(`Address variance: Extracted street details differ from submitted record.`);
    }

    let remediation: string | undefined;
    if (overallScore < 70) {
      remediation = 'Request secondary proof of identity or utility bill to resolve variance without manual rejection.';
    }

    return {
      isMatch: overallScore >= 75,
      overallScore,
      nameMatchScore: nameScore,
      dobMatchScore: dobScore,
      addressMatchScore: addressScore,
      discrepancies,
      remediation
    };
  }
}

