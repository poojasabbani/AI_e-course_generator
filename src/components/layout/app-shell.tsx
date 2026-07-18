import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  History,
  Home,
  LineChart,
  LogOut,
  MessageSquare,
  Search,
  Settings,
  Sparkles,
  Upload,
} from "lucide-react";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/courses", label: "Courses", icon: BookOpen },
  { to: "/upload", label: "Upload", icon: Upload },
  { to: "/chat", label: "Chat", icon: MessageSquare },
  { to: "/search", label: "Search", icon: Search },
  { to: "/analytics", label: "Analytics", icon: LineChart },
  { to: "/history", label: "History", icon: History },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex w-full">
      <aside className="hidden md:flex flex-col w-60 shrink-0 glass-strong border-r border-border/50 sticky top-0 h-screen">
        <div className="px-6 py-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="gradient-primary size-8 rounded-lg grid place-items-center glow">
              <Sparkles className="size-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-semibold gradient-text">Coursefy</span>
          </Link>
        </div>
        <nav className="flex-1 px-3 space-y-0.5">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = path === to || (to !== "/dashboard" && path.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border/50">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <div className="gradient-primary size-8 rounded-full grid place-items-center text-xs font-semibold text-primary-foreground">
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user?.name ?? "You"}</div>
              <div className="text-xs text-muted-foreground truncate">{user?.email ?? ""}</div>
            </div>
            <button
              onClick={async () => {
                await signOut();
                navigate({ to: "/" });
              }}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Sign out"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="md:hidden glass-strong sticky top-0 z-40 px-4 py-3 flex items-center justify-between border-b border-border/50">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="gradient-primary size-7 rounded-md grid place-items-center">
              <Sparkles className="size-4 text-primary-foreground" />
            </div>
            <span className="font-display text-base font-semibold gradient-text">Coursefy</span>
          </Link>
          <button
            onClick={async () => {
              await signOut();
              navigate({ to: "/" });
            }}
            className="text-xs text-muted-foreground"
          >
            Sign out
          </button>
        </header>
        <main className="flex-1">{children}</main>
        <nav className="md:hidden glass-strong sticky bottom-0 border-t border-border/50 grid grid-cols-5 py-2">
          {NAV.slice(0, 5).map(({ to, label, icon: Icon }) => {
            const active = path === to || (to !== "/dashboard" && path.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex flex-col items-center gap-1 py-1 text-[10px]",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
