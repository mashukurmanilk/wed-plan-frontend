'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Service, Booking, Transaction, UserRole, ServiceCategory } from '../types';
import { INITIAL_USERS, INITIAL_SERVICES, INITIAL_BOOKINGS, INITIAL_TRANSACTIONS } from '../data/mockData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface WedPlanContextType {
  currentUser: User | null;
  users: User[];
  services: Service[];
  bookings: Booking[];
  transactions: Transaction[];
  toasts: ToastMessage[];
  isLoading: boolean;
  
  // Auth
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: (roleKey: 'customer' | 'vendor_free' | 'vendor_premium' | 'admin') => void;
  register: (data: {
    name: string;
    email: string;
    password?: string;
    role: 'customer' | 'vendor';
    businessName?: string;
    image?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;

  // Services
  getServiceById: (id: string) => Service | undefined;
  createService: (data: {
    serviceName: string;
    category: ServiceCategory;
    description: string;
    price: number;
    priceUnit?: string;
    location: string;
    images: string[];
    features?: string[];
  }) => Promise<{ success: boolean; error?: string; service?: Service }>;
  updateService: (id: string, data: Partial<Service>) => Promise<{ success: boolean; error?: string }>;
  deleteService: (id: string) => Promise<{ success: boolean; error?: string }>;
  toggleServiceActive: (id: string) => Promise<{ success: boolean; error?: string }>;
  
  // Admin Service Actions
  adminApproveService: (id: string) => Promise<void>;
  adminRejectService: (id: string) => Promise<void>;
  adminDeleteService: (id: string) => Promise<void>;
  
  // Admin User Actions
  adminToggleUserBlock: (userId: string) => Promise<void>;

  // Bookings
  createBooking: (data: {
    serviceId: string;
    eventDate: string;
    eventLocation: string;
    guestCount?: number;
    message?: string;
  }) => Promise<{ success: boolean; error?: string; booking?: Booking }>;
  cancelBooking: (bookingId: string) => Promise<{ success: boolean; error?: string }>;
  vendorUpdateBookingStatus: (bookingId: string, status: 'accepted' | 'rejected') => Promise<{ success: boolean; error?: string }>;

  // Stripe & Subscriptions
  upgradeToPremium: (vendorId: string, stripeSessionId?: string) => Promise<{ success: boolean; error?: string }>;

  // Toast
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const WedPlanContext = createContext<WedPlanContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'wedplan_user_session',
  USERS: 'wedplan_users_data',
  SERVICES: 'wedplan_services_data',
  BOOKINGS: 'wedplan_bookings_data',
  TRANSACTIONS: 'wedplan_transactions_data',
};

export const WedPlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize and load from localStorage
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      const storedServices = localStorage.getItem(STORAGE_KEYS.SERVICES);
      const storedBookings = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      const storedTransactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      } else {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      }

      if (storedServices) {
        setServices(JSON.parse(storedServices));
      } else {
        localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
      }

      if (storedBookings) {
        setBookings(JSON.parse(storedBookings));
      } else {
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
      }

      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      } else {
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
      }

      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        // Find freshest version from users
        const allUsers = storedUsers ? JSON.parse(storedUsers) : INITIAL_USERS;
        const fresh = allUsers.find((u: User) => u._id === parsed._id) || parsed;
        setCurrentUser(fresh);
      } else {
        // Default to Customer Demo for seamless instant browsing
        const defaultUser = INITIAL_USERS[0];
        setCurrentUser(defaultUser);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(defaultUser));
      }
    } catch (e) {
      console.error('Error hydrating localStorage:', e);
      setCurrentUser(INITIAL_USERS[0]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const persistUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(newUsers));
  };

  const persistServices = (newServices: Service[]) => {
    setServices(newServices);
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(newServices));
  };

  const persistBookings = (newBookings: Booking[]) => {
    setBookings(newBookings);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(newBookings));
  };

  const persistTransactions = (newTransactions: Transaction[]) => {
    setTransactions(newTransactions);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(newTransactions));
  };

  const persistCurrentUser = (user: User | null) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  };

  // Auth Operations
  const login = async (email: string, password?: string) => {
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      showToast('No account found with this email.', 'error');
      return { success: false, error: 'No account found with this email.' };
    }
    if (user.isBlocked) {
      showToast('Your account is blocked. Please contact support.', 'error');
      return { success: false, error: 'Account is blocked by administrator.' };
    }
    persistCurrentUser(user);
    showToast(`Welcome back, ${user.name}!`, 'success');
    return { success: true };
  };

  const loginAsDemo = (roleKey: 'customer' | 'vendor_free' | 'vendor_premium' | 'admin') => {
    let targetUser: User | undefined;
    switch (roleKey) {
      case 'customer':
        targetUser = users.find((u) => u._id === 'usr_customer_1') || INITIAL_USERS[0];
        break;
      case 'vendor_free':
        targetUser = users.find((u) => u._id === 'usr_vendor_free_1') || INITIAL_USERS[1];
        break;
      case 'vendor_premium':
        targetUser = users.find((u) => u._id === 'usr_vendor_premium_1') || INITIAL_USERS[2];
        break;
      case 'admin':
        targetUser = users.find((u) => u._id === 'usr_admin_1') || INITIAL_USERS[3];
        break;
    }
    if (targetUser) {
      persistCurrentUser(targetUser);
      showToast(`Switched account to ${targetUser.name} (${targetUser.role.toUpperCase()})`, 'info');
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password?: string;
    role: 'customer' | 'vendor';
    businessName?: string;
    image?: string;
  }) => {
    // Validate password
    if (data.password) {
      if (data.password.length < 6) {
        showToast('Password must be at least 6 characters.', 'error');
        return { success: false, error: 'Password must be at least 6 characters.' };
      }
      if (!/[A-Z]/.test(data.password) || !/[a-z]/.test(data.password)) {
        showToast('Password must contain at least one uppercase and one lowercase letter.', 'error');
        return { success: false, error: 'Password must contain uppercase and lowercase letters.' };
      }
    }

    const existing = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      showToast('An account with this email already exists.', 'error');
      return { success: false, error: 'Email already registered.' };
    }

    const newUser: User = {
      _id: `usr_${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      isBlocked: false,
      businessName: data.businessName,
      image: data.image || (data.role === 'vendor'
        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80'),
      subscriptionPlan: 'free',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    persistUsers(updatedUsers);
    persistCurrentUser(newUser);
    showToast(`Account successfully created! Welcome to WedPlan, ${newUser.name}.`, 'success');
    return { success: true };
  };

  const logout = () => {
    persistCurrentUser(null);
    showToast('Signed out successfully.', 'info');
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!currentUser) return { success: false, error: 'Not authenticated' };

    // Prevent security violation: cannot self-update role or subscriptionPlan
    const safeData = { ...data };
    delete safeData.role;
    delete safeData.subscriptionPlan;
    delete safeData.subscriptionExpiresAt;
    delete safeData.isBlocked;

    const updatedUser: User = {
      ...currentUser,
      ...safeData,
      updatedAt: new Date().toISOString(),
    };

    const newUsers = users.map((u) => (u._id === currentUser._id ? updatedUser : u));
    persistUsers(newUsers);
    persistCurrentUser(updatedUser);
    showToast('Profile updated successfully!', 'success');
    return { success: true };
  };

  // Services Operations
  const getServiceById = (id: string) => {
    return services.find((s) => s._id === id);
  };

  const createService = async (data: {
    serviceName: string;
    category: ServiceCategory;
    description: string;
    price: number;
    priceUnit?: string;
    location: string;
    images: string[];
    features?: string[];
  }) => {
    if (!currentUser) {
      showToast('You must be signed in to add a service.', 'error');
      return { success: false, error: 'Authentication required' };
    }
    if (currentUser.role !== 'vendor') {
      showToast('Only vendors can publish wedding services.', 'error');
      return { success: false, error: 'Vendor permission required' };
    }
    if (currentUser.isBlocked) {
      showToast('Your account is blocked from creating services.', 'error');
      return { success: false, error: 'Account blocked' };
    }

    // Free vendor limit check: Max 3 active services
    if (currentUser.subscriptionPlan === 'free') {
      const activeCount = services.filter(
        (s) => s.vendorId === currentUser._id && s.isActive
      ).length;

      if (activeCount >= 3) {
        showToast(
          'Free tier vendors can publish a maximum of 3 active services. Upgrade to Premium for unlimited listings!',
          'error'
        );
        return {
          success: false,
          error: 'Free plan limit reached (maximum 3 active services). Please upgrade to Premium.',
        };
      }
    }

    const newService: Service = {
      _id: `srv_${Date.now()}`,
      vendorId: currentUser._id,
      vendorName: currentUser.name,
      vendorBusinessName: currentUser.businessName || currentUser.name,
      vendorAvatar: currentUser.image,
      vendorRating: 5.0,
      vendorReviewCount: 1,
      serviceName: data.serviceName,
      category: data.category,
      description: data.description,
      price: data.price,
      priceUnit: data.priceUnit || 'Starting Package',
      location: data.location,
      images: data.images.length > 0 ? data.images : [
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'
      ],
      features: data.features || ['Premium Customer Consultation', 'Dedicated Service Coordinator'],
      status: 'pending', // Default status: Pending (until approved by admin)
      isActive: true,
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newService, ...services];
    persistServices(updated);
    showToast('Service submitted successfully! It is now pending admin approval.', 'success');
    return { success: true, service: newService };
  };

  const updateService = async (id: string, data: Partial<Service>) => {
    if (!currentUser) return { success: false, error: 'Authentication required' };

    const service = services.find((s) => s._id === id);
    if (!service) return { success: false, error: 'Service not found' };

    // Ownership check
    if (service.vendorId !== currentUser._id && currentUser.role !== 'admin') {
      showToast('You do not have permission to edit this service.', 'error');
      return { success: false, error: 'Permission denied' };
    }

    const updated = services.map((s) =>
      s._id === id
        ? {
            ...s,
            ...data,
            updatedAt: new Date().toISOString(),
          }
        : s
    );
    persistServices(updated);
    showToast('Service updated successfully!', 'success');
    return { success: true };
  };

  const deleteService = async (id: string) => {
    if (!currentUser) return { success: false, error: 'Authentication required' };

    const service = services.find((s) => s._id === id);
    if (!service) return { success: false, error: 'Service not found' };

    if (service.vendorId !== currentUser._id && currentUser.role !== 'admin') {
      showToast('You do not have permission to delete this service.', 'error');
      return { success: false, error: 'Permission denied' };
    }

    const filtered = services.filter((s) => s._id !== id);
    persistServices(filtered);
    showToast('Service removed successfully.', 'info');
    return { success: true };
  };

  const toggleServiceActive = async (id: string) => {
    if (!currentUser) return { success: false, error: 'Authentication required' };

    const service = services.find((s) => s._id === id);
    if (!service) return { success: false, error: 'Service not found' };

    if (service.vendorId !== currentUser._id && currentUser.role !== 'admin') {
      return { success: false, error: 'Permission denied' };
    }

    // If activating, verify 3 service limit for free plan
    if (!service.isActive && currentUser.subscriptionPlan === 'free') {
      const activeCount = services.filter(
        (s) => s.vendorId === currentUser._id && s.isActive
      ).length;
      if (activeCount >= 3) {
        showToast('Cannot activate: Free plan limit is 3 active services. Upgrade to Premium!', 'error');
        return { success: false, error: 'Free plan limit reached' };
      }
    }

    const updated = services.map((s) =>
      s._id === id ? { ...s, isActive: !s.isActive, updatedAt: new Date().toISOString() } : s
    );
    persistServices(updated);
    showToast(`Service ${!service.isActive ? 'activated' : 'paused'}.`, 'info');
    return { success: true };
  };

  // Admin moderation
  const adminApproveService = async (id: string) => {
    if (currentUser?.role !== 'admin') return;
    const updated = services.map((s) =>
      s._id === id ? { ...s, status: 'approved' as const, updatedAt: new Date().toISOString() } : s
    );
    persistServices(updated);
    showToast('Service approved and published to marketplace.', 'success');
  };

  const adminRejectService = async (id: string) => {
    if (currentUser?.role !== 'admin') return;
    const updated = services.map((s) =>
      s._id === id ? { ...s, status: 'rejected' as const, updatedAt: new Date().toISOString() } : s
    );
    persistServices(updated);
    showToast('Service marked as rejected.', 'info');
  };

  const adminDeleteService = async (id: string) => {
    if (currentUser?.role !== 'admin') return;
    const filtered = services.filter((s) => s._id !== id);
    persistServices(filtered);
    showToast('Inappropriate service permanently deleted by Admin.', 'info');
  };

  const adminToggleUserBlock = async (userId: string) => {
    if (currentUser?.role !== 'admin') return;
    const user = users.find((u) => u._id === userId);
    if (!user) return;

    const newBlocked = !user.isBlocked;
    const updated = users.map((u) =>
      u._id === userId ? { ...u, isBlocked: newBlocked, updatedAt: new Date().toISOString() } : u
    );
    persistUsers(updated);

    if (currentUser._id === userId) {
      persistCurrentUser({ ...currentUser, isBlocked: newBlocked });
    }
    showToast(`User ${user.name} has been ${newBlocked ? 'blocked' : 'unblocked'}.`, 'info');
  };

  // Bookings Operations
  const createBooking = async (data: {
    serviceId: string;
    eventDate: string;
    eventLocation: string;
    guestCount?: number;
    message?: string;
  }) => {
    if (!currentUser) {
      showToast('Please sign in to request a booking.', 'error');
      return { success: false, error: 'Authentication required' };
    }
    if (currentUser.role !== 'customer') {
      showToast('Only couples / customers can book wedding services.', 'error');
      return { success: false, error: 'Only customers can book wedding services.' };
    }
    if (currentUser.isBlocked) {
      showToast('Your account is blocked from creating bookings.', 'error');
      return { success: false, error: 'Account blocked' };
    }

    const service = services.find((s) => s._id === data.serviceId);
    if (!service) {
      showToast('Selected service was not found.', 'error');
      return { success: false, error: 'Service not found' };
    }

    // Rule: Cannot book own service
    if (service.vendorId === currentUser._id) {
      showToast('You cannot book your own service listing.', 'error');
      return { success: false, error: 'Vendors cannot book their own services.' };
    }

    // Rule: Prevent duplicate active booking request for same service and event date
    const duplicate = bookings.find(
      (b) =>
        b.serviceId === data.serviceId &&
        b.eventDate === data.eventDate &&
        (b.status === 'pending' || b.status === 'accepted')
    );
    if (duplicate) {
      showToast(
        'An active booking already exists for this service on this date. Please choose another date.',
        'error'
      );
      return { success: false, error: 'Duplicate booking on selected date.' };
    }

    const newBooking: Booking = {
      _id: `bkg_${Date.now()}`,
      serviceId: service._id,
      serviceName: service.serviceName,
      serviceImage: service.images[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552',
      serviceCategory: service.category,
      vendorId: service.vendorId,
      vendorName: service.vendorName,
      vendorBusinessName: service.vendorBusinessName,
      customerId: currentUser._id,
      customerName: currentUser.name,
      customerEmail: currentUser.email,
      customerPhone: currentUser.phone || '',
      eventDate: data.eventDate,
      eventLocation: data.eventLocation,
      estimatedPrice: service.price,
      guestCount: data.guestCount || 100,
      message: data.message || 'We look forward to coordinating with you!',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedBookings = [newBooking, ...bookings];
    persistBookings(updatedBookings);
    showToast('Booking request sent successfully to vendor!', 'success');
    return { success: true, booking: newBooking };
  };

  const cancelBooking = async (bookingId: string) => {
    if (!currentUser) return { success: false, error: 'Authentication required' };

    const booking = bookings.find((b) => b._id === bookingId);
    if (!booking) return { success: false, error: 'Booking not found' };

    if (booking.customerId !== currentUser._id) {
      showToast('You do not own this booking request.', 'error');
      return { success: false, error: 'Unauthorized' };
    }

    if (booking.status !== 'pending') {
      showToast(`Cannot cancel a booking that is already ${booking.status}.`, 'error');
      return { success: false, error: 'Only pending requests can be cancelled.' };
    }

    const updated = bookings.map((b) =>
      b._id === bookingId
        ? { ...b, status: 'cancelled' as const, updatedAt: new Date().toISOString() }
        : b
    );
    persistBookings(updated);
    showToast('Booking request was cancelled.', 'info');
    return { success: true };
  };

  const vendorUpdateBookingStatus = async (
    bookingId: string,
    newStatus: 'accepted' | 'rejected'
  ) => {
    if (!currentUser) return { success: false, error: 'Authentication required' };

    const booking = bookings.find((b) => b._id === bookingId);
    if (!booking) return { success: false, error: 'Booking not found' };

    if (booking.vendorId !== currentUser._id && currentUser.role !== 'admin') {
      showToast('You are not authorized to moderate this booking.', 'error');
      return { success: false, error: 'Unauthorized' };
    }

    if (booking.status !== 'pending') {
      showToast(`This booking has already been ${booking.status}. Decision is immutable.`, 'error');
      return { success: false, error: 'Booking decision already finalized.' };
    }

    const updated = bookings.map((b) =>
      b._id === bookingId
        ? { ...b, status: newStatus, updatedAt: new Date().toISOString() }
        : b
    );
    persistBookings(updated);
    showToast(`Booking request ${newStatus === 'accepted' ? 'accepted 🎉' : 'rejected'}.`, 'success');
    return { success: true };
  };

  // Stripe & Subscriptions
  const upgradeToPremium = async (vendorId: string, stripeSessionId = `cs_test_${Date.now()}`) => {
    const vendor = users.find((u) => u._id === vendorId);
    if (!vendor) return { success: false, error: 'Vendor not found' };

    const transaction: Transaction = {
      _id: `txn_${Date.now()}`,
      vendorId: vendor._id,
      vendorName: vendor.name,
      vendorEmail: vendor.email,
      plan: 'premium',
      amount: 49.0,
      currency: 'usd',
      stripeSessionId,
      stripeSubscriptionId: `sub_stripe_${Date.now()}`,
      status: 'succeeded',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newTransactions = [transaction, ...transactions];
    persistTransactions(newTransactions);

    // Update vendor subscription plan
    const updatedUsers = users.map((u) =>
      u._id === vendorId
        ? {
            ...u,
            subscriptionPlan: 'premium' as const,
            subscriptionExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString(),
          }
        : u
    );
    persistUsers(updatedUsers);

    if (currentUser?._id === vendorId) {
      persistCurrentUser({
        ...currentUser,
        subscriptionPlan: 'premium',
        subscriptionExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    showToast('Congratulations! Upgraded to WedPlan Premium Vendor.', 'success');
    return { success: true };
  };

  return (
    <WedPlanContext.Provider
      value={{
        currentUser,
        users,
        services,
        bookings,
        transactions,
        toasts,
        isLoading,
        login,
        loginAsDemo,
        register,
        logout,
        updateProfile,
        getServiceById,
        createService,
        updateService,
        deleteService,
        toggleServiceActive,
        adminApproveService,
        adminRejectService,
        adminDeleteService,
        adminToggleUserBlock,
        createBooking,
        cancelBooking,
        vendorUpdateBookingStatus,
        upgradeToPremium,
        showToast,
        removeToast,
      }}
    >
      {children}
    </WedPlanContext.Provider>
  );
};

export const useWedPlan = () => {
  const context = useContext(WedPlanContext);
  if (!context) {
    throw new Error('useWedPlan must be used within a WedPlanProvider');
  }
  return context;
};
