import { proxyN8n } from '@/lib/n8n'; import { dealsSchema } from '@/lib/schemas'; export async function POST(r:Request){return proxyN8n(r,dealsSchema,'N8N_DEALS_URL');}
