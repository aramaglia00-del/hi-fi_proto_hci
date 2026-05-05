import { useState, useEffect, useRef } from 'react'
import { QrCode, Keyboard, Building2, FileText, DollarSign, Hash, CreditCard, ChevronRight, ArrowLeft } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import AssistantOverlay from '../../components/AssistantOverlay'

// ── CONFIGURAZIONE STEP ────────────────────────────────────────────
const assistantSteps = [
  {
    tag: '👆 Fai così',
    text: (<>Tocca <strong style={{ color: '#1A9E8F' }}>Inquadra il codice QR</strong> qui a fianco per iniziare!</>),
    highlightSelector: '[data-highlight="qr"]',
  },
  {
    tag: '📷 Come fare',
    text: (<><strong style={{ color: '#1A9E8F' }}>1 —</strong> Punta la fotocamera sul QR<br /><strong style={{ color: '#1A9E8F' }}>2 —</strong> Tocca il link che appare<br /><strong style={{ color: '#1A9E8F' }}>3 —</strong> Sei a posto!</>),
    highlightSelector: '[data-highlight="scanner"]',
  },
  {
    tag: '✅ Controlla',
    text: (<>Verifica i dati qui a fianco.<br />Poi tocca <strong style={{ color: '#1A9E8F' }}>VAI AL PAGAMENTO</strong> ↓</>),
    highlightSelector: '[data-highlight="cta"]',
  },
  {
    tag: '✉️ Inserisci',
    text: (<>Tocca il campo <strong style={{ color: '#1A9E8F' }}>Indirizzo email</strong> e scrivi la tua email.<br />Riceverai la ricevuta di pagamento lì!</>),
    highlightSelector: '[data-highlight="email"]',
  },
  {
    tag: '🔁 Conferma',
    text: (<>Ora riscrivi la stessa email nel campo <strong style={{ color: '#1A9E8F' }}>Ripeti di nuovo</strong>.<br />Serve per essere sicuri che sia corretta!</>),
    highlightSelector: '[data-highlight="email-confirm"]',
  },
  {
    tag: '✅ Ottimo!',
    text: (<>Perfetto! Ora clicca su <strong style={{ color: '#1A9E8F' }}>Continua</strong> per procedere al pagamento.</>),
    highlightSelector: '[data-highlight="continua"]',
  },
]

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
            {/* Contenuto nitido nella zona — renderizza di nuovo il pannello, clippato */}
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

      <AssistantOverlay tag={tag} text={text} highlightZone={highlightZone} />

    </div>
  )
}

// ── STEP 0: scelta metodo ──────────────────────────────────────────
function StepSceltaMetodo({ onQR, onBack }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '32px 28px 28px', background: '#FFF8F0' }}>
      <div style={{ marginBottom: '28px' }}>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 700, color: '#1A9E8F', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '6px' }}>PagoPA</p>
        <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '26px', fontWeight: 900, color: '#2D2D2D', letterSpacing: '-0.8px', lineHeight: 1.15, marginBottom: '8px' }}>Paga un avviso</h1>
        <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.6, fontWeight: 600 }}>Puoi pagare con carta, conto e app di pagamento</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button
          data-highlight="qr"
          onClick={onQR}
          style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '18px 16px', borderRadius: '16px', border: '2.5px solid #E8E8E8', background: 'white', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', textAlign: 'left', width: '100%', position: 'relative', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#E0F5F3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <QrCode size={26} color="#1A9E8F" />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '15px', fontWeight: 800, display: 'block', color: '#2D2D2D', lineHeight: 1.2 }}>Inquadra il codice QR</span>
            <span style={{ fontSize: '11px', color: '#6B7280', marginTop: '3px', display: 'block', fontWeight: 600 }}>Usa la tua webcam o fotocamera</span>
          </div>
          <ChevronRight size={18} color="#6B7280" />
        </button>
        <button style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '18px 16px', borderRadius: '16px', border: '2.5px solid #E8E8E8', background: 'white', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', textAlign: 'left', width: '100%' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Keyboard size={26} color="#9CA3AF" />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '15px', fontWeight: 800, display: 'block', color: '#2D2D2D', lineHeight: 1.2 }}>Inserisci i tuoi dati</span>
            <span style={{ fontSize: '11px', color: '#6B7280', marginTop: '3px', display: 'block', fontWeight: 600 }}>Digita manualmente il codice avviso</span>
          </div>
          <ChevronRight size={18} color="#6B7280" />
        </button>
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '20px' }}>
        <button onClick={onBack} style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '2px solid #E8E8E8', background: 'white', fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: 700, color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <ArrowLeft size={16} />
        </button>
      </div>
    </div>
  )
}

