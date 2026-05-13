import { useState, useEffect, useRef } from 'react'
import {
  CalendarDays, Building2, ArrowLeft,
  PlusCircle, Download, List, CheckCircle2,
} from 'lucide-react'
import { useApp, useTheme, useFontZoom } from '../../context/AppContext'
import { PhoneFrame, TotemFrame } from '../../components/layout/DeviceFrames'
import AssistantOverlay from '../../components/AssistantOverlay'
import AccessibilityPanel from '../../components/phone/AccessibilityPanel'
import ExitButton from '../../components/ExitButton'

// ── ASSISTANT STEPS CONFIG ─────────────────────────────────────────
function getAssistantSteps(theme) {
  const c = theme.primary
  return [
  {
    tag: 'Fai così',
    text: (<>Clicca su <strong style={{ color: c }}>PRENOTAZIONI</strong> per iniziare!</>),
    highlightSelector: '[data-highlight="prenotazioni"]',
  },
  {
    tag: 'Fai così',
    text: (<>Fai CLICK su <strong style={{ color: c }}>AGGIUNGI PRENOTAZIONE</strong>!</>),
    highlightSelector: '[data-highlight="aggiungi"]',
  },
  {
    tag: 'Come compilare il form',
    isTutorialMode: true,
    text: (
      <div style={{ textAlign: 'left' }}>
        {[
          { n: '1', title: 'Leggi le etichette', desc: 'Le scritte sopra i rettangoli ti dicono cosa inserire', color: '#E0F5F3', accent: '#1A9E8F' },
          { n: '2', title: 'Tocca i rettangoli bianchi', desc: 'Clicca sul campo e scrivi le informazioni richieste', color: '#FFF0E0', accent: '#D4720A' },
          { n: '3', title: 'Premi il pulsante in fondo', desc: 'Quando hai finito, premi il bottone per inviare', color: '#EEF0FF', accent: '#5C60C0' },
        ].map(s => (
          <div key={s.n} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '14px 16px', background: s.color, borderRadius: '14px', marginBottom: '12px' }}>
            <div style={{ width: '34px', height: '34px', background: s.accent, borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '16px', fontWeight: 900, color: 'white' }}>{s.n}</span>
            </div>
            <div>
              <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 800, color: '#1A1A1A', marginBottom: '4px' }}>{s.title}</p>
              <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 600, color: '#4B5563', lineHeight: 1.5 }}>{s.desc}</p>
            </div>
          </div>
        ))}
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 700, color: c, marginTop: '14px', marginBottom: 0 }}>
          Poi premi <strong>HO CAPITO</strong> sul totem per iniziare →
        </p>
      </div>
    ),
    highlightSelector: '[data-highlight="continua"]',
  },
  {
    tag: 'Passo 1',
    text: (<>COMPILA IL FORM! Inserisci i dati che trovi sul documento, iniziamo con il <strong>NRE di SINISTRA</strong>!</>),
    highlightSelector: '[data-highlight="nre-sx"]',
  },
  {
    tag: 'Passo 2',
    text: (<>Ottimo! Ora inserisci il <strong>NRE di DESTRA</strong>.</>),
    highlightSelector: '[data-highlight="nre-dx"]',
  },
  {
    tag: 'Passo 3',
    text: (<>Infine, inserisci il tuo <strong>CODICE FISCALE</strong>.</>),
    highlightSelector: '[data-highlight="cf"]',
  },
  {
    tag: 'Quasi fatto',
    text: (<>Molto bene! Ora <strong>FAI CLICK SUL BOTTONE RICHIEDI</strong> per cercare le disponibilità!</>),
    highlightSelector: '[data-highlight="richiedi-btn"]',
  },
  {
    tag: 'Selezione',
    text: (<><strong>SELEZIONA L'APPUNTAMENTO!</strong></>),
    highlightSelector: '[data-highlight="target-hospital"]',
  },
  {
    tag: 'Conferma',
    text: (<><strong>ABBIAMO FINITO!</strong><br />Conferma la tua prenotazione premendo il bottone <strong>CONFERMA</strong> ↓</>),
    highlightSelector: '[data-highlight="conferma-btn"]',
  },
  {
    tag: 'Grande!',
    text: (<><strong>GRANDE!</strong><br />Prenotazione effettuata! Ora puoi tornare alla schermata principale.</>),
    highlightSelector: '[data-highlight="home-back"]',
  },
  ]
}

