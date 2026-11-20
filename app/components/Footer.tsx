'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Sparkles, Mail, ShieldCheck, Award, MapPin, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#152232] text-[#F3ECE2] pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#B85D43] flex items-center justify-center text-white shadow-md">
                <Heart className="w-4 h-4 fill-white text-white" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-wide text-white">
                WedPlan
              </span>
            </Link>

            <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
              WedPlan is the digital luxury wedding planning platform designed in the spirit of
              Loverly. We connect discerning couples with verified premier venues, film
              photographers, floral couturiers, and artisanal caterers worldwide.
            </p>

            <div className="pt-2">
              <div className="flex items-center gap-3 text-xs text-stone-300">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-800/80 border border-stone-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" /> Verified Vendors
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-800/80 border border-stone-700">
                  <Award className="w-3.5 h-3.5 text-[#C5A059]" /> Stripe Protected
                </span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-white mb-4">Wedding Services</h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <Link href="/services?category=Photography+%26+Videography" className="hover:text-white transition-colors">
                  Photography & Video
                </Link>
              </li>
              <li>
                <Link href="/services?category=Wedding+Venues" className="hover:text-white transition-colors">
                  Castles & Grand Venues
                </Link>
              </li>
              <li>
                <Link href="/services?category=Decoration+%26+Florist" className="hover:text-white transition-colors">
                  Floral Design & Decor
                </Link>
              </li>
              <li>
                <Link href="/services?category=Catering+Services" className="hover:text-white transition-colors">
                  Artisanal Catering
                </Link>
              </li>
              <li>
                <Link href="/services?category=Makeup+%26+Styling" className="hover:text-white transition-colors">
                  Bridal Hair & Makeup
                </Link>
              </li>
              <li>
                <Link href="/services?category=Wedding+Fashion" className="hover:text-white transition-colors">
                  Couture Bridal Fashion
                </Link>
              </li>
            </ul>
          </div>

          {/* Planning Suite */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-white mb-4">Planning Suite</h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <Link href="/tools/checklist" className="hover:text-white transition-colors">
                  12-Month Wedding Checklist
                </Link>
              </li>
              <li>
                <Link href="/tools/budget" className="hover:text-white transition-colors">
                  Interactive Budget Planner
                </Link>
              </li>
              <li>
                <Link href="/inspiration" className="hover:text-white transition-colors">
                  Editorial Inspiration
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Browse Verified Directory
                </Link>
              </li>
              <li>
                <Link href="/auth/signup?role=vendor" className="hover:text-[#C5A059] font-medium transition-colors">
                  List Your Business as Vendor
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-white mb-4">Concierge & Contact</h4>
            <div className="space-y-3 text-sm text-stone-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#B85D43]" /> New York • Paris • London
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#B85D43]" /> concierge@wedplan.com
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#B85D43]" /> +1 (800) 555-WED-PLAN
              </p>
              <p className="text-xs text-stone-400 pt-2">
                Available 24/7 for booking assistance and bridal consultations.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© 2026 WedPlan Inc. All rights reserved. Built for Assignment 9-Category_004.</p>
          <div className="flex items-center gap-6">
            <Link href="/services" className="hover:text-stone-300">Privacy Policy</Link>
            <Link href="/services" className="hover:text-stone-300">Terms of Service</Link>
            <Link href="/services" className="hover:text-stone-300">Vendor Code of Ethics</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
