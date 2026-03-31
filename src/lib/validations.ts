// src/lib/validations.ts
import { z } from "zod";

const mwPhone = z
  .string()
  .regex(/^(\+265|0)[0-9]{9}$/, "Enter a valid Malawi number e.g. 0999 123 456");

const strongPassword = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[A-Z]/, "Need one uppercase letter")
  .regex(/[0-9]/, "Need one number");

export const loginSchema = z.object({
  email:    z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  email:     z.string().email(),
  password:  strongPassword,
  firstName: z.string().min(2).max(50),
  lastName:  z.string().min(2).max(50),
  phone:     mwPhone.optional(),
});

export const inquirySchema = z.object({
  customerName:     z.string().min(2, "Name is required").max(100),
  customerEmail:    z.string().email("Enter a valid email"),
  customerPhone:    mwPhone,
  productId:        z.string().cuid().optional().nullable(),
  quantity:         z.coerce.number().int().min(1).max(10000).optional().nullable(),
  preferredContact: z.enum(["phone", "email", "whatsapp"]).default("phone"),
  message:          z.string().max(1000).optional().nullable(),
});

export const productSchema = z.object({
  name:        z.string().min(2).max(100),
  description: z.string().max(500).optional().nullable(),
  price:       z.coerce.number().int().min(1, "Price must be at least MWK 1"),
  category:    z.string().min(2).max(50),
  isAvailable: z.coerce.boolean().optional().default(true),
  sortOrder:   z.coerce.number().int().optional().default(0),
});

export const createUserSchema = z.object({
  email:     z.string().email(),
  password:  strongPassword,
  firstName: z.string().min(2).max(50),
  lastName:  z.string().min(2).max(50),
  phone:     mwPhone.optional(),
  role:      z.enum(["ADMIN", "SUPER_ADMIN"]),
});
