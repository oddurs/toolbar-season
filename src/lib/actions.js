// Everything that changes the browser: navigation, bars coming and going,
// dialogs, menus, and the background hum of adware.
import { ui, TEST, isOn, isInstalled, adware, hijacker, KEV_URL, HOME_URL, HAMSTER_URL, SYNERGY_URL } from "./state.svelte.js";
import { ALL_BARS, EXTRA_BARS, byId } from "./toolbars.js";
import { resolve, normalize, searchUrl, ENGINES } from "./pages.js";
import { navClick, ding, chord, blocked } from "./sound.js";
import { summon, joke, sing, react, banish } from "./buddy.js";

// Buddy buttons on his toolbar call him over first if he's away.
function withBuddy(fn) {
  if (ui.buddy?.here) return fn();
  summon("You rang? Here I am!");
  setTimeout(fn, TEST ? 0 : 2500);
}
export { wakeAudio } from "./sound.js";

export const rand = (a, b) => a + Math.random() * (b - a);
export const pick = a => a[Math.floor(Math.random() * a.length)];

// ---------------- status & info bar ----------------
export const setStatus = t => (ui.statusMsg = t || "Done");

export function showInfo(text, action = null, icon = "shield") {
  ui.info = { text, action, icon };
}

export function popupInfo() {
  blocked();
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
// IE6's progress bar filled in whole green blocks: it jumped a block or two
// at a time, stalled while the server thought about it, and usually hung near
// the end. Every toolbar phones home on every page, so each one adds to the
// stalls, and the status bar narrates what the page is waiting on.
const BLOCK = 100 / 12;
export function load(done, url = ui.url) {
  clearTimeout(loadTimer);
  ui.loading = true;
  ui.progress = 0;
  ui.pageErrors = false;
  setStatus(`Opening page ${url}...`);
  const bars = adware().map(b => b.id);
  const slow = 0.45 + bars.length * 0.07;
  let items = 3 + bars.length;
  const step = () => {
    if (ui.progress >= 100) { ui.loading = false; ui.progress = 0; setStatus(); return done(); }
    const r = Math.random();
    ui.progress = Math.min(100, ui.progress + (r < 0.25 ? 0 : r < 0.7 ? 1 : r < 0.92 ? 2 : 3) * BLOCK);
    if (ui.progress > 20 && bars.length) {
      const id = pick(bars);
      items = Math.max(1, items - (Math.random() < 0.5 ? 1 : 0));
      setStatus(pick([
        `(${items} items remaining) Downloading picture http://ads.${id}.biz/banner_${Math.floor(rand(100, 999))}.gif...`,
        `Waiting for http://track.${id}.biz/ping.asp?aff=2231...`,
        `(${items} items remaining) Downloading picture http://img.${id}.biz/spacer.gif...`,
        `Website found. Waiting for reply...`,
      ]));
    }
    let wait = rand(40, 180);
    if (Math.random() < 0.1) wait += rand(300, 900);                        // the server stalls
    if (ui.progress > 70 && Math.random() < 0.3) wait += rand(250, 800);   // "almost done"
    if (ui.progress >= 100) wait = 150;                                     // show the full bar briefly
    loadTimer = setTimeout(step, TEST ? 0 : wait * slow);
  };
  step();
}

const SCRIPT_ERRORS = [
  ["'{id}Track' is undefined", 2231], ["Object doesn't support this property or method", 88], ["'document.all.{id}Banner' is null or not an object", 417],
  ["Permission denied", 1], ["Expected ';'", 12], ["Invalid argument.", 3007],
];
function scriptErrors(url) {
  const bars = adware();
  if (TEST || bars.length < 3 || Math.random() > 0.55) return [];
  return Array.from({ length: 1 + Math.floor(rand(0, Math.min(4, bars.length / 3))) }, () => {
    const [msg, line] = pick(SCRIPT_ERRORS);
    return { line, char: Math.floor(rand(1, 80)), error: msg.replace("{id}", pick(bars).id), url };
  });
}

export function go(raw, { push = true } = {}) {
  if (!ui.connected) return dialUp();
  const r = resolve(normalize(raw, ui.url));
  if (r.hijacked) ui.stats.hijacked++;
  if (push) { ui.hist = [...ui.hist.slice(0, ui.idx + 1), r.url]; ui.idx++; }
  ui.url = r.url;
  navClick();
  load(() => {
    ui.route = { page: r.page, props: r.props, key: Math.random() };
    ui.title = `${r.title} - Microsoft Internet Explorer`;
    ui.highlight = false;
    ui.visited[r.url] = true;
    ui.errors = scriptErrors(r.url);
    ui.pageErrors = ui.errors.length > 0;
    if (ui.pageErrors) setStatus("Done, but with errors on page.");
    if (r.mixed) openDialog("mixed");
  }, r.url);
}

export function doSearch(engine, q) {
  q = q?.trim() || pick(["toolbars", "free smileys", "why is my computer so slow"]);
  if (hijacker() && hijacker() !== engine) ui.stats.hijacked++, setStatus(`Redirecting through ${ENGINES[hijacker()]}...`);
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


// ---------------- bars come and go ----------------
const respawns = {};
function flash(id) { ui.fresh[id] = true; setTimeout(() => (ui.fresh[id] = false), 1300); }

export function closeBar(id, { silent = false } = {}) {
  const b = byId(id);
  if (!b || b.locked) return;
  ui.on[id] = false;
  clearTimeout(respawns[id]);
  if (b.builtin || !b.respawn) return;
  if (!silent) { setStatus(`${b.name} closed. (For now.)`); react("closed", b.name); }
  respawns[id] = setTimeout(() => {
    if (isOn(id) || ui.uninstalled[id]) return;
    ui.on[id] = true; flash(id);
    ui.stats.returned++;
    showInfo(`${b.name} was turned back on by its Update Service, to keep your browsing experience great.`, () => openDialog("addons"), "warn");
  }, (b.respawn + rand(0, b.respawn * 0.5)) * 1000);
}
export function openBar(id) { clearTimeout(respawns[id]); ui.on[id] = true; ui.installed[id] = true; }
export const toggleBar = id => (isOn(id) ? closeBar(id) : openBar(id));

export function installBar(b, msg, { self = false } = {}) {
  delete ui.uninstalled[b.id];
  ui.stats[self ? "self" : "agreed"]++;
  if (!ui.order.includes(b.id)) ui.order.splice(ui.order.indexOf("coolbar"), 0, b.id);
  load(() => {
    ui.installed[b.id] = true; ui.on[b.id] = true; flash(b.id);
    if (b.id === "speeddr") setTimeout(hijackWallpaper, TEST ? 0 : 3000);
    showInfo(msg || `${b.name} was installed successfully. Thank you for choosing ${b.name}!`, () => openDialog("addons"), "info");
    react("installed", b.name);
  });
}

// Removed for real, through Add or Remove Programs. Some leave an
// "Update Service" behind that quietly puts them back.
export function uninstall(id) {
  const b = byId(id);
  clearTimeout(respawns[id]);
  ui.on[id] = false;
  ui.installed[id] = false;
  ui.uninstalled[id] = true;
  ui.stats.removed++;
  id === "bonzibar" ? banish() : react("removed", b.name);
  if (id === "speeddr" && ui.wallpaper === "infected") {
    ui.wallpaper = "bliss";
    showInfo("Your desktop background has been restored.", null, "info");
  }
  if (!b.respawn || TEST || Math.random() > 0.3) return false;
  respawns[id] = setTimeout(() => {
    if (!ui.uninstalled[id]) return;
    delete ui.uninstalled[id];
    ui.installed[id] = true; ui.on[id] = true; flash(id);
    ui.stats.returned++;
    showInfo(`${b.name} Update Service noticed ${b.name} was missing, and reinstalled it for you.`, () => openDialog("arp"), "warn");
  }, rand(50000, 80000));
  return true;
}

export function moveBar(id, beforeId) {
  const o = ui.order.filter(x => x !== id);
  const i = beforeId ? o.indexOf(beforeId) : o.length;
  o.splice(i < 0 ? o.length : i, 0, id);
  ui.order = o;
}

// ---------------- dialogs ----------------
let dlgId = 0, z = 300;
export function openDialog(kind, props = {}, { x, y, onClose, under = false } = {}) {
  const id = ++dlgId;
  // A pop-under sits beneath the IE window until you click it.
  ui.dialogs.push({ id, kind, props, x, y, z: under ? 1 : ++z, onClose });
  return id;
}
export function closeDialog(id, why) {
  const d = ui.dialogs.find(d => d.id === id);
  if (!d) return;
  ui.dialogs = ui.dialogs.filter(x => x.id !== id);
  d.onClose?.(why);
}
// Esc works like Cancel on the frontmost dialog. Not on the ones where
// Windows wouldn't let you (the crash report) or where Cancel means something.
export function escapeDialog() {
  const top = ui.dialogs.filter(d => d.z > 1 && !["crash", "dialup"].includes(d.kind)).sort((a, b) => b.z - a.z)[0];
  if (!top) return false;
  closeDialog(top.id, "esc");
  return true;
}
export function raise(id) { const d = ui.dialogs.find(d => d.id === id); if (d) d.z = ++z; }

export function alertDlg(msg, { title = "Microsoft Internet Explorer", icon = "info" } = {}) {
  (icon === "err" ? chord : ding)();
  return openDialog("alert", { msg, title, icon });
}

// SP2's File Download flow: Run or Save, a download at dial-up speed, then
// "The publisher could not be verified". Ends in a toolbar either way.
export function download(file, bar) {
  if (!bar || isInstalled(bar.id)) bar = EXTRA_BARS.find(b => !b.manual && !isInstalled(b.id));
  if (!bar) return alertDlg("There is nothing left to install. You have every toolbar.<br><br>Congratulations?");
  openDialog("download", { file, bar });
}

export function activeX(bar, nag = 0) {
  if (!bar || isInstalled(bar.id)) bar = EXTRA_BARS.find(b => !b.manual && !isInstalled(b.id));
  if (!bar) return alertDlg("There is nothing left to install. You have every toolbar.<br><br>Congratulations?");
  openDialog("activex", { bar, nag });
}

export function openPop(kind, { exit = false, under = false } = {}) {
  ui.stats.ads++;
  const n = ui.dialogs.filter(d => d.kind === "pop").length;
  openDialog("pop", { kind, exit, under }, {
    under,
    x: rand(20, Math.max(40, innerWidth - 440)),
    y: rand(30, Math.max(60, innerHeight - 320)) + n * 6,
    // Closing an ad sometimes just opens another ad.
    onClose: why => {
      if (why === "x" && !exit && Math.random() < 0.3 && adware().length) setTimeout(() => openPop(pick(["winner", "scare", "screensaver"]), { exit: true }), 400);
    },
  });
}

// ---------------- the desktop ----------------
// 2005's desktop hijackers replaced your wallpaper with a warning about the
// spyware they were, and locked Display Properties so you couldn't change it back.
export function hijackWallpaper() {
  if (!isInstalled("speeddr")) return;
  ui.wallpaper = "infected";
  showInfo("PC Speed Doctor changed your desktop background to warn you about spyware. It is the spyware.", () => openDialog("display"), "warn");
}
export function setBackground() {
  if (ui.wallpaper === "infected") return alertDlg("Your desktop background is locked by PC Speed Doctor for your protection.", { icon: "warn" });
  ui.wallpaper = "ad";
  showInfo("The picture was set as your desktop background. It's an ad. To change it back, right-click the desktop and choose Properties.", null, "info");
}
export const desktopMenu = () => [
  { label: "Arrange Icons By", items: [{ label: "Name" }, { label: "Size" }, { label: "Type" }, { label: "Modified" }] },
  { label: "Refresh" },
  "-",
  { label: "Paste", dis: true }, { label: "Paste Shortcut", dis: true },
  "-",
  { label: "New", items: [{ label: "Folder" }, { label: "Shortcut" }, "-", { label: "Text Document" }] },
  "-",
  { label: "Properties", fn: () => openDialog("display") },
];

// The title bar's close button: IE goes away and leaves an icon on the desktop.
export function closeIE() {
  closeMenu();
  ui.closed = true;
  ui.ieOnDesktop = true;
  ui.tip = false;
}
export function openIE() {
  if (!ui.closed) return;
  ui.closed = false;
  ui.rect = null;
  ui.max = ui.min = false;
  if (ui.connected) go(ui.home);
  else dialUp();
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
  buddyJoke: () => withBuddy(joke),
  buddySing: () => withBuddy(sing),
};

export const favoritesMenu = () => [
  { label: "Add to Favorites...", fn: () => alertDlg("Added to Favorites. Also added: 4 sponsored favorites you didn't ask for.") },
  { label: "Organize Favorites...", fn: () => alertDlg("Your favorites are organized alphabetically by who paid the most.") }, "-",
  { label: "Links", items: [{ label: "Customize Links", fn: act.why }, { label: "Free Hotmoil", fn: act.mail }, { label: "Windows Media", fn: act.media }] },
  { label: "Kev's Awesome Homepage", fn: () => go(KEV_URL) },
  { label: "Home Search Portal", fn: () => go(HOME_URL) },
  { label: "THE HAMSTER PARTY!!!", fn: () => go(HAMSTER_URL) },
  { label: "SynergyVision Solutions", fn: () => go(SYNERGY_URL) },
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
    const pops = ui.dialogs.filter(d => d.kind === "pop");
    if (through && pops.length < 4) openPop(pick(["winner", "monkey", "scare", "screensaver", "singles"]));
    else popupInfo();
    // Pop-unders pile up behind the window, where you won't see them for a while.
    if (Math.random() < 0.5 && pops.filter(d => d.props.under).length < 4) openPop(pick(["camera", "camera", "winner", "screensaver"]), { under: true });
  }
  setTimeout(adTick, rand(14000, 26000) * (n ? 1 : 2));
}

// New toolbars keep arriving on their own, until there are none left to arrive.
// Toolbars bring other toolbars. While at least one is installed, a new one
// arrives every half minute or so; get down to none and the chain stops.
function creep() {
  const next = EXTRA_BARS.find(b => !b.manual && !isInstalled(b.id) && !ui.uninstalled[b.id]);
  if (!next || ui.ended) return;
  // Wait while you're busy in a system dialog (not while ads are open: those are always open).
  const busy = ui.dialogs.some(d => !["pop", "alert"].includes(d.kind));
  if (ui.crashed || ui.closed || busy || !adware().length) return setTimeout(creep, 5000);
  const parent = pick(adware());
  installBar(next, `${parent.name} installed ${next.name} as part of a recommended update. No action is needed.`, { self: true });
  setTimeout(creep, rand(30000, 50000));
}

// ---------------- the two endings ----------------
// Lose: every toolbar there is gets installed and the page has nowhere left
// to go. Win: keep the browser free of them for one full minute.
export const ADWARE_TOTAL = ALL_BARS.filter(b => !b.builtin && b.id !== "gooble").length;
export const CLEAN_SECS = TEST ? 2 : 60;

export function checkCollapse() {
  if (!ui.ended && ui.connected && adware().length >= ADWARE_TOTAL) setTimeout(() => end("collapse"), 1200);
}
function end(kind) {
  if (ui.ended) return;
  ui.ended = kind;
  closeMenu();
  if (kind === "clean") { ding(); return openDialog("ending", { kind }); }
  // The page folds away to nothing first, then IE explains.
  setTimeout(() => { chord(); openDialog("ending", { kind }); }, TEST ? 0 : 1600);
}

// When the page is nearly gone, offer a toolbar that "makes more room". Once.
export function checkSqueeze() {
  if (ui.squeezeOffered || ui.ended || isInstalled("screenspace") || !ui.connected || ui.viewPct > 8 || ui.viewPct === 0) return;
  ui.squeezeOffered = true;
  react("squeezed");
  setTimeout(() => !ui.ended && !isInstalled("screenspace") && activeX(byId("screenspace")), 1200);
}

// Time spent with no third-party toolbars, and the best run so far.
let cleanTimer;
export function trackClean() {
  const clean = adware().length === 0 && ui.connected;
  if (clean && !ui.cleanSince) {
    react("clean");
    ui.cleanSince = Date.now();
    ui.cleanFor = 0;
    cleanTimer = setInterval(() => {
      ui.cleanFor = Math.floor((Date.now() - ui.cleanSince) / 1000);
      if (ui.cleanFor >= CLEAN_SECS) end("clean");
      if (ui.cleanFor > ui.bestClean) {
        ui.bestClean = ui.cleanFor;
        try { localStorage.setItem("toolbar-season:best", String(ui.bestClean)); } catch {}
      }
    }, 1000);
  } else if (!clean && ui.cleanSince) {
    clearInterval(cleanTimer);
    ui.cleanSince = null;
  }
}

// The session starts offline, at the dial-up prompt.
export function dismissTip() {
  ui.tip = false;
  try { localStorage.setItem("toolbar-season:tip", "1"); } catch {}
}

export function setMuted(m) {
  ui.muted = m;
  try { localStorage.setItem("toolbar-season:muted", m ? "1" : ""); } catch {}
}

// Test-only shortcuts, so the endings can be reached without a long wait.
if (TEST && typeof window !== "undefined") {
  window.__season = {
    installAll: () => EXTRA_BARS.forEach(b => { if (!ui.order.includes(b.id)) ui.order.splice(ui.order.indexOf("coolbar"), 0, b.id); ui.installed[b.id] = true; ui.on[b.id] = true; }),
    removeAll: () => adware().forEach(b => uninstall(b.id)),
    buddy: () => summon(),
    install: id => installBar(byId(id)),
    uninstall: id => uninstall(id),
  };
}

export function start() {
  try { ui.bestClean = +localStorage.getItem("toolbar-season:best") || 0; } catch {}
  try { ui.muted = !!localStorage.getItem("toolbar-season:muted"); } catch {}
  ui.route = { page: resolve("about:blank").page, props: {}, key: 0 };
  ui.url = "about:blank";
  ui.title = "about:blank - Microsoft Internet Explorer";
  dialUp();
  setInterval(() => (ui.peopleCount = Math.floor(rand(20, 60))), 3000);
}

let started = false;
export function connected() {
  ui.connected = true;
  if (TEST) return go(HOME_URL);
  try { if (!localStorage.getItem("toolbar-season:tip")) setTimeout(() => (ui.tip = true), 6000); } catch { setTimeout(() => (ui.tip = true), 6000); }
  showInfo("Dial-up Connection is now connected. Speed: 44.0 Kbps.", null, "info");
  go(HOME_URL);
  if (started) return;
  started = true;
  setTimeout(popupInfo, 2500);
  setTimeout(adTick, 9000);
  setTimeout(creep, 30000);
  setTimeout(() => summon(), 22000);
}

export function dialUp() {
  if (!ui.dialogs.some(d => d.kind === "dialup")) openDialog("dialup");
}

export function offline() {
  ui.route = { page: resolve("offline:").page, props: {}, key: Math.random() };
  ui.url = "about:blank";
  ui.title = "Web page unavailable while offline - Microsoft Internet Explorer";
}
