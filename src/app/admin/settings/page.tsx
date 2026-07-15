"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminStaffRow } from "@/types/admin";
import { staffAvatarForName } from "@/app/config/services";
import { Calendar as DatePickerCalendar } from "@/app/components/ui/calendar";
import { AdminShell } from "../components/AdminShell";
import { AdminPageLoader } from "../components/AdminPageLoader";

type AvailabilityExceptionRow = {
  id: string;
  date: string;
  staffId: string | null;
  type: "BLOCKED" | "SPECIAL_OPEN";
  startsAt: string | null;
  endsAt: string | null;
  reason: string | null;
  staff: { id: string; name: string; email: string } | null;
};

function todayKey() {
  return localDateKey(new Date());
}

function dateToLocalDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function localDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateKey(value: string) {
  return value.slice(0, 10);
}

function firstName(name?: string | null) {
  return name?.trim().split(/\s+/)[0] ?? "Whole salon";
}

function formatBlockTime(block: AvailabilityExceptionRow) {
  if (!block.startsAt) return "Full day";
  return `${block.startsAt} - ${block.endsAt ?? block.startsAt}`;
}

const fieldStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--input-background)",
  color: "var(--foreground)",
  border: "1px solid var(--border)",
  borderRadius: "0.75rem",
  padding: "0.75rem 0.9rem",
  fontFamily: "var(--font-body)",
};

