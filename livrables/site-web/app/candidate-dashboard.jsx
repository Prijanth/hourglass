/* Tableau de bord candidat — Hourglass (FR) */

const CANDIDATE_NAME = "Marin Lavoie";
const CANDIDATE_EMAIL = "marin.lavoie@gmail.com";

const SidebarLink = ({ icon, label, active, badge }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 12,
    padding: "10px 14px", borderRadius: 10,
    color: active ? "var(--ink)" : "var(--ink-muted)",
    background: active ? "var(--surface-2)" : "transparent",
    fontWeight: active ? 500 : 450, fontSize: 14, cursor: "pointer",
    position: "relative",
  }}>
    {active && <div style={{ position: "absolute", left: -16, top: 8, bottom: 8, width: 3, borderRadius: 3, background: "var(--teal)" }}/>}
    <Icon name={icon} size={18}/>
    <span style={{ flex: 1 }}>{label}</span>
    {badge && <span style={{ fontSize: 11, padding: "1px 7px", borderRadius: 999, background: "var(--ink)", color: "var(--bg)" }}>{badge}</span>}
  </div>
);

const AppShell = ({ children, role = "candidate", page = "Sessions", navigate = () => {} }) => {
  const nav = role === "candidate"
    ? [
        { icon: "home", label: "Vue d'ensemble", page: "Vue" },
        { icon: "calendar", label: "Sessions", page: "Sessions", badge: "12" },
        { icon: "hourglass", label: "Ma file", page: "Ma file", badge: "2" },
        { icon: "video", label: "Entretiens", page: "Entretiens" },
        { icon: "file", label: "Mon CV", page: "CV" },
      ]
    : [
        { icon: "home", label: "Vue d'ensemble", page: "Vue" },
        { icon: "calendar", label: "Sessions", page: "Sessions" },
        { icon: "hourglass", label: "En direct", page: "En direct", badge: "•" },
        { icon: "users", label: "Candidats", page: "Candidats" },
        { icon: "video", label: "Entretiens", page: "Entretiens" },
        { icon: "inbox", label: "Messagerie", page: "Messagerie" },
      ];
  return (
    <div className="hg-app" style={{ width: 1440, minHeight: 1080, background: "var(--bg)", display: "grid", gridTemplateColumns: "240px 1fr" }}>
      <aside style={{
        background: "var(--surface)",
        borderRight: "1px solid var(--line)",
        padding: "24px 16px",
        display: "flex", flexDirection: "column", gap: 4,
      }}>
        <div style={{ padding: "0 6px 24px", cursor: "pointer" }} onClick={() => navigate('accueil')}>
          <Logo size="md"/>
        </div>
        <div className="hg-eyebrow" style={{ padding: "12px 14px 6px" }}>{role === "candidate" ? "Candidat" : "Recruteur"}</div>
        {nav.map((n) => <SidebarLink key={n.label} {...n} active={n.page === page}/>)}
        <div className="hg-eyebrow" style={{ padding: "24px 14px 6px" }}>Compte</div>
        <SidebarLink icon="settings" label="Paramètres"/>
        <SidebarLink icon="bell" label="Notifications" badge="3"/>
        <div style={{ flex: 1 }}/>
        <div style={{ padding: 12, borderRadius: 12, background: "var(--surface-2)", display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar name={role === "candidate" ? CANDIDATE_NAME : "Hana Okonkwo"} size="sm"/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {role === "candidate" ? CANDIDATE_NAME : "Hana Okonkwo"}
            </div>
            <div style={{ fontSize: 11, color: "var(--ink-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {role === "candidate" ? CANDIDATE_EMAIL : "hana@arche-rh.com"}
            </div>
          </div>
        </div>
      </aside>

      <main style={{ minWidth: 0, display: "flex", flexDirection: "column" }}>
        {children}
      </main>
    </div>
  );
};

const TopBar = ({ title, sub, children }) => (
  <header style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "24px 36px",
    borderBottom: "1px solid var(--line)",
    background: "var(--bg)",
  }}>
    <div>
      <h1 className="hg-display" style={{ fontSize: 26 }}>{title}</h1>
      {sub && <div style={{ color: "var(--ink-muted)", fontSize: 14, marginTop: 4 }}>{sub}</div>}
    </div>
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 10, border: "1px solid var(--line-strong)", background: "var(--surface)", color: "var(--ink-muted)", fontSize: 13, width: 280 }}>
        <Icon name="search" size={14}/> Rechercher sessions, recruteurs…
      </div>
      {children}
    </div>
  </header>
);

