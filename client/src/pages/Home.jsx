import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom' // ✅ Added missing Link import
import {
  FaReact, FaNodeJs, FaPython, FaGithub, FaLinkedin,
  FaArrowDown, FaDownload, FaEye
} from 'react-icons/fa'
import { SiTensorflow, SiScikitlearn, SiTailwindcss, SiMysql } from 'react-icons/si'

// ===== SVG Mountain Silhouette =====
function MountainSilhouette() {
  return (
    <svg
      viewBox="0 0 1440 320"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      style={{ width: '100%', height: '100%', display: 'block' }}
      aria-hidden="true"
    >
      {/* Far mountains - dim */}
      <path
        d="M0,280 L120,180 L200,220 L320,120 L440,200 L560,100 L660,170 L780,80 L900,160 L1020,100 L1120,150 L1200,80 L1300,140 L1440,100 L1440,320 L0,320Z"
        fill="rgba(15,15,40,0.6)"
      />
      {/* Mid mountains - medium */}
      <path
        d="M0,300 L80,230 L180,270 L280,180 L400,240 L520,160 L620,210 L720,140 L840,200 L960,150 L1060,190 L1160,130 L1280,180 L1380,150 L1440,180 L1440,320 L0,320Z"
        fill="rgba(10,10,30,0.8)"
      />
      {/* Snow peaks highlight */}
      <path
        d="M560,100 L580,95 L600,88 L620,95 L640,100"
        stroke="rgba(240,234,214,0.3)"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M780,80 L800,72 L820,65 L840,72 L860,80"
        stroke="rgba(240,234,214,0.4)"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M1020,100 L1040,90 L1060,82 L1080,90 L1100,100"
        stroke="rgba(240,234,214,0.25)"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Near mountains - darkest */}
      <path
        d="M0,320 L100,270 L220,300 L340,250 L460,285 L580,245 L700,275 L820,240 L940,265 L1060,245 L1180,260 L1300,240 L1440,255 L1440,320Z"
        fill="rgba(6,6,15,0.95)"
      />
    </svg>
  )
}

// ===== Tech Stack Icon Component =====
function TechBadge({ icon: Icon, label, color }) {
  return (
    <div
      className="tech-badge"
      style={{ '--badge-color': color }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color
        e.currentTarget.style.color = color
        e.currentTarget.style.boxShadow = `0 0 20px ${color}40`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = ''
        e.currentTarget.style.color = ''
        e.currentTarget.style.boxShadow = ''
      }}
    >
      <Icon size={16} />
      <span>{label}</span>
    </div>
  )
}

// ===== Floating Geometric Shape =====
function FloatingShape({ size, top, left, delay, color }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        top,
        left,
        width: size,
        height: size,
        border: `1px solid ${color || 'rgba(212,175,55,0.2)'}`,
        transform: 'rotate(45deg)',
        animation: `float ${6 + delay}s ease-in-out ${delay}s infinite`,
        opacity: 0.4,
        pointerEvents: 'none',
      }}
    />
  )
}

