"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminBookingRow, AdminStaffRow } from "@/types/admin";
import { isStaffAllowedForService } from "@/app/config/services";
import { AdminShell } from "../components/AdminShell";

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

export default function AdminBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<AdminBookingRow[]>([]);
  const [staff, setStaff] = useState<AdminStaffRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [role, setRole] = useState<AdminUserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className="space-y-6">
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
