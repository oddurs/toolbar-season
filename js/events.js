// Menus, clicks, keyboard, and the background hum of adware.

// ---------------- menus ----------------
let openMenus = [];
function closeMenus() { openMenus.forEach(m => m.remove()); openMenus = []; document.querySelectorAll(".mi.open").forEach(m => m.classList.remove("open")); }

function menuAt(x, y, items, level = 0) {
  openMenus.slice(level).forEach(m => m.remove());
  openMenus = openMenus.slice(0, level);
  const m = document.createElement("div");
  m.className = "menu"; m.setAttribute("role", "menu");
  m.innerHTML = items.map((it, i) => it === "-" ? "<hr>" :
    `<div class="it${it.dis ? " dis" : ""}${it.spons ? " spons" : ""}" data-i="${i}" role="menuitem">${it.check ? '<span class="chk">✓</span>' : ""}${it.label}${it.key ? `<span class="key">${it.key}</span>` : ""}${it.items ? '<span class="sub">▶</span>' : ""}</div>`).join("");
  document.body.appendChild(m);
  const r = m.getBoundingClientRect();
  m.style.left = Math.max(0, Math.min(x, innerWidth - r.width - 2)) + "px";
  m.style.top = Math.max(0, Math.min(y, innerHeight - r.height - 2)) + "px";
  openMenus.push(m);
  m.querySelectorAll(".it").forEach(el => {
    const it = items[+el.dataset.i];
    el.onmouseenter = () => {
      m.querySelectorAll(".hot").forEach(h => h.classList.remove("hot"));
      if (it.items) { el.classList.add("hot"); const er = el.getBoundingClientRect(); menuAt(er.right - 2, er.top - 3, typeof it.items === "function" ? it.items() : it.items, level + 1); }
      else openMenus.slice(level + 1).forEach(s => s.remove()), (openMenus = openMenus.slice(0, level + 1));
    };
    el.onclick = e => { e.stopPropagation(); if (it.items || it.dis) return; closeMenus(); it.fn?.(e); };
  });
  return m;
}

const toolbarItems = () => [
  ...allBars().filter(b => isInstalled(b.id) && !b.locked).map(b => ({ label: b.name, check: isOn(b.id), fn: () => toggleBar(b.id) })),
  "-", { label: "Lock the Toolbars", check: true, fn: () => alertDlg("The toolbars are locked. They were always locked. You are the one who is locked in here with them.") },
  { label: "Customize...", fn: () => alertDlg("Customize Toolbar is not available because 11 other toolbars are customizing it right now.", { icon: "warn" }) },
];