export default function Home() {
  const heroRef = useRef(null)
  const titleRef = useRef(null)

  // Parallax effect on mouse move for 3D depth
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window
      const xPercent = (clientX / innerWidth - 0.5) * 2
      const yPercent = (clientY / innerHeight - 0.5) * 2

      // Move mountains in opposite directions for parallax
      const mountains = hero.querySelectorAll('[data-parallax]')
      mountains.forEach((el) => {
        const depth = parseFloat(el.getAttribute('data-parallax'))
        el.style.transform = `translate(${xPercent * depth}px, ${yPercent * depth}px)`
      })

      // Subtle tilt on the title area
      if (titleRef.current) {
        titleRef.current.style.transform = `perspective(1200px) rotateY(${xPercent * 3}deg) rotateX(${-yPercent * 2}deg)`
      }
    }

    hero.addEventListener('mousemove', handleMouseMove)
    return () => hero.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Scroll-reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('visible')
      }),
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
      .forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="page-container">

      {/* =================== HERO SECTION =================== */}
      <section
        ref={heroRef}
        className="hero-gradient"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          paddingTop: '80px',
        }}
      >
        {/* Decorative floating shapes */}
        <FloatingShape size="80px" top="15%" left="8%" delay={0} color="rgba(196,30,58,0.2)" />
        <FloatingShape size="50px" top="25%" left="88%" delay={2} color="rgba(212,175,55,0.2)" />
        <FloatingShape size="35px" top="65%" left="5%" delay={4} color="rgba(212,175,55,0.15)" />
        <FloatingShape size="60px" top="70%" left="92%" delay={1} color="rgba(196,30,58,0.15)" />

        {/* Radial glow behind heading */}
        <div
          aria-hidden="true"
          data-parallax="6"
          style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '400px',
            background: 'radial-gradient(ellipse, rgba(139,0,0,0.25) 0%, transparent 70%)',
            pointerEvents: 'none',
            transition: 'transform 0.1s ease-out',
          }}
        />

        {/* ===== MAIN CONTENT ===== */}
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 clamp(24px, 6vw, 80px)',
            width: '100%',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* Eyebrow label */}
          <div
            className="reveal"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: '40px',
                height: '2px',
                background: 'var(--gold)',
              }}
            />
            <span
              style={{
                fontFamily: "'Raleway', sans-serif",
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '4px',
                textTransform: 'uppercase',
                color: 'var(--gold)',
              }}
            >
              Full-Stack Developer & ML Engineer
            </span>
          </div>

          {/* 3D Tilting Title Area */}
          <div
            ref={titleRef}
            style={{
              transition: 'transform 0.15s ease-out',
              transformStyle: 'preserve-3d',
            }}
          >
            <h1
              className="reveal"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(2.8rem, 8vw, 6.5rem)',
                fontWeight: 900,
                lineHeight: 1.02,
                marginBottom: '8px',
                letterSpacing: '-1px',
              }}
            >
              <span style={{ color: 'var(--text-primary)' }}>Hardik</span>
              <br />
              <span className="gradient-text">Patel</span>
            </h1>
          </div>

          {/* Hook line */}
          <p
            className="reveal"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(1rem, 2.5vw, 1.35rem)',
              color: 'var(--text-secondary)',
              maxWidth: '620px',
              lineHeight: 1.7,
              marginTop: '20px',
              marginBottom: '40px',
              borderLeft: '3px solid var(--crimson)',
              paddingLeft: '20px',
            }}
          >
            "I build intelligent, scalable web applications that{' '}
            <span style={{ color: 'var(--gold)' }}>
              bridge the gap between complex data
            </span>{' '}
            and user-friendly interfaces."
          </p>

          {/* CTA Buttons */}
          <div
            className="reveal"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '56px',
            }}
          >
            <Link to="/projects" className="btn-primary">
              <FaEye />
              View Projects
            </Link>
            <a
              href="/Hardik_Patel_CV.pdf"
              download
              className="btn-secondary"
            >
              <FaDownload />
              Download CV
            </a>
          </div>

          {/* Tech Stack Row */}
          <div className="reveal" style={{ marginBottom: '24px' }}>
            <p
              style={{
                fontFamily: "'Raleway', sans-serif",
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '3px',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: '16px',
              }}
            >
              Core Stack
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <TechBadge icon={FaReact} label="React.js" color="#61DAFB" />
              <TechBadge icon={FaNodeJs} label="Node.js" color="#8CC84B" />
              <TechBadge icon={FaPython} label="Python" color="#FFD43B" />
              <TechBadge icon={SiTensorflow} label="ML / AI" color="#FF6F00" />
              <TechBadge icon={SiScikitlearn} label="Scikit-learn" color="#F7931E" />
              <TechBadge icon={SiTailwindcss} label="Tailwind" color="#38BDF8" />
              <TechBadge icon={SiMysql} label="MySQL" color="#4479A1" />
            </div>
          </div>

          {/* Social quick-links */}
          <div
            className="reveal"
            style={{ display: 'flex', gap: '20px', marginTop: '16px' }}
          >
            {[
              { icon: FaGithub, href: 'https://github.com/hardik0626', label: 'GitHub' },
              { icon: FaLinkedin, href: 'https://linkedin.com/in/hardik-patel', label: 'LinkedIn' },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '42px',
                  height: '42px',
                  border: '1px solid rgba(212,175,55,0.3)',
                  borderRadius: '4px',
                  color: 'var(--text-secondary)',
                  fontSize: '1.2rem',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#D4AF37'
                  e.currentTarget.style.borderColor = '#D4AF37'
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(212,175,55,0.3)'
                  e.currentTarget.style.transform = 'translateY(-3px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = ''
                  e.currentTarget.style.borderColor = ''
                  e.currentTarget.style.boxShadow = ''
                  e.currentTarget.style.transform = ''
                }}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* ===== MOUNTAIN SILHOUETTE AT BOTTOM ===== */}
        <div
          data-parallax="-3"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 'clamp(160px, 25vw, 320px)',
            transition: 'transform 0.15s ease-out',
            zIndex: 1,
          }}
          aria-hidden="true"
        >
          <MountainSilhouette />
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: 'clamp(24px, 5vw, 60px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            zIndex: 3,
          }}
          aria-hidden="true"
        >
          <span
            style={{
              fontSize: '0.65rem',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              writingMode: 'vertical-rl',
            }}
          >
            Scroll
          </span>
          <FaArrowDown
            style={{
              color: 'var(--gold)',
              fontSize: '0.9rem',
              animation: 'float 2s ease-in-out infinite',
            }}
          />
        </div>
      </section>

      {/* =================== QUICK STATS RIBBON =================== */}
      <section
        style={{
          background: 'rgba(15,15,35,0.95)',
          borderTop: '1px solid rgba(212,175,55,0.15)',
          borderBottom: '1px solid rgba(212,175,55,0.15)',
          padding: '36px 0',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 clamp(24px, 6vw, 80px)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '24px',
            textAlign: 'center',
          }}
        >
          {[
            { value: '3+', label: 'Projects Shipped' },
            { value: '2+', label: 'Years Coding' },
            { value: '5+', label: 'Technologies' },
            { value: 'KIIT', label: "B.Tech CSE '26" },
          ].map(({ value, label }) => (
            <div key={label} className="reveal">
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontWeight: 700,
                  background: 'linear-gradient(to right, var(--gold), var(--gold-light))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: 1,
                  marginBottom: '6px',
                }}
              >
                {value}
              </p>
              <p
                style={{
                  fontSize: '0.8rem',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  fontWeight: 600,
                }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =================== FEATURED PROJECT PREVIEW =================== */}
      <section
        className="section"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: 'clamp(60px, 10vw, 100px) clamp(24px, 6vw, 80px)',
        }}
      >
        <div
          className="reveal"
          style={{ marginBottom: '48px' }}
        >
          <h2 className="section-heading">
            Featured Work
          </h2>
          <p
            style={{
              color: 'var(--text-muted)',
              marginTop: '24px',
              fontSize: '1rem',
              maxWidth: '500px',
              lineHeight: 1.7,
            }}
          >
            A glimpse at what I build — from AI-powered vision systems to e-commerce platforms.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}
        >
          {[
            {
              emoji: '🚀',
              title: 'Helmet Detection',
              desc: 'Real-time CV system using YOLOv5 to enhance road safety through automated surveillance.',
              tag: 'Computer Vision',
              tagColor: 'var(--crimson)',
            },
            {
              emoji: '🌦️',
              title: 'Weather Forecasting',
              desc: 'ML model predicting temperature, rainfall, and wind speed from historical meteorological data.',
              tag: 'Machine Learning',
              tagColor: '#F7931E',
            },
            {
              emoji: '🎁',
              title: 'GiftsForever',
              desc: 'Full-stack e-commerce gifting platform with custom cart, dynamic grids, and personalized inputs.',
              tag: 'Full-Stack',
              tagColor: '#61DAFB',
            },
          ].map(({ emoji, title, desc, tag, tagColor }, i) => (
            <div
              key={title}
              className="project-card reveal card-3d"
              style={{ animationDelay: `${i * 0.1}s` }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const x = ((e.clientX - rect.left) / rect.width - 0.5) * 18
                const y = -((e.clientY - rect.top) / rect.height - 0.5) * 18
                e.currentTarget.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${y}deg) scale3d(1.02,1.02,1.02)`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = ''
              }}
            >
              <div className="card-content">
                <span className="project-emoji" style={{ animationDelay: `${i * 0.5}s` }}>
                  {emoji}
                </span>
                <div
                  style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    background: `${tagColor}20`,
                    border: `1px solid ${tagColor}50`,
                    borderRadius: '50px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    color: tagColor,
                    marginTop: '16px',
                    marginBottom: '12px',
                  }}
                >
                  {tag}
                </div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: '12px',
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.9rem',
                    lineHeight: 1.7,
                  }}
                >
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="reveal"
          style={{ textAlign: 'center', marginTop: '48px' }}
        >
          <Link to="/projects" className="btn-secondary">
            View All Projects →
          </Link>
        </div>
      </section>

      {/* =================== DIVIDER =================== */}
      <div className="gold-divider" />
    </div>
  )
}