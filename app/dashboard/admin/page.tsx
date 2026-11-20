'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useWedPlan } from '../../context/WedPlanContext';
import {
  Users,
  Store,
  Heart,
  Layers,
  Clock,
  Receipt,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Trash2,
  Ban,
  Shield,
  ShieldAlert,
  ArrowRight,
  Eye,
} from 'lucide-react';

function AdminDashboardContent() {
  const {
    currentUser,
    users,
    services,
    transactions,
    adminApproveService,
    adminRejectService,
    adminDeleteService,
    adminToggleUserBlock,
  } = useWedPlan();

  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const router = useRouter();

  // Role Access Guard (Only Admin allowed)
  if (currentUser && currentUser.role !== 'admin') {
    return (
      <div className="bg-white p-8 rounded-3xl border border-rose-200 text-center max-w-lg mx-auto shadow-sm">
        <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">
          Administrator Access Required
        </h3>
        <p className="text-xs text-stone-500 mb-6 leading-relaxed">
          You are signed in as a <span className="font-bold uppercase text-stone-800">{currentUser.role}</span>.
          Admin features and platform controls are restricted. Switch to the Admin account using the demo bar above to test.
        </p>
        <Link
          href={currentUser.role === 'vendor' ? '/dashboard/vendor' : '/dashboard/customer'}
          className="px-6 py-2.5 rounded-full bg-[#152232] text-white text-xs font-semibold hover:bg-stone-800"
        >
          Return to Your Dashboard
        </Link>
      </div>
    );
  }

  // Admin Stats
  const totalUsers = users.length;
  const totalVendors = users.filter((u) => u.role === 'vendor').length;
  const totalCustomers = users.filter((u) => u.role === 'customer').length;
  const totalServices = services.length;
  const pendingServices = services.filter((s) => s.status === 'pending');
  const totalTransactions = transactions.length;

  // Manage Users Filtering
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');

  const filteredUsers = users.filter((u) => {
    if (userSearch.trim()) {
      const q = userSearch.toLowerCase();
      if (!u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
    }
    if (userRoleFilter !== 'All' && u.role !== userRoleFilter) return false;
    return true;
  });

  // Manage Services Filtering
  const [serviceSearch, setServiceSearch] = useState('');
  const [serviceStatusFilter, setServiceStatusFilter] = useState('All');

  const filteredServices = services.filter((s) => {
    if (serviceSearch.trim()) {
      const q = serviceSearch.toLowerCase();
      if (!s.serviceName.toLowerCase().includes(q) && !s.vendorName.toLowerCase().includes(q))
        return false;
    }
    if (serviceStatusFilter !== 'All' && s.status !== serviceStatusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#B85D43]">
          Platform Administration
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#152232] mt-1">
          WedPlan System Console
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Supervise user permissions, moderate wedding service submissions, and audit financial transactions.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E8DFD3] gap-6 text-sm overflow-x-auto">
        <Link
          href="/dashboard/admin"
          className={`pb-3 font-semibold transition-colors shrink-0 relative ${
            activeTab === 'overview' ? 'text-[#B85D43]' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          Overview Stats
          {activeTab === 'overview' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B85D43]" />
          )}
        </Link>
        <Link
          href="/dashboard/admin?tab=users"
          className={`pb-3 font-semibold transition-colors shrink-0 relative ${
            activeTab === 'users' ? 'text-[#B85D43]' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          Manage Users ({totalUsers})
          {activeTab === 'users' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B85D43]" />
          )}
        </Link>
        <Link
          href="/dashboard/admin?tab=services"
          className={`pb-3 font-semibold transition-colors shrink-0 relative ${
            activeTab === 'services' ? 'text-[#B85D43]' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          Manage Services ({pendingServices.length} pending)
          {activeTab === 'services' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B85D43]" />
          )}
        </Link>
        <Link
          href="/dashboard/admin?tab=transactions"
          className={`pb-3 font-semibold transition-colors shrink-0 relative ${
            activeTab === 'transactions' ? 'text-[#B85D43]' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          Platform Transactions ({totalTransactions})
          {activeTab === 'transactions' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B85D43]" />
          )}
        </Link>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* 6 Stats Required by Assignment 9 */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-[#E8DFD3] shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Registered Users
              </span>
              <p className="font-serif text-3xl font-bold text-[#152232] mt-2">{totalUsers}</p>
              <span className="text-[10px] text-stone-500 mt-1 block">Platform accounts</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E8DFD3] shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Total Vendors
              </span>
              <p className="font-serif text-3xl font-bold text-[#152232] mt-2">{totalVendors}</p>
              <span className="text-[10px] text-stone-500 mt-1 block">Active service providers</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E8DFD3] shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Total Customers
              </span>
              <p className="font-serif text-3xl font-bold text-[#152232] mt-2">{totalCustomers}</p>
              <span className="text-[10px] text-stone-500 mt-1 block">Brides & couples</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E8DFD3] shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Total Services
              </span>
              <p className="font-serif text-3xl font-bold text-[#152232] mt-2">{totalServices}</p>
              <span className="text-[10px] text-stone-500 mt-1 block">Published listings</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E8DFD3] shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                Pending Services
              </span>
              <p className="font-serif text-3xl font-bold text-amber-600 mt-2">
                {pendingServices.length}
              </p>
              <span className="text-[10px] text-stone-500 mt-1 block">Awaiting approval</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E8DFD3] shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                Total Transactions
              </span>
              <p className="font-serif text-3xl font-bold text-emerald-700 mt-2">
                {totalTransactions}
              </p>
              <span className="text-[10px] text-stone-500 mt-1 block">Stripe premium billing</span>
            </div>
          </div>

          {/* Pending Services Moderation Queue */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DFD3] shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#152232]">
                  Services Awaiting Moderation Approval
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Review new wedding listings before they become publicly visible on Browse Services.
                </p>
              </div>
              <Link
                href="/dashboard/admin?tab=services"
                className="text-xs font-semibold text-[#B85D43] hover:underline"
              >
                View All Services
              </Link>
            </div>

            {pendingServices.length === 0 ? (
              <p className="text-xs text-stone-500 italic py-4">
                All submitted services are reviewed! No pending items in the queue.
              </p>
            ) : (
              <div className="space-y-4">
                {pendingServices.map((service) => (
                  <div
                    key={service._id}
                    className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD3] flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={service.images[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552'}
                        alt={service.serviceName}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F9EAE1] text-[#944F38]">
                            {service.category}
                          </span>
                          <span className="text-xs font-bold text-stone-800">
                            ${service.price.toLocaleString()} ({service.priceUnit})
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-stone-900 text-sm mt-1">
                          {service.serviceName}
                        </h4>
                        <p className="text-xs text-stone-500">
                          Vendor: <strong>{service.vendorName}</strong> ({service.vendorBusinessName || 'Vendor'}) • Location: {service.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => adminApproveService(service._id)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow"
                      >
                        Approve Service
                      </button>
                      <button
                        onClick={() => adminRejectService(service._id)}
                        className="px-4 py-2 rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-bold"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Manage Users */}
      {activeTab === 'users' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DFD3] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#152232]">
                Registered User Directory ({filteredUsers.length})
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Block or unblock user accounts to restrict platform actions.
              </p>
            </div>

            {/* User Search & Filter */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-stone-300 text-xs focus:outline-none"
                />
              </div>

              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-medium"
              >
                <option value="All">All Roles</option>
                <option value="customer">Customer</option>
                <option value="vendor">Vendor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8DFD3] text-stone-400 uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Plan</th>
                  <th className="py-3 px-4">Joined</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-stone-50">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#B85D43] text-white flex items-center justify-center font-bold">
                            {user.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-stone-900">{user.name}</p>
                          <p className="text-[11px] text-stone-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 uppercase font-bold text-stone-700">
                      <span className="px-2 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E8DFD3]">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                          user.isBlocked
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 capitalize text-stone-600">
                      {user.subscriptionPlan}
                    </td>
                    <td className="py-3.5 px-4 text-stone-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => adminToggleUserBlock(user._id)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                          user.isBlocked
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'border border-rose-300 text-rose-600 hover:bg-rose-50'
                        }`}
                      >
                        {user.isBlocked ? 'Unblock User' : 'Block User'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Manage Services */}
      {activeTab === 'services' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DFD3] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#152232]">
                Moderation Catalogue ({filteredServices.length})
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Approve, reject, or permanently delete platform services.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                placeholder="Search services..."
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs focus:outline-none"
              />

              <select
                value={serviceStatusFilter}
                onChange={(e) => setServiceStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-medium"
              >
                <option value="All">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredServices.map((srv) => (
              <div
                key={srv._id}
                className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD3] flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={srv.images[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552'}
                    alt={srv.serviceName}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F9EAE1] text-[#944F38]">
                        {srv.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          srv.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : srv.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        Status: {srv.status}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-stone-900 text-base mt-1">
                      {srv.serviceName}
                    </h4>
                    <p className="text-xs text-stone-500">
                      Vendor: <strong>{srv.vendorName}</strong> • Price: ${srv.price.toLocaleString()} ({srv.priceUnit}) • Location: {srv.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {srv.status !== 'approved' && (
                    <button
                      onClick={() => adminApproveService(srv._id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow"
                    >
                      Approve
                    </button>
                  )}
                  {srv.status !== 'rejected' && (
                    <button
                      onClick={() => adminRejectService(srv._id)}
                      className="px-3 py-1.5 rounded-xl border border-amber-300 text-amber-800 hover:bg-amber-50 text-xs font-bold"
                    >
                      Reject
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (confirm(`Permanently delete service ${srv.serviceName}?`)) {
                        adminDeleteService(srv._id);
                      }
                    }}
                    className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50"
                    title="Delete Inappropriate Service"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Platform Transactions (Stripe Audit Log) */}
      {activeTab === 'transactions' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DFD3] shadow-sm space-y-6">
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#152232]">
              Stripe Subscription Transactions Audit Log ({transactions.length})
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Verified webhook payment records. Immutable financial audit log.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8DFD3] text-stone-400 uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Vendor Info</th>
                  <th className="py-3 px-4">Subscription Plan</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Stripe Session</th>
                  <th className="py-3 px-4">Payment Status</th>
                  <th className="py-3 px-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-stone-50">
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-700">{tx._id}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-stone-900">{tx.vendorName}</p>
                      <p className="text-[11px] text-stone-400">{tx.vendorEmail}</p>
                    </td>
                    <td className="py-3.5 px-4 uppercase font-bold text-purple-700">{tx.plan}</td>
                    <td className="py-3.5 px-4 font-bold text-stone-900">
                      ${tx.amount.toFixed(2)} {tx.currency.toUpperCase()}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-stone-500 truncate max-w-[150px]">
                      {tx.stripeSessionId}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          tx.status === 'succeeded'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-stone-500">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-stone-500">Loading Admin Console...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}
