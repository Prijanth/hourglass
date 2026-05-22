/* Hourglass — shared UI primitives & icon set */
const { useState, useEffect, useRef, useMemo } = React;

/* ──────────────────────────────────────────────────────────────────────
   ICONS — simple, line-based, 1.5 stroke. Avoid emoji.
   ────────────────────────────────────────────────────────────────────── */
const Icon = ({ name, size = 18, stroke = "currentColor", strokeWidth = 1.7, fill = "none" }) => {
  const paths = {
    home: <><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9z"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    hourglass: <><path d="M7 3h10M7 21h10M8 3c0 4 8 4 8 9s-8 5-8 9M16 3c0 4-8 4-8 9s8 5 8 9"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></>,
    users: <><circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M17 14c2.5.5 5 2.4 5 6"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>,
    inbox: <><path d="M3 13l3-8h12l3 8M3 13v6a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-6M3 13h5l1 3h6l1-3h5"/></>,
    bell: <><path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6zM10 20a2 2 0 0 0 4 0"/></>,
    upload: <><path d="M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/></>,
    file: <><path d="M6 3h8l4 4v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM14 3v4h4"/></>,
    check: <><path d="m4 12 5 5 11-11"/></>,
    x: <><path d="m6 6 12 12M6 18 18 6"/></>,
    arrowRight: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    arrowLeft: <><path d="M19 12H5M11 6l-6 6 6 6"/></>,
    chevronDown: <><path d="m6 9 6 6 6-6"/></>,
    chevronRight: <><path d="m9 6 6 6-6 6"/></>,
    play: <><path d="M6 4l14 8-14 8z" fill="currentColor" stroke="none"/></>,
    pause: <><rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none"/><rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    mic: <><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></>,
    video: <><rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/></>,
    bolt: <><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></>,
    star: <><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></>,
    pin: <><path d="M12 22v-7M9 9l-3 4h12l-3-4V3H9z"/></>,
    sparkle: <><path d="M12 3v6M12 15v6M3 12h6M15 12h6M5.5 5.5l4 4M14.5 14.5l4 4M5.5 18.5l4-4M14.5 9.5l4-4"/></>,
    logout: <><path d="M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4M16 8l4 4-4 4M20 12H10"/></>,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/></>,
    pin2: <><path d="M9 2h6v6l3 3v3H6v-3l3-3zM12 14v8"/></>,
    map: <><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14"/></>,
    flame: <><path d="M12 22c5 0 8-3 8-7 0-3-2-5-3-7-1 2-2 3-3 3-1-3 0-6-2-9-1 4-5 6-5 11 0 5 3 9 5 9z"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {paths[name] || paths.user}
    </svg>
  );
};

/* ──────────────────────────────────────────────────────────────────────
   LOGO — wordmark with the hourglass glyph
   ────────────────────────────────────────────────────────────────────── */
const Logo = ({ size = "md", showWord = true, light = false }) => {
  const dim = size === "lg" ? 36 : size === "sm" ? 22 : 28;
  const fs = size === "lg" ? 22 : size === "sm" ? 15 : 18;
  const tealStroke = light ? "#00C9A7" : "#00C9A7";
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10, color: light ? "#FAFAF7" : "#0F1320" }}>
      <div style={{
        width: dim, height: dim, borderRadius: dim * 0.28,
        background: light ? "#FAFAF7" : "#0F1320",
        display: "grid", placeItems: "center", position: "relative", overflow: "hidden",
      }}>
        <svg width={dim*0.6} height={dim*0.6} viewBox="0 0 24 24" fill="none">
          <path d="M5 2h14M5 22h14" stroke={tealStroke} strokeWidth="2" strokeLinecap="round"/>
          <path d="M6 3c0 5 12 5 12 9s-12 4-12 9" stroke={tealStroke} strokeWidth="2" strokeLinecap="round" fill="none"/>
          <path d="M18 3c0 5-12 5-12 9s12 4 12 9" stroke={tealStroke} strokeWidth="2" strokeLinecap="round" fill="none"/>
          <circle cx="12" cy="13" r="1.6" fill={tealStroke}/>
        </svg>
      </div>
      {showWord && (
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: fs, letterSpacing: "-0.02em" }}>
          Hourglass
        </span>
      )}
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────────────
   AVATAR — initials in a colored circle. Deterministic from name.
   ────────────────────────────────────────────────────────────────────── */
const AVATAR_COLORS = [
  ["#FFD9C2", "#A03A0E"],
  ["#D8E9FF", "#1B3B7A"],
  ["#E1F5DB", "#2A6B1F"],
  ["#F4D9F7", "#5E1671"],
  ["#FFE5C2", "#7A3A05"],
  ["#D9EFEC", "#0A5A4B"],
  ["#FFDFE3", "#931E2E"],
  ["#E6E2FF", "#2B1F7A"],
];
const Avatar = ({ name = "?", size = "md", src }) => {
  const initials = name.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();
  const hash = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  const [bg, fg] = AVATAR_COLORS[hash % AVATAR_COLORS.length];
  const dim = size === "lg" ? 56 : size === "sm" ? 28 : size === "xs" ? 22 : 40;
  return (
    <div className={`hg-avatar hg-avatar-${size}`} style={{ background: bg, color: fg, width: dim, height: dim, fontSize: dim * 0.36 }}>
      {src ? <img src={src} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }}/> : initials}
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────────────
   PILL — small status badge
   ────────────────────────────────────────────────────────────────────── */
const Pill = ({ children, tone = "default", live = false, style }) => {
  const cls = {
    default: "hg-pill",
    teal: "hg-pill hg-pill-teal",
    coral: "hg-pill hg-pill-coral",
    ink: "hg-pill hg-pill-ink",
    amber: "hg-pill hg-pill-amber",
  }[tone];
  return (
    <span className={cls} style={style}>
      {live && <span className="hg-dot-live"/>}
      {children}
    </span>
  );
};

/* ──────────────────────────────────────────────────────────────────────
   PROGRESS — segmented slots indicator (e.g. 3 of 5 slots filled)
   ────────────────────────────────────────────────────────────────────── */
const SlotIndicator = ({ filled, total, size = 8, gap = 4 }) => (
  <div style={{ display: "inline-flex", gap }}>
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} style={{
        width: size * 2.5, height: size,
        borderRadius: 999,
        background: i < filled ? "var(--ink)" : "var(--line-strong)",
      }}/>
    ))}
  </div>
);

/* ──────────────────────────────────────────────────────────────────────
   COUNTDOWN — formatted M:SS
   ────────────────────────────────────────────────────────────────────── */
const fmtTime = (sec) => {
  const m = Math.floor(Math.max(0, sec) / 60);
  const s = Math.floor(Math.max(0, sec) % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};

/* ──────────────────────────────────────────────────────────────────────
   PLACEHOLDER — striped block with a caption
   ────────────────────────────────────────────────────────────────────── */
const Placeholder = ({ label, height = 120, style = {} }) => (
  <div className="hg-placeholder" style={{ height, ...style }}>{label}</div>
);

/* Export to window so other scripts can use these */
Object.assign(window, { Icon, Logo, Avatar, Pill, SlotIndicator, Placeholder, fmtTime });
