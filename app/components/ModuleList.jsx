'use client'
import Link from 'next/link'
import { useState } from 'react'
import { phases } from '../../data/phases'
import { card, field, muted, accent, tag } from '../ui'

export default function ModuleList({ items }) {
  const [q, setQ] = useState('')
  const s = q.trim().toLowerCase()
  const match = m => !s || `${m.title} ${m.goal} ${m.tags.join(' ')}`.toLowerCase().includes(s)
  const groups = phases
    .map(p => ({ ...p, list: p.ids.map(id => items.find(m => m.id === id)).filter(m => m && match(m)) }))
    .filter(g => g.list.length)
  const total = groups.reduce((a, g) => a + g.list.length, 0)

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label htmlFor="q" className="font-medium">Cari modul</label>
        <input id="q" type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="ufw, nginx, cron, ssh…" className={`${field} max-w-sm flex-1`} />
        <span className={`text-sm ${muted}`} aria-live="polite">{total} dari {items.length}</span>
      </div>
      {groups.length ? groups.map(g => (
        <div key={g.name} className="grid gap-4 py-8 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-8">
          <div className="md:sticky md:top-24 md:self-start">
            <h3 className="font-semibold">{g.name}</h3>
            <p className={`mt-1 text-sm ${muted}`}>{g.note}</p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {g.list.map(m => (
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
        </div>
      )) : (
        <p className={`py-6 ${muted}`}>Tidak ada modul untuk “{q}”. Coba kata kunci seperti ufw atau nginx.</p>
      )}
    </>
  )
}