async function readJson(response: Response) {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Unexpected response from ${response.url || "server"}.`);
  }
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const [staff, setStaff] = useState<AdminStaffRow[]>([]);
  const [exceptions, setExceptions] = useState<AvailabilityExceptionRow[]>([]);
  const [staffId, setStaffId] = useState("");
  const [date, setDate] = useState(todayKey());
  const [endDate, setEndDate] = useState(todayKey());
  const [fullDay, setFullDay] = useState(false);
  const [startsAt, setStartsAt] = useState("09:00");
  const [endsAt, setEndsAt] = useState("10:00");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeStaff = useMemo(() => staff.filter((member) => member.active), [staff]);
  const selectedStaff = useMemo(() => activeStaff.find((member) => member.id === staffId) ?? null, [activeStaff, staffId]);
  const selectedDate = dateToLocalDate(date);

  async function loadSettings() {
    setLoading(true);
    setError(null);

    try {
      const [availabilityResponse, staffResponse] = await Promise.all([
        fetch("/api/admin/availability"),
        fetch("/api/admin/staff"),
      ]);

      if (availabilityResponse.status === 401 || staffResponse.status === 401) {
        router.push("/admin/login");
        return;
      }

      const [availabilityData, staffData] = await Promise.all([
        readJson(availabilityResponse),
        readJson(staffResponse),
      ]);

      if (!staffResponse.ok) throw new Error(staffData.error ?? "Unable to load staff.");

      setStaff(staffData.staff);

      if (!availabilityResponse.ok) throw new Error(availabilityData.error ?? "Unable to load availability.");

      setExceptions(availabilityData.exceptions);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to load settings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function saveBlock(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    if (endDate < date) {
      setError("Leave end date must be the same as or after the start date.");
      setSaving(false);
      return;
    }

    if (!fullDay && startsAt >= endsAt) {
      setError("End time must be after start time.");
      setSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exception: {
            date,
            endDate,
            staffId: staffId || null,
            type: "BLOCKED",
            startsAt: fullDay ? null : startsAt,
            endsAt: fullDay ? null : endsAt,
            reason: reason || null,
          },
        }),
      });
      const data = await readJson(response);

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to save availability block.");
      }

      setReason("");
      await loadSettings();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to save availability block.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteBlock(id: string) {
    setError(null);

    try {
      const response = await fetch(`/api/admin/availability?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = await readJson(response);

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to delete availability block.");
      }

      setExceptions((current) => current.filter((block) => block.id !== id));
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to delete availability block.");
    }
  }

  if (loading) {
    return <AdminShell active="settings"><AdminPageLoader label="Loading settings..." /></AdminShell>;
  }

  return (
    <AdminShell active="settings">
      <div className="admin-settings-page space-y-6">
        <header className="admin-settings-heading">
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2.25rem" }}>Settings</h1>
          <p style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}>
            Block booking availability for the whole salon or a selected staff member.
          </p>
        </header>

        {error && <p style={{ color: "var(--gold-light)", fontFamily: "var(--font-body)" }}>{error}</p>}

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.25fr]">
          <form
            onSubmit={saveBlock}
            className="admin-settings-form space-y-5 p-5"
            style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "1rem" }}
          >
            <div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.45rem" }}>Add Time Block</h2>
              <p style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)", fontSize: "0.9rem" }}>
                Use this when someone is on leave, stepping out, or unavailable during business hours.
              </p>
            </div>

            <div className="space-y-3">
              <span style={{ fontFamily: "var(--font-body)" }}>Staff member</span>
              <div className="admin-settings-staff flex flex-wrap items-start gap-4">
                {activeStaff.map((member) => {
                  const isSelected = staffId === member.id;
                  const avatarUrl = staffAvatarForName(member.name);

                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => setStaffId(member.id)}
                      className="flex w-[4.75rem] flex-col items-center gap-2 text-center"
                      style={{
                        border: "none",
                        background: "transparent",
                        color: "var(--foreground)",
                        cursor: "pointer",
                      }}
                    >
                      <span
                        className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full"
                        style={{
                          border: isSelected ? "2px solid var(--gold)" : "1px solid var(--border)",
                          background: "var(--muted)",
                          boxShadow: isSelected ? "0 0 0 4px rgba(212,165,32,0.16)" : "none",
                          padding: "0.16rem",
                        }}
                      >
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={member.name}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <span
                            className="flex h-full w-full items-center justify-center rounded-full"
                            style={{ color: "var(--gold)" }}
                          >
                            {member.name.charAt(0)}
                          </span>
                        )}
                      </span>
                      <span
                        style={{
                          color: isSelected ? "var(--gold)" : "var(--muted-foreground)",
                          fontFamily: "var(--font-body)",
                          fontSize: "0.78rem",
                          lineHeight: 1.15,
                        }}
                      >
                        {firstName(member.name)}
                      </span>
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setStaffId("")}
                  className="flex w-[5.75rem] flex-col items-center gap-2 text-center"
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "var(--foreground)",
                    cursor: "pointer",
                  }}
                >
                  <span
                    className="relative h-16 w-20 shrink-0 rounded-full"
                    style={{
                      filter: staffId === "" ? "drop-shadow(0 0 0.5rem rgba(212,165,32,0.24))" : "none",
                    }}
                  >
                    {activeStaff.slice(0, 3).map((member, index) => {
                      const avatarUrl = staffAvatarForName(member.name);

                      return avatarUrl ? (
                        <img
                          key={member.id}
                          src={avatarUrl}
                          alt={member.name}
                          className="absolute top-0 h-16 w-16 rounded-full object-cover"
                          style={{
                            left: `${index * 0.65}rem`,
                            border: staffId === "" ? "2px solid var(--gold)" : "1px solid var(--border)",
                            background: "var(--muted)",
                            zIndex: activeStaff.length - index,
                          }}
                        />
                      ) : null;
                    })}
                    {activeStaff.length === 0 && (
                      <span
                        className="flex h-16 w-16 items-center justify-center rounded-full"
                        style={{ border: staffId === "" ? "2px solid var(--gold)" : "1px solid var(--border)", color: "var(--gold)" }}
                      >
                        All
                      </span>
                    )}
                  </span>
                  <span
                    style={{
                      color: staffId === "" ? "var(--gold)" : "var(--muted-foreground)",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.78rem",
                      lineHeight: 1.15,
                    }}
                  >
                    Whole salon
                  </span>
                </button>
              </div>
              <p style={{ color: "var(--gold)", fontFamily: "var(--font-body)", fontSize: "0.85rem" }}>
                Blocking: {selectedStaff ? selectedStaff.name : "Whole salon"}
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <span style={{ fontFamily: "var(--font-body)" }}>Pick a date</span>
                <DatePickerCalendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(value) => {
                    if (value) {
                      const nextDate = localDateKey(value);
                      setDate(nextDate);
                      if (endDate < nextDate) setEndDate(nextDate);
                    }
                  }}
                  className="admin-settings-calendar w-full rounded-xl border border-border bg-input-background text-foreground"
                  classNames={{
                    months: "flex w-full flex-col",
                    month: "flex w-full flex-col gap-4",
                    caption: "relative flex w-full items-center justify-center pt-1",
                    caption_label: "text-sm font-medium text-foreground",
                    nav: "flex items-center gap-1",
                    nav_button: "absolute top-0 inline-flex size-7 items-center justify-center rounded-md border border-border bg-transparent p-0 text-gold opacity-75 transition hover:bg-secondary hover:opacity-100",
                    nav_button_previous: "left-1",
                    nav_button_next: "right-1",
                    table: "w-full border-collapse",
                    head_row: "grid grid-cols-7",
                    head_cell: "text-muted-foreground rounded-md text-center text-[0.75rem] font-normal",
                    row: "grid grid-cols-7 mt-2",
                    cell: "relative p-0 text-center text-sm",
                    day: "mx-auto flex size-9 items-center justify-center rounded-md p-0 text-sm font-normal text-foreground transition hover:bg-secondary hover:text-gold-light disabled:pointer-events-none disabled:opacity-30",
                    day_selected: "bg-gold text-primary-foreground hover:bg-gold hover:text-primary-foreground focus:bg-gold focus:text-primary-foreground",
                    day_today: "border border-gold/50 text-gold",
                    day_outside: "text-muted-foreground opacity-30",
                    day_disabled: "text-muted-foreground opacity-30",
                  }}
              />
              </div>

              <div className="admin-settings-date-range grid gap-3 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span>Leave starts</span>
                  <input type="date" min={todayKey()} value={date} onChange={(event) => { setDate(event.target.value); if (endDate < event.target.value) setEndDate(event.target.value); }} style={{ ...fieldStyle, minHeight: "3rem" }} />
                </label>
                <label className="block space-y-2">
                  <span>Leave ends</span>
                  <input type="date" min={date} value={endDate} onChange={(event) => setEndDate(event.target.value)} style={{ ...fieldStyle, minHeight: "3rem" }} />
                </label>
              </div>

              <div
                className="admin-settings-date-summary rounded-xl px-4 py-3"
                style={{
                  background: "rgba(212,165,32,0.08)",
                  border: "1px solid rgba(212,165,32,0.25)",
                }}
              >
                <p style={{ fontFamily: "var(--font-heading)", color: "var(--foreground)", fontSize: "1rem" }}>
                  {date === endDate ? date : `${date} to ${endDate}`}
                </p>
                <p style={{ fontFamily: "var(--font-body)", color: "var(--muted-foreground)", fontSize: "0.78rem", marginTop: "0.2rem" }}>
                  Selected block date
                </p>
              </div>

              <label className="flex items-center gap-3" style={{ fontFamily: "var(--font-body)" }}>
                <input type="checkbox" checked={fullDay} onChange={(event) => setFullDay(event.target.checked)} className="h-5 w-5 accent-gold" />
                Block the full day
              </label>

              {!fullDay && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block space-y-2">
                    <span>Start time</span>
                    <input type="time" value={startsAt} onChange={(event) => setStartsAt(event.target.value)} style={{ ...fieldStyle, minHeight: "3rem" }} />
                  </label>
                  <label className="block space-y-2">
                    <span>End time</span>
                    <input type="time" value={endsAt} onChange={(event) => setEndsAt(event.target.value)} style={{ ...fieldStyle, minHeight: "3rem" }} />
                  </label>
                </div>
              )}
            </div>

            <label className="block space-y-2">
              <span>Reason</span>
              <textarea
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                rows={3}
                placeholder="Leave, personal work, supplier visit..."
                style={{ ...fieldStyle, resize: "vertical" }}
              />
            </label>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2"
              style={{
                borderRadius: "0.75rem",
                border: "none",
                background: "linear-gradient(135deg, var(--gold-dark), var(--gold))",
                color: "var(--primary-foreground)",
                cursor: saving ? "not-allowed" : "pointer",
                fontFamily: "var(--font-body)",
              }}
            >
              {saving ? "Saving..." : "Block Time"}
            </button>
          </form>

          <section className="admin-settings-blocks p-5" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "1rem" }}>
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.45rem" }}>Availability Blocks</h2>
                <p style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)", fontSize: "0.9rem" }}>
                  These blocks are used by the public booking time picker immediately.
                </p>
              </div>
              <button
                type="button"
                onClick={loadSettings}
                className="px-4 py-2"
                style={{ border: "1px solid var(--border)", borderRadius: "0.75rem", background: "var(--card)", color: "var(--foreground)" }}
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <p style={{ color: "var(--muted-foreground)" }}>Loading availability blocks...</p>
            ) : exceptions.length === 0 ? (
              <p style={{ color: "var(--muted-foreground)" }}>No availability blocks yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left" style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem" }}>
                  <thead style={{ color: "var(--gold)" }}>
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Staff</th>
                      <th className="p-3">Time</th>
                      <th className="p-3">Reason</th>
                      <th className="p-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {exceptions.map((block) => (
                      <tr key={block.id} style={{ borderTop: "1px solid var(--border)" }}>
                        <td className="p-3">{dateKey(block.date)}</td>
                        <td className="p-3">{firstName(block.staff?.name)}</td>
                        <td className="p-3">{formatBlockTime(block)}</td>
                        <td className="p-3">{block.reason ?? "-"}</td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => deleteBlock(block.id)}
                            className="px-3 py-1.5"
                            style={{
                              border: "1px solid rgba(240,228,184,0.18)",
                              borderRadius: "0.65rem",
                              background: "transparent",
                              color: "var(--gold-light)",
                              cursor: "pointer",
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </AdminShell>
  );
}
