import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Code, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { signupSchema } from "../validators/authForm.validators.js";

const SignUpPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema)
  });

  const onSubmit = async (data) => {
    console.log(data);
  }
  return (
    <div>
      <div class name="flex item-center justify-start flex-col">
        Sign up
        </div>
    </div>
  );
};

export default SignUpPage;
