'use client'

import { useState } from 'react'
import { btnPri, field } from '../ui'

export default function ContactForm({ to }) {
  const [state, setState] = useState('idle')

  async function onSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const payload = {
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      message: String(formData.get('message') || '').trim(),
      website: String(formData.get('website') || ''),
    }

    setState('sending')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await response.json().catch(() => ({}))

      if (response.ok && result.ok) {
        form.reset()
        setState('sent')
      } else if (response.status === 503 || result.code === 'email_service_not_configured') {
        setState('notConfigured')
      } else if (response.status === 429) {
        setState('rateLimited')
      } else {
        setState('error')
      }
    } catch {
      setState('error')
    }
  }

  const messages = {
    sent: { tone: 'ok', text: 'Pesan berhasil diterima oleh layanan email dan dikirim untuk diproses. Terima kasih sudah menghubungi saya.' },
    notConfigured: { tone: 'warn', text: 'Pengiriman email belum diaktifkan. Admin perlu mengisi RESEND_API_KEY dan CONTACT_FROM_EMAIL pada environment Vercel.' },
    rateLimited: { tone: 'warn', text: 'Terlalu banyak percobaan dari jaringan ini. Silakan coba kembali beberapa menit lagi.' },
    error: { tone: 'error', text: 'Pesan belum berhasil dikirim. Periksa koneksi Anda atau kirim langsung melalui email.' },
  }
  const message = messages[state]
  const noticeStyle = message?.tone === 'ok'
    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200'
    : message?.tone === 'warn'
      ? 'border-amber-500 bg-amber-500/10 text-amber-800 dark:text-amber-200'
      : 'border-red-500 bg-red-500/10 text-red-800 dark:text-red-200'
  const lbl = 'mb-1.5 block text-sm font-medium'

  return (
    <form onSubmit={onSubmit} className="relative space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-[6px_6px_18px_#dfe5ec,-6px_-6px_18px_#ffffff] backdrop-blur-md dark:border-white/10 dark:bg-[#0B120F]/80 dark:shadow-[6px_6px_18px_rgba(0,0,0,.4)]">
      <div>
        <label htmlFor="name" className={lbl}>Nama</label>
        <input id="name" name="name" required minLength={2} maxLength={80} autoComplete="name" className={field} placeholder="Nama Anda" />
      </div>
      <div>
        <label htmlFor="email" className={lbl}>Email</label>
        <input id="email" name="email" type="email" required maxLength={254} autoComplete="email" className={field} placeholder="nama@contoh.com" />
      </div>
      <div>
        <label htmlFor="message" className={lbl}>Pesan</label>
        <textarea id="message" name="message" rows={6} required minLength={10} maxLength={5000} className={`${field} resize-y`} placeholder="Ceritakan hal yang ingin Anda diskusikan…" />
        <p className="mt-1 text-xs text-slate-500">Maksimal 5.000 karakter.</p>
      </div>
      {/* Honeypot: hidden from normal visitors and checked again by the API route. */}
      <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="website">Biarkan kolom ini kosong</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <button type="submit" className={btnPri} disabled={state === 'sending'}>
        {state === 'sending' ? 'Mengirim pesan…' : state === 'sent' ? 'Kirim pesan lain' : 'Kirim pesan'}
      </button>
      {message && (
        <div role="status" aria-live="polite" className={`rounded-r-lg border-l-4 px-3 py-3 text-sm ${noticeStyle}`}>
          <p>{message.text}</p>
          {(state === 'notConfigured' || state === 'error') && to && (
            <p className="mt-2">Alternatif: <a className="font-semibold underline underline-offset-2" href={`mailto:${to}`}>kirim langsung ke {to}</a>.</p>
          )}
        </div>
      )}
    </form>
  )
}
