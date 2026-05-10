import { useState, useEffect, useRef } from 'react'
import { CalendarDays, Stethoscope, Clock, User, MapPin, CheckCircle2, ArrowLeft, ChevronRight, Check } from 'lucide-react'
import { useApp, useTheme, useFontZoom } from '../../context/AppContext'
import { PhoneFrame, TotemFrame } from '../../components/layout/DeviceFrames'
import AccessibilityPanel from '../../components/phone/AccessibilityPanel'

// ── MECHANISM 1: JOURNEY MAP ───────────────────────────────────────
const JOURNEY = [
  { label: 'Visita' },
  { label: 'Orario' },
  { label: 'Conferma' },
]

// SVG icons for CUP journey stops
const JOURNEY_ICONS = [
  // Visita: medical cross/stethoscope
  <svg key="steth" width="22" height="22" viewBox="0 0 22 22" fill="none">
    <circle cx="11" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.8" fill="none"/>
    <line x1="11" y1="5.5" x2="11" y2="10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="8.5" y1="8" x2="13.5" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M11 13.5 Q11 18 16 18 Q19 18 19 15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    <circle cx="19" cy="14.5" r="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
  </svg>,
  // Orario: calendar
  <svg key="cal" width="22" height="22" viewBox="0 0 22 22" fill="none">
    <rect x="2" y="4" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.8" fill="none"/>
    <line x1="2" y1="9" x2="20" y2="9" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="7" y1="2" x2="7" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="15" y1="2" x2="15" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <rect x="6" y="12" width="3" height="3" rx="0.8" fill="currentColor" opacity="0.7"/>
    <rect x="11" y="12" width="3" height="3" rx="0.8" fill="currentColor" opacity="0.7"/>
  </svg>,
  // Conferma: checkmark circle
  <svg key="conf" width="22" height="22" viewBox="0 0 22 22" fill="none">
    <circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.8" fill="none"/>
    <path d="M7 11 L10 14 L15 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>,
]

