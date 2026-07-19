import { proxyN8n } from '@/lib/n8n'; import { trendsSchema } from '@/lib/schemas'; export async function POST(r:Request){return proxyN8n(r,trendsSchema,'N8N_TRENDS_URL');}
