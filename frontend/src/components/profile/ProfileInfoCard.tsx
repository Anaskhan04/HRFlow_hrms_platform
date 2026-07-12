import React, { useState, useEffect } from "react";
import {
  User as UserIcon,
  Building2,
  Shield,
  Phone,
  Briefcase,
  Mail,
  CheckCircle2,
  AlertCircle,
  Save,
  Loader2,
  Hash,
} from "lucide-react";
import { Button } from "../ui/button";
import { useUpdateProfile } from "../../hooks/useProfile";
import { useAuth } from "../../hooks/useAuth";
import type { User } from "../../types";

interface ProfileInfoCardProps {
  user: User | null;
}

export const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({ user }) => {
  const { updateUser } = useAuth();
  const updateMutation = useUpdateProfile();

  const employee = user?.employee;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [designation, setDesignation] = useState("");

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (employee) {
      setFirstName(employee.firstName || "");
      setLastName(employee.lastName || "");
      setPhone(employee.phone || "");
      setDesignation(employee.designation || "");
    }
  }, [employee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Client-side validation
    if (!firstName.trim()) {
      setErrorMsg("First name is required.");
      return;
    }
    if (!lastName.trim()) {
      setErrorMsg("Last name is required.");
      return;
    }
    if (phone.trim() && !/^[+0-9()-\s]{7,20}$/.test(phone.trim())) {
      setErrorMsg("Invalid phone number format. Use 7-20 digits, +, -, or parentheses.");
      return;
    }

    try {
      const response = await updateMutation.mutateAsync({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        designation: designation.trim(),
      });

      if (response.data) {
        updateUser(response.data);
      }
      setSuccessMsg("Profile information updated successfully.");
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Failed to update profile.";
      setErrorMsg(message);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Editable Personal & Job Profile */}
      <div className="lg:col-span-2 rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-primary" />
              Personal & Job Information
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Update your personal details and current designation within the organization.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-3.5 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-sm text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                First Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. System"
                className="mt-1.5 flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Last Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Administrator"
                className="mt-1.5 flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +1 (555) 000-0000"
                className="mt-1.5 flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                Designation
              </label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Lead HR Officer"
                className="mt-1.5 flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              Email Address (Read-Only)
            </label>
            <input
              type="email"
              value={user?.email || ""}
              readOnly
              className="mt-1.5 flex h-10 w-full cursor-not-allowed rounded-xl border border-input bg-muted/60 px-3 py-2 text-sm text-muted-foreground"
            />
          </div>

          <div className="flex justify-end pt-3 border-t">
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="rounded-xl px-6 font-semibold shadow-sm"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Profile...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Read-Only Role & Organization Card */}
      <div className="space-y-6">
        {/* Role Information Card */}
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            Access & Permission Role
          </h3>
          <div className="mt-4 rounded-xl bg-primary/5 border border-primary/10 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase">
                Assigned System Role
              </span>
              <span className="rounded-full bg-primary/20 px-3 py-0.5 text-xs font-bold text-primary">
                {user?.role || "ADMIN"}
              </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Your role dictates your permission scope for Employee, Leave, Attendance, and Payroll modules. Role modifications require executive approval.
            </p>
          </div>
        </div>

        {/* Organization Information Card */}
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            Organization Overview
          </h3>

          <div className="mt-4 space-y-4">
            <div className="rounded-xl bg-muted/40 p-3.5 border">
              <span className="block text-[11px] font-semibold uppercase text-muted-foreground">
                Organization Name
              </span>
              <span className="mt-1 block text-sm font-semibold text-foreground">
                {employee?.organization?.name || "HRFlow Enterprise Corporation"}
              </span>
            </div>

            <div className="rounded-xl bg-muted/40 p-3.5 border">
              <span className="block text-[11px] font-semibold uppercase text-muted-foreground flex items-center gap-1">
                <Hash className="h-3 w-3" />
                Organization Identifier
              </span>
              <span className="mt-1 block text-sm font-mono font-medium text-foreground">
                {employee?.organization?.id || "ORG-HRFLOW-MAIN"}
              </span>
            </div>

            <div className="rounded-xl bg-muted/40 p-3.5 border">
              <span className="block text-[11px] font-semibold uppercase text-muted-foreground">
                Corporate Email & Domain
              </span>
              <span className="mt-1 block text-sm font-medium text-foreground">
                {employee?.organization?.email || "enterprise@hrflow.com"}
              </span>
            </div>

            <div className="rounded-xl bg-muted/40 p-3.5 border">
              <span className="block text-[11px] font-semibold uppercase text-muted-foreground">
                Assigned Department
              </span>
              <span className="mt-1 block text-sm font-semibold text-foreground">
                {employee?.department?.name || "Executive Leadership & Operations"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
