# T3kNo-Logic Solutions — public sales desk

**Live:** https://t3knologic.github.io/t3kno-logic-solutions/

Static catalog + package presets + scope estimator + book-a-scope lead flow (Robert Schneider / T3kNo-Logic).

**Not** Bonsai OS Hub, **not** the merch store at [t3kno-logic.xyz](https://t3kno-logic.xyz/), **not** a live CRM.

Repo: https://github.com/T3knoLogic/t3kno-logic-solutions

## Contact

| Channel | Value |
|---------|--------|
| Email | [t3k@t3kno-logic.xyz](mailto:t3k@t3kno-logic.xyz) |
| Google Voice | [(909) 276-5764](tel:+19092765764) |

Voicemail script: [`VOICEMAIL_GREETING.md`](VOICEMAIL_GREETING.md).

## Local preview

```bash
npx --yes serve .
# or open index.html
```

## Integrations (`config.js` + optional `config.local.js`)

| Key | Purpose |
|-----|---------|
| `FORMSPREE_ID` | Server-side lead capture (no mailto dependency) |
| `CALENDLY_URL` | Real kickoff booking on step 3 |
| `STRIPE_DEPOSIT_URL` | Optional discovery retainer Payment Link after brief |
| `PLAUSIBLE_DOMAIN` | Privacy-friendly analytics once hosted |

1. Copy [`config.local.example.js`](config.local.example.js) → `config.local.js`.
2. Paste IDs from Desktop `T3kNo-ENV-paste.txt` (or Formspree / Calendly / Stripe dashboards).
3. `config.local.js` is gitignored.

**Formspree:** create a form → destination `t3k@t3kno-logic.xyz` → put the `/f/xxxxx` id in `FORMSPREE_ID`.

Without Formspree, **Send brief** falls back to `mailto:`.

## Features

- Service catalog (search, categories, auto-pilot)
- **Starter / Growth / Retainer** package presets
- Proof strip (Orbit #18, merch RWA, Bonsai OS)
- Related product links on cards (Canopy, Matrix, Machina, etc.)
- Book flow → Formspree and/or email + copy/download + **Print / PDF**
- Optional deposit CTA (Stripe link + Canopy) after send
- Ops demo **only** at `?ops=1` (not linked in public footer)

## Deploy

See [`DEPLOY.md`](DEPLOY.md) — Cloudflare Pages or Netlify. ICP asset can later (ask before spending cycles).

## Edit catalog

[`data/services.js`](data/services.js) · packages in [`data/packages.js`](data/packages.js).
