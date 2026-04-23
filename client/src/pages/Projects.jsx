import { useEffect, useState } from 'react'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'

// ===== 3D Card Tilt Hook =====
function use3DTilt() {
  const onMouseMove = (e) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 22
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 22
    card.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg) scale3d(1.03,1.03,1.03)`
    card.style.boxShadow = `
      ${-x * 2}px ${y * 2}px 50px rgba(0,0,0,0.5),
      0 0 40px rgba(212,175,55,0.1)
    `
  }
  const onMouseLeave = (e) => {
    const card = e.currentTarget
    card.style.transform = ''
    card.style.boxShadow = ''
  }
  return { onMouseMove, onMouseLeave }
}

// ===== Tech Pill =====
function TechPill({ label, color = '#D4AF37' }) {
  return (
    <span
      style={{
        padding: '4px 12px',
        background: `${color}18`,
        border: `1px solid ${color}50`,
        borderRadius: '50px',
        fontSize: '0.72rem',
        fontWeight: 700,
        letterSpacing: '0.5px',
        color: color,
        display: 'inline-block',
        margin: '3px',
      }}
    >
      {label}
    </span>
  )
}

// ===== Project Detail Modal =====
function ProjectModal({ project, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#0F0F28',
          border: '1px solid rgba(212,175,55,0.3)',
          borderRadius: '12px',
          padding: 'clamp(24px, 4vw, 48px)',
          maxWidth: '680px',
          width: '100%',
          maxHeight: '85vh',
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        {/* Accent top bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
          background: `linear-gradient(to right, ${project.accentColor}, var(--gold))`,
          borderRadius: '12px 12px 0 0',
        }} />

        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.3)',
            borderRadius: '50%', width: '32px', height: '32px',
            color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          aria-label="Close"
        >
          ×
        </button>

        <div style={{ marginBottom: '8px' }}>
          <span style={{ fontSize: '2.5rem' }}>{project.emoji}</span>
        </div>
        <div
          style={{
            display: 'inline-block',
            padding: '4px 12px',
            background: `${project.accentColor}20`,
            border: `1px solid ${project.accentColor}50`,
            borderRadius: '50px',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '1px',
            color: project.accentColor,
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}
        >
          {project.category}
        </div>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.4rem, 3vw, 2rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '20px',
          }}
        >
          {project.title}
        </h2>

        {/* Problem / Solution / Result */}
        {[
          { label: '🎯 The Problem', content: project.problem },
          { label: '🔧 The Solution', content: project.solution },
          { label: '✅ The Result', content: project.result },
        ].map(({ label, content }) => (
          <div key={label} style={{ marginBottom: '20px' }}>
            <h4 style={{ fontWeight: 700, color: 'var(--gold)', fontSize: '0.9rem', marginBottom: '8px' }}>
              {label}
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
              {content}
            </p>
          </div>
        ))}

        {/* Technologies */}
        <div style={{ marginBottom: '28px' }}>
          <h4 style={{ fontWeight: 700, color: 'var(--gold)', fontSize: '0.9rem', marginBottom: '12px' }}>
            🛠 Technologies Used
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {project.tech.map((t) => (
              <TechPill key={t.label} label={t.label} color={t.color} />
            ))}
          </div>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ padding: '10px 20px', fontSize: '0.85rem' }}
            >
              <FaGithub /> View Code
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ padding: '10px 20px', fontSize: '0.85rem' }}
            >
              <FaExternalLinkAlt /> Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// ===== Project Card =====
function ProjectCard({ project, index, onOpen }) {
  const { onMouseMove, onMouseLeave } = use3DTilt()

  return (
    <div
      className="reveal"
      style={{ transitionDelay: `${index * 0.12}s` }}
    >
      <div
        className="project-card card-3d"
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onClick={() => onOpen(project)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onOpen(project)}
        aria-label={`View details for ${project.title}`}
      >
        {/* Gradient top accent */}
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, height: '3px',
            background: `linear-gradient(to right, ${project.accentColor}, var(--gold))`,
            zIndex: 3,
          }}
        />

        {/* Background number */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '-20px',
            right: '-10px',
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: '7rem',
            fontWeight: 900,
            color: `${project.accentColor}08`,
            lineHeight: 1,
            pointerEvents: 'none',
            zIndex: 0,
            userSelect: 'none',
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </div>

        <div className="card-content" style={{ position: 'relative', zIndex: 2 }}>
          {/* Emoji */}
          <span
            style={{
              fontSize: '3rem',
              display: 'block',
              filter: `drop-shadow(0 0 12px ${project.accentColor}80)`,
              animation: `float ${5 + index}s ease-in-out infinite`,
              marginBottom: '16px',
            }}
          >
            {project.emoji}
          </span>

          {/* Category tag */}
          <div
            style={{
              display: 'inline-block',
              padding: '4px 12px',
              background: `${project.accentColor}18`,
              border: `1px solid ${project.accentColor}45`,
              borderRadius: '50px',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: project.accentColor,
              marginBottom: '16px',
            }}
          >
            {project.category}
          </div>

          {/* Title */}
          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '12px',
              lineHeight: 1.3,
            }}
          >
            {project.title}
          </h3>

          {/* Short desc */}
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              lineHeight: 1.7,
              marginBottom: '24px',
            }}
          >
            {project.shortDesc}
          </p>

          {/* Tech pills row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '24px' }}>
            {project.tech.slice(0, 4).map((t) => (
              <TechPill key={t.label} label={t.label} color={t.color} />
            ))}
            {project.tech.length > 4 && (
              <TechPill label={`+${project.tech.length - 4} more`} color="var(--text-muted)" />
            )}
          </div>

          {/* CTA row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(212,175,55,0.15)',
              paddingTop: '20px',
            }}
          >
            <span
              style={{
                fontSize: '0.8rem',
                color: project.accentColor,
                fontWeight: 700,
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              Click to explore →
            </span>
            <div style={{ display: 'flex', gap: '10px' }}>
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="GitHub"
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '1.1rem',
                    transition: 'color 0.3s ease',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#D4AF37' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '' }}
                >
                  <FaGithub />
                </a>
              )}
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Live"
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '1rem',
                    transition: 'color 0.3s ease',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#D4AF37' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '' }}
                >
                  <FaExternalLinkAlt />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ===== PROJECTS DATA =====
const PROJECTS = [
  {
    id: 1,
    emoji: '🚀',
    title: 'Helmet Detection System',
    category: 'Computer Vision',
    accentColor: '#C41E3A',
    shortDesc:
      'A real-time object detection system that identifies motorcycle riders without helmets using YOLOv5, trained on annotated road surveillance footage.',
    problem:
      'Road accidents due to unhelmeted riders are a leading cause of fatalities in South Asia. Traditional surveillance systems require manual monitoring, which is inefficient and error-prone at scale.',
    solution:
      'Trained a YOLOv5 model on a curated dataset of road surveillance images, applying transfer learning from pre-trained COCO weights and data augmentation (flipping, mosaic, color jitter) to maximize detection accuracy across lighting conditions.',
    result:
      'Achieved high mAP (mean Average Precision) on the test set. The system processes live video feeds and flags violations in real-time, enabling automated enforcement with minimal human supervision.',
    tech: [
      { label: 'Python', color: '#FFD43B' },
      { label: 'YOLOv5', color: '#C41E3A' },
      { label: 'PyTorch', color: '#EE4C2C' },
      { label: 'OpenCV', color: '#5C3EE8' },
      { label: 'Transfer Learning', color: '#FF8C42' },
      { label: 'Data Augmentation', color: '#F7931E' },
    ],
    github: 'https://github.com/hardik0626/helmet-detection',
    live: null,
  },
  {
    id: 2,
    emoji: '🌦️',
    title: 'Weather Forecasting ML',
    category: 'Machine Learning',
    accentColor: '#F7931E',
    shortDesc:
      'A predictive ML pipeline for weather variables—temperature, rainfall, and wind speed—built with regression and classification models on historical meteorological datasets.',
    problem:
      'Accurate hyper-local weather forecasting is critical for agriculture, logistics, and disaster preparedness. Traditional numerical models are computationally expensive and less accessible for custom use-cases.',
    solution:
      'Ingested and preprocessed multi-year historical meteorological data, performed exploratory data analysis (EDA), feature engineering, and trained multiple ML models (Linear Regression, Random Forest, Gradient Boosting) with cross-validation to select the optimal model per target variable.',
    result:
      'Delivered a forecasting pipeline with strong RMSE scores for temperature and rainfall prediction. Built a clean Python interface to run predictions for any location given historical data inputs.',
    tech: [
      { label: 'Python', color: '#FFD43B' },
      { label: 'Scikit-learn', color: '#F7931E' },
      { label: 'Pandas', color: '#150458' },
      { label: 'NumPy', color: '#4DABCF' },
      { label: 'Matplotlib', color: '#11557C' },
      { label: 'Random Forest', color: '#2D7A3A' },
    ],
    github: 'https://github.com/hardik0626/weather-forecasting-ml',
    live: null,
  },
  {
    id: 3,
    emoji: '🎁',
    title: 'GiftsForever Platform',
    category: 'Full-Stack',
    accentColor: '#61DAFB',
    shortDesc:
      'A feature-rich full-stack e-commerce platform for personalized gifting, featuring dynamic product grids, a custom shopping cart, and personalized input flows.',
    problem:
      'Generic e-commerce platforms lack the personalization features needed for the gifting niche—custom messages, recipient preferences, and curated product discovery are afterthoughts rather than core UX.',
    solution:
      'Built a React.js frontend with Tailwind CSS for a fully responsive UI, integrated a Node.js/Express backend for product management, order processing, and custom gift configuration. Implemented a dynamic product grid with category filtering and a stateful custom cart.',
    result:
      'Delivered a fully functional gifting platform with smooth UX across all screen sizes. Features include personalized gift wrapping options, custom message cards, dynamic product search, and a clean checkout flow.',
    tech: [
      { label: 'React.js', color: '#61DAFB' },
      { label: 'Tailwind CSS', color: '#38BDF8' },
      { label: 'Node.js', color: '#8CC84B' },
      { label: 'Express.js', color: '#7B7B7B' },
      { label: 'MySQL', color: '#4479A1' },
      { label: 'REST API', color: '#D4AF37' },
    ],
    github: 'https://github.com/hardik0626/giftsforever',
    live: null,
  },
]

// ===== PROJECTS PAGE =====
export default function Projects() {
  const [activeModal, setActiveModal] = useState(null)

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
          background: 'linear-gradient(180deg, rgba(0,48,135,0.1) 0%, transparent 100%)',
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
            ◆ Portfolio Projects
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
            Problems I've{' '}
            <span className="gradient-text">Solved</span>
          </h1>
          <p
            style={{
              maxWidth: '560px',
              marginTop: '20px',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              fontSize: '1rem',
            }}
          >
            Each project is a real problem, a thoughtful solution, and a lesson learned.
            Click any card to dive deep into the approach and outcomes.
          </p>
        </div>
      </div>

      {/* =================== PROJECT CARDS GRID =================== */}
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '28px',
            marginBottom: '80px',
          }}
        >
          {PROJECTS.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              onOpen={setActiveModal}
            />
          ))}
        </div>

        {/* =================== WHAT'S NEXT SECTION =================== */}
        <div className="gold-divider" style={{ marginBottom: '60px' }} />

        <div
          className="reveal"
          style={{
            textAlign: 'center',
            padding: '48px 24px',
            background: 'rgba(15,15,40,0.6)',
            border: '1px solid rgba(212,175,55,0.2)',
            borderRadius: '12px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background mandala */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              opacity: 0.04,
            }}
          >
            {[300, 240, 180, 120].map((size, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: `${size}px`,
                  height: `${size}px`,
                  borderRadius: '50%',
                  border: '1px solid #D4AF37',
                  animation: `rotate-slow ${12 + i * 4}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`,
                }}
              />
            ))}
          </div>

          <p
            style={{
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: '0.7rem',
              letterSpacing: '4px',
              color: 'var(--gold)',
              marginBottom: '16px',
            }}
          >
            ◆ WHAT'S NEXT ◆
          </p>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '16px',
            }}
          >
            More in the Pipeline
          </h2>
          <p
            style={{
              color: 'var(--text-secondary)',
              maxWidth: '480px',
              margin: '0 auto 32px',
              lineHeight: 1.7,
              fontSize: '0.95rem',
            }}
          >
            Currently exploring NLP-based projects, advanced React architectures, and cloud
            deployment pipelines. Want to collaborate? Let's connect.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://github.com/hardik0626"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <FaGithub /> GitHub Profile
            </a>
            <a
              href="mailto:hardik0626@gmail.com"
              className="btn-primary"
            >
              Collaborate →
            </a>
          </div>
        </div>
      </div>

      {/* =================== MODAL =================== */}
      {activeModal && (
        <ProjectModal
          project={activeModal}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  )
}