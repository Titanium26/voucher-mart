"use client";

import { useEffect, useState } from "react";
import TicketIcon from "./ticketIcon";

type Mode = "login" | "signup";


export default function AuthPanel() {

  const [mode, setMode] = useState<Mode>("login");
  const [notice, setNotice] = useState<string>("");
  const [pending, setPending] = useState(false);

  const [loginNotice, setLoginNotice] = useState("");
  const [signupNotice, setSignupNotice] = useState("");
  const [deleteNotice, setDeleteNotice] = useState("");




  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setPending(true);
  setNotice("");

  const data = new FormData(e.currentTarget);
  const payload = {
    username: String(data.get("username") || "").trim(),
    email: String(data.get("email") || "").trim(),
    password: String(data.get("password") || ""),
  };

  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({}));
  if (res.ok) {
    setSignupNotice("Success! Please check your email to verify your account.");
    // optionally: setMode("login");
  } else {
    setSignupNotice(json.error ?? "Registration failed. Please try again.");
  }
  setPending(false);
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setPending(true);
  setNotice("");

  const data = new FormData(e.currentTarget);
  const payload = {
    email: String(data.get("email") || "").trim(),
    password: String(data.get("password") || ""),
  };

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({}));
  if (res.ok) {
    // login succeeded: cookie is set by server. Redirect to dashboard.
    window.location.href = "/dashboard";
  } else {
    setLoginNotice("Invalid credentials. Please try again.");
  }
  setPending(false);
  }

    useEffect(() => {
      const sp = new URLSearchParams(window.location.search);
      if (sp.get("deleted") === "1") {
        setDeleteNotice("✅ Your account has been deactivated successfully.");
        // Optional: clean up the URL so ?deleted=1 doesn’t stay visible
        window.history.replaceState({}, "", "/login");
      }
    }, []);

  return (
    <section className="bg-black text-white px-8 lg:px-12 py-16 flex relative overflow-hidden">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <TicketIcon className="h-9 w-14" />
          <span className="text-2xl font-bold">VoucherMart</span>
        </div>

        {/* Animated container (both views stacked and sliding) */}
        <div className="relative h-[550px] overflow-hidden">
          {/* TRACK */}
          <div
            className={[
              "absolute inset-0 flex flex-col transition-transform duration-500 ease-in-out",
               mode === "login" ? "translate-y-0" : "-translate-y-full",
            ].join(" ")}
          >
            {/* LOGIN PANEL */}
            <div className="min-h-[550px]">
              <h1 className="text-3xl font-extrabold">Welcome to VoucherMart</h1>
              <p className="mt-2 text-zinc-400">
                Access exclusive deals and redeem savings instantly.
              </p>

              <form
                className="space-y-4"
                onSubmit={handleLogin}
              >
                {deleteNotice && (
                  <div className="mb-6 mt-3 rounded-lg border border-green-700 bg-green-900/30 px-3 py-2 text-green-200 text-sm">
                    {deleteNotice}
                  </div>
                )}
                
                <div>
                  <label className="block text-sm mb-1 mt-3">Username</label>
                  <input
                    name="username"
                    type="text"
                    placeholder="Jane Doe"
                    required
                    className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 outline-none focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 outline-none focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Password</label>
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 outline-none focus:border-zinc-500"
                  />
                  <div className="text-xs text-zinc-400 mt-2">
                    <a href="/forgot" className="text-xs text-pink-200 hover:underline">
                      Forgot password?
                    </a>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg py-2 font-semibold text-white"
                  style={{
                    background:
                      "linear-gradient(135deg,#ff6b6f 0%,#b14cff 60%,#ff8a3d 100%)",
                  }}
                >
                  Log in
                </button>

                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="w-full rounded-lg py-2 border border-zinc-700 text-white hover:bg-zinc-900"
                >
                  Sign up
                </button>
                {loginNotice && (
                  <p className="text-sm text-red-400 mt-2">{loginNotice}</p>
                )}
              </form>
            </div>

            {/* SIGN UP PANEL */}
            <div className="min-h-[550px]">
              <h1 className="text-3xl font-extrabold">Create your account</h1>
              <p className="mt-2 text-zinc-400">
                Start collecting and redeeming vouchers today.
              </p>

              <form
                className="mt-8 space-y-4"
                onSubmit={handleSignup} 
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm mb-1">Username</label>
                    <input
                      name="username" 
                      type="text"
                      placeholder="Jane Doe"
                      required
                      className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 outline-none focus:border-zinc-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm mb-1">Email (username)</label>
                    <input
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 outline-none focus:border-zinc-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm mb-1">Password</label>
                    <input
                      name="password" 
                      type="password"
                      placeholder="••••••••"
                      required
                      className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 outline-none focus:border-zinc-500"
                    />
                  </div>
                </div>

                 <div className="mt-1 text-xs text-zinc-500 leading-snug">
                  <p className="text-xs text-zinc-500 mt-1">
                    Must be 8+ chars, include uppercase, lowercase, number & symbol.
                  </p>
                 </div>

                  <button
                      type="submit"
                      disabled={pending}
                      className="w-full rounded-lg py-2 font-semibold text-white"
                      style={{
                        background: "linear-gradient(135deg,#ff6b6f 0%,#b14cff 60%,#ff8a3d 100%)",
                      }}
                    >
                      {pending ? "Creating..." : "Create account"}
                    </button>

                    {signupNotice && <p className="text-sm text-zinc-300 mt-2">{signupNotice}</p>}

                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="w-full rounded-lg py-2 border border-zinc-700 text-white hover:bg-zinc-900"
                >
                  Back to login
                </button>
              </form>
            </div>
          </div>

          {/* Fade overlay during movement (subtle polish, optional) */}
          <div
            className={[
              "pointer-events-none absolute inset-0 transition-opacity duration-500",
              mode === "login" ? "opacity-0" : "opacity-0 md:opacity-10",
            ].join(" ")}
          />
        </div>
      </div>
    </section>
  );
}
