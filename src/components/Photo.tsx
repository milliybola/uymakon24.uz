/* eslint-disable @next/next/no-img-element -- rasmlar backenddan tayyor o‘lchamlarda keladi */

const GRADS = [
  ["#7c9a6b", "#d8c3a5"],
  ["#8fa3b8", "#e7d9c4"],
  ["#a47551", "#e6ccb2"],
  ["#5f7a8a", "#c9d6df"],
  ["#b08968", "#ede0d4"],
  ["#6b8f71", "#d9e4c8"],
  ["#9a8c98", "#f2e9e4"],
  ["#4a6fa5", "#c0d6df"],
];

/** E’lon rasmi; rasm bo‘lmasa, e’lon kodiga qarab rangli o‘rinbosar. */
export function Photo({ src, alt, seed, className = "", eager = false }: { src?: string | null; alt: string; seed: number; className?: string; eager?: boolean }) {
  if (src) {
    return <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" className={`size-full object-cover ${className}`} />;
  }
  const [a, b] = GRADS[seed % GRADS.length];
  return (
    <div role="img" aria-label={alt} className={`relative size-full ${className}`} style={{ background: `linear-gradient(135deg, ${a}, ${b})` }}>
      <svg viewBox="0 0 24 24" className="absolute top-1/2 left-1/2 size-10 -translate-1/2 text-white/60" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
      </svg>
    </div>
  );
}
