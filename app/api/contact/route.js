import { profile } from '../../../data/lab'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const rateWindowMs = 10 * 60 * 1000
const maxRequestsPerWindow = 5
const globalForContact = globalThis
if (!globalForContact.__portfolioContactRateLimit) {
  globalForContact.__portfolioContactRateLimit = new Map()
}
const rateLimit = globalForContact.__portfolioContactRateLimit

function json(body, status = 200) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
  })
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char])
}

function cleanLine(value) {
  return value.replace(/[\r\n\u0000-\u001f\u007f]+/g, ' ').trim()
}

function validEmail(value) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isRateLimited(key, now) {
  for (const [ip, data] of rateLimit.entries()) {
    if (now - data.start > rateWindowMs) rateLimit.delete(ip)
  }
  const current = rateLimit.get(key)
  if (!current || now - current.start > rateWindowMs) {
    rateLimit.set(key, { start: now, count: 1 })
    return false
  }
  current.count += 1
  return current.count > maxRequestsPerWindow
}

export async function POST(request) {
  const ip = (request.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim().slice(0, 80)
  if (isRateLimited(ip, Date.now())) {
    return json({ ok: false, code: 'rate_limited' }, 429)
  }

  let payload
  try {
    payload = await request.json()
  } catch {
    return json({ ok: false, code: 'invalid_json' }, 400)
  }

  const name = typeof payload?.name === 'string' ? cleanLine(payload.name) : ''
  const email = typeof payload?.email === 'string' ? payload.email.trim() : ''
  const message = typeof payload?.message === 'string' ? payload.message.trim() : ''
  const honeypot = typeof payload?.website === 'string' ? payload.website : ''

  // Return a neutral success for automated form submissions caught by the honeypot.
  if (honeypot) return json({ ok: true })
  if (name.length < 2 || name.length > 80 || !validEmail(email) || message.length < 10 || message.length > 5000) {
    return json({ ok: false, code: 'invalid_fields' }, 400)
  }

  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.CONTACT_FROM_EMAIL
  const to = process.env.CONTACT_TO_EMAIL || profile.email
  if (!apiKey || !from || !to) {
    return json({ ok: false, code: 'email_service_not_configured' }, 503)
  }

  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, '<br>')
  const subjectName = name.replace(/[^\p{L}\p{N} ._'-]/gu, '').slice(0, 60) || 'Website visitor'
  const text = `Pesan baru dari website portofolio\n\nNama: ${name}\nEmail: ${email}\n\nPesan:\n${message}`
  const html = `<!doctype html><html><body style="font-family:Arial,sans-serif;line-height:1.6;color:#17211c"><h2>Pesan baru dari website portofolio</h2><p><strong>Nama:</strong> ${safeName}</p><p><strong>Email:</strong> ${safeEmail}</p><hr><p style="white-space:normal">${safeMessage}</p></body></html>`

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Portfolio contact: ${subjectName}`,
        text,
        html,
      }),
      signal: AbortSignal.timeout(12000),
    })

    if (!response.ok) {
      // Do not expose provider diagnostics or secrets to the browser.
      return json({ ok: false, code: 'email_provider_error' }, 502)
    }
    return json({ ok: true })
  } catch {
    return json({ ok: false, code: 'email_provider_unavailable' }, 502)
  }
}
