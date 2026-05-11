import { useState } from 'react'
import { useApp } from '../../context/AppContext'

// ── MASCOT SVG (150px, friendly character) ─────────────────────────
function MascotLarge() {
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      style={{ width: '150px', height: '150px', filter: 'drop-shadow(0 8px 24px rgba(26,158,143,0.25))' }}
    >
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

// ── SVG ILLUSTRATIONS for slide 1 ─────────────────────────────────
function TotemIllustration() {
  return (
    <svg viewBox="0 0 64 64" fill="none" width="64" height="64">
      <rect x="12" y="4" width="40" height="56" rx="6" fill="#141B28"/>
      <rect x="16" y="10" width="32" height="42" rx="4" fill="#1A9E8F" opacity="0.15"/>
      <rect x="18" y="12" width="28" height="38" rx="3" fill="white" opacity="0.08"/>
      <rect x="20" y="16" width="24" height="28" rx="2" fill="#1A9E8F" opacity="0.3"/>
      <circle cx="32" cy="54" r="3" fill="#1A9E8F" opacity="0.6"/>
      <rect x="26" y="2" width="12" height="4" rx="2" fill="#0D2140"/>
    </svg>
  )
}

function ArrowIllustration() {
  return (
    <svg viewBox="0 0 64 64" fill="none" width="64" height="64">
      <circle cx="32" cy="32" r="28" fill="#E0F5F3"/>
      <path d="M20 32 H44" stroke="#1A9E8F" strokeWidth="3" strokeLinecap="round"/>
      <path d="M36 24 L44 32 L36 40" stroke="#1A9E8F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function PhoneIllustration() {
  return (
    <svg viewBox="0 0 64 64" fill="none" width="64" height="64">
      <rect x="16" y="4" width="32" height="56" rx="8" fill="#DCDCDE"/>
      <rect x="19" y="10" width="26" height="42" rx="5" fill="white"/>
      <rect x="22" y="14" width="20" height="30" rx="3" fill="#FFF0D6"/>
      <rect x="24" y="16" width="16" height="4" rx="2" fill="#1A9E8F" opacity="0.5"/>
      <rect x="24" y="22" width="12" height="3" rx="1.5" fill="#D0D0D0"/>
      <rect x="24" y="27" width="14" height="3" rx="1.5" fill="#D0D0D0"/>
      <rect x="24" y="36" width="16" height="6" rx="3" fill="#1A9E8F"/>
      <rect x="27" y="54" width="10" height="3" rx="1.5" fill="#999"/>
      <rect x="28" y="7" width="8" height="2" rx="1" fill="#AAA"/>
    </svg>
  )
}

function WaveIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
      <path d="M4 14c2 0 2-4 4-4s2 4 4 4 2-4 4-4 2 4 4 4" stroke="#1A9E8F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 18c1.2 0 1.2-2 2.4-2s1.2 2 2.4 2 1.2-2 2.4-2 1.2 2 2.4 2 1.2-2 2.4-2" stroke="#147A6E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"/>
    </svg>
  )
}

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3.2" stroke="#888" strokeWidth="1.8"/>
      <path d="M12 2.8v2.1M12 19.1v2.1M4.9 4.9l1.5 1.5M17.6 17.6l1.5 1.5M2.8 12h2.1M19.1 12h2.1M4.9 19.1l1.5-1.5M17.6 6.4l1.5-1.5" stroke="#888" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  )
}

function QuestionIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#E0F5F3" stroke="#1A9E8F" strokeWidth="1.5"/>
      <path d="M9.6 9.2c.2-1.5 1.4-2.5 3-2.5 1.7 0 3 1 3 2.5 0 1.1-.6 1.7-1.6 2.3-.8.5-1.4 1-1.4 2" stroke="#1A9E8F" strokeWidth="1.7" strokeLinecap="round"/>
      <circle cx="12" cy="16.8" r="1.05" fill="#147A6E"/>
    </svg>
  )
}

function PointerIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
      <path d="M12 3v7" stroke="#1A9E8F" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M8 7l4-4 4 4" stroke="#1A9E8F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 13c2.2 0 3.2 1.4 4.2 3.2.8 1.4 1.5 2.8 2.8 2.8 1.4 0 2.2-1 2.2-2.2V11" stroke="#147A6E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// ── SLIDE DOT INDICATOR ────────────────────────────────────────────
function SlideDots({ count, current }) {
  return (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '28px' }}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} style={{
          width: i === current ? '20px' : '10px',
          height: '10px',
          borderRadius: '5px',
          background: i === current ? '#1A9E8F' : 'transparent',
          border: i === current ? 'none' : '2px solid #C0C0C0',
          transition: 'all 0.3s ease',
        }} />
      ))}
    </div>
  )
}

