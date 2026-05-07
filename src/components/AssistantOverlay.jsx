function Mascot() {
  return (
    <svg
      style={{ width: '58px', height: 'auto', flexShrink: 0, filter: 'drop-shadow(0 3px 8px rgba(245,166,35,0.25))' }}
      viewBox="0 0 200 220"
      fill="none"
    >
      <style>{`@keyframes mascotFloat{0%,100%{transform:translateY(0px) rotate(-1.5deg)}50%{transform:translateY(-6px) rotate(1.5deg)}}`}</style>
      <defs>
        <clipPath id="shirtClip2">
          <path d="M52 118 Q54 106 100 112 Q146 106 148 118 L154 204 Q154 210 145 210 L55 210 Q46 210 46 204 Z"/>
        </clipPath>
      </defs>
      <ellipse cx="100" cy="215" rx="47" ry="8" fill="#1A1A1A" opacity="0.12"/>
      <g style={{ animation: 'mascotFloat 2.8s ease-in-out infinite', transformOrigin: '50% 50%', transformBox: 'fill-box' }}>
        <path d="M52 130 Q34 152 32 176" stroke="#1A9E8F" strokeWidth="19" strokeLinecap="round"/>
        <path d="M148 130 Q166 152 168 176" stroke="#1A9E8F" strokeWidth="19" strokeLinecap="round"/>
        <path d="M52 118 Q54 106 100 112 Q146 106 148 118 L154 204 Q154 210 145 210 L55 210 Q46 210 46 204 Z" fill="#1A9E8F"/>
        <rect x="38" y="130" width="124" height="12" fill="#147A6E" clipPath="url(#shirtClip2)"/>
        <rect x="38" y="156" width="124" height="12" fill="#147A6E" clipPath="url(#shirtClip2)"/>
        <rect x="38" y="182" width="124" height="22" fill="#147A6E" clipPath="url(#shirtClip2)"/>
        <path d="M80 112 Q100 130 120 112" fill="none" stroke="white" strokeWidth="11" strokeLinecap="round"/>
        <rect x="91" y="108" width="18" height="12" rx="6" fill="#FBBF8C"/>
        <ellipse cx="56" cy="70" rx="11" ry="13" fill="#FBBF8C"/>
        <ellipse cx="144" cy="70" rx="11" ry="13" fill="#FBBF8C"/>
        <ellipse cx="56" cy="70" rx="6.5" ry="9" fill="#F5A07A"/>
        <ellipse cx="144" cy="70" rx="6.5" ry="9" fill="#F5A07A"/>
        <ellipse cx="100" cy="66" rx="44" ry="47" fill="#FBBF8C"/>
        <path d="M56 60 Q58 18 100 14 Q142 18 144 60" fill="#4A2C0A"/>
        <path d="M84 16 Q88 2 100 13" stroke="#4A2C0A" strokeWidth="9" strokeLinecap="round" fill="none"/>
        <path d="M100 13 Q112 1 116 16" stroke="#4A2C0A" strokeWidth="8" strokeLinecap="round" fill="none"/>
        <path d="M72 48 Q83 43 94 47" stroke="#4A2C0A" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
        <path d="M106 47 Q117 43 128 48" stroke="#4A2C0A" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
        <ellipse cx="84" cy="64" rx="14" ry="15" fill="white"/>
        <ellipse cx="116" cy="64" rx="14" ry="15" fill="white"/>
        <ellipse cx="84" cy="65" rx="9" ry="9.5" fill="#1A9E8F"/>
        <ellipse cx="116" cy="65" rx="9" ry="9.5" fill="#1A9E8F"/>
        <ellipse cx="85" cy="65.5" rx="5" ry="5.5" fill="#1A1A1A"/>
        <ellipse cx="117" cy="65.5" rx="5" ry="5.5" fill="#1A1A1A"/>
        <circle cx="87" cy="62.5" r="2.5" fill="white"/>
        <circle cx="119" cy="62.5" r="2.5" fill="white"/>
        <path d="M96 78 Q100 84 104 78" stroke="#E8907A" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <path d="M80 91 Q100 110 120 91" stroke="#C0604A" strokeWidth="3.2" fill="none" strokeLinecap="round"/>
        <ellipse cx="69" cy="80" rx="13" ry="9" fill="#F9A0A0" opacity="0.5"/>
        <ellipse cx="131" cy="80" rx="13" ry="9" fill="#F9A0A0" opacity="0.5"/>
        <ellipse cx="32" cy="178" rx="17" ry="15" fill="#FBBF8C"/>
        <ellipse cx="168" cy="178" rx="17" ry="15" fill="#FBBF8C"/>
        <path d="M174 171 L190 161" stroke="#FBBF8C" strokeWidth="10" strokeLinecap="round"/>
        <ellipse cx="190" cy="161" rx="7" ry="5" fill="#F5A07A" transform="rotate(-22 190 161)"/>
      </g>
    </svg>
  )
}

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

const CARD_STYLE = {
  background: 'rgba(255, 255, 255, 0.97)',
  borderRadius: '22px',
  boxShadow: '0 8px 36px rgba(0,0,0,0.30)',
  border: '2.5px solid rgba(26,158,143,0.45)',
  padding: '18px 20px',
}

const TAG_STYLE = {
  display: 'inline-flex', alignItems: 'center',
  background: '#FFF0E0', borderRadius: '8px', padding: '5px 11px',
  fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 800,
  color: '#D4720A', letterSpacing: '0.4px', textTransform: 'uppercase',
  marginBottom: '10px',
}

const TEXT_STYLE = {
  fontFamily: 'Nunito, sans-serif',
  fontSize: '16px', fontWeight: 700,
  lineHeight: 1.72, color: '#1A1A1A', margin: '0 0 12px',
}

function MascotFooter() {
  return (
    <>
      <div style={{ height: '1px', background: 'rgba(0,0,0,0.08)', margin: '0 0 10px' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Mascot />
        <p style={{
          fontFamily: 'Nunito, sans-serif', fontSize: '13px',
          fontWeight: 600, color: '#5A5755', lineHeight: 1.5,
          fontStyle: 'italic', margin: 0, flex: 1,
        }}>
          Puoi sempre tornare indietro.<br />Non puoi fare danni!
        </p>
      </div>
    </>
  )
}

export default function AssistantOverlay({ tag, text, highlightZone, showGesture, forceTop }) {
  const atTop = forceTop || (highlightZone && highlightZone.top > 350)

  if (showGesture) {
    return (
      <div style={{ position: 'absolute', top: 10, left: 10, right: 10, zIndex: 10 }}>
        <div style={CARD_STYLE}>
          <div style={TAG_STYLE}>{tag}</div>
          <p style={TEXT_STYLE}>{text}</p>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0 8px' }}>
            <ScrollGesture />
          </div>
          <MascotFooter />
        </div>
      </div>
    )
  }

  return (
    <div style={{
      position: 'absolute',
      top: atTop ? 10 : 'auto',
      bottom: atTop ? 'auto' : 10,
      left: 10, right: 10,
      zIndex: 10,
    }}>
      <div style={CARD_STYLE}>
        <div style={TAG_STYLE}>{tag}</div>
        <p style={TEXT_STYLE}>{text}</p>
        <MascotFooter />
      </div>
    </div>
  )
}
