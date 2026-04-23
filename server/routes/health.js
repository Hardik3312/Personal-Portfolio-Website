'use strict'
// ─── Health Check ─────────────────────────────────────────────────────────────
// GET /api/health

const express = require('express')
const { getDB } = require('../config/db')

const router = express.Router()

router.get('/', async (_req, res) => {
  let dbStatus = 'ok'
  try {
    const conn = await getDB().getConnection()
    conn.release()
  } catch {
    dbStatus = 'error'
  }

  const status = dbStatus === 'ok' ? 200 : 503
  res.status(status).json({
    success: dbStatus === 'ok',
    status:  dbStatus === 'ok' ? 'healthy' : 'degraded',
    services: {
      server: 'ok',
      database: dbStatus,
    },
    uptime:    Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    env:       process.env.NODE_ENV || 'development',
  })
})

module.exports = router