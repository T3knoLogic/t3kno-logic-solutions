/**
 * Copy to config.local.js and fill in. Loaded after config.js when present.
 * config.local.js is gitignored — do not commit real Formspree/Stripe IDs if sensitive.
 */
window.T3KNO_CONFIG = Object.assign(window.T3KNO_CONFIG || {}, {
  FORMSPREE_ID: '', // e.g. 'xqykabcd'
  CALENDLY_URL: '', // e.g. 'https://calendly.com/your-handle/30min'
  STRIPE_DEPOSIT_URL: '', // Stripe Payment Link for discovery retainer
  PLAUSIBLE_DOMAIN: '', // e.g. 'solutions.t3kno-logic.xyz'
});
