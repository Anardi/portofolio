import Link from 'next/link'
import { profile, modules, skills } from '../../data/lab'
import { about } from '../../data/resume'

export const metadata = {
  title: 'About · Linux Lab',
  description: `Tentang ${profile.name} dan lab Linux System Administration.`,
}

export default function About() {
  const initials = profile.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  const all = [...new Set(Object.values(skills).flat())]

  return (
    <>
      <section className="pb-8 pt-10 sm:pb-12 sm:pt-16">
        <div className="wrap grid items-center gap-8 md:grid-cols-[auto_1fr]">
          <span className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-ubuntu font-mono text-2xl font-bold text-white sm:h-24 sm:w-24 sm:text-3xl" style={{ boxShadow: '0 0 40px rgba(0,214,143,.5)' }} aria-hidden="true">{initials}</span>
          <div className="min-w-0">
            <p className="font-mono text-sm text-ubuntu-deep dark:text-ubuntu">{profile.name} · {profile.role}</p>
            <h1 className="mt-2 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">{about.headline}</h1>
          </div>
        </div>
      </section>

      <main className="wrap space-y-10 pb-16 sm:pb-24">
        <div className="card max-w-3xl space-y-4 p-5 leading-relaxed text-slate-700 dark:text-slate-300 sm:p-8">
          {about.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>

        <section aria-labelledby="pr">
          <h2 id="pr" className="h-section mb-5">Cara kerja saya</h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {about.principles.map(([t, d]) => (
              <li key={t} className="card card-hover p-5">
                <h3 className="mb-2 font-bold">{t}</h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{d}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="st">
          <h2 id="st" className="h-section mb-5">Yang sudah dikerjakan</h2>
          <div className="card p-5 sm:p-8">
            <p className="mb-4 text-slate-600 dark:text-slate-300">{modules.length} modul dan {all.length} keterampilan, dari instalasi VM sampai laporan insiden.</p>
            <ul className="flex flex-wrap gap-2">{all.map(s => <li key={s} className="chip">{s}</li>)}</ul>
          </div>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/#modul" className="btn btn-pri">Buka modul lab</Link>
          <Link href="/resume" className="btn btn-sec">Lihat resume</Link>
          <Link href="/kontak" className="btn btn-sec">Hubungi saya</Link>
        </div>
      </main>
    </>
  )
}
