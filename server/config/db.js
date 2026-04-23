'use strict'

const mysql  = require('mysql2/promise')
const logger = require('./logger')

let pool

/**
 * Creates and returns a MySQL connection pool.
 * Called once at startup; subsequent calls return the cached pool.
 */
async function connectDB() {
  if (pool) return pool

  pool = mysql.createPool({
    host:              process.env.DB_HOST     || 'localhost',
    port:              Number(process.env.DB_PORT) || 3306,
    user:              process.env.DB_USER     || 'root',
    password:          process.env.DB_PASSWORD || '',
    database:          process.env.DB_NAME     || 'portfolio_db',
    connectionLimit:   Number(process.env.DB_CONNECTION_LIMIT) || 10,
    waitForConnections: true,
    queueLimit:        0,
    // Auto-reconnect
    enableKeepAlive:   true,
    keepAliveInitialDelay: 0,
  })

  // Test connection
  try {
    const conn = await pool.getConnection()
    logger.info(`✅ MySQL connected → ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`)
    conn.release()
  } catch (err) {
    logger.error('❌ MySQL connection failed:', err.message)
    throw err
  }

  return pool
}

/**
 * Returns the active pool (throws if connectDB() was never called).
 */
function getDB() {
  if (!pool) throw new Error('Database not initialised. Call connectDB() first.')
  return pool
}

/**
 * Helper: run a parameterised query and return rows.
 * @param {string} sql
 * @param {Array}  params
 */
async function query(sql, params = []) {
  const db = getDB()
  const [rows] = await db.execute(sql, params)
  return rows
}

/**
 * Helper: run an INSERT / UPDATE / DELETE and return the result object.
 */
async function execute(sql, params = []) {
  const db = getDB()
  const [result] = await db.execute(sql, params)
  return result
}

module.exports = { connectDB, getDB, query, execute }