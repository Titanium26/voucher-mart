// app/reset/[token]/page.tsx
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ResetPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setNotice("");

    const res = await fetch("/api/auth/reset", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const json = await res.json().catch(() => ({} as any));

    if (res.ok) {
      setNotice("✅ Password updated. Redirecting to login…");
      setTimeout(() => router.replace("/login"), 1200);
    } else {
      setNotice(json.error ?? "Reset failed");
    }
    setPending(false);
  }

  return (
    <main className="min-h-dvh grid place-items-center p-6 text-white">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-zinc-950 border border-zinc-800 p-6 rounded-xl space-y-3">
        <h1 className="text-xl font-semibold">Reset Password</h1>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2"
        />
        <p className="text-xs text-zinc-500">
          Must be 8+ chars, include uppercase, lowercase, number & symbol.
        </p>
        <button
          type="submit"
          disabled={pending}
          className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg py-2 font-medium"
        >
          {pending ? "Updating…" : "Update password"}
        </button>
        {notice && <p className="text-sm mt-1">{notice}</p>}
      </form>
    </main>
  );
}
