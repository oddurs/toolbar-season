// Everything that changes the browser: navigation, bars coming and going,
// dialogs, menus, and the background hum of adware.
import { ui, isOn, isInstalled, adware, hijacker, KEV_URL, HOME_URL } from "./state.svelte.js";
import { ALL_BARS, EXTRA_BARS, byId } from "./toolbars.js";
import { resolve, normalize, searchUrl, ENGINES } from "./pages.js";

export const rand = (a, b) => a + Math.random() * (b - a);
export const pick = a => a[Math.floor(Math.random() * a.length)];

// ---------------- status & info bar ----------------
export const setStatus = t => (ui.statusMsg = t || "Done");

export function showInfo(text, action = null, icon = "shield") {
  ui.info = { text, action, icon };
}

export function popupInfo() {
  showInfo("Pop-up blocked. To see this pop-up or additional options click here...", e => openMenu(e.clientX, e.clientY, [
    { label: "Temporarily Allow Pop-ups", fn: () => { for (let i = 0; i < 6; i++) setTimeout(() => openPop(pick(["winner", "monkey", "scare", "screensaver", "singles", "mail"])), i * 180); } },
    { label: "Always Allow Pop-ups from This Site...", fn: () => alertDlg("Pop-ups from <b>everywhere</b> are now allowed. That's what you meant, right?") },
    "-",
    { label: "Settings", fn: () => alertDlg("The Pop-up Blocker is on. Pop-ups are still appearing because the toolbars open them from <i>inside</i> the browser.") },
    { label: "Information Bar Help" },
  ]));
}

// ---------------- navigation ----------------
let loadTimer;
export function load(done, url = ui.url) {
  clearTimeout(loadTimer);
  ui.loading = true;
  ui.progress = 0;
  setStatus(`Opening page ${url}...`);
  const step = () => {
    ui.progress += rand(8, 26);
    if (ui.progress < 100) loadTimer = setTimeout(step, rand(50, 160));
    else { ui.loading = false; ui.progress = 0; setStatus(); done(); }
  };
  step();
}

export function go(raw, { push = true } = {}) {
  const r = resolve(normalize(raw, ui.url));
  if (push) { ui.hist = [...ui.hist.slice(0, ui.idx + 1), r.url]; ui.idx++; }
  ui.url = r.url;
  navClick();
  load(() => {
    ui.route = { page: r.page, props: r.props, key: Math.random() };
    ui.title = `${r.title} - Microsoft Internet Explorer`;
    ui.highlight = false;
    ui.kevNote = "";
  }, r.url);
}

export function doSearch(engine, q) {
  q = q?.trim() || pick(["toolbars", "free smileys", "why is my computer so slow"]);
  if (hijacker() && hijacker() !== engine) setStatus(`Redirecting through ${ENGINES[hijacker()]}...`);
  go(searchUrl(engine, q));
}

export const back = () => { if (ui.idx > 0) { ui.idx--; go(ui.hist[ui.idx], { push: false }); } };
export const fwd = () => { if (ui.idx < ui.hist.length - 1) { ui.idx++; go(ui.hist[ui.idx], { push: false }); } };
export const refresh = () => go(ui.url, { push: false });
export const home = () => go(ui.home);
export function stop() { clearTimeout(loadTimer); ui.loading = false; ui.progress = 0; setStatus(); }

export function setHome(v) {
  ui.home = v || HOME_URL;
  if (ui.home !== HOME_URL && hijacker()) {
    setTimeout(() => { ui.home = HOME_URL; showInfo("Your home page was changed back by another program to keep you safe.", () => openDialog("options"), "warn"); }, 5000);
  }
}

// IE6's navigation "click", synthesized.
let actx;
export function navClick() {
  try {
    actx ||= new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state !== "running") return;
    [0, 0.028].forEach(dt => {
      const t = actx.currentTime + dt, o = actx.createOscillator(), g = actx.createGain();
      o.type = "square";
      o.frequency.setValueAtTime(2600, t);
      o.frequency.exponentialRampToValueAtTime(700, t + 0.015);
      g.gain.setValueAtTime(0.05, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.02);
      o.connect(g).connect(actx.destination);
      o.start(t); o.stop(t + 0.025);
    });
  } catch {}
}
export const wakeAudio = () => actx?.state === "suspended" && actx.resume();

// ---------------- bars come and go ----------------
const respawns = {};
function flash(id) { ui.fresh[id] = true; setTimeout(() => (ui.fresh[id] = false), 1300); }