// ── STEP 1: inquadra QR ────────────────────────────────────────────
function StepInquadraQR({ onNext, onBack }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '32px 28px 28px', background: '#FFF8F0' }}>
      <div style={{ marginBottom: '24px' }}>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 700, color: '#1A9E8F', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '6px' }}>Step 1</p>
        <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '26px', fontWeight: 900, color: '#2D2D2D', letterSpacing: '-0.8px', lineHeight: 1.15, marginBottom: '8px' }}>Inquadra il<br />codice QR</h1>
        <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.6, fontWeight: 600 }}>Assicurati di avere una buona illuminazione</p>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          data-highlight="scanner"
          style={{ width: '260px', height: '260px', borderRadius: '20px', background: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}
        >
          <div style={{ position: 'absolute', top: '20px', left: '20px', width: '36px', height: '36px', borderTop: '4px solid #1A9E8F', borderLeft: '4px solid #1A9E8F', borderRadius: '4px 0 0 0' }} />
          <div style={{ position: 'absolute', top: '20px', right: '20px', width: '36px', height: '36px', borderTop: '4px solid #1A9E8F', borderRight: '4px solid #1A9E8F', borderRadius: '0 4px 0 0' }} />
          <div style={{ position: 'absolute', bottom: '20px', left: '20px', width: '36px', height: '36px', borderBottom: '4px solid #1A9E8F', borderLeft: '4px solid #1A9E8F', borderRadius: '0 0 0 4px' }} />
          <div style={{ position: 'absolute', bottom: '20px', right: '20px', width: '36px', height: '36px', borderBottom: '4px solid #1A9E8F', borderRight: '4px solid #1A9E8F', borderRadius: '0 0 4px 0' }} />
          <QrCode size={100} color="white" opacity={0.6} />
          <style>{`@keyframes scan{0%{top:30px}100%{top:calc(100% - 30px)}}`}</style>
          <div style={{ position: 'absolute', left: '20px', right: '20px', height: '2px', background: 'rgba(26,158,143,0.8)', boxShadow: '0 0 8px #1A9E8F', animation: 'scan 1.8s ease-in-out infinite alternate' }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button onClick={onBack} style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '2px solid #E8E8E8', background: 'white', fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: 700, color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <ArrowLeft size={16} />
        </button>
        <button onClick={onNext} style={{ flex: 2, padding: '14px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #1A9E8F 0%, #147A6E 100%)', fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: 800, color: 'white', cursor: 'pointer', boxShadow: '0 4px 16px rgba(26,158,143,0.3)' }}>
          Simula scansione riuscita →
        </button>
      </div>
    </div>
  )
}

