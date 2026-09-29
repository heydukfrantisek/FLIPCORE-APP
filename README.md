# FLIPCOREAPP

Základ SaaS aplikace — zatím bez konkrétního zaměření.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19
- TypeScript (strict)
- Tailwind CSS 4
- Vitest + jsdom
- pnpm

## Začátek

```bash
pnpm install
pnpm dev
```

Aplikace běží na http://localhost:3000.

## Skripty

| Příkaz            | Popis                                    |
| ----------------- | ---------------------------------------- |
| `pnpm dev`        | Dev server s hot reload                  |
| `pnpm build`      | Produkční build                          |
| `pnpm start`      | Spuštění produkčního buildu              |
| `pnpm lint`       | ESLint                                  |
| `pnpm typecheck`  | `tsc --noEmit`                           |
| `pnpm test`       | Testy jednou (Vitest)                    |
| `pnpm test:watch` | Testy v watch režimu                    |
| `pnpm check`      | lint + typecheck + testy (před commitem)  |

## Struktura

```
src/
  app/          routy (App Router)
  lib/          sdílená logika a utility
```

## Konvence

- Komponenty a utility v TypeScriptu, bez `any`.
- Formátování a lint necháváme ESLintu, žádné dlouhé řádky.
- Testy vedle testovaného souboru: `cokoliv.test.ts`.
- Veřejné env proměnné prefixuj `NEXT_PUBLIC_`, tajné nikdy necommituj.

## Nasazení

TODO: doplň cílovou platformu (Vercel / Docker / vlastní) a postup.

## Kontakt

[flipcorehk@gmail.com](mailto:flipcorehk@gmail.com)
