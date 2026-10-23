/**
 * Copy to config.local.js and fill in. Loaded after config.js when present.
 * config.local.js is gitignored — do not commit real Formspree/Stripe IDs if sensitive.
 */
window.T3KNO_CONFIG = Object.assign(window.T3KNO_CONFIG || {}, {
  FORMSPREE_ID: '', // e.g. 'xqykabcd'
  CALENDLY_URL: '', // e.g. 'https://calendly.com/your-handle/30min'
  // Optional fixed Payment Link; else desk builds stripe.bonsaios.app/checkout?product=discovery_retainer
  STRIPE_DEPOSIT_URL: '',
  STRIPE_BRIDGE_ORIGIN: 'https://stripe.bonsaios.app',
  STRIPE_DEPOSIT_PRODUCT: 'discovery_retainer',
  PLAUSIBLE_DOMAIN: '', // e.g. 'solutions.t3kno-logic.xyz'
});
