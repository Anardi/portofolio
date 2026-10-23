'use client'
import { useEffect, useRef, useState } from 'react'

export default function StepNav({ titles }) {
  const [active, setActive] = useState(0)
  const bar = useRef(null)

  useEffect(() => {
    const els = titles.map((_, i) => document.getElementById(`step-${i}`))
    function onScroll() {
      const h = document.documentElement
      const p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)
      if (bar.current) bar.current.style.width = `${p * 100}%`
      let a = 0
      els.forEach((el, i) => { if (el && el.getBoundingClientRect().top < 140) a = i })
      setActive(a)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [titles])

  return (
    <>
      <div ref={bar} aria-hidden="true" className="fixed left-0 top-0 z-50 h-[3px] w-0 bg-[#00D68F] shadow-[0_0_10px_#00D68F]" />
      <nav aria-label="Langkah dalam modul" className="sticky top-24 hidden max-h-[calc(100vh-7rem)] self-start overflow-auto text-sm lg:block">
        <ol className="border-l-2 border-slate-200 dark:border-white/10">
          {titles.map((t, i) => (
            <li key={i}>
              <a href={`#step-${i}`} aria-current={i === active ? 'step' : undefined}
                className="-ml-0.5 block border-l-2 border-transparent py-1.5 pl-3 text-slate-500 transition hover:text-slate-900 aria-[current=step]:border-[#00D68F] aria-[current=step]:font-medium aria-[current=step]:text-slate-900 dark:text-slate-400 dark:hover:text-white dark:aria-[current=step]:text-white">{t}</a>
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
