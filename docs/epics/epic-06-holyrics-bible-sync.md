# EPIC-6 — Detecção de Versículos + Integração Holyrics

**Owner:** @pm (Morgan)
**Status:** ❄️ Congelado (aguardando dependência externa)
**Data do congelamento:** 23/04/2026
**Prioridade:** Alta (quando descongelar)
**Estimativa:** ~8-10h de dev (4 stories)

## 🔴 Motivo do congelamento

Validação técnica em 23/04/2026 confirmou que a geração de token da API Server do Holyrics 2.28 **requer assinatura Holyrics Plan Advanced** (~R$ 60/mês ou R$ 750 vitalício). Testes realizados:

- ✅ API Server Local está ativa na porta 8091
- ✅ API responde a requisições
- ❌ "Gerenciar permissões" (gerador de token) bloqueado pelo Plan Advanced
- ❌ JavaScript Editor (bypass via custom action) também requer token válido — token é validado ANTES do JS rodar

**Conclusão:** sem Plan Advanced, não há caminho técnico viável.

## 📦 Estado do código

**TODO o código do EPIC-6 está implementado e commitado**, pronto pra ativar assim que um token válido estiver disponível:

- ✅ Story 6.1 — Detector bíblico (validado em teste real)
- ✅ Story 6.2 — Cliente Holyrics API (código pronto)
- ✅ Story 6.3 — UI de cards de sugestão (código pronto)
- ❄️ Story 6.4 — Integração end-to-end em culto (aguardando token)

## 🎯 Gatilhos para descongelar

O EPIC-6 deve ser retomado quando QUALQUER uma das condições for verdadeira:

1. Resposta positiva do suporte Holyrics oferecendo licença/parceria
2. Compra do Holyrics Plan Advanced (decisão comercial)
3. Primeiro cliente do Plano Pro que justifique o investimento



## Contexto

Durante a pregação, a pastora frequentemente cita versículos (diretamente com referência ou por alusão ao conteúdo). O operador do Holyrics precisa encontrar e projetar o versículo em tempo real — tarefa sujeita a erro e lentidão. Como o app já transcreve a fala em streaming, podemos rodar um segundo agente em paralelo que detecta versículos e sugere exibição no Holyrics com **1 clique de aprovação**.

## Objetivo de Negócio

Reduzir de ~15-30s para ~2s o tempo entre a pastora citar um versículo e ele aparecer na projeção, mantendo controle humano pra evitar erros.

## Decisões de Produto

| Decisão | Escolha | Justificativa |
|---|---|---|
| Automático vs. sugestão | **Sugestão com aprovação** | Risco de exibir versículo errado em culto ao vivo é inaceitável |
| Holyrics local ou rede | **Mesmo PC (localhost)** | Zero latência, sem config de rede |
| Versão Holyrics | **2.28** | API Server disponível |
| Porta API | **8091** (default Holyrics) | Configurável em .env |

## Acceptance Criteria (Epic-level)

- [ ] Agente detector roda em paralelo à transcrição (não bloqueia UI)
- [ ] Detecta citações diretas ("Isaías 43:19") E alusões ("eis que farei uma coisa nova")
- [ ] Cada detecção gera um **card de sugestão** na UI com: referência, texto do versículo, confiança (%)
- [ ] Card tem 2 botões: **Exibir no Holyrics** e **Descartar**
- [ ] Clicar "Exibir" envia comando à API Holyrics e versículo aparece na projeção em < 2s
- [ ] Token de API configurável via .env
- [ ] Falhas de API não quebram o app (degrada para log + toast de erro)

## Abordagem Técnica

### Arquitetura

```
[Transcrição ao vivo]
        │
        ▼
[Buffer deslizante 10s]
        │
        ▼
[Agente Detector Bíblico] ──► POST Claude com system prompt especializado
        │                         (retorna JSON: livro, cap, vers, confiança)
        ▼
[Card de Sugestão na UI]
        │ (operador clica "Exibir")
        ▼
[Holyrics API Client] ──► POST http://localhost:8091/api/SetBibleText
        │                    ?token=XXX&data={"book":19,"chapter":43,"verse":19}
        ▼
[Versículo projetado] ✨
```

### API Holyrics 2.28

- **Endpoint base:** `http://localhost:8091/api/`
- **Auth:** query param `?token={TOKEN}` (gerado em Holyrics → Configurações → API Server)
- **Comando principal:** `SetBibleText` — recebe book/chapter/verse/version
- **Outros úteis:** `GetBibleVersions`, `ShowBible`, `HideText`

## Stories Previstas

| ID | Título | Estimativa |
|---|---|---|
| 6.1 | Prompt + endpoint do detector bíblico (API route `/api/detect-versiculo`) | 2h |
| 6.2 | Cliente Holyrics API + config de token (.env + setup UI) | 2h |
| 6.3 | UI de cards de sugestão (lista, botões Exibir/Descartar, animação) | 3h |
| 6.4 | Integração end-to-end + debounce + teste em culto | 2h |

## Riscos

| Risco | Mitigação |
|---|---|
| Falso positivo (detecta versículo onde não há) | Threshold mínimo de confiança 0.7 + aprovação manual |
| Múltiplas detecções simultâneas | Debounce de 3s + dedupe por referência |
| API do Holyrics mudou na 2.28 | Story 6.2 inclui validação manual do formato antes de codar |
| Versículo detectado mas versão bíblica diferente da configurada no Holyrics | Story 6.2: ler `GetBibleVersions` e mapear |

## Dependências

- Holyrics 2.28 instalado com API Server habilitado (⚠️ **validar antes da Story 6.2**)
- Token de API gerado pelo usuário
- EPIC-5 **não é pré-requisito** — funciona com qualquer fonte de áudio

## Definição de Pronto (Epic)

- [ ] Todas as 4 stories em Done
- [ ] Testado em 1 culto real com pelo menos 3 versículos citados
- [ ] Zero exibições automáticas indevidas
- [ ] Documentação de setup do Holyrics API no README

## Questões em Aberto

1. Como tratar versículos longos (ex: Salmo 23 inteiro)? Exibir por partes ou completo?
2. Quando múltiplos versículos são citados em sequência, enfileirar ou sobrescrever card?
3. Suportar tradução específica da igreja (NVI, ARA, NTLH)?

→ Elicitar com pastora/operador antes de iniciar Story 6.1.
