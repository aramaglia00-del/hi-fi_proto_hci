import { useState } from 'react'
import { useApp, useTheme } from '../../context/AppContext'

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
  const cm = state.accessibility?.colorMode || 'normal'

  const setFs = v => setState(s => ({ ...s, accessibility: { ...s.accessibility, fontSize: v } }))
  const setCm = v => setState(s => ({ ...s, accessibility: { ...s.accessibility, colorMode: v } }))

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
        ⚙️
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
                ⚙️ Accessibilità
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

            <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: 11, fontWeight: 800, color: theme.muted, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10 }}>
              Contrasto colori
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { id: 'normal',       label: 'Normale',        bg: '#FFF8F0', fg: '#1A1A1A', dot: '#1A9E8F' },
                { id: 'highContrast', label: 'Alto contrasto', bg: '#000',    fg: 'white',   dot: '#FFD700' },
              ].map(o => (
                <button key={o.id} onClick={() => setCm(o.id)} style={{
                  flex: 1, padding: '10px 8px', borderRadius: 12,
                  border: cm === o.id ? `2.5px solid ${theme.primary}` : `2px solid ${theme.border}`,
                  background: o.bg,
                  cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                }}>
                  <div style={{ width: 24, height: 14, borderRadius: 3, background: o.dot }} />
                  <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: 11, fontWeight: 800, color: o.fg }}>
                    {o.label}
                  </span>
                  {cm === o.id && <span style={{ fontSize: 12, color: o.dot }}>✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
