'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { SEED_USERS } from '@/lib/db/seed';

interface AuthContextType {
  currentUser: User;
  switchRole: (role: UserRole) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Default to Analyst for immediate rich portfolio view, easily switchable to Customer or Admin
  const [currentUser, setCurrentUser] = useState<User>(SEED_USERS[2]); // Elena Rostova (Analyst)
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedRole = localStorage.getItem('trustpilot_demo_role');
    if (savedRole) {
      const found = SEED_USERS.find(u => u.role === savedRole);
      if (found) setCurrentUser(found);
    }
  }, []);

  const switchRole = (role: UserRole) => {
    setIsLoading(true);
    const found = SEED_USERS.find(u => u.role === role) || SEED_USERS[0];
    setCurrentUser(found);
    localStorage.setItem('trustpilot_demo_role', role);
    setTimeout(() => setIsLoading(false), 200);
  };

  return (
    <AuthContext.Provider value={{ currentUser, switchRole, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

