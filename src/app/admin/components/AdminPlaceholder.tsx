"use client";

import { AdminShell } from "./AdminShell";

type AdminPlaceholderProps = {
  active: "services" | "gallery" | "reviews" | "contacts" | "settings" | "website";
  title: string;
  description: string;
};

export function AdminPlaceholder({ active, title, description }: AdminPlaceholderProps) {
  return (
    <AdminShell active={active}>
      <div
        className="rounded-xl p-8"
        style={{
          border: "1px solid rgba(240,228,184,0.12)",
          background: "linear-gradient(135deg, rgba(240,228,184,0.04), rgba(255,255,255,0.015))",
        }}
      >
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2.25rem" }}>{title}</h1>
        <p className="mt-2 max-w-2xl" style={{ color: "rgba(240,228,184,0.68)", fontFamily: "var(--font-body)" }}>
          {description}
        </p>
      </div>
    </AdminShell>
  );
}
