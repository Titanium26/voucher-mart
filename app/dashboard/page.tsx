"use client";

import TicketIcon from "../login/ticketIcon";
import AccountModal from "./accountModal";
import { useEffect, useState } from "react";
import { prisma } from "@/lib/db";
import { sha256Hex } from "@/lib/crypto";
import Image from "next/image";


type Me = { id: number; username: string; email: string };


/* app/dashboard/page.tsx */
export default function Dashboard() {

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/me", { cache: "no-store" });
        if (!res.ok) {
          // Not logged in → send to /login
          window.location.href = "/login";
          return;
        }
        const data = (await res.json()) as Me;
        if (!cancelled) setMe(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <main className="p-6 text-white">
        <h1 className="text-2xl font-bold">Loading…</h1>
      </main>
    );
  }
  


  const featured = [
    { brand: "Domino’s", logo: "/logos/dominos.png", title: "50% off", from: "Apr 20", to: "Apr 30" },
    { brand: "Adidas", logo: "/logos/adidas.jpg", title: "25% off", from: "Apr 24", to: "Apr 30" },
    { brand: "Uber Eats", logo: "/logos/uber_eats.jpg", title: "$20 off", from: "Apr 20", to: "Apr 31" },
    { brand: "Lenovo", logo: "/logos/lenovo.jpg", title: "$200 off", from: "Dec", to: "Feb" },
  ];

  const newest = [
    { brand: "Burger King", logo: "/logos/burger_king.png", title: "20% off", right: "$20" },
    { brand: "H&M", logo: "/logos/h&m.jpg", title: "15% off", right: "$15" },
    { brand: "GAP", logo: "/logos/gap.png", title: "Buy one/free", right: "Free" },
    { brand: "Samsung", logo: "/logos/samsung.png", title: "$100 off", right: "$25" },
  ];

  const categories = [
    { name: "Food",     icon: "🍔" },
    { name: "Fashion",  icon: "👟" },
    { name: "Travel",   icon: "✈️" },
    { name: "Beauty",   icon: "💄" },
    { name: "Electronics", icon: "💻" },
    { name: "Fitness",  icon: "🏋️" },
  ];

  return (
    <>
    <main className="min-h-screen bg-black text-white">
      
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TicketIcon className="h-9 w-14" />
            <span className="font-semibold text-lg">VoucherMart</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
            <a className="hover:text-zinc-300" href="#">Browse Categories</a>
            <a className="hover:text-zinc-300" href="#">Shop</a>
            <a className="hover:text-zinc-300" href="#">Deals</a>
            <a className="hover:text-zinc-300" href="#">Find Stores</a>
            <a className="hover:text-zinc-300" href="#">Special Offer</a>
            <a className="hover:text-zinc-300" href="#">Help</a>
            <button className="ml-2 rounded-full border px-3 py-1">🔍</button>
          </nav>

          {/* Account and Logout Buttons */}
          <div className="flex items-center gap-3">
            {/* Logout Button */}
            <button
              onClick={async () => {
                try {
                  await fetch("/api/auth/logout", { method: "POST" });
                  window.location.href = "/login"; // redirect after logout
                } catch (err) {
                  console.error("Logout failed", err);
                }
              }}
              className="flex rounded-lg items-center gap-2 px-4 py-2 text-sm text-white ombre-gradient transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                  clipRule="evenodd"
                />
              </svg>
              Logout
            </button>

            
            {/* Profile Button */}
            <button 
              onClick={() => setIsAccountModalOpen(true)}
              className="rounded-full border border-purple-700 p-2 hover:bg-[#b14cff] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

        </div>
      </header>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome message */}
      <h1 className="text-3xl font-bold mb-4">
          {me ? `Welcome, ${me.username}` : "Welcome"}
      </h1>
        {/* HERO + SIDE PROMOS */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: hero */}
          <div className="lg:col-span-2 rounded-3xl overflow-hidden bg-[#1c1b1b] p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-5xl md:text-6xl font-extrabold leading-tight">
                30% Off <br /> Winter Sale
              </p>
              <button className="mt-6 inline-flex items-center rounded-xl ombre-gradient px-5 py-3 font-semibold text-white hover:bg-rose-600">
                Redeem Offer
              </button>
              <p className="mt-2 text-xs text-zinc-400">*Terms & conditions apply</p>
            </div>
            <div className="relative">
            <img
              src="/promos/canada_goose.jpg"
              alt="Winter Sale Hero"
              className="w-full h-full object-contain rounded-2xl"
            />
            </div>
          </div>

          {/* Right: two promo tiles */}
          <div className="grid grid-rows-2 gap-6">
            <div className="rounded-3xl bg-[#1c1b1b] p-6 flex items-center justify-between">
              <div>
                <p className="text-zinc-300 text-sm">Enjoy Amazing</p>
                <p className="font-semibold text-xl">EVERYDAY</p>
                <p className="text-zinc-300 text-sm">Dining Deals</p>
              </div>
              <img
                  src="/promos/butter_chicken.png"
                  alt="Dining deals"
                  className="h-45 w-45 rounded-full object-cover"
              />
            </div>
            <div className="rounded-3xl bg-[#1c1b1b] p-6 flex items-center justify-between">
              <div>
                <p className="text-zinc-300 text-sm">Save up to</p>
                <p className="font-semibold text-xl">30%</p>
                <p className="text-zinc-300 text-sm">Travel Special Offers</p>
              </div>
              <img
                  src="/promos/osaka_castle.jpg"
                  alt="Travel offers"
                  className="h-45 w-45 rounded-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 ">
          <StatCard icon="🏆" title="#1" subtitle="Voucher Platform" />
          <StatCard icon="❤️" title="25k+" subtitle="Client Testimonials" />
          <StatCard icon="🎟️" title="1 Million" subtitle="Vouchers Redeemed" />
        </section>

        {/* FEATURED VOUCHERS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Featured Vouchers</h2>
            <div className="text-sm text-zinc-300 flex items-center gap-2">
              <span>Limited time only</span>
              <span className="rounded-md bg-zinc-900 px-2 py-1 font-mono">02 : 16 : 45</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((v, i) => (
              <VoucherCard key={i} {...v} />
            ))}
          </div>
        </section>

        {/* PROMO STRIPES */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Banner
            title="Bundle & Save"
            subtitle="Buy more, save more"
            bg="from-sky-400 to-blue-500"
            image="/banner/bundle.jpg"
          />
          <Banner
            title="BOGO"
            subtitle="Buy one, get one free"
            bg="from-violet-500 to-fuchsia-500"
            image="/banner/bogo.png"
          />
          <Banner
            title="Special Student Deals"
            bg="from-pink-500 to-rose-500"
            image="/banner/school.jpg"
          />
        </section>

        {/* NEWEST VOUCHERS */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Newest Vouchers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newest.map((v, i) => (
              <NewestCard key={i} {...v} />
            ))}
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((c) => (
              <div
                key={c.name}
                className="rounded-2xl bg-[#1c1b1b] p-4 text-center hover:shadow-md transition"
              >
                <div className="text-2xl">{c.icon}</div>
                <div className="mt-2 text-sm font-medium">{c.name}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
     {/* ACCOUNT MODAL */}
    <AccountModal 
      isOpen={isAccountModalOpen} 
      onClose={() => setIsAccountModalOpen(false)} 
    />
    </>
  );
}

/* --- Small presentational components --- */



function StatCard({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div className="rounded-3xl bg-[#1c1b1b] p-6 flex items-center gap-4 shadow-[0_1px_0_0_rgba(0,0,0,0.02)]">
      <div className="h-12 w-12 rounded-2xl bg-zinc-100 grid place-items-center text-xl">
        {icon}
      </div>
      <div>
        <div className="text-lg font-semibold">{title}</div>
        <div className="text-sm text-zinc-300">{subtitle}</div>
      </div>
    </div>
  );
}

function VoucherCard({
  brand,
  logo,
  title,
  from,
  to,
}: {
  brand: string;
  logo: string;
  title: string;
  from: string;
  to: string;
}) {
  return (
    <div className="rounded-3xl bg-[#1c1b1b] p-5 space-y-4 hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <div className="h-16 w-16 rounded-xl bg-zinc-100 overflow-hidden flex items-center justify-center">
          {/* replace with <Image> if you like */}
          <img src={logo} alt={`${brand} logo`} className="w-full h-full object-contain p-2" />
        </div>
        <div className="font-medium">{brand}</div>
      </div>
      <div className="text-zinc-300">{title}</div>
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <span>{to}</span>
        <span>{from}</span>
      </div>
    </div>
  );
}

function Banner({
  title,
  subtitle,
  bg,
  image,
}: {
  title: string;
  subtitle?: string;
  bg: string;
  image?: string; // optional image path
}) {
  return (
    <div
      className={`rounded-3xl p-6 bg-gradient-to-tr ${bg} flex items-center justify-between`}
    >
      <div>
        <div className="font-semibold text-lg">{title}</div>
        {subtitle && <div className="text-sm text-zinc-300">{subtitle}</div>}
      </div>

      {image ? (
        <div className="w-30 h-30 relative rounded-2xl overflow-hidden object-contain p-2">
          <Image
            src={image}
            alt={title}
            fill
            className="object-contain"
          />
        </div>
      ) : (
        <div className="h-16 w-16 rounded-2xl bg-white/60 grid place-items-center text-zinc-400 text-xs">
          image
        </div>
      )}
    </div>
  );
}

function NewestCard({
  brand,
  logo,
  title,
  right,
}: {
  brand: string;
  logo: string;
  title: string;
  right: string;
}) {
  return (
    <div className="rounded-3xl bg-[#1c1b1b] p-5 hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-13 w-13 rounded-xl bg-zinc-100 overflow-hidden flex items-center justify-center">
            <img src={logo} alt={`${brand} logo`} className="w-full h-full object-contain p-2" />
          </div>
          <div className="font-medium">{brand}</div>
        </div>
        <div className="text-zinc-400 text-sm">{right}</div>
      </div>
      <div className="mt-4 text-zinc-300">{title}</div>
    </div>
  );
}
