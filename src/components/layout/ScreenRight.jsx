import { CalendarDays, CreditCard, ChevronRight, Info } from 'lucide-react'
import PointerArrow from '../assistant/PointerArrow'
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
          width: '38px', height: '38px', background: '#1A9E8F',
          borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <CalendarDays size={20} color="white" />
        </div>
        <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 800, color: '#2D2D2D' }}>
          ServizioPA
        </span>
      </div>

      {/* Header */}
      <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 700, color: '#1A9E8F', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '6px' }}>
        Benvenuto
      </p>
      <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '26px', fontWeight: 900, color: '#2D2D2D', letterSpacing: '-0.8px', lineHeight: 1.15, marginBottom: '8px' }}>
        Di cosa hai<br />bisogno oggi?
      </h1>
      <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.6, fontWeight: 600, marginBottom: '0' }}>
        Scegli un'opzione e ti guiderò in ogni passaggio.
      </p>

      {/* Separatore */}
      <div style={{ height: '2px', background: 'linear-gradient(to right, #A8DDD8, transparent)', margin: '20px 0 18px', borderRadius: '1px' }} />
      <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '10px', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#6B7280', marginBottom: '14px' }}>
        Seleziona un servizio
      </p>

      {/* CTA */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* Bottone primario CUP */}
        <button
          onClick={() => setState(s => ({ ...s, currentScreen: 'cup', currentStep: 0 }))}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '16px', borderRadius: '16px', border: 'none',
            background: 'linear-gradient(135deg, #1A9E8F 0%, #147A6E 100%)',
            color: 'white', cursor: 'pointer', position: 'relative',
            fontFamily: 'Nunito, sans-serif', textAlign: 'left', width: '100%',
          }}
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <CalendarDays size={22} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '15px', fontWeight: 800, display: 'block', lineHeight: 1.2 }}>Prenotiamo una Visita</span>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.72)', marginTop: '3px', display: 'block', fontWeight: 600 }}>Prenotazione CUP online</span>
          </div>
          <ChevronRight size={20} color="rgba(255,255,255,0.5)" />
          <PointerArrow />
        </button>

        {/* Bottone secondario PagoPA */}
        <button
          onClick={() => setState(s => ({ ...s, currentScreen: 'pagopa', currentStep: 0 }))}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '16px', borderRadius: '16px', border: '2.5px solid #E8E8E8',
            background: 'white', color: '#2D2D2D', cursor: 'pointer',
            fontFamily: 'Nunito, sans-serif', textAlign: 'left', width: '100%',
          }}
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#E0F5F3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <CreditCard size={22} color="#1A9E8F" />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '15px', fontWeight: 800, display: 'block', lineHeight: 1.2 }}>Paghiamo un Avviso</span>
            <span style={{ fontSize: '11px', color: '#6B7280', marginTop: '3px', display: 'block', fontWeight: 600 }}>Pagamento PagoPA</span>
          </div>
          <ChevronRight size={20} color="rgba(0,0,0,0.25)" />
        </button>

      </div>

      {/* Nota */}
      <div style={{ marginTop: 'auto', paddingTop: '20px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
        <div style={{ width: '18px', height: '18px', background: '#E0F5F3', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
          <Info size={11} color="#1A9E8F" />
        </div>
        <p style={{ fontSize: '11px', color: '#6B7280', lineHeight: 1.5, fontWeight: 600 }}>
          L'assistente ti guiderà in ogni passaggio. Puoi sempre tornare indietro.
        </p>
      </div>
    </div>
  )
}
