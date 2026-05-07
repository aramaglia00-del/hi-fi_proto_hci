import { useState, useEffect, useRef } from 'react'
import { QrCode, Keyboard, Building2, FileText, DollarSign, Hash, CreditCard, ChevronRight, ArrowLeft, Tag, Check } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import AssistantOverlay from '../../components/AssistantOverlay'

// ── STEP CONFIG ────────────────────────────────────────────────────
const assistantSteps = [
  {
    tag: '👆 Cosa fare adesso',
    text: (<>Tocca il pulsante <strong style={{ color: '#1A9E8F' }}>Inquadra il codice QR</strong> qui a fianco per iniziare il pagamento.</>),
    highlightSelector: '[data-highlight="qr"]',
  },
  {
    tag: '📷 Come si fa',
    text: (<><strong style={{ color: '#1A9E8F' }}>1.</strong> Tieni il bollettino davanti alla fotocamera<br /><strong style={{ color: '#1A9E8F' }}>2.</strong> Aspetta che legga il codice<br /><strong style={{ color: '#1A9E8F' }}>3.</strong> Tocca il link che appare</>),
    highlightSelector: '[data-highlight="scanner"]',
  },
  {
    tag: '✅ Controlla i dati',
    text: (<>Leggi i dati qui a fianco e verifica che siano corretti.<br />Poi tocca <strong style={{ color: '#1A9E8F' }}>VAI AL PAGAMENTO</strong>.</>),
    highlightSelector: '[data-highlight="cta"]',
  },
  {
    tag: '✉️ Scrivi la tua email',
    text: (<>Tocca il campo <strong style={{ color: '#1A9E8F' }}>Email</strong> e scrivi il tuo indirizzo. Riceverai la ricevuta di pagamento lì.</>),
    highlightSelector: '[data-highlight="email"]',
  },
  {
    tag: '🔁 Riscrivi l\'email',
    text: (<>Tocca il secondo campo e riscrivi la stessa email.<br />Serve per <strong style={{ color: '#1A9E8F' }}>confermare</strong> che sia giusta.</>),
    highlightSelector: '[data-highlight="email-confirm"]',
  },
  {
    tag: '✅ Bene! Ora continua',
    text: (<>Email inserita correttamente. Tocca il pulsante verde <strong style={{ color: '#1A9E8F' }}>Continua</strong> qui in basso.</>),
    highlightSelector: '[data-highlight="continua"]',
  },
  {
    tag: '👆 Scorri verso l\'alto',
    text: (<>Muovi il dito <strong style={{ color: '#1A9E8F' }}>dal basso verso l'alto</strong> sulla lista qui a fianco per trovare il metodo di pagamento giusto.</>),
    highlightSelector: null,
  },
  {
    tag: '💳 Tocca questo',
    text: (<>Tocca <strong style={{ color: '#1A9E8F' }}>Carta di debito o credito</strong> — è quella evidenziata qui a fianco.</>),
    highlightSelector: '[data-highlight="carta-credito"]',
  },
  {
    tag: '💳 Numero della carta',
    text: 'Tocca il primo campo e scrivi le 16 cifre che trovi sul fronte della carta.',
    highlightSelector: '[data-highlight="card-number"]',
  },
  {
    tag: '📅 Data di scadenza',
    text: "Tocca il campo «MM/AA» e scrivi prima il mese, poi l'anno. Li trovi sul fronte della carta.",
    highlightSelector: '[data-highlight="card-expiry"]',
  },
  {
    tag: '🔒 Codice CVV',
    text: 'Tocca il campo CVV e scrivi le 3 cifre che trovi sul RETRO della carta (in basso a destra).',
    highlightSelector: '[data-highlight="card-cvv"]',
  },
  {
    tag: '👤 Nome sulla carta',
    text: "Tocca l'ultimo campo e scrivi il nome e cognome come appaiono stampati sulla tua carta.",
    highlightSelector: '[data-highlight="card-name"]',
  },
  {
    tag: '✅ Ottimo! Quasi finito',
    text: 'Hai inserito tutti i dati. Tocca il pulsante verde CONTINUA per proseguire.',
    highlightSelector: '[data-highlight="card-continua"]',
  },
  {
    tag: '💰 Conferma il pagamento',
    text: (<>Controlla il <strong style={{ color: '#1A9E8F' }}>TOTALE</strong>. Se va bene, tocca <strong style={{ color: '#1A9E8F' }}>PAGA</strong> per completare il pagamento.</>),
    highlightSelector: '[data-highlight="paga-btn"]',
  },
  {
    tag: '🎉 Bravissimo!',
    text: "Hai completato il pagamento con successo! Riceverai una ricevuta via email.",
    highlightSelector: null,
  },
]

// ── PHASE INDICATOR ────────────────────────────────────────────────
const PHASES = ['Avviso', 'Email', 'Metodo', 'Carta', 'Conferma']

function getPhase(step) {
  if (step <= 2) return 0
  if (step <= 5) return 1
  if (step <= 7) return 2
  if (step <= 12) return 3
  return 4
}

function PhaseIndicator({ step }) {
  if (step >= 14) return null
  const current = getPhase(step)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', marginBottom: '16px', marginTop: '2px' }}>
      {PHASES.map((label, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <div style={{
            height: '5px', width: '100%', borderRadius: '3px',
            background: i < current ? '#A8DDD8' : i === current ? '#1A9E8F' : '#E8E8E8',
            transition: 'background 0.3s',
          }} />
          <span style={{
            fontSize: '10px', fontWeight: i === current ? 800 : 600,
            color: i === current ? '#1A9E8F' : '#C0C0C0',
            fontFamily: 'Nunito, sans-serif', whiteSpace: 'nowrap',
          }}>{label}</span>
        </div>
      ))}
    </div>
  )
}

