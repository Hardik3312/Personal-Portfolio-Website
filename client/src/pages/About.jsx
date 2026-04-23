import { useEffect, useRef } from 'react'
import {
  FaMapMarkerAlt, FaGraduationCap, FaBriefcase,
  FaCode, FaDatabase, FaBrain, FaTools, FaCertificate
} from 'react-icons/fa'
import { SiPython, SiJavascript, SiReact, SiNodedotjs, SiTailwindcss,
  SiMysql, SiGit, SiTensorflow, SiScikitlearn } from 'react-icons/si'
import { DiJava, DiCss3 } from 'react-icons/di'

// ===== Skill Bar Component =====
function SkillBar({ name, percent, color = 'var(--crimson)' }) {
  const barRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && barRef.current) {
          barRef.current.style.transform = `scaleX(${percent / 100})`
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (barRef.current) observer.observe(barRef.current.parentElement)
    return () => observer.disconnect()
  }, [percent])

  return (
    <div style={{ marginBottom: '16px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '6px',
        }}
      >
        <span
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            letterSpacing: '0.5px',
          }}
        >
          {name}
        </span>
        <span
          style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
          }}
        >
          {percent}%
        </span>
      </div>
      <div className="skill-bar-track">
        <div
          ref={barRef}
          className="skill-bar-fill"
          style={{
            background: `linear-gradient(to right, var(--crimson-dark), ${color})`,
            transform: 'scaleX(0)',
            transition: 'transform 1.4s cubic-bezier(0.23, 1, 0.32, 1)',
          }}
        />
      </div>
    </div>
  )
}

// ===== Skill Icon Badge =====
function SkillIcon({ Icon, name, color }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        padding: '16px 12px',
        background: 'rgba(15,15,40,0.8)',
        border: '1px solid rgba(212,175,55,0.15)',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
        cursor: 'default',
        minWidth: '80px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color || 'var(--gold)'
        e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)'
        e.currentTarget.style.boxShadow = `0 8px 24px ${color || 'var(--gold)'}30`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = ''
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = ''
      }}
    >
      <Icon size={28} color={color || '#D4AF37'} />
      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.5px', textAlign: 'center' }}>
        {name}
      </span>
    </div>
  )
}

