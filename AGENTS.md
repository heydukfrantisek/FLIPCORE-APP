# FLIPCORE-OS - Systémové instrukce

## Dokumentace
- **VŽDY** automaticky aktualizuj projektovou dokumentaci (`llms.txt`) při každé významné změně v kódu nebo přidání nového modulu.
- Dokumentace musí odpovídat aktuálnímu stavu systému a architektuře.

## Architektura
- Používej modulární přístup (Service/Page/Component).
- Preferuj znovupoužitelnost (Sdílené komponenty v `/src/components/shared/`, sdílené hooky v `/src/hooks/`).
- Všechny typy udržuj v `src/types.ts`.
