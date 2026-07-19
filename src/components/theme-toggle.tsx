'use client';
import { Monitor, Moon, Sun } from 'lucide-react'; import { useTheme } from 'next-themes';
const options=[['light','Claro',Sun],['dark','Escuro',Moon],['system','Sistema',Monitor]] as const;
export function ThemeToggle(){const {theme,setTheme}=useTheme();return <div className="theme-toggle" role="group" aria-label="Tema da interface">{options.map(([value,label,Icon])=><button key={value} type="button" className={theme===value?'active':''} onClick={()=>setTheme(value)} aria-label={`Usar tema ${label.toLowerCase()}`} aria-pressed={theme===value} title={label}><Icon size={17}/></button>)}</div>}
