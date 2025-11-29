import { authService } from "@/api/services/auth";
import type { User } from "@/api/services/users";
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/lib/theme";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  Calendar,
  ChevronRight,
  LogOut,
  Mail,
  Moon,
  Phone,
  Settings,
  Shield,
  Sun,
  User as UserIcon,
} from "lucide-react";
import { Suspense } from "react";

export const Route = createFileRoute("/(app)/_app/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const queryClient = useQueryClient();

  // Get current user from session
  const session = queryClient.getQueryData(["session"]) as User | undefined;
  const user = session?.attributes;

  const settingsSections = [
    {
      title: "Account",
      items: [
        {
          icon: UserIcon,
          label: "Profile",
          description: "Manage your personal information",
          href: "/profile",
          action: null,
        },
        {
          icon: Bell,
          label: "Notifications",
          description: "Configure your notification preferences",
          href: "/notifications",
          action: null,
        },
      ],
    },
    {
      title: "Appearance",
      items: [
        {
          icon: theme === "dark" ? Moon : Sun,
          label: "Dark Mode",
          description: "Toggle between light and dark themes",
          href: null,
          action: <AnimatedThemeToggler theme={theme} setTheme={toggleTheme} />,
        },
      ],
    },
    {
      title: "Privacy & Security",
      items: [
        {
          icon: Shield,
          label: "Privacy Settings",
          description: "Control your privacy and data sharing",
          href: "/privacy",
          action: null,
        },
      ],
    },
  ];

  const navigate = useNavigate();

  const handleLogOut = async () => {
    // TODO: check here why its going /sessions/new?
    navigate({ to: "/login", replace: true });
    authService.logout();
    queryClient.resetQueries();
  };

  // Format date of birth for display
  const formatDateOfBirth = (dateString?: string) => {
    if (!dateString) return "Not provided";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Not provided";
    }
  };

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-6">
          <div className="text-lg">Loading settings...</div>
        </div>
      }
    >
      <div className="min-h-[calc(100vh-4rem)] p-4 pb-20 animate-fade-in-scale">
        <div className="max-w-md mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>

          {/* Profile Information */}
          <div>
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Profile Information
            </h2>
            <Card className="divide-y divide-border">
              {/* Full Name */}
              <div className="w-full p-4 flex items-center gap-3">
                <div className="flex-shrink-0">
                  <UserIcon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">Name</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.full_name ||
                      `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
                      "Not provided"}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="w-full p-4 flex items-center gap-3">
                <div className="flex-shrink-0">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">Email</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.email_address || "Not provided"}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="w-full p-4 flex items-center gap-3">
                <div className="flex-shrink-0">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">Phone</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.phone || "Not provided"}
                  </p>
                </div>
              </div>

              {/* Date of Birth */}
              <div className="w-full p-4 flex items-center gap-3">
                <div className="flex-shrink-0">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">Date of Birth</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDateOfBirth(user?.date_of_birth)}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Settings Sections */}
          <div className="space-y-6">
            {settingsSections.map((section) => (
              <div key={section.title}>
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  {section.title}
                </h2>
                <Card className="divide-y divide-border">
                  {section.items.map((item) => (
                    <div
                      key={item.label}
                      className="w-full p-4 flex items-center gap-3 first:rounded-t-lg last:rounded-b-lg"
                    >
                      <div className="flex-shrink-0">
                        <item.icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">
                          {item.label}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      {item.action ? (
                        item.action
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                </Card>
              </div>
            ))}

            {/* App Version */}
            <Card className="p-4">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">EzSplit PWA</p>
                <p className="text-xs text-muted-foreground">Version 1.0.0</p>
              </div>
            </Card>

            {/* Logout Button */}
            <div className="pt-4">
              <Button
                onClick={handleLogOut}
                variant="outline"
                className="w-full justify-start gap-3 h-12 text-destructive border-destructive/20 hover:bg-destructive/5"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
