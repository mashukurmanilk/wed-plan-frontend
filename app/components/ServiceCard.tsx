'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Service } from '../types';
import { useWedPlan } from '../context/WedPlanContext';
import { MapPin, Star, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  onQuickBook?: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onQuickBook }) => {
  const { currentUser } = useWedPlan();
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent) => {
    // If not authenticated, redirect to sign in with redirect param
    if (!currentUser) {
      e.preventDefault();
      router.push(`/auth/signin?redirect=/services/${service._id}`);
    }
  };

  const primaryImage =
    service.images && service.images.length > 0
      ? service.images[0]
      : 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden border border-[#E8DFD3] hover:border-[#D09C85] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
      {/* Image container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        <img
          src={primaryImage}
          alt={service.serviceName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Category Pill */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/90 backdrop-blur-md text-[#152232] shadow-sm">
            {service.category}
          </span>
          {service.featured && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#C5A059] text-white flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3" /> Featured
            </span>
          )}
        </div>

        {/* Rating badge */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-xs font-bold text-[#152232] shadow">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{service.vendorRating || 4.9}</span>
          <span className="text-stone-400 font-normal">({service.vendorReviewCount || 24})</span>
        </div>

        {/* Location badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs font-medium drop-shadow-md">
          <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>{service.location}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Vendor info header */}
          <div className="flex items-center gap-2 mb-2.5">
            {service.vendorAvatar ? (
              <img
                src={service.vendorAvatar}
                alt={service.vendorName}
                className="w-6 h-6 rounded-full object-cover border border-[#E8DFD3]"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-[#F3ECE2] flex items-center justify-center text-xs font-bold text-[#B85D43]">
                {service.vendorName.charAt(0)}
              </div>
            )}
            <span className="text-xs font-medium text-stone-600 truncate max-w-[170px]">
              {service.vendorBusinessName || service.vendorName}
            </span>
            <span title="Verified Pro">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            </span>
          </div>

          {/* Service Title */}
          <Link
            href={`/services/${service._id}`}
            onClick={handleCardClick}
            className="block group-hover:text-[#B85D43] transition-colors"
          >
            <h3 className="font-serif text-lg font-bold text-[#152232] line-clamp-1 leading-snug">
              {service.serviceName}
            </h3>
          </Link>

          {/* Short description */}
          <p className="mt-1.5 text-xs text-stone-500 line-clamp-2 leading-relaxed">
            {service.description}
          </p>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-5 pt-3.5 border-t border-[#E8DFD3] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-stone-400 uppercase tracking-wider block font-medium">
              Starting From
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold font-serif text-[#152232]">
                ${service.price.toLocaleString()}
              </span>
              {service.priceUnit && (
                <span className="text-[11px] text-stone-500 font-normal">/ {service.priceUnit}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/services/${service._id}`}
              onClick={handleCardClick}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#FAF7F2] hover:bg-[#B85D43] text-[#152232] hover:text-white border border-[#E8DFD3] hover:border-[#B85D43] transition-all flex items-center gap-1 group/btn"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
