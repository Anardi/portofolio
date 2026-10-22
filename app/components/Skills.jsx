'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Skills({ groups }) {
  const [active, setActive] = useState('semua')
  const all = groups.flatMap(g => g.items)
  const tabs = [{ key: 'semua', name: 'Semua', items: all }, ...groups.map(g => ({ key: g.name, name: g.name, items: g.items }))]
  const cur = tabs.find(t => t.key === active) || tabs[0]

  return (
    <>
      <div className="tabs" role="group" aria-label="Kelompok keterampilan">
        {tabs.map(t => (
          <button key={t.key} type="button" className="tab" aria-pressed={t.key === active} onClick={() => setActive(t.key)}>
            {t.name}<span>{t.items.length}</span>
          </button>
        ))}
      </div>
      <ul className="skill-grid" key={cur.key}>
        {cur.items.map(k => (
          <li key={k.s}>
            <Link href={`/modul/${k.id}`} className="skill">
              <span className="sn">{k.s}</span>
              <span className="sm">Modul {String(k.n).padStart(2, '0')} · {k.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
