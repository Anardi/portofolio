import Link from 'next/link'
import { modules, profile, skills } from '../data/lab'
import { metrics, competencies, workflow, certs, testimonials, resume, filters } from '../data/portfolio'
import Terminal from './components/Terminal'
import Testimonials from './components/Testimonials'
import ModuleLab from './components/ModuleLab'
import { wrap, muted, accent, panel, glass, neu, card, btnPri, btnSec, tag } from './ui'

export default function Home() {
  const strip = u => u.replace(/^https?:\/\//, '')
  const contacts = [
    profile.github && ['GitHub', strip(profile.github), profile.github],
    profile.linkedin && ['LinkedIn', strip(profile.linkedin), profile.linkedin],
    profile.email && ['Email', profile.email, `mailto:${profile.email}`],
    profile.phone && ['Telepon', profile.phone, `tel:${profile.phone.replace(/[^\d+]/g, '')}`],
  ].filter(Boolean)
  const initials = profile.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  const allSkills = [...new Set(Object.values(skills).flat())]
  const items = modules.map((m, i) => {
    const hay = JSON.stringify(m).toLowerCase()
    return {
      id: m.id, n: i + 1, title: m.title, goal: m.goal, c: m.steps.length, tags: skills[m.id] || [],
      match: filters.filter(f => new RegExp(f.re, 'i').test(hay)).map(f => f.label),
    }
  })
  const modCount = `${modules.length}+`
  const d = ms => ({ '--d': `${ms}ms` })
  const h2 = 'text-2xl font-semibold tracking-tight md:text-3xl'

  return (
    <>
      {/* Hero inspired by the reference: terminal-first, black grid and green system accents. */}
      <section id="tentang" className="hero-grid-bg relative isolate overflow-hidden border-b border-white/10 bg-[#050807] text-slate-100">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_22%_42%,rgba(0,214,143,.12),transparent_42%),radial-gradient(ellipse_at_82%_45%,rgba(42,108,170,.09),transparent_34%)]" />
        <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-40 h-96 w-96 rounded-full bg-[#00D68F]/10 blur-[110px]" />
        <div className="relative mx-auto grid min-h-[min(760px,calc(100svh_-_3.5rem))] w-full max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 md:grid-cols-[1.05fr_.95fr] md:gap-10 lg:gap-16 lg:px-10">
          <div className="rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#00D68F]/30 bg-[#00D68F]/[.08] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[.18em] text-[#6bf2be]">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#00D68F]" /> Lab environment: ready
            </span>
            <p className="mt-7 font-mono text-xs uppercase tracking-[.2em] text-slate-400">IT Support / Linux System Administration</p>
            <h1 className="mt-4 max-w-3xl text-5xl font-bold leading-[.99] tracking-[-.055em] text-white sm:text-6xl lg:text-[4.4rem] xl:text-[5rem]">
              IT Infrastructure <span className="text-[#00D68F]">&amp; Linux SysAdmin</span><span className="ml-1 text-[#00D68F]">_</span>
            </h1>
            <p className="mt-6 max-w-xl font-mono text-lg leading-relaxed text-slate-300 sm:text-xl">Building reliable systems. Diagnosing what breaks.</p>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">Lab Ubuntu Server di VirtualBox untuk administrasi Linux, networking, hardening dasar, dan troubleshooting insiden. Dilengkapi langkah praktik, command, dan terminal simulasi di browser.</p>

            <div className="mt-6 flex flex-wrap gap-2.5 font-mono text-[10px] uppercase tracking-wider">
              <span className="border border-[#00D68F]/30 bg-[#00D68F]/[.05] px-3 py-2 text-[#6bf2be]">[ Linux Admin ]</span>
              <span className="border border-[#5CA6FF]/35 bg-[#5CA6FF]/[.05] px-3 py-2 text-[#80b8ff]">[ Networking ]</span>
              <span className="border border-[#B78BFF]/35 bg-[#B78BFF]/[.05] px-3 py-2 text-[#c9a7ff]">[ Security Ops ]</span>
            </div>

            <div className="mt-7 max-w-lg border-l border-[#00D68F]/70 pl-4 font-mono text-xs leading-5 text-slate-500">
              <span className="mr-2 text-[#00D68F]">&gt;</span>Practical labs for system checks, log analysis, access control, and incident recovery.
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-[#00D68F]/50 bg-[#00D68F]/10 px-5 font-mono text-xs text-[#6bf2be] shadow-[0_0_28px_-12px_rgba(0,214,143,.65)] transition hover:bg-[#00D68F]/15 hover:shadow-[0_0_30px_-8px_rgba(0,214,143,.45)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00D68F]" href="/#modul">Explore Modules <span aria-hidden="true">↘</span></Link>
              <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/15 px-5 font-mono text-xs text-slate-200 transition hover:border-white/35 hover:bg-white/[.04] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00D68F]" href="/terminal"><span className="text-[#00D68F]">$</span> Open Bash Ubuntu ↗</Link>
              <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-3 font-mono text-xs text-slate-500 transition hover:text-[#6bf2be]" href="/resume">view_resume.profile ↗</Link>
            </div>
          </div>

          <div className="rise min-w-0" style={d(180)}>
            <Terminal modules={modules.map(m => m.title)} profile={profile} skills={allSkills} resume={resume} />
            <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[.15em] text-slate-600">Browser preview · mock output · no live server connection</p>
          </div>
        </div>
      </section>

      <main className={`${wrap} space-y-8 pb-12 pt-8`}>
        {/* Metrics */}
        <section aria-label="Ringkasan" className={`grid gap-6 p-6 sm:grid-cols-3 ${panel}`}>
          {metrics.map((m, i) => (
            <div key={m.label} className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#00D68F]/15 font-mono text-sm font-semibold text-[#008e62] shadow-[0_0_20px_-6px_rgba(0,214,143,.7)] dark:text-[#6bf2be]">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <p className="text-2xl font-bold tracking-tight">{i === 0 ? modCount : m.value} <span className="text-base font-semibold">{m.label}</span></p>
                <p className={`mt-0.5 text-sm ${muted}`}>{m.note}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Bento: kompetensi */}
        <section id="kompetensi" aria-labelledby="kom" className={`p-6 md:p-8 ${panel}`}>
          <h2 id="kom" className={`${h2} mb-6`}>Kompetensi utama</h2>
          <div className="grid gap-4 md:grid-cols-6">
            {competencies.map(c => (
              <Link key={c.n} href={`/modul/${c.id}`}
                className={`group flex flex-col p-6 ${c.hl ? 'rounded-2xl border border-[#00D68F]/40 bg-[#07100c] text-white shadow-[0_0_40px_-12px_rgba(0,214,143,.6)] transition duration-300 hover:shadow-[0_0_48px_-8px_rgba(0,214,143,.8)] motion-safe:hover:-translate-y-0.5' : card} ${c.n === '01' || c.n === '04' ? 'md:col-span-4' : 'md:col-span-2'}`}>
                <span className={`self-end font-mono text-2xl font-semibold ${c.hl ? 'text-[#6bf2be]' : accent}`}>{c.n}</span>
                <h3 className="mt-2 text-xl font-semibold transition-colors group-hover:text-[#00D68F]">{c.title}</h3>
                <p className={`mt-2 max-w-md text-sm leading-relaxed ${c.hl ? 'text-slate-300' : muted}`}>{c.desc}</p>
                {c.log && (
                  <pre className="mt-4 overflow-x-auto rounded-lg bg-[#07100c] p-3 font-mono text-xs leading-relaxed text-slate-300">{'nginx: [emerg] unknown directive "baris_salah"\n  in /etc/nginx/conf.d/rusak.conf:1'}</pre>
                )}
                <span className="mt-auto flex flex-wrap gap-1.5 pt-5">
                  {c.tags.map(t => <span key={t} className={c.hl ? 'rounded-md border border-white/15 px-2 py-0.5 font-mono text-xs text-slate-300' : tag}>{t}</span>)}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Workflow */}
        <section aria-labelledby="wf" className={`grid gap-8 p-6 md:grid-cols-[.9fr_1.1fr] md:p-10 ${panel}`}>
          <div className="self-center">
            <h2 id="wf" className="text-3xl font-bold leading-tight tracking-tight md:text-5xl">Cara saya menangani insiden</h2>
            <p className={`mt-4 max-w-sm ${muted}`}>Tiga langkah yang saya ulang di setiap skenario, dari tiket masuk sampai verifikasi.</p>
          </div>
          <ol className="space-y-7 border-l-4 border-[#00D68F] pl-6 shadow-[-8px_0_20px_-12px_rgba(0,214,143,.7)]">
            {workflow.map((s, i) => (
              <li key={s.t}>
                <h3 className="font-semibold"><span className={`mr-2 font-mono ${accent}`}>{String(i + 1).padStart(2, '0')}</span>{s.t}</h3>
                <p className={`mt-1 text-sm ${muted}`}>{s.d}</p>
                <pre className="mt-2 overflow-x-auto rounded-lg bg-[#07100c] p-3 font-mono text-xs leading-relaxed text-slate-200">{s.cmd}</pre>
              </li>
            ))}
          </ol>
        </section>

        {/* Sertifikasi dan rekomendasi hanya tampil jika ada data nyata */}
        {(certs.length > 0 || testimonials.length > 0) && (
        <section aria-labelledby="sr" className={`p-6 md:p-8 ${panel}`}>
          <h2 id="sr" className={`${h2} mb-6 text-center`}>Sertifikasi &amp; rekomendasi</h2>
          <div className="grid items-stretch gap-6 md:grid-cols-2">
            <ul className="space-y-3">
              {certs.map(c => (
                <li key={c.title} className={`flex items-center gap-4 p-4 ${glass} ${neu}`}>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#00D68F]/15 font-mono text-sm font-semibold text-[#008e62] dark:text-[#6bf2be]" aria-hidden="true">{c.issuer[0]}</span>
                  <div className="min-w-0">
                    <p className="font-semibold leading-snug">{c.title}</p>
                    <p className={`text-sm ${muted}`}>{c.issuer}{c.year && ` · ${c.year}`}{c.url && <> · <a href={c.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#00D68F]">Lihat kredensial</a></>}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Testimonials items={testimonials} />
          </div>
        </section>
        )}

        {/* Modul lab */}
        <section id="modul" aria-labelledby="mod" className={`p-6 md:p-8 ${panel}`}>
          <h2 id="mod" className={`${h2} mb-6`}>Modul lab</h2>
          <ModuleLab items={items} filters={filters} />
        </section>

        {/* Kontak */}
        <section id="kontak" aria-labelledby="pf" className={`relative overflow-hidden p-8 md:p-10 ${panel}`}>
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#00D68F]/25 blur-3xl" />
          <div className="relative grid items-center gap-10 md:grid-cols-[1.1fr_.9fr]">
            <div>
              <span className="grid h-14 w-14 place-items-center rounded-full bg-[#00D68F] text-lg font-semibold text-[#011d14] shadow-[0_0_24px_-2px_rgba(0,214,143,.8)]" aria-hidden="true">{initials}</span>
              <h2 id="pf" className="mt-4 text-2xl font-semibold">{profile.name}</h2>
              <p className={`mt-1 font-mono text-sm ${accent}`}>{profile.role}</p>
              <p className={`mb-6 mt-3 max-w-md ${muted}`}>Terbuka untuk diskusi tentang lab ini, pekerjaan IT Support, atau kolaborasi.</p>
              <div className="flex flex-wrap gap-3">
                <Link className={btnPri} href="/kontak" target="_blank" rel="noopener noreferrer">Hubungi saya</Link>
                <a className={btnSec} href={resume} target="_blank" rel="noopener noreferrer">Unduh resume</a>
              </div>
            </div>
            {contacts.length > 0 && (
              <ul className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-white/10 dark:border-white/10">
                {contacts.map(([l, t, h]) => (
                  <li key={l} className="flex justify-between gap-4 py-3">
                    <span className={muted}>{l}</span>
                    <a href={h} target={h.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="truncate transition hover:text-[#00D68F]">{t}</a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>

      <footer className={`${wrap} flex flex-wrap justify-between gap-3 py-10 text-sm ${muted}`}>
        <span>© {profile.name}</span>
        <span>Gunakan VM Ubuntu Server untuk eksekusi nyata. Terminal browser adalah simulasi; buat snapshot sebelum latihan yang mengubah konfigurasi.</span>
      </footer>
    </>
  )
}
