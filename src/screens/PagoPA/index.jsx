import { useState, useEffect, useRef } from 'react'
import { QrCode, Keyboard, Building2, FileText, DollarSign, Hash, CreditCard, ChevronRight, ArrowLeft, Tag, Mail, Check } from 'lucide-react'
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
  {
    tag: '👆 Scorri',
    text: (<>Muovi il dito <strong style={{ color: '#1A9E8F' }}>dal basso verso l'alto</strong> per scorrere la pagina e trovare il metodo giusto!</>),
    highlightSelector: null,
  },
  {
    tag: '💳 Seleziona',
    text: (<>Tocca <strong style={{ color: '#1A9E8F' }}>Carta di debito o credito</strong> per procedere al pagamento!</>),
    highlightSelector: '[data-highlight="carta-credito"]',
  },
  {
    tag: '💳 Numero carta',
    text: 'Scrivi tutte le cifre che vedi sulla parte davanti della tua carta.',
    highlightSelector: '[data-highlight="card-number"]',
  },
  {
    tag: '📅 Scadenza',
    text: "Tocca qui e scrivi la data di scadenza: prima il mese, poi l'anno.",
    highlightSelector: '[data-highlight="card-expiry"]',
  },
  {
    tag: '🔒 Codice CVV',
    text: 'Ora tocca lo spazio per il codice di sicurezza. È quello piccolino da tre cifre sul retro della carta.',
    highlightSelector: '[data-highlight="card-cvv"]',
  },
  {
    tag: '👤 Intestatario',
    text: "Siamo all'ultimo passaggio: tocca l'ultimo spazio e scrivi il nome stampato sulla carta.",
    highlightSelector: '[data-highlight="card-name"]',
  },
  {
    tag: '✅ Fatto!',
    text: 'I dati della tua carta sono stati inseriti correttamente. Clicca su CONTINUA!',
    highlightSelector: '[data-highlight="card-continua"]',
  },
  {
    tag: '💰 Conferma',
    text: (<>Il <strong style={{ color: '#1A9E8F' }}>TOTALE</strong> è quanto pagherai. La <strong style={{ color: '#1A9E8F' }}>COMMISSIONE</strong> è il costo del servizio, già inclusa nel totale. Clicca <strong style={{ color: '#1A9E8F' }}>PAGA</strong> per confermare!</>),
    highlightSelector: '[data-highlight="paga-btn"]',
  },
  {
    tag: '🎉 Completato',
    text: "Complimenti! Hai terminato l'operazione!",
    highlightSelector: null,
  },
]

// ── PANNELLO SINISTRO con overlay ──────────────────────────────────
function PanelLeft({ step, rightPanelContent, rightPanelRef, showGesture, overrideHighlightZone, leftPanelRef, forceTop }) {
  const { tag, text, highlightSelector } = assistantSteps[step]
  const [highlightZone, setHighlightZone] = useState(null)

  // Quando la zona è pre-calcolata (es. step 7), usala direttamente
  useEffect(() => {
    if (overrideHighlightZone === undefined) return
    setHighlightZone(overrideHighlightZone)
  }, [overrideHighlightZone])

  // Calcolo standard per gli step senza override
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

    return () => {
      clearTimeout(timer)
      resizeObserver.disconnect()
    }
  }, [highlightSelector, rightPanelRef, overrideHighlightZone])

  return (
    <div ref={leftPanelRef} style={{ width: '390px', height: '740px', flexShrink: 0, position: 'relative', overflow: 'hidden', background: '#FFF8F0' }}>

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

      <AssistantOverlay tag={tag} text={text} highlightZone={highlightZone} showGesture={showGesture} forceTop={forceTop} />

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
          onClick={isValid ? () => { setAppState(s => ({ ...s, email })); onNext?.() } : undefined}
          style={{ flex: 2, padding: '14px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #1A9E8F 0%, #147A6E 100%)', fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: 800, color: 'white', boxShadow: isValid ? '0 4px 16px rgba(26,158,143,0.3)' : 'none', opacity: isValid ? 1 : 0.5, cursor: isValid ? 'pointer' : 'not-allowed' }}
        >
          Continua →
        </button>
      </div>
    </div>
  )
}

