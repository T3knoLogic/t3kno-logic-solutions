/** T3kNo-Logic Solutions — service modules (edit prices/copy here). */
window.T3KNO_SOLUTIONS = window.T3KNO_SOLUTIONS || {};

const R = {
  bonsai: { label: 'Bonsai OS', url: 'https://bonsaios.app/' },
  canopy: { label: 'Canopy', url: 'https://7h6n6-eqaaa-aaaau-ag6da-cai.icp0.io/' },
  bazaar: { label: 'NFT Bazaar', url: 'https://iabi6-zqaaa-aaaau-agwpq-cai.icp0.io/' },
  orbit: { label: 'Orbit Spots #18', url: 'https://iabi6-zqaaa-aaaau-agwpq-cai.icp0.io/collection/18' },
  merch: { label: 'Merch bazaar', url: 'https://t3kno-logic.xyz/' },
  matrix: { label: 'NFT Matrix', url: 'https://thenftmatrix.gumroad.com/l/fruzgy' },
  machina: { label: 'Machina VST', url: 'https://thenftmatrix.gumroad.com/l/mzkks' },
  radio: { label: 'Bonsai Radio', url: 'https://yfpar-eiaaa-aaaau-agzoa-cai.icp0.io/' },
  gumroad: { label: 'Gumroad', url: 'https://thenftmatrix.gumroad.com/' },
};

