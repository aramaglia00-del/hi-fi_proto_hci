import { CalendarDays, CreditCard, ChevronRight, Info } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function ScreenRight() {
  const { setState } = useApp()

  return (
    <div
      style={{
        width: '390px', height: '740px', flexShrink: 0,
        background: '#FFF8F0', display: 'flex',
        flexDirection: 'column', padding: '32px 28px 28px',
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
        <div style={{
          width: '40px', height: '40px', background: '#1A9E8F',
          borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <CalendarDays size={22} color="white" />
        </div>
        <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '16px', fontWeight: 800, color: '#2D2D2D' }}>
          ServizioPA
        </span>
      </div>

      {/* Header */}
      <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 700, color: '#1A9E8F', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '6px' }}>
        Benvenuto
      </p>
      <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '28px', fontWeight: 900, color: '#2D2D2D', letterSpacing: '-0.8px', lineHeight: 1.15, marginBottom: '10px' }}>
        Di cosa hai<br />bisogno oggi?
      </h1>
      <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: 1.6, fontWeight: 600, marginBottom: '0' }}>
        Scegli un'opzione e ti guiderò in ogni passaggio.
      </p>

      {/* Separatore */}
      <div style={{ height: '2px', background: 'linear-gradient(to right, #A8DDD8, transparent)', margin: '20px 0 18px', borderRadius: '1px' }} />
      <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#6B7280', marginBottom: '16px' }}>
        Seleziona un servizio
      </p>

      {/* CTA */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* Bottone CUP */}
        <button
          onClick={() => setState(s => ({ ...s, currentScreen: 'cup', currentStep: 0 }))}
          style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            padding: '18px', borderRadius: '16px', border: '2.5px solid #E8E8E8',
            background: 'white', color: '#2D2D2D', cursor: 'pointer',
            fontFamily: 'Nunito, sans-serif', textAlign: 'left', width: '100%',
          }}
        >
          <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: '#E0F5F3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <CalendarDays size={26} color="#1A9E8F" />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '16px', fontWeight: 800, display: 'block', lineHeight: 1.2 }}>Prenotiamo una Visita</span>
            <span style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px', display: 'block', fontWeight: 600 }}>Prenotazione CUP online</span>
          </div>
          <ChevronRight size={22} color="rgba(0,0,0,0.25)" />
        </button>

        {/* Bottone PagoPA */}
        <button
          onClick={() => setState(s => ({ ...s, currentScreen: 'pagopa', currentStep: 0 }))}
          style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            padding: '18px', borderRadius: '16px', border: '2.5px solid #E8E8E8',
            background: 'white', color: '#2D2D2D', cursor: 'pointer',
            fontFamily: 'Nunito, sans-serif', textAlign: 'left', width: '100%',
          }}
        >
          <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: '#E0F5F3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <CreditCard size={26} color="#1A9E8F" />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '16px', fontWeight: 800, display: 'block', lineHeight: 1.2 }}>Paghiamo un Avviso</span>
            <span style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px', display: 'block', fontWeight: 600 }}>Pagamento PagoPA</span>
          </div>
          <ChevronRight size={22} color="rgba(0,0,0,0.25)" />
        </button>

      </div>

      {/* Nota */}
      <div style={{ marginTop: 'auto', paddingTop: '20px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <div style={{ width: '22px', height: '22px', background: '#E0F5F3', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
          <Info size={13} color="#1A9E8F" />
        </div>
        <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.55, fontWeight: 600 }}>
          L'assistente ti guiderà in ogni passaggio. Puoi sempre tornare indietro.
        </p>
      </div>
    </div>
  )
}
