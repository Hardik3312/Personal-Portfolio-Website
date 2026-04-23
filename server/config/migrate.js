'use strict'
/**
 * DATABASE MIGRATION
 * Run: node config/migrate.js
 *
 * Creates all tables required by the portfolio backend.
 * Safe to run multiple times (uses CREATE TABLE IF NOT EXISTS).
 */

require('dotenv').config()
const mysql = require('mysql2/promise')

const SQL_STATEMENTS = [
  // ── contacts ──────────────────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS contacts (
    id          INT          UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid        CHAR(36)     NOT NULL UNIQUE,
    name        VARCHAR(120) NOT NULL,
    email       VARCHAR(254) NOT NULL,
    subject     VARCHAR(200) NOT NULL,
    message     TEXT         NOT NULL,
    ip_address  VARCHAR(45),
    user_agent  VARCHAR(500),
    is_read     TINYINT(1)   NOT NULL DEFAULT 0,
    is_replied  TINYINT(1)   NOT NULL DEFAULT 0,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email      (email),
    INDEX idx_created_at (created_at),
    INDEX idx_is_read    (is_read)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // ── projects ──────────────────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS projects (
    id           INT           UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    slug         VARCHAR(100)  NOT NULL UNIQUE,
    title        VARCHAR(200)  NOT NULL,
    category     VARCHAR(80)   NOT NULL,
    emoji        VARCHAR(10),
    short_desc   TEXT          NOT NULL,
    problem      TEXT,
    solution     TEXT,
    result       TEXT,
    tech_stack   JSON,
    github_url   VARCHAR(500),
    live_url     VARCHAR(500),
    accent_color VARCHAR(20)   DEFAULT '#D4AF37',
    is_featured  TINYINT(1)    NOT NULL DEFAULT 0,
    sort_order   INT           UNSIGNED DEFAULT 0,
    created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_featured   (is_featured),
    INDEX idx_sort_order (sort_order)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // ── admin_users ───────────────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS admin_users (
    id            INT          UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email         VARCHAR(254) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    last_login    DATETIME,
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // ── page_views ────────────────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS page_views (
    id         BIGINT   UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    path       VARCHAR(500) NOT NULL,
    referrer   VARCHAR(500),
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_path       (path(100)),
    INDEX idx_created_at (created_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
]

async function migrate() {
  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST     || 'localhost',
    port:     Number(process.env.DB_PORT) || 3306,
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
  })

  try {
    // Create database if it doesn't exist
    await conn.execute(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'portfolio_db'}\` 
       DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    )
    await conn.execute(`USE \`${process.env.DB_NAME || 'portfolio_db'}\``)
    console.log(`\n📦 Using database: ${process.env.DB_NAME || 'portfolio_db'}`)

    for (const sql of SQL_STATEMENTS) {
      const tableName = sql.match(/CREATE TABLE IF NOT EXISTS (\w+)/)[1]
      await conn.execute(sql)
      console.log(`   ✅ Table ready: ${tableName}`)
    }

    console.log('\n🎉 Migration complete!\n')
  } catch (err) {
    console.error('❌ Migration failed:', err.message)
    process.exit(1)
  } finally {
    await conn.end()
  }
}

migrate()