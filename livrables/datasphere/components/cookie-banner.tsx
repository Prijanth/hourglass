"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import Link from "next/link";

const CONSENT_KEY = "datauniverse_cookie_consent";

export function CookieBanner() {
  const [consent, setConsent] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored) {
      setConsent(stored);
    } else {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setConsent("accepted");
    setVisible(false);
  };

  const refuse = () => {
    localStorage.setItem(CONSENT_KEY, "refused");
    setConsent("refused");
    setVisible(false);
  };

  return (
    <>
      {consent === "accepted" && gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      )}

      {visible && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999,
          background: "#1E1B4B",
          borderTop: "1px solid rgba(129,140,248,0.25)",
          padding: "14px 24px",
          display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.3)",
        }}>
          <p style={{
            color: "rgba(255,255,255,0.8)", fontSize: 13.5, lineHeight: 1.6, flex: 1, minWidth: 220, margin: 0,
          }}>
            Nous utilisons Google Analytics pour mesurer l&apos;audience du site.{" "}
            <Link href="/confidentialite" style={{ color: "#a78bfa", fontWeight: 600 }}>
              En savoir plus
            </Link>
          </p>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button
              onClick={refuse}
              style={{
                padding: "8px 18px", borderRadius: 6,
                border: "1px solid rgba(255,255,255,0.2)",
                background: "transparent", color: "rgba(255,255,255,0.65)",
                fontSize: 13, cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Refuser
            </button>
            <button
              onClick={accept}
              style={{
                padding: "8px 18px", borderRadius: 6, border: "none",
                background: "linear-gradient(135deg, #7C3AED, #6366f1)",
                color: "white", fontSize: 13, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Accepter
            </button>
          </div>
        </div>
      )}
    </>
  );
}