const MENUS = {
  File: () => [
    { label: "New", items: [{ label: "Window", key: "Ctrl+N", fn: () => openPop(pick(["winner", "screensaver"])) }, { label: "Message" }, { label: "Post" }, { label: "Contact" }, { label: "Internet Call" }] },
    { label: "Open...", key: "Ctrl+O", fn: () => { const u = prompt("Type the Internet address of a document or folder, and Internet Explorer will open it for you.", "http://"); if (u) go(u); } },
    { label: "Edit with Notepad", dis: true }, { label: "Save", key: "Ctrl+S", dis: true }, { label: "Save As...", fn: () => alertDlg("Saving this page requires the <b>SaveIt Pro Toolbar</b>.", { icon: "warn" }) },
    "-", { label: "Page Setup..." }, { label: "Print...", key: "Ctrl+P", fn: act.print }, { label: "Print Preview..." },
    "-", { label: "Send", items: [{ label: "Page by E-mail..." }, { label: "Link by E-mail..." }, { label: "Shortcut to Desktop" }] },
    { label: "Import and Export..." }, "-", { label: "Properties" }, { label: "Work Offline", fn: () => showInfo("You are working offline. The toolbars are not.", null, "info") },
    { label: "Close", fn: crash },
  ],
  Edit: () => [
    { label: "Cut", key: "Ctrl+X", dis: true }, { label: "Copy", key: "Ctrl+C" }, { label: "Paste", key: "Ctrl+V", dis: true }, "-",
    { label: "Select All", key: "Ctrl+A", fn: () => getSelection().selectAllChildren(page) }, "-", { label: "Find (on This Page)...", key: "Ctrl+F", fn: act.highlight },
  ],
  View: () => [
    { label: "Toolbars", items: toolbarItems },
    { label: "Status Bar", check: state.status, fn: () => { state.status = !state.status; renderBars(); } },
    { label: "Explorer Bar", items: [
      { label: "Search", key: "Ctrl+E", check: !!(state.sideMode === "search" || (!state.sideMode && isOn("sidefind"))), fn: act.sidebar },
      { label: "Favorites", key: "Ctrl+I" }, { label: "Media" },
      { label: "History", key: "Ctrl+H", check: state.sideMode === "history", fn: act.history },
      { label: "SideFind", check: isOn("sidefind"), fn: () => toggleBar("sidefind") },
    ] },
    "-", { label: "Go To", items: [{ label: "Back", key: "Alt+Left", fn: act.back }, { label: "Forward", key: "Alt+Right", fn: act.fwd }, "-", { label: "Home Page", key: "Alt+Home", fn: act.home }] },
    { label: "Stop", key: "Esc", fn: act.stop }, { label: "Refresh", key: "F5", fn: act.refresh }, "-",
    { label: "Text Size", items: ["Largest", "Larger", "Medium", "Smaller", "Smallest"].map((s, i) => ({ label: s, check: i === 2, fn: () => (page.style.fontSize = [20, 16, 13, 11, 9][i] + "px") })) },
    { label: "Encoding", items: [{ label: "Auto-Select" }, { label: "Western European (Windows)", check: true }, { label: "Unicode (UTF-8)" }] },
    "-", { label: "Source", fn: viewSource }, { label: "Privacy Report..." },
    { label: "Full Screen", key: "F11", fn: act.full },
  ],
  Favorites: () => [
    { label: "Add to Favorites...", fn: () => alertDlg("Added to Favorites. Also added: 4 sponsored favorites you didn't ask for.") },
    { label: "Organize Favorites...", fn: () => alertDlg("Your favorites are organized alphabetically by who paid the most.") }, "-",
    { label: "Links", items: [{ label: "Customize Links", fn: act.favmenu }, { label: "Free Hotmoil" }, { label: "Windows Media" }] },
    { label: "Kev's Awesome Homepage", fn: () => go(KEV_URL) },
    { label: "Home Search Portal", fn: () => go(HOME_URL) },
    { label: "Radio Station Guide" },
    "-",
    { label: "Cheap Flights!!!", spons: true, fn: () => openPop("winner") },
    { label: "Online Casino — $500 FREE", spons: true, fn: () => openPop("winner") },
    { label: "Free Screensavers", spons: true, fn: () => openPop("screensaver") },
    { label: "Meet Singles", spons: true, fn: () => openPop("singles") },
  ],
  Tools: () => [
    { label: "Mail and News", items: [{ label: "Read Mail", fn: act.mail }, { label: "New Message..." }] },
    { label: "Pop-up Blocker", items: [{ label: "Turn Off Pop-up Blocker", fn: () => { popupInfo(); alertDlg("The Pop-up Blocker has been turned off. You will not notice a difference."); } }, { label: "Pop-up Blocker Settings..." }] },
    { label: "Manage Add-ons...", fn: manageAddons },
    { label: "Synchronize..." }, { label: "Windows Update", fn: () => go("http://www.windowsupdate.fake/") }, "-",
    { label: "SpyScrub SE Scan...", fn: spyScrub },
    { label: "Gooble Toolbar Options", dis: !isOn("gooble") },
    { label: "Messenger" }, { label: "Sun Java Console" }, "-",
    { label: "Internet Options...", fn: internetOptions },
  ],
  Help: () => [
    { label: "Contents and Index" }, { label: "Tip of the Day", fn: () => alertDlg("Did you know? You can right-click any toolbar to see how many toolbars you have.") },
    { label: "For Netscape Users", fn: () => alertDlg("Welcome, Netscape user. Your old toolbars have been imported, too.") },
    { label: "Online Support" }, { label: "Send Feedback" }, "-",
    { label: "Why are there so many toolbars?", fn: why },
    { label: "About Internet Explorer", fn: about },
  ],
};

