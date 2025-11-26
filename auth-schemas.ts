import { z } from "zod";

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Signup schema
export const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Password reset request schema
export const passwordResetSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// Password reset confirmation schema
export const passwordResetConfirmSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Profile update schema with comprehensive validation
export const profileUpdateSchema = z.object({
  full_name: z.string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters")
    .optional(),
  
  phone_number: z.string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")), // Allow empty string
  
  company: z.string()
    .max(100, "Company name must be less than 100 characters")
    .optional()
    .or(z.literal("")),
  
  job_title: z.string()
    .max(100, "Job title must be less than 100 characters")
    .optional()
    .or(z.literal("")),
  
  bio: z.string()
    .max(500, "Bio must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  
  website: z.string()
    .url("Please enter a valid URL (e.g., https://example.com)")
    .optional()
    .or(z.literal("")), // Allow empty string
  
  location: z.string()
    .max(100, "Location must be less than 100 characters")
    .optional()
    .or(z.literal("")),
  
  timezone: z.string()
    .max(50, "Timezone must be less than 50 characters")
    .optional()
    .or(z.literal("")),
  
  language: z.string()
    .min(2, "Language code must be at least 2 characters")
    .max(10, "Language code must be less than 10 characters")
    .default("en"),
  
  is_public: z.boolean().default(true),
});

// Types
export type LoginData = z.infer<typeof loginSchema>;
export type SignupData = z.infer<typeof signupSchema>;
export type PasswordResetData = z.infer<typeof passwordResetSchema>;
export type PasswordResetConfirmData = z.infer<typeof passwordResetConfirmSchema>;
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;
