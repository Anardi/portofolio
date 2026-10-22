import Link from 'next/link'
import { notFound } from 'next/navigation'
import { modules, skills } from '../../../data/lab'
import { phases } from '../../../data/phases'
import CopyButton from '../../components/CopyButton'
import StepNav from '../../components/StepNav'

export const instant = false

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
      <section className="mhead">
        <div className="wrap">
          <p className="path"><Link href="/#modul">Semua modul</Link> / {phase?.name}</p>
          <h1>{m.title}</h1>
          <p className="mgoal">{m.goal}</p>
          <ul className="mtags">
            <li>{m.steps.length} langkah</li>
            {(skills[m.id] || []).map(s => <li key={s}>{s}</li>)}
          </ul>
        </div>
      </section>

      <div className="wrap doc-grid">
        <StepNav titles={m.steps.map(s => s.t)} />
        <main className="doc">
          <ol className="steps">
            {m.steps.map((s, k) => (
              <li key={k} id={`step-${k}`}>
                <h2>{s.t}</h2>
                <p>{s.d}</p>
                {s.warn && <p className="warn" role="note"><strong>Perhatian.</strong> {s.warn}</p>}
                {s.cmd && <Block text={s.cmd} label="bash" prompt />}
                {s.tpl && <Block text={s.tpl} label="template" />}
                {s.out && <p className="out">{s.out}</p>}
              </li>
            ))}
          </ol>

          <nav className="pager" aria-label="Navigasi modul">
            {prev ? <Link className="pg" href={`/modul/${prev.id}`}><small>Sebelumnya</small><b>{prev.title}</b></Link> : <span />}
            {next
              ? <Link className="pg next" href={`/modul/${next.id}`}><small>Berikutnya</small><b>{next.title}</b></Link>
              : <Link className="pg next" href="/"><small>Selesai</small><b>Kembali ke daftar modul</b></Link>}
          </nav>
        </main>
      </div>
    </>
  )
}

function Block({ text, label, prompt }) {
  return (
    <div className="code">
      <div className="code-bar"><span>{label}</span><CopyButton text={text} /></div>
      <pre><code>{prompt ? text.split('\n').map((l, n) => <span key={n} className="ln">{l}{'\n'}</span>) : text}</code></pre>
    </div>
  )
}
