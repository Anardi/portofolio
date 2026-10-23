import { panel } from '../ui'

export default function Spotlight({ children }) {
  return (
    <section className={`${panel} relative overflow-hidden p-6 md:p-12`}>
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#00D68F]/20 blur-3xl" />
      <div className="relative">{children}</div>
    </section>
  )
}
