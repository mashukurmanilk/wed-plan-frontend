import { Service, Booking, User, Transaction, ServiceCategory } from '../types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}: ${response.statusText}`;
    try {
      const errorJson = await response.json();
      if (errorJson && (errorJson.message || errorJson.error)) {
        errorMsg = errorJson.message || errorJson.error;
      }
    } catch {
      // ignore json parse error
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  // Health
  async health(): Promise<{ status: string; database: string }> {
    return request('/health');
  },

  // Seed
  async seedDatabase(force = false): Promise<{ message: string; stats?: Record<string, number> }> {
    return request(`/seed?force=${force}`, {
      method: 'POST',
    });
  },

  // Services
  async getServices(params?: {
    category?: string;
    status?: string;
    isActive?: boolean;
    vendorId?: string;
    search?: string;
    featured?: boolean;
    limit?: number;
  }): Promise<Service[]> {
    const searchParams = new URLSearchParams();
    if (params) {
      if (params.category && params.category !== 'All') searchParams.set('category', params.category);
      if (params.status) searchParams.set('status', params.status);
      if (params.isActive !== undefined) searchParams.set('isActive', String(params.isActive));
      if (params.vendorId) searchParams.set('vendorId', params.vendorId);
      if (params.search) searchParams.set('search', params.search);
      if (params.featured !== undefined) searchParams.set('featured', String(params.featured));
      if (params.limit) searchParams.set('limit', String(params.limit));
    }
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return request<Service[]>(`/services${query}`);
  },

  async getServiceById(id: string): Promise<Service> {
    return request<Service>(`/services/${id}`);
  },

  async createService(data: {
    serviceName: string;
    vendorId: string;
    vendorName?: string;
    vendorBusinessName?: string;
    vendorAvatar?: string;
    vendorRating?: number;
    vendorReviewCount?: number;
    category: ServiceCategory;
    description: string;
    price: number;
    priceUnit?: string;
    location: string;
    images: string[];
    features?: string[];
  }): Promise<Service> {
    return request<Service>('/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateService(id: string, data: Partial<Service>): Promise<Service> {
    return request<Service>(`/services/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteService(id: string): Promise<{ message: string; id: string }> {
    return request(`/services/${id}`, {
      method: 'DELETE',
    });
  },

  async toggleServiceActive(id: string): Promise<Service> {
    return request<Service>(`/services/${id}/toggle-active`, {
      method: 'PATCH',
    });
  },

  async updateServiceStatus(id: string, status: 'approved' | 'rejected' | 'pending'): Promise<Service> {
    return request<Service>(`/services/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Bookings
  async getBookings(params?: {
    customerId?: string;
    vendorId?: string;
    serviceId?: string;
    status?: string;
  }): Promise<Booking[]> {
    const searchParams = new URLSearchParams();
    if (params) {
      if (params.customerId) searchParams.set('customerId', params.customerId);
      if (params.vendorId) searchParams.set('vendorId', params.vendorId);
      if (params.serviceId) searchParams.set('serviceId', params.serviceId);
      if (params.status) searchParams.set('status', params.status);
    }
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return request<Booking[]>(`/bookings${query}`);
  },

  async getBookingById(id: string): Promise<Booking> {
    return request<Booking>(`/bookings/${id}`);
  },

  async createBooking(data: {
    serviceId: string;
    customerId: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    eventDate: string;
    eventLocation: string;
    guestCount?: number;
    message?: string;
  }): Promise<Booking> {
    return request<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateBookingStatus(
    id: string,
    status: 'accepted' | 'rejected'
  ): Promise<Booking> {
    return request<Booking>(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  async cancelBooking(id: string): Promise<Booking> {
    return request<Booking>(`/bookings/${id}/cancel`, {
      method: 'PATCH',
    });
  },

  async deleteBooking(id: string): Promise<{ message: string; id: string }> {
    return request(`/bookings/${id}`, {
      method: 'DELETE',
    });
  },

  // Users
  async getUsers(params?: { role?: string; search?: string }): Promise<User[]> {
    const searchParams = new URLSearchParams();
    if (params) {
      if (params.role) searchParams.set('role', params.role);
      if (params.search) searchParams.set('search', params.search);
    }
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return request<User[]>(`/users${query}`);
  },

  async getUserById(id: string): Promise<User> {
    return request<User>(`/users/${id}`);
  },

  async syncUser(user: Partial<User>): Promise<User> {
    return request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  },

  async updateProfile(id: string, data: Partial<User>): Promise<User> {
    return request<User>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async toggleUserBlock(id: string): Promise<User> {
    return request<User>(`/users/${id}/block`, {
      method: 'PATCH',
    });
  },

  // Transactions & Subscriptions
  async getTransactions(params?: { vendorId?: string }): Promise<Transaction[]> {
    const searchParams = new URLSearchParams();
    if (params?.vendorId) searchParams.set('vendorId', params.vendorId);
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return request<Transaction[]>(`/transactions${query}`);
  },

  async createTransaction(data: Partial<Transaction>): Promise<Transaction> {
    return request<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async upgradeToPremium(
    vendorId: string,
    stripeSessionId?: string
  ): Promise<{ success: boolean; vendor: User; transaction: Transaction }> {
    return request('/transactions/upgrade', {
      method: 'POST',
      body: JSON.stringify({ vendorId, stripeSessionId }),
    });
  },
};
