export interface LivenessVerificationResult {
  passed: boolean;
  livenessConfidence: number; // 0-100
  faceMatchScore: number;     // 0-100
  antiSpoofScore: number;     // 0-100
  completedChallenges: string[];
  remediation?: string;
  notes: string;
}

export class MockLivenessProvider {
  public static async executeLivenessChallenge(
    challenges: string[] = ['center_face', 'blink_detected', 'head_turn_right'],
    options?: { simulateSpoof?: boolean; simulateLowLight?: boolean }
  ): Promise<LivenessVerificationResult> {
    if (options?.simulateSpoof) {
      return {
        passed: false,
        livenessConfidence: 24,
        faceMatchScore: 45,
        antiSpoofScore: 18,
        completedChallenges: ['center_face'],
        remediation: 'Presentation attack suspected (replay or digital screen detected). Please perform verification in natural lighting using a live camera.',
        notes: 'Anti-spoofing threshold violation. Spectral reflection patterns consistent with screen playback.',
      };
    }

    if (options?.simulateLowLight) {
      return {
        passed: false,
        livenessConfidence: 64,
        faceMatchScore: 68,
        antiSpoofScore: 72,
        completedChallenges: ['center_face', 'blink_detected'],
        remediation: 'Lighting is too dark for clear biometric verification. Please move to a brighter area.',
        notes: 'Low ambient lux. Biometric landmarks below contrast confidence threshold.',
      };
    }

    // Default clean verification pass
    return {
      passed: true,
      livenessConfidence: 96,
      faceMatchScore: 94,
      antiSpoofScore: 98,
      completedChallenges: challenges,
      notes: 'Active 3D depth analysis passed. Real-time micro-movements and pupil constriction confirmed authentic biological subject.',
    };
  }
}

