import { proxyN8n } from '@/lib/n8n'; import { searchSchema } from '@/lib/schemas'; export async function POST(r:Request){return proxyN8n(r,searchSchema,'N8N_CASH_SEARCH_URL');}
