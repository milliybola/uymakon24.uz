# uymakon24.uz — sayt (Next.js)

UyMakon24 ko‘chmas mulk platformasining sayti. Hozir ishga tushishdan oldingi **landing sahifa**: loyihani tanishtiradi va arizalarni yig‘adi. Arizalar Django backendga (`POST /api/v1/leads`) yuboriladi va admin panelda **Arizalar** bo‘limida ko‘rinadi.

- Next.js 16 (App Router, Cache Components), TypeScript, Tailwind CSS 4
- Hosting: Vercel

## Ishga tushirish

```bash
npm install
cp .env.example .env.local   # qiymatlarni to‘ldiring
npm run dev                  # http://localhost:3000
npm run build && npm start   # production tekshiruvi
```

## Muhit o‘zgaruvchilari (Vercel → Settings → Environment Variables)

| O‘zgaruvchi | Vazifasi |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Saytning ochiq manzili: `https://uymakon24.uz` |
| `NEXT_PUBLIC_TELEGRAM` | Telegram kanal yoki username, `@` belgisisiz. Bo‘sh bo‘lsa, tugma ko‘rinmaydi. |
| `NEXT_PUBLIC_PHONE` | Aloqa telefoni: `+998901234567`. Bo‘sh bo‘lsa, ko‘rinmaydi. |
| `API_BASE` | Django API manzili, masalan `https://api.uymakon24.uz/api/v1/`. Faqat serverda ishlatiladi. |
| `LEADS_API_KEY` | Backenddagi `LEADS_API_KEY` bilan bir xil tasodifiy kalit. U backendga haqiqiy foydalanuvchi IP manzilini yetkazadi va limitlar to‘g‘ri ishlaydi. |

## Tuzilma

```
src/app/page.tsx              landing: hero, kategoriyalar, qanday ishlaydi, imkoniyatlar, ariza, savollar
src/app/actions.ts            ariza yuborish (Server Action → backend)
src/app/maxfiylik/page.tsx    maxfiylik siyosati
src/app/sitemap.ts, robots.ts, opengraph-image.tsx, icon.svg   SEO
src/components/LeadForm.tsx   ariza shakli (telefon maskasi, xatolar)
src/lib/site.ts               nom, manzil, kontaktlar
```

**Arizalardan himoya:**
- **Bot tuzog‘i:** shaklda odamga ko‘rinmaydigan maydon bor, bot uni to‘ldirib qo‘yadi va ariza qabul qilinmaydi.
- **Limit:** bitta IP manzildan soatiga 10 ta ariza.
- **Takror arizalar:** bir kun ichida bir xil raqam va bir xil maqsad bilan kelgan arizalar birlashtiriladi.

**Telegram xabarnomasi:** backendda `TELEGRAM_BOT_TOKEN` va `TELEGRAM_LEADS_CHAT_ID` berilsa, har bir yangi ariza Telegram’ga xabar bo‘lib keladi.
