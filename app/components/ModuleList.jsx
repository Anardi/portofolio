'use client'
import Link from 'next/link'
import { useState } from 'react'
import { phases } from '../../data/phases'

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
      <div className="search">
        <label htmlFor="q">Cari modul</label>
        <input id="q" type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="ufw, nginx, cron, ssh…" />
        <span aria-live="polite">{total} dari {items.length}</span>
      </div>
      {groups.length ? groups.map(g => (
        <div className="phase" key={g.name}>
          <div className="phase-h">
            <h3>{g.name}</h3>
            <p>{g.note}</p>
          </div>
          <ul className="tiles">
            {g.list.map(m => (
              <li key={m.id}>
                <Link href={`/modul/${m.id}`} className="tile">
                  <span className="tile-top">
                    <span className="n">{String(m.n).padStart(2, '0')}</span>
                    <span className="c">{m.c} langkah</span>
                  </span>
                  <span className="tt">{m.title}</span>
                  <span className="g">{m.goal}</span>
                  <span className="ft">{m.tags.slice(0, 3).map(t => <span key={t}>{t}</span>)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )) : (
        <p className="empty">Tidak ada modul untuk “{q}”. Coba kata kunci seperti ufw atau nginx.</p>
      )}
    </>
  )
}
