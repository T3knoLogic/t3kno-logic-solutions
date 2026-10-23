/**
 * T3kNo-Logic Solutions — public sales desk
 */
(function () {
  'use strict';

  function cfg() {
    return window.T3KNO_CONFIG || {};
  }

  const CART_STORAGE_KEY = 't3kno_solutions_estimator_cart';
  const SERVICES = () => (window.T3KNO_SOLUTIONS && window.T3KNO_SOLUTIONS.SERVICES) || [];
  const CATEGORIES = () => (window.T3KNO_SOLUTIONS && window.T3KNO_SOLUTIONS.CATEGORIES) || [];
  const PACKAGES = () => (window.T3KNO_SOLUTIONS && window.T3KNO_SOLUTIONS.PACKAGES) || [];

  const DEMO_LEADS = [
    { client: 'Aegis Security Group', email: 'contact@aegis-sec.io', service: 'ICP Canister Architecture & Deployment', value: 2800, status: 'Active', date: '2026-10-12' },
    { client: 'Neos Commerce Ltd', email: 'dev@neos.shop', service: 'Turnkey Print-On-Demand Store Engine', value: 1750, status: 'Retainer', date: '2026-09-28' },
    { client: 'VaporSynth Audio', email: 'alex@vaporsynth.fm', service: 'Custom AI Agent Deployment (ElizaOS)', value: 3200, status: 'Queued', date: '2026-10-16' },
  ];

  let currentTab = 'catalog';
  let currentCategory = 'all';
  let activePackage = null;
  let cart = new Set();
  let bookStep = 1;
  let pendingServices = [];
  let selectedSlot = '09:00 UTC';
  let lastBriefSent = false;

  function contactEmail() {
    return cfg().CONTACT_EMAIL || 't3k@t3kno-logic.xyz';
  }
  function contactPhone() {
    return cfg().CONTACT_PHONE || '+19092765764';
  }
  function contactPhoneDisplay() {
    return cfg().CONTACT_PHONE_DISPLAY || '(909) 276-5764';
  }

  function opsEnabled() {
    return new URLSearchParams(location.search).get('ops') === '1';
  }

  function loadCart() {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (raw) cart = new Set(JSON.parse(raw));
    } catch (_) {
      cart = new Set();
    }
  }

  function saveCart() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(Array.from(cart)));
  }

  function money(n) {
    return '$' + Number(n || 0).toLocaleString();
  }

  function selectedServices() {
    return SERVICES().filter((s) => cart.has(s.id));
  }

  function maxLeadDays(list) {
    let max = 0;
    list.forEach((s) => {
      const d = parseInt(String(s.time), 10) || 0;
      if (d > max) max = d;
    });
    return max ? max + 2 : 0;
  }

  function packagePrice(pkg) {
    return pkg.serviceIds.reduce((sum, id) => {
      const s = SERVICES().find((x) => x.id === id);
      return sum + (s ? s.price : 0);
    }, 0);
  }

  function track(eventName, props) {
    try {
      if (typeof window.plausible === 'function') {
        window.plausible(eventName, props ? { props } : undefined);
      }
    } catch (_) {}
  }

  function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => {
      el.classList.add('is-out');
      setTimeout(() => el.remove(), 280);
    }, 3200);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function switchTab(tabId) {
    if (tabId === 'ops' && !opsEnabled()) {
      showToast('Ops demo is gated. Use ?ops=1');
      return;
    }
    currentTab = tabId;
    document.querySelectorAll('.tab-panel').forEach((panel) => {
      const match = panel.id === 'tab-' + tabId;
      panel.classList.toggle('is-active', match);
      if (panel.id === 'tab-ops') panel.hidden = !opsEnabled() || !match;
    });
    document.querySelectorAll('.nav-btn[data-tab]').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.tab === tabId);
    });
    if (tabId === 'estimator') {
      renderPackages();
      renderEstimator();
    }
    if (tabId === 'ops') renderOps();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('mobile-nav')?.classList.remove('is-open');
  }

  function toggleMobileNav() {
    document.getElementById('mobile-nav')?.classList.toggle('is-open');
  }

  function renderPackages() {
    const hosts = [
      document.getElementById('package-bar'),
      document.getElementById('package-bar-est'),
    ].filter(Boolean);

    const html = PACKAGES()
      .map((pkg) => {
        const total = packagePrice(pkg);
        const active = activePackage === pkg.id ? ' is-active' : '';
        return `
        <button type="button" class="pkg-card${active}" data-package="${pkg.id}">
          <strong>${escapeHtml(pkg.name)}</strong>
          <div class="pkg-blurb">${escapeHtml(pkg.blurb)}</div>
          <div class="pkg-meta">${pkg.serviceIds.length} modules · from ${money(total)}</div>
        </button>`;
      })
      .join('');

    hosts.forEach((h) => {
      h.innerHTML = html || '';
    });
  }

  function applyPackage(pkgId) {
    const pkg = PACKAGES().find((p) => p.id === pkgId);
    if (!pkg) return;
    activePackage = pkgId;
    cart = new Set(pkg.serviceIds);
    saveCart();
    updateCartBadge();
    renderPackages();
    renderCatalog();
    renderEstimator();
    track('PackageSelect', { package: pkgId });
    showToast(`${pkg.name} package loaded into estimator.`);
    switchTab('estimator');
  }

  function renderCategoryButtons() {
    const host = document.getElementById('cat-filters');
    if (!host) return;
    const total = SERVICES().length;
    host.innerHTML = CATEGORIES()
      .map((c) => {
        const count =
          c.id === 'all' ? total : SERVICES().filter((s) => s.cat === c.id).length;
        const label = c.id === 'all' ? `All (${count})` : c.label;
        return `<button type="button" class="cat-btn${
          currentCategory === c.id ? ' is-active' : ''
        }" data-cat="${c.id}">${escapeHtml(label)}</button>`;
      })
      .join('');
  }

  function relatedHtml(s) {
    if (!s.related || !s.related.length) return '';
    return `<div class="related-links">${s.related
      .map(
        (r) =>
          `<a href="${escapeHtml(r.url)}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">${escapeHtml(
            r.label
          )}</a>`
      )
      .join('')}</div>`;
  }

  function renderCatalog() {
    const grid = document.getElementById('catalog-grid');
    const searchEl = document.getElementById('service-search');
    const autoEl = document.getElementById('autopilot-toggle');
    if (!grid) return;

    const q = (searchEl && searchEl.value.trim().toLowerCase()) || '';
    const autoOnly = autoEl && autoEl.checked;

    const filtered = SERVICES().filter((s) => {
      const matchCat = currentCategory === 'all' || s.cat === currentCategory;
      const matchSearch =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.desc.toLowerCase().includes(q);
      return matchCat && matchSearch && (autoOnly ? s.auto : true);
    });

    const metaCount = document.getElementById('meta-showing');
    if (metaCount) metaCount.textContent = String(filtered.length);

    if (!filtered.length) {
      grid.innerHTML = `
        <div class="empty-state panel">
          <p>No modules match these filters.</p>
          <button type="button" class="btn btn-ghost" id="reset-filters" style="margin-top:0.75rem">Reset filters</button>
        </div>`;
      document.getElementById('reset-filters')?.addEventListener('click', () => {
        if (searchEl) searchEl.value = '';
        if (autoEl) autoEl.checked = false;
        currentCategory = 'all';
        renderCategoryButtons();
        renderCatalog();
      });
      return;
    }

    grid.innerHTML = filtered
      .map((s) => {
        const inCart = cart.has(s.id);
        return `
        <article class="service-card">
          ${s.auto ? '<span class="badge-auto">Auto-pilot ready</span>' : ''}
          <div>
            <div class="service-cat">Module // ${escapeHtml(s.cat)}</div>
            <h3 class="service-title">${escapeHtml(s.title)}</h3>
            <p class="service-desc">${escapeHtml(s.desc)}</p>
            ${relatedHtml(s)}
          </div>
          <div class="service-foot">
            <div>
              <span class="price-label">From</span>
              <span class="price">${money(s.price)}</span>
            </div>
            <div class="card-actions">
              <button type="button" class="icon-btn${inCart ? ' is-on' : ''}" data-toggle-cart="${s.id}" title="Add to scope estimator" aria-label="Toggle estimator">+</button>
              <button type="button" class="btn btn-primary" data-book="${s.id}">Book</button>
            </div>
          </div>
        </article>`;
      })
      .join('');
  }

  function toggleCart(id) {
    activePackage = null;
    if (cart.has(id)) cart.delete(id);
    else cart.add(id);
    saveCart();
    renderPackages();
    renderCatalog();
    if (currentTab === 'estimator') renderEstimator();
    updateCartBadge();
  }

  function clearCart() {
    activePackage = null;
    cart.clear();
    saveCart();
    renderPackages();
    renderCatalog();
    renderEstimator();
    updateCartBadge();
  }

  function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) badge.textContent = String(cart.size);
  }

  function renderEstimator() {
    const list = document.getElementById('estimator-list');
    const cartHost = document.getElementById('estimator-cart');
    const totalEl = document.getElementById('est-total');
    const timeEl = document.getElementById('est-time');
    const proceed = document.getElementById('btn-estimator-proceed');
    const countBadge = document.getElementById('summary-count');
    if (!list) return;

    list.innerHTML = SERVICES()
      .map((s) => {
        const checked = cart.has(s.id);
        return `
        <label class="est-row${checked ? ' is-checked' : ''}">
          <div style="display:flex;gap:0.75rem;align-items:flex-start;flex:1;min-width:0">
            <input type="checkbox" data-est-toggle="${s.id}" ${checked ? 'checked' : ''} />
            <div>
              <div class="est-row-title">${escapeHtml(s.title)}</div>
              <div class="est-row-desc">${escapeHtml(s.desc)}</div>
            </div>
          </div>
          <div class="est-row-meta">
            <div style="color:var(--accent);font-weight:700">${money(s.price)}</div>
            <div style="color:var(--muted)">${escapeHtml(s.time)}</div>
          </div>
        </label>`;
      })
      .join('');

    const selected = selectedServices();
    if (countBadge) countBadge.textContent = `${selected.length} selected`;

    if (!selected.length) {
      if (cartHost) {
        cartHost.innerHTML =
          '<div class="cart-empty">No modules selected. Use a package or check boxes.</div>';
      }
      if (totalEl) totalEl.textContent = '$0';
      if (timeEl) timeEl.textContent = '—';
      if (proceed) proceed.disabled = true;
      return;
    }

    let total = 0;
    if (cartHost) {
      cartHost.innerHTML = selected
        .map((s) => {
          total += s.price;
          return `
          <div class="cart-item">
            <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(s.title)}</span>
            <span style="display:flex;gap:0.5rem;align-items:center;flex-shrink:0">
              <span style="color:var(--accent)">${money(s.price)}</span>
              <button type="button" class="icon-btn" data-toggle-cart="${s.id}" style="width:1.5rem;height:1.5rem;font-size:0.7rem" aria-label="Remove">×</button>
            </span>
          </div>`;
        })
        .join('');
    } else {
      total = selected.reduce((sum, s) => sum + s.price, 0);
    }

    if (totalEl) totalEl.textContent = money(total);
    if (timeEl) timeEl.textContent = `Est. ${maxLeadDays(selected)} business days`;
    if (proceed) proceed.disabled = false;
  }

  function openBookModal(services) {
    pendingServices = services && services.length ? services : selectedServices();
    if (!pendingServices.length) pendingServices = SERVICES().slice(0, 1);
    lastBriefSent = false;
    const done = document.getElementById('book-done');
    if (done) done.hidden = true;
    const deposit = document.getElementById('deposit-cta');
    if (deposit) deposit.hidden = true;

    setBookStep(1);
    renderBookStep1();
    setupKickoffUi();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateEl = document.getElementById('ob-date');
    if (dateEl) dateEl.value = tomorrow.toISOString().split('T')[0];
    renderSlots();
    document.getElementById('book-modal')?.classList.add('is-open');
    track('BookOpen', { modules: pendingServices.length });
  }

  function closeBookModal() {
    document.getElementById('book-modal')?.classList.remove('is-open');
  }

  function setBookStep(n) {
    bookStep = n;
    document.querySelectorAll('.step').forEach((el) => {
      el.classList.toggle('is-active', el.id === 'book-step-' + n);
    });
    const num = document.getElementById('book-step-num');
    if (num) num.textContent = String(n);
    const bar = document.getElementById('book-progress');
    if (bar) bar.style.width = (n / 3) * 100 + '%';
  }

  function renderBookStep1() {
    const list = document.getElementById('book-scope-list');
    const totalEl = document.getElementById('book-total');
    const total = pendingServices.reduce((sum, s) => sum + s.price, 0);
    if (totalEl) totalEl.textContent = money(total);
    if (list) {
      list.innerHTML = pendingServices
        .map(
          (s) => `
        <div class="scope-item">
          <span><strong>${escapeHtml(s.title)}</strong><br/><span style="color:var(--muted);font-size:0.75rem">${escapeHtml(s.time)}</span></span>
          <span>${money(s.price)}</span>
        </div>`
        )
        .join('');
    }
  }

  function setupKickoffUi() {
    const calUrl = (cfg().CALENDLY_URL || '').trim();
    const calBlock = document.getElementById('calendly-block');
    const calLink = document.getElementById('calendly-link');
    const fallback = document.getElementById('slot-fallback');
    const copy = document.getElementById('book-step3-copy');

    if (calUrl && calBlock && calLink) {
      calBlock.hidden = false;
      calLink.href = calUrl;
      if (copy) {
        copy.textContent =
          'Book a kickoff on Calendly (new tab), then send the brief below. Optional discovery retainer appears after send.';
      }
      if (fallback) fallback.style.opacity = '0.85';
    } else if (calBlock) {
      calBlock.hidden = true;
    }
  }

  function renderSlots() {
    const host = document.getElementById('time-slots');
    if (!host) return;
    const slots = ['09:00 UTC', '11:30 UTC', '14:00 UTC', '16:30 UTC', '19:00 UTC'];
    if (!slots.includes(selectedSlot)) selectedSlot = slots[0];
    host.innerHTML = slots
      .map(
        (slot) =>
          `<button type="button" class="slot-btn${
            slot === selectedSlot ? ' is-selected' : ''
          }" data-slot="${slot}">${slot}</button>`
      )
      .join('');
  }

  function validateContact() {
    const name = document.getElementById('ob-name')?.value.trim();
    const email = document.getElementById('ob-email')?.value.trim();
    if (!name || !email) {
      showToast('Name and business email are required.');
      return false;
    }
    return true;
  }

  function buildBriefText() {
    const name = document.getElementById('ob-name').value.trim();
    const email = document.getElementById('ob-email').value.trim();
    const company = document.getElementById('ob-company').value.trim() || '—';
    const principal = document.getElementById('ob-principal').value.trim() || '—';
    const notes = document.getElementById('ob-notes').value.trim() || '—';
    const date = document.getElementById('ob-date').value || '—';
    const total = pendingServices.reduce((sum, s) => sum + s.price, 0);
    const cal = (cfg().CALENDLY_URL || '').trim();
    return [
      'T3kNo-Logic Solutions — Scope Brief',
      '=================================',
      '',
      `Contact: ${name}`,
      `Email: ${email}`,
      `Company / project: ${company}`,
      `Phone (desk): ${contactPhoneDisplay()}`,
      `Canopy / II principal (optional): ${principal}`,
      `Preferred kickoff: ${date} @ ${selectedSlot}`,
      cal ? `Calendly: ${cal}` : '',
      '',
      'Selected modules:',
      ...pendingServices.map((s) => `  - ${s.title} (${s.time}) — ${money(s.price)}`),
      '',
      `Estimated total: ${money(total)}`,
      `Estimated lead time: ~${maxLeadDays(pendingServices)} business days`,
      '',
      'Notes:',
      notes,
      '',
      '— Generated by T3kNo-Logic Solutions sales desk (estimate only; not an invoice).',
    ]
      .filter((line) => line !== '')
      .join('\n');
  }

  async function postFormspree(brief, subject) {
    const id = (cfg().FORMSPREE_ID || '').trim();
    if (!id) return { ok: false, skipped: true };

    const name = document.getElementById('ob-name').value.trim();
    const email = document.getElementById('ob-email').value.trim();
    const company = document.getElementById('ob-company').value.trim();
    const principal = document.getElementById('ob-principal').value.trim();
    const notes = document.getElementById('ob-notes').value.trim();
    const date = document.getElementById('ob-date').value;

    try {
      const res = await fetch(`https://formspree.io/f/${id}`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _subject: subject,
          name,
          email,
          company,
          principal,
          notes,
          kickoff: `${date} @ ${selectedSlot}`,
          modules: pendingServices.map((s) => s.title).join('; '),
          estimate: pendingServices.reduce((sum, s) => sum + s.price, 0),
          brief,
          phone_reply_to: contactPhoneDisplay(),
        }),
      });
      if (!res.ok) throw new Error('Formspree ' + res.status);
      return { ok: true };
    } catch (err) {
      console.warn(err);
      return { ok: false, error: err };
    }
  }

  function lookLikePrincipal(text) {
    const t = String(text || '').trim();
    return /^[a-z0-9-]{5,}$/i.test(t) && t.includes('-');
  }

  /**
   * Stripe Checkout for discovery retainer.
   * Card pay does NOT require a Canopy principal — email from the brief is enough.
   * If they pasted a principal, it is forwarded for optional ICP linkage.
   */
  function buildStripeDepositUrl() {
    const fixed = (cfg().STRIPE_DEPOSIT_URL || '').trim();
    if (fixed) return fixed;

    const bridge = String(cfg().STRIPE_BRIDGE_ORIGIN || 'https://stripe.bonsaios.app').replace(/\/$/, '');
    const product = cfg().STRIPE_DEPOSIT_PRODUCT || 'discovery_retainer';
    const email = (document.getElementById('ob-email')?.value || '').trim();
    const principal = (document.getElementById('ob-principal')?.value || '').trim();
    const u = new URL(bridge + '/checkout');
    u.searchParams.set('product', product);
    if (lookLikePrincipal(principal)) u.searchParams.set('principal', principal);
    if (email) u.searchParams.set('email', email);
    const success = (cfg().STRIPE_SUCCESS_URL || '').trim();
    const cancel = (cfg().STRIPE_CANCEL_URL || '').trim();
    if (success) u.searchParams.set('success_url', success);
    if (cancel) u.searchParams.set('cancel_url', cancel);
    return u.toString();
  }

  function showDepositCta() {
    const wrap = document.getElementById('deposit-cta');
    if (!wrap) return;
    wrap.hidden = false;
    const amt = document.getElementById('deposit-amount');
    if (amt) amt.textContent = String(cfg().DISCOVERY_RETAINER_USD || 250);
    const stripe = document.getElementById('deposit-stripe');
    const stripeUrl = buildStripeDepositUrl();
    const hint = document.getElementById('deposit-stripe-hint');
    if (stripe) {
      stripe.hidden = false;
      stripe.href = stripeUrl || '#';
      stripe.removeAttribute('aria-disabled');
      stripe.classList.remove('is-disabled');
    }
    if (hint) hint.hidden = true;
    const canopy = document.getElementById('deposit-canopy');
    if (canopy) canopy.href = cfg().CANOPY_URL || 'https://7h6n6-eqaaa-aaaau-ag6da-cai.icp0.io/';
  }

  function onDepositStripeClick(e) {
    track('DepositStripeClick');
    const url = buildStripeDepositUrl();
    const stripe = document.getElementById('deposit-stripe');
    if (url && stripe) {
      stripe.href = url;
      return;
    }
    e.preventDefault();
    showToast('Stripe checkout is temporarily unavailable — email t3k@t3kno-logic.xyz or try again shortly.');
  }

  function handleStripeReturnQuery() {
    const q = new URLSearchParams(location.search).get('stripe');
    if (!q) return;
    if (q === 'retainer_success') {
      showToast('Discovery retainer paid — thank you. We will confirm kickoff by email.');
      track('DepositStripeSuccess');
    } else if (q === 'retainer_cancel') {
      showToast('Stripe checkout canceled — retainer not charged.');
      track('DepositStripeCancel');
    }
    try {
      const u = new URL(location.href);
      u.searchParams.delete('stripe');
      history.replaceState({}, '', u.pathname + u.search + u.hash);
    } catch (_) {
      /* ignore */
    }
  }

  function markDone() {
    const done = document.getElementById('book-done');
    if (done) {
      done.hidden = false;
      const code = document.getElementById('done-email');
      if (code) code.textContent = contactEmail();
    }
    showDepositCta();
    lastBriefSent = true;
  }

  function printBriefPdf() {
    if (!validateContact()) {
      setBookStep(2);
      return;
    }
    const brief = buildBriefText();
    const host = document.getElementById('print-brief');
    if (host) {
      host.innerHTML = `<h1>T3kNo-Logic Solutions — Scope Brief</h1><pre>${escapeHtml(brief)}</pre>`;
    }
    track('BriefPdf');
    window.print();
  }

  async function submitLead(action) {
    if (!validateContact()) {
      setBookStep(2);
      return;
    }
    const brief = buildBriefText();
    const name = document.getElementById('ob-name').value.trim();
    const total = pendingServices.reduce((sum, s) => sum + s.price, 0);
    const subject = `Scope request: ${name} — ${money(total)}`;

    if (action === 'copy') {
      try {
        await navigator.clipboard.writeText(brief);
        showToast('Brief copied to clipboard.');
      } catch (_) {
        fallbackCopy(brief);
      }
      track('BriefCopy');
      return;
    }

    if (action === 'download') {
      const blob = new Blob([brief], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 't3kno-solutions-scope-brief.txt';
      a.click();
      URL.revokeObjectURL(url);
      showToast('Brief downloaded.');
      track('BriefDownload');
      return;
    }

    if (action === 'pdf') {
      printBriefPdf();
      return;
    }

    // Primary send: Formspree when configured, always offer mailto fallback
    if (action === 'send') {
      const fs = await postFormspree(brief, subject);
      if (fs.ok) {
        showToast('Brief sent to the desk (Formspree).');
        track('BriefFormspree');
      } else if (fs.skipped) {
        const mailto =
          'mailto:' +
          encodeURIComponent(contactEmail()) +
          '?subject=' +
          encodeURIComponent(subject) +
          '&body=' +
          encodeURIComponent(brief);
        window.location.href = mailto;
        showToast('Opening email client…');
        track('BriefMailto');
      } else {
        showToast('Formspree failed — falling back to email.');
        const mailto =
          'mailto:' +
          encodeURIComponent(contactEmail()) +
          '?subject=' +
          encodeURIComponent(subject) +
          '&body=' +
          encodeURIComponent(brief);
        window.location.href = mailto;
        track('BriefMailtoFallback');
      }
      markDone();
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast('Brief copied to clipboard.');
    } catch (_) {
      showToast('Copy failed — use Download instead.');
    }
    ta.remove();
  }

  function renderOps() {
    const host = document.getElementById('ops-tbody');
    if (!host) return;
    host.innerHTML = DEMO_LEADS.map(
      (l) => `
      <tr>
        <td><strong>${escapeHtml(l.client)}</strong><br/><span style="color:var(--muted)">${escapeHtml(l.email)}</span></td>
        <td>${escapeHtml(l.service)}</td>
        <td>${escapeHtml(l.status)}</td>
        <td>${money(l.value)}</td>
        <td>${escapeHtml(l.date)}</td>
      </tr>`
    ).join('');
  }

  function onClick(e) {
    const pkg = e.target.closest('[data-package]');
    if (pkg) {
      applyPackage(pkg.dataset.package);
      return;
    }

    const t = e.target.closest('[data-tab]');
    if (t && t.dataset.tab) {
      e.preventDefault();
      switchTab(t.dataset.tab);
      return;
    }

    const cat = e.target.closest('[data-cat]');
    if (cat && cat.dataset.cat) {
      currentCategory = cat.dataset.cat;
      track('CategoryFilter', { cat: currentCategory });
      renderCategoryButtons();
      renderCatalog();
      return;
    }

    const toggle = e.target.closest('[data-toggle-cart]');
    if (toggle) {
      toggleCart(toggle.dataset.toggleCart);
      return;
    }

    const book = e.target.closest('[data-book]');
    if (book) {
      const svc = SERVICES().find((s) => s.id === book.dataset.book);
      if (svc) {
        track('BookClick', { service: svc.id, cat: svc.cat });
        openBookModal([svc]);
      }
      return;
    }

    const est = e.target.closest('[data-est-toggle]');
    if (est) {
      toggleCart(est.dataset.estToggle);
      return;
    }

    const slot = e.target.closest('[data-slot]');
    if (slot) {
      selectedSlot = slot.dataset.slot;
      renderSlots();
    }
  }

  function injectPlausible() {
    const domain = (cfg().PLAUSIBLE_DOMAIN || '').trim();
    if (!domain) return;
    if (document.querySelector('script[data-t3kno-plausible]')) return;
    const s = document.createElement('script');
    s.defer = true;
    s.dataset.domain = domain;
    s.dataset.t3knoPlausible = '1';
    s.src = 'https://plausible.io/js/script.js';
    document.head.appendChild(s);
  }

  function loadLocalConfig() {
    return new Promise((resolve) => {
      const s = document.createElement('script');
      s.src = 'config.local.js';
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.head.appendChild(s);
    });
  }

  function wireContactUi() {
    const emailDisplay = document.getElementById('contact-email-display');
    if (emailDisplay) emailDisplay.textContent = contactEmail();
    const footerMail = document.getElementById('footer-mail');
    if (footerMail) footerMail.href = 'mailto:' + contactEmail();

    const phoneDisplay = document.getElementById('contact-phone-display');
    if (phoneDisplay) phoneDisplay.textContent = contactPhoneDisplay();
    const footerPhone = document.getElementById('footer-phone');
    if (footerPhone) {
      footerPhone.href = 'tel:' + contactPhone();
      footerPhone.setAttribute('aria-label', 'Call ' + contactPhoneDisplay());
    }
  }

  async function init() {
    await loadLocalConfig();
    injectPlausible();
    wireContactUi();
    loadCart();
    updateCartBadge();

    const autoCount = SERVICES().filter((s) => s.auto).length;
    const metaTotal = document.getElementById('meta-total');
    const metaAuto = document.getElementById('meta-auto');
    if (metaTotal) metaTotal.textContent = String(SERVICES().length);
    if (metaAuto) metaAuto.textContent = String(autoCount);

    renderPackages();
    renderCategoryButtons();
    renderCatalog();
    renderEstimator();

    document.addEventListener('click', onClick);

    document.getElementById('service-search')?.addEventListener('input', () => renderCatalog());
    document.getElementById('autopilot-toggle')?.addEventListener('change', () => renderCatalog());
    document.getElementById('menu-toggle')?.addEventListener('click', toggleMobileNav);

    document.getElementById('brand-btn')?.addEventListener('click', () => switchTab('catalog'));
    document.getElementById('cta-catalog')?.addEventListener('click', () => switchTab('catalog'));
    document.getElementById('cta-estimator')?.addEventListener('click', () => switchTab('estimator'));
    document.getElementById('cta-book')?.addEventListener('click', () => {
      openBookModal(cart.size ? selectedServices() : null);
    });

    document.getElementById('clear-cart')?.addEventListener('click', clearCart);
    document.getElementById('btn-estimator-proceed')?.addEventListener('click', () => {
      openBookModal(selectedServices());
    });

    document.getElementById('close-book')?.addEventListener('click', closeBookModal);
    document.getElementById('book-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'book-modal') closeBookModal();
    });

    document.getElementById('book-to-2')?.addEventListener('click', () => setBookStep(2));
    document.getElementById('book-back-1')?.addEventListener('click', () => setBookStep(1));
    document.getElementById('book-to-3')?.addEventListener('click', () => {
      if (validateContact()) setBookStep(3);
    });
    document.getElementById('book-back-2')?.addEventListener('click', () => setBookStep(2));

    document.getElementById('book-copy')?.addEventListener('click', () => submitLead('copy'));
    document.getElementById('book-download')?.addEventListener('click', () => submitLead('download'));
    document.getElementById('book-pdf')?.addEventListener('click', () => submitLead('pdf'));
    document.getElementById('book-submit')?.addEventListener('click', () => submitLead('send'));

    document.getElementById('deposit-stripe')?.addEventListener('click', onDepositStripeClick);
    document.getElementById('deposit-canopy')?.addEventListener('click', () => track('DepositCanopyClick'));
    document.getElementById('calendly-link')?.addEventListener('click', () => track('CalendlyClick'));
    document.getElementById('ob-principal')?.addEventListener('input', () => {
      if (lastBriefSent) showDepositCta();
    });

    handleStripeReturnQuery();

    if (opsEnabled() && location.hash === '#ops') switchTab('ops');
    else switchTab('catalog');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
