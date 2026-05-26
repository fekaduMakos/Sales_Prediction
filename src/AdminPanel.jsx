import { useState, useRef } from 'react';
import marketPrices from '../market_prices.json';

/* ── Price generation ── */
const BASE_PRICES = {
  pasta:140, water:55, oil:1350, flour:680, sugar:180,
  tomato:210, tuna:220, coffee:850, milk:1150, tea:420,
  toilet:480, soap:280, detergent:380, biscuit:240,
  diaper:2400, juice:190, butter:550, cereal:620, jam:290, cheese:480,
};
function getMarketPrice(name) {
  const lower = name.toLowerCase();
  // Exact match
  if (marketPrices[name]) return marketPrices[name];
  // Keyword fallback (simple contains)
  const keywords = Object.keys(marketPrices);
  for (const key of keywords) {
    if (lower.includes(key.toLowerCase())) return marketPrices[key];
  }
  return null;
}
function generatePrice(name) {
  const lower = name.toLowerCase();
  let base = 300;
  if (lower.includes('pasta')||lower.includes('macaroni')) base=BASE_PRICES.pasta;
  else if (lower.includes('water'))  base=BASE_PRICES.water;
  else if (lower.includes('oil'))    base=BASE_PRICES.oil;
  else if (lower.includes('flour')||lower.includes('fino')) base=BASE_PRICES.flour;
  else if (lower.includes('sugar'))  base=BASE_PRICES.sugar;
  else if (lower.includes('tomato')) base=BASE_PRICES.tomato;
  else if (lower.includes('tuna'))   base=BASE_PRICES.tuna;
  else if (lower.includes('coffee')||lower.includes('buna')) base=BASE_PRICES.coffee;
  else if (lower.includes('milk')||lower.includes('wetet'))  base=BASE_PRICES.milk;
  else if (lower.includes('tea')||lower.includes('shai'))    base=BASE_PRICES.tea;
  else if (lower.includes('soap')||lower.includes('samuna')) base=BASE_PRICES.soap;
  else if (lower.includes('detergent')) base=BASE_PRICES.detergent;
  else if (lower.includes('biscuit'))   base=BASE_PRICES.biscuit;
  else if (lower.includes('juice'))     base=BASE_PRICES.juice;
  else if (lower.includes('butter')||lower.includes('qibe')) base=BASE_PRICES.butter;
  else if (lower.includes('cheese'))    base=BASE_PRICES.cheese;

  const price = Math.round(base * (1 + (Math.random()*0.3-0.15)));
  const trends = ['UP','DOWN','STABLE'];
  const trend  = trends[Math.floor(Math.random()*trends.length)];
  const pct    = trend==='STABLE'?'0.0':(Math.random()*5+0.5).toFixed(1);
  const sign   = {UP:'+',DOWN:'-',STABLE:''}[trend];
  return {
    price, trend,
    changePct:`${sign}${pct}%`,
    confidence:`${Math.floor(Math.random()*18+78)}%`,
  };
}
const INSIGHTS = {
  UP:['ዋጋው ቀጣይ ሳምንት ሊጨምር ይጠበቃል፣ ቀደምት ግዢ ይመከራል።','አቅርቦት ማነስ ዋጋውን ከፍ እያደረገ ነው።','ፍላጎቱ ጨምሯል፣ ዋጋው ሊያሻቅብ ይችላል።'],
  DOWN:['ዋጋው ሊቀንስ ይጠበቃል፣ ትንሽ ጠብቆ መግዛት ይሻላል።','ምርቱ ብዛት ስላለ ዋጋው ወደ ታች ይሄዳል።','አቅርቦት መጨመር ዋጋ ቅናሽ ያስከትላል።'],
  STABLE:['ዋጋው የተረጋጋ ነው፣ ምንም ጉልህ ለውጥ አይጠበቅም።','ገበያው ሚዛናዊ ሁኔታ ላይ ነው።','አቅርቦትና ፍላጎት ሚዛናዊ ሆኖ ዋጋው ተረጋጋ።'],
};
function randomInsight(t){ const a=INSIGHTS[t]; return a[Math.floor(Math.random()*a.length)]; }

/* ── Read file as dataURL ── */
function readFile(file) {
  return new Promise(res => {
    const r = new FileReader();
    r.onload = e => res(e.target.result);
    r.readAsDataURL(file);
  });
}

