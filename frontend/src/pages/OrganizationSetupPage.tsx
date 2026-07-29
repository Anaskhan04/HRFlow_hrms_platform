import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Building2, Save, Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { useOrganizations, useCreateOrganization, useUpdateOrganization } from "../hooks/useOrganizations";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import { Organization } from "../types";

const organizationSchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
});

type OrganizationFormValues = z.infer<typeof organizationSchema>;

export const OrganizationSetupPage: React.FC = () => {
  const { data: organizations, isLoading: isFetching } = useOrganizations();
  const createMutation = useCreateOrganization();
  const updateMutation = useUpdateOrganization();
  
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const currentOrg = organizations && organizations.length > 0 ? organizations[0] : null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      website: "",
    },
  });

  useEffect(() => {
    if (currentOrg) {
      reset({
        name: currentOrg.name || "",
        email: currentOrg.email || "",
        phone: currentOrg.phone || "",
        address: currentOrg.address || "",
        website: currentOrg.website || "",
      });
    }
  }, [currentOrg, reset]);

  const onSubmit = async (data: OrganizationFormValues) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    
    try {
      if (currentOrg) {
        await updateMutation.mutateAsync({ id: currentOrg.id, data });
        setSuccessMessage("Organization updated successfully");
      } else {
        await createMutation.mutateAsync(data);
        setSuccessMessage("Organization created successfully");
      }
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || error.message || "An error occurred");
    }
  };

  if (isFetching) {
    return (
      <div className="flex h-[50vh] items-center justify-center animate-fade-in">
        <div className="flex flex-col items-center gap-4 text-slate-500">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p>Loading organization details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-4xl mx-auto">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl flex items-center gap-3">
            <Building2 className="h-8 w-8 text-indigo-400" />
            <span>Organization Setup</span>
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            Manage your company's core details, contact information, and branding.
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-50 p-4 text-sm text-emerald-700 flex items-center gap-3 dark:bg-emerald-500/10 dark:text-emerald-400">
          <CheckCircle2 className="h-5 w-5" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive flex items-center gap-3">
          <AlertCircle className="h-5 w-5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800/50 pb-6">
          <CardTitle>Company Details</CardTitle>
          <CardDescription>
            This information will be displayed on payslips, reports, and communications.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6 pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name <span className="text-destructive">*</span></Label>
                <Input
                  id="name"
                  placeholder="Acme Corp"
                  {...register("name")}
                  className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Official Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@acme.com"
                  {...register("email")}
                  className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+1 (555) 000-0000"
                  {...register("phone")}
                  className={errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website URL</Label>
                <Input
                  id="website"
                  placeholder="https://acme.com"
                  {...register("website")}
                  className={errors.website ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.website && <p className="text-xs text-destructive">{errors.website.message}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Registered Address</Label>
                <Input
                  id="address"
                  placeholder="123 Business Avenue, Suite 100, Tech District"
                  {...register("address")}
                  className={errors.address ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800/50 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={isSubmitting || !isDirty}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !isDirty}
              className="gap-2"
            >
              {isSubmitting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : currentOrg ? (
                <Upload className="h-4 w-4" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {currentOrg ? "Update Details" : "Save Details"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default OrganizationSetupPage;
