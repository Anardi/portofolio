import { wrap } from '../ui'

export default function PageHead({ children }) {
  return (
    <section className="pb-10 pt-12">
      <div className={wrap}>{children}</div>
    </section>
  )
}
