'use client'
import { useState } from 'react'

const endpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT

export default function ContactForm({ to }) {
  const [state, setState] = useState('idle')

  async function onSubmit(e) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
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
      if (res.ok) { e.currentTarget.reset(); setState('sent') } else setState('error')
    } catch { setState('error') }
  }

  const msg = {
    sent: ['ok', 'Pesan terkirim. Saya akan membalas lewat email yang Anda tulis.'],
    mailto: ['ok', 'Aplikasi email Anda akan terbuka dengan pesan yang sudah terisi. Kirim dari sana.'],
    error: ['err', `Pesan gagal terkirim. Coba lagi${to ? `, atau kirim langsung ke ${to}` : ''}.`],
    noconfig: ['err', 'Tujuan pesan belum diatur. Isi email di data/lab.js atau NEXT_PUBLIC_FORM_ENDPOINT.'],
  }[state]

  return (
    <form onSubmit={onSubmit} className="cform">
      <div className="field">
        <label htmlFor="name">Nama</label>
        <input id="name" name="name" required autoComplete="name" />
      </div>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="field">
        <label htmlFor="message">Pesan</label>
        <textarea id="message" name="message" rows={6} required />
      </div>
      <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <button type="submit" className="btn pri" disabled={state === 'sending'}>
        {state === 'sending' ? 'Mengirim…' : 'Kirim pesan'}
      </button>
      {msg && <p className={`status ${msg[0]}`} role="status">{msg[1]}</p>}
    </form>
  )
}
