"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminBookingRow, AdminStaffRow } from "@/types/admin";

const statuses = ["PENDING", "CONFIRMED", "REJECTED", "CANCELLED", "COMPLETED"] as const;

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-LK", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(value));
}

export default function AdminBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<AdminBookingRow[]>([]);
  const [staff, setStaff] = useState<AdminStaffRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedBooking = useMemo(
    () => bookings.find((booking) => booking.id === selectedId) ?? bookings[0] ?? null,
    [bookings, selectedId],
  );

  async function loadBookings() {
    setLoading(true);
    setError(null);

    try {
      const query = statusFilter ? `?status=${statusFilter}` : "";
      const response = await fetch(`/api/admin/bookings${query}`);

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Unable to load bookings.");
      }

      setBookings(data.bookings);
      setSelectedId((current) => current ?? data.bookings[0]?.id ?? null);

      const staffResponse = await fetch("/api/admin/staff");
      if (staffResponse.ok) {
        const staffData = await staffResponse.json();
        setStaff(staffData.staff);
      }
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

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <main className="min-h-screen p-4 sm:p-8" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2.25rem" }}>Bookings</h1>
            <p style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>
              Review, assign, and update appointment requests.
            </p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2"
            style={{ border: "1px solid var(--border)", borderRadius: "9999px", background: "transparent", color: "var(--foreground)" }}
          >
            Logout
          </button>
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

                <label className="block space-y-2">
                  <span>Assigned staff</span>
                  <select
                    value={selectedBooking.assignedStaff?.id ?? ""}
                    onChange={(event) => updateBooking({ assignedStaffId: event.target.value || null })}
                    className="w-full px-3 py-2"
                    style={{ background: "var(--input-background)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: "0.75rem" }}
                  >
                    <option value="">Unassigned</option>
                    {staff.map((member) => (
                      <option key={member.id} value={member.id}>{member.name}</option>
                    ))}
                  </select>
                </label>

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
    </main>
  );
}
