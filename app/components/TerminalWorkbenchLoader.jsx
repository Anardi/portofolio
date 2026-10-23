'use client'

import dynamic from 'next/dynamic'

const TerminalWorkbench = dynamic(() => import('./TerminalWorkbench'), {
  ssr: false,
  loading: () => (
    <main className="mx-auto min-h-[70vh] w-full max-w-7xl px-5 py-12 sm:px-8">
      <div className="animate-pulse rounded-2xl border border-white/10 bg-[#080c0a] p-6 font-mono text-sm text-slate-500">Loading Bash Ubuntu simulator…</div>
    </main>
  ),
})

export default function TerminalWorkbenchLoader({ initialModuleId }) {
  return <TerminalWorkbench initialModuleId={initialModuleId} />
}
