export default function PointerArrow() {
  return (
    <>
      <style>{`
        @keyframes nudge {
          0%,100% { transform: translateY(-50%) translateX(0); }
          50% { transform: translateY(-50%) translateX(5px); }
        }
      `}</style>
      <div style={{
        position: 'absolute', top: '50%', right: '-16px',
        width: '26px', height: '26px',
        background: '#F5A623', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 3px 10px rgba(245,166,35,0.5)',
        animation: 'nudge 1.1s ease-in-out infinite',
        zIndex: 20,
      }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </div>
    </>
  )
}
