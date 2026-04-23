'use strict'
// ─────────────────────────────────────────────────────────────────────────────
//  CONTACT ROUTE + CONTROLLER
//  POST /api/contact        — public, submit contact form
//  GET  /api/contact        — admin only, list all messages
//  GET  /api/contact/:id    — admin only, get single message
//  PATCH /api/contact/:id/read   — admin only, mark as read
//  PATCH /api/contact/:id/reply  — admin only, mark as replied
//  DELETE /api/contact/:id  — admin only, delete
// ─────────────────────────────────────────────────────────────────────────────

const express    = require('express')
const { body }   = require('express-validator')
const { v4: uuid } = require('uuid')

const { query, execute }    = require('../config/db')
const { sendContactEmails } = require('../config/mailer')
const { contactLimiter }    = require('../middleware/rateLimiter')
const { protect }           = require('../middleware/auth')
const validate              = require('../middleware/validate')
const logger                = require('../config/logger')

const router = express.Router()

// ─── Validation rules for the public form ────────────────────────────────────
const contactValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required.')
    .isLength({ max: 120 }).withMessage('Name must be under 120 characters.'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),

  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required.')
    .isLength({ max: 200 }).withMessage('Subject must be under 200 characters.'),

  body('message')
    .trim()
    .notEmpty().withMessage('Message is required.')
    .isLength({ min: 20, max: 5000 })
    .withMessage('Message must be between 20 and 5000 characters.'),
]

// ─── POST /api/contact — public ───────────────────────────────────────────────
router.post(
  '/',
  contactLimiter,
  contactValidation,
  validate,
  async (req, res, next) => {
    try {
      const { name, email, subject, message } = req.body
      const id         = uuid()
      const ip         = req.ip || req.socket?.remoteAddress
      const userAgent  = (req.headers['user-agent'] || '').slice(0, 500)

      // Save to DB
      await execute(
        `INSERT INTO contacts (uuid, name, email, subject, message, ip_address, user_agent)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, name, email, subject, message, ip, userAgent]
      )

      // Send emails (fire-and-forget, don't block response)
      sendContactEmails({ name, email, subject, message }).catch((err) =>
        logger.error(`Email send failed for contact ${id}: ${err.message}`)
      )

      logger.info(`New contact: ${name} <${email}> — ${subject}`)

      res.status(201).json({
        success: true,
        message: 'Message received! I will get back to you within 24 hours.',
      })
    } catch (err) {
      next(err)
    }
  }
)

// ─── GET /api/contact — admin: list all ──────────────────────────────────────
router.get('/', protect, async (req, res, next) => {
  try {
    const page    = Math.max(1, parseInt(req.query.page  || '1'))
    const limit   = Math.min(50, parseInt(req.query.limit || '20'))
    const offset  = (page - 1) * limit
    const unread  = req.query.unread === 'true'

    const whereClause = unread ? 'WHERE is_read = 0' : ''

    const rows = await query(
      `SELECT id, uuid, name, email, subject, LEFT(message,120) AS preview,
              is_read, is_replied, created_at
       FROM contacts ${whereClause}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    )

    const [{ total }] = await query(
      `SELECT COUNT(*) AS total FROM contacts ${whereClause}`
    )

    res.json({
      success: true,
      data:    rows,
      meta:    { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (err) {
    next(err)
  }
})

// ─── GET /api/contact/:id — admin: single ────────────────────────────────────
router.get('/:id', protect, async (req, res, next) => {
  try {
    const rows = await query(
      `SELECT * FROM contacts WHERE uuid = ?`,
      [req.params.id]
    )
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Message not found.' })
    }
    // Auto-mark as read
    await execute(`UPDATE contacts SET is_read = 1 WHERE uuid = ?`, [req.params.id])
    res.json({ success: true, data: rows[0] })
  } catch (err) {
    next(err)
  }
})

// ─── PATCH /api/contact/:id/read — admin: mark read ──────────────────────────
router.patch('/:id/read', protect, async (req, res, next) => {
  try {
    await execute(`UPDATE contacts SET is_read = 1 WHERE uuid = ?`, [req.params.id])
    res.json({ success: true, message: 'Marked as read.' })
  } catch (err) {
    next(err)
  }
})

// ─── PATCH /api/contact/:id/reply — admin: mark replied ──────────────────────
router.patch('/:id/reply', protect, async (req, res, next) => {
  try {
    await execute(
      `UPDATE contacts SET is_replied = 1, is_read = 1 WHERE uuid = ?`,
      [req.params.id]
    )
    res.json({ success: true, message: 'Marked as replied.' })
  } catch (err) {
    next(err)
  }
})

// ─── DELETE /api/contact/:id — admin ─────────────────────────────────────────
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const result = await execute(
      `DELETE FROM contacts WHERE uuid = ?`,
      [req.params.id]
    )
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Message not found.' })
    }
    res.json({ success: true, message: 'Message deleted.' })
  } catch (err) {
    next(err)
  }
})

module.exports = router