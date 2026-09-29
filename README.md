# FLIPCOREAPP

Platforma pro vyhledávání a nákup bazarových PC komponent, jejich repas a sestavení hotového počítače ve třech cenových kategoriích (Základ / Střední / Premium).

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
| `pnpm typecheck`  | `next typegen + tsc --noEmit`             |
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
- Každá nová funkce musí přinést svůj dokument v `docs/funkce/` podle `_template.md` a aktualizaci `ROADMAP.md`.

## Dokumentace

Veškerá dokumentace je v [`docs/`](docs/README.md), plán a priority prací v [`ROADMAP.md`](ROADMAP.md).

| Dokument                                     | Obsah                                                       |
| ------------------------------------------- | ----------------------------------------------------------- |
| [docs/README.md](docs/README.md)           | Index dokumentace, mapa a pravidla pro její aktualizaci      |
| [docs/vize.md](docs/vize.md)               | Produktová vize, uživatelské typy, pilíře, cenové kategorie  |
| [docs/architektura.md](docs/architektura.md) | Vrstvy, klíčová rozhodnutí, datový model, routy, bezpečnost   |
| [docs/funkce/_template.md](docs/funkce/_template.md) | Šablona, podle níž vzniká dokument každé funkce     |
| [ROADMAP.md](ROADMAP.md)                   | Fáze, priority a definice hotovosti                           |

## Nasazení

TODO: doplň cílovou platformu (Vercel / Docker / vlastní) a postup. Viz také [ROADMAP.md](ROADMAP.md) a [docs/](docs/README.md).

## Kontakt

[flipcorehk@gmail.com](mailto:flipcorehk@gmail.com)
