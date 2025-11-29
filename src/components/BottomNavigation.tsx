import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import { Home, Receipt, Settings, Users, Tag } from "lucide-react";

const navigationItems = [
  {
    name: "Home",
    href: "/home",
    icon: Home,
  },
  {
    name: "Groups",
    href: "/groups/list",
    icon: Users,
  },
  {
    name: "Expenses",
    href: "/expenses/list",
    icon: Receipt,
  },
  {
    name: "Categories",
    href: "/categories",
    icon: Tag,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function BottomNavigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-background/95 backdrop-blur-lg border-t border-border animate-slide-in-up">
      <div className="flex justify-around items-center h-16 px-4 max-w-md mx-auto">
        {navigationItems.map((item, index) => {
          const isActive =
            location.pathname === item.href ||
            (item.href === "/home" &&
              (location.pathname === "/" || location.pathname === "/home"));

          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 relative transition-all duration-300 ease-out touch-action-manipulation",
                "hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-lg",
              )}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              {/* Active indicator */}
              <div
                className={cn(
                  "absolute -top-1 left-1/2 transform -translate-x-1/2 w-6 h-1 rounded-full transition-all duration-300 ease-out",
                  isActive
                    ? "bg-primary scale-100 opacity-100"
                    : "bg-transparent scale-0 opacity-0",
                )}
              />

              {/* Icon container with animation */}
              <div
                className={cn(
                  "relative transition-all duration-300 ease-out transform",
                  isActive
                    ? "text-primary scale-110"
                    : "text-muted-foreground scale-100",
                )}
              >
                <item.icon
                  size={22}
                  className={cn(
                    "transition-all duration-300 ease-out",
                    isActive && "drop-shadow-sm",
                  )}
                />

                {/* Ripple effect for active tab */}
                {isActive && (
                  <div
                    className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-30"
                    style={{ animationDuration: "2s" }}
                  />
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  "text-xs font-medium mt-1 transition-all duration-300 ease-out transform",
                  isActive
                    ? "text-primary scale-100 opacity-100 font-semibold"
                    : "text-muted-foreground scale-90 opacity-80",
                )}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Safe area for iPhone home indicator */}
      <div className="h-safe-area-inset-bottom bg-white/95 dark:bg-background/95 backdrop-blur-lg" />
    </nav>
  );
}