// ── LEFT PANEL ─────────────────────────────────────────────────────
function PanelLeft({ step, rightPanelContent, rightPanelRef, showGesture, overrideHighlightZone, leftPanelRef, forceTop }) {
  const { tag, text, highlightSelector } = assistantSteps[step]
  const [highlightZone, setHighlightZone] = useState(null)

  useEffect(() => {
    if (overrideHighlightZone === undefined) return
    setHighlightZone(overrideHighlightZone)
  }, [overrideHighlightZone])

  useEffect(() => {
    if (overrideHighlightZone !== undefined) return
    const computeZone = () => {
      if (!highlightSelector || !rightPanelRef?.current) return null
      const target = rightPanelRef.current.querySelector(highlightSelector)
      if (!target) return null
      const targetRect = target.getBoundingClientRect()
      const panelRect = rightPanelRef.current.getBoundingClientRect()
      const scale = Math.min(window.innerWidth / 1180, window.innerHeight / 820)
      return {
        top: (targetRect.top - panelRect.top) / scale,
        left: (targetRect.left - panelRect.left) / scale,
        width: targetRect.width / scale,
        height: targetRect.height / scale,
      }
    }
    const timer = setTimeout(() => setHighlightZone(computeZone()), 150)
    const resizeObserver = new ResizeObserver(() => setHighlightZone(computeZone()))
    if (rightPanelRef?.current) resizeObserver.observe(rightPanelRef.current)
    return () => { clearTimeout(timer); resizeObserver.disconnect() }
  }, [highlightSelector, rightPanelRef, overrideHighlightZone])

  const phase = getPhase(step)

  return (
    <div ref={leftPanelRef} style={{ width: '390px', height: '740px', flexShrink: 0, position: 'relative', overflow: 'hidden', background: '#FFF8F0' }}>

      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', filter: 'blur(1.5px)' }}>
        {rightPanelContent}
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.48)', pointerEvents: 'none', zIndex: 1 }} />

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

      {/* Phase badge */}
      {step < 14 && (
        <div style={{
          position: 'absolute', top: 13, right: 13, zIndex: 12,
          background: '#1A9E8F', color: 'white',
          borderRadius: '20px', padding: '6px 13px',
          fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 800,
          letterSpacing: '0.3px', boxShadow: '0 3px 12px rgba(26,158,143,0.4)',
        }}>
          {PHASES[phase]}
        </div>
      )}

      <AssistantOverlay
        tag={tag} text={text}
        highlightZone={highlightZone}
        showGesture={showGesture}
        forceTop={forceTop}
      />
    </div>
  )
}

// ── SHARED STYLES ──────────────────────────────────────────────────
const fieldLabel = (text) => (
  <label style={{
    display: 'block', fontFamily: 'Nunito, sans-serif',
    fontSize: '15px', fontWeight: 700, color: '#1A1A1A',
    marginBottom: '7px',
  }}>{text}</label>
)

