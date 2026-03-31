// src/types/index.ts
export type UserRole       = "CUSTOMER" | "ADMIN" | "SUPER_ADMIN";
export type InquiryStatus  = "NEW" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface AuthUser {
  id: string; email: string; firstName: string; lastName: string; role: UserRole;
}
export interface User extends AuthUser {
  phone?: string | null; isActive: boolean; createdAt: string;
}
export interface Product {
  id: string; name: string; description: string | null; price: number;
  category: string; imageUrl: string | null; isAvailable: boolean;
  sortOrder: number; createdAt: string; updatedAt: string;
}
export interface Note {
  id: string; content: string; createdAt: string;
  author: { firstName: string; lastName: string; role: UserRole };
}
export interface Inquiry {
  id: string; customerName: string; customerEmail: string; customerPhone: string;
  quantity: number | null; preferredContact: string; message: string | null;
  status: InquiryStatus; productId: string | null;
  product?: { id: string; name: string } | null;
  customerId: string | null;
  customer?: Pick<User, "id" | "email" | "firstName" | "lastName"> | null;
  assignedToId: string | null;
  assignedTo?: { firstName: string; lastName: string } | null;
  notes?: Note[]; _count?: { notes: number };
  createdAt: string; updatedAt: string;
}
export interface Pagination {
  total: number; page: number; limit: number; totalPages: number;
}
export interface DashboardStats {
  total: number; newThisWeek: number;
  statusBreakdown: Partial<Record<InquiryStatus, number>>;
}
