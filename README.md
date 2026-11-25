# jplusfk-web

Jednostránkový web nakladatelství JplusFK o knize *Adventní povídky* (František Kreuzmann) a jejím soundtracku.

- **Obsah:** `src/content/web/uvod.yml` – upravuje se v administraci na `/admin/` (Sveltia CMS).
- **Obrázky z administrace:** `src/assets/uploads/` – při sestavení se zmenší a převedou do WebP.
- **Vzhled:** `src/styles/web.css` (barvy a písma v proměnných nahoře), šablona `src/pages/index.astro`.
- **Nastavení administrace:** `public/admin/config.yml` (repo a adresa přihlašovacího Workeru nahoře).
- **Hosting:** Cloudflare Workers se statickými soubory (`wrangler.jsonc`), build příkaz `npm run build`, deploy `npx wrangler deploy`.

## Lokálně

```
npm install
npm run dev      # http://localhost:4321, administrace na /admin/ (přihlášení přes GitHub)
npm run build    # výstup do dist/
```

Sveltia CMS se při `dev`/`build` kopíruje z `node_modules` do `public/admin/cms` (není v gitu).
Na webu se nepoužívají cookies ani analytika, proto není potřeba cookie lišta.
