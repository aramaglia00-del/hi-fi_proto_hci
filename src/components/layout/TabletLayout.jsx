import { useEffect, useState } from 'react'
import { useApp } from '../../context/AppContext'
import ScreenLeft from './ScreenLeft'
import ScreenRight from './ScreenRight'
import { PhoneFrame, TotemFrame } from './DeviceFrames'
import PagoPA from '../../screens/PagoPA'
import CUP from '../../screens/CUP'
import Pairing from '../../screens/Pairing'

const DESIGN_W = 1180
const DESIGN_H = 820

export default function TabletLayout() {
  const { state } = useApp()
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const update = () => {
      setScale(Math.min(window.innerWidth / DESIGN_W, window.innerHeight / DESIGN_H))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const renderContent = () => {
    if (state.currentScreen === 'pairing') return <Pairing />
    if (state.currentScreen === 'pagopa') return <PagoPA />
    if (state.currentScreen === 'cup') return <CUP />

    // home screen
    return (
      <div style={{
        display: 'flex', flexDirection: 'row', alignItems: 'center',
        justifyContent: 'center', gap: '40px', height: '820px',
      }}>
        <PhoneFrame><ScreenLeft /></PhoneFrame>
        <TotemFrame><ScreenRight /></TotemFrame>
      </div>
    )
  }

  return (
    <div style={{
      width: '100vw', height: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#000', overflow: 'hidden',
    }}>
      <div style={{
        width: `${DESIGN_W}px`, height: `${DESIGN_H}px`,
        background: 'linear-gradient(145deg, #0A1628 0%, #0D2140 50%, #0A1E35 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        flexShrink: 0, position: 'relative',
      }}>
        {renderContent()}
      </div>
    </div>
  )
}
