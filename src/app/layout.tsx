import type { Metadata } from 'next'; import { Geist, Geist_Mono } from 'next/font/google'; import { AppShell } from '@/components/app-shell'; import { ThemeProvider } from '@/components/theme-provider'; import './globals.css';
const geist=Geist({subsets:['latin'],variable:'--font-geist'}); const mono=Geist_Mono({subsets:['latin'],variable:'--font-mono'});
export const metadata: Metadata={title:'Radar Aéreo',description:'Inteligência pessoal de passagens'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR" suppressHydrationWarning><body className={`${geist.variable} ${mono.variable}`}><ThemeProvider><AppShell>{children}</AppShell></ThemeProvider></body></html>}