const fieldHelper = (text) => (
  <p style={{
    fontFamily: 'Nunito, sans-serif', fontSize: '13px',
    fontWeight: 500, color: '#6B7280', margin: '5px 0 0', lineHeight: 1.4,
  }}>{text}</p>
)

const inputBase = {
  background: '#FFFFFF', color: '#1A1A1A',
  borderRadius: '12px', padding: '16px 16px',
  fontSize: '17px', fontFamily: 'Nunito, sans-serif', fontWeight: 600,
  width: '100%', outline: 'none',
  WebkitAppearance: 'none', appearance: 'none', boxSizing: 'border-box',
  minHeight: '54px',
}

// ── STEP 0 ─────────────────────────────────────────────────────────
function StepSceltaMetodo({ onQR, onBack }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '28px 24px 24px', background: '#FFF8F0' }}>
      <div style={{ marginBottom: '22px' }}>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 700, color: '#1A9E8F', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '6px' }}>PagoPA · Pagamento</p>
        <PhaseIndicator step={0} />
        <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '24px', fontWeight: 900, color: '#1A1A1A', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: '8px' }}>Paga un avviso</h1>
        <p style={{ fontSize: '15px', color: '#5A5755', lineHeight: 1.6, fontWeight: 600 }}>Come preferisci inserire i dati?</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <button
          data-highlight="qr"
          onClick={onQR}
          style={{ display: 'flex', alignItems: 'center', gap: '18px', padding: '20px 18px', borderRadius: '18px', border: '2.5px solid #1A9E8F', background: '#F0FDFB', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', textAlign: 'left', width: '100%', boxShadow: '0 2px 12px rgba(26,158,143,0.12)', minHeight: '84px' }}
        >
          <div style={{ width: '54px', height: '54px', borderRadius: '15px', background: '#E0F5F3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <QrCode size={30} color="#1A9E8F" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
              <span style={{ fontSize: '17px', fontWeight: 800, color: '#1A1A1A', lineHeight: 1.2 }}>Inquadra il codice QR</span>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#1A9E8F', background: '#E0F5F3', padding: '2px 8px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Consigliato</span>
            </div>
            <span style={{ fontSize: '14px', color: '#6B7280', display: 'block', fontWeight: 600 }}>Usa la fotocamera sul bollettino</span>
          </div>
          <ChevronRight size={22} color="#1A9E8F" />
        </button>
        <button style={{ display: 'flex', alignItems: 'center', gap: '18px', padding: '20px 18px', borderRadius: '18px', border: '2px solid #E0E0E0', background: 'white', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', textAlign: 'left', width: '100%', minHeight: '84px' }}>
          <div style={{ width: '54px', height: '54px', borderRadius: '15px', background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Keyboard size={28} color="#9CA3AF" />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '17px', fontWeight: 800, color: '#1A1A1A', display: 'block', lineHeight: 1.2, marginBottom: '3px' }}>Digita il codice</span>
            <span style={{ fontSize: '14px', color: '#6B7280', display: 'block', fontWeight: 600 }}>Inserisci manualmente i numeri</span>
          </div>
          <ChevronRight size={22} color="#C0C0C0" />
        </button>
      </div>
      <div style={{ marginTop: 'auto', paddingTop: '18px' }}>
        <button onClick={onBack} style={{ padding: '15px 20px', borderRadius: '14px', border: '2px solid #E0E0E0', background: 'white', fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 700, color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={17} />
          Torna alla schermata principale
        </button>
      </div>
    </div>
  )
}

// ── STEP 1 ─────────────────────────────────────────────────────────
function StepInquadraQR({ onNext, onBack }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '28px 24px 24px', background: '#FFF8F0' }}>
      <div style={{ marginBottom: '18px' }}>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 700, color: '#1A9E8F', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '6px' }}>PagoPA</p>
        <PhaseIndicator step={1} />
        <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '24px', fontWeight: 900, color: '#1A1A1A', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: '6px' }}>Inquadra il<br />codice QR</h1>
        <p style={{ fontSize: '15px', color: '#5A5755', lineHeight: 1.6, fontWeight: 600 }}>Tieni il bollettino davanti alla fotocamera</p>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          data-highlight="scanner"
          style={{ width: '252px', height: '252px', borderRadius: '20px', background: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}
        >
          <div style={{ position: 'absolute', top: '18px', left: '18px', width: '36px', height: '36px', borderTop: '4px solid #1A9E8F', borderLeft: '4px solid #1A9E8F', borderRadius: '4px 0 0 0' }} />
          <div style={{ position: 'absolute', top: '18px', right: '18px', width: '36px', height: '36px', borderTop: '4px solid #1A9E8F', borderRight: '4px solid #1A9E8F', borderRadius: '0 4px 0 0' }} />
          <div style={{ position: 'absolute', bottom: '18px', left: '18px', width: '36px', height: '36px', borderBottom: '4px solid #1A9E8F', borderLeft: '4px solid #1A9E8F', borderRadius: '0 0 0 4px' }} />
          <div style={{ position: 'absolute', bottom: '18px', right: '18px', width: '36px', height: '36px', borderBottom: '4px solid #1A9E8F', borderRight: '4px solid #1A9E8F', borderRadius: '0 0 4px 0' }} />
          <QrCode size={96} color="white" opacity={0.6} />
          <style>{`@keyframes scan{0%{top:28px}100%{top:calc(100% - 28px)}}`}</style>
          <div style={{ position: 'absolute', left: '18px', right: '18px', height: '2px', background: 'rgba(26,158,143,0.85)', boxShadow: '0 0 8px #1A9E8F', animation: 'scan 1.8s ease-in-out infinite alternate' }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
        <button onClick={onBack} style={{ flex: 1, padding: '16px 12px', borderRadius: '14px', border: '2px solid #E0E0E0', background: 'white', fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 700, color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', minHeight: '58px' }}>
          <ArrowLeft size={17} />
          Indietro
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '28px 24px 24px', background: '#FFF8F0' }}>
      <div style={{ marginBottom: '14px' }}>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 700, color: '#1A9E8F', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '6px' }}>PagoPA</p>
        <PhaseIndicator step={2} />
        <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '24px', fontWeight: 900, color: '#1A1A1A', letterSpacing: '-0.5px', lineHeight: 1.2 }}>Dati del<br />pagamento</h1>
      </div>
      <div style={{ background: '#FFF9F0', border: '1.5px solid #FFE0B0', borderRadius: '12px', padding: '10px 14px', marginBottom: '12px' }}>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 600, color: '#B07000', margin: 0, lineHeight: 1.5 }}>
          ⚠️ Controlla che questi dati corrispondano al tuo bollettino.
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
        <button data-highlight="cta" onClick={onNext} style={{ flex: 2, padding: '16px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #1A9E8F 0%, #147A6E 100%)', fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 800, color: 'white', cursor: 'pointer', boxShadow: '0 4px 16px rgba(26,158,143,0.35)', minHeight: '58px' }}>
          Vai al pagamento →
        </button>
      </div>
    </div>
  )
}

