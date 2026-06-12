"use client";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("datasphere_theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved ? saved === "dark" : prefersDark;
    setDark(isDark);
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    localStorage.setItem("datasphere_theme", next ? "dark" : "light");
  }

  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      className="theme-toggle-btn"
      title={dark ? "Passer en mode clair" : "Passer en mode sombre"}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 34, height: 34, borderRadius: 8,
        border: "1.5px solid #CBD5E1",
        background: "#F8FAFC",
        cursor: "pointer",
        transition: "all 0.2s",
        flexShrink: 0,
      }}
    >
      <span style={{ fontSize: 16, lineHeight: 1 }}>
        {dark ? "☀️" : "🌙"}
      </span>
    </button>
  );
}
