import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ChevronRight, Home } from "lucide-react";
import { useNavigate } from "react-router";

const VerifyEmail = () => {
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();
    const [dispayInfo, setDisplayInfo] = useState(false);
    const handleFormSubmit = async (data) => {
        console.log(data);
        try {
            const response = await axiosInstance.post("/auth/resendVerificationEmail", data);
            toast.success(response.data?.message || "Mail sent for Email Verification");
            setDisplayInfo(true);
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Email Verification Failed");
        } finally {
            reset();
        }
    };

    return (
        <div className="w-screen h-screen">
            <nav className="container mx-auto p-4 pt-6">
                <div className="flex items-center gap-1 pb-2">
                    <Home
                        onClick={() => navigate("/login")}
                        className="cursor-pointer w-4 h-4"
                    />
                    <ChevronRight
                        onClick={() => navigate("/login")}
                        className="cursor-pointer w-4 h-4"
                    />
                </div>
            </nav>
            <div className="flex justify-center items-center mt-10">
                {/* A form to accept user Email */}
                <div className="justify-center items-center border-1 border-success/20 shadow-xl p-4 card gap-4">
                    <h3 className="text-xl font-semibold my-4">Resend Verification Mail</h3>

                    <form
                        className="form gap-6 grid"
                        onSubmit={handleSubmit(handleFormSubmit)}
                    >
                        <div className="form-control">
                            <label htmlFor="email" className="label">
                                <span className="label-text font-medium">Enter your Email</span>
                            </label>
                            <input
                                type="email"
                                className="input"
                                {...register("email", { required: "Email is required" })}
                            />
                            {errors.name &&
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.name.message}</span>
                                </label>}
                        </div>
                        <div className="form-control">
                            <label htmlFor="password" className="label">
                                <span className="label-text font-medium">Enter your Password</span>
                            </label>
                            <input
                                type="password"
                                className="input"
                                {...register("password", { required: "Password is required" })}
                            />
                            {errors.password &&
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.password.message}</span>
                                </label>}
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={dispayInfo}
                        >
                            Send Verification Mail
                        </button>
                    </form>
                    {dispayInfo &&
                        <div className="text-base-content/50">A mail is sent on the registered mail for Email Verification.</div>
                    }
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
