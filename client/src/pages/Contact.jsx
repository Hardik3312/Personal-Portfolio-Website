import { useState, useEffect } from 'react'
import {
  FaEnvelope, FaLinkedin, FaGithub,
  FaMapMarkerAlt, FaPaperPlane, FaHeart
} from 'react-icons/fa'

// ===== Form Field Component =====
function FormField({ label, type = 'text', name, value, onChange, error, textarea, placeholder }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label
        htmlFor={name}
        style={{
          fontSize: '0.8rem',
          fontWeight: 700,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: error ? 'var(--crimson-light)' : 'var(--text-muted)',
          transition: 'color 0.3s ease',
        }}
      >
        {label}
      </label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="form-input"
          style={{ borderColor: error ? 'var(--crimson)' : undefined }}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="form-input"
          style={{ borderColor: error ? 'var(--crimson)' : undefined }}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      )}
      {error && (
        <span
          id={`${name}-error`}
          style={{ fontSize: '0.78rem', color: 'var(--crimson-light)' }}
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  )
}

// ===== Contact Info Card =====
function ContactInfoCard({ icon: Icon, label, value, href, color }) {
  return (
    <a
      href={href}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
        padding: '20px',
        background: 'rgba(15,15,40,0.8)',
        border: '1px solid rgba(212,175,55,0.2)',
        borderRadius: '8px',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        cursor: href ? 'pointer' : 'default',
      }}
      onMouseEnter={(e) => {
        if (!href) return
        e.currentTarget.style.borderColor = color
        e.currentTarget.style.transform = 'translateX(6px)'
        e.currentTarget.style.boxShadow = `0 4px 20px ${color}25`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = ''
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = ''
      }}
    >
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '8px',
          background: `${color}20`,
          border: `1px solid ${color}40`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={18} color={color} />
      </div>
      <div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
          {label}
        </p>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 500 }}>
          {value}
        </p>
      </div>
    </a>
  )
}

// ===== Validation =====
function validate(fields) {
  const errors = {}
  if (!fields.name.trim()) errors.name = 'Name is required.'
  if (!fields.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = 'Please enter a valid email address.'
  }
  if (!fields.subject.trim()) errors.subject = 'Subject is required.'
  if (!fields.message.trim()) {
    errors.message = 'Message is required.'
  } else if (fields.message.trim().length < 20) {
    errors.message = 'Please write at least 20 characters.'
  }
  return errors
}

