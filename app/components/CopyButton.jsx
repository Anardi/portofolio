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
    <button type="button" className="copy" onClick={copy} aria-live="polite">
      {done ? 'Tersalin' : 'Salin'}
    </button>
  )
}
