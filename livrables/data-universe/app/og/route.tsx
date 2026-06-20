import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title    = searchParams.get("title")    ?? "Data Universe";
  const subtitle = searchParams.get("subtitle") ?? "La reference data & IA en francais";
  const type     = searchParams.get("type")     ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%",
          display: "flex", flexDirection: "column",
          background: "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 60%, #DDD6FE 100%)",
          padding: "56px 64px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Header brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: "auto" }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "linear-gradient(135deg, #7C3AED, #0EA5E9)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ width: 16, height: 16, borderRadius: "50%", background: "white", opacity: 0.9 }} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 24, color: "#0F172A", letterSpacing: "-0.03em" }}>
            Data Universe
          </span>
          {type ? (
            <span style={{
              padding: "4px 14px", borderRadius: 100,
              background: "#7C3AED", color: "white",
              fontSize: 14, fontWeight: 600,
            }}>
              {type}
            </span>
          ) : null}
        </div>

        {/* Title */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{
            fontSize: 52, fontWeight: 800, color: "#0F172A",
            lineHeight: 1.08, letterSpacing: "-0.04em",
            maxWidth: 900,
          }}>
            {title}
          </div>
          <div style={{ fontSize: 22, color: "#64748B", lineHeight: 1.5, maxWidth: 760 }}>
            {subtitle}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", marginTop: 52, fontSize: 16, color: "#94A3B8" }}>
          data-universe.fr
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}