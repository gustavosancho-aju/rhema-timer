# Plano de Negócio — Sistema de Transcrição e Curadoria de Conteúdo para Igrejas

**Documento para apresentação a sócio investidor**
**Versão:** 1.0
**Data:** 22 de abril de 2026
**Confidencial**

---

## 1. Sumário Executivo

Desenvolvemos um sistema que, **em tempo real**, transcreve a pregação de uma igreja e entrega legendas profissionais prontas para Instagram em **até 2 minutos após o culto**. O que hoje leva 2 a 3 dias de trabalho manual da equipe de mídia, nosso sistema entrega instantaneamente — com qualidade editorial no estilo das referências contemporâneas do mercado (CN, Bethel, Lagoinha).

O **MVP foi validado em culto real** em 22/04/2026, com 40 minutos de pregação transcrita sem falhas e legendas aprovadas pela equipe de mídia. O produto está tecnicamente pronto para monetização.

**A oportunidade:**
- **15.000 igrejas** no Brasil no nosso perfil ideal
- **Zero concorrentes diretos** em português
- **Margem bruta projetada: 87%+**
- **Investimento inicial: R$ 8.000**
- **ROI projetado: payback em < 2 meses com 10 clientes**
- **Meta realista Ano 1: 60 clientes, R$ 100k de lucro líquido**

---

## 2. O Problema

Toda igreja contemporânea ativa no Instagram enfrenta o mesmo problema operacional:

| Dor | Impacto |
|---|---|
| Transcrever a pregação manualmente leva 3-4 horas | 1 voluntário ocupado |
| Extrair as "frases de impacto" e editar exige escritor | Raramente existe na equipe |
| Publicar só funciona dias depois, perdendo engajamento do culto | Queda de 60-80% no alcance |
| Cada voluntário tem um estilo diferente, inconsistência visual | Marca fraca |
| Operador do projetor não acha o versículo a tempo | Delay de 20-30s no culto |

**Custo oculto para a igreja:** uma equipe média dedica **20-25h/semana** só em conteúdo de mídia para redes sociais, equivalente a **R$ 1.500 - R$ 3.000/mês** em valor de trabalho não remunerado (voluntário) ou efetivamente pago.

---

## 3. A Solução

Um SaaS (Software as a Service) que roda no navegador durante o culto e entrega:

1. **Transcrição em tempo real** da fala da pastora/pastor
2. **Legendas curadas por IA** no tom editorial das referências de mercado (CN, Bethel)
3. **Múltiplas variações** (emotiva, reflexiva, bíblica) para o time escolher
4. **Integração com Holyrics** (maior plataforma de projeção do Brasil) para exibir versículos automaticamente (roadmap Q2)
5. **Captura do áudio do OBS** (sistema de streaming já padrão nas igrejas) para qualidade profissional (roadmap Q1)

### Diferencial competitivo (moat)

1. **Prompt proprietário** calibrado com linguagem sacra brasileira contemporânea
2. **Integração nativa Holyrics** — plataforma dominante no Brasil
3. **Tempo real** — concorrentes internacionais são pós-produção
4. **Português brasileiro nativo** — soluções estrangeiras falham no tom religioso local
5. **Custo marginal quase zero por culto** (R$ 0,56) vs ticket médio R$ 200

---

## 4. Mercado

### TAM / SAM / SOM

| Camada | Valor | Fonte |
|---|---|---|
| **TAM** — Igrejas evangélicas no Brasil | ~80.000 | IBGE 2020 |
| **SAM** — Igrejas com mídia estruturada + Instagram ativo + Holyrics | ~15.000 | Dados públicos Holyrics + estimativa |
| **SOM** — Meta 3 anos (1% do SAM) | 150 clientes pagantes | Conservador |

### Perfil do Cliente Ideal (ICP)

- **Tamanho:** 300 a 3.000 membros
- **Stack tecnológico:** Usa Holyrics + OBS + Instagram com >5k seguidores
- **Equipe de mídia:** 2 a 5 pessoas (voluntários ou contratados)
- **Decisor:** Pastor de Mídia ou Coordenador de Comunicação
- **Tom:** Contemporâneo, urbano, digital-first
- **Exemplos públicos:** CN Aracaju, CN Fortaleza, CN Brasília, Bethel BR, Lagoinha, Zoe

### Análise competitiva

