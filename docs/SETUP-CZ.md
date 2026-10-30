# Instalace a propojení

## 1. Frontend na GitHub Pages
1. V repozitáři otevři **Settings → Pages**.
2. V části Build and deployment vyber **GitHub Actions**.
3. Po pushi do `main` workflow sestaví Vite aplikaci a nasadí ji na Pages.
4. Adresa projektu bude `https://akcizur.github.io/warehouse-fefo/`.

## 2. Google Sheets + Apps Script
1. Vytvoř Google tabulku.
2. Otevři **Rozšíření → Apps Script**.
3. Vlož obsah souboru `gas/Code.gs` do `Code.gs` a nastav manifest podle `gas/appsscript.json`.
4. V Apps Scriptu spusť `setupWarehouse()` a potvrď oprávnění. Vytvoří listy DB_MATERIALS, DB_PACKS, DB_BOXES, DB_LOCATIONS a MOVEMENTS.
5. Nasaď jako **Web app**. Execute as: **Me**. Přístup nastav podle interních bezpečnostních požadavků organizace. Veřejné zpřístupnění znamená, že endpoint není vhodný pro citlivá skladová data bez další autentizace.
6. Zkopíruj URL končící `/exec`.
7. V aplikaci otevři Nastavení a vlož URL.

## Důležité omezení API
GitHub Pages je jiná doména než Apps Script. `google.script.run` na GitHub Pages nefunguje. Frontend proto používá HTTP endpoint `doGet/doPost`. Apps Script ContentService může při cross-origin požadavcích způsobit omezení CORS/přesměrování v prohlížeči. Ověř čtení i zápis v cílovém Google účtu; pokud prohlížeč odpověď zablokuje, je nutné doplnit ověřený autentizační/proxy mechanismus nebo hostovat UI přes Apps Script HtmlService. Nezadávej citlivá data do veřejného endpointu.

## Lokální vývoj
```bash
npm install
npm run dev
npm run build
```

## Datová pravidla
- QR obsahuje pouze ID balení.
- Jeden materiál může mít více balení.
- Box může obsahovat více balení a má právě jednu skladovou pozici.
- Na jedné pozici může být více boxů.
- Šarže je volný text; expirace se zadává jako MM/RR.
- Hmotnost je počáteční hmotnost při příjmu.
- FEFO řadí balení podle nejbližší expirace.
