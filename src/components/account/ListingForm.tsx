"use client";

/* eslint-disable @next/next/no-img-element -- yuklangan rasmlar backenddan tayyor o‘lchamda */
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { deleteImage, saveListing, submitListing, uploadImage } from "@/app/account-actions";
import { PickMap } from "@/components/map";
import { CATEGORIES } from "@/lib/format";
import type { CategorySlug, Deal, ListingInput, Mahalla, MyListing } from "@/lib/types";

type Img = { id: number; thumb: string };

const RENOVATION = [
  ["none", "Ta’mirsiz"],
  ["cosmetic", "Kosmetik"],
  ["euro", "Yevro"],
  ["new", "Yangi qurilgan"],
] as const;
const AMENITIES = [
  ["gas", "Gaz"],
  ["water", "Suv"],
  ["electricity", "Svet"],
  ["sewage", "Kanalizatsiya"],
  ["furnished", "Mebelli"],
  ["documents", "Hujjatlari bor"],
] as const;
/** Kategoriyaga qarab ko‘rinadigan maydonlar (backend ham tekshiradi) */
const FIELDS: Record<CategorySlug, ("rooms" | "area_m2" | "land_area_sotix" | "floor" | "total_floors")[]> = {
  hovli: ["rooms", "area_m2", "land_area_sotix", "total_floors"],
  kvartira: ["rooms", "area_m2", "floor", "total_floors"],
  yer: ["land_area_sotix"],
  tijorat: ["area_m2", "floor"],
};
const LABEL = { rooms: "Xonalar", area_m2: "Maydon, m²", land_area_sotix: "Yer, sotix", floor: "Qavat", total_floors: "Jami qavat" };
const MAX_SIDE = 1600;

const dealOf = (l?: MyListing | null): Deal => (!l ? "sale" : l.deal_type === "sale" ? "sale" : l.rent_period === "daily" ? "daily" : "rent");
const n = (v: string) => (v.trim() === "" ? null : Number(v.replace(",", ".").replace(/\s/g, "")));

/** Rasmni brauzerda kichraytirish (yuklash tez bo‘lsin, hajm cheklovidan oshmasin) */
async function shrink(file: File): Promise<File> {
  try {
    const bmp = await createImageBitmap(file);
    const k = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * k);
    c.height = Math.round(bmp.height * k);
    c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
    const blob = await new Promise<Blob | null>((r) => c.toBlob(r, "image/jpeg", 0.85));
    return blob ? new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" }) : file;
  } catch {
    return file; // masalan HEIC: brauzer ochmasa, asl fayl yuboriladi
  }
}

