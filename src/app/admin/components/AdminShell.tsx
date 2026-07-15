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
  Menu,
  MessageSquareText,
  Bell,
  Scissors,
  Settings,
  Star,
  UserRound,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <main className="admin-shell min-h-screen p-3" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      <div
        className="admin-shell__frame mx-auto grid max-w-[96rem] overflow-hidden lg:grid-cols-[20rem_1fr]"
        style={{
          minHeight: "calc(100vh - 1.5rem)",
          border: "1px solid var(--border)",
          borderRadius: "1rem",
          background: "linear-gradient(135deg, var(--surface), var(--cream-warm))",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <aside
          className="admin-shell__desktop-sidebar flex flex-col gap-8 p-5 lg:min-h-full"
          style={{ borderRight: "1px solid var(--border)" }}
        >
          <Link href="/admin" className="flex items-center gap-4" style={{ textDecoration: "none", color: "inherit" }}>
            <img src={logoImage.src} alt="Scissor King Dimma" className="h-16 w-16 rounded-md object-cover" />
            <div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.35rem", lineHeight: 1.15 }}>
                Scissor King Dimma
              </h2>
              <p style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)", fontSize: "0.9rem" }}>
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
                    border: `1px solid ${isActive ? "var(--emerald)" : "transparent"}`,
                    borderRadius: "0.55rem",
                    background: isActive
                      ? "var(--emerald-soft)"
                      : "transparent",
                    color: isActive ? "var(--emerald)" : "var(--muted-foreground)",
                    textDecoration: "none",
                    fontFamily: "var(--font-body)",
                    boxShadow: isActive ? "inset 0 0 24px rgba(6,68,55,0.06)" : "none",
                  }}
                >
                  <Icon className="h-5 w-5" style={{ color: isActive ? "var(--emerald)" : "var(--muted-foreground)" }} />
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
              color: "var(--muted-foreground)",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
            }}
          >
            <LogOut className="h-5 w-5" />
            Log Out
          </button>
        </aside>

        <section className="admin-shell__content flex min-w-0 flex-col">
          <header className="admin-shell__mobile-header">
            <button type="button" onClick={() => setMobileMenuOpen(true)} aria-label="Open admin menu"><Menu /></button>
            <Link href="/admin" className="admin-shell__mobile-brand"><img src={logoImage.src} alt="" /><span><strong>Scissor King Dimma</strong><small>Admin Dashboard</small></span></Link>
            <div><button type="button" aria-label="Notifications"><Bell /></button><button type="button" aria-label="Admin profile"><UserRound /></button></div>
          </header>
          {mobileMenuOpen && (
            <div className="admin-shell__mobile-drawer-layer" onClick={() => setMobileMenuOpen(false)}>
              <aside className="admin-shell__mobile-drawer" onClick={(event) => event.stopPropagation()}>
                <div className="admin-shell__mobile-drawer-brand"><img src={logoImage.src} alt="" /><span><strong>Scissor King Dimma</strong><small>Admin Dashboard</small></span><button type="button" onClick={() => setMobileMenuOpen(false)}>×</button></div>
                <nav>{visibleNavItems.map(({ key, label, href, Icon }) => <Link key={key} href={href} onClick={() => setMobileMenuOpen(false)} className={active === key ? "is-active" : ""}><Icon /><span>{label}</span></Link>)}</nav>
                <button type="button" className="admin-shell__mobile-logout" onClick={logout}><LogOut />Log Out</button>
              </aside>
            </div>
          )}
          <div className="admin-shell__body flex flex-col gap-6 p-5 sm:p-8 lg:p-10">
            <div className="admin-shell__website-link flex justify-end">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2"
                style={{
                  border: "1px solid var(--emerald)",
                  borderRadius: "0.45rem",
                  color: "var(--emerald)",
                  textDecoration: "none",
                  fontFamily: "var(--font-body)",
                  background: "var(--emerald-soft)",
                }}
              >
                View Website
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            {children}
          </div>

          <nav className="admin-shell__mobile-nav">
            {navItems.slice(0, 4).map(({ key, label, href, Icon }) => <Link key={key} href={href} className={active === key ? "is-active" : ""}><Icon /><span>{label === "Booking" ? "Bookings" : label}</span></Link>)}
          </nav>

          <div
            className="mt-auto flex items-center gap-2 px-5 py-4 sm:px-8 lg:px-10"
            style={{ borderTop: "1px solid var(--border)", color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}
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