// ── SHARED BUTTON STYLES ───────────────────────────────────────────
const ctaStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '72px',
  padding: '20px 48px',
  borderRadius: '20px',
  border: 'none',
  background: 'linear-gradient(135deg, #1A9E8F 0%, #147A6E 100%)',
  color: 'white',
  fontFamily: 'Nunito, sans-serif',
  fontSize: '22px',
  fontWeight: 900,
  cursor: 'pointer',
  boxShadow: '0 6px 24px rgba(26,158,143,0.40)',
  letterSpacing: '-0.3px',
}

const linkStyle = {
  background: 'none',
  border: 'none',
  color: 'rgba(255,255,255,0.55)',
  fontFamily: 'Nunito, sans-serif',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  marginTop: '14px',
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
}

// ── SLIDE 0: BENVENUTO ─────────────────────────────────────────────
function SlideWelcome({ onNext, onAccessibility }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#FFF8F0',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '48px 80px',
      position: 'relative',
    }}>
      {/* Animated mascot */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
      <div style={{ animation: 'float 3s ease-in-out infinite', marginBottom: '32px' }}>
        <MascotLarge />
      </div>

      <h1 style={{
        fontFamily: 'Nunito, sans-serif',
        fontSize: '44px',
        fontWeight: 900,
        color: '#1A1A1A',
        textAlign: 'center',
        lineHeight: 1.15,
        letterSpacing: '-1px',
        marginBottom: '16px',
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <WaveIcon />
          <span>Ciao! Sono il tuo<br />assistente</span>
        </span>
      </h1>

      <p style={{
        fontFamily: 'Nunito, sans-serif',
        fontSize: '20px',
        fontWeight: 600,
        color: '#555',
        textAlign: 'center',
        lineHeight: 1.6,
        marginBottom: '40px',
        maxWidth: '560px',
      }}>
        Ti aiuto a usare i servizi digitali.<br />
        Senza stress, passo dopo passo.
      </p>

      <button onClick={onNext} style={ctaStyle}>
        Iniziamo! →
      </button>

      {/* Accessibility link bottom-left */}
      <button
        onClick={onAccessibility}
        style={{
          position: 'absolute',
          bottom: '32px',
          left: '32px',
          background: 'none',
          border: 'none',
          color: '#888',
          fontFamily: 'Nunito, sans-serif',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
        }}
      >
        <GearIcon />
        Impostazioni accessibilità
      </button>

      <SlideDots count={3} current={0} />
    </div>
  )
}

// ── SLIDE 1: COME FUNZIONA ─────────────────────────────────────────
function SlideHow({ onNext }) {
  const cards = [
    {
      icon: <TotemIllustration />,
      title: 'Sei in un ufficio\no ospedale',
      desc: 'Davanti a te c\'è un totem digitale',
    },
    {
      icon: <ArrowIllustration />,
      title: 'Usa il TOTEM\nper le operazioni',
      desc: 'Tocca lo schermo grande per scegliere',
    },
    {
      icon: <PhoneIllustration />,
      title: 'Il telefono ti guida\npasso per passo',
      desc: 'Il tuo assistente è qui accanto',
    },
  ]

  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#FFF8F0',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 60px',
    }}>
      <style>{`
        @keyframes cardIn0 { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        @keyframes cardIn1 { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        @keyframes cardIn2 { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      <h2 style={{
        fontFamily: 'Nunito, sans-serif',
        fontSize: '38px',
        fontWeight: 900,
        color: '#1A1A1A',
        textAlign: 'center',
        letterSpacing: '-0.8px',
        marginBottom: '36px',
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
          <QuestionIcon />
          <span>Come funziona?</span>
        </span>
      </h2>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', width: '100%', maxWidth: '900px' }}>
        {cards.map((card, i) => (
          <div key={i} style={{
            flex: 1,
            background: 'white',
            borderRadius: '24px',
            padding: '28px 24px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            animation: `cardIn${i} 0.5s ease ${i * 0.15}s both`,
          }}>
            <div style={{
              width: '80px', height: '80px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: '#F0FDFB',
              borderRadius: '20px',
            }}>
              {card.icon}
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{
                fontFamily: 'Nunito, sans-serif',
                fontSize: '17px',
                fontWeight: 800,
                color: '#1A1A1A',
                lineHeight: 1.35,
                whiteSpace: 'pre-line',
                marginBottom: '8px',
              }}>
                {card.title}
              </p>
              <p style={{
                fontFamily: 'Nunito, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                color: '#6B7280',
                lineHeight: 1.5,
              }}>
                {card.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button onClick={onNext} style={ctaStyle}>
        Capito! →
      </button>

      <SlideDots count={3} current={1} />
    </div>
  )
}

// ── SLIDE 2: ACCESSIBILITÀ ─────────────────────────────────────────
function SlideAccessibility({ onDone }) {
  const [selectedSize, setSelectedSize] = useState('normal')
  const { setState } = useApp()

  const sizeOptions = [
    { id: 'normal',  label: 'Normale',       display: 'A',   samplePx: 14 },
    { id: 'large',   label: 'Grande',        display: 'AA',  samplePx: 17 },
    { id: 'xlarge',  label: 'Molto grande',  display: 'AAA', samplePx: 21 },
  ]

  const handleSave = () => {
    setState(s => ({
      ...s,
      currentScreen: 'home',
      accessibility: {
        fontSize: selectedSize,
      },
    }))
    onDone?.()
  }

  const handleSkip = () => {
    setState(s => ({
      ...s,
      currentScreen: 'home',
      accessibility: { fontSize: 'normal' },
    }))
  }

  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#FFF8F0',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 80px',
    }}>
      <h2 style={{
        fontFamily: 'Nunito, sans-serif',
        fontSize: '38px',
        fontWeight: 900,
        color: '#1A1A1A',
        textAlign: 'center',
        letterSpacing: '-0.8px',
        marginBottom: '10px',
      }}>
        Come preferisci il testo?
      </h2>
      <p style={{
        fontFamily: 'Nunito, sans-serif',
        fontSize: '16px',
        fontWeight: 600,
        color: '#666',
        textAlign: 'center',
        marginBottom: '28px',
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}><PointerIcon />Puoi cambiarlo sempre in seguito.</span>
      </p>

      {/* Font size cards */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', width: '100%', maxWidth: '700px' }}>
        {sizeOptions.map(opt => {
          const isActive = selectedSize === opt.id
          return (
            <button
              key={opt.id}
              onClick={() => setSelectedSize(opt.id)}
              style={{
                flex: 1,
                padding: '22px 12px',
                borderRadius: '20px',
                border: isActive ? '3px solid #1A9E8F' : '2.5px solid #E0E0E0',
                background: isActive ? '#E8F7F5' : 'white',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                boxShadow: isActive ? '0 4px 16px rgba(26,158,143,0.20)' : '0 1px 6px rgba(0,0,0,0.06)',
                transition: 'all 0.2s',
              }}
            >
              <span style={{
                fontFamily: 'Nunito, sans-serif',
                fontSize: '28px',
                fontWeight: 900,
                color: isActive ? '#1A9E8F' : '#1A1A1A',
                lineHeight: 1,
              }}>
                {opt.display}
              </span>
              <span style={{
                fontFamily: 'Nunito, sans-serif',
                fontSize: opt.samplePx,
                fontWeight: 700,
                color: '#5A5755',
                lineHeight: 1.2,
              }}>
                Testo
              </span>
              <span style={{
                fontFamily: 'Nunito, sans-serif',
                fontSize: '13px',
                fontWeight: 800,
                color: isActive ? '#1A9E8F' : '#9CA3AF',
              }}>
                {opt.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Separator */}
      <div style={{
        width: '100%', maxWidth: '700px',
        height: '1px', background: '#E0E0E0',
        margin: '4px 0 20px',
      }} />

      {/* Color mode */}
      <p style={{
        fontFamily: 'Nunito, sans-serif',
        fontSize: '15px',
        fontWeight: 800,
        color: '#555',
        textAlign: 'center',
        marginBottom: '14px',
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
      }}>
        Colori
      </p>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        {[
          { id: 'normal', label: 'Normale', bg: 'white', color: '#1A1A1A' },
          { id: 'highContrast', label: 'Alto contrasto', bg: '#1A1A1A', color: 'white' },
        ].map(opt => {
          const isActive = selectedMode === opt.id
          return (
            <button
              key={opt.id}
              onClick={() => setSelectedMode(opt.id)}
              style={{
                padding: '14px 32px',
                borderRadius: '16px',
                border: isActive ? '3px solid #1A9E8F' : '2.5px solid #E0E0E0',
                background: opt.bg,
                color: opt.color,
                fontFamily: 'Nunito, sans-serif',
                fontSize: '16px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: isActive ? '0 4px 16px rgba(26,158,143,0.20)' : '0 1px 6px rgba(0,0,0,0.06)',
                transition: 'all 0.2s',
                minHeight: '56px',
              }}
            >
              {opt.label}
            </button>
          )
        })}
      </div>

      <button onClick={handleSave} style={ctaStyle}>
        Salva e inizia →
      </button>

      <button onClick={handleSkip} style={linkStyle}>
        Salta e usa normale →
      </button>

      <SlideDots count={3} current={2} />
    </div>
  )
}

// ── MAIN ONBOARDING SCREEN ─────────────────────────────────────────
export default function Onboarding() {
  const [slide, setSlide] = useState(0)

  return (
    <div style={{ width: '1180px', height: '820px', overflow: 'hidden', position: 'relative' }}>
      {slide === 0 && (
        <SlideWelcome
          onNext={() => setSlide(1)}
          onAccessibility={() => setSlide(2)}
        />
      )}
      {slide === 1 && (
        <SlideHow onNext={() => setSlide(2)} />
      )}
      {slide === 2 && (
        <SlideAccessibility onDone={() => {}} />
      )}
    </div>
  )
}
