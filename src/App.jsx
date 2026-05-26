import { useState, useEffect, useRef, useCallback } from 'react';
import AdminPanel from './AdminPanel.jsx';

/* ── DEFAULT DATA ─────────────────────────────────────────────── */
const DEFAULT_ITEMS = [
  {
    id: 1, name: "Macaroni & Pasta (500g)",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/%28Pasta%29_by_David_Adam_Kess_%28pic.2%29.jpg/960px-%28Pasta%29_by_David_Adam_Kess_%28pic.2%29.jpg",
    current_price: "140 ETB", market_trend: "STABLE",
    predicted_change_percent: "0.0%", confidence_score: "95%",
    amharic_insight: "የፓስታ እና ማካሮኒ አቅርቦት የተረጋጋ በመሆኑ ዋጋው ላይ ምንም አይነት ለውጥ አይጠበቅም።",
    english_summary: "Stable supply chain.", fetched: true,
  },
  {
    id: 2, name: "Bottled Water (2 Liters)",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/02/Stilles_Mineralwasser.jpg",
    current_price: "55 ETB", market_trend: "STABLE",
    predicted_change_percent: "0.0%", confidence_score: "98%",
    amharic_insight: "የታሸገ ውሃ ዋጋ የተረጋጋ ነው፣ በገበያ ውስጥ በቂ አቅርቦት አለ።",
    english_summary: "Abundant stock available.", fetched: true,
  },
  {
    id: 3, name: "Cooking Oil (3 Liters)",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Olive_oil_from_Oneglia.jpg/960px-Olive_oil_from_Oneglia.jpg",
    current_price: "1,350 ETB", market_trend: "UP",
    predicted_change_percent: "+4.2%", confidence_score: "85%",
    amharic_insight: "ከውጭ የሚገቡ የዘይት ምርቶች በመጨመራቸው ዋጋው በትንሹ ይቀንሳል ተብሎ ይጠበቃል።",
    english_summary: "Import surplus reducing price.", fetched: true,
  },
  {
    id: 4, name: "Wheat Flour / Fino (5 Kg)",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Flour_1.jpg/960px-Flour_1.jpg",
    current_price: "680 ETB", market_trend: "UP",
    predicted_change_percent: "+3.5%", confidence_score: "82%",
    amharic_insight: "የፍርኖ ዱቄት ፍላጎት ከበዓል ጋር ተያይዞ በመጨመሩ መጠነኛ የዋጋ ጭማሪ ታይቷል።",
    english_summary: "Holiday baking demand.", fetched: true,
  },
  {
    id: 5, name: "Packed Sugar (1 Kg)",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Sucre_blanc_cassonade_complet_rapadura.jpg/960px-Sucre_blanc_cassonade_complet_rapadura.jpg",
    current_price: "180 ETB", market_trend: "UP",
    predicted_change_percent: "+5.0%", confidence_score: "88%",
    amharic_insight: "በስኳር አቅርቦት ላይ የታየው መዘግየት የችርቻሮ ዋጋውን ከፍ አድርጎታል።",
    english_summary: "Minor distribution delays.", fetched: true,
  },
  {
    id: 6, name: "Tomato Paste / Salsa (400g)",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Tomato_paste_on_spoon.jpg/960px-Tomato_paste_on_spoon.jpg",
    current_price: "210 ETB", market_trend: "STABLE",
    predicted_change_percent: "0.0%", confidence_score: "90%",
    amharic_insight: "የሳልሳ (የቲማቲም ድልህ) ገበያ የተረጋጋ እና በቂ ምርት ያለበት ነው።",
    english_summary: "Prices remain stable.", fetched: true,
  },
  {
    id: 7, name: "Canned Tuna (185g)",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Canned_and_packaged_tuna_on_supermarket_shelves.jpg/960px-Canned_and_packaged_tuna_on_supermarket_shelves.jpg",
    current_price: "220 ETB", market_trend: "UP",
    predicted_change_percent: "+6.8%", confidence_score: "87%",
    amharic_insight: "የታሸገ ቱና ከውጭ የሚገባ በመሆኑ የምንዛሬ ለውጥ በዋጋው ላይ ጭማሪ አምጥቷል።",
    english_summary: "Currency impact on imports.", fetched: true,
  },
  {
    id: 8, name: "Roasted Packed Coffee (500g)",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Roasted_coffee_beans.jpg/960px-Roasted_coffee_beans.jpg",
    current_price: "850 ETB", market_trend: "STABLE",
    predicted_change_percent: "+1.2%", confidence_score: "91%",
    amharic_insight: "የታሸገ ቡና ዋጋ ምንም አይነት ጉልህ ለውጥ አላሳየም።",
    english_summary: "Consistent local supply.", fetched: true,
  },
  {
    id: 9, name: "Powdered Milk (400g)",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Milk_powder_cropped.jpg/960px-Milk_powder_cropped.jpg",
    current_price: "1,150 ETB", market_trend: "UP",
    predicted_change_percent: "+5.5%", confidence_score: "84%",
    amharic_insight: "የዱቄት ወተት አቅርቦት እጥረት በመኖሩ ምክንያት ዋጋው ጨምሯል።",
    english_summary: "Supply shortage pushing prices.", fetched: true,
  },
  {
    id: 10, name: "Tea Leaves / Shai (500g)",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Longjing_tea_steeping_in_gaiwan.jpg/960px-Longjing_tea_steeping_in_gaiwan.jpg",
    current_price: "420 ETB", market_trend: "STABLE",
    predicted_change_percent: "0.0%", confidence_score: "94%",
    amharic_insight: "የሻይ ቅጠል ምርት በስፋት በመሰራጨቱ ገበያው የተረጋጋ ነው።",
    english_summary: "Steady distribution.", fetched: true,
  },
  {
    id: 11, name: "Toilet Paper (Pack of 10)",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Toiletpapier_%28Gobran111%29.jpg/960px-Toiletpapier_%28Gobran111%29.jpg",
    current_price: "480 ETB", market_trend: "DOWN",
    predicted_change_percent: "-2.0%", confidence_score: "89%",
    amharic_insight: "የሀገር ውስጥ አምራቾች ምርትን በመጨመራቸው የሶፍት ዋጋ በትንሹ ቀንሷል።",
    english_summary: "Local production scaling up.", fetched: true,
  },
  {
    id: 12, name: "Bath Soap (Pack of 4)",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Handmade_soap_cropped_and_simplified.jpg/960px-Handmade_soap_cropped_and_simplified.jpg",
    current_price: "280 ETB", market_trend: "STABLE",
    predicted_change_percent: "0.0%", confidence_score: "92%",
    amharic_insight: "የገላ ሳሙና ዋጋ ላይ ምንም አይነት አዲስ ለውጥ የለም።",
    english_summary: "Market is holding steady.", fetched: true,
  },
  {
    id: 13, name: "Laundry Detergent (1 Kg)",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Pralni_pra%C5%A1ek.JPG/960px-Pralni_pra%C5%A1ek.JPG",
    current_price: "380 ETB", market_trend: "UP",
    predicted_change_percent: "+2.5%", confidence_score: "86%",
    amharic_insight: "የልብስ ሳሙና ጥሬ እቃዎች መወደድ ዋጋው ላይ መጠነኛ ጭማሪ አስከትሏል።",
    english_summary: "Raw material cost increase.", fetched: true,
  },
  {
    id: 14, name: "Assorted Biscuits (Box)",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Bourbon_and_Custard_Cream.jpeg/960px-Bourbon_and_Custard_Cream.jpeg",
    current_price: "240 ETB", market_trend: "STABLE",
    predicted_change_percent: "0.0%", confidence_score: "95%",
    amharic_insight: "የብስኩት ምርቶች በበቂ ሁኔታ ሱፐርማርኬቶች ውስጥ ይገኛሉ።",
    english_summary: "Ample shelf stock.", fetched: true,
  },
  {
    id: 15, name: "Baby Diapers (Jumbo Pack)",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Disposablediaper.JPG/960px-Disposablediaper.JPG",
    current_price: "2,400 ETB", market_trend: "UP",
    predicted_change_percent: "+8.5%", confidence_score: "83%",
    amharic_insight: "የህፃናት ዳይፐር ከውጭ በሚገቡ ምርቶች ላይ በተጣለ ታክስ ምክንያት ዋጋው ንሯል።",
    english_summary: "Import tax adjustments.", fetched: true,
  },
  {
    id: 16, name: "Packaged Fruit Juice (1 Liter)",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Orange_juice_1.jpg/960px-Orange_juice_1.jpg",
    current_price: "190 ETB", market_trend: "STABLE",
    predicted_change_percent: "0.0%", confidence_score: "90%",
    amharic_insight: "የታሸገ ጁስ ዋጋ የተረጋጋ ነው፣ ፍላጎቱም መደበኛ ነው።",
    english_summary: "Normal consumer demand.", fetched: true,
  },
  {
    id: 17, name: "Table Butter (250g)",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/%C5%A0v%C3%A9dsk%C3%BD_kol%C3%A1%C4%8D_naruby_904_%28cropped%29.JPG/960px-%C5%A0v%C3%A9dsk%C3%BD_kol%C3%A1%C4%8D_naruby_904_%28cropped%29.JPG",
    current_price: "550 ETB", market_trend: "UP",
    predicted_change_percent: "+3.2%", confidence_score: "88%",
    amharic_insight: "የገበታ ቅቤ አቅርቦት ማነስ በዋጋው ላይ ትንሽ ጭማሪ አሳይቷል።",
    english_summary: "Slight supply dip.", fetched: true,
  },
  {
    id: 18, name: "Breakfast Cereal (500g)",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Les_Plantes_Cultivades._Cereals._Imatge_119.jpg",
    current_price: "620 ETB", market_trend: "STABLE",
    predicted_change_percent: "0.0%", confidence_score: "86%",
    amharic_insight: "የኮርንፍሌክስ እና የቁርስ እህሎች ገበያ ምንም ለውጥ አላሳየም።",
    english_summary: "Prices remain stable.", fetched: true,
  },
  {
    id: 19, name: "Strawberry Jam (400g)",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Fruits_jam_variants.jpg/960px-Fruits_jam_variants.jpg",
    current_price: "290 ETB", market_trend: "DOWN",
    predicted_change_percent: "-3.5%", confidence_score: "79%",
    amharic_insight: "የሀገር ውስጥ አምራቾች የማርማላታ ምርትን በማብዛታቸው ዋጋው ቀንሷል።",
    english_summary: "Local production surplus.", fetched: true,
  },
  {
    id: 20, name: "Processed Cheese (400g)",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Eru_goudkuipje_sambal.jpg/960px-Eru_goudkuipje_sambal.jpg",
    current_price: "480 ETB", market_trend: "UP",
    predicted_change_percent: "+2.8%", confidence_score: "85%",
    amharic_insight: "የቺዝ/አይብ ዋጋ በወተት አቅርቦት ለውጥ ምክንያት በትንሹ ጨምሯል።",
    english_summary: "Dairy cost fluctuations.", fetched: true,
  },
];

