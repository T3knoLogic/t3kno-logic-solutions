# Deploy T3kNo-Logic Solutions

Static site — no build step. Fill integrations in `config.local.js` first (see README).

## Live (primary)

| Host | URL |
|------|-----|
| **t3kno-logic.xyz** | https://t3kno-logic.xyz/solutions/ |
| Storefront | Hydrogen / Oxygen (`t3kno-bazaar-storefront`) |

The desk is synced into `t3kno-bazaar-storefront/public/solutions/` and mounted full-bleed at `/solutions`. No Shopify cart wiring — Formspree / Calendly stay in `config.js`.

### Update the live desk

From the storefront repo:

```bash
npm run sync:solutions
# then commit + deploy Oxygen as usual
```

`prebuild` also runs sync with `--allow-missing` so Oxygen CI keeps the committed `public/solutions/` tree when the sibling solutions repo is absent.

## Mirror (secondary)

| Host | URL |
|------|-----|
| **GitHub Pages** | https://t3knologic.github.io/t3kno-logic-solutions/ |
| Repo | https://github.com/T3knoLogic/t3kno-logic-solutions |

Push to `main` redeploys Pages automatically. Prefer linking the `.xyz` path in merch nav and marketing.

## Cloudflare Pages / Netlify (optional)

Cloudflare/Netlify tokens were **not** in `REPOSITORIES/.env.local` and Wrangler was logged out — paste `CLOUDFLARE_API_TOKEN` + account id (or `NETLIFY_AUTH_TOKEN`) into Desktop `T3kNo-ENV-paste.txt` if you want those hosts instead.

1. Push this folder (or monorepo) to GitHub.
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect repo.
3. **Build command:** leave empty (or `echo ok`).
4. **Output directory:** `t3kno-logic-solutions` if the repo root is `REPOSITORIES`, else `.`
5. Custom domain optional — primary remains `t3kno-logic.xyz/solutions/`.

CLI (optional):

```bash
npx wrangler pages deploy . --project-name=t3kno-logic-solutions
```

## ICP asset canister (later)

When you want on-chain hosting:

1. `dfx new` asset-only (or add an assets canister under this folder).
2. Copy `index.html`, `styles.css`, `app.js`, `config.js`, `data/` into the assets source.
3. Deploy with cycles from Launchpad — **ask before burning cycles**.
4. Do **not** use Motoko scrape scripts on unrelated cans.

## Post-deploy checklist

- [ ] Open https://t3kno-logic.xyz/solutions/ — desk loads full-bleed (no Bazaar header)
- [ ] Header **Solutions** link on the merch store reaches the desk
- [ ] Images / CSS load under `/solutions/…`
- [ ] Book a scope → Send brief lands in `t3k@t3kno-logic.xyz` (Formspree or mailto)
- [ ] Ops demo only via `?ops=1`
- [ ] Plausible shows a pageview if `PLAUSIBLE_DOMAIN` is set
