'use strict'

// ─── Load env vars FIRST ──────────────────────────────────────────────────────
require('dotenv').config()

const express    = require('express')
const helmet     = require('helmet')
const cors       = require('cors')
const morgan     = require('morgan')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const path       = require('path')

const { connectDB }       = require('./config/db')
const { httpLogger }      = require('./config/logger')
const { globalLimiter }   = require('./middleware/rateLimiter')
const errorHandler        = require('./middleware/errorHandler')
const notFoundHandler     = require('./middleware/notFoundHandler')

// ─── Route imports ────────────────────────────────────────────────────────────
const contactRoutes  = require('./routes/contact')
const projectRoutes  = require('./routes/projects')
const adminRoutes    = require('./routes/admin')
const healthRoutes   = require('./routes/health')
const uploadRoutes   = require('./routes/upload')

const app  = express()
const PORT = process.env.PORT || 5000

// ─── Security headers ─────────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false, // handled by frontend
  })
)

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (e.g. Postman, curl)
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
      cb(new Error(`CORS: origin ${origin} not allowed`))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
)

// ─── Compression ──────────────────────────────────────────────────────────────
app.use(compression())

// ─── Body parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true, limit: '2mb' }))
app.use(cookieParser())

// ─── HTTP request logging ─────────────────────────────────────────────────────
app.use(httpLogger)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// ─── Static files (uploaded CVs, images) ──────────────────────────────────────
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'), { maxAge: '7d' })
)

// ─── Global rate limiter ──────────────────────────────────────────────────────
app.use('/api', globalLimiter)

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/health',   healthRoutes)
app.use('/api/contact',  contactRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/admin',    adminRoutes)
app.use('/api/upload',   uploadRoutes)

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use(notFoundHandler)

// ─── Global error handler ─────────────────────────────────────────────────────
app.use(errorHandler)

// ─── Start server after DB connects ───────────────────────────────────────────
async function startServer() {
  await connectDB()
  app.listen(PORT, () => {
    console.log('\n╔════════════════════════════════════════╗')
    console.log(`║   🚀  Server running on port ${PORT}       ║`)
    console.log(`║   🌿  ENV : ${(process.env.NODE_ENV || 'development').padEnd(27)}║`)
    console.log('╚════════════════════════════════════════╝\n')
  })
}

startServer().catch((err) => {
  console.error('❌ Failed to start server:', err)
  process.exit(1)
})

// ─── Graceful shutdown ────────────────────────────────────────────────────────
process.on('SIGTERM', () => {
  console.log('SIGTERM received — shutting down gracefully')
  process.exit(0)
})
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason)
})
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err)
  process.exit(1)
})

module.exports = app