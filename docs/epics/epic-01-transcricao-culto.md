# Epic 01 — Sistema de Transcrição e Legendas para Cultos

**Status:** Em planejamento
**PRD:** [docs/PRD.md](../PRD.md)
**Owner:** Gustavo
**Criado:** 2026-04-21

---

## Objetivo do Epic

Entregar a **v1 funcional** do sistema: uma página web onde o operador inicia a captura do áudio da mesa de som, vê a transcrição ao vivo e, ao parar, recebe 2 legendas geradas pelo agente curador para o líder revisar.

## Critério de sucesso (Definition of Done)

- [ ] Link aberto funcional hospedado na Vercel.
- [ ] Captura de áudio da mesa de som via navegador funciona.
- [ ] Transcrição ao vivo em pt-BR aparece com < 3s de latência.
- [ ] Ao parar, sistema gera 2 legendas em até 30s.
- [ ] Cada legenda exibe direcionamento (emotiva/reflexiva/bíblica) e tem botão "copiar".
- [ ] Testado em culto real ao menos 1 vez.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js + React + Tailwind |
| Captura áudio | Web Audio API / MediaRecorder |
| Transcrição | Google Cloud Speech-to-Text (streaming pt-BR) |
| LLM curador | Claude Sonnet 4.6 (API Anthropic) |
| Backend | Next.js API Routes |
| Hospedagem | Vercel |

---

## Breakdown em Stories

### 🧱 Fase 1 — Fundação

**Story 1.1 — Setup do projeto Next.js**
- Criar projeto Next.js 14 (app router) + Tailwind.
- Configurar variáveis de ambiente (Google API, Anthropic API).
- Deploy inicial "Hello World" na Vercel.

**Story 1.2 — UI básica**
- Layout: header, área de transcrição, painel lateral de legendas.
- Botões: "Selecionar microfone", "Iniciar", "Parar".
- Indicador visual de gravação.

### 🎙️ Fase 2 — Captura e Transcrição

**Story 2.1 — Captura de áudio do navegador**
- Listar dispositivos de entrada disponíveis.
- Permitir usuário escolher a entrada (mesa de som).
- Capturar stream de áudio com MediaRecorder.

**Story 2.2 — Integração Google Speech-to-Text (streaming)**
- Endpoint backend que faz proxy do stream de áudio → Google.
- Enviar resultados parciais via WebSocket ou SSE para o frontend.
- Exibir texto na tela com autoscroll.
- Diferenciar resultado "parcial" (cinza) de "final" (preto).

**Story 2.3 — Gerenciamento de sessão**
- Botão parar encerra captura limpa.
- Salvar transcrição completa em memória/localStorage.
- Indicador de tempo decorrido.

### ✍️ Fase 3 — Agente Curador

**Story 3.1 — Prompt do agente curador**
- Escrever system prompt em arquivo separado (`prompts/curador.md`).
- Persona: copywriter evangélico, referências CN/Bethel, precisão Kahneman.
- Definir formato de saída JSON estruturado.
- Testar prompt com transcrições de exemplo.

**Story 3.2 — Endpoint de geração de legendas**
- API route `/api/gerar-legendas` recebe transcrição.
- Chama Claude Sonnet 4.6 com prompt do curador.
- Valida resposta (JSON bem formado, 2 legendas, direcionamentos diferentes).
- Retorna ao frontend.

**Story 3.3 — Tela de revisão**
- Exibir as 2 legendas lado a lado em cards.
- Cada card mostra: texto, direcionamento (tag colorida), botão "copiar".
- Feedback visual ao copiar (toast).

### 🚀 Fase 4 — Polimento

**Story 4.1 — Histórico da sessão**
- Lista lateral das gerações anteriores da sessão.
- Possibilidade de regerar legendas (chamar curador de novo).

**Story 4.2 — Tratamento de erros**
- Erro de mic/permissão → mensagem clara.
- Falha Google/Claude → retry + mensagem amigável.
- Conexão caiu durante culto → tentar reconectar.

**Story 4.3 — Teste em culto real**
- Agendar culto de teste.
- Rodar sistema completo.
- Coletar feedback do líder.
- Ajustar prompt do curador se necessário.

---

## Ordem de execução sugerida

1. **Story 1.1 → 1.2** (base do projeto)
2. **Story 2.1 → 2.2 → 2.3** (coração: transcrição)
3. **Story 3.1 → 3.2 → 3.3** (curador + revisão)
4. **Story 4.x** (polimento)

## Riscos

| Risco | Mitigação |
|---|---|
| Latência alta do Google em pt-BR | Testar cedo; fallback para Deepgram |
| Qualidade da legenda fraca | Iterar prompt com exemplos reais de CN/Bethel |
| Mesa de som não reconhecida pelo navegador | Documentar setup (cabo USB → interface de áudio) |
| Culto longo estoura cota Google | Monitorar uso; alertar operador |

## Estimativa

- Fase 1: 1 dia
- Fase 2: 2–3 dias
- Fase 3: 2 dias
- Fase 4: 1–2 dias + 1 culto de teste

**Total: ~1 semana de trabalho focado** para MVP.