// ── JOURNEY MAP ────────────────────────────────────────────────────
const CUP_PHASES = [
  { label: 'Menu' },
  { label: 'Dati' },
  { label: 'Sede' },
  { label: 'Fine' },
]

function getCupPhase(step) {
  if (step <= 1) return 0
  if (step <= 6) return 1
  if (step <= 8) return 2
  return 3
}

function CupJourneyMap({ step }) {
  const theme = useTheme()
  if (step === 0 || step === 9) return null
  const current = getCupPhase(step)
  const p = theme.primary
  const pLight = theme.isHC ? '#1A2A1A' : '#E0F5F3'
  const pBorder = theme.isHC ? '#2A4A2A' : '#A8DDD8'
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '14px' }}>
      {CUP_PHASES.map((phase, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < CUP_PHASES.length - 1 ? '1 1 0' : 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
            <div style={{
              width: i === current ? '44px' : '34px', height: i === current ? '44px' : '34px',
              borderRadius: '11px',
              background: i === current ? p : i < current ? pLight : theme.isHC ? '#2A2A2A' : '#F0F0F0',
              border: `2px solid ${i === current ? theme.primaryDark : i < current ? pBorder : theme.isHC ? '#444' : '#E0E0E0'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              transition: 'all 0.3s',
              boxShadow: i === current ? `0 4px 12px ${p}44` : 'none',
            }}>
              {i < current
                ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7 L6 11 L12 3" stroke={p} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                : <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: i === current ? '12px' : '10px', fontWeight: 800, color: i === current ? theme.isHC ? '#000' : 'white' : theme.isHC ? '#888' : '#B0B0B0' }}>{i + 1}</span>
              }
            </div>
            <span style={{ fontSize: i === current ? '10px' : '9px', fontWeight: i === current ? 800 : 600, color: i === current ? p : i < current ? p : theme.isHC ? '#666' : '#B0B0B0', fontFamily: 'Nunito, sans-serif', whiteSpace: 'nowrap' }}>{phase.label}</span>
          </div>
          {i < CUP_PHASES.length - 1 && (
            <div style={{ flex: 1, height: '2px', marginBottom: '16px', minWidth: '6px', background: i < current ? p : theme.isHC ? '#333' : '#E8E8E8', transition: 'background 0.4s' }} />
          )}
        </div>
      ))}
    </div>
  )
}

// ── BACK BUTTON ────────────────────────────────────────────────────
const BackButton = ({ onBack }) => (
  <button
    onClick={onBack}
    style={{
      flex: 1, padding: '16px 12px', borderRadius: '14px',
      border: '2px solid #E0E0E0', background: 'white',
      fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 700,
      color: '#6B7280', cursor: 'pointer', minHeight: '58px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    }}
  >
    <ArrowLeft size={17} /> Indietro
  </button>
)

// ── LEFT PANEL (phone coaching overlay) ───────────────────────────
function PanelLeft({ step, rightPanelContent, rightPanelRef, panelScroll }) {
  const theme = useTheme()
  const zoom = useFontZoom()
  const assistantSteps = getAssistantSteps(theme)
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
      const vw = window.visualViewport?.width ?? window.innerWidth
      const vh = window.visualViewport?.height ?? window.innerHeight
      const outerScale = Math.min(vw / 1180, vh / 820)
      setHighlightZone({
        top: (targetRect.top - panelRect.top) / outerScale,
        left: (targetRect.left - panelRect.left) / outerScale,
        width: targetRect.width / outerScale,
        height: targetRect.height / outerScale,
      })
    }
    
    const scheduleCalculate = () => {
      requestAnimationFrame(() => {
        setTimeout(calculate, 100)
      })
    }

    const timer = setTimeout(calculate, 150)

    const observer = new ResizeObserver(scheduleCalculate)
    if (rightPanelRef?.current) {
      observer.observe(rightPanelRef.current)
      const target = rightPanelRef.current.querySelector(currentStep.highlightSelector)
      if (target) observer.observe(target)
    }

    // Keyboard open/close on Android changes window.innerHeight → rescale needed
    window.addEventListener('resize', calculate)
    // Keyboard open/close on iOS 15+ changes visualViewport but not window.innerHeight
    window.visualViewport?.addEventListener('resize', calculate)
    window.visualViewport?.addEventListener('scroll', calculate)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
      window.removeEventListener('resize', calculate)
      window.visualViewport?.removeEventListener('resize', calculate)
      window.visualViewport?.removeEventListener('scroll', calculate)
    }
  }, [step, currentStep.highlightSelector, rightPanelRef, zoom, panelScroll])

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
        tutorialMode={!!currentStep.isTutorialMode}
      />
      <AccessibilityPanel />
    </div>
  )
}

// ── STEP COMPONENTS (partner's CUP flow) ──────────────────────────

function StepMenu({ onPrenotazioni, onBack }) {
  const theme = useTheme()
  const voci = [
    { id: 'prenotazioni', icon: <CalendarDays size={38} />, label: 'Prenotazioni' },
    { icon: <Building2 size={38} />, label: 'Strutture' },
    { icon: <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>, label: 'Come fare' },
    { icon: <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4"/><path d="M16 2v4M8 2v4M3 10h7"/><path d="M2 22l5-5M7 22l-5-5"/></svg>, label: 'News' },
    { icon: <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 11.9 19.79 19.79 0 0 1 1.05 3.27 2 2 0 0 1 3 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16l.92.92z"/></svg>, label: 'Contatti' },
    { icon: <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>, label: 'Modulistica' },
  ]
  return (
    <div style={{ height: '100%', background: theme.bg, display: 'flex', flexDirection: 'column', textAlign: 'center', padding: '0 20px 20px' }}>
      <h1 style={{ padding: '32px 0 16px', fontSize: '26px', fontWeight: 900, color: theme.text, fontFamily: 'Nunito, sans-serif' }}>Sanità pubblica</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', flex: 1 }}>
        {voci.map((v, i) => {
          const isPrenotazioni = v.id === 'prenotazioni'
          return (
            <div
              key={i}
              data-highlight={isPrenotazioni ? 'prenotazioni' : null}
              onClick={isPrenotazioni ? onPrenotazioni : null}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px',
                cursor: isPrenotazioni ? 'pointer' : 'default',
                padding: '14px 8px', borderRadius: '14px',
                background: theme.surface,
                border: `2px solid ${theme.border}`,
                color: theme.textSecondary,
              }}
            >
              {v.icon}
              <span style={{ fontWeight: 700, fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: theme.text }}>{v.label}</span>
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: '16px', paddingTop: '4px' }}>
        <BackButton onBack={onBack} />
      </div>
    </div>
  )
}

function StepOptions({ onNext, onBack }) {
  const theme = useTheme()
  return (
    <div style={{ height: '100%', background: theme.bg, padding: '24px 20px 20px', display: 'flex', flexDirection: 'column' }}>
      <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 700, color: theme.primary, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '6px' }}>CUP · Prenotazioni</p>
      <CupJourneyMap step={1} />
      <h2 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '24px', fontWeight: 900, color: theme.text, marginBottom: '20px' }}>Prenotazioni</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        {[
          { id: 'aggiungi', icon: <PlusCircle color={theme.text} />, label: 'Aggiungi Prenotazione', onClick: onNext },
          { id: 'recupera', icon: <Download color={theme.text} />, label: 'Recupera Prenotazione' },
          { id: 'elenca', icon: <List color={theme.text} />, label: 'Elenca prenotazioni' },
        ].map(b => (
          <button
            key={b.id}
            data-highlight={b.id === 'aggiungi' ? 'aggiungi' : undefined}
            onClick={b.onClick}
            style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '18px', border: `1.5px solid ${theme.border}`, borderRadius: '14px', background: theme.surface, fontWeight: 800, textAlign: 'left', cursor: b.onClick ? 'pointer' : 'default', fontFamily: 'Nunito, sans-serif', color: theme.text, minHeight: '64px' }}
          >
            {b.icon} <span>{b.label}</span>
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '16px' }}>
        <BackButton onBack={onBack} />
      </div>
    </div>
  )
}

function StepTutorialScreen({ onNext, onBack }) {
  const theme = useTheme()
  return (
    <div style={{ height: '100%', background: theme.bg, display: 'flex', flexDirection: 'column', padding: '40px 28px 20px', textAlign: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
        <div style={{ width: '72px', height: '72px', background: theme.primaryLight, borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
          <svg viewBox="0 0 36 36" fill="none" width="40" height="40">
            <rect x="6" y="2" width="18" height="28" rx="4" stroke={theme.primary} strokeWidth="2" fill="none"/>
            <rect x="10" y="8" width="10" height="2.5" rx="1.25" fill={theme.primary} opacity="0.5"/>
            <rect x="10" y="13" width="10" height="2.5" rx="1.25" fill={theme.primary} opacity="0.5"/>
            <rect x="10" y="18" width="7" height="2.5" rx="1.25" fill={theme.primary} opacity="0.5"/>
            <path d="M26 20 L34 20 M30 16 L34 20 L30 24" stroke={theme.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '24px', fontWeight: 900, color: theme.text, lineHeight: 1.25, marginBottom: '10px' }}>
          Leggi il tutorial<br />sul telefono
        </h2>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 600, color: theme.textSecondary, lineHeight: 1.6, maxWidth: '260px', marginBottom: '24px' }}>
          Il tuo assistente ti spiega come compilare il form. Leggilo e poi torna qui.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: theme.primaryLight, border: `1.5px solid ${theme.borderStrong}`, borderRadius: '12px', padding: '10px 16px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="6" y="2.5" width="12" height="19" rx="3" stroke={theme.primary} strokeWidth="1.8"/>
            <rect x="9" y="6.2" width="6" height="8.2" rx="1.5" fill={theme.primaryLight} stroke={theme.primary} strokeWidth="1.2"/>
            <path d="M10 18.2h4" stroke={theme.primary} strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 700, color: theme.primary }}>Guarda lo schermo dell'assistente →</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '16px' }}>
        <BackButton onBack={onBack} />
        <button
          data-highlight="continua"
          onClick={onNext}
          style={{
            flex: 2, padding: '16px', borderRadius: '14px', border: 'none', minHeight: '58px',
            background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)`,
            color: theme.primaryText, fontWeight: 800, cursor: 'pointer',
            fontFamily: 'Nunito, sans-serif', fontSize: '15px',
            boxShadow: `0 4px 16px ${theme.primary}55`,
          }}
        >
          Ho capito, inizia! →
        </button>
      </div>
    </div>
  )
}

function StepFormScreen({ currentStep, setStep, onNext, onBack }) {
  const theme = useTheme()
  const { state, setState } = useApp()
  const valSx = state.cupForm?.nreSx || ''
  const valDx = state.cupForm?.nreDx || ''
  const valCf = state.cupForm?.cf || ''

  const setValSx = (value) => setState(s => ({ ...s, cupForm: { ...s.cupForm, nreSx: value } }))
  const setValDx = (value) => setState(s => ({ ...s, cupForm: { ...s.cupForm, nreDx: value } }))
  const setValCf = (value) => setState(s => ({ ...s, cupForm: { ...s.cupForm, cf: value } }))

  useEffect(() => {
    if (valSx.length === 5 && currentStep === 3) setStep(4)
    if (valDx.length === 10 && currentStep === 4) setStep(5)
    if (valCf.length === 16 && currentStep === 5) setStep(6)
  }, [valSx, valDx, valCf, currentStep, setStep])

  useEffect(() => {
    setState(s => ({ ...s, buttonState: { ...s.buttonState, cupReady: valCf.length === 16 } }))
  }, [valCf.length, setState])

  const fieldWrap = (active) => ({
    border: active ? `2px solid ${theme.primary}` : `2px solid ${theme.border}`,
    padding: '14px 16px', borderRadius: '14px', background: 'white',
    transition: 'all 0.3s ease', opacity: active ? 1 : 0.65,
  })
  const inputStyle = { width: '100%', border: 'none', fontSize: '18px', outline: 'none', fontWeight: 700, fontFamily: 'Nunito, sans-serif', background: 'white', color: '#1A1A1A', boxSizing: 'border-box' }

  return (
    <div style={{ height: '100%', background: theme.bg, padding: '24px 20px 20px', display: 'flex', flexDirection: 'column' }}>
      <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 700, color: theme.primary, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '6px' }}>CUP · Prenotazioni</p>
      <CupJourneyMap step={currentStep} />
      <h3 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, margin: '0 0 16px', color: theme.text, fontSize: '22px' }}>Aggiungi Prenotazione</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        <div data-highlight="nre-sx" style={fieldWrap(currentStep === 3)}>
          <label style={{ fontSize: '11px', fontWeight: 800, color: theme.muted, display: 'block', marginBottom: '6px', fontFamily: 'Nunito, sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Codice NRE Sinistra</label>
          <input value={valSx} onChange={(e) => setValSx(e.target.value.toUpperCase())} onFocus={() => setStep(3)} maxLength={5} placeholder="xxxxx" style={inputStyle} />
        </div>
        <div data-highlight="nre-dx" style={fieldWrap(currentStep === 4)}>
          <label style={{ fontSize: '11px', fontWeight: 800, color: theme.muted, display: 'block', marginBottom: '6px', fontFamily: 'Nunito, sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Codice NRE Destra</label>
          <input value={valDx} onChange={(e) => setValDx(e.target.value)} onFocus={() => setStep(4)} maxLength={10} placeholder="xxxxxxxxxx" style={inputStyle} />
        </div>
        <div data-highlight="cf" style={fieldWrap(currentStep === 5)}>
          <label style={{ fontSize: '11px', fontWeight: 800, color: theme.muted, display: 'block', marginBottom: '6px', fontFamily: 'Nunito, sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Codice Fiscale</label>
          <input value={valCf} onChange={(e) => setValCf(e.target.value.toUpperCase())} onFocus={() => setStep(5)} maxLength={16} placeholder="XXXXX..." style={inputStyle} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '16px' }}>
        <BackButton onBack={onBack} />
        <button
          data-highlight="richiedi-btn"
          onClick={valCf.length === 16 ? onNext : undefined}
          style={{
            flex: 2, padding: '16px', borderRadius: '14px', border: 'none', minHeight: '58px',
            background: valCf.length === 16 ? `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)` : theme.border,
            color: valCf.length === 16 ? theme.primaryText : theme.muted,
            fontWeight: 800, cursor: valCf.length === 16 ? 'pointer' : 'default',
            fontFamily: 'Nunito, sans-serif', fontSize: '15px',
            boxShadow: valCf.length === 16 ? `0 4px 16px ${theme.primary}55` : 'none',
          }}
        >
          {valCf.length === 16 ? 'Richiedi →' : 'Completa i campi'}
        </button>
      </div>
    </div>
  )
}

function StepResults({ onNext, onBack, isReplica, listScrollTop = 0, onListScroll }) {
  const theme = useTheme()
  const sedi = [
    { h: 'Ospedale Molinette', s: 'Via San Maurizio - Torino', d: '11/07/2026 - 12:30' },
    { h: 'Ospedale Santa Maria', s: 'Corso Vercelli - Torino', d: '29/06/2026 - 18:30' },
    { h: 'Ospedale San Pietro', s: 'Corso Ottomano - Torino', d: '21/07/2026 - 14:00', target: true },
    { h: 'Ospedale Santa Agata', s: 'Via Verdi - Vercelli', d: '13/07/2026 - 09:30' },
  ]
  const items = sedi.map((s, i) => (
    <div
      key={i}
      data-highlight={s.target ? 'target-hospital' : null}
      onClick={!isReplica ? onNext : undefined}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '24px 20px', borderBottom: `1px solid ${theme.border}`, cursor: !isReplica ? 'pointer' : 'default',
        background: 'transparent', textAlign: 'center', minHeight: '140px', width: '100%',
      }}
    >
      <CalendarDays style={{ marginBottom: '12px', color: theme.primary, flexShrink: 0 }} size={36} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0' }}>
        <div style={{ fontWeight: 800, fontSize: '16px', fontFamily: 'Nunito, sans-serif', color: theme.text, marginBottom: '6px' }}>{s.h}</div>
        <div style={{ fontSize: '12px', color: theme.textSecondary, fontFamily: 'Nunito, sans-serif', marginBottom: '8px' }}>{s.s}</div>
        <div style={{ fontSize: '13px', fontWeight: 700, color: theme.primary, fontFamily: 'Nunito, sans-serif' }}>{s.d}</div>
      </div>
    </div>
  ))
  return (
    <div style={{ height: '100%', background: theme.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px 20px 0' }}>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 700, color: theme.primary, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '6px' }}>CUP · Prenotazioni</p>
        <CupJourneyMap step={7} />
        <h3 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '22px', color: theme.text, marginBottom: '12px' }}>Prime Disponibilità</h3>
      </div>
      <div
        onScroll={!isReplica ? e => onListScroll?.(e.currentTarget.scrollTop) : undefined}
        style={{
          flex: 1,
          overflow: isReplica ? 'hidden' : 'auto',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0, transform: isReplica ? `translateY(-${listScrollTop}px)` : undefined }}>
          {items}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px', padding: '12px 20px' }}>
        <BackButton onBack={onBack} />
      </div>
    </div>
  )
}

