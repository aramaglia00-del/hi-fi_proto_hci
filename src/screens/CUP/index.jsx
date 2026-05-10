import { useState, useEffect, useRef } from 'react'
import {
  CalendarDays, Building2, ArrowLeft,
  PlusCircle, Download, List, ChevronRight, CheckCircle2,
} from 'lucide-react'
import { useApp, useTheme, useFontZoom } from '../../context/AppContext'
import { PhoneFrame, TotemFrame } from '../../components/layout/DeviceFrames'
import AssistantOverlay from '../../components/AssistantOverlay'
import AccessibilityPanel from '../../components/phone/AccessibilityPanel'

// ── ASSISTANT STEPS CONFIG ─────────────────────────────────────────
const assistantSteps = [
  {
    tag: '👆 Fai così',
    text: (<>Clicca su <strong style={{ color: '#1A9E8F' }}>PRENOTAZIONI</strong> per iniziare!</>),
    highlightSelector: '[data-highlight="prenotazioni"]',
  },
  {
    tag: '👆 Fai così',
    text: (<>Fai CLICK su <strong style={{ color: '#1A9E8F' }}>AGGIUNGI PRENOTAZIONE</strong>!</>),
    highlightSelector: '[data-highlight="aggiungi"]',
  },
  {
    tag: '📖 Tutorial',
    isTutorialMode: true,
    text: (
      <div style={{ textAlign: 'left', fontSize: '13px', lineHeight: '1.4' }}>
        Adesso scopriamo insieme IL <strong>FORM</strong>, lo strumento che serve per INVIARE I TUOI DATI ALLE APP.<br /><br />
        Per prima cosa <strong>LEGGI LE ETICHETTE</strong> che ti spiegano cosa inserire, poi <strong>TOCCA I RETTANGOLI BIANCHI</strong> PER SCRIVERE quello che serve.<br /><br />
        Quando hai finito, <strong>PREMI IL BOTTONE IN FONDO</strong>: serve a spedire le tue informazioni e concludere l'operazione!
      </div>
    ),
    highlightSelector: '[data-highlight="continua"]',
  },
  {
    tag: '📝 Passo 1',
    text: (<>COMPILA IL FORM! Inserisci i dati che trovi sul documento, iniziamo con il <strong>NRE di SINISTRA</strong>!</>),
    highlightSelector: '[data-highlight="nre-sx"]',
  },
  {
    tag: '📝 Passo 2',
    text: (<>Ottimo! Ora inserisci il <strong>NRE di DESTRA</strong>.</>),
    highlightSelector: '[data-highlight="nre-dx"]',
  },
  {
    tag: '📝 Passo 3',
    text: (<>Infine, inserisci il tuo <strong>CODICE FISCALE</strong>.</>),
    highlightSelector: '[data-highlight="cf"]',
  },
  {
    tag: '🚀 Quasi fatto',
    text: (<>Molto bene! Ora <strong>FAI CLICK SUL BOTTONE RICHIEDI</strong> per cercare le disponibilità!</>),
    highlightSelector: '[data-highlight="richiedi-btn"]',
  },
  {
    tag: '📍 Selezione',
    text: (<><strong>SELEZIONA L'APPUNTAMENTO!</strong></>),
    highlightSelector: '[data-highlight="target-hospital"]',
  },
  {
    tag: '✅ Conferma',
    text: (<><strong>ABBIAMO FINITO!</strong><br />Conferma la tua prenotazione premendo il bottone <strong>CONFERMA</strong> ↓</>),
    highlightSelector: '[data-highlight="conferma-btn"]',
  },
  {
    tag: '🎉 Grande!',
    text: (<><strong>GRANDE!</strong><br />Prenotazione effettuata! Ora puoi tornare alla schermata principale.</>),
    highlightSelector: '[data-highlight="home-back"]',
  },
]

// ── BACK BUTTON ────────────────────────────────────────────────────
const CustomBackButton = ({ onBack }) => (
  <button
    onClick={onBack}
    style={{
      flex: 1, padding: '14px', borderRadius: '14px',
      border: '2px solid #E8E8E8', background: 'white',
      fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: 700,
      color: '#6B7280', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
    }}
  >
    <ArrowLeft size={16} />
  </button>
)

// ── LEFT PANEL (phone coaching overlay) ───────────────────────────
function PanelLeft({ step, rightPanelContent, rightPanelRef }) {
  const theme = useTheme()
  const zoom = useFontZoom()
  const currentStep = assistantSteps[step] || assistantSteps[0]
  const [highlightZone, setHighlightZone] = useState(null)

  useEffect(() => {
    const calculate = () => {
      if (!currentStep.highlightSelector || !rightPanelRef?.current) {
        setHighlightZone(null); return
      }
      const target = rightPanelRef.current.querySelector(currentStep.highlightSelector)
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
  }, [step, currentStep.highlightSelector, rightPanelRef])

  return (
    <div style={{ width: '390px', height: '740px', flexShrink: 0, position: 'relative', overflow: 'hidden', background: theme.bg }}>
      {!currentStep.isTutorialMode && (
        <>
          {/* Blurred mirror of totem content */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', filter: 'blur(1.5px)', overflow: 'hidden' }}>
            <div style={{ width: `${390/zoom}px`, height: `${740/zoom}px`, zoom, filter: theme.isHC ? 'invert(1)' : 'none' }}>
              {rightPanelContent}
            </div>
          </div>
          {/* Dark overlay */}
          <div style={{ position: 'absolute', inset: 0, background: theme.isHC ? 'rgba(0,0,0,0.72)' : 'rgba(0,0,0,0.48)', pointerEvents: 'none', zIndex: 1 }} />
          {/* Spotlight cutout */}
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
        </>
      )}
      <AssistantOverlay
        tag={currentStep.tag}
        text={currentStep.text}
        highlightZone={currentStep.isTutorialMode ? null : highlightZone}
        forceTop={!!currentStep.isTutorialMode}
      />
      <AccessibilityPanel />
    </div>
  )
}

// ── STEP COMPONENTS (partner's CUP flow) ──────────────────────────

function StepMenu({ onPrenotazioni, onBack }) {
  const voci = [
    { icon: <CalendarDays size={38} />, label: 'Prenotazioni', highlight: true },
    { icon: <Building2 size={38} />, label: 'Strutture' },
    { icon: <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>, label: 'Come fare' },
    { icon: <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4"/><path d="M16 2v4M8 2v4M3 10h7"/><path d="M2 22l5-5M7 22l-5-5"/></svg>, label: 'News' },
    { icon: <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 11.9 19.79 19.79 0 0 1 1.05 3.27 2 2 0 0 1 3 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16l.92.92z"/></svg>, label: 'Contatti' },
    { icon: <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>, label: 'Modulistica' },
  ]
  return (
    <div style={{ height: '100%', background: 'white', display: 'flex', flexDirection: 'column', textAlign: 'center', padding: '0 20px 20px' }}>
      <h1 style={{ padding: '40px 0 20px', fontSize: '28px', fontWeight: 900, color: '#2D2D2D', fontFamily: 'Nunito, sans-serif' }}>Sanità pubblica</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', flex: 1 }}>
        {voci.map((v, i) => (
          <div
            key={i}
            data-highlight={v.highlight ? 'prenotazioni' : null}
            onClick={v.highlight ? onPrenotazioni : null}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', cursor: v.highlight ? 'pointer' : 'default' }}
          >
            <div style={{ color: '#2D2D2D' }}>{v.icon}</div>
            <span style={{ fontWeight: 700, fontFamily: 'Nunito, sans-serif' }}>{v.label}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '20px' }}>
        <CustomBackButton onBack={onBack} />
      </div>
    </div>
  )
}

function StepOptions({ onNext, onBack }) {
  return (
    <div style={{ height: '100%', background: 'white', padding: '20px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
        <h2 style={{ flex: 1, textAlign: 'center', fontWeight: 800, color: '#2D2D2D', fontFamily: 'Nunito, sans-serif' }}>Prenotazioni</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 }}>
        <button data-highlight="aggiungi" onClick={onNext} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '18px', border: '2px solid black', borderRadius: '12px', background: 'white', fontWeight: 800, textAlign: 'left', cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
          <PlusCircle /> Aggiungi Prenotazione
        </button>
        <button disabled style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '18px', border: '1px solid #E8E8E8', borderRadius: '12px', background: 'white', color: '#ccc', textAlign: 'left', fontFamily: 'Nunito, sans-serif' }}>
          <Download /> Recupera Prenotazione
        </button>
        <button disabled style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '18px', border: '1px solid #E8E8E8', borderRadius: '12px', background: 'white', color: '#ccc', textAlign: 'left', fontFamily: 'Nunito, sans-serif' }}>
          <List /> Elenca prenotazioni
        </button>
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '20px' }}>
        <CustomBackButton onBack={onBack} />
      </div>
    </div>
  )
}

