/* Live Session — centerpiece (FR). Real 5-min countdown. */

const SESSION_CANDIDATES = [
  { id: 1, name: "Akira Tan", role: "Product Designer senior", loc: "Berlin · GMT+1", yrs: 6, current: "Lead Designer chez Mirror", schools: "TU München · ENSCI Paris", tags: ["Design system", "B2B SaaS", "0→1"], salary: "95–110 k€", remote: "Full remote", noticeDays: 30, languages: ["Anglais (C2)", "Allemand (B2)", "Français (B1)"], outcome: null },
  { id: 2, name: "Sofia Bianchi", role: "Product Designer senior", loc: "Milan · GMT+1", yrs: 8, current: "Principal chez Lavanda", schools: "Politecnico di Milano", tags: ["Mobile", "Fintech", "Motion"], salary: "105–125 k€", remote: "Hybride", noticeDays: 45, languages: ["Italien (C2)", "Anglais (C1)"], outcome: null },
  { id: 3, name: "Devon Park", role: "Product Designer senior", loc: "Toronto · GMT-5", yrs: 5, current: "Senior chez Wealthsimple", schools: "OCAD University", tags: ["Fintech", "Web3", "Accessibilité"], salary: "135–155 k CA$", remote: "Remote", noticeDays: 14, languages: ["Anglais (C2)", "Coréen (B1)"], outcome: null },
  { id: 4, name: "Mira Achebe", role: "Product Designer senior", loc: "Londres · GMT", yrs: 9, current: "Staff chez Tide", schools: "Goldsmiths, UAL", tags: ["Design system", "Banque", "Lead d'équipe"], salary: "100–115 k£", remote: "Hybride", noticeDays: 60, languages: ["Anglais (C2)", "Igbo"], outcome: null },
  { id: 5, name: "Yusuf El-Amin", role: "Product Designer senior", loc: "Le Caire · GMT+2", yrs: 4, current: "Senior chez Paymob", schools: "AUC", tags: ["MENA", "Paiements", "Recherche"], salary: "70–85 k€", remote: "Remote", noticeDays: 30, languages: ["Arabe (C2)", "Anglais (C2)"], outcome: null },
];

const REVIEW_SECONDS = 300;

