import { useState, useEffect, useRef } from 'react'
import { CalendarDays, Stethoscope, Clock, User, MapPin, CheckCircle2, ArrowLeft, ChevronRight } from 'lucide-react'
import { useApp } from '../../context/AppContext'

// ── STEP CONFIG ────────────────────────────────────────────────────
const assistantSteps = [
  {
    tag: '👆 Cosa fare adesso',
    text: (<>Guarda a destra e tocca la <strong style={{ color: '#1A9E8F' }}>visita medica</strong> di cui hai bisogno.</>),
    highlightSelector: '[data-highlight="prestazione"]',
  },
  {
    tag: '📅 Scegli quando',
    text: (<>Tocca il <strong style={{ color: '#1A9E8F' }}>giorno</strong>, poi l'<strong style={{ color: '#1A9E8F' }}>orario</strong> che preferisci tra quelli disponibili.</>),
    highlightSelector: '[data-highlight="calendario"]',
  },
  {
    tag: '✅ Quasi fatto!',
    text: (<>Leggi i dati qui a fianco. Se va tutto bene, tocca il pulsante verde <strong style={{ color: '#1A9E8F' }}>CONFERMA PRENOTAZIONE</strong>.</>),
    highlightSelector: '[data-highlight="conferma"]',
  },
  {
    tag: '🎉 Bravissimo!',
    text: (<>La prenotazione è stata registrata. Hai fatto tutto <strong style={{ color: '#1A9E8F' }}>correttamente!</strong></>),
    highlightSelector: null,
  },
]

const STEP_NAMES = ['Scegli la visita', 'Scegli data e ora', 'Conferma', '']

// ── STEP INDICATOR (right panel) ──────────────────────────────────
function StepIndicator({ step, total }) {
  return (
    <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', marginTop: '2px' }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{
          height: '5px', flex: 1, borderRadius: '3px',
          background: i < step ? '#A8DDD8' : i === step ? '#1A9E8F' : '#E8E8E8',
          transition: 'background 0.3s',
        }} />
      ))}
    </div>
  )
}

// ── MASCOT (for left panel coach card) ─────────────────────────────
function Mascot() {
  return (
    <svg
      style={{ width: '58px', flexShrink: 0, height: 'auto', filter: 'drop-shadow(0 3px 8px rgba(245,166,35,0.25))' }}
      viewBox="0 0 160 160" fill="none"
    >
      <ellipse cx="80" cy="148" rx="36" ry="8" fill="#D4A57A" opacity="0.18"/>
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

// ── LEFT PANEL with overlay + coach card ──────────────────────────
function PanelLeft({ step, rightPanelContent, rightPanelRef }) {
  const { tag, text, highlightSelector } = assistantSteps[step]
  const [highlightZone, setHighlightZone] = useState(null)

  useEffect(() => {
    const calculate = () => {
      if (!highlightSelector || !rightPanelRef?.current) { setHighlightZone(null); return }
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
    return () => { clearTimeout(timer); observer.disconnect() }
  }, [highlightSelector, rightPanelRef])

  const cardAtTop = highlightZone && highlightZone.top > 350

  return (
    <div style={{ width: '390px', height: '740px', flexShrink: 0, position: 'relative', overflow: 'hidden', background: '#FFF8F0' }}>

      {/* Blurred replica */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', filter: 'blur(1.5px)' }}>
        {rightPanelContent}
      </div>

      {/* Dark overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.48)', pointerEvents: 'none', zIndex: 1 }} />

      {/* Spotlight */}
      {highlightZone && (
        <>
          <div style={{
            position: 'absolute',
            top: highlightZone.top, left: highlightZone.left,
            width: highlightZone.width, height: highlightZone.height,
            zIndex: 2, pointerEvents: 'none', borderRadius: '16px',
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.48)', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -highlightZone.top, left: -highlightZone.left, width: '390px', height: '740px', pointerEvents: 'none' }}>
              {rightPanelContent}
            </div>
          </div>
          <div style={{
            position: 'absolute',
            top: highlightZone.top - 4, left: highlightZone.left - 4,
            width: highlightZone.width + 8, height: highlightZone.height + 8,
            border: '3px solid #1A9E8F', borderRadius: '20px',
            pointerEvents: 'none', zIndex: 3,
            boxShadow: '0 0 0 2px rgba(26,158,143,0.2), 0 0 20px rgba(26,158,143,0.7)',
          }} />
        </>
      )}

      {/* Step badge — persistent, top-right */}
      {step < 3 && (
        <div style={{
          position: 'absolute', top: 13, right: 13, zIndex: 12,
          background: '#1A9E8F', color: 'white',
          borderRadius: '20px', padding: '6px 13px',
          fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 800,
          letterSpacing: '0.3px', boxShadow: '0 3px 12px rgba(26,158,143,0.4)',
        }}>
          Passo {step + 1} di 3
        </div>
      )}

      {/* Coach card — floats above or below spotlight */}
      <div style={{
        position: 'absolute',
        top: cardAtTop ? 10 : 'auto',
        bottom: cardAtTop ? 'auto' : 10,
        left: 10, right: 10,
        zIndex: 10,
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.97)',
          borderRadius: '22px',
          boxShadow: '0 8px 36px rgba(0,0,0,0.30)',
          border: '2.5px solid rgba(26,158,143,0.42)',
          padding: '18px 20px',
        }}>
          {/* Tag */}
          <div style={{
            display: 'inline-flex', alignItems: 'center',
            background: '#FFF0E0', borderRadius: '8px', padding: '5px 11px',
            fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 800,
            color: '#D4720A', letterSpacing: '0.4px', textTransform: 'uppercase',
            marginBottom: '10px',
          }}>{tag}</div>
          {/* Text */}
          <p style={{
            fontFamily: 'Nunito, sans-serif', fontSize: '16px', fontWeight: 700,
            lineHeight: 1.72, color: '#1A1A1A', margin: '0 0 12px',
          }}>{text}</p>
          {/* Separator + mascot row */}
          <div style={{ height: '1px', background: 'rgba(0,0,0,0.08)', marginBottom: '10px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Mascot />
            <p style={{
              fontFamily: 'Nunito, sans-serif', fontSize: '13px',
              fontWeight: 600, color: '#5A5755', lineHeight: 1.5,
              fontStyle: 'italic', margin: 0, flex: 1,
            }}>
              Puoi sempre tornare indietro.<br />Non puoi fare danni!
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}

// ── STEP 0: scelta prestazione ─────────────────────────────────────
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
        <StepIndicator step={0} total={3} />
        <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '24px', fontWeight: 900, color: '#1A1A1A', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: '6px' }}>
          Che visita<br />ti serve?
        </h1>
        <p style={{ fontSize: '15px', color: '#5A5755', lineHeight: 1.6, fontWeight: 600 }}>
          Tocca la prestazione di cui hai bisogno
        </p>
      </div>

      <div data-highlight="prestazione" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {prestazioni.map((p, i) => (
          <button
            key={i}
            onClick={() => onSelect(p)}
            style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '16px 18px', borderRadius: '16px',
              border: '2px solid #E0E0E0', background: 'white',
              cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
              textAlign: 'left', width: '100%',
              boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
              minHeight: '76px',
            }}
          >
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#E0F5F3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {p.icon}
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '17px', fontWeight: 800, display: 'block', color: '#1A1A1A', lineHeight: 1.2, marginBottom: '3px' }}>{p.nome}</span>
              <span style={{ fontSize: '13px', color: '#6B7280', display: 'block', fontWeight: 600 }}>Prima disponibile: {p.attesa}</span>
            </div>
            <ChevronRight size={20} color="#C0C0C0" />
          </button>
        ))}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '18px' }}>
        <button onClick={onBack} style={{
          padding: '15px 20px', borderRadius: '14px', border: '2px solid #E0E0E0',
          background: 'white', fontFamily: 'Nunito, sans-serif', fontSize: '15px',
          fontWeight: 700, color: '#6B7280', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <ArrowLeft size={17} />
          Torna alla schermata principale
        </button>
      </div>
    </div>
  )
}

