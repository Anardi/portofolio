'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { wrap } from '../ui'
import { resume } from '../../data/portfolio'

function ThemeButton() {
  const { resolvedTheme, setTheme } = useTheme()
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  const dark = resolvedTheme !== 'light'
  return (
    <button type="button" onClick={() => setTheme(dark ? 'light' : 'dark')}
      aria-label={dark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
      className="grid h-9 w-9 place-items-center rounded-lg border border-white/15 text-slate-300 transition hover:border-[#00D68F]/60 hover:text-[#6bf2be] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00D68F]">
      {ready && (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {dark
            ? <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>
            : <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />}
        </svg>
      )}
    </button>
  )
}

export default function Header() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKey = event => { if (event.key === 'Escape') setOpen(false) }
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false) }
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
      document.body.style.overflow = ''
    }
  }, [open])

  const link = 'font-mono text-[10px] uppercase tracking-[.16em] text-slate-400 transition hover:text-[#6bf2be] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00D68F]'
  const close = () => setOpen(false)

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050807]/90 text-slate-100 shadow-[0_4px_24px_rgba(0,0,0,.18)] backdrop-blur-xl">
        <div className={`${wrap} flex h-14 items-center justify-between gap-4`}>
          <Link href="/" onClick={close} className="shrink-0 font-mono text-sm font-semibold tracking-tight text-white" aria-label="Linux Lab, beranda">
            <span className="text-[#00D68F]">root@</span>linux-lab<span className="ml-1 text-[#00D68F]">.</span>
          </Link>
          <nav className="hidden items-center gap-7 md:flex" aria-label="Navigasi utama">
            <Link href="/#tentang" className={link}>01 About</Link>
            <Link href="/blog" className={link}>02 Blog</Link>
            <Link href="/#modul" className={link}>03 Modul</Link>
            <Link href="/#kontak" className={link}>04 Contact</Link>
            <Link href="/terminal" className="inline-flex h-9 items-center gap-2 rounded-md border border-[#00D68F]/50 px-3.5 font-mono text-[10px] text-[#6bf2be] transition hover:bg-[#00D68F]/10 hover:shadow-[0_0_22px_-8px_rgba(0,214,143,.8)]">
              <span className="text-[#00D68F]">$</span> Bash Ubuntu ↗
            </Link>
            <ThemeButton />
          </nav>
          <button type="button" onClick={() => setOpen(true)} aria-label="Buka menu" aria-expanded={open} aria-controls="site-menu"
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/15 text-slate-300 transition hover:border-[#00D68F]/50 hover:text-[#6bf2be] md:hidden">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
        </div>
      </header>

      <div className="md:hidden" aria-hidden={!open} style={{ position: 'fixed', inset: 0, zIndex: 60, visibility: open ? 'visible' : 'hidden', transition: `visibility 0s linear ${open ? '0s' : '.25s'}` }}>
        <button type="button" onClick={close} aria-label="Tutup menu" tabIndex={open ? 0 : -1}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0, background: 'rgba(0,0,0,.72)', opacity: open ? 1 : 0, transition: 'opacity .25s' }} />
        <aside id="site-menu" role="dialog" aria-modal="true" aria-label="Menu navigasi"
          className="flex flex-col gap-6 border-l border-white/10 bg-[#080c0a] p-6 shadow-2xl"
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 'min(21rem, 88vw)', transform: open ? 'none' : 'translateX(100%)', transition: 'transform .25s ease' }}>
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <span className="font-mono text-sm"><span className="text-[#00D68F]">root@</span>menu</span>
            <button type="button" onClick={close} aria-label="Tutup menu" className="grid h-9 w-9 place-items-center rounded-lg border border-white/15 text-slate-300">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
            </button>
          </div>
          <nav className="flex flex-col gap-6" aria-label="Menu seluler">
            <Link href="/#tentang" onClick={close} className={link}>01 About</Link>
            <Link href="/blog" onClick={close} className={link}>02 Blog</Link>
            <Link href="/#modul" onClick={close} className={link}>03 Modul</Link>
            <Link href="/#kontak" onClick={close} className={link}>04 Contact</Link>
            <Link href="/terminal" onClick={close} className="inline-flex w-fit items-center gap-2 rounded-md border border-[#00D68F]/50 px-3.5 py-2.5 font-mono text-xs text-[#6bf2be]">$ Bash Ubuntu ↗</Link>
            <a href={resume} download="Bagas_Anardi_Surya_Wijaya_CV.pdf" onClick={close} className={link}>Download CV PDF ↓</a>
          </nav>
          <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-5"><span className="font-mono text-xs text-slate-400">Theme preference</span><ThemeButton /></div>
        </aside>
      </div>
    </>
  )
}
