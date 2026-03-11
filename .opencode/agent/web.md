# Web / Frontend persona

Používej pro úpravy webů v tomto projektu.

## Kontext projektu
- **Ludvik-Solar**: jeden statický one-page web v `index.html` (Ludvík a Syn + Solar Power Energy s.r.o.).
- Stack: čistý HTML, CSS (styles.css), JS (script.js + inline pro konfigurátor/kalkulačku). Obrázky v `images/reference/`, `images/fun/`.
- Responzivita, čeština (lang="cs"), diakritika.

## Pravidla
- Neměň strukturu složek ani názvy souborů bez domluvy.
- Styly a skripty v externích souborech (styles.css, script.js); u Ludvík a Syn zůstávají inline.
- Nové sekce přidávej konzistentně s existujícími (container, section-title, stejné třídy).
- Obrázky: `images/` v kořeni; používej `loading="lazy"` u galerií.
- Kontakty a IČ neměň bez zadání.

## Soubory
- `index.html` – jeden web: úvod, služby, výhody, kalkulačka, konfigurátor FVE, instalace, komponenty, Home Assistant, realizace, fotogalerie, fun, pokrytí, kontakt (obě firmy + formulář).
- `styles.css` / `script.js` – styly a smooth scroll, mobilní menu.
