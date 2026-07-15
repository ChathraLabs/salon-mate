"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CalendarDays, CheckCircle2, ChevronRight, Clock3, Mail, Plus, Scissors, Star } from "lucide-react";
import { AdminShell } from "./components/AdminShell";
import { salonServices } from "../config/services";
import type { AdminBookingRow } from "@/types/admin";

const fallbackReviews = [
  { name: "Nethmi P.", text: "Amazing service and very friendly staff...", age: "2 days ago" },
  { name: "Kasun S.", text: "Best haircut I've had in Colombo!...", age: "5 days ago" },
  { name: "Amaya R.", text: "The facial treatment was so relaxing...", age: "1 week ago" },
];

const fallbackContacts = [
  { name: "Pasan Fernando", value: "+94 71 234 5678", age: "2 hours ago" },
  { name: "Dilini Perera", value: "dilini.p@gmail.com", age: "1 day ago" },
  { name: "Saman De Silva", value: "+94 77 123 4567", age: "1 day ago" },
];

function dateKey(value: Date) {
  return value.toISOString().slice(0, 10);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-LK", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-LK", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(value));
}

function firstName(name?: string | null) {
  return name?.trim().split(/\s+/)[0] ?? "Unassigned";
}

function statusStyle(status: AdminBookingRow["status"]) {
  if (status === "CONFIRMED") return { color: "#9ad56b", background: "rgba(78,160,63,0.12)", border: "rgba(78,160,63,0.26)" };
  if (status === "COMPLETED") return { color: "#75b7ff", background: "rgba(44,126,210,0.12)", border: "rgba(44,126,210,0.28)" };
  if (status === "PENDING") return { color: "var(--gold-light)", background: "rgba(6,68,55,0.08)", border: "rgba(212,165,32,0.22)" };
  return { color: "var(--muted-foreground)", background: "var(--emerald-soft)", border: "var(--border)" };
}

