"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { checkLogin, startLogin } from "@/app/account-actions";

type State = { kind: "idle" } | { kind: "waiting"; botUrl: string } | { kind: "error"; message: string };

/** Telegram bot orqali kirish: token olinadi, bot ochiladi, tasdiqlanguncha har 2 soniyada tekshiriladi. */
export function LoginPanel({ title = "Telegram orqali kiring", text }: { title?: string; text?: string }) {
  const router = useRouter();
  const [state, setState] = useState<State>({ kind: "idle" });
  const token = useRef<string | null>(null);

  useEffect(() => {
    if (state.kind !== "waiting") return;
    let stop = false;
    const started = Date.now();
    const tick = async () => {
      if (stop || !token.current) return;
      const r = await checkLogin(token.current);
      if (stop) return;
      if (r === "ok") return router.refresh();
      if (r === "expired" || Date.now() - started > 10 * 60_000) {
        return setState({ kind: "error", message: "Kirish muddati tugadi. Qayta urinib ko‘ring." });
      }
      setTimeout(tick, 2000);
    };
    const t = setTimeout(tick, 1500);
    return () => {
      stop = true;
      clearTimeout(t);
    };
  }, [state, router]);

  const begin = async () => {
    // Safari va mobil brauzerlar asinxron ochilgan oynani bloklamasligi uchun oyna oldindan ochiladi
    const win = window.open("", "_blank");
    const r = await startLogin();
    if ("error" in r) {
      win?.close();
      return setState({ kind: "error", message: r.error });
    }
    token.current = r.token;
    if (r.botUrl) {
      if (win) win.location.href = r.botUrl;
      else window.location.href = r.botUrl;
    } else win?.close(); // sinov rejimi: bot yo‘q, darhol kiriladi
    setState({ kind: "waiting", botUrl: r.botUrl });
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-xl shadow-slate-900/5 sm:p-8">
      <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#229ed9] text-3xl text-white">✈</div>
      <h1 className="mt-4 text-2xl font-extrabold tracking-tight">{title}</h1>
      <p className="mt-2 text-slate-600">{text ?? "E’lon berish bepul. Raqamingiz Telegram orqali tasdiqlanadi: SMS kerak emas."}</p>
      <ol className="mt-5 grid gap-1.5 text-left text-sm text-slate-700">
        <li>1. Pastdagi tugmani bosing: bot ochiladi.</li>
        <li>
          2. Botda <b>“Start”</b>, keyin <b>“📱 Raqamni yuborish”</b>ni bosing.
        </li>
        <li>3. Shu sahifaga qayting: kirish o‘zi yakunlanadi.</li>
      </ol>
      <button onClick={begin} disabled={state.kind === "waiting"} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#229ed9] py-3.5 font-bold text-white disabled:opacity-70">
        ✈ Telegram orqali kirish
      </button>
      {state.kind === "waiting" && (
        <div className="mt-4 text-sm text-slate-500" role="status">
          <span className="mr-2 inline-block size-2.5 animate-pulse rounded-full bg-[#229ed9]" />
          Botda tasdiqlash kutilmoqda…
          {state.botUrl && (
            <a href={state.botUrl} target="_blank" rel="noopener" className="mt-2 block font-semibold text-[#229ed9]">
              Bot ochilmadimi? Shu yerni bosing
            </a>
          )}
        </div>
      )}
      {state.kind === "error" && <p className="mt-4 text-sm text-red-600">{state.message}</p>}
      <p className="mt-6 text-sm text-slate-500">
        Uy izlayapsizmi?{" "}
        <Link href="/ariza" className="font-semibold text-brand">
          Ariza qoldiring
        </Link>
      </p>
    </div>
  );
}
