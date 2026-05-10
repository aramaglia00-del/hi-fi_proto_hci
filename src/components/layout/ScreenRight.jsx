import { CalendarDays, CreditCard, ChevronRight, Info } from 'lucide-react'
import { useApp, useTheme, useFontZoom } from '../../context/AppContext'

export default function ScreenRight() {
  const { setState } = useApp()
  const theme = useTheme()
  const zoom = useFontZoom()

  const disconnect = () => setState(s => ({ ...s, currentScreen: 'pairing', paired: false, currentStep: 0 }))

  return (
    <div
      style={{
        width: '390px', height: '740px', flexShrink: 0,
        background: theme.bg, overflow: 'hidden', position: 'relative',
      }}
    >
      {/* Content — width/height divided by zoom so visual size stays 390×740 */}
      <div style={{
        width: `${390 / zoom}px`, height: `${740 / zoom}px`, zoom,
        display: 'flex', flexDirection: 'column', padding: '32px 28px 28px',
        overflowY: 'auto', overflowX: 'hidden',
      }}>
        {/* Logo + disconnect */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
          <div style={{
            width: '40px', height: '40px', background: theme.primary,
            borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CalendarDays size={22} color={theme.primaryText} />
          </div>
          <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '16px', fontWeight: 800, color: theme.text }}>
            ServizioPA
          </span>
          <button
            onClick={disconnect}
            title="Disconnetti telefono dal totem"
            style={{
              marginLeft: 'auto', background: 'none', border: `1px solid ${theme.border}`,
              borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
              fontFamily: 'Nunito, sans-serif', fontSize: '11px', fontWeight: 700,
              color: theme.textSecondary, padding: '4px 8px',
            }}
          >
            ⏻ Esci
          </button>
        </div>

        {/* Header */}
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 700, color: theme.primary, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '6px' }}>
          Benvenuto
        </p>
        <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '28px', fontWeight: 900, color: theme.text, letterSpacing: '-0.8px', lineHeight: 1.15, marginBottom: '10px' }}>
          Di cosa hai<br />bisogno oggi?
        </h1>
        <p style={{ fontSize: '15px', color: theme.textSecondary, lineHeight: 1.6, fontWeight: 600, marginBottom: '0' }}>
          Scegli un'opzione e ti guiderò in ogni passaggio.
        </p>

        {/* Separatore */}
        <div style={{ height: '2px', background: `linear-gradient(to right, ${theme.primary}66, transparent)`, margin: '20px 0 18px', borderRadius: '1px' }} />
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: theme.textSecondary, marginBottom: '16px' }}>
          Seleziona un servizio
        </p>

        {/* CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <button
            onClick={() => setState(s => ({ ...s, currentScreen: 'cup', currentStep: 0 }))}
            style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '18px', borderRadius: '16px', border: `2.5px solid ${theme.border}`,
              background: theme.surface, color: theme.text, cursor: 'pointer',
              fontFamily: 'Nunito, sans-serif', textAlign: 'left', width: '100%',
            }}
          >
            <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: theme.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CalendarDays size={26} color={theme.primary} />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '16px', fontWeight: 800, display: 'block', lineHeight: 1.2 }}>Prenotiamo una Visita</span>
              <span style={{ fontSize: '13px', color: theme.textSecondary, marginTop: '4px', display: 'block', fontWeight: 600 }}>Prenotazione CUP online</span>
            </div>
            <ChevronRight size={22} color={theme.muted} />
          </button>

          <button
            onClick={() => setState(s => ({ ...s, currentScreen: 'pagopa', currentStep: 0 }))}
            style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '18px', borderRadius: '16px', border: `2.5px solid ${theme.border}`,
              background: theme.surface, color: theme.text, cursor: 'pointer',
              fontFamily: 'Nunito, sans-serif', textAlign: 'left', width: '100%',
            }}
          >
            <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: theme.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CreditCard size={26} color={theme.primary} />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '16px', fontWeight: 800, display: 'block', lineHeight: 1.2 }}>Paghiamo un Avviso</span>
              <span style={{ fontSize: '13px', color: theme.textSecondary, marginTop: '4px', display: 'block', fontWeight: 600 }}>Pagamento PagoPA</span>
            </div>
            <ChevronRight size={22} color={theme.muted} />
          </button>
        </div>

        {/* Nota */}
        <div style={{ marginTop: 'auto', paddingTop: '20px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <div style={{ width: '22px', height: '22px', background: theme.primaryLight, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
            <Info size={13} color={theme.primary} />
          </div>
          <p style={{ fontSize: '13px', color: theme.textSecondary, lineHeight: 1.55, fontWeight: 600 }}>
            L'assistente ti guiderà in ogni passaggio. Puoi sempre tornare indietro.
          </p>
        </div>
      </div>
    </div>
  )
}
