'use client'
import Link from 'next/link'
import { useState } from 'react'
import { card, field, muted, accent, tag } from '../ui'

export default function ModuleLab({ items, filters }) {
  const [q, setQ] = useState('')
  const [on, setOn] = useState('Semua')
  const s = q.trim().toLowerCase()
  const shown = items.filter(m => (on === 'Semua' || m.match.includes(on)) && (!s || `${m.title} ${m.goal} ${m.tags.join(' ')}`.toLowerCase().includes(s)))
  const chips = ['Semua', ...filters.map(f => f.label)]

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <label htmlFor="q" className="sr-only">Cari modul</label>
        <input id="q" type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Cari modul: ufw, cron, ssh…" className={`${field} max-w-xs flex-1`} />
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter tag">
          {chips.map(c => (
            <button key={c} type="button" aria-pressed={c === on} onClick={() => setOn(c)}
              className="rounded-lg border border-slate-300 px-3 py-1.5 font-mono text-xs font-medium transition hover:border-[#00D68F] active:scale-95 aria-pressed:border-transparent aria-pressed:bg-slate-900 aria-pressed:text-white aria-pressed:shadow-[0_0_18px_-4px_rgba(0,214,143,.8)] dark:border-white/15 dark:aria-pressed:bg-[#00D68F] dark:aria-pressed:text-[#011d14]">{c}</button>
          ))}
        </div>
        <span className={`text-sm ${muted}`} aria-live="polite">{shown.length} dari {items.length}</span>
      </div>
      {shown.length ? (
        <ul key={`${on}${s}`} className="swap grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map(m => (
            <li key={m.id}>
              <Link href={`/modul/${m.id}`} className={`group flex h-full flex-col p-5 ${card}`}>
                <span className="flex justify-between font-mono text-xs">
                  <span className={`font-medium ${accent}`}>{String(m.n).padStart(2, '0')}</span>
                  <span className={muted}>{m.c} langkah</span>
                </span>
                <span className="mt-3 font-semibold leading-snug transition-colors group-hover:text-[#00D68F]">{m.title}</span>
                <span className={`mt-1 line-clamp-3 text-sm ${muted}`}>{m.goal}</span>
                <span className="mt-auto flex flex-wrap gap-1.5 pt-4">{m.tags.slice(0, 3).map(t => <span key={t} className={tag}>{t}</span>)}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : <p className={`py-6 ${muted}`}>Tidak ada modul yang cocok. Coba tag lain atau hapus kata kunci.</p>}
    </>
  )
}
