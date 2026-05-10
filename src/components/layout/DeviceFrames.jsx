// ── DEVICE FRAME COMPONENTS ────────────────────────────────────────
// PhoneFrame: wraps 390×740 phone screen content in a realistic bezel
// TotemFrame: wraps 390×740 totem screen content in a kiosk bezel

export function PhoneFrame({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        position: 'relative',
        background: '#DCDCDE',
        borderRadius: '44px',
        padding: '12px 10px 0px 10px',
        boxShadow: '0 40px 90px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.2)',
        flexShrink: 0,
      }}>
        {/* Camera notch */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100px',
          height: '26px',
          background: '#DCDCDE',
          borderRadius: '0 0 14px 14px',
          zIndex: 500,
          pointerEvents: 'none',
        }} />

        {/* Side power button */}
        <div style={{
          position: 'absolute',
          right: '-4px',
          top: '130px',
          width: '4px',
          height: '60px',
          background: '#B8B8BA',
          borderRadius: '2px 0 0 2px',
        }} />

        {/* Volume buttons */}
        <div style={{
          position: 'absolute',
          left: '-4px',
          top: '100px',
          width: '4px',
          height: '36px',
          background: '#B8B8BA',
          borderRadius: '0 2px 2px 0',
          marginBottom: '8px',
        }} />
        <div style={{
          position: 'absolute',
          left: '-4px',
          top: '146px',
          width: '4px',
          height: '60px',
          background: '#B8B8BA',
          borderRadius: '0 2px 2px 0',
        }} />

        {/* Screen clip */}
        <div style={{
          width: '390px',
          height: '740px',
          borderRadius: '36px',
          overflow: 'hidden',
          position: 'relative',
        }}>
          {children}
        </div>

        {/* Home indicator */}
        <div style={{
          width: '90px',
          height: '5px',
          background: '#999',
          borderRadius: '3px',
          margin: '8px auto 10px',
        }} />
      </div>

      {/* Label */}
      <div style={{
        marginTop: '10px',
        color: 'white',
        fontSize: '10px',
        opacity: 0.4,
        fontFamily: 'Nunito, sans-serif',
        fontWeight: 600,
      }}>
        📱 Il tuo telefono
      </div>
    </div>
  )
}

export function TotemFrame({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        position: 'relative',
        background: '#141B28',
        borderRadius: '22px',
        boxShadow: '0 40px 90px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.04)',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        padding: '0 14px',
      }}>
        {/* Header brand bar */}
        <div style={{
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          marginTop: '10px',
          marginBottom: '4px',
        }}>
          {/* Teal icon */}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="12" height="12" rx="3" fill="#1A9E8F" opacity="0.85"/>
            <path d="M4 7h6M7 4v6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '10px',
            fontWeight: 800,
            color: 'rgba(255,255,255,0.55)',
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}>
            ServizioPA
          </span>
        </div>

        {/* Inner screen */}
        <div style={{
          width: '390px',
          height: '740px',
          borderRadius: '10px',
          overflow: 'hidden',
          position: 'relative',
        }}>
          {children}
        </div>

        {/* NFC footer */}
        <div style={{
          height: '26px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          marginTop: '4px',
          marginBottom: '10px',
        }}>
          {/* NFC contactless icon */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 8 Q10 6 10 4" stroke="#1A9E8F" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
            <path d="M8 8 Q12 5 12 2" stroke="#1A9E8F" strokeWidth="1.2" strokeLinecap="round" opacity="0.35"/>
            <path d="M8 8 Q14 4 14 0" stroke="#1A9E8F" strokeWidth="1.2" strokeLinecap="round" opacity="0.2"/>
            <circle cx="8" cy="8" r="2" fill="#1A9E8F" opacity="0.6"/>
          </svg>
          <span style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '9px',
            fontWeight: 700,
            color: 'rgba(26,158,143,0.55)',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}>
            NFC · Avvicina la tessera
          </span>
        </div>
      </div>

      {/* Label */}
      <div style={{
        marginTop: '10px',
        color: 'white',
        fontSize: '10px',
        opacity: 0.4,
        fontFamily: 'Nunito, sans-serif',
        fontWeight: 600,
      }}>
        🖥 Totem ServizioPA
      </div>
    </div>
  )
}
