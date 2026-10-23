'use client'
import { useState } from 'react'

export default function CopyButton({ text }) {
  const [done, setDone] = useState(false)
  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setDone(true)
      setTimeout(() => setDone(false), 1500)
    } catch {}
  }
  return (
    <button type="button" onClick={copy} aria-live="polite"
      className="rounded-md bg-white/10 px-2.5 py-1 text-xs text-white transition hover:bg-[#00D68F] hover:text-[#011d14] active:scale-95">
      {done ? 'Tersalin' : 'Salin'}
    </button>
  )
}
