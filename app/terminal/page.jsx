import TerminalWorkbenchLoader from '../components/TerminalWorkbenchLoader'
import { modules } from '../../data/lab'

export const metadata = {
  title: 'Bash Ubuntu Simulator · Bagas Anardi',
  description: 'Latihan command Linux secara interaktif menggunakan terminal mock client-side untuk modul Ubuntu Lab.',
}

export default async function TerminalPage({ searchParams }) {
  const query = await searchParams
  const requestedModule = typeof query?.module === 'string' ? query.module : ''
  const moduleId = modules.some(item => item.id === requestedModule) ? requestedModule : ''
  return <TerminalWorkbenchLoader initialModuleId={moduleId} />
}
