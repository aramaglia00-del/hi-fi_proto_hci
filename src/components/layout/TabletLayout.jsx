import { useEffect, useState } from 'react'
import { useApp } from '../../context/AppContext'
import ScreenLeft from './ScreenLeft'
import ScreenRight from './ScreenRight'
import PagoPA from '../../screens/PagoPA'
import CUP from '../../screens/CUP'

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
    if (state.currentScreen === 'pagopa') return <PagoPA />
    if (state.currentScreen === 'cup') return <CUP />
    return (
      <>
        <ScreenLeft />
        <div style={{ width: '20px', height: '740px', background: '#1A1A1A', flexShrink: 0 }} />
        <ScreenRight />
      </>
    )
  }

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', overflow: 'hidden' }}>
      <div
        style={{
          width: `${DESIGN_W}px`,
          height: `${DESIGN_H}px`,
          background: '#1A1A1A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: '740px' }}>
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