const LiveSession = () => {
  const [idx, setIdx] = React.useState(0);
  const [secondsLeft, setSecondsLeft] = React.useState(REVIEW_SECONDS);
  const [running, setRunning] = React.useState(true);
  const [outcomes, setOutcomes] = React.useState({});
  const [confirm, setConfirm] = React.useState(null);

  React.useEffect(() => {
    if (!running || confirm) return;
    const id = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [running, confirm, idx]);

  const expired = secondsLeft === 0;
  const candidate = SESSION_CANDIDATES[idx];
  const reviewed = Object.keys(outcomes).length;
  const remaining = SESSION_CANDIDATES.length - reviewed;
  const decide = (kind) => {
    setOutcomes((o) => ({ ...o, [candidate.id]: kind }));
    setConfirm(null);
    if (idx + 1 < SESSION_CANDIDATES.length) {
      setIdx(idx + 1);
      setSecondsLeft(REVIEW_SECONDS);
    } else {
      setRunning(false);
    }
  };

  const urgency = secondsLeft <= 60 ? "critical" : secondsLeft <= 120 ? "warn" : "ok";
  const ringColor = urgency === "critical" ? "var(--coral)" : urgency === "warn" ? "var(--amber)" : "var(--teal)";

  return (
    <div className="hg-app" style={{ width: 1440, height: 1024, background: "var(--ink)", color: "var(--bg)", display: "grid", gridTemplateRows: "auto 1fr auto", overflow: "hidden", position: "relative" }}>
      <BgGrid/>

      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 28px", borderBottom: "1px solid rgba(255,255,255,0.08)", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Logo size="sm" light/>
          <div style={{ height: 20, width: 1, background: "rgba(255,255,255,0.12)" }}/>
          <div style={{ fontSize: 13, color: "rgba(250,250,247,0.6)" }}>
            <span style={{ color: "var(--bg)", fontWeight: 500 }}>Product Designer senior · Tour 7</span>
            <span style={{ margin: "0 10px" }}>·</span>
            <span>Arche RH</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Pill tone="coral" live style={{ background: "rgba(255,92,92,0.18)", color: "#FF8B8B", borderColor: "rgba(255,92,92,0.3)" }}>Session live</Pill>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "rgba(250,250,247,0.6)" }}>
            15:{String(13 + idx * 5).padStart(2, "0")}
          </span>
          <button onClick={() => setRunning(r => !r)} style={{ ...iconBtnDark }}>
            <Icon name={running ? "pause" : "play"} size={14}/>
          </button>
          <button style={iconBtnDark}><Icon name="settings" size={14}/></button>
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr 360px", minHeight: 0, position: "relative", zIndex: 1 }}>
        {/* LEFT — Queue */}
        <aside style={{ padding: "24px 20px", borderRight: "1px solid rgba(255,255,255,0.08)", overflowY: "auto" }}>
          <div className="hg-eyebrow" style={{ color: "rgba(250,250,247,0.5)", marginBottom: 14 }}>File · {SESSION_CANDIDATES.length} candidats</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {SESSION_CANDIDATES.map((c, i) => {
              const out = outcomes[c.id];
              const isCurrent = i === idx;
              return (
                <div key={c.id} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: 12, borderRadius: 12,
                  background: isCurrent ? "rgba(0,201,167,0.1)" : "transparent",
                  border: isCurrent ? "1px solid rgba(0,201,167,0.3)" : "1px solid transparent",
                  opacity: out ? 0.55 : 1, position: "relative",
                }}>
                  <div className="hg-mono" style={{ width: 18, fontSize: 11, color: "rgba(250,250,247,0.4)" }}>{String(i+1).padStart(2,"0")}</div>
                  <Avatar name={c.name} size="sm"/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--bg)" }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: "rgba(250,250,247,0.5)" }}>{c.loc.split(" · ")[0]} · {c.yrs} ans</div>
                  </div>
                  {out === "accept" && <div style={{ width: 22, height: 22, borderRadius: 999, background: "var(--teal)", display: "grid", placeItems: "center" }}><Icon name="check" size={12} stroke="var(--ink)" strokeWidth={2.5}/></div>}
                  {out === "pass" && <div style={{ width: 22, height: 22, borderRadius: 999, background: "rgba(255,92,92,0.25)", display: "grid", placeItems: "center" }}><Icon name="x" size={12} stroke="#FF8B8B" strokeWidth={2.5}/></div>}
                  {isCurrent && !out && <div className="hg-dot-live"/>}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 24, padding: 14, borderRadius: 12, background: "rgba(255,255,255,0.04)" }}>
            <div className="hg-eyebrow" style={{ color: "rgba(250,250,247,0.5)", marginBottom: 10 }}>Rythme de session</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: 13 }}>Lus</span>
              <span className="hg-mono" style={{ fontSize: 14, fontWeight: 500 }}>{reviewed}/{SESSION_CANDIDATES.length}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 6 }}>
              <span style={{ fontSize: 13 }}>Acceptés</span>
              <span className="hg-mono" style={{ fontSize: 14, fontWeight: 500, color: "var(--teal)" }}>{Object.values(outcomes).filter(o => o === "accept").length}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 6 }}>
              <span style={{ fontSize: 13 }}>Passés</span>
              <span className="hg-mono" style={{ fontSize: 14, fontWeight: 500, color: "#FF8B8B" }}>{Object.values(outcomes).filter(o => o === "pass").length}</span>
            </div>
          </div>
        </aside>

        {/* CENTER */}
        <section style={{ padding: "28px 36px", display: "grid", gridTemplateRows: "auto 1fr", gap: 24, minHeight: 0 }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 28, alignItems: "center" }}>
            <CountdownRing seconds={secondsLeft} total={REVIEW_SECONDS} color={ringColor}/>
            <div>
              <div className="hg-eyebrow" style={{ color: "rgba(250,250,247,0.5)", marginBottom: 6 }}>Candidat {idx + 1} sur {SESSION_CANDIDATES.length} · {Math.max(0, remaining - 1)} après celui-ci</div>
              <div className="hg-display" style={{ fontSize: 34, lineHeight: 1.05 }}>{candidate.name}</div>
              <div style={{ color: "rgba(250,250,247,0.6)", fontSize: 14, marginTop: 4 }}>
                {candidate.current} · {candidate.loc} · {candidate.yrs} ans d'expérience
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="hg-eyebrow" style={{ color: "rgba(250,250,247,0.5)", marginBottom: 4 }}>Chrono de revue</div>
              <div className="hg-mono" style={{ fontSize: 56, fontWeight: 500, color: ringColor, letterSpacing: "-0.03em", lineHeight: 1 }}>
                {fmtTime(secondsLeft)}
              </div>
              <div style={{ fontSize: 11, color: "rgba(250,250,247,0.4)", marginTop: 4 }}>
                {urgency === "critical" ? "Le temps file" : urgency === "warn" ? "On conclut" : "Prenez le temps"}
              </div>
            </div>
          </div>

          {/* CV preview */}
          <div style={{ background: "var(--bg)", color: "var(--ink)", borderRadius: 16, overflow: "hidden", position: "relative", boxShadow: "0 30px 60px -20px rgba(0,0,0,0.4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px", borderBottom: "1px solid var(--line)", background: "var(--surface-2)" }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center", fontSize: 12, color: "var(--ink-muted)" }}>
                <Icon name="file" size={14}/>
                <span>{candidate.name.toLowerCase().replace(" ", "-")}-cv.pdf</span>
                <span>·</span>
                <span>2 pages</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={iconBtnLight}><Icon name="upload" size={13}/></button>
                <button style={iconBtnLight}><Icon name="sparkle" size={13}/></button>
              </div>
            </div>
            <CVPreview c={candidate}/>
          </div>
        </section>

        {/* RIGHT */}
        <aside style={{ padding: "24px 24px", borderLeft: "1px solid rgba(255,255,255,0.08)", overflowY: "auto", display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <div className="hg-eyebrow" style={{ color: "rgba(250,250,247,0.5)", marginBottom: 14 }}>Candidat en un coup d'œil</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <Avatar name={candidate.name} size="lg"/>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{candidate.name}</div>
                <div style={{ fontSize: 12, color: "rgba(250,250,247,0.5)" }}>{candidate.role}</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <DarkRow label="Localisation" value={candidate.loc}/>
              <DarkRow label="Expérience" value={`${candidate.yrs} ans`}/>
              <DarkRow label="Prétentions" value={candidate.salary}/>
              <DarkRow label="Mode de travail" value={candidate.remote}/>
              <DarkRow label="Préavis" value={`${candidate.noticeDays} jours`}/>
              <DarkRow label="Langues" value={candidate.languages.join(", ")}/>
            </div>
          </div>

          <div style={{ height: 1, background: "rgba(255,255,255,0.08)" }}/>

          <div>
            <div className="hg-eyebrow" style={{ color: "rgba(250,250,247,0.5)", marginBottom: 10 }}>Forces</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {candidate.tags.map(t => (
                <span key={t} style={{ padding: "5px 10px", borderRadius: 999, background: "rgba(0,201,167,0.12)", color: "var(--teal)", fontSize: 11, fontWeight: 500 }}>{t}</span>
              ))}
            </div>
          </div>

          <div>
            <div className="hg-eyebrow" style={{ color: "rgba(250,250,247,0.5)", marginBottom: 10 }}>Notes rapides</div>
            <textarea placeholder="Noter quelque chose pour l'entretien…" style={{
              width: "100%", minHeight: 90, resize: "none",
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
              color: "var(--bg)", borderRadius: 10, padding: 12, fontSize: 13, fontFamily: "var(--font-body)", outline: "none",
            }} defaultValue={idx === 0 ? "Bon travail design system chez Mirror — demander la stratégie de migration." : ""}/>
          </div>

          <div style={{ height: 1, background: "rgba(255,255,255,0.08)" }}/>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "rgba(250,250,247,0.5)" }}>
            <span><Icon name="users" size={12}/> 2 140 vus</span>
            <span>Temps moyen : <span className="hg-mono" style={{ color: "var(--bg)" }}>03:24</span></span>
          </div>
        </aside>
      </div>

      {/* BOTTOM */}
      <footer style={{ padding: "20px 36px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 16, alignItems: "center", position: "relative", zIndex: 1, background: "rgba(15,19,32,0.6)", backdropFilter: "blur(8px)" }}>
        <button
          onClick={() => decide("pass")}
          style={{
            ...decisionBtn,
            background: "rgba(255,92,92,0.10)",
            color: "#FF8B8B",
            border: "1px solid rgba(255,92,92,0.25)",
          }}
        >
          <Icon name="x" size={22}/>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 18, fontWeight: 600 }}>Passer</div>
            <div style={{ fontSize: 11, opacity: 0.7, fontWeight: 400 }}>Envoyer un refus bienveillant → suivant</div>
          </div>
          <kbd style={kbd}>P</kbd>
        </button>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "0 16px" }}>
          <SlotIndicator filled={reviewed} total={SESSION_CANDIDATES.length} size={8}/>
          {expired && <Pill tone="coral" live>Décidez maintenant</Pill>}
        </div>

        <button
          onClick={() => decide("accept")}
          style={{
            ...decisionBtn,
            background: "var(--teal)",
            color: "var(--ink)",
            border: "1px solid var(--teal)",
            justifyContent: "flex-end",
          }}
        >
          <kbd style={{ ...kbd, background: "rgba(15,19,32,0.15)", color: "var(--ink)" }}>A</kbd>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 18, fontWeight: 600 }}>Accepter</div>
            <div style={{ fontSize: 11, opacity: 0.7, fontWeight: 500 }}>Réserver auto un entretien de 30 min</div>
          </div>
          <Icon name="check" size={22}/>
        </button>
      </footer>
    </div>
  );
};

