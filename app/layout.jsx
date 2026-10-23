import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import '@xterm/xterm/css/xterm.css'
import Providers from './components/Providers'
import Header from './components/Header'
import Backdrop from './components/Backdrop'
import CursorFX from './components/CursorFX'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' })

export const metadata = {
  title: 'Bagas Anardi · IT Infrastructure & Linux SysAdmin Lab',
  description: 'Portofolio IT Support dan Linux System Administration dengan modul lab Ubuntu, networking, troubleshooting, dan terminal simulasi browser.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning className={`${jakarta.variable} ${jetbrains.variable}`}>
      <body className="bg-[#F8FAFC] font-sans text-slate-900 antialiased transition-colors duration-300 dark:bg-[#050807] dark:text-slate-100">
        <Providers>
          <div className="relative isolate min-h-screen">
            <Backdrop />
            <CursorFX />
            <Header />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