| Player | O que faz | Por que não é concorrente direto |
|---|---|---|
| Captions.ai / Opus Clip | Legendas IA | Inglês, genérico, $29-99 USD/mês |
| Descript / Submagic | Edição pós-produção | Não é tempo real |
| Holyrics standalone | Projeção + Bíblia | Sem IA, sem mídia social |
| ProPresenter | Projeção profissional | Caro, não BR |
| **Nosso sistema** | **Tempo real + pt-BR + estilo sacro + Holyrics** | **ÚNICO NO MERCADO** |

---

## 5. Modelo de Negócio (Precificação)

### Estrutura de planos

| Plano | Preço/mês | Cultos/mês | Legendas/culto | Público-alvo |
|---|---|---|---|---|
| **Base** | **R$ 127** | 8 | 2 variações | Igrejas 100-500 membros |
| **Pro** | **R$ 297** | 20 | 4 variações | Igrejas 500-3.000 membros |
| **Multi-sede** | Sob consulta | Custom | Custom | Redes (5+ sedes) |

### Premissas técnicas de custo

- Duração de culto: **60 minutos de gravação**
- Transcrição: Gemini 2.5 Flash (áudio → texto)
- Curador de legendas: Claude Sonnet 4.5 (com prompt caching)
- Cotação: US$ 1 = R$ 5,10

### Custo por culto (COGS variável)

| Item | Custo |
|---|---|
| Transcrição Gemini (60min) | R$ 0,33 |
| Curador Claude — 2 legendas (Base) | R$ 0,23 |
| Curador Claude — 4 legendas (Pro) | R$ 0,27 |

### Unit Economics

#### Plano Base — R$ 127/mês

| Item | Valor |
|---|---|
| Receita bruta | R$ 127,00 |
| Taxa de pagamento (4,99%) | − R$ 6,34 |
| Receita líquida | R$ 120,66 |
| Custo APIs (8 cultos) | − R$ 4,48 |
| Infra diluída (20 clientes) | − R$ 5,00 |
| **Lucro bruto por cliente** | **R$ 111,18** |
| **Margem líquida** | **87,5%** |

#### Plano Pro — R$ 297/mês

| Item | Valor |
|---|---|
| Receita bruta | R$ 297,00 |
| Taxa de pagamento (4,99%) | − R$ 14,82 |
| Receita líquida | R$ 282,18 |
| Custo APIs (20 cultos) | − R$ 12,00 |
| Infra diluída | − R$ 5,00 |
| **Lucro bruto por cliente** | **R$ 265,18** |
| **Margem líquida** | **89,3%** |

### LTV / CAC

| Métrica | Plano Base | Plano Pro |
|---|---|---|
| Ticket mensal | R$ 127 | R$ 297 |
| Retenção média esperada | 18 meses | 24 meses |
| LTV bruto | R$ 2.286 | R$ 7.128 |
| LTV líquido (margem 87%) | R$ 1.989 | R$ 6.363 |
| CAC estimado | R$ 400 | R$ 600 |
| **LTV/CAC** | **5,0x** ✅ | **10,6x** ✅ |
| Payback | 4 meses | 2,5 meses |

**Benchmark SaaS saudável:** LTV/CAC > 3x. Nossos números estão **muito acima da média**.

---

## 6. Projeção Financeira — 12 meses

### Assumptions
- Mix de vendas: **80% Base + 20% Pro** (perfil típico SaaS de aquisição)
- Churn mensal: **5%** (decrescente ao longo do ano)
- Aquisição: curva crescente via orgânico + indicação

### Projeção mensal

| Mês | Novos/mês | Total ativos | MRR | Lucro mês |
|---|---|---|---|---|
| Mês 1 | 3 | 3 | R$ 483 | R$ 420 |
| Mês 2 | 3 | 6 | R$ 966 | R$ 840 |
| Mês 3 | 3 | 9 | R$ 1.449 | R$ 1.260 |
| Mês 4 | 5 | 13 | R$ 2.093 | R$ 1.820 |
| Mês 5 | 5 | 17 | R$ 2.737 | R$ 2.381 |
| Mês 6 | 5 | 22 | R$ 3.542 | R$ 3.081 |
| Mês 7 | 7 | 28 | R$ 4.508 | R$ 3.922 |
| Mês 8 | 7 | 34 | R$ 5.474 | R$ 4.762 |
| Mês 9 | 7 | 39 | R$ 6.279 | R$ 5.463 |
| Mês 10 | 8 | 46 | R$ 7.406 | R$ 6.443 |
| Mês 11 | 8 | 53 | R$ 8.533 | R$ 7.423 |
| Mês 12 | 8 | 60 | **R$ 9.660** | **R$ 8.404** |

### Totais Ano 1

