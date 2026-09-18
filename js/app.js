// State, rendering and navigation for one very crowded IE6 window.
const state = {
  bars: [...TOOLBARS],
  on: Object.fromEntries(TOOLBARS.map(b => [b.id, true])),
  installed: Object.fromEntries(TOOLBARS.map(b => [b.id, true])),
  home: HOME_URL,
  url: "",
  hist: [], idx: -1,
  sideMode: null, // null | "history" | "search"
  status: true,
  full: false,
  blocked: 0,
  kevCount: 4417,
  respawns: {},
};

const win = $("#win");
const bars = $("#bars");
const bottom = $("#bottombars");
const page = $("#page");
const side = $("#side");

const allBars = () => [...TOOLBARS, ...EXTRA_BARS];
const byId = id => allBars().find(b => b.id === id);
const isOn = id => !!state.on[id];
const isInstalled = id => !!state.installed[id];
const currentAdware = () => state.bars.filter(b => !b.builtin && b.id !== "gooble" && isOn(b.id));
const adwareCount = () => currentAdware().length;
const hijacker = () => ["mws", "zingo", "sidefind", "starfield"].find(isOn);

// ---------------- rendering ----------------
function renderBars() {
  const keep = document.activeElement?.id;
  bars.innerHTML = "";
  bottom.innerHTML = "";
  for (const b of state.bars) {
    if (!isOn(b.id) || b.place === "side") continue;
    if (state.full && b.builtin) continue;
    const el = document.createElement("div");
    el.className = "band " + (b.cls || "");
    el.dataset.bar = b.id;
    el.setAttribute("role", "toolbar");
    el.setAttribute("aria-label", b.name);
    el.innerHTML = `<span class="grip"></span>${b.render()}` + (b.builtin ? "" : `<span class="chev">»</span><button class="band-x" data-close="${b.id}" title="Close ${b.name}" aria-label="Close ${b.name}">×</button>`);
    if (b.fresh) { el.classList.add("fresh"); b.fresh = false; }
    (b.place === "bottom" ? bottom : bars).appendChild(el);
  }
  $("#throbber").hidden = state.full;
  $(".titlebar", win).hidden = state.full;
  const addr = $("#addr");
  if (addr) addr.value = state.url;
  if (keep && document.getElementById(keep)) document.getElementById(keep).focus();
  $("#gooble-blocked") && ($("#gooble-blocked").textContent = `${state.blocked} blocked`);
  const n = adwareCount() + (isOn("gooble") ? 1 : 0);
  $("#era-count").textContent = n ? `${n} toolbar${n === 1 ? "" : "s"} and counting` : "0 toolbars (for now)";
  renderSide();
  $("#status").hidden = !state.status;
  updateNavButtons();
  measure();
}

function renderSide() {
  const mode = state.sideMode || (isOn("sidefind") ? "sidefind" : null);
  side.hidden = !mode;
  if (!mode) return;
  const h = $(".side-h span", side), body = $(".side-b", side);
  if (mode === "sidefind") {
    h.innerHTML = `<b style="color:#0a8a8a">SideFind</b> Search`;
    body.innerHTML = `
      <div>Search the Internet with SideFind!</div>
      <input class="box" id="sf-q" style="width:100%;box-sizing:border-box;margin:4px 0" aria-label="SideFind search">
      <button class="xpbtn" data-act="search" data-engine="sidefind">Find It!</button>
      <div class="ad"><b style="color:#c00">Sponsored</b><br><a data-pop="winner">Win a FREE MP3 Player!</a><a data-pop="singles">Local Singles</a><a data-pop="screensaver">Free Screensavers</a></div>
      <div class="ad"><b>SideFind Top Searches</b><a data-go="search:ringtones">ringtones</a><a data-go="search:lyrics">song lyrics</a><a data-go="search:how to remove sidefind">how to remove sidefind</a></div>
      <div class="muted" style="font-size:10px">SideFind replaced your Search Companion so you could search better.</div>`;
  } else if (mode === "history") {
    h.textContent = "History";
    const seen = [...new Set(state.hist)].reverse();
    body.innerHTML = `<div class="muted">Today</div>` + seen.map(u => `<a data-go="${esc(u)}">${esc(u.replace(/^http:\/\//, ""))}</a>`).join("")
      + `<div class="muted" style="margin-top:6px">Last Week</div><a data-go="${KEV_URL}">www.geocitiez.com</a><a data-go="http://www.homestar.fake/">www.homestar.fake</a>`;
  } else {
    h.textContent = "Search Companion";
    body.innerHTML = `<div>What do you want to search for?</div>
      <input class="box" id="sf-q" style="width:100%;box-sizing:border-box;margin:4px 0" aria-label="Search">
      <button class="xpbtn" data-act="search" data-engine="msm">Search</button>`;
  }
}

function updateNavButtons() {
  const b = $("#btn-back"), f = $("#btn-fwd");
  if (b) b.disabled = state.idx <= 0;
  if (f) f.disabled = state.idx >= state.hist.length - 1;
}

// How much of the window is actually web page.
function measure() {
  const w = win.getBoundingClientRect(), p = page.getBoundingClientRect();
  const pct = Math.max(0, Math.round((p.width * p.height) / (w.width * w.height) * 100));
  const el = $("#st-view");
  el.innerHTML = `Page: <b class="${pct < 25 ? "bad" : ""}">${pct}%</b> of window`;
  el.title = `${adwareCount()} third-party toolbars installed`;
}
new ResizeObserver(measure).observe(page);

