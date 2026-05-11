import { useState } from 'react'
import { useApp, useTheme } from '../../context/AppContext'

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3.2" stroke="white" strokeWidth="1.8"/>
      <path d="M12 2.8v2.1M12 19.1v2.1M4.9 4.9l1.5 1.5M17.6 17.6l1.5 1.5M2.8 12h2.1M19.1 12h2.1M4.9 19.1l1.5-1.5M17.6 6.4l1.5-1.5" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  )
}

const SIZE_OPTS = [
  { id: 'normal',  label: 'Normale',  d: 'A'   },
  { id: 'large',   label: 'Grande',   d: 'AA'  },
  { id: 'xlarge',  label: 'Max',      d: 'AAA' },
]

export default function AccessibilityPanel() {
  const [open, setOpen] = useState(false)
  const { state, setState } = useApp()
  const theme = useTheme()
  const fs = state.accessibility?.fontSize || 'normal'

  const setFs = v => setState(s => ({ ...s, accessibility: { ...s.accessibility, fontSize: v } }))

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          position: 'absolute', top: 54, right: 12, zIndex: 200,
          width: 38, height: 38, borderRadius: '50%',
          background: theme.primary,
          border: `2px solid ${theme.primaryDark}`,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)', fontSize: 16, lineHeight: 1,
        }}
        title="Accessibilità"
      >
        <GearIcon />
      </button>

      {open && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 500 }}>
          <div
            onClick={() => setOpen(false)}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)' }}
          />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: theme.surface,
            borderRadius: '20px 20px 0 0',
            padding: '16px 18px 32px',
            zIndex: 501,
          }}>
            {/* Handle */}
            <div style={{ width: 40, height: 4, borderRadius: 2, background: theme.muted, margin: '0 auto 14px' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'Nunito, sans-serif', fontSize: 17, fontWeight: 900, color: theme.text, margin: 0 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}><GearIcon />Accessibilità</span>
              </h3>
              <button
                onClick={() => setOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: theme.textSecondary, lineHeight: 1 }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: 11, fontWeight: 800, color: theme.muted, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10 }}>
              Dimensione testo
            </p>
            <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
              {SIZE_OPTS.map(o => (
                <button key={o.id} onClick={() => setFs(o.id)} style={{
                  flex: 1, padding: '10px 4px', borderRadius: 12,
                  border: fs === o.id ? `2.5px solid ${theme.primary}` : `2px solid ${theme.border}`,
                  background: fs === o.id ? theme.primaryLight : theme.cardBg,
                  cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                }}>
                  <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: 20, fontWeight: 900, color: fs === o.id ? theme.primary : theme.text }}>
                    {o.d}
                  </span>
                  <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: 10, fontWeight: 700, color: theme.muted }}>
                    {o.label}
                  </span>
                </button>
              ))}
            </div>

          </div>
        </div>
      )}
    </>
  )
}
