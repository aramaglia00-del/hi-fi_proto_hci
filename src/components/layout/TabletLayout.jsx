import { useApp } from '../../context/AppContext'
import ScreenLeft from './ScreenLeft'
import ScreenRight from './ScreenRight'
import PagoPA from '../../screens/PagoPA'
import CUP from '../../screens/CUP'

export default function TabletLayout() {
  const { state } = useApp()

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
    <div
      style={{
        width: '1180px',
        height: '820px',
        background: '#1A1A1A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: '740px' }}>
        {renderContent()}
      </div>
    </div>
  )
}
