import { useState, useEffect, useRef } from 'react'
import { QrCode, Keyboard, Building2, FileText, DollarSign, Hash, CreditCard, ChevronRight, ArrowLeft, Tag, Check, AlertTriangle, Camera } from 'lucide-react'
import { useApp, useTheme, useFontZoom } from '../../context/AppContext'
import AssistantOverlay from '../../components/AssistantOverlay'
import { PhoneFrame, TotemFrame } from '../../components/layout/DeviceFrames'
import AccessibilityPanel from '../../components/phone/AccessibilityPanel'
import ExitButton from '../../components/ExitButton'

// ── HIGHLIGHT SELECTORS ────────────────────────────────────────────
const HIGHLIGHT_SELECTORS = [
  '[data-highlight="qr"]',
  '[data-highlight="scanner"]',
  '[data-highlight="cta"]',
  '[data-highlight="email"]',
  '[data-highlight="email-confirm"]',
  '[data-highlight="continua"]',
  null,
  '[data-highlight="carta-credito"]',
  '[data-highlight="card-number"]',
  '[data-highlight="card-expiry"]',
  '[data-highlight="card-cvv"]',
  '[data-highlight="card-name"]',
  '[data-highlight="card-continua"]',
  '[data-highlight="paga-btn"]',
  null,
]