window.T3KNO_SOLUTIONS.SERVICES = [
  { id: 'web3-1', cat: 'web3', title: 'ICP Canister Architecture & Deployment', price: 2800, time: '5 Days', auto: true, desc: 'Design, deploy, and configure Internet Computer Motoko/Rust canisters with upgrade-safe persistence and ops runbooks.', related: [R.bonsai, R.canopy] },
  { id: 'web3-2', cat: 'web3', title: 'Hedera Token Service (HTS) & Provenance', price: 2200, time: '4 Days', auto: false, desc: 'Configure token minting, treasury rules, supply controls, and physical provenance tracking on Hedera.', related: [R.bonsai] },
  { id: 'web3-3', cat: 'web3', title: 'RWA (Real World Asset) Tokenization', price: 4500, time: '8 Days', auto: false, desc: 'Tokenization pipelines for physical goods, artwork, or collectibles — including merch RWA patterns used on t3kno-logic.xyz.', related: [R.merch, R.bazaar] },
  { id: 'web3-4', cat: 'web3', title: 'Bitcoin Runes & Memecoin Launch', price: 1800, time: '3 Days', auto: false, desc: 'Minting contracts, liquidity deployment, and fair-launch distribution setup on Bitcoin L2 rails.', related: [] },
  { id: 'web3-5', cat: 'web3', title: 'Decentralized Storage & Hosting Migration', price: 1200, time: '2 Days', auto: true, desc: 'Migrate static web apps to ICP asset canisters (or Arweave) with automated deployment pipelines.', related: [R.bonsai] },

  { id: 'ai-1', cat: 'ai', title: 'Custom AI Agent Deployment (ElizaOS)', price: 3200, time: '6 Days', auto: true, desc: 'Deploy autonomous social, analytics, or operational AI agents on continuous server instances with kill switches.', related: [R.bonsai] },
  { id: 'ai-2', cat: 'ai', title: 'E-Commerce Inventory Sync Microservice', price: 1500, time: '3 Days', auto: true, desc: 'Node/Python webhook integrations syncing Shopify inventory and pricing across external marketplaces.', related: [R.merch] },
  { id: 'ai-3', cat: 'ai', title: 'Discord & Telegram Automation Bots', price: 950, time: '2 Days', auto: true, desc: 'Bots for token-gating verification, automated FAQ support, and scheduled announcements.', related: [R.orbit] },
  { id: 'ai-4', cat: 'ai', title: 'Web Scraping & Market Alert Engine', price: 1400, time: '3 Days', auto: true, desc: 'Dockerized scrapers monitoring niche pricing trends with webhook notifications.', related: [] },
  { id: 'ai-5', cat: 'ai', title: 'Tailored Prompt & Model Fine-Tuning', price: 2100, time: '4 Days', auto: false, desc: 'Reusable prompt libraries and context-injection pipelines for generative model workflows.', related: [] },

  { id: 'dev-1', cat: 'dev', title: 'AppSec & Vulnerability Source Code Review', price: 3500, time: '5 Days', auto: false, desc: 'Source code audits, dependency scans, and hardening for Web2/Web3 stacks.', related: [R.bonsai] },
  { id: 'dev-2', cat: 'dev', title: 'Dockerization & CI/CD Pipeline Setup', price: 1600, time: '2 Days', auto: true, desc: 'GitHub Actions pipelines that test, build, and deploy to cloud or ICP targets.', related: [R.bonsai] },
  { id: 'dev-3', cat: 'dev', title: 'Full-Stack Web App (React / Node)', price: 4200, time: '10 Days', auto: false, desc: 'Responsive web platforms, client dashboards, and microservice APIs.', related: [R.bonsai] },
  { id: 'dev-4', cat: 'dev', title: 'Custom Shopify Private App Development', price: 2400, time: '5 Days', auto: false, desc: 'Storefront extensions, private APIs, and checkout automation — including Drop-Shipping-Beast-class ops patterns.', related: [R.merch] },
  { id: 'dev-5', cat: 'dev', title: 'Roblox / Game Logic Mechanics Integration', price: 1900, time: '4 Days', auto: false, desc: 'Modular gameplay scripting with Rojo and Luau for immersive virtual worlds.', related: [] },

  { id: 'ecom-1', cat: 'ecom', title: 'Turnkey Print-On-Demand Store Engine', price: 1750, time: '3 Days', auto: true, desc: 'Shopify setup with POD fulfillment, tax routing, and order automation.', related: [R.merch] },
  { id: 'ecom-2', cat: 'ecom', title: 'Streetwear Apparel Tech Pack Creation', price: 1100, time: '3 Days', auto: false, desc: 'Factory-ready garment specs, sizing charts, vector placements, and fabric callouts.', related: [R.merch] },
  { id: 'ecom-3', cat: 'ecom', title: 'Web3 Token-Gated Storefront Setup', price: 2600, time: '4 Days', auto: false, desc: 'Wallet authentication into store logic to unlock physical drops for NFT holders.', related: [R.merch, R.orbit] },
  { id: 'ecom-4', cat: 'ecom', title: 'Digital Asset Provenance & NFC Setup', price: 2100, time: '4 Days', auto: true, desc: 'Certificate pipelines connecting physical products to on-chain records via QR/NFC.', related: [R.merch, R.bazaar] },
  { id: 'ecom-5', cat: 'ecom', title: 'Automated Lifecycle Email Marketing Flows', price: 850, time: '2 Days', auto: true, desc: 'Klaviyo/SMS sequences for abandoned cart, post-purchase, and retargeting.', related: [R.merch] },

  { id: 'art-1', cat: 'art', title: '3D Game Asset Modeling & Texturing', price: 1650, time: '4 Days', auto: false, desc: 'Low-poly or high-detail Blender models, props, and stylized environments.', related: [] },
  { id: 'art-2', cat: 'art', title: 'Visual Identity Branding Package', price: 1950, time: '5 Days', auto: false, desc: 'Key visuals, character concepts, promotional templates, and vector branding systems.', related: [R.gumroad] },
  { id: 'art-3', cat: 'art', title: 'NFT Programmatic Collection Pipeline', price: 2300, time: '3 Days', auto: true, desc: 'Trait combination scripts, metadata, and rarity tiers — NFT Matrix-class generator workflows.', related: [R.matrix, R.orbit] },
  { id: 'art-4', cat: 'art', title: 'Social Media Visual Motion Content Pack', price: 900, time: '2 Days', auto: true, desc: 'Video loop assets, animated teasers, and template-driven social banners.', related: [] },
  { id: 'art-5', cat: 'art', title: 'Animated Audio Visualizer Video', price: 750, time: '2 Days', auto: false, desc: 'Synth/cyber-themed motion backgrounds for artist releases and streaming.', related: [R.radio] },

  { id: 'audio-1', cat: 'audio', title: 'Custom Instrumental Beat Licensing', price: 600, time: '1 Day', auto: true, desc: 'Commercial licensing for dark electronic, synthwave, techno, or dubstep instrumentals.', related: [R.machina, R.radio] },
  { id: 'audio-2', cat: 'audio', title: 'Electronic Music Mixing & Mastering', price: 450, time: '2 Days', auto: false, desc: 'Stereo mastering and club loudness optimization tuned for streaming (−14 LUFS).', related: [R.machina] },
  { id: 'audio-3', cat: 'audio', title: 'Generative Audio Sample Pack Engine', price: 800, time: '2 Days', auto: true, desc: 'Drum kits, synth presets, and atmospheric loops via hybrid AI/DAW pipelines — Machina-adjacent sound design.', related: [R.machina] },
  { id: 'audio-4', cat: 'audio', title: 'Video Game Sound Design & SFX Bundle', price: 1250, time: '3 Days', auto: false, desc: 'UI cues, ambient pads, and action SFX for game engines.', related: [R.machina] },
  { id: 'audio-5', cat: 'audio', title: '24/7 Automated Web Radio Stream Server', price: 1100, time: '2 Days', auto: true, desc: 'Icecast/AzuraCast setup with live metadata — patterns used for Bonsai Radio-class stations.', related: [R.radio] },
];

window.T3KNO_SOLUTIONS.CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'web3', label: 'Web3 & Crypto' },
  { id: 'ai', label: 'AI & Agents' },
  { id: 'dev', label: 'Security & Dev' },
  { id: 'ecom', label: 'E-Commerce' },
  { id: 'art', label: '3D & Visuals' },
  { id: 'audio', label: 'Audio & SFX' },
];