export default function Contact() {
  const [fields, setFields] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('visible')
      }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
      .forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validate(fields)
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setStatus('sending')

    // Simulate form submission (replace with your backend/EmailJS/Formspree URL)
    const mailtoLink = `mailto:hardik0626@gmail.com?subject=${encodeURIComponent(fields.subject)}&body=${encodeURIComponent(
      `From: ${fields.name} <${fields.email}>\n\n${fields.message}`
    )}`
    window.location.href = mailtoLink
    setTimeout(() => {
      setStatus('sent')
      setFields({ name: '', email: '', subject: '', message: '' })
    }, 600)
  }

  return (
    <div className="page-container" style={{ paddingTop: '80px' }}>

      {/* =================== PAGE HEADER =================== */}
      <div
        style={{
          background: 'linear-gradient(180deg, rgba(212,175,55,0.07) 0%, transparent 100%)',
          borderBottom: '1px solid rgba(212,175,55,0.1)',
          padding: 'clamp(48px,8vw,80px) clamp(24px,6vw,80px)',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <div className="reveal">
          <span
            style={{
              fontFamily: "'Raleway', sans-serif",
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '4px',
              textTransform: 'uppercase',
              color: 'var(--gold)',
            }}
          >
            ◆ Get In Touch
          </span>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2.2rem, 6vw, 4rem)',
              fontWeight: 900,
              marginTop: '12px',
              lineHeight: 1.1,
            }}
          >
            Let's{' '}
            <span className="gradient-text">Build Together</span>
          </h1>
          <p
            style={{
              maxWidth: '520px',
              marginTop: '20px',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              fontSize: '1rem',
            }}
          >
            Whether you have an opportunity, a project idea, or just want to say hello —
            my inbox is always open. I'll get back to you within 24 hours.
          </p>
        </div>
      </div>

      {/* =================== MAIN CONTENT =================== */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '60px clamp(24px, 6vw, 80px)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '60px',
            alignItems: 'start',
          }}
        >
          {/* ===== LEFT: Contact Info ===== */}
          <div className="reveal-left">
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.5rem',
                fontWeight: 700,
                marginBottom: '32px',
                color: 'var(--text-primary)',
              }}
            >
              Reach Out Directly
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <ContactInfoCard
                icon={FaEnvelope}
                label="Email"
                value="hardik0626@gmail.com"
                href="mailto:hardik0626@gmail.com"
                color="var(--crimson)"
              />
              <ContactInfoCard
                icon={FaLinkedin}
                label="LinkedIn"
                value="linkedin.com/in/hardik-patel"
                href="https://linkedin.com/in/hardik-patel"
                color="#0A66C2"
              />
              <ContactInfoCard
                icon={FaGithub}
                label="GitHub"
                value="github.com/hardik0626"
                href="https://github.com/hardik0626"
                color="#D4AF37"
              />
              <ContactInfoCard
                icon={FaMapMarkerAlt}
                label="Location"
                value="Bhubaneswar, India / Nepal"
                href={null}
                color="#2D7A3A"
              />
            </div>

            {/* Availability badge */}
            <div
              style={{
                marginTop: '32px',
                padding: '16px 20px',
                background: 'rgba(45,122,58,0.12)',
                border: '1px solid rgba(45,122,58,0.35)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#4CAF50',
                  boxShadow: '0 0 10px #4CAF50',
                  flexShrink: 0,
                  animation: 'pulse-glow 2s ease-in-out infinite',
                }}
              />
              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4CAF50', marginBottom: '2px' }}>
                  Available for Opportunities
                </p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Open to internships, full-time roles & freelance projects
                </p>
              </div>
            </div>

            {/* Decorative mandala */}
            <div
              aria-hidden="true"
              style={{
                marginTop: '40px',
                display: 'flex',
                justifyContent: 'center',
                opacity: 0.15,
              }}
            >
              <div style={{ position: 'relative', width: '140px', height: '140px' }}>
                {[120, 90, 60, 30].map((size, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: `${size}px`,
                      height: `${size}px`,
                      borderRadius: '50%',
                      border: `1px solid ${i % 2 === 0 ? '#D4AF37' : '#C41E3A'}`,
                      animation: `rotate-slow ${8 + i * 3}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`,
                    }}
                  />
                ))}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '1.2rem',
                  }}
                >
                  ◆
                </div>
              </div>
            </div>
          </div>

          {/* ===== RIGHT: Contact Form ===== */}
          <div className="reveal-right">
            <div
              style={{
                background: 'rgba(15,15,40,0.9)',
                border: '1px solid rgba(212,175,55,0.25)',
                borderRadius: '12px',
                padding: 'clamp(24px, 4vw, 40px)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Top gradient accent */}
              <div
                style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, height: '3px',
                  background: 'linear-gradient(to right, var(--crimson), var(--gold))',
                }}
              />

              {status === 'sent' ? (
                /* Success state */
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✉️</div>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: 'var(--gold)',
                      marginBottom: '12px',
                    }}
                  >
                    Message Sent!
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '24px' }}>
                    Thanks for reaching out. I'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="btn-secondary"
                    style={{ padding: '10px 24px' }}
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                /* Form */
                <form onSubmit={handleSubmit} noValidate>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '1.3rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      marginBottom: '28px',
                    }}
                  >
                    Send a Message
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Name & Email side by side on wide screens */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '20px',
                      }}
                    >
                      <FormField
                        label="Your Name"
                        name="name"
                        value={fields.name}
                        onChange={handleChange}
                        error={errors.name}
                        placeholder="e.g. Priya Sharma"
                      />
                      <FormField
                        label="Email Address"
                        type="email"
                        name="email"
                        value={fields.email}
                        onChange={handleChange}
                        error={errors.email}
                        placeholder="you@example.com"
                      />
                    </div>

                    <FormField
                      label="Subject"
                      name="subject"
                      value={fields.subject}
                      onChange={handleChange}
                      error={errors.subject}
                      placeholder="e.g. Job Opportunity at Acme Corp"
                    />

                    <FormField
                      label="Message"
                      name="message"
                      value={fields.message}
                      onChange={handleChange}
                      error={errors.message}
                      textarea
                      placeholder="Tell me about your project, opportunity, or just say hello..."
                    />

                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={status === 'sending'}
                      style={{
                        width: '100%',
                        justifyContent: 'center',
                        opacity: status === 'sending' ? 0.7 : 1,
                        cursor: status === 'sending' ? 'wait' : 'pointer',
                      }}
                    >
                      {status === 'sending' ? (
                        'Sending...'
                      ) : (
                        <>
                          <FaPaperPlane />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =================== FOOTER =================== */}
      <footer
        style={{
          marginTop: '80px',
          borderTop: '1px solid rgba(212,175,55,0.15)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Footer gradient */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0, top: 0,
            background: 'linear-gradient(0deg, rgba(139,0,0,0.08) 0%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '48px clamp(24px, 6vw, 80px)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Top footer row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '40px',
              marginBottom: '40px',
            }}
          >
            {/* Brand */}
            <div>
              <p
                style={{
                  fontFamily: "'Cinzel Decorative', serif",
                  fontSize: '1rem',
                  fontWeight: 700,
                  background: 'linear-gradient(to right, #D4AF37, #F0D060)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '12px',
                  letterSpacing: '2px',
                }}
              >
                HARDIK PATEL
              </p>
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                  lineHeight: 1.7,
                  maxWidth: '260px',
                }}
              >
                Full-Stack Developer & ML Engineer. Building intelligent, scalable solutions.
                KIIT University, Class of 2026.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <p
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  marginBottom: '16px',
                }}
              >
                Navigate
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: 'Home', href: '/' },
                  { label: 'About', href: '/about' },
                  { label: 'Projects', href: '/projects' },
                  { label: 'Contact', href: '/contact' },
                ].map(({ label, href }) => (
                  <a key={label} href={href} className="footer-link">
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* Social / Contact */}
            <div>
              <p
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  marginBottom: '16px',
                }}
              >
                Connect
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a
                  href="mailto:hardik0626@gmail.com"
                  className="footer-link"
                >
                  <FaEnvelope size={13} />
                  hardik0626@gmail.com
                </a>
                <a
                  href="https://linkedin.com/in/hardik-patel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  <FaLinkedin size={13} color="#0A66C2" />
                  LinkedIn Profile
                </a>
                <a
                  href="https://github.com/hardik0626"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  <FaGithub size={13} />
                  GitHub Portfolio
                </a>
                <span
                  className="footer-link"
                  style={{ cursor: 'default' }}
                >
                  <FaMapMarkerAlt size={12} />
                  Bhubaneswar / Nepal
                </span>
              </div>
            </div>
          </div>

          {/* Gold divider */}
          <div className="gold-divider" style={{ marginBottom: '24px' }} />

          {/* Bottom copyright row */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <p
              style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
              }}
            >
              © {new Date().getFullYear()} Hardik Patel. All rights reserved.
            </p>
            <p
              style={{
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              Built with{' '}
              <FaHeart size={11} style={{ color: 'var(--crimson)' }} />
              {' '}using React + Tailwind
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}