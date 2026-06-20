"use client";
import { useState } from "react";

type Screenshot = { url: string; caption?: string };

function Screenshot({ s, toolName, index }: { s: Screenshot; toolName: string; index: number }) {
  const [failed, setFailed] = useState(false);

  // Fallback hqdefault → mqdefault si hqdefault est aussi absent
  const fallback = s.url.replace("hqdefault.jpg", "mqdefault.jpg");

  if (failed) return null;

  return (
    <div style={{
      flexShrink: 0,
      scrollSnapAlign: "start",
      width: 440,
      borderRadius: 14,
      overflow: "hidden",
      border: "1px solid var(--border)",
      boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      background: "var(--surface-2)",
    }}>
      <img
        src={s.url}
        alt={s.caption ?? `${toolName} — capture ${index + 1}`}
        style={{ width: "100%", height: 250, objectFit: "cover", display: "block" }}
        onError={(e) => {
          if (e.currentTarget.src !== fallback) {
            e.currentTarget.src = fallback;
          } else {
            setFailed(true);
          }
        }}
      />
      {s.caption && (
        <div style={{
          padding: "9px 14px",
          fontSize: 12.5,
          color: "var(--muted)",
          background: "var(--surface-2)",
          borderTop: "1px solid var(--border)",
          lineHeight: 1.4,
        }}>
          {s.caption}
        </div>
      )}
    </div>
  );
}

export function ScreenshotGallery({ screenshots, toolName }: { screenshots: Screenshot[]; toolName: string }) {
  if (!screenshots.length) return null;

  return (
    <div style={{ marginBottom: 36 }}>
      <p style={{
        fontSize: 11,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: "var(--indigo)",
        marginBottom: 14,
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}>
        Interface &amp; captures
      </p>
      <div style={{
        display: "flex",
        gap: 12,
        overflowX: "auto",
        paddingBottom: 8,
        scrollSnapType: "x mandatory",
        scrollbarWidth: "thin",
        scrollbarColor: "var(--border) transparent",
      } as React.CSSProperties}>
        {screenshots.map((s, i) => (
          <Screenshot key={i} s={s} toolName={toolName} index={i} />
        ))}
      </div>
    </div>
  );
}
