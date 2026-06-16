# PRD — Timer de Apresentação (StageTimer Clone)

**Epic:** 07
**Status:** Implementado (Ready for Review)
**Owner:** Gustavo
**Criado:** 2026-04-23
**Versão:** 1.0

---

## 1. Resumo executivo

Sistema de timer de palco profissional controlado remotamente, integrado como aba `/timer` no sistema "Legendas de Culto". Replica as funcionalidades core do [Stagetimer.io](https://stagetimer.io): múltiplas interfaces sincronizadas em tempo real via WebSocket, timer engine client-side (resiliente a queda de conexão), sistema de mensagens ao apresentador, e controles de display.

## 2. Problema que resolve

Eventos ao vivo (cultos, conferências, apresentações) precisam de controle preciso de tempo no palco. Ferramentas comerciais como Stagetimer.io cobram por recursos essenciais e impõem limites de conexões/salas. A solução interna elimina custos recorrentes, mantém todos os dados locais e integra-se ao fluxo existente do sistema de legendas.

## 3. Usuários e personas

| Persona | Responsabilidade |
|---------|-----------------|
| **Operador principal** | Controla os timers pelo laptop (Controller) |
| **Apresentador / Palco** | Vê o timer em fullscreen (Viewer) |
| **Assistente de palco** | Opera via tablet com botões grandes (Operator) |
| **Moderador** | Envia mensagens ao palco, sem controlar timers (Moderator) |
| **Equipe / Bastidores** | Consulta o cronograma (Agenda) |

## 4. Requisitos funcionais

### 4.1 Gerenciamento de salas
- **FR-01** — Criar sala nomeada
- **FR-02** — Listar, renomear (inline) e deletar salas
- **FR-03** — Gerar 5 links únicos por sala (um para cada interface)
- **FR-04** — Copiar link para clipboard com feedback visual

### 4.2 Timer Engine
- **FR-05** — Três modos: countdown, countup, time-of-day
- **FR-06** — Transport: play, pause, resume, stop, reset
- **FR-07** — Apenas um timer ativo por sala (enforced)
- **FR-08** — Timer continua tickando localmente se WebSocket cair (Web Worker)
- **FR-09** — Reconexão automática ao WebSocket (retry 1.5s) com sincronização de estado
- **FR-10** — Nudge ±60s (time-warp) ajusta duração em tempo real

### 4.3 Interface Controller (desktop/laptop)
- **FR-11** — Criar/editar timer (título, apresentador, tipo, duração HH:MM:SS, 12 cores, auto-advance)
- **FR-12** — Reordenar timers via setas ↑↓
- **FR-13** — Deletar timer com confirmação
- **FR-14** — Banner do timer ativo com cor dinâmica (verde/âmbar/vermelho)
- **FR-15** — Painel de mensagens (branco/verde/vermelho) + Ctrl+Enter
- **FR-16** — Botões de display controls (Blackout, Flash, Focus Mode)
- **FR-17** — Botão Flash no painel de mensagens (atalho)
- **FR-18** — Contador de conexões ativas + indicador WS
- **FR-19** — Importação de agenda via CSV (com preview e validação)

### 4.4 Interface Viewer (fullscreen)
- **FR-20** — Timer gigante (24vw), tabular-nums, monospace
- **FR-21** — Título e apresentador abaixo do timer
- **FR-22** — Barra de progresso colorida (verde → amarelo → vermelho)
- **FR-23** — Wrap-up colors escalonados (normal / 5min / 1min / crítico)
- **FR-24** — Chimes sonoros (WebAudio) a 60s, 10s e 0s
- **FR-25** — Mensagem em overlay colorido (branco/verde/vermelho)
- **FR-26** — Double-click ativa fullscreen real
- **FR-27** — Pisca (flash) quando acionado pelo Controller
- **FR-28** — Blackout oculta tudo (tela preta)
- **FR-29** — Focus Mode esconde timer, mostra só a mensagem
- **FR-30** — Indicador sutil de status de conexão WS (ponto no canto)

### 4.5 Interface Operator (tablet)
- **FR-31** — Layout otimizado para toque (botões grandes)
- **FR-32** — Timer ativo em destaque
- **FR-33** — Play/Pause/Stop/Reset + Nudge ±1min
- **FR-34** — Lista de timers com botão "▶ Ativar"
- **FR-35** — Formulário rápido de mensagem (3 cores)

### 4.6 Interface Moderator
- **FR-36** — Timer ativo em modo leitura (sem controles)
- **FR-37** — Formulário de envio de mensagem (texto + cor)
- **FR-38** — Histórico de mensagens enviadas (sessão atual)
- **FR-39** — Botão "Limpar palco" remove mensagem atual

### 4.7 Interface Agenda
- **FR-40** — Lista read-only de todos os timers na ordem
- **FR-41** — Item ativo destacado (▶), finalizados marcados (✓)
- **FR-42** — Tempo total do evento calculado
- **FR-43** — Responsivo (desktop/mobile)

### 4.8 Comportamentos avançados
- **FR-44** — Auto-advance: timer com flag liga o próximo quando termina
- **FR-45** — Auto-advance schedulado server-side via `setTimeout`
- **FR-46** — Broadcast de `timer:finished` quando countdown zera

### 4.9 Persistência
- **FR-47** — Banco SQLite local (`timer.db`) com Drizzle ORM
- **FR-48** — 4 tabelas: `rooms`, `timers`, `messages`, `connections`
- **FR-49** — Foreign keys com `ON DELETE CASCADE`
- **FR-50** — WAL mode habilitado

## 5. Requisitos não funcionais

| Categoria | Requisito |
|-----------|-----------|
| **Latência** | Sincronização entre clientes da mesma sala < 200ms em LAN |
| **Resiliência** | Timer continua correto se WS cair (cálculo local via `startedAt + elapsedMs`) |
| **Reconexão** | Automática a cada 1.5s até restabelecer |
| **Tick rate** | Web Worker emite tick a cada 100ms |
| **Concorrência** | Apenas 1 timer em estado `running` por sala |
| **Navegadores** | Chromium, Firefox, Safari recentes (Web Audio, WebSocket, Web Workers) |
| **Rede** | Dados trafegados por show: ~poucos KB (eventos JSON compactos) |

## 6. Arquitetura

### 6.1 Stack
- **Frontend:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4
- **Servidor:** Custom server Node.js (`server.ts`) wrapping Next.js + WebSocket (lib `ws`)
- **Banco:** SQLite + Drizzle ORM + better-sqlite3
- **Estado cliente:** Zustand
- **Timer isolado:** Web Worker (JS puro, 100ms tick)
- **IDs:** nanoid (10 chars)

### 6.2 Topologia

```
┌─────────────────────────────────────────────────┐
│  Custom Node server (server.ts)                 │
│  ┌──────────────────┐   ┌────────────────────┐ │
│  │ Next.js handler  │   │ WebSocketServer    │ │
│  │ (HTTP routes +   │   │ (/ws/timer)        │ │
│  │  SSR)            │◄──┤ room registry +    │ │
│  │                  │   │ broadcast logic    │ │
│  └────────┬─────────┘   └─────────┬──────────┘ │
│           │                       │             │
│           └──────┬────────────────┘             │
│                  ▼                               │
│          ┌──────────────┐                        │
│          │  SQLite DB   │                        │
│          │  (timer.db)  │                        │
│          └──────────────┘                        │
└─────────────────────────────────────────────────┘
                   ▲
      WebSocket    │    HTTP (Next SSR + REST)
                   │
  ┌────────┬───────┼────────┬──────────┬─────────┐
  ▼        ▼       ▼        ▼          ▼         ▼
Controller Viewer Operator Moderator  Agenda   UI de
(mesa)  (palco)  (tablet) (apoio)   (leitura) salas
```

### 6.3 Protocolo WebSocket

**Cliente → Servidor:**
- `ping`
- `join { roomId, clientType }`
- `timer:start|pause|resume|stop|reset { timerId }`
- `timer:nudge { timerId, deltaSec }`
- `message:send { text, color }`
- `message:clear`
- `display:blackout { active }` / `display:focus { active }` / `display:flash`
- `room:sync-all` / `room:refresh`

**Servidor → Cliente:**
- `pong`
- `joined { roomId }`
- `room:state { timers[], activeTimerId, blackout, focusMode, currentMessage }`
- `timer:updated { timer }`
- `timer:finished { timerId }`
- `connections:update { count }`
- `message:received { message }` / `message:clear`
- `display:blackout` / `display:focus` / `display:flash`
- `error { message }`

### 6.4 Modelo de dados (SQLite)

**rooms** (id PK, name, createdAt, updatedAt)

**timers** (id PK, roomId FK, title, presenter, type, duration, scheduledStart, color, order, status, startedAt, elapsedMs, autoAdvance, wrapupAt, createdAt, updatedAt)

**messages** (id PK, roomId FK, text, color, createdAt)

**connections** (id PK, roomId FK, type, label, connectedAt)

## 7. Fora de escopo

- Autenticação / contas de usuário
- Monetização / limites de planos
- API pública HTTP para automação externa (Stream Deck/Companion)
- Integração com NDI/OBS nativa
- Custom Output Designer (drag-and-drop)
- Cloud deployment (sistema roda 100% local)
- Internacionalização (interface em pt-BR fixo)

## 8. Critérios de sucesso

- [x] Ciclo completo **start → pause → resume → stop** sincroniza entre clientes em tempo real
- [x] Timer continua correto mesmo se WebSocket cair e reconectar
- [x] Todas as 5 interfaces renderizam e respondem a mudanças de estado
- [x] Wrap-up colors e chimes disparam nos momentos corretos (60s, 10s, 0s)
- [x] Importação CSV cria timers em lote
- [x] Smoke test HTTP retorna 200 em todas as rotas
- [ ] **Validar em evento real** (teste de campo pendente)

## 9. Stories entregues

Todas as 12 stories do Epic 07 estão em `docs/stories/epic-07/`:

| Story | Título | Estimativa |
|-------|--------|-----------|
| 7.1 | Fundação (Custom Server + WebSocket + SQLite) | 3 pts |
| 7.2 | Gerenciamento de Salas | 2 pts |
| 7.3 | Timer Engine (Web Worker) | 3 pts |
| 7.4 | Interface Controller | 5 pts |
| 7.5 | Interface Viewer | 3 pts |
| 7.6 | Interface Operator | 2 pts |
| 7.7 | Interface Moderator | 2 pts |
| 7.8 | Interface Agenda | 2 pts |
| 7.9 | Comportamentos Avançados | 4 pts |
| 7.10 | Controles de Display | 2 pts |
| 7.11 | Importação CSV | 2 pts |
| 7.12 | Integração na Navegação | 1 pt |
| **Total** | | **31 pts** |

## 10. Riscos e mitigações

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Next.js dev bundler separa módulos entre API routes e custom server (duplicação de estado WS) | Alto | Cliente dispara `room:sync-all` após mutações REST — quem manda o sync é sempre o WS em si, que compartilha estado com o server real |
| Web Audio requer user gesture | Médio | Chimes iniciam só após primeira interação do usuário com a página |
| Drift de clock entre dispositivos | Médio | Timer sincroniza por `startedAt` + `elapsedMs` do servidor; cliente calcula delta local |
| SQLite em WAL pode criar arquivos auxiliares | Baixo | `.gitignore` cobre `timer.db-journal`, `-wal`, `-shm` |

## 11. Próximos passos sugeridos

1. Teste em evento real (culto) para validar UX sob pressão
2. Opcional: exportar agenda da sala para CSV
3. Opcional: histórico persistente de mensagens no Moderator
4. Opcional: endpoint HTTP API pública para integração com Stream Deck/Companion
5. Opcional: Custom Output Designer (drag-and-drop) para viewers customizados

---

**Referência de interfaces:**
- Salas: `/timer`
- Controller: `/timer/[roomId]/controller`
- Viewer: `/timer/[roomId]/viewer`
- Operator: `/timer/[roomId]/operator`
- Moderator: `/timer/[roomId]/moderator`
- Agenda: `/timer/[roomId]/agenda`
