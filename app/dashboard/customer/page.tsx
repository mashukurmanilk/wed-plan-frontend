'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useWedPlan } from '../../context/WedPlanContext';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Ban,
  MapPin,
  Sparkles,
  ArrowRight,
  User,
  Phone,
  Mail,
  ShieldAlert,
} from 'lucide-react';

function CustomerDashboardContent() {
  const { currentUser, bookings, cancelBooking, updateProfile } = useWedPlan();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const router = useRouter();

  // Role Access Guard
  if (currentUser && currentUser.role !== 'customer') {
    return (
      <div className="bg-white p-8 rounded-3xl border border-amber-200 text-center max-w-lg mx-auto shadow-sm">
        <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">
          Customer Area Only
        </h3>
        <p className="text-xs text-stone-500 mb-6 leading-relaxed">
          You are currently signed in as a <span className="font-bold uppercase text-stone-800">{currentUser.role}</span>.
          Please switch to the {currentUser.role === 'vendor' ? 'Vendor Dashboard' : 'Admin Console'}.
        </p>
        <Link
          href={currentUser.role === 'vendor' ? '/dashboard/vendor' : '/dashboard/admin'}
          className="px-6 py-2.5 rounded-full bg-[#152232] text-white text-xs font-semibold hover:bg-stone-800"
        >
          Go to Your Dashboard
        </Link>
      </div>
    );
  }

  // Filter bookings for this customer
  const customerBookings = bookings.filter((b) => b.customerId === currentUser?._id);

  const pendingCount = customerBookings.filter((b) => b.status === 'pending').length;
  const acceptedCount = customerBookings.filter((b) => b.status === 'accepted').length;
  const rejectedCount = customerBookings.filter((b) => b.status === 'rejected').length;
  const cancelledCount = customerBookings.filter((b) => b.status === 'cancelled').length;

  // Profile edit state
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [image, setImage] = useState(currentUser?.image || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    await updateProfile({ name, phone, bio, image });
    setIsUpdating(false);
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#B85D43]">
          Customer Portal
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#152232] mt-1">
          Wedding Planning Dashboard
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Track booking requests, coordinate with luxury artisans, and manage your wedding profile.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E8DFD3] gap-6 text-sm">
        <Link
          href="/dashboard/customer"
          className={`pb-3 font-semibold transition-colors relative ${
            activeTab === 'overview'
              ? 'text-[#B85D43]'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          Overview & Stats
          {activeTab === 'overview' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B85D43]" />
          )}
        </Link>
        <Link
          href="/dashboard/customer?tab=bookings"
          className={`pb-3 font-semibold transition-colors relative ${
            activeTab === 'bookings'
              ? 'text-[#B85D43]'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          My Bookings ({customerBookings.length})
          {activeTab === 'bookings' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B85D43]" />
          )}
        </Link>
        <Link
          href="/dashboard/customer?tab=settings"
          className={`pb-3 font-semibold transition-colors relative ${
            activeTab === 'settings'
              ? 'text-[#B85D43]'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          Profile Settings
          {activeTab === 'settings' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B85D43]" />
          )}
        </Link>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stat Cards (Required by Assignment 9) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-6 rounded-3xl border border-[#E8DFD3] shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Total Requests
              </span>
              <p className="font-serif text-3xl font-bold text-[#152232] mt-2">
                {customerBookings.length}
              </p>
              <span className="text-[11px] text-stone-500 mt-1 block">All time inquiries</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E8DFD3] shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Pending Decisions
              </span>
              <p className="font-serif text-3xl font-bold text-amber-600 mt-2">{pendingCount}</p>
              <span className="text-[11px] text-stone-500 mt-1 block">Awaiting vendor review</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E8DFD3] shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Accepted Bookings
              </span>
              <p className="font-serif text-3xl font-bold text-emerald-700 mt-2">
                {acceptedCount}
              </p>
              <span className="text-[11px] text-stone-500 mt-1 block">Dates locked & confirmed</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E8DFD3] shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
                Declined / Cancelled
              </span>
              <p className="font-serif text-3xl font-bold text-stone-600 mt-2">
                {rejectedCount + cancelledCount}
              </p>
              <span className="text-[11px] text-stone-500 mt-1 block">
                {rejectedCount} declined • {cancelledCount} cancelled
              </span>
            </div>
          </div>

          {/* Quick Recent Activity */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DFD3] shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-xl font-bold text-[#152232]">
                Recent Booking Requests
              </h3>
              <Link
                href="/dashboard/customer?tab=bookings"
                className="text-xs font-semibold text-[#B85D43] hover:underline"
              >
                View All
              </Link>
            </div>

            {customerBookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-stone-500">You haven&apos;t requested any wedding services yet.</p>
                <Link
                  href="/services"
                  className="mt-4 inline-block px-5 py-2.5 rounded-full bg-[#B85D43] text-white text-xs font-semibold shadow"
                >
                  Explore Services Directory
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {customerBookings.slice(0, 3).map((b) => (
                  <div
                    key={b._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD3] gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={b.serviceImage}
                        alt={b.serviceName}
                        className="w-14 h-14 rounded-2xl object-cover"
                      />
                      <div>
                        <h4 className="font-serif font-bold text-stone-900 text-sm">
                          {b.serviceName}
                        </h4>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Vendor: <span className="font-semibold">{b.vendorName}</span> • Event:{' '}
                          {b.eventDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          b.status === 'accepted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : b.status === 'cancelled'
                            ? 'bg-stone-200 text-stone-700'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {b.status}
                      </span>
                      {b.status === 'pending' && (
                        <button
                          onClick={() => cancelBooking(b._id)}
                          className="px-3 py-1.5 rounded-xl border border-rose-300 text-rose-600 text-xs font-semibold hover:bg-rose-50"
                        >
                          Cancel Request
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: My Bookings (Required Full Spec) */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl font-bold text-[#152232]">
              All Submitted Bookings ({customerBookings.length})
            </h3>
            <Link
              href="/services"
              className="px-4 py-2 rounded-full bg-[#B85D43] text-white text-xs font-semibold hover:bg-[#A45741] transition-all shadow"
            >
              + Find More Vendors
            </Link>
          </div>

          {customerBookings.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-[#E8DFD3] text-center max-w-md mx-auto">
              <Calendar className="w-12 h-12 text-[#B85D43] mx-auto mb-3" />
              <h4 className="font-serif text-xl font-bold text-stone-900 mb-1">
                No Bookings Yet
              </h4>
              <p className="text-xs text-stone-500 mb-6">
                When you find a photographer, estate, or decorator you love, click &quot;Request Booking&quot; to begin.
              </p>
              <Link
                href="/services"
                className="px-6 py-2.5 rounded-full bg-[#B85D43] text-white text-xs font-semibold shadow"
              >
                Browse Services
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {customerBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white p-6 rounded-3xl border border-[#E8DFD3] shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={booking.serviceImage}
                      alt={booking.serviceName}
                      className="w-24 h-24 rounded-2xl object-cover shrink-0 border border-[#E8DFD3]"
                    />
                    <div className="space-y-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F9EAE1] text-[#944F38]">
                        {booking.serviceCategory}
                      </span>
                      <h4 className="font-serif text-lg font-bold text-[#152232]">
                        {booking.serviceName}
                      </h4>
                      <p className="text-xs text-stone-500">
                        Vendor: <span className="font-semibold text-stone-700">{booking.vendorName}</span> ({booking.vendorBusinessName || 'Wedding Specialist'})
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 pt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#B85D43]" /> Event Date: <strong className="text-stone-800">{booking.eventDate}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#B85D43]" /> {booking.eventLocation}
                        </span>
                      </div>
                      {booking.message && (
                        <p className="text-[11px] text-stone-500 italic pt-1 max-w-xl">
                          &quot;{booking.message}&quot;
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col items-end justify-between gap-3 shrink-0 border-t md:border-t-0 pt-4 md:pt-0">
                    <div className="text-right">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          booking.status === 'accepted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : booking.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : booking.status === 'cancelled'
                            ? 'bg-stone-200 text-stone-700'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        Status: {booking.status}
                      </span>
                      <p className="text-[10px] text-stone-400 mt-1">
                        Requested: {new Date(booking.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {booking.status === 'pending' && (
                      <button
                        onClick={() => cancelBooking(booking._id)}
                        className="px-4 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
                      >
                        Cancel Pending Request
                      </button>
                    )}
                    {booking.status !== 'pending' && (
                      <span className="text-[11px] text-stone-400 italic">
                        {booking.status === 'accepted' ? 'Confirmed with vendor' : 'Finalized'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Profile Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white p-8 rounded-3xl border border-[#E8DFD3] max-w-2xl shadow-sm">
          <h3 className="font-serif text-2xl font-bold text-[#152232] mb-6">
            Customer Profile Settings
          </h3>

          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Full Name / Couple Names
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#B85D43]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Contact Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#B85D43]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Wedding Vision & Bio
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your wedding date, destination, or stylistic inspirations..."
                className="w-full p-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#B85D43]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Avatar Image URL
              </label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#B85D43]/20"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isUpdating}
                className="px-6 py-2.5 rounded-xl bg-[#B85D43] text-white text-xs font-semibold hover:bg-[#A45741] transition-all shadow"
              >
                {isUpdating ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function CustomerDashboardPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-stone-500">Loading Customer Dashboard...</div>}>
      <CustomerDashboardContent />
    </Suspense>
  );
}