function viewSource() {
  makeDlg({
    title: `${state.url.split("/")[2] || "blank"}[1] - Notepad`, icon: I.page, w: 520,
    body: `<textarea readonly style="width:100%;height:220px;box-sizing:border-box;font:12px 'Lucida Console',monospace" aria-label="Page source">&lt;html&gt;\n&lt;!-- toolbar partner id: 2231 --&gt;\n&lt;script src="http://ads.bannerclick-network.biz/pop.js"&gt;&lt;/script&gt;\n${esc(page.innerHTML.trim().slice(0, 4000))}\n&lt;/html&gt;</textarea>`,
  });
}
function about() {
  makeDlg({
    title: "About Internet Explorer", icon: I.ie, w: 380,
    body: `<div style="background:linear-gradient(90deg,#1d4fa8,#5b9bf0);color:#fff;padding:12px;margin:-12px -12px 0;font:bold 20px 'Trebuchet MS',sans-serif">Internet Explorer 6</div>
      <div>Version: 6.0.2900.2180.xpsp_sp2_gdr.050301-1519<br>Cipher Strength: 128-bit<br>Product ID: 55274-640-1011873-23081<br>Update Versions: SP2; ${adwareCount()} toolbars</div>
      <div class="muted">Based on NCSA Mosaic. Distributed under a licensing agreement with Spyglass, Inc.<br>Warning: This computer program is protected by copyright law and by ${adwareCount()} other programs that will not let you uninstall them.</div>`,
    buttons: [{ label: "OK", def: true }],
  });
}
function why() {
  makeDlg({
    title: "Why are there so many toolbars?", icon: I.info, w: 430,
    body: `<div style="line-height:1.5">In 2005, toolbar companies paid software makers for every install. So free software came with a toolbar, pre-checked, on the fourth screen of the installer. The toolbars made money by changing your search engine and your home page, showing ads, and tracking where you went online.<br><br>
      Try it: close some (the <b>×</b> at the right of each bar), run <b>Tools › SpyScrub SE Scan</b>, or untick them in <b>Tools › Manage Add-ons</b>. Then wait and see how many come back.</div>`,
    buttons: [{ label: "Close", def: true }],
  });
}
function crash() {
  win.hidden = true;
  makeDlg({
    title: "Internet Explorer", icon: I.ie, w: 440,
    body: `<div style="background:#fff;margin:-12px -12px 0;padding:12px;display:flex;gap:10px"><div style="flex:1"><b>Internet Explorer has encountered a problem and needs to close. We are sorry for the inconvenience.</b></div>${I.err.replace("viewBox", 'class="bigico" viewBox')}</div>
      <div>If you were in the middle of something, the information you were working on might be lost.</div>
      <div class="fieldset"><b>Please tell Microsoft about this problem.</b><div class="muted">Faulting module: ${pick(currentAdware())?.id || "mshtml"}bar.dll, version 2.1.0.44</div></div>`,
    buttons: [{ label: "Send Error Report", def: true, fn: restart }, { label: "Don't Send", fn: restart }],
    onClose: restart,
  });
}
function restart() {
  if (!win.hidden) return;
  setTimeout(() => { win.hidden = false; renderBars(); go(state.home); showInfo("Internet Explorer restarted. All your toolbars were restored. You're welcome!", null, "info"); }, 900);
}

