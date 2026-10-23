/**
 * Public integration config for T3kNo-Logic Solutions.
 * Override any key via config.local.js (gitignored) — see README.
 */
window.T3KNO_CONFIG = Object.assign(
  {
    CONTACT_EMAIL: 't3k@t3kno-logic.xyz',
    CONTACT_PHONE: '+19092765764',
    CONTACT_PHONE_DISPLAY: '(909) 276-5764',

    /** Formspree form id — https://formspree.io (e.g. "xyzabcde"). Empty = mailto-only. */
    FORMSPREE_ID: '',

    /** Calendly scheduling URL. Empty = date/slot picker only. */
    CALENDLY_URL: '',

    /**
     * Discovery retainer ($250) via existing stripe.bonsaios.app bridge.
     * Card checkout does not require a Canopy principal (email is enough).
     * Leave STRIPE_DEPOSIT_URL empty to auto-build; or set a fixed Payment Link.
     */
    STRIPE_BRIDGE_ORIGIN: 'https://stripe.bonsaios.app',
    STRIPE_DEPOSIT_PRODUCT: 'discovery_retainer',
    STRIPE_DEPOSIT_URL: '',
    STRIPE_SUCCESS_URL:
      'https://t3kno-logic.xyz/solutions/index.html?stripe=retainer_success',
    STRIPE_CANCEL_URL:
      'https://t3kno-logic.xyz/solutions/index.html?stripe=retainer_cancel',
    DISCOVERY_RETAINER_USD: 250,
    CANOPY_URL: 'https://7h6n6-eqaaa-aaaau-ag6da-cai.icp0.io/',

    /** Plausible analytics domain (e.g. "solutions.t3kno-logic.xyz"). Empty = off. */
    PLAUSIBLE_DOMAIN: '',
  },
  window.T3KNO_CONFIG || {}
);
