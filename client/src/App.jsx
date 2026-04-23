import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Contact from './pages/Contact'

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

// Animated Starfield Background — always present behind all pages
function StarsBackground() {
  return (
    <div className="stars-container" aria-hidden="true">
      <div className="stars-layer stars-s" />
      <div className="stars-layer stars-m" />
      <div className="stars-layer stars-l" />
    </div>
  )
}

// Decorative Mandala Corner — top right
function MandalaDecor() {
  return (
    <div
      style={{
        position: 'fixed',
        top: '80px',
        right: '-60px',
        width: '200px',
        height: '200px',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.12,
      }}
      aria-hidden="true"
    >
      {[180, 140, 100, 60].map((size, i) => (
        <div
          key={i}
          className="mandala-ring"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animationDuration: `${10 + i * 5}s`,
            animationDirection: i % 2 === 0 ? 'normal' : 'reverse',
            borderColor: i % 2 === 0
              ? 'rgba(212,175,55,0.6)'
              : 'rgba(196,30,58,0.5)',
          }}
        />
      ))}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <StarsBackground />
      <MandalaDecor />
      <ScrollToTop />
      <Navbar />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}