const SESSIONS = [
  { id: "s1", co: "Northwind Robotics", role: "Product Designer senior", date: "jeu. 28 mai", time: "15:00 — 16:00", filled: 3, total: 5, location: "Remote · Europe", status: "live", queue: 3 },
  { id: "s2", co: "Helix Bio", role: "Biologiste computationnel", date: "ven. 29 mai", time: "10:00 — 11:30", filled: 4, total: 6, location: "Boston · Hybride", status: "upcoming", joined: true, queue: null },
  { id: "s3", co: "Loom & Lattice", role: "Designer de marque", date: "lun. 2 juin", time: "14:00 — 15:00", filled: 2, total: 5, location: "Remote · Monde", status: "upcoming" },
  { id: "s4", co: "Atlas Fret", role: "Responsable logistique", date: "mar. 3 juin", time: "11:00 — 12:30", filled: 5, total: 5, location: "Hambourg", status: "full" },
  { id: "s5", co: "Quartz Analytics", role: "Data Scientist Staff", date: "mer. 4 juin", time: "16:00 — 17:00", filled: 2, total: 5, location: "Remote · Amériques", status: "upcoming" },
  { id: "s6", co: "Postscript", role: "Growth PM", date: "jeu. 5 juin", time: "09:30 — 10:30", filled: 1, total: 4, location: "Londres", status: "upcoming" },
];