function StatusPill({ status }: { status: AdminBookingRow["status"] }) {
  const style = statusStyle(status);
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-3 py-1"
      style={{
        color: style.color,
        background: style.background,
        border: `1px solid ${style.border}`,
        fontFamily: "var(--font-body)",
        fontSize: "0.78rem",
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: style.color }} />
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

function Panel({ title, action, children }: { title: string; action?: string; children: React.ReactNode }) {
  return (
    <section
      className="rounded-xl p-5"
      style={{
        border: "1px solid var(--border)",
        background: "linear-gradient(135deg, rgba(255,255,255,0.72), rgba(255,255,255,0.015))",
      }}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem" }}>{title}</h2>
        {action && (
          <button
            className="rounded-md px-3 py-1.5"
            style={{
              border: "1px solid rgba(6,68,55,0.35)",
              color: "var(--gold-light)",
              background: "transparent",
              fontFamily: "var(--font-body)",
            }}
          >
            {action}
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

function StatCard({
  title,
  value,
  note,
  Icon,
}: {
  title: string;
  value: string | number;
  note: string;
  Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}) {
  return (
    <div
      className="rounded-xl p-5"
      style={{
        border: "1px solid var(--border)",
        background: "linear-gradient(135deg, rgba(255,255,255,0.72), rgba(255,255,255,0.015))",
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p style={{ fontFamily: "var(--font-body)", color: "var(--foreground)" }}>{title} <span style={{ color: "var(--gold)" }}>✦</span></p>
          <p className="mt-2" style={{ fontFamily: "var(--font-body)", fontSize: "2rem", fontWeight: 700 }}>{value}</p>
          <p style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)", fontSize: "0.88rem" }}>{note}</p>
        </div>
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full"
          style={{ border: "1px solid rgba(6,68,55,0.18)", background: "rgba(6,68,55,0.08)" }}
        >
          <Icon className="h-6 w-6" style={{ color: "var(--gold-light)" }} />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<AdminBookingRow[]>([]);
  const [serviceCount, setServiceCount] = useState(salonServices.length);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const bookingsResponse = await fetch("/api/admin/bookings");
        if (bookingsResponse.status === 401) {
          router.push("/admin/login");
          return;
        }

        const bookingsData = await bookingsResponse.json();
        if (!bookingsResponse.ok) throw new Error(bookingsData.error ?? "Unable to load dashboard.");
        setBookings(bookingsData.bookings);

        const servicesResponse = await fetch("/api/admin/services");
        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json();
          setServiceCount(servicesData.services.filter((service: { active: boolean }) => service.active).length);
        }

        setLastUpdated(new Intl.DateTimeFormat("en-LK", { weekday: "long", hour: "2-digit", minute: "2-digit" }).format(new Date()));
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unable to load dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  const todayBookings = useMemo(() => {
    const today = dateKey(new Date());
    return bookings.filter((booking) => dateKey(new Date(booking.startsAt)) === today);
  }, [bookings]);

  const pendingBookings = bookings.filter((booking) => booking.status === "PENDING");
  const completedToday = todayBookings.filter((booking) => booking.status === "COMPLETED");
  const recentBookings = bookings.slice(0, 5);
  const schedule = [...todayBookings].sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()).slice(0, 5);

  return (
    <AdminShell active="dashboard" footerText={lastUpdated ? `Last updated: ${lastUpdated}` : "Last updated: Loading..."}>
      <div className="admin-mobile-dashboard">
        <header><div><h1>Dashboard</h1><p>Here’s what’s happening at your salon today.</p></div><span>{new Intl.DateTimeFormat("en-LK", { month: "short", day: "numeric" }).format(new Date())}</span></header>
        {error && <p className="admin-mobile-dashboard__error">{error}</p>}
        <section className="admin-mobile-dashboard__stats">
          <a href="/admin/bookings"><span><CalendarDays /></span><small>Today</small><strong>{loading ? "…" : todayBookings.length}</strong><p>Bookings</p></a>
          <a href="/admin/bookings"><span><Clock3 /></span><small>Waiting</small><strong>{loading ? "…" : pendingBookings.length}</strong><p>Pending</p></a>
          <a href="/admin/bookings"><span><CheckCircle2 /></span><small>Finished</small><strong>{loading ? "…" : completedToday.length}</strong><p>Completed</p></a>
          <a href="/admin/services"><span><Scissors /></span><small>Available</small><strong>{serviceCount}</strong><p>Services</p></a>
        </section>

        <section className="admin-mobile-dashboard__section">
          <header><div><h2>Today’s Appointments</h2><p>{todayBookings.length ? `${todayBookings.length} appointments scheduled` : "Your schedule is clear"}</p></div><a href="/admin/bookings">View all <ArrowRight /></a></header>
          <div className="admin-mobile-dashboard__appointments">
            {schedule.length === 0 ? <div className="admin-mobile-dashboard__empty"><CalendarDays /><strong>No appointments today</strong><p>New bookings will appear here.</p></div> : schedule.slice(0, 3).map((booking) => <a href="/admin/bookings" key={booking.id}>
              <time>{formatTime(booking.startsAt)}</time><div><strong>{booking.customer.name}</strong><p>{booking.service.name} · {firstName(booking.assignedStaff?.name)}</p></div><StatusPill status={booking.status} /><ChevronRight />
            </a>)}
          </div>
        </section>

        <section className="admin-mobile-dashboard__section admin-mobile-dashboard__quick">
          <header><div><h2>Quick Actions</h2><p>Common management tasks</p></div></header>
          <div><a href="/admin/bookings"><CalendarDays /><span><strong>Manage Bookings</strong><small>Review requests and status</small></span><ChevronRight /></a><a href="/admin/services"><Plus /><span><strong>Add a Service</strong><small>Update salon offerings</small></span><ChevronRight /></a></div>
        </section>
      </div>

      <div className="admin-desktop-dashboard space-y-6">
        <header>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2.35rem" }}>Dashboard</h1>
          <p style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>
            Welcome back! Here's what's happening with your salon today.
          </p>
        </header>

        {error && <p style={{ color: "var(--gold-light)", fontFamily: "var(--font-body)" }}>{error}</p>}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Today Bookings" value={loading ? "..." : todayBookings.length} note="+3 vs yesterday" Icon={CalendarDays} />
          <StatCard title="Pending Bookings" value={loading ? "..." : pendingBookings.length} note="View & confirm" Icon={Clock3} />
          <StatCard title="Completed Bookings" value={loading ? "..." : completedToday.length} note="Today" Icon={CheckCircle2} />
          <StatCard title="Total Services" value={serviceCount} note="Active services" Icon={Scissors} />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div
            className="rounded-xl p-5"
            style={{ border: "1px solid var(--border)", background: "rgba(255,255,255,0.62)" }}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ border: "1px solid var(--border)" }}>
                <Star className="h-6 w-6" style={{ color: "var(--gold-light)" }} />
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-body)" }}>Reviews</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "1.6rem", fontWeight: 700 }}>248</p>
                <p style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>Total reviews</p>
              </div>
              <p className="ml-auto text-right" style={{ color: "#9ad56b", fontFamily: "var(--font-body)" }}>+12<br /><span style={{ color: "var(--muted-foreground)", fontSize: "0.8rem" }}>vs last 7 days</span></p>
            </div>
          </div>
          <div
            className="rounded-xl p-5"
            style={{ border: "1px solid var(--border)", background: "rgba(255,255,255,0.62)" }}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ border: "1px solid var(--border)" }}>
                <Mail className="h-6 w-6" style={{ color: "var(--gold-light)" }} />
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-body)" }}>Contacts</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "1.6rem", fontWeight: 700 }}>23</p>
                <p style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>Total contacts</p>
              </div>
              <p className="ml-auto text-right" style={{ color: "#9ad56b", fontFamily: "var(--font-body)" }}>+5<br /><span style={{ color: "var(--muted-foreground)", fontSize: "0.8rem" }}>vs last 7 days</span></p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <Panel title="Recent Bookings" action="View All">
            {recentBookings.length === 0 ? (
              <p style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>No bookings yet.</p>
            ) : (
              <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center gap-4 py-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "rgba(6,68,55,0.12)", border: "1px solid rgba(6,68,55,0.18)" }}>
                      {booking.customer.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p style={{ fontFamily: "var(--font-heading)" }}>{booking.customer.name}</p>
                      <p className="truncate" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)", fontSize: "0.9rem" }}>
                        {booking.service.name} · {firstName(booking.assignedStaff?.name)}
                      </p>
                    </div>
                    <p className="hidden text-sm sm:block" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>{formatDate(booking.startsAt)}<br />{formatTime(booking.startsAt)}</p>
                    <StatusPill status={booking.status} />
                  </div>
                ))}
              </div>
            )}
            <a href="/admin/bookings" className="mt-3 flex items-center justify-center gap-2" style={{ color: "var(--gold-light)", textDecoration: "none", fontFamily: "var(--font-body)" }}>
              View All Bookings <ArrowRight className="h-4 w-4" />
            </a>
          </Panel>

          <Panel title="Today's Schedule" action="View Calendar">
            {schedule.length === 0 ? (
              <p style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>No appointments scheduled for today.</p>
            ) : (
              <div className="space-y-1">
                {schedule.map((booking) => (
                  <div key={booking.id} className="grid grid-cols-[5.5rem_1fr_auto] items-center gap-3 rounded-lg px-2 py-3" style={{ background: "rgba(255,255,255,0.62)" }}>
                    <p style={{ color: "var(--gold-light)", fontFamily: "var(--font-body)" }}>{formatTime(booking.startsAt)}</p>
                    <div>
                      <p style={{ fontFamily: "var(--font-heading)" }}>{booking.customer.name}</p>
                      <p style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)", fontSize: "0.9rem" }}>
                        {booking.service.name} · {firstName(booking.assignedStaff?.name)}
                      </p>
                    </div>
                    <StatusPill status={booking.status} />
                  </div>
                ))}
              </div>
            )}
            <a href="/admin/bookings" className="mt-3 flex items-center justify-center gap-2" style={{ color: "var(--gold-light)", textDecoration: "none", fontFamily: "var(--font-body)" }}>
              View Full Schedule <ArrowRight className="h-4 w-4" />
            </a>
          </Panel>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <Panel title="Recent Reviews" action="View All">
            {fallbackReviews.map((review) => (
              <div key={review.name} className="flex items-center gap-4 border-b py-3 last:border-b-0" style={{ borderColor: "var(--border)" }}>
                <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ color: "var(--gold-light)", border: "1px solid rgba(6,68,55,0.18)", background: "rgba(6,68,55,0.08)" }}>{review.name[0]}</div>
                <div className="min-w-0 flex-1">
                  <p style={{ fontFamily: "var(--font-heading)" }}>{review.name} <span style={{ color: "var(--gold-light)" }}>★★★★★</span></p>
                  <p className="truncate" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>{review.text}</p>
                </div>
                <p style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)", fontSize: "0.85rem" }}>{review.age}</p>
              </div>
            ))}
          </Panel>

          <Panel title="Recent Contacts" action="View All">
            {fallbackContacts.map((contact) => (
              <div key={contact.name} className="flex items-center gap-4 border-b py-3 last:border-b-0" style={{ borderColor: "var(--border)" }}>
                <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ color: "var(--gold-light)", border: "1px solid rgba(6,68,55,0.18)", background: "rgba(6,68,55,0.08)" }}><Mail className="h-4 w-4" /></div>
                <div className="min-w-0 flex-1">
                  <p style={{ fontFamily: "var(--font-heading)" }}>{contact.name}</p>
                  <p className="truncate" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>{contact.value}</p>
                </div>
                <p style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)", fontSize: "0.85rem" }}>{contact.age}</p>
              </div>
            ))}
          </Panel>
        </div>
      </div>
    </AdminShell>
  );
}
