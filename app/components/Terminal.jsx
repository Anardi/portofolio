'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const PROMPT = 'student@ubuntu-lab:~$'
const QUICK_COMMANDS = ['help', 'whoami', 'ip a', 'systemctl status nginx']

export default function Terminal({ modules = [], profile, skills = [], resume }) {
  const [lines, setLines] = useState([
    { cmd: 'system.boot()', out: 'initializing Ubuntu Lab ...' },
    { out: 'environment: browser-based simulator' },
    { out: 'virtual services: nginx, ssh, ufw · mock output' },
    { cmd: 'help', out: 'Type help to list the commands available in this preview.' },
  ])
  const [value, setValue] = useState('')
  const [active, setActive] = useState('ready')
  const outputRef = useRef(null)

  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight
  }, [lines])

  function response(command) {
    const c = command.trim().toLowerCase()
    if (c === 'help') return 'help · whoami · module · skills · contact · status · ip a · systemctl status nginx · clear'
    if (c === 'whoami') return `${profile.name} — ${profile.role}`
    if (c === 'module') return `${modules.length} Linux lab modules available. Open Bash Ubuntu to practice with a simulated filesystem.`
    if (c === 'skills') return skills.slice(0, 8).join(' · ')
    if (c === 'contact') return profile.email || 'Contact details can be added in data/lab.js.'
    if (c === 'status' || c === 'systemctl status nginx') return 'nginx.service: active (simulated)\nssh.service: active (simulated)\nEnvironment: client-side mock'
    if (c === 'ip a' || c === 'ip addr') return 'enp0s3: UP\ninet 192.168.56.101/24\n(loopback and address are simulated)'
    if (c === 'pwd') return '/home/student'
    if (c === 'ls' || c === 'ls -la') return 'README.md  lab-notes.txt  shared/  (virtual files)'
    if (c === 'clear') return '__CLEAR__'
    if (c === 'resume') return `Resume path: ${resume}`
    if (c.startsWith('sudo')) return 'Privilege commands are mocked. Use the full Bash Ubuntu lab for supported practice.'
    return `bash: ${command}: command not found in preview. Type help.`
  }

  function run(raw) {
    const command = String(raw || '').trim()
    if (!command) return
    if (command.toLowerCase() === 'clear') { setLines([]); setActive('ready'); return }
    setActive('busy')
    const out = response(command)
    setLines(current => [...current, { cmd: command, out }])
    setActive('ready')
  }

  function submit(event) {
    event.preventDefault()
    run(value)
    setValue('')
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#00D68F]/20 bg-[#050807] shadow-[0_0_64px_-28px_rgba(0,214,143,.42)]">
      <div className="flex items-center gap-1.5 border-b border-white/10 bg-[#101512] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]"/><span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]"/><span className="h-2.5 w-2.5 rounded-full bg-[#28c840]"/>
        <span className="ml-3 min-w-0 flex-1 truncate text-center font-mono text-[10px] text-slate-500">student@ubuntu-lab: ~</span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-[#6bf2be]"><span className={`h-1.5 w-1.5 rounded-full ${active === 'busy' ? 'bg-amber-300' : 'bg-[#00D68F]'}`} />mock</span>
      </div>
      <div ref={outputRef} role="log" aria-live="polite" className="h-[255px] overflow-y-auto px-4 py-4 font-mono text-[11px] leading-[1.9] text-slate-200 sm:h-[310px] sm:px-5 sm:py-5 sm:text-xs">
        {lines.map((line, i) => (
          <div key={`${i}-${line.cmd || 'out'}`} className="mb-1.5 break-words">
            {line.cmd && <p><span className="text-[#00D68F]">{PROMPT} </span><span className="text-slate-100">{line.cmd}</span></p>}
            <p className="whitespace-pre-wrap text-[#91a59b]">{line.out}</p>
          </div>
        ))}
        <form onSubmit={submit} className="mt-3 flex min-w-0 items-center gap-2">
          <label htmlFor="hero-terminal-input" className="shrink-0 text-[#00D68F]">{PROMPT}</label>
          <input id="hero-terminal-input" value={value} onChange={event => setValue(event.target.value)} autoComplete="off" spellCheck={false} placeholder="type help..." className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-slate-600" />
        </form>
      </div>
      <div className="flex flex-wrap items-center gap-2 border-t border-white/10 bg-white/[.02] px-3 py-3">
        {QUICK_COMMANDS.map(command => <button key={command} type="button" onClick={() => run(command)} className="rounded border border-white/10 px-2 py-1 font-mono text-[9px] text-slate-400 transition hover:border-[#00D68F]/40 hover:text-[#6bf2be] sm:text-[10px]">{command}</button>)}
        <Link href="/terminal" className="ml-auto inline-flex items-center gap-1.5 px-1 py-1 font-mono text-[10px] text-[#6bf2be] transition hover:text-white">full terminal <span aria-hidden="true">↗</span></Link>
      </div>
    </div>
  )
}
