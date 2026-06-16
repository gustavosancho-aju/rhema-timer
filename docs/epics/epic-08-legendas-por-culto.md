# Epic 08 — Legendas por Culto + Aprendizado do Curador

**Tipo:** Brownfield (sistema em produção)
**Autor:** Morgan (PM)
**Data:** 2026-06-15
**Status:** ✅ Concluído — todas as stories (08.0–08.5) implementadas e no ar

---

## Visão

Evoluir o módulo Rhema de "gera legendas isoladas" para um fluxo de **produção de
conteúdo por culto** que **aprende com as escolhas do usuário**:

1. Rotular cada gravação pelo **tipo de culto** (Sozo / Culto da Família / Culto de Quarta).
2. **Escolher** a legenda definitiva de cada gravação.
3. **Combinar** a última legenda escolhida do Sozo + a do Culto da Família numa
   **legenda final de post** (sintetizada por IA).
4. **Aprender:** as legendas escolhidas viram um acervo no Supabase, usado como
   **exemplos (few-shot)** para o agente curador melhorar com o tempo.

## Decisões de produto (validadas com o usuário)

- **Combinação:** a IA **sintetiza uma nova** legenda coesa a partir das duas escolhidas.
- **Aprendizado:** **few-shot** — legendas escolhidas entram como exemplos de estilo no prompt.
- **Persistência:** **Supabase** (server-side), pré-requisito do aprendizado. Substitui o
  histórico em `localStorage`.

## Modelo de dados (Supabase — nova tabela)

```
gravacoes
  id             text  PK
  culto_tipo     text  -- 'sozo' | 'familia' | 'quarta'
  legendas       jsonb -- [{ texto, direcionamento, justificativa }]
  escolhida_idx  integer NULL  -- índice da legenda escolhida
  duracao_ms     integer DEFAULT 0
  created_at     timestamptz DEFAULT now()
```

- Legenda escolhida = `legendas[escolhida_idx]`.
- Acervo de aprendizado = todas com `escolhida_idx` não nulo.

---

## Stories

### 08.1 — Schema + API de gravações (Supabase) · @dev
**Objetivo:** persistir gravações/legendas no Supabase (substitui localStorage).
- Tabela `gravacoes` (Drizzle pg-core) + `npm run db:push`.
- `src/features/rhema/lib/gravacoes.ts` (data layer async).
- API: `POST /api/gravacoes` (salvar), `GET /api/gravacoes` (listar recentes, filtro opcional por culto), `PATCH /api/gravacoes/[id]` (marcar escolhida).
- **AC:** salvar grava no Postgres; listar retorna as recentes; tudo tipado e testado (funções puras de seleção).

### 08.2 — Seletor de tipo de culto · @dev
**Objetivo:** marcar o culto ao salvar uma gravação.
- Seletor (Sozo / Culto da Família / Culto de Quarta) no `recorder.tsx`, perto de "Salvar no histórico".
- Envia `culto_tipo` no POST.
- **AC:** culto obrigatório ao salvar; aparece no painel de histórico (com rótulo/cor).

### 08.3 — Escolher legenda definitiva · @dev
**Objetivo:** marcar qual legenda é a do post.
- Botão "Escolher esta" em cada legenda gerada; marca `escolhida_idx` via PATCH.
- Destaque visual da escolhida; troca de escolha permitida.
- **AC:** exatamente uma escolhida por gravação; estado persistido no Supabase.

### 08.4 — Gerar post do domingo (combinar Sozo + Família) · @dev
**Objetivo:** post final unificado a partir das duas escolhidas.
- Botão "Gerar post do domingo".
- Busca última `sozo` escolhida + última `familia` escolhida.
- Novo prompt de **síntese** (combina as duas numa legenda final coesa) + endpoint `POST /api/legendas/combinar`.
- **AC:** gera 1 legenda final copiável; trata o caso de faltar uma das duas (mensagem clara).

### 08.5 — Aprendizado few-shot do curador · @dev
**Objetivo:** o curador imita o estilo das legendas escolhidas.
- `GET` das N legendas escolhidas mais recentes → injeta como **exemplos** no `CURADOR_SYSTEM_PROMPT` em `/api/legendas` (e na síntese da 08.4).
- Limitar nº de exemplos (custo/contexto); opção de filtrar por culto.
- **AC:** o prompt inclui exemplos reais escolhidos; geração fica mais consistente com o estilo aprovado.

---

## Ordem de implementação recomendada

```
08.1 (fundação: schema + API) → 08.2 (culto) → 08.3 (escolher)
      → 08.4 (combinar)  e  08.5 (aprendizado)  [podem ser paralelas]
```

## Fora de escopo (v1)

- Migrar/portar o histórico antigo do `localStorage` para o Supabase (recomeça-se do zero no banco).
- Fine-tuning de modelo (decidido: few-shot por enquanto).
- Postagem automática no Instagram.

## Riscos

- **R1 (alto):** `/api/legendas` usa o SDK com preset `claude_code` (assinatura local), não a `ANTHROPIC_API_KEY`. Pode não funcionar no Vercel. **Validar antes da 08.4/08.5** (que dependem da geração via IA).
- **R2 (médio):** acervo few-shot grande infla o prompt (custo/latência). Mitigar com limite de exemplos.
