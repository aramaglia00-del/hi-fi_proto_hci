import Mascot from '../assistant/Mascot'
import Bubble from '../assistant/Bubble'

export default function ScreenLeft() {
  return (
    <div
      style={{
        width: '390px',
        height: '740px',
        flexShrink: 0,
        background: 'linear-gradient(160deg, #FFE0B2 0%, #FFF3E4 50%, #FFF8F2 100%)',
        display: 'flex',
        flexDirection: 'column',
        padding: '28px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Chip */}
      <div style={{ marginBottom: '10px' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: '#1A9E8F', color: 'white',
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
        fontWeight: 900, color: '#2D2D2D', lineHeight: 1.1,
        letterSpacing: '-0.8px', marginBottom: '0',
      }}>
        Il Tuo<br />
        <span style={{ color: '#1A9E8F' }}>Assistente</span>
      </h1>

      {/* Mascotte */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Mascot />
      </div>

      {/* Fumetto */}
      <Bubble text={<>Tocca <strong style={{ color: '#1A9E8F' }}>una delle opzioni</strong> qui a fianco per iniziare.<br />Ti guiderò passo dopo passo!</>} />
    </div>
  )
}
