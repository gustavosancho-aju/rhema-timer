# Guia de Instalação em Máquina Nova

**Público:** Você mesmo ou quem for rodar o RHEMA em outra máquina
**Tempo estimado:** 20-30 minutos
**Sistema:** Windows 10/11

---

## 0. Pré-requisitos (instalar na máquina nova)

| Software | Onde baixar | Versão |
|---|---|---|
| **Node.js** | https://nodejs.org | 18+ (recomendado 20 LTS) |
| **Git** | https://git-scm.com | Qualquer recente |
| **Google Chrome** | https://www.google.com/chrome | Atualizado (obrigatório para Web Speech API) |
| **Claude Code CLI** | `npm i -g @anthropic-ai/claude-code` | Mais recente |

**Verificação rápida** (PowerShell):
```powershell
node --version     # Deve mostrar v18+ ou v20+
npm --version      # Deve mostrar 9+ ou 10+
git --version      # Qualquer versão
```

---

## 1. Copiar o projeto para a máquina nova

### Opção A — Via pendrive / OneDrive (mais simples)
1. Na máquina de origem, copie a pasta `CN PRojeto Transcrição` inteira
2. **Exceto:** delete a pasta `web/node_modules` antes de copiar (é grande, será reinstalada)
3. **Exceto:** delete `web/.next` (cache, será regenerado)
4. Cole na máquina nova em `C:\Users\[SeuUsuario]\Documents\`

### Opção B — Via GitHub (recomendado a médio prazo)
```powershell
# Na máquina nova
cd "C:\Users\[SeuUsuario]\Documents\"
git clone https://github.com/[seuUsuario]/rhema.git "CN PRojeto Transcricao"
```

---

## 2. Instalar dependências

Abra o **PowerShell na pasta web/** e rode:

```powershell
cd "C:\Users\[SeuUsuario]\Documents\CN PRojeto Transcrição\web"
npm install
```

**Tempo:** 2-5 minutos. Instala ~160 pacotes.

**Se aparecer erro de disco cheio:** libere pelo menos 2 GB antes.

---

## 3. Autenticar no Claude Code

O sistema usa a sua assinatura Max via Claude Agent SDK. **Precisa logar uma vez na máquina nova:**

```powershell
claude
```

- Abre no navegador → faça login com sua conta Anthropic
- Depois de logado, digite `/exit` e feche

**Verificar login:**
```powershell
claude --version
```

---

## 4. (Opcional) Variáveis de ambiente

Por enquanto **não é necessário** — o SDK usa a assinatura local. Crie o `.env.local` só quando migrar para Gemini (EPIC futuro):

```powershell
# web/.env.local  (NÃO commitar)
# GEMINI_API_KEY=...
# HOLYRICS_TOKEN=...
```

---

## 5. Rodar o sistema

```powershell
cd "C:\Users\[SeuUsuario]\Documents\CN PRojeto Transcrição\web"
npm run dev
```

Deve aparecer:
```
▲ Next.js 16.2.4 (Turbopack)
- Local:        http://localhost:3000
✓ Ready in 1372ms
```

**Abra no Chrome:** http://localhost:3000

---

## 6. Primeiro teste na máquina nova (2 minutos)

1. Clicar **Iniciar gravação** → permitir microfone
2. Falar 30s (pode ser qualquer coisa)
3. Clicar **Parar**
4. Clicar **Gerar 2 legendas**
5. Esperar ~20s → devem aparecer 2 cards de legenda

**Se funcionou:** ✅ instalação OK
**Se deu erro "Not logged in":** volte no passo 3 e rode `claude` novamente
**Outros erros:** veja a seção de troubleshooting abaixo

---

## 7. Configuração do culto (opcional mas recomendado)

### 7.1 Permissões permanentes do microfone
No Chrome: `chrome://settings/content/microphone` → adicionar `http://localhost:3000` como **permitido**.

### 7.2 Manter Chrome em primeiro plano
A Web Speech API pausa se a aba for minimizada. Antes do culto:
- Fechar abas desnecessárias
- Ativar **modo não perturbar** do Windows
- Conectar laptop na **tomada** (sem bateria gerencia clocks de forma estranha)

### 7.3 Internet estável
Web Speech API envia áudio para servidores Google. Testar velocidade:
- Mínimo: **5 Mbps de upload**
- Recomendado: cabo Ethernet > Wi-Fi

---

## 8. Troubleshooting comum

| Problema | Causa provável | Solução |
|---|---|---|
| `ENOENT: package.json` | Rodou `npm run dev` fora da pasta `web/` | `cd web` primeiro |
| `Claude Code returned: Not logged in` | CLI do Claude não autenticado | Rodar `claude` e fazer login |
| `Port 3000 in use` | Outro processo ocupando a porta | `taskkill //F //IM node.exe` ou usar porta 3001 |
| Microfone não aparece | Permissão negada no Chrome | `chrome://settings/content/microphone` |
| Legendas demoram >2min ou falham | SDK do Claude com problema | Testar `claude` no terminal separado |
| Transcrição não aparece | Web Speech não carregou ou sem internet | Ctrl+Shift+R no Chrome + testar internet |
| Acentos aparecem quebrados | Cmd prompt antigo | Use PowerShell, não CMD |

---

## 9. Desligamento pós-culto

```powershell
# No terminal onde está rodando, pressione:
Ctrl + C
```

Opcional — se quiser liberar memória:
```powershell
taskkill //F //IM node.exe
```

---

## 10. Checklist rápido para o dia do culto

- [ ] Laptop ligado na tomada
- [ ] Chrome aberto em http://localhost:3000
- [ ] `npm run dev` rodando no PowerShell
- [ ] `claude` logado (testar com `claude --version`)
- [ ] Microfone / fonte de áudio conectada e testada
- [ ] Internet funcionando (abrir qualquer site pra confirmar)
- [ ] Teste de 30s feito antes do culto começar
- [ ] Modo não perturbar ativado
- [ ] Abas desnecessárias fechadas

---

## 11. Arquivos críticos (não apagar)

| Caminho | O que é |
|---|---|
| `web/src/lib/prompts/curador.ts` | Prompt do curador (propriedade intelectual) |
| `web/src/app/api/legendas/route.ts` | Endpoint que chama Claude |
| `web/package.json` | Dependências |
| `docs/` | Toda documentação do projeto |

**Nunca committar ou enviar por email:**
- `.env.local` (quando existir)
- Tokens de API
- Arquivos com credenciais

---

## Contato

Dúvidas ou problemas na instalação? Documenta o erro com screenshot e volte aqui — resolvemos junto.
