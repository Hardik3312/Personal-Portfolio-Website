'use strict'
// ─────────────────────────────────────────────────────────────────────────────
//  FILE UPLOAD ROUTE
//  POST /api/upload/cv     — admin: upload new CV PDF
//  GET  /api/upload/cv     — public: check if CV exists
// ─────────────────────────────────────────────────────────────────────────────

const express = require('express')
const multer  = require('multer')
const path    = require('path')
const fs      = require('fs')

const { protect } = require('../middleware/auth')
const logger      = require('../config/logger')

const router   = express.Router()
const UPLOAD_DIR = path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads')

// Ensure uploads directory exists
fs.mkdirSync(UPLOAD_DIR, { recursive: true })

// ─── Multer config ────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename:    (_req, file, cb) => {
    // Always save as Hardik_Patel_CV.pdf for a predictable public URL
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `Hardik_Patel_CV${ext}`)
  },
})

const fileFilter = (_req, file, cb) => {
  const allowed = ['.pdf', '.doc', '.docx']
  const ext = path.extname(file.originalname).toLowerCase()
  if (allowed.includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error('Only PDF and Word documents are allowed.'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: (Number(process.env.MAX_FILE_SIZE_MB) || 5) * 1024 * 1024,
  },
})

// ─── POST /api/upload/cv — admin only ────────────────────────────────────────
router.post('/cv', protect, (req, res, next) => {
  upload.single('cv')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: `Upload error: ${err.message}` })
    }
    if (err) {
      return res.status(400).json({ success: false, message: err.message })
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' })
    }

    const publicUrl = `/uploads/${req.file.filename}`
    logger.info(`CV uploaded: ${req.file.filename} by ${req.admin.email}`)

    res.json({
      success:  true,
      message:  'CV uploaded successfully.',
      filename: req.file.filename,
      url:      publicUrl,
      size:     req.file.size,
    })
  })
})

// ─── GET /api/upload/cv — public: check / redirect ───────────────────────────
router.get('/cv', (_req, res) => {
  const cvPath = path.join(UPLOAD_DIR, 'Hardik_Patel_CV.pdf')
  if (fs.existsSync(cvPath)) {
    res.json({ success: true, url: '/uploads/Hardik_Patel_CV.pdf', exists: true })
  } else {
    res.json({ success: false, exists: false, message: 'CV not uploaded yet.' })
  }
})

module.exports = router