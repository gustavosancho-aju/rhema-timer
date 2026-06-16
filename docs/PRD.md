# PRD — Sistema de Transcrição e Legendas para Cultos

**Versão:** 1.0 (em produção)
**Autor:** Gustavo + Morgan (PM)
**Data:** 2026-04-21 · **Última atualização:** 2026-06-15
**Status:** 🟢 No ar (Vercel + Supabase) — ver §12

---

## 1. Visão Geral

Sistema **web** que, ao ser ativado durante um culto, capta o áudio da mesa de som, **transcreve ao vivo** a palavra da pastora e, ao final, um **agente curador especializado em legendas evangélicas** gera **2 opções de legenda** para avaliação do líder.

## 2. Problema

Hoje, produzir legendas de cultos para Instagram exige:
- Ouvir a gravação inteira depois do culto.
- Transcrever manualmente.
- Escrever legendas no estilo das referências (CN / Bethel).
- Ciclo lento → atrasa a publicação.

## 3. Objetivo

Reduzir o tempo entre o culto e a publicação de legendas no Instagram, mantendo qualidade editorial das referências.

## 4. Usuários

| Usuário | O que faz |
|---------|-----------|
| **Operador** (você) | Ativa o sistema, conecta o áudio, acompanha a transcrição |
| **Líder** (curador humano) | Lê as 2 legendas geradas e escolhe a melhor para postar |

## 5. Escopo (MVP)

### ✅ Incluído
1. Botão **"Iniciar / Parar"** a transcrição.
2. Captura de áudio da **mesa de som** (entrada de linha / microfone selecionável no navegador).
3. Transcrição **ao vivo em português** exibida na tela.
4. Ao parar: envia transcrição completa para o **agente curador (IA)**.
5. Agente gera **2 legendas** por rodada, cada uma com:
   - Texto da legenda.
   - **Direcionamento** (rótulo): `emotiva` | `reflexiva` | `bíblica`.
6. Tela de revisão: líder lê as duas, copia a escolhida.

### ❌ Fora do escopo (v1)
- Postagem/agendamento automático no Instagram.
- Múltiplos idiomas.
- Edição avançada da transcrição (correção palavra a palavra).
- Identificar quem está falando (diarização).

## 6. Requisitos Funcionais

| ID | Requisito |
|----|-----------|
| RF-01 | App web acessível por navegador (Chrome). |
| RF-02 | Seleção de dispositivo de entrada de áudio (mesa de som). |
| RF-03 | Botão iniciar/pausar/parar captura. |
| RF-04 | Transcrição streaming em pt-BR com latência < 3s. |
| RF-05 | Exibição do texto transcrito em tela, com autoscroll. |
| RF-06 | Ao parar, enviar transcrição ao agente curador. |
| RF-07 | Retornar 2 legendas + direcionamento de cada uma. |
| RF-08 | Copiar legenda com 1 clique. |
| RF-09 | Histórico local das transcrições e legendas da sessão. |

## 7. Requisitos Não-Funcionais

- **Latência transcrição:** < 3 segundos.
- **Duração de culto:** suportar até 3 horas contínuas.
- **Privacidade:** áudio e transcrição não ficam públicos.
- **Custo:** usar APIs pagas sob demanda (ativa só durante culto).

## 8. Agente Curador — Especificação

**Persona:** Copywriter expert em comunicação de igrejas evangélicas, com precisão de linguagem inspirada em Daniel Kahneman (palavras exatas, sem rodeio).

**Referências de estilo:**
- Instagram @cnaracaju
- Instagram @cnfortaleza
- Instagram @cnbrasilia
- Igrejas Bethel

**Saída obrigatória (formato JSON):**
```json
{
  "legendas": [
    { "texto": "...", "direcionamento": "emotiva" },
    { "texto": "...", "direcionamento": "reflexiva" }
  ]
}
```

**Regras:**
- As 2 legendas **devem ter direcionamentos diferentes** (variação).
- Foco: **palavra da pastora**, não descrição do culto.
- Sem emojis em excesso (máximo 1–2).
- Tom: reverente, direto, sem clichês.

## 9. Arquitetura (visão alta)

```
[Mesa de Som] → [Navegador / WebAudio API]
       ↓
[Serviço de Transcrição Streaming] (ex: OpenAI Realtime, Deepgram, Google Speech)
       ↓ (texto ao vivo)
[Interface Web — React/Next.js]
       ↓ (ao finalizar)
[Agente Curador — LLM com prompt especializado]
       ↓
[Tela de revisão] → Líder escolhe → Copia
```

## 10. Stack Técnico (decidido)

- **Frontend:** Next.js (React)
- **Hospedagem:** Vercel
- **Transcrição ao vivo:** **Google Cloud Speech-to-Text** (streaming, pt-BR) — usuário já possui API
- **Agente curador (LLM):** **Claude Sonnet 4.6** (Anthropic API)
- **Acesso:** link aberto (sem login)
- **Áudio:** Web Audio API (seleção de dispositivo na UI)

## 11. Próximos passos (original — concluídos)

1. ~~Escolher stack técnico → conversar com **@architect**.~~ ✅
2. ~~Criar epic de implementação.~~ ✅
3. ~~Começar pelo MVP: captura + transcrição ao vivo.~~ ✅ (+ curador, + timer)

---

## 12. Evolução — Sessão 2026-06-15