// ---------------- toolbar button actions ----------------
const act = {
  back: () => { if (state.idx > 0) { state.idx--; go(state.hist[state.idx], { push: false }); } },
  fwd: () => { if (state.idx < state.hist.length - 1) { state.idx++; go(state.hist[state.idx], { push: false }); } },
  stop: () => { clearTimeout(loadTimer); win.classList.remove("loading"); $("#st-prog i").style.width = 0; setStatus(); },
  refresh: () => go(state.url, { push: false }),
  home: () => go(state.home),
  go: () => go($("#addr").value),
  sidebar: () => { state.sideMode = isOn("sidefind") ? null : state.sideMode === "search" ? null : "search"; if (isOn("sidefind")) showInfo("Search Companion has been replaced by SideFind for a better search experience.", null, "info"); renderSide(); measure(); },
  history: () => { state.sideMode = state.sideMode === "history" ? null : "history"; renderSide(); measure(); },
  favmenu: e => { const r = e.currentTarget?.getBoundingClientRect?.() || { left: 80, bottom: 80 }; menuAt(r.left, r.bottom, MENUS.Favorites()); },
  media: () => alertDlg("The Media bar requires Windows Media Player 10, which requires Genuine Windows validation, which requires ActiveX, which requires a toolbar.", { icon: "warn" }),
  mail: () => alertDlg("Could not launch Outlook Express. The default mail client is now <b>Hotmoil Toolbar Mail</b>.", { icon: "err" }),
  print: () => alertDlg(`Printing ${adwareCount() * 3 + 2} pages. Most of them are toolbars.`),
  full: () => { state.full = !state.full; win.classList.toggle("max", state.full); renderBars(); if (state.full) showInfo("Full Screen mode hides Internet Explorer's own toolbars. The other ones stay. Press F11 to exit.", null, "info"); },
  typed: e => { const r = $(".addrwrap").getBoundingClientRect(); menuAt(r.left, r.bottom, [...new Set([...state.hist, HOME_URL, KEV_URL, "http://www.homestar.fake/"])].reverse().slice(0, 10).map(u => ({ label: u, fn: () => go(u) }))); },
  say: e => alertDlg(e.currentTarget.dataset.msg, { title: e.currentTarget.closest(".band") ? byId(e.currentTarget.closest(".band").dataset.bar).name : "Message", icon: "info" }),
  popup: e => openPop(e.currentTarget.dataset.pop),
  search: e => doSearch(e.currentTarget.dataset.engine, e.currentTarget),
  scan: () => spyScrub(),
  highlight: () => {
    const walker = document.createTreeWalker(page, NodeFilter.SHOW_TEXT);
    const nodes = []; while (walker.nextNode()) if (walker.currentNode.textContent.trim().length > 3) nodes.push(walker.currentNode);
    nodes.slice(0, 40).forEach(n => { const m = document.createElement("mark"); m.style.background = pick(["#ff0", "#0ff", "#f9f", "#9f9"]); n.replaceWith(m); m.appendChild(n); });
    setStatus("Highlighted every word, because they're all important.");
  },
  cursor: () => { document.body.classList.toggle("sparkle"); setStatus(document.body.classList.contains("sparkle") ? "Cursor Mania: Sparkly Unicorn cursor installed!" : "Cursor restored."); },
  skin: e => { const band = e.currentTarget.closest(".band"); const s = ["linear-gradient(#ff9a3a,#e04b1d)", "repeating-linear-gradient(45deg,#f8d,#f8d 6px,#fbe 6px 12px)", "linear-gradient(#333,#000)", ""]; band.dataset.skin = ((+band.dataset.skin || 0) + 1) % s.length; band.style.background = s[band.dataset.skin]; },
  radio: () => { setStatus("Buffering… 3%… 4%… Connecting to StreamCast… Buffering…"); setTimeout(() => openPop("winner"), 1500); },
  boost: () => { setStatus("Boosting connection…"); load(() => alertDlg("Optimization complete! Your connection is now <b>56.6 kbps</b>.<br>(Up from 56.6 kbps.)"), "boost://optimize"); },
  why: () => why(),
  "sidebar-close": () => { if (!state.sideMode && isOn("sidefind")) closeBar("sidefind"); state.sideMode = null; renderSide(); measure(); },
  "buddy-joke": () => buddy(BUDDY_LINES[2]),
  "buddy-sing": () => buddy(BUDDY_LINES[4]),
};

