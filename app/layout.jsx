import { IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import Header from './components/Header'

const sans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--sans' })
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--mono' })

export const metadata = {
  title: 'Linux System Administration Lab',
  description: 'Dokumentasi lab Ubuntu Server di VirtualBox: 12 modul simulasi tugas administrator untuk IT Support.',
}

const themeScript = `try{var t=localStorage.getItem('theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=t}catch(e){}`

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body>
        <Header />
        {children}
      </body>
    </html>
  )
}
