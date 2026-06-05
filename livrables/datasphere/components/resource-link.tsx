"use client";

type ResourceLinkProps = {
  href: string;
  label: string;
  desc: string;
  tag: string;
  tagColor: string;
};

export function ResourceLink({ href, label, desc, tag, tagColor }: ResourceLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "14px 18px", background: "white", borderRadius: 12,
        border: "1px solid #E2E8F0", textDecoration: "none",
        transition: "box-shadow 0.2s",
      }}
      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)")}
      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.boxShadow = "none")}
    >
      <div>
        <p style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: 12.5, color: "#64748B" }}>{desc}</p>
      </div>
      <span style={{
        padding: "3px 10px", borderRadius: 100,
        background: `${tagColor}15`, color: tagColor,
        fontSize: 11, fontWeight: 700, whiteSpace: "nowrap", marginLeft: 12,
      }}>{tag}</span>
    </a>
  );
}
