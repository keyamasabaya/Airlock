// Airlock extension - popup logic
const KEY = 'airlock_state';
const THEME_KEY = 'airlock_theme';
let state = { focus: null, queue: [], done: [], pending: null };

const $ = id => document.getElementById(id);

// Theme is applied synchronously in <head> (see popup.html) to avoid a flash;
// this just wires the toggle button and persists the choice.
$('btnTheme').onclick = () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
};

function load() {
  chrome.storage.local.get([KEY], r => {
    if (r[KEY]) state = r[KEY];
    if (!state.done) state.done = [];
    render();
  });
}

function save() {
  chrome.storage.local.set({ [KEY]: state });
  // Notify content scripts to refresh banner
  chrome.tabs.query({ url: 'https://claude.ai/*' }, tabs => {
    tabs.forEach(t => {
      chrome.tabs.sendMessage(t.id, { type: 'airlock_update', state }).catch(() => {});
    });
  });
}

function render() {
  // Focus bar
  const dot = $('dot'), ft = $('focusText');
  if (state.focus) {
    dot.className = 'dot';
    ft.className = 'focus-text';
    ft.textContent = state.focus;
  } else {
    dot.className = 'dot idle';
    ft.className = 'focus-text empty';
    ft.textContent = 'aucun — tape ci-dessous';
  }

  // Queue
  const q = $('queue');
  if (state.queue.length === 0) {
    q.innerHTML = '<div class="empty">vide — bonne concentration</div>';
  } else {
    q.innerHTML = '';
    state.queue.forEach((item, i) => {
      const div = document.createElement('div');
      div.className = 'queue-item' + (i === 0 ? ' top' : '');
      div.innerHTML = `
        <span class="qnum">${i+1}</span>
        <span class="qtext"></span>
        <div class="qbtns">
          <button class="btn-x go" data-act="focus" data-i="${i}" title="passer en focus">→</button>
          ${i > 0 ? `<button class="btn-x" data-act="up" data-i="${i}" title="monter">↑</button>` : ''}
          <button class="btn-x danger" data-act="del" data-i="${i}" title="supprimer">×</button>
        </div>`;
      div.querySelector('.qtext').textContent = item;
      q.appendChild(div);
    });
  }

  // Done list
  const ds = $('doneSection'), dl = $('done');
  if (!state.done || state.done.length === 0) {
    ds.style.display = 'none';
  } else {
    ds.style.display = 'block';
    dl.innerHTML = '';
    state.done.slice(-5).reverse().forEach(d => {
      const div = document.createElement('div');
      div.className = 'done-item';
      div.innerHTML = '<span class="check">✓</span><span></span>';
      div.querySelector('span:last-child').textContent = d;
      dl.appendChild(div);
    });
  }

  $('count').textContent = `${state.queue.length} en file`;
}

// Capture
function capture() {
  const val = $('input').value.trim();
  if (!val) return;
  $('input').value = '';

  if (!state.focus) {
    state.focus = val;
    save(); render();
    return;
  }

  // Show decision box
  state.pending = val;
  $('decisionQ').innerHTML = `<b></b><br><span class="sub">ça passe devant "<span class="cur"></span>" ?</span>`;
  $('decisionQ').querySelector('b').textContent = `"${val}"`;
  $('decisionQ').querySelector('.cur').textContent = state.focus;
  $('decision').className = 'decision visible';
}

function hideDecision() {
  $('decision').className = 'decision';
  state.pending = null;
}

// Mark focus done
function markDone() {
  if (!state.focus) return;
  if (!state.done) state.done = [];
  state.done.push(state.focus);
  if (state.done.length > 20) state.done = state.done.slice(-20);
  state.focus = state.queue.shift() || null;
  save(); render();
}

// Event handlers
$('btnAdd').onclick = capture;
$('input').addEventListener('keydown', e => { if (e.key === 'Enter') capture(); });

$('btnGo').onclick = () => {
  if (!state.pending) return;
  if (state.focus) state.queue.unshift(state.focus);
  state.focus = state.pending;
  hideDecision(); save(); render();
};

$('btnQueue').onclick = () => {
  if (!state.pending) return;
  state.queue.push(state.pending);
  hideDecision(); save(); render();
};

$('btnDrop').onclick = () => { hideDecision(); render(); };

$('btnDone').onclick = markDone;

$('queue').addEventListener('click', e => {
  const btn = e.target.closest('button[data-act]');
  if (!btn) return;
  const i = parseInt(btn.dataset.i);
  const act = btn.dataset.act;
  if (act === 'del') state.queue.splice(i, 1);
  else if (act === 'up' && i > 0) {
    [state.queue[i-1], state.queue[i]] = [state.queue[i], state.queue[i-1]];
  } else if (act === 'focus') {
    const item = state.queue.splice(i, 1)[0];
    if (state.focus) state.queue.unshift(state.focus);
    state.focus = item;
  }
  save(); render();
});

// Ouvre la vue methodologie dans un onglet, sur le focus courant si defini
$('btnMethod').onclick = () => {
  const url = state.focus
    ? `pages/methodology.html?impulse=${encodeURIComponent(state.focus)}`
    : 'pages/methodology.html';
  chrome.tabs.create({ url: chrome.runtime.getURL(url) });
};

$('btnReset').onclick = () => {
  if (confirm('Vider focus, file et done ?')) {
    state = { focus: null, queue: [], done: [], pending: null };
    save(); render();
  }
};

load();
