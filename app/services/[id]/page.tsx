'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useWedPlan } from '../../context/WedPlanContext';
import { BookingModal } from '../../components/BookingModal';
import { ServiceCard } from '../../components/ServiceCard';
import {
  MapPin,
  Star,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Share2,
  Heart,
  ArrowLeft,
  Sparkles,
  Phone,
  Mail,
  Clock,
  ChevronRight,
} from 'lucide-react';

function ServiceDetailsContent() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { getServiceById, services, currentUser, showToast } = useWedPlan();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const service = getServiceById(id);

  // Unauthenticated guard: Redirect to signin with return url
  useEffect(() => {
    if (!currentUser && typeof window !== 'undefined') {
      router.push(`/auth/signin?redirect=/services/${id}`);
    }
  }, [currentUser, id, router]);

  if (!service) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 bg-[#FAF7F2]">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-stone-200 text-center shadow-lg">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold">404</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900 mb-2">Service Not Found</h2>
          <p className="text-xs text-stone-500 mb-6">
            The wedding service listing you are looking for does not exist or may have been removed.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#B85D43] text-white text-xs font-semibold hover:bg-[#A45741] transition-all shadow"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Directory</span>
          </Link>
        </div>
      </div>
    );
  }

  // Similar services
  const similarServices = services
    .filter((s) => s.category === service.category && s._id !== service._id && s.status === 'approved' && s.isActive)
    .slice(0, 3);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      showToast('Service link copied to clipboard!', 'info');
    }
  };

  const isOwnService = currentUser?.role === 'vendor' && currentUser?._id === service.vendorId;

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <Link href="/" className="hover:text-stone-800">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <Link href="/services" className="hover:text-stone-800">
              Services
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <Link
              href={`/services?category=${encodeURIComponent(service.category)}`}
              className="hover:text-stone-800"
            >
              {service.category}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-semibold text-stone-800 truncate max-w-[200px]">
              {service.serviceName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-full bg-white border border-[#E8DFD3] text-stone-600 hover:text-stone-900 hover:border-stone-400 transition-all shadow-sm"
              title="Share service"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setIsSaved(!isSaved);
                showToast(isSaved ? 'Removed from saved wishlist' : 'Saved to your wedding wishlist! ❤️', 'info');
              }}
              className={`p-2.5 rounded-full bg-white border border-[#E8DFD3] transition-all shadow-sm ${
                isSaved ? 'text-rose-600 border-rose-200' : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Save to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="mb-10">
          {/* Main Featured Photo */}
          <div className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-3xl overflow-hidden bg-stone-200 shadow-xl border border-[#E8DFD3]">
            <img
              src={service.images[activeImageIndex] || service.images[0]}
              alt={service.serviceName}
              className="w-full h-full object-cover transition-all duration-500"
            />
            {service.featured && (
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-[#C5A059] text-white flex items-center gap-1.5 shadow-lg">
                <Sparkles className="w-3.5 h-3.5" /> Featured Luxury Pro
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {service.images.length > 1 && (
            <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-2">
              {service.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-24 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-[#B85D43] scale-105 shadow-md'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Two Column Content & Booking Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column (2 Cols): Details, Features, Vendor Profile */}
          <div className="lg:col-span-2 space-y-10">
            {/* Title & Metadata Header */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F9EAE1] text-[#944F38]">
                  {service.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-stone-600 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#B85D43]" /> {service.location}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-stone-800">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {service.vendorRating || 4.9} ({service.vendorReviewCount || 24} reviews)
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#152232] leading-tight">
                {service.serviceName}
              </h1>

              <div className="mt-4 flex items-center gap-3 pt-4 border-t border-[#E8DFD3]">
                {service.vendorAvatar ? (
                  <img
                    src={service.vendorAvatar}
                    alt={service.vendorName}
                    className="w-12 h-12 rounded-full object-cover border border-[#E8DFD3]"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#F3ECE2] text-[#B85D43] flex items-center justify-center font-bold text-lg">
                    {service.vendorName.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-serif text-lg font-bold text-stone-900 leading-none">
                      {service.vendorBusinessName || service.vendorName}
                    </p>
                    <span title="Verified Pro">
                      <ShieldCheck className="w-4 h-4 text-blue-500" />
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Artisan & Director: <span className="text-stone-700 font-medium">{service.vendorName}</span> • Response time: Within 2 hours
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="bg-white p-8 rounded-3xl border border-[#E8DFD3] shadow-sm">
              <h2 className="font-serif text-2xl font-bold text-[#152232] mb-4">
                About this Wedding Experience
              </h2>
              <div className="text-sm text-stone-600 leading-relaxed whitespace-pre-line space-y-4 font-sans">
                {service.description}
              </div>
            </div>

            {/* What is Included / Features */}
            {service.features && service.features.length > 0 && (
              <div className="bg-white p-8 rounded-3xl border border-[#E8DFD3] shadow-sm">
                <h2 className="font-serif text-2xl font-bold text-[#152232] mb-6">
                  What&apos;s Included in this Collection
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs text-stone-700 font-medium leading-snug">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vendor Atelier / Bio Card */}
            <div className="bg-gradient-to-br from-white to-[#F3ECE2] p-8 rounded-3xl border border-[#E8DFD3] shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden shadow">
                    <img
                      src={service.vendorAvatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2'}
                      alt={service.vendorName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#B85D43]">
                      Master Wedding Artisan
                    </span>
                    <h3 className="font-serif text-xl font-bold text-stone-900">
                      {service.vendorBusinessName || service.vendorName}
                    </h3>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#E8DFD3] text-stone-700 shadow-sm">
                  Verified Member
                </span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Specializing in luxury wedding celebrations across North America and Europe. Every
                client experiences tailored bespoke consultations, pristine scheduling, and
                uncompromising creative execution.
              </p>
            </div>
          </div>

          {/* Right Column: Sticky Booking Request Card */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#E8DFD3] shadow-xl sticky top-28 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Starting Investment
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-[#152232]">
                    ${service.price.toLocaleString()}
                  </span>
                  {service.priceUnit && (
                    <span className="text-xs text-stone-500 font-medium">/ {service.priceUnit}</span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD3] space-y-2.5 text-xs text-stone-600">
                <div className="flex items-center justify-between">
                  <span>Category</span>
                  <span className="font-semibold text-stone-800">{service.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Base Location</span>
                  <span className="font-semibold text-stone-800">{service.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Response Time</span>
                  <span className="font-semibold text-emerald-700">Within 2 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Cancellation</span>
                  <span className="font-semibold text-stone-800">Free until accepted</span>
                </div>
              </div>

              {/* Action Buttons based on Role */}
              {isOwnService ? (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                  <p className="font-bold mb-1">Your Service Listing</p>
                  <p>
                    You are logged in as the vendor who published this service. You can edit it from
                    your Vendor Dashboard.
                  </p>
                  <Link
                    href="/dashboard/vendor"
                    className="inline-block mt-3 px-4 py-2 rounded-xl bg-amber-800 text-white font-semibold text-xs hover:bg-amber-900 transition-colors"
                  >
                    Manage in Dashboard
                  </Link>
                </div>
              ) : currentUser?.role === 'admin' ? (
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs">
                  <p className="font-bold mb-1">Admin Preview Mode</p>
                  <p>
                    Admins cannot submit customer booking requests. Switch to a Customer account using
                    the demo bar at the top to test booking submissions.
                  </p>
                  <Link
                    href="/dashboard/admin"
                    className="inline-block mt-3 px-4 py-2 rounded-xl bg-blue-800 text-white font-semibold text-xs hover:bg-blue-900 transition-colors"
                  >
                    Open Admin Console
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => setBookingModalOpen(true)}
                    className="w-full py-4 rounded-2xl bg-[#B85D43] hover:bg-[#A45741] text-white font-bold text-sm transition-all shadow-xl shadow-[#B85D43]/25 flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Request Booking Availability</span>
                  </button>
                  <p className="text-[11px] text-center text-stone-400">
                    No immediate charge • Vendor will confirm date availability
                  </p>
                </div>
              )}

              {/* Guarantees */}
              <div className="pt-4 border-t border-stone-100 space-y-2 text-xs text-stone-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Stripe Secure Transaction Protection</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  <span>WedPlan Verified Luxury Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Services Section */}
        {similarServices.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[#E8DFD3]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#B85D43]">
                  More In {service.category}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#152232] mt-1">
                  Similar Curated Wedding Experiences
                </h3>
              </div>
              <Link
                href={`/services?category=${encodeURIComponent(service.category)}`}
                className="text-xs font-semibold text-[#B85D43] hover:underline"
              >
                View Category
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarServices.map((sim) => (
                <ServiceCard key={sim._id} service={sim} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Booking Form Modal */}
      <BookingModal
        service={service}
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
      />
    </div>
  );
}

export default function ServiceDetailsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-stone-500">Loading service details...</div>}>
      <ServiceDetailsContent />
    </Suspense>
  );
}
