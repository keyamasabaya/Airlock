// Airlock extension - content script for claude.ai
//
// Carte flottante rappelant le focus courant :
//  - ancree en bas a droite par defaut, deplacable, position persistee
//  - une pulsation par minute, a partir de 30 s apres le chargement
//
// Le rappel doit se remarquer sans harceler : une seule pulsation, jamais
// pendant un deplacement, jamais sur un onglet en arriere-plan.

const KEY = 'airlock_state';
const UI_KEY = 'airlock_ui';        // position de la carte, hors donnees exportees

const PULSE_DELAY = 30000;          // premier rappel : 30 s apres le chargement
const PULSE_EVERY = 60000;          // puis toutes les minutes
const PULSE_MS = 1100;              // duree de l'animation, cf. content.css
const MARGIN = 12;                  // marge minimale au bord de la fenetre

let bannerEl = null;
let pos = null;                     // { left, top } une fois deplacee
let dragging = false;

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// ─── etat ───────────────────────────────────────────────────────────────

function getState(cb) {
  chrome.storage.local.get([KEY, UI_KEY], r => {
    const ui = r[UI_KEY];
    if (ui && typeof ui.left === 'number' && typeof ui.top === 'number') pos = ui;
    cb(r[KEY] || { focus: null, queue: [] });
  });
}

function savePos() {
  if (pos) chrome.storage.local.set({ [UI_KEY]: pos });
}

// ─── position ───────────────────────────────────────────────────────────

// Garde la carte entierement visible : une position enregistree sur un grand
// ecran ne doit pas la rejeter hors cadre sur un petit.
function clamp(left, top, el) {
  const w = el.offsetWidth || 310;
  const h = el.offsetHeight || 120;
  return {
    left: Math.min(Math.max(left, MARGIN), Math.max(MARGIN, window.innerWidth - w - MARGIN)),
    top: Math.min(Math.max(top, MARGIN), Math.max(MARGIN, window.innerHeight - h - MARGIN)),
  };
}

function applyPos(el) {
  if (!pos) return;                 // jamais deplacee : le CSS ancre en bas a droite
  const p = clamp(pos.left, pos.top, el);
  el.style.left = p.left + 'px';
  el.style.top = p.top + 'px';
  el.style.right = 'auto';
  el.style.bottom = 'auto';
}

function enableDrag(el, handle) {
  let dx = 0, dy = 0, id = null;

  handle.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    if (e.target.closest('.airlock-close')) return;   // le bouton reste cliquable

    const r = el.getBoundingClientRect();
    dx = e.clientX - r.left;
    dy = e.clientY - r.top;
    id = e.pointerId;
    dragging = true;

    // fige la carte en coordonnees left/top avant de la suivre
    el.style.left = r.left + 'px';
    el.style.top = r.top + 'px';
    el.style.right = 'auto';
    el.style.bottom = 'auto';
    el.classList.add('airlock-dragging');
    el.classList.remove('airlock-pulse');

    handle.setPointerCapture(id);
    e.preventDefault();
  });

  handle.addEventListener('pointermove', e => {
    if (!dragging || e.pointerId !== id) return;
    const p = clamp(e.clientX - dx, e.clientY - dy, el);
    el.style.left = p.left + 'px';
    el.style.top = p.top + 'px';
  });

  const end = e => {
    if (!dragging || (id !== null && e.pointerId !== id)) return;
    dragging = false;
    el.classList.remove('airlock-dragging');
    if (id !== null && handle.hasPointerCapture(id)) handle.releasePointerCapture(id);
    id = null;

    const r = el.getBoundingClientRect();
    pos = { left: r.left, top: r.top };
    savePos();
  };
  handle.addEventListener('pointerup', end);
  handle.addEventListener('pointercancel', end);
}

// ─── rendu ──────────────────────────────────────────────────────────────

const GRIP = '<svg class="airlock-grip" viewBox="0 0 16 16" aria-hidden="true">'
  + '<g fill="currentColor">'
  + '<circle cx="6" cy="4" r="1.4"/><circle cx="10" cy="4" r="1.4"/>'
  + '<circle cx="6" cy="8" r="1.4"/><circle cx="10" cy="8" r="1.4"/>'
  + '<circle cx="6" cy="12" r="1.4"/><circle cx="10" cy="12" r="1.4"/>'
  + '</g></svg>';

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

