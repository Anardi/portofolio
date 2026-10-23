'use client'

export default function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="no-print inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/15 px-4 font-mono text-xs text-slate-200 transition hover:border-[#00D68F]/50 hover:text-[#6bf2be] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00D68F]">
      Print / Save PDF
    </button>
  )
}
