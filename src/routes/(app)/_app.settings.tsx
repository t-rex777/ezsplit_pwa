import { authService } from "@/api/services/auth";
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/lib/theme";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  ChevronRight,
  LogOut,
  Moon,
  Settings,
  Shield,
  Sun,
  User,
} from "lucide-react";

export const Route = createFileRoute("/(app)/_app/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  const settingsSections = [
    {
      title: "Account",
      items: [
        {
          icon: User,
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

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    // TODO: check here why its going /sessions/new?
    navigate({ to: "/login", replace: true });
    authService.logout();
    queryClient.resetQueries();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 pb-20 animate-fade-in-scale">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Settings className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Settings</h1>
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
  );
}
