import Link from 'next/link'
import { notFound } from 'next/navigation'
import { modules, skills } from '../../../data/lab'
import { phases } from '../../../data/phases'
import CopyButton from '../../components/CopyButton'
import StepNav from '../../components/StepNav'
import PageHead from '../../components/PageHead'
import { wrap, muted, tag, card } from '../../ui'

export function generateStaticParams() {
  return modules.map(m => ({ id: m.id }))
}

export async function generateMetadata({ params }) {
  const { id } = await params
  const m = modules.find(x => x.id === id)
  return m ? { title: `${m.title} · Linux Lab`, description: m.goal } : {}
}

export default async function ModulePage({ params }) {
  const { id } = await params
  const i = modules.findIndex(x => x.id === id)
  if (i < 0) notFound()
  const m = modules[i]
  const prev = modules[i - 1]
  const next = modules[i + 1]
  const phase = phases.find(p => p.ids.includes(m.id))

  return (
    <>
      <PageHead>
        <p className={`mb-4 text-sm ${muted}`}><Link href="/#modul" className="hover:text-[#00D68F]">Semua modul</Link> / {phase?.name}</p>
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">{m.title}</h1>
        <p className={`mt-3 max-w-2xl ${muted}`}>{m.goal}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          <li className={tag}>{m.steps.length} langkah</li>
          {(skills[m.id] || []).map(s => <li key={s} className={tag}>{s}</li>)}
        </ul>
        <Link href={`/terminal?module=${m.id}`} className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[#00D68F]/40 bg-[#00D68F]/[.06] px-4 py-2.5 font-mono text-xs text-[#008e62] transition hover:border-[#00D68F] hover:bg-[#00D68F]/10 dark:text-[#6bf2be]">
          <span aria-hidden="true">$</span> Praktikkan di Bash Ubuntu <span aria-hidden="true">↗</span>
        </Link>
      </PageHead>

      <div className={`${wrap} grid items-start gap-12 pb-16 lg:grid-cols-[15rem_minmax(0,1fr)]`}>
        <StepNav titles={m.steps.map(s => s.t)} />
        <main className="min-w-0 max-w-3xl">
          <ol>
            {m.steps.map((s, k) => (
              <li key={k} id={`step-${k}`} className="relative ml-4 scroll-mt-24 border-l-2 border-slate-200 pb-9 pl-8 last:border-transparent dark:border-white/10">
                <span className="absolute -left-4 top-0 grid h-8 w-8 place-items-center rounded-full bg-[#00D68F] font-mono text-sm font-medium text-[#011d14] shadow-[0_0_14px_-2px_rgba(0,214,143,.8)]">{k + 1}</span>
                <h2 className="text-lg font-semibold">{s.t}</h2>
                <p className={`mt-1 ${muted}`}>{s.d}</p>
                {s.warn && <p role="note" className="mt-3 rounded-r-lg border-l-4 border-[#00D68F] bg-emerald-50 px-4 py-2.5 text-sm dark:bg-[#00D68F]/10"><strong>Perhatian.</strong> {s.warn}</p>}
                {s.cmd && <Block text={s.cmd} label="bash" prompt />}
                {s.tpl && <Block text={s.tpl} label="template" />}
                {s.out && <p className={`mt-2 font-mono text-sm ${muted}`}>{s.out}</p>}
              </li>
            ))}
          </ol>

          <nav aria-label="Navigasi modul" className="grid gap-4 sm:grid-cols-2">
            {prev ? <Link href={`/modul/${prev.id}`} className={`flex flex-col p-4 ${card}`}><small className={muted}>Sebelumnya</small><b>{prev.title}</b></Link> : <span />}
            {next
              ? <Link href={`/modul/${next.id}`} className={`flex flex-col p-4 sm:col-start-2 sm:text-right ${card}`}><small className={muted}>Berikutnya</small><b>{next.title}</b></Link>
              : <Link href="/" className={`flex flex-col p-4 sm:col-start-2 sm:text-right ${card}`}><small className={muted}>Selesai</small><b>Kembali ke daftar modul</b></Link>}
          </nav>
        </main>
      </div>
    </>
  )
}

function Block({ text, label, prompt }) {
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-[#07100c] shadow-lg">
      <div className="flex items-center justify-between border-b border-white/10 py-1.5 pl-4 pr-2 font-mono text-xs text-slate-400">
        <span>{label}</span><CopyButton text={text} />
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-slate-100"><code>
        {prompt
          ? text.split('\n').map((l, n) => <span key={n} className="before:select-none before:text-[#6bf2be] before:content-['$_']">{l}{'\n'}</span>)
          : text}
      </code></pre>
    </div>
  )
}
