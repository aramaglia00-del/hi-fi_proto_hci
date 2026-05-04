import { AppProvider } from './context/AppContext'
import TabletLayout from './components/layout/TabletLayout'

export default function App() {
  return (
    <AppProvider>
      <TabletLayout />
    </AppProvider>
  )
}