// ── STEP 6-7: scelta metodo pagamento ─────────────────────────────
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

  // Callback ref per evitare closure stale nell'IntersectionObserver
  const onScrollDetectedRef = useRef(onScrollDetected)
  useEffect(() => { onScrollDetectedRef.current = onScrollDetected }, [onScrollDetected])

  useEffect(() => {
    if (isReplica || !cartaRef.current || !listRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.target === cartaRef.current) {
          // Passa il BoundingClientRect di carta direttamente — cartaRef è sicuramente non-null qui
          onScrollDetectedRef.current?.(entry.target.getBoundingClientRect())
        }
      },
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
          padding: '16px', borderRadius: '14px', marginBottom: '10px',
          border: isCarta ? '1.5px solid #1A9E8F' : '1.5px solid #E8E8E8',
          background: isCarta ? '#E0F5F3' : 'white',
          cursor: isCarta && !isReplica ? 'pointer' : 'default',
          opacity: isCarta ? 1 : 0.7,
        }}
      >
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: m.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'Nunito, sans-serif' }}>
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
        <span style={{ fontSize: '14px', fontWeight: 700, color: m.labelColor || '#2D2D2D', fontFamily: 'Nunito, sans-serif' }}>{m.label}</span>
      </div>
    )
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '32px 28px 28px', background: '#FFF8F0' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '26px', fontWeight: 900, color: '#2D2D2D', letterSpacing: '-0.8px', lineHeight: 1.15, marginBottom: '8px' }}>Come vuoi<br />pagare?</h1>
        <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.6, fontWeight: 600 }}>Scegli il metodo che preferisci</p>
      </div>

      {isReplica ? (
        // Pannello sinistro: lista statica traslata, overflow hidden
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          <div style={{ transform: `translateY(-${scrollTop}px)`, transition: 'none' }}>
            {listItems}
          </div>
        </div>
      ) : (
        // Pannello destro: lista scrollabile normale
        <div
          ref={listRef}
          data-highlight="payment-list"
          onScroll={e => onListScroll?.(e.target.scrollTop)}
          style={{ flex: 1, overflowY: 'auto', paddingRight: '2px' }}
        >
          {listItems}
        </div>
      )}

      <div style={{ paddingTop: '12px', paddingBottom: '4px', flexShrink: 0 }}>
        <button onClick={onBack} style={{ padding: '14px', borderRadius: '14px', border: '2px solid #E8E8E8', background: 'white', fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: 700, color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <ArrowLeft size={16} />
        </button>
      </div>
    </div>
  )
}

