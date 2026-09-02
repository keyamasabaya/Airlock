// Airlock extension - options page logic
const KEY = 'airlock_state';

const $ = id => document.getElementById(id);

function showStatus(msg, ok) {
  const el = $('status');
  el.textContent = msg;
  el.className = 'status ' + (ok ? 'ok' : 'err');
  setTimeout(() => { el.textContent = ''; el.className = 'status'; }, 4000);
}

function renderDone(done) {
  const el = $('doneList');
  if (!done || done.length === 0) {
    el.innerHTML = '<div class="empty">rien de fait pour l\'instant</div>';
    return;
  }
  el.innerHTML = '';
  done.slice().reverse().forEach(d => {
    const div = document.createElement('div');
    div.className = 'done-item';
    div.innerHTML = '<span class="check">✓</span><span class="txt"></span>';
    div.querySelector('.txt').textContent = d;
    el.appendChild(div);
  });
}

function loadState(cb) {
  chrome.storage.local.get([KEY], r => {
    const state = r[KEY] || { focus: null, queue: [], done: [] };
    cb(state);
  });
}

function notifyContentScripts(state) {
  chrome.tabs.query({ url: 'https://claude.ai/*' }, tabs => {
    tabs.forEach(t => {
      chrome.tabs.sendMessage(t.id, { type: 'airlock_update', state }).catch(() => {});
    });
  });
}

$('btnShortcut').onclick = () => {
  chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
};

$('btnExport').onclick = () => {
  loadState(state => {
    const data = { focus: state.focus, queue: state.queue, done: state.done };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `airlock-export-${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showStatus('Export téléchargé.', true);
  });
};

$('btnImportTrigger').onclick = () => $('fileImport').click();

$('fileImport').addEventListener('change', e => {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    let data;
    try {
      data = JSON.parse(reader.result);
    } catch {
      showStatus('Fichier invalide : JSON illisible.', false);
      return;
    }

    if (typeof data !== 'object' || data === null ||
        (data.focus !== null && typeof data.focus !== 'string') ||
        !Array.isArray(data.queue) || !data.queue.every(x => typeof x === 'string') ||
        !Array.isArray(data.done) || !data.done.every(x => typeof x === 'string')) {
      showStatus('Fichier invalide : structure inattendue.', false);
      return;
    }

    if (!confirm('Remplacer les données actuelles (focus, file, historique) par le contenu de ce fichier ?')) return;

    const state = { focus: data.focus, queue: data.queue, done: data.done, pending: null };
    chrome.storage.local.set({ [KEY]: state }, () => {
      notifyContentScripts(state);
      renderDone(state.done);
      showStatus('Import réussi.', true);
    });
  };
  reader.readAsText(file);
});

loadState(state => renderDone(state.done));

chrome.storage.onChanged.addListener(changes => {
  if (changes[KEY]) renderDone(changes[KEY].newValue.done);
});
