export default function Bubble({ text }) {
  return (
    <div style={{ position: 'relative' }}>
      {/* Triangolino */}
      <div style={{ position: 'absolute', top: '-10px', left: '32px', width: 0, height: 0, borderLeft: '9px solid transparent', borderRight: '9px solid transparent', borderBottom: '10px solid rgba(245,166,35,0.22)' }} />
      <div style={{ position: 'absolute', top: '-7px', left: '34px', width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderBottom: '8px solid white' }} />
      <div style={{
        background: 'white', borderRadius: '18px', padding: '14px 16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '2px solid rgba(245,166,35,0.22)',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          fontFamily: 'Nunito, sans-serif', fontSize: '11px', fontWeight: 800,
          letterSpacing: '0.5px', textTransform: 'uppercase',
          color: '#D4720A', background: '#FFF0E0', borderRadius: '5px',
          padding: '3px 8px', marginBottom: '8px',
        }}>
          💡 Suggerimento
        </div>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontWeight: 600, lineHeight: 1.65, color: '#2D2D2D' }}>
          {text}
        </p>
      </div>
    </div>
  )
}
