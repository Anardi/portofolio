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
      <div className="bar" ref={bar} aria-hidden="true" />
      <nav className="side" aria-label="Langkah dalam modul">
        <ol>
          {titles.map((t, i) => (
            <li key={i}><a href={`#step-${i}`} aria-current={i === active ? 'step' : undefined}>{t}</a></li>
          ))}
        </ol>
      </nav>
    </>
  )
}
