'use client'
import { useState } from 'react'
import { btnPri, field } from '../ui'

const endpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT

export default function ContactForm({ to }) {
  const [state, setState] = useState('idle')

  async function onSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget
    const f = new FormData(form)
    if (f.get('website')) return // honeypot untuk bot
    const data = { name: f.get('name'), email: f.get('email'), message: f.get('message') }

    if (!endpoint) {
      if (!to) { setState('noconfig'); return }
      const subject = encodeURIComponent(`Pesan dari ${data.name}`)
      const body = encodeURIComponent(`${data.message}\n\n${data.name}\n${data.email}`)
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`
      setState('mailto')
      return
    }
    setState('sending')
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) { form.reset(); setState('sent') } else setState('error')
    } catch { setState('error') }
  }

  const msg = {
    sent: ['ok', 'Pesan terkirim. Saya akan membalas lewat email yang Anda tulis.'],
    mailto: ['ok', 'Aplikasi email Anda akan terbuka dengan pesan yang sudah terisi. Kirim dari sana.'],
    error: ['err', `Pesan gagal terkirim. Coba lagi${to ? `, atau kirim langsung ke ${to}` : ''}.`],
    noconfig: ['err', 'Tujuan pesan belum diatur. Isi email di data/lab.js atau NEXT_PUBLIC_FORM_ENDPOINT.'],
  }[state]

  const lbl = 'mb-1.5 block text-sm font-medium'
  return (
    <form onSubmit={onSubmit} className="relative space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-[6px_6px_18px_#dfe5ec,-6px_-6px_18px_#ffffff] backdrop-blur-md dark:border-white/10 dark:bg-[#0B120F]/80 dark:shadow-[6px_6px_18px_rgba(0,0,0,.4)]">
      <div><label htmlFor="name" className={lbl}>Nama</label><input id="name" name="name" required autoComplete="name" className={field} /></div>
      <div><label htmlFor="email" className={lbl}>Email</label><input id="email" name="email" type="email" required autoComplete="email" className={field} /></div>
      <div><label htmlFor="message" className={lbl}>Pesan</label><textarea id="message" name="message" rows={6} required className={`${field} resize-y`} /></div>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-px w-px" />
      <button type="submit" className={btnPri} disabled={state === 'sending'}>{state === 'sending' ? 'Mengirim…' : 'Kirim pesan'}</button>
      {msg && (
        <p role="status" className={`rounded-r-lg border-l-4 px-3 py-2 text-sm ${msg[0] === 'ok' ? 'border-emerald-500 bg-emerald-500/10' : 'border-red-500 bg-red-500/10'}`}>{msg[1]}</p>
      )}
    </form>
  )
}
