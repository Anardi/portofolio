'use client'
import { useState } from 'react'
import { glass, neu, muted } from '../ui'

export default function Testimonials({ items }) {
  const [i, setI] = useState(0)
  const t = items[i]
  const go = d => setI((i + d + items.length) % items.length)
  const initials = t.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  const ctl = 'grid h-9 w-9 place-items-center rounded-full border border-slate-300 transition hover:border-[#00D68F] hover:text-[#00D68F] active:scale-90 dark:border-white/20'

  return (
    <figure className={`flex h-full flex-col justify-between gap-6 p-6 ${glass} ${neu}`}>
      <div key={i} className="swap" aria-live="polite">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-[#00D68F] font-semibold text-[#011d14]" aria-hidden="true">{initials}</span>
          <figcaption><b className="block">{t.name}</b><span className={`text-sm ${muted}`}>{t.role}</span></figcaption>
        </div>
        <blockquote className={`mt-5 leading-relaxed ${muted}`}>“{t.text}”</blockquote>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5" aria-hidden="true">
          {items.map((_, k) => <span key={k} className={`h-1.5 rounded-full transition-all ${k === i ? 'w-6 bg-[#00D68F]' : 'w-1.5 bg-slate-300 dark:bg-white/20'}`} />)}
        </div>
        <div className="flex gap-2">
          <button type="button" className={ctl} onClick={() => go(-1)} aria-label="Rekomendasi sebelumnya">‹</button>
          <button type="button" className={ctl} onClick={() => go(1)} aria-label="Rekomendasi berikutnya">›</button>
        </div>
      </div>
    </figure>
  )
}
