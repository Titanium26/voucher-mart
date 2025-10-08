"use client";

import { useState } from "react";

export default function DeleteAccountModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    try {
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = await res.json().catch(() => ({} as any));

      if (!res.ok) {
        setError(json.error ?? "Delete failed");
        setPending(false);
        return;
      }

      // Redirect to login with success flag
      window.location.href = "/login?deleted=1";
    } catch (err) {
      setError("Network error");
      setPending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <form
        onSubmit={handleConfirm}
        className="w-full max-w-sm rounded-xl bg-zinc-950 border border-zinc-800 p-6 text-white"
      >
        <h2 className="text-lg font-semibold">Confirm account deletion</h2>
        <p className="text-sm text-zinc-400 mt-2">
          This will deactivate your account. You’ll be logged out immediately.
        </p>

        <label className="block text-sm mt-4 mb-1">Re-enter your password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2"
        />

        {error && <p className="text-sm text-red-400 mt-2">{error}</p>}

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-zinc-700 py-2 hover:bg-zinc-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={pending}
            className="flex-1 rounded-lg bg-red-600 hover:bg-red-700 py-2 disabled:opacity-50"
          >
            {pending ? "Deleting…" : "Delete account"}
          </button>
        </div>
      </form>
    </div>
  );
}