> Esta seção registra o trabalho que levou o projeto do MVP em rascunho a um
> **sistema completo em produção**. Conduzido pelos agentes @architect (Aria) e
> @aiox-master (Orion).

### 12.1 Estrutura profissionalizada
- App movido de `web/` → **`apps/rhema/`**; protótipos de UI → `docs/design/`.
- Código reorganizado **por feature**: `src/features/timer`, `src/features/rhema`,
  `src/shared` (camada de rotas `app/` fina). Convenção em `apps/rhema/src/README.md`.
- `README.md` na raiz; nomes de pasta sem espaços.

### 12.2 Qualidade e testes
- **Vitest** configurado — **25 testes** (funções puras do timer + histórico).
- Scripts: `test`, `typecheck`, e `check` (lint + typecheck + test) antes de commitar.
- Lint 100% limpo; correções: `Date.now()` impuro em render, fontes via `next/font`.

### 12.3 Nova feature — Histórico das últimas gravações (atualiza RF-09)
- Botão **"Salvar no histórico"** (manual) guarda as **legendas geradas** + data/duração.
- Painel **"Últimas gravações"** com **limite de 4** (a 5ª descarta a mais antiga),
  **Restaurar** e **Limpar**. Persistência em `localStorage`.

### 12.4 Timer de palco — migração para serverless (Vercel-ready)
O timer (salas multi-tela sincronizadas: controller/operator/moderator/viewer/agenda)
foi **rearquitetado** para rodar no Vercel:

| Antes | Depois |
|-------|--------|
| SQLite local (`better-sqlite3`) | **Supabase Postgres** (Drizzle async) |
| Servidor WebSocket próprio (`server.ts`) | **Supabase Realtime** (broadcast via REST) |
| Auto-advance via `setTimeout` no servidor | Dirigido pelo **cliente controller** |
| Estado efêmero em memória | Tabela **`room_state`** (blackout/foco/mensagem) |

Mutação via API routes → broadcast no canal `room:{id}`; sem processo persistente.

### 12.5 Deploy
- **Hospedagem:** Vercel (projeto `rhema-timer`), deploy automático a cada `git push` na `main`.
- **Banco/Realtime:** Supabase (projeto `rhema-timer`, região São Paulo).
- **Repo:** `github.com/gustavosancho-aju/rhema-timer`.
- **Status:** 🟢 verificado em produção (página `/timer` lê o Postgres com sucesso).

### 12.6 Stack atualizado (substitui §10 onde divergir)
- **Frontend:** Next.js 16 + React 19 + TypeScript + Tailwind v4
- **Hospedagem:** Vercel
- **Banco:** Supabase Postgres (Drizzle ORM)
- **Tempo real:** Supabase Realtime
- **Transcrição ao vivo:** Web Speech API (navegador) — pt-BR
- **Curador (LLM):** Claude (Anthropic API)
- **Estado cliente:** Zustand
- **Testes:** Vitest

### 12.7 Próximos passos sugeridos
1. Teste fim-a-fim do Realtime multi-tela (controller + viewer em abas separadas).
2. Configurar domínio próprio no Vercel (opcional).
3. Resetar a senha do banco no Supabase (foi exposta no chat durante o setup).
4. Ampliar cobertura de testes (lógica do rhema, `rooms`/`messages`).

> Detalhes técnicos da migração: `docs/deploy/vercel-supabase.md`.

---

## 13. Epic 08 — Legendas por Culto + Aprendizado do Curador

**Status:** ✅ Concluído (2026-06-15) · Spec: `docs/epics/epic-08-legendas-por-culto.md`

Evolui o módulo Rhema de "gera legendas isoladas" para um fluxo de produção de
conteúdo por culto que **aprende com as escolhas do líder**.

### 13.1 Contexto
No domingo há dois cultos — **Sozo** e **Culto da Família** — que viram **um post
único** no Instagram. O Culto de Quarta é avulso.

### 13.2 Entregas

| Story | O que faz |
|-------|-----------|
| 08.0 | Rotas de IA (`/api/legendas`, `/api/detectar-versiculo`) migradas do SDK local para a **API Anthropic** (`ANTHROPIC_API_KEY`) — funcionam no Vercel |
| 08.1 | Tabela **`gravacoes`** no Supabase (`culto_tipo`, `legendas` jsonb, `escolhida_idx`, `duracao_ms`) + API (POST/GET/PATCH) |
| 08.2 | **Seletor de culto** (Sozo / Culto da Família / Culto de Quarta) ao salvar |
| 08.3 | Botão **"Escolher esta"** marca a legenda definitiva de cada gravação |
| 08.4 | **"Gerar post do domingo"**: combina a última legenda escolhida do Sozo + a do Culto da Família; a IA **sintetiza uma legenda final** |
| 08.5 | **Aprendizado few-shot**: legendas escolhidas viram exemplos de estilo injetados no prompt do curador e do combinador |

### 13.3 Modelos de IA (por custo/latência)
- **Detector de versículos:** `claude-haiku-4-5` (alta frequência, tempo real)
- **Legendas e combinador:** `claude-sonnet-4-6`

### 13.4 Persistência
O histórico migrou de `localStorage` para **Supabase Postgres** (uma fonte de
verdade). O painel "Últimas gravações" mostra rótulo de culto e legenda escolhida.

> Próximo passo: integrar o agente curador à tela de revisão e ampliar testes.
