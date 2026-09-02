// Airlock extension - methodology view
//
// Volet gauche : les impulsions (focus, file, faites).
// Volet droit  : une methodologie numerotee pour l'impulsion selectionnee.
//
// La generation passe par un hote natif (Native Messaging) qui execute
// `claude -p` sur la machine de l'utilisateur. Une extension Chrome ne peut
// pas lancer de processus : c'est le seul pont supporte par le navigateur.
// Sans hote installe, la vue reste consultable et affiche la marche a suivre.

const KEY = 'airlock_state';
const HOST = 'com.airlock.methodology';

let state = { focus: null, queue: [], done: [], methodologies: {} };
let selected = null;   // texte de l'impulsion selectionnee
let busy = false;

const $ = id => document.getElementById(id);
const el = (tag, cls) => { const n = document.createElement(tag); if (cls) n.className = cls; return n; };

// ─── etat ──────────────────────────────────────────────────────────────

function load(cb) {
  chrome.storage.local.get([KEY], r => {
    state = Object.assign({ focus: null, queue: [], done: [], methodologies: {} }, r[KEY] || {});
    if (!state.methodologies) state.methodologies = {};
    cb();
  });
}

function save(cb) {
  chrome.storage.local.set({ [KEY]: state }, () => cb && cb());
}

// ─── volet gauche ──────────────────────────────────────────────────────

function impulseButton(text, kind) {
  const b = el('button', 'impulse');
  b.type = 'button';
  b.setAttribute('aria-current', String(text === selected));

  const dot = el('span', 'pill' + (kind === 'focus' ? ' is-focus' : kind === 'queue' ? ' is-queue' : ''));
  const txt = el('span', 'txt');
  txt.textContent = text;
  b.append(dot, txt);

  const m = state.methodologies[text];
  if (m && m.steps && m.steps.length) {
    const done = m.steps.filter(s => s.done).length;
    const badge = el('span', 'badge-count');
    badge.textContent = `${done}/${m.steps.length}`;
    b.appendChild(badge);
  }

  b.addEventListener('click', () => { selected = text; render(); });
  return b;
}

function renderList() {
  const host = $('impulseList');
  host.innerHTML = '';

  const groups = [
    ['Focus actuel', state.focus ? [state.focus] : [], 'focus'],
    ['File de priorités', state.queue || [], 'queue'],
    ['Fait', state.done || [], 'done'],
  ];

  let any = false;
  groups.forEach(([label, items, kind]) => {
    if (!items.length) return;
    any = true;
    const g = el('section', 'impulse-group');
    const h = el('div', 'eyebrow');
    h.textContent = label;
    g.appendChild(h);
    items.forEach(t => g.appendChild(impulseButton(t, kind)));
    host.appendChild(g);
  });

  if (!any) {
    const e = el('div', 'empty sunken');
    e.textContent = 'aucune impulsion — capture-en une avec Ctrl+Shift+Q';
    host.appendChild(e);
  }
}

// ─── volet droit ───────────────────────────────────────────────────────

function stateBlock(title, body, cls) {
  const d = el('div', 'state' + (cls ? ' ' + cls : ''));
  const h = el('h2');
  h.textContent = title;
  d.appendChild(h);
  if (body) {
    const p = el('p');
    p.textContent = body;
    d.appendChild(p);
  }
  return d;
}

function renderDetail() {
  const host = $('detail');
  host.innerHTML = '';

  if (!selected) {
    host.appendChild(stateBlock(
      'Choisis une impulsion',
      'Sélectionne une impulsion à gauche pour générer la méthodologie numérotée qui te mènera au bout.'
    ));
    return;
  }

  // entete
  const head = el('div', 'head');
  const h1 = el('h1');
  h1.textContent = selected;
  head.appendChild(h1);
  const m = state.methodologies[selected];
  if (m && m.generatedAt) {
    const meta = el('div', 'meta');
    meta.textContent = `Méthodologie générée le ${new Date(m.generatedAt).toLocaleString('fr-FR')}`;
    head.appendChild(meta);
  }
  host.appendChild(head);

  // barre d'action
  const bar = el('div', 'toolbar');
  const gen = el('button', 'btn btn-primary');
  gen.type = 'button';
  gen.textContent = m ? 'Regénérer' : 'Générer la méthodologie';
  gen.disabled = busy;
  gen.addEventListener('click', generate);
  bar.appendChild(gen);

  if (m) {
    const clear = el('button', 'btn');
    clear.type = 'button';
    clear.textContent = 'Supprimer';
    clear.disabled = busy;
    clear.addEventListener('click', () => {
      if (!confirm('Supprimer la méthodologie de cette impulsion ?')) return;
      delete state.methodologies[selected];
      save(render);
    });
    bar.appendChild(clear);
  }
  host.appendChild(bar);

  if (busy) {
    const s = stateBlock('Génération en cours…', 'Claude construit la marche à suivre. Ça prend quelques secondes.');
    s.prepend(el('div', 'spinner'));
    host.appendChild(s);
    return;
  }

  if (!m) {
    host.appendChild(stateBlock(
      'Pas encore de méthodologie',
      'Génère une suite d’étapes numérotées pour transformer cette impulsion en quelque chose que tu peux commencer maintenant.'
    ));
    return;
  }

  // progression
  const total = m.steps.length;
  const done = m.steps.filter(s => s.done).length;
  const pw = el('div', 'progress-wrap');
  const bar2 = el('div', 'progress');
  const fill = el('i');
  fill.style.width = total ? `${Math.round((done / total) * 100)}%` : '0';
  bar2.appendChild(fill);
  const lbl = el('div', 'progress-label');
  lbl.textContent = `${done} étape${done > 1 ? 's' : ''} sur ${total}`;
  pw.append(bar2, lbl);
  host.appendChild(pw);

  // etapes
  const ol = el('ol', 'steps');
  m.steps.forEach((step, i) => {
    const li = el('li', 'step' + (step.done ? ' done' : ''));

    const n = el('div', 'step-n');
    n.textContent = String(i + 1);

    const t = el('div', 'step-text');
    t.textContent = step.text;

    const c = el('button', 'step-check');
    c.type = 'button';
    c.textContent = step.done ? '✓' : '○';
    c.setAttribute('aria-pressed', String(!!step.done));
    c.setAttribute('aria-label', step.done
      ? `Marquer l’étape ${i + 1} comme non faite`
      : `Marquer l’étape ${i + 1} comme faite`);
    c.addEventListener('click', () => {
      step.done = !step.done;
      save(render);
    });

    li.append(n, t, c);
    ol.appendChild(li);
  });
  host.appendChild(ol);
}