// ── STEP 1: scelta data/ora ────────────────────────────────────────
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
        <StepIndicator step={1} total={3} />
        <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '24px', fontWeight: 900, color: '#1A1A1A', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: '4px' }}>
          Scegli giorno<br />e orario
        </h1>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#E0F5F3', borderRadius: '10px', padding: '4px 10px' }}>
          <Stethoscope size={14} color="#1A9E8F" />
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#1A9E8F', fontFamily: 'Nunito, sans-serif' }}>{prestazione?.nome}</span>
        </div>
      </div>

      <div data-highlight="calendario" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
        {slotDisponibili.map((giorno, gi) => (
          <div key={gi}>
            <p style={{ fontSize: '14px', fontWeight: 800, color: '#6B7280', marginBottom: '8px', fontFamily: 'Nunito, sans-serif', letterSpacing: '0.2px' }}>
              {giorno.data}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {giorno.orari.map((orario, oi) => {
                const isSelected = selectedSlot?.data === giorno.data && selectedSlot?.orario === orario
                return (
                  <button
                    key={oi}
                    onClick={() => setSelectedSlot({ data: giorno.data, orario })}
                    style={{
                      padding: '16px 12px', borderRadius: '14px',
                      border: isSelected ? '2.5px solid #1A9E8F' : '2px solid #E0E0E0',
                      background: isSelected ? '#E0F5F3' : 'white',
                      fontFamily: 'Nunito, sans-serif', fontSize: '17px', fontWeight: 800,
                      color: isSelected ? '#1A9E8F' : '#1A1A1A',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      minHeight: '58px',
                      boxShadow: isSelected ? '0 3px 12px rgba(26,158,143,0.22)' : '0 1px 4px rgba(0,0,0,0.04)',
                    }}
                  >
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
          <ArrowLeft size={17} />
          Indietro
        </button>
        <button
          onClick={() => selectedSlot && onSelect(selectedSlot)}
          style={{ flex: 2, padding: '16px', borderRadius: '14px', border: 'none', background: selectedSlot ? 'linear-gradient(135deg, #1A9E8F 0%, #147A6E 100%)' : '#E8E8E8', fontFamily: 'Nunito, sans-serif', fontSize: '16px', fontWeight: 800, color: selectedSlot ? 'white' : '#9CA3AF', cursor: selectedSlot ? 'pointer' : 'default', boxShadow: selectedSlot ? '0 4px 16px rgba(26,158,143,0.35)' : 'none', minHeight: '58px' }}
        >
          {selectedSlot ? 'Avanti →' : 'Seleziona un orario'}
        </button>
      </div>
    </div>
  )
}

// ── STEP 2: riepilogo e conferma ───────────────────────────────────
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
        <StepIndicator step={2} total={3} />
        <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '24px', fontWeight: 900, color: '#1A1A1A', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
          Controlla i dati<br />e conferma
        </h1>
      </div>

      {/* Info box */}
      <div style={{ background: '#FFF9F0', border: '1.5px solid #FFE0B0', borderRadius: '12px', padding: '10px 14px', marginBottom: '12px' }}>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 600, color: '#B07000', margin: 0, lineHeight: 1.5 }}>
          ⚠️ Leggi attentamente. Se qualcosa non va, usa il pulsante «Indietro».
        </p>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {rows.map((row, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '13px 0', borderBottom: '1px solid #EEECEA' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '11px', background: '#E0F5F3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {row.icon}
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '2px' }}>{row.label}</span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#1A1A1A', fontFamily: 'Nunito, sans-serif' }}>{row.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
        <button onClick={onBack} style={{ flex: 1, padding: '16px 12px', borderRadius: '14px', border: '2px solid #E0E0E0', background: 'white', fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 700, color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', minHeight: '58px' }}>
          <ArrowLeft size={17} />
          Indietro
        </button>
        <button
          data-highlight="conferma"
          onClick={onConfirm}
          style={{ flex: 2, padding: '16px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #1A9E8F 0%, #147A6E 100%)', fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 800, color: 'white', cursor: 'pointer', boxShadow: '0 4px 16px rgba(26,158,143,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', minHeight: '58px' }}
        >
          <CheckCircle2 size={18} />
          Conferma prenotazione
        </button>
      </div>
    </div>
  )
}

// ── STEP 3: successo prenotazione ──────────────────────────────────
function StepSuccessoPrenotazione({ prestazione, slot, onDone }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '28px 24px 24px', background: '#FFF8F0' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: '116px', height: '116px',
          background: '#E0F5F3', border: '3px solid #1A9E8F',
          borderRadius: '50%', display: 'flex', alignItems: 'center',
          justifyContent: 'center', marginBottom: '24px',
        }}>
          <CheckCircle2 size={54} color="#1A9E8F" strokeWidth={1.8} />
        </div>
        <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '30px', fontWeight: 900, color: '#1A1A1A', textAlign: 'center', lineHeight: 1.2, marginBottom: '18px' }}>
          Prenotazione<br />Confermata!
        </h1>
        <div style={{ background: 'white', borderRadius: '18px', padding: '18px 20px', border: '2px solid #E0F5F3', width: '100%', marginBottom: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '13px' }}>
            <div style={{ width: '36px', height: '36px', background: '#E0F5F3', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Stethoscope size={18} color="#1A9E8F" />
            </div>
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#1A1A1A', fontFamily: 'Nunito, sans-serif' }}>{prestazione?.nome}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '13px' }}>
            <div style={{ width: '36px', height: '36px', background: '#E0F5F3', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CalendarDays size={18} color="#1A9E8F" />
            </div>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#1A1A1A', fontFamily: 'Nunito, sans-serif' }}>{slot?.data}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', background: '#E0F5F3', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Clock size={18} color="#1A9E8F" />
            </div>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#1A1A1A', fontFamily: 'Nunito, sans-serif' }}>Ore {slot?.orario}</span>
          </div>
        </div>
        <p style={{ fontSize: '14px', color: '#6B7280', textAlign: 'center', fontFamily: 'Nunito, sans-serif', fontWeight: 500, lineHeight: 1.55 }}>
          La conferma è registrata nel sistema CUP.
        </p>
      </div>
      <button
        onClick={onDone}
        style={{ width: '100%', padding: '18px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #1A9E8F 0%, #147A6E 100%)', fontFamily: 'Nunito, sans-serif', fontSize: '16px', fontWeight: 800, color: 'white', cursor: 'pointer', boxShadow: '0 4px 16px rgba(26,158,143,0.35)', minHeight: '60px' }}
      >
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

  const goHome = () => setState(s => ({ ...s, currentScreen: 'home', currentStep: 0 }))

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
    <div style={{ display: 'flex', flexDirection: 'row', height: '740px' }}>
      <PanelLeft step={step} rightPanelContent={rightPanelContent()} rightPanelRef={rightPanelRef} />
      <div style={{ width: '20px', background: '#1A1A1A', flexShrink: 0 }} />
      <div ref={rightPanelRef} style={{ width: '390px', height: '740px', flexShrink: 0, overflow: 'hidden' }}>
        {rightPanelInteractive()}
      </div>
    </div>
  )
}
