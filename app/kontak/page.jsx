import Link from 'next/link'
import { profile } from '../../data/lab'
import ContactForm from '../components/ContactForm'
import PageHead from '../components/PageHead'
import { wrap, muted } from '../ui'

export const metadata = {
  title: 'Kontak · Linux Lab',
  description: `Hubungi ${profile.name} untuk diskusi tentang lab Linux dan pekerjaan IT Support.`,
}

export default function Kontak() {
  const rows = [
    profile.email && ['Email', profile.email, `mailto:${profile.email}`],
    profile.phone && ['Telepon', profile.phone, `tel:${profile.phone.replace(/[^\d+]/g, '')}`],
    profile.github && ['GitHub', profile.github.replace(/^https?:\/\//, ''), profile.github],
    profile.linkedin && ['LinkedIn', profile.linkedin.replace(/^https?:\/\//, ''), profile.linkedin],
  ].filter(Boolean)

  return (
    <>
      <PageHead>
        <p className={`mb-4 text-sm ${muted}`}><Link href="/" className="hover:text-[#00D68F]">Beranda</Link> / Kontak</p>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Hubungi saya</h1>
        <p className={`mt-3 max-w-xl ${muted}`}>Ada pertanyaan tentang lab ini atau butuh bantuan IT Support? Tulis pesan di bawah ini.</p>
      </PageHead>
      <main className={`${wrap} grid items-start gap-10 pb-20 md:grid-cols-[1fr_1.2fr]`}>
        <aside>
          <h2 className="text-xl font-semibold">{profile.name}</h2>
          <p className={`mb-5 mt-1 ${muted}`}>{profile.role}</p>
          {rows.length > 0 && (
            <ul className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-white/10 dark:border-white/10">
              {rows.map(([l, t, h]) => (
                <li key={l} className="flex justify-between gap-4 py-3">
                  <span className={muted}>{l}</span>
                  <a href={h} target={h.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="truncate transition hover:text-[#00D68F]">{t}</a>
                </li>
              ))}
            </ul>
          )}
        </aside>
        <ContactForm to={profile.email} />
      </main>
    </>
  )
}
