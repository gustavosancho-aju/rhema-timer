# Estrutura do código (`src/`)

Organização **por feature (domínio)**, não por tipo de arquivo. Cada feature é
uma "caixa" autocontida: para entender ou mexer numa funcionalidade, tudo dela
está num lugar só.

```
src/
├── app/                 # Rotas do Next.js (App Router). Camada fina: só liga UI às features.
│   └── api/             # Route handlers (endpoints HTTP)
│
├── features/            # ⭐ O coração do app — um diretório por domínio
│   ├── timer/           # Cronômetro de palco (salas, websocket, agenda)
│   │   ├── components/  # UI específica do timer
│   │   ├── hooks/       # React hooks do timer
│   │   ├── lib/         # Lógica, DB (Drizzle/SQLite), websocket handler
│   │   └── store/       # Estado global (Zustand)
│   │
│   └── rhema/           # Transcrição + detecção de versículos + Holyrics
│       ├── components/
│       ├── hooks/
│       └── lib/         # Cliente Holyrics, prompts de IA
│
└── shared/              # Reutilizável entre features
    ├── components/ui/   # Primitivos de UI
    └── types.ts         # Tipos compartilhados
```

## Convenções

- **Imports** usam o alias `@/` → `src/`. Ex.: `@/features/timer/lib/format-time`.
- **Nada de import cruzado entre features.** Se `timer` e `rhema` precisam da
  mesma coisa, ela vai para `shared/`.
- **Testes** ficam ao lado do arquivo testado: `format-time.ts` →
  `format-time.test.ts`. Rode com `npm test`.

## Scripts de qualidade

```bash
npm run test        # roda os testes (Vitest)
npm run typecheck   # checa tipos (tsc --noEmit)
npm run lint        # ESLint
npm run check       # roda os três acima de uma vez (use antes de commitar)
```