const decisionBtn = {
  display: "inline-flex", alignItems: "center", gap: 16,
  padding: "18px 26px", borderRadius: 14,
  cursor: "pointer", fontFamily: "var(--font-body)",
  transition: "transform .1s ease, filter .1s ease",
};

const kbd = {
  fontFamily: "var(--font-mono)", fontSize: 11,
  padding: "3px 7px", borderRadius: 5,
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.15)",
  color: "rgba(250,250,247,0.6)",
};

const iconBtnDark = {
  width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.04)", color: "var(--bg)", cursor: "pointer",
  display: "inline-grid", placeItems: "center",
};
const iconBtnLight = {
  width: 28, height: 28, borderRadius: 6, border: "1px solid var(--line)",
  background: "var(--bg)", color: "var(--ink-muted)", cursor: "pointer",
  display: "inline-grid", placeItems: "center",
};

const DarkRow = ({ label, value }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 12 }}>
    <span style={{ color: "rgba(250,250,247,0.5)" }}>{label}</span>
    <span style={{ color: "var(--bg)", fontWeight: 500, textAlign: "right" }}>{value}</span>
  </div>
);

const CountdownRing = ({ seconds, total, color }) => {
  const r = 44;
  const c = 2 * Math.PI * r;
  const dash = c * (seconds / total);
  return (
    <div style={{ width: 110, height: 110, position: "relative" }}>
      <svg width={110} height={110} viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6"/>
        <circle
          cx="55" cy="55" r={r}
          fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          transform="rotate(-90 55 55)"
          style={{ transition: "stroke-dasharray 1s linear, stroke 0.4s" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div className="hg-mono" style={{ fontSize: 22, fontWeight: 500, color }}>{fmtTime(seconds)}</div>
          <div style={{ fontSize: 9, color: "rgba(250,250,247,0.4)", marginTop: 2, fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}>SUR 5:00</div>
        </div>
      </div>
    </div>
  );
};

const CVPreview = ({ c }) => (
  <div style={{ padding: "32px 40px", height: "100%", overflow: "hidden", position: "relative" }}>
    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 36 }}>
      <div>
        <div className="hg-display" style={{ fontSize: 28 }}>{c.name}</div>
        <div style={{ fontSize: 14, color: "var(--ink-muted)", marginTop: 4 }}>{c.role}</div>
        <div style={{ fontSize: 12, color: "var(--ink-faint)", marginTop: 10, display: "flex", gap: 12 }}>
          <span>{c.loc}</span><span>·</span><span>{c.name.toLowerCase().split(" ")[0]}@hourglass.app</span>
        </div>

        <div style={{ marginTop: 24 }}>
          <div className="hg-eyebrow" style={{ marginBottom: 10 }}>Profil</div>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--ink)", margin: 0 }}>
            Plus de {c.yrs} ans à designer du produit. Actuellement {c.current}, je livre du travail à l'intersection de {c.tags[0].toLowerCase()} et {c.tags[1]?.toLowerCase() || "du craft"}. À l'aise pour porter un sujet de bout en bout — recherche, IA, interaction, motion, mise en prod, mesure, itération. Je cherche une équipe où mener une verticale et faire grandir les gens.
          </p>
        </div>

        <div style={{ marginTop: 24 }}>
          <div className="hg-eyebrow" style={{ marginBottom: 10 }}>Expériences sélectionnées</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { co: c.current.split(" chez ")[1] || "Mirror", t: c.current.split(" chez ")[0], yr: "2022 — aujourd'hui" },
              { co: "Cape & Co.", t: "Designer senior", yr: "2019 — 2022" },
              { co: "Foundry Labs", t: "Product Designer", yr: "2017 — 2019" },
            ].map((e, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: 14 }}>
                <div className="hg-mono" style={{ fontSize: 11, color: "var(--ink-faint)", paddingTop: 3 }}>{e.yr}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{e.t} <span style={{ color: "var(--ink-muted)", fontWeight: 400 }}>· {e.co}</span></div>
                  <div style={{ fontSize: 12, color: "var(--ink-muted)", marginTop: 3 }}>Pilotage du design web + mobile. Livraison de {2 + i} surfaces majeures et refonte du design system.</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ borderLeft: "1px solid var(--line)", paddingLeft: 28 }}>
        <div className="hg-eyebrow" style={{ marginBottom: 10 }}>Forces</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 22 }}>
          {c.tags.map(t => (
            <div key={t} style={{ fontSize: 13, padding: "6px 10px", background: "var(--surface-2)", borderRadius: 6 }}>{t}</div>
          ))}
        </div>

        <div className="hg-eyebrow" style={{ marginBottom: 10 }}>Formation</div>
        <div style={{ fontSize: 13, marginBottom: 22 }}>{c.schools}</div>

        <div className="hg-eyebrow" style={{ marginBottom: 10 }}>Langues</div>
        <div style={{ fontSize: 13, marginBottom: 22, color: "var(--ink-muted)" }}>{c.languages.join(" · ")}</div>

        <div className="hg-eyebrow" style={{ marginBottom: 10 }}>Portfolio</div>
        <div style={{ fontSize: 13, color: "var(--ink)", textDecoration: "underline", textDecorationColor: "var(--line-strong)" }}>{c.name.toLowerCase().split(" ")[0]}.work</div>
      </div>
    </div>

    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "linear-gradient(to bottom, transparent, var(--bg))", pointerEvents: "none" }}/>
  </div>
);

window.LiveSession = LiveSession;
