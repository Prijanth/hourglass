import React from 'react'
import { Icon, Avatar, Pill, SlotIndicator } from './ui'
import { AppShell, TopBar, SidebarLink, iconBtn } from './candidate-dashboard'

const CANDIDATES_IN_QUEUE = [
  { name: "Akira Tan",    role: "Product Designer senior", loc: "Berlin",  yrs: 6 },
  { name: "Sofia Bianchi",role: "Product Designer senior", loc: "Milan",   yrs: 8 },
  { name: "Devon Park",   role: "Product Designer senior", loc: "Toronto", yrs: 5 },
]

const SESSIONS_PAST = [
  { date: "14 mai",   role: "Designer senior",     reviewed: 5, accepted: 2, interviews: 2 },
  { date: "7 mai",    role: "Designer de marque",  reviewed: 4, accepted: 1, interviews: 1 },
  { date: "30 avr.",  role: "Designer senior",     reviewed: 6, accepted: 3, interviews: 3 },
  { date: "23 avr.",  role: "UX Researcher",       reviewed: 5, accepted: 2, interviews: 2 },
]

const RecruiterDashboard = ({ navigate = () => {} }) => (
  <AppShell role="recruiter" page="Vue" navigate={navigate}>
    <TopBar title="Bonjour Hana" sub="Vous avez une session dans 2h 14min. 3 candidats sont déjà dans la file.">
      <button className="hg-btn hg-btn-ghost"><Icon name="calendar" size={14}/> 22 mai 2026</button>
      <button className="hg-btn hg-btn-teal"><Icon name="plus" size={14}/> Nouvelle session</button>
    </TopBar>

    <div style={{ padding: 36, display: "grid", gridTemplateColumns: "1fr 360px", gap: 28, alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {/* Prochaine session */}
        <div style={{ background: "var(--surface)", borderRadius: 20, border: "1px solid var(--line)", padding: 28, position: "relative", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <Pill tone="coral" live>Live dans 2h 14min</Pill>
                <Pill tone="teal"><Icon name="check" size={11}/> Recruteur vérifié</Pill>
              </div>
              <h2 className="hg-display" style={{ fontSize: 32, marginBottom: 6 }}>Product Designer senior · Tour 7</h2>
              <div style={{ color: "var(--ink-muted)", fontSize: 14 }}>Jeudi 22 mai · 15:00 – 16:00 · 5 candidats · revues 5 min · entretiens 30 min</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="hg-eyebrow">Démarre dans</div>
              <div className="hg-mono" style={{ fontSize: 48, fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1, marginTop: 4 }}>2:14:08</div>
            </div>
          </div>
          <hr className="hg-divider" style={{ margin: "24px 0" }}/>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span className="hg-eyebrow">Candidats inscrits</span>
              <SlotIndicator filled={3} total={5} size={10}/>
              <span style={{ fontSize: 13, color: "var(--ink-muted)" }}>3 places sur 5 · 2 libres</span>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="hg-btn hg-btn-ghost"><Icon name="users" size={14}/> Voir la file</button>
              <button className="hg-btn hg-btn-primary" onClick={() => navigate('session')}>
                <Icon name="hourglass" size={14}/> Ouvrir le studio
              </button>
            </div>
          </div>
          <div style={{ display: "flex", marginTop: 20, gap: 14, alignItems: "center" }}>
            {CANDIDATES_IN_QUEUE.map(c => (
              <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px 8px 8px", borderRadius: 999, background: "var(--surface-2)" }}>
                <Avatar name={c.name} size="sm"/>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>{c.name}</div>
                  <div style={{ fontSize: 10, color: "var(--ink-muted)" }}>{c.loc} · {c.yrs} ans</div>
                </div>
              </div>
            ))}
            {[0,1].map(i => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 999, border: "1.5px dashed var(--line-strong)", color: "var(--ink-faint)", fontSize: 12 }}>
                <Icon name="plus" size={12}/> Place libre
              </div>
            ))}
          </div>
        </div>

        {/* Métriques */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {[
            { l: "Sessions organisées",    n: "23",   d: "+4 ce mois" },
            { l: "Durée moyenne de revue", n: "3:42", d: "sur 5:00 max", mono: true },
            { l: "Taux d'acceptation",     n: "41 %", d: "↑ 6 pts vs T1" },
            { l: "Entretiens planifiés",   n: "47",   d: "12 cette semaine" },
          ].map((m, i) => (
            <div key={i} className="hg-card" style={{ padding: 20 }}>
              <div className="hg-eyebrow" style={{ fontSize: 10 }}>{m.l}</div>
              <div className={m.mono ? "hg-mono" : "hg-display"} style={{ fontSize: 34, fontWeight: 600, marginTop: 8, lineHeight: 1 }}>{m.n}</div>
              <div style={{ fontSize: 12, color: "var(--ink-muted)", marginTop: 6 }}>{m.d}</div>
            </div>
          ))}
        </div>

        {/* Sessions passées */}
        <div className="hg-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--line)" }}>
            <h3 className="hg-display" style={{ fontSize: 18 }}>Sessions passées</h3>
            <a style={{ fontSize: 13, color: "var(--ink-muted)", cursor: "pointer" }}>Tout voir <Icon name="arrowRight" size={11}/></a>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ fontSize: 11, color: "var(--ink-faint)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {["Date","Poste","Lus","Acceptés","Entretiens","Entonnoir",""].map((h,i) => (
                  <th key={i} style={tHead}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SESSIONS_PAST.map((s, i) => (
                <tr key={i} style={{ borderTop: "1px solid var(--line)" }}>
                  <td style={tCell}>{s.date}</td>
                  <td style={{ ...tCell, fontWeight: 500 }}>{s.role}</td>
                  <td style={tCell}>{s.reviewed}</td>
                  <td style={tCell}>{s.accepted}</td>
                  <td style={tCell}>{s.interviews}</td>
                  <td style={tCell}>
                    <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
                      <div style={{ width: 50, height: 6, borderRadius: 999, background: "var(--ink)" }}/>
                      <div style={{ width: 50*(s.accepted/s.reviewed), height: 6, borderRadius: 999, background: "var(--teal)" }}/>
                      <div style={{ width: 50*(s.interviews/s.reviewed), height: 6, borderRadius: 999, background: "var(--violet)" }}/>
                    </div>
                  </td>
                  <td style={tCell}><a style={{ color: "var(--ink-muted)", fontSize: 13, cursor: "pointer" }}>Compte-rendu</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div className="hg-card" style={{ padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Avatar name="Hana Okonkwo" size="lg"/>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Hana Okonkwo</div>
              <div style={{ fontSize: 12, color: "var(--ink-muted)" }}>Directrice Design, Arche RH</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
            <Pill tone="teal"><Icon name="check" size={11}/> Vérifiée</Pill>
            <Pill tone="default"><Icon name="star" size={11}/> 4,9 note candidats</Pill>
            <Pill tone="default">98 % ponctualité</Pill>
          </div>
        </div>

        <div className="hg-card" style={{ padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div className="hg-eyebrow">Planification rapide</div>
            <Icon name="calendar" size={14} stroke="var(--ink-muted)"/>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 14 }}>
            {["L","M","M","J","V","S","D"].map((d, i) => (
              <div key={i} style={{ textAlign: "center", fontSize: 10, color: "var(--ink-faint)", padding: "4px 0" }}>{d}</div>
            ))}
            {Array.from({ length: 28 }).map((_, i) => {
              const day = i + 1
              const active  = day === 22
              const session = [22, 28, 29].includes(day)
              return (
                <div key={i} style={{ aspectRatio: "1", borderRadius: 6, display: "grid", placeItems: "center", fontSize: 11, position: "relative", background: active ? "var(--ink)" : session ? "var(--teal-tint)" : "transparent", color: active ? "var(--bg)" : "var(--ink)", fontWeight: active ? 600 : 400 }}>
                  {day}
                  {session && !active && <div style={{ position: "absolute", bottom: 2, width: 3, height: 3, borderRadius: 999, background: "var(--teal-deep)" }}/>}
                </div>
              )
            })}
          </div>
          <button className="hg-btn hg-btn-teal" style={{ width: "100%", justifyContent: "center" }}>
            <Icon name="plus" size={14}/> Ouvrir un créneau
          </button>
        </div>

        <div className="hg-card" style={{ padding: 22 }}>
          <div className="hg-eyebrow" style={{ marginBottom: 14 }}>Entretiens à venir</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { name: "Mira Achebe",  role: "Designer senior",     when: "Auj. · 16:30", color: "var(--teal-deep)" },
              { name: "Theo Bakker",  role: "Designer senior",     when: "Demain · 10:00",color: "var(--ink-muted)" },
              { name: "Lila Renaud",  role: "Designer de marque",  when: "Ven. · 14:00",  color: "var(--ink-muted)" },
            ].map(p => (
              <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar name={p.name} size="sm"/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: "var(--ink-muted)" }}>{p.role}</div>
                </div>
                <div style={{ fontSize: 11, color: p.color, fontFamily: "var(--font-mono)" }}>{p.when}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </AppShell>
)

const tHead = { textAlign: "left", padding: "12px 24px", fontWeight: 500 }
const tCell = { padding: "16px 24px", fontSize: 13, color: "var(--ink)" }

export default RecruiterDashboard
