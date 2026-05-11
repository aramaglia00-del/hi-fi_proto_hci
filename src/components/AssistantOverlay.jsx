function ScrollGesture() {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '10px', margin: '6px 0' }}>
      <style>{`
        @keyframes scrollUp {
          0%   { transform: translateY(18px); opacity: 0; }
          18%  { opacity: 1; }
          78%  { opacity: 1; }
          100% { transform: translateY(-18px); opacity: 0; }
        }
        @keyframes chvFade {
          0%,100% { opacity: 0.15; }
          50%     { opacity: 1; }
        }
      `}</style>
      <div style={{ animation: 'scrollUp 1.5s ease-in-out infinite', display: 'flex' }}>
        <svg width="44" height="56" viewBox="0 0 48 60" fill="none">
          <rect x="14" y="48" width="20" height="10" rx="5" fill="#FBBF8C"/>
          <rect x="8"  y="24" width="32" height="26" rx="11" fill="#FBBF8C"/>
          <rect x="8"  y="34" width="32" height="16" rx="8"  fill="#F5A07A" opacity="0.45"/>
          <rect x="19" y="4"  width="10" height="26" rx="5"  fill="#FBBF8C"/>
          <rect x="19" y="4"  width="10" height="12" rx="5"  fill="#F5A07A" opacity="0.5"/>
          <rect x="21" y="5"  width="6"  height="8"  rx="3"  fill="#F0C4A0"/>
          <rect x="8"  y="26" width="9"  height="18" rx="4.5" fill="#FBBF8C"/>
          <rect x="31" y="26" width="9"  height="18" rx="4.5" fill="#FBBF8C"/>
          <rect x="13" y="22" width="9"  height="20" rx="4.5" fill="#FBBF8C"/>
          <rect x="26" y="22" width="9"  height="20" rx="4.5" fill="#FBBF8C"/>
          <circle cx="17" cy="29" r="2.2" fill="#F0A87C"/>
          <circle cx="24" cy="27" r="2.2" fill="#F0A87C"/>
          <circle cx="31" cy="29" r="2.2" fill="#F0A87C"/>
        </svg>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
        {[0.3, 0.15, 0].map((delay, i) => (
          <svg key={i} width="22" height="14" viewBox="0 0 20 13" fill="none"
            style={{ animation: `chvFade 1.2s ease-in-out ${delay}s infinite` }}>
            <polyline points="1 11 10 2 19 11" stroke="#1A9E8F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ))}
        <span style={{
          fontFamily: 'Nunito, sans-serif', fontSize: '11px', fontWeight: 800,
          color: '#1A9E8F', letterSpacing: '0.8px', textTransform: 'uppercase', marginTop: '2px',
        }}>Scorri su</span>
      </div>
    </div>
  )
}

import { useFontZoom, useTheme } from '../context/AppContext'

export default function AssistantOverlay({ tag, text, highlightZone, showGesture, forceTop, tutorialMode }) {
  const zoom = useFontZoom()
  const theme = useTheme()
  const atTop = forceTop || (highlightZone && highlightZone.top > 350)

  const cardStyle = {
    background: theme.isHC ? 'rgba(10,10,10,0.97)' : 'rgba(255,255,255,0.97)',
    borderRadius: '22px',
    boxShadow: '0 8px 36px rgba(0,0,0,0.30)',
    border: `2.5px solid ${theme.primary}72`,
    padding: tutorialMode ? '20px 22px' : '18px 20px',
    width: `${330 / zoom}px`,
    maxHeight: `${(tutorialMode ? 600 : 280) / zoom}px`,
    overflowY: 'auto',
  }
  const tagStyle = {
    display: 'inline-flex', alignItems: 'center',
    background: theme.isHC ? '#1A1400' : '#FFF0E0',
    borderRadius: '8px', padding: '5px 11px',
    fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 800,
    color: theme.isHC ? theme.primary : '#D4720A',
    letterSpacing: '0.4px', textTransform: 'uppercase', marginBottom: '10px',
  }
  const textStyle = {
    fontFamily: 'Nunito, sans-serif', fontSize: '16px', fontWeight: 700,
    lineHeight: 1.72, color: theme.text, margin: 0,
  }

  if (showGesture) {
    return (
      <div style={{ position: 'absolute', top: atTop ? 100 : 'auto', bottom: atTop ? 'auto' : 30, left: 14, right: 14, zIndex: 10 }}>
        <div style={{ ...cardStyle, zoom }}>
          <div style={tagStyle}>{tag}</div>
          <p style={{ ...textStyle, marginBottom: '12px' }}>{text}</p>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0 4px' }}>
            <ScrollGesture />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ position: 'absolute', top: atTop ? 100 : 'auto', bottom: atTop ? 'auto' : 30, left: 14, right: 14, zIndex: 10 }}>
      <div style={{ ...cardStyle, zoom }}>
        <div style={tagStyle}>{tag}</div>
        <p style={textStyle}>{text}</p>
      </div>
    </div>
  )
}
