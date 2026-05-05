import { useState, useEffect, useRef } from 'react'
import { CalendarDays, Stethoscope, Clock, User, MapPin, CheckCircle2, ArrowLeft, ChevronRight } from 'lucide-react'
import { useApp } from '../../context/AppContext'

// ── CONFIGURAZIONE STEP ────────────────────────────────────────────
const assistantSteps = [
  {
    tag: '👆 Fai così',
    text: (<>Scegli la <strong style={{ color: '#1A9E8F' }}>prestazione medica</strong> che ti serve tra quelle disponibili qui a fianco.</>),
    highlightSelector: '[data-highlight="prestazione"]',
  },
  {
    tag: '📅 Scegli quando',
    text: (<>Seleziona il <strong style={{ color: '#1A9E8F' }}>giorno e l'orario</strong> che preferisci tra quelli disponibili.</>),
    highlightSelector: '[data-highlight="calendario"]',
  },
  {
    tag: '✅ Controlla',
    text: (<>Verifica i dati della prenotazione.<br />Poi tocca <strong style={{ color: '#1A9E8F' }}>CONFERMA PRENOTAZIONE</strong> ↓</>),
    highlightSelector: '[data-highlight="conferma"]',
  },
]

// ── MASCOT ─────────────────────────────────────────────────────────
function Mascot() {
  return (
    <svg
      style={{ width: '75px', height: '75px', filter: 'drop-shadow(0 4px 12px rgba(245,166,35,0.3))' }}
      viewBox="0 0 160 160" fill="none"
    >
      <ellipse cx="80" cy="148" rx="36" ry="8" fill="#D4A57A" opacity="0.22"/>
      <path d="M45 108 Q49 91 80 87 Q111 91 115 108 L115 150 Q115 153 111 153 L49 153 Q45 153 45 150 Z" fill="#1A9E8F"/>
      <path d="M68 87 L80 101 L92 87" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <rect x="72" y="79" width="16" height="13" rx="6" fill="#FBBF8C"/>
      <ellipse cx="80" cy="58" rx="29" ry="31" fill="#FBBF8C"/>
      <path d="M51 50 Q52 24 80 22 Q108 24 109 50" fill="#4A2C0A"/>
      <path d="M69 24 Q73 13 80 20" stroke="#4A2C0A" strokeWidth="5.5" strokeLinecap="round" fill="none"/>
      <path d="M80 20 Q88 11 90 22" stroke="#4A2C0A" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
      <ellipse cx="51" cy="59" rx="7" ry="9" fill="#FBBF8C"/>
      <ellipse cx="109" cy="59" rx="7" ry="9" fill="#FBBF8C"/>
      <ellipse cx="51" cy="59" rx="4" ry="6" fill="#F5A07A"/>
      <ellipse cx="109" cy="59" rx="4" ry="6" fill="#F5A07A"/>
      <path d="M62 42 Q68 38 74 41" stroke="#4A2C0A" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <path d="M86 41 Q92 38 98 42" stroke="#4A2C0A" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <ellipse cx="69" cy="53" rx="8" ry="9" fill="white"/>
      <ellipse cx="91" cy="53" rx="8" ry="9" fill="white"/>
      <ellipse cx="70" cy="54" rx="5" ry="5.5" fill="#2D6A4F"/>
      <ellipse cx="92" cy="54" rx="5" ry="5.5" fill="#2D6A4F"/>
      <ellipse cx="70.5" cy="54.5" rx="3" ry="3.5" fill="#1A1A1A"/>
      <ellipse cx="92.5" cy="54.5" rx="3" ry="3.5" fill="#1A1A1A"/>
      <circle cx="72" cy="52.5" r="1.4" fill="white"/>
      <circle cx="94" cy="52.5" r="1.4" fill="white"/>
      <path d="M77 64 Q80 68 83 64" stroke="#E8907A" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <path d="M68 74 Q80 84 92 74" stroke="#C0604A" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <ellipse cx="57" cy="70" rx="8" ry="5" fill="#F9A0A0" opacity="0.45"/>
      <ellipse cx="103" cy="70" rx="8" ry="5" fill="#F9A0A0" opacity="0.45"/>
      <path d="M45 108 Q33 118 35 131" stroke="#1A9E8F" strokeWidth="13" strokeLinecap="round"/>
      <path d="M115 108 Q127 118 125 131" stroke="#1A9E8F" strokeWidth="13" strokeLinecap="round"/>
      <ellipse cx="35" cy="132" rx="10" ry="9" fill="#FBBF8C"/>
      <ellipse cx="125" cy="132" rx="10" ry="9" fill="#FBBF8C"/>
      <path d="M131 127 L145 120" stroke="#FBBF8C" strokeWidth="6.5" strokeLinecap="round"/>
      <ellipse cx="145" cy="120" rx="4" ry="3" fill="#F5A07A" transform="rotate(-22 145 120)"/>
    </svg>
  )
}

// ── BUBBLE ─────────────────────────────────────────────────────────
function Bubble({ tag, text }) {
  return (
    <div style={{ position: 'relative', marginBottom: '8px' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '12px 14px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', border: '2px solid rgba(245,166,35,0.3)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'Nunito, sans-serif', fontSize: '9px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#D4720A', background: '#FFF0E0', borderRadius: '5px', padding: '2px 7px', marginBottom: '6px' }}>
          {tag}
        </div>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 600, lineHeight: 1.6, color: '#2D2D2D', margin: 0 }}>
          {text}
        </p>
      </div>
      <div style={{ position: 'absolute', top: '50%', left: '-10px', transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderRight: '10px solid rgba(245,166,35,0.3)' }} />
      <div style={{ position: 'absolute', top: '50%', left: '-7px', transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderRight: '8px solid white' }} />
    </div>
  )
}

// ── PANNELLO SINISTRO con overlay ──────────────────────────────────
function PanelLeft({ step, rightPanelContent, rightPanelRef }) {
  const { tag, text, highlightSelector } = assistantSteps[step]
  const [highlightZone, setHighlightZone] = useState(null)

  useEffect(() => {
    const calculate = () => {
      if (!highlightSelector || !rightPanelRef?.current) {
        setHighlightZone(null)
        return
      }
      const target = rightPanelRef.current.querySelector(highlightSelector)
      if (!target) { setHighlightZone(null); return }

      const targetRect = target.getBoundingClientRect()
      const panelRect = rightPanelRef.current.getBoundingClientRect()

      setHighlightZone({
        top: targetRect.top - panelRect.top,
        left: targetRect.left - panelRect.left,
        width: targetRect.width,
        height: targetRect.height,
      })
    }

    const timer = setTimeout(calculate, 50)
    const observer = new ResizeObserver(calculate)
    if (rightPanelRef?.current) observer.observe(rightPanelRef.current)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [highlightSelector, rightPanelRef])

  return (
    <div style={{ width: '390px', height: '740px', flexShrink: 0, position: 'relative', overflow: 'hidden', background: '#FFF8F0' }}>

      {/* Replica schermo destro — non interattiva, con blur globale */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', filter: 'blur(1.5px)' }}>
        {rightPanelContent}
      </div>

      {/* Overlay scuro su tutto */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', pointerEvents: 'none', zIndex: 1 }} />

      {/* Zona evidenziata: ritaglia l'overlay con box-shadow trick */}
      {highlightZone && (
        <>
          <div style={{
            position: 'absolute',
            top: highlightZone.top,
            left: highlightZone.left,
            width: highlightZone.width,
            height: highlightZone.height,
            zIndex: 2,
            pointerEvents: 'none',
            borderRadius: '16px',
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.45)',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              top: -highlightZone.top,
              left: -highlightZone.left,
              width: '390px',
              height: '740px',
              pointerEvents: 'none',
            }}>
              {rightPanelContent}
            </div>
          </div>

          {/* Bordo teal attorno alla zona */}
          <div style={{
            position: 'absolute',
            top: highlightZone.top - 3,
            left: highlightZone.left - 3,
            width: highlightZone.width + 6,
            height: highlightZone.height + 6,
            border: '2.5px solid #1A9E8F',
            borderRadius: '19px',
            pointerEvents: 'none',
            zIndex: 3,
            boxShadow: '0 0 16px rgba(26,158,143,0.6)',
          }} />
        </>
      )}

      {/* Avatar + Fumetto in basso */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        padding: '0 16px 12px',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: '10px',
      }}>
        <div style={{ flexShrink: 0 }}>
          <Mascot />
        </div>
        <div style={{ flex: 1, paddingBottom: '8px' }}>
          <Bubble tag={tag} text={text} />
        </div>
      </div>

    </div>
  )
}

// ── STEP 0: scelta prestazione ─────────────────────────────────────
const prestazioni = [
  { icon: <Stethoscope size={22} color="#1A9E8F" />, nome: 'Visita Cardiologica', codice: '89.7', attesa: '12 gg' },
  { icon: <Stethoscope size={22} color="#1A9E8F" />, nome: 'Visita Oculistica', codice: '95.02', attesa: '8 gg' },
  { icon: <Stethoscope size={22} color="#1A9E8F" />, nome: 'Visita Ortopedica', codice: '89.7-O', attesa: '20 gg' },
  { icon: <Stethoscope size={22} color="#1A9E8F" />, nome: 'Visita Dermatologica', codice: '89.7-D', attesa: '15 gg' },
]

function StepSceltaPrestazione({ onSelect, onBack }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '32px 28px 28px', background: '#FFF8F0' }}>
      <div style={{ marginBottom: '24px' }}>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 700, color: '#1A9E8F', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '6px' }}>CUP</p>
        <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '26px', fontWeight: 900, color: '#2D2D2D', letterSpacing: '-0.8px', lineHeight: 1.15, marginBottom: '8px' }}>Prenota una<br />visita medica</h1>
        <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.6, fontWeight: 600 }}>Scegli la prestazione di cui hai bisogno</p>
      </div>

      <div data-highlight="prestazione" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {prestazioni.map((p, i) => (
          <button
            key={i}
            onClick={() => onSelect(p)}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '14px', border: '2px solid #E8E8E8', background: 'white', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', textAlign: 'left', width: '100%', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}
          >
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#E0F5F3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {p.icon}
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '14px', fontWeight: 800, display: 'block', color: '#2D2D2D', lineHeight: 1.2 }}>{p.nome}</span>
              <span style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px', display: 'block', fontWeight: 600 }}>Cod. {p.codice} · Prima disponibile: {p.attesa}</span>
            </div>
            <ChevronRight size={16} color="#9CA3AF" />
          </button>
        ))}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
        <button onClick={onBack} style={{ padding: '14px', borderRadius: '14px', border: '2px solid #E8E8E8', background: 'white', fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: 700, color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <ArrowLeft size={16} />
        </button>
      </div>
    </div>
  )
}

