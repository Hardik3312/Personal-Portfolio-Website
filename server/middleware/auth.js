'use strict'

const jwt    = require('jsonwebtoken')
const logger = require('../config/logger')

/**
 * Protect admin routes.
 * Expects:  Authorization: Bearer <token>
 */
function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization || ''
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided.' })
    }

    const token   = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.admin = decoded // { id, email, iat, exp }
    next()
  } catch (err) {
    logger.warn(`Auth failed: ${err.message}`)
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' })
    }
    return res.status(401).json({ success: false, message: 'Invalid token.' })
  }
}

module.exports = { protect }