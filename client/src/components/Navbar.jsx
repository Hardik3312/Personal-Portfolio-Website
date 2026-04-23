import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { HiMenuAlt3, HiX } from 'react-icons/hi'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Projects', path: '/projects' },
  { label: 'Contact', path: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Detect scroll to add backdrop blur / shrink nav
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      {/* ===== DESKTOP & MOBILE NAV BAR ===== */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9000,
          transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
          padding: scrolled ? '14px 0' : '22px 0',
          background: scrolled
            ? 'rgba(6, 6, 20, 0.92)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(24px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
          borderBottom: scrolled
            ? '1px solid rgba(212,175,55,0.15)'
            : '1px solid transparent',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 clamp(20px, 5vw, 60px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* ===== LOGO ===== */}
          <Link
            to="/"
            style={{ textDecoration: 'none' }}
            aria-label="Hardik Patel Home"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Nepali flag-inspired emblem */}
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  position: 'relative',
                  flexShrink: 0,
                }}
              >
                <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polygon
                    points="18,2 34,34 2,34"
                    fill="none"
                    stroke="url(#logoGrad)"
                    strokeWidth="1.5"
                  />
                  <text
                    x="18"
                    y="27"
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="bold"
                    fontFamily="'Cinzel Decorative', serif"
                    fill="url(#logoGrad)"
                  >
                    H
                  </text>
                  <defs>
                    <linearGradient id="logoGrad" x1="2" y1="2" x2="34" y2="34" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#D4AF37" />
                      <stop offset="100%" stopColor="#C41E3A" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "'Cinzel Decorative', serif",
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    letterSpacing: '2px',
                    background: 'linear-gradient(to right, #D4AF37, #F0D060)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    lineHeight: 1.1,
                  }}
                >
                  HARDIK
                </p>
                <p
                  style={{
                    fontFamily: "'Raleway', sans-serif",
                    fontSize: '0.62rem',
                    fontWeight: 600,
                    letterSpacing: '3px',
                    color: 'rgba(212,175,55,0.6)',
                    textTransform: 'uppercase',
                    lineHeight: 1,
                  }}
                >
                  Dev & ML Engineer
                </p>
              </div>
            </div>
          </Link>

          {/* ===== DESKTOP NAV LINKS ===== */}
          <nav
            style={{ display: 'flex', alignItems: 'center', gap: '40px' }}
            className="hidden md:flex"
          >
            {navLinks.map(({ label, path }) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/'}
                className={({ isActive }) =>
                  `nav-link${isActive ? ' active' : ''}`
                }
              >
                {label}
              </NavLink>
            ))}

            {/* Hire Me CTA */}
            <a
              href="mailto:hardik0626@gmail.com"
              className="btn-primary"
              style={{ padding: '10px 24px', fontSize: '0.8rem' }}
            >
              Hire Me
            </a>
          </nav>

          {/* ===== MOBILE HAMBURGER ===== */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            style={{
              display: 'none',
              background: 'none',
              border: '1px solid rgba(212,175,55,0.4)',
              borderRadius: '4px',
              color: '#D4AF37',
              padding: '8px',
              cursor: 'pointer',
              fontSize: '1.4rem',
              lineHeight: 1,
            }}
            className="flex md:hidden"
          >
            <HiMenuAlt3 />
          </button>
        </div>
      </header>

      {/* ===== MOBILE MENU OVERLAY ===== */}
      <div
        className={`mobile-overlay${menuOpen ? ' open' : ''}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* ===== MOBILE SLIDE-IN MENU ===== */}
      <div
        className={`mobile-menu${menuOpen ? ' open' : ''}`}
        role="dialog"
        aria-label="Navigation menu"
      >
        {/* Close button */}
        <button
          onClick={closeMenu}
          aria-label="Close menu"
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            background: 'none',
            border: '1px solid rgba(212,175,55,0.3)',
            borderRadius: '4px',
            color: '#D4AF37',
            padding: '8px',
            cursor: 'pointer',
            fontSize: '1.3rem',
            lineHeight: 1,
          }}
        >
          <HiX />
        </button>

        {/* Nepali ornament */}
        <div
          style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: '0.7rem',
            letterSpacing: '3px',
            color: 'rgba(212,175,55,0.4)',
            marginBottom: '8px',
          }}
        >
          ◆ NAVIGATE ◆
        </div>

        {/* Nav links */}
        {navLinks.map(({ label, path }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            onClick={closeMenu}
            style={({ isActive }) => ({
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.6rem',
              fontWeight: 700,
              color: isActive ? '#D4AF37' : 'rgba(240,234,214,0.7)',
              textDecoration: 'none',
              letterSpacing: '1px',
              transition: 'color 0.3s ease',
              borderBottom: isActive
                ? '1px solid rgba(212,175,55,0.4)'
                : '1px solid transparent',
              paddingBottom: '8px',
            })}
          >
            {label}
          </NavLink>
        ))}

        {/* Contact info */}
        <div
          style={{
            marginTop: 'auto',
            borderTop: '1px solid rgba(212,175,55,0.15)',
            paddingTop: '24px',
          }}
        >
          <a
            href="mailto:hardik0626@gmail.com"
            style={{
              color: 'rgba(212,175,55,0.7)',
              fontSize: '0.8rem',
              textDecoration: 'none',
              display: 'block',
              marginBottom: '8px',
            }}
          >
            hardik0626@gmail.com
          </a>
          <p
            style={{
              color: 'rgba(184,176,204,0.5)',
              fontSize: '0.75rem',
              letterSpacing: '1px',
            }}
          >
            Bhubaneswar / Nepal
          </p>
        </div>
      </div>
    </>
  )
}