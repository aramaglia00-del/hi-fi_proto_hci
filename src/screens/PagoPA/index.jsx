import { useState } from 'react'
import { QrCode, Keyboard, Building2, FileText, DollarSign, Hash, CreditCard, ChevronRight, ArrowLeft } from 'lucide-react'
import { useApp } from '../../context/AppContext'

// ── CONFIGURAZIONE STEP ────────────────────────────────────────────
// highlightZone: { top, left, width, height } in px relativo allo schermo destro (390x740)
// null = nessun highlight (tutto visibile)
const assistantSteps = [
  {
    tag: '👆 Fai così',
    text: (<>Tocca <strong style={{ color: '#1A9E8F' }}>Inquadra il codice QR</strong> qui a fianco per iniziare!</>),
    highlightZone: { top: 170, left: 12, width: 366, height: 92 },
  },
  {
    tag: '📷 Come fare',
    text: (<><strong style={{ color: '#1A9E8F' }}>1 —</strong> Punta la fotocamera sul QR<br /><strong style={{ color: '#1A9E8F' }}>2 —</strong> Tocca il link che appare<br /><strong style={{ color: '#1A9E8F' }}>3 —</strong> Sei a posto!</>),
    highlightZone: { top: 180, left: 48, width: 294, height: 340 },
  },
  {
    tag: '✅ Controlla',
    text: (<>Verifica i dati qui a fianco.<br />Poi tocca <strong style={{ color: '#1A9E8F' }}>VAI AL PAGAMENTO</strong> ↓</>),
    highlightZone: { top: 624, left: 12, width: 366, height: 80 },
  },
]

// ── MASCOT ─────────────────────────────────────────────────────────
function Mascot() {
  return (
    <svg
      style={{ width: '90px', height: '90px', filter: 'drop-shadow(0 4px 12px rgba(245,166,35,0.3))' }}
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
      {/* Triangolino verso il basso punta alla mascotte */}
      <div style={{ position: 'absolute', bottom: '-8px', left: '28px', width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '8px solid rgba(245,166,35,0.3)' }} />
      <div style={{ position: 'absolute', bottom: '-5px', left: '30px', width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid white' }} />
    </div>
  )
}

// ── PANNELLO SINISTRO con overlay ──────────────────────────────────
function PanelLeft({ step, rightPanelContent }) {
  const { tag, text, highlightZone } = assistantSteps[step]

  return (
    <div style={{ width: '390px', height: '740px', flexShrink: 0, position: 'relative', overflow: 'hidden', background: '#FFF8F0' }}>

      {/* Replica schermo destro — non interattiva, con blur globale */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', filter: 'blur(3px)' }}>
        {rightPanelContent}
      </div>

      {/* Overlay scuro pesante su tutto */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.78)', pointerEvents: 'none', zIndex: 1 }} />

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
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.78)',
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

      {/* Avatar + Fumetto in basso */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        padding: '0 16px 16px',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Bubble tag={tag} text={text} />
        <div style={{ display: 'flex', justifyContent: 'flex-start', paddingLeft: '8px', marginTop: '8px' }}>
          <Mascot />
        </div>
      </div>

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
        <button onClick={onQR} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '18px 16px', borderRadius: '16px', border: '2.5px solid #E8E8E8', background: 'white', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', textAlign: 'left', width: '100%', position: 'relative', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#E0F5F3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <QrCode size={26} color="#1A9E8F" />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '15px', fontWeight: 800, display: 'block', color: '#2D2D2D', lineHeight: 1.2 }}>Inquadra il codice QR</span>
            <span style={{ fontSize: '11px', color: '#6B7280', marginTop: '3px', display: 'block', fontWeight: 600 }}>Usa la tua webcam o fotocamera</span>
          </div>
          <ChevronRight size={18} color="#6B7280" />
        </button>
        <button disabled style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '18px 16px', borderRadius: '16px', border: '2.5px solid #E8E8E8', background: 'white', cursor: 'not-allowed', fontFamily: 'Nunito, sans-serif', textAlign: 'left', width: '100%', opacity: 0.45 }}>
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
        <div style={{ width: '260px', height: '260px', borderRadius: '20px', background: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
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
          Simula scansione riuscita 
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
        <button onClick={onNext} style={{ flex: 2, padding: '14px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #1A9E8F 0%, #147A6E 100%)', fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: 800, color: 'white', cursor: 'pointer', boxShadow: '0 4px 16px rgba(26,158,143,0.3)' }}>
          Vai al pagamento 
        </button>
      </div>
    </div>
  )
}

// ── SCREEN PRINCIPALE ──────────────────────────────────────────────
export default function PagoPA() {
  const [step, setStep] = useState(0)
  const { setState } = useApp()

  const goHome = () => setState(s => ({ ...s, currentScreen: 'home', currentStep: 0 }))

  const rightPanelContent = () => {
    if (step === 0) return <StepSceltaMetodo onQR={() => {}} onBack={() => {}} />
    if (step === 1) return <StepInquadraQR onNext={() => {}} onBack={() => {}} />
    if (step === 2) return <StepDatiPagamento onBack={() => {}} onNext={() => {}} />
  }

  const rightPanelInteractive = () => {
    if (step === 0) return <StepSceltaMetodo onQR={() => setStep(1)} onBack={goHome} />
    if (step === 1) return <StepInquadraQR onNext={() => setStep(2)} onBack={() => setStep(0)} />
    if (step === 2) return <StepDatiPagamento onBack={() => setStep(1)} onNext={() => alert('Prossimi step in arrivo!')} />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '740px' }}>

      {/* Pannello sinistro: replica con overlay */}
      <PanelLeft step={step} rightPanelContent={rightPanelContent()} />

      {/* Banda nera */}
      <div style={{ width: '20px', background: '#1A1A1A', flexShrink: 0 }} />

      {/* Pannello destro: interattivo */}
      <div style={{ width: '390px', height: '740px', flexShrink: 0, overflow: 'hidden' }}>
        {rightPanelInteractive()}
      </div>

    </div>
  )
}
