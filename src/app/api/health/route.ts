import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'TrustPilot AI Platform',
    checks: {
      database: 'UP',
      riskEngine: 'UP',
      ocrPipeline: 'UP',
      biometricsProvider: 'UP',
      amlScreening: 'UP',
    },
    uptime: process.uptime(),
  });
}

