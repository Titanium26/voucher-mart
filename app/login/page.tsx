
// app/login/page.tsx
import AutoScrollGallery from "./autoScrollGallery";
import TicketIcon from "./ticketIcon";
import AuthPanel from "./authPanel";



export default function LoginPage() {
  

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-[520px_1fr]">
      <AuthPanel />

      {/* RIGHT: Auto-scrolling image column */}
      <section className="relative hidden lg:block overflow-hidden">
        <AutoScrollGallery/>
      </section>
    </main>
  );
}
