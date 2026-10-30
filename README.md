# Warehouse FEFO

Minimalistická skladová aplikace pro evidenci surovin, jednotlivých balení, boxů, skladových pozic a pohybů.

## Technologie
- React 19 + TypeScript + Vite
- GitHub Pages + GitHub Actions
- Google Sheets jako databáze
- Google Apps Script jako HTTP API
- QR scanner přes ZXing Browser

## Funkce v aktuální verzi 0.4.0
- FEFO řazení podle expirace
- Správa a editace surovin, skladových pozic a boxů přímo v aplikaci
- Editace údajů balení (surovina, šarže, expirace, počáteční hmotnost, box) s evidencí změn v pohybovém logu
- Generování QR štítků pro tisk A4 v rozložení 2 × 4; QR obsahuje pouze ID balení
- Příjem balení a přesun konkrétního balení mezi boxy
- QR skenování ID balení s bezpečným lifecycle kamery
- Lokální generování QR kódů bez externí QR služby
- Změna stavu `nový → otevřený → prázdný` s uložením do Sheets a pohybovým logem
- Pohybový ledger s původní i cílovou hodnotou
- Fronta neodeslaných změn a bezpečné opakování API požadavků
- Ochrana lokálních dat před přepsáním prázdným vzdáleným skladem
- JSON export a obnova lokální zálohy
- Validace expirace, existence materiálu/boxu a duplicitních ID v API
- Responzivní rozhraní pro mobil i desktop

## Datová pravidla
- Jeden materiál může mít více balení.
- Balení je umístěné v jednom boxu.
- Box má právě jednu skladovou pozici.
- Na jedné pozici může být více boxů.
- QR obsahuje pouze `ID_Pack`.
- Expirace je zadávána ručně jako `MM/RR`; systém ji automaticky nevypočítává.

## Nasazení
Viz [český instalační návod](docs/SETUP-CZ.md).

GitHub Pages a Apps Script jsou oddělené originy. Aplikace proto nepoužívá `google.script.run`, ale HTTP `doGet/doPost`. Při nasazení je nutné ověřit CORS, oprávnění a autentizaci Apps Script Web Appu.

## Vývoj
```bash
npm install
npm run dev
npm run build
```

Stav: implementace 0.4.0. Před ostrým provozem je stále nutné ověřit reálný Apps Script endpoint, oprávnění a úspěšný GitHub Actions build.