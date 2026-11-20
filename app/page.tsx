'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWedPlan } from './context/WedPlanContext';
import { ServiceCard } from './components/ServiceCard';
import { CategoryCard } from './components/CategoryCard';
import { ServiceCategory } from './types';
import {
  Search,
  MapPin,
  Sparkles,
  Heart,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Star,
  Users,
  Compass,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

export default function Home() {
  const { services } = useWedPlan();
  const router = useRouter();

  // Search state for Hero
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  // Filter approved & active services for featured section
  const approvedServices = services.filter((s) => s.status === 'approved' && s.isActive);
  const featuredServices = approvedServices.slice(0, 6);

  const categoriesData: { category: ServiceCategory; count: number; image: string }[] = [
    {
      category: 'Photography & Videography',
      count: approvedServices.filter((s) => s.category === 'Photography & Videography').length || 24,
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    },
    {
      category: 'Wedding Venues',
      count: approvedServices.filter((s) => s.category === 'Wedding Venues').length || 18,
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
    },
    {
      category: 'Decoration & Florist',
      count: approvedServices.filter((s) => s.category === 'Decoration & Florist').length || 32,
      image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80',
    },
    {
      category: 'Catering Services',
      count: approvedServices.filter((s) => s.category === 'Catering Services').length || 15,
      image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
    },
    {
      category: 'Makeup & Styling',
      count: approvedServices.filter((s) => s.category === 'Makeup & Styling').length || 29,
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
    },
    {
      category: 'Wedding Fashion',
      count: approvedServices.filter((s) => s.category === 'Wedding Fashion').length || 21,
      image: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedLocation) params.set('location', selectedLocation);
    router.push(`/services?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO BANNER SECTION (Loverly Luxury Aesthetic) */}
      <section className="relative min-h-[640px] lg:min-h-[720px] flex items-center justify-center overflow-hidden">
        {/* Background Image with soft dark overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=85"
            alt="Dream Wedding Celebration"
            className="w-full h-full object-cover object-center filter brightness-[0.82]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#152232] via-black/40 to-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white py-20">
          {/* Subtle Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs sm:text-sm font-medium text-white mb-6 animate-in fade-in slide-in-from-bottom-3">
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            <span>The Premier Digital Wedding Planning Platform</span>
            <span className="text-[#C5A059]">• Inspired by Loverly</span>
          </div>

          {/* Main Title Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight drop-shadow-md">
            Plan Your Dream Wedding with Unrivaled Elegance
          </h1>

          {/* Short Description */}
          <p className="mt-5 text-base sm:text-xl text-stone-200 max-w-3xl mx-auto leading-relaxed drop-shadow font-sans">
            Discover and book verified luxury venues, photographers, florists, and stylists. Your
            seamless path from proposal to &quot;I do&quot; begins here.
          </p>

          {/* Embedded Hero Search & Filter Bar */}
          <div className="mt-10 max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl p-3 sm:p-4 shadow-2xl border border-white/40 text-stone-800">
            <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              {/* Keyword Search */}
              <div className="sm:col-span-5 relative flex items-center">
                <Search className="w-5 h-5 text-stone-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Service or vendor (e.g. Photography, Estate)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FAF7F2] text-sm text-stone-900 placeholder:text-stone-400 border border-[#E8DFD3] focus:outline-none focus:ring-2 focus:ring-[#B85D43]/30"
                />
              </div>

              {/* Category Select */}
              <div className="sm:col-span-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] text-sm text-stone-900 border border-[#E8DFD3] focus:outline-none focus:ring-2 focus:ring-[#B85D43]/30"
                >
                  <option value="">All Categories</option>
                  <option value="Photography & Videography">Photography & Video</option>
                  <option value="Wedding Venues">Wedding Venues</option>
                  <option value="Decoration & Florist">Decoration & Florist</option>
                  <option value="Catering Services">Catering Services</option>
                  <option value="Makeup & Styling">Makeup & Styling</option>
                  <option value="Wedding Fashion">Wedding Fashion</option>
                </select>
              </div>

              {/* Location Select */}
              <div className="sm:col-span-2">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-3 rounded-2xl bg-[#FAF7F2] text-sm text-stone-900 border border-[#E8DFD3] focus:outline-none focus:ring-2 focus:ring-[#B85D43]/30"
                >
                  <option value="">All Locations</option>
                  <option value="New York">New York</option>
                  <option value="Napa Valley">Napa Valley</option>
                  <option value="Los Angeles">Los Angeles</option>
                  <option value="San Francisco">San Francisco</option>
                  <option value="Miami">Miami</option>
                  <option value="Paris">Paris</option>
                  <option value="Chicago">Chicago</option>
                </select>
              </div>

              {/* Submit CTA */}
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full h-full py-3 rounded-2xl bg-[#B85D43] hover:bg-[#A45741] text-white font-semibold text-sm transition-all shadow-md shadow-[#B85D43]/20 flex items-center justify-center gap-1.5"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </div>
            </form>
          </div>

          {/* Trust Badges Bar */}
          <div className="mt-10 pt-6 border-t border-white/20 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs font-serif tracking-widest uppercase text-stone-300">
            <span>Featured in</span>
            <span className="font-bold text-white tracking-widest text-sm">VOGUE</span>
            <span className="font-bold text-white tracking-widest text-sm">BRIDES</span>
            <span className="font-bold text-white tracking-widest text-sm">MARTHA STEWART</span>
            <span className="font-bold text-white tracking-widest text-sm">HARPER&apos;S BAZAAR</span>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC SECTION 1: FEATURED WEDDING SERVICES (Min 6 Approved Services) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F9EAE1] text-[#944F38]">
              Curated & Verified
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#152232] mt-3">
              Featured Wedding Services
            </h2>
            <p className="text-sm text-stone-500 mt-1 max-w-xl">
              Hand-selected luxury artisans and estates celebrated for exceptional artistry,
              reliability, and bride reviews.
            </p>
          </div>

          <Link
            href="/services"
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-sm font-semibold text-[#B85D43] hover:text-[#944F38] group"
          >
            <span>View All Services ({approvedServices.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 6 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredServices.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      </section>

      {/* 3. DYNAMIC SECTION 2: WEDDING SERVICE CATEGORIES */}
      <section className="py-20 bg-[#F3ECE2] border-y border-[#E8DFD3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white text-[#944F38] shadow-sm">
              Discover By Specialty
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#152232] mt-3">
              Explore Wedding Categories
            </h2>
            <p className="text-sm text-stone-600 mt-2">
              From breathtaking châteaux to bespoke film photographers, find every master artisan
              needed to create your celebration.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {categoriesData.map((cat) => (
              <CategoryCard
                key={cat.category}
                category={cat.category}
                count={cat.count}
                imageUrl={cat.image}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE WEDPLAN? (Custom Required Section) */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F9EAE1] text-[#944F38]">
            The WedPlan Advantage
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#152232] mt-3">
            Why Discerning Couples Choose WedPlan
          </h2>
          <p className="text-sm text-stone-500 mt-2">
            We reimagined wedding planning into an effortless, transparent, and joyful experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="p-8 rounded-3xl bg-white border border-[#E8DFD3] hover:border-[#D09C85] transition-all hover:shadow-xl group">
            <div className="w-12 h-12 rounded-2xl bg-[#F9EAE1] text-[#B85D43] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#152232] mb-2">
              Verified Elite Vendors
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Every vendor profile is manually screened for insurance, portfolio authenticity, and
              verified customer feedback.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#E8DFD3] hover:border-[#D09C85] transition-all hover:shadow-xl group">
            <div className="w-12 h-12 rounded-2xl bg-[#F9EAE1] text-[#B85D43] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#152232] mb-2">
              Transparent Pricing
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              No hidden fees or bait-and-switch quotes. Direct package prices and custom booking
              requests straight to vendors.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#E8DFD3] hover:border-[#D09C85] transition-all hover:shadow-xl group">
            <div className="w-12 h-12 rounded-2xl bg-[#F9EAE1] text-[#B85D43] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#152232] mb-2">
              Loverly Planning Suite
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Stay ahead with our 12-month timeline checklist, category budget tracker, and
              editorial inspiration mood boards.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#E8DFD3] hover:border-[#D09C85] transition-all hover:shadow-xl group">
            <div className="w-12 h-12 rounded-2xl bg-[#F9EAE1] text-[#B85D43] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6 fill-[#B85D43]/20" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#152232] mb-2">
              24/7 Dedicated Concierge
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Personalized wedding advice and assistance from certified wedding planning experts
              anytime you need guidance.
            </p>
          </div>
        </div>
      </section>

      {/* 5. HOW WEDPLAN WORKS (Interactive 3-Step Progression) */}
      <section className="py-20 bg-[#FAF7F2] border-t border-[#E8DFD3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white text-[#944F38] border border-[#E8DFD3]">
              Effortless Journey
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#152232] mt-3">
              How WedPlan Works
            </h2>
            <p className="text-sm text-stone-500 mt-2">
              Three seamless steps from initial inspiration to your unforgettable wedding day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-3xl border border-[#E8DFD3] text-center relative shadow-sm">
              <div className="w-14 h-14 rounded-full bg-[#152232] text-white font-serif text-xl font-bold flex items-center justify-center mx-auto mb-6 shadow-lg">
                1
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#152232] mb-3">
                Discover & Compare
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Filter hundreds of verified vendors by location, budget, and aesthetic style. Explore
                high-resolution galleries, client reviews, and verified packages.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-3xl border border-[#E8DFD3] text-center relative shadow-sm">
              <div className="w-14 h-14 rounded-full bg-[#B85D43] text-white font-serif text-xl font-bold flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#B85D43]/20">
                2
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#152232] mb-3">
                Request & Connect
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Submit booking requests for your specific event date and venue. Vendors review your
                inquiry directly in their dashboard and confirm availability.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-3xl border border-[#E8DFD3] text-center relative shadow-sm">
              <div className="w-14 h-14 rounded-full bg-[#C5A059] text-white font-serif text-xl font-bold flex items-center justify-center mx-auto mb-6 shadow-lg">
                3
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#152232] mb-3">
                Celebrate Your Day
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Track all bookings, contracts, and timelines directly in your Customer Dashboard. Walk
                down the aisle knowing every detail is gracefully handled.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. REAL WEDDINGS & TESTIMONIALS */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F9EAE1] text-[#944F38]">
            Real Love Stories
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#152232] mt-3">
            Celebrated by Brides & Grooms
          </h2>
          <p className="text-sm text-stone-500 mt-2">
            See how couples used WedPlan to bring their dream wedding visions to life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white border border-[#E8DFD3] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="font-serif text-base italic text-[#152232] leading-relaxed">
                &quot;WedPlan made booking our fine-art film photographer and Napa estate completely
                stress-free. The transparent packages and direct vendor messaging gave us total peace
                of mind.&quot;
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-[#E8DFD3] flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                alt="Emily Sterling"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-stone-900">Emily & James</p>
                <p className="text-[11px] text-stone-400">Meadowood Estate • June 2026</p>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#E8DFD3] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="font-serif text-base italic text-[#152232] leading-relaxed">
                &quot;The interactive checklist and budget tools are unmatched. We found our floral
                designer and Michelin-caterer within 48 hours of joining. Absolutely essential for any
                engaged couple.&quot;
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-[#E8DFD3] flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                alt="Claire & Michael"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-stone-900">Claire & Michael</p>
                <p className="text-[11px] text-stone-400">Central Park Conservatory • Sept 2026</p>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#E8DFD3] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="font-serif text-base italic text-[#152232] leading-relaxed">
                &quot;As an architect with high aesthetic standards, Loverly and WedPlan were the only
                platforms with curated vendors who understood architectural floral design and
                couture gowns.&quot;
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-[#E8DFD3] flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
                alt="Sophie & Alexandre"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-stone-900">Sophie & Alexandre</p>
                <p className="text-[11px] text-stone-400">Château de Villette, Paris</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LOVERLY PLANNING SUITE PROMO (Interactive Checklist & Budget) */}
      <section className="py-20 bg-[#152232] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30">
                Digital Wedding Suite
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mt-4 leading-tight">
                Plan Smarter with Our Interactive Tools
              </h2>
              <p className="text-stone-300 mt-4 text-sm leading-relaxed">
                Never miss a milestone. Our built-in tools keep your budget aligned and your countdown
                on track from 12 months out all the way to your wedding morning.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#B85D43] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">12-Month Interactive Checklist</h4>
                    <p className="text-xs text-stone-400">Categorized tasks with progress tracking and custom reminders.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#B85D43] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Smart Budget Allocation Calculator</h4>
                    <p className="text-xs text-stone-400">Recommended spending percentages across venues, photo, and decor.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/tools/checklist"
                  className="px-6 py-3 rounded-full bg-[#B85D43] hover:bg-[#A45741] text-white font-semibold text-sm transition-all shadow-lg shadow-[#B85D43]/20"
                >
                  Explore Checklist Tool
                </Link>
                <Link
                  href="/tools/budget"
                  className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all"
                >
                  Open Budget Planner
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80"
                  alt="Wedding Planning Suite"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. VENDOR CALL-TO-ACTION */}
      <section className="py-20 bg-[#FAF7F2] border-t border-[#E8DFD3]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-[#B85D43] to-[#944F38] text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/30">
                For Wedding Professionals
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mt-4 leading-tight">
                Grow Your Wedding Business on WedPlan
              </h2>
              <p className="text-stone-100 mt-4 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                Connect with couples actively searching for luxury vendors. Start with our Free tier
                (up to 3 active services) or unlock unlimited bookings with WedPlan Premium.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  href="/auth/signup?role=vendor"
                  className="px-8 py-3.5 rounded-full bg-white text-[#944F38] hover:bg-stone-100 font-bold text-sm transition-all shadow-xl"
                >
                  Join as a Vendor
                </Link>
                <Link
                  href="/services"
                  className="px-8 py-3.5 rounded-full bg-black/20 hover:bg-black/30 text-white font-semibold text-sm border border-white/30 transition-all"
                >
                  Browse Vendor Directory
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
