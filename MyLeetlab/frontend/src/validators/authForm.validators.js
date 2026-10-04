import { z } from "zod";

// form validation
export const SignupSchema = z
  .object({
    email: z.string().email("Enter Your Email"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(25, "Password must be less than 25 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    name: z
      .string()
      .max(25, "Name must be less than 25 characters")
      .min(2, "Name must be at least 3 characters")
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Login form validation
export const LoginSchema = z.object({
  email: z.string().email("Enter Your Email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(25, "Password must be less than 25 characters"),
  
});