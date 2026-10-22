'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Header() {
  const [dark, setDark] = useState(false)
  useEffect(() => { setDark(document.documentElement.dataset.theme === 'dark') }, [])

  function toggle() {
    const next = dark ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try { localStorage.setItem('theme', next) } catch {}
    setDark(!dark)
  }

  return (
    <header className="top">
      <div className="wrap top-in">
        <Link href="/" className="brand"><span className="pr">~$</span>linux-lab</Link>
        <nav className="top-nav" aria-label="Navigasi utama">
          <Link href="/#modul">Modul</Link>
          <Link href="/modul/capstone">Capstone</Link>
          <button type="button" className="theme" onClick={toggle} aria-pressed={dark}>
            {dark ? 'Mode terang' : 'Mode gelap'}
          </button>
        </nav>
      </div>
    </header>
  )
}
