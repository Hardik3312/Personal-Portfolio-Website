'use strict'

const logger = require('../config/logger')

/**
 * Global Express error handler.
 * Must be registered LAST (after all routes).
 */
function errorHandler(err, req, res, _next) {
  // Log the full error in development; minimal in production
  if (process.env.NODE_ENV === 'development') {
    logger.error(`${req.method} ${req.originalUrl} → ${err.message}`, err)
  } else {
    logger.error(`${req.method} ${req.originalUrl} → ${err.message}`)
  }

  // Handle known error types
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ success: false, message: 'Duplicate entry.' })
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, message: err.message })
  }
  if (err.message?.includes('CORS')) {
    return res.status(403).json({ success: false, message: err.message })
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ success: false, message: 'Request body too large.' })
  }

  const status  = err.statusCode || err.status || 500
  const message = process.env.NODE_ENV === 'production' && status === 500
    ? 'An internal server error occurred.'
    : err.message || 'Internal server error.'

  res.status(status).json({ success: false, message })
}

module.exports = errorHandler