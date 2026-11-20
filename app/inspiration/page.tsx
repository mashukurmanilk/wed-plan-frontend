'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Heart, ArrowRight } from 'lucide-react';

interface InspirationItem {
  id: string;
  title: string;
  aesthetic: 'Romantic Garden' | 'Modern Luxury' | 'European Château' | 'Classic Black-Tie';
  location: string;
  image: string;
  photographer: string;
}

const INSPIRATION_ITEMS: InspirationItem[] = [
  {
    id: 'insp_1',
    title: 'Candlelit Glass Conservatory Reception with Trailing Delphiniums',
    aesthetic: 'Romantic Garden',
    location: 'Napa Valley, CA',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Aurora Rossi Fine Art',
  },
  {
    id: 'insp_2',
    title: 'Sun-Drenched Vineyard Sunset Golden Hour First Look',
    aesthetic: 'Romantic Garden',
    location: 'Sonoma, CA',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Aurora Rossi Fine Art',
  },
  {
    id: 'insp_3',
    title: 'Architectural Haute Couture Bridal Gown & French Cathedral Veil',
    aesthetic: 'Modern Luxury',
    location: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Starlight Studio',
  },
  {
    id: 'insp_4',
    title: 'Historic French Chateau Courtyard Cocktail Hour & Champagne Tower',
    aesthetic: 'European Château',
    location: 'Loire Valley, France',
    image: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Julian Montgomery',
  },
  {
    id: 'insp_5',
    title: 'Midnight Black-Tie Ballroom Banquet with Cascading Crystal Chandeliers',
    aesthetic: 'Classic Black-Tie',
    location: 'New York, NY',
    image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Aurora Rossi Fine Art',
  },
  {
    id: 'insp_6',
    title: 'Artisanal Farm-to-Table Plated Heirloom Salmon & Caviar',
    aesthetic: 'Modern Luxury',
    location: 'San Francisco, CA',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Artisanal Catering Atelier',
  },
];

export default function InspirationPage() {
  const [selectedAesthetic, setSelectedAesthetic] = useState('All');

  const filtered = INSPIRATION_ITEMS.filter((item) => {
    if (selectedAesthetic !== 'All' && item.aesthetic !== selectedAesthetic) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F9EAE1] text-[#944F38]">
            Editorial Mood Boards
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#152232] mt-3">
            Real Wedding Inspiration Gallery
          </h1>
          <p className="text-sm text-stone-500 mt-2">
            Curated visual galleries inspired by Loverly and Vogue Weddings. Discover color palettes,
            botanical installations, and estate ceremony concepts.
          </p>
        </div>

        {/* Aesthetic Filter Chips */}
        <div className="flex justify-center gap-2 flex-wrap">
          {['All', 'Romantic Garden', 'Modern Luxury', 'European Château', 'Classic Black-Tie'].map(
            (aesthetic) => (
              <button
                key={aesthetic}
                onClick={() => setSelectedAesthetic(aesthetic)}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all ${
                  selectedAesthetic === aesthetic
                    ? 'bg-[#B85D43] text-white shadow'
                    : 'bg-white border border-[#E8DFD3] text-stone-700 hover:bg-[#FAF7F2]'
                }`}
              >
                {aesthetic}
              </button>
            )
          )}
        </div>

        {/* Masonry / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-3xl overflow-hidden border border-[#E8DFD3] hover:border-[#D09C85] transition-all duration-300 hover:shadow-xl flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-[#152232]">
                  {item.aesthetic}
                </span>
              </div>

              <div className="p-6">
                <h4 className="font-serif text-lg font-bold text-[#152232] line-clamp-2">
                  {item.title}
                </h4>
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                  <span>{item.location}</span>
                  <span className="text-[#B85D43] font-semibold">{item.photographer}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