// ── COACHING (default overlay steps) ──────────────────────────────
function getCoaching(theme) {
  const c = theme.primary
  return {
    0: {
      tag: (<span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><ChevronRight size={12} />Cosa fare adesso</span>),
      text: (<>Tocca il pulsante <strong style={{ color: c }}>Inquadra il codice QR</strong> qui a fianco per iniziare il pagamento.</>),
    },
    2: {
      tag: (<span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Check size={12} />Controlla i dati</span>),
      text: (<>Leggi i dati qui a fianco e verifica che siano corretti.<br />Poi tocca <strong style={{ color: c }}>VAI AL PAGAMENTO</strong>.</>),
    },
    3: {
      tag: (<span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><FileText size={12} />Scrivi la tua email</span>),
      text: (<>Tocca il campo <strong style={{ color: c }}>Email</strong> e scrivi il tuo indirizzo.<br />Riceverai la ricevuta di pagamento lì.</>),
    },
    4: {
      tag: (<span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Check size={12} />Email inserita!</span>),
      text: (<>Bene! Ora tocca il secondo campo e riscrivi la stessa email per <strong style={{ color: c }}>confermare</strong> che sia quella giusta.</>),
    },
    6: {
      tag: (<span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><ChevronRight size={12} />Scorri verso l'alto</span>),
      text: (<>Muovi il dito <strong style={{ color: c }}>dal basso verso l'alto</strong> sulla lista qui a fianco per trovare il metodo di pagamento.</>),
      showGesture: true,
    },
    7: {
      tag: (<span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><CreditCard size={12} />Tocca questo</span>),
      text: (<>Tocca <strong style={{ color: c }}>Carta di debito o credito</strong> — è quella evidenziata qui a fianco.</>),
    },
    14: {
      tag: (<span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Check size={12} />Bravissimo!</span>),
      text: 'Hai completato il pagamento con successo! Riceverai una ricevuta via email.',
    },
  }
}

// ── MECHANISM 1: JOURNEY MAP ───────────────────────────────────────
const JOURNEY = [
  { label: 'Bollettino' },
  { label: 'Email' },
  { label: 'Carta' },
  { label: 'Paga' },
]

// SVG icons for PagoPA journey stops
const JOURNEY_ICONS = [
  // Bollettino: document/receipt
  <svg key="doc" width="22" height="22" viewBox="0 0 22 22" fill="none">
    <rect x="3" y="1" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" fill="none"/>
    <line x1="6" y1="7" x2="14" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="6" y1="10" x2="14" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="6" y1="13" x2="11" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M17 15 L17 21 L14.5 19.5 L12 21 L12 15" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill="none"/>
  </svg>,
  // Email: envelope
  <svg key="env" width="22" height="22" viewBox="0 0 22 22" fill="none">
    <rect x="2" y="5" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" fill="none"/>
    <path d="M2 7 L11 13 L20 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
  </svg>,
  // Carta: credit card
  <svg key="card" width="22" height="22" viewBox="0 0 22 22" fill="none">
    <rect x="2" y="5" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" fill="none"/>
    <line x1="2" y1="9" x2="20" y2="9" stroke="currentColor" strokeWidth="1.8"/>
    <rect x="5" y="12" width="6" height="2.5" rx="1" fill="currentColor" opacity="0.7"/>
  </svg>,
  // Paga: checkmark circle
  <svg key="check" width="22" height="22" viewBox="0 0 22 22" fill="none">
    <circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.8" fill="none"/>
    <path d="M7 11 L10 14 L15 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>,
]

function getJourneyPhase(step) {
  if (step <= 2) return 0
  if (step <= 5) return 1
  if (step <= 12) return 2
  return 3
}

function JourneyMap({ step }) {
  if (step >= 14) return null
  const current = getJourneyPhase(step)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '16px' }}>
      {JOURNEY.map((stop, i) => {
        const iconColor = i === current ? 'white' : i < current ? '#1A9E8F' : '#C0C0C0'
        const size = i === current ? '52px' : '40px'
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < JOURNEY.length - 1 ? '1 1 0' : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{
                width: size,
                height: size,
                borderRadius: '13px',
                background: i === current ? '#1A9E8F' : i < current ? '#E0F5F3' : '#F0F0F0',
                border: `2px solid ${i === current ? '#147A6E' : i < current ? '#A8DDD8' : '#E0E0E0'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'all 0.3s',
                boxShadow: i === current ? '0 4px 12px rgba(26,158,143,0.28)' : 'none',
                color: iconColor,
              }}>
                {i < current
                  ? <Check size={14} color="#1A9E8F" strokeWidth={3} />
                  : <span style={{ color: iconColor, display: 'flex', alignItems: 'center' }}>{JOURNEY_ICONS[i]}</span>
                }
              </div>
              <span style={{
                fontSize: i === current ? '11px' : '10px',
                fontWeight: i === current ? 800 : 600,
                color: i === current ? '#1A9E8F' : i < current ? '#1A9E8F' : '#B0B0B0',
                fontFamily: 'Nunito, sans-serif', whiteSpace: 'nowrap',
              }}>{stop.label}</span>
            </div>
            {i < JOURNEY.length - 1 && (
              <div style={{
                flex: 1, height: '2px', marginBottom: '20px', minWidth: '6px',
                background: i < current ? '#1A9E8F' : '#E8E8E8',
                transition: 'background 0.4s',
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── MECHANISM 3: SVG PHYSICAL ANCHORS ─────────────────────────────
function BollentinoIllustration() {
  return (
    <svg viewBox="0 0 280 112" fill="none" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <rect x="2" y="2" width="180" height="108" rx="7" fill="white" stroke="#E0E0E0" strokeWidth="1.5"/>
      <rect x="2" y="2" width="180" height="22" rx="7" fill="#E0F5F3"/>
      <rect x="2" y="14" width="180" height="10" fill="#E0F5F3"/>
      <text x="12" y="17" fontFamily="Nunito, sans-serif" fontSize="9" fontWeight="800" fill="#1A9E8F">pagoPA</text>
      <rect x="12" y="32" width="48" height="4" rx="2" fill="#C8C8C8"/>
      <rect x="66" y="32" width="80" height="4" rx="2" fill="#555"/>
      <rect x="12" y="44" width="48" height="4" rx="2" fill="#C8C8C8"/>
      <rect x="66" y="44" width="60" height="4" rx="2" fill="#555"/>
      <rect x="12" y="56" width="48" height="4" rx="2" fill="#C8C8C8"/>
      <rect x="66" y="53" width="50" height="10" rx="2" fill="#1A1A1A"/>
      <rect x="192" y="2" width="84" height="84" rx="8" fill="white" stroke="#E0E0E0" strokeWidth="1.5"/>
      <rect x="200" y="10" width="16" height="16" rx="2" fill="#1A1A1A"/>
      <rect x="202" y="12" width="12" height="12" rx="1" fill="white"/>
      <rect x="204" y="14" width="8" height="8" fill="#1A1A1A"/>
      <rect x="250" y="10" width="16" height="16" rx="2" fill="#1A1A1A"/>
      <rect x="252" y="12" width="12" height="12" rx="1" fill="white"/>
      <rect x="254" y="14" width="8" height="8" fill="#1A1A1A"/>
      <rect x="200" y="56" width="16" height="16" rx="2" fill="#1A1A1A"/>
      <rect x="202" y="58" width="12" height="12" rx="1" fill="white"/>
      <rect x="204" y="60" width="8" height="8" fill="#1A1A1A"/>
      <rect x="222" y="10" width="6" height="6" rx="1" fill="#1A1A1A"/>
      <rect x="232" y="10" width="6" height="6" rx="1" fill="#1A1A1A"/>
      <rect x="242" y="10" width="4" height="4" rx="1" fill="#1A1A1A"/>
      <rect x="222" y="20" width="4" height="4" rx="1" fill="#1A1A1A"/>
      <rect x="238" y="20" width="6" height="6" rx="1" fill="#1A1A1A"/>
      <rect x="228" y="34" width="6" height="6" rx="1" fill="#1A1A1A"/>
      <rect x="240" y="34" width="4" height="4" rx="1" fill="#1A1A1A"/>
      <rect x="222" y="46" width="8" height="8" rx="1" fill="#1A1A1A"/>
      <rect x="235" y="46" width="5" height="5" rx="1" fill="#1A1A1A"/>
      <rect x="250" y="34" width="8" height="8" rx="1" fill="#1A1A1A"/>
      <rect x="250" y="46" width="6" height="6" rx="1" fill="#1A1A1A"/>
      <rect x="222" y="56" width="4" height="4" rx="1" fill="#1A1A1A"/>
      <rect x="232" y="60" width="8" height="8" rx="1" fill="#1A1A1A"/>
      <rect x="250" y="60" width="6" height="6" rx="1" fill="#1A1A1A"/>
      <rect x="186" y="-4" width="96" height="96" rx="12" fill="none" stroke="#F5A623" strokeWidth="2.5" strokeDasharray="7,3"/>
      <path d="M184 44 L192 44" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M188 39 L193 44 L188 49" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <rect x="192" y="90" width="84" height="18" rx="5" fill="#FFF0E0"/>
      <text x="234" y="102" textAnchor="middle" fontFamily="Nunito, sans-serif" fontSize="9" fontWeight="800" fill="#D4720A">Il QR è qui →</text>
    </svg>
  )
}

function CardFrontIllustration({ highlight }) {
  return (
    <svg viewBox="0 0 260 118" fill="none" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <rect x="2" y="2" width="180" height="112" rx="11" fill="#1A9E8F"/>
      <rect x="14" y="22" width="24" height="18" rx="3" fill="#F0C040"/>
      <line x1="14" y1="31" x2="38" y2="31" stroke="#B09020" strokeWidth="0.8"/>
      <line x1="26" y1="22" x2="26" y2="40" stroke="#B09020" strokeWidth="0.8"/>
      <circle cx="160" cy="16" r="10" fill="white" opacity="0.22"/>
      <circle cx="173" cy="16" r="10" fill="white" opacity="0.22"/>
      <rect x="12" y="55" width="158" height="15" rx="3" fill="rgba(255,255,255,0.13)"/>
      <text x="16" y="66" fontFamily="monospace" fontSize="11" fill="rgba(255,255,255,0.82)" letterSpacing="3">•••• •••• •••• ••••</text>
      <text x="14" y="83" fontFamily="Nunito, sans-serif" fontSize="7" fill="rgba(255,255,255,0.58)">SCADENZA</text>
      <rect x="14" y="86" width="56" height="14" rx="2" fill="rgba(255,255,255,0.13)"/>
      <text x="18" y="96" fontFamily="Nunito, sans-serif" fontSize="10" fill="rgba(255,255,255,0.82)">MM / AA</text>
      <text x="14" y="110" fontFamily="Nunito, sans-serif" fontSize="10" fill="rgba(255,255,255,0.72)" fontWeight="600">MARIO ROSSI</text>
      {highlight === 'number' && <rect x="10" y="53" width="163" height="19" rx="5" fill="none" stroke="#F5A623" strokeWidth="2.5"/>}
      {highlight === 'expiry' && <rect x="12" y="84" width="60" height="18" rx="5" fill="none" stroke="#F5A623" strokeWidth="2.5"/>}
      {highlight === 'name'   && <rect x="12" y="104" width="120" height="11" rx="4" fill="none" stroke="#F5A623" strokeWidth="2.5"/>}
      <path d="M188 65 L204 65" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M200 60 L205 65 L200 70" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <rect x="207" y="52" width="48" height="26" rx="6" fill="#FFF0E0"/>
      <text x="231" y="64" textAnchor="middle" fontFamily="Nunito, sans-serif" fontSize="9" fontWeight="800" fill="#D4720A">
        {highlight === 'number' ? 'Numero' : highlight === 'expiry' ? 'Scadenza' : 'Tuo nome'}
      </text>
      <text x="231" y="73" textAnchor="middle" fontFamily="Nunito, sans-serif" fontSize="9" fontWeight="700" fill="#D4720A">è qui</text>
    </svg>
  )
}

function CardBackIllustration() {
  return (
    <svg viewBox="0 0 260 118" fill="none" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <rect x="2" y="2" width="180" height="112" rx="11" fill="#D8D8D8"/>
      <rect x="2" y="20" width="180" height="22" fill="#1A1A1A"/>
      <rect x="14" y="56" width="118" height="22" rx="3" fill="white" stroke="#E0E0E0" strokeWidth="1"/>
      <rect x="136" y="56" width="38" height="22" rx="3" fill="#F5F5F5" stroke="#DDD" strokeWidth="1"/>
      <text x="155" y="71" textAnchor="middle" fontFamily="monospace" fontSize="12" fontWeight="700" fill="#1A1A1A">123</text>
      <rect x="133" y="53" width="44" height="28" rx="6" fill="none" stroke="#F5A623" strokeWidth="2.5"/>
      <path d="M184" y="67" />
      <path d="M184 67 L202 67" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M198 62 L203 67 L198 72" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <rect x="205" y="54" width="50" height="26" rx="6" fill="#FFF0E0"/>
      <text x="230" y="65" textAnchor="middle" fontFamily="Nunito, sans-serif" fontSize="9" fontWeight="800" fill="#D4720A">CVV</text>
      <text x="230" y="74" textAnchor="middle" fontFamily="Nunito, sans-serif" fontSize="9" fontWeight="700" fill="#D4720A">è qui</text>
      <text x="91" y="102" textAnchor="middle" fontFamily="Nunito, sans-serif" fontSize="8" fontWeight="600" fill="#9CA3AF">RETRO DELLA CARTA</text>
    </svg>
  )
}

// ── SHARED OVERLAY STYLES (dynamic, HC-aware) ─────────────────────
function useOverlayStyles() {
  const theme = useTheme()
  return {
    card: {
      background: theme.isHC ? 'rgba(10,10,10,0.97)' : 'rgba(255,255,255,0.97)',
      borderRadius: '22px',
      boxShadow: '0 8px 36px rgba(0,0,0,0.30)',
      border: `2.5px solid ${theme.primary}72`,
      padding: '18px 20px',
    },
    tagOrange: {
      display: 'inline-flex', alignItems: 'center',
      background: theme.isHC ? '#1A1400' : '#FFF0E0',
      borderRadius: '8px', padding: '5px 11px',
      fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 800,
      color: theme.isHC ? theme.primary : '#D4720A',
      letterSpacing: '0.4px', textTransform: 'uppercase', marginBottom: '10px',
    },
    tagGreen: {
      display: 'inline-flex', alignItems: 'center',
      background: theme.isHC ? '#001A15' : '#E0F5F3',
      borderRadius: '8px', padding: '5px 11px',
      fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 800,
      color: theme.isHC ? theme.primary : '#0D7A6D',
      letterSpacing: '0.4px', textTransform: 'uppercase', marginBottom: '10px', gap: '5px',
    },
    bodyText: { fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 700, color: theme.text, margin: '0 0 12px', lineHeight: 1.6 },
    divider: { height: '1px', background: theme.isHC ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)', margin: '12px 0 10px' },
    reassureText: { fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 600, color: theme.textSecondary, lineHeight: 1.5, fontStyle: 'italic', margin: 0 },
    itemBg: theme.isHC ? '#111' : '#F0FDFB',
    itemBorder: theme.isHC ? '#333' : '#A8DDD8',
    itemLabel: { fontFamily: 'Nunito, sans-serif', fontSize: '11px', fontWeight: 700, color: theme.isHC ? theme.primary : '#5A9E8F', display: 'block', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' },
    itemValue: { fontFamily: 'Nunito, sans-serif', fontSize: '18px', fontWeight: 900, color: theme.text, lineHeight: 1.2, wordBreak: 'break-all', display: 'block' },
  }
}

// ── MECHANISM 3: ANCHOR OVERLAY ───────────────────────────────────
const ANCHOR_CONFIGS = {
  bollettino: {
    tag: (<span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><FileText size={12} />Dove si trova il QR</span>),
    text: 'Il codice QR è stampato sul bollettino. Tienilo davanti alla fotocamera.',
    illustration: <BollentinoIllustration />,
  },
  'card-number': {
    tag: (<span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><CreditCard size={12} />Dove trovi le 16 cifre</span>),
    text: 'Le cifre sono sul FRONTE della carta, in rilievo. Trovi 4 gruppi da 4 numeri.',
    illustration: <CardFrontIllustration highlight="number" />,
  },
  'card-expiry': {
    tag: (<span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><DollarSign size={12} />Dove trovi la scadenza</span>),
    text: 'La data di scadenza è sul FRONTE, sotto il numero. Formato: mese/anno (es. 06/27).',
    illustration: <CardFrontIllustration highlight="expiry" />,
  },
  'card-cvv': {
    tag: (<span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Tag size={12} />Dove trovi il CVV</span>),
    text: 'Il CVV sono 3 cifre nel riquadro bianco sul RETRO della carta, in basso a destra.',
    illustration: <CardBackIllustration />,
  },
  'card-name': {
    tag: (<span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Building2 size={12} />Dove trovi il nome</span>),
    text: 'Il tuo nome è sul FRONTE della carta, in basso a sinistra, stampato in rilievo.',
    illustration: <CardFrontIllustration highlight="name" />,
  },
}

function AnchorOverlay({ type, highlightZone, forceTop }) {
  const s = useOverlayStyles()
  const zoom = useFontZoom()
  const atTop = forceTop || !highlightZone || highlightZone.top > 350
  const cfg = ANCHOR_CONFIGS[type]
  if (!cfg) return null
  return (
    <div style={{ position: 'absolute', top: atTop ? 100 : 'auto', bottom: atTop ? 'auto' : 30, left: 14, right: 14, zIndex: 10 }}>
      <div style={{ ...s.card, zoom, width: `${330 / zoom}px`, maxHeight: `${260 / zoom}px`, overflowY: 'auto', padding: '14px 16px' }}>
        <div style={s.tagOrange}>{cfg.tag}</div>
        <p style={{ ...s.bodyText, fontSize: '14px', margin: '0 0 8px' }}>{cfg.text}</p>
        <div style={{ borderRadius: '8px', overflow: 'hidden', background: s.itemBg, padding: '6px', width: '160px', marginLeft: 'auto', marginRight: 'auto' }}>
          {cfg.illustration}
        </div>
      </div>
    </div>
  )
}

// ── MECHANISM 2: MIRROR OVERLAY ───────────────────────────────────
function MirrorOverlay({ title, items, cta }) {
  const s = useOverlayStyles()
  const zoom = useFontZoom()
  return (
    <div style={{ position: 'absolute', top: 100, left: 14, right: 14, zIndex: 10 }}>
      <div style={{ ...s.card, zoom, width: `${330 / zoom}px`, maxHeight: `${560 / zoom}px`, overflowY: 'auto' }}>
        <div style={s.tagGreen}>
          <Check size={12} strokeWidth={3} />
          {title}
        </div>
        {items.map((item, i) => (
          <div key={i} style={{ background: s.itemBg, border: `1.5px solid ${s.itemBorder}`, borderRadius: '12px', padding: '10px 14px', marginBottom: '8px' }}>
            <span style={s.itemLabel}>{item.label}</span>
            <span style={s.itemValue}>{item.value}</span>
          </div>
        ))}
        <div style={s.divider} />
        <p style={{ ...s.bodyText, margin: 0 }}>→ {cta}</p>
      </div>
    </div>
  )
}

// ── MECHANISM 5: NATURAL LANGUAGE SUMMARY ─────────────────────────
function NaturalLangOverlay({ email, cardLast4 }) {
  const s = useOverlayStyles()
  const zoom = useFontZoom()
  return (
    <div style={{ position: 'absolute', top: 100, left: 14, right: 14, zIndex: 10 }}>
      <div style={{ ...s.card, zoom, width: `${330 / zoom}px`, maxHeight: `${360 / zoom}px`, overflowY: 'auto', padding: '14px 16px' }}>
        <div style={s.tagOrange}><Tag size={12} /> Rileggiamo insieme</div>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: 700, color: s.bodyText.color, lineHeight: 1.5, margin: '0 0 10px' }}>
          Stai per pagare{' '}
          <strong style={{ color: '#1A9E8F', fontSize: '18px' }}>36,50 €</strong>
          <br />per un <strong>Ticket Sanitario</strong>
          <br />all'<strong>ASL Vercelli</strong>.
        </p>
        <div style={{ background: s.itemBg, border: `1.5px solid ${s.itemBorder}`, borderRadius: '8px', padding: '6px 10px', marginBottom: '6px' }}>
          <span style={s.itemLabel}>Ricevuta inviata a</span>
          <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 800, color: s.itemValue.color, wordBreak: 'break-all', display: 'block' }}>{email || '—'}</span>
        </div>
        <div style={{ background: s.itemBg, border: `1.5px solid ${s.itemBorder}`, borderRadius: '8px', padding: '6px 10px', marginBottom: '8px' }}>
          <span style={s.itemLabel}>Carta che finisce in</span>
          <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 800, color: s.itemValue.color, display: 'block' }}>**** **** **** {cardLast4 || '????'}</span>
        </div>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 700, color: s.tagOrange.color, margin: 0 }}>
          Va tutto bene? Tocca <strong>PAGA</strong> qui a fianco.
        </p>
      </div>
    </div>
  )
}

// ── LEFT PANEL ─────────────────────────────────────────────────────
function PanelLeft({ step, rightPanelContent, rightPanelRef, showGesture, overrideHighlightZone, leftPanelRef, forceTop, email, cardLast4, scrollVersion }) {
  const theme = useTheme()
  const zoom = useFontZoom()
  const COACHING = getCoaching(theme)
  const selector = HIGHLIGHT_SELECTORS[step]
  const [highlightZone, setHighlightZone] = useState(null)

  useEffect(() => {
    if (overrideHighlightZone === undefined) return
    setHighlightZone(overrideHighlightZone)
  }, [overrideHighlightZone])

  useEffect(() => {
    if (overrideHighlightZone !== undefined) return
    const computeZone = () => {
      if (!selector || !rightPanelRef?.current) return null
      const target = rightPanelRef.current.querySelector(selector)
      if (!target) return null
      const targetRect = target.getBoundingClientRect()
      const panelRect = rightPanelRef.current.getBoundingClientRect()
      const scale = panelRect.width > 0 ? panelRect.width / 390 : Math.min(window.innerWidth / 1180, window.innerHeight / 820)
      return {
        top: (targetRect.top - panelRect.top) / scale,
        left: (targetRect.left - panelRect.left) / scale,
        width: targetRect.width / scale,
        height: targetRect.height / scale,
      }
    }
    
    // Schedule calculation with requestAnimationFrame for accurate dimensions after reflow
    const scheduleCompute = () => {
      requestAnimationFrame(() => {
        setTimeout(() => setHighlightZone(computeZone()), 100)
      })
    }
    
    const timer = setTimeout(() => setHighlightZone(computeZone()), 150)
    const ro = new ResizeObserver(scheduleCompute)
    if (rightPanelRef?.current) {
      ro.observe(rightPanelRef.current)
      // Also observe the target element if it exists
      if (selector) {
        const target = rightPanelRef.current.querySelector(selector)
        if (target) ro.observe(target)
      }
    }
    return () => { clearTimeout(timer); ro.disconnect() }
  }, [selector, rightPanelRef, overrideHighlightZone, zoom, scrollVersion])

  const renderOverlay = () => {
    if (step === 5)  return <MirrorOverlay title="Email inserita!" items={[{ label: 'La tua email', value: email || '—' }]} cta="Ora tocca CONTINUA qui a fianco" />
    if (step === 12) return <MirrorOverlay title="Dati carta inseriti!" items={[{ label: 'Carta (ultime 4 cifre)', value: `**** **** **** ${cardLast4 || '????'}` }]} cta="Ora tocca CONTINUA per proseguire" />
    if (step === 13) return <NaturalLangOverlay email={email} cardLast4={cardLast4} />
    if (step === 1)  return <AnchorOverlay type="bollettino" highlightZone={highlightZone} forceTop />
    if (step === 8)  return <AnchorOverlay type="card-number" highlightZone={highlightZone} />
    if (step === 9)  return <AnchorOverlay type="card-expiry" highlightZone={highlightZone} />
    if (step === 10) return <AnchorOverlay type="card-cvv" highlightZone={highlightZone} />
    if (step === 11) return <AnchorOverlay type="card-name" highlightZone={highlightZone} />
    const coaching = COACHING[step]
    if (!coaching) return null
    return (
      <AssistantOverlay
        tag={coaching.tag} text={coaching.text}
        highlightZone={highlightZone}
        showGesture={coaching.showGesture || showGesture}
        forceTop={forceTop}
      />
    )
  }

  return (
    <div ref={leftPanelRef} style={{ width: '390px', height: '740px', flexShrink: 0, position: 'relative', overflow: 'hidden', background: theme.bg }}>
      {/* Blurred mirror of totem */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', filter: 'blur(1.5px)', overflow: 'hidden' }}>
        <div style={{ width: `${390/zoom}px`, height: `${740/zoom}px`, zoom, filter: theme.isHC ? 'invert(1)' : 'none' }}>
          {rightPanelContent}
        </div>
      </div>
      <div style={{ position: 'absolute', inset: 0, background: theme.isHC ? 'rgba(0,0,0,0.72)' : 'rgba(0,0,0,0.48)', pointerEvents: 'none', zIndex: 1 }} />
      {highlightZone && (
        <>
          <div style={{
            position: 'absolute', top: highlightZone.top, left: highlightZone.left,
            width: highlightZone.width, height: highlightZone.height,
            zIndex: 2, pointerEvents: 'none', borderRadius: '16px',
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.48)', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -(highlightZone.top / zoom), left: -(highlightZone.left / zoom), width: `${390/zoom}px`, height: `${740/zoom}px`, zoom, filter: theme.isHC ? 'invert(1)' : 'none', pointerEvents: 'none' }}>
              {rightPanelContent}
            </div>
          </div>
          <div style={{
            position: 'absolute',
            top: highlightZone.top - 4, left: highlightZone.left - 4,
            width: highlightZone.width + 8, height: highlightZone.height + 8,
            border: `3px solid ${theme.primary}`, borderRadius: '20px',
            pointerEvents: 'none', zIndex: 3,
            boxShadow: `0 0 0 2px ${theme.primary}33, 0 0 20px ${theme.primary}CC`,
          }} />
        </>
      )}

      {renderOverlay()}

      {/* Accessibility gear inside phone */}
      <AccessibilityPanel />
    </div>
  )
}

// ── SHARED FIELD HELPERS ──────────────────────────────────────────
const fieldLabel = (text) => (
  <label style={{ display: 'block', fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 700, color: '#1A1A1A', marginBottom: '7px' }}>{text}</label>
)
const fieldHelper = (text) => (
  <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 500, color: '#6B7280', margin: '5px 0 0', lineHeight: 1.4 }}>{text}</p>
)
const inputBase = {
  background: '#FFFFFF', color: '#1A1A1A', borderRadius: '12px', padding: '16px',
  fontSize: '17px', fontFamily: 'Nunito, sans-serif', fontWeight: 600,
  width: '100%', outline: 'none', WebkitAppearance: 'none', appearance: 'none',
  boxSizing: 'border-box', minHeight: '54px',
}

// ── STEP 0 ─────────────────────────────────────────────────────────
function StepSceltaMetodo({ onQR, onBack }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '28px 24px 24px', background: '#FFF8F0', boxSizing: 'border-box', overflow: 'hidden' }}>
      <div style={{ flexShrink: 0, marginBottom: '18px' }}>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 700, color: '#1A9E8F', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '6px' }}>PagoPA · Pagamento</p>
        <JourneyMap step={0} />
        <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '24px', fontWeight: 900, color: '#1A1A1A', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: '8px' }}>Paga un avviso</h1>
        <p style={{ fontSize: '15px', color: '#5A5755', lineHeight: 1.6, fontWeight: 600 }}>Come preferisci inserire i dati?</p>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <button data-highlight="qr" onClick={onQR} style={{ display: 'flex', alignItems: 'center', gap: '18px', padding: '20px 18px', borderRadius: '18px', border: '2.5px solid #1A9E8F', background: '#F0FDFB', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', textAlign: 'left', width: '100%', boxShadow: '0 2px 12px rgba(26,158,143,0.12)', minHeight: '84px', flexShrink: 0 }}>
          <div style={{ width: '54px', height: '54px', borderRadius: '15px', background: '#E0F5F3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <QrCode size={30} color="#1A9E8F" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '17px', fontWeight: 800, color: '#1A1A1A', lineHeight: 1.2 }}>Inquadra il codice QR</span>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#1A9E8F', background: '#E0F5F3', padding: '2px 7px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.4px', whiteSpace: 'nowrap' }}>Consigliato</span>
            </div>
            <span style={{ fontSize: '14px', color: '#6B7280', display: 'block', fontWeight: 600 }}>Usa la fotocamera sul bollettino</span>
          </div>
          <ChevronRight size={22} color="#1A9E8F" style={{ flexShrink: 0 }} />
        </button>
        <button style={{ display: 'flex', alignItems: 'center', gap: '18px', padding: '20px 18px', borderRadius: '18px', border: '2px solid #E0E0E0', background: 'white', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', textAlign: 'left', width: '100%', minHeight: '84px', flexShrink: 0 }}>
          <div style={{ width: '54px', height: '54px', borderRadius: '15px', background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Keyboard size={28} color="#9CA3AF" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: '17px', fontWeight: 800, color: '#1A1A1A', display: 'block', lineHeight: 1.2, marginBottom: '3px' }}>Digita il codice</span>
            <span style={{ fontSize: '14px', color: '#6B7280', display: 'block', fontWeight: 600 }}>Inserisci manualmente i numeri</span>
          </div>
          <ChevronRight size={22} color="#C0C0C0" style={{ flexShrink: 0 }} />
        </button>
      </div>
      <div style={{ flexShrink: 0, paddingTop: '18px' }}>
        <button onClick={onBack} style={{ padding: '15px 20px', borderRadius: '14px', border: '2px solid #E0E0E0', background: 'white', fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 700, color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={17} /> Torna alla schermata principale
        </button>
      </div>
    </div>
  )
}

// ── STEP 1 ─────────────────────────────────────────────────────────
function StepInquadraQR({ onNext, onBack }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px 24px 20px', background: '#FFF8F0', boxSizing: 'border-box', overflow: 'hidden' }}>
      <div style={{ flexShrink: 0, marginBottom: '12px' }}>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 700, color: '#1A9E8F', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '4px' }}>PagoPA · Pagamento</p>
        <JourneyMap step={1} />
        <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '20px', fontWeight: 900, color: '#1A1A1A', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: '4px' }}>Inquadra il codice QR</h1>
        <p style={{ fontSize: '13px', color: '#5A5755', lineHeight: 1.5, fontWeight: 600 }}>Tieni il bollettino davanti alla fotocamera</p>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div data-highlight="scanner" style={{ width: '100%', maxWidth: '252px', aspectRatio: '1 / 1', maxHeight: '100%', borderRadius: '20px', background: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}>
          <div style={{ position: 'absolute', top: '18px', left: '18px', width: '36px', height: '36px', borderTop: '4px solid #1A9E8F', borderLeft: '4px solid #1A9E8F', borderRadius: '4px 0 0 0' }} />
          <div style={{ position: 'absolute', top: '18px', right: '18px', width: '36px', height: '36px', borderTop: '4px solid #1A9E8F', borderRight: '4px solid #1A9E8F', borderRadius: '0 4px 0 0' }} />
          <div style={{ position: 'absolute', bottom: '18px', left: '18px', width: '36px', height: '36px', borderBottom: '4px solid #1A9E8F', borderLeft: '4px solid #1A9E8F', borderRadius: '0 0 0 4px' }} />
          <div style={{ position: 'absolute', bottom: '18px', right: '18px', width: '36px', height: '36px', borderBottom: '4px solid #1A9E8F', borderRight: '4px solid #1A9E8F', borderRadius: '0 0 4px 0' }} />
          <QrCode size={96} color="white" opacity={0.6} />
          <style>{`@keyframes scan{0%{top:28px}100%{top:calc(100% - 28px)}}`}</style>
          <div style={{ position: 'absolute', left: '18px', right: '18px', height: '2px', background: 'rgba(26,158,143,0.85)', boxShadow: '0 0 8px #1A9E8F', animation: 'scan 1.8s ease-in-out infinite alternate' }} />
        </div>
      </div>
      <div style={{ flexShrink: 0, display: 'flex', gap: '10px', marginTop: '18px' }}>
        <button onClick={onBack} style={{ flex: 1, padding: '16px 12px', borderRadius: '14px', border: '2px solid #E0E0E0', background: 'white', fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 700, color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', minHeight: '58px' }}>
          <ArrowLeft size={17} /> Indietro
        </button>
        <button onClick={onNext} style={{ flex: 2, padding: '16px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #1A9E8F 0%, #147A6E 100%)', fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 800, color: 'white', cursor: 'pointer', boxShadow: '0 4px 16px rgba(26,158,143,0.35)', minHeight: '58px' }}>
          Scansione riuscita →
        </button>
      </div>
    </div>
  )
}

// ── STEP 2 ─────────────────────────────────────────────────────────
function StepDatiPagamento({ onBack, onNext }) {
  const rows = [
    { icon: <Building2 size={20} color="#1A9E8F" />, label: 'Ente Creditore', value: 'ASL VERCELLI' },
    { icon: <FileText size={20} color="#1A9E8F" />, label: 'Oggetto', value: 'Ticket Sanitario – Visita' },
    { icon: <DollarSign size={20} color="#1A9E8F" />, label: 'Importo', value: '35,00 €' },
    { icon: <Hash size={20} color="#1A9E8F" />, label: 'Codice Avviso', value: '3020 0001 2219 4962' },
    { icon: <CreditCard size={20} color="#1A9E8F" />, label: 'Codice Fiscale Ente', value: '01020600123' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '28px 24px 24px', background: '#FFF8F0', boxSizing: 'border-box', overflow: 'hidden' }}>
      <div style={{ flexShrink: 0, marginBottom: '14px' }}>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 700, color: '#1A9E8F', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '6px' }}>PagoPA · Pagamento</p>
        <JourneyMap step={2} />
        <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '24px', fontWeight: 900, color: '#1A1A1A', letterSpacing: '-0.5px', lineHeight: 1.2 }}>Dati del pagamento</h1>
      </div>
      <div style={{ flexShrink: 0, background: '#FFF9F0', border: '1.5px solid #FFE0B0', borderRadius: '12px', padding: '10px 14px', marginBottom: '12px' }}>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 600, color: '#B07000', margin: 0, lineHeight: 1.5, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={14} color="#B07000" /> Controlla che questi dati corrispondano al tuo bollettino.
        </p>
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {rows.map((row, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '13px 0', borderBottom: '1px solid #EEECEA', flexShrink: 0 }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '11px', background: '#E0F5F3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{row.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '2px' }}>{row.label}</span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#1A1A1A', fontFamily: 'Nunito, sans-serif' }}>{row.value}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ flexShrink: 0, display: 'flex', gap: '10px', marginTop: '16px' }}>
        <button onClick={onBack} style={{ flex: 1, padding: '16px 12px', borderRadius: '14px', border: '2px solid #E0E0E0', background: 'white', fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 700, color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', minHeight: '58px' }}>
          <ArrowLeft size={17} /> Indietro
        </button>
        <button data-highlight="cta" onClick={onNext} style={{ flex: 2, padding: '16px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #1A9E8F 0%, #147A6E 100%)', fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 800, color: 'white', cursor: 'pointer', boxShadow: '0 4px 16px rgba(26,158,143,0.35)', minHeight: '58px' }}>
          Vai al pagamento →
        </button>
      </div>
    </div>
  )
}

// ── STEP 3-5: EMAIL ────────────────────────────────────────────────
const isValidEmail = val => val.includes('@') && val.includes('.') && val.length > 5

const scrollOnFocus = (e) => {
  const el = e.currentTarget
  setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 380)
}

function StepInserisciEmail({ onBack, onNext, onStepChange, onEmailChange, isReplica }) {
  const { state, setState: setAppState } = useApp()
  const email = state.pagopaForm?.email || ''
  const emailConfirm = state.pagopaForm?.emailConfirm || ''
  const setEmail = (v) => setAppState(s => ({ ...s, pagopaForm: { ...s.pagopaForm, email: v } }))
  const setEmailConfirm = (v) => setAppState(s => ({ ...s, pagopaForm: { ...s.pagopaForm, emailConfirm: v } }))
  const [isFocused, setIsFocused] = useState(false)
  const [isConfirmFocused, setIsConfirmFocused] = useState(false)
  const [email1Touched, setEmail1Touched] = useState(false)
  const [confirmTouched, setConfirmTouched] = useState(false)

  const isValid = isValidEmail(email) && emailConfirm === email
  const email1Error = email1Touched && !isValidEmail(email)
  const confirmError = confirmTouched && emailConfirm !== email

  useEffect(() => {
    if (isReplica) return
    setAppState(s => ({ ...s, buttonState: { ...s.buttonState, pagopaEmailReady: isValid } }))
  }, [isValid, isReplica, setAppState])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '28px 24px 24px', background: '#FFF8F0', boxSizing: 'border-box', overflow: 'hidden' }}>
      <style>{`input::placeholder { color: #B0ADA8; font-weight: 400; }`}</style>
      <div style={{ flexShrink: 0, marginBottom: '20px' }}>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 700, color: '#1A9E8F', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '6px' }}>PagoPA · Pagamento</p>
        <JourneyMap step={3} />
        <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '24px', fontWeight: 900, color: '#1A1A1A', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: '6px' }}>La tua email</h1>
        <p style={{ fontSize: '15px', color: '#5A5755', lineHeight: 1.6, fontWeight: 600 }}>Riceverai qui la ricevuta di pagamento</p>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          {fieldLabel('Indirizzo email')}
          <input
            data-highlight="email" type="email" inputMode="email" placeholder="mario.rossi@email.it"
            value={email}
            onChange={e => { setEmail(e.target.value); onEmailChange?.(e.target.value); onStepChange?.(3) }}
            onFocus={(e) => { setIsFocused(true); scrollOnFocus(e) }}
            onBlur={() => { setIsFocused(false); setEmail1Touched(true); if (isValidEmail(email)) onStepChange?.(4) }}
            style={{ ...inputBase, border: isFocused ? '2px solid #1A9E8F' : email1Error ? '2px solid #C0392B' : '2px solid #D9D6D1' }}
          />
          {email1Error
            ? <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 700, color: '#C0392B', marginTop: '6px', background: '#FFF2F2', borderRadius: '8px', padding: '7px 11px', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertTriangle size={14} color="#C0392B" />Scrivi un indirizzo email valido (es: nome@email.it)</p>
            : fieldHelper('Esempio: mario.rossi@email.it')
          }
        </div>
        <div>
          {fieldLabel('Ripeti la stessa email')}
          <input
            data-highlight="email-confirm" type="email" inputMode="email" placeholder="Riscrivi la tua email"
            value={emailConfirm}
            onChange={e => {
              const val = e.target.value
              setEmailConfirm(val); setConfirmTouched(true)
              if (isValidEmail(email) && val === email) onStepChange?.(5)
              else if (isValidEmail(email)) onStepChange?.(4)
            }}
            onFocus={(e) => { setIsConfirmFocused(true); scrollOnFocus(e) }}
            onBlur={() => setIsConfirmFocused(false)}
            style={{ ...inputBase, border: isConfirmFocused ? '2px solid #1A9E8F' : confirmError ? '2px solid #C0392B' : '2px solid #D9D6D1' }}
          />
          {confirmError
            ? <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 700, color: '#C0392B', marginTop: '6px', background: '#FFF2F2', borderRadius: '8px', padding: '7px 11px', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertTriangle size={14} color="#C0392B" />Le due email non coincidono. Ricontrolla.</p>
            : fieldHelper('Deve essere identica a quella sopra')
          }
        </div>
      </div>
      <div style={{ flexShrink: 0, display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '18px' }}>
        <button onClick={onBack} style={{ flex: 1, padding: '16px 12px', borderRadius: '14px', border: '2px solid #E0E0E0', background: 'white', fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 700, color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', minHeight: '58px' }}>
          <ArrowLeft size={17} /> Indietro
        </button>
        <button
          data-highlight="continua"
          onClick={isValid ? () => { setAppState(s => ({ ...s, email })); onNext?.() } : undefined}
          style={{ flex: 2, padding: '16px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #1A9E8F 0%, #147A6E 100%)', fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 800, color: 'white', boxShadow: isValid ? '0 4px 16px rgba(26,158,143,0.35)' : 'none', opacity: isValid ? 1 : 0.45, cursor: isValid ? 'pointer' : 'not-allowed', minHeight: '58px' }}
        >
          Continua →
        </button>
      </div>
    </div>
  )
}

// ── STEP 6-7: METODO PAGAMENTO ─────────────────────────────────────
const paymentMethods = [
  { id: 'apple',      label: 'Apple Pay / Google Pay',   icon: 'G',  iconColor: '#4285F4', iconBg: '#E8F0FE' },
  { id: 'bancomat',   label: 'BANCOMAT Pay',              icon: 'B',  iconColor: '#003087', iconBg: '#E8EEF7' },
  { id: 'bancoposta', label: 'Conto BancoPosta',          icon: 'BP', iconColor: '#FFCC00', iconBg: '#FFF8DC', labelColor: '#333' },
  { id: 'satispay',   label: 'Satispay',                  icon: 'S',  iconColor: '#FF3B30', iconBg: '#FFE8E7' },
  { id: 'paypal',     label: 'PayPal',                    icon: 'PP', iconColor: '#003087', iconBg: '#E8EEF7' },
  { id: 'postepay',   label: 'PostePay',                  icon: 'PT', iconColor: '#009B3A', iconBg: '#E6F4EC' },
  { id: 'intesa',     label: 'Conto Intesa Sanpaolo',     icon: 'IS', iconColor: '#006B3F', iconBg: '#E6F2EE' },
  { id: 'klarna',     label: 'Klarna',                    icon: 'K',  iconColor: '#FFB3C7', iconBg: '#FFF0F5', labelColor: '#333' },
  { id: 'carta',      label: 'Carta di debito o credito', icon: null, iconColor: '#1A9E8F', iconBg: '#E0F5F3' },
]

function StepSceltaPagamento({ onBack, onNext, onScrollDetected, onListScroll, isReplica, scrollTop = 0 }) {
  const listRef = useRef(null)
  const cartaRef = useRef(null)
  const onScrollDetectedRef = useRef(onScrollDetected)
  useEffect(() => { onScrollDetectedRef.current = onScrollDetected }, [onScrollDetected])

  useEffect(() => {
    if (isReplica || !cartaRef.current || !listRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onScrollDetectedRef.current?.() },
      { root: listRef.current, threshold: 0.3 }
    )
    observer.observe(cartaRef.current)
    return () => observer.disconnect()
  }, [isReplica])

  const listItems = paymentMethods.map(m => {
    const isCarta = m.id === 'carta'
    return (
      <div key={m.id} ref={isCarta && !isReplica ? cartaRef : null} data-highlight={isCarta ? 'carta-credito' : undefined}
        onClick={isCarta && !isReplica ? onNext : undefined}
        style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 14px', borderRadius: '16px', marginBottom: '8px', border: '1.5px solid #E8E8E8', background: 'white', cursor: isCarta && !isReplica ? 'pointer' : 'default', minHeight: '64px' }}>
        <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: m.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {isCarta ? (
            <svg width="26" height="20" viewBox="0 0 26 20" fill="none">
              <rect x="1" y="1" width="24" height="18" rx="3" stroke="#1A9E8F" strokeWidth="1.5" fill="none"/>
              <rect x="1" y="5" width="24" height="5" fill="#1A9E8F" opacity="0.7"/>
              <rect x="4" y="13" width="8" height="3" rx="1.5" fill="#1A9E8F"/>
            </svg>
          ) : (
            <span style={{ fontSize: '13px', fontWeight: 800, color: m.iconColor }}>{m.icon}</span>
          )}
        </div>
        <span style={{ fontSize: '15px', fontWeight: 700, color: m.labelColor || '#1A1A1A', fontFamily: 'Nunito, sans-serif' }}>{m.label}</span>
      </div>
    )
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '28px 24px 24px', background: '#FFF8F0' }}>
      <div style={{ marginBottom: '14px' }}>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 700, color: '#1A9E8F', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '6px' }}>PagoPA · Pagamento</p>
        <JourneyMap step={6} />
        <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '24px', fontWeight: 900, color: '#1A1A1A', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: '4px' }}>Come vuoi<br />pagare?</h1>
        <p style={{ fontSize: '14px', color: '#5A5755', lineHeight: 1.6, fontWeight: 600 }}>Scorri e scegli il metodo di pagamento</p>
      </div>
      {isReplica ? (
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{ transform: `translateY(-${scrollTop}px)` }}>{listItems}</div>
        </div>
      ) : (
        <div ref={listRef} data-highlight="payment-list" onScroll={e => onListScroll?.(e.target.scrollTop)} style={{ flex: 1, overflowY: 'auto', paddingRight: '2px' }}>
          {listItems}
        </div>
      )}
      <div style={{ paddingTop: '10px', flexShrink: 0 }}>
        <button onClick={onBack} style={{ padding: '15px 20px', borderRadius: '14px', border: '2px solid #E0E0E0', background: 'white', fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 700, color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', minHeight: '58px' }}>
          <ArrowLeft size={17} /> Indietro
        </button>
      </div>
    </div>
  )
}

