import { createContext, useContext, useState } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, setState] = useState({
    currentScreen: 'pairing',
    currentStep: 0,
    email: '',
    paired: false,
    accessibility: {
      fontSize: 'normal',   // 'normal' | 'large' | 'xlarge'
      colorMode: 'normal',  // 'normal' | 'highContrast'
    },
  })

  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  return useContext(AppContext)
}

export function useTheme() {
  const { state } = useContext(AppContext)
  const hc = state.accessibility?.colorMode === 'highContrast'
  return {
    bg:           hc ? '#0A0A0A' : '#FFF8F0',
    surface:      hc ? '#1A1A1A' : '#FFFFFF',
    cardBg:       hc ? '#111111' : '#FFFFFF',
    primary:      hc ? '#FFD700' : '#1A9E8F',
    primaryDark:  hc ? '#E6C200' : '#147A6E',
    primaryText:  hc ? '#000000' : '#FFFFFF',
    primaryLight: hc ? '#2A2A00' : '#E0F5F3',
    text:         hc ? '#FFFFFF' : '#1A1A1A',
    textSecondary: hc ? '#DDDDDD' : '#6B7280',
    border:       hc ? 'rgba(255,255,255,0.2)' : '#E8E8E8',
    borderStrong: hc ? '#FFD700' : '#1A9E8F',
    muted:        hc ? '#AAAAAA' : '#9CA3AF',
    tagBg:        hc ? '#1A1A00' : '#FFF0E0',
    tagText:      hc ? '#FFD700' : '#D4720A',
    divider:      hc ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.07)',
    navBg:        hc ? 'rgba(0,0,0,0.95)' : 'rgba(255,248,240,0.95)',
    isHC:         hc,
  }
}

export function useFontZoom() {
  const { state } = useContext(AppContext)
  const fs = state.accessibility?.fontSize
  return fs === 'xlarge' ? 1.25 : fs === 'large' ? 1.12 : 1
}

export default AppContext
