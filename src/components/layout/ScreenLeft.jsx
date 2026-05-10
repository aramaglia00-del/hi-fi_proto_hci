import { useTheme, useFontZoom } from '../../context/AppContext'
import Mascot from '../assistant/Mascot'
import Bubble from '../assistant/Bubble'
import AccessibilityPanel from '../phone/AccessibilityPanel'

export default function ScreenLeft() {
  const theme = useTheme()
  const zoom = useFontZoom()

  return (
    <div
      style={{
        width: '390px', height: '740px', flexShrink: 0,
        background: theme.isHC
          ? '#0A0A0A'
          : 'linear-gradient(160deg, #FFE0B2 0%, #FFF3E4 50%, #FFF8F2 100%)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Content — width/height divided by zoom so visual size stays 390×740 */}
      <div style={{
        width: `${390 / zoom}px`, height: `${740 / zoom}px`, zoom,
        display: 'flex', flexDirection: 'column', padding: '28px 24px',
        overflowY: 'auto', overflowX: 'hidden',
      }}>
        {/* Chip */}
        <div style={{ marginBottom: '10px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: theme.primary, color: theme.primaryText,
            fontFamily: 'Nunito, sans-serif', fontSize: '10px',
            fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase',
            padding: '4px 11px', borderRadius: '20px',
          }}>
            ● Assistente Attivo
          </span>
        </div>

        {/* Titolo */}
        <h1 style={{
          fontFamily: 'Nunito, sans-serif', fontSize: '28px',
          fontWeight: 900, color: theme.text, lineHeight: 1.1,
          letterSpacing: '-0.8px', marginBottom: '0',
        }}>
          Il Tuo<br />
          <span style={{ color: theme.primary }}>Assistente</span>
        </h1>

        {/* Mascotte */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Mascot />
        </div>

        {/* Fumetto */}
        <Bubble text={<>Tocca <strong style={{ color: theme.primary }}>una delle opzioni</strong> qui a fianco per iniziare.<br />Ti guiderò passo dopo passo!</>} />
      </div>

      <AccessibilityPanel />
    </div>
  )
}