// ── STEP 8-12: DATI CARTA ──────────────────────────────────────────
function StepDatiCarta({ onBack, onNext, onFieldChange, onCardLast4Change, isReplica }) {
  const { state, setState } = useApp()
  const cardNumber = state.pagopaForm?.cardNumber || ''
  const expiry = state.pagopaForm?.expiry || ''
  const cvv = state.pagopaForm?.cvv || ''
  const name = state.pagopaForm?.cardName || ''
  const setCardNumber = (v) => setState(s => ({ ...s, pagopaForm: { ...s.pagopaForm, cardNumber: v } }))
  const setExpiry = (v) => setState(s => ({ ...s, pagopaForm: { ...s.pagopaForm, expiry: v } }))
  const setCvv = (v) => setState(s => ({ ...s, pagopaForm: { ...s.pagopaForm, cvv: v } }))
  const setName = (v) => setState(s => ({ ...s, pagopaForm: { ...s.pagopaForm, cardName: v } }))
  const [activeField, setActiveField] = useState(null)

  const isValid = cardNumber.length === 19 && expiry.length === 5 && cvv.length === 3 && name.trim().length >= 2

  useEffect(() => { if (!isReplica && isValid) onFieldChange?.('continua') }, [isValid, isReplica])

  useEffect(() => {
    if (isReplica) return
    setState(s => ({ ...s, buttonState: { ...s.buttonState, pagopaCardReady: isValid } }))
  }, [isValid, isReplica, setState])

  const handleCardNumber = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 16)
    const formatted = digits.replace(/(.{4})/g, '$1 ').trim()
    setCardNumber(formatted)
    if (digits.length === 16) onCardLast4Change?.(digits.slice(-4))
  }
  const handleExpiry = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4)
    setExpiry(digits.length >= 3 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits)
  }
  const handleFocus = (field, e) => { setActiveField(field); onFieldChange?.(field); if (e) scrollOnFocus(e) }
  const border = (field) => ({ border: activeField === field ? '2px solid #1A9E8F' : '2px solid #D9D6D1' })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '28px 24px 24px', background: '#FFF8F0', boxSizing: 'border-box', overflow: 'hidden' }}>
      <style>{`input::placeholder { color: #B0ADA8; font-weight: 400; }`}</style>
      <div style={{ flexShrink: 0 }}>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 700, color: '#1A9E8F', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '6px' }}>PagoPA · Pagamento</p>
        <JourneyMap step={8} />
        <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '22px', fontWeight: 900, color: '#1A1A1A', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: '16px' }}>Dati della carta</h1>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          {fieldLabel('Numero carta (16 cifre sul fronte)')}
          <input data-highlight="card-number" inputMode="numeric" pattern="[0-9]*" placeholder="0000 0000 0000 0000" value={cardNumber} onChange={handleCardNumber} onFocus={(e) => handleFocus('number', e)} onBlur={() => setActiveField(null)} style={{ ...inputBase, ...border('number'), width: '100%' }} />
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {fieldLabel('Scadenza (sul fronte)')}
            <input data-highlight="card-expiry" inputMode="numeric" pattern="[0-9]*" placeholder="MM/AA" value={expiry} onChange={handleExpiry} onFocus={(e) => handleFocus('expiry', e)} onBlur={() => setActiveField(null)} style={{ ...inputBase, ...border('expiry'), width: '100%' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {fieldLabel('CVV (3 cifre retro)')}
            <input data-highlight="card-cvv" type="password" inputMode="numeric" pattern="[0-9]*" placeholder="···" maxLength={3} value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))} onFocus={(e) => handleFocus('cvv', e)} onBlur={() => setActiveField(null)} style={{ ...inputBase, ...border('cvv'), width: '100%' }} />
          </div>
        </div>
        <div>
          {fieldLabel('Nome del titolare (come sulla carta)')}
          <input data-highlight="card-name" type="text" inputMode="text" autoCapitalize="characters" placeholder="MARIO ROSSI" value={name} onChange={e => setName(e.target.value.toUpperCase())} onFocus={(e) => handleFocus('name', e)} onBlur={() => setActiveField(null)} style={{ ...inputBase, ...border('name'), width: '100%' }} />
        </div>
      </div>
      <div style={{ flexShrink: 0, display: 'flex', gap: '10px', paddingTop: '14px' }}>
        <button onClick={onBack} style={{ flex: 1, padding: '16px 12px', borderRadius: '14px', border: '2px solid #E0E0E0', background: 'white', fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 700, color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', minHeight: '58px' }}>
          <ArrowLeft size={17} /> Indietro
        </button>
        <button data-highlight="card-continua" onClick={isValid ? onNext : undefined} style={{ flex: 2, padding: '16px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #1A9E8F 0%, #147A6E 100%)', fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 800, color: 'white', opacity: isValid ? 1 : 0.45, cursor: isValid ? 'pointer' : 'not-allowed', boxShadow: isValid ? '0 4px 16px rgba(26,158,143,0.35)' : 'none', minHeight: '58px' }}>
          Continua →
        </button>
      </div>
    </div>
  )
}