function JourneyMap({ step }) {
  if (step >= 3) return null
  const current = Math.min(step, 2)
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
                flex: 1, height: '2px', marginBottom: '20px', minWidth: '8px',
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

// ── SHARED OVERLAY STYLES ─────────────────────────────────────────
const CARD_STYLE = {
  background: 'rgba(255,255,255,0.97)',
  borderRadius: '22px',
  boxShadow: '0 8px 36px rgba(0,0,0,0.30)',
  border: '2.5px solid rgba(26,158,143,0.42)',
  padding: '18px 20px',
}
const TAG_ORANGE = {
  display: 'inline-flex', alignItems: 'center',
  background: '#FFF0E0', borderRadius: '8px', padding: '5px 11px',
  fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 800,
  color: '#D4720A', letterSpacing: '0.4px', textTransform: 'uppercase',
  marginBottom: '10px',
}
const TAG_GREEN = {
  display: 'inline-flex', alignItems: 'center', gap: '5px',
  background: '#E0F5F3', borderRadius: '8px', padding: '5px 11px',
  fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 800,
  color: '#0D7A6D', letterSpacing: '0.4px', textTransform: 'uppercase',
  marginBottom: '10px',
}

// ── MASCOT (local) ─────────────────────────────────────────────────
function Mascot() {
  return (
    <svg style={{ width: '52px', flexShrink: 0, height: 'auto' }} viewBox="0 0 160 160" fill="none">
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

// ── MECHANISM 3: CALENDAR ANCHOR ──────────────────────────────────
function CalendarIllustration() {
  const days = Array.from({ length: 14 }, (_, i) => i + 1)
  const highlighted = [6, 7, 8]
  return (
    <svg viewBox="0 0 260 112" fill="none" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <rect x="2" y="2" width="180" height="108" rx="8" fill="white" stroke="#E0E0E0" strokeWidth="1.5"/>
      <rect x="2" y="2" width="180" height="28" rx="8" fill="#1A9E8F"/>
      <rect x="2" y="20" width="180" height="10" fill="#1A9E8F"/>
      <text x="91" y="19" textAnchor="middle" fontFamily="Nunito, sans-serif" fontSize="11" fontWeight="800" fill="white">Maggio 2026</text>
      <circle cx="45" cy="5" r="5" fill="#147A6E"/>
      <circle cx="137" cy="5" r="5" fill="#147A6E"/>
      {['L','M','M','G','V','S','D'].map((d, i) => (
        <text key={i} x={15 + i * 24} y="44" textAnchor="middle" fontFamily="Nunito, sans-serif" fontSize="8" fontWeight="700" fill="#9CA3AF">{d}</text>
      ))}
      {days.map((d, idx) => {
        const row = Math.floor(idx / 7)
        const col = idx % 7
        const isHL = highlighted.includes(d)
        const x = 15 + col * 24
        const y = 60 + row * 22
        return (
          <g key={d}>
            {isHL && <rect x={x - 9} y={y - 12} width="18" height="18" rx="5" fill="#E0F5F3"/>}
            <text x={x} y={y} textAnchor="middle" fontFamily="Nunito, sans-serif" fontSize="10" fontWeight={isHL ? 800 : 500} fill={isHL ? '#1A9E8F' : '#1A1A1A'}>{d}</text>
          </g>
        )
      })}
      <path d="M190 68 L208 68" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M204 63 L209 68 L204 73" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <rect x="211" y="55" width="46" height="26" rx="6" fill="#FFF0E0"/>
      <text x="234" y="67" textAnchor="middle" fontFamily="Nunito, sans-serif" fontSize="8" fontWeight="800" fill="#D4720A">Date</text>
      <text x="234" y="76" textAnchor="middle" fontFamily="Nunito, sans-serif" fontSize="8" fontWeight="700" fill="#D4720A">libere</text>
    </svg>
  )
}

function CalendarAnchorOverlay({ highlightZone }) {
  const atTop = !highlightZone || highlightZone.top > 350
  return (
    <div style={{ position: 'absolute', top: atTop ? 10 : 'auto', bottom: atTop ? 'auto' : 10, left: 10, right: 10, zIndex: 10 }}>
      <div style={CARD_STYLE}>
        <div style={TAG_ORANGE}>📅 Come scegliere</div>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 700, color: '#1A1A1A', margin: '0 0 12px', lineHeight: 1.6 }}>
          Tocca prima il <strong style={{ color: '#1A9E8F' }}>giorno</strong>, poi l'<strong style={{ color: '#1A9E8F' }}>orario</strong> che preferisci tra quelli disponibili.
        </p>
        <div style={{ borderRadius: '10px', overflow: 'hidden', background: '#F8F8F8', padding: '10px' }}>
          <CalendarIllustration />
        </div>
        <div style={{ height: '1px', background: 'rgba(0,0,0,0.08)', margin: '12px 0 10px' }} />
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 600, color: '#5A5755', lineHeight: 1.5, fontStyle: 'italic', margin: 0 }}>
          Puoi sempre tornare indietro. Non puoi fare danni!
        </p>
      </div>
    </div>
  )
}