/* ═══════════════════════════════════════════════════════════ */
export default function AdminPanel({ items, onSave, onBack, adminProfile, onProfileSave, darkMode, onToggleTheme }) {
  const [profile,         setProfile]         = useState(adminProfile);
  const [editingProfile,  setEditingProfile]  = useState(false);
  const [tempProfile,     setTempProfile]     = useState(adminProfile);
  const [newName,         setNewName]         = useState('');
  const [newPrice,        setNewPrice]        = useState('');
  const [newImageSrc,     setNewImageSrc]     = useState('');   // dataURL or URL string
  const [newImageMode,    setNewImageMode]    = useState('url'); // 'url' | 'file'
  const [error,           setError]           = useState('');

  // Edit item states
  const [editingItemId,   setEditingItemId]   = useState(null);
  const [editName,        setEditName]        = useState('');
  const [editImage,       setEditImage]       = useState('');
  const [editImageMode,   setEditImageMode]   = useState('url');
  const [editPrice,       setEditPrice]       = useState('');

  // refs for file inputs
  const profileFileRef = useRef(null);
  const newItemFileRef = useRef(null);
  const editFileRef    = useRef(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  /* ─ Profile photo ─ */
  async function handleProfilePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    const src = await readFile(file);
    setTempProfile(p => ({ ...p, photo: src }));
  }
  function saveProfile() {
    setProfile(tempProfile);
    onProfileSave(tempProfile);
    onSave({ profile: tempProfile, items });
    setEditingProfile(false);
  }

  /* ─ New item image ─ */
  async function handleNewItemFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const src = await readFile(file);
    setNewImageSrc(src);
  }

  /* ─ Add item with instant AI Prediction ─ */
  function addItem() {
    if (!newName.trim()) { setError('Product name is required.'); return; }
    if (!newImageSrc.trim()) { setError('Please add an image (URL or upload).'); return; }
    setError('');

    let price;
    let trend = 'STABLE';
    let changePct = '0.0%';
    let confidence = '100%';

    const enteredPrice = newPrice.trim();
    if (enteredPrice) {
      const numericPrice = parseFloat(enteredPrice.replace(/[^\d.]/g, ''));
      price = isNaN(numericPrice) ? 300 : numericPrice;
      const priceInfo = generatePrice(newName.trim());
      trend = priceInfo.trend;
      changePct = priceInfo.changePct;
      confidence = priceInfo.confidence;
    } else {
      const marketPrice = getMarketPrice(newName.trim());
      const priceInfo = marketPrice !== null ? {
        price: marketPrice,
        trend: 'STABLE',
        changePct: '0.0%',
        confidence: '100%'
      } : generatePrice(newName.trim());
      price = priceInfo.price;
      trend = priceInfo.trend;
      changePct = priceInfo.changePct;
      confidence = priceInfo.confidence;
    }

    const newItem = {
      id: Date.now(),
      name: newName.trim(),
      image: newImageSrc,
      current_price: `${price.toLocaleString()} ETB`,
      market_trend: trend,
      predicted_change_percent: changePct,
      confidence_score: confidence,
      amharic_insight: randomInsight(trend),
      english_summary: trend==='UP'?'Price rising.':trend==='DOWN'?'Price falling.':'Price stable.',
      fetched: true,
    };

    const updated = [...items, newItem];
    onSave({ profile, items: updated });

    setNewName('');
    setNewPrice('');
    setNewImageSrc('');
    if (newItemFileRef.current) newItemFileRef.current.value = '';
  }

  /* ─ Remove item completely in real time ─ */
  function removeItem(id) {
    const updated = items.filter(i => i.id !== id);
    onSave({ profile, items: updated });
  }

  /* ─ Start editing an item ─ */
  function startItemEdit(item) {
    setEditingItemId(item.id);
    setEditName(item.name);
    setEditImage(item.image);
    setEditPrice(item.current_price ? item.current_price.replace(/[^\d.]/g, '') : '');
    setEditImageMode('url');
  }

  /* ─ Cancel editing an item ─ */
  function cancelItemEdit() {
    setEditingItemId(null);
    setEditName('');
    setEditImage('');
    setEditPrice('');
  }

  /* ─ Handle edit image file upload ─ */
  async function handleEditFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const src = await readFile(file);
    setEditImage(src);
  }

  /* ─ Save edited item name/image and update parent ─ */
  function saveItemEdit(id) {
    if (!editName.trim()) return;

    const original = items.find(i => i.id === id);
    let updatedPriceInfo = {};

    const enteredEditPrice = editPrice.trim();

    if (enteredEditPrice) {
      const numericPrice = parseFloat(enteredEditPrice.replace(/[^\d.]/g, ''));
      const finalPrice = isNaN(numericPrice) ? 300 : numericPrice;
      updatedPriceInfo.current_price = `${finalPrice.toLocaleString()} ETB`;
    }

    // If product name changes and price wasn't manually edited, re-run AI price prediction to match new name
    if (original.name.trim().toLowerCase() !== editName.trim().toLowerCase() && !enteredEditPrice) {
      const marketPrice = getMarketPrice(editName.trim());
      if (marketPrice !== null) {
        updatedPriceInfo = {
          current_price: `${marketPrice.toLocaleString()} ETB`,
          market_trend: 'STABLE',
          predicted_change_percent: '0.0%',
          confidence_score: '100%',
          amharic_insight: 'ዋጋ ተወዳጅ ነው።',
          english_summary: 'Price stable.',
        };
      } else {
        const { price, trend, changePct, confidence } = generatePrice(editName.trim());
        updatedPriceInfo = {
          current_price: `${price.toLocaleString()} ETB`,
          market_trend: trend,
          predicted_change_percent: changePct,
          confidence_score: confidence,
          amharic_insight: randomInsight(trend),
          english_summary: trend==='UP'?'Price rising.':trend==='DOWN'?'Price falling.':'Price stable.',
        };
      }
    }

    const updated = items.map(i => {
      if (i.id === id) {
        return {
          ...i,
          name: editName.trim(),
          image: editImage,
          ...updatedPriceInfo,
        };
      }
      return i;
    });

    onSave({ profile, items: updated });
    setEditingItemId(null);
    setEditName('');
    setEditImage('');
    setEditPrice('');
  }

  const TREND_CLR = { UP:'#10b981', DOWN:'#f43f5e', STABLE:'#64748b' };

  return (
    <div style={{ width:'100%', maxWidth:960, margin:'0 auto' }}>

      {/* ── Header ── */}
      <div style={headerBar}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.9rem' }}>
          <div style={brandIcon}>⚙️</div>
          <div>
            <div style={{ fontWeight:700, fontSize:'1.05rem', color:'#eef1ff' }}>Nati Supermarket Admin</div>
            <div style={subLabel}>System Management Portal</div>
          </div>
        </div>
        <button onClick={onBack} style={btnBack}>← Back to Dashboard</button>
        {onToggleTheme && (
          <button onClick={onToggleTheme} title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'} style={{
            padding: '0.45rem 0.7rem',
            background: 'rgba(99,102,241,0.12)',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: 10, color: '#818cf8',
            fontSize: '0.9rem', fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
            transition: 'all 0.2s',
          }}>{darkMode ? '☀️' : '🌙'}</button>
        )}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem' }}>

        {/* ── Profile ── */}
        <div style={card}>
          <SectionTitle icon="👤" label="Admin Profile" />
          {!editingProfile ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'1rem' }}>
              <Avatar src={profile.photo} size={88} />
              <div style={{ textAlign:'center' }}>
                <div style={{ fontWeight:700, fontSize:'1.1rem', color:'#eef1ff' }}>{profile.name||'Administrator'}</div>
                <div style={{ fontSize:'0.72rem', color:'#4d5680', marginTop:3 }}>System Administrator</div>
              </div>
              <button onClick={() => { setTempProfile(profile); setEditingProfile(true); }} style={btnSecondary}>✏️ Edit Profile</button>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'0.8rem' }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.6rem' }}>
                <Avatar src={tempProfile.photo} size={80} />
                <input type="file" accept="image/*" ref={profileFileRef} style={{ display:'none' }} onChange={handleProfilePhoto} />
                <button onClick={() => profileFileRef.current.click()} style={btnSecondary}>📷 Upload Photo</button>
              </div>
              <input style={inp} placeholder="Your Name" value={tempProfile.name} onChange={e => setTempProfile(p=>({...p, name:e.target.value}))} />
              <div style={{ display:'flex', gap:'0.6rem' }}>
                <button onClick={saveProfile} style={btnPrimary}>Save</button>
                <button onClick={() => setEditingProfile(false)} style={btnSecondary}>Cancel</button>
              </div>
            </div>
          )}
        </div>

        {/* ── Add Item ── */}
        <div style={card}>
          <SectionTitle icon="➕" label="Add New Item" />
          <div style={{ display:'flex', flexDirection:'column', gap:'0.8rem' }}>
            <input style={inp} placeholder="Product Name (e.g. Rice 1kg)" value={newName}
              onChange={e => { setNewName(e.target.value); setError(''); }} />

            <input style={inp} placeholder="Current Price in ETB (optional, e.g. 150)" value={newPrice}
              onChange={e => setNewPrice(e.target.value)} />

            {/* Image mode toggle */}
            <div style={{ display:'flex', gap:'0.5rem' }}>
              {['url','file'].map(m => (
                <button key={m} onClick={() => { setNewImageMode(m); setNewImageSrc(''); }}
                  style={{ ...btnToggle, background: newImageMode===m ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.08)', borderColor: newImageMode===m ? 'rgba(99,102,241,0.6)' : 'rgba(99,102,241,0.15)', color: newImageMode===m ? '#818cf8' : '#4d5680' }}>
                  {m==='url' ? '🔗 Image URL' : '📁 Upload File'}
                </button>
              ))}
            </div>

            {newImageMode === 'url' ? (
              <input style={inp} placeholder="https://..." value={newImageSrc}
                onChange={e => { setNewImageSrc(e.target.value); setError(''); }} />
            ) : (
              <div>
                <input type="file" accept="image/*" ref={newItemFileRef} style={{ display:'none' }} onChange={handleNewItemFile} />
                <button onClick={() => newItemFileRef.current.click()} style={{ ...btnSecondary, width:'100%' }}>
                  📂 Choose Image File
                </button>
                {newImageSrc && (
                  <div style={{ marginTop:'0.5rem', borderRadius:10, overflow:'hidden', height:80 }}>
                    <img src={newImageSrc} alt="preview" style={{ width:'100%', height:'100%', objectFit:'contain' }} />
                  </div>
                )}
              </div>
            )}

            {error && <div style={{ fontSize:'0.78rem', color:'#f43f5e' }}>⚠️ {error}</div>}
            <button onClick={addItem} style={btnPrimary}>＋ Add Item</button>
          </div>
        </div>
      </div>

      {/* ── Items List ── */}
      <div style={{ ...card, marginTop:'1.25rem' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem', flexWrap:'wrap', gap:'0.75rem' }}>
          <SectionTitle icon="📦" label={`Items (${items.length})`} />
        </div>

        {/* Search Field */}
        <div style={{ marginBottom:'1rem', position:'relative' }}>
          <input
            style={{ ...inp, paddingLeft:'2.5rem' }}
            placeholder="🔍 Search items by name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
                background:'rgba(244,63,94,0.15)', border:'1px solid rgba(244,63,94,0.3)',
                borderRadius:8, color:'#f43f5e', fontSize:'0.7rem', fontWeight:700,
                cursor:'pointer', fontFamily:'inherit', padding:'0.25rem 0.5rem',
              }}
            >✕ Clear</button>
          )}
        </div>

        {(() => {
          const filtered = items.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
          if (filtered.length === 0) return (
            <div style={{ textAlign:'center', color:'#4d5680', padding:'2.5rem', fontSize:'0.9rem' }}>
              {searchQuery ? `No items matching "${searchQuery}"` : 'No items yet. Add your first item above ↑'}
            </div>
          );
          return (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(190px, 1fr))', gap:'1rem' }}>
            {filtered.map(item => {
              const isEditing = editingItemId === item.id;
              return (
                <div key={item.id} style={{ background:'rgba(8,12,26,0.75)', border:'1px solid rgba(99,102,241,0.15)', borderRadius:18, overflow:'hidden', position:'relative' }}>

                  {/* Image area */}
                  <div style={{ height:130, background:'rgba(99,102,241,0.05)', position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {isEditing ? (
                      editImage ? (
                        <img src={editImage} alt="edit preview" style={{ width:'100%', height:'100%', objectFit:'contain' }} />
                      ) : (
                        <div style={{ color:'#4d5680', fontSize:'0.8rem' }}>No image</div>
                      )
                    ) : (
                      item.image ? (
                        <img src={item.image} alt={item.name}
                          style={{ width:'100%', height:'100%', objectFit:'contain', display:'block' }}
                          onError={e => e.target.style.display='none'} />
                      ) : (
                        <div style={{ color:'#4d5680', fontSize:'0.8rem', textAlign:'center', padding:'0 1rem' }}>
                          🖼️<br/>No image
                        </div>
                      )
                    )}
                  </div>

                  {/* Info / Editing Form */}
                  {isEditing ? (
                    <div style={{ padding:'0.7rem 0.9rem', display:'flex', flexDirection:'column', gap:'0.45rem' }}>
                      <input
                        style={inpSmall}
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        placeholder="Product Name"
                      />
                      <input
                        style={inpSmall}
                        value={editPrice}
                        onChange={e => setEditPrice(e.target.value)}
                        placeholder="Price in ETB"
                      />
                      <div style={{ display:'flex', gap:'0.3rem' }}>
                        {['url','file'].map(m => (
                          <button key={m} onClick={() => { setEditImageMode(m); setEditImage(''); }}
                            style={{ ...btnToggleSmall, background: editImageMode===m ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.08)', borderColor: editImageMode===m ? 'rgba(99,102,241,0.6)' : 'rgba(99,102,241,0.15)', color: editImageMode===m ? '#818cf8' : '#4d5680' }}>
                            {m==='url' ? '🔗 URL' : '📁 File'}
                          </button>
                        ))}
                      </div>

                      {editImageMode === 'url' ? (
                        <input style={inpSmall} placeholder="https://..." value={editImage} onChange={e => setEditImage(e.target.value)} />
                      ) : (
                        <div>
                          <input type="file" accept="image/*" ref={editFileRef} style={{ display:'none' }} onChange={handleEditFileChange} />
                          <button onClick={() => editFileRef.current.click()} style={{ ...btnSecondarySmall, width:'100%' }}>
                            📂 Choose Image File
                          </button>
                        </div>
                      )}

                      <div style={{ display:'flex', gap:'0.4rem', marginTop:'0.25rem' }}>
                        <button onClick={() => saveItemEdit(item.id)} style={btnPrimarySmall}>Save</button>
                        <button onClick={cancelItemEdit} style={btnSecondarySmall}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding:'0.7rem 0.9rem' }}>
                      <div style={{ fontWeight:600, fontSize:'0.85rem', color:'#eef1ff', marginBottom:4, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{item.name}</div>
                      <div style={{ fontSize:'0.78rem', color: TREND_CLR[item.market_trend] || '#64748b', marginBottom: 8 }}>
                        {item.current_price} &nbsp;
                        <span style={{ opacity:0.75 }}>{item.predicted_change_percent}</span>
                      </div>
                      <div style={{ display:'flex', gap:'0.4rem' }}>
                        <button onClick={() => startItemEdit(item)} style={{
                          flex:1, padding:'0.35rem',
                          background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.25)',
                          borderRadius:8, color:'#818cf8', fontSize:'0.72rem',
                          cursor:'pointer', fontFamily:'inherit', fontWeight:600,
                        }}>✏️ Edit Product</button>
                        <button onClick={() => removeItem(item.id)} style={{
                          flex:1, padding:'0.35rem',
                          background:'rgba(244,63,94,0.08)', border:'1px solid rgba(244,63,94,0.25)',
                          borderRadius:8, color:'#f43f5e', fontSize:'0.72rem',
                          cursor:'pointer', fontFamily:'inherit', fontWeight:600,
                        }}>✕ Remove</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          );
        })()}
      </div>

      <style>{`
        @keyframes scanAnim { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
        .img-overlay:hover { opacity:1 !important; }
      `}</style>
    </div>
  );
}

/* ── Shared helpers ── */
function Avatar({ src, size }) {
  return (
    <div style={{
      width:size, height:size, borderRadius:'50%',
      background: src ? 'none' : 'linear-gradient(135deg,#6366f1,#a855f7)',
      border:'3px solid rgba(99,102,241,0.45)', overflow:'hidden',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize: size*0.4, boxShadow:'0 0 24px rgba(99,102,241,0.3)',
    }}>
      {src ? <img src={src} alt="avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : '👤'}
    </div>
  );
}
function SectionTitle({ icon, label }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1rem' }}>
      <span>{icon}</span>
      <span style={{ fontWeight:700, fontSize:'0.95rem', color:'#eef1ff' }}>{label}</span>
    </div>
  );
}

/* ── Styles ── */
const headerBar = {
  display:'flex', alignItems:'center', justifyContent:'space-between',
  marginBottom:'1.5rem', padding:'1rem 1.5rem',
  background:'rgba(8,12,26,0.85)', backdropFilter:'blur(20px)',
  border:'1px solid rgba(99,102,241,0.12)', borderRadius:20,
};
const brandIcon = {
  width:40, height:40, borderRadius:12,
  background:'linear-gradient(135deg,#6366f1,#a855f7)',
  display:'flex', alignItems:'center', justifyContent:'center',
  fontSize:'1.2rem', boxShadow:'0 0 18px rgba(99,102,241,0.4)',
};
const subLabel = { fontSize:'0.7rem', color:'#4d5680', letterSpacing:1, textTransform:'uppercase' };
const card = {
  background:'rgba(12,18,38,0.72)', backdropFilter:'blur(20px)',
  border:'1px solid rgba(99,102,241,0.12)', borderRadius:20,
  padding:'1.5rem', boxShadow:'0 8px 32px rgba(0,0,0,0.45)',
};
const inp = {
  width:'100%', padding:'0.7rem 1rem',
  background:'rgba(8,12,26,0.85)', border:'1px solid rgba(99,102,241,0.2)',
  borderRadius:12, color:'#eef1ff', fontSize:'0.88rem',
  fontFamily:'inherit', outline:'none',
};
const btnPrimary = {
  padding:'0.65rem 1.25rem',
  background:'linear-gradient(135deg,#6366f1,#a855f7)',
  border:'none', borderRadius:12, color:'#fff',
  fontWeight:600, fontSize:'0.85rem', cursor:'pointer',
  fontFamily:'inherit', boxShadow:'0 4px 14px rgba(99,102,241,0.3)',
};
const btnSecondary = {
  padding:'0.55rem 1rem',
  background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.25)',
  borderRadius:12, color:'#818cf8', fontWeight:600,
  fontSize:'0.82rem', cursor:'pointer', fontFamily:'inherit',
};
const btnBack = {
  background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.25)',
  color:'#818cf8', borderRadius:12, padding:'0.5rem 1rem',
  cursor:'pointer', fontSize:'0.85rem', fontWeight:600, fontFamily:'inherit',
};
const btnToggle = {
  flex:1, padding:'0.5rem 0.6rem', borderRadius:10,
  border:'1px solid', cursor:'pointer', fontSize:'0.78rem',
  fontWeight:600, fontFamily:'inherit', transition:'all 0.2s',
};

const inpSmall = {
  width:'100%', padding:'0.45rem 0.75rem',
  background:'rgba(8,12,26,0.85)', border:'1px solid rgba(99,102,241,0.2)',
  borderRadius:10, color:'#eef1ff', fontSize:'0.78rem',
  fontFamily:'inherit', outline:'none',
};
const btnToggleSmall = {
  flex:1, padding:'0.35rem 0.5rem', borderRadius:8,
  border:'1px solid', cursor:'pointer', fontSize:'0.7rem',
  fontWeight:600, fontFamily:'inherit', transition:'all 0.2s',
};
const btnPrimarySmall = {
  flex:1, padding:'0.45rem',
  background:'linear-gradient(135deg,#6366f1,#a855f7)',
  border:'none', borderRadius:10, color:'#fff',
  fontWeight:600, fontSize:'0.75rem', cursor:'pointer',
  fontFamily:'inherit',
};
const btnSecondarySmall = {
  flex:1, padding:'0.45rem',
  background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.25)',
  borderRadius:10, color:'#818cf8', fontWeight:600,
  fontSize:'0.75rem', cursor:'pointer', fontFamily:'inherit',
  textAlign:'center',
};
