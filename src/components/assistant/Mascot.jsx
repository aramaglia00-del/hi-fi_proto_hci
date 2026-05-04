export default function Mascot() {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <svg
        style={{
          width: '150px', height: '150px',
          filter: 'drop-shadow(0 8px 18px rgba(245,166,35,0.22))',
          animation: 'bounce 2.8s ease-in-out infinite',
        }}
        viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg"
      >
        <style>{`@keyframes bounce { 0%,100%{transform:translateY(0) rotate(-1deg)} 50%{transform:translateY(-9px) rotate(1deg)} }`}</style>
        <ellipse cx="80" cy="148" rx="36" ry="8" fill="#D4A57A" opacity="0.22"/>
        <path d="M45 108 Q49 91 80 87 Q111 91 115 108 L115 150 Q115 153 111 153 L49 153 Q45 153 45 150 Z" fill="#1A9E8F"/>
        <path d="M68 87 L80 101 L92 87" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <rect x="72" y="79" width="16" height="13" rx="6" fill="#FBBF8C"/>
        <ellipse cx="80" cy="58" rx="29" ry="31" fill="#FBBF8C"/>
        <path d="M51 50 Q52 24 80 22 Q108 24 109 50" fill="#4A2C0A"/>
        <path d="M69 24 Q73 13 80 20" stroke="#4A2C0A" strokeWidth="5.5" strokeLinecap="round" fill="none"/>
        <path d="M80 20 Q88 11 90 22" stroke="#4A2C0A" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
        <ellipse cx="51" cy="59" rx="7" ry="9" fill="#FBBF8C"/>
        <ellipse cx="109" cy="59" rx="7" ry="9" fill="#FBBF8C"/>
        <ellipse cx="51" cy="59" rx="4" ry="6" fill="#F5A07A"/>
        <ellipse cx="109" cy="59" rx="4" ry="6" fill="#F5A07A"/>
        <path d="M62 42 Q68 38 74 41" stroke="#4A2C0A" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <path d="M86 41 Q92 38 98 42" stroke="#4A2C0A" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <ellipse cx="69" cy="53" rx="8" ry="9" fill="white"/>
        <ellipse cx="91" cy="53" rx="8" ry="9" fill="white"/>
        <ellipse cx="70" cy="54" rx="5" ry="5.5" fill="#2D6A4F"/>
        <ellipse cx="92" cy="54" rx="5" ry="5.5" fill="#2D6A4F"/>
        <ellipse cx="70.5" cy="54.5" rx="3" ry="3.5" fill="#1A1A1A"/>
        <ellipse cx="92.5" cy="54.5" rx="3" ry="3.5" fill="#1A1A1A"/>
        <circle cx="72" cy="52.5" r="1.4" fill="white"/>
        <circle cx="94" cy="52.5" r="1.4" fill="white"/>
        <path d="M62 45 L63 42" stroke="#4A2C0A" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M77 44 L78 41" stroke="#4A2C0A" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M84 44 L83 41" stroke="#4A2C0A" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M98 45 L97 42" stroke="#4A2C0A" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M77 64 Q80 68 83 64" stroke="#E8907A" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        <path d="M68 74 Q80 84 92 74" stroke="#C0604A" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <ellipse cx="57" cy="70" rx="8" ry="5" fill="#F9A0A0" opacity="0.45"/>
        <ellipse cx="103" cy="70" rx="8" ry="5" fill="#F9A0A0" opacity="0.45"/>
        <path d="M45 108 Q33 118 35 131" stroke="#1A9E8F" strokeWidth="13" strokeLinecap="round"/>
        <path d="M115 108 Q127 118 125 131" stroke="#1A9E8F" strokeWidth="13" strokeLinecap="round"/>
        <ellipse cx="35" cy="132" rx="10" ry="9" fill="#FBBF8C"/>
        <ellipse cx="125" cy="132" rx="10" ry="9" fill="#FBBF8C"/>
        <path d="M131 127 L145 120" stroke="#FBBF8C" strokeWidth="6.5" strokeLinecap="round"/>
        <ellipse cx="145" cy="120" rx="4" ry="3" fill="#F5A07A" transform="rotate(-22 145 120)"/>
      </svg>
    </div>
  )
}
