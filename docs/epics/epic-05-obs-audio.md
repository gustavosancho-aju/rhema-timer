# EPIC-5 — Captura de Áudio via OBS

**Owner:** @pm (Morgan)
**Status:** Draft
**Prioridade:** Alta
**Estimativa:** 1 sprint curto (~2h de dev)

## Contexto

O MVP atual usa o microfone do notebook, captando ruído ambiente (congregação, instrumentos, ar-condicionado). O OBS já roda no mesmo PC durante o culto e recebe o áudio **mixado da mesa de som**, que é limpo e com boa relação sinal/ruído. Capturar áudio direto do OBS elimina o ruído e melhora drasticamente a precisão da transcrição.

## Objetivo de Negócio

Aumentar a precisão da transcrição aproveitando o áudio já mixado da mesa de som, sem exigir hardware novo.

## Acceptance Criteria (Epic-level)

- [ ] Usuário pode escolher entre "Microfone padrão" e "OBS (áudio da mesa)" na UI
- [ ] Seleção persiste entre sessões (localStorage)
- [ ] Transcrição funciona identicamente em ambas as fontes
- [ ] Documentação de setup do OBS Virtual Audio incluída

## Abordagem Técnica

**OBS Virtual Audio Cable (VB-CABLE):**

1. Instalar VB-CABLE (driver gratuito de áudio virtual) uma única vez
2. No OBS: adicionar "Audio Monitor" apontando para `CABLE Input`
3. No navegador Chrome: selecionar `CABLE Output` como dispositivo de entrada
4. App Next.js detecta via `navigator.mediaDevices.enumerateDevices()` e permite escolher

**Por que não a API do obs-websocket?**
- Mais complexo, exige plugin adicional, stream binário
- Para o MVP, Virtual Audio resolve com zero código servidor

## Stories Previstas

| ID | Título | Estimativa |
|---|---|---|
| 5.1 | Setup OBS + VB-CABLE (documentação) | 30min |
| 5.2 | Selector de fonte de áudio na UI | 1h |
| 5.3 | Persistir escolha + teste em culto | 30min |

## Riscos

| Risco | Mitigação |
|---|---|
| VB-CABLE não instalar no Windows | Alternativa: OBS tem recurso nativo "Virtual Audio Output" a partir de v28 |
| Mesa de som com delay diferente da pregação | Monitor visual de "última palavra há Xs" |

## Dependências

- OBS 28+ instalado (✅ já confirmado)
- Permissão de instalar driver VB-CABLE (admin local)

## Definição de Pronto (Epic)

- [ ] Todas as stories em Done
- [ ] Testado em 1 culto real
- [ ] Documentação de setup no README
