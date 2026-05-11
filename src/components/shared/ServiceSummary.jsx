import { useTheme } from '../../context/AppContext'
import { CheckCircle2 } from 'lucide-react'

/**
 * Unified summary component for both CUP and PagoPA services
 * Shows journey progress and key information
 */
export function ServiceSummary({ 
  service = 'cup', // 'cup' | 'pagopa'
  currentStep = 0,
  items = [],
  confirmText = 'Conferma',
  onConfirm = () => {},
  onBack = () => {},
  successMessage = 'Completato!',
  successIcon = null,
}) {
  const theme = useTheme()

  // Define steps for each service
  const steps = {
    cup: [
      { label: 'Dati', num: 1 },
      { label: 'Ricerca', num: 2 },
      { label: 'Sede', num: 3 },
      { label: 'Conferma', num: 4 },
    ],
    pagopa: [
      { label: 'Bollettino', num: 1 },
      { label: 'Email', num: 2 },
      { label: 'Metodo', num: 3 },
      { label: 'Pagamento', num: 4 },
    ],
  }

  const currentSteps = steps[service] || steps.cup

  const isSuccess = successIcon !== null

  return (
    <div style={{
      height: '100%',
      background: theme.bg,
      padding: '24px 24px 20px',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <p style={{
          fontFamily: 'Nunito, sans-serif',
          fontSize: '13px',
          fontWeight: 700,
          color: theme.primary,
          letterSpacing: '0.8px',
          textTransform: 'uppercase',
          marginBottom: '6px',
        }}>
          {service === 'cup' ? 'CUP · Prenotazione' : 'PagoPA · Pagamento'}
        </p>
        
        {/* Journey Progress */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px',
        }}>
          {currentSteps.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
              {/* Circle */}
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: i <= currentStep ? theme.primary : theme.border,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: i <= currentStep ? theme.primaryText : theme.textSecondary,
                fontWeight: 800,
                fontSize: '12px',
                fontFamily: 'Nunito, sans-serif',
                flexShrink: 0,
              }}>
                {i + 1}
              </div>
              {/* Line */}
              {i < currentSteps.length - 1 && (
                <div style={{
                  height: '2px',
                  background: i < currentStep ? theme.primary : theme.border,
                  flex: 1,
                  margin: '0 6px',
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: 'Nunito, sans-serif',
          fontWeight: 900,
          fontSize: '22px',
          color: theme.text,
          margin: '0 0 8px',
        }}>
          {isSuccess ? successMessage : (service === 'cup' ? 'Dettaglio Prenotazione' : 'Riepilogo Pagamento')}
        </h2>
      </div>

      {/* Success State */}
      {isSuccess && (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '20px 0',
        }}>
          {successIcon || (
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: theme.primaryLight,
              border: `3px solid ${theme.primary}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
            }}>
              <CheckCircle2 size={48} color={theme.primary} />
            </div>
          )}
        </div>
      )}

      {/* Items Summary */}
      {!isSuccess && items.length > 0 && (
        <div style={{ flex: 1, marginBottom: '16px' }}>
          {items.map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              gap: '14px',
              marginBottom: '16px',
              padding: '14px',
              background: theme.surface,
              borderRadius: '14px',
              border: `1.5px solid ${theme.border}`,
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: theme.primaryLight,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontWeight: 800,
                  fontSize: '13px',
                  color: theme.muted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontFamily: 'Nunito, sans-serif',
                  marginBottom: '3px',
                }}>
                  {item.label}
                </div>
                <div style={{
                  fontWeight: 700,
                  fontSize: '15px',
                  color: theme.text,
                  fontFamily: 'Nunito, sans-serif',
                }}>
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginTop: 'auto',
      }}>
        {!isSuccess && (
          <button
            onClick={onBack}
            style={{
              flex: 1,
              padding: '16px',
              borderRadius: '14px',
              border: `2px solid ${theme.border}`,
              background: theme.surface,
              color: theme.text,
              fontFamily: 'Nunito, sans-serif',
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
              minHeight: '58px',
            }}
          >
            Indietro
          </button>
        )}
        <button
          onClick={onConfirm}
          style={{
            flex: isSuccess ? 1 : 2,
            padding: '16px',
            background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)`,
            color: theme.primaryText,
            borderRadius: '14px',
            fontWeight: 900,
            border: 'none',
            cursor: 'pointer',
            fontSize: '15px',
            fontFamily: 'Nunito, sans-serif',
            minHeight: '58px',
            boxShadow: `0 4px 16px ${theme.primary}55`,
          }}
        >
          {isSuccess ? 'Torna alla schermata principale' : confirmText + ' →'}
        </button>
      </div>
    </div>
  )
}
