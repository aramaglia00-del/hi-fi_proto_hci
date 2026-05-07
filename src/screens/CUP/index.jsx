import { useState, useEffect, useRef } from 'react'
import { 
  CalendarDays, Building2, Info, Newspaper, Phone, 
  FileText, ArrowLeft, PlusCircle, Download, List, 
  ChevronRight, CheckCircle2 
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import AssistantOverlay from '../../components/AssistantOverlay'

// ── CONFIGURAZIONE STEP ASSISTENTE ──────────────────────────────────
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
    text: (<><strong>SELEZIONA L’APPUNTAMENTO!</strong></>),
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
  }
]

// ── COMPONENTE PULSANTE BACK (Standard) ───────────────────────────
const CustomBackButton = ({ onBack, flex = 1 }) => (
  <button 
    onClick={onBack} 
    style={{ 
      flex: flex, 
      padding: '14px', 
      borderRadius: '14px', 
      border: '2px solid #E8E8E8', 
      background: 'white', 
      fontFamily: 'Nunito, sans-serif', 
      fontSize: '14px', 
      fontWeight: 700, 
      color: '#6B7280', 
      cursor: 'pointer', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      gap: '6px' 
    }}
  >
    <ArrowLeft size={16} />
  </button>
)

// ── PANNELLO SINISTRO (Logica Sync) ──────────────────────────────────
function PanelLeft({ step, rightPanelContent, rightPanelRef }) {
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
  }, [step, currentStep.highlightSelector, rightPanelRef])

  return (
    <div style={{ width: '390px', height: '740px', flexShrink: 0, position: 'relative', overflow: 'hidden', background: '#FFF8F0' }}>
      {!currentStep.isTutorialMode && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', filter: 'blur(1.5px)' }}>
          {rightPanelContent}
        </div>
      )}
      {!currentStep.isTutorialMode && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', pointerEvents: 'none', zIndex: 1 }} />
      )}
      {highlightZone && !currentStep.isTutorialMode && (
        <>
          <div style={{ position: 'absolute', top: highlightZone.top, left: highlightZone.left, width: highlightZone.width, height: highlightZone.height, zIndex: 2, pointerEvents: 'none', borderRadius: '16px', boxShadow: '0 0 0 9999px rgba(0,0,0,0.45)', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -highlightZone.top, left: -highlightZone.left, width: '390px', height: '740px', pointerEvents: 'none' }}>
              {rightPanelContent}
            </div>
          </div>
          <div style={{ position: 'absolute', top: highlightZone.top - 3, left: highlightZone.left - 3, width: highlightZone.width + 6, height: highlightZone.height + 6, border: '2.5px solid #1A9E8F', borderRadius: '19px', pointerEvents: 'none', zIndex: 3, boxShadow: '0 0 16px rgba(26,158,143,0.6)' }} />
        </>
      )}
      <AssistantOverlay tag={currentStep.tag} text={currentStep.text} highlightZone={currentStep.isTutorialMode ? null : highlightZone} />
    </div>
  )
}

// ── SCHERMATE DELL'APP ──────────────────────────────────────────────

