import Link from 'next/link'
import { profile } from '../../data/lab'
import { resume } from '../../data/resume'
import PrintButton from '../components/PrintButton'

export const metadata = {
  title: 'Resume · Bagas Anardi Surya Wijaya',
  description: `Resume ${profile.name}: IT Support, networking, system troubleshooting, and Linux administration.`,
}

const sectionTitle = 'mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[.18em] text-[#6bf2be]'
const surface = 'rounded-2xl border border-white/10 bg-[#080e0c]/90 shadow-[0_12px_40px_rgba(0,0,0,.18)]'
const mutedText = 'text-slate-400'
const resumeWrap = 'resume-wrap mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-10'

function SectionHeading({ index, children }) {
  return <h2 className={sectionTitle}><span className="text-[#00D68F]">{index}</span><span>{children}</span><span className="h-px flex-1 bg-white/10" /></h2>
}

export default function Resume() {
  const contacts = [
    { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { label: 'Phone', value: profile.phone, href: `tel:${profile.phone.replace(/[^\d+]/g, '')}` },
    { label: 'GitHub', value: 'github.com/Anardi', href: profile.github, external: true },
    { label: 'LinkedIn', value: 'linkedin.com/in/bagas-anardi', href: profile.linkedin, external: true },
  ].filter(item => item.value && item.href)

  return (
    <div className="resume-page min-h-screen bg-[#050807] text-slate-100">
      <section className="hero-grid-bg relative isolate overflow-hidden border-b border-white/10 bg-[#050807]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_16%_30%,rgba(0,214,143,.13),transparent_42%),radial-gradient(ellipse_at_90%_70%,rgba(36,96,165,.08),transparent_34%)]" />
        <div className={`${resumeWrap} relative py-10 sm:py-14 lg:py-16`}>
          <p className="no-print mb-6 font-mono text-[11px] uppercase tracking-[.18em] text-slate-500"><Link href="/" className="hover:text-[#6bf2be]">root@linux-lab</Link><span className="mx-2 text-[#00D68F]">/</span> resume.profile</p>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,.8fr)] lg:items-end">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#00D68F]/30 bg-[#00D68F]/[.07] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[.16em] text-[#6bf2be]"><span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#00D68F]" /> Professional profile</span>
              <p className="mt-6 font-mono text-xs uppercase tracking-[.18em] text-slate-400">IT Support · Networking · Linux Administration</p>
              <h1 className="mt-3 max-w-4xl text-4xl font-bold leading-[1.03] tracking-[-.045em] text-white sm:text-5xl lg:text-6xl">Bagas Anardi <span className="text-[#00D68F]">Surya Wijaya</span><span className="ml-2 text-base font-semibold tracking-normal text-slate-400 sm:text-lg">S.Kom.</span><span className="ml-2 font-mono text-[#00D68F]">_</span></h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">{resume.summary}</p>
              <div className="no-print mt-7 flex flex-wrap gap-3">
                <a href="/resume.pdf" download="Bagas_Anardi_Surya_Wijaya_CV.pdf" className="inline-flex min-h-11 items-center gap-2 rounded-md border border-[#00D68F]/55 bg-[#00D68F]/10 px-4 font-mono text-xs text-[#6bf2be] transition hover:bg-[#00D68F]/15 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00D68F]">Download CV <span aria-hidden="true">↓</span></a>
                <PrintButton />
                <Link href="/terminal" className="inline-flex min-h-11 items-center gap-2 rounded-md border border-white/15 px-4 font-mono text-xs text-slate-200 transition hover:border-white/35 hover:text-white">Open Bash Ubuntu <span className="text-[#00D68F]">↗</span></Link>
              </div>
            </div>
            <div className="resume-profile-terminal rounded-xl border border-[#00D68F]/20 bg-[#030605]/90 shadow-[0_0_50px_-24px_rgba(0,214,143,.42)]">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 font-mono text-[10px] text-slate-500 sm:text-xs"><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-[#00D68F]" />profile.json</span><span className="text-[#00D68F]">read_only</span></div>
              <div className="space-y-2 p-4 font-mono text-[11px] leading-5 sm:p-5 sm:text-xs">
                <p><span className="text-[#6bf2be]">$</span> cat profile.status</p>
                <p><span className="text-slate-500">role</span> <span className="text-slate-300">=</span> <span className="text-[#80b8ff]">"IT Support"</span></p>
                <p><span className="text-slate-500">focus</span> <span className="text-slate-300">=</span> <span className="text-[#80b8ff]">["networking", "linux", "troubleshooting"]</span></p>
                <p><span className="text-slate-500">education</span> <span className="text-slate-300">=</span> <span className="text-[#80b8ff]">"B.Eng. Informatics Engineering"</span></p>
                <div className="mt-4 border-t border-white/10 pt-3 text-slate-500">// practical experience, documented clearly</div>
              </div>
            </div>
          </div>
          <div className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {contacts.map(c => <a key={c.label} href={c.href} target={c.external ? '_blank' : undefined} rel={c.external ? 'noopener noreferrer' : undefined} className="resume-contact-card group min-w-0 rounded-lg border border-white/10 bg-black/20 px-3 py-3 transition hover:border-[#00D68F]/35 hover:bg-[#00D68F]/[.04]"><span className="block font-mono text-[9px] uppercase tracking-[.16em] text-slate-500">{c.label}</span><span className="mt-1 block break-all text-xs text-slate-200 transition group-hover:text-[#6bf2be]">{c.value}</span></a>)}
          </div>
        </div>
      </section>

      <main className={`${resumeWrap} space-y-6 py-8 sm:py-10`}>
        <section className={`${surface} resume-surface p-5 sm:p-7`}>
          <SectionHeading index="01">Experience &amp; relevant technical practice</SectionHeading>
          <ol className="space-y-7">
            {resume.experience.map((item, idx) => <li key={item.role} className="relative grid gap-3 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-6">
              <div className="font-mono text-[10px] leading-5 text-slate-500 sm:pt-1">{item.period}<span className="mt-1 block text-slate-600">{item.location}</span></div>
              <div className="relative border-l border-[#00D68F]/30 pb-1 pl-5">
                <span aria-hidden="true" className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-[#00D68F] shadow-[0_0_12px_rgba(0,214,143,.8)]" />
                <h3 className="font-semibold leading-snug text-white">{item.role}</h3>
                <p className="mt-1 text-sm text-[#6bf2be]">{item.org}</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">{item.points.map(point => <li key={point} className="flex gap-2"><span className="font-mono text-[#00D68F]">›</span><span>{point}</span></li>)}</ul>
              </div>
            </li>)}
          </ol>
        </section>

        <section className={`${surface} resume-surface p-5 sm:p-7`}>
          <SectionHeading index="02">Selected projects</SectionHeading>
          <div className="grid gap-4 lg:grid-cols-2">
            {resume.projects.map((project, idx) => <article key={project.name} className="rounded-xl border border-white/10 bg-white/[.02] p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3"><p className="font-mono text-[10px] uppercase tracking-[.12em] text-[#6bf2be]">PROJECT_{String(idx + 1).padStart(2, '0')}</p><span className="rounded-md border border-white/10 px-2 py-1 font-mono text-[9px] text-slate-500">{project.period}</span></div>
              <h3 className="mt-3 text-lg font-semibold leading-snug text-white">{project.name}</h3>
              <p className="mt-1 text-xs text-slate-500">{project.type}{project.org ? ` · ${project.org}` : ''}</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">{project.summary}</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-400">{project.points.map(point => <li key={point} className="flex gap-2"><span className="text-[#00D68F]">▹</span><span>{point}</span></li>)}</ul>
              <div className="mt-4 flex flex-wrap gap-1.5">{project.tags.map(tag => <span key={tag} className="rounded border border-white/10 bg-black/20 px-2 py-1 font-mono text-[9px] text-slate-400">{tag}</span>)}</div>
              {project.name.includes('Linux System Administration') && <Link href="/terminal?module=troubleshooting" className="mt-4 inline-block font-mono text-[10px] text-[#6bf2be] underline decoration-[#00D68F]/40 underline-offset-4 hover:decoration-[#00D68F]">Open interactive lab ↗</Link>}
              {project.name.includes('MSIB') && <a href={resume.links.msib} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block font-mono text-[10px] text-[#6bf2be] underline decoration-[#00D68F]/40 underline-offset-4 hover:decoration-[#00D68F]">View supporting materials ↗</a>}
            </article>)}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
          <section className={`${surface} resume-surface p-5 sm:p-7`}>
            <SectionHeading index="03">Education</SectionHeading>
            {resume.education.map(item => <article key={item.org} className="space-y-2">
              <p className="font-mono text-[10px] text-slate-500">{item.period}</p>
              <h3 className="text-lg font-semibold leading-snug text-white">{item.title}</h3>
              <p className="text-sm text-[#6bf2be]">{item.org}</p>
              <p className="text-xs text-slate-500">{item.location}</p>
              <p className="mt-3 inline-flex rounded-md border border-[#00D68F]/25 bg-[#00D68F]/[.06] px-3 py-2 font-mono text-xs text-[#6bf2be]">{item.result}</p>
            </article>)}
          </section>

          <section className={`${surface} resume-surface p-5 sm:p-7`}>
            <SectionHeading index="04">Technical skills</SectionHeading>
            <div className="grid gap-4 sm:grid-cols-2">
              {resume.skills.map(group => <article key={group.category} className="rounded-lg border border-white/10 bg-black/20 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-sm font-semibold text-white">{group.category}</h3><span className="font-mono text-[9px] uppercase tracking-wider text-[#6bf2be]">{group.level}</span></div>
                <ul className="mt-3 flex flex-wrap gap-1.5">{group.items.map(item => <li key={item} className="rounded border border-white/10 px-2 py-1 text-[10px] leading-4 text-slate-400">{item}</li>)}</ul>
              </article>)}
            </div>
          </section>
        </div>

        <section className={`${surface} resume-surface p-5 sm:p-7`}>
          <SectionHeading index="05">Workshops & professional development</SectionHeading>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <ul className="grid flex-1 gap-3 sm:grid-cols-2">{resume.workshops.map(workshop => <li key={workshop} className="flex gap-3 text-sm text-slate-300"><span className="font-mono text-[#00D68F]">[+]</span><span>{workshop}</span></li>)}</ul>
            <a href={resume.links.workshops} target="_blank" rel="noopener noreferrer" className="shrink-0 font-mono text-[10px] text-[#6bf2be] underline decoration-[#00D68F]/40 underline-offset-4 hover:decoration-[#00D68F]">View supporting materials ↗</a>
          </div>
        </section>

        <div className="no-print flex flex-wrap items-center justify-between gap-3 border-t border-white/10 py-5 text-xs text-slate-500">
          <Link href="/" className="font-mono transition hover:text-[#6bf2be]">← Back to portfolio</Link>
          <span className="font-mono">BAGAS_ANARDI_SURYA_WIJAYA · RESUME</span>
        </div>
      </main>
    </div>
  )
}