// ── STEP 2: dati pagamento ─────────────────────────────────────────
function StepDatiPagamento({ onBack, onNext }) {
  const rows = [
    { icon: <Building2 size={20} color="#1A9E8F" />, label: 'Ente Creditore', value: 'ASL VERCELLI' },
    { icon: <FileText size={20} color="#1A9E8F" />, label: 'Oggetto del pagamento', value: 'Ticket Sanitario – Visita' },
    { icon: <DollarSign size={20} color="#1A9E8F" />, label: 'Importo aggiornato', value: '35,00 €' },
    { icon: <Hash size={20} color="#1A9E8F" />, label: 'Codice Avviso', value: '3020 0001 2219 4962' },
    { icon: <CreditCard size={20} color="#1A9E8F" />, label: 'Codice Fiscale Ente Creditore', value: '01020600123' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '32px 28px 28px', background: '#FFF8F0' }}>
      <div style={{ marginBottom: '20px' }}>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 700, color: '#1A9E8F', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '6px' }}>Riepilogo</p>
        <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '26px', fontWeight: 900, color: '#2D2D2D', letterSpacing: '-0.8px', lineHeight: 1.15 }}>Dati del<br />pagamento</h1>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {rows.map((row, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid #F0F0F0' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#E0F5F3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
          data-highlight="cta"
          onClick={onNext}
          style={{ flex: 2, padding: '14px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #1A9E8F 0%, #147A6E 100%)', fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: 800, color: 'white', cursor: 'pointer', boxShadow: '0 4px 16px rgba(26,158,143,0.3)' }}
        >
          Vai al pagamento →
        </button>
      </div>
    </div>
  )
}

// ── STEP 3–5: inserimento email ────────────────────────────────────
const isValidEmail = val => val.includes('@') && val.includes('.') && val.length > 5

function StepInserisciEmail({ onBack, onNext, onStepChange }) {
  const [email, setEmail] = useState('')
  const [emailConfirm, setEmailConfirm] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [isConfirmFocused, setIsConfirmFocused] = useState(false)
  const [email1Touched, setEmail1Touched] = useState(false)
  const [confirmTouched, setConfirmTouched] = useState(false)

  const isValid = isValidEmail(email) && emailConfirm === email
  const email1Error = email1Touched && !isValidEmail(email)
  const confirmError = confirmTouched && emailConfirm !== email

  const inputBase = {
    background: '#FFFFFF',
    color: '#2D2D2D',
    borderRadius: '12px',
    padding: '14px 16px',
    fontSize: '15px',
    fontFamily: 'Nunito, sans-serif',
    fontWeight: 600,
    width: '100%',
    outline: 'none',
    WebkitAppearance: 'none',
    appearance: 'none',
    boxSizing: 'border-box',
  }

  const errStyle = { color: '#E8543A', fontSize: '11px', marginTop: '4px', fontWeight: 600, fontFamily: 'Nunito, sans-serif' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '32px 28px 28px', background: '#FFF8F0' }}>
      <style>{`input::placeholder { color: #9CA3AF; font-weight: 400; }`}</style>
      <div style={{ marginBottom: '28px' }}>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 700, color: '#1A9E8F', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '6px' }}>PagoPA</p>
        <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '26px', fontWeight: 900, color: '#2D2D2D', letterSpacing: '-0.8px', lineHeight: 1.15, marginBottom: '8px' }}>Inserisci la<br />tua email</h1>
        <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.6, fontWeight: 600 }}>Riceverai la ricevuta di pagamento a questo indirizzo</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <input
            data-highlight="email"
            type="email"
            placeholder="Indirizzo email"
            value={email}
            onChange={e => {
              setEmail(e.target.value)
              onStepChange?.(3)
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false)
              setEmail1Touched(true)
              if (isValidEmail(email)) onStepChange?.(4)
            }}
            style={{ ...inputBase, border: isFocused ? '2px solid #1A9E8F' : email1Error ? '2px solid #E8543A' : '2px solid #E8E8E8' }}
          />
          {email1Error && <p style={errStyle}>Inserisci un indirizzo email valido</p>}
        </div>

        <div>
          <input
            data-highlight="email-confirm"
            type="email"
            placeholder="Ripeti di nuovo"
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
            style={{ ...inputBase, border: isConfirmFocused ? '2px solid #1A9E8F' : confirmError ? '2px solid #E8543A' : '2px solid #E8E8E8' }}
          />
          {confirmError && <p style={errStyle}>Le email non corrispondono</p>}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '20px' }}>
        <button onClick={onBack} style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '2px solid #E8E8E8', background: 'white', fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: 700, color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ArrowLeft size={16} />
        </button>
        <button
          data-highlight="continua"
          onClick={isValid ? onNext : undefined}
          style={{ flex: 2, padding: '14px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #1A9E8F 0%, #147A6E 100%)', fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: 800, color: 'white', boxShadow: isValid ? '0 4px 16px rgba(26,158,143,0.3)' : 'none', opacity: isValid ? 1 : 0.5, cursor: isValid ? 'pointer' : 'not-allowed' }}
        >
          Continua →
        </button>
      </div>
    </div>
  )
}

// ── SCREEN PRINCIPALE ──────────────────────────────────────────────
export default function PagoPA() {
  const [step, setStep] = useState(0)
  const { setState } = useApp()
  const rightPanelRef = useRef(null)

  const goHome = () => setState(s => ({ ...s, currentScreen: 'home', currentStep: 0 }))

  const rightPanelContent = () => {
    if (step === 0) return <StepSceltaMetodo onQR={() => {}} onBack={() => {}} />
    if (step === 1) return <StepInquadraQR onNext={() => {}} onBack={() => {}} />
    if (step === 2) return <StepDatiPagamento onBack={() => {}} onNext={() => {}} />
    if (step >= 3 && step <= 5) return <StepInserisciEmail onBack={() => {}} onNext={() => {}} onStepChange={() => {}} />
  }

  const rightPanelInteractive = () => {
    if (step === 0) return <StepSceltaMetodo onQR={() => setStep(1)} onBack={goHome} />
    if (step === 1) return <StepInquadraQR onNext={() => setStep(2)} onBack={() => setStep(0)} />
    if (step === 2) return <StepDatiPagamento onBack={() => setStep(1)} onNext={() => setStep(3)} />
    if (step >= 3 && step <= 5) return (
      <StepInserisciEmail
        onBack={() => setStep(2)}
        onNext={() => alert('Prossimi step in arrivo!')}
        onStepChange={(i) => setStep(i)}
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