const SessionCard = ({ s, joined = false }) => {
  const statusPill = {
    live: <Pill tone="coral" live>Live dans 12 min</Pill>,
    upcoming: <Pill tone="default"><Icon name="clock" size={11}/> {s.date.split(" ")[0]}</Pill>,
    full: <Pill tone="amber">Session complète</Pill>,
  }[s.status];

  return (
    <div className="hg-card" style={{ padding: 22, display: "flex", flexDirection: "column", gap: 14, cursor: "pointer", transition: "transform .15s, box-shadow .15s" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar name={s.co} size="md"/>
          <div>
            <div style={{ fontSize: 13, color: "var(--ink-muted)" }}>{s.co}</div>
            <div style={{ fontSize: 16, fontWeight: 600, fontFamily: "var(--font-display)", letterSpacing: "-0.01em", marginTop: 2 }}>{s.role}</div>
          </div>
        </div>
        {statusPill}
      </div>
      <div style={{ display: "flex", gap: 16, fontSize: 13, color: "var(--ink-muted)" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="clock" size={13}/> {s.time}</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="pin2" size={13}/> {s.location}</span>
      </div>
      <hr className="hg-divider"/>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <SlotIndicator filled={s.filled} total={s.total}/>
          <span style={{ fontSize: 12, color: "var(--ink-muted)" }}>{s.filled}/{s.total} places</span>
        </div>
        {joined
          ? <Pill tone="teal"><Icon name="check" size={11}/> Dans la file · n°{s.queue}</Pill>
          : s.status === "full"
            ? <button className="hg-btn hg-btn-ghost" disabled style={{ opacity: 0.5 }}>Complet</button>
            : <button className="hg-btn" style={{ background: "var(--ink)", color: "var(--bg)", padding: "8px 14px" }}>Candidater <Icon name="arrowRight" size={12}/></button>
        }
      </div>
    </div>
  );
};

const CandidateDashboard = ({ navigate = () => {} }) => {
  return (
    <AppShell role="candidate" page="Sessions" navigate={navigate}>
      <TopBar title="Sessions de la semaine" sub="De vrais recruteurs, de vrais créneaux. Candidatez pour réserver votre place.">
        <button className="hg-btn hg-btn-ghost"><Icon name="calendar" size={14}/> Toutes les semaines</button>
        <button className="hg-btn hg-btn-primary"><Icon name="bell" size={14}/> Alertes</button>
      </TopBar>

      <div style={{ padding: 36, display: "grid", gridTemplateColumns: "1fr 340px", gap: 28, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {/* Active session tracker */}
          <div style={{ background: "var(--ink)", color: "var(--bg)", borderRadius: 20, padding: 28, position: "relative", overflow: "hidden" }}>
            <BgGrid/>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
              <div>
                <Pill tone="teal" style={{ background: "rgba(0,201,167,0.18)", color: "var(--teal)", borderColor: "rgba(0,201,167,0.3)" }}>Votre session active</Pill>
                <div className="hg-display" style={{ fontSize: 28, marginTop: 14 }}>Helix Bio · Biologiste computationnel</div>
                <div style={{ color: "rgba(250,250,247,0.6)", fontSize: 14, marginTop: 6 }}>Vendredi 29 mai · 10:00 · Dr. Yuna Park aux commandes</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="hg-eyebrow" style={{ color: "rgba(250,250,247,0.5)" }}>Votre position</div>
                <div className="hg-display" style={{ fontSize: 56, color: "var(--teal)", lineHeight: 1, marginTop: 4 }}>n°3</div>
                <div style={{ fontSize: 12, color: "rgba(250,250,247,0.5)", marginTop: 4 }}>sur 6 dans la file</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 28, position: "relative" }}>
              {[
                { l: "Candidaté", t: "mar. 14:22", done: true },
                { l: "Dans la file", t: "Position n°3", done: true, current: true },
                { l: "CV lu", t: "~ven. 10:18", done: false },
                { l: "Entretien réservé", t: "Créneau 30 min", done: false },
              ].map((s, i) => (
                <div key={i} style={{ padding: 14, borderRadius: 12, background: s.current ? "rgba(0,201,167,0.12)" : "rgba(255,255,255,0.04)", border: s.current ? "1px solid var(--teal)" : "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    <div style={{
                      width: 14, height: 14, borderRadius: 999,
                      background: s.done ? "var(--teal)" : "rgba(255,255,255,0.15)",
                      display: "grid", placeItems: "center",
                    }}>
                      {s.done && <Icon name="check" size={9} stroke="var(--ink)" strokeWidth={3}/>}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: s.done ? "var(--bg)" : "rgba(250,250,247,0.5)" }}>{s.l}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(250,250,247,0.5)", fontFamily: "var(--font-mono)" }}>{s.t}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 className="hg-display" style={{ fontSize: 20 }}>Sessions ouvertes à rejoindre</h2>
              <div style={{ display: "flex", gap: 6 }}>
                {["Cette semaine","Semaine prochaine","Toutes"].map((f, i) => (
                  <button key={f} style={{
                    padding: "6px 14px", borderRadius: 999, border: "none",
                    background: i === 0 ? "var(--ink)" : "transparent",
                    color: i === 0 ? "var(--bg)" : "var(--ink-muted)",
                    fontSize: 12, cursor: "pointer", fontWeight: 500,
                  }}>{f}</button>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {SESSIONS.map(s => <SessionCard key={s.id} s={s} joined={s.joined}/>)}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 24 }}>
          <div className="hg-card" style={{ padding: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div className="hg-eyebrow">Votre CV</div>
              <Pill tone="teal"><Icon name="check" size={11}/> À jour</Pill>
            </div>
            <div style={{ border: "1.5px dashed var(--line-strong)", borderRadius: 12, padding: 18, display: "flex", alignItems: "center", gap: 14, background: "var(--surface-2)" }}>
              <div style={{ width: 44, height: 56, background: "var(--bg)", borderRadius: 6, display: "grid", placeItems: "center", color: "var(--ink-muted)", border: "1px solid var(--line)" }}>
                <Icon name="file" size={20}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>marin-lavoie-cv.pdf</div>
                <div style={{ fontSize: 12, color: "var(--ink-muted)" }}>312 Ko · MAJ il y a 2 jours</div>
              </div>
              <button style={{ ...iconBtn }}><Icon name="upload" size={14}/></button>
            </div>
            <div style={{ marginTop: 14, padding: 12, background: "var(--teal-tint)", borderRadius: 10, display: "flex", alignItems: "flex-start", gap: 10, fontSize: 12, color: "var(--teal-deep)" }}>
              <Icon name="sparkle" size={14}/>
              <span><strong>CV solide.</strong> Les recruteurs passent en moyenne <strong>4:12</strong> sur le vôtre — au-dessus de la médiane plateforme à 2:50.</span>
            </div>
          </div>

          <div className="hg-card" style={{ padding: 22 }}>
            <div className="hg-eyebrow" style={{ marginBottom: 12 }}>Entretiens réservés</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 14, borderBottom: "1px solid var(--line)" }}>
              <Avatar name="Sora Studio" size="md"/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>Sora Studio</div>
                <div style={{ fontSize: 12, color: "var(--ink-muted)" }}>Designer senior · 30 min</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, color: "var(--ink-muted)" }}>Demain</div>
                <div className="hg-mono" style={{ fontSize: 13, fontWeight: 500 }}>14:30</div>
              </div>
            </div>
            <button className="hg-btn hg-btn-ghost" style={{ width: "100%", marginTop: 14, justifyContent: "center" }}>
              <Icon name="video" size={14}/> Rejoindre le salon
            </button>
          </div>

          <div className="hg-card" style={{ padding: 22 }}>
            <div className="hg-eyebrow" style={{ marginBottom: 12 }}>Activité récente</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: 13 }}>
              {[
                { i: "check", c: "var(--teal-deep)", t: "Accepté par Sora Studio — entretien jeudi 14:30", time: "il y a 2h" },
                { i: "clock", c: "var(--ink-muted)", t: "Passé en position n°3 chez Helix Bio", time: "mar." },
                { i: "file", c: "var(--ink-muted)", t: "CV ouvert par Northwind Robotics", time: "lun." },
              ].map((a, i) => (
                <div key={i} style={{ display: "flex", gap: 10 }}>
                  <div style={{ color: a.c, paddingTop: 2 }}><Icon name={a.i} size={14}/></div>
                  <div style={{ flex: 1 }}>
                    <div>{a.t}</div>
                    <div style={{ color: "var(--ink-faint)", fontSize: 11, marginTop: 2 }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

const iconBtn = {
  width: 32, height: 32, borderRadius: 8, border: "1px solid var(--line)",
  background: "var(--surface)", color: "var(--ink)", cursor: "pointer",
  display: "inline-grid", placeItems: "center",
};

Object.assign(window, { AppShell, TopBar, SidebarLink, CandidateDashboard, SessionCard, iconBtn });
