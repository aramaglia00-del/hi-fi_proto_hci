import { useState } from 'react'
import { useApp, useTheme, useFontZoom } from '../../context/AppContext'
import { PhoneFrame, TotemFrame } from '../../components/layout/DeviceFrames'

// ── MASCOT ─────────────────────────────────────────────────────────
function MascotLarge() {
  return (
    <svg viewBox="0 0 160 160" fill="none" style={{ width: '110px', height: '110px', filter: 'drop-shadow(0 6px 18px rgba(26,158,143,0.22))' }}>
      <ellipse cx="80" cy="148" rx="36" ry="8" fill="#D4A57A" opacity="0.18"/>
      <path d="M45 108 Q49 91 80 87 Q111 91 115 108 L115 150 Q115 153 111 153 L49 153 Q45 153 45 150 Z" fill="#1A9E8F"/>
      <path d="M68 87 L80 101 L92 87" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <rect x="72" y="79" width="16" height="13" rx="6" fill="#FBBF8C"/>
      <ellipse cx="80" cy="58" rx="29" ry="31" fill="#FBBF8C"/>
      <path d="M51 50 Q52 24 80 22 Q108 24 109 50" fill="#4A2C0A"/>
      <ellipse cx="51" cy="59" rx="7" ry="9" fill="#FBBF8C"/>
      <ellipse cx="109" cy="59" rx="7" ry="9" fill="#FBBF8C"/>
      <ellipse cx="69" cy="53" rx="8" ry="9" fill="white"/>
      <ellipse cx="91" cy="53" rx="8" ry="9" fill="white"/>
      <ellipse cx="70" cy="54" rx="5" ry="5.5" fill="#2D6A4F"/>
      <ellipse cx="92" cy="54" rx="5" ry="5.5" fill="#2D6A4F"/>
      <ellipse cx="70.5" cy="54.5" rx="3" ry="3.5" fill="#1A1A1A"/>
      <ellipse cx="92.5" cy="54.5" rx="3" ry="3.5" fill="#1A1A1A"/>
      <path d="M68 74 Q80 84 92 74" stroke="#C0604A" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M45 108 Q33 118 35 131" stroke="#1A9E8F" strokeWidth="13" strokeLinecap="round"/>
      <path d="M115 108 Q127 118 125 131" stroke="#1A9E8F" strokeWidth="13" strokeLinecap="round"/>
      <ellipse cx="35" cy="132" rx="10" ry="9" fill="#FBBF8C"/>
      <ellipse cx="125" cy="132" rx="10" ry="9" fill="#FBBF8C"/>
    </svg>
  )
}

// ── SIMULATED QR CODE ──────────────────────────────────────────────
function QRCode({ size = 180, primaryColor = '#1A9E8F' }) {
  const data = [
    [1,1,1,1,1,1,1,0,1,0,1,1,0,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,0,1,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,1,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,0,1,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0],
    [1,0,1,1,0,1,1,1,0,0,1,0,0,1,1,0,1,0,1,1,0],
    [0,1,0,0,1,0,0,0,1,0,0,1,0,0,1,1,0,0,1,0,1],
    [1,1,1,0,1,0,1,1,0,1,0,0,1,0,0,1,0,1,0,1,1],
    [0,0,1,1,0,0,0,1,0,0,0,0,0,1,1,0,1,0,0,1,0],
    [1,0,0,1,1,1,1,0,1,0,0,0,1,0,1,1,0,1,1,0,1],
    [0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,1,0,1,1,0],
    [1,1,1,1,1,1,1,0,0,0,1,0,1,0,1,0,0,1,0,0,1],
    [1,0,0,0,0,0,1,0,1,0,0,0,0,1,0,1,0,0,1,0,0],
    [1,0,1,1,1,0,1,0,0,1,1,0,1,0,0,0,1,0,0,1,0],
    [1,0,1,1,1,0,1,0,1,0,0,1,0,0,1,0,0,1,0,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,0,1,1,0,1,1,0,1,0,0],
    [1,0,0,0,0,0,1,0,1,0,1,0,0,0,1,0,0,1,0,1,0],
    [1,1,1,1,1,1,1,0,0,1,0,1,0,1,0,1,0,0,1,0,1],
  ]
  const cell = size / 21
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <rect width={size} height={size} fill="white" rx="6"/>
      {data.map((row, ri) =>
        row.map((v, ci) => {
          if (!v) return null
          if (ri >= 8 && ri <= 12 && ci >= 8 && ci <= 12) return null
          return <rect key={`${ri}-${ci}`} x={ci * cell} y={ri * cell} width={cell} height={cell} fill="#1A1A1A" />
        })
      )}
      <rect x={8.3 * cell} y={8.3 * cell} width={4.4 * cell} height={4.4 * cell} rx="4" fill={primaryColor}/>
      <path
        d={`M ${9.2 * cell} ${10.5 * cell} Q ${10.5 * cell} ${9.3 * cell} ${11.8 * cell} ${10.5 * cell}`}
        stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"
      />
      <circle cx={10.5 * cell} cy={10.5 * cell} r={1.5} fill="white" opacity="0.7"/>
    </svg>
  )
}

