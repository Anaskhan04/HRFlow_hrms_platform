import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Layers,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

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
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message ||
          err.message ||
          "Invalid email or password. Please try again."
      );
    }
  };

  const fillDemo = (email: string) => {
    setValue("email", email, { shouldValidate: true });
    setValue("password", "Secret123!", { shouldValidate: true });
  };

  const isLoading = isSubmitting || isAuthLoading;

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Left Column - Branded Enterprise Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-12 text-white relative overflow-hidden">
        {/* Background decorative glow elements */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/30">
            <Layers className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight flex items-center gap-1.5">
            HRFlow <Sparkles className="h-4 w-4 text-amber-400 fill-amber-400 animate-pulse" />
          </span>
        </div>

        <div className="relative z-10 my-auto max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md border border-white/10 text-blue-200">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Enterprise-Grade Security & Compliance</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl leading-tight">
            The next-generation platform for your global workforce.
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed">
            Automate payroll, streamline leave requests, and track employee attendance with real-time analytics designed for modern organizations.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="rounded-xl bg-white/5 p-4 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-blue-300 font-semibold mb-1">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Automated Payroll</span>
              </div>
              <p className="text-xs text-slate-400">
                Instant tax & allowance calculation with one-click disbursement.
              </p>
            </div>
            <div className="rounded-xl bg-white/5 p-4 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-blue-300 font-semibold mb-1">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Smart Attendance</span>
              </div>
              <p className="text-xs text-slate-400">
                Precision check-in/out tracking with automated working hour logs.
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-6 text-xs text-slate-400">
          <span>&copy; {new Date().getFullYear()} HRFlow Inc. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
          </div>
        </div>
      </div>

      {/* Right Column - Login Card */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left space-y-2">
            <div className="flex items-center justify-center lg:justify-start gap-2 lg:hidden mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Layers className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">HRFlow</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Welcome back
            </h2>
            <p className="text-sm text-muted-foreground">
              Enter your enterprise work email and password to sign in.
            </p>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive animate-fade-in">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Authentication Failed</p>
                <p className="text-xs opacity-90 mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Work Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  className="pl-9"
                  disabled={isLoading}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs font-medium text-destructive mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <a
                  href="#"
                  className="text-xs font-medium text-primary hover:underline"
                  onClick={(e) => e.preventDefault()}
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-9 pr-10"
                  disabled={isLoading}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs font-medium text-destructive mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 font-semibold shadow-md transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in to HRFlow
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Quick Demo Fill Section */}
          <div className="space-y-3 pt-4 border-t">
            <p className="text-xs text-center font-medium text-muted-foreground uppercase tracking-wider">
              Demo Credentials Shortcuts
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fillDemo("admin@hrflow.com")}
                className="text-xs h-8"
              >
                Admin Demo
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fillDemo("hr@hrflow.com")}
                className="text-xs h-8"
              >
                HR Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
