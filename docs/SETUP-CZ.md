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
8. Při prvním spuštění se připojení ověří automaticky. V záložce **Suroviny** založ materiály (`MAT-AA-01`); v **Pozice** založ regálové/paletové pozice (`REG-A-01`, `PAL-A-01`) a přiřaď jim boxy (`BOX-A-01`). Teprve potom přijímej balení.
9. Neodeslané operace se ukládají lokálně do fronty a při další synchronizaci se bezpečně opakují.
10. Po každé změně `gas/Code.gs` otevři **Deploy → Manage deployments → Edit**, zvol **New version** a znovu nasaď Web App. Samotná změna souboru v GitHubu Apps Script deployment neaktualizuje.

## QR štítky a tisk

1. V aplikaci otevři **QR štítky**.
2. Vyber balení, pro která chceš vytisknout štítek. Lze vybrat všechna, jen aktivní nebo jednotlivá balení.
3. Klikni na **Tisknout A4**. Stránka je připravena na 8 štítků v mřížce 2 × 4.
4. V dialogu tiskárny zvol papír **A4**, měřítko **100 %** a vypni záhlaví/zápatí. QR kód obsahuje výhradně ID balení; ostatní údaje jsou vytištěny vedle něj.

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
