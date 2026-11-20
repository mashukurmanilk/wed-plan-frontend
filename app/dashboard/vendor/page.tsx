'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useWedPlan } from '../../context/WedPlanContext';
import { ServiceCategory } from '../../types';
import {
  Sparkles,
  Layers,
  PlusCircle,
  Calendar,
  CreditCard,
  Settings,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ShieldAlert,
  ArrowRight,
  MapPin,
  DollarSign,
  AlertCircle,
} from 'lucide-react';

const CATEGORIES: ServiceCategory[] = [
  'Photography & Videography',
  'Wedding Venues',
  'Decoration & Florist',
  'Catering Services',
  'Makeup & Styling',
  'Wedding Fashion',
];

function VendorDashboardContent() {
  const {
    currentUser,
    services,
    bookings,
    createService,
    deleteService,
    toggleServiceActive,
    vendorUpdateBookingStatus,
    updateProfile,
    showToast,
  } = useWedPlan();

  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const router = useRouter();

  // Role Access Guard
  if (currentUser && currentUser.role !== 'vendor') {
    return (
      <div className="bg-white p-8 rounded-3xl border border-amber-200 text-center max-w-lg mx-auto shadow-sm">
        <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">Vendor Area Only</h3>
        <p className="text-xs text-stone-500 mb-6 leading-relaxed">
          You are currently signed in as a{' '}
          <span className="font-bold uppercase text-stone-800">{currentUser.role}</span>. Please
          navigate to your authorized dashboard.
        </p>
        <Link
          href={currentUser.role === 'admin' ? '/dashboard/admin' : '/dashboard/customer'}
          className="px-6 py-2.5 rounded-full bg-[#152232] text-white text-xs font-semibold hover:bg-stone-800"
        >
          Go to Your Dashboard
        </Link>
      </div>
    );
  }

  // Vendor Data
  const vendorServices = services.filter((s) => s.vendorId === currentUser?._id);
  const activeServices = vendorServices.filter((s) => s.isActive);
  const vendorBookings = bookings.filter((b) => b.vendorId === currentUser?._id);
  const pendingRequests = vendorBookings.filter((b) => b.status === 'pending');
  const acceptedBookings = vendorBookings.filter((b) => b.status === 'accepted');

  const isFreePlan = currentUser?.subscriptionPlan === 'free';
  const freeLimitReached = isFreePlan && activeServices.length >= 3;

  // Add Service Form State
  const [serviceName, setServiceName] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('Photography & Videography');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(1500);
  const [priceUnit, setPriceUnit] = useState('Starting Package');
  const [location, setLocation] = useState(currentUser?.location || 'New York, NY');
  const [imageUrl, setImageUrl] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');
  const [isSubmittingService, setIsSubmittingService] = useState(false);

  // Profile edit state
  const [name, setName] = useState(currentUser?.name || '');
  const [businessName, setBusinessName] = useState(currentUser?.businessName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [avatar, setAvatar] = useState(currentUser?.image || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const handleAddServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (freeLimitReached) {
      showToast(
        'Free Plan limit reached (3 active services). Please upgrade to Premium for unlimited listings!',
        'error'
      );
      router.push('/dashboard/vendor?tab=subscription');
      return;
    }

    setIsSubmittingService(true);
    const features = featuresInput
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const result = await createService({
      serviceName,
      category,
      description,
      price: Number(price),
      priceUnit,
      location,
      images: imageUrl.trim() ? [imageUrl.trim()] : [],
      features: features.length > 0 ? features : undefined,
    });
    setIsSubmittingService(false);

    if (result.success) {
      setServiceName('');
      setDescription('');
      setImageUrl('');
      setFeaturesInput('');
      router.push('/dashboard/vendor?tab=services');
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    await updateProfile({
      name,
      businessName,
      phone,
      bio,
      image: avatar,
    });
    setIsUpdatingProfile(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B85D43]">
              Vendor Management Portal
            </span>
            <span
              className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                currentUser?.subscriptionPlan === 'premium'
                  ? 'bg-[#C5A059] text-white'
                  : 'bg-stone-200 text-stone-700'
              }`}
            >
              Plan: {currentUser?.subscriptionPlan}
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#152232] mt-1">
            {currentUser?.businessName || currentUser?.name} Studio
          </h1>
        </div>

        {isFreePlan && (
          <Link
            href="/dashboard/vendor?tab=subscription"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#B85D43] to-[#944F38] text-white text-xs font-bold shadow-md hover:scale-105 transition-transform"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Upgrade to Premium ($49)</span>
          </Link>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E8DFD3] gap-6 text-sm overflow-x-auto">
        <Link
          href="/dashboard/vendor"
          className={`pb-3 font-semibold transition-colors shrink-0 relative ${
            activeTab === 'overview' ? 'text-[#B85D43]' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          Overview & Stats
          {activeTab === 'overview' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B85D43]" />
          )}
        </Link>
        <Link
          href="/dashboard/vendor?tab=services"
          className={`pb-3 font-semibold transition-colors shrink-0 relative ${
            activeTab === 'services' ? 'text-[#B85D43]' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          My Services ({vendorServices.length})
          {activeTab === 'services' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B85D43]" />
          )}
        </Link>
        <Link
          href="/dashboard/vendor?tab=add"
          className={`pb-3 font-semibold transition-colors shrink-0 relative ${
            activeTab === 'add' ? 'text-[#B85D43]' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          + Add New Service
          {activeTab === 'add' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B85D43]" />
          )}
        </Link>
        <Link
          href="/dashboard/vendor?tab=requests"
          className={`pb-3 font-semibold transition-colors shrink-0 relative ${
            activeTab === 'requests' ? 'text-[#B85D43]' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          Booking Requests ({pendingRequests.length} pending)
          {activeTab === 'requests' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B85D43]" />
          )}
        </Link>
        <Link
          href="/dashboard/vendor?tab=subscription"
          className={`pb-3 font-semibold transition-colors shrink-0 relative ${
            activeTab === 'subscription' ? 'text-[#B85D43]' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          Subscription Plans
          {activeTab === 'subscription' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B85D43]" />
          )}
        </Link>
        <Link
          href="/dashboard/vendor?tab=settings"
          className={`pb-3 font-semibold transition-colors shrink-0 relative ${
            activeTab === 'settings' ? 'text-[#B85D43]' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          Studio Profile
          {activeTab === 'settings' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B85D43]" />
          )}
        </Link>
      </div>

      {/* Free Plan Limit Notice (Assignment 9 Rule) */}
      {isFreePlan && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs text-amber-900">
            <span className="font-bold">Free Plan Limit:</span> You have published{' '}
            <strong>{activeServices.length} of 3</strong> active services. Upgrade to Premium for
            unlimited service listings, a verified Pro badge, and priority search ranking!
          </div>
          <Link
            href="/dashboard/vendor?tab=subscription"
            className="px-3 py-1 rounded-xl bg-amber-800 text-white font-bold text-xs shrink-0 hover:bg-amber-900"
          >
            Upgrade Now
          </Link>
        </div>
      )}

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* 5 Stats required by Assignment 9 */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-[#E8DFD3] shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Total Services
              </span>
              <p className="font-serif text-3xl font-bold text-[#152232] mt-2">
                {vendorServices.length}
              </p>
              <span className="text-[10px] text-stone-500 mt-1 block">Listed across catalogue</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E8DFD3] shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Active Services
              </span>
              <p className="font-serif text-3xl font-bold text-stone-800 mt-2">
                {activeServices.length}
                {isFreePlan && <span className="text-xs text-stone-400"> / 3</span>}
              </p>
              <span className="text-[10px] text-stone-500 mt-1 block">Currently visible to brides</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E8DFD3] shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
                Pending Requests
              </span>
              <p className="font-serif text-3xl font-bold text-amber-600 mt-2">
                {pendingRequests.length}
              </p>
              <span className="text-[10px] text-stone-500 mt-1 block">Requires your review</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E8DFD3] shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                Accepted Bookings
              </span>
              <p className="font-serif text-3xl font-bold text-emerald-700 mt-2">
                {acceptedBookings.length}
              </p>
              <span className="text-[10px] text-stone-500 mt-1 block">Confirmed wedding clients</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E8DFD3] shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C5A059]">
                Current Tier
              </span>
              <p className="font-serif text-2xl font-bold text-[#152232] mt-2 capitalize flex items-center gap-1.5">
                {currentUser?.subscriptionPlan}
                {currentUser?.subscriptionPlan === 'premium' && (
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                )}
              </p>
              <span className="text-[10px] text-stone-500 mt-1 block">
                {isFreePlan ? '3 Services Cap' : 'Unlimited Active'}
              </span>
            </div>
          </div>

          {/* Quick Pending Requests Action Section */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DFD3] shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#152232]">
                  Incoming Customer Booking Requests
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Accept or decline date inquiries from brides.
                </p>
              </div>
              <Link
                href="/dashboard/vendor?tab=requests"
                className="text-xs font-semibold text-[#B85D43] hover:underline"
              >
                View All Requests ({vendorBookings.length})
              </Link>
            </div>

            {pendingRequests.length === 0 ? (
              <p className="text-xs text-stone-500 italic py-4">
                No pending requests right now. When couples submit an inquiry, it will appear here.
              </p>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((req) => (
                  <div
                    key={req._id}
                    className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD3] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif font-bold text-stone-900 text-sm">
                          {req.customerName}
                        </h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold uppercase">
                          Pending
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 mt-1">
                        Service: <strong>{req.serviceName}</strong> • Date: <strong>{req.eventDate}</strong>
                      </p>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Location: {req.eventLocation} • Guests: {req.guestCount}
                      </p>
                      {req.message && (
                        <p className="text-[11px] text-stone-500 italic mt-1">&quot;{req.message}&quot;</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => vendorUpdateBookingStatus(req._id, 'accepted')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow"
                      >
                        Accept Date
                      </button>
                      <button
                        onClick={() => vendorUpdateBookingStatus(req._id, 'rejected')}
                        className="px-4 py-2 rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 font-bold text-xs transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: My Services */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#152232]">
                Your Service Listings ({vendorServices.length})
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Active services are publicly browsable once approved by administration.
              </p>
            </div>
            <Link
              href="/dashboard/vendor?tab=add"
              className="px-5 py-2.5 rounded-full bg-[#B85D43] text-white text-xs font-semibold hover:bg-[#A45741] transition-all shadow"
            >
              + Add New Service
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {vendorServices.map((service) => (
              <div
                key={service._id}
                className="bg-white p-6 rounded-3xl border border-[#E8DFD3] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={service.images[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552'}
                    alt={service.serviceName}
                    className="w-24 h-24 rounded-2xl object-cover shrink-0 border border-[#E8DFD3]"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F9EAE1] text-[#944F38]">
                        {service.category}
                      </span>
                      {/* Approval Status Badge */}
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          service.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : service.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        Moderation: {service.status}
                      </span>
                    </div>

                    <h4 className="font-serif text-lg font-bold text-[#152232]">
                      {service.serviceName}
                    </h4>
                    <p className="text-xs text-stone-500">
                      Location: {service.location} • Price: ${service.price.toLocaleString()} ({service.priceUnit})
                    </p>
                    <p className="text-xs text-stone-500 line-clamp-1 max-w-xl">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 border-t md:border-t-0 pt-4 md:pt-0">
                  {/* Availability Toggle */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-500">
                      {service.isActive ? 'Active' : 'Paused'}
                    </span>
                    <button
                      onClick={() => toggleServiceActive(service._id)}
                      className="text-stone-700 hover:text-stone-900"
                      title="Toggle availability"
                    >
                      {service.isActive ? (
                        <ToggleRight className="w-7 h-7 text-emerald-600" />
                      ) : (
                        <ToggleLeft className="w-7 h-7 text-stone-400" />
                      )}
                    </button>
                  </div>

                  {/* View Details Link */}
                  <Link
                    href={`/services/${service._id}`}
                    className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50"
                    title="View public page"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>

                  {/* Delete button */}
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete ${service.serviceName}?`)) {
                        deleteService(service._id);
                      }
                    }}
                    className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50"
                    title="Delete service"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Add Service */}
      {activeTab === 'add' && (
        <div className="bg-white p-8 rounded-3xl border border-[#E8DFD3] max-w-2xl shadow-sm">
          <h3 className="font-serif text-2xl font-bold text-[#152232] mb-1">
            Publish New Wedding Service
          </h3>
          <p className="text-xs text-stone-500 mb-6">
            All submitted services enter <strong className="text-stone-700">Pending</strong> status
            until approved by an admin.
          </p>

          <form onSubmit={handleAddServiceSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Service Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Fine Art Medium Format Film Collection"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#B85D43]/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Service Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#B85D43]/20"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Base Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Napa Valley, CA or Worldwide"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#B85D43]/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Starting Investment Price ($ USD) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#B85D43]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Package Pricing Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. Full Day Coverage, Per Guest, Weekend"
                  value={priceUnit}
                  onChange={(e) => setPriceUnit(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#B85D43]/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Service Image URL (ImgBB or CDN Hosted) *
              </label>
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#B85D43]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Detailed Service Description *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Describe your artistic approach, timeline, deliverables, and what makes your experience extraordinary..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#B85D43]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Inclusions / Package Features (one item per line)
              </label>
              <textarea
                rows={3}
                placeholder="10 Hours Continuous Coverage&#10;Two Lead Photographers&#10;Handmade Linen Heirloom Album"
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
                className="w-full p-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#B85D43]/20 font-mono text-xs"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmittingService}
                className="px-8 py-3 rounded-2xl bg-[#B85D43] text-white text-xs font-semibold hover:bg-[#A45741] transition-all shadow-md shadow-[#B85D43]/20 disabled:opacity-50"
              >
                {isSubmittingService ? 'Publishing...' : 'Submit for Admin Review'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 4: Booking Requests */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          <h3 className="font-serif text-2xl font-bold text-[#152232]">
            Client Booking Requests ({vendorBookings.length})
          </h3>

          <div className="space-y-4">
            {vendorBookings.map((b) => (
              <div
                key={b._id}
                className="bg-white p-6 rounded-3xl border border-[#E8DFD3] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
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
                    <span className="text-xs text-stone-400">
                      Submitted: {new Date(b.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="font-serif text-lg font-bold text-[#152232] mt-1">
                    Couple: {b.customerName}
                  </h4>
                  <p className="text-xs text-stone-600">
                    Service: <strong>{b.serviceName}</strong> • Date: <strong>{b.eventDate}</strong>
                  </p>
                  <p className="text-xs text-stone-500">
                    Location: {b.eventLocation} • Guests: {b.guestCount} • Email: {b.customerEmail}
                  </p>
                  {b.message && (
                    <p className="text-xs text-stone-500 italic mt-2 bg-[#FAF7F2] p-3 rounded-xl border border-[#E8DFD3]">
                      &quot;{b.message}&quot;
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {b.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => vendorUpdateBookingStatus(b._id, 'accepted')}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow"
                      >
                        Accept Date
                      </button>
                      <button
                        onClick={() => vendorUpdateBookingStatus(b._id, 'rejected')}
                        className="px-5 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold"
                      >
                        Decline
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                      Processed ({b.status})
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Subscription Plans (Stripe Checkout Trigger) */}
      {activeTab === 'subscription' && (
        <div className="space-y-8 max-w-4xl">
          <div>
            <h3 className="font-serif text-3xl font-bold text-[#152232]">
              WedPlan Vendor Subscription Plans
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Select the plan that matches your studio&apos;s growth goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free Plan Card */}
            <div
              className={`p-8 rounded-3xl border-2 bg-white flex flex-col justify-between ${
                isFreePlan ? 'border-[#B85D43]' : 'border-stone-200'
              }`}
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Starter Tier
                </span>
                <h4 className="font-serif text-2xl font-bold text-stone-900 mt-1">Free Plan</h4>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-serif text-4xl font-bold text-stone-900">$0</span>
                  <span className="text-xs text-stone-500">/ forever</span>
                </div>

                <ul className="mt-6 space-y-3 text-xs text-stone-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Maximum 3 Active Published Services</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Basic Vendor Dashboard & Analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Booking Request Management</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                {isFreePlan ? (
                  <span className="block text-center py-3 rounded-2xl bg-[#F9EAE1] text-[#944F38] font-bold text-xs">
                    Current Active Plan
                  </span>
                ) : (
                  <span className="block text-center text-xs text-stone-400">Base Plan</span>
                )}
              </div>
            </div>

            {/* Premium Plan Card */}
            <div
              className={`p-8 rounded-3xl border-2 bg-gradient-to-b from-white to-[#F9EAE1] flex flex-col justify-between relative shadow-xl ${
                !isFreePlan ? 'border-[#C5A059]' : 'border-[#B85D43]'
              }`}
            >
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#C5A059] text-white flex items-center gap-1 shadow">
                <Sparkles className="w-3 h-3" /> Recommended
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#B85D43]">
                  Unlimited Growth
                </span>
                <h4 className="font-serif text-2xl font-bold text-stone-900 mt-1">Premium Plan</h4>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-serif text-4xl font-bold text-[#152232]">$49</span>
                  <span className="text-xs text-stone-500">/ month (Stripe Test)</span>
                </div>

                <ul className="mt-6 space-y-3 text-xs text-stone-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <strong className="text-stone-900">Unlimited Active Wedding Services</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Verified Pro Luxury Badge on all listings</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Priority Placement in search & category filters</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Direct Concierge Promotion to Couples</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                {currentUser?.subscriptionPlan === 'premium' ? (
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center text-emerald-900 text-xs font-bold">
                    ✓ You are a WedPlan Premium Vendor!
                  </div>
                ) : (
                  <Link
                    href="/payment/checkout"
                    className="block text-center py-3.5 rounded-2xl bg-[#B85D43] hover:bg-[#A45741] text-white font-bold text-xs transition-all shadow-lg shadow-[#B85D43]/25"
                  >
                    Upgrade to Premium via Stripe Checkout
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Profile Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white p-8 rounded-3xl border border-[#E8DFD3] max-w-2xl shadow-sm">
          <h3 className="font-serif text-2xl font-bold text-[#152232] mb-6">
            Vendor Studio Profile Settings
          </h3>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Artisan Name
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
                Business / Studio Name
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#B85D43]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Studio Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#B85D43]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Studio Bio & Philosophy
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#B85D43]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Avatar / Studio Logo URL
              </label>
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#B85D43]/20"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="px-6 py-2.5 rounded-xl bg-[#B85D43] text-white text-xs font-semibold hover:bg-[#A45741] transition-all shadow"
              >
                {isUpdatingProfile ? 'Saving...' : 'Save Studio Profile'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function VendorDashboardPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-stone-500">Loading Vendor Dashboard...</div>}>
      <VendorDashboardContent />
    </Suspense>
  );
}
