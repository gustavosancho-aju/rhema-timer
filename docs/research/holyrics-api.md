# Research — Holyrics API HTTP

**Data:** 23/04/2026
**Status:** Validado via fontes oficiais
**Fontes:**
- [GitHub oficial: holyrics/API-Server](https://github.com/holyrics/API-Server)
- [README-en.md (raw)](https://raw.githubusercontent.com/holyrics/API-Server/main/README-en.md)

---

## 1. URL base

```
http://[IP]:[PORT]/api/{action}?token=abcdef
```

- **Porta default:** `8091`
- **Path base:** `/api/`
- **Mesmo PC (nosso caso):** `http://localhost:8091/api/{action}?token={TOKEN}`

## 2. Autenticação

- Token passado como **query parameter**: `?token=abcdef`
- **Método HTTP:** `POST`
- **Content-Type:** `application/json` (obrigatório)

Token é gerado em: **Arquivo/File menu > Configurações/Settings > API Server > manage permissions**
Pode ter múltiplos tokens com permissões distintas.

## 3. Action principal — Exibir versículo

**Nome exato:** `ShowVerse` (disponível desde v2.19.0)

**Payload (3 formas de referenciar):**

### Forma A — por referência textual (mais simples)
```json
{
  "references": "Is 43:19"
}
```

### Forma B — por ID (formato BBCCCVVV)
- `BB` = número do livro (2 dígitos) — Isaías = 23
- `CCC` = capítulo (3 dígitos)
- `VVV` = versículo (3 dígitos)

```json
{
  "id": "23043019"
}
```

### Forma C — múltiplos IDs
```json
{
  "ids": ["23043019", "23043020"]
}
```

**Campos opcionais:**
| Campo | Tipo | Default | Descrição |
|---|---|---|---|
| `version` | string | — | Nome/abreviatura da tradução |
| `quick_presentation` | boolean | false | Apresentação rápida |
| `show_x_verses` | number | — | Quantos versículos exibir |
| `default_action` | string | `default` | Ação padrão |

## 4. Ocultar texto

Duas opções:

**A. `CloseCurrentPresentation`** — encerra apresentação atual (fecha a exibição)

**B. `SetAlert`** com `show: false` — especificamente para alertas

Recomendação pro RHEMA: **`CloseCurrentPresentation`** (mais direto).

## 5. Listar versões bíblicas

- `GetBibleVersions` (legacy)
- `GetBibleVersionsV2` (v2.24.0+) — recomendado

## 6. Formato de resposta

**Sucesso:**
```json
{
  "status": "ok",
  "data": { }
}
```

**Erro:**
```json
{
  "status": "error",
  "error": "invalid token"
}
```

## 7. Exemplo completo — Exibir Isaías 43:19

```bash
curl -X POST "http://localhost:8091/api/ShowVerse?token=SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"references":"Is 43:19"}'
```

Resposta esperada:
```json
{ "status": "ok", "data": {} }
```

## 8. Como habilitar API Server no Holyrics

1. Abrir Holyrics
2. Menu **Arquivo → Configurações** (ou File → Settings)
3. Seção **API Server**
4. Ativar o servidor
5. Confirmar porta (default 8091)
6. Opção **"manage permissions"** (gerenciar permissões) → criar novo token
7. Definir permissões do token (ex: apenas exibir versículos, não modificar canção)
8. Copiar o token gerado

## 9. Gotchas / Observações para integração

| Item | Impacto no RHEMA |
|---|---|
| `ShowVerse` é v2.19+ | Nosso alvo 2.28 OK |
| `GetBibleVersionsV2` é v2.24+ | OK também |
| Token no query string | Atenção: não logar o URL completo |
| Sem CORS (provavelmente) | Como rodamos server-side no Next.js, sem problema |
| Rate limit | Não documentado — assumir tolerante |
| Timeout | Sem info oficial — definir 3s nosso |

## 10. Mapeamento de livros (BB do ID)

Para converter "Isaías" do detector → ID `23`:

| # | Livro |
|---|---|
| 01 | Gênesis |
| 02 | Êxodo |
| 03 | Levítico |
| ... | ... |
| 23 | Isaías |
| 43 | João |
| 66 | Apocalipse |

**Solução pragmática:** usar sempre o formato `references` com nome do livro — o Holyrics faz o parse. Evita manter tabela interna.

## 11. Conclusão para Story 6.2

Nossa função `exibirVersiculo` vai:

```typescript
async function exibirVersiculo(referencia: string) {
  const url = `http://localhost:8091/api/ShowVerse?token=${TOKEN}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ references: referencia }),
    signal: AbortSignal.timeout(3000),
  });
  const data = await res.json();
  if (data.status !== "ok") throw new Error(data.error);
  return data;
}
```

Referência `Is 43:19` ou `Isaías 43:19` — validar qual o Holyrics aceita (teste manual).

## 12. Próximos passos para destravar 6.2

- [x] API mapeada
- [ ] Testar via curl na máquina do Holyrics (validação real)
- [ ] Confirmar formato de referência aceito em pt-BR vs en
- [ ] Validar que `CloseCurrentPresentation` fecha só o versículo (não todo o culto)
