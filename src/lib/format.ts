export const brl = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
export const dateBR = (value: string) => new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeZone: 'America/Sao_Paulo' }).format(new Date(`${value}T12:00:00`));
export const duration=(minutes?:number)=>minutes===undefined?'Não informado':`${Math.floor(minutes/60)}h${String(minutes%60).padStart(2,'0')}`;