export function ListingForm({ initial, mahallas, phone }: { initial?: MyListing | null; mahallas: Mahalla[]; phone: string }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [code, setCode] = useState<number | null>(initial?.code ?? null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, start] = useTransition();
  const [uploading, setUploading] = useState(0);
  const [images, setImages] = useState<Img[]>((initial?.images ?? []).map((i) => ({ id: (i as unknown as { id: number }).id, thumb: i.thumb })));

  const [deal, setDeal] = useState<Deal>(dealOf(initial));
  const [category, setCategory] = useState<CategorySlug>(initial?.category ?? "hovli");
  const [f, setF] = useState(() => ({
    title: initial?.title ?? "",
    price: initial?.price ? String(initial.price) : "",
    currency: initial?.currency ?? "UZS",
    is_negotiable: initial?.is_negotiable ?? false,
    rooms: initial?.rooms != null ? String(initial.rooms) : "",
    area_m2: initial?.area_m2 != null ? String(initial.area_m2) : "",
    land_area_sotix: initial?.land_area_sotix != null ? String(initial.land_area_sotix) : "",
    floor: initial?.floor != null ? String(initial.floor) : "",
    total_floors: initial?.total_floors != null ? String(initial.total_floors) : "",
    description: initial?.description ?? "",
    mahalla: initial?.mahalla ?? null,
    address: initial?.address ?? "",
    contact_name: initial?.contact_name ?? "",
    phone: initial?.phone ?? phone,
    telegram_username: initial?.telegram_username ?? "",
  }));
  const [attrs, setAttrs] = useState<Record<string, boolean | string>>(initial?.attributes ? { ...(initial.attributes as Record<string, boolean | string>) } : {});
  const [point, setPoint] = useState<[number, number] | null>(initial?.lat != null && initial?.lng != null ? [Number(initial.lat), Number(initial.lng)] : null);
  const set = (k: keyof typeof f, v: string | boolean | number | null) => setF((x) => ({ ...x, [k]: v }));
  const isDraft = !initial || initial.status === "draft";

  const input = (): ListingInput => {
    const fields = FIELDS[category];
    const num = (k: (typeof fields)[number]) => (fields.includes(k) ? n(f[k]) : null);
    return {
      deal_type: deal === "sale" ? "sale" : "rent",
      rent_period: deal === "sale" ? "" : deal === "daily" ? "daily" : "monthly",
      category,
      title: f.title.trim(),
      description: f.description.trim(),
      price: Number(f.price.replace(/\D/g, "")) || 0,
      currency: f.currency as ListingInput["currency"],
      is_negotiable: f.is_negotiable,
      mahalla: f.mahalla,
      address: f.address.trim(),
      lat: point?.[0] ?? null,
      lng: point?.[1] ?? null,
      rooms: num("rooms"),
      area_m2: num("area_m2"),
      land_area_sotix: num("land_area_sotix"),
      floor: num("floor"),
      total_floors: num("total_floors"),
      attributes: category === "yer" ? Object.fromEntries(Object.entries(attrs).filter(([k]) => k !== "renovation" && k !== "furnished")) : attrs,
      contact_name: f.contact_name.trim(),
      phone: f.phone.trim(),
      telegram_username: f.telegram_username.trim().replace(/^@/, ""),
    };
  };

  /** Qadamni tekshirish va qoralamani saqlash */
  const save = (next: () => void | Promise<void>) => {
    const e: Record<string, string> = {};
    if (step === 1) {
      if (f.title.trim().length < 5) e.title = "Sarlavha kamida 5 ta harf.";
      if (!(Number(f.price.replace(/\D/g, "")) > 0)) e.price = "Narxni kiriting.";
    }
    setErrors(e);
    if (Object.keys(e).length) return;
    start(async () => {
      const r = await saveListing(code, input());
      if (r.errors) {
        setErrors(r.errors);
        return;
      }
      setCode(r.code!);
      await next();
    });
  };

  const addFiles = async (files: FileList | null) => {
    if (!files || !code) return;
    const list = Array.from(files).slice(0, 15 - images.length);
    setErrors({});
    for (const file of list) {
      setUploading((u) => u + 1);
      const fd = new FormData();
      fd.set("image", await shrink(file));
      const r = await uploadImage(code, fd);
      setUploading((u) => u - 1);
      if (r.image) setImages((x) => [...x, { id: r.image!.id, thumb: r.image!.thumb }]);
      else setErrors({ image: r.error ?? "Rasmni yuklab bo‘lmadi." });
    }
  };

  const finish = () =>
    save(async () => {
      if (!images.length) return setErrors({ image: "Kamida bitta rasm qo‘shing." });
      if (isDraft || initial?.status === "rejected") {
        const r = await submitListing(code!);
        if (!r.ok) return setErrors({ detail: r.error ?? "Yuborib bo‘lmadi." });
      }
      router.push("/mening-elonlarim?yuborildi=1");
      router.refresh();
    });

  const chip = (on: boolean) =>
    `rounded-xl border-2 px-3 py-2 text-sm font-semibold transition ${on ? "border-brand bg-brand-50 text-brand" : "border-slate-200 bg-white hover:border-slate-300"}`;
  const err = (k: string) => errors[k] && <p className="mt-1 text-sm text-red-600">{errors[k]}</p>;
  const label = "mb-1.5 mt-4 block text-sm font-semibold text-slate-600";

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight">{initial ? "E’lonni tahrirlash" : "Yangi e’lon"}</h1>
        <span className="text-sm font-semibold text-slate-500">{step}/3</span>
      </div>
      <div className="mt-3 flex gap-1.5">
        {[1, 2, 3].map((s) => (
          <i key={s} className={`h-1.5 flex-1 rounded-full ${s <= step ? "bg-brand" : "bg-slate-200"}`} />
        ))}
      </div>
      {initial && !isDraft && initial.status !== "rejected" && (
        <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">O‘zgartirilgan e’lon qayta tekshiruvga tushadi va tasdiqlanguncha saytda ko‘rinmaydi.</p>
      )}
      {initial?.status === "rejected" && initial.reject_reason && (
        <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-800">Rad etish sababi: {initial.reject_reason}</p>
      )}

      <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-5 sm:p-7">
        {step === 1 && (
          <>
            <span className={label + " mt-0"}>Nima qilmoqchisiz?</span>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  ["sale", "Sotaman"],
                  ["rent", "Ijaraga"],
                  ["daily", "Kunlik"],
                ] as const
              ).map(([k, t]) => (
                <button
                  key={k}
                  type="button"
                  className={chip(deal === k)}
                  onClick={() => {
                    setDeal(k);
                    if (k !== "sale" && category === "yer") setCategory("hovli");
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
            <span className={label}>Mulk turi</span>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {CATEGORIES.filter((c) => deal === "sale" || c.slug !== "yer").map((c) => (
                <button key={c.slug} type="button" className={chip(category === c.slug) + " py-3"} onClick={() => setCategory(c.slug)}>
                  {c.icon} {c.name}
                </button>
              ))}
            </div>
            {err("category")}
            {err("deal_type")}
            <label className={label} htmlFor="title">
              Sarlavha
            </label>
            <input id="title" className="input" maxLength={150} value={f.title} onChange={(e) => set("title", e.target.value)} placeholder="Masalan: 4 xonali hovli, 6 sotix" />
            {err("title")}
            <label className={label} htmlFor="price">
              Narx{deal === "rent" ? " (oyiga)" : deal === "daily" ? " (kuniga)" : ""}
            </label>
            <div className="flex gap-2">
              <input
                id="price"
                className="input"
                inputMode="numeric"
                value={f.price ? Number(f.price.replace(/\D/g, "") || 0).toLocaleString("ru-RU") : ""}
                onChange={(e) => set("price", e.target.value.replace(/\D/g, "").slice(0, 13))}
                placeholder="450 000 000"
              />
              {(["UZS", "USD"] as const).map((c) => (
                <button key={c} type="button" className={chip(f.currency === c) + " shrink-0"} onClick={() => set("currency", c)}>
                  {c === "UZS" ? "so‘m" : "$"}
                </button>
              ))}
            </div>
            {err("price")}
            <label className="mt-3 flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" className="size-4 accent-brand" checked={f.is_negotiable} onChange={(e) => set("is_negotiable", e.target.checked)} /> Kelishiladi
            </label>
          </>
        )}

        {step === 2 && (
          <>
            <div className="grid grid-cols-2 gap-x-3 sm:grid-cols-3">
              {FIELDS[category].map((k) => (
                <div key={k}>
                  <label className={label} htmlFor={k}>
                    {LABEL[k]}
                  </label>
                  <input id={k} className="input" inputMode="decimal" value={f[k]} onChange={(e) => set(k, e.target.value.replace(/[^\d.,]/g, "").slice(0, 8))} />
                  {err(k)}
                </div>
              ))}
            </div>
            {err("floor") && null}
            {category !== "yer" && (
              <>
                <span className={label}>Ta’mir</span>
                <div className="flex flex-wrap gap-2">
                  {RENOVATION.map(([k, t]) => (
                    <button key={k} type="button" className={chip(attrs.renovation === k)} onClick={() => setAttrs((a) => ({ ...a, renovation: a.renovation === k ? "" : k }))}>
                      {t}
                    </button>
                  ))}
                </div>
              </>
            )}
            <span className={label}>Qulayliklar</span>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.filter(([k]) => category !== "yer" || k !== "furnished").map(([k, t]) => (
                <button key={k} type="button" className={chip(attrs[k] === true)} onClick={() => setAttrs((a) => ({ ...a, [k]: a[k] === true ? false : true }))}>
                  {attrs[k] === true ? "✓ " : ""}
                  {t}
                </button>
              ))}
            </div>
            <label className={label} htmlFor="desc">
              Tavsif
            </label>
            <textarea id="desc" className="input" rows={5} maxLength={3000} value={f.description} onChange={(e) => set("description", e.target.value)} placeholder="Joylashuvi, holati, nimalar bor, hujjatlari…" />
            {err("description")}
          </>
        )}

        {step === 3 && (
          <>
            <span className={label + " mt-0"}>Rasmlar (1–15 ta, birinchisi muqova)</span>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {images.map((img, i) => (
                <div key={img.id} className="relative aspect-square overflow-hidden rounded-xl bg-slate-100">
                  <img src={img.thumb} alt={`Rasm ${i + 1}`} className="size-full object-cover" />
                  {i === 0 && <span className="absolute bottom-1 left-1 rounded-md bg-brand px-1.5 py-0.5 text-[10px] font-extrabold text-white">Muqova</span>}
                  <button
                    type="button"
                    aria-label="Rasmni o‘chirish"
                    className="absolute top-1 right-1 grid size-6 place-items-center rounded-full bg-black/60 text-sm text-white"
                    onClick={async () => {
                      await deleteImage(code!, img.id);
                      setImages((x) => x.filter((y) => y.id !== img.id));
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
              {Array.from({ length: uploading }, (_, i) => (
                <div key={`u${i}`} className="aspect-square animate-pulse rounded-xl bg-slate-100" />
              ))}
              {images.length + uploading < 15 && (
                <label className="grid aspect-square cursor-pointer place-items-center rounded-xl border-2 border-dashed border-slate-300 text-center text-sm text-slate-500 hover:border-brand hover:text-brand">
                  <span>
                    ＋<br />
                    Rasm qo‘shish
                  </span>
                  <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => addFiles(e.target.files).then(() => (e.target.value = ""))} />
                </label>
              )}
            </div>
            {err("image")}
            <label className={label} htmlFor="mahalla">
              Mahalla
            </label>
            <select id="mahalla" className="input" value={f.mahalla ?? ""} onChange={(e) => set("mahalla", e.target.value ? Number(e.target.value) : null)}>
              <option value="">Tanlang</option>
              {mahallas.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            {err("mahalla")}
            <label className={label} htmlFor="address">
              Manzil (ko‘cha, mo‘ljal)
            </label>
            <input id="address" className="input" maxLength={255} value={f.address} onChange={(e) => set("address", e.target.value)} placeholder="Masalan: Mustaqillik ko‘chasi, maktab yonida" />
            <span className={label}>Xaritada belgilang (ixtiyoriy)</span>
            <div className="relative isolate h-56 overflow-hidden rounded-xl border-2 border-slate-200">
              <PickMap value={point} onChange={setPoint} />
            </div>
            <p className="mt-1 text-xs text-slate-500">{point ? "Belgini surib aniqlashtirishingiz mumkin." : "Xaritani bosing: e’lon xaritada ko‘rinadi."}</p>
            {err("lat")}
            <div className="grid gap-x-3 sm:grid-cols-3">
              <div>
                <label className={label} htmlFor="cname">
                  Ismingiz
                </label>
                <input id="cname" className="input" maxLength={100} value={f.contact_name} onChange={(e) => set("contact_name", e.target.value)} />
              </div>
              <div>
                <label className={label} htmlFor="cphone">
                  Telefon
                </label>
                <input id="cphone" className="input" inputMode="tel" maxLength={20} value={f.phone} onChange={(e) => set("phone", e.target.value)} />
                {err("phone")}
              </div>
              <div>
                <label className={label} htmlFor="ctg">
                  Telegram (ixtiyoriy)
                </label>
                <input id="ctg" className="input" maxLength={64} value={f.telegram_username} onChange={(e) => set("telegram_username", e.target.value)} placeholder="@username" />
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500">Yuborganingizdan so‘ng e’lon moderator tekshiruvidan o‘tadi. Natija Telegram’da keladi.</p>
          </>
        )}

        {(errors.detail || errors.non_field_errors) && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{errors.detail || errors.non_field_errors}</p>}

        <div className="mt-6 flex gap-2">
          {step > 1 && (
            <button type="button" onClick={() => setStep(step - 1)} className="rounded-2xl border-2 border-slate-200 px-5 py-3 font-bold">
              ← Orqaga
            </button>
          )}
          {step < 3 ? (
            <button type="button" disabled={pending} onClick={() => save(() => setStep(step + 1))} className="flex-1 rounded-2xl bg-brand py-3 font-bold text-white disabled:opacity-60">
              {pending ? "Saqlanmoqda…" : "Davom etish →"}
            </button>
          ) : (
            <button type="button" disabled={pending || uploading > 0} onClick={finish} className="flex-1 rounded-2xl bg-brand py-3 font-bold text-white disabled:opacity-60">
              {pending ? "Yuborilmoqda…" : isDraft || initial?.status === "rejected" ? "Tekshiruvga yuborish" : "Saqlash"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