// ── STEP 13 ────────────────────────────────────────────────────────
function StepConfermaPagemento({ onBack, onNext }) {
  const { state } = useApp()
  const email = state.email || '—'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '28px 24px 24px', background: '#FFF8F0', boxSizing: 'border-box', overflow: 'hidden' }}>
      <div style={{ flexShrink: 0, background: 'white', borderRadius: '20px', padding: '20px 22px', marginBottom: '14px', border: '2px solid #1A9E8F', boxShadow: '0 4px 20px rgba(26,158,143,0.12)' }}>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 700, color: '#1A9E8F', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Totale da pagare</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '38px', fontWeight: 900, color: '#1A1A1A', lineHeight: 1 }}>36,50</span>
          <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '22px', fontWeight: 800, color: '#1A1A1A' }}>€</span>
        </div>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 500, color: '#6B7280', margin: '6px 0 0', lineHeight: 1.4 }}>Di cui 1,50 € di commissione bancaria</p>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {[
          { icon: <CreditCard size={18} color="#6B7280" />, label: 'Metodo', value: 'Carta di credito (**** 3456)' },
          { icon: <Tag size={18} color="#6B7280" />, label: 'Ente creditore', value: 'ASL VERCELLI' },
        ].map((row, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '13px 0', borderBottom: '1px solid #EEECEA', justifyContent: 'center', textAlign: 'center', flexShrink: 0 }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{row.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '2px' }}>{row.label}</span>
              <span style={{ fontSize: '15px', fontWeight: 800, color: '#1A1A1A', fontFamily: 'Nunito, sans-serif' }}>{row.value}</span>
            </div>
          </div>
        ))}
        <div style={{ padding: '13px 0', borderBottom: '1px solid #EEECEA', textAlign: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>Ricevuta inviata a</span>
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#1A9E8F', fontFamily: 'Nunito, sans-serif', wordBreak: 'break-all' }}>{email}</span>
        </div>
      </div>
      <div style={{ flexShrink: 0, background: '#FFF9F0', border: '1.5px solid #FFE0B0', borderRadius: '12px', padding: '10px 14px', margin: '12px 0' }}>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 600, color: '#B07000', margin: 0, lineHeight: 1.5, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={14} color="#B07000" /> Dopo aver toccato PAGA il pagamento sarà definitivo.
        </p>
      </div>
      <div style={{ flexShrink: 0, display: 'flex', gap: '10px' }}>
        <button onClick={onBack} style={{ flex: 1, padding: '16px 12px', borderRadius: '14px', border: '2px solid #E0E0E0', background: 'white', fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 700, color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', minHeight: '58px' }}>
          <ArrowLeft size={17} /> Indietro
        </button>
        <button data-highlight="paga-btn" onClick={onNext} style={{ flex: 2, padding: '16px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #1A9E8F 0%, #147A6E 100%)', fontFamily: 'Nunito, sans-serif', fontSize: '16px', fontWeight: 900, color: 'white', cursor: 'pointer', boxShadow: '0 4px 16px rgba(26,158,143,0.35)', minHeight: '58px' }}>
          Paga 36,50 €
        </button>
      </div>
    </div>
  )
}

// ── STEP 14 ────────────────────────────────────────────────────────
function StepPagamentoEffettuato({ onDone }) {
  const { state } = useApp()
  const email = state.email || '—'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '28px 24px 24px', background: '#FFF8F0' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '120px', height: '120px', background: '#E0F5F3', border: '3px solid #1A9E8F', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '26px' }}>
          <Check size={56} color="#1A9E8F" strokeWidth={2} />
        </div>
        <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '32px', fontWeight: 900, color: '#1A1A1A', textAlign: 'center', lineHeight: 1.2, marginBottom: '14px' }}>Pagamento<br />Effettuato!</h1>
        <p style={{ fontSize: '18px', color: '#1A1A1A', fontWeight: 700, textAlign: 'center', fontFamily: 'Nunito, sans-serif', marginBottom: '10px' }}>Hai pagato 36,50 €</p>
        <p style={{ fontSize: '14px', color: '#6B7280', textAlign: 'center', fontFamily: 'Nunito, sans-serif', fontWeight: 500, lineHeight: 1.6 }}>
          La ricevuta è stata inviata a:<br />
          <strong style={{ color: '#1A9E8F', fontSize: '15px' }}>{email}</strong>
        </p>
      </div>
      <button onClick={onDone} style={{ width: '100%', padding: '18px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #1A9E8F 0%, #147A6E 100%)', fontFamily: 'Nunito, sans-serif', fontSize: '16px', fontWeight: 800, color: 'white', cursor: 'pointer', boxShadow: '0 4px 16px rgba(26,158,143,0.35)', minHeight: '60px' }}>
        Torna alla schermata principale
      </button>
    </div>
  )
}

