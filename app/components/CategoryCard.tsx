'use client';

import React from 'react';
import Link from 'next/link';
import { ServiceCategory } from '../types';
import { Camera, Home, Flower2, Utensils, Sparkles, Shirt } from 'lucide-react';

interface CategoryCardProps {
  category: ServiceCategory;
  count: number;
  imageUrl: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, count, imageUrl }) => {
  const getIcon = () => {
    switch (category) {
      case 'Photography & Videography':
        return <Camera className="w-5 h-5 text-white" />;
      case 'Wedding Venues':
        return <Home className="w-5 h-5 text-white" />;
      case 'Decoration & Florist':
        return <Flower2 className="w-5 h-5 text-white" />;
      case 'Catering Services':
        return <Utensils className="w-5 h-5 text-white" />;
      case 'Makeup & Styling':
        return <Sparkles className="w-5 h-5 text-white" />;
      case 'Wedding Fashion':
        return <Shirt className="w-5 h-5 text-white" />;
      default:
        return <Sparkles className="w-5 h-5 text-white" />;
    }
  };

  return (
    <Link
      href={`/services?category=${encodeURIComponent(category)}`}
      className="group relative aspect-[3/4] rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 block border border-[#E8DFD3]"
    >
      {/* Background Image */}
      <img
        src={imageUrl}
        alt={category}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
      />

      {/* Dark luxury gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#152232]/90 via-[#152232]/30 to-black/10 group-hover:from-[#152232]/95 transition-all" />

      {/* Content */}
      <div className="absolute inset-0 p-5 flex flex-col justify-between">
        {/* Top Icon Pill */}
        <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 group-hover:bg-[#B85D43] transition-all">
          {getIcon()}
        </div>

        {/* Bottom Details */}
        <div>
          <span className="text-[11px] uppercase tracking-wider text-[#C5A059] font-bold drop-shadow">
            {count} {count === 1 ? 'Service' : 'Services'} Available
          </span>
          <h3 className="font-serif text-xl font-bold text-white mt-1 group-hover:text-[#F3ECE2] transition-colors leading-tight">
            {category}
          </h3>
          <span className="inline-flex items-center gap-1 text-xs text-white/80 mt-2 font-medium group-hover:text-white transition-colors">
            Explore Category →
          </span>
        </div>
      </div>
    </Link>
  );
};
