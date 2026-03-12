---
name: agenticseek
description: Volá AgenticSeek API pro research, texty a copy. Použít když potřebuješ vyhledat info, napsat texty, meta popisy, CTA, nebo konzultovat kód/logiku.
---

# AgenticSeek – volání API

## Konfigurace

- **URL:** `http://localhost:8000`
- **Endpoint:** `POST /query`
- **Frontend:** `http://localhost:3002`

## Použití

Když uživatel požádá o:
- **Research:** vyhledej info o dotacích, konkurenci, trendech FVE
- **Texty/copy:** meta popisy, CTA, hero texty, FAQ
- **Konzultaci:** vysvětli logiku kódu, navrhni vzorce pro kalkulačku
- **Překlad:** český text ↔ angličtina

## API volání

```javascript
const response = await fetch('http://localhost:3002/query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    query: '...'  // prompt pro agenta
  })
});
const data = await response.json();
// data.answer = textová odpověď
// data.agent_name = který agent to zpracoval
// data.blocks = výsledky (soubory, screenshoty, etc.)
```

## Průběh

1. Pošli POST request na `/query`
2. Čekej na odpověď (AgenticSeek může chvíli thinkovat)
3. Vrať uživateli `answer` a případně `blocks`

## Důležité

- Prompt pro Ludvik-Solar projekt je v `.opencode/agenticseek-prompt.md`
- Pokud AgenticSeek neběží na 3002, zkus 3000 nebo 7777
- Odpovědi v češtině