// ---------------- event wiring ----------------
document.addEventListener("click", e => {
  const t = e.target;
  if (!t.closest(".menu") && !t.closest(".mi")) closeMenus();
  const mi = t.closest(".mi");
  if (mi) { const open = mi.classList.contains("open"); closeMenus(); if (!open) { mi.classList.add("open"); const r = mi.getBoundingClientRect(); menuAt(r.left, r.bottom, MENUS[mi.dataset.menu]()); } return; }
  const x = t.closest("[data-close]"); if (x) return closeBar(x.dataset.close);
  const smile = t.closest("[data-smiley]"); if (smile) return adOrInstall(`Insert “${smile.dataset.smiley}” smiley? Premium smileys need the Smiley Centrale Plus pack.`);
  const a = t.closest("[data-act]"); if (a && act[a.dataset.act]) { e.preventDefault(); return act[a.dataset.act]({ currentTarget: a, clientX: e.clientX, clientY: e.clientY }); }
  const g = t.closest("[data-go]"); if (g) { e.preventDefault(); return go(g.dataset.go); }
  const p = t.closest("[data-pop]"); if (p && !t.closest(".dlg")) { e.preventDefault(); return openPop(p.dataset.pop); }
});
document.addEventListener("mouseover", e => {
  const g = e.target.closest("[data-go], [data-pop]");
  if (g && !win.classList.contains("loading")) setStatus(g.dataset.go ? (g.dataset.go.startsWith("search:") ? searchUrl("portal", g.dataset.go.slice(7)) : g.dataset.go) : "http://ads.bannerclick-network.biz/click.asp?id=" + Math.floor(rand(1e5, 1e6)));
});
document.addEventListener("mouseout", e => { if (e.target.closest("[data-go], [data-pop]") && !win.classList.contains("loading")) setStatus(); });
document.addEventListener("submit", e => { e.preventDefault(); go("search:" + (e.target.q?.value || "")); });
document.addEventListener("keydown", e => {
  if (e.key === "Enter" && e.target.matches("#addr")) return act.go();
  if (e.key === "Enter" && e.target.matches("input[data-engine], #sf-q")) return doSearch(e.target.dataset.engine || (isOn("sidefind") ? "sidefind" : "msm"), e.target);
  if (e.key === "F11") { e.preventDefault(); act.full(); }
  if (e.key === "F5") { e.preventDefault(); act.refresh(); }
  if (e.key === "Escape") { closeMenus(); act.stop(); }
});
$("#rebar").addEventListener("contextmenu", e => { e.preventDefault(); closeMenus(); menuAt(e.clientX, e.clientY, toolbarItems()); });
$("#infobar").addEventListener("click", e => { if (e.target.closest(".ib-x")) { $("#infobar").hidden = true; return measure(); } infoAction?.(e); });

function adOrInstall(msg) {
  makeDlg({
    title: "Smiley Centrale", icon: I.info, w: 340,
    body: `<div class="row">${smiley(3).replace('class="smiley"', 'class="bigico"')}<div>${msg}</div></div>`,
    buttons: [{ label: "Get Plus Pack", def: true, fn: () => activeX() }, { label: "Maybe Later" }],
  });
}

// Title bar buttons
$("#cap-min").onclick = () => win.classList.toggle("min");
$("#cap-max").onclick = () => win.classList.toggle("max");
$("#cap-close").onclick = crash;
$(".titlebar", win).addEventListener("dblclick", () => win.classList.toggle("max"));

// ---------------- the background hum ----------------
function adTick() {
  const n = adwareCount();
  if (n > 0 && !win.hidden) {
    const through = Math.random() < Math.min(.65, n * .06);
    state.blocked++;
    $("#gooble-blocked") && ($("#gooble-blocked").textContent = `${state.blocked} blocked`);
    if (through && document.querySelectorAll(".pop").length < 4) openPop(pick(["winner", "monkey", "scare", "screensaver", "singles"]));
    else popupInfo();
  }
  setTimeout(adTick, rand(14000, 26000) * (n ? 1 : 2));
}

// ---------------- boot ----------------
renderBars();
go(HOME_URL);
popupInfo();
setTimeout(adTick, 9000);
setTimeout(() => buddy(BUDDY_LINES[0]), 22000);
addEventListener("resize", measure);