// ── STEP 3-5: email ────────────────────────────────────────────────
const isValidEmail = val => val.includes('@') && val.includes('.') && val.length > 5

function StepInserisciEmail({ onBack, onNext, onStepChange }) {
  const { setState: setAppState } = useApp()
  const [email, setEmail] = useState('')
  const [emailConfirm, setEmailConfirm] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [isConfirmFocused, setIsConfirmFocused] = useState(false)
  const [email1Touched, setEmail1Touched] = useState(false)
  const [confirmTouched, setConfirmTouched] = useState(false)

  const isValid = isValidEmail(email) && emailConfirm === email
  const email1Error = email1Touched && !isValidEmail(email)
  const confirmError = confirmTouched && emailConfirm !== email

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '28px 24px 24px', background: '#FFF8F0' }}>
      <style>{`input::placeholder { color: #B0ADA8; font-weight: 400; }`}</style>
      <div style={{ marginBottom: '20px' }}>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 700, color: '#1A9E8F', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '6px' }}>PagoPA</p>
        <PhaseIndicator step={3} />
        <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '24px', fontWeight: 900, color: '#1A1A1A', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: '6px' }}>La tua email</h1>
        <p style={{ fontSize: '15px', color: '#5A5755', lineHeight: 1.6, fontWeight: 600 }}>Riceverai qui la ricevuta di pagamento</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          {fieldLabel('Indirizzo email')}
          <input
            data-highlight="email"
            type="email"
            placeholder="mario.rossi@email.it"
            value={email}
            onChange={e => { setEmail(e.target.value); onStepChange?.(3) }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => { setIsFocused(false); setEmail1Touched(true); if (isValidEmail(email)) onStepChange?.(4) }}
            style={{ ...inputBase, border: isFocused ? '2px solid #1A9E8F' : email1Error ? '2px solid #C0392B' : '2px solid #D9D6D1' }}
          />
          {email1Error
            ? <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 700, color: '#C0392B', marginTop: '6px', background: '#FFF2F2', borderRadius: '8px', padding: '7px 11px' }}>⚠️ Scrivi un indirizzo email valido (es: nome@email.it)</p>
            : fieldHelper('Esempio: mario.rossi@email.it')
          }
        </div>

        <div>
          {fieldLabel('Ripeti la stessa email')}
          <input
            data-highlight="email-confirm"
            type="email"
            placeholder="Riscrivi la tua email"
            value={emailConfirm}
            onChange={e => {
              const val = e.target.value
              setEmailConfirm(val)
              setConfirmTouched(true)
              if (isValidEmail(email) && val === email) onStepChange?.(5)
              else if (isValidEmail(email)) onStepChange?.(4)
            }}
            onFocus={() => setIsConfirmFocused(true)}
            onBlur={() => setIsConfirmFocused(false)}
            style={{ ...inputBase, border: isConfirmFocused ? '2px solid #1A9E8F' : confirmError ? '2px solid #C0392B' : '2px solid #D9D6D1' }}
          />
          {confirmError
            ? <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 700, color: '#C0392B', marginTop: '6px', background: '#FFF2F2', borderRadius: '8px', padding: '7px 11px' }}>⚠️ Le due email non coincidono. Ricontrolla.</p>
            : fieldHelper('Deve essere identica a quella sopra')
          }
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '18px' }}>
        <button onClick={onBack} style={{ flex: 1, padding: '16px 12px', borderRadius: '14px', border: '2px solid #E0E0E0', background: 'white', fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 700, color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', minHeight: '58px' }}>
          <ArrowLeft size={17} />
          Indietro
        </button>
        <button
          data-highlight="continua"
          onClick={isValid ? () => { setAppState(s => ({ ...s, email })); onNext?.() } : undefined}
          style={{ flex: 2, padding: '16px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #1A9E8F 0%, #147A6E 100%)', fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 800, color: 'white', boxShadow: isValid ? '0 4px 16px rgba(26,158,143,0.35)' : 'none', opacity: isValid ? 1 : 0.45, cursor: isValid ? 'pointer' : 'not-allowed', minHeight: '58px' }}
        >
          {isValid ? 'Continua →' : 'Completa i campi sopra'}
        </button>
      </div>
    </div>
  )
}

