// Paste into the Google Vids tab (DevTools or javascript_tool). Tested 2026-10.
// Vids is a canvas app: many controls ignore el.click(), so helpers dispatch
// full pointer sequences or just return coordinates for a REAL click.

const sleep = ms => new Promise(r => setTimeout(r, ms));
const fire = (e, r) => {
  const o = { bubbles: true, clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 };
  for (const t of ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'])
    e.dispatchEvent(new (t.startsWith('pointer') ? PointerEvent : MouseEvent)(t, o));
};

// Select scene i in the timeline strip.
window.sc = async i => {
  const e = document.querySelector(`rect[aria-label^="Scene ${i} of"]`);
  e.scrollIntoView({ inline: 'center' }); await sleep(300);
  fire(e, e.getBoundingClientRect()); return e.getAttribute('aria-label');
};

// Open the transition between scene i and i+1 (then pick Dissolve, 0.5 s).
window.trc = async i => {
  const e = [...document.querySelectorAll('[aria-label]')]
    .find(x => x.getAttribute('aria-label').includes(`between scene ${i} and ${i + 1}`));
  e.scrollIntoView({ inline: 'center' }); await sleep(300);
  fire(e, e.getBoundingClientRect()); await sleep(600); return e.getAttribute('aria-label');
};

// Coordinates of the i-th "Mute" checkbox in Sound > All tracks.
// Click them for real: checkbox.click() from JS looks fine and then reverts.
window.mk = async i => {
  const m = [...document.querySelectorAll('div,span,label')]
    .filter(e => !e.children.length && e.textContent.trim() === 'Mute' && e.getBoundingClientRect().left > 800)[i];
  m.scrollIntoView({ block: 'center' }); await sleep(300);
  const r = m.getBoundingClientRect(); return [Math.round(r.left - 20), Math.round(r.top + r.height / 2)];
};

// Preview the newest generated clip in the AI video panel at t seconds.
window.pv = async t => {
  const v = [...document.querySelectorAll('video')]
    .filter(v => { const r = v.getBoundingClientRect(); return r.left > 500 && r.width > 100; }).pop();
  await new Promise(res => { v.onseeked = res; v.currentTime = t; });
  return v.getBoundingClientRect().toJSON();
};

// Voice timing: every Knox voice clip has an aria-label like
// "... - Knox starting in scene N at X seconds with duration D seconds".
window.voices = () => [...document.querySelectorAll('[aria-label*="Knox starting"]')]
  .map(e => e.getAttribute('aria-label').match(/scene (\d+) at ([\d.]+) seconds with duration ([\d.]+)/))
  .filter(Boolean).map(([, s, at, d]) => ({ scene: +s, at: +at, dur: +d }));

// Upload a local file (e.g. the Codex cover): run this, then click "Browse computer"
// gets intercepted and the hidden <input type=file> becomes visible (#cf_file_in)
// so an automation tool can set files on it. Restore with HTMLInputElement.prototype.click = window._origClick.
window.grabFileInput = () => {
  window._origClick = window._origClick || HTMLInputElement.prototype.click;
  HTMLInputElement.prototype.click = function () {
    if (this.type !== 'file') return window._origClick.call(this);
    this.id = 'cf_file_in';
    this.style.cssText = 'position:fixed;left:0;top:0;width:50px;height:50px;opacity:1;z-index:99999';
    if (!this.isConnected) document.body.appendChild(this);
  };
  const b = [...document.querySelectorAll('[role=button],button,div')]
    .find(e => e.textContent.trim() === 'Browse computer' || e.getAttribute('aria-label') === 'Browse computer');
  b && b.click(); return !!b;
};
