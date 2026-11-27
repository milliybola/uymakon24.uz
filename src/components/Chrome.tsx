"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { site } from "@/lib/site";

import { FavoritesCount, HeartIcon } from "./FavoriteButton";
import { Logo } from "./Logo";

const NAV = [
  { href: "/", label: "Sotuv" },
  { href: "/?deal=rent", label: "Ijara" },
  { href: "/?deal=daily", label: "Kunlik" },
  { href: "/xarita", label: "Xarita" },
  { href: "/xaridorlar", label: "Xaridorlar" },
];

export const Header = () => <HeaderView path={usePathname()} />;

/** path="" — prerender paytidagi ko‘rinish (faol bo‘lim belgilanmagan) */
export function HeaderView({ path }: { path: string }) {
  return (
    <header className="sticky top-0 z-[1000] border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:h-16 sm:px-6">
        <Logo />
        <nav className="hidden gap-1 text-[15px] font-semibold text-slate-700 md:flex">
          {NAV.map((n) => {
            const on = n.href.startsWith("/x") && path.startsWith(n.href);
            return (
              <Link key={n.label} href={n.href} className={`rounded-lg px-3 py-2 hover:bg-slate-50 ${on ? "bg-brand-50 text-brand" : ""}`}>
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex-1" />
        <Link href="/sevimlilar" aria-label="Sevimlilar" className="relative grid size-10 place-items-center rounded-xl border border-slate-200 bg-white">
          <HeartIcon className="size-5" />
          <FavoritesCount />
        </Link>
        <Link href="/elon-berish" className="hidden rounded-xl bg-brand px-4 py-2.5 font-bold text-white hover:bg-brand-700 sm:block">
          + E’lon berish
        </Link>
      </div>
    </header>
  );
}

const TABS = [
  { href: "/", label: "Asosiy", icon: "M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" },
  { href: "/xarita", label: "Xarita", icon: "M9 4 3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14" },
  { href: "/elon-berish", label: "E’lon berish", icon: "" },
  { href: "/sevimlilar", label: "Sevimlilar", icon: "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" },
  { href: "/xaridorlar", label: "Xaridorlar", icon: "M16 11a4 4 0 1 0-8 0M4 21a8 8 0 0 1 16 0M12 7V3" },
];

/** Telefondagi pastki menyu */
export const BottomNav = () => <BottomNavView path={usePathname()} />;

export function BottomNavView({ path }: { path: string }) {
  if (path.startsWith("/e/")) return null; // e’lon sahifasida o‘rniga qo‘ng‘iroq paneli turadi
  return (
    <nav className="fixed inset-x-0 bottom-0 z-[1000] flex justify-around border-t border-slate-200 bg-white px-1 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
      {TABS.map((t) => {
        const on = t.href === "/" ? path === "/" : path.startsWith(t.href);
        if (!t.icon) {
          return (
            <Link key={t.href} href={t.href} className="flex flex-col items-center gap-0.5 text-[11px] font-semibold text-slate-500">
              <span className="-mt-6 grid size-12 place-items-center rounded-full bg-brand text-2xl text-white shadow-lg shadow-brand/40">+</span>
              {t.label}
            </Link>
          );
        }
        return (
          <Link key={t.href} href={t.href} className={`flex flex-col items-center gap-0.5 text-[11px] font-semibold ${on ? "text-brand" : "text-slate-500"}`}>
            <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
              <path d={t.icon} />
            </svg>
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}

export const Footer = () => <FooterView path={usePathname()} />;

export function FooterView({ path }: { path: string }) {
  if (path.startsWith("/xarita")) return null; // xarita butun ekranni egallaydi
  return (
    <footer className="mt-12 bg-slate-900 pt-8 pb-28 text-sm text-slate-400 md:pb-8">
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-4 px-4 sm:px-6">
        <span>© 2026 {site.name} · {site.region}</span>
        <div className="flex gap-4">
          <Link href="/elon-berish" className="hover:text-white">E’lon berish</Link>
          <Link href="/maxfiylik" className="hover:text-white">Maxfiylik</Link>
          {site.telegram && (
            <a href={`https://t.me/${site.telegram}`} className="hover:text-white" target="_blank" rel="noopener">Telegram</a>
          )}
        </div>
      </div>
    </footer>
  );
}
