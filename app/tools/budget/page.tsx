'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DollarSign, PieChart, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface BudgetCategory {
  name: string;
  percent: number;
  description: string;
  icon: string;
}

const BUDGET_BREAKDOWN: BudgetCategory[] = [
  { name: 'Reception Venue & Estate', percent: 45, description: 'Château rental, conservatory, tables & chairs', icon: '🏰' },
  { name: 'Catering & Open Bar', percent: 20, description: '4-course plated dinner, cocktail hour, wine pairings', icon: '🍾' },
  { name: 'Fine Art Photography & Video', percent: 12, description: 'Full-day coverage, film captures, drone highlight reel', icon: '📷' },
  { name: 'Floral Artistry & Decor', percent: 10, description: 'Ceremony arch, candlelit reception tablescapes, bouquets', icon: '🌸' },
  { name: 'Couture Attire & Styling', percent: 8, description: 'Bridal gown, veil alterations, groom tuxedo rental', icon: '👗' },
  { name: 'Music, DJ & Entertainment', percent: 5, description: 'Ceremony string quartet, cocktail sax, late-night DJ', icon: '🎷' },
];

export default function BudgetPage() {
  const [totalBudget, setTotalBudget] = useState<number>(45000);

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F9EAE1] text-[#944F38]">
            Loverly Digital Planning Tool
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#152232] mt-3">
            Wedding Budget Allocation Calculator
          </h1>
          <p className="text-sm text-stone-500 mt-2">
            Based on luxury wedding industry benchmarks, see exactly how to allocate your wedding
            budget across key vendor categories.
          </p>
        </div>

        {/* Budget Input & Slider Card */}
        <div className="bg-white p-8 rounded-3xl border border-[#E8DFD3] shadow-sm text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Set Your Target Total Budget
          </span>
          <div className="font-serif text-4xl sm:text-6xl font-bold text-[#152232] mt-2 mb-6">
            ${totalBudget.toLocaleString()} <span className="text-sm text-stone-400 font-sans">USD</span>
          </div>

          <input
            type="range"
            min={10000}
            max={150000}
            step={2500}
            value={totalBudget}
            onChange={(e) => setTotalBudget(Number(e.target.value))}
            className="w-full accent-[#B85D43] cursor-pointer max-w-xl mx-auto"
          />

          <div className="flex justify-between max-w-xl mx-auto text-xs text-stone-400 mt-2">
            <span>$10,000 (Intimate)</span>
            <span>$50,000 (Grand)</span>
            <span>$150,000+ (Ultra-Luxe)</span>
          </div>
        </div>

        {/* Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {BUDGET_BREAKDOWN.map((item) => {
            const allocatedAmount = Math.round((totalBudget * item.percent) / 100);
            return (
              <div
                key={item.name}
                className="bg-white p-6 rounded-3xl border border-[#E8DFD3] shadow-sm hover:border-[#D09C85] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#FAF7F2] text-[#944F38] border border-[#E8DFD3]">
                      {item.percent}% Allocation
                    </span>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-[#152232]">{item.name}</h4>
                  <p className="text-xs text-stone-500 mt-1">{item.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs text-stone-400 uppercase font-semibold">Recommended Budget</span>
                  <span className="font-serif text-xl font-bold text-stone-900">
                    ${allocatedAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA to Directory */}
        <div className="p-8 rounded-3xl bg-[#152232] text-white text-center">
          <h3 className="font-serif text-2xl font-bold">Ready to find vendors within your budget?</h3>
          <p className="text-xs text-stone-300 mt-2 max-w-lg mx-auto">
            Browse WedPlan curated directory of approved wedding pros and filter directly by starting package price.
          </p>
          <Link
            href="/services"
            className="mt-6 inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#B85D43] hover:bg-[#A45741] text-white text-xs font-bold transition-all shadow-lg"
          >
            <span>Browse Services Directory</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
