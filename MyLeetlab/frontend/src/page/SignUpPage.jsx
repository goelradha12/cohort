import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { z } from "zod";
import { Code, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

// form validation
const signupSchema = z.object({
  email: z.string().email("Enter Your Email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(25, "Password must be less than 25 characters"),
  confirmPassword: z.string().min(6).max(25).cus,
  name: z
    .string()
    .max(25, "Name must be less than 25 characters")
    .min(3, "Name must be at least 3 characters")
    .optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const SignUpPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <div>
      <div>Sign up</div>
      <div></div>
    </div>
  );
};

export default SignUpPage;