function StepMenu({ onPrenotazioni, onBack }) {
  const voci = [
    { icon: <CalendarDays size={38} />, label: 'Prenotazioni', highlight: true },
    { icon: <Building2 size={38} />, label: 'Strutture' },
    { icon: <Info size={38} />, label: 'Come fare' },
    { icon: <Newspaper size={38} />, label: 'News' },
    { icon: <Phone size={38} />, label: 'Contatti' },
    { icon: <FileText size={38} />, label: 'Modulistica' },
  ]
  return (
    <div style={{ height: '100%', background: 'white', display: 'flex', flexDirection: 'column', textAlign: 'center', padding: '0 20px 20px' }}>
      <h1 style={{ padding: '40px 0 20px', fontSize: '28px', fontWeight: 900 }}>Sanità pubblica</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', flex: 1 }}>
        {voci.map((v, i) => (
          <div key={i} data-highlight={v.highlight ? "prenotazioni" : null} onClick={v.highlight ? onPrenotazioni : null} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', cursor: v.highlight ? 'pointer' : 'default' }}>
            <div style={{ color: '#2D2D2D' }}>{v.icon}</div>
            <span style={{ fontWeight: 700 }}>{v.label}</span>
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
        <h2 style={{ flex: 1, textAlign: 'center', fontWeight: 800 }}>Prenotazioni</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 }}>
        <button data-highlight="aggiungi" onClick={onNext} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '18px', border: '2px solid black', borderRadius: '12px', background: 'white', fontWeight: 800, textAlign: 'left', cursor: 'pointer' }}>
          <PlusCircle /> Aggiungi Prenotazione
        </button>
        <button disabled style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '18px', border: '1px solid #E8E8E8', borderRadius: '12px', background: 'white', color: '#ccc', textAlign: 'left' }}><Download /> Recupera Prenotazione</button>
        <button disabled style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '18px', border: '1px solid #E8E8E8', borderRadius: '12px', background: 'white', color: '#ccc', textAlign: 'left' }}><List /> Elenca prenotazioni</button>
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
      <h1 style={{ fontSize: '42px', fontWeight: 900, lineHeight: 1.1 }}>Leggi<br />il tutorial!</h1>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '100px' }}>👇</div>
      </div>
      <button data-highlight="continua" onClick={onNext} style={{ width: '100%', padding: '18px', background: '#1A1A1A', color: 'white', border: 'none', borderRadius: '14px', fontWeight: 900, fontSize: '16px', cursor: 'pointer' }}>
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
    padding: '15px',
    borderRadius: '12px',
    background: 'white',
    transition: 'all 0.3s ease',
    opacity: active ? 1 : 0.6,
    textAlign: 'left'
  })

  return (
    <div style={{ height: '100%', background: 'white', padding: '20px', display: 'flex', flexDirection: 'column' }}>
      {/* HEADER CON BACK PICCOLO A SINISTRA */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', position: 'relative' }}>
        <button 
          onClick={onBack} 
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            padding: '5px', 
            color: '#6B7280',
            position: 'absolute',
            left: 0
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <h3 style={{ flex: 1, textAlign: 'center', fontWeight: 800, margin: 0 }}>Aggiungi Prenotazione</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 }}>
        <div data-highlight="nre-sx" style={fieldStyle(currentStep === 3)}>
          <label style={{ fontSize: '11px', fontWeight: 800, color: '#666', display: 'block', marginBottom: '5px' }}>CODICE NRE SINISTRA</label>
          <input 
            value={valSx} 
            onChange={(e) => setValSx(e.target.value.toUpperCase())}
            maxLength={5}
            placeholder="xxxxx" 
            style={{ width: '100%', border: 'none', fontSize: '18px', outline: 'none', fontWeight: 700 }} 
          />
        </div>
        <div data-highlight="nre-dx" style={fieldStyle(currentStep === 4)}>
          <label style={{ fontSize: '11px', fontWeight: 800, color: '#666', display: 'block', marginBottom: '5px' }}>CODICE NRE DESTRA</label>
          <input 
            value={valDx} 
            onChange={(e) => setValDx(e.target.value)}
            maxLength={10}
            placeholder="xxxxxxxxxx" 
            style={{ width: '100%', border: 'none', fontSize: '18px', outline: 'none', fontWeight: 700 }} 
          />
        </div>
        <div data-highlight="cf" style={fieldStyle(currentStep === 5)}>
          <label style={{ fontSize: '11px', fontWeight: 800, color: '#666', display: 'block', marginBottom: '5px' }}>CODICE FISCALE</label>
          <input 
            value={valCf} 
            onChange={(e) => setValCf(e.target.value.toUpperCase())}
            maxLength={16}
            placeholder="XXXXX..." 
            style={{ width: '100%', border: 'none', fontSize: '18px', outline: 'none', fontWeight: 700 }} 
          />
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
            fontWeight: 800, cursor: valCf.length === 16 ? 'pointer' : 'default'
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
      <h3 style={{ textAlign: 'center', padding: '20px', fontWeight: 800 }}>Prime Disponibilità</h3>
      <div style={{ overflowY: 'auto', flex: 1 }}>
        {sedi.map((s, i) => (
          <div 
            key={i} 
            data-highlight={s.target ? "target-hospital" : null} 
            onClick={onNext} 
            style={{ display: 'flex', alignItems: 'center', padding: '20px', borderBottom: '1px solid #F0F0F0', cursor: 'pointer' }}
          >
            <CalendarDays style={{ marginRight: '15px', color: '#2D2D2D' }} size={28} />
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontWeight: 800, fontSize: '15px' }}>{s.h}</div>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>{s.s}</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#1A9E8F', marginTop: '2px' }}>{s.d}</div>
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
      <h3 style={{ textAlign: 'center', marginBottom: '40px', fontWeight: 900, fontSize: '24px' }}>Dettaglio</h3>
      <div style={{ flex: 1, textAlign: 'left' }}>
          <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
            <div style={{ width: '40px', height: '40px', background: '#E0F5F3', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={20} color="#1A9E8F" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '16px' }}>Sede</div>
              <div style={{ color: '#4B5563', fontSize: '14px' }}>Ospedale San Pietro, Corso Ottomano - Torino</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
            <div style={{ width: '40px', height: '40px', background: '#E0F5F3', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarDays size={20} color="#1A9E8F" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '16px' }}>Data e ora</div>
              <div style={{ color: '#4B5563', fontSize: '14px' }}>21/07/2026 - 14:00</div>
            </div>
          </div>
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
        <CustomBackButton onBack={onBack} />
        <button data-highlight="conferma-btn" onClick={onNext} style={{ flex: 2, padding: '18px', background: '#1A1A1A', color: 'white', borderRadius: '12px', fontWeight: 900, border: 'none', cursor: 'pointer', fontSize: '15px' }}>
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
      <h1 style={{ fontSize: '30px', fontWeight: 900, marginBottom: '10px' }}>Prenotazione Effettuata!</h1>
      <p style={{ color: '#6B7280' }}>Ospedale San Pietro<br /><strong>21/07/2026 - 14:00</strong></p>
      <button data-highlight="home-back" onClick={onHome} style={{ marginTop: 'auto', width: '100%', padding: '18px', background: '#1A1A1A', color: 'white', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', border: 'none' }}>
        Torna alla schermata principale
      </button>
    </div>
  )
}

// ── COMPONENTE EXPORT PRINCIPALE ─────────────────────────────────────

export default function CUP() {
  const [step, setStep] = useState(0)
  const { setState } = useApp()
  const rightPanelRef = useRef(null)

  const goHome = () => setState(s => ({ ...s, currentScreen: 'home', currentStep: 0 }))

  const renderContent = (interactive) => {
    const props = interactive 
      ? { onNext: () => setStep(s => s + 1), onBack: () => setStep(s => s - 1), onPrenotazioni: () => setStep(1), onHome: goHome, currentStep: step, setStep }
      : { onNext: () => {}, onBack: () => {}, onPrenotazioni: () => {}, onHome: () => {}, currentStep: step, setStep: () => {} }
    
    switch(step) {
      case 0: return <StepMenu onPrenotazioni={props.onPrenotazioni} onBack={goHome} />
      case 1: return <StepOptions onNext={props.onNext} onBack={props.onBack} />
      case 2: return <StepTutorialScreen onNext={props.onNext} />
      case 3: 
      case 4: 
      case 5: 
      case 6: return <StepFormScreen {...props} onBack={() => setStep(2)} /> 
      case 7: return <StepResults onNext={props.onNext} onBack={() => setStep(3)} /> 
      case 8: return <StepConfirm onNext={props.onNext} onBack={props.onBack} />
      case 9: return <StepSuccess onHome={props.onHome} />
      default: return null
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '740px' }}>
      <PanelLeft step={step} rightPanelContent={renderContent(false)} rightPanelRef={rightPanelRef} />
      <div style={{ width: '20px', background: '#1A1A1A', flexShrink: 0 }} />
      <div ref={rightPanelRef} style={{ width: '390px', height: '740px', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
        {renderContent(true)}
      </div>
    </div>
  )
}