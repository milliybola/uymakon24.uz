import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { Suspense } from "react";

import { BottomNav, BottomNavView, Footer, FooterView, Header, HeaderView } from "@/components/Chrome";
import { isProduction, site } from "@/lib/site";

import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}: ${site.region}da uy, yer va do‘kon e’lonlari`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "G‘allaorol uy sotiladi",
    "G‘allaorol kvartira",
    "G‘allaorol yer uchastkasi",
    "G‘allaorol ijara",
    "Jizzax uy-joy",
    "uy sotish",
    "kvartira ijara",
    "do‘kon sotiladi",
  ],
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    siteName: site.name,
    url: "/",
  },
  robots: { index: isProduction, follow: isProduction },
};

export const viewport: Viewport = { themeColor: "#0f766e" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="uz" className={`${inter.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col bg-slate-50 font-sans">
        <Suspense fallback={<HeaderView path="" />}>
          <Header />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Suspense fallback={<FooterView path="" />}>
          <Footer />
        </Suspense>
        <Suspense fallback={<BottomNavView path="" />}>
          <BottomNav />
        </Suspense>
      </body>
    </html>
  );
}
