import { useState } from 'react'
import { useApp } from '../../context/AppContext'

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3.2" stroke="white" strokeWidth="1.8"/>
      <path d="M12 2.8v2.1M12 19.1v2.1M4.9 4.9l1.5 1.5M17.6 17.6l1.5 1.5M2.8 12h2.1M19.1 12h2.1M4.9 19.1l1.5-1.5M17.6 6.4l1.5-1.5" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  )
}

const sizeOptions = [
  { id: 'normal',  label: 'Normale',       display: 'A',   samplePx: 14 },
  { id: 'large',   label: 'Grande',        display: 'AA',  samplePx: 17 },
  { id: 'xlarge',  label: 'Molto grande',  display: 'AAA', samplePx: 21 },
]

export default function SettingsButton() {
  const [open, setOpen] = useState(false)
  const { state, setState } = useApp()

  const fontSize = state.accessibility?.fontSize || 'normal'
  const setFontSize = (val) => {
    setState(s => ({ ...s, accessibility: { ...s.accessibility, fontSize: val } }))
  }
  return (
    <>
      {/* Settings gear button — absolute within 1180×820 design area */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          zIndex: 1000,
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1A9E8F 0%, #147A6E 100%)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(26,158,143,0.50)',
          color: 'white',
          fontSize: '20px',
        }}
        title="Impostazioni accessibilità"
      >
        <GearIcon />
      </button>

      {/* Overlay panel */}
      {open && (
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 999,
          pointerEvents: 'all',
        }}>
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.45)',
            }}
          />

          {/* Panel */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '340px',
            height: '100%',
            background: 'white',
            zIndex: 1001,
            boxShadow: '4px 0 32px rgba(0,0,0,0.20)',
            display: 'flex',
            flexDirection: 'column',
            padding: '28px 24px',
            overflowY: 'auto',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
              <h2 style={{
                fontFamily: 'Nunito, sans-serif',
                fontSize: '24px',
                fontWeight: 900,
                color: '#1A1A1A',
                margin: 0,
              }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}><GearIcon />Impostazioni</span>
              </h2>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: '#F5F5F5',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  cursor: 'pointer',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#555',
                  fontWeight: 700,
                }}
              >
                ✕
              </button>
            </div>

            {/* Font size section */}
            <p style={{
              fontFamily: 'Nunito, sans-serif',
              fontSize: '13px',
              fontWeight: 800,
              color: '#9CA3AF',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '14px',
            }}>
              Dimensione testo
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
              {sizeOptions.map(opt => {
                const isActive = fontSize === opt.id
                return (
                  <button
                    key={opt.id}
                    onClick={() => setFontSize(opt.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '14px 16px',
                      borderRadius: '16px',
                      border: isActive ? '2.5px solid #1A9E8F' : '2px solid #E0E0E0',
                      background: isActive ? '#E8F7F5' : 'white',
                      cursor: 'pointer',
                      width: '100%',
                      transition: 'all 0.2s',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{
                      fontFamily: 'Nunito, sans-serif',
                      fontSize: '22px',
                      fontWeight: 900,
                      color: isActive ? '#1A9E8F' : '#1A1A1A',
                      minWidth: '40px',
                    }}>
                      {opt.display}
                    </span>
                    <div style={{ flex: 1 }}>
                      <span style={{
                        fontFamily: 'Nunito, sans-serif',
                        fontSize: '15px',
                        fontWeight: 800,
                        color: isActive ? '#1A9E8F' : '#1A1A1A',
                        display: 'block',
                      }}>
                        {opt.label}
                      </span>
                      <span style={{
                        fontFamily: 'Nunito, sans-serif',
                        fontSize: opt.samplePx,
                        fontWeight: 600,
                        color: '#888',
                      }}>
                        Esempio testo
                      </span>
                    </div>
                    {isActive && (
                      <span style={{ color: '#1A9E8F', fontSize: '18px' }}>✓</span>
                    )}
                  </button>
                )
              })}
            </div>

          </div>
        </div>
      )}
    </>
  )
}
