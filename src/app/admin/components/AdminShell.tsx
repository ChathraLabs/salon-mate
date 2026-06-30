"use client";

import type React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  GalleryHorizontal,
  Globe,
  Grid2X2,
  LogOut,
  Mail,
  MessageSquareText,
  Scissors,
  Settings,
  Star,
} from "lucide-react";
import logoImage from "../../../imports/image-1.png";

type AdminShellProps = {
  active: "dashboard" | "booking" | "services" | "gallery" | "reviews" | "contacts" | "settings" | "website";
  children: React.ReactNode;
  footerText?: string;
};

type AdminNavItem = {
  key: AdminShellProps["active"];
  label: string;
  href: string;
  Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  adminOnly?: boolean;
  separated?: boolean;
};

const navItems: AdminNavItem[] = [
  { key: "dashboard", label: "Dashboard", href: "/admin", Icon: Grid2X2 },
  { key: "booking", label: "Booking", href: "/admin/bookings", Icon: CalendarDays },
  { key: "services", label: "Services", href: "/admin/services", Icon: Scissors, adminOnly: true },
  { key: "gallery", label: "Gallery", href: "/admin/gallery", Icon: GalleryHorizontal, adminOnly: true },
  { key: "reviews", label: "Reviews", href: "/admin/reviews", Icon: Star, adminOnly: true },
  { key: "contacts", label: "Contacts", href: "/admin/contacts", Icon: Mail, adminOnly: true },
  { key: "settings", label: "Settings", href: "/admin/settings", Icon: Settings, adminOnly: true, separated: true },
  { key: "website", label: "Website Settings", href: "/admin/website", Icon: Globe, adminOnly: true },
] as const;

type AdminUserRole = "SUPER_ADMIN" | "OWNER" | "STAFF";

export function AdminShell({ active, children, footerText }: AdminShellProps) {
  const router = useRouter();
  const [role, setRole] = useState<AdminUserRole | null>(null);

  useEffect(() => {
    async function loadUser() {
      const response = await fetch("/api/admin/auth/me");
      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!response.ok) return;

      const data = await response.json();
      setRole(data.user.role);

      const activeNavItem = navItems.find((item) => item.key === active);
      if (data.user.role === "STAFF" && activeNavItem?.adminOnly) {
        router.push("/admin/bookings");
      }
    }

    loadUser();
  }, [active, router]);

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const canManageSalon = role === "SUPER_ADMIN" || role === "OWNER";
  const visibleNavItems = navItems.filter((item) => !item.adminOnly || canManageSalon);

  return (
    <main className="min-h-screen p-3" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      <div
        className="mx-auto grid max-w-[96rem] overflow-hidden lg:grid-cols-[20rem_1fr]"
        style={{
          minHeight: "calc(100vh - 1.5rem)",
          border: "1px solid rgba(240,228,184,0.14)",
          borderRadius: "1rem",
          background: "linear-gradient(135deg, rgba(20,16,9,0.96), rgba(10,8,7,0.98))",
          boxShadow: "0 16px 64px rgba(0,0,0,0.45)",
        }}
      >
        <aside
          className="flex flex-col gap-8 p-5 lg:min-h-full"
          style={{ borderRight: "1px solid rgba(240,228,184,0.12)" }}
        >
          <Link href="/admin" className="flex items-center gap-4" style={{ textDecoration: "none", color: "inherit" }}>
            <img src={logoImage.src} alt="Scissor King Dimma" className="h-16 w-16 rounded-md object-cover" />
            <div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.35rem", lineHeight: 1.15 }}>
                Scissor King Dimma
              </h2>
              <p style={{ color: "rgba(240,228,184,0.62)", fontFamily: "var(--font-body)", fontSize: "0.9rem" }}>
                Academy & Salon
              </p>
            </div>
          </Link>

          <nav className="flex flex-col gap-2">
            {visibleNavItems.map(({ key, label, href, Icon, separated }) => {
              const isActive = active === key;
              return (
                <Link
                  key={key}
                  href={href}
                  className={separated ? "mt-6 flex items-center gap-4 px-4 py-3" : "flex items-center gap-4 px-4 py-3"}
                  style={{
                    border: `1px solid ${isActive ? "rgba(212,165,32,0.8)" : "transparent"}`,
                    borderRadius: "0.55rem",
                    background: isActive
                      ? "linear-gradient(135deg, rgba(212,165,32,0.45), rgba(184,134,11,0.18))"
                      : "transparent",
                    color: isActive ? "var(--foreground)" : "rgba(240,228,184,0.7)",
                    textDecoration: "none",
                    fontFamily: "var(--font-body)",
                    boxShadow: isActive ? "inset 0 0 24px rgba(212,165,32,0.12)" : "none",
                  }}
                >
                  <Icon className="h-5 w-5" style={{ color: isActive ? "var(--gold-light)" : "rgba(240,228,184,0.72)" }} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          <button
            onClick={logout}
            className="mt-auto flex items-center gap-4 px-4 py-3 text-left"
            style={{
              background: "transparent",
              border: "none",
              color: "rgba(240,228,184,0.7)",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
            }}
          >
            <LogOut className="h-5 w-5" />
            Log Out
          </button>
        </aside>

        <section className="flex min-w-0 flex-col">
          <div className="flex flex-col gap-6 p-5 sm:p-8 lg:p-10">
            <div className="flex justify-end">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2"
                style={{
                  border: "1px solid rgba(212,165,32,0.55)",
                  borderRadius: "0.45rem",
                  color: "var(--gold-light)",
                  textDecoration: "none",
                  fontFamily: "var(--font-body)",
                  background: "rgba(212,165,32,0.04)",
                }}
              >
                View Website
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            {children}
          </div>

          <div
            className="mt-auto flex items-center gap-2 px-5 py-4 sm:px-8 lg:px-10"
            style={{ borderTop: "1px solid rgba(240,228,184,0.12)", color: "rgba(240,228,184,0.45)", fontFamily: "var(--font-body)" }}
          >
            <ArrowLeft className="hidden h-4 w-4 opacity-0" />
            {footerText ?? "Last updated: Just now"}
            <MessageSquareText className="hidden h-4 w-4" />
          </div>
        </section>
      </div>
    </main>
  );
}
