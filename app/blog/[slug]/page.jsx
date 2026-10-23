import Link from 'next/link'
import { notFound } from 'next/navigation'
import { blogPosts, getBlogPost } from '../../../data/blog'
import { wrap } from '../../ui'

export function generateStaticParams() {
  return blogPosts.map(post => ({ slug: post.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return { title: 'Article not found · Linux Lab' }
  return { title: `${post.title} · Linux Lab Notes`, description: post.excerpt }
}

export default async function BlogArticle({ params }) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  return (
    <main className="min-h-screen bg-[#050807] text-slate-100">
      <section className="hero-grid-bg border-b border-white/10">
        <div className={`${wrap} py-10 sm:py-14`}>
          <p className="font-mono text-[11px] uppercase tracking-[.16em] text-slate-500"><Link href="/" className="hover:text-[#6bf2be]">root@linux-lab</Link><span className="mx-2 text-[#00D68F]">/</span><Link href="/blog" className="hover:text-[#6bf2be]">blog</Link><span className="mx-2 text-[#00D68F]">/</span> {post.slug}</p>
          <div className="mt-8 max-w-3xl">
            <p className="font-mono text-[10px] uppercase tracking-[.17em] text-[#6bf2be]">{post.category} <span className="mx-2 text-slate-600">·</span> {post.readTime}</p>
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-[-.04em] sm:text-5xl">{post.title}<span className="text-[#00D68F]">_</span></h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">{post.excerpt}</p>
            <p className="mt-4 font-mono text-[10px] text-slate-600">PUBLISHED {post.date.toUpperCase()}</p>
          </div>
        </div>
      </section>

      <article className={`${wrap} grid gap-10 py-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_250px]`}>
        <div className="min-w-0 max-w-3xl">
          <p className="mb-8 text-base leading-8 text-slate-300">{post.intro}</p>
          <div className="space-y-9">
            {post.sections.map((section, index) => (
              <section key={section.heading} aria-labelledby={`section-${index + 1}`}>
                <h2 id={`section-${index + 1}`} className="text-xl font-semibold tracking-tight text-white sm:text-2xl">{section.heading}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-400 sm:text-base">{section.body}</p>
                <pre className="mt-4 overflow-x-auto rounded-lg border border-white/10 bg-[#020403] p-4 font-mono text-xs leading-6 text-[#8af6ca] sm:text-sm">{section.commands.join('\n')}</pre>
              </section>
            ))}
          </div>
          <aside className="mt-9 rounded-lg border-l-2 border-amber-400 bg-amber-400/[.06] p-4 text-sm leading-6 text-slate-300"><span className="mb-1 block font-mono text-[10px] uppercase tracking-[.15em] text-amber-300">Lab safety note</span>{post.note}</aside>
          <div className="mt-9 flex flex-wrap gap-2">{post.tags.map(tag => <span key={tag} className="rounded border border-white/10 px-2 py-1 font-mono text-[10px] text-slate-500">#{tag.replaceAll(' ', '-')}</span>)}</div>
          <div className="mt-10 flex flex-wrap justify-between gap-3 border-t border-white/10 pt-5"><Link href="/blog" className="font-mono text-xs text-[#6bf2be] hover:underline">← All articles</Link><Link href="/#modul" className="font-mono text-xs text-slate-500 hover:text-[#6bf2be]">Explore lab modules ↗</Link></div>
        </div>
        <aside className="h-fit rounded-xl border border-white/10 bg-[#080e0c]/80 p-5">
          <p className="font-mono text-[10px] uppercase tracking-[.16em] text-[#6bf2be]">Suggested workflow</p>
          <ol className="mt-4 space-y-3 text-sm text-slate-400"><li><span className="mr-2 font-mono text-[#00D68F]">01</span>Observe the symptom</li><li><span className="mr-2 font-mono text-[#00D68F]">02</span>Collect diagnostic evidence</li><li><span className="mr-2 font-mono text-[#00D68F]">03</span>Apply one controlled change</li><li><span className="mr-2 font-mono text-[#00D68F]">04</span>Verify and document</li></ol>
          <Link href="/terminal" className="mt-6 inline-flex w-full items-center justify-center rounded-md border border-[#00D68F]/45 px-3 py-2.5 font-mono text-[10px] text-[#6bf2be] transition hover:bg-[#00D68F]/10">Practice in Bash Ubuntu ↗</Link>
        </aside>
      </article>
    </main>
  )
}