// ── STEP 6-7: metodo pagamento ─────────────────────────────────────
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
      ([entry]) => { if (entry.isIntersecting && entry.target === cartaRef.current) onScrollDetectedRef.current?.(entry.target.getBoundingClientRect()) },
      { root: listRef.current, threshold: 0.5 }
    )
    observer.observe(cartaRef.current)
    return () => observer.disconnect()
  }, [isReplica])

  const listItems = paymentMethods.map(m => {
    const isCarta = m.id === 'carta'
    return (
      <div
        key={m.id}
        ref={isCarta && !isReplica ? cartaRef : null}
        data-highlight={isCarta ? 'carta-credito' : undefined}
        onClick={isCarta && !isReplica ? onNext : undefined}
        style={{
          display: 'flex', alignItems: 'center', gap: '16px',
          padding: '16px 14px', borderRadius: '16px', marginBottom: '8px',
          border: isCarta ? '2.5px solid #1A9E8F' : '1.5px solid #E8E8E8',
          background: isCarta ? '#F0FDFB' : 'white',
          cursor: isCarta && !isReplica ? 'pointer' : 'default',
          opacity: isCarta ? 1 : 0.65,
          minHeight: '64px',
        }}
      >
        <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: m.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'Nunito, sans-serif' }}>
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
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 700, color: '#1A9E8F', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '6px' }}>PagoPA</p>
        <PhaseIndicator step={6} />
        <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '24px', fontWeight: 900, color: '#1A1A1A', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: '4px' }}>Come vuoi<br />pagare?</h1>
        <p style={{ fontSize: '14px', color: '#5A5755', lineHeight: 1.6, fontWeight: 600 }}>Scorri e scegli il metodo di pagamento</p>
      </div>

      {isReplica ? (
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          <div style={{ transform: `translateY(-${scrollTop}px)`, transition: 'none' }}>{listItems}</div>
        </div>
      ) : (
        <div ref={listRef} data-highlight="payment-list" onScroll={e => onListScroll?.(e.target.scrollTop)} style={{ flex: 1, overflowY: 'auto', paddingRight: '2px' }}>
          {listItems}
        </div>
      )}

      <div style={{ paddingTop: '10px', paddingBottom: '4px', flexShrink: 0 }}>
        <button onClick={onBack} style={{ padding: '15px 20px', borderRadius: '14px', border: '2px solid #E0E0E0', background: 'white', fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 700, color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', minHeight: '58px' }}>
          <ArrowLeft size={17} />
          Indietro
        </button>
      </div>
    </div>
  )
}

