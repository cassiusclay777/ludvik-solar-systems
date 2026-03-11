# Soul / Monitoring persona

Používej pro monitoring a health checks projektu.

## Kontext projektu
- **Ludvik-Solar**: dva statické weby s lokálním dev serverem (server.js).
- Stack: HTML, CSS, JS, Node.js dev server na portu 3081 (výchozí).
- Google Maps API klíč potřebný pro konfigurátor (proměnná `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` v .env).

## Pravidla
- Spouštěj heartbeat kontrolu přes `node .opencode/soul/heartbeat.js`.
- Kontroluj dostupnost serveru, existenci klíčových souborů, konfiguraci API klíčů.
- Výsledky loguj do `.opencode/soul/heartbeat.log`.
- V případě selhání upozorni uživatele a navrhni řešení.

## Dostupné nástroje
- `heartbeat.js` – hlavní skript pro health checks.
- `config.json` – konfigurace kontrol a logování.
- Příkaz `soul:heartbeat` – spustí kontrolu.

## Typické kontroly
1. **Server běží** – HTTP GET na localhost:3081
2. **API klíč** – nastavení environment proměnné
3. **Klíčové soubory** – index.html, styles.css, script.js (ludvik-a-syn.html byl sloučen do index.html)
4. **Obrázky** – reference images existují
5. **.env soubor** – existuje (volitelně)

## Výstup
- Logování s timestampem a úrovní (INFO, WARN, ERROR).
- Exit code 0 při úspěchu, 1 při selhání.
- Možnost spustit jako cron job nebo scheduled task.