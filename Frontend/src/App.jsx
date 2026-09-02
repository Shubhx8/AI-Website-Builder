import React, { Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import { useSelector } from 'react-redux'

// Lazy load heavy pages to reduce initial loading time
const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const Generate = React.lazy(() => import('./pages/Generate'))
const WebsiteEditor = React.lazy(() => import('./pages/WebsiteEditor'))
const LiveSite = React.lazy(() => import('./pages/LiveSite'))
const Pricing = React.lazy(() => import('./pages/Pricing'))
const Signup = React.lazy(() => import('./pages/Signup'))

// Reusable animated loader
export const FullScreenLoader = () => (
  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#050505', fontFamily: 'sans-serif', boxSizing: 'border-box' }}>
    <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderLeftColor: '#8b5cf6', borderRadius: '50%', animation: 'spin 1s linear infinite', boxSizing: 'border-box' }}></div>
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
    <div style={{ marginTop: '20px', color: '#a1a1aa', fontSize: '13px', letterSpacing: '3px', animation: 'pulse 2s ease-in-out infinite', boxSizing: 'border-box' }}>WEBMAXER</div>
  </div>
)

const App = () => {
  const { userData } = useSelector(state => state.user)
  return (
    <BrowserRouter>
      <Suspense fallback={<FullScreenLoader />}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/signup' element={userData ? <Dashboard /> : <Signup />} />
          <Route path='/dashboard' element={userData ? <Dashboard /> : <Home />} />
          <Route path='/generate' element={userData ? <Generate /> : <Home />} />
          <Route path='/editor/:id' element={userData ? <WebsiteEditor /> : <Home />} />
          <Route path='/site/:id' element={<LiveSite />} />
          <Route path='/pricing' element={<Pricing />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App