'use client'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

export default function ThemeToggle({ className = '', full = false }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const dark = mounted && resolvedTheme === 'dark'
  const label = !mounted ? 'Ganti tema' : dark ? 'Mode Terang' : 'Mode Gelap'

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      aria-label={label}
      title={label}
      className={`group inline-flex items-center gap-2 rounded-xl border border-slate-300/80 bg-white/60 px-3 py-2 text-sm font-medium text-slate-700 backdrop-blur transition duration-200 hover:border-ubuntu hover:text-ubuntu-deep active:scale-95 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:border-ubuntu dark:hover:text-ubuntu ${full ? 'w-full justify-between py-3' : ''} ${className}`}
    >
      <span>{label}</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform duration-500 group-hover:rotate-[24deg]">
        {dark ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        ) : (
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        )}
      </svg>
    </button>
  )
}
