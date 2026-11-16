import { User, UserRole } from '@/types';
import { db } from '../db';

export interface AuthSession {
  user: User;
  token: string;
}

export class AuthService {
  public static async authenticateDemoUser(role: UserRole): Promise<User> {
    const users = db.getUsers();
    const user = users.find(u => u.role === role) || users[0];
    return user;
  }

  public static async login(email: string): Promise<User | null> {
    const user = db.getUserByEmail(email);
    if (!user) return null;

    db.addAuditLog({
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      action: 'USER_LOGIN',
      entityType: 'USER',
      entityId: user.id,
      details: `User logged in with role ${user.role}.`,
      ipAddress: '127.0.0.1',
    });

    return user;
  }
}