// ── STEP 8-12: dati carta ─────────────────────────────────────────
function StepDatiCarta({ onBack, onNext, onFieldChange }) {
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [name, setName] = useState('')
  const [activeField, setActiveField] = useState(null)

  const isValid =
    cardNumber.length === 19 &&
    expiry.length === 5 &&
    cvv.length === 3 &&
    name.trim().length >= 2

  useEffect(() => {
    if (isValid) onFieldChange?.('continua')
  }, [isValid])

  const handleCardNumber = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 16)
    setCardNumber(digits.replace(/(.{4})/g, '$1 ').trim())
  }

  const handleExpiry = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4)
    setExpiry(digits.length >= 3 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits)
  }

  const handleFocus = (field) => {
    setActiveField(field)
    onFieldChange?.(field)
  }

  const inputBase = {
    background: 'white', borderRadius: '12px', padding: '14px 16px',
    fontSize: '15px', fontFamily: 'Nunito, sans-serif', fontWeight: 600,
    color: '#2D2D2D', outline: 'none',
    WebkitAppearance: 'none', appearance: 'none', boxSizing: 'border-box',
  }
  const border = (field) => ({ border: activeField === field ? '2px solid #1A9E8F' : '2px solid #E8E8E8' })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '32px 28px 28px', background: '#FFF8F0' }}>
      <style>{`input::placeholder { color: #9CA3AF; font-weight: 400; }`}</style>
      <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 700, color: '#1A9E8F', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '6px' }}>PagoPA</p>
      <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '26px', fontWeight: 900, color: '#2D2D2D', letterSpacing: '-0.8px', lineHeight: 1.15, marginBottom: '24px' }}>Inserisci i dati<br />della tua carta</h1>

      <input
        data-highlight="card-number"
        inputMode="numeric"
        placeholder="Numero carta"
        value={cardNumber}
        onChange={handleCardNumber}
        onFocus={() => handleFocus('number')}
        onBlur={() => setActiveField(null)}
        style={{ ...inputBase, ...border('number'), width: '100%', marginBottom: '12px' }}
      />

      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <input
            data-highlight="card-expiry"
            inputMode="numeric"
            placeholder="MM/AA"
            value={expiry}
            onChange={handleExpiry}
            onFocus={() => handleFocus('expiry')}
            onBlur={() => setActiveField(null)}
            style={{ ...inputBase, ...border('expiry'), width: '100%' }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <input
            data-highlight="card-cvv"
            type="password"
            inputMode="numeric"
            placeholder="CVV"
            maxLength={3}
            value={cvv}
            onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
            onFocus={() => handleFocus('cvv')}
            onBlur={() => setActiveField(null)}
            style={{ ...inputBase, ...border('cvv'), width: '100%' }}
          />
        </div>
      </div>

      <input
        data-highlight="card-name"
        type="text"
        placeholder="Intestata a"
        value={name}
        onChange={e => setName(e.target.value.toUpperCase())}
        onFocus={() => handleFocus('name')}
        onBlur={() => setActiveField(null)}
        style={{ ...inputBase, ...border('name'), width: '100%' }}
      />

      <div style={{ flex: 1 }} />

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={onBack} style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '2px solid #E8E8E8', background: 'white', fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: 700, color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ArrowLeft size={16} />
        </button>
        <button
          data-highlight="card-continua"
          onClick={isValid ? onNext : undefined}
          style={{ flex: 2, padding: '14px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #1A9E8F 0%, #147A6E 100%)', fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: 800, color: 'white', opacity: isValid ? 1 : 0.5, cursor: isValid ? 'pointer' : 'not-allowed', boxShadow: isValid ? '0 4px 16px rgba(26,158,143,0.3)' : 'none' }}
        >
          Continua →
        </button>
      </div>
    </div>
  )
}

// ── STEP 13: conferma pagamento ────────────────────────────────────
function StepConfermaPagemento({ onBack, onNext }) {
  const { state } = useApp()
  const email = state.email || '—'

  const iconBox = (icon) => (
    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {icon}
    </div>
  )

  const dataRow = (icon, label, value, valueColor) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 0', borderBottom: '1px solid #E8E8E8' }}>
      {iconBox(icon)}
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: '10px', color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '2px' }}>{label}</span>
        <span style={{ fontSize: '14px', fontWeight: 800, color: valueColor || '#2D2D2D', fontFamily: 'Nunito, sans-serif' }}>{value}</span>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '32px 28px 28px', background: '#FFF8F0' }}>

      {/* Totale */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '14px' }}>
        <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '28px', fontWeight: 900, color: '#2D2D2D' }}>Totale</span>
        <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '28px', fontWeight: 900, color: '#2D2D2D' }}>36,50 €</span>
      </div>
      <div style={{ height: '2px', background: '#2D2D2D', borderRadius: '1px', marginBottom: '4px' }} />

      {/* Righe dati */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {dataRow(<CreditCard size={20} color="#6B7280" />, 'Ente Creditore', 'Carta di credito (**** 3456)')}
        {dataRow(<Tag size={20} color="#6B7280" />, 'Commissione', '1,50 €')}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #E8E8E8' }}>
          <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 600, fontFamily: 'Nunito, sans-serif' }}>Invia ricevuta a:</span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#1A9E8F', fontFamily: 'Nunito, sans-serif' }}>{email}</span>
        </div>
      </div>

      {/* Bottoni */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={onBack}
          style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '2px solid #E8E8E8', background: 'white', fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: 700, color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ArrowLeft size={16} />
        </button>
        <button
          data-highlight="paga-btn"
          onClick={onNext}
          style={{ flex: 2, padding: '14px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #1A9E8F 0%, #147A6E 100%)', fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 800, color: 'white', cursor: 'pointer', boxShadow: '0 4px 16px rgba(26,158,143,0.3)' }}
        >
          Paga 36,50 €
        </button>
      </div>
    </div>
  )
}

