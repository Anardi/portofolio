'use client'
import { useEffect, useRef } from 'react'

// Tiga lapisan fixed di belakang seluruh konten: grid, grid yang menyala di dekat kursor, dan glow.
export default function CursorFX() {
  const root = useRef(null)

  useEffect(() => {
    const el = root.current
    let raf = 0
    let x = window.innerWidth * 0.7
    let y = 220
    const apply = () => {
      raf = 0
      el.style.setProperty('--cx', `${x}px`)
      el.style.setProperty('--cy', `${y}px`)
    }
    const move = e => { x = e.clientX; y = e.clientY; if (!raf) raf = requestAnimationFrame(apply) }
    apply()
    window.addEventListener('pointermove', move, { passive: true })
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(raf) }
  }, [])

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <div className="grid-bg absolute inset-0" />
      <div className="grid-hot absolute inset-0" />
      <div className="cursor-glow absolute inset-0" />
    </div>
  )
}
