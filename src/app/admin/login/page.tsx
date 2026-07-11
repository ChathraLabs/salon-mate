"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("srinathdimuthu@gmail.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Unable to log in.");
      }

      router.push("/admin");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to log in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--background)" }}>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 space-y-5"
        style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "1rem" }}
      >
        <div>
          <h1 style={{ fontFamily: "var(--font-heading)", color: "var(--foreground)", fontSize: "2rem" }}>
            Admin Login
          </h1>
          <p style={{ fontFamily: "var(--font-body)", color: "var(--muted-foreground)", fontSize: "0.9rem" }}>
            Sign in to manage bookings.
          </p>
        </div>

        <label className="block space-y-2">
          <span style={{ fontFamily: "var(--font-body)", color: "var(--foreground)", fontSize: "0.875rem" }}>Email</span>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            className="w-full px-4 py-3"
            style={{ background: "var(--input-background)", border: "1px solid var(--border)", color: "var(--foreground)", borderRadius: "0.75rem" }}
          />
        </label>

        <label className="block space-y-2">
          <span style={{ fontFamily: "var(--font-body)", color: "var(--foreground)", fontSize: "0.875rem" }}>Password</span>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            className="w-full px-4 py-3"
            style={{ background: "var(--input-background)", border: "1px solid var(--border)", color: "var(--foreground)", borderRadius: "0.75rem" }}
          />
        </label>

        {error && <p style={{ color: "var(--gold-light)", fontFamily: "var(--font-body)", fontSize: "0.875rem" }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3"
          style={{
            background: "linear-gradient(135deg, var(--gold-dark), var(--gold))",
            color: "var(--primary-foreground)",
            borderRadius: "9999px",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "var(--font-body)",
          }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </main>
  );
}
