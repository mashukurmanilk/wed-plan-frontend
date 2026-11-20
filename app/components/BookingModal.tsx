'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Service } from '../types';
import { useWedPlan } from '../context/WedPlanContext';
import { X, Calendar, MapPin, Users, MessageSquare, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface BookingModalProps {
  service: Service;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ service, isOpen, onClose }) => {
  const { currentUser, createBooking } = useWedPlan();
  const router = useRouter();

  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState(service.location || '');
  const [guestCount, setGuestCount] = useState<number>(120);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Unauthenticated check
  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center border border-stone-200 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-[#F9EAE1] text-[#944F38] flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
            Sign In to Request Booking
          </h3>
          <p className="text-sm text-stone-500 mb-6">
            You must be logged in as a Bride / Customer to request a booking with{' '}
            <span className="font-semibold">{service.vendorName}</span>.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-sm font-medium hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onClose();
                router.push(`/auth/signin?redirect=/services/${service._id}`);
              }}
              className="flex-1 py-2.5 rounded-xl bg-[#B85D43] text-white text-sm font-semibold hover:bg-[#A45741]"
            >
              Sign In Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Self-booking guard (Vendor cannot book their own service)
  if (currentUser.role === 'vendor' && currentUser._id === service.vendorId) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center border border-stone-200 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
            Vendor Self-Booking Prevented
          </h3>
          <p className="text-sm text-stone-500 mb-6">
            You cannot submit a customer booking request for your own service listing ({service.serviceName}).
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#152232] text-white text-sm font-medium hover:bg-stone-800"
          >
            Understood
          </button>
        </div>
      </div>
    );
  }

  // Admin cannot book as customer
  if (currentUser.role === 'admin') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center border border-stone-200 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
            Admin Mode Active
          </h3>
          <p className="text-sm text-stone-500 mb-6">
            Admins oversee platform operations and cannot submit customer bookings. Switch to a Customer account using the top role switcher to test bookings.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#152232] text-white text-sm font-medium hover:bg-stone-800"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventDate) {
      alert('Please choose an event date.');
      return;
    }
    if (!eventLocation) {
      alert('Please enter your event location.');
      return;
    }

    setIsSubmitting(true);
    const result = await createBooking({
      serviceId: service._id,
      eventDate,
      eventLocation,
      guestCount,
      message,
    });
    setIsSubmitting(false);

    if (result.success) {
      onClose();
      router.push('/dashboard/customer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-stone-200 shadow-2xl relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#F9EAE1] text-[#944F38]">
            Booking Request
          </span>
          <h2 className="font-serif text-2xl font-bold text-stone-900 mt-2">
            Request {service.serviceName}
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Vendor: <span className="font-semibold text-stone-700">{service.vendorName}</span> ({service.vendorBusinessName || 'Wedding Specialist'})
          </p>
        </div>

        {/* Pricing Summary */}
        <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD3] mb-6 flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-500 block">Starting Estimate</span>
            <span className="text-xl font-bold font-serif text-[#152232]">
              ${service.price.toLocaleString()}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-stone-500 block">Package Type</span>
            <span className="text-xs font-semibold text-stone-800">{service.priceUnit || 'Standard Package'}</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Event Date *
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="date"
                required
                value={eventDate}
                min="2026-01-01"
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#B85D43]/20 focus:border-[#B85D43]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Event Venue / City Location *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                required
                placeholder="e.g. Meadowood Estate, Napa Valley, CA"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#B85D43]/20 focus:border-[#B85D43]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Estimated Guest Count
            </label>
            <div className="relative">
              <Users className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="number"
                min={1}
                max={2000}
                value={guestCount}
                onChange={(e) => setGuestCount(parseInt(e.target.value) || 0)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#B85D43]/20 focus:border-[#B85D43]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Personal Note / Special Requests
            </label>
            <div className="relative">
              <textarea
                rows={3}
                placeholder="Share your wedding timeline, design preferences, or specific package questions..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#B85D43]/20 focus:border-[#B85D43]"
              />
            </div>
          </div>

          <p className="text-[11px] text-stone-500 leading-relaxed pt-1">
            * Submitting sends a direct booking request to the vendor. The vendor will review and either accept or decline based on availability.
          </p>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-stone-300 text-stone-700 text-sm font-semibold hover:bg-stone-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl bg-[#B85D43] text-white text-sm font-semibold hover:bg-[#A45741] transition-all shadow-md shadow-[#B85D43]/20 disabled:opacity-50"
            >
              {isSubmitting ? 'Sending Request...' : 'Send Booking Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