function StepTutorialScreen({ onNext }) {
  return (
    <div style={{ height: '100%', background: '#999', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px 40px', color: 'white', textAlign: 'center' }}>
      <h1 style={{ fontSize: '42px', fontWeight: 900, lineHeight: 1.1, fontFamily: 'Nunito, sans-serif' }}>Leggi<br />il tutorial!</h1>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '100px' }}>👇</div>
      </div>
      <button data-highlight="continua" onClick={onNext} style={{ width: '100%', padding: '18px', background: '#1A1A1A', color: 'white', border: 'none', borderRadius: '14px', fontWeight: 900, fontSize: '16px', cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
        CONTINUA
      </button>
    </div>
  )
}

function StepFormScreen({ currentStep, setStep, onNext, onBack }) {
  const [valSx, setValSx] = useState('')
  const [valDx, setValDx] = useState('')
  const [valCf, setValCf] = useState('')

  useEffect(() => {
    if (valSx.length === 5 && currentStep === 3) setStep(4)
    if (valDx.length === 10 && currentStep === 4) setStep(5)
    if (valCf.length === 16 && currentStep === 5) setStep(6)
  }, [valSx, valDx, valCf, currentStep, setStep])

  const fieldStyle = (active) => ({
    border: active ? '2px solid #1A9E8F' : '2px solid #E8E8E8',
    padding: '15px', borderRadius: '12px', background: 'white',
    transition: 'all 0.3s ease', opacity: active ? 1 : 0.6, textAlign: 'left',
  })

  return (
    <div style={{ height: '100%', background: 'white', padding: '20px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', position: 'relative' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px', color: '#6B7280', position: 'absolute', left: 0 }}>
          <ArrowLeft size={20} />
        </button>
        <h3 style={{ flex: 1, textAlign: 'center', fontWeight: 800, margin: 0, color: '#2D2D2D', fontFamily: 'Nunito, sans-serif' }}>Aggiungi Prenotazione</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 }}>
        <div data-highlight="nre-sx" style={fieldStyle(currentStep === 3)}>
          <label style={{ fontSize: '11px', fontWeight: 800, color: '#666', display: 'block', marginBottom: '5px', fontFamily: 'Nunito, sans-serif' }}>CODICE NRE SINISTRA</label>
          <input value={valSx} onChange={(e) => setValSx(e.target.value.toUpperCase())} maxLength={5} placeholder="xxxxx" style={{ width: '100%', border: 'none', fontSize: '18px', outline: 'none', fontWeight: 700, fontFamily: 'Nunito, sans-serif' }} />
        </div>
        <div data-highlight="nre-dx" style={fieldStyle(currentStep === 4)}>
          <label style={{ fontSize: '11px', fontWeight: 800, color: '#666', display: 'block', marginBottom: '5px', fontFamily: 'Nunito, sans-serif' }}>CODICE NRE DESTRA</label>
          <input value={valDx} onChange={(e) => setValDx(e.target.value)} maxLength={10} placeholder="xxxxxxxxxx" style={{ width: '100%', border: 'none', fontSize: '18px', outline: 'none', fontWeight: 700, fontFamily: 'Nunito, sans-serif' }} />
        </div>
        <div data-highlight="cf" style={fieldStyle(currentStep === 5)}>
          <label style={{ fontSize: '11px', fontWeight: 800, color: '#666', display: 'block', marginBottom: '5px', fontFamily: 'Nunito, sans-serif' }}>CODICE FISCALE</label>
          <input value={valCf} onChange={(e) => setValCf(e.target.value.toUpperCase())} maxLength={16} placeholder="XXXXX..." style={{ width: '100%', border: 'none', fontSize: '18px', outline: 'none', fontWeight: 700, fontFamily: 'Nunito, sans-serif' }} />
        </div>
      </div>
      <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
        <button
          data-highlight="richiedi-btn"
          onClick={valCf.length === 16 ? onNext : undefined}
          style={{
            width: '100%', padding: '16px', borderRadius: '14px', border: 'none',
            background: valCf.length === 16 ? '#1A1A1A' : '#E8E8E8',
            color: valCf.length === 16 ? 'white' : '#9CA3AF',
            fontWeight: 800, cursor: valCf.length === 16 ? 'pointer' : 'default',
            fontFamily: 'Nunito, sans-serif', fontSize: '15px',
          }}
        >
          Richiedi
        </button>
      </div>
    </div>
  )
}

function StepResults({ onNext, onBack }) {
  const sedi = [
    { h: 'Ospedale Molinette', s: 'Via San Maurizio - Torino', d: '11/07/2026 - 12:30' },
    { h: 'Ospedale Santa Maria', s: 'Corso Vercelli - Torino', d: '29/06/2026 - 18:30' },
    { h: 'Ospedale San Pietro', s: 'Corso Ottomano - Torino', d: '21/07/2026 - 14:00', target: true },
    { h: 'Ospedale Santa Agata', s: 'Via Verdi - Vercelli', d: '13/07/2026 - 09:30' },
  ]
  return (
    <div style={{ height: '100%', background: 'white', display: 'flex', flexDirection: 'column', padding: '0 0 20px 0' }}>
      <h3 style={{ textAlign: 'center', padding: '20px', fontWeight: 800, color: '#2D2D2D', fontFamily: 'Nunito, sans-serif' }}>Prime Disponibilità</h3>
      <div style={{ overflowY: 'auto', flex: 1 }}>
        {sedi.map((s, i) => (
          <div
            key={i}
            data-highlight={s.target ? 'target-hospital' : null}
            onClick={onNext}
            style={{ display: 'flex', alignItems: 'center', padding: '20px', borderBottom: '1px solid #F0F0F0', cursor: 'pointer' }}
          >
            <CalendarDays style={{ marginRight: '15px', color: '#2D2D2D' }} size={28} />
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontWeight: 800, fontSize: '15px', fontFamily: 'Nunito, sans-serif' }}>{s.h}</div>
              <div style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Nunito, sans-serif' }}>{s.s}</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#1A9E8F', marginTop: '2px', fontFamily: 'Nunito, sans-serif' }}>{s.d}</div>
            </div>
            <ChevronRight size={18} color="#9CA3AF" />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '10px', padding: '0 20px' }}>
        <CustomBackButton onBack={onBack} />
      </div>
    </div>
  )
}

