// Kumpulan kelas Tailwind yang dipakai berulang. Semua memakai varian dark:.
export const wrap = 'mx-auto w-full max-w-6xl px-5'
export const muted = 'text-slate-600 dark:text-slate-400'
export const accent = 'text-[#008e62] dark:text-[#6bf2be]'
export const glass = 'rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-[#0B120F]/80'
export const neu = 'shadow-[6px_6px_18px_#dfe5ec,-6px_-6px_18px_#ffffff] dark:shadow-[6px_6px_18px_rgba(0,0,0,.4),-3px_-3px_12px_rgba(255,255,255,.03)]'
export const glow = 'transition duration-300 hover:border-[#00D68F] hover:shadow-[0_0_28px_-6px_rgba(0,214,143,.6)] motion-safe:hover:-translate-y-0.5 dark:hover:shadow-[0_0_28px_-6px_rgba(0,214,143,.7)]'
export const card = `${glass} ${neu} ${glow}`
export const btnPri = 'inline-flex items-center justify-center rounded-lg bg-[#00D68F] px-4 py-2.5 font-medium text-[#011d14] shadow-[0_0_20px_-4px_rgba(0,214,143,.7)] transition hover:bg-[#6bf2be] hover:shadow-[0_0_28px_-2px_rgba(0,214,143,.9)] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00D68F] disabled:opacity-60'
export const btnSec = 'inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2.5 font-medium text-slate-800 backdrop-blur transition hover:border-[#00D68F] hover:text-[#008e62] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00D68F] dark:border-white/20 dark:text-slate-100 dark:hover:text-[#6bf2be]'
export const tag = 'rounded-md border border-slate-200 bg-white/60 px-2 py-0.5 font-mono text-xs text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300'
export const field = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-[#00D68F] focus:ring-2 focus:ring-[#00D68F]/40 dark:border-white/15 dark:bg-[#0B120F]/80 dark:text-slate-100'
export const heroBg = 'relative overflow-hidden bg-gradient-to-b from-emerald-100/60 to-transparent dark:from-[#071b13] dark:to-transparent'
export const panel = 'rounded-3xl border border-slate-200/80 bg-white/70 backdrop-blur-sm shadow-[8px_8px_24px_#dfe5ec,-8px_-8px_24px_#ffffff] dark:border-white/10 dark:bg-[#0B120F]/60 dark:shadow-[8px_8px_24px_rgba(0,0,0,.35),-4px_-4px_14px_rgba(255,255,255,.03)]'
