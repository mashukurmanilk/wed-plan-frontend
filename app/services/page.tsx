'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useWedPlan } from '../context/WedPlanContext';
import { ServiceCard } from '../components/ServiceCard';
import { ServiceCategory } from '../types';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  LayoutGrid,
  List,
  ArrowUpDown,
  MapPin,
  Sparkles,
} from 'lucide-react';

const CATEGORIES: ServiceCategory[] = [
  'Photography & Videography',
  'Wedding Venues',
  'Decoration & Florist',
  'Catering Services',
  'Makeup & Styling',
  'Wedding Fashion',
];

const LOCATIONS = [
  'All Locations',
  'New York, NY',
  'Napa Valley, CA',
  'Los Angeles, CA',
  'San Francisco, CA',
  'Miami, FL',
  'Chicago, IL',
  'Paris & New York',
  'Newport, RI',
];

function ServicesContent() {
  const { services, isLoading } = useWedPlan();
  const searchParams = useSearchParams();

  // URL Query defaults
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'All';
  const initialLocation = searchParams.get('location') || 'All Locations';

  // State
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [location, setLocation] = useState(initialLocation);
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'rating'>(
    'recommended'
  );
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter only approved & active services for public browse
  const approvedActiveServices = useMemo(() => {
    return services.filter((s) => s.status === 'approved' && s.isActive);
  }, [services]);

  // Filtered & Sorted services
  const filteredServices = useMemo(() => {
    let result = approvedActiveServices.filter((service) => {
      // Keyword match
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesName = service.serviceName.toLowerCase().includes(query);
        const matchesDesc = service.description.toLowerCase().includes(query);
        const matchesVendor = service.vendorName.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesVendor) return false;
      }

      // Category match
      if (category !== 'All' && service.category !== category) {
        return false;
      }

      // Location match
      if (location !== 'All Locations' && !service.location.toLowerCase().includes(location.toLowerCase())) {
        return false;
      }

      // Max price
      if (service.price > maxPrice) {
        return false;
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return (b.vendorRating || 0) - (a.vendorRating || 0);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });

    return result;
  }, [approvedActiveServices, search, category, location, maxPrice, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setCategory('All');
    setLocation('All Locations');
    setMaxPrice(10000);
    setSortBy('recommended');
  };

  return (
    <div className="min-h-screen py-10 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumbs & Title */}
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#B85D43]">
            WedPlan Marketplace Directory
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#152232] mt-1.5">
            Browse Luxury Wedding Services
          </h1>
          <p className="text-sm text-stone-500 mt-2 max-w-2xl">
            Explore vetted wedding venues, film photographers, couture bridal fashion, and gourmet
            caterers with transparent pricing.
          </p>
        </div>

        {/* Top Control Bar */}
        <div className="bg-white p-4 rounded-3xl border border-[#E8DFD3] shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by service name, category, or vendor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#FAF7F2] text-sm text-stone-900 placeholder:text-stone-400 border border-[#E8DFD3] focus:outline-none focus:ring-2 focus:ring-[#B85D43]/20"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-stone-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-2xl bg-[#FAF7F2] text-xs font-semibold text-stone-800 border border-[#E8DFD3] focus:outline-none"
              >
                <option value="recommended">Recommended & Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated (Stars)</option>
              </select>
            </div>

            {/* Mobile Filter Trigger */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#F3ECE2] text-stone-800 text-xs font-semibold"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            {/* Grid / List View Toggle */}
            <div className="hidden sm:flex items-center border border-[#E8DFD3] rounded-2xl p-1 bg-[#FAF7F2]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-xl transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow text-[#B85D43]' : 'text-stone-400'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-xl transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow text-[#B85D43]' : 'text-stone-400'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Layout with Sidebar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className={`md:block ${mobileFilterOpen ? 'block' : 'hidden'} md:col-span-1`}>
            <div className="bg-white p-6 rounded-3xl border border-[#E8DFD3] shadow-sm sticky top-28 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#B85D43]" /> Filter Services
                </h3>
                <button
                  onClick={resetFilters}
                  className="text-xs text-[#B85D43] hover:underline font-semibold"
                >
                  Reset All
                </button>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
                  Category
                </label>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setCategory('All')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      category === 'All'
                        ? 'bg-[#F9EAE1] text-[#944F38] font-bold'
                        : 'text-stone-600 hover:bg-[#FAF7F2]'
                    }`}
                  >
                    All Categories ({approvedActiveServices.length})
                  </button>
                  {CATEGORIES.map((cat) => {
                    const count = approvedActiveServices.filter((s) => s.category === cat).length;
                    return (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                          category === cat
                            ? 'bg-[#F9EAE1] text-[#944F38] font-bold'
                            : 'text-stone-600 hover:bg-[#FAF7F2]'
                        }`}
                      >
                        <span className="truncate">{cat}</span>
                        <span className="text-[10px] text-stone-400 font-mono">({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Location Filter */}
              <div className="pt-4 border-t border-stone-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#FAF7F2] text-xs font-medium text-stone-800 border border-[#E8DFD3] focus:outline-none"
                  >
                    {LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Max Price Range Slider */}
              <div className="pt-4 border-t border-stone-100">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Max Price
                  </label>
                  <span className="text-xs font-bold text-[#B85D43]">
                    Up to ${maxPrice.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={10000}
                  step={100}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#B85D43] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                  <span>$100</span>
                  <span>$10,000+</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Results Grid / List */}
          <main className="md:col-span-3">
            {isLoading ? (
              /* Loading State */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-3xl bg-white border border-stone-200 p-4 space-y-4 animate-pulse"
                  >
                    <div className="aspect-[4/3] rounded-2xl bg-stone-200" />
                    <div className="h-4 bg-stone-200 rounded w-3/4" />
                    <div className="h-3 bg-stone-200 rounded w-1/2" />
                    <div className="h-8 bg-stone-200 rounded mt-4" />
                  </div>
                ))}
              </div>
            ) : filteredServices.length === 0 ? (
              /* Empty State */
              <div className="bg-white rounded-3xl border border-[#E8DFD3] p-12 text-center max-w-lg mx-auto shadow-sm my-8">
                <div className="w-16 h-16 rounded-full bg-[#F9EAE1] text-[#944F38] flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">
                  No Wedding Services Found
                </h3>
                <p className="text-xs text-stone-500 mb-6 leading-relaxed">
                  We couldn&apos;t find any services matching your current filters. Try broadening
                  your search term, selecting all categories, or adjusting the price range.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 rounded-full bg-[#B85D43] text-white text-xs font-semibold hover:bg-[#A45741] transition-all shadow"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-4 text-xs font-semibold text-stone-500 flex items-center justify-between">
                  <span>
                    Showing <span className="text-stone-900">{filteredServices.length}</span> curated
                    services
                  </span>
                  <span className="text-[11px] text-stone-400">
                    Category: <span className="font-bold text-stone-700">{category}</span>
                  </span>
                </div>

                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'flex flex-col gap-6'
                  }
                >
                  {filteredServices.map((service) => (
                    <ServiceCard key={service._id} service={service} />
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-stone-500">Loading wedding services...</div>}>
      <ServicesContent />
    </Suspense>
  );
}
