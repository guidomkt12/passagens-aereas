# Arquitetura
O Next.js é somente a interface e uma camada segura de proxy. Route Handlers validam as entradas, incluem o segredo server-side e encaminham ao n8n. O n8n é o único componente que acessa MongoDB (`passagensaereasdb`) e suas coleções. Consultas idênticas ficam em cache de processo por 60 minutos; em produção, use cache compartilhado se houver múltiplas instâncias.

Não há conexão MongoDB, token de provedor ou URL de webhook no cliente. Seats.aero e o fallback brasileiro são recursos opcionais protegidos por feature flags.