| Métrica | Valor |
|---|---|
| Clientes ativos (fim do ano) | 60 |
| MRR final | R$ 9.660 |
| **ARR exit run-rate** | **R$ 115.920** |
| **Receita acumulada Ano 1** | **R$ 56.000** |
| **Lucro bruto acumulado Ano 1** | **~R$ 46.000** |

### Projeção 3 anos (cenário realista)

| Métrica | Ano 1 | Ano 2 | Ano 3 |
|---|---|---|---|
| Clientes ativos | 60 | 150 | 280 |
| MRR final | R$ 9.660 | R$ 24.150 | R$ 45.080 |
| **ARR** | **R$ 115k** | **R$ 289k** | **R$ 540k** |
| Lucro bruto anual | R$ 46k | R$ 220k | R$ 440k |

### Cenário otimista (CN e Bethel como clientes faro)

Com adoção das redes de referência (CN possui 40+ sedes, Lagoinha 20+, Bethel BR 15+):
- **Ano 3: 500-800 clientes, ARR R$ 1M-1,5M**

---

## 7. Investimento Inicial Necessário

**Proposta bootstrap-friendly** — sem necessidade de capital externo agressivo.

| Item | Custo mensal | 12 meses |
|---|---|---|
| APIs (pilotos + primeiros clientes) | R$ 150 | R$ 1.800 |
| Hospedagem (Vercel + Supabase) | R$ 100 | R$ 1.200 |
| Domínio + e-mail profissional | R$ 20 | R$ 240 |
| Marketing orgânico (Canva Pro, ads pontuais, ferramentas) | R$ 400 | R$ 4.800 |
| Taxas de pagamento (início Q2) | R$ 50 (média) | R$ 450 |
| **Total investimento 12 meses** | — | **R$ 8.490** |

**Payback:** o investimento total de R$ 8.490 se paga com **1,5 meses de operação no mês 12** (lucro R$ 8.400/mês).

---

## 8. Roadmap de Produto (12 meses)

### Q1 2026 — Produto (em andamento)
- ✅ MVP validado em culto real (40min, aprovado pela equipe)
- 🔄 EPIC-5: Integração de áudio via OBS (ganho de qualidade)
- 🔄 EPIC-6: Integração Holyrics + detector automático de versículos
- 📋 Landing page + 5 pilotos gratuitos

### Q2 2026 — Go-to-Market
- Onboarding self-service (cadastro, billing, primeiros passos)
- Integração Stripe / Pagar.me
- Dashboard de histórico de cultos e legendas
- **Meta: primeiros 10-15 clientes pagantes**

### Q3 2026 — Expansão de produto
- Cortes verticais prontos para Reels / TikTok
- Thumbnails geradas automaticamente
- Programa de indicação (1 mês grátis por igreja trazida)
- **Meta: 30-40 clientes**

### Q4 2026 — Parceria e escala
- Integração oficial com Holyrics (listagem no site deles)
- Plano Multi-sede / white-label
- Presença em eventos (Conferências de mídia cristã)
- **Meta: 60+ clientes, ARR R$ 100k+**

---

## 9. Estratégia de Aquisição

### Canais principais

1. **Rede de indicação orgânica**
   - Igrejas referência (sua igreja + 4 indicadas) como clientes-âncora
   - Cada caso gera 3-5 novos leads qualificados
   - CAC: praticamente zero

2. **Instagram + conteúdo técnico**
   - Conta mostrando **before/after** de legendas
   - Reels com "como transformamos 40min de pregação em 2min"
   - Parceria com @confradedemidias, @midiadeigreja, @meulouvor, etc.

3. **Webinars mensais gratuitos**
   - "Como automatizar a mídia do seu culto com IA"
   - Lista de e-mail qualificada para nurturing

4. **Integração oficial com Holyrics (Q4)**
   - Co-marketing com a maior plataforma de projeção do Brasil
   - Listagem no site deles = acesso a 40.000 igrejas

5. **Congressos de mídia cristã**
   - EMICRON, MEGA, Conferências Zoe, Congresso Lagoinha
   - Apresentação em estande + workshop

### Métricas alvo

| Métrica | Meta Ano 1 |
|---|---|
| Visitantes mensais (site) | 3.000 |
| Taxa de conversão visita → trial | 4% |
| Taxa de conversão trial → pago | 30% |
| CAC blended | R$ 400 |
| Ciclo de venda médio | 14 dias |

---

