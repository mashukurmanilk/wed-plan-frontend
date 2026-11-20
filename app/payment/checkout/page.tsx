'use client';

import React, { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useWedPlan } from '../../context/WedPlanContext';
import {
  CreditCard,
  Lock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Heart,
} from 'lucide-react';

function CheckoutContent() {
  const router = useRouter();
  const { currentUser, upgradeToPremium } = useWedPlan();

  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('123');
  const [postal, setPostal] = useState('94103');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsProcessing(true);
    // Simulate realistic Stripe tokenization and webhook latency
    const mockSessionId = `cs_test_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    setTimeout(async () => {
      const result = await upgradeToPremium(currentUser._id, mockSessionId);
      setIsProcessing(false);
      if (result.success) {
        router.push(`/payment/success?session_id=${mockSessionId}&amount=49.00`);
      }
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Top return link */}
        <div className="mb-6">
          <Link
            href="/dashboard/vendor?tab=subscription"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cancel and return to Vendor Dashboard</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Order Summary (5 cols) */}
          <div className="md:col-span-5 bg-gradient-to-br from-[#152232] to-[#1F334D] text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-[#B85D43] flex items-center justify-center text-white">
                  <Heart className="w-4 h-4 fill-white" />
                </div>
                <span className="font-serif text-xl font-bold">WedPlan Stripe Checkout</span>
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                Vendor Membership
              </span>
              <h2 className="font-serif text-2xl font-bold mt-1">WedPlan Premium Vendor</h2>
              <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                Unlock unlimited published wedding services, verified priority badge, and concierge client matching.
              </p>

              <div className="mt-8 pt-6 border-t border-white/20 space-y-3">
                <div className="flex justify-between text-xs text-stone-300">
                  <span>Premium Plan (Monthly)</span>
                  <span className="font-semibold text-white">$49.00</span>
                </div>
                <div className="flex justify-between text-xs text-stone-300">
                  <span>Sales Tax</span>
                  <span className="font-semibold text-white">$0.00</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                  <span>Total Due Today</span>
                  <span className="font-serif text-xl text-[#C5A059]">$49.00 USD</span>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10 space-y-2 text-[11px] text-stone-400">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>256-bit TLS encrypted Stripe transaction</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Cancel anytime in your studio dashboard</span>
              </div>
            </div>
          </div>

          {/* Payment Form (7 cols) */}
          <div className="md:col-span-7 bg-white p-8 rounded-3xl border border-[#E8DFD3] shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-2xl font-bold text-[#152232]">
                Payment Information
              </h3>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                Stripe Test Mode
              </span>
            </div>

            <form onSubmit={handlePay} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Card Number
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#B85D43]/20 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Expires
                  </label>
                  <input
                    type="text"
                    required
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#B85D43]/20 font-mono text-center"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    CVC
                  </label>
                  <input
                    type="text"
                    required
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#B85D43]/20 font-mono text-center"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    ZIP / Postal
                  </label>
                  <input
                    type="text"
                    required
                    value={postal}
                    onChange={(e) => setPostal(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#B85D43]/20 font-mono text-center"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-500 text-[11px] leading-relaxed">
                💡 <span className="font-semibold text-stone-700">Test Credentials Loaded:</span> Use the standard test card 4242 •••• •••• 4242 with any future expiry date to simulate instant verification.
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 rounded-2xl bg-[#B85D43] hover:bg-[#A45741] text-white font-bold text-sm transition-all shadow-xl shadow-[#B85D43]/25 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isProcessing ? 'Verifying with Stripe...' : 'Pay $49.00 and Upgrade to Premium'}</span>
                </button>
              </div>

              <div className="text-center pt-2">
                <Link
                  href="/payment/cancel"
                  className="text-xs text-stone-400 hover:text-stone-700 underline"
                >
                  Cancel this payment and return
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-stone-500">Loading Checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