function StepConfirm({ onNext, onBack }) {
  const theme = useTheme()
  return (
    <div style={{ height: '100%', background: theme.bg, padding: '24px 24px 20px', display: 'flex', flexDirection: 'column' }}>
      <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 700, color: theme.primary, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '6px' }}>CUP · Conferma</p>
      <CupJourneyMap step={8} />
      <h3 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '22px', color: theme.text, marginBottom: '20px' }}>Dettaglio prenotazione</h3>
      <div style={{ flex: 1 }}>
        {[
          { icon: <Building2 size={20} color={theme.primary} />, label: 'Sede', value: 'Ospedale San Pietro, Corso Ottomano - Torino' },
          { icon: <CalendarDays size={20} color={theme.primary} />, label: 'Data e ora', value: '21/07/2026 - 14:00' },
        ].map((row, i) => (
          <div key={i} style={{ display: 'flex', gap: '14px', marginBottom: '18px', padding: '14px', background: theme.surface, borderRadius: '14px', border: `1.5px solid ${theme.border}`, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ width: '40px', height: '40px', background: theme.primaryLight, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {row.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '13px', color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: 'Nunito, sans-serif', marginBottom: '3px' }}>{row.label}</div>
              <div style={{ fontWeight: 700, fontSize: '15px', color: theme.text, fontFamily: 'Nunito, sans-serif' }}>{row.value}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
        <BackButton onBack={onBack} />
        <button data-highlight="conferma-btn" onClick={onNext} style={{ flex: 2, padding: '16px', background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)`, color: theme.primaryText, borderRadius: '14px', fontWeight: 900, border: 'none', cursor: 'pointer', fontSize: '15px', fontFamily: 'Nunito, sans-serif', minHeight: '58px', boxShadow: `0 4px 16px ${theme.primary}55` }}>
          Conferma prenotazione →
        </button>
      </div>
    </div>
  )
}

function StepSuccess({ onHome }) {
  const theme = useTheme()
  return (
    <div style={{ height: '100%', background: theme.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center' }}>
      <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: theme.primaryLight, border: `3px solid ${theme.primary}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
        <CheckCircle2 size={48} color={theme.primary} />
      </div>
      <h1 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '8px', color: theme.text, fontFamily: 'Nunito, sans-serif' }}>Prenotazione<br />Effettuata!</h1>
      <p style={{ color: theme.textSecondary, fontFamily: 'Nunito, sans-serif', lineHeight: 1.6 }}>Ospedale San Pietro<br /><strong style={{ color: theme.primary }}>21/07/2026 - 14:00</strong></p>
      <button data-highlight="home-back" onClick={onHome} style={{ marginTop: 'auto', width: '100%', padding: '18px', background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)`, color: theme.primaryText, borderRadius: '14px', fontWeight: 800, cursor: 'pointer', border: 'none', fontFamily: 'Nunito, sans-serif', fontSize: '15px', minHeight: '58px', boxShadow: `0 4px 16px ${theme.primary}55` }}>
        Torna alla schermata principale
      </button>
    </div>
  )
}

// ── MAIN EXPORT ────────────────────────────────────────────────────
export default function CUP() {
  const [step, setStep] = useState(0)
  const [panelScroll, setPanelScroll] = useState(0)
  const [resultsScroll, setResultsScroll] = useState(0)
  const { setState } = useApp()
  const rightPanelRef = useRef(null)
  const zoom = useFontZoom()

  const goHome = () => setState(s => ({ ...s, currentScreen: 'home', currentStep: 0 }))
  const disconnect = () => setState(s => ({ ...s, currentScreen: 'pairing', paired: false, currentStep: 0 }))

  const renderContent = (interactive) => {
    const props = interactive
      ? { onNext: () => setStep(s => s + 1), onBack: () => setStep(s => s - 1), onPrenotazioni: () => setStep(1), onHome: goHome, currentStep: step, setStep }
      : { onNext: () => {}, onBack: () => {}, onPrenotazioni: () => {}, onHome: () => {}, currentStep: step, setStep: () => {} }

    switch (step) {
      case 0: return <StepMenu onPrenotazioni={props.onPrenotazioni} onBack={goHome} />
      case 1: return <StepOptions onNext={props.onNext} onBack={props.onBack} />
      case 2: return <StepTutorialScreen onNext={props.onNext} onBack={interactive ? () => setStep(1) : () => {}} />
      case 3:
      case 4:
      case 5:
      case 6: return <StepFormScreen {...props} onBack={interactive ? () => setStep(2) : () => {}} />
      case 7: return (
        <StepResults
          onNext={props.onNext}
          onBack={interactive ? () => setStep(3) : () => {}}
          isReplica={!interactive}
          listScrollTop={resultsScroll}
          onListScroll={interactive ? setResultsScroll : undefined}
        />
      )
      case 8: return <StepConfirm onNext={props.onNext} onBack={props.onBack} />
      case 9: return <StepSuccess onHome={props.onHome} />
      default: return null
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '80px', height: '820px' }}>
      <PhoneFrame>
        <PanelLeft step={step} rightPanelContent={renderContent(false)} rightPanelRef={rightPanelRef} panelScroll={panelScroll + resultsScroll} />
      </PhoneFrame>
      <TotemFrame>
        <div ref={rightPanelRef} style={{ width: '390px', height: '740px', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
          <div
            onScroll={(e) => setPanelScroll(e.currentTarget.scrollTop)}
            style={{ width: `${390/zoom}px`, height: `${740/zoom}px`, zoom, overflowY: 'auto', overflowX: 'hidden' }}
          >
            {renderContent(true)}
          </div>
          <ExitButton onClick={disconnect} />
        </div>
      </TotemFrame>
    </div>
  )
}
