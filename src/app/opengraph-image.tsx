import { ImageResponse } from "next/og";
import { ogFonts } from "@/lib/og-fonts";
import { getProfile } from "@/lib/data/profile";
import { getSiteConfig } from "@/lib/content";

export const alt = "Personal portfolio";
export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [profile, site] = await Promise.all([getProfile(), getSiteConfig()]);
  const brand = profile.brand.toUpperCase();
  const name = profile.displayName.toUpperCase();
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#0E0E0C", color: "#EDEBE6", fontFamily: "Archivo" }}>
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 6, color: "#9a978f" }}>
          <span style={{ color: "#FF5B1F" }}>0x00</span>&nbsp;/ {brand}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 168, fontWeight: 900, letterSpacing: -6, lineHeight: 0.9 }}>{name.split(" ")[0]}</div>
          <div style={{ fontSize: 84, fontWeight: 300, letterSpacing: -2, lineHeight: 1 }}>{name.split(" ").slice(1).join(" ") || "PORTFOLIO"}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 30, borderTop: "2px solid #2a2925", paddingTop: 28 }}>
          <span style={{ letterSpacing: 4 }}>pwn · rev · webexploit</span>
          <span style={{ color: "#FF5B1F" }}>{new URL(site.url).host}</span>
        </div>
      </div>
    ),
    { ...size, fonts: await ogFonts() },
  );
}