// ── STEP 8-12: dati carta ──────────────────────────────────────────
function StepDatiCarta({ onBack, onNext, onFieldChange }) {
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [name, setName] = useState('')
  const [activeField, setActiveField] = useState(null)

  const isValid = cardNumber.length === 19 && expiry.length === 5 && cvv.length === 3 && name.trim().length >= 2

  useEffect(() => { if (isValid) onFieldChange?.('continua') }, [isValid])

  const handleCardNumber = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 16)
    setCardNumber(digits.replace(/(.{4})/g, '$1 ').trim())
  }
  const handleExpiry = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4)
    setExpiry(digits.length >= 3 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits)
  }
  const handleFocus = (field) => { setActiveField(field); onFieldChange?.(field) }
  const border = (field) => ({ border: activeField === field ? '2px solid #1A9E8F' : '2px solid #D9D6D1' })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '28px 24px 24px', background: '#FFF8F0' }}>
      <style>{`input::placeholder { color: #B0ADA8; font-weight: 400; }`}</style>
      <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 700, color: '#1A9E8F', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '6px' }}>PagoPA</p>
      <PhaseIndicator step={8} />
      <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '22px', fontWeight: 900, color: '#1A1A1A', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: '16px' }}>Dati della carta</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        <div>
          {fieldLabel('Numero carta (16 cifre sul fronte)')}
          <input
            data-highlight="card-number"
            inputMode="numeric" placeholder="0000 0000 0000 0000"
            value={cardNumber} onChange={handleCardNumber}
            onFocus={() => handleFocus('number')} onBlur={() => setActiveField(null)}
            style={{ ...inputBase, ...border('number'), width: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {fieldLabel('Scadenza (sul fronte)')}
            <input
              data-highlight="card-expiry"
              inputMode="numeric" placeholder="MM/AA"
              value={expiry} onChange={handleExpiry}
              onFocus={() => handleFocus('expiry')} onBlur={() => setActiveField(null)}
              style={{ ...inputBase, ...border('expiry'), width: '100%' }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {fieldLabel('CVV (3 cifre retro)')}
            <input
              data-highlight="card-cvv"
              type="password" inputMode="numeric" placeholder="···" maxLength={3}
              value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
              onFocus={() => handleFocus('cvv')} onBlur={() => setActiveField(null)}
              style={{ ...inputBase, ...border('cvv'), width: '100%' }}
            />
          </div>
        </div>

        {/* Card illustration hint */}
        <div style={{ background: '#F8F8F8', borderRadius: '12px', padding: '10px 14px', border: '1.5px solid #E8E8E8' }}>
          <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 600, color: '#6B7280', margin: 0, lineHeight: 1.5 }}>
            💡 CVV = 3 cifre piccole sul <strong>retro</strong> della carta, in basso a destra
          </p>
        </div>

        <div>
          {fieldLabel('Nome del titolare (come sulla carta)')}
          <input
            data-highlight="card-name"
            type="text" placeholder="MARIO ROSSI"
            value={name} onChange={e => setName(e.target.value.toUpperCase())}
            onFocus={() => handleFocus('name')} onBlur={() => setActiveField(null)}
            style={{ ...inputBase, ...border('name'), width: '100%' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', paddingTop: '14px' }}>
        <button onClick={onBack} style={{ flex: 1, padding: '16px 12px', borderRadius: '14px', border: '2px solid #E0E0E0', background: 'white', fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 700, color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', minHeight: '58px' }}>
          <ArrowLeft size={17} />
          Indietro
        </button>
        <button
          data-highlight="card-continua"
          onClick={isValid ? onNext : undefined}
          style={{ flex: 2, padding: '16px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #1A9E8F 0%, #147A6E 100%)', fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 800, color: 'white', opacity: isValid ? 1 : 0.45, cursor: isValid ? 'pointer' : 'not-allowed', boxShadow: isValid ? '0 4px 16px rgba(26,158,143,0.35)' : 'none', minHeight: '58px' }}
        >
          {isValid ? 'Continua →' : 'Completa i campi'}
        </button>
      </div>
    </div>
  )
}

// ── STEP 13: conferma pagamento ────────────────────────────────────
function StepConfermaPagemento({ onBack, onNext }) {
  const { state } = useApp()
  const email = state.email || '—'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '28px 24px 24px', background: '#FFF8F0' }}>

      {/* Totale prominente */}
      <div style={{ background: 'white', borderRadius: '20px', padding: '20px 22px', marginBottom: '14px', border: '2px solid #1A9E8F', boxShadow: '0 4px 20px rgba(26,158,143,0.12)' }}>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 700, color: '#1A9E8F', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Totale da pagare</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '38px', fontWeight: 900, color: '#1A1A1A', lineHeight: 1 }}>36,50</span>
          <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '22px', fontWeight: 800, color: '#1A1A1A' }}>€</span>
        </div>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 500, color: '#6B7280', margin: '6px 0 0', lineHeight: 1.4 }}>
          Di cui 1,50 € di commissione bancaria
        </p>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0' }}>
        {[
          { icon: <CreditCard size={18} color="#6B7280" />, label: 'Metodo', value: 'Carta di credito (**** 3456)' },
          { icon: <Tag size={18} color="#6B7280" />, label: 'Ente creditore', value: 'ASL VERCELLI' },
        ].map((row, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '13px 0', borderBottom: '1px solid #EEECEA' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {row.icon}
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '2px' }}>{row.label}</span>
              <span style={{ fontSize: '15px', fontWeight: 800, color: '#1A1A1A', fontFamily: 'Nunito, sans-serif' }}>{row.value}</span>
            </div>
          </div>
        ))}
        <div style={{ padding: '13px 0', borderBottom: '1px solid #EEECEA' }}>
          <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>Ricevuta inviata a</span>
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#1A9E8F', fontFamily: 'Nunito, sans-serif' }}>{email}</span>
        </div>
      </div>

      <div style={{ background: '#FFF9F0', border: '1.5px solid #FFE0B0', borderRadius: '12px', padding: '10px 14px', margin: '12px 0' }}>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 600, color: '#B07000', margin: 0, lineHeight: 1.5 }}>
          ⚠️ Dopo aver toccato PAGA il pagamento sarà definitivo.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={onBack} style={{ flex: 1, padding: '16px 12px', borderRadius: '14px', border: '2px solid #E0E0E0', background: 'white', fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 700, color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', minHeight: '58px' }}>
          <ArrowLeft size={17} />
          Indietro
        </button>
        <button
          data-highlight="paga-btn"
          onClick={onNext}
          style={{ flex: 2, padding: '16px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #1A9E8F 0%, #147A6E 100%)', fontFamily: 'Nunito, sans-serif', fontSize: '16px', fontWeight: 900, color: 'white', cursor: 'pointer', boxShadow: '0 4px 16px rgba(26,158,143,0.35)', minHeight: '58px' }}
        >
          Paga 36,50 €
        </button>
      </div>
    </div>
  )
}

