import type { Metadata } from "next";

import { FavoritesList } from "./FavoritesList";

export const metadata: Metadata = {
  title: "Sevimlilar",
  robots: { index: false },
};

export default function FavoritesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">♡ Sevimlilar</h1>
      <p className="mt-1 text-slate-500">Saqlangan e’lonlar shu qurilmadagi brauzerda turadi.</p>
      <FavoritesList />
    </div>
  );
}
