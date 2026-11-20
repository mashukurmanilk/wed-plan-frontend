export type UserRole = 'customer' | 'vendor' | 'admin';

export type SubscriptionPlan = 'free' | 'premium';

export interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  isBlocked: boolean;
  businessName?: string;
  phone?: string;
  bio?: string;
  location?: string;
  subscriptionPlan: SubscriptionPlan;
  subscriptionExpiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ServiceCategory =
  | 'Photography & Videography'
  | 'Wedding Venues'
  | 'Decoration & Florist'
  | 'Catering Services'
  | 'Makeup & Styling'
  | 'Wedding Fashion';

export type ServiceStatus = 'pending' | 'approved' | 'rejected';

export interface Service {
  _id: string;
  vendorId: string;
  vendorName: string;
  vendorBusinessName?: string;
  vendorAvatar?: string;
  vendorRating?: number;
  vendorReviewCount?: number;
  serviceName: string;
  category: ServiceCategory;
  description: string;
  price: number;
  priceUnit?: string; // e.g. "per event", "per day", "per guest"
  location: string;
  images: string[];
  features?: string[];
  status: ServiceStatus;
  isActive: boolean;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';

export interface Booking {
  _id: string;
  serviceId: string;
  serviceName: string;
  serviceImage: string;
  serviceCategory: ServiceCategory;
  vendorId: string;
  vendorName: string;
  vendorBusinessName?: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  eventDate: string;
  eventLocation: string;
  estimatedPrice: number;
  guestCount?: number;
  message?: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export type TransactionStatus = 'pending' | 'succeeded' | 'failed';

export interface Transaction {
  _id: string;
  vendorId: string;
  vendorName: string;
  vendorEmail: string;
  plan: 'premium';
  amount: number;
  currency: string;
  stripeSessionId: string;
  stripeSubscriptionId?: string;
  status: TransactionStatus;
  createdAt: string;
  updatedAt: string;
}
