import Link from "next/link";

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight" aria-label="UyMakon24">
      <svg viewBox="0 0 32 32" className="size-9" aria-hidden="true">
        <rect width="32" height="32" rx="9" fill="#0f766e" />
        <path d="M8 15.5 16 9l8 6.5V23a1 1 0 0 1-1 1h-4.5v-5h-5v5H9a1 1 0 0 1-1-1z" fill="#fff" />
        <circle cx="24" cy="9" r="3" fill="#f59e0b" />
      </svg>
      <span className={dark ? "text-white" : "text-slate-900"}>
        UyMakon<span className={dark ? "text-brand-300" : "text-brand"}>24</span>
      </span>
    </Link>
  );
}
