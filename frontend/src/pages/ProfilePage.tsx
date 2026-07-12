import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { ProfileSettingsHeader } from "../components/profile/ProfileSettingsHeader";
import { ProfileInfoCard } from "../components/profile/ProfileInfoCard";
import { SecuritySettingsCard } from "../components/profile/SecuritySettingsCard";
import { PreferencesCard } from "../components/profile/PreferencesCard";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/button";

export const ProfilePage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "preferences">(
    "profile"
  );

  // Loading Skeleton State
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-44 w-full rounded-2xl bg-muted" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="h-96 rounded-2xl bg-muted lg:col-span-2" />
          <div className="h-96 rounded-2xl bg-muted" />
        </div>
      </div>
    );
  }

  // Error / Empty State
  if (!user) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border bg-card p-8 text-center shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          Profile Data Unavailable
        </h3>
        <p className="mt-1 text-sm text-muted-foreground max-w-md">
          We were unable to load your user profile information. Please verify your authentication state or refresh the page.
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="mt-6 rounded-xl px-5"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reload Page
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile & Settings Header Banner with Navigation Tabs */}
      <ProfileSettingsHeader
        user={user}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab Content Display */}
      {activeTab === "profile" && <ProfileInfoCard user={user} />}
      {activeTab === "security" && <SecuritySettingsCard />}
      {activeTab === "preferences" && <PreferencesCard />}
    </div>
  );
};

export default ProfilePage;