// ── SLIDE DOTS ─────────────────────────────────────────────────────
function SlideDots({ count, current, color = '#1A9E8F' }) {
  return (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '18px' }}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} style={{
          width: i === current ? '20px' : '9px', height: '9px',
          borderRadius: '5px',
          background: i === current ? color : 'transparent',
          border: i === current ? 'none' : '2px solid #C0C0C0',
          transition: 'all 0.3s',
        }} />
      ))}
    </div>
  )
}

// ── SLIDE 0: WELCOME ───────────────────────────────────────────────
function SlideWelcome({ onNext, onAccessibility }) {
  const theme = useTheme()
  const zoom = useFontZoom()

  return (
    <div style={{
      width: '390px', height: '740px', overflow: 'hidden',
      background: theme.isHC ? '#0A0A0A' : 'linear-gradient(160deg, #FFF0D6 0%, #FFF5E8 50%, #E8F7F5 100%)',
      position: 'relative',
    }}>
      <style>{`@keyframes floatM{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
      <div style={{
        width: `${390/zoom}px`, height: `${740/zoom}px`, zoom,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '28px 28px',
        overflowY: 'auto', overflowX: 'hidden',
      }}>
        <div style={{ animation: 'floatM 3s ease-in-out infinite', marginBottom: '22px' }}>
          <MascotLarge />
        </div>
        <h1 style={{
          fontFamily: 'Nunito, sans-serif', fontSize: '32px', fontWeight: 900,
          color: theme.text, textAlign: 'center', lineHeight: 1.15,
          letterSpacing: '-0.7px', marginBottom: '12px',
        }}>
          Ciao! Sono il tuo<br />assistente 👋
        </h1>
        <p style={{
          fontFamily: 'Nunito, sans-serif', fontSize: '17px', fontWeight: 600,
          color: theme.textSecondary, textAlign: 'center', lineHeight: 1.6,
          marginBottom: '24px', maxWidth: '290px',
        }}>
          Ti guido passo per passo.<br />Senza stress, puoi farcela!
        </p>

        <button onClick={onAccessibility} style={{
          width: '100%', padding: '14px 16px', marginBottom: '12px',
          background: theme.primaryLight,
          border: `2px solid ${theme.primary}48`,
          borderRadius: '16px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '14px',
          fontFamily: 'Nunito, sans-serif', textAlign: 'left',
        }}>
          <span style={{ fontSize: '34px', lineHeight: 1 }}>🔠</span>
          <div>
            <p style={{ margin: 0, fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: 900, color: theme.primary }}>
              Testo troppo piccolo?
            </p>
            <p style={{ margin: '2px 0 0', fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 600, color: theme.textSecondary }}>
              Imposta testo grande o alto contrasto →
            </p>
          </div>
        </button>

        <button onClick={onNext} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '100%', minHeight: '60px', borderRadius: '16px', border: 'none',
          background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)`,
          color: theme.primaryText, fontFamily: 'Nunito, sans-serif', fontSize: '19px',
          fontWeight: 900, cursor: 'pointer',
          boxShadow: `0 5px 18px ${theme.primary}5C`,
        }}>Iniziamo! →</button>
        <SlideDots count={3} current={0} color={theme.primary} />
      </div>
    </div>
  )
}

