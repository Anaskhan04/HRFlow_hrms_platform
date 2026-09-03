import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Layers,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import bgImage from "../assets/bg-login.png";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid work email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;



export const LoginPage: React.FC = () => {
  const { login, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMsg(null);
    try {
      await login(data);
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(
        (err as any).response?.data?.message ||
          (err as any).message ||
          "Invalid email or password. Please try again."
      );
    }
  };

  const fillDemo = (email: string, password = "Admin@123") => {
    setValue("email", email, { shouldValidate: true });
    setValue("password", password, { shouldValidate: true });
  };

  const isLoading = isSubmitting || isAuthLoading;

  return (
    <div className="h-screen w-full relative flex flex-col justify-between overflow-y-auto lg:overflow-hidden bg-[#f3f4fa] font-['Inter',sans-serif] text-slate-900 selection:bg-blue-500 selection:text-white">
      {/* Full Page Natural Unzoomed Background Image Layer */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden flex items-end justify-start">
        <img
          src={bgImage}
          alt="HRFlow Background"
          className="w-full h-full object-cover lg:object-contain object-left-bottom opacity-30 lg:opacity-90 mix-blend-multiply"
        />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-20 w-full px-4 sm:px-8 lg:px-16 py-3 lg:py-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md sm:shadow-lg shadow-blue-600/20">
            <Layers className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
            HRFlow
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 overflow-y-auto lg:overflow-hidden py-2 lg:py-4">
        {/* Left Side Welcome Text - Styled with DM Sans Font */}
        <div className="w-full lg:w-1/2 flex flex-col justify-start lg:-mt-95 space-y-2 sm:space-y-3 text-left shrink-0 font-['DM_Sans',sans-serif]">
          <span className="text-xs sm:text-sm font-bold tracking-wider text-blue-600 uppercase">
            HRFlow
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15]">
            Welcome back
          </h1>
          <p className="text-base sm:text-lg text-slate-900 font-medium tracking-normal max-w-sm leading-relaxed">
            Manage your workforce, simply and securely.
          </p>
        </div>

        {/* Right Side Form Card */}
        <div className="w-full lg:w-[440px] shrink-0 my-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/60 backdrop-blur-sm relative overflow-hidden transition-all">
            {/* Subtle top gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-80" />
            
            <div className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5 sm:mb-2">
                Sign in to your account
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Enter your work credentials to access your dashboard.
              </p>
            </div>

            {/* Error Alert */}
            {errorMsg && (
              <div className="mb-5 sm:mb-6 flex items-start gap-3 rounded-xl border border-rose-200/60 bg-rose-50/80 p-3 sm:p-3.5 text-xs sm:text-sm text-rose-700 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
                <div className="flex-1 leading-snug">
                  <p className="font-semibold mb-0.5">Authentication Failed</p>
                  <p className="opacity-90">{errorMsg}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs sm:text-sm font-medium text-slate-700">
                  Work email
                </Label>
                <div className="relative flex items-center group">
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    className="pr-10 h-11 border-slate-200 bg-slate-50/50 text-sm focus-visible:bg-white focus-visible:ring-blue-500/30 focus-visible:border-blue-500 rounded-xl text-slate-900 placeholder:text-slate-400 transition-colors"
                    disabled={isLoading}
                    {...register("email")}
                  />
                  <Mail className="absolute right-3.5 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
                </div>
                {errors.email && (
                  <p className="text-xs font-medium text-rose-600 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs sm:text-sm font-medium text-slate-700">
                  Password
                </Label>
                <div className="relative flex items-center group">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pr-10 h-11 border-slate-200 bg-slate-50/50 text-sm focus-visible:bg-white focus-visible:ring-blue-500/30 focus-visible:border-blue-500 rounded-xl text-slate-900 placeholder:text-slate-400 transition-colors"
                    disabled={isLoading}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs font-medium text-rose-600 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none group min-h-[44px]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30 transition-shadow"
                  />
                  <span className="text-xs sm:text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Remember me</span>
                </label>

                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline decoration-blue-600/30 underline-offset-4 flex items-center min-h-[44px]"
                >
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full h-11 mt-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-xl shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-[1px] transition-all duration-200 flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Demo Credentials Fill */}
            <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-slate-100">
              <p className="text-xs font-medium text-slate-500 mb-2.5 sm:mb-3 text-center">
                Quick demo access
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => fillDemo("megan.login@hrflow.com", "Employee@123")}
                  className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 transition-colors min-h-[40px] flex items-center justify-center"
                >
                  Employee
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo("hr@hrflow.com", "Hr@123")}
                  className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 transition-colors min-h-[40px] flex items-center justify-center"
                >
                  HR
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo("admin@hrflow.com", "Admin@123")}
                  className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 transition-colors min-h-[40px] flex items-center justify-center"
                >
                  Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Bar */}
      <footer className="relative z-20 w-full px-4 sm:px-8 lg:px-16 py-4 sm:py-6 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          &copy; {new Date().getFullYear()} HRFlow Inc. All rights reserved.
        </p>
        <div className="flex items-center gap-4 sm:gap-6">
          <a href="#" className="text-xs sm:text-sm text-slate-500 hover:text-slate-900 transition-colors">Privacy</a>
          <a href="#" className="text-xs sm:text-sm text-slate-500 hover:text-slate-900 transition-colors">Terms</a>
          <a href="#" className="text-xs sm:text-sm text-slate-500 hover:text-slate-900 transition-colors">Support</a>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;