// ── STEP 14: pagamento effettuato ──────────────────────────────────
function StepPagamentoEffettuato({ onDone }) {
  const { state } = useApp()
  const email = state.email || '—'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '28px 24px 24px', background: '#FFF8F0' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '120px', height: '120px', background: '#E0F5F3', border: '3px solid #1A9E8F', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '26px' }}>
          <Check size={56} color="#1A9E8F" strokeWidth={2} />
        </div>
        <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '32px', fontWeight: 900, color: '#1A1A1A', textAlign: 'center', lineHeight: 1.2, marginBottom: '14px' }}>
          Pagamento<br />Effettuato!
        </h1>
        <p style={{ fontSize: '18px', color: '#1A1A1A', fontWeight: 700, textAlign: 'center', fontFamily: 'Nunito, sans-serif', marginBottom: '10px' }}>
          Hai pagato 36,50 €
        </p>
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
  const [frozenHighlightZone, setFrozenHighlightZone] = useState(null)
  const [listScrollTop, setListScrollTop] = useState(0)
  const [frozenScrollTop, setFrozenScrollTop] = useState(null)
  const { setState } = useApp()
  const rightPanelRef = useRef(null)
  const leftPanelRef = useRef(null)
  const listScrollTopRef = useRef(0)

  const goHome = () => setState(s => ({ ...s, currentScreen: 'home', currentStep: 0 }))

  const rightPanelContent = () => {
    if (step === 0) return <StepSceltaMetodo onQR={() => {}} onBack={() => {}} />
    if (step === 1) return <StepInquadraQR onNext={() => {}} onBack={() => {}} />
    if (step === 2) return <StepDatiPagamento onBack={() => {}} onNext={() => {}} />
    if (step >= 3 && step <= 5) return <StepInserisciEmail onBack={() => {}} onNext={() => {}} onStepChange={() => {}} />
    if (step >= 6 && step <= 7) return <StepSceltaPagamento isReplica={true} scrollTop={frozenScrollTop !== null ? frozenScrollTop : listScrollTop} onBack={() => {}} onNext={() => {}} onScrollDetected={() => {}} />
    if (step >= 8 && step <= 12) return <StepDatiCarta onBack={() => {}} onNext={() => {}} onFieldChange={() => {}} />
    if (step === 13) return <StepConfermaPagemento onBack={() => {}} onNext={() => {}} />
    if (step === 14) return <StepPagamentoEffettuato onDone={() => {}} />
  }

  const rightPanelInteractive = () => {
    if (step === 0) return <StepSceltaMetodo onQR={() => setStep(1)} onBack={goHome} />
    if (step === 1) return <StepInquadraQR onNext={() => setStep(2)} onBack={() => setStep(0)} />
    if (step === 2) return <StepDatiPagamento onBack={() => setStep(1)} onNext={() => setStep(3)} />
    if (step >= 3 && step <= 5) return <StepInserisciEmail onBack={() => setStep(2)} onNext={() => setStep(6)} onStepChange={i => setStep(i)} />
    if (step >= 6 && step <= 7) return (
      <StepSceltaPagamento
        onBack={() => { setFrozenScrollTop(null); setListScrollTop(0); setFrozenHighlightZone(null); listScrollTopRef.current = 0; setStep(5) }}
        onNext={() => setStep(8)}
        onScrollDetected={(cartaRect) => {
          const st = listScrollTopRef.current
          setFrozenScrollTop(st)
          if (cartaRect && rightPanelRef.current) {
            const scale = Math.min(window.innerWidth / 1180, window.innerHeight / 820)
            const panelRect = rightPanelRef.current.getBoundingClientRect()
            setFrozenHighlightZone({
              top: (cartaRect.top - panelRect.top) / scale,
              left: (cartaRect.left - panelRect.left) / scale,
              width: cartaRect.width / scale,
              height: cartaRect.height / scale,
            })
          }
          setStep(7)
        }}
        onListScroll={st => { listScrollTopRef.current = st; setListScrollTop(st) }}
      />
    )
    if (step >= 8 && step <= 12) return (
      <StepDatiCarta
        onBack={() => setStep(7)} onNext={() => setStep(13)}
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
    <div style={{ display: 'flex', flexDirection: 'row', height: '740px' }}>
      <PanelLeft
        step={step} rightPanelContent={rightPanelContent()} rightPanelRef={rightPanelRef}
        showGesture={step === 6}
        overrideHighlightZone={step === 7 ? frozenHighlightZone : step === 6 ? null : undefined}
        leftPanelRef={leftPanelRef}
        forceTop={step === 6 || step === 7}
      />
      <div style={{ width: '20px', background: '#1A1A1A', flexShrink: 0 }} />
      <div ref={rightPanelRef} style={{ width: '390px', height: '740px', flexShrink: 0, overflow: 'hidden' }}>
        {rightPanelInteractive()}
      </div>
    </div>
  )
}