// ── STEP 1: scelta data/ora ────────────────────────────────────────
const slotDisponibili = [
  { data: 'Lun 6 Mag', orari: ['09:00', '10:30', '14:00'] },
  { data: 'Mar 7 Mag', orari: ['08:30', '11:00'] },
  { data: 'Mer 8 Mag', orari: ['09:30', '15:30'] },
]

function StepSceltaData({ prestazione, onSelect, onBack }) {
  const [selectedSlot, setSelectedSlot] = useState(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '32px 28px 28px', background: '#FFF8F0' }}>
      <div style={{ marginBottom: '20px' }}>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 700, color: '#1A9E8F', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '6px' }}>Step 1</p>
        <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '26px', fontWeight: 900, color: '#2D2D2D', letterSpacing: '-0.8px', lineHeight: 1.15, marginBottom: '4px' }}>Scegli data<br />e orario</h1>
        <p style={{ fontSize: '12px', color: '#1A9E8F', fontWeight: 700 }}>{prestazione?.nome}</p>
      </div>

      <div data-highlight="calendario" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'hidden' }}>
        {slotDisponibili.map((giorno, gi) => (
          <div key={gi}>
            <p style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>{giorno.data}</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {giorno.orari.map((orario, oi) => {
                const isSelected = selectedSlot?.data === giorno.data && selectedSlot?.orario === orario
                return (
                  <button
                    key={oi}
                    onClick={() => setSelectedSlot({ data: giorno.data, orario })}
                    style={{
                      padding: '8px 16px', borderRadius: '10px',
                      border: isSelected ? '2px solid #1A9E8F' : '2px solid #E8E8E8',
                      background: isSelected ? '#E0F5F3' : 'white',
                      fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 800,
                      color: isSelected ? '#1A9E8F' : '#2D2D2D',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
                    }}
                  >
                    <Clock size={12} color={isSelected ? '#1A9E8F' : '#9CA3AF'} />
                    {orario}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button onClick={onBack} style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '2px solid #E8E8E8', background: 'white', fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: 700, color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <ArrowLeft size={16} />
        </button>
        <button
          onClick={() => selectedSlot && onSelect(selectedSlot)}
          style={{ flex: 2, padding: '14px', borderRadius: '14px', border: 'none', background: selectedSlot ? 'linear-gradient(135deg, #1A9E8F 0%, #147A6E 100%)' : '#E8E8E8', fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: 800, color: selectedSlot ? 'white' : '#9CA3AF', cursor: selectedSlot ? 'pointer' : 'default', boxShadow: selectedSlot ? '0 4px 16px rgba(26,158,143,0.3)' : 'none' }}
        >
          Avanti →
        </button>
      </div>
    </div>
  )
}

// ── STEP 2: riepilogo e conferma ───────────────────────────────────
function StepRiepilogo({ prestazione, slot, onBack, onConfirm }) {
  const rows = [
    { icon: <Stethoscope size={18} color="#1A9E8F" />, label: 'Prestazione', value: prestazione?.nome || '—' },
    { icon: <MapPin size={18} color="#1A9E8F" />, label: 'Struttura', value: 'ASL VC – Presidio Ospedaliero' },
    { icon: <CalendarDays size={18} color="#1A9E8F" />, label: 'Data', value: slot?.data || '—' },
    { icon: <Clock size={18} color="#1A9E8F" />, label: 'Orario', value: slot?.orario || '—' },
    { icon: <User size={18} color="#1A9E8F" />, label: 'Medico', value: 'Primo disponibile' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '32px 28px 28px', background: '#FFF8F0' }}>
      <div style={{ marginBottom: '20px' }}>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 700, color: '#1A9E8F', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '6px' }}>Riepilogo</p>
        <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '26px', fontWeight: 900, color: '#2D2D2D', letterSpacing: '-0.8px', lineHeight: 1.15 }}>Conferma la<br />prenotazione</h1>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {rows.map((row, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 0', borderBottom: '1px solid #F0F0F0' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#E0F5F3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {row.icon}
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '10px', color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block' }}>{row.label}</span>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#2D2D2D', fontFamily: 'Nunito, sans-serif' }}>{row.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button onClick={onBack} style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '2px solid #E8E8E8', background: 'white', fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: 700, color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <ArrowLeft size={16} />
        </button>
        <button
          data-highlight="conferma"
          onClick={onConfirm}
          style={{ flex: 2, padding: '14px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #1A9E8F 0%, #147A6E 100%)', fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 800, color: 'white', cursor: 'pointer', boxShadow: '0 4px 16px rgba(26,158,143,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
        >
          <CheckCircle2 size={16} />
          Conferma prenotazione
        </button>
      </div>
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

  const goHome = () => setState(s => ({ ...s, currentScreen: 'home', currentStep: 0 }))

  const rightPanelContent = () => {
    if (step === 0) return <StepSceltaPrestazione onSelect={() => {}} onBack={() => {}} />
    if (step === 1) return <StepSceltaData prestazione={prestazione} onSelect={() => {}} onBack={() => {}} />
    if (step === 2) return <StepRiepilogo prestazione={prestazione} slot={slot} onBack={() => {}} onConfirm={() => {}} />
  }

  const rightPanelInteractive = () => {
    if (step === 0) return (
      <StepSceltaPrestazione
        onSelect={p => { setPrestazione(p); setStep(1) }}
        onBack={goHome}
      />
    )
    if (step === 1) return (
      <StepSceltaData
        prestazione={prestazione}
        onSelect={s => { setSlot(s); setStep(2) }}
        onBack={() => setStep(0)}
      />
    )
    if (step === 2) return (
      <StepRiepilogo
        prestazione={prestazione}
        slot={slot}
        onBack={() => setStep(1)}
        onConfirm={() => alert('Prenotazione confermata!')}
      />
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '740px' }}>

      {/* Pannello sinistro: replica con overlay */}
      <PanelLeft step={step} rightPanelContent={rightPanelContent()} rightPanelRef={rightPanelRef} />

      {/* Banda nera */}
      <div style={{ width: '20px', background: '#1A1A1A', flexShrink: 0 }} />

      {/* Pannello destro: interattivo */}
      <div ref={rightPanelRef} style={{ width: '390px', height: '740px', flexShrink: 0, overflow: 'hidden' }}>
        {rightPanelInteractive()}
      </div>

    </div>
  )
}
