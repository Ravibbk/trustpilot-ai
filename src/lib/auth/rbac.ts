import { UserRole } from '@/types';

export type Permission =
  | 'onboarding:read_self'
  | 'onboarding:write_self'
  | 'kyb:read_self'
  | 'kyb:write_self'
  | 'cases:read'
  | 'cases:decide'
  | 'cases:annotate'
  | 'analytics:read'
  | 'experiments:manage'
  | 'rules:manage'
  | 'audit:read'
  | 'admin:manage_users';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  CUSTOMER: ['onboarding:read_self', 'onboarding:write_self'],
  BUSINESS_USER: ['kyb:read_self', 'kyb:write_self', 'onboarding:read_self', 'onboarding:write_self'],
  ANALYST: [
    'cases:read',
    'cases:decide',
    'cases:annotate',
    'analytics:read',
    'audit:read',
  ],
  PRODUCT_MANAGER: [
    'analytics:read',
    'experiments:manage',
    'rules:manage',
    'cases:read',
    'audit:read',
  ],
  ADMIN: [
    'onboarding:read_self',
    'onboarding:write_self',
    'kyb:read_self',
    'kyb:write_self',
    'cases:read',
    'cases:decide',
    'cases:annotate',
    'analytics:read',
    'experiments:manage',
    'rules:manage',
    'audit:read',
    'admin:manage_users',
  ],
};

export class RBACService {
  public static hasPermission(role: UserRole, permission: Permission): boolean {
    const permissions = ROLE_PERMISSIONS[role] || [];
    return permissions.includes(permission);
  }

  public static canAccessPath(role: UserRole, path: string): boolean {
    // Public paths
    if (path === '/' || path.startsWith('/auth') || path.startsWith('/api/health')) {
      return true;
    }

    if (role === 'ADMIN') return true;

    if (path.startsWith('/onboarding/business') || path.startsWith('/api/business')) {
      return role === 'BUSINESS_USER';
    }

    if (path.startsWith('/onboarding') || path.startsWith('/api/onboarding')) {
      return role === 'CUSTOMER';
    }

    if (path.startsWith('/dashboard/cases') || path.startsWith('/api/cases')) {
      return role === 'ANALYST';
    }

    if (path.startsWith('/dashboard/analytics') || path.startsWith('/dashboard/experiments')) {
      return role === 'PRODUCT_MANAGER' || role === 'ANALYST';
    }

    if (path.startsWith('/dashboard/rules') || path.startsWith('/dashboard/settings') || path.startsWith('/dashboard/audit')) {
      return role === 'PRODUCT_MANAGER';
    }

    return true;
  }
}
