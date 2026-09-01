import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Loading from './PA/Loading'
import AppRoutes from './Routes/routes'
import Navbar from './PA/Navbar'
import Footer from './PA/Footer'

function App() {
  const [isLoading, setIsLoading] = useState(false)
  const location = useLocation()

  const [prevPath, setPrevPath] = useState(location.pathname)
  if (location.pathname !== prevPath) {
    setPrevPath(location.pathname)
    setIsLoading(true)
  }

  // Trigger loading effect on route changes
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 250) // Fast 250ms transition time
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  const isDashboardRoute = location.pathname.startsWith('/dashboard')

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 flex flex-col font-sans relative">
      {/* Loading Overlay */}
      {isLoading && <Loading />}

      {/* Navigation Header */}
      {!isDashboardRoute && <Navbar />}

      {/* Content Area */}
      <main className="flex-grow flex flex-col">
        <AppRoutes />
      </main>

      {/* Footer */}
      {!isDashboardRoute && <Footer />}
    </div>
  )
}

export default App
