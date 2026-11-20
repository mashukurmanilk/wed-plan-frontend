'use client';

import React, { useState } from 'react';
import { useWedPlan } from '../context/WedPlanContext';
import { Sparkles, Shield, UserCheck, Store, ChevronDown } from 'lucide-react';

export const RoleSwitcherBadge: React.FC = () => {
  const { currentUser, loginAsDemo } = useWedPlan();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-[#F3ECE2] border border-[#E8DFD3] text-[#24292F] hover:bg-[#EBDCD4] transition-all shadow-sm"
        title="Quick Role Switcher for Evaluators"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#B85D43]" />
        <span className="font-semibold text-stone-800">
          Demo: <span className="text-[#B85D43] capitalize">{currentUser?.role || 'Guest'}</span>
          {currentUser?.role === 'vendor' && (
            <span className="text-[10px] ml-1 px-1.5 py-0.5 rounded bg-white text-stone-600 font-bold uppercase">
              {currentUser.subscriptionPlan}
            </span>
          )}
        </span>
        <ChevronDown className="w-3 h-3 text-stone-500" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-stone-200 p-2 z-50 text-xs">
            <div className="px-3 py-2 border-b border-stone-100 mb-1">
              <p className="font-bold text-stone-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#B85D43]" /> 1-Click Role Switcher
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Switch instantly between roles to test all dashboards and permissions.
              </p>
            </div>

            <button
              onClick={() => {
                loginAsDemo('customer');
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2.5 transition-colors ${
                currentUser?.role === 'customer'
                  ? 'bg-[#F9EAE1] text-[#944F38] font-semibold'
                  : 'hover:bg-stone-50 text-stone-700'
              }`}
            >
              <UserCheck className="w-4 h-4 text-[#B85D43]" />
              <div>
                <p className="font-medium">Bride / Customer</p>
                <p className="text-[10px] text-stone-500">Browse & Book Services</p>
              </div>
            </button>

            <button
              onClick={() => {
                loginAsDemo('vendor_free');
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2.5 transition-colors ${
                currentUser?.role === 'vendor' && currentUser.subscriptionPlan === 'free'
                  ? 'bg-[#F9EAE1] text-[#944F38] font-semibold'
                  : 'hover:bg-stone-50 text-stone-700'
              }`}
            >
              <Store className="w-4 h-4 text-amber-600" />
              <div>
                <p className="font-medium">Vendor (Free Tier)</p>
                <p className="text-[10px] text-stone-500">Max 3 Services Limit</p>
              </div>
            </button>

            <button
              onClick={() => {
                loginAsDemo('vendor_premium');
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2.5 transition-colors ${
                currentUser?.role === 'vendor' && currentUser.subscriptionPlan === 'premium'
                  ? 'bg-[#F9EAE1] text-[#944F38] font-semibold'
                  : 'hover:bg-stone-50 text-stone-700'
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <div>
                <p className="font-medium">Vendor (Premium Tier)</p>
                <p className="text-[10px] text-stone-500">Unlimited Services & Badge</p>
              </div>
            </button>

            <button
              onClick={() => {
                loginAsDemo('admin');
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2.5 transition-colors ${
                currentUser?.role === 'admin'
                  ? 'bg-[#F9EAE1] text-[#944F38] font-semibold'
                  : 'hover:bg-stone-50 text-stone-700'
              }`}
            >
              <Shield className="w-4 h-4 text-blue-600" />
              <div>
                <p className="font-medium">Admin</p>
                <p className="text-[10px] text-stone-500">Manage Users & Services</p>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
