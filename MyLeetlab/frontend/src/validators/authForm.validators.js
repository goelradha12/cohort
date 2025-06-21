import { z } from "zod";

// form validation
export const SignupSchema = z.object({
  email: z.string().email("Enter Your Email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(25, "Password must be less than 25 characters"),
  name: z
    .string()
    .max(25, "Name must be less than 25 characters")
    .min(2, "Name must be at least 3 characters")
    .optional()
});

// Login form validation
export const LoginSchema = z.object({
  email: z.string().email("Enter Your Email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(25, "Password must be less than 25 characters"),
  
});