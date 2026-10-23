'use client'
import Link from 'next/link'
import { useState } from 'react'
import { card, muted } from '../ui'

export default function Skills({ groups }) {
  const [active, setActive] = useState('semua')
  const all = groups.flatMap(g => g.items)
  const tabs = [{ key: 'semua', name: 'Semua', items: all }, ...groups.map(g => ({ key: g.name, name: g.name, items: g.items }))]
  const cur = tabs.find(t => t.key === active) || tabs[0]

  return (
    <>
      <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Kelompok keterampilan">
        {tabs.map(t => (
          <button key={t.key} type="button" aria-pressed={t.key === active} onClick={() => setActive(t.key)}
            className="rounded-lg border border-slate-300 px-3.5 py-1.5 text-sm font-medium transition hover:border-[#00D68F] active:scale-95 aria-pressed:border-transparent aria-pressed:bg-slate-900 aria-pressed:text-white aria-pressed:shadow-[0_0_18px_-4px_rgba(0,214,143,.8)] dark:border-white/15 dark:aria-pressed:bg-[#00D68F] dark:aria-pressed:text-[#011d14]">
            {t.name}<span className="ml-2 font-mono text-xs opacity-70">{t.items.length}</span>
          </button>
        ))}
      </div>
      <ul key={cur.key} className="swap grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cur.items.map(k => (
          <li key={k.s}>
            <Link href={`/modul/${k.id}`} className={`block h-full px-4 py-3 ${card}`}>
              <span className="block font-semibold">{k.s}</span>
              <span className={`block truncate text-xs ${muted}`}>Modul {String(k.n).padStart(2, '0')} · {k.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
