'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Menu, X, ArrowRight, Activity, Users, Building } from 'lucide-react';
import { DemoSwitcher } from '../common/DemoSwitcher';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser } = useAuth();

  const navLinks = [
    { label: 'Customer KYC', href: '/onboarding', icon: Users },
    { label: 'Business KYB', href: '/onboarding/business', icon: Building },
    { label: 'Analyst Workspace', href: '/dashboard/cases', icon: Shield },
    { label: 'Analytics', href: '/dashboard/analytics', icon: Activity },
  ];

  return (
    <>
      {/* Demo Mode Banner */}
      <div className="bg-slate-900 text-slate-300 px-4 py-1.5 text-xs border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="font-medium text-slate-200">Portfolio Demo Mode</span>
          <span className="hidden sm:inline text-slate-500">·</span>
          <span className="hidden sm:inline text-slate-400">
            Mock OCR, Liveness & AML providers active
          </span>
        </div>
        <div className="flex items-center gap-3">
          <DemoSwitcher />
        </div>
      </div>

      <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-slate-900 flex items-center justify-center text-white">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-900 tracking-tight">
                TrustPilot <span className="text-blue-600">AI</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-0.5">
              {navLinks.map(link => {
                const isActive = pathname.startsWith(link.href) && (link.href !== '/' || pathname === '/');
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-slate-100 text-slate-900'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right side CTAs */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/dashboard"
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md border border-slate-200 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              <span>Start Verification</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-500 hover:text-slate-900 rounded-md"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-2 pb-4 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-50"
              >
                <link.icon className="w-4 h-4 text-slate-400" />
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-md"
              >
                Dashboard
              </Link>
              <Link
                href="/onboarding"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-xs font-semibold text-white bg-blue-600 rounded-md"
              >
                Start Verification
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
