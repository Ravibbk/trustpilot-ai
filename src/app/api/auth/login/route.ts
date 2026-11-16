import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AuthService } from '@/lib/auth/jwt';
import { UserRole } from '@/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, role } = body;

    let user;
    if (role) {
      user = await AuthService.authenticateDemoUser(role as UserRole);
    } else if (email) {
      user = await AuthService.login(email);
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_CREDENTIALS', message: 'User not found' } },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
      token: `mock_jwt_token_${user.id}_${Date.now()}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}

