// app/verify/invalid/page.tsx
export const metadata = {
  title: "Invalid or Expired Link",
};

export default function VerifyInvalidPage() {
  return (
    <main className="min-h-dvh grid place-items-center p-6">
      <div className="max-w-md w-full rounded-xl border border-zinc-800 bg-zinc-950 p-8 text-zinc-100">
        <h1 className="text-2xl font-bold mb-2">Link invalid or expired</h1>
        <p className="text-sm text-zinc-300">
          The verification link is no longer valid. This can happen if it was already used
          or if too much time has passed.
        </p>

        <div className="mt-6 flex gap-3">
          <a
            href="/login"
            className="inline-flex items-center justify-center rounded-lg px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            Go to Login
          </a>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-lg px-4 py-2 border border-zinc-700 hover:bg-zinc-900"
          >
            Home
          </a>
        </div>

        {/* Optional: Add a "Resend verification email" link later when you implement it */}
        {/* <a href="/verify/resend" className="mt-4 inline-block text-sm text-blue-400 hover:underline">
          Resend verification email
        </a> */}
      </div>
    </main>
  );
}