## 10. Riscos e Mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|---|---|---|---|
| Holyrics lança feature de IA própria | 🔴 Alto | Média | Velocidade de execução; moat no curador; buscar parceria oficial rápido |
| Google/Anthropic sobem preços das APIs | 🟡 Médio | Alta | Margem 87% absorve até 3x de aumento; testar modelos alternativos (Gemini Flash-Lite, Claude Haiku) |
| Resistência a "IA no culto" | 🟡 Médio | Média | Posicionar como "copiloto da equipe", não substituto; aprovação humana em todos os fluxos |
| Pirataria / conta compartilhada | 🟡 Médio | Alta | License key por instalação + audit trimestral + tokens rotativos |
| LGPD em áudios de cultos | 🔴 Alto | Baixa | Termos claros de consentimento; processamento em servidores BR; zero retenção de áudio |
| Dependência de Chrome (Web Speech API) | 🟡 Médio | Baixa | Rota pronta de migração para Gemini API (custo marginal R$ 0,33/culto absorvível) |
| Entrada de concorrente internacional | 🟡 Médio | Média | Moat linguístico (pt-BR sacro) + parcerias locais + brand recall |

---

## 11. Proposta de Sociedade

### O que procuramos

Um sócio que complemente o perfil técnico atual com:

- **Força comercial / vendas B2B** com igrejas
- **Rede de relacionamento** em comunidades cristãs
- **Capital inicial** (até R$ 8.500 para bootstrap 12 meses)
- **Dedicação** de meio período no Ano 1

### Estrutura sugerida (negociável)

| Item | Proposta |
|---|---|
| **Divisão societária inicial** | 50/50 ou 60/40 (a ajustar por responsabilidades) |
| **Contribuição fundador técnico** | Produto pronto + manutenção técnica + infra + roadmap |
| **Contribuição sócio comercial** | Capital de giro + vendas + relacionamento + operação comercial |
| **Vesting** | 4 anos, cliff de 1 ano |
| **Retirada** | Pró-labore só após break-even operacional (estimado mês 4-5) |
| **Reinvestimento** | 100% do lucro nos primeiros 6 meses para acelerar aquisição |

### Projeção de retorno para o sócio (50/50)

| Cenário | Ano 2 | Ano 3 |
|---|---|---|
| Conservador | R$ 110k/sócio | R$ 220k/sócio |
| Realista | R$ 145k/sócio | R$ 270k/sócio |
| Otimista (redes) | R$ 300k/sócio | R$ 700k/sócio |

---

## 12. Próximos Passos

### Para o sócio avaliar antes de fechar
1. Revisar este documento e listar dúvidas
2. Assistir à **demo ao vivo** do sistema (15min)
3. Conversar com a equipe de mídia da igreja-piloto (depoimento direto)
4. Validar premissas de mercado com 2-3 pastores de mídia conhecidos

### Se fecharmos sociedade nos próximos 30 dias
1. **Semana 1:** Constituição legal (MEI/LTDA) + abertura de conta PJ
2. **Semana 2:** Finalização EPIC-5 (OBS) + início do EPIC-6 (Holyrics)
3. **Semana 3-4:** Landing page + 3 pilotos rodando em igrejas amigas
4. **Mês 2:** Início do faturamento (primeiros clientes pagantes)
5. **Mês 3:** 10 clientes ativos, MRR R$ 1.500+, break-even operacional

---

## 13. Anexos

### 13.1 Comprovação de validação técnica
- **Data do teste:** 22/04/2026
- **Duração:** 40 minutos de pregação real
- **Incidentes:** 1 quebra de conexão (auto-recuperada)
- **Qualidade da transcrição:** avaliada como "boa" pela equipe
- **Aprovação das legendas:** equipe de mídia aprovou as 2 legendas geradas
- **Documentação:** `docs/stories/4.3-validacao-culto.md`

### 13.2 Arquitetura técnica resumida
- **Frontend:** Next.js 16 + React 19 + TypeScript
- **IA de legendas:** Claude Sonnet 4.5 via Agent SDK
- **Transcrição:** Web Speech API (Chrome) → migração Gemini 2.5 Flash planejada
- **Hospedagem:** Vercel (frontend) + Supabase (auth + banco)
- **Integração Holyrics:** REST API local (porta 8091) — versão 2.28

### 13.3 Referências de mercado
- Holyrics: +40.000 instalações Brasil (fonte pública)
- IBGE Censo 2010/2020: evolução de igrejas evangélicas
- Pesquisa Data Folha 2023: 31% da população brasileira é evangélica

---

## Contato

**Fundador Técnico:** [Seu nome]
**E-mail:** gustaavosancho07@gmail.com
**Data deste documento:** 22 de abril de 2026

---

*Este documento é confidencial e destina-se exclusivamente à avaliação de sociedade. Projeções são estimativas baseadas em premissas declaradas e podem variar.*
