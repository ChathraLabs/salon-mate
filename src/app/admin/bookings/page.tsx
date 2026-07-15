"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, CalendarDays, ChevronRight, Clock, Filter, Phone, Search,
  Scissors, UserRound, WalletCards,
} from "lucide-react";
import type { AdminBookingRow, AdminStaffRow } from "@/types/admin";
import { isStaffAllowedForService, staffAvatarForName } from "@/app/config/services";
import { AdminShell } from "../components/AdminShell";
import { AdminPageLoader } from "../components/AdminPageLoader";

const statuses = ["PENDING", "CONFIRMED", "REJECTED", "CANCELLED", "COMPLETED"] as const;
type AdminUserRole = "SUPER_ADMIN" | "OWNER" | "STAFF";

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-LK", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(value));
}

function firstName(name?: string | null) {
  return name?.trim().split(/\s+/)[0] ?? "Unassigned";
}

function formatAdminDate(value: string) {
  return new Intl.DateTimeFormat("en-LK", { weekday: "short", month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(value));
}

function formatAdminTime(value: string) {
  return new Intl.DateTimeFormat("en-LK", { hour: "numeric", minute: "2-digit", timeZone: "UTC" }).format(new Date(value));
}

function formatAdminPrice(priceCents: number) {
  return `LKR ${new Intl.NumberFormat("en-LK").format(priceCents / 100)}`;
}

function formatAdminDuration(start: string, end: string) {
  const minutes = Math.max(0, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000));
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours ? `${hours} hr${rest ? ` ${rest} min` : ""}` : `${rest} min`;
}