// ===== Certificate Card =====
function CertCard({ title, issuer, color }) {
  return (
    <div
      style={{
        padding: '16px 20px',
        background: 'rgba(15,15,40,0.7)',
        border: '1px solid rgba(212,175,55,0.2)',
        borderLeft: `3px solid ${color}`,
        borderRadius: '4px',
        transition: 'transform 0.3s ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(6px)' }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = '' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
        <FaCertificate size={14} color={color} />
        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</span>
      </div>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>{issuer}</p>
    </div>
  )
}

export default function About() {

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('visible')
      }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
      .forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="page-container" style={{ paddingTop: '80px' }}>

      {/* =================== PAGE HEADER =================== */}
      <div
        style={{
          background: 'linear-gradient(180deg, rgba(139,0,0,0.12) 0%, transparent 100%)',
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
              color: 'var(--crimson-light)',
            }}
          >
            ◆ About Me
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
            The Story{' '}
            <span className="gradient-text">Behind the Code</span>
          </h1>
        </div>
      </div>

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '60px clamp(24px, 6vw, 80px)',
        }}
      >

        {/* =================== BIO SECTION =================== */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '60px',
            marginBottom: '80px',
            alignItems: 'start',
          }}
        >
          {/* Left: Bio text */}
          <div className="reveal-left">
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                fontWeight: 700,
                marginBottom: '20px',
                color: 'var(--text-primary)',
              }}
            >
              Hi, I'm Hardik 👋
            </h2>
            <div
              style={{
                fontSize: '1rem',
                lineHeight: 1.9,
                color: 'var(--text-secondary)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <p>
                I'm a Computer Science & Engineering student at{' '}
                <strong style={{ color: 'var(--gold)' }}>KIIT University, Bhubaneswar</strong> with
                a deep passion for building things that matter — intelligent systems that solve
                real-world problems, and web platforms that people love using.
              </p>
              <p>
                My work sits at the intersection of{' '}
                <strong style={{ color: 'var(--crimson-light)' }}>
                  Full-Stack Web Development
                </strong>{' '}
                and{' '}
                <strong style={{ color: 'var(--gold)' }}>Machine Learning</strong> — I thrive
                when I can take a dataset, extract intelligence from it, and bring those insights
                to life through polished interfaces.
              </p>
              <p>
                Outside the IDE, I'm driven by a love for elegant problem-solving, clean code
                architecture, and the constant pursuit of craft. Every project is an opportunity
                to grow and deliver something extraordinary.
              </p>
            </div>

            {/* Location + Education quick info */}
            <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { icon: FaMapMarkerAlt, text: 'Bhubaneswar, India / Nepal', color: 'var(--crimson)' },
                { icon: FaGraduationCap, text: 'B.Tech CSE — KIIT University (2022–2026)', color: 'var(--gold)' },
              ].map(({ icon: Icon, text, color }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon style={{ color, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: 3D floating card portrait */}
          <div
            className="reveal-right"
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: 'clamp(220px, 35vw, 300px)',
                cursor: 'pointer',
                // COMBINED DUPLICATE STYLE HERE:
                transition: 'transform 0.15s ease-out',
                transformStyle: 'preserve-3d'
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const x = ((e.clientX - rect.left) / rect.width - 0.5) * 24
                const y = -((e.clientY - rect.top) / rect.height - 0.5) * 24
                e.currentTarget.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) scale(1.03)`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = ''
              }}
            >
              {/* Glow backdrop */}
              <div
                style={{
                  position: 'absolute',
                  inset: '-12px',
                  background: 'radial-gradient(ellipse, rgba(212,175,55,0.2) 0%, transparent 70%)',
                  borderRadius: '12px',
                  animation: 'pulse-glow 3s ease-in-out infinite',
                  zIndex: 0,
                }}
              />
              {/* Card */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 1,
                  background: 'linear-gradient(135deg, rgba(196,30,58,0.15), rgba(0,48,135,0.1))',
                  border: '1px solid rgba(212,175,55,0.4)',
                  borderRadius: '8px',
                  padding: '40px 32px',
                  textAlign: 'center',
                }}
              >
                {/* Avatar placeholder (mandala-style) */}
                <div
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--crimson-dark), var(--royal-blue))',
                    margin: '0 auto 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    fontFamily: "'Cinzel Decorative', serif",
                    color: '#D4AF37',
                    boxShadow: '0 0 40px rgba(212,175,55,0.3)',
                    border: '2px solid rgba(212,175,55,0.4)',
                  }}
                >
                  HP
                </div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Hardik Patel
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>
                  Full-Stack · ML Engineer
                </p>
                <div style={{ borderTop: '1px solid rgba(212,175,55,0.2)', paddingTop: '16px' }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>hardik0626@gmail.com</p>
                </div>
              </div>

              {/* Decorative corner diamonds */}
              {[[-8, -8], [-8, 'auto'], ['auto', -8]].map(([t, r], i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    top: typeof t === 'number' ? `${t}px` : 'auto',
                    bottom: typeof t === 'string' ? '-8px' : 'auto',
                    right: typeof r === 'number' ? `${r}px` : 'auto',
                    left: typeof r === 'string' ? '-8px' : 'auto',
                    width: '16px',
                    height: '16px',
                    background: 'var(--gold)',
                    transform: 'rotate(45deg)',
                    opacity: 0.6,
                    zIndex: 2,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="gold-divider" style={{ marginBottom: '80px' }} />

        {/* =================== EXPERIENCE / INTERNSHIP =================== */}
        <section className="reveal" style={{ marginBottom: '80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
            <FaBriefcase size={24} color="var(--crimson)" />
            <h2 className="section-heading">Professional Experience</h2>
          </div>

          {/* Timeline item */}
          <div className="timeline-item" style={{ maxWidth: '800px' }}>
            <div
              style={{
                background: 'rgba(15,15,40,0.9)',
                border: '1px solid rgba(212,175,55,0.25)',
                borderRadius: '8px',
                padding: '32px',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(196,30,58,0.5)'
                e.currentTarget.style.boxShadow = 'var(--glow-crimson)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = ''
                e.currentTarget.style.boxShadow = ''
              }}
            >
              {/* Accent bar */}
              <div style={{
                position: 'absolute',
                top: 0, left: 0, bottom: 0, width: '4px',
                background: 'linear-gradient(to bottom, var(--crimson), var(--gold))',
                borderRadius: '4px 0 0 4px',
              }} />

              <div style={{ paddingLeft: '8px' }}>
                {/* Role & Company */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
                  <div>
                    <h3
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.35rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        marginBottom: '4px',
                      }}
                    >
                      Computer Operator Intern
                    </h3>
                    <p style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.5px' }}>
                      Parwanipur Gaupalika Office
                    </p>
                  </div>
                  <span
                    style={{
                      padding: '6px 16px',
                      background: 'rgba(212,175,55,0.1)',
                      border: '1px solid rgba(212,175,55,0.3)',
                      borderRadius: '50px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--gold)',
                      letterSpacing: '1px',
                      height: 'fit-content',
                    }}
                  >
                    Internship
                  </span>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px', letterSpacing: '0.5px' }}>
                  <FaMapMarkerAlt size={11} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                  Parwanipur, Bara District, Nepal
                </p>

                {/* Key achievements */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    {
                      icon: '🎯',
                      text: 'Redesigned and optimized the official local government website using CSS and JavaScript, significantly improving responsiveness and accessibility for community members.'
                    },
                    {
                      icon: '⚡',
                      text: 'Improved page load speed and cross-device user experience, benefiting both administrative staff and the general public accessing government services online.'
                    },
                    {
                      icon: '📊',
                      text: 'Managed digital records and streamlined data entry processes to reduce administrative overhead by improving workflow efficiency.'
                    },
                  ].map(({ icon, text }) => (
                    <div key={icon} style={{ display: 'flex', gap: '12px' }}>
                      <span style={{ fontSize: '1rem', flexShrink: 0, marginTop: '2px' }}>{icon}</span>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{text}</p>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '20px' }}>
                  {['CSS', 'JavaScript', 'Web Optimization', 'UI/UX', 'Data Management'].map((tag) => (
                    <span
                      key={tag}
                      style={{
                        padding: '4px 12px',
                        background: 'rgba(196,30,58,0.12)',
                        border: '1px solid rgba(196,30,58,0.3)',
                        borderRadius: '50px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--crimson-light)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="gold-divider" style={{ marginBottom: '80px' }} />

        {/* =================== EDUCATION =================== */}
        <section className="reveal" style={{ marginBottom: '80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
            <FaGraduationCap size={24} color="var(--gold)" />
            <h2 className="section-heading">Education</h2>
          </div>

          <div
            style={{
              background: 'rgba(15,15,40,0.9)',
              border: '1px solid rgba(212,175,55,0.25)',
              borderRadius: '8px',
              padding: '32px',
              maxWidth: '700px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Background University initial */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                right: '-20px',
                bottom: '-20px',
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: '8rem',
                fontWeight: 900,
                color: 'rgba(212,175,55,0.05)',
                lineHeight: 1,
                pointerEvents: 'none',
              }}
            >
              K
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>
                2022 — 2026
              </p>
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '4px',
                }}
              >
                B.Tech in Computer Science & Engineering
              </h3>
              <p style={{ color: 'var(--gold)', fontWeight: 700, marginBottom: '16px' }}>
                Kalinga Institute of Industrial Technology (KIIT), Bhubaneswar
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                Pursuing a comprehensive program in Computer Science with focus areas in Data Structures,
                Algorithms, Machine Learning, Full-Stack Development, and Database Management Systems.
              </p>
            </div>
          </div>
        </section>

        <div className="gold-divider" style={{ marginBottom: '80px' }} />

        {/* =================== TECHNICAL SKILLS MATRIX =================== */}
        <section style={{ marginBottom: '80px' }}>
          <div className="reveal" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
            <FaCode size={24} color="var(--crimson)" />
            <h2 className="section-heading">Technical Skills</h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '32px',
            }}
          >
            {/* Languages */}
            <div className="reveal" style={{ background: 'rgba(15,15,40,0.8)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                <FaCode color="var(--crimson)" />
                <h4 style={{ fontFamily: "'Raleway'", fontWeight: 700, fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Languages
                </h4>
              </div>
              <SkillBar name="Python" percent={85} color="#FFD43B" />
              <SkillBar name="JavaScript (ES6+)" percent={80} color="#F7DF1E" />
              <SkillBar name="Java" percent={72} color="#E57373" />
              <SkillBar name="C" percent={65} color="#78909C" />
            </div>

            {/* Frontend */}
            <div className="reveal" style={{ background: 'rgba(15,15,40,0.8)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                <FaTools color="var(--gold)" />
                <h4 style={{ fontFamily: "'Raleway'", fontWeight: 700, fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Frontend
                </h4>
              </div>
              <SkillBar name="React.js" percent={82} color="#61DAFB" />
              <SkillBar name="Tailwind CSS" percent={85} color="#38BDF8" />
              <SkillBar name="HTML5 / CSS3" percent={90} color="#E44D26" />
            </div>

            {/* Data Science */}
            <div className="reveal" style={{ background: 'rgba(15,15,40,0.8)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                <FaBrain color="#FF6F00" />
                <h4 style={{ fontFamily: "'Raleway'", fontWeight: 700, fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Data Science & ML
                </h4>
              </div>
              <SkillBar name="Machine Learning" percent={78} color="#FF6F00" />
              <SkillBar name="YOLOv5 / CV" percent={72} color="#FF8C42" />
              <SkillBar name="Data Preprocessing" percent={80} color="#F7931E" />
            </div>

            {/* Tools */}
            <div className="reveal" style={{ background: 'rgba(15,15,40,0.8)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                <FaDatabase color="#4479A1" />
                <h4 style={{ fontFamily: "'Raleway'", fontWeight: 700, fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Tools & Other
                </h4>
              </div>
              <SkillBar name="Git / GitHub" percent={82} color="#F05032" />
              <SkillBar name="MySQL" percent={75} color="#4479A1" />
              <SkillBar name="Node.js" percent={72} color="#8CC84B" />
            </div>
          </div>
        </section>

        {/* ===== TECH ICON GRID ===== */}
        <section className="reveal" style={{ marginBottom: '80px' }}>
          <h3
            style={{
              fontFamily: "'Raleway', sans-serif",
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '4px',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: '24px',
              textAlign: 'center',
            }}
          >
            Technologies
          </h3>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              justifyContent: 'center',
            }}
          >
            <SkillIcon Icon={SiPython} name="Python" color="#FFD43B" />
            <SkillIcon Icon={SiJavascript} name="JS" color="#F7DF1E" />
            <SkillIcon Icon={DiJava} name="Java" color="#E57373" />
            <SkillIcon Icon={SiReact} name="React" color="#61DAFB" />
            <SkillIcon Icon={SiNodedotjs} name="Node.js" color="#8CC84B" />
            <SkillIcon Icon={SiTailwindcss} name="Tailwind" color="#38BDF8" />
            <SkillIcon Icon={SiTensorflow} name="TensorFlow" color="#FF6F00" />
            <SkillIcon Icon={SiScikitlearn} name="Sklearn" color="#F7931E" />
            <SkillIcon Icon={SiMysql} name="MySQL" color="#4479A1" />
            <SkillIcon Icon={SiGit} name="Git" color="#F05032" />
            <SkillIcon Icon={DiCss3} name="CSS3" color="#2965F1" />
          </div>
        </section>

        <div className="gold-divider" style={{ marginBottom: '60px' }} />

        {/* =================== CERTIFICATIONS =================== */}
        <section className="reveal" style={{ marginBottom: '60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <FaCertificate size={20} color="var(--gold)" />
            <h2 className="section-heading">Certifications</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <CertCard title="Cloud Computing" issuer="Udemy — Certified" color="var(--gold)" />
            <CertCard title="Java Programming" issuer="Udemy — Certified" color="var(--crimson)" />
          </div>
        </section>

      </div>
    </div>
  )
}