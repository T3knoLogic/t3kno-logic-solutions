# Deploy T3kNo-Logic Solutions

Static site — no build step. Fill integrations in `config.local.js` first (see README).

## Cloudflare Pages (recommended)

1. Push this folder (or monorepo) to GitHub.
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect repo.
3. **Build command:** leave empty (or `echo ok`).
4. **Output directory:** `t3kno-logic-solutions` if the repo root is `REPOSITORIES`, else `.`
5. Custom domain: e.g. `solutions.t3kno-logic.xyz` → set `PLAUSIBLE_DOMAIN` to match.

CLI (optional):

```bash
npx wrangler pages deploy . --project-name=t3kno-logic-solutions
```

## Netlify

- Drag-drop this folder onto [app.netlify.com/drop](https://app.netlify.com/drop), or connect Git with publish dir `t3kno-logic-solutions`.
- `netlify.toml` is included.

## ICP asset canister (later)

When you want on-chain hosting:

1. `dfx new` asset-only (or add an assets canister under this folder).
2. Copy `index.html`, `styles.css`, `app.js`, `config.js`, `data/` into the assets source.
3. Deploy with cycles from Launchpad — **ask before burning cycles**.
4. Do **not** use Motoko scrape scripts on unrelated cans.

## Post-deploy checklist

- [ ] `config.local.js` or production `config.js` has Formspree / Calendly / Stripe as needed  
- [ ] Open site → Book a scope → Send brief lands in `t3k@t3kno-logic.xyz`  
- [ ] Calendly opens if configured  
- [ ] Ops demo only via `?ops=1`  
- [ ] Plausible shows a pageview if `PLAUSIBLE_DOMAIN` is set  
