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
    <div className="term" role="img" aria-label="Contoh sesi terminal: nginx gagal karena konfigurasi salah, lalu diperbaiki">
      <div className="term-bar"><i /><i /><i /><span className="term-title">ubuntu-lab · 2 CPU · 2 GB RAM · 20 GB</span><span className="live">running</span></div>
      <pre aria-hidden="true">
        {done.map((s, i) => (
          <span key={i}><span className="p">{P}</span>{s.cmd}{'\n'}{s.out ? s.out + '\n' : ''}</span>
        ))}
        <span className="p">{P}</span>{cur}<span className="cur" />
      </pre>
    </div>
  )
}
