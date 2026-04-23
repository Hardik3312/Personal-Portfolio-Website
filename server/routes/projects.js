'use strict'
// ─────────────────────────────────────────────────────────────────────────────
//  PROJECTS ROUTE
//  GET    /api/projects          — public: list all (or featured only)
//  GET    /api/projects/:slug    — public: single project by slug
//  POST   /api/projects          — admin: create
//  PUT    /api/projects/:slug    — admin: full update
//  PATCH  /api/projects/:slug    — admin: partial update
//  DELETE /api/projects/:slug    — admin: delete
// ─────────────────────────────────────────────────────────────────────────────

const express   = require('express')
const { body }  = require('express-validator')

const { query, execute } = require('../config/db')
const { protect }        = require('../middleware/auth')
const validate           = require('../middleware/validate')
const logger             = require('../config/logger')

const router = express.Router()

// ─── Validation for create / update ──────────────────────────────────────────
const projectValidation = [
  body('slug')
    .trim()
    .notEmpty().withMessage('Slug is required.')
    .isSlug().withMessage('Slug must be lowercase with hyphens only.'),

  body('title')
    .trim()
    .notEmpty().withMessage('Title is required.')
    .isLength({ max: 200 }).withMessage('Title must be under 200 characters.'),

  body('category')
    .trim()
    .notEmpty().withMessage('Category is required.'),

  body('short_desc')
    .trim()
    .notEmpty().withMessage('Short description is required.'),

  body('tech_stack')
    .optional()
    .isArray().withMessage('tech_stack must be an array.'),

  body('sort_order')
    .optional()
    .isInt({ min: 0 }).withMessage('sort_order must be a non-negative integer.'),
]

// ─── GET /api/projects ────────────────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const featured = req.query.featured === 'true'
    const where    = featured ? 'WHERE is_featured = 1' : ''

    const rows = await query(
      `SELECT slug, title, category, emoji, short_desc, tech_stack,
              github_url, live_url, accent_color, is_featured, sort_order
       FROM projects ${where}
       ORDER BY sort_order ASC, created_at DESC`
    )

    // Parse JSON tech_stack from DB
    const data = rows.map((r) => ({
      ...r,
      tech_stack: typeof r.tech_stack === 'string'
        ? JSON.parse(r.tech_stack)
        : r.tech_stack,
    }))

    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
})

// ─── GET /api/projects/:slug ──────────────────────────────────────────────────
router.get('/:slug', async (req, res, next) => {
  try {
    const rows = await query(
      `SELECT * FROM projects WHERE slug = ?`,
      [req.params.slug]
    )
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Project not found.' })
    }
    const project = {
      ...rows[0],
      tech_stack: typeof rows[0].tech_stack === 'string'
        ? JSON.parse(rows[0].tech_stack)
        : rows[0].tech_stack,
    }
    res.json({ success: true, data: project })
  } catch (err) {
    next(err)
  }
})

// ─── POST /api/projects — admin: create ──────────────────────────────────────
router.post('/', protect, projectValidation, validate, async (req, res, next) => {
  try {
    const {
      slug, title, category, emoji, short_desc,
      problem, solution, result, tech_stack,
      github_url, live_url, accent_color,
      is_featured = 0, sort_order = 0,
    } = req.body

    await execute(
      `INSERT INTO projects
         (slug, title, category, emoji, short_desc, problem, solution, result,
          tech_stack, github_url, live_url, accent_color, is_featured, sort_order)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        slug, title, category, emoji || null, short_desc,
        problem || null, solution || null, result || null,
        JSON.stringify(tech_stack || []),
        github_url || null, live_url || null,
        accent_color || '#D4AF37', is_featured ? 1 : 0, sort_order,
      ]
    )

    logger.info(`Project created: ${slug}`)
    res.status(201).json({ success: true, message: 'Project created.', slug })
  } catch (err) {
    next(err)
  }
})

// ─── PUT /api/projects/:slug — admin: full update ────────────────────────────
router.put('/:slug', protect, projectValidation, validate, async (req, res, next) => {
  try {
    const {
      title, category, emoji, short_desc,
      problem, solution, result, tech_stack,
      github_url, live_url, accent_color,
      is_featured, sort_order,
    } = req.body

    const result2 = await execute(
      `UPDATE projects SET
         title=?, category=?, emoji=?, short_desc=?,
         problem=?, solution=?, result=?, tech_stack=?,
         github_url=?, live_url=?, accent_color=?,
         is_featured=?, sort_order=?
       WHERE slug=?`,
      [
        title, category, emoji || null, short_desc,
        problem || null, solution || null, result || null,
        JSON.stringify(tech_stack || []),
        github_url || null, live_url || null,
        accent_color || '#D4AF37',
        is_featured ? 1 : 0, sort_order || 0,
        req.params.slug,
      ]
    )
    if (result2.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Project not found.' })
    }
    res.json({ success: true, message: 'Project updated.' })
  } catch (err) {
    next(err)
  }
})

// ─── PATCH /api/projects/:slug — admin: partial update ───────────────────────
router.patch('/:slug', protect, async (req, res, next) => {
  try {
    const allowed = [
      'title', 'category', 'emoji', 'short_desc',
      'problem', 'solution', 'result', 'tech_stack',
      'github_url', 'live_url', 'accent_color', 'is_featured', 'sort_order',
    ]
    const updates = []
    const values  = []

    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates.push(`${key} = ?`)
        values.push(
          key === 'tech_stack' ? JSON.stringify(req.body[key]) : req.body[key]
        )
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields to update.' })
    }

    values.push(req.params.slug)
    const result = await execute(
      `UPDATE projects SET ${updates.join(', ')} WHERE slug = ?`,
      values
    )
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Project not found.' })
    }
    res.json({ success: true, message: 'Project patched.' })
  } catch (err) {
    next(err)
  }
})

// ─── DELETE /api/projects/:slug — admin ──────────────────────────────────────
router.delete('/:slug', protect, async (req, res, next) => {
  try {
    const result = await execute(
      `DELETE FROM projects WHERE slug = ?`,
      [req.params.slug]
    )
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Project not found.' })
    }
    logger.info(`Project deleted: ${req.params.slug}`)
    res.json({ success: true, message: 'Project deleted.' })
  } catch (err) {
    next(err)
  }
})

module.exports = router