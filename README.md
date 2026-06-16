# Rhema AI — Transcrição ao vivo + Timer de palco

Plataforma web para transmissão de cultos ao vivo. Dois módulos integrados:

- **Rhema (Transcrição):** transcreve a palavra ao vivo no navegador e um agente de
  IA gera legendas prontas para Instagram (com direcionamento editorial).
- **Timer de palco:** salas multi-tela sincronizadas em tempo real
  (controller, operator, moderator, viewer, agenda) para cronometrar apresentações.

🟢 **Em produção:** Vercel + Supabase.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 16 · React 19 · TypeScript · Tailwind v4 |
| Estado | Zustand |
| Banco | Supabase Postgres (Drizzle ORM) |
| Tempo real | Supabase Realtime |
| Transcrição | Web Speech API (navegador) |
| IA (legendas) | Anthropic (Claude) |
| Hospedagem | Vercel |
| Testes | Vitest |

## Como rodar localmente

```bash
npm install
cp .env.local.example .env.local   # preencha as chaves (Supabase + Anthropic)
npm run db:push                     # cria as tabelas no Supabase Postgres
npm run dev                         # http://localhost:3000
```

### Variáveis de ambiente

| Variável | Para quê |
|----------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Chave pública (browser/Realtime) |
| `DATABASE_URL` | Connection string do Postgres (pooler 6543) |
| `ANTHROPIC_API_KEY` | Geração de legendas (módulo Rhema) |

## Qualidade

```bash
npm run check   # lint + typecheck + testes (rode antes de commitar)
```

## Estrutura

```
src/
├── app/         # rotas Next.js (camada fina)
├── features/    # timer/ e rhema/ — cada domínio autocontido
└── shared/      # ui e tipos reutilizados
docs/            # PRD, arquitetura, deploy, design
```

Detalhes da convenção em [`src/README.md`](src/README.md).
Arquitetura e deploy em [`docs/`](docs/) (PRD em [`docs/PRD.md`](docs/PRD.md)).

## Deploy

Push na `main` → deploy automático no Vercel. Migrações de schema: `npm run db:push`.
Plano completo da infraestrutura em [`docs/deploy/vercel-supabase.md`](docs/deploy/vercel-supabase.md).