// ── MECHANISM 2: MIRROR OVERLAY (step 2) ─────────────────────────
function MirrorOverlay({ prestazione, slot }) {
  return (
    <div style={{ position: 'absolute', top: 10, left: 10, right: 10, zIndex: 10 }}>
      <div style={CARD_STYLE}>
        <div style={TAG_GREEN}>
          <Check size={12} strokeWidth={3} />
          Prenotazione pronta!
        </div>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: 700, color: '#5A5755', margin: '0 0 12px', lineHeight: 1.5 }}>
          Stai prenotando:
        </p>
        {[
          { label: 'Visita', value: prestazione?.nome || '—' },
          { label: 'Giorno', value: slot?.data || '—' },
          { label: 'Orario', value: slot?.orario ? `Ore ${slot.orario}` : '—' },
        ].map((item, i) => (
          <div key={i} style={{ background: '#F0FDFB', border: '1.5px solid #A8DDD8', borderRadius: '12px', padding: '10px 14px', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '11px', fontWeight: 700, color: '#5A9E8F', display: 'block', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</span>
            <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '16px', fontWeight: 900, color: '#1A1A1A', lineHeight: 1.2, display: 'block' }}>{item.value}</span>
          </div>
        ))}
        <div style={{ height: '1px', background: 'rgba(0,0,0,0.08)', margin: '10px 0' }} />
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 700, color: '#1A1A1A', margin: 0, lineHeight: 1.5 }}>
          ➜ Controlla, poi tocca <strong style={{ color: '#1A9E8F' }}>CONFERMA</strong>
        </p>
      </div>
    </div>
  )
}

// ── LEFT PANEL ─────────────────────────────────────────────────────
const COACHING = {
  0: {
    tag: '👆 Cosa fare adesso',
    text: (<>Guarda a destra e tocca la <strong style={{ color: '#1A9E8F' }}>visita medica</strong> di cui hai bisogno.</>),
    highlightSelector: '[data-highlight="prestazione"]',
  },
  3: {
    tag: '🎉 Bravissimo!',
    text: (<>La prenotazione è stata registrata. Hai fatto tutto <strong style={{ color: '#1A9E8F' }}>correttamente!</strong></>),
    highlightSelector: null,
  },
}

function PanelLeft({ step, rightPanelContent, rightPanelRef, prestazione, slot }) {
  const theme = useTheme()
  const zoom = useFontZoom()
  const coaching = COACHING[step]
  const highlightSelector = coaching?.highlightSelector || null
  const [highlightZone, setHighlightZone] = useState(null)

  useEffect(() => {
    const calculate = () => {
      if (!highlightSelector || !rightPanelRef?.current) { setHighlightZone(null); return }
      const target = rightPanelRef.current.querySelector(highlightSelector)
      if (!target) { setHighlightZone(null); return }
      const targetRect = target.getBoundingClientRect()
      const panelRect = rightPanelRef.current.getBoundingClientRect()
      const outerScale = Math.min(window.innerWidth / 1180, window.innerHeight / 820)
      setHighlightZone({
        top: (targetRect.top - panelRect.top) / outerScale,
        left: (targetRect.left - panelRect.left) / outerScale,
        width: targetRect.width / outerScale,
        height: targetRect.height / outerScale,
      })
    }
    const timer = setTimeout(calculate, 50)
    const observer = new ResizeObserver(calculate)
    if (rightPanelRef?.current) observer.observe(rightPanelRef.current)
    return () => { clearTimeout(timer); observer.disconnect() }
  }, [highlightSelector, rightPanelRef])

  const cardAtTop = highlightZone && highlightZone.top > 350

  const renderOverlay = () => {
    if (step === 1) return <CalendarAnchorOverlay highlightZone={highlightZone} />
    if (step === 2) return <MirrorOverlay prestazione={prestazione} slot={slot} />
    if (!coaching) return null
    const atTop = cardAtTop
    return (
      <div style={{ position: 'absolute', top: atTop ? 10 : 'auto', bottom: atTop ? 'auto' : 10, left: 10, right: 10, zIndex: 10 }}>
        <div style={{ ...CARD_STYLE, zoom }}>
          <div style={TAG_ORANGE}>{coaching.tag}</div>
          <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '16px', fontWeight: 700, lineHeight: 1.72, color: '#1A1A1A', margin: '0 0 12px' }}>{coaching.text}</p>
          <div style={{ height: '1px', background: 'rgba(0,0,0,0.08)', marginBottom: '10px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Mascot />
            <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 600, color: '#5A5755', lineHeight: 1.5, fontStyle: 'italic', margin: 0, flex: 1 }}>
              Puoi sempre tornare indietro.<br />Non puoi fare danni!
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ width: '390px', height: '740px', flexShrink: 0, position: 'relative', overflow: 'hidden', background: theme.bg }}>
      {/* Blurred mirror of totem */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', filter: 'blur(1.5px)', overflow: 'hidden' }}>
        <div style={{ width: `${390/zoom}px`, height: `${740/zoom}px`, zoom, filter: theme.isHC ? 'invert(1)' : 'none' }}>
          {rightPanelContent}
        </div>
      </div>
      <div style={{ position: 'absolute', inset: 0, background: theme.isHC ? 'rgba(0,0,0,0.72)' : 'rgba(0,0,0,0.48)', pointerEvents: 'none', zIndex: 1 }} />
      {highlightZone && (
        <>
          <div style={{ position: 'absolute', top: highlightZone.top, left: highlightZone.left, width: highlightZone.width, height: highlightZone.height, zIndex: 2, pointerEvents: 'none', borderRadius: '16px', boxShadow: '0 0 0 9999px rgba(0,0,0,0.48)', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -(highlightZone.top / zoom), left: -(highlightZone.left / zoom), width: `${390/zoom}px`, height: `${740/zoom}px`, zoom, filter: theme.isHC ? 'invert(1)' : 'none', pointerEvents: 'none' }}>
              {rightPanelContent}
            </div>
          </div>
          <div style={{ position: 'absolute', top: highlightZone.top - 4, left: highlightZone.left - 4, width: highlightZone.width + 8, height: highlightZone.height + 8, border: `3px solid ${theme.primary}`, borderRadius: '20px', pointerEvents: 'none', zIndex: 3, boxShadow: `0 0 0 2px ${theme.primary}33, 0 0 20px ${theme.primary}CC` }} />
        </>
      )}

      {renderOverlay()}

      {/* Accessibility gear inside phone */}
      <AccessibilityPanel />
    </div>
  )
}

