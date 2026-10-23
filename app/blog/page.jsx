import Link from 'next/link'
import { blogPosts } from '../../data/blog'
import { wrap } from '../ui'

export const metadata = {
  title: 'Blog · Linux Lab Notes',
  description: 'Technical notes on Linux administration, network diagnostics, permissions, and IT support troubleshooting.',
}

export default function BlogIndex() {
  return (
    <main className="min-h-screen bg-[#050807] text-slate-100">
      <section className="hero-grid-bg relative isolate overflow-hidden border-b border-white/10">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_38%,rgba(0,214,143,.12),transparent_42%)]" />
        <div className={`${wrap} relative py-14 sm:py-20`}>
          <p className="font-mono text-[11px] uppercase tracking-[.18em] text-slate-500"><Link href="/" className="hover:text-[#6bf2be]">root@linux-lab</Link><span className="mx-2 text-[#00D68F]">/</span> blog.index</p>
          <div className="mt-8 max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#00D68F]/30 bg-[#00D68F]/[.07] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[.16em] text-[#6bf2be]"><span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#00D68F]" /> Field notes & lab documentation</span>
            <h1 className="mt-5 text-4xl font-bold tracking-[-.045em] sm:text-6xl">Technical <span className="text-[#00D68F]">Blog_</span></h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">Catatan praktik dan pendekatan troubleshooting yang dapat diulang—dari diagnosis service Linux hingga konektivitas jaringan. Artikel berangkat dari skenario lab, bukan klaim penanganan insiden produksi.</p>
          </div>
        </div>
      </section>

      <section className={`${wrap} py-10 sm:py-14`} aria-labelledby="articles-heading">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-[#6bf2be]">/var/log/learning</p><h2 id="articles-heading" className="mt-2 text-2xl font-semibold">Latest notes</h2></div>
          <span className="font-mono text-xs text-slate-500">{String(blogPosts.length).padStart(2, '0')} ARTICLES</span>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {blogPosts.map((post, index) => (
            <article key={post.slug} className="group flex h-full flex-col rounded-xl border border-white/10 bg-[#080e0c]/85 p-5 transition duration-200 hover:-translate-y-1 hover:border-[#00D68F]/35 hover:bg-[#09130f] sm:p-6">
              <div className="flex items-center justify-between gap-3"><span className="font-mono text-[9px] uppercase tracking-[.15em] text-[#6bf2be]">{post.category}</span><span className="font-mono text-[10px] text-slate-600">NOTE_{String(index + 1).padStart(2, '0')}</span></div>
              <h3 className="mt-5 text-xl font-semibold leading-snug tracking-tight text-slate-100 group-hover:text-[#6bf2be]"><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-slate-400">{post.excerpt}</p>
              <div className="mt-5 flex flex-wrap gap-1.5">{post.tags.map(tag => <span key={tag} className="rounded border border-white/10 px-2 py-1 font-mono text-[9px] text-slate-500">{tag}</span>)}</div>
              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4"><span className="font-mono text-[10px] text-slate-600">{post.readTime}</span><Link href={`/blog/${post.slug}`} className="font-mono text-[10px] text-[#6bf2be] underline decoration-[#00D68F]/40 underline-offset-4">Read article ↗</Link></div>
            </article>
          ))}
        </div>
        <div className="mt-10 border-t border-white/10 pt-5"><Link href="/" className="font-mono text-xs text-slate-500 transition hover:text-[#6bf2be]">← Back to portfolio</Link></div>
      </section>
    </main>
  )
}
