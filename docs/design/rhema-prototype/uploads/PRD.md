# PRD — Sistema de Transcrição e Legendas para Cultos

**Versão:** 0.1 (rascunho)
**Autor:** Gustavo + Morgan (PM)
**Data:** 2026-04-21

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

## 11. Próximos passos

1. Escolher stack técnico → conversar com **@architect**.
2. Criar epic de implementação → `*create-epic`.
3. Começar pelo MVP: captura + transcrição ao vivo (sem curador ainda).
4. Depois: integrar agente curador e tela de revisão.