export function closeBar(id, { silent = false } = {}) {
  const b = byId(id);
  if (!b || b.locked) return;
  ui.on[id] = false;
  clearTimeout(respawns[id]);
  if (b.builtin || !b.respawn) return;
  if (!silent) setStatus(`${b.name} closed. (For now.)`);
  respawns[id] = setTimeout(() => {
    if (isOn(id)) return;
    ui.on[id] = true; flash(id);
    showInfo(`${b.name} was turned back on by its Update Service, to keep your browsing experience great.`, () => openDialog("addons"), "warn");
  }, (b.respawn + rand(0, b.respawn * 0.5)) * 1000);
}
export function openBar(id) { clearTimeout(respawns[id]); ui.on[id] = true; ui.installed[id] = true; }
export const toggleBar = id => (isOn(id) ? closeBar(id) : openBar(id));

export function installBar(b, msg) {
  if (!ui.order.includes(b.id)) ui.order.splice(ui.order.indexOf("coolbar"), 0, b.id);
  load(() => {
    ui.installed[b.id] = true; ui.on[b.id] = true; flash(b.id);
    showInfo(msg || `${b.name} was installed successfully. Thank you for choosing ${b.name}!`, () => openDialog("addons"), "info");
  });
}

export function moveBar(id, beforeId) {
  const o = ui.order.filter(x => x !== id);
  const i = beforeId ? o.indexOf(beforeId) : o.length;
  o.splice(i < 0 ? o.length : i, 0, id);
  ui.order = o;
}

// ---------------- dialogs ----------------
let dlgId = 0, z = 300;
export function openDialog(kind, props = {}, { x, y, onClose } = {}) {
  const id = ++dlgId;
  ui.dialogs.push({ id, kind, props, x, y, z: ++z, onClose });
  return id;
}
export function closeDialog(id, why) {
  const d = ui.dialogs.find(d => d.id === id);
  if (!d) return;
  ui.dialogs = ui.dialogs.filter(x => x.id !== id);
  d.onClose?.(why);
}
export function raise(id) { const d = ui.dialogs.find(d => d.id === id); if (d) d.z = ++z; }

export const alertDlg = (msg, { title = "Microsoft Internet Explorer", icon = "info" } = {}) => openDialog("alert", { msg, title, icon });

export function activeX(bar, nag = 0) {
  if (!bar || isInstalled(bar.id)) bar = EXTRA_BARS.find(b => !isInstalled(b.id));
  if (!bar) return alertDlg("There is nothing left to install. You have every toolbar.<br><br>Congratulations?");
  openDialog("activex", { bar, nag });
}

export function openPop(kind, { exit = false } = {}) {
  const n = ui.dialogs.filter(d => d.kind === "pop").length;
  openDialog("pop", { kind, exit }, {
    x: rand(20, Math.max(40, innerWidth - 440)),
    y: rand(30, Math.max(60, innerHeight - 320)) + n * 6,
    // Closing an ad sometimes just opens another ad.
    onClose: why => {
      if (why === "x" && !exit && Math.random() < 0.3 && adware().length) setTimeout(() => openPop(pick(["winner", "scare", "screensaver"]), { exit: true }), 400);
    },
  });
}

export function crash() {
  ui.crashed = true;
  openDialog("crash", { module: pick(adware())?.id || "mshtml" }, { onClose: restart });
}
function restart() {
  setTimeout(() => {
    ui.crashed = false;
    go(ui.home);
    showInfo("Internet Explorer restarted. All your toolbars were restored. You're welcome!", null, "info");
  }, 900);
}

// ---------------- menus ----------------
export const openMenu = (x, y, items, owner = null) => (ui.menu = { x, y, items, owner });
export const closeMenu = () => (ui.menu = null);

// ---------------- the purple helper ----------------
export const BUDDY_LINES = [
  "Hi! I'm BuddyBonz, your new Internet friend! Would you like me to help you search the web?",
  "Did you know? You can make your browsing even better with more toolbars!",
  "Knock knock! Who's there? A pop-up! A pop-up who? A pop-up you can't close!",
  "I noticed you're trying to read a web page. Would you like help with that?",
  "♪ Daisy, Daisy, give me your answer do… ♪",
];
export const buddy = line => (ui.buddy = { line: line || pick(BUDDY_LINES), n: (ui.buddy?.n || 0) + 1 });

