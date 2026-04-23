'use strict'
/**
 * DATABASE SEED
 * Run: node config/seed.js
 *
 * Inserts the 3 portfolio projects and creates the default admin user.
 * Uses INSERT IGNORE so it's safe to run multiple times.
 */

require('dotenv').config()
const mysql   = require('mysql2/promise')
const bcrypt  = require('bcryptjs')

const PROJECTS = [
  {
    slug:        'helmet-detection-system',
    title:       'Helmet Detection System',
    category:    'Computer Vision',
    emoji:       '🚀',
    short_desc:  'Real-time object detection system using YOLOv5 to identify motorcycle riders without helmets from surveillance footage.',
    problem:     'Road accidents due to unhelmeted riders are a leading cause of fatalities in South Asia. Traditional surveillance systems require manual monitoring, which is inefficient at scale.',
    solution:    'Trained a YOLOv5 model on annotated road surveillance images using transfer learning from COCO weights and data augmentation (flipping, mosaic, colour jitter) to maximise detection accuracy across varied lighting.',
    result:      'Achieved high mAP on the test set. The system processes live video feeds and flags violations in real-time, enabling automated enforcement.',
    tech_stack:  JSON.stringify([
      { label: 'Python',             color: '#FFD43B' },
      { label: 'YOLOv5',            color: '#C41E3A' },
      { label: 'PyTorch',           color: '#EE4C2C' },
      { label: 'OpenCV',            color: '#5C3EE8' },
      { label: 'Transfer Learning', color: '#FF8C42' },
      { label: 'Data Augmentation', color: '#F7931E' },
    ]),
    github_url:  'https://github.com/hardik0626/helmet-detection',
    live_url:    null,
    accent_color:'#C41E3A',
    is_featured: 1,
    sort_order:  1,
  },
  {
    slug:        'weather-forecasting-ml',
    title:       'Weather Forecasting ML',
    category:    'Machine Learning',
    emoji:       '🌦️',
    short_desc:  'Predictive ML pipeline for temperature, rainfall, and wind speed built on historical meteorological datasets.',
    problem:     'Accurate hyper-local weather forecasting is critical for agriculture and logistics. Numerical models are computationally expensive and hard to customise.',
    solution:    'Ingested multi-year meteorological data, performed EDA and feature engineering, then trained Random Forest, Gradient Boosting, and Linear Regression models with k-fold cross-validation.',
    result:      'Delivered strong RMSE scores for temperature and rainfall prediction with a clean Python CLI for custom location forecasting.',
    tech_stack:  JSON.stringify([
      { label: 'Python',       color: '#FFD43B' },
      { label: 'Scikit-learn', color: '#F7931E' },
      { label: 'Pandas',       color: '#150458' },
      { label: 'NumPy',        color: '#4DABCF' },
      { label: 'Matplotlib',   color: '#11557C' },
      { label: 'Random Forest',color: '#2D7A3A' },
    ]),
    github_url:  'https://github.com/hardik0626/weather-forecasting-ml',
    live_url:    null,
    accent_color:'#F7931E',
    is_featured: 1,
    sort_order:  2,
  },
  {
    slug:        'giftsforever-platform',
    title:       'GiftsForever Platform',
    category:    'Full-Stack',
    emoji:       '🎁',
    short_desc:  'Feature-rich full-stack e-commerce gifting platform with dynamic product grids, custom cart, and personalised input flows.',
    problem:     'Generic e-commerce platforms lack personalisation for the gifting niche — custom messages, recipient preferences, and curated discovery are afterthoughts.',
    solution:    'Built a React.js frontend with Tailwind CSS, a Node.js/Express backend for product management and order processing, and MySQL for persistence. Implemented category filtering, stateful cart, and personalised gift config.',
    result:      'A fully responsive gifting platform with custom message cards, dynamic search, and a clean checkout flow.',
    tech_stack:  JSON.stringify([
      { label: 'React.js',    color: '#61DAFB' },
      { label: 'Tailwind CSS',color: '#38BDF8' },
      { label: 'Node.js',     color: '#8CC84B' },
      { label: 'Express.js',  color: '#7B7B7B' },
      { label: 'MySQL',       color: '#4479A1' },
      { label: 'REST API',    color: '#D4AF37' },
    ]),
    github_url:  'https://github.com/hardik0626/giftsforever',
    live_url:    null,
    accent_color:'#61DAFB',
    is_featured: 1,
    sort_order:  3,
  },
]

async function seed() {
  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST     || 'localhost',
    port:     Number(process.env.DB_PORT) || 3306,
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'portfolio_db',
  })

  try {
    console.log('\n🌱 Seeding database...\n')

    // ── Projects ─────────────────────────────────────────────────────────────
    for (const p of PROJECTS) {
      await conn.execute(
        `INSERT IGNORE INTO projects
           (slug, title, category, emoji, short_desc, problem, solution, result,
            tech_stack, github_url, live_url, accent_color, is_featured, sort_order)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          p.slug, p.title, p.category, p.emoji,
          p.short_desc, p.problem, p.solution, p.result,
          p.tech_stack, p.github_url, p.live_url,
          p.accent_color, p.is_featured, p.sort_order,
        ]
      )
      console.log(`   ✅ Project seeded: ${p.title}`)
    }

    // ── Admin user ────────────────────────────────────────────────────────────
    const adminEmail = process.env.ADMIN_EMAIL || 'hardik0626@gmail.com'
    const adminPass  = 'Admin@Portfolio123!' // ⚠ Change after first login!
    const hash       = await bcrypt.hash(adminPass, 12)

    await conn.execute(
      `INSERT IGNORE INTO admin_users (email, password_hash) VALUES (?, ?)`,
      [adminEmail, hash]
    )
    console.log(`   ✅ Admin user: ${adminEmail}`)
    console.log(`   🔑 Temp password: ${adminPass}  ← Change this immediately!\n`)

    console.log('🎉 Seed complete!\n')
  } catch (err) {
    console.error('❌ Seed failed:', err.message)
    process.exit(1)
  } finally {
    await conn.end()
  }
}

seed()