// ── SLIDE ACCESSIBILITY (inline in flow) ──────────────────────────
function SlideAccessibility({ onNext }) {
  const { state, setState } = useApp()
  const theme = useTheme()
  const zoom = useFontZoom()
  const fs = state.accessibility?.fontSize || 'normal'
  const cm = state.accessibility?.colorMode || 'normal'

  const setFs = v => setState(s => ({ ...s, accessibility: { ...s.accessibility, fontSize: v } }))
  const setCm = v => setState(s => ({ ...s, accessibility: { ...s.accessibility, colorMode: v } }))

  return (
    <div style={{
      width: '390px', height: '740px', overflow: 'hidden',
      background: theme.isHC ? '#0A0A0A' : 'linear-gradient(160deg, #FFF0D6 0%, #FFF5E8 50%, #E8F7F5 100%)',
      position: 'relative',
    }}>
      <div style={{
        width: `${390/zoom}px`, height: `${740/zoom}px`, zoom,
        display: 'flex', flexDirection: 'column', padding: '32px 24px',
        overflowY: 'auto', overflowX: 'hidden',
      }}>
        <h2 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '28px', fontWeight: 900, color: theme.text, marginBottom: '4px' }}>
          ♿ Personalizza
        </h2>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '15px', color: theme.textSecondary, marginBottom: '6px', fontWeight: 600 }}>
          Prova le impostazioni — il totem cambia in tempo reale!
        </p>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: theme.muted, marginBottom: '24px', fontWeight: 600 }}>
          Puoi modificarle sempre in seguito con ⚙️
        </p>

        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '11px', fontWeight: 800, color: theme.muted, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
          Dimensione testo
        </p>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          {[{id:'normal',l:'Normale',d:'A'},{id:'large',l:'Grande',d:'AA'},{id:'xlarge',l:'Più grande',d:'AAA'}].map(o => (
            <button key={o.id} onClick={() => setFs(o.id)} style={{
              flex: 1, padding: '14px 8px', borderRadius: '16px',
              border: fs === o.id ? `2.5px solid ${theme.primary}` : `2px solid ${theme.border}`,
              background: fs === o.id ? theme.primaryLight : theme.surface,
              cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
            }}>
              <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '24px', fontWeight: 900, color: fs === o.id ? theme.primary : theme.text }}>{o.d}</span>
              <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '11px', fontWeight: 700, color: fs === o.id ? theme.primary : theme.muted }}>{o.l}</span>
            </button>
          ))}
        </div>

        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '11px', fontWeight: 800, color: theme.muted, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
          Contrasto colori
        </p>
        <div style={{ display: 'flex', gap: '10px', marginBottom: 'auto' }}>
          {[
            { id: 'normal',       l: 'Normale',        bg: 'white',  fg: '#1A1A1A', a: '#1A9E8F' },
            { id: 'highContrast', l: 'Alto contrasto', bg: '#0A0A0A', fg: 'white',  a: '#FFD700' },
          ].map(o => (
            <button key={o.id} onClick={() => setCm(o.id)} style={{
              flex: 1, padding: '14px 8px', borderRadius: '16px',
              border: cm === o.id ? `2.5px solid ${theme.primary}` : `2px solid ${theme.border}`,
              background: o.bg, cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            }}>
              <div style={{ width: '28px', height: '16px', borderRadius: '4px', background: o.a }} />
              <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 800, color: o.fg }}>{o.l}</span>
              {cm === o.id && <span style={{ fontSize: '12px', color: o.a }}>✓</span>}
            </button>
          ))}
        </div>

        <button onClick={onNext} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '100%', minHeight: '60px', borderRadius: '16px', border: 'none',
          background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)`,
          color: theme.primaryText, fontFamily: 'Nunito, sans-serif', fontSize: '19px',
          fontWeight: 900, cursor: 'pointer', marginTop: '24px',
          boxShadow: `0 5px 18px ${theme.primary}5C`,
        }}>Continua →</button>
      </div>
    </div>
  )
}

// ── SLIDE 1: HOW IT WORKS ──────────────────────────────────────────
function SlideHow({ onNext }) {
  const theme = useTheme()
  const zoom = useFontZoom()

  const cards = [
    {
      icon: (
        <svg viewBox="0 0 56 56" fill="none" width="48" height="48">
          <rect x="10" y="3" width="36" height="50" rx="5" fill="#141B28"/>
          <rect x="15" y="10" width="26" height="36" rx="3" fill={theme.primary} opacity="0.25"/>
          <rect x="17" y="12" width="22" height="28" rx="2" fill="white" opacity="0.06"/>
          <circle cx="28" cy="48" r="2.5" fill={theme.primary} opacity="0.6"/>
        </svg>
      ),
      title: 'Totem pubblico',
      desc: 'Lo schermo grande davanti a te in ufficio o ospedale',
    },
    {
      icon: (
        <svg viewBox="0 0 56 56" fill="none" width="48" height="48">
          <rect x="5" y="5" width="20" height="20" rx="3" fill="none" stroke={theme.primary} strokeWidth="2.5"/>
          <rect x="8" y="8" width="14" height="14" rx="1.5" fill={theme.primary} opacity="0.2"/>
          <rect x="31" y="5" width="20" height="20" rx="3" fill="none" stroke={theme.primary} strokeWidth="2.5"/>
          <rect x="34" y="8" width="14" height="14" rx="1.5" fill={theme.primary} opacity="0.2"/>
          <rect x="5" y="31" width="20" height="20" rx="3" fill="none" stroke={theme.primary} strokeWidth="2.5"/>
          <rect x="8" y="34" width="14" height="14" rx="1.5" fill={theme.primary} opacity="0.2"/>
          <rect x="31" y="35" width="5" height="5" rx="1" fill={theme.primary}/>
          <rect x="39" y="35" width="5" height="5" rx="1" fill={theme.primary}/>
          <rect x="47" y="35" width="4" height="5" rx="1" fill={theme.primary}/>
          <rect x="31" y="43" width="8" height="5" rx="1" fill={theme.primary}/>
          <rect x="43" y="43" width="5" height="5" rx="1" fill={theme.primary}/>
        </svg>
      ),
      title: 'Scansiona il QR',
      desc: 'Connetti il telefono al totem con il codice QR',
    },
    {
      icon: (
        <svg viewBox="0 0 56 56" fill="none" width="48" height="48">
          <rect x="14" y="3" width="28" height="50" rx="7" fill="#DCDCDE"/>
          <rect x="17" y="9" width="22" height="36" rx="4" fill="white"/>
          <rect x="19" y="12" width="18" height="24" rx="2.5" fill="#FFF0D6"/>
          <rect x="21" y="14" width="14" height="3.5" rx="1.5" fill={theme.primary} opacity="0.5"/>
          <rect x="21" y="30" width="14" height="5" rx="2.5" fill={theme.primary}/>
          <rect x="24" y="6" width="8" height="2" rx="1" fill="#AAA"/>
        </svg>
      ),
      title: 'Guida passo passo',
      desc: 'Io ti dico esattamente cosa toccare e quando',
    },
  ]

  return (
    <div style={{
      width: '390px', height: '740px', overflow: 'hidden',
      background: theme.isHC ? '#0A0A0A' : 'linear-gradient(160deg, #FFF0D6 0%, #FFF5E8 50%, #E8F7F5 100%)',
      position: 'relative',
    }}>
      <style>{`
        @keyframes ci0{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
        @keyframes ci1{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
        @keyframes ci2{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
      `}</style>
      <div style={{
        width: `${390/zoom}px`, height: `${740/zoom}px`, zoom,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '20px 20px',
        overflowY: 'auto', overflowX: 'hidden',
      }}>
        <h2 style={{
          fontFamily: 'Nunito, sans-serif', fontSize: '28px', fontWeight: 900,
          color: theme.text, textAlign: 'center', letterSpacing: '-0.5px', marginBottom: '20px',
        }}>
          Come funziona 🤔
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '22px', width: '100%' }}>
          {cards.map((c, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              background: theme.surface, borderRadius: '18px', padding: '14px 16px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              animation: `ci${i} 0.4s ease ${i * 0.1}s both`,
            }}>
              <div style={{ width: '64px', height: '64px', background: theme.primaryLight, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {c.icon}
              </div>
              <div>
                <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '16px', fontWeight: 800, color: theme.text, marginBottom: '3px' }}>{c.title}</p>
                <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 600, color: theme.textSecondary, lineHeight: 1.45 }}>{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <button onClick={onNext} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '100%', minHeight: '60px', borderRadius: '16px', border: 'none',
          background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)`,
          color: theme.primaryText, fontFamily: 'Nunito, sans-serif', fontSize: '19px',
          fontWeight: 900, cursor: 'pointer',
          boxShadow: `0 5px 18px ${theme.primary}5C`,
        }}>Capito! →</button>
        <SlideDots count={3} current={1} color={theme.primary} />
      </div>
    </div>
  )
}

