# Radar Aéreo
Aplicação pessoal de inteligência de passagens, construída com Next.js App Router. Ela não acessa MongoDB: toda orquestração e persistência acontece nos webhooks n8n.

## Executar
1. Copie `.env.example` para `.env.local` e preencha `APP_ACCESS_PASSWORD`, `APP_SESSION_SECRET` e o segredo compartilhado.
2. `npm install && npm run dev`.
3. Para Vercel, cadastre as mesmas variáveis **sem** prefixo `NEXT_PUBLIC_`.

## Segurança e operação
Os handlers internos validam requests, usam timeout de 12 segundos e nunca revelam URLs de upstream. O cache em memória evita repetir a mesma busca durante uma hora. Configure os workflows com os contratos em `docs/N8N_CONTRACTS.md`. O fallback Playwright é um serviço separado e deliberadamente não executa qualquer emissão ou compra.
