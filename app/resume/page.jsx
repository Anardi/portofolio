import Link from 'next/link'
import { profile, skills } from '../../data/lab'
import { resume } from '../../data/resume'
import PrintButton from '../components/PrintButton'

export const metadata = {
  title: 'Resume · Linux Lab',
  description: `Resume ${profile.name}, ${profile.role}.`,
}

export default function Resume() {
  const all = [...new Set(Object.values(skills).flat())]
  const contacts = [
    profile.email && profile.email,
    profile.phone && profile.phone,
    profile.github && profile.github.replace(/^https?:\/\//, ''),
    profile.linkedin && profile.linkedin.replace(/^https?:\/\//, ''),
  ].filter(Boolean)

  return (
    <>
      <section className="pb-8 pt-10 sm:pb-12 sm:pt-16">
        <div className="wrap flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <p className="no-print mb-4 font-mono text-xs text-slate-500 dark:text-slate-400 sm:text-sm"><Link href="/" className="transition hover:text-ubuntu-deep dark:hover:text-ubuntu">Beranda</Link> / Resume</p>
            <h1 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl">{profile.name}</h1>
            <p className="mt-2 font-mono text-ubuntu-deep dark:text-ubuntu">{profile.role}</p>
            {contacts.length > 0 && <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600 dark:text-slate-300">{contacts.map(c => <span key={c} className="break-all">{c}</span>)}</p>}
          </div>
          <PrintButton />
        </div>
      </section>

      <main className="wrap grid gap-6 pb-16 sm:pb-24 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-6">
          <section className="card p-5 sm:p-8" aria-labelledby="rs">
            <h2 id="rs" className="mb-3 text-xl font-bold">Ringkasan</h2>
            <p className="leading-relaxed text-slate-700 dark:text-slate-300">{resume.summary}</p>
          </section>

          <section className="card p-5 sm:p-8" aria-labelledby="rx">
            <h2 id="rx" className="mb-5 text-xl font-bold">Pengalaman</h2>
            <ol className="space-y-7">
              {resume.experience.map((e, i) => (
                <li key={i} className="relative border-l-2 border-ubuntu/50 pl-5">
                  <span aria-hidden="true" className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-ubuntu" style={{ boxShadow: '0 0 12px rgba(0,214,143,.8)' }} />
                  <h3 className="font-bold">{e.role}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{e.org} · {e.period}</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-700 marker:text-ubuntu dark:text-slate-300">
                    {e.points.map(p => <li key={p}>{p}</li>)}
                  </ul>
                </li>
              ))}
            </ol>
          </section>

          <section className="card p-5 sm:p-8" aria-labelledby="re">
            <h2 id="re" className="mb-4 text-xl font-bold">Pendidikan</h2>
            <ul className="space-y-3">
              {resume.education.map((e, i) => (
                <li key={i}><h3 className="font-bold">{e.title}</h3><p className="text-sm text-slate-500 dark:text-slate-400">{e.org} · {e.period}</p></li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="min-w-0 space-y-6">
          <section className="card p-5 sm:p-6" aria-labelledby="rk">
            <h2 id="rk" className="mb-4 text-lg font-bold">Keterampilan</h2>
            <ul className="flex flex-wrap gap-2">{all.map(s => <li key={s} className="chip">{s}</li>)}</ul>
          </section>
          {resume.certifications.length > 0 && (
            <section className="card p-5 sm:p-6" aria-labelledby="rc">
              <h2 id="rc" className="mb-4 text-lg font-bold">Sertifikasi</h2>
              <ul className="space-y-2 text-sm">{resume.certifications.map(c => <li key={c}>{c}</li>)}</ul>
            </section>
          )}
        </aside>
      </main>
    </>
  )
}
