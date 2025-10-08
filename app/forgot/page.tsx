// app/forgot/page.tsx
"use client";
import { useState } from "react";

export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/forgot", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const json = await res.json();
    setMsg(json.message || json.error || "Done");
  }

  return (
    <main className="min-h-dvh grid place-items-center p-6 text-white">
      <form onSubmit={submit} className="w-full max-w-sm bg-zinc-950 border border-zinc-800 p-6 rounded-xl space-y-3">
        <h1 className="text-xl font-semibold">Forgot Password</h1>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2"
        />
        <button className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg py-2 font-medium">Send reset link</button>
        {msg && <p className="text-sm mt-1">{msg}</p>}
      </form>
    </main>
  );
}
