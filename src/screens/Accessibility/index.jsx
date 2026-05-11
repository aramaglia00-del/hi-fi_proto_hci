import { useApp, useTheme } from '../../context/AppContext'
import { TotemFrame } from '../../components/layout/DeviceFrames'
import { Type } from 'lucide-react'

export default function Accessibility() {
  const { state, setState } = useApp()
  const theme = useTheme()

  const handleFontSize = (size) => {
    setState(s => ({
      ...s,
      accessibility: { ...s.accessibility, fontSize: size },
      currentScreen: 'pairing',
      currentStep: 0,
    }))
  }

  return (
    <TotemFrame>
      <div
        style={{
          width: '390px',
          height: '740px',
          background: theme.bg,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 28px',
          textAlign: 'center',
        }}
      >
        <div style={{ marginBottom: '48px' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              background: theme.primaryLight,
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 28px',
            }}
          >
            <Type size={44} color={theme.primary} strokeWidth={1.5} />
          </div>
          <h1
            style={{
              fontFamily: 'Nunito, sans-serif',
              fontSize: '28px',
              fontWeight: 900,
              color: theme.text,
              margin: '0 0 8px',
              lineHeight: 1.2,
            }}
          >
            Dimensione Caratteri
          </h1>
          <p
            style={{
              fontFamily: 'Nunito, sans-serif',
              fontSize: '14px',
              color: theme.textSecondary,
              margin: '0',
              fontWeight: 600,
            }}
          >
            Scegli la tua preferenza
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '100%',
          }}
        >
          {/* Normal Size Button */}
          <button
            onClick={() => handleFontSize('normal')}
            style={{
              padding: '16px 20px',
              borderRadius: '14px',
              border: `2.5px solid ${theme.border}`,
              background: theme.surface,
              color: theme.text,
              cursor: 'pointer',
              fontFamily: 'Nunito, sans-serif',
              fontSize: '16px',
              fontWeight: 700,
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              minHeight: '54px',
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = theme.primary
              e.target.style.boxShadow = `0 4px 12px ${theme.primary}22`
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = theme.border
              e.target.style.boxShadow = 'none'
            }}
          >
            <span
              style={{
                fontSize: '14px',
                width: '24px',
                height: '24px',
                background: theme.primaryLight,
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                color: theme.primary,
              }}
            >
              A
            </span>
            Normale
          </button>

          {/* Large Size Button */}
          <button
            onClick={() => handleFontSize('large')}
            style={{
              padding: '16px 20px',
              borderRadius: '14px',
              border: `2.5px solid ${theme.border}`,
              background: theme.surface,
              color: theme.text,
              cursor: 'pointer',
              fontFamily: 'Nunito, sans-serif',
              fontSize: '16px',
              fontWeight: 700,
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              minHeight: '54px',
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = theme.primary
              e.target.style.boxShadow = `0 4px 12px ${theme.primary}22`
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = theme.border
              e.target.style.boxShadow = 'none'
            }}
          >
            <span
              style={{
                fontSize: '18px',
                width: '24px',
                height: '24px',
                background: theme.primaryLight,
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                color: theme.primary,
              }}
            >
              A
            </span>
            Grande
          </button>

          {/* Extra Large Size Button */}
          <button
            onClick={() => handleFontSize('xlarge')}
            style={{
              padding: '16px 20px',
              borderRadius: '14px',
              border: `2.5px solid ${theme.border}`,
              background: theme.surface,
              color: theme.text,
              cursor: 'pointer',
              fontFamily: 'Nunito, sans-serif',
              fontSize: '16px',
              fontWeight: 700,
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              minHeight: '54px',
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = theme.primary
              e.target.style.boxShadow = `0 4px 12px ${theme.primary}22`
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = theme.border
              e.target.style.boxShadow = 'none'
            }}
          >
            <span
              style={{
                fontSize: '22px',
                width: '24px',
                height: '24px',
                background: theme.primaryLight,
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                color: theme.primary,
              }}
            >
              A
            </span>
            Più Grande
          </button>
        </div>

        <p
          style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '12px',
            color: theme.textSecondary,
            margin: 'auto 0 0',
            fontWeight: 600,
            marginTop: '32px',
          }}
        >
          Potrai cambiare questa impostazione in qualsiasi momento.
        </p>
      </div>
    </TotemFrame>
  )
}
