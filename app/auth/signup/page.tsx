'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useWedPlan } from '../../context/WedPlanContext';
import { Heart, Lock, Mail, User, Store, ArrowRight, ShieldCheck, Check } from 'lucide-react';

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') === 'vendor' ? 'vendor' : 'customer';

  const { register } = useWedPlan();

  const [role, setRole] = useState<'customer' | 'vendor'>(initialRole);
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Password Validation States
  const hasMinLen = password.length >= 6;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const isPasswordValid = hasMinLen && hasUpper && hasLower;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isPasswordValid) {
      setError('Please meet all password requirements (at least 6 chars, 1 uppercase, 1 lowercase).');
      return;
    }

    setLoading(true);
    const result = await register({
      name,
      email,
      password,
      role,
      businessName: role === 'vendor' ? businessName : undefined,
      image: image.trim() || undefined,
    });
    setLoading(false);

    if (result.success) {
      if (role === 'vendor') {
        router.push('/dashboard/vendor');
      } else {
        router.push('/dashboard/customer');
      }
    } else {
      setError(result.error || 'Failed to create account.');
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#FAF7F2]">
      {/* Left Column: Bridal Luxury Visual */}
      <div className="hidden lg:relative lg:flex flex-col justify-between p-12 bg-[#152232] text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1600&q=85"
            alt="Estate Wedding Ceremony"
            className="w-full h-full object-cover opacity-35 filter brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#152232] via-[#152232]/50 to-transparent" />
        </div>

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#B85D43] flex items-center justify-center text-white shadow-lg">
              <Heart className="w-5 h-5 fill-white text-white" />
            </div>
            <span className="font-serif text-3xl font-bold tracking-wide text-white">WedPlan</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30">
            Join WedPlan
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mt-4 leading-tight">
            Begin Your Wedding Journey with Elegance
          </h2>
          <p className="mt-4 text-stone-300 text-sm leading-relaxed">
            Whether you are planning your big day or showcasing your bridal business to thousands of
            engaged couples, WedPlan provides the tools to celebrate seamlessly.
          </p>

          <div className="mt-8 space-y-3 text-xs text-stone-200">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              <span>Free Plan includes up to 3 published services for vendors</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              <span>Full interactive 12-month wedding planning suite for couples</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-stone-400">
          © 2026 WedPlan. All rights reserved.
        </div>
      </div>

      {/* Right Column: Sign Up Form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-md w-full space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#B85D43]">
              Get Started
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#152232] mt-1.5">
              Create Your WedPlan Account
            </h1>
            <p className="text-xs text-stone-500 mt-2">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-[#B85D43] font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          {/* Account Role Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              Select Your Account Type *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  role === 'customer'
                    ? 'border-[#B85D43] bg-[#F9EAE1] shadow-sm'
                    : 'border-stone-200 bg-white hover:bg-stone-50'
                }`}
              >
                <User
                  className={`w-5 h-5 mb-2 ${
                    role === 'customer' ? 'text-[#B85D43]' : 'text-stone-400'
                  }`}
                />
                <div>
                  <p className="font-serif font-bold text-stone-900 text-sm">Bride / Customer</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">I want to plan & book</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('vendor')}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  role === 'vendor'
                    ? 'border-[#B85D43] bg-[#F9EAE1] shadow-sm'
                    : 'border-stone-200 bg-white hover:bg-stone-50'
                }`}
              >
                <Store
                  className={`w-5 h-5 mb-2 ${
                    role === 'vendor' ? 'text-[#B85D43]' : 'text-stone-400'
                  }`}
                />
                <div>
                  <p className="font-serif font-bold text-stone-900 text-sm">Wedding Vendor</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">I offer wedding services</p>
                </div>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Jessica Davies"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#B85D43]/20 focus:border-[#B85D43] bg-white"
              />
            </div>

            {role === 'vendor' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Business / Studio Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Davies Fine Art Floral Atelier"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#B85D43]/20 focus:border-[#B85D43] bg-white"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="name@wedplan.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#B85D43]/20 focus:border-[#B85D43] bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Password *
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#B85D43]/20 focus:border-[#B85D43] bg-white"
              />

              {/* Password Requirements Checklist (Required by Assignment 9) */}
              <div className="mt-2.5 space-y-1 text-[11px] text-stone-500">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                      hasMinLen ? 'bg-emerald-500 text-white' : 'bg-stone-200 text-stone-400'
                    }`}
                  >
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>At least 6 characters</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                      hasUpper ? 'bg-emerald-500 text-white' : 'bg-stone-200 text-stone-400'
                    }`}
                  >
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>At least one uppercase letter (A-Z)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                      hasLower ? 'bg-emerald-500 text-white' : 'bg-stone-200 text-stone-400'
                    }`}
                  >
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>At least one lowercase letter (a-z)</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Profile Image URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#B85D43]/20 focus:border-[#B85D43] bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !isPasswordValid}
              className="w-full py-3.5 rounded-2xl bg-[#B85D43] hover:bg-[#A45741] text-white font-bold text-sm transition-all shadow-md shadow-[#B85D43]/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? 'Creating Account...' : `Register as ${role === 'vendor' ? 'Vendor' : 'Customer'}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-[11px] text-center text-stone-400">
            * Admin accounts cannot be created via public registration and must be provisioned securely.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-stone-500">Loading sign up...</div>}>
      <SignUpContent />
    </Suspense>
  );
}