// ── SCREEN PRINCIPALE ──────────────────────────────────────────────
export default function PagoPA() {
  const [step, setStep] = useState(0)
  const [listScrollTop, setListScrollTop] = useState(0)
  const [pendingEmail, setPendingEmail] = useState('')
  const [cardLast4, setCardLast4] = useState('')
  const { state, setState } = useApp()
  const rightPanelRef = useRef(null)
  const leftPanelRef = useRef(null)
  const listScrollTopRef = useRef(0)

  const zoom = useFontZoom()
  const theme = useTheme()

  const goHome = () => setState(s => ({ ...s, currentScreen: 'home', currentStep: 0 }))
  const disconnect = () => setState(s => ({ ...s, currentScreen: 'pairing', paired: false, currentStep: 0 }))
  const currentEmail = pendingEmail || state.email || ''

  const rightPanelContent = () => {
    if (step === 0) return <StepSceltaMetodo onQR={() => {}} onBack={() => {}} />
    if (step === 1) return <StepInquadraQR onNext={() => {}} onBack={() => {}} />
    if (step === 2) return <StepDatiPagamento onBack={() => {}} onNext={() => {}} />
    if (step >= 3 && step <= 5) return <StepInserisciEmail isReplica={true} onBack={() => {}} onNext={() => {}} onStepChange={() => {}} onEmailChange={() => {}} />
    if (step >= 6 && step <= 7) return <StepSceltaPagamento isReplica={true} scrollTop={listScrollTop} onBack={() => {}} onNext={() => {}} onScrollDetected={() => {}} />
    if (step >= 8 && step <= 12) return <StepDatiCarta isReplica={true} onBack={() => {}} onNext={() => {}} onFieldChange={() => {}} onCardLast4Change={() => {}} />
    if (step === 13) return <StepConfermaPagemento onBack={() => {}} onNext={() => {}} />
    if (step === 14) return <StepPagamentoEffettuato onDone={() => {}} />
  }

  const rightPanelInteractive = () => {
    if (step === 0) return <StepSceltaMetodo onQR={() => setStep(1)} onBack={goHome} />
    if (step === 1) return <StepInquadraQR onNext={() => setStep(2)} onBack={() => setStep(0)} />
    if (step === 2) return <StepDatiPagamento onBack={() => setStep(1)} onNext={() => setStep(3)} />
    if (step >= 3 && step <= 5) return (
      <StepInserisciEmail
        onBack={() => setStep(2)} onNext={() => setStep(6)}
        onStepChange={i => setStep(i)}
        onEmailChange={v => setPendingEmail(v)}
      />
    )
    if (step >= 6 && step <= 7) return (
      <StepSceltaPagamento
        isReplica={false}
        onBack={() => { setListScrollTop(0); listScrollTopRef.current = 0; setStep(5) }}
        onNext={() => setStep(8)}
        onScrollDetected={() => { if (step === 6) setStep(7) }}
        onListScroll={st => { listScrollTopRef.current = st; setListScrollTop(st) }}
      />
    )
    if (step >= 8 && step <= 12) return (
      <StepDatiCarta
        onBack={() => setStep(7)} onNext={() => setStep(13)}
        onCardLast4Change={v => setCardLast4(v)}
        onFieldChange={field => {
          if (field === 'number') setStep(8)
          if (field === 'expiry') setStep(9)
          if (field === 'cvv') setStep(10)
          if (field === 'name') setStep(11)
          if (field === 'continua') setStep(12)
        }}
      />
    )
    if (step === 13) return <StepConfermaPagemento onBack={() => setStep(12)} onNext={() => setStep(14)} />
    if (step === 14) return <StepPagamentoEffettuato onDone={goHome} />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '80px', height: '820px' }}>
      <PhoneFrame>
        <PanelLeft
          step={step} rightPanelContent={rightPanelContent()} rightPanelRef={rightPanelRef}
          showGesture={step === 6}
          overrideHighlightZone={step === 6 ? null : undefined}
          leftPanelRef={leftPanelRef}
          forceTop={step === 6}
          email={currentEmail}
          cardLast4={cardLast4}
          scrollVersion={listScrollTop}
        />
      </PhoneFrame>
      <TotemFrame>
        <div ref={rightPanelRef} style={{ width: '390px', height: '740px', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
          <div onScroll={e => setListScrollTop(e.currentTarget.scrollTop)} style={{ width: `${390/zoom}px`, height: `${740/zoom}px`, zoom, filter: theme.isHC ? 'invert(1)' : 'none', overflowY: 'auto', overflowX: 'hidden' }}>
            {rightPanelInteractive()}
          </div>
          <ExitButton onClick={disconnect} />
        </div>
      </TotemFrame>
    </div>
  )
}
