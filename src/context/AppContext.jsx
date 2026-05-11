import { createContext, useContext, useState } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, setState] = useState({
    currentScreen: 'accessibility',
    currentStep: 0,
    email: '',
    paired: false,
    accessibility: {
      fontSize: 'normal',
    },
    cupForm: {
      nreSx: '',
      nreDx: '',
      cf: '',
    },
    pagopaForm: {
      email: '',
      emailConfirm: '',
      cardNumber: '',
      expiry: '',
      cvv: '',
      cardName: '',
    },
    buttonState: {
      cupReady: false,
      pagopaEmailReady: false,
      pagopaCardReady: false,
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
  useContext(AppContext)
  return {
    bg: '#FFF8F0',
    surface: '#FFFFFF',
    cardBg: '#FFFFFF',
    primary: '#1A9E8F',
    primaryDark: '#147A6E',
    primaryText: '#FFFFFF',
    primaryLight: '#E0F5F3',
    text: '#1A1A1A',
    textSecondary: '#6B7280',
    secondary: '#1A9E8F',
    accent: '#D4720A',
    border: '#E8E8E8',
    borderStrong: '#1A9E8F',
    borderWeak: '#E8E8E8',
    muted: '#9CA3AF',
    tagBg: '#FFF0E0',
    tagText: '#D4720A',
    divider: 'rgba(0,0,0,0.07)',
    navBg: 'rgba(255,248,240,0.95)',
    error: '#DC2626',
    errorBg: '#FEE2E2',
    success: '#10B981',
    successBg: '#ECFDF5',
    isHC: false,
  }
}

export function useFontZoom() {
  const { state } = useContext(AppContext)
  const fs = state.accessibility?.fontSize
  return fs === 'xlarge' ? 1.25 : fs === 'large' ? 1.12 : 1
}

export default AppContext
