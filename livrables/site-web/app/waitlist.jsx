/* Waitlist / Coming Soon — Hourglass (FR) */

const WaitlistPage = ({ navigate = () => {} }) => {
  const [role, setRole] = React.useState("candidat");
  const [email, setEmail] = React.useState("");
  const [reason, setReason] = React.useState("");

  return (
    <div className="hg-app" style={{
      width: 1440, height: 1024, background: "var(--bg)",
      display: "grid", gridTemplateColumns: "1.05fr 0.95fr",
      overflow: "hidden", position: "relative",
    }}>
      {/* LEFT */}
      <div style={{ padding: "56px 72px 56px 72px", display: "flex", flexDirection: "column" }}>
        <div style={{ cursor: "pointer" }} onClick={() => navigate('accueil')}><Logo size="md"/></div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 540 }}>
          <Pill tone="coral" live style={{ alignSelf: "flex-start", marginBottom: 28 }}>Bêta privée · sur invitation</Pill>
          <h1 className="hg-display" style={{ fontSize: 72, lineHeight: 0.98, letterSpacing: "-0.03em" }}>
            La boucle d'embauche, chronométrée.
          </h1>
          <p style={{ fontSize: 18, color: "var(--ink-muted)", marginTop: 22, lineHeight: 1.55 }}>
            Sessions live. Revues de 5 minutes. Entretiens de 30 minutes. Nous ouvrons <strong style={{ color: "var(--ink)" }}>50 places candidats</strong> et <strong style={{ color: "var(--ink)" }}>10 équipes RH</strong> par semaine — choisissez votre côté, on vous envoie un créneau.
          </p>

          <div style={{ marginTop: 40, padding: 24, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 20, boxShadow: "var(--shadow-card)" }}>
            <div style={{ display: "flex", gap: 6, padding: 5, background: "var(--bg-tint)", borderRadius: 12, marginBottom: 18 }}>
              {[["candidat","Je cherche un poste","user"],["recruteur","Je recrute","briefcase"]].map(([r, lbl, icon]) => (
                <button key={r} onClick={() => setRole(r)} style={{
                  flex: 1, padding: "12px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                  fontWeight: 500, fontSize: 13, transition: "all .15s",
                  background: role === r ? "var(--surface)" : "transparent",
                  boxShadow: role === r ? "0 1px 3px rgba(15,19,32,0.08)" : "none",
                  color: role === r ? "var(--ink)" : "var(--ink-muted)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}>
                  <Icon name={icon} size={14}/> {lbl}
                </button>
              ))}
            </div>

            <label style={fieldLabel}>E-mail professionnel</label>
            <input className="hg-input" placeholder="vous@boulot.com" value={email} onChange={e => setEmail(e.target.value)}/>

            <label style={{ ...fieldLabel, marginTop: 14 }}>
              {role === "candidat" ? "Je cherche" : "Je recrute pour"}
            </label>
            <input className="hg-input" placeholder={role === "candidat" ? "ex. Product Designer senior, remote, Europe" : "ex. Ingénieur backend · Berlin · 2 postes"} value={reason} onChange={e => setReason(e.target.value)}/>

            <button className="hg-btn hg-btn-xl hg-btn-teal" style={{ width: "100%", marginTop: 18, justifyContent: "center" }}>
              Réserver ma place <Icon name="arrowRight" size={16}/>
            </button>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontSize: 11, color: "var(--ink-faint)" }}>
              <span>Un mail quand votre tour arrive. Promis.</span>
              <span><span className="hg-dot-live" style={{ display: "inline-block", marginRight: 6, background: "var(--teal)" }}/><strong style={{ color: "var(--ink)" }}>2 847</strong> déjà dans la file</span>
            </div>
          </div>

          <div style={{ marginTop: 32, display: "flex", gap: 28 }}>
            {[
              { n: "2 847", l: "Candidats" },
              { n: "421", l: "Équipes RH" },
              { n: "8 jours", l: "Délai moyen jusqu'à l'entretien" },
            ].map(s => (
              <div key={s.l}>
                <div className="hg-display" style={{ fontSize: 28, fontWeight: 600, lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: 12, color: "var(--ink-muted)", marginTop: 4 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 12, color: "var(--ink-faint)" }}>
          © 2026 Hourglass Labs · Construit à Paris, Berlin et Lagos.
        </div>
      </div>

      {/* RIGHT */}
      <div style={{ background: "var(--ink)", color: "var(--bg)", padding: "56px 56px", position: "relative", overflow: "hidden" }}>
        <BgGrid/>
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 18, height: "100%" }}>
          <div className="hg-eyebrow" style={{ color: "var(--teal)" }}>Ce qui arrive</div>

          <div style={featureCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div className="hg-eyebrow" style={{ color: "rgba(250,250,247,0.5)", marginBottom: 8 }}>01 · Sessions live</div>
                <div className="hg-display" style={{ fontSize: 24, marginBottom: 6 }}>Le recruteur ouvre un créneau.</div>
                <div style={{ color: "rgba(250,250,247,0.6)", fontSize: 13, maxWidth: 400, lineHeight: 1.55 }}>
                  Une heure le jeudi, 5 candidats max. Les deux côtés s'engagent à être là.
                </div>
              </div>
              <Pill tone="coral" live style={{ background: "rgba(255,92,92,0.18)", color: "#FF8B8B", borderColor: "rgba(255,92,92,0.35)" }}>Live</Pill>
            </div>
            <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 10 }}>
              {["Akira Tan", "Sofia Bianchi", "Devon Park", "Mira Achebe", "Yusuf E."].map((n, i) => (
                <div key={n} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 12px 5px 5px", borderRadius: 999, background: "rgba(255,255,255,0.06)" }}>
                  <Avatar name={n} size="sm"/>
                  <span style={{ fontSize: 11, color: "rgba(250,250,247,0.7)" }}>n°{i+1}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={featureCard}>
            <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
              <div style={{ flexShrink: 0 }}>
                <CountdownRing seconds={227} total={300} color="var(--teal)"/>
              </div>
              <div style={{ flex: 1 }}>
                <div className="hg-eyebrow" style={{ color: "rgba(250,250,247,0.5)", marginBottom: 8 }}>02 · Revue de CV en 5 min</div>
                <div className="hg-display" style={{ fontSize: 24, marginBottom: 6 }}>Un CV. Un chrono. Une décision.</div>
                <div style={{ color: "rgba(250,250,247,0.6)", fontSize: 13, lineHeight: 1.55 }}>
                  Accepter ou passer. Pas de « on revient vers vous dans 4 à 6 semaines ».
                </div>
              </div>
            </div>
          </div>

          <div style={featureCard}>
            <div className="hg-eyebrow" style={{ color: "rgba(250,250,247,0.5)", marginBottom: 8 }}>03 · Entretien de 30 min</div>
            <div className="hg-display" style={{ fontSize: 24, marginBottom: 6 }}>Accepté ? Vous êtes dans l'agenda.</div>
            <div style={{ color: "rgba(250,250,247,0.6)", fontSize: 13, maxWidth: 440, lineHeight: 1.55 }}>
              Salon visio intégré. Le jour même, la même boucle, une vraie conversation.
            </div>
            <div style={{ marginTop: 16, padding: 14, background: "rgba(0,201,167,0.08)", borderRadius: 10, border: "1px solid rgba(0,201,167,0.25)", display: "flex", alignItems: "center", gap: 12 }}>
              <Avatar name="Mira Achebe" size="sm"/>
              <div style={{ flex: 1, fontSize: 12, color: "rgba(250,250,247,0.85)" }}>
                Mira Achebe acceptée par Hana Okonkwo · entretien <span className="hg-mono">jeu. 16:30</span>
              </div>
              <Icon name="check" size={14} stroke="var(--teal)"/>
            </div>
          </div>

          <div style={{ flex: 1 }}/>
          <div style={{ fontSize: 11, color: "rgba(250,250,247,0.4)", display: "flex", justifyContent: "space-between" }}>
            <span><span className="hg-mono">v0.7</span> · sortie en juillet</span>
            <span>Presse · jobs · manifeste</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const fieldLabel = {
  display: "block",
  fontSize: 12, fontWeight: 500,
  color: "var(--ink-muted)",
  marginBottom: 8,
};

const featureCard = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 16, padding: 22,
};

window.WaitlistPage = WaitlistPage;
