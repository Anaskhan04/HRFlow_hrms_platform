import React, { useState } from "react";
import {
  Bell,
  Sun,
  Moon,
  Laptop,
  Globe,
  CheckCircle2,
  Save,
  Sliders,
} from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "../../hooks/useTheme";

export const PreferencesCard: React.FC = () => {
  const { theme, setTheme } = useTheme();

  // Notification toggles persisted in localStorage
  const [emailNotifs, setEmailNotifs] = useState<boolean>(() => {
    const saved = localStorage.getItem("hrflow_pref_email_notifs");
    return saved !== null ? saved === "true" : true;
  });

  const [inAppNotifs, setInAppNotifs] = useState<boolean>(() => {
    const saved = localStorage.getItem("hrflow_pref_inapp_notifs");
    return saved !== null ? saved === "true" : true;
  });

  const [language, setLanguage] = useState<string>(() => {
    return localStorage.getItem("hrflow_pref_language") || "en-US";
  });

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("hrflow_pref_email_notifs", String(emailNotifs));
    localStorage.setItem("hrflow_pref_inapp_notifs", String(inAppNotifs));
    localStorage.setItem("hrflow_pref_language", language);
    setSuccessMsg("System & UI preferences saved successfully.");
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Preferences Form Card */}
      <div className="lg:col-span-2 rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Sliders className="h-5 w-5 text-primary" />
              UI Theme, Localization & Notifications
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Customize how HRFlow behaves and communicates with you across devices.
            </p>
          </div>
        </div>

        {successMsg && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-sm text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSavePreferences} className="mt-6 space-y-6">
          {/* Theme Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Appearance & Dark Mode
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-xs font-semibold transition-all ${
                  theme === "light"
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <Sun className="h-5 w-5" />
                Light Theme
              </button>

              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-xs font-semibold transition-all ${
                  theme === "dark"
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <Moon className="h-5 w-5" />
                Dark Mode
              </button>

              <button
                type="button"
                onClick={() => setTheme("system")}
                className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-xs font-semibold transition-all ${
                  theme === "system"
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <Laptop className="h-5 w-5" />
                System Default
              </button>
            </div>
          </div>

          {/* Language Selection Placeholder */}
          <div className="border-t pt-5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              Interface Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="flex h-10 w-full sm:w-80 rounded-xl border border-input bg-background px-3 py-2 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="en-US">English (United States)</option>
              <option value="en-GB">English (United Kingdom)</option>
              <option value="es-ES">Spanish (Español)</option>
              <option value="fr-FR">French (Français)</option>
              <option value="de-DE">German (Deutsch)</option>
            </select>
          </div>

          {/* Notification Toggles */}
          <div className="border-t pt-5 space-y-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Bell className="h-4 w-4 text-muted-foreground" />
              Notification Preferences
            </label>

            <div className="flex items-center justify-between rounded-xl border bg-muted/30 p-4">
              <div>
                <span className="block text-sm font-semibold text-foreground">
                  Email Notifications
                </span>
                <span className="block text-xs text-muted-foreground">
                  Receive alerts for leave requests, attendance summaries, and payslip generation.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setEmailNotifs(!emailNotifs)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  emailNotifs ? "bg-primary" : "bg-muted-foreground/30"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                    emailNotifs ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between rounded-xl border bg-muted/30 p-4">
              <div>
                <span className="block text-sm font-semibold text-foreground">
                  In-App System Alerts
                </span>
                <span className="block text-xs text-muted-foreground">
                  Receive real-time popup badges inside the HRFlow dashboard header.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setInAppNotifs(!inAppNotifs)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  inAppNotifs ? "bg-primary" : "bg-muted-foreground/30"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                    inAppNotifs ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t">
            <Button type="submit" className="rounded-xl px-6 font-semibold shadow-sm">
              <Save className="mr-2 h-4 w-4" />
              Save Preferences
            </Button>
          </div>
        </form>
      </div>

      {/* Preferences Summary Card */}
      <div className="space-y-6">
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            Current Configuration
          </h3>

          <div className="mt-4 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-muted-foreground">Active Theme</span>
              <span className="font-semibold text-foreground capitalize">{theme}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-muted-foreground">Language</span>
              <span className="font-semibold text-foreground">{language}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-muted-foreground">Email Alerts</span>
              <span
                className={`font-semibold ${
                  emailNotifs ? "text-emerald-500" : "text-muted-foreground"
                }`}
              >
                {emailNotifs ? "Enabled" : "Disabled"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">In-App Alerts</span>
              <span
                className={`font-semibold ${
                  inAppNotifs ? "text-emerald-500" : "text-muted-foreground"
                }`}
              >
                {inAppNotifs ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