const DEFAULT_PROFILE = { name: 'Administrator', photo: '' };
const INTERVAL_MS = 10000;

/* ── HELPERS ── */
function formatTime(d) {
  return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
function formatDate(d) {
  return d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
}

const TREND_COLOR  = { UP: '#10b981', DOWN: '#f43f5e', STABLE: '#64748b' };
const TREND_ICON   = { UP: '📈', DOWN: '📉', STABLE: '➖' };
const TREND_LABEL  = { UP: '▲ RISING', DOWN: '▼ FALLING', STABLE: '— STABLE' };

/* ═══════════════════════════════════════════════════════════════ */
export default function App() {
  /* ── Persistent state (localStorage) ── */
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mp_items')) || DEFAULT_ITEMS; }
    catch { return DEFAULT_ITEMS; }
  });

  const [adminProfile, setAdminProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mp_profile')) || DEFAULT_PROFILE; }
    catch { return DEFAULT_PROFILE; }
  });

  /* ── Theme state (dark / light) ── */
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('mp_theme');
      return saved ? saved === 'dark' : false; // default light
    } catch { return false; }
  });

  useEffect(() => {
    document.body.classList.toggle('light-theme', !darkMode);
    localStorage.setItem('mp_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  /* ── View state ── */
  const [view, setView]           = useState('dashboard'); // 'dashboard' | 'admin'
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword]   = useState('');
  const [loginErr, setLoginErr]   = useState('');
  const ADMIN_PASS                = 'admin123';

  /* ── Carousel state ── */
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible]           = useState(false);
  const [imageLoaded, setImageLoaded]   = useState(false);
  const [progress, setProgress]         = useState(0);
  const [clock, setClock]               = useState(new Date());

  const progressRef  = useRef(null);
  const startTimeRef = useRef(0);

  /* ── Clock tick ── */
  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  /* ── goTo ── */
  const goTo = useCallback((idx) => {
    setVisible(false);
    setImageLoaded(false);
    setTimeout(() => {
      setCurrentIndex(idx);
      setProgress(0);
      startTimeRef.current = Date.now();
    }, 420);
  }, []);

  const goNext = useCallback(() => goTo((currentIndex + 1) % items.length), [currentIndex, goTo, items.length]);
  const goPrev = useCallback(() => goTo((currentIndex - 1 + items.length) % items.length), [currentIndex, goTo, items.length]);

  /* ── Auto-advance ── */
  useEffect(() => {
    if (view !== 'dashboard' || items.length === 0) return;
    const t = setInterval(goNext, INTERVAL_MS);
    return () => clearInterval(t);
  }, [goNext, view, items.length]);

  /* ── Progress bar RAF ── */
  useEffect(() => {
    if (view !== 'dashboard') return;
    startTimeRef.current = Date.now();
    const tick = () => {
      const pct = Math.min(((Date.now() - startTimeRef.current) / INTERVAL_MS) * 100, 100);
      setProgress(pct);
      if (pct < 100) progressRef.current = requestAnimationFrame(tick);
    };
    progressRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(progressRef.current);
  }, [currentIndex, view]);

  /* ── Admin save ── */
  function handleAdminSave({ profile, items: newItems }) {
    const mapped = newItems.map(i => ({ ...i, name: i.name }));
    setItems(mapped);
    setAdminProfile(profile);
    localStorage.setItem('mp_items', JSON.stringify(mapped));
    localStorage.setItem('mp_profile', JSON.stringify(profile));
    setCurrentIndex(0);
    setImageLoaded(false);
    setVisible(false);
  }

  function handleProfileSave(p) {
    setAdminProfile(p);
    localStorage.setItem('mp_profile', JSON.stringify(p));
  }

  /* ── Login ── */
  function tryLogin() {
    if (password === ADMIN_PASS) {
      setShowLogin(false);
      setPassword('');
      setLoginErr('');
      setView('admin');
    } else {
      setLoginErr('Incorrect password. Try: admin123');
    }
  }

  /* ── Render: Admin view ── */
  if (view === 'admin') {
    return (
      <>
        <div className="grid-overlay" />
        <AdminPanel
          items={items}
          adminProfile={adminProfile}
          onSave={handleAdminSave}
          onProfileSave={handleProfileSave}
          onBack={() => { setView('dashboard'); setCurrentIndex(0); setImageLoaded(false); }}
          darkMode={darkMode}
          onToggleTheme={() => setDarkMode(d => !d)}
        />
      </>
    );
  }

  /* ── Render: Dashboard ── */
  const displayItems = items.filter(i => i.fetched !== false || i.current_price);
  if (displayItems.length === 0) {
    return (
      <>
        <div className="grid-overlay" />
        <div style={{ textAlign: 'center', color: '#4d5680', padding: '4rem' }}>
          No items configured. <button onClick={() => setView('admin')} style={{ color: '#818cf8', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Open Admin Panel</button>
        </div>
      </>
    );
  }

  const safeIndex = Math.min(currentIndex, displayItems.length - 1);
  const data  = displayItems[safeIndex];
  const color = TREND_COLOR[data.market_trend] || '#64748b';
  const trendClass = `trend-${(data.market_trend || 'STABLE').toLowerCase()}`;

  return (
    <>
      <div className="grid-overlay" />

      {/* ── Login Modal ── */}
      {showLogin && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(4,5,15,0.85)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: 'rgba(12,18,38,0.95)', border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: 24, padding: '2rem', width: 340,
            boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
          }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔐</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#eef1ff' }}>Admin Access</div>
              <div style={{ fontSize: '0.78rem', color: '#4d5680', marginTop: 4 }}>Enter password to continue</div>
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => { setPassword(e.target.value); setLoginErr(''); }}
              onKeyDown={e => e.key === 'Enter' && tryLogin()}
              autoFocus
              style={{
                width: '100%', padding: '0.75rem 1rem',
                background: 'rgba(8,12,26,0.9)', border: `1px solid ${loginErr ? '#f43f5e' : 'rgba(99,102,241,0.25)'}`,
                borderRadius: 12, color: '#eef1ff', fontSize: '0.9rem',
                fontFamily: 'inherit', outline: 'none', marginBottom: '0.75rem',
              }}
            />
            {loginErr && <div style={{ color: '#f43f5e', fontSize: '0.78rem', marginBottom: '0.75rem' }}>{loginErr}</div>}
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button onClick={tryLogin} style={{
                flex: 1, padding: '0.7rem',
                background: 'linear-gradient(135deg,#6366f1,#a855f7)',
                border: 'none', borderRadius: 12, color: '#fff',
                fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit',
              }}>Login</button>
              <button onClick={() => { setShowLogin(false); setPassword(''); setLoginErr(''); }} style={{
                padding: '0.7rem 1rem',
                background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: 12, color: '#818cf8', cursor: 'pointer', fontFamily: 'inherit',
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOP NAV BAR ── */}
      <nav className="topbar glass">
        <div className="topbar-brand">
          <div className="brand-icon">🛒</div>
          <div>
            <div className="brand-name">Nati Supermarket</div>
            <div className="brand-sub">Price Intelligence & Analytics • Ethiopia</div>
          </div>
        </div>

        <div className="topbar-right">
          <div className="live-badge"><span className="live-dot" />Live</div>

          <div className="clock-widget">
            <div className="clock-time">{formatTime(clock)}</div>
            <div className="clock-date">{formatDate(clock)}</div>
          </div>

          {/* Admin profile + button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {/* Avatar */}
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: adminProfile.photo ? 'none' : 'linear-gradient(135deg,#6366f1,#a855f7)',
              border: '2px solid rgba(99,102,241,0.5)',
              overflow: 'hidden', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '1rem', flexShrink: 0,
            }}>
              {adminProfile.photo
                ? <img src={adminProfile.photo} alt="admin" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : '👤'}
            </div>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#eef1ff' }}>{adminProfile.name || 'Admin'}</div>
              <div style={{ fontSize: '0.65rem', color: '#4d5680' }}>Administrator</div>
            </div>
            <button
              onClick={() => setDarkMode(d => !d)}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              style={{
                padding: '0.45rem 0.7rem',
                background: 'rgba(99,102,241,0.12)',
                border: '1px solid rgba(99,102,241,0.3)',
                borderRadius: 10, color: '#818cf8',
                fontSize: '0.9rem', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.2s',
                marginRight: '0.4rem',
              }}
            >{darkMode ? '☀️' : '🌙'}</button>
            <button
              onClick={() => { localStorage.removeItem('mp_theme'); setDarkMode(false); }}
              title='Reset to Light Mode'
              style={{
                padding: '0.45rem 0.7rem',
                background: 'rgba(99,102,241,0.05)',
                border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: 10, color: '#818cf8',
                fontSize: '0.75rem', fontWeight: 500,
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.2s',
              }}
            >Reset Light</button>
            <button
              onClick={() => setShowLogin(true)}
              style={{
                padding: '0.45rem 0.9rem',
                background: 'rgba(99,102,241,0.12)',
                border: '1px solid rgba(99,102,241,0.3)',
                borderRadius: 10, color: '#818cf8',
                fontSize: '0.75rem', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.2s',
              }}
            >⚙️ Admin</button>
          </div>
        </div>
      </nav>

      {/* ── MAIN CARD ── */}
      <div
        className={`glass main-card ${trendClass}`}
        style={{
          opacity: visible && imageLoaded ? 1 : 0,
          transform: visible && imageLoaded ? 'translateY(0)' : 'translateY(14px)',
          transition: 'opacity 0.45s ease, transform 0.45s ease',
        }}
      >
        <div className="trend-strip" />

        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="product-header">
          <div className="product-title-block">
            <h1>{data.name}</h1>
            <p className="product-subtitle">
              Supermarket Price Intelligence &nbsp;•&nbsp; Item {safeIndex + 1} of {displayItems.length}
            </p>
          </div>
          <div className="trend-pill">
            <span>{TREND_ICON[data.market_trend]}</span>
            <span>{TREND_LABEL[data.market_trend]}</span>
          </div>
        </div>

        <div className="content-grid">
          {/* Image */}
          <div className="image-panel">
            <img
              key={data.image || data.image_url}
              src={data.image || data.image_url}
              alt={data.name}
              onLoad={() => { setImageLoaded(true); setVisible(true); }}
              onError={() => { setImageLoaded(true); setVisible(true); }}
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.5s' }}
            />
            {!imageLoaded && (
              <div className="image-loading">
                <div className="spinner" />
                <span>Loading…</span>
              </div>
            )}
            {imageLoaded && (
              <div className="price-badge">
                <div className="price-label">Current Price</div>
                <div className="price-value" style={{ color }}>{data.current_price}</div>
              </div>
            )}
          </div>

          {/* Data */}
          <div className="data-panel">
            <div className="metrics-row">
              <div className="metric-card">
                <div className="metric-label">Predicted Change</div>
                <div className="metric-value" style={{ color }}>{data.predicted_change_percent}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Market Trend</div>
                <div className="metric-value" style={{ color }}>{data.market_trend}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">AI Confidence</div>
                <div className="metric-value" style={{ color: '#818cf8' }}>{data.confidence_score}</div>
              </div>
            </div>

            <div className="insight-block">
              <div className="insight-heading">
                <div className="insight-icon-wrap">{TREND_ICON[data.market_trend]}</div>
                <span className="insight-label">AI Engine Insight</span>
              </div>
              <p className="amharic-text">{data.amharic_insight}</p>
            </div>

            <div className="insight-block" style={{ padding: '0.9rem 1.25rem', flexShrink: 0 }}>
              <div className="insight-heading" style={{ marginBottom: 0 }}>
                <div className="insight-icon-wrap" style={{ fontSize: '0.85rem' }}>📊</div>
                <span className="insight-label">Summary</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--text-2)', fontWeight: 400 }}>
                  {data.english_summary}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="carousel-footer">
          <span className="carousel-count">
            {String(safeIndex + 1).padStart(2, '0')} / {String(displayItems.length).padStart(2, '0')}
          </span>
          <div className="indicators">
            {displayItems.map((_, idx) => (
              <button
                key={idx}
                className={`indicator ${idx === safeIndex ? 'active' : ''}`}
                onClick={() => goTo(idx)}
                title={displayItems[idx].name}
              />
            ))}
          </div>
          <div className="carousel-nav">
            <button className="nav-btn" onClick={goPrev}>‹</button>
            <button className="nav-btn" onClick={goNext}>›</button>
          </div>
        </div>
      </div>

      {/* ── STATUS BAR ── */}
      <footer className="status-bar">
        <div className="status-left">
          <div className="status-item"><span className="status-dot-green" /><span>AI Engine Online</span></div>
          <div className="status-divider" />
          <div className="status-item"><span>🇪🇹 ETB Market</span></div>
          <div className="status-divider" />
          <div className="status-item"><span>📦 {displayItems.length} Items Tracked</span></div>
        </div>
        <div className="status-right">
          <span>Auto-refresh every 10s</span>
          <div className="status-divider" />
          <span>Nati MarketPulse v2.0</span>
        </div>
      </footer>
    </>
  );
}
