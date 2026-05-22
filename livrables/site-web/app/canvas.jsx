/* Canvas — arranges all artboards */
const { DesignCanvas, DCSection, DCArtboard } = window;

const App = () => (
  <DesignCanvas
    title="Hourglass — le recrutement, chronométré"
    subtitle="Accueil · espace candidat · espace recruteur · session live (chrono interactif) · liste d'attente · mobile"
  >
    <DCSection id="landing" title="01 · Accueil & liste d'attente">
      <DCArtboard id="landing" label="Page d'accueil · 1440 × 2400" width={1440} height={2400}>
        <LandingPage/>
      </DCArtboard>
      <DCArtboard id="waitlist" label="Liste d'attente · 1440 × 1024" width={1440} height={1024}>
        <WaitlistPage/>
      </DCArtboard>
    </DCSection>

    <DCSection id="live" title="02 · Session live (pièce maîtresse)" subtitle="Vrai chrono de 5 min · cliquez Accepter ou Passer pour faire avancer la file">
      <DCArtboard id="live-session" label="Session live · vue recruteur · 1440 × 1024" width={1440} height={1024}>
        <LiveSession/>
      </DCArtboard>
    </DCSection>

    <DCSection id="dashboards" title="03 · Espaces personnels">
      <DCArtboard id="candidate" label="Espace candidat · 1440 × 1080" width={1440} height={1080}>
        <CandidateDashboard/>
      </DCArtboard>
      <DCArtboard id="recruiter" label="Espace recruteur · 1440 × 1080" width={1440} height={1080}>
        <RecruiterDashboard/>
      </DCArtboard>
    </DCSection>

    <DCSection id="mobile" title="04 · Mobile">
      <DCArtboard id="mobile-queue" label="Candidat · position dans la file" width={414} height={868}>
        <PhoneFrame><MobileCandidateQueue/></PhoneFrame>
      </DCArtboard>
      <DCArtboard id="mobile-live" label="Recruteur · session live" width={414} height={868}>
        <PhoneFrame><MobileLiveSession/></PhoneFrame>
      </DCArtboard>
    </DCSection>
  </DesignCanvas>
);

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
