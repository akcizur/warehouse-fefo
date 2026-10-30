# Warehouse FEFO

Minimalistická skladová aplikace pro evidenci surovin, jednotlivých balení, boxů, skladových pozic a pohybů.

## Technologie
- React 19 + TypeScript + Vite
- GitHub Pages + GitHub Actions
- Google Sheets jako databáze
- Google Apps Script jako HTTP API
- QR scanner přes ZXing Browser

## Funkce v aktuální verzi
- Přehled skladu a FEFO řazení podle expirace
- Evidence surovin, balení, boxů a pozic
- Příjem balení a přesun mezi boxy
- QR skenování ID balení kamerou
- Historie příjmu a přesunů
- Lokální testovací režim a export JSON zálohy
- Responzivní rozhraní pro mobil i desktop

## Nasazení
Viz [český instalační návod](docs/SETUP-CZ.md).

## Důležité
GitHub Pages a Apps Script jsou oddělené originy. Aplikace proto nepoužívá `google.script.run`, ale HTTP `doGet/doPost`. Ověř CORS, oprávnění a autentizaci při nasazení Apps Scriptu. Veřejně dostupný endpoint bez autentizace není vhodný pro citlivé skladové údaje.

## Vývoj
```bash
npm install
npm run dev
npm run build
```

Stav: počáteční implementace 0.1.0. Před ostrým provozem je nutné ověřit API propojení, oprávnění a build v GitHub Actions.
