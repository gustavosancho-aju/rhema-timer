# Deploy no Vercel + Supabase — Plano de Migração

> Objetivo: rodar o app inteiro (Rhema + Timer) no Vercel. O Timer hoje usa
> WebSocket próprio + SQLite local, que **não** funcionam no Vercel. Este plano
> troca essas peças por **Supabase** (Postgres + Realtime).

## Arquitetura alvo

```
                    ┌──────────────── Vercel ────────────────┐
   Navegador  ◄────►│  Next.js (Rhema + Timer)               │
       │            │   • páginas e componentes              │
       │            │   • API routes (legendas, timers CRUD) │
       │            └───────────────┬────────────────────────┘
       │  Realtime (canais)         │ SQL
       ▼                            ▼
  ┌─────────────── Supabase ──────────────────┐
  │  Realtime  (broadcast por sala)           │  ← substitui WebSocket
  │  Postgres  (rooms, timers, messages)      │  ← substitui SQLite
  └───────────────────────────────────────────┘
```

### Decisões de design

| Tema | Hoje | Depois |
|------|------|--------|
| Banco | SQLite local (`timer.db`) | **Supabase Postgres** (Drizzle `postgres-js`) |
| Realtime | Servidor `ws` em `server.ts` | **Supabase Realtime** (canal `room:{id}`) |
| Mutação de timer | Mensagem WS → lógica no servidor | **API route** muta no Postgres → emite broadcast |
| Auto-advance (countdown→0) | `setTimeout` em memória no servidor | **Cliente controller** detecta fim e chama a API |
| Estado efêmero (blackout/foco/mensagem) | Memória do servidor | Eventos de **broadcast** + tabela `room_state` |
| Servidor | `tsx server.ts` (custom) | **Next.js padrão** (`next start`) — sem server.ts |

> **Por que o cliente dirige o auto-advance:** no Vercel não há processo
> persistente para "acordar" quando o countdown zera. Como sempre há uma tela
> de controle aberta, ela calcula o fim e dispara a troca via API. Simples e
> confiável para este caso de uso.

## O que VOCÊ precisa criar (uma vez)

1. **Conta no Supabase** (grátis): https://supabase.com → New Project.
2. Copiar de *Project Settings → API* e *Database*:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `DATABASE_URL` (connection string do Postgres — use a porta **6543**, pooler)
3. **Conta no Vercel** (grátis): https://vercel.com → import do repositório `rhema-timer`.
4. Colar as mesmas variáveis em *Vercel → Project → Settings → Environment Variables*
   (+ `ANTHROPIC_API_KEY` que o Rhema já usa).

Me avise quando tiver as chaves — aí eu rodo a migração do banco e ligo o realtime.

## Fases de implementação

- [x] **Fase 0 — Fundações:** schema Postgres, cliente Supabase, config Drizzle, env.
- [x] **Fase 1 — Banco:** data layer async (Postgres); tabelas criadas via `db:push`.
- [x] **Fase 2 — API routes:** handlers `async`; broadcast após mutação.
- [x] **Fase 3 — Realtime cliente:** `use-realtime-timer` (Supabase) + estado inicial via REST.
- [x] **Fase 4 — Auto-advance + estado efêmero:** controller dispara; tabela `room_state`.
- [x] **Fase 5 — Remover `server.ts`:** scripts Next padrão; deps mortas removidas.
- [ ] **Deploy:** importar repo no Vercel + variáveis de ambiente (passo do usuário).

## Comandos úteis (depois das chaves)

```bash
cd apps/rhema
npm run db:push      # cria as tabelas no Supabase Postgres
npm run build        # valida o build de produção
```
