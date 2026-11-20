'use client';

import React from 'react';
import Link from 'next/link';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 bg-[#FAF7F2]">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-stone-200 text-center shadow-xl">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-8 h-8" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
          Payment Cancelled
        </span>

        <h1 className="font-serif text-2xl font-bold text-stone-900 mt-2 mb-2">
          Upgrade Was Not Completed
        </h1>

        <p className="text-xs text-stone-500 mb-6 leading-relaxed">
          You cancelled the checkout session. No charges were made to your account. You can continue
          using the Free tier (up to 3 services) or retry whenever you are ready.
        </p>

        <div className="flex flex-col gap-2.5">
          <Link
            href="/payment/checkout"
            className="w-full py-3 rounded-2xl bg-[#B85D43] text-white text-xs font-semibold hover:bg-[#A45741] transition-all shadow"
          >
            Retry Stripe Checkout
          </Link>
          <Link
            href="/dashboard/vendor"
            className="w-full py-3 rounded-2xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors"
          >
            Return to Vendor Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
