import { ImageResponse } from "next/og";

export const alt = "UyMakon24: G‘allaorolda uy, yer va do‘kon e’lonlari";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0f766e 0%, #115e59 55%, #134e4a 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 56, fontWeight: 800 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 22,
              background: "white",
              color: "#0f766e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 52,
            }}
          >
            ⌂
          </div>
          <div style={{ display: "flex" }}>
            UyMakon<span style={{ color: "#5eead4" }}>24</span>
          </div>
        </div>
        <div style={{ fontSize: 68, fontWeight: 800, marginTop: 48, lineHeight: 1.1, maxWidth: 960 }}>
          G‘allaorolda uy, yer va do‘kon. Sotuv va ijara bitta joyda
        </div>
        <div style={{ fontSize: 32, marginTop: 28, color: "#ccfbf1" }}>Tez orada · uymakon24.uz</div>
      </div>
    ),
    size,
  );
}