// ---------------- bars come and go ----------------
function closeBar(id, { silent = false } = {}) {
  const b = byId(id);
  if (!b || b.locked) return;
  state.on[id] = false;
  if (state.sideMode === null && id === "sidefind") side.hidden = true;
  renderBars();
  clearTimeout(state.respawns[id]);
  if (!b.builtin && b.respawn) {
    state.respawns[id] = setTimeout(() => {
      if (isOn(id)) return;
      state.on[id] = true; b.fresh = true;
      renderBars();
      showInfo(`${b.name} was turned back on by its Update Service, to keep your browsing experience great.`, () => manageAddons(), "warn");
    }, (b.respawn + rand(0, b.respawn * .5)) * 1000);
  }
  if (!silent && !b.builtin && b.respawn) setStatus(`${b.name} closed. (For now.)`);
}
function openBar(id) {
  clearTimeout(state.respawns[id]);
  state.on[id] = true; state.installed[id] = true;
  renderBars();
}
function toggleBar(id) { isOn(id) ? closeBar(id) : openBar(id); }

function installBar(b, msg) {
  if (!state.bars.includes(b)) state.bars.splice(state.bars.findIndex(x => x.id === "coolbar"), 0, b);
  state.installed[b.id] = true; state.on[b.id] = true; b.fresh = true;
  load(() => { renderBars(); showInfo(msg || `${b.name} was installed successfully. Thank you for choosing ${b.name}!`, () => manageAddons(), "info"); });
}

// ---------------- info bar & status ----------------
let infoAction = null;
function showInfo(text, onClick, icon = "shield") {
  const ib = $("#infobar");
  ib.hidden = false;
  $("#ib-ico").innerHTML = I[icon];
  $("#ib-text").textContent = text;
  infoAction = onClick;
  measure();
}
function popupInfo() {
  showInfo("Pop-up blocked. To see this pop-up or additional options click here...", e => menuAt(e.clientX, e.clientY, [
    { label: "Temporarily Allow Pop-ups", fn: () => { for (let i = 0; i < 6; i++) setTimeout(() => openPop(pick(Object.keys(POPS).filter(k => k !== "im"))), i * 180); } },
    { label: "Always Allow Pop-ups from This Site...", fn: () => alertDlg("Pop-ups from <b>everywhere</b> are now allowed. That's what you meant, right?") },
    "-",
    { label: "Settings", sub: true, fn: () => alertDlg("The Pop-up Blocker is on. Pop-ups are still appearing because the toolbars open them from <i>inside</i> the browser.") },
    { label: "Information Bar Help" },
  ]));
}
function setStatus(t) { $("#st-msg").textContent = t || "Done"; }

// ---------------- navigation ----------------
let loadTimer;
function load(done, url = state.url) {
  clearTimeout(loadTimer);
  win.classList.add("loading");
  const prog = $("#st-prog i");
  let p = 0;
  setStatus(`Opening page ${url}...`);
  const step = () => {
    p += rand(8, 26);
    prog.style.width = Math.min(p, 100) + "%";
    if (p < 100) loadTimer = setTimeout(step, rand(50, 160));
    else { win.classList.remove("loading"); prog.style.width = 0; setStatus(); done(); }
  };
  step();
}

function normalize(raw) {
  let u = raw.trim();
  if (!u) return state.url;
  if (/^(about:|search:|kev:)/.test(u)) return u;
  if (/^https?:\/\//i.test(u)) return u;
  if (/^[\w-]+(\.[\w-]+)+/.test(u)) return "http://" + u + (u.includes("/") ? "" : "/");
  return "search:" + u; // IE autosearch, which a hijacker now owns
}

function searchUrl(engine, q) {
  const host = ENGINES[hijacker() || engine] || ENGINES.portal;
  return `http://${host}/results?q=${encodeURIComponent(q).replace(/%20/g, "+")}`;
}

function go(raw, { push = true } = {}) {
  let url = normalize(raw);
  if (url.startsWith("kev:")) return kev(url.slice(4));
  if (url.startsWith("search:")) url = searchUrl("portal", url.slice(7));
  let spec = PAGES.find(p => p.match(url));
  if (!spec) {
    const h = hijacker();
    if (h && url.startsWith("http")) url = searchUrl(h, url.split("/")[2].replace(/^www\./, ""));
    spec = PAGES.find(p => p.match(url));
  }
  if (push) { state.hist = state.hist.slice(0, state.idx + 1); state.hist.push(url); state.idx++; }
  state.url = url;
  $("#addr") && ($("#addr").value = url);
  navClick();
  load(() => {
    const out = spec ? { title: typeof spec.title === "function" ? spec.title(url) : spec.title, html: spec.html(url) } : cannotDisplay(url);
    page.innerHTML = out.html;
    page.scrollTop = 0;
    $("#win-title").textContent = `${out.title} - Microsoft Internet Explorer`;
    $("#st-zone").innerHTML = `${I.globe}Internet`;
    updateNavButtons();
    renderSide();
  }, url);
}

function kev(what) {
  const out = $("#kev-out");
  if (!out) return;
  out.textContent = KEV[what] || "";
  state.kevCount++;
  $("#kev-count").textContent = String(state.kevCount).padStart(6, "0");
}

function doSearch(engine, from) {
  const scope = from?.closest(".band, .side-b") || document;
  const input = scope.querySelector(`input[data-engine="${engine}"], #sf-q`);
  const q = from?.dataset.q || input?.value.trim() || pick(["toolbars", "free smileys", "why is my computer so slow"]);
  if (hijacker() && hijacker() !== engine) setStatus(`Redirecting through ${ENGINES[hijacker()]}...`);
  go(searchUrl(engine, q));
}

function setHome(v) {
  state.home = v || HOME_URL;
  if (state.home !== HOME_URL && hijacker()) {
    setTimeout(() => { state.home = HOME_URL; showInfo("Your home page was changed back by another program to keep you safe.", () => internetOptions(), "warn"); }, 5000);
  }
}
