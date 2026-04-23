'use strict'

const rateLimit = require('express-rate-limit')

// ─── Global limiter (all /api/* routes) ──────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 min
  max:      Number(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders:   false,
  message: {
    success: false,
    message: 'Too many requests. Please try again in a few minutes.',
  },
})

// ─── Strict limiter for contact form (prevent spam) ──────────────────────────
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max:      Number(process.env.CONTACT_RATE_LIMIT_MAX) || 5,
  standardHeaders: true,
  legacyHeaders:   false,
  message: {
    success: false,
    message: 'Too many messages sent. Please wait 15 minutes and try again.',
  },
})

// ─── Auth limiter (prevent brute-force on admin login) ───────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max:      10,
  standardHeaders: true,
  legacyHeaders:   false,
  message: {
    success: false,
    message: 'Too many login attempts. Account temporarily locked.',
  },
})

module.exports = { globalLimiter, contactLimiter, authLimiter }