function createBanner(state) {
  const wasDismissed = bannerEl && bannerEl.dataset.dismissed === '1';
  if (bannerEl) bannerEl.remove();
  bannerEl = null;
  if (wasDismissed) return;                 // ferme par l'utilisateur : on n'insiste pas

  const isNewChat = location.pathname === '/new' || location.pathname === '/';
  const hasFocus = !!state.focus;
  if (!hasFocus && !isNewChat) return;      // ni focus ni page d'accueil : silence

  const card = el('div', 'airlock-banner');
  card.id = 'airlock-banner';
  card.setAttribute('role', 'complementary');
  card.setAttribute('aria-label', 'Airlock — focus actuel');

  // entete
  const head = el('div', 'airlock-head');
  head.innerHTML = GRIP;
  head.appendChild(el('p', 'airlock-label', hasFocus ? 'focus actuel' : 'aucun focus défini'));

  const close = el('button', 'airlock-close', '×');
  close.type = 'button';
  close.title = 'Masquer — Ctrl+Shift+Q pour rouvrir Airlock';
  close.setAttribute('aria-label', 'Masquer le rappel Airlock');
  close.addEventListener('click', () => {
    card.dataset.dismissed = '1';
    card.remove();
  });
  head.appendChild(close);
  card.appendChild(head);

  // corps
  const body = el('div', 'airlock-body');

  if (hasFocus) {
    const f = el('p', 'airlock-focus');
    f.appendChild(el('span', 'airlock-dot'));
    f.appendChild(el('span', 'airlock-focus-text', state.focus));
    body.appendChild(f);

    const meta = el('div', 'airlock-meta');
    const n = (state.queue || []).length;
    const chip = el('span', 'airlock-chip');
    chip.appendChild(el('span', null, n > 0 ? `${n} en file` : 'file vide'));
    meta.appendChild(chip);
    body.appendChild(meta);
  } else {
    const f = el('p', 'airlock-focus');
    f.appendChild(el('span', 'airlock-dot idle'));
    f.appendChild(el('span', 'airlock-focus-text', 'Rien en cours'));
    body.appendChild(f);

    body.appendChild(el('p', 'airlock-nudge',
      'Capture ton intention dans le sas avant de plonger dans une nouvelle conversation.'));

    const meta = el('div', 'airlock-meta');
    const kbd = el('kbd', null, 'Ctrl+Shift+Q');
    meta.appendChild(kbd);
    body.appendChild(meta);
  }

  card.appendChild(body);
  document.body.appendChild(card);

  applyPos(card);
  enableDrag(card, head);
  bannerEl = card;
}

function refresh() {
  getState(state => createBanner(state));
}

// ─── pulsation ──────────────────────────────────────────────────────────

function pulse() {
  if (!bannerEl || dragging) return;
  if (document.hidden) return;              // inutile sur un onglet en arriere-plan
  if (reducedMotion.matches) return;

  bannerEl.classList.remove('airlock-pulse');
  void bannerEl.offsetWidth;                // force le redemarrage de l'animation
  bannerEl.classList.add('airlock-pulse');
  setTimeout(() => bannerEl && bannerEl.classList.remove('airlock-pulse'), PULSE_MS);
}

// Le calendrier part du chargement de la page, pas de chaque rendu de la carte.
setTimeout(() => {
  pulse();
  setInterval(pulse, PULSE_EVERY);
}, PULSE_DELAY);

// ─── synchronisation ────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener(msg => {
  if (msg.type === 'airlock_update') createBanner(msg.state);
});

chrome.storage.onChanged.addListener(changes => {
  if (changes[UI_KEY] && changes[UI_KEY].newValue) {
    pos = changes[UI_KEY].newValue;
    if (bannerEl) applyPos(bannerEl);
  }
  if (changes[KEY]) createBanner(changes[KEY].newValue || { focus: null, queue: [] });
});

// navigation interne de l'application, sans rechargement
let lastUrl = location.href;
new MutationObserver(() => {
  if (location.href === lastUrl) return;
  lastUrl = location.href;
  if (bannerEl) delete bannerEl.dataset.dismissed;   // nouvelle page, nouveau rappel
  setTimeout(refresh, 300);
}).observe(document.body, { childList: true, subtree: true });

// la fenetre retrecit : la carte doit rester visible
window.addEventListener('resize', () => { if (bannerEl) applyPos(bannerEl); });

refresh();
