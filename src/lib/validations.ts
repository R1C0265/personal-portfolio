// src/lib/validations.ts
import { z } from "zod";

export const loginSchema = z.object({
  email:    z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const contactSchema = z.object({
  name:    z.string().min(2, "Name is required").max(100),
  email:   z.string().email("Enter a valid email"),
  subject: z.string().min(2).max(150),
  message: z.string().min(10, "Message is too short").max(2000),
});

export const inquirySchema = z.object({
  customerName:     z.string().min(2, "Name is required").max(100),
  customerEmail:    z.string().email("Enter a valid email"),
  customerPhone:    z.string().optional(),
  productId:        z.string().min(1, "Product is required"),
  quantity:         z.number().min(1, "Quantity must be at least 1"),
  preferredContact: z.string().optional(),
  message:          z.string().min(10, "Message is too short").max(2000),
});

export const createUserSchema = z.object({
  email:    z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
