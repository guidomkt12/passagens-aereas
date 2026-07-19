# Radar Aéreo
Aplicação pessoal de inteligência de passagens, construída com Next.js App Router. Ela não acessa MongoDB: toda orquestração e persistência acontece nos webhooks n8n.

## Executar
1. Copie `.env.example` para `.env.local` e preencha `APP_ACCESS_PASSWORD`, `APP_SESSION_SECRET` e o segredo compartilhado.
2. `npm install && npm run dev`.
3. Para Vercel, cadastre as mesmas variáveis **sem** prefixo `NEXT_PUBLIC_`.

## Configuração da Vercel
Cadastre todas as chaves de `.env.example` em **Project settings → Environment Variables**, incluindo `N8N_CASH_SEARCH_URL` e `N8N_SHARED_SECRET`, no ambiente que está sendo publicado (Preview e/ou Production). Uma resposta `503` em `POST /api/flights/search-cash` com a mensagem `Fonte não configurada.` significa que `N8N_CASH_SEARCH_URL` não está disponível naquele ambiente Vercel; nenhuma URL de n8n deve ser colocada em variáveis `NEXT_PUBLIC_`.

## Segurança e operação
Os handlers internos validam requests, usam timeout de 12 segundos e nunca revelam URLs de upstream. O cache em memória evita repetir a mesma busca durante uma hora. Configure os workflows com os contratos em `docs/N8N_CONTRACTS.md`. O fallback Playwright é um serviço separado e deliberadamente não executa qualquer emissão ou compra.
