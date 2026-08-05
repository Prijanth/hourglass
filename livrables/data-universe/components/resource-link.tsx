"use client";

import { trackEvent } from "@/lib/analytics";

type ResourceLinkProps = {
  href: string;
  label: string;
  desc: string;
  tag: string;
  tagColor: string;
};

export function ResourceLink({ href, label, desc, tag, tagColor }: ResourceLinkProps) {
  function handleClick() {
    if (tag === "Affilié") {
      trackEvent("affiliate_click", { link_label: label, link_url: href, affiliate_type: "amazon" });
    } else if (tag === "Externe") {
      trackEvent("affiliate_click", { link_label: label, link_url: href, affiliate_type: "udemy" });
    }
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="hover-shadow-card"
      onClick={handleClick}
      style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "14px 18px", background: "white", borderRadius: 12,
        border: "1px solid #E2E8F0", textDecoration: "none",
      }}
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
