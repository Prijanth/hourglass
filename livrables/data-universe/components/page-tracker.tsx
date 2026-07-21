"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const CONTENT_PATTERNS = [
  /^\/actualites\/.+/,
  /^\/certifications\/.+/,
  /^\/concepts\/.+/,
  /^\/outils\/.+/,
  /^\/glossaire\/.+/,
  /^\/metiers\/.+/,
  /^\/comparatifs\/.+/,
];

export function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!CONTENT_PATTERNS.some(p => p.test(pathname))) return;
    try {
      const existing: { href: string; ts: number }[] = JSON.parse(
        localStorage.getItem("du_visited") ?? "[]"
      );
      const updated = [
        { href: pathname, ts: Date.now() },
        ...existing.filter(v => v.href !== pathname),
      ].slice(0, 20);
      localStorage.setItem("du_visited", JSON.stringify(updated));
    } catch {}
  }, [pathname]);

  return null;
}
