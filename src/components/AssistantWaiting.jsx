import { useTheme, useFontZoom } from '../context/AppContext'

export default function AssistantWaiting() {
  const theme = useTheme()
  const zoom = useFontZoom()

  return (
    <div style={{
      width: '390px', height: '740px', overflow: 'hidden',
      background: theme.bg,
      position: 'relative',
    }}>
      <div style={{
        width: `${390/zoom}px`, height: `${740/zoom}px`, zoom,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '36px 28px',
        overflowY: 'auto', overflowX: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '36px' }}>
          <div style={{ width: '28px', height: '28px', background: theme.primary, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M7 3v8" stroke={theme.primaryText} strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '16px', fontWeight: 900, color: theme.text, letterSpacing: '-0.2px' }}>
            ServizioPA
          </span>
        </div>

        <div style={{ marginBottom: '22px' }}>
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
            <circle cx="36" cy="36" r="33" fill={`${theme.primary}1A`} stroke={`${theme.primary}40`} strokeWidth="1.5"/>
            <path d="M22 36 H50 M42 26 L50 36 L42 46" stroke={theme.primary} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h2 style={{
          fontFamily: 'Nunito, sans-serif', fontSize: '23px', fontWeight: 900,
          color: theme.text,
          textAlign: 'center', lineHeight: 1.3, marginBottom: '10px',
        }}>
          Guarda il totem
        </h2>
        <p style={{
          fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: 600,
          color: theme.textSecondary,
          textAlign: 'center', lineHeight: 1.65, maxWidth: '230px',
        }}>
          Segui le istruzioni sullo schermo grande accanto a te
        </p>
      </div>
    </div>
  )
}
