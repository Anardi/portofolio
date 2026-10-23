'use client'
import { useEffect, useState } from 'react'

const P = 'budi@ubuntu-lab:~$ '
const SCRIPT = [
  { cmd: 'systemctl is-active nginx', out: 'failed' },
  { cmd: 'sudo nginx -t', out: 'nginx: [emerg] unknown directive "baris_salah"\n  in /etc/nginx/conf.d/rusak.conf:1' },
  { cmd: 'sudo rm /etc/nginx/conf.d/rusak.conf', out: '' },
  { cmd: 'sudo systemctl restart nginx', out: '' },
  { cmd: 'curl -I http://localhost', out: 'HTTP/1.1 200 OK' },
]

export default function Typing() {
  const [done, setDone] = useState([])
  const [cur, setCur] = useState('')

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setDone(SCRIPT); return }
    let alive = true, t
    const wait = ms => new Promise(r => { t = setTimeout(r, ms) })
    ;(async () => {
      while (alive) {
        setDone([]); setCur('')
        for (const s of SCRIPT) {
          for (let i = 1; i <= s.cmd.length; i++) { if (!alive) return; setCur(s.cmd.slice(0, i)); await wait(32) }
          await wait(350); if (!alive) return
          setDone(d => [...d, s]); setCur(''); await wait(700)
        }
        await wait(3500)
      }
    })()
    return () => { alive = false; clearTimeout(t) }
  }, [])

  return (
    <div role="img" aria-label="Contoh sesi terminal: nginx gagal karena konfigurasi salah, lalu diperbaiki" style={{ '--d': '350ms' }}
      className="rise overflow-hidden rounded-xl border border-[#00D68F]/30 bg-[#07100c]/90 shadow-[0_0_60px_-15px_rgba(0,214,143,.55)] backdrop-blur">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2.5">
        <i className="h-2.5 w-2.5 rounded-full bg-[#00D68F]" /><i className="h-2.5 w-2.5 rounded-full bg-white/20" /><i className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="ml-2 min-w-0 flex-1 truncate font-mono text-xs text-slate-400">ubuntu-lab · 2 CPU · 2 GB RAM · 20 GB</span>
        <span className="flex items-center gap-1.5 font-mono text-xs text-emerald-400"><span className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />running</span>
      </div>
      <pre aria-hidden="true" className="min-h-[15.5rem] overflow-x-auto whitespace-pre-wrap p-4 font-mono text-[13px] leading-relaxed text-slate-100">
        {done.map((s, i) => (
          <span key={i}><span className="text-[#6bf2be]">{P}</span>{s.cmd}{'\n'}{s.out ? s.out + '\n' : ''}</span>
        ))}
        <span className="text-[#6bf2be]">{P}</span>{cur}<span className="blink inline-block h-4 w-2 bg-[#6bf2be] align-[-3px]" />
      </pre>
    </div>
  )
}
