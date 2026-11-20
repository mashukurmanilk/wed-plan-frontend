'use client';

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { CheckCircle2, Sparkles, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id') || `cs_test_${Date.now()}`;
  const amount = searchParams.get('amount') || '49.00';

  useEffect(() => {
    // Fire celebratory confetti!
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
    };

    function fire(particleRatio: number, opts: Record<string, unknown>) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#B85D43', '#C5A059', '#FAF7F2'],
    });
    fire(0.2, {
      spread: 60,
      colors: ['#C5A059', '#A45741', '#E8DFD3'],
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[#FAF7F2]">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-10 border border-[#E8DFD3] text-center shadow-2xl relative overflow-hidden">
        {/* Glow ornament */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-600/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F9EAE1] text-[#944F38]">
          Payment Confirmed
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#152232] mt-3">
          Welcome to WedPlan Premium!
        </h1>

        <p className="text-xs sm:text-sm text-stone-600 mt-3 leading-relaxed">
          Your Stripe subscription payment of <strong>${amount} USD</strong> was verified and
          succeeded. Your vendor account now has unlimited service listings and the verified Pro badge!
        </p>

        {/* Transaction Reference Box */}
        <div className="my-6 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD3] text-left text-xs space-y-1.5 font-mono text-stone-600">
          <div className="flex justify-between">
            <span className="text-stone-400 font-sans">Session ID:</span>
            <span className="font-bold text-stone-800 truncate max-w-[200px]">{sessionId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-400 font-sans">Plan Activated:</span>
            <span className="font-bold text-purple-700 font-sans">Premium Tier (Unlimited)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-400 font-sans">Date:</span>
            <span className="text-stone-800 font-sans">Verified Live</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/dashboard/vendor?tab=services"
            className="px-6 py-3 rounded-full bg-[#B85D43] hover:bg-[#A45741] text-white text-xs font-bold shadow-md shadow-[#B85D43]/20 flex items-center justify-center gap-1.5 transition-all"
          >
            <span>Go to Vendor Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/dashboard/vendor?tab=add"
            className="px-6 py-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all"
          >
            + Publish a New Service
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-stone-500">Verifying transaction...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
