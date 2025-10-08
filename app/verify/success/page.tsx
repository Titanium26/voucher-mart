// app/verify/success/page.tsx
export const metadata = {
  title: "Email Verified",
};

export default function VerifySuccessPage() {
  return (
    <main className="min-h-dvh grid place-items-center p-6">
      <div className="max-w-md w-full rounded-xl border border-zinc-800 bg-zinc-950 p-8 text-zinc-100">
        <h1 className="text-2xl font-bold mb-2">Email verified 🎉</h1>
        <p className="text-sm text-zinc-300">
          Your email has been confirmed and your account is now active.
          You can log in and start using the app.
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
      </div>
    </main>
  );
}
