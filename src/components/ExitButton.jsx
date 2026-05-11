import { LogOut } from 'lucide-react'
import { useTheme } from '../context/AppContext'

export default function ExitButton({ onClick, variant = 'overlay' }) {
  const theme = useTheme()
  const isHC = theme.isHC

  if (variant === 'inline') {
    return (
      <button
        onClick={onClick}
        title="Disconnetti telefono dal totem"
        style={{
          marginLeft: 'auto',
          background: isHC ? '#1A1400' : '#FFF0F0',
          border: `1.5px solid ${isHC ? '#FFD700' : '#F4C7C3'}`,
          borderRadius: '999px',
          padding: '6px 12px',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '6px',
          fontFamily: 'Nunito, sans-serif', fontSize: '12px', fontWeight: 800,
          color: isHC ? '#FFD700' : '#C0392B',
        }}
      >
        <LogOut size={13} strokeWidth={2.4} /> Esci
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      title="Disconnetti telefono dal totem"
      style={{
        position: 'absolute', top: 12, right: 12, zIndex: 200,
        background: isHC ? '#1A1400' : 'rgba(255,255,255,0.97)',
        border: `1.5px solid ${isHC ? '#FFD700' : 'rgba(192,57,43,0.25)'}`,
        borderRadius: '999px',
        padding: '8px 14px',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: '6px',
        fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontWeight: 800,
        color: isHC ? '#FFD700' : '#C0392B',
        boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
        letterSpacing: '0.2px',
      }}
    >
      <LogOut size={14} strokeWidth={2.4} /> Esci
    </button>
  )
}