// ---------------- toolbar button actions ----------------
export const act = {
  back, fwd, stop, refresh, home,
  say: ({ arg, bar }) => alertDlg(arg, { title: bar?.name || "Message" }),
  popup: ({ arg }) => openPop(arg),
  search: ({ arg }) => doSearch(arg.engine, arg.q),
  scan: () => openDialog("scan"),
  sidebar: () => {
    if (isOn("sidefind")) return showInfo("Search Companion has been replaced by SideFind for a better search experience.", null, "info");
    ui.sideMode = ui.sideMode === "search" ? null : "search";
  },
  history: () => (ui.sideMode = ui.sideMode === "history" ? null : "history"),
  favmenu: ({ el }) => { const r = el.getBoundingClientRect(); openMenu(r.left, r.bottom, favoritesMenu()); },
  media: () => alertDlg("The Media bar requires Windows Media Player 10, which requires Genuine Windows validation, which requires ActiveX, which requires a toolbar.", { icon: "warn" }),
  mail: () => alertDlg("Could not launch Outlook Express. The default mail client is now <b>Hotmoil Toolbar Mail</b>.", { icon: "err" }),
  print: () => alertDlg(`Printing ${adware().length * 3 + 2} pages. Most of them are toolbars.`),
  why: () => openDialog("why"),
  full: () => {
    ui.full = !ui.full;
    if (ui.full) showInfo("Full Screen mode hides Internet Explorer's own toolbars. The other ones stay. Press F11 to exit.", null, "info");
  },
  highlight: () => { ui.highlight = !ui.highlight; setStatus("Highlighted every word, because they're all important."); },
  cursor: () => { ui.sparkle = !ui.sparkle; setStatus(ui.sparkle ? "Cursor Mania: Sparkly Unicorn cursor installed!" : "Cursor restored."); },
  skin: ({ bar }) => {
    const s = ["linear-gradient(#ff9a3a,#e04b1d)", "repeating-linear-gradient(45deg,#f8d 0 6px,#fbe 6px 12px)", "linear-gradient(#333,#000)", ""];
    ui.skins[bar.id] = s[(s.indexOf(ui.skins[bar.id] ?? "") + 1) % s.length];
  },
  radio: () => { setStatus("Buffering… 3%… 4%… Connecting to StreamCast… Buffering…"); setTimeout(() => openPop("winner"), 1500); },
  boost: () => { setStatus("Boosting connection…"); load(() => alertDlg("Optimization complete! Your connection is now <b>56.6 kbps</b>.<br>(Up from 56.6 kbps.)"), "boost://optimize"); },
  buddyJoke: () => buddy(BUDDY_LINES[2]),
  buddySing: () => buddy(BUDDY_LINES[4]),
};

export const favoritesMenu = () => [
  { label: "Add to Favorites...", fn: () => alertDlg("Added to Favorites. Also added: 4 sponsored favorites you didn't ask for.") },
  { label: "Organize Favorites...", fn: () => alertDlg("Your favorites are organized alphabetically by who paid the most.") }, "-",
  { label: "Links", items: [{ label: "Customize Links", fn: act.why }, { label: "Free Hotmoil", fn: act.mail }, { label: "Windows Media", fn: act.media }] },
  { label: "Kev's Awesome Homepage", fn: () => go(KEV_URL) },
  { label: "Home Search Portal", fn: () => go(HOME_URL) },
  { label: "Radio Station Guide" }, "-",
  { label: "Cheap Flights!!!", spons: true, fn: () => openPop("winner") },
  { label: "Online Casino — $500 FREE", spons: true, fn: () => openPop("winner") },
  { label: "Free Screensavers", spons: true, fn: () => openPop("screensaver") },
  { label: "Meet Singles", spons: true, fn: () => openPop("singles") },
];

export const toolbarMenu = () => [
  ...ALL_BARS.filter(b => isInstalled(b.id) && !b.locked).map(b => ({ label: b.name, check: isOn(b.id), fn: () => toggleBar(b.id) })),
  "-",
  { label: "Lock the Toolbars", check: true, fn: () => alertDlg("The toolbars are locked. They were always locked. You are the one who is locked in here with them.") },
  { label: "Customize...", fn: () => alertDlg("Customize Toolbar is not available because 11 other toolbars are customizing it right now.", { icon: "warn" }) },
];

// ---------------- background timers ----------------
function adTick() {
  const n = adware().length;
  if (n && !ui.crashed) {
    ui.blocked++;
    const through = Math.random() < Math.min(0.65, n * 0.06);
    if (through && ui.dialogs.filter(d => d.kind === "pop").length < 4) openPop(pick(["winner", "monkey", "scare", "screensaver", "singles"]));
    else popupInfo();
  }
  setTimeout(adTick, rand(14000, 26000) * (n ? 1 : 2));
}

// New toolbars keep arriving on their own, until there are none left to arrive.
function creep() {
  const next = EXTRA_BARS.find(b => !isInstalled(b.id));
  if (!next) return;
  if (ui.crashed || ui.dialogs.length) return setTimeout(creep, 8000);
  installBar(next, `${next.name} was installed automatically as part of a recommended update. No action is needed.`);
  setTimeout(creep, rand(55000, 90000));
}

export function start() {
  go(HOME_URL);
  popupInfo();
  setTimeout(adTick, 9000);
  setTimeout(creep, 45000);
  setTimeout(() => buddy(BUDDY_LINES[0]), 22000);
  setInterval(() => (ui.peopleCount = Math.floor(rand(20, 60))), 3000);
}