// ── SLIDE 2: SCAN QR ───────────────────────────────────────────────
function SlideScanQR({ onPaired }) {
  const theme = useTheme()
  const zoom = useFontZoom()
  const [scanning, setScanning] = useState(false)
  const [done, setDone] = useState(false)

  const handleConnect = () => {
    setScanning(true)
    setTimeout(() => {
      setDone(true)
      setTimeout(() => onPaired(), 900)
    }, 1800)
  }

  if (done) {
    return (
      <div style={{
        width: '390px', height: '740px', overflow: 'hidden',
        background: theme.isHC ? '#0A0A0A' : 'linear-gradient(160deg, #E8F7F5 0%, #F0FDFB 100%)',
        position: 'relative',
      }}>
        <div style={{
          width: `${390/zoom}px`, height: `${740/zoom}px`, zoom,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '32px',
          overflowY: 'auto', overflowX: 'hidden',
        }}>
          <div style={{ width: '88px', height: '88px', borderRadius: '50%', background: theme.primaryLight, border: `3px solid ${theme.primary}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M7 20 L16 29 L33 11" stroke={theme.primary} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '26px', fontWeight: 900, color: theme.text, textAlign: 'center', lineHeight: 1.2 }}>
            Connesso! 🎉
          </h2>
          <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '16px', color: theme.textSecondary, textAlign: 'center', marginTop: '8px' }}>
            Ottimo, siamo pronti a iniziare!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      width: '390px', height: '740px', overflow: 'hidden',
      background: theme.isHC ? '#0A0A0A' : 'linear-gradient(160deg, #FFF0D6 0%, #FFF5E8 50%, #E8F7F5 100%)',
      position: 'relative',
    }}>
      <div style={{
        width: `${390/zoom}px`, height: `${740/zoom}px`, zoom,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '24px 24px',
        overflowY: 'auto', overflowX: 'hidden',
      }}>
        <h2 style={{
          fontFamily: 'Nunito, sans-serif', fontSize: '26px', fontWeight: 900,
          color: theme.text, textAlign: 'center', lineHeight: 1.2, marginBottom: '8px',
        }}>
          Connettiti al totem
        </h2>
        <p style={{
          fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 600,
          color: theme.textSecondary, textAlign: 'center', lineHeight: 1.6, marginBottom: '20px', maxWidth: '270px',
        }}>
          Inquadra il codice QR sullo schermo grande accanto a te
        </p>

        <div style={{
          width: '220px', height: '220px', position: 'relative', marginBottom: '22px',
          background: scanning ? '#080808' : '#141414',
          borderRadius: '16px', overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.3s',
        }}>
          {[
            { top: 10, left: 10, borderTop: `3px solid ${theme.primary}`, borderLeft: `3px solid ${theme.primary}`, borderRadius: '6px 0 0 0' },
            { top: 10, right: 10, borderTop: `3px solid ${theme.primary}`, borderRight: `3px solid ${theme.primary}`, borderRadius: '0 6px 0 0' },
            { bottom: 10, left: 10, borderBottom: `3px solid ${theme.primary}`, borderLeft: `3px solid ${theme.primary}`, borderRadius: '0 0 0 6px' },
            { bottom: 10, right: 10, borderBottom: `3px solid ${theme.primary}`, borderRight: `3px solid ${theme.primary}`, borderRadius: '0 0 6px 0' },
          ].map((s, i) => (
            <div key={i} style={{ position: 'absolute', width: 28, height: 28, ...s }} />
          ))}

          {scanning ? (
            <div style={{ position: 'relative', width: '160px', height: '160px' }}>
              <style>{`@keyframes scanL{0%{top:10%}100%{top:90%}}`}</style>
              <div style={{
                position: 'absolute', left: 0, right: 0, height: '2px',
                background: `linear-gradient(to right, transparent, ${theme.primary}, transparent)`,
                animation: 'scanL 1s ease-in-out infinite alternate',
              }} />
              <div style={{ opacity: 0.35, transform: 'scale(0.85)', transformOrigin: 'center' }}>
                <QRCode size={160} primaryColor={theme.primary} />
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" opacity="0.45">
                <rect x="14" y="18" width="28" height="24" rx="5" fill="none" stroke="white" strokeWidth="2"/>
                <circle cx="28" cy="30" r="7" fill="none" stroke="white" strokeWidth="2"/>
                <circle cx="28" cy="30" r="3.5" fill="white" opacity="0.6"/>
                <path d="M21 18 L24.5 13 L31.5 13 L35 18" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '7px' }}>
                Fotocamera pronta
              </p>
            </div>
          )}
        </div>

        <button onClick={handleConnect} disabled={scanning} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '100%', minHeight: '60px', borderRadius: '16px', border: 'none',
          background: scanning ? (theme.isHC ? '#333' : '#E8E8E8') : `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)`,
          color: scanning ? theme.muted : theme.primaryText,
          cursor: scanning ? 'default' : 'pointer',
          fontFamily: 'Nunito, sans-serif', fontSize: '18px', fontWeight: 900,
          boxShadow: scanning ? 'none' : `0 5px 18px ${theme.primary}5C`,
        }}>
          {scanning ? 'Connessione in corso...' : '📷 Connetti al totem!'}
        </button>
        <SlideDots count={3} current={2} color={theme.primary} />
      </div>
    </div>
  )
}

// ── TOTEM PAIRING SIDE ─────────────────────────────────────────────
function TotemPairingContent() {
  const theme = useTheme()
  const zoom = useFontZoom()

  return (
    <div style={{
      width: '390px', height: '740px',
      background: theme.isHC ? '#000' : '#0D1B2A',
      position: 'relative', overflow: 'hidden',
    }}>
      <style>{`
        @keyframes qrPulse{0%,100%{opacity:0.75;transform:scale(1)}50%{opacity:1;transform:scale(1.04)}}
        @keyframes wDot1{0%,80%,100%{opacity:0.2}40%{opacity:1}}
        @keyframes wDot2{0%,100%{opacity:0.2}50%{opacity:1}}
        @keyframes wDot3{0%,30%,100%{opacity:0.2}65%{opacity:1}}
      `}</style>
      <div style={{
        width: `${390/zoom}px`, height: `${740/zoom}px`, zoom,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '36px 28px',
        overflowY: 'auto', overflowX: 'hidden',
      }}>
        {/* Brand header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
          <div style={{ width: '30px', height: '30px', background: theme.primary, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 8h8M8 4v8" stroke={theme.primaryText} strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '17px', fontWeight: 900, color: theme.isHC ? theme.primary : 'white', letterSpacing: '-0.3px' }}>
            ServizioPA
          </span>
        </div>

        {/* QR with glow */}
        <div style={{
          animation: 'qrPulse 2.8s ease-in-out infinite',
          marginBottom: '24px',
          padding: '14px',
          background: 'white',
          borderRadius: '18px',
          boxShadow: `0 0 0 3px ${theme.primary}72, 0 10px 40px rgba(0,0,0,0.5)`,
        }}>
          <QRCode size={180} primaryColor={theme.primary} />
        </div>

        <h2 style={{
          fontFamily: 'Nunito, sans-serif', fontSize: '22px', fontWeight: 900,
          color: theme.isHC ? theme.primary : 'white',
          textAlign: 'center', lineHeight: 1.25, marginBottom: '10px', letterSpacing: '-0.4px',
        }}>
          Scansiona con il telefono
        </h2>
        <p style={{
          fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: 600,
          color: theme.isHC ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.6)',
          textAlign: 'center', lineHeight: 1.6,
          marginBottom: '24px', maxWidth: '260px',
        }}>
          Apri l'app ServizioPA sul tuo telefono e inquadra questo codice
        </p>

        {/* Waiting indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 700, color: theme.isHC ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.38)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
            In attesa
          </span>
          {[1, 2, 3].map(n => (
            <div key={n} style={{ width: 7, height: 7, borderRadius: '50%', background: theme.primary, animation: `wDot${n} 1.3s ease-in-out infinite` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── MAIN EXPORT ────────────────────────────────────────────────────
export default function Pairing() {
  const [slide, setSlide] = useState(0)
  const [showA11y, setShowA11y] = useState(false)
  const { setState } = useApp()

  const handlePaired = () => setState(s => ({ ...s, currentScreen: 'home', paired: true }))

  const phoneContent = showA11y ? (
    <SlideAccessibility onNext={() => { setShowA11y(false); setSlide(1) }} />
  ) : slide === 0 ? (
    <SlideWelcome onNext={() => setSlide(1)} onAccessibility={() => setShowA11y(true)} />
  ) : slide === 1 ? (
    <SlideHow onNext={() => setSlide(2)} />
  ) : (
    <SlideScanQR onPaired={handlePaired} />
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '40px', height: '820px' }}>
      <PhoneFrame>{phoneContent}</PhoneFrame>
      <TotemFrame><TotemPairingContent /></TotemFrame>
    </div>
  )
}
