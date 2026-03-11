---
name: ludvik-solar-web
description: Pravidla a konvence pro úpravy webu Ludvik-Solar (FVE, fotovoltaika, Třebíč, Znojmo, Vysočina). Použít při jakékoli úpravě tohoto projektu, při přidávání sekcí, textů, formulářů, konfigurátoru nebo při dotazech na Ludvik-Solar, Solar Power Energy, Ludvík a Syn.
---

# Ludvik-Solar – web FVE

## Stack a soubory

- **HTML:** jeden `index.html` – všechny sekce, skripty inline nebo na konci body.
- **CSS:** jeden `styles.css` – proměnné v `:root`, žádný preprocessor.
- **JS:** vanilla (konfigurátor mapa, roof grid drag+click, formulář mailto, menu, lightbox). Google Maps a jsPDF načteny z CDN.
- **Dev:** `server.js` (statický server, vstřikuje `__GOOGLE_MAPS_API_KEY__` z .env), `dev-with-reload.js` (browser-sync). Porty **3080** (stránka), **3081** (backend) – neměnit na 3000/3001.
- **Obrázky:** `images/reference/` – reference a galerie.

## Konvence HTML/CSS

- Sekce: `<section id="…" class="section">` nebo `section section-alt` pro střídání pozadí. Kontejner: `.container` nebo `.container-narrow`.
- Nadpisy: `.section-title` (h2), `.section-intro` (úvodní odstavec). Hero: `.hero-title`, `.hero-sub`, `.hero-benefits`, `.hero-actions`, `.hero-price`, `.hero-contact`.
- CTA tlačítka: primární „Domluvit konzultaci“ → `#kontakt`, sekundární „Konfigurátor FVE“ / „Otevřít konfigurátor“ → `#konfigurator`. Třídy: `.btn .btn-primary`, `.btn-outline`, `.btn-hero-secondary` v hero.
- Karty: služby (`.service-card`), reference (`.ref-card`), benefity (`.benefit-card`) – používají lux stíny a zaoblení (`--radius-lg`, `--shadow-lux`). Ikony služeb mají barvy po řadě: zelená, teal, amber, violet.
- Formulář: musí obsahovat pole „Mám zájem o“ (select), GDPR checkbox s odkazem na `#ochrana-udaju`, text „Ozvu se vám do 24 hodin.“ Odeslání: mailto s předmětem a tělem (včetně zájmu).

## Obsah a copy

- **Dvě značky:** Solar Power Energy s.r.o. (Rouchovany, Ing. Lubomír Ludvík, 724 658 905, <lludvik@volny.cz>), Ludvík a Syn (Třebíč, Znojmo, 720 308 745, <jakubludvik93@gmail.com>).
- **Region:** Třebíč, Znojmo, Vysočina, Jihomoravský kraj; konkrétně Třebíčsko, Znojemsko, Moravské Budějovice, Náměšť nad Oslavou, Jihlava, Telč, Hrotovice.
- **Sekce v pořadí:** úvod (hero), Proč teď, Služby, Jak probíhá, Reference + galerie, Konfigurátor, Proč právě my, O nás, Časté otázky (FAQ), Kontakt, CTA blok, patička. V patičce blok „Ochrana osobních údajů“ (`#ochrana-udaju`).
- **Konfigurátor:** adresa, mapa (Google), orientace a sklon (selecty), panel pool (drag) a roof grid – podporovat i **klik na prázdný slot** = přidat panel. Souhrn (počet panelů, kWp, výroba, úspora), tlačítko Export do PDF.
- **Cena:** na stránce musí být alespoň jedna věta (např. „Cenu připravíme po osobní konzultaci a návrhu“ v hero nebo u CTA).
- **Záruka:** zmínka (montáž + výrobce panelů/zařízení).
- Všechny texty v **češtině**.

## Barvy a vzhled

- Paleta: `--color-primary` (zelená), `--color-teal`, `--color-amber`, `--color-violet`, `--color-sky`. Pozadí sekcí: bílá / `--color-bg-alt` (světle zelená), `.section-alt` s jemným gradientem.
- Hero a finální CTA: gradient (zelená → teal → sky v hero, violet → teal v CTA). Tlačítka s lehkým stínem a hover efektem.
- Lux karty: `border-radius: var(--radius-lg)` nebo `var(--radius-lux)`, `box-shadow: var(--shadow-lux)` nebo `var(--shadow-lux-premium)`.

## SEO a meta

- V `<head>`: `meta name="description"`, `og:title`, `og:description`, `og:type`, `og:locale`, `og:image`. JSON-LD `LocalBusiness` (název, popis, telefon, e-mail, adresa, areaServed, priceRange).

## Checklist před nasazením / po větší úpravě

- [ ] Formulář má GDPR checkbox a odkaz na #ochrana-udaju.
- [ ] Je viditelná věta o ceně a zmínka o záruce.
- [ ] FAQ a hlavní sekce jsou v navigaci a mají odpovídající `id`.
- [ ] Konfigurátor: drag i klik na slot přidávají panel; PDF export funguje.
- [ ] Meta description a OG tagy jsou vyplněné; JSON-LD odpovídá údajům na stránce.
- [ ] Žádné lomené odkazy a obrázky z `images/reference/` existují.
