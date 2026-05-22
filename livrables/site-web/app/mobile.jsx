/* Mobile views — Hourglass (FR) */

const PhoneFrame = ({ children, label, time = "9:41" }) => (
  <div style={{ width: 390, height: 844, background: "var(--ink)", borderRadius: 50, padding: 12, boxShadow: "0 30px 60px -10px rgba(15,19,32,0.25)", position: "relative" }}>
    <div style={{ background: "var(--bg)", borderRadius: 38, height: "100%", overflow: "hidden", position: "relative" }}>
      <div style={{ height: 44, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 28px", position: "relative", zIndex: 10 }}>
        <span style={{ fontSize: 14, fontWeight: 600 }}>{time}</span>
        <div style={{ position: "absolute", left: "50%", top: 10, transform: "translateX(-50%)", width: 110, height: 30, background: "var(--ink)", borderRadius: 999 }}/>
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          <svg width="18" height="11" viewBox="0 0 18 11" fill="currentColor"><rect x="0" y="6" width="3" height="5" rx="1"/><rect x="5" y="4" width="3" height="7" rx="1"/><rect x="10" y="2" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="11" rx="1"/></svg>
          <svg width="24" height="11" viewBox="0 0 24 11" fill="none" stroke="currentColor" strokeWidth="1"><rect x="0.5" y="0.5" width="20" height="10" rx="2.5"/><rect x="2" y="2" width="15" height="7" rx="1" fill="currentColor"/><rect x="21" y="3.5" width="2" height="4" rx="0.5" fill="currentColor"/></svg>
        </div>
      </div>
      <div style={{ position: "absolute", inset: "44px 0 0", overflow: "hidden" }}>{children}</div>
    </div>
  </div>
);

const MobileCandidateQueue = () => (
  <div style={{ height: "100%", overflowY: "auto", paddingBottom: 100 }}>
    <div style={{ padding: "12px 20px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Logo size="sm"/>
      <div style={{ display: "flex", gap: 8 }}>
        <button style={mIconBtn}><Icon name="bell" size={16}/></button>
        <Avatar name="Marin Lavoie" size="sm"/>
      </div>
    </div>

    <div style={{ padding: "0 20px" }}>
      <h1 className="hg-display" style={{ fontSize: 28, lineHeight: 1.05 }}>Vous êtes le prochain.</h1>
      <p style={{ fontSize: 13, color: "var(--ink-muted)", marginTop: 6 }}>Helix Bio est en train de lire.</p>
    </div>

    <div style={{ margin: "20px", padding: 20, background: "var(--ink)", color: "var(--bg)", borderRadius: 20, position: "relative", overflow: "hidden" }}>
      <BgGrid/>
      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <Pill tone="coral" live style={{ background: "rgba(255,92,92,0.18)", color: "#FF8B8B", borderColor: "rgba(255,92,92,0.35)" }}>En direct</Pill>
          <Avatar name="Helix Bio" size="sm"/>
        </div>
        <div style={{ fontSize: 13, color: "rgba(250,250,247,0.6)" }}>Helix Bio</div>
        <div className="hg-display" style={{ fontSize: 22, marginTop: 2 }}>Biologiste computationnel</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 28 }}>
          <div>
            <div className="hg-eyebrow" style={{ color: "rgba(250,250,247,0.5)" }}>Votre position</div>
            <div className="hg-display" style={{ fontSize: 64, color: "var(--teal)", lineHeight: 1, marginTop: 2 }}>n°3</div>
            <div style={{ fontSize: 11, color: "rgba(250,250,247,0.5)", marginTop: 2 }}>sur 6 · ~18 min à patienter</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="hg-eyebrow" style={{ color: "rgba(250,250,247,0.5)" }}>En lecture</div>
            <div style={{ display: "flex", marginTop: 6 }}>
              {["Léa Voss", "Karim Diop"].map((n, i) => (
                <div key={n} style={{ marginLeft: i === 0 ? 0 : -8, opacity: i === 0 ? 1 : 0.5 }}>
                  <Avatar name={n} size="sm"/>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4, marginTop: 18 }}>
          {[1,2,3,4,5,6].map(n => (
            <div key={n} style={{
              flex: 1, height: 5, borderRadius: 999,
              background: n < 3 ? "var(--bg)" : n === 3 ? "var(--teal)" : "rgba(255,255,255,0.12)",
            }}/>
          ))}
        </div>
      </div>
    </div>

    <div style={{ padding: "0 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h2 className="hg-display" style={{ fontSize: 18 }}>Cette semaine</h2>
        <a style={{ fontSize: 12, color: "var(--ink-muted)" }}>Tout voir</a>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[
          { co: "Northwind Robotics", role: "Product Designer senior", time: "jeu. 15:00", slots: "3/5", status: "live" },
          { co: "Loom & Lattice", role: "Designer de marque", time: "lun. 2 juin · 14:00", slots: "2/5" },
          { co: "Postscript", role: "Growth PM", time: "jeu. 5 juin · 09:30", slots: "1/4" },
        ].map((s, i) => (
          <div key={i} style={{ padding: 16, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 14, display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar name={s.co} size="md"/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, color: "var(--ink-muted)" }}>{s.co}</div>
              <div style={{ fontSize: 14, fontWeight: 600, fontFamily: "var(--font-display)" }}>{s.role}</div>
              <div style={{ display: "flex", gap: 10, fontSize: 11, color: "var(--ink-muted)", marginTop: 4 }}>
                <span>{s.time}</span>
                <span>·</span>
                <span>{s.slots}</span>
              </div>
            </div>
            {s.status === "live"
              ? <Pill tone="coral" live>Live</Pill>
              : <button style={{ padding: "6px 12px", border: "none", borderRadius: 999, background: "var(--ink)", color: "var(--bg)", fontSize: 11, fontWeight: 500 }}>Postuler</button>
            }
          </div>
        ))}
      </div>
    </div>

    <MobileTabBar active="queue"/>
  </div>
);

const MobileLiveSession = () => (
  <div style={{ height: "100%", background: "var(--ink)", color: "var(--bg)", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
    <BgGrid/>

    <div style={{ padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <button style={{ ...mIconBtn, background: "rgba(255,255,255,0.06)", color: "var(--bg)", border: "1px solid rgba(255,255,255,0.1)" }}><Icon name="arrowLeft" size={16}/></button>
      <div style={{ textAlign: "center" }}>
        <Pill tone="coral" live style={{ background: "rgba(255,92,92,0.18)", color: "#FF8B8B", borderColor: "rgba(255,92,92,0.35)", fontSize: 10 }}>Session live</Pill>
        <div style={{ fontSize: 10, color: "rgba(250,250,247,0.5)", marginTop: 4 }}>Candidat 2 sur 5</div>
      </div>
      <button style={{ ...mIconBtn, background: "rgba(255,255,255,0.06)", color: "var(--bg)", border: "1px solid rgba(255,255,255,0.1)" }}><Icon name="pause" size={14}/></button>
    </div>

    <div style={{ textAlign: "center", padding: "32px 0 16px", position: "relative", zIndex: 1 }}>
      <CountdownRing seconds={227} total={300} color="var(--teal)"/>
    </div>

    <div style={{ padding: "0 20px", textAlign: "center", position: "relative", zIndex: 1 }}>
      <Avatar name="Akira Tan" size="lg"/>
      <div className="hg-display" style={{ fontSize: 24, marginTop: 12 }}>Akira Tan</div>
      <div style={{ fontSize: 12, color: "rgba(250,250,247,0.5)", marginTop: 4 }}>Designer senior · Berlin · 6 ans</div>
      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
        {["Design system", "B2B SaaS", "0→1"].map(t => (
          <span key={t} style={{ padding: "4px 10px", borderRadius: 999, background: "rgba(0,201,167,0.12)", color: "var(--teal)", fontSize: 10 }}>{t}</span>
        ))}
      </div>
    </div>

    <div style={{ margin: "20px", padding: 16, background: "var(--bg)", color: "var(--ink)", borderRadius: 14, flex: 1, overflow: "hidden", position: "relative", zIndex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, fontSize: 10, color: "var(--ink-muted)" }}>
        <span><Icon name="file" size={11}/> akira-tan-cv.pdf</span>
        <span>2 pages</span>
      </div>
      <div className="hg-display" style={{ fontSize: 18 }}>Akira Tan</div>
      <div style={{ fontSize: 10, color: "var(--ink-muted)", marginTop: 2 }}>Product Designer senior · Berlin</div>
      <hr className="hg-divider" style={{ margin: "10px 0" }}/>
      <div className="hg-eyebrow" style={{ fontSize: 9, marginBottom: 6 }}>Profil</div>
      <p style={{ fontSize: 11, lineHeight: 1.5, color: "var(--ink-muted)", margin: 0 }}>
        Plus de 6 ans à designer du produit. Actuellement Lead Designer chez Mirror, je livre du travail à l'intersection des design systems et du B2B SaaS. À l'aise pour porter…
      </p>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 60, background: "linear-gradient(to bottom, transparent, var(--bg))" }}/>
    </div>

    <div style={{ padding: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, position: "relative", zIndex: 1 }}>
      <button style={{ ...mDecisionBtn, background: "rgba(255,92,92,0.10)", color: "#FF8B8B", border: "1px solid rgba(255,92,92,0.25)" }}>
        <Icon name="x" size={18}/> Passer
      </button>
      <button style={{ ...mDecisionBtn, background: "var(--teal)", color: "var(--ink)", border: "1px solid var(--teal)" }}>
        <Icon name="check" size={18}/> Accepter
      </button>
    </div>
  </div>
);

const MobileTabBar = ({ active }) => (
  <div style={{
    position: "absolute", bottom: 0, left: 0, right: 0,
    background: "rgba(250,250,247,0.92)", backdropFilter: "blur(12px)",
    borderTop: "1px solid var(--line)", padding: "10px 16px 24px",
    display: "grid", gridTemplateColumns: "repeat(5, 1fr)",
  }}>
    {[
      { i: "home", l: "Accueil", k: "home" },
      { i: "calendar", l: "Sessions", k: "sessions" },
      { i: "hourglass", l: "File", k: "queue" },
      { i: "video", l: "Entretiens", k: "interviews" },
      { i: "user", l: "Profil", k: "profile" },
    ].map(t => (
      <div key={t.k} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: t.k === active ? "var(--ink)" : "var(--ink-faint)" }}>
        <Icon name={t.i} size={20}/>
        <span style={{ fontSize: 10 }}>{t.l}</span>
      </div>
    ))}
  </div>
);

const mIconBtn = {
  width: 36, height: 36, borderRadius: 10, border: "1px solid var(--line)",
  background: "var(--surface)", color: "var(--ink)", cursor: "pointer",
  display: "inline-grid", placeItems: "center",
};

const mDecisionBtn = {
  padding: "16px", borderRadius: 14,
  fontSize: 15, fontWeight: 600,
  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
  cursor: "pointer", fontFamily: "var(--font-body)",
};

window.PhoneFrame = PhoneFrame;
window.MobileCandidateQueue = MobileCandidateQueue;
window.MobileLiveSession = MobileLiveSession;
