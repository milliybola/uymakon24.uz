/** Backend (Django) javoblariga mos turlar. */

export type DealType = "sale" | "rent";
export type RentPeriod = "" | "daily" | "monthly";
export type Currency = "UZS" | "USD";
export type CategorySlug = "hovli" | "kvartira" | "yer" | "tijorat";
/** Saytdagi tab: sotuv, oylik ijara, kunlik ijara */
export type Deal = "sale" | "rent" | "daily";

export type ListingCard = {
  code: number;
  title: string;
  price: number;
  currency: Currency;
  price_uzs: number;
  is_negotiable: boolean;
  deal_type: DealType;
  rent_period: RentPeriod;
  category: CategorySlug;
  mahalla: string | null;
  rooms: number | null;
  area_m2: string | null;
  land_area_sotix: string | null;
  thumb: string | null;
  blurhash: string;
  images_count: number;
  is_featured: boolean;
  status: "active" | "sold" | "rented" | "inactive";
  published_at: string;
  lat?: string | null;
  lng?: string | null;
  /** Backendga keyin qo‘shiladi: kim joylagan va avvalgi narx */
  posted_by?: "owner" | "realtor" | null;
  old_price?: number | null;
};

export type ListingImage = { thumb: string; medium: string; large: string; width: number; height: number; blurhash: string };

export type ListingDetail = ListingCard & {
  description: string;
  district: string;
  address: string;
  lat: string | null;
  lng: string | null;
  floor: number | null;
  total_floors: number | null;
  attributes: Record<string, string | number | boolean>;
  contact_name: string;
  phone: string;
  telegram_username: string;
  images: ListingImage[];
  views_count: number;
  share_url: string;
  updated_at: string;
};

export type Page<T> = { count: number; next: string | null; results: T[] };

export type Buyer = {
  id: number;
  intent: "buy" | "rent";
  category: CategorySlug | "";
  budget: string;
  note: string;
  created_at: string;
};

export type ListingQuery = {
  deal: Deal;
  category?: CategorySlug;
  q?: string;
  rooms?: string;
  price_min?: number;
  price_max?: number;
  owner?: boolean;
  sort?: "new" | "cheap" | "expensive";
  page?: number;
};