function render() {
  renderList();
  renderDetail();
}

// ─── generation via l'hote natif ───────────────────────────────────────

function buildPrompt(impulse) {
  return [
    'Tu aides quelqu\'un qui a un fort pattern de context-switching : il capture une intention de travail et a besoin de savoir par où commencer, tout de suite.',
    '',
    `Intention : « ${impulse} »`,
    '',
    'Produis une méthodologie de 4 à 8 étapes numérotées pour la mener à terme.',
    'Contraintes :',
    '- chaque étape est une action concrète, commençable immédiatement, pas un conseil vague',
    '- la première étape doit pouvoir être faite en moins de 10 minutes',
    '- une phrase par étape, pas de sous-listes',
    '- réponds en français',
    '',
    'Réponds UNIQUEMENT par du JSON valide, sans texte autour, sans bloc de code, à ce format exact :',
    '{"steps":["première étape","deuxième étape"]}',
  ].join('\n');
}

function parseSteps(raw) {
  if (typeof raw !== 'string') return null;
  let t = raw.trim();

  // le modele encadre parfois sa reponse d'un bloc de code
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) t = fence[1].trim();

  // sinon on isole le premier objet JSON rencontre
  if (!t.startsWith('{')) {
    const i = t.indexOf('{'), j = t.lastIndexOf('}');
    if (i === -1 || j === -1 || j <= i) return null;
    t = t.slice(i, j + 1);
  }

  let data;
  try { data = JSON.parse(t); } catch { return null; }
  if (!data || !Array.isArray(data.steps)) return null;

  const steps = data.steps
    .filter(s => typeof s === 'string' && s.trim())
    .map(s => ({ text: s.trim(), done: false }));

  return steps.length ? steps : null;
}

function generate() {
  if (busy || !selected) return;
  busy = true;
  render();

  const impulse = selected;

  chrome.runtime.sendNativeMessage(HOST, { prompt: buildPrompt(impulse) }, response => {
    busy = false;

    if (chrome.runtime.lastError) {
      showError(
        'Hôte natif introuvable',
        'Chrome n’a pas pu joindre l’hôte qui exécute `claude -p`. Installe-le avec `native-host/install.sh`, puis recharge cette page.',
        chrome.runtime.lastError.message
      );
      return;
    }
    if (!response || response.ok === false) {
      showError(
        'La génération a échoué',
        'L’hôte natif a répondu avec une erreur.',
        (response && response.error) || 'réponse vide'
      );
      return;
    }

    const steps = parseSteps(response.output);
    if (!steps) {
      showError(
        'Réponse illisible',
        'Le modèle n’a pas renvoyé le JSON attendu. Relance la génération.',
        String(response.output || '').slice(0, 200)
      );
      return;
    }

    state.methodologies[impulse] = { steps, generatedAt: Date.now() };
    save(() => { selected = impulse; render(); });
  });
}

function showError(title, body, detail) {
  render();
  const s = stateBlock(title, body, 'error');
  if (detail) {
    const c = el('code');
    c.textContent = detail;
    s.appendChild(c);
  }
  $('detail').appendChild(s);
}

// ─── demarrage ─────────────────────────────────────────────────────────

chrome.storage.onChanged.addListener(changes => {
  if (!changes[KEY] || busy) return;
  state = Object.assign({ focus: null, queue: [], done: [], methodologies: {} }, changes[KEY].newValue || {});
  if (!state.methodologies) state.methodologies = {};
  render();
});

load(() => {
  const params = new URLSearchParams(location.search);
  const wanted = params.get('impulse');
  const all = [state.focus, ...(state.queue || []), ...(state.done || [])].filter(Boolean);
  selected = (wanted && all.includes(wanted)) ? wanted : (state.focus || all[0] || null);
  render();
});