// ── STEP 0: SCELTA PRESTAZIONE ─────────────────────────────────────
const prestazioni = [
  { icon: <Stethoscope size={26} color="#1A9E8F" />, nome: 'Visita Cardiologica', codice: '89.7', attesa: '12 giorni' },
  { icon: <Stethoscope size={26} color="#1A9E8F" />, nome: 'Visita Oculistica', codice: '95.02', attesa: '8 giorni' },
  { icon: <Stethoscope size={26} color="#1A9E8F" />, nome: 'Visita Ortopedica', codice: '89.7-O', attesa: '20 giorni' },
  { icon: <Stethoscope size={26} color="#1A9E8F" />, nome: 'Visita Dermatologica', codice: '89.7-D', attesa: '15 giorni' },
]

function StepSceltaPrestazione({ onSelect, onBack }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '28px 24px 24px', background: '#FFF8F0' }}>
      <div style={{ marginBottom: '18px' }}>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 700, color: '#1A9E8F', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '6px' }}>CUP · Prenotazione</p>
        <JourneyMap step={0} />
        <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '24px', fontWeight: 900, color: '#1A1A1A', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: '6px' }}>Che visita<br />ti serve?</h1>
        <p style={{ fontSize: '15px', color: '#5A5755', lineHeight: 1.6, fontWeight: 600 }}>Tocca la prestazione di cui hai bisogno</p>
      </div>
      <div data-highlight="prestazione" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {prestazioni.map((p, i) => (
          <button key={i} onClick={() => onSelect(p)} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 18px', borderRadius: '16px', border: '2px solid #E0E0E0', background: 'white', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', textAlign: 'left', width: '100%', boxShadow: '0 1px 8px rgba(0,0,0,0.05)', minHeight: '76px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#E0F5F3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{p.icon}</div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '17px', fontWeight: 800, display: 'block', color: '#1A1A1A', lineHeight: 1.2, marginBottom: '3px' }}>{p.nome}</span>
              <span style={{ fontSize: '13px', color: '#6B7280', display: 'block', fontWeight: 600 }}>Prima disponibile: {p.attesa}</span>
            </div>
            <ChevronRight size={20} color="#C0C0C0" />
          </button>
        ))}
      </div>
      <div style={{ marginTop: 'auto', paddingTop: '18px' }}>
        <button onClick={onBack} style={{ padding: '15px 20px', borderRadius: '14px', border: '2px solid #E0E0E0', background: 'white', fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 700, color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={17} /> Torna alla schermata principale
        </button>
      </div>
    </div>
  )
}