export default function AdminBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<AdminBookingRow[]>([]);
  const [staff, setStaff] = useState<AdminStaffRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [role, setRole] = useState<AdminUserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileQuery, setMobileQuery] = useState("");
  const [mobileTab, setMobileTab] = useState<"ALL" | "TODAY" | "UPCOMING" | "COMPLETED">("ALL");
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [draftStatus, setDraftStatus] = useState<(typeof statuses)[number]>("PENDING");
  const [draftAssigneeId, setDraftAssigneeId] = useState<string | null>(null);
  const [statusExpanded, setStatusExpanded] = useState(false);
  const [saving, setSaving] = useState(false);

  const selectedBooking = useMemo(
    () => bookings.find((booking) => booking.id === selectedId) ?? bookings[0] ?? null,
    [bookings, selectedId],
  );
  const activeStaff = useMemo(() => staff.filter((member) => member.active), [staff]);
  const assignableStaff = useMemo(() => {
    if (!selectedBooking) return [];

    return activeStaff.filter((member) => (
      member.active
      && member.role !== "SUPER_ADMIN"
      && isStaffAllowedForService(selectedBooking.service.id, member.name)
    ));
  }, [activeStaff, selectedBooking]);

  async function loadBookings() {
    setLoading(true);
    setError(null);

    try {
      const query = statusFilter ? `?status=${statusFilter}` : "";
      const [response, userResponse, staffResponse] = await Promise.all([
        fetch(`/api/admin/bookings${query}`),
        fetch("/api/admin/auth/me"),
        fetch("/api/admin/staff"),
      ]);

      if (
        response.status === 401
        || userResponse.status === 401
        || staffResponse.status === 401
      ) {
        router.push("/admin/login");
        return;
      }

      const [data, userData, staffData] = await Promise.all([
        response.json(),
        userResponse.json(),
        staffResponse.json(),
      ]);

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to load bookings.");
      }
      if (!userResponse.ok) {
        throw new Error(userData.error ?? "Unable to load admin user.");
      }
      if (!staffResponse.ok) {
        throw new Error(staffData.error ?? "Unable to load staff.");
      }

      setBookings(data.bookings);
      setSelectedId((current) => current ?? data.bookings[0]?.id ?? null);
      setRole(userData.user.role);
      setStaff(staffData.staff);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to load bookings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const canAssignStaff = role === "SUPER_ADMIN" || role === "OWNER";

  const mobileBookings = useMemo(() => {
    const query = mobileQuery.trim().toLowerCase();
    const today = new Date().toISOString().slice(0, 10);
    return bookings.filter((booking) => {
      const bookingDay = booking.startsAt.slice(0, 10);
      const matchesQuery = !query || [booking.customer.name, booking.customer.phone, booking.service.name, booking.bookingCode]
        .some((value) => value.toLowerCase().includes(query));
      const matchesTab = mobileTab === "ALL"
        || (mobileTab === "TODAY" && bookingDay === today)
        || (mobileTab === "UPCOMING" && bookingDay >= today && booking.status !== "COMPLETED")
        || (mobileTab === "COMPLETED" && booking.status === "COMPLETED");
      return matchesQuery && matchesTab;
    });
  }, [bookings, mobileQuery, mobileTab]);

  function openMobileBooking(booking: AdminBookingRow) {
    setSelectedId(booking.id);
    setDraftStatus(booking.status);
    setDraftAssigneeId(booking.assignedStaff?.id ?? null);
    setStatusExpanded(false);
    setMobileDetailOpen(true);
  }

  async function saveMobileStatus() {
    if (!selectedBooking) return;
    setSaving(true);
    await updateBooking({ status: draftStatus, assignedStaffId: canAssignStaff ? draftAssigneeId : undefined });
    setSaving(false);
  }

  if (loading) {
    return <AdminShell active="booking"><AdminPageLoader label="Loading bookings..." /></AdminShell>;
  }

  async function updateBooking(payload: { status?: string; assignedStaffId?: string | null; adminNote?: string | null }) {
    if (!selectedBooking) return;

    const response = await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selectedBooking.id, ...payload }),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Unable to update booking.");
      return;
    }

    setError(null);
    setBookings((current) => current.map((booking) => (booking.id === data.booking.id ? data.booking : booking)));
  }

  return (
    <AdminShell active="booking">
      <div className="admin-mobile-bookings">
        {!mobileDetailOpen ? (
          <div className="admin-mobile-booking-list">
            <header className="admin-mobile-page-heading">
              <div><h1>Bookings</h1><p>Manage and track all appointments.</p></div>
              <button type="button" aria-label="Filter bookings"><Filter /></button>
            </header>

            <label className="admin-mobile-search">
              <Search aria-hidden="true" />
              <input value={mobileQuery} onChange={(event) => setMobileQuery(event.target.value)} placeholder="Search by name, service or phone..." />
            </label>

            <div className="admin-mobile-tabs">
              {(["ALL", "TODAY", "UPCOMING", "COMPLETED"] as const).map((tab) => {
                const count = tab === "ALL" ? bookings.length : tab === "COMPLETED"
                  ? bookings.filter((item) => item.status === "COMPLETED").length
                  : mobileBookings.length;
                return <button key={tab} type="button" className={mobileTab === tab ? "is-active" : ""} onClick={() => setMobileTab(tab)}>{tab[0]}{tab.slice(1).toLowerCase()} <span>{count}</span></button>;
              })}
            </div>

            {error && <p className="admin-mobile-error">{error}</p>}
            <div className="admin-mobile-booking-cards">
              {loading ? <p className="admin-mobile-empty">Loading bookings...</p> : mobileBookings.length === 0 ? <p className="admin-mobile-empty">No bookings found.</p> : mobileBookings.map((booking) => (
                <button key={booking.id} type="button" className="admin-mobile-booking-card" onClick={() => openMobileBooking(booking)}>
                  <div className="admin-mobile-booking-card__top">
                    <strong>{booking.customer.name}</strong>
                    <span className={`admin-status admin-status--${booking.status.toLowerCase()}`}>{booking.status === "REJECTED" ? "Rejected" : booking.status[0] + booking.status.slice(1).toLowerCase()}</span>
                  </div>
                  <div className="admin-mobile-booking-card__line"><CalendarDays /><span>{formatAdminDate(booking.startsAt)} · {formatAdminTime(booking.startsAt)}</span></div>
                  <div className="admin-mobile-booking-card__line"><Clock /><span>{booking.service.name}</span><b>{formatAdminPrice(booking.service.priceCents)}</b></div>
                  <div className="admin-mobile-booking-card__line"><UserRound /><span>{firstName(booking.assignedStaff?.name)}</span><ChevronRight className="admin-mobile-card-arrow" /></div>
                </button>
              ))}
            </div>
          </div>
        ) : selectedBooking ? (
          <div className="admin-mobile-booking-detail">
            <header className="admin-mobile-detail-header">
              <button type="button" onClick={() => setMobileDetailOpen(false)} aria-label="Back to bookings"><ArrowLeft /></button>
              <h1>Booking Details</h1><span />
            </header>

            <section className="admin-mobile-customer-card">
              <div><strong>{selectedBooking.customer.name}</strong><span>{selectedBooking.customer.phone}</span>{selectedBooking.customer.email && <span>{selectedBooking.customer.email}</span>}</div>
              <aside><span>Booking ID</span><b>{selectedBooking.bookingCode}</b></aside>
            </section>

            <h2 className="admin-mobile-section-title">Appointment Details</h2>
            <section className="admin-mobile-detail-card">
              {[
                { Icon: Scissors, label: "Service", value: selectedBooking.service.name },
                { Icon: UserRound, label: "Stylist", value: selectedBooking.assignedStaff?.name ?? "Unassigned" },
                { Icon: CalendarDays, label: "Date", value: formatAdminDate(selectedBooking.startsAt) },
                { Icon: Clock, label: "Time", value: formatAdminTime(selectedBooking.startsAt) },
                { Icon: Clock, label: "Duration", value: formatAdminDuration(selectedBooking.startsAt, selectedBooking.endsAt) },
                { Icon: WalletCards, label: "Amount", value: formatAdminPrice(selectedBooking.service.priceCents) },
              ].map(({ Icon, label, value }) => <div key={label} className="admin-mobile-detail-row"><span className="admin-mobile-detail-icon"><Icon /></span><span><small>{label}</small><strong>{value}</strong></span></div>)}
            </section>

            <h2 className="admin-mobile-section-title">Status</h2>
            <section className={`admin-mobile-status-panel ${statusExpanded ? "is-expanded" : ""}`}>
              <button type="button" className="admin-mobile-current-status" onClick={() => setStatusExpanded((current) => !current)} aria-expanded={statusExpanded}>
                <i className={`admin-status-dot admin-status-dot--${draftStatus.toLowerCase()}`} />
                <div><strong>{draftStatus === "REJECTED" ? "Rejected" : draftStatus[0] + draftStatus.slice(1).toLowerCase()}</strong><span>{statusExpanded ? "Choose a new appointment status" : "Tap to change appointment status"}</span></div>
                <ChevronRight aria-hidden="true" />
              </button>
              {statusExpanded && <div className="admin-mobile-status-options">
                {statuses.map((status) => <label key={status}><input type="radio" name="mobile-status" checked={draftStatus === status} onChange={() => setDraftStatus(status)} /><i className={`admin-status-dot admin-status-dot--${status.toLowerCase()}`} /><span>{status === "REJECTED" ? "Rejected" : status[0] + status.slice(1).toLowerCase()}</span></label>)}
              </div>}
            </section>

            <h2 className="admin-mobile-section-title">Assigned Staff</h2>
            <section className="admin-mobile-assignees">
              {assignableStaff.map((member) => {
                const avatar = staffAvatarForName(member.name);
                const selected = draftAssigneeId === member.id;
                return <button key={member.id} type="button" className={selected ? "is-selected" : ""} onClick={() => setDraftAssigneeId(member.id)} disabled={!canAssignStaff}>
                  <span>{avatar ? <img src={avatar} alt="" /> : <UserRound aria-hidden="true" />}</span><strong>{firstName(member.name)}</strong><small>{selected ? "Assigned" : "Available"}</small>
                </button>;
              })}
              {assignableStaff.length === 0 && <p>No available staff for this service.</p>}
            </section>
            <button type="button" className="admin-mobile-update" onClick={saveMobileStatus} disabled={saving}>{saving ? "Updating..." : "Update Status"}</button>
          </div>
        ) : null}
      </div>

      <div className="admin-desktop-bookings space-y-6">
        <header>
          <div>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2.25rem" }}>Bookings</h1>
            <p style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>
              Review, assign, and update appointment requests.
            </p>
          </div>
        </header>

        <div className="flex flex-wrap gap-3 items-center">
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="px-3 py-2"
            style={{ background: "var(--card)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: "0.75rem" }}
          >
            <option value="">All statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <button
            onClick={loadBookings}
            className="px-4 py-2"
            style={{ border: "1px solid var(--border)", borderRadius: "0.75rem", background: "var(--card)", color: "var(--foreground)" }}
          >
            Refresh
          </button>
        </div>

        {error && <p style={{ color: "var(--gold-light)", fontFamily: "var(--font-body)" }}>{error}</p>}

        <div className="grid lg:grid-cols-[1.4fr_0.9fr] gap-6">
          <section style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "1rem", overflow: "hidden" }}>
            {loading ? (
              <p className="p-6" style={{ color: "var(--muted-foreground)" }}>Loading bookings...</p>
            ) : bookings.length === 0 ? (
              <p className="p-6" style={{ color: "var(--muted-foreground)" }}>No bookings found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left" style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem" }}>
                  <thead style={{ background: "var(--muted)", color: "var(--gold)" }}>
                    <tr>
                      <th className="p-3">Code</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Service</th>
                      <th className="p-3">Staff</th>
                      <th className="p-3">When</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr
                        key={booking.id}
                        onClick={() => setSelectedId(booking.id)}
                        style={{
                          borderTop: "1px solid var(--border)",
                          cursor: "pointer",
                          background: selectedBooking?.id === booking.id ? "rgba(212,165,32,0.08)" : "transparent",
                        }}
                      >
                        <td className="p-3" style={{ color: "var(--gold)" }}>{booking.bookingCode}</td>
                        <td className="p-3">{booking.customer.name}</td>
                        <td className="p-3">{booking.service.name}</td>
                        <td className="p-3">{firstName(booking.assignedStaff?.name)}</td>
                        <td className="p-3">{formatDateTime(booking.startsAt)}</td>
                        <td className="p-3">{booking.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <aside className="p-5 space-y-5" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "1rem" }}>
            {selectedBooking ? (
              <>
                <div>
                  <p style={{ color: "var(--gold)", fontFamily: "var(--font-body)", fontSize: "0.8rem" }}>{selectedBooking.bookingCode}</p>
                  <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem" }}>{selectedBooking.customer.name}</h2>
                  <p style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>{selectedBooking.customer.phone}</p>
                  {selectedBooking.customer.email && (
                    <p style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>{selectedBooking.customer.email}</p>
                  )}
                </div>

                <div className="space-y-2" style={{ fontFamily: "var(--font-body)" }}>
                  <p><strong>Service:</strong> {selectedBooking.service.name}</p>
                  <p><strong>Staff:</strong> {firstName(selectedBooking.assignedStaff?.name)}</p>
                  <p><strong>Time:</strong> {formatDateTime(selectedBooking.startsAt)}</p>
                  <p><strong>Note:</strong> {selectedBooking.customerNote || "None"}</p>
                </div>

                <label className="block space-y-2">
                  <span>Status</span>
                  <select
                    value={selectedBooking.status}
                    onChange={(event) => updateBooking({ status: event.target.value })}
                    className="w-full px-3 py-2"
                    style={{ background: "var(--input-background)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: "0.75rem" }}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </label>

                {canAssignStaff ? (
                  <label className="block space-y-2">
                    <span>Assigned staff</span>
                    <select
                      value={selectedBooking.assignedStaff?.id ?? ""}
                      onChange={(event) => updateBooking({ assignedStaffId: event.target.value || null })}
                      className="w-full px-3 py-2"
                      style={{ background: "var(--input-background)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: "0.75rem" }}
                    >
                      <option value="">Unassigned</option>
                      {assignableStaff.map((member) => (
                        <option key={member.id} value={member.id}>{firstName(member.name)}</option>
                      ))}
                    </select>
                  </label>
                ) : (
                  <p style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>
                    <strong>Assigned staff:</strong> {selectedBooking.assignedStaff?.name ?? "Unassigned"}
                  </p>
                )}

                <label className="block space-y-2">
                  <span>Admin note</span>
                  <textarea
                    defaultValue={selectedBooking.adminNote ?? ""}
                    onBlur={(event) => updateBooking({ adminNote: event.target.value })}
                    rows={4}
                    className="w-full px-3 py-2"
                    style={{ background: "var(--input-background)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: "0.75rem" }}
                  />
                </label>
              </>
            ) : (
              <p style={{ color: "var(--muted-foreground)" }}>Select a booking to view details.</p>
            )}
          </aside>
        </div>
      </div>
    </AdminShell>
  );
}
