export default function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-gradient-to-b from-slate-50 via-slate-50 to-white dark:from-[#050807] dark:via-[#060a08] dark:to-[#050807]">
      <div className="absolute -right-32 top-10 h-96 w-96 rounded-full bg-[#00D68F]/[.08] blur-3xl" />
      <div className="absolute -left-36 top-[70rem] h-96 w-96 rounded-full bg-[#00D68F]/[.06] blur-3xl" />
    </div>
  )
}
