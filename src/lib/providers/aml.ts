import { AMLAssessment, RiskLevel } from '@/types';

export class MockAMLProvider {
  // Known simulated flagged entities for deterministic testing
  private static KNOWN_PEP_WATCHLIST = [
    { name: 'viktor orban', list: 'EU Parliamentary Watchlist', details: 'Prominent Political Figure' },
    { name: 'sergey petrov', list: 'OFAC SDN List', details: 'Sanctions List - Specially Designated Nationals' },
    { name: 'alexander ivanov', list: 'UK HM Treasury Sanctions', details: 'Targeted Financial Sanctions' }
  ];

  public static async screenSubject(
    name: string,
    country: string,
    subjectType: 'CUSTOMER' | 'BUSINESS' = 'CUSTOMER'
  ): Promise<AMLAssessment> {
    const cleanName = name.toLowerCase().trim();
    const cleanCountry = country.toLowerCase().trim();

    const matched = this.KNOWN_PEP_WATCHLIST.find(p => cleanName.includes(p.name) || p.name.includes(cleanName));
    const isHighRiskCountry = ['iran', 'north korea', 'myanmar', 'syria'].includes(cleanCountry);

    let riskLevel: RiskLevel = 'LOW';
    let status: AMLAssessment['status'] = 'CLEAR';
    const matches: AMLAssessment['matches'] = [];

    if (matched) {
      status = 'POTENTIAL_MATCH';
      riskLevel = 'HIGH';
      matches.push({
        listName: matched.list,
        matchedName: matched.name,
        similarityScore: 92,
        matchDetails: matched.details,
      });
    }

    if (isHighRiskCountry) {
      riskLevel = riskLevel === 'HIGH' ? 'CRITICAL' : 'MEDIUM';
      matches.push({
        listName: 'FATF High-Risk Jurisdictions',
        matchedName: country,
        similarityScore: 100,
        matchDetails: 'Jurisdiction subject to a Call for Action / Counter-measures',
      });
    }

    return {
      id: 'aml_' + Math.random().toString(36).substring(2, 9),
      subjectId: 'sub_' + Math.random().toString(36).substring(2, 7),
      subjectType,
      status,
      riskLevel,
      pepMatch: !!matched && matched.details.includes('Political'),
      sanctionsMatch: !!matched && matched.details.includes('Sanctions'),
      adverseMediaMatch: false,
      matches,
      screenedAt: new Date().toISOString(),
    };
  }
}