function StepConfirm({ onNext, onBack }) {
  return (
    <div style={{ height: '100%', background: 'white', padding: '32px 28px 20px', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '40px', fontWeight: 900, fontSize: '24px', color: '#2D2D2D', fontFamily: 'Nunito, sans-serif' }}>Dettaglio</h3>
      <div style={{ flex: 1, textAlign: 'left' }}>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
          <div style={{ width: '40px', height: '40px', background: '#E0F5F3', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={20} color="#1A9E8F" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '16px', fontFamily: 'Nunito, sans-serif' }}>Sede</div>
            <div style={{ color: '#4B5563', fontSize: '14px', fontFamily: 'Nunito, sans-serif' }}>Ospedale San Pietro, Corso Ottomano - Torino</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
          <div style={{ width: '40px', height: '40px', background: '#E0F5F3', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CalendarDays size={20} color="#1A9E8F" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '16px', fontFamily: 'Nunito, sans-serif' }}>Data e ora</div>
            <div style={{ color: '#4B5563', fontSize: '14px', fontFamily: 'Nunito, sans-serif' }}>21/07/2026 - 14:00</div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
        <CustomBackButton onBack={onBack} />
        <button data-highlight="conferma-btn" onClick={onNext} style={{ flex: 2, padding: '18px', background: '#1A1A1A', color: 'white', borderRadius: '12px', fontWeight: 900, border: 'none', cursor: 'pointer', fontSize: '15px', fontFamily: 'Nunito, sans-serif' }}>
          Conferma
        </button>
      </div>
    </div>
  )
}

