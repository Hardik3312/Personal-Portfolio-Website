'use strict'

const { validationResult } = require('express-validator')

/**
 * Run after express-validator chains.
 * If there are errors → respond 422 with field-level details.
 * Otherwise → call next().
 */
function validate(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed.',
      errors:  errors.array().map(({ path, msg }) => ({ field: path, message: msg })),
    })
  }
  next()
}

module.exports = validate