// ── STEP 1: SCELTA DATA/ORA ────────────────────────────────────────
const slotDisponibili = [
  { data: 'Lunedì 6 Maggio', orari: ['09:00', '10:30', '14:00'] },
  { data: 'Martedì 7 Maggio', orari: ['08:30', '11:00'] },
  { data: 'Mercoledì 8 Maggio', orari: ['09:30', '15:30'] },
]

function StepSceltaData({ prestazione, onSelect, onBack }) {
  const [selectedSlot, setSelectedSlot] = useState(null)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '28px 24px 24px', background: '#FFF8F0' }}>
      <div style={{ marginBottom: '14px' }}>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 700, color: '#1A9E8F', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '6px' }}>CUP · Passo 2 di 3</p>
        <JourneyMap step={1} />
        <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '24px', fontWeight: 900, color: '#1A1A1A', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: '4px' }}>Scegli giorno<br />e orario</h1>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#E0F5F3', borderRadius: '10px', padding: '4px 10px' }}>
          <Stethoscope size={14} color="#1A9E8F" />
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#1A9E8F', fontFamily: 'Nunito, sans-serif' }}>{prestazione?.nome}</span>
        </div>
      </div>
      <div data-highlight="calendario" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
        {slotDisponibili.map((giorno, gi) => (
          <div key={gi}>
            <p style={{ fontSize: '14px', fontWeight: 800, color: '#6B7280', marginBottom: '8px', fontFamily: 'Nunito, sans-serif' }}>{giorno.data}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {giorno.orari.map((orario, oi) => {
                const isSelected = selectedSlot?.data === giorno.data && selectedSlot?.orario === orario
                return (
                  <button key={oi} onClick={() => setSelectedSlot({ data: giorno.data, orario })} style={{ padding: '16px 12px', borderRadius: '14px', border: isSelected ? '2.5px solid #1A9E8F' : '2px solid #E0E0E0', background: isSelected ? '#E0F5F3' : 'white', fontFamily: 'Nunito, sans-serif', fontSize: '17px', fontWeight: 800, color: isSelected ? '#1A9E8F' : '#1A1A1A', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', minHeight: '58px', boxShadow: isSelected ? '0 3px 12px rgba(26,158,143,0.22)' : '0 1px 4px rgba(0,0,0,0.04)' }}>
                    <Clock size={16} color={isSelected ? '#1A9E8F' : '#9CA3AF'} />
                    {orario}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
        <button onClick={onBack} style={{ flex: 1, padding: '16px 12px', borderRadius: '14px', border: '2px solid #E0E0E0', background: 'white', fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 700, color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', minHeight: '58px' }}>
          <ArrowLeft size={17} /> Indietro
        </button>
        <button onClick={() => selectedSlot && onSelect(selectedSlot)} style={{ flex: 2, padding: '16px', borderRadius: '14px', border: 'none', background: selectedSlot ? 'linear-gradient(135deg, #1A9E8F 0%, #147A6E 100%)' : '#E8E8E8', fontFamily: 'Nunito, sans-serif', fontSize: '16px', fontWeight: 800, color: selectedSlot ? 'white' : '#9CA3AF', cursor: selectedSlot ? 'pointer' : 'default', boxShadow: selectedSlot ? '0 4px 16px rgba(26,158,143,0.35)' : 'none', minHeight: '58px' }}>
          {selectedSlot ? 'Avanti →' : 'Seleziona un orario'}
        </button>
      </div>
    </div>
  )
}

// ── STEP 2: RIEPILOGO ──────────────────────────────────────────────
function StepRiepilogo({ prestazione, slot, onBack, onConfirm }) {
  const rows = [
    { icon: <Stethoscope size={20} color="#1A9E8F" />, label: 'Visita', value: prestazione?.nome || '—' },
    { icon: <MapPin size={20} color="#1A9E8F" />, label: 'Struttura', value: 'ASL VC – Presidio Ospedaliero' },
    { icon: <CalendarDays size={20} color="#1A9E8F" />, label: 'Data', value: slot?.data || '—' },
    { icon: <Clock size={20} color="#1A9E8F" />, label: 'Orario', value: slot?.orario ? `Ore ${slot.orario}` : '—' },
    { icon: <User size={20} color="#1A9E8F" />, label: 'Medico', value: 'Primo disponibile' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '28px 24px 24px', background: '#FFF8F0' }}>
      <div style={{ marginBottom: '14px' }}>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 700, color: '#1A9E8F', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '6px' }}>CUP · Passo 3 di 3</p>
        <JourneyMap step={2} />
        <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '24px', fontWeight: 900, color: '#1A1A1A', letterSpacing: '-0.5px', lineHeight: 1.2 }}>Controlla i dati<br />e conferma</h1>
      </div>
      <div style={{ background: '#FFF9F0', border: '1.5px solid #FFE0B0', borderRadius: '12px', padding: '10px 14px', marginBottom: '12px' }}>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 600, color: '#B07000', margin: 0, lineHeight: 1.5 }}>
          ⚠️ Leggi attentamente. Se qualcosa non va, usa il pulsante «Indietro».
        </p>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {rows.map((row, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '13px 0', borderBottom: '1px solid #EEECEA' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '11px', background: '#E0F5F3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{row.icon}</div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '2px' }}>{row.label}</span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#1A1A1A', fontFamily: 'Nunito, sans-serif' }}>{row.value}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
        <button onClick={onBack} style={{ flex: 1, padding: '16px 12px', borderRadius: '14px', border: '2px solid #E0E0E0', background: 'white', fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 700, color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', minHeight: '58px' }}>
          <ArrowLeft size={17} /> Indietro
        </button>
        <button data-highlight="conferma" onClick={onConfirm} style={{ flex: 2, padding: '16px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #1A9E8F 0%, #147A6E 100%)', fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 800, color: 'white', cursor: 'pointer', boxShadow: '0 4px 16px rgba(26,158,143,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', minHeight: '58px' }}>
          <CheckCircle2 size={18} /> Conferma prenotazione
        </button>
      </div>
    </div>
  )
}

// ── STEP 3: SUCCESSO ───────────────────────────────────────────────
function StepSuccessoPrenotazione({ prestazione, slot, onDone }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '28px 24px 24px', background: '#FFF8F0' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '116px', height: '116px', background: '#E0F5F3', border: '3px solid #1A9E8F', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
          <CheckCircle2 size={54} color="#1A9E8F" strokeWidth={1.8} />
        </div>
        <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '30px', fontWeight: 900, color: '#1A1A1A', textAlign: 'center', lineHeight: 1.2, marginBottom: '18px' }}>Prenotazione<br />Confermata!</h1>
        <div style={{ background: 'white', borderRadius: '18px', padding: '18px 20px', border: '2px solid #E0F5F3', width: '100%', marginBottom: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
          {[
            { icon: <Stethoscope size={18} color="#1A9E8F" />, value: prestazione?.nome },
            { icon: <CalendarDays size={18} color="#1A9E8F" />, value: slot?.data },
            { icon: <Clock size={18} color="#1A9E8F" />, value: `Ore ${slot?.orario}` },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: i < 2 ? '13px' : 0 }}>
              <div style={{ width: '36px', height: '36px', background: '#E0F5F3', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{row.icon}</div>
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#1A1A1A', fontFamily: 'Nunito, sans-serif' }}>{row.value}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '14px', color: '#6B7280', textAlign: 'center', fontFamily: 'Nunito, sans-serif', fontWeight: 500, lineHeight: 1.55 }}>
          La conferma è registrata nel sistema CUP.
        </p>
      </div>
      <button onClick={onDone} style={{ width: '100%', padding: '18px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #1A9E8F 0%, #147A6E 100%)', fontFamily: 'Nunito, sans-serif', fontSize: '16px', fontWeight: 800, color: 'white', cursor: 'pointer', boxShadow: '0 4px 16px rgba(26,158,143,0.35)', minHeight: '60px' }}>
        Torna alla schermata principale
      </button>
    </div>
  )
}

// ── SCREEN PRINCIPALE ──────────────────────────────────────────────
export default function CUP() {
  const [step, setStep] = useState(0)
  const [prestazione, setPrestazione] = useState(null)
  const [slot, setSlot] = useState(null)
  const { setState } = useApp()
  const rightPanelRef = useRef(null)
  const zoom = useFontZoom()
  const theme = useTheme()

  const goHome = () => setState(s => ({ ...s, currentScreen: 'home', currentStep: 0 }))
  const disconnect = () => setState(s => ({ ...s, currentScreen: 'pairing', paired: false, currentStep: 0 }))

  const rightPanelContent = () => {
    if (step === 0) return <StepSceltaPrestazione onSelect={() => {}} onBack={() => {}} />
    if (step === 1) return <StepSceltaData prestazione={prestazione} onSelect={() => {}} onBack={() => {}} />
    if (step === 2) return <StepRiepilogo prestazione={prestazione} slot={slot} onBack={() => {}} onConfirm={() => {}} />
    if (step === 3) return <StepSuccessoPrenotazione prestazione={prestazione} slot={slot} onDone={() => {}} />
  }

  const rightPanelInteractive = () => {
    if (step === 0) return <StepSceltaPrestazione onSelect={p => { setPrestazione(p); setStep(1) }} onBack={goHome} />
    if (step === 1) return <StepSceltaData prestazione={prestazione} onSelect={s => { setSlot(s); setStep(2) }} onBack={() => setStep(0)} />
    if (step === 2) return <StepRiepilogo prestazione={prestazione} slot={slot} onBack={() => setStep(1)} onConfirm={() => setStep(3)} />
    if (step === 3) return <StepSuccessoPrenotazione prestazione={prestazione} slot={slot} onDone={goHome} />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '40px', height: '820px' }}>
      <PhoneFrame>
        <PanelLeft
          step={step} rightPanelContent={rightPanelContent()}
          rightPanelRef={rightPanelRef} prestazione={prestazione} slot={slot}
        />
      </PhoneFrame>
      <TotemFrame>
        <div ref={rightPanelRef} style={{ width: '390px', height: '740px', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
          <div style={{ width: `${390/zoom}px`, height: `${740/zoom}px`, zoom, filter: theme.isHC ? 'invert(1)' : 'none', overflowY: 'auto', overflowX: 'hidden' }}>
            {rightPanelInteractive()}
          </div>
          <button
            onClick={disconnect}
            style={{
              position: 'absolute', top: 10, right: 10, zIndex: 200,
              background: theme.isHC ? 'rgba(255,215,0,0.2)' : 'rgba(0,0,0,0.35)',
              border: `1px solid ${theme.isHC ? 'rgba(255,215,0,0.5)' : 'rgba(255,255,255,0.2)'}`,
              borderRadius: '10px', padding: '5px 10px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '4px',
              fontFamily: 'Nunito, sans-serif', fontSize: '11px', fontWeight: 700,
              color: theme.isHC ? '#FFD700' : 'rgba(255,255,255,0.75)',
            }}
          >
            ⏻ Esci
          </button>
        </div>
      </TotemFrame>
    </div>
  )
}
