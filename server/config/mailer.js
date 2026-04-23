'use strict'

const nodemailer = require('nodemailer')
const logger     = require('./logger')

// ─── Create transporter (lazy singleton) ─────────────────────────────────────
let transporter

function getTransporter() {
  if (transporter) return transporter

  transporter = nodemailer.createTransport({
    host:   process.env.MAIL_HOST || 'smtp.gmail.com',
    port:   Number(process.env.MAIL_PORT) || 587,
    secure: process.env.MAIL_SECURE === 'true',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  })

  return transporter
}

/**
 * Verify SMTP connection — call at startup to validate credentials.
 */
async function verifyMailer() {
  try {
    await getTransporter().verify()
    logger.info('✅ Mail transporter ready')
  } catch (err) {
    logger.warn(`⚠️  Mail transporter not ready: ${err.message}`)
  }
}

// ─── HTML Templates ───────────────────────────────────────────────────────────

/**
 * Email body sent to HARDIK when a visitor submits the contact form.
 */
function buildAdminEmailHTML({ name, email, subject, message }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Portfolio Contact</title>
  <style>
    body { margin:0; padding:0; background:#06060F; font-family:'Segoe UI',Arial,sans-serif; color:#F0EAD6; }
    .wrapper { max-width:600px; margin:40px auto; }
    .header  { background:linear-gradient(135deg,#8B0000,#C41E3A); padding:32px 40px; border-radius:8px 8px 0 0; }
    .header h1 { margin:0; font-size:1.4rem; color:#D4AF37; letter-spacing:2px; }
    .header p  { margin:6px 0 0; color:rgba(240,234,214,0.7); font-size:0.85rem; }
    .body    { background:#0F0F28; padding:32px 40px; border:1px solid rgba(212,175,55,0.2); border-top:none; }
    .field   { margin-bottom:20px; }
    .label   { font-size:0.72rem; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#D4AF37; margin-bottom:6px; }
    .value   { font-size:0.95rem; color:#F0EAD6; background:rgba(255,255,255,0.04); padding:12px 16px; border-left:3px solid #C41E3A; border-radius:0 4px 4px 0; white-space:pre-wrap; }
    .footer  { background:#08081A; padding:20px 40px; border:1px solid rgba(212,175,55,0.1); border-top:none; border-radius:0 0 8px 8px; text-align:center; }
    .footer p { margin:0; font-size:0.75rem; color:rgba(240,234,214,0.35); }
    .divider { height:1px; background:linear-gradient(to right,transparent,#D4AF37,transparent); margin:24px 0; opacity:0.3; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>◆ New Portfolio Message</h1>
      <p>Someone reached out via your contact form</p>
    </div>
    <div class="body">
      <div class="field"><div class="label">From</div><div class="value">${name}</div></div>
      <div class="field"><div class="label">Email</div><div class="value">${email}</div></div>
      <div class="field"><div class="label">Subject</div><div class="value">${subject}</div></div>
      <div class="divider"></div>
      <div class="field"><div class="label">Message</div><div class="value">${message}</div></div>
    </div>
    <div class="footer">
      <p>Hardik Patel Portfolio · hardik0626@gmail.com</p>
    </div>
  </div>
</body>
</html>`
}

/**
 * Auto-reply sent to the visitor confirming receipt.
 */
function buildAutoReplyHTML({ name }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Message Received</title>
  <style>
    body { margin:0; padding:0; background:#06060F; font-family:'Segoe UI',Arial,sans-serif; color:#F0EAD6; }
    .wrapper { max-width:600px; margin:40px auto; }
    .header  { background:linear-gradient(135deg,#003087,#C41E3A); padding:32px 40px; border-radius:8px 8px 0 0; text-align:center; }
    .header h1 { margin:0; font-size:1.3rem; color:#D4AF37; letter-spacing:2px; }
    .body    { background:#0F0F28; padding:32px 40px; border:1px solid rgba(212,175,55,0.2); border-top:none; }
    .body p  { color:rgba(240,234,214,0.8); line-height:1.8; font-size:0.95rem; }
    .highlight { color:#D4AF37; font-weight:700; }
    .cta     { display:inline-block; margin-top:20px; padding:12px 28px; background:linear-gradient(135deg,#8B0000,#C41E3A); color:#F0EAD6; text-decoration:none; border-radius:4px; font-weight:700; letter-spacing:1px; font-size:0.85rem; }
    .footer  { background:#08081A; padding:20px 40px; border:1px solid rgba(212,175,55,0.1); border-top:none; border-radius:0 0 8px 8px; text-align:center; }
    .footer p { margin:0; font-size:0.75rem; color:rgba(240,234,214,0.35); }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>◆ Message Received ◆</h1>
    </div>
    <div class="body">
      <p>Hi <span class="highlight">${name}</span>,</p>
      <p>Thank you for reaching out through my portfolio. I've received your message and will get back to you within <span class="highlight">24 hours</span>.</p>
      <p>In the meantime, feel free to explore my projects on GitHub or connect with me on LinkedIn.</p>
      <p>— <span class="highlight">Hardik Patel</span><br/>Full-Stack Developer & ML Engineer · KIIT University</p>
      <a href="https://github.com/hardik0626" class="cta">View GitHub →</a>
    </div>
    <div class="footer">
      <p>hardik0626@gmail.com · Bhubaneswar / Nepal</p>
    </div>
  </div>
</body>
</html>`
}

// ─── Public send functions ────────────────────────────────────────────────────

/**
 * Send notification to admin + auto-reply to visitor.
 */
async function sendContactEmails({ name, email, subject, message }) {
  const transport = getTransporter()

  // 1. Admin notification
  await transport.sendMail({
    from:    `"Portfolio Bot" <${process.env.MAIL_FROM}>`,
    to:      process.env.MAIL_TO,
    replyTo: email,
    subject: `[Portfolio] New message: ${subject}`,
    html:    buildAdminEmailHTML({ name, email, subject, message }),
  })

  // 2. Auto-reply to visitor
  await transport.sendMail({
    from:    `"Hardik Patel" <${process.env.MAIL_FROM}>`,
    to:      email,
    subject: `Got your message, ${name}! — Hardik Patel`,
    html:    buildAutoReplyHTML({ name }),
  })

  logger.info(`📧 Contact emails sent — from: ${email} subject: ${subject}`)
}

module.exports = { verifyMailer, sendContactEmails }