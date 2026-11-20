'use client';

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useWedPlan } from '../context/WedPlanContext';
import {
  Heart,
  LayoutDashboard,
  Calendar,
  Layers,
  PlusCircle,
  CreditCard,
  Users,
  Shield,
  FileCheck,
  Receipt,
  Settings,
  LogOut,
  Store,
  UserCheck,
  Sparkles,
  AlertOctagon,
} from 'lucide-react';

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { currentUser, logout, isLoading } = useWedPlan();
  const router = useRouter();
  const pathname = usePathname();

  // Guard against unauthenticated & blocked users
  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push('/auth/signin');
    }
  }, [currentUser, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#B85D43] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Loading WedPlan Dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!currentUser) return null;

  // Blocked user screen
  if (currentUser.isBlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#FAF7F2]">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-rose-200 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <AlertOctagon className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900 mb-2">Account Restricted</h2>
          <p className="text-xs text-stone-500 mb-6 leading-relaxed">
            Your account has been blocked by platform administration. You cannot access dashboard
            features or manage bookings. Please contact support@wedplan.com.
          </p>
          <button
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="px-6 py-2.5 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // Define role navigation links
  const customerLinks = [
    { name: 'Overview', href: '/dashboard/customer', icon: LayoutDashboard },
    { name: 'My Bookings', href: '/dashboard/customer?tab=bookings', icon: Calendar },
    { name: 'Profile Settings', href: '/dashboard/customer?tab=settings', icon: Settings },
  ];

  const vendorLinks = [
    { name: 'Overview', href: '/dashboard/vendor', icon: LayoutDashboard },
    { name: 'My Services', href: '/dashboard/vendor?tab=services', icon: Layers },
    { name: 'Add Service', href: '/dashboard/vendor?tab=add', icon: PlusCircle },
    { name: 'Booking Requests', href: '/dashboard/vendor?tab=requests', icon: Calendar },
    { name: 'Subscription Plan', href: '/dashboard/vendor?tab=subscription', icon: CreditCard },
    { name: 'Profile Settings', href: '/dashboard/vendor?tab=settings', icon: Settings },
  ];

  const adminLinks = [
    { name: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
    { name: 'Manage Users', href: '/dashboard/admin?tab=users', icon: Users },
    { name: 'Manage Services', href: '/dashboard/admin?tab=services', icon: FileCheck },
    { name: 'Platform Transactions', href: '/dashboard/admin?tab=transactions', icon: Receipt },
  ];

  const activeLinks =
    currentUser.role === 'admin'
      ? adminLinks
      : currentUser.role === 'vendor'
      ? vendorLinks
      : customerLinks;

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-[#E8DFD3] p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* User Profile Card in Sidebar */}
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD3]">
            <div className="flex items-center gap-3">
              {currentUser.image ? (
                <img
                  src={currentUser.image}
                  alt={currentUser.name}
                  className="w-11 h-11 rounded-full object-cover border border-[#E8DFD3]"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-[#B85D43] text-white flex items-center justify-center font-bold text-sm">
                  {currentUser.name.charAt(0)}
                </div>
              )}
              <div className="overflow-hidden">
                <p className="font-bold text-sm text-stone-900 truncate">{currentUser.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#F9EAE1] text-[#944F38]">
                    {currentUser.role}
                  </span>
                  {currentUser.role === 'vendor' && currentUser.subscriptionPlan === 'premium' && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5" /> PRO
                    </span>
                  )}
                </div>
              </div>
            </div>
            {currentUser.businessName && (
              <p className="text-[11px] text-stone-500 mt-2 truncate font-medium">
                {currentUser.businessName}
              </p>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <p className="text-[10px] uppercase font-bold tracking-wider text-stone-400 px-3 mb-2">
              Navigation
            </p>
            {activeLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href.split('?')[0];
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#F9EAE1] text-[#944F38]'
                      : 'text-stone-600 hover:bg-[#FAF7F2] hover:text-stone-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-stone-100 space-y-2">
          <Link
            href="/services"
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
          >
            <Store className="w-4 h-4 text-stone-400" />
            <span>Marketplace Directory</span>
          </Link>
          <button
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">{children}</main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F2] p-12 text-center text-stone-500">Loading Dashboard...</div>}>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}