// ── STEP 14: pagamento effettuato ─────────────────────────────────
function StepPagamentoEffettuato({ onDone }) {
  const { state } = useApp()
  const email = state.email || '—'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '32px 28px 28px', background: '#FFF8F0' }}>
      {/* Contenuto centrato verticalmente */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0px' }}>

        {/* Cerchio con checkmark */}
        <div style={{ width: '120px', height: '120px', border: '3px solid #2D2D2D', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '28px' }}>
          <Check size={56} color="#2D2D2D" strokeWidth={2} />
        </div>

        <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '32px', fontWeight: 900, color: '#2D2D2D', textAlign: 'center', lineHeight: 1.2, marginBottom: '12px' }}>
          Pagamento<br />Effettuato!
        </h1>

        <p style={{ fontSize: '16px', color: '#2D2D2D', fontWeight: 600, textAlign: 'center', fontFamily: 'Nunito, sans-serif', marginBottom: '8px' }}>
          Hai pagato con successo 35,00 €
        </p>

        <p style={{ fontSize: '13px', color: '#6B7280', textAlign: 'center', fontFamily: 'Nunito, sans-serif', fontWeight: 500 }}>
          La ricevuta è stata inviata a:{' '}
          <span style={{ color: '#1A9E8F', fontWeight: 700 }}>{email}</span>
        </p>
      </div>

      {/* Bottone in fondo */}
      <button
        onClick={onDone}
        style={{ width: '100%', padding: '16px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #1A9E8F 0%, #147A6E 100%)', fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 800, color: 'white', cursor: 'pointer', boxShadow: '0 4px 16px rgba(26,158,143,0.3)' }}
      >
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
    if (step >= 6 && step <= 7) return (
      <StepSceltaPagamento
        isReplica={true}
        scrollTop={frozenScrollTop !== null ? frozenScrollTop : listScrollTop}
        onBack={() => {}} onNext={() => {}} onScrollDetected={() => {}}
      />
    )
    if (step >= 8 && step <= 12) return <StepDatiCarta onBack={() => {}} onNext={() => {}} onFieldChange={() => {}} />
    if (step === 13) return <StepConfermaPagemento onBack={() => {}} onNext={() => {}} />
    if (step === 14) return <StepPagamentoEffettuato onDone={() => {}} />
  }

  const rightPanelInteractive = () => {
    if (step === 0) return <StepSceltaMetodo onQR={() => setStep(1)} onBack={goHome} />
    if (step === 1) return <StepInquadraQR onNext={() => setStep(2)} onBack={() => setStep(0)} />
    if (step === 2) return <StepDatiPagamento onBack={() => setStep(1)} onNext={() => setStep(3)} />
    if (step >= 3 && step <= 5) return (
      <StepInserisciEmail
        onBack={() => setStep(2)}
        onNext={() => setStep(6)}
        onStepChange={(i) => setStep(i)}
      />
    )
    if (step >= 6 && step <= 7) return (
      <StepSceltaPagamento
        onBack={() => { setFrozenScrollTop(null); setListScrollTop(0); setFrozenHighlightZone(null); listScrollTopRef.current = 0; setStep(5) }}
        onNext={() => setStep(8)}
        onScrollDetected={(cartaRect) => {
          const st = listScrollTopRef.current
          setFrozenScrollTop(st)
          // cartaRect arriva direttamente dall'IO (destra) — rightPanelRef è sempre non-null
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
        onBack={() => setStep(7)}
        onNext={() => setStep(13)}
        onFieldChange={(field) => {
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

      {/* Pannello sinistro: replica con overlay */}
      <PanelLeft
        step={step}
        rightPanelContent={rightPanelContent()}
        rightPanelRef={rightPanelRef}
        showGesture={step === 6}
        overrideHighlightZone={step === 7 ? frozenHighlightZone : step === 6 ? null : undefined}
        leftPanelRef={leftPanelRef}
        forceTop={step === 6 || step === 7}
      />

      {/* Banda nera */}
      <div style={{ width: '20px', background: '#1A1A1A', flexShrink: 0 }} />

      {/* Pannello destro: interattivo */}
      <div ref={rightPanelRef} style={{ width: '390px', height: '740px', flexShrink: 0, overflow: 'hidden' }}>
        {rightPanelInteractive()}
      </div>

    </div>
  )
}
