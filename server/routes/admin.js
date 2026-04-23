'use strict'
// ─────────────────────────────────────────────────────────────────────────────
//  ADMIN ROUTES
//  POST /api/admin/login         — get JWT token
//  GET  /api/admin/me            — verify token, get own info
//  GET  /api/admin/stats         — dashboard summary
//  POST /api/admin/pageview      — record a page view (called from frontend)
//  GET  /api/admin/analytics     — page-view breakdown (admin only)
// ─────────────────────────────────────────────────────────────────────────────

const express  = require('express')
const { body } = require('express-validator')
const bcrypt   = require('bcryptjs')
const jwt      = require('jsonwebtoken')

const { query, execute } = require('../config/db')
const { protect }        = require('../middleware/auth')
const { authLimiter }    = require('../middleware/rateLimiter')
const validate           = require('../middleware/validate')
const logger             = require('../config/logger')

const router = express.Router()

// ─── POST /api/admin/login ────────────────────────────────────────────────────
router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('Valid email required.').normalizeEmail(),
    body('password').notEmpty().withMessage('Password required.'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { email, password } = req.body

      const rows = await query(
        `SELECT id, email, password_hash FROM admin_users WHERE email = ?`,
        [email]
      )

      if (!rows.length) {
        return res.status(401).json({ success: false, message: 'Invalid credentials.' })
      }

      const admin = rows[0]
      const match = await bcrypt.compare(password, admin.password_hash)
      if (!match) {
        logger.warn(`Failed admin login: ${email}`)
        return res.status(401).json({ success: false, message: 'Invalid credentials.' })
      }

      // Update last_login
      await execute(
        `UPDATE admin_users SET last_login = NOW() WHERE id = ?`,
        [admin.id]
      )

      const token = jwt.sign(
        { id: admin.id, email: admin.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      )

      logger.info(`Admin login: ${email}`)
      res.json({ success: true, token, email: admin.email })
    } catch (err) {
      next(err)
    }
  }
)

// ─── GET /api/admin/me — verify token ────────────────────────────────────────
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, data: { id: req.admin.id, email: req.admin.email } })
})

// ─── GET /api/admin/stats — dashboard summary ─────────────────────────────────
router.get('/stats', protect, async (req, res, next) => {
  try {
    const [[contactTotal]]  = [await query(`SELECT COUNT(*) AS n FROM contacts`)]
    const [[contactUnread]] = [await query(`SELECT COUNT(*) AS n FROM contacts WHERE is_read = 0`)]
    const [[projectTotal]]  = [await query(`SELECT COUNT(*) AS n FROM projects`)]
    const [[viewsToday]]    = [await query(
      `SELECT COUNT(*) AS n FROM page_views WHERE DATE(created_at) = CURDATE()`
    )]
    const [[viewsTotal]]    = [await query(`SELECT COUNT(*) AS n FROM page_views`)]

    const recentContacts = await query(
      `SELECT uuid, name, email, subject, created_at, is_read
       FROM contacts ORDER BY created_at DESC LIMIT 5`
    )

    res.json({
      success: true,
      data: {
        contacts:  { total: contactTotal.n, unread: contactUnread.n },
        projects:  { total: projectTotal.n },
        pageViews: { today: viewsToday.n,   total: viewsTotal.n },
        recentContacts,
      },
    })
  } catch (err) {
    next(err)
  }
})

// ─── POST /api/admin/pageview — called by frontend ───────────────────────────
router.post('/pageview', async (req, res, next) => {
  try {
    const path      = (req.body.path || '/').slice(0, 500)
    const referrer  = (req.body.referrer || '').slice(0, 500)
    const ip        = req.ip || ''
    const userAgent = (req.headers['user-agent'] || '').slice(0, 500)

    await execute(
      `INSERT INTO page_views (path, referrer, ip_address, user_agent)
       VALUES (?, ?, ?, ?)`,
      [path, referrer, ip, userAgent]
    )
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

// ─── GET /api/admin/analytics — page-view breakdown ──────────────────────────
router.get('/analytics', protect, async (req, res, next) => {
  try {
    const days = Math.min(90, parseInt(req.query.days || '30'))

    // Views per day
    const daily = await query(
      `SELECT DATE(created_at) AS date, COUNT(*) AS views
       FROM page_views
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
       GROUP BY DATE(created_at)
       ORDER BY date ASC`,
      [days]
    )

    // Top pages
    const topPages = await query(
      `SELECT path, COUNT(*) AS views
       FROM page_views
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
       GROUP BY path
       ORDER BY views DESC
       LIMIT 10`,
      [days]
    )

    res.json({ success: true, data: { daily, topPages } })
  } catch (err) {
    next(err)
  }
})

module.exports = router