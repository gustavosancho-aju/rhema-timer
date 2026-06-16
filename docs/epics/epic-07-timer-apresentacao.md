# Epic 07 — Timer de Apresentação (StageTimer Clone)

**Status:** Em desenvolvimento
**Owner:** Gustavo
**Criado:** 2026-04-23

---

## Objetivo do Epic

Entregar um **timer de apresentação controlado remotamente**, integrado como aba `/timer` no sistema existente "Legendas de Culto". Replica as funcionalidades do Stagetimer.io: múltiplas interfaces sincronizadas em tempo real via WebSocket, timer engine no cliente, e sistema de mensagens instantâneas para o apresentador.

## Critério de sucesso (Definition of Done)

- [ ] Aba `/timer` acessível a partir do header do sistema principal.
- [ ] Criação e gerenciamento de salas com links únicos por interface.
- [ ] Timer regressivo, progressivo e relógio funcionando em tempo real.
- [ ] Controller sincroniza com Viewer via WebSocket em < 200ms.
- [ ] Mensagens do Controller aparecem no Viewer instantaneamente.
- [ ] Timer continua rodando localmente se a conexão cair.
- [ ] Interfaces Operator, Moderator e Agenda funcionais.
- [ ] Auto-Advance, Wrap-up Colors e Chimes implementados.
- [ ] Blackout, Flash e Focus Mode operacionais.
- [ ] Importação de agenda via CSV.
- [ ] Banco SQLite local persistindo salas, timers e mensagens.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 16 + React 19 + TypeScript + Tailwind v4 |
| Real-time | WebSocket via `ws` + Custom Next.js Server |
| Banco | SQLite + Drizzle ORM |
| Estado cliente | Zustand |
| Timer isolado | Web Worker |
| IDs de sala | nanoid |

---

## Stories

| ID | Título | Status |
|----|--------|--------|
| 7.1 | Fundação: Custom Server + WebSocket + SQLite | Backlog |
| 7.2 | Gerenciamento de Salas | Backlog |
| 7.3 | Timer Engine (Web Worker) | Backlog |
| 7.4 | Interface Controller | Backlog |
| 7.5 | Interface Viewer | Backlog |
| 7.6 | Interface Operator | Backlog |
| 7.7 | Interface Moderator | Backlog |
| 7.8 | Interface Agenda | Backlog |
| 7.9 | Comportamentos Avançados de Timer | Backlog |
| 7.10 | Controles de Display (Blackout, Flash, Focus) | Backlog |
| 7.11 | Importação de Agenda via CSV | Backlog |
| 7.12 | Integração na Navegação Principal | Backlog |
