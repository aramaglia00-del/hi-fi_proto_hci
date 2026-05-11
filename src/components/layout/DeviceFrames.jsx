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
        padding: '14px',
      }}>
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
      </div>
    </div>
  )
}
