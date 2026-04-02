import { z } from "zod";

// Zod schemas define the "shape" of your data and automatically generate
// TypeScript types from them. This means one source of truth for both
// runtime validation and compile-time type checking.
export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

// z.infer<> extracts the TypeScript type from the schema automatically —
// you never need to write a separate interface for this.
export type ContactFormData = z.infer<typeof contactSchema>;
