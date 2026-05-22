/* Landing page — Hourglass (FR) */
const LandingPage = ({ navigate = () => {} }) => {
  const [role, setRole] = React.useState("candidat");
  const [email, setEmail] = React.useState("");

  return (
    <div className="hg-app" style={{ width: 1440, minHeight: 2400, background: "var(--bg)", overflow: "hidden" }}>
      {/* NAV */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "22px 64px",
        borderBottom: "1px solid var(--line)",
        background: "rgba(250,250,247,0.85)",
        backdropFilter: "blur(10px)",
      }}>
        <Logo size="md"/>
        <nav style={{ display: "flex", gap: 36, fontSize: 14, color: "var(--ink-muted)" }}>
          <a style={navLink}>Comment ça marche</a>
          <a style={navLink} onClick={() => navigate('candidat')}>Candidats</a>
          <a style={navLink} onClick={() => navigate('recruteur')}>Recruteurs</a>
          <a style={navLink}>Tarifs</a>
        </nav>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button className="hg-btn hg-btn-ghost">Se connecter</button>
          <button className="hg-btn hg-btn-primary" onClick={() => navigate('waitlist')}>Rejoindre la liste <Icon name="arrowRight" size={14}/></button>
        </div>
      </header>

      {/* HERO */}
      <section style={{ padding: "88px 64px 80px", position: "relative" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 64, alignItems: "center" }}>
          <div>
            <Pill tone="teal" style={{ marginBottom: 24 }}>
              <Icon name="bolt" size={12}/> Bêta privée · 2 847 inscrits
            </Pill>
            <h1 className="hg-display" style={{ fontSize: 88, lineHeight: 0.96, letterSpacing: "-0.035em", fontWeight: 600 }}>
              Arrêtez d'envoyer<br/>
              des CV dans <span style={{ position: "relative", display: "inline-block" }}>
                le vide<HeroUnderline/>
              </span>.
            </h1>
            <p style={{ fontSize: 21, color: "var(--ink-muted)", marginTop: 28, maxWidth: 560, lineHeight: 1.5 }}>
              Hourglass, c'est le recrutement façon speed dating. Les recruteurs ouvrent un créneau en direct, les candidats prennent la file, et les deux côtés s'engagent dans une vraie conversation chronométrée — pas un énième mail perdu.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 40 }}>
              <button className="hg-btn hg-btn-xl hg-btn-primary" onClick={() => navigate('candidat')}>
                Je suis candidat <Icon name="arrowRight" size={16}/>
              </button>
              <button className="hg-btn hg-btn-xl hg-btn-ghost" onClick={() => navigate('recruteur')}>
                Je recrute <Icon name="arrowRight" size={16}/>
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 36, color: "var(--ink-muted)", fontSize: 13 }}>
              <div style={{ display: "flex" }}>
                {["Sophie Marin","Akira Tan","Léa Voss","Marc Hale"].map((n, i) => (
                  <div key={n} style={{ marginLeft: i === 0 ? 0 : -10 }}>
                    <Avatar name={n} size="sm"/>
                  </div>
                ))}
              </div>
              <span>Cette semaine : <strong style={{ color: "var(--ink)" }}>+312 candidats</strong> · <strong style={{ color: "var(--ink)" }}>47 équipes RH</strong></span>
            </div>
          </div>

          {/* HERO CARD */}
          <HeroVisual/>
        </div>
      </section>

      {/* MARQUEE */}
      <section style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", padding: "20px 0", overflow: "hidden", background: "var(--surface)" }}>
        <div style={{ display: "flex", gap: 48, alignItems: "center", whiteSpace: "nowrap" }}>
          {["Product Designer senior · 4 places","Ingénieur Backend · 2 places","Responsable Marketing · live dans 14 min","Data Scientist · session complète","Développeur iOS · 5 places","UX Researcher · live dans 2h","Growth PM · 3 places","Ingénieur Frontend · en direct","Customer Success Lead · 5 places"].map((t, i) => (
            <span key={i} style={{ fontSize: 13, color: "var(--ink-muted)", display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span className="hg-dot-live" style={{ background: i % 3 === 0 ? "var(--coral)" : "var(--teal)" }}/>
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "120px 64px" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div className="hg-eyebrow" style={{ marginBottom: 12 }}>Comment ça marche</div>
          <h2 className="hg-display" style={{ fontSize: 56, maxWidth: 820, margin: "0 auto" }}>
            Deux côtés. Une horloge. Une vraie conversation.
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, position: "relative" }}>
          <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "var(--line)", transform: "translateX(-50%)" }}/>
          <FlowColumn
            title="Côté candidat"
            color="teal"
            icon="user"
            steps={[
              { n: "01", t: "Déposez votre CV", d: "Glisser, déposer, c'est fait. Réutilisable pour chaque session — fini les lettres de motivation à rallonge." },
              { n: "02", t: "Candidatez à un créneau live", d: "Parcourez les recruteurs qui ont ouvert une session cette semaine. Vous savez exactement quand ils vous liront." },
              { n: "03", t: "Suivez votre position", d: "File d'attente en temps réel — vous saurez que vous êtes 3e, pas perdu dans une boîte noire." },
              { n: "04", t: "Décrochez l'entretien de 30 min", d: "Si le recruteur vous accepte dans ses 5 minutes, vous filez direct sur un créneau visio. Pas de relance." },
            ]}
          />
          <FlowColumn
            title="Côté recruteur"
            color="ink"
            icon="briefcase"
            steps={[
              { n: "01", t: "Ouvrez une session", d: "Choisissez une date, une heure et un nombre de candidats. Hourglass gère la file." },
              { n: "02", t: "Sprintez en 5 minutes", d: "Un candidat, un CV, un chrono. Fini de scroller 200 profils à 23h." },
              { n: "03", t: "Accepter ou passer", d: "Deux boutons. La décision avance avec vous — pas de tableur, pas de fil Slack." },
              { n: "04", t: "Se rencontrer, vraiment", d: "Les candidats acceptés tombent sur un créneau visio de 30 min dans votre agenda. La boucle est bouclée." },
            ]}
          />
        </div>
      </section>

      {/* DIFF */}
      <section style={{ padding: "0 64px 120px" }}>
        <div style={{ background: "var(--ink)", color: "var(--bg)", borderRadius: 28, padding: "80px 72px", position: "relative", overflow: "hidden" }}>
          <BgGrid/>
          <div className="hg-eyebrow" style={{ color: "var(--teal)", marginBottom: 16, position: "relative" }}>La différence</div>
          <h2 className="hg-display" style={{ fontSize: 56, maxWidth: 820, marginBottom: 56, position: "relative" }}>
            Pas un job board. Pas un réseau. <span style={{ color: "var(--teal)" }}>Une horloge, deux personnes dessus.</span>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, position: "relative" }}>
            <DiffCard
              kind="old"
              title="Le recrutement aujourd'hui"
              rows={[
                "Poster une offre, attendre des semaines",
                "1 200 CV, la moitié générés par IA",
                "Candidats ghostés dans le vide",
                "Recruteurs qui survolent des profils à minuit",
                "Deux mois entre candidature et entretien",
              ]}
            />
            <DiffCard
              kind="new"
              title="Le recrutement sur Hourglass"
              rows={[
                "Ouvrir un créneau d'1h ce jeudi",
                "Jusqu'à 5 CV, chacun lu en 5 min",
                "Les candidats voient leur position en direct",
                "Le recruteur décide dans un sprint focus",
                "Le jour même : accepté → entretien 30 min",
              ]}
            />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: "0 64px 120px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
          {[
            { n: "4 182", l: "Sessions organisées" },
            { n: "31 460", l: "Candidats matchés" },
            { n: "1 247", l: "Équipes qui recrutent" },
            { n: "3,4 j", l: "Délai médian jusqu'à l'entretien" },
          ].map((s, i) => (
            <div key={i} style={{
              padding: "48px 32px",
              borderLeft: i === 0 ? "none" : "1px solid var(--line)",
            }}>
              <div className="hg-display" style={{ fontSize: 56, fontWeight: 600, lineHeight: 1 }}>{s.n}</div>
              <div style={{ color: "var(--ink-muted)", marginTop: 12, fontSize: 14 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WAITLIST CTA */}
      <section style={{ padding: "0 64px 120px" }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 28, padding: 64, display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <Pill tone="coral" live>Liste ouverte</Pill>
            <h2 className="hg-display" style={{ fontSize: 52, marginTop: 20, lineHeight: 1.02 }}>
              Soyez dans la première salle.
            </h2>
            <p style={{ color: "var(--ink-muted)", fontSize: 17, marginTop: 16, maxWidth: 480 }}>
              Nous ouvrons 50 places candidats et 10 places recruteurs par semaine. Choisissez votre côté, on vous envoie un créneau dès qu'une session correspond.
            </p>
          </div>
          <div>
            <div style={{ display: "flex", gap: 6, padding: 6, background: "var(--bg-tint)", borderRadius: 999, marginBottom: 16 }}>
              {[["candidat", "Je suis candidat"], ["recruteur", "Je recrute"]].map(([r, lbl]) => (
                <button key={r} onClick={() => setRole(r)} style={{
                  flex: 1, padding: "10px 16px", borderRadius: 999, border: "none", cursor: "pointer",
                  fontWeight: 500, fontSize: 14, transition: "all .15s",
                  background: role === r ? "var(--ink)" : "transparent",
                  color: role === r ? "var(--bg)" : "var(--ink-muted)",
                }}>
                  {lbl}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input className="hg-input" placeholder="vous@boulot.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ flex: 1 }}/>
              <button className="hg-btn hg-btn-lg hg-btn-teal">Réserver ma place</button>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, fontSize: 12, color: "var(--ink-faint)" }}>
              <span>Pas de spam. Un mail quand votre tour arrive.</span>
              <span><strong style={{ color: "var(--ink)" }}>2 847</strong> déjà dans la file</span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "48px 64px", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--ink-muted)", fontSize: 13 }}>
        <Logo size="sm"/>
        <div style={{ display: "flex", gap: 28 }}>
          <a style={navLink}>Manifeste</a>
          <a style={navLink}>Recrutement</a>
          <a style={navLink}>Confidentialité</a>
          <a style={navLink}>CGU</a>
          <a style={navLink}>Contact</a>
        </div>
        <span>© 2026 Hourglass Labs · Paris</span>
      </footer>
    </div>
  );
};

const navLink = { color: "var(--ink-muted)", textDecoration: "none", cursor: "pointer", fontWeight: 450 };

const HeroUnderline = () => (
  <svg viewBox="0 0 280 18" style={{ position: "absolute", bottom: -8, left: 0, width: "100%", height: 18 }} preserveAspectRatio="none">
    <path d="M2 14 Q 70 4, 140 10 T 278 8" stroke="#00C9A7" strokeWidth="5" fill="none" strokeLinecap="round"/>
  </svg>
);

const HeroVisual = () => (
  <div style={{ position: "relative", height: 540 }}>
    <div style={{
      position: "absolute", inset: 0, background: "var(--ink)", color: "var(--bg)",
      borderRadius: 24, padding: 28, transform: "rotate(-2deg)",
      boxShadow: "0 30px 60px -20px rgba(15,19,32,0.35)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <Pill tone="coral" live style={{ background: "rgba(255,92,92,0.15)", color: "#FF8888", borderColor: "rgba(255,92,92,0.35)" }}>Session live</Pill>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, opacity: 0.6 }}>Candidat 2 sur 5</span>
      </div>
      <div style={{ textAlign: "center", padding: "8px 0 24px" }}>
        <div className="hg-mono" style={{ fontSize: 88, fontWeight: 500, letterSpacing: "-0.03em", color: "var(--teal)" }}>
          3:47
        </div>
        <div style={{ fontSize: 12, color: "rgba(250,250,247,0.5)", fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}>CHRONO DE LECTURE</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 0", borderTop: "1px solid rgba(250,250,247,0.1)", borderBottom: "1px solid rgba(250,250,247,0.1)" }}>
        <Avatar name="Akira Tan" size="lg"/>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 16 }}>Akira Tan</div>
          <div style={{ fontSize: 13, opacity: 0.6 }}>Product Designer senior · Berlin · 6 ans</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
        <button style={{ ...bigBtn, background: "rgba(255,255,255,0.06)", color: "var(--bg)" }}>
          <Icon name="x" size={18}/> Passer
        </button>
        <button style={{ ...bigBtn, background: "var(--teal)", color: "var(--ink)" }}>
          <Icon name="check" size={18}/> Accepter
        </button>
      </div>
    </div>

    <div style={{
      position: "absolute", right: -20, bottom: -10, width: 280,
      background: "var(--surface)", border: "1px solid var(--line)",
      borderRadius: 20, padding: 20, transform: "rotate(3deg)",
      boxShadow: "0 30px 60px -20px rgba(15,19,32,0.2)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span className="hg-eyebrow">Votre position</span>
        <Pill tone="teal">Dans la file</Pill>
      </div>
      <div className="hg-display" style={{ fontSize: 64, lineHeight: 1, marginBottom: 4 }}>n°3</div>
      <div style={{ color: "var(--ink-muted)", fontSize: 13, marginBottom: 16 }}>sur 5 · ~18 min avant votre tour</div>
      <div style={{ display: "flex", gap: 4 }}>
        {[1,2,3,4,5].map((n) => (
          <div key={n} style={{
            flex: 1, height: 6, borderRadius: 999,
            background: n <= 2 ? "var(--ink)" : n === 3 ? "var(--teal)" : "var(--line-strong)",
          }}/>
        ))}
      </div>
    </div>
  </div>
);

const bigBtn = {
  flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
  padding: "14px 18px", border: "none", borderRadius: 12, cursor: "pointer",
  fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 600,
};

const FlowColumn = ({ title, color, icon, steps }) => (
  <div style={{ padding: "8px 32px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12,
        background: color === "teal" ? "var(--teal)" : "var(--ink)",
        color: color === "teal" ? "var(--ink)" : "var(--bg)",
        display: "grid", placeItems: "center",
      }}>
        <Icon name={icon} size={20}/>
      </div>
      <h3 className="hg-display" style={{ fontSize: 28 }}>{title}</h3>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {steps.map((s) => (
        <div key={s.n} style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: 16 }}>
          <div className="hg-mono" style={{ color: color === "teal" ? "var(--teal-deep)" : "var(--ink-faint)", fontSize: 13, paddingTop: 4 }}>{s.n}</div>
          <div>
            <div style={{ fontSize: 19, fontWeight: 600, marginBottom: 6, fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}>{s.t}</div>
            <div style={{ color: "var(--ink-muted)", fontSize: 15, lineHeight: 1.55 }}>{s.d}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const BgGrid = () => (
  <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.05 }}>
    <defs>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)"/>
  </svg>
);

const DiffCard = ({ kind, title, rows }) => (
  <div style={{
    background: kind === "new" ? "rgba(0,201,167,0.08)" : "rgba(255,255,255,0.04)",
    border: kind === "new" ? "1px solid rgba(0,201,167,0.3)" : "1px solid rgba(255,255,255,0.08)",
    borderRadius: 20, padding: 32,
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
      {kind === "old"
        ? <Icon name="x" size={16}/>
        : <div style={{ width: 18, height: 18, borderRadius: 999, background: "var(--teal)", display: "grid", placeItems: "center" }}>
            <Icon name="check" size={12} stroke="var(--ink)" strokeWidth={2.4}/>
          </div>
      }
      <span style={{ fontWeight: 500, fontSize: 14, color: kind === "new" ? "var(--teal)" : "rgba(250,250,247,0.7)" }}>{title}</span>
    </div>
    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
      {rows.map((r, i) => (
        <li key={i} style={{
          fontSize: 16, color: kind === "old" ? "rgba(250,250,247,0.55)" : "var(--bg)",
          textDecoration: kind === "old" ? "line-through" : "none", textDecorationColor: "rgba(255,92,92,0.5)",
        }}>{r}</li>
      ))}
    </ul>
  </div>
);

window.LandingPage = LandingPage;
