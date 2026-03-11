# Agents for Ludvik-Solar

This project contains two static websites:

1. **Solar Power Energy s.r.o.** (`index.html`) – main business website for solar installations
2. **Ludvík a Syn** (`ludvik-a-syn.html`) – subsidiary website with solar configurator and calculator

## Available Agents

### web
Use for frontend modifications to both websites.

**Configuration:** `.opencode/agent/web.md`

**Commands:**
- `/web solar` – focus on Solar Power Energy website (index.html, styles.css, script.js)
- `/web ludvik` – focus on Ludvík a Syn website (ludvik-a-syn.html, inline styles/scripts)
- `/web update-images` – manage image galleries in `images/` directories
- `/web responsive` – ensure responsive design across devices
- `/web validate` – check HTML/CSS/JS for errors

### content
Use for text content, copywriting, and translations.

**Configuration:** `.opencode/agent/content.md`

**Commands:**
- `/content solar` – edit Solar Power Energy text content
- `/content ludvik` – edit Ludvík a Syn text content
- `/content cta` – optimize call-to-action texts
- `/content seo` – improve SEO meta tags and descriptions
- `/content translate` – assist with Czech/English translations

### soul
Use for monitoring and health checks.

**Configuration:** `.opencode/soul/agent.md`

**Commands:**
- `/soul heartbeat` – run health checks for websites and server

## Project Structure

```
.
├── index.html              # Solar Power Energy main site
├── ludvik-a-syn.html       # Ludvík a Syn site
├── styles.css              # Main styles (for index.html)
├── script.js               # Main scripts (for index.html)
├── images/
│   ├── reference/          # Real installation photos
│   └── fun/               # Fun/idea photos
├── .opencode/
│   ├── agent/
│   │   ├── web.md
│   │   └── content.md
│   ├── soul/
│   │   ├── agent.md
│   │   ├── config.json
│   │   └── heartbeat.js
│   └── package.json
└── AGENTS.md               # This file
```

## Development Commands

- `npm run dev` – start local HTTP server (port 3000)
- `npm run heartbeat` – run health checks for websites and server
- Open `http://localhost:3000` to preview Solar Power Energy site
- Open `http://localhost:3000/ludvik-a-syn.html` to preview Ludvík a Syn site

## Guidelines

- Keep Czech language (`lang="cs"`) and diacritics
- Maintain existing contact information (IČ, addresses, phone numbers) unless explicitly changed
- External links (mapy.cz, GoodWe, tipa.eu) should remain intact
- Use lazy loading for gallery images: `loading="lazy"`
- Follow existing CSS class naming conventions (container, section-title, etc.)
- No build process – pure HTML/CSS/JS