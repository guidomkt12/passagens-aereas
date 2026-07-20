'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export function Nav() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem('radar-theme');
    const next = saved === 'dark';
    setDark(next);
    document.documentElement.dataset.theme = next ? 'dark' : 'light';
  }, []);
  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? 'dark' : 'light';
    localStorage.setItem('radar-theme', next ? 'dark' : 'light');
  }
  return <header className="topbar">
    <Link href="/dashboard" className="brand"><span className="brand-mark">⌁</span><span>Radar <b>Aéreo</b></span></Link>
    <nav className="primary-nav" aria-label="Navegação principal">
      <Link href="/dashboard">Painel</Link><Link href="/buscar">Buscar</Link><Link href="/promocoes">Promoções</Link><Link href="/radares">Radares</Link><Link href="/historico">Histórico</Link>
    </nav>
    <div className="nav-actions"><span className="personal-label">Uso pessoal</span><button className="icon-button" type="button" onClick={toggleTheme} aria-label="Alternar tema">{dark ? '☀' : '◐'}</button></div>
  </header>;
}
