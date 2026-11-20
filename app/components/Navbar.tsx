'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useWedPlan } from '../context/WedPlanContext';
import { RoleSwitcherBadge } from './RoleSwitcherBadge';
import {
  Heart,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Settings,
  Sparkles,
  ChevronDown,
  CalendarCheck,
  Calculator,
  Compass,
  Store,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, logout } = useWedPlan();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const getDashboardLink = () => {
    if (!currentUser) return '/auth/signin';
    switch (currentUser.role) {
      case 'admin':
        return '/dashboard/admin';
      case 'vendor':
        return '/dashboard/vendor';
      default:
        return '/dashboard/customer';
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Browse Services', href: '/services' },
    { name: 'Checklist', href: '/tools/checklist' },
    { name: 'Budget Tool', href: '/tools/budget' },
    { name: 'Inspiration', href: '/inspiration' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8DFD3]">
      {/* Top micro-announcement bar (Loverly style) */}
      <div className="bg-[#152232] text-[#F3ECE2] py-1.5 px-4 text-center text-xs tracking-wider uppercase flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
        <span>Curated wedding vendors & digital planning suite inspired by Loverly</span>
        <span className="hidden sm:inline text-[#C5A059] font-medium">• 100% Verified Pros</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-full bg-[#B85D43] flex items-center justify-center text-white shadow-md shadow-[#B85D43]/20 group-hover:scale-105 transition-transform">
                <Heart className="w-5 h-5 fill-white text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl tracking-wide font-bold text-[#152232] leading-none">
                  WedPlan
                </span>
                <span className="text-[10px] tracking-widest text-[#6B7785] uppercase font-sans mt-0.5">
                  Luxury Wedding Suite
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-[#B85D43] relative py-1 ${
                      isActive ? 'text-[#B85D43] font-semibold' : 'text-[#2A323D]'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B85D43] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Controls */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Quick Role Switcher for Test Reviewers */}
            <RoleSwitcherBadge />

            {currentUser ? (
              /* Authenticated Profile Dropdown */
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-3 pr-2 rounded-full border border-[#E8DFD3] bg-white hover:border-[#D09C85] transition-all shadow-sm"
                  aria-expanded={profileDropdownOpen}
                >
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-semibold text-[#152232] truncate max-w-[120px]">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-[#B85D43] capitalize font-medium">
                      {currentUser.role}
                    </span>
                  </div>

                  {currentUser.image ? (
                    <img
                      src={currentUser.image}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full object-cover border border-[#E8DFD3]"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#F3ECE2] flex items-center justify-center text-[#B85D43]">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                </button>

                {profileDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setProfileDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-3 border-b border-stone-100">
                        <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold">
                          Signed In As
                        </p>
                        <p className="text-sm font-bold text-stone-900 truncate">
                          {currentUser.name}
                        </p>
                        <p className="text-xs text-stone-500 truncate">{currentUser.email}</p>
                        <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#F9EAE1] text-[#944F38]">
                          {currentUser.role} {currentUser.role === 'vendor' && `• ${currentUser.subscriptionPlan}`}
                        </span>
                      </div>

                      <div className="p-1">
                        <Link
                          href={getDashboardLink()}
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-stone-700 hover:bg-[#F3ECE2] hover:text-[#944F38] transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          User Dashboard
                        </Link>

                        <Link
                          href={`${getDashboardLink()}#settings`}
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-stone-700 hover:bg-[#F3ECE2] hover:text-[#944F38] transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Profile Settings
                        </Link>
                      </div>

                      <div className="border-t border-stone-100 p-1 mt-1">
                        <button
                          onClick={async () => {
                            setProfileDropdownOpen(false);
                            await logout();
                            router.push('/');
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Public / Unauthenticated Navigation */
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 text-sm font-medium text-[#2A323D] hover:text-[#B85D43] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-5 py-2.5 text-sm font-semibold rounded-full bg-[#B85D43] text-white hover:bg-[#A45741] transition-all shadow-md shadow-[#B85D43]/20"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 sm:hidden">
            <RoleSwitcherBadge />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#2A323D] hover:bg-[#F3ECE2] transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#E8DFD3] bg-[#FAF7F2] px-4 pt-4 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-xl text-base font-medium ${
                  pathname === link.href
                    ? 'bg-[#F9EAE1] text-[#944F38] font-bold'
                    : 'text-stone-700 hover:bg-[#F3ECE2]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="border-t border-[#E8DFD3] pt-4">
            {currentUser ? (
              <div className="space-y-2">
                <div className="px-3 py-2 bg-white rounded-xl border border-stone-200">
                  <p className="text-sm font-bold text-stone-900">{currentUser.name}</p>
                  <p className="text-xs text-stone-500">{currentUser.email}</p>
                  <p className="text-xs text-[#B85D43] uppercase font-semibold mt-1">
                    Role: {currentUser.role}
                  </p>
                </div>

                <Link
                  href={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#B85D43] text-white font-semibold text-sm shadow"
                >
                  <LayoutDashboard className="w-4 h-4" /> Go to User Dashboard
                </Link>

                <button
                  onClick={async () => {
                    setMobileMenuOpen(false);
                    await logout();
                    router.push('/');
                  }}
                  className="w-full py-2.5 rounded-xl border border-rose-200 text-rose-600 font-medium text-sm hover:bg-rose-50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/auth/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-stone-300 text-stone-800 font-medium text-sm"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-[#B85D43] text-white font-semibold text-sm shadow"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
