import Link from 'next/link'
import { profile } from '../../data/lab'
import ContactForm from '../components/ContactForm'

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
      <section className="mhead">
        <div className="wrap">
          <p className="path"><Link href="/">Beranda</Link> / Kontak</p>
          <h1>Hubungi saya</h1>
          <p className="mgoal">Ada pertanyaan tentang lab ini atau butuh bantuan IT Support? Tulis pesan di bawah ini.</p>
        </div>
      </section>
      <main className="wrap contact">
        <aside>
          <h2>{profile.name}</h2>
          <p className="pf-role-d">{profile.role}</p>
          {rows.length > 0 && (
            <ul className="crow">
              {rows.map(([l, t, h]) => (
                <li key={l}><span>{l}</span><a href={h} target={h.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">{t}</a></li>
              ))}
            </ul>
          )}
        </aside>
        <ContactForm to={profile.email} />
      </main>
    </>
  )
}