function StepSuccess({ onHome }) {
  return (
    <div style={{ height: '100%', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center' }}>
      <div style={{ width: '90px', height: '90px', borderRadius: '50%', border: '3px solid #1A9E8F', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '30px', color: '#1A9E8F' }}>
        <CheckCircle2 size={50} />
      </div>
      <h1 style={{ fontSize: '30px', fontWeight: 900, marginBottom: '10px', color: '#2D2D2D', fontFamily: 'Nunito, sans-serif' }}>Prenotazione Effettuata!</h1>
      <p style={{ color: '#6B7280', fontFamily: 'Nunito, sans-serif' }}>Ospedale San Pietro<br /><strong>21/07/2026 - 14:00</strong></p>
      <button data-highlight="home-back" onClick={onHome} style={{ marginTop: 'auto', width: '100%', padding: '18px', background: '#1A1A1A', color: 'white', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', border: 'none', fontFamily: 'Nunito, sans-serif', fontSize: '15px' }}>
        Torna alla schermata principale
      </button>
    </div>
  )
}

// ── MAIN EXPORT ────────────────────────────────────────────────────
export default function CUP() {
  const [step, setStep] = useState(0)
  const { setState } = useApp()
  const rightPanelRef = useRef(null)
  const zoom = useFontZoom()
  const theme = useTheme()

  const goHome = () => setState(s => ({ ...s, currentScreen: 'home', currentStep: 0 }))
  const disconnect = () => setState(s => ({ ...s, currentScreen: 'pairing', paired: false, currentStep: 0 }))

  const renderContent = (interactive) => {
    const props = interactive
      ? { onNext: () => setStep(s => s + 1), onBack: () => setStep(s => s - 1), onPrenotazioni: () => setStep(1), onHome: goHome, currentStep: step, setStep }
      : { onNext: () => {}, onBack: () => {}, onPrenotazioni: () => {}, onHome: () => {}, currentStep: step, setStep: () => {} }

    switch (step) {
      case 0: return <StepMenu onPrenotazioni={props.onPrenotazioni} onBack={goHome} />
      case 1: return <StepOptions onNext={props.onNext} onBack={props.onBack} />
      case 2: return <StepTutorialScreen onNext={props.onNext} />
      case 3:
      case 4:
      case 5:
      case 6: return <StepFormScreen {...props} onBack={interactive ? () => setStep(2) : () => {}} />
      case 7: return <StepResults onNext={props.onNext} onBack={interactive ? () => setStep(3) : () => {}} />
      case 8: return <StepConfirm onNext={props.onNext} onBack={props.onBack} />
      case 9: return <StepSuccess onHome={props.onHome} />
      default: return null
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '40px', height: '820px' }}>
      <PhoneFrame>
        <PanelLeft step={step} rightPanelContent={renderContent(false)} rightPanelRef={rightPanelRef} />
      </PhoneFrame>
      <TotemFrame>
        <div ref={rightPanelRef} style={{ width: '390px', height: '740px', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
          <div style={{ width: `${390/zoom}px`, height: `${740/zoom}px`, zoom, filter: theme.isHC ? 'invert(1)' : 'none', overflowY: 'auto', overflowX: 'hidden' }}>
            {renderContent(true)}
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
