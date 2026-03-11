# Ludvik-Solar – co máme, co chybí, další postup

## Co na webu máme

- **Hero:** Nadpis, region (Třebíčsko, Znojemsko, Vysočina), 3 benefity, CTA (Domluvit konzultaci, Konfigurátor), telefon + e-mail.
- **Proč teď:** Bez FVE vs. Se soláry + 3 karty (využití energie, aplikace, na klíč).
- **Služby:** 4 karty – Instalace FVE, Baterie, Servis, Dotace – každá s odkazem na konzultaci.
- **Jak probíhá spolupráce:** 3 kroky (montáž, střídač/baterie, rozvaděč/připojení), garantované termíny, „žádné zbytečné papírování“.
- **Reference:** 3 realizace (Třebíč, Znojmo, MB) s parametry + galerie 6 fotek.
- **Konfigurátor:** Adresa, mapa, orientace, sklon, přetahování/klik na panely, souhrn, Export do PDF.
- **Proč právě my:** 4 body s ikonami (praxe, osobní přístup, region, kompletní servis).
- **O nás:** Krátký text + 4 odrážky (praxe, přístup, region, nabídka).
- **Kontakt:** Dva bloky (Solar Power Energy, Ludvík a Syn), formulář s „Ozvu se do 24 h“, pole „Mám zájem o“, odeslání na e-mail.
- **Finální CTA:** Sekce před patičkou + dvě tlačítka.
- **Patička:** Kontakty + jedna věta o službách.
- **SEO:** Meta description, Open Graph, JSON-LD LocalBusiness (včetně priceRange).

---

## Co chybí (doporučený další postup)

### 1. FAQ – Časté otázky (priorita: vysoká)

Sekce „Časté otázky“ s 5–7 otázkami. Typické téma u FVE:

- Kolik to přibližně stojí? / Od kdy má smysl FVE?
- Jaká je návratnost?
- Co je potřeba pro dotaci Nová zelená úsporám?
- Potřebuji baterii, nebo stačí jen panely?
- Co když mám malou nebo stinnou střechu?
- Jak dlouho trvá od poptávky po spuštění?
- Dáváte záruku na práci / na panely?

**Kde:** Nová sekce před nebo za „O nás“, v menu např. „Časté otázky“ nebo součást „O nás“.

---

### 2. Cena / odhad ceny na stránce (priorita: vysoká)

V obsahu nikde není zmínka o ceně. V JSON-LD je „Cenová kalkulace na vyžádání“, ale uživatel to nevidí.

**Doporučení:** Přidat jednu krátkou větu, např.:

- V hero nebo u CTA: „Cenu připravíme po osobní konzultaci a návrhu.“  
- Nebo malý blok u služeb / u konfigurátoru: „Orientační rozmezí pro rodinný dům 5–10 kWp: od cca X do Y Kč (včetně DPH). Přesnou cenu dopočítáme po návrhu.“ (X, Y doplnit podle reality.)

Stačí jedna věta na celém webu – snižuje obavy „že to bude předražené“ nebo „že se nedozvím cenu“.

---

### 3. GDPR u formuláře (priorita: střední)

U kontaktního formuláře chybí:

- Zaškrtávací pole typu: „Souhlasím se zpracováním osobních údajů“ (odkaz na zásady).
- Odkaz na „Zásady ochrany osobních údajů“ (stránka nebo sekce).

Bez toho může být zpracování poptávek z právního hlediska rizikové.

**Doporučení:**

- Checkbox + krátký text souhlasu + odkaz na zásady.  
- Jednoduchá stránka nebo rozbalovací blok „Ochrana údajů“ (kdo správce je, proč údaje, na jak dlouho, práva uživatele).

---

### 4. Záruky (priorita: střední / nízká)

Je zmíněný servis a monitoring, ale ne záruka na instalaci nebo na dodané zařízení.

**Doporučení:** Jedna věta typu: „Na montáž poskytujeme záruku X let, na panely dle výrobce.“ (doplnit reálné údaje.) Může být ve „Jak probíhá“, u služeb nebo v FAQ.

---

### 5. Nice to have (až po výše uvedeném)

- **Galerie:** Klik na foto = zvětšení (lightbox).
- **Certifikace / partneři:** Pokud je máte (výrobci, školení), krátká zmínka nebo logo v patičce / O nás.
- **OG obrázek:** `og:image` pro hezký náhled při sdílení na sociálních sítích.

---

## Pořadí implementace

1. **FAQ** – přidat sekci + 5–7 otázek a odpovědí.  
2. **Jedna věta o ceně** – kamkoliv v úvodu/službách/konfigurátoru.  
3. **GDPR u formuláře** – checkbox + odkaz na zásady; ideálně i krátké zásady (stránka nebo blok).  
4. **Záruka** – jedna věta na web.  
5. Podle času: lightbox galerie, OG image, certifikace.

Když budeš chtít, můžeme v Agent módu konkrétně navrhnout texty do FAQ a přesné umístění věty o ceně + úpravu formuláře (checkbox + odkaz).
