/* Router — navigation entre les pages Hourglass */

const PAGES = [
  { id: 'accueil',   label: 'Accueil',          icon: 'home',      component: LandingPage },
  { id: 'candidat',  label: 'Espace candidat',   icon: 'user',      component: CandidateDashboard },
  { id: 'recruteur', label: 'Espace recruteur',  icon: 'briefcase', component: RecruiterDashboard },
  { id: 'session',   label: 'Session live',      icon: 'hourglass', component: LiveSession },
  { id: 'waitlist',  label: "Liste d'attente",   icon: 'bell',      component: WaitlistPage },
];

const FloatingNav = ({ current, onNavigate }) => {
  const base = {
    display: 'flex', alignItems: 'center', gap: 4,
    padding: '7px 16px', borderRadius: 100, border: 'none',
    cursor: 'pointer', fontSize: 13, fontWeight: 500,
    transition: 'background 0.15s, color 0.15s', fontFamily: 'var(--font-body)',
  };
  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      zIndex: 9999, display: 'flex', gap: 2, alignItems: 'center',
      background: '#0F1320', borderRadius: 100,
      padding: '5px 8px',
      boxShadow: '0 8px 40px rgba(15,19,32,0.35), 0 0 0 1px rgba(255,255,255,0.07)',
    }}>
      {PAGES.map(p => (
        <button
          key={p.id}
          onClick={() => onNavigate(p.id)}
          style={{
            ...base,
            background: current === p.id ? 'var(--teal)' : 'transparent',
            color:      current === p.id ? '#0F1320'      : 'rgba(255,255,255,0.55)',
          }}
        >
          <Icon name={p.icon} size={13}/>
          <span style={{ marginLeft: 4 }}>{p.label}</span>
        </button>
      ))}
    </div>
  );
};

const HourglassApp = () => {
  const readHash = () => {
    const h = window.location.hash.replace(/^#\/?/, '');
    return PAGES.find(p => p.id === h) ? h : 'accueil';
  };

  const [current, setCurrent] = React.useState(readHash);

  React.useEffect(() => {
    const onHash = () => {
      setCurrent(readHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = (pageId) => {
    window.location.hash = '#/' + pageId;
    setCurrent(pageId);
    window.scrollTo(0, 0);
  };

  const page = PAGES.find(p => p.id === current) || PAGES[0];
  const PageComponent = page.component;

  return (
    <div style={{ minHeight: '100vh', overflowX: 'auto', background: 'var(--bg)' }}>
      <PageComponent navigate={navigate}/>
      <div style={{ height: 80 }}/>{/* espace sous la nav flottante */}
      <FloatingNav current={current} onNavigate={navigate}/>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<HourglassApp/>);
