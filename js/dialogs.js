// XP-style dialogs, pop-up windows, and the little purple helper.
let dlgZ = 300;
const $ = (s, r = document) => r.querySelector(s);
const rand = (a, b) => a + Math.random() * (b - a);
const pick = a => a[Math.floor(Math.random() * a.length)];

function makeDlg({ title, icon = I.ie, body, buttons = [], w = 360, x, y, cls = "", onClose, help = false }) {
  const d = document.createElement("div");
  d.className = "dlg " + cls;
  d.style.width = w + "px";
  d.style.zIndex = ++dlgZ;
  d.innerHTML = `
    <div class="titlebar">${icon.replace("viewBox", 'class="ie-ico" viewBox')}<span class="ttl">${title}</span>
      ${help ? `<button class="cap" aria-label="Help">${I.help}</button>` : ""}
      <button class="cap close" aria-label="Close">${I.close}</button></div>
    <div class="dlg-b">${body}${buttons.length ? `<div class="btns">${buttons.map((b, i) => `<button class="xpbtn${b.def ? " def" : ""}" data-i="${i}">${b.label}</button>`).join("")}</div>` : ""}</div>`;
  document.body.appendChild(d);
  const vw = innerWidth, vh = innerHeight, r = d.getBoundingClientRect();
  d.style.left = Math.max(4, Math.min(vw - r.width - 4, x ?? (vw - r.width) / 2)) + "px";
  d.style.top = Math.max(4, Math.min(vh - r.height - 4, y ?? (vh - r.height) / 2.4)) + "px";
  const close = (why) => { if (!d.isConnected) return; d.remove(); onClose?.(why); };
  d.close = close;
  $(".cap.close", d).onclick = () => close("x");
  d.querySelectorAll(".btns .xpbtn").forEach(b => b.onclick = () => {
    const r = buttons[+b.dataset.i].fn?.(d);
    if (r !== false) close("btn");
  });
  d.addEventListener("pointerdown", () => (d.style.zIndex = ++dlgZ));
  drag(d, $(".titlebar", d));
  $(".btns .def", d)?.focus();
  return d;
}

function drag(el, handle) {
  handle.addEventListener("pointerdown", e => {
    if (e.target.closest("button")) return;
    const sx = e.clientX - el.offsetLeft, sy = e.clientY - el.offsetTop;
    const mv = ev => { el.style.left = ev.clientX - sx + "px"; el.style.top = Math.max(0, ev.clientY - sy) + "px"; };
    const up = () => { removeEventListener("pointermove", mv); removeEventListener("pointerup", up); };
    addEventListener("pointermove", mv); addEventListener("pointerup", up);
  });
}

function alertDlg(msg, { title = "Microsoft Internet Explorer", icon = "info", ok = "OK" } = {}) {
  return makeDlg({
    title, w: 340,
    body: `<div class="row">${I[icon].replace("viewBox", 'class="bigico" viewBox')}<div style="padding-top:6px">${msg}</div></div>`,
    buttons: [{ label: ok, def: true }],
  });
}

// ---------------- ActiveX: how most of these got here ----------------
function activeX(bar, { nag = 0 } = {}) {
  if (!bar || isInstalled(bar.id)) bar = EXTRA_BARS.find(b => !isInstalled(b.id));
  if (!bar) return alertDlg("There is nothing left to install. You have every toolbar.<br><br>Congratulations?", { icon: "info" });
  makeDlg({
    title: "Internet Explorer - Security Warning", icon: I.shield, w: 420,
    body: `<div class="row">${I.shield.replace("viewBox", 'class="bigico" viewBox')}<div>
      <p style="margin:0 0 8px">Do you want to install this software?</p>
      <div class="fieldset" style="gap:3px"><div><b>Name:</b> <a style="color:#00c;text-decoration:underline">${bar.name}</a></div>
      <div><b>Publisher:</b> <a style="color:#00c;text-decoration:underline">Bundle Partners Distribution LLC</a></div></div>
      ${nag ? `<p style="margin:8px 0 0;color:#b00"><b>Are you sure?</b> ${bar.name} is required to view this page correctly. ${nag > 1 ? "This is the last time we will ask. (It is not.)" : ""}</p>` : ""}
    </div></div>
    <div class="row" style="border-top:1px solid #ccc;padding-top:8px">${I.warn.replace("viewBox", 'style="width:18px;height:18px;flex:none" viewBox')}
      <span class="muted">While files from the Internet can be useful, this file type can potentially harm your computer. Only install software from publishers you trust.</span></div>`,
    buttons: [
      { label: "Install", def: true, fn: () => installBar(bar) },
      { label: "Don't Install", fn: () => { if (nag < 2 && Math.random() < .75) setTimeout(() => activeX(bar, { nag: nag + 1 }), 700); } },
    ],
  });
}

// ---------------- pop-ups ----------------
const POPS = {
  winner: () => ({
    title: "CONGRATULATIONS!!! - Microsoft Internet Explorer", url: "http://www.prize-center-claims.biz/win.asp?id=1000000", w: 380,
    html: `<div style="background:repeating-linear-gradient(45deg,#ff0 0 14px,#fc0 14px 28px);padding:12px;text-align:center;font-family:Impact,Arial Black,sans-serif">
      <div class="blink" style="font-size:24px;color:#c00;text-shadow:2px 2px #fff">CONGRATULATIONS!</div>
      <div style="font:bold 14px Arial,sans-serif;color:#000;margin:6px 0">You are the <u>1,000,000th</u> visitor!<br>You have WON a FREE* MP3 Player!</div>
      <button class="xpbtn def" data-claim style="font-weight:bold">CLAIM MY PRIZE &gt;&gt;</button>
      <div style="font:9px Arial,sans-serif;color:#333;margin-top:6px">*Requires purchase of 7 sponsor offers. Void where sensible.</div></div>`,
    wire: p => ($("[data-claim]", p).onclick = () => { p.close("claim"); activeX(); }),
  }),
  monkey: () => ({
    title: "Punch the Monkey and WIN $20!", url: "http://ads.bannerclick-network.biz/punch/", w: 420,
    html: `<div style="background:#036;color:#fff;font:bold 13px Arial,sans-serif;padding:8px;text-align:center">PUNCH THE MONKEY AND WIN $20! <span class="blink" style="color:#ff0">CLICK HIM!!</span>
      <div data-arena style="position:relative;height:84px;background:#9cf;margin-top:6px;overflow:hidden;cursor:crosshair">
        <div data-monkey style="position:absolute;top:10px;left:0;transition:left .5s linear;cursor:pointer" role="button" aria-label="Monkey"><svg viewBox="0 0 50 50" style="width:50px;height:50px"><circle cx="8" cy="22" r="7" fill="#8a5a2b"/><circle cx="42" cy="22" r="7" fill="#8a5a2b"/><circle cx="25" cy="25" r="18" fill="#8a5a2b"/><ellipse cx="25" cy="30" rx="12" ry="10" fill="#f0c89a"/><circle cx="19" cy="21" r="2.5" fill="#000"/><circle cx="31" cy="21" r="2.5" fill="#000"/><path d="M19 33c3 3 9 3 12 0" stroke="#000" stroke-width="2" fill="none"/></svg></div></div>
      <div data-score style="margin-top:4px;font-size:11px">Punches: 0</div></div>`,
    wire: p => {
      let n = 0; const m = $("[data-monkey]", p), a = $("[data-arena]", p);
      const hop = () => { if (!p.isConnected) return; m.style.left = rand(0, a.clientWidth - 54) + "px"; setTimeout(hop, 500); };
      hop();
      m.onclick = () => {
        n++; $("[data-score]", p).textContent = `Punches: ${n}` + (n < 3 ? "" : " — YOU WIN!");
        if (n === 3) setTimeout(() => { p.close("won"); activeX(); }, 600);
      };
    },
  }),
  singles: () => ({
    title: "Lonely? - Microsoft Internet Explorer", url: "http://www.friendfinder-connect.biz/?src=toolbar", w: 330,
    html: `<div style="padding:12px;font:13px Arial,sans-serif;background:#fde;text-align:center">
      <b style="color:#c06;font-size:17px">3 Singles in Your Area</b><br>want to chat with <b>you</b> right now!<br><br>
      <span style="font-size:11px">(They are all the same guy in Ohio.)</span><br><br>
      <button class="xpbtn def" data-claim>Chat Now!</button></div>`,
    wire: p => ($("[data-claim]", p).onclick = () => { p.close("claim"); openPop("im"); }),
  }),
  scare: () => ({
    title: "WARNING! - Microsoft Internet Explorer", url: "http://www.free-pc-scan-now.biz/alert.html", w: 380,
    html: `<div style="padding:12px;font:12px Arial,sans-serif;background:#fff">
      <div class="row">${I.err.replace("viewBox", 'class="bigico" viewBox')}<div><b style="color:#c00;font-size:15px">Your computer may be infected!</b><br>
      Our scan has detected <b class="blink" style="color:#c00">(47) SPYWARE</b> programs on your PC. Click OK to remove them for FREE.</div></div>
      <div class="btns" style="margin-top:10px"><button class="xpbtn def" data-claim>OK</button><button class="xpbtn" data-claim>Cancel</button></div>
      <div style="font-size:9px;color:#888;margin-top:6px">Both buttons do the same thing.</div></div>`,
    wire: p => p.querySelectorAll("[data-claim]").forEach(b => (b.onclick = () => { p.close("claim"); activeX(); })),
  }),
  screensaver: () => ({
    title: "FREE 3D Aquarium Screensaver!", url: "http://www.popular-screensavers.biz/aquarium3d.asp", w: 360,
    html: `<div style="padding:10px;font:12px Arial,sans-serif;background:linear-gradient(#0af,#036);color:#fff;text-align:center">
      <svg viewBox="0 0 120 34" style="width:150px;height:42px"><g fill="#ff9a1a"><ellipse cx="22" cy="17" rx="13" ry="8"/><path d="M8 17 0 9v16z"/></g><g fill="#ffe14a"><ellipse cx="62" cy="12" rx="10" ry="6"/><path d="M51 12l-7-6v12z"/></g><g fill="#6fd0ff"><ellipse cx="98" cy="20" rx="12" ry="8"/><path d="M85 20l-8-7v14z"/></g><circle cx="30" cy="15" r="1.6" fill="#000"/><circle cx="68" cy="11" r="1.3" fill="#000"/><circle cx="106" cy="18" r="1.5" fill="#000"/></svg>
      <b style="font-size:15px">FREE 3D Aquarium Screensaver</b><br>Turn your desktop into a relaxing ocean!<br>
      <button class="xpbtn def" data-claim style="margin-top:8px;color:#000">Download FREE</button>
      <div style="font-size:9px;opacity:.7;margin-top:6px">Includes MyWebSurch toolbar and 3 partner offers. By downloading you agree to a 41-page EULA.</div></div>`,
    wire: p => ($("[data-claim]", p).onclick = () => { p.close("claim"); activeX(); }),
  }),
  mail: () => ({
    title: "Inbox (1) - Microsoft Internet Explorer", url: "http://mail.hotmoil.com/cgi-bin/HoTMaiL", w: 360,
    html: `<div style="padding:10px;font:12px Verdana,sans-serif">
      <b>From:</b> Aunt Linda<br><b>Subject:</b> FW: FW: fw: FW: Re: This is so TRUE!!!!!<br><hr>
      &gt;&gt;&gt;&gt; Forward this to 10 people or you will have bad luck for 7 years. Bill Gates will pay you $245 for each forward!!<br><br>
      <span class="muted">Mailbox is 98% full (2 MB). Upgrade to Hotmoil Plus for $19.95/yr.</span></div>`,
  }),
  im: () => ({
    title: "xXsk8rboiXx - Conversation", url: null, w: 320, icon: I.person,
    html: `<div style="padding:6px;font:12px Arial,sans-serif;background:#fff">
      <div data-log style="height:110px;overflow:auto;border:1px solid #7f9db9;padding:4px"></div>
      <div style="display:flex;gap:4px;margin-top:4px"><input class="box" data-in style="flex:1" aria-label="Message"><button class="xpbtn" data-send style="min-width:50px">Send</button></div></div>`,
    wire: p => {
      const log = $("[data-log]", p), inp = $("[data-in]", p);
      const lines = ["hey", "a/s/l?", "check out my new smileys!!! :D", "u should get the smiley toolbar its free", "brb mom needs the phone line", "ok back", "did u install it yet"];
      let i = 0;
      const say = (who, t, c) => { log.insertAdjacentHTML("beforeend", `<div><b style="color:${c}">${who} says:</b> ${esc(t)}</div>`); log.scrollTop = 1e6; };
      const next = () => { if (!p.isConnected || i >= lines.length) return; say("xXsk8rboiXx", lines[i++], "#c00"); if (i === 4) setTimeout(() => activeX(TOOLBARS.find(b => b.id === "mws")), 900); setTimeout(next, rand(1800, 3500)); };
      setTimeout(next, 700);
      const send = () => { if (!inp.value.trim()) return; say("me", inp.value, "#00c"); inp.value = ""; };
      $("[data-send]", p).onclick = send; inp.onkeydown = e => e.key === "Enter" && send();
    },
  }),
};

function openPop(kind, { exit = false } = {}) {
  const spec = POPS[kind]();
  const n = document.querySelectorAll(".pop").length;
  const p = makeDlg({
    title: exit ? "WAIT! Before you go... - Microsoft Internet Explorer" : spec.title,
    icon: spec.icon || I.ie, w: spec.w, cls: "pop",
    x: rand(20, Math.max(40, innerWidth - spec.w - 20)), y: rand(30, Math.max(60, innerHeight - 300)) + n * 6,
    body: `${spec.url ? `<div class="pop-addr">${I.page.replace("viewBox", 'style="width:14px;height:14px" viewBox')}${spec.url}</div>` : ""}<div class="pop-page">${spec.html}</div>`,
    onClose: why => {
      // Closing an ad sometimes just opens another ad.
      if (why === "x" && !exit && Math.random() < .3 && adwareCount() > 0) setTimeout(() => openPop(pick(["winner", "scare", "screensaver"]), { exit: true }), 400);
    },
  });
  spec.wire?.(p);
  return p;
}

// ---------------- SpyScrub: the cleanup that doesn't stick ----------------
function spyScrub() {
  const found = currentAdware();
  const d = makeDlg({
    title: "SpyScrub SE Personal - Scan", icon: I.shield, w: 430,
    body: `<div class="row">${I.shield.replace("viewBox", 'class="bigico" viewBox')}<div><b>Performing smart system scan</b><br><span class="muted" data-cur>Initializing definitions file (SE1R76 17.10.2005)…</span></div></div>
      <div class="prog"><i data-bar></i></div>
      <div class="scanlog" data-log></div>
      <div data-sum style="font-weight:bold">Objects scanned: <span data-n>0</span> · Critical objects found: <span data-f style="color:#c00">0</span></div>`,
    buttons: [{ label: "Remove All", def: true, fn: () => false }, { label: "Cancel" }],
  });
  const rm = $(".btns .xpbtn", d); rm.disabled = true;
  const keys = found.flatMap(b => [
    `HKLM\\Software\\${b.name.replace(/\W/g, "")}\\Toolbar`,
    `C:\\Program Files\\${b.name}\\${b.id}bar.dll`,
    `HKCU\\Software\\Microsoft\\Internet Explorer\\Toolbar\\{${(b.id + "0000-4f2a-9c0b").toUpperCase()}}`,
    `Tracking Cookie: ${b.id}.adserver.biz`,
  ]);
  let i = 0, n = 0, f = 0;
  const tick = () => {
    if (!d.isConnected) return;
    n += Math.floor(rand(80, 400));
    $("[data-n]", d).textContent = n.toLocaleString();
    if (i < keys.length) {
      f += Math.floor(rand(8, 40));
      $("[data-log]", d).insertAdjacentHTML("beforeend", `<div style="color:#c00">✖ ${esc(keys[i++])}</div>`);
      $("[data-log]", d).scrollTop = 1e6;
      $("[data-f]", d).textContent = f;
    }
    $("[data-cur]", d).textContent = pick(["Scanning memory…", "Scanning registry…", "Scanning Windows\\System32…", "Scanning cookies…", "Deep-scanning drive C:…"]);
    $("[data-bar]", d).style.width = Math.min(100, (i / Math.max(1, keys.length)) * 100) + "%";
    if (i < keys.length || n < 2000) setTimeout(tick, 110);
    else {
      $("[data-cur]", d).textContent = found.length ? "Scan complete. Your system is at risk." : "Scan complete. No toolbars found. Enjoy it while it lasts.";
      rm.disabled = !found.length;
      rm.onclick = () => {
        d.close("btn");
        found.forEach(b => closeBar(b.id, { silent: true }));
        showInfo(`SpyScrub removed ${f} critical objects and ${found.length} toolbars. Your browser is clean!`, null, "shield");
      };
    }
  };
  tick();
}

// ---------------- Manage Add-ons (new in XP SP2!) ----------------
function manageAddons() {
  const rows = () => allBars().filter(b => !b.builtin && isInstalled(b.id)).map(b => `
    <tr><td><label><input type="checkbox" data-bar="${b.id}" ${isOn(b.id) ? "checked" : ""}> ${b.name}</label></td>
    <td>${b.id === "gooble" ? "Gooble Inc." : "Bundle Partners Distribution LLC"}</td>
    <td>${isOn(b.id) ? "Enabled" : "<i>Disabled</i>"}</td><td class="muted">${b.bundled || ""}</td></tr>`).join("");
  const d = makeDlg({
    title: "Manage Add-ons", icon: I.ie, w: 620, help: true,
    body: `<div class="muted">View and manage add-ons that are installed on your computer. Disabling add-ons might prevent some Web pages from working.</div>
      <div style="max-height:240px;overflow:auto;background:#fff;border:1px solid #7f9db9">
      <table style="border-collapse:collapse;width:100%;font:11px Tahoma,sans-serif" cellpadding="3">
      <thead style="background:#ece9d8;text-align:left"><tr><th>Name</th><th>Publisher</th><th>Status</th><th>How you got it</th></tr></thead>
      <tbody data-rows>${rows() || `<tr><td colspan="4" class="muted">No add-ons are installed. Somehow.</td></tr>`}</tbody></table></div>`,
    buttons: [{ label: "OK", def: true }],
  });
  d.addEventListener("change", e => {
    const id = e.target.dataset.bar; if (!id) return;
    e.target.checked ? openBar(id) : closeBar(id);
    $("[data-rows]", d).innerHTML = rows();
  });
}

function internetOptions() {
  makeDlg({
    title: "Internet Options", icon: I.globe, w: 400, help: true,
    body: `<div class="tabs"><span class="on">General</span><span>Security</span><span>Privacy</span><span>Content</span><span>Connections</span><span>Programs</span><span>Advanced</span></div>
      <div class="fieldset"><b>Home page</b><div class="muted">You can change which page to use for your home page.</div>
        <label>Address: <input class="box" id="opt-home" style="width:280px" value="${esc(state.home)}"></label>
        <div class="btns" style="justify-content:flex-start"><button class="xpbtn" data-h="cur">Use Current</button><button class="xpbtn" data-h="blank">Use Blank</button></div></div>
      <div class="fieldset"><b>Temporary Internet files</b><div class="muted">Pages you view on the Internet are stored in a special folder for quick viewing later. (4,211 MB)</div></div>`,
    buttons: [{ label: "OK", def: true, fn: () => setHome($("#opt-home").value) }, { label: "Cancel" }, { label: "Apply", fn: () => (setHome($("#opt-home").value), false) }],
  });
  document.querySelectorAll("[data-h]").forEach(b => (b.onclick = () => ($("#opt-home").value = b.dataset.h === "blank" ? "about:blank" : state.url)));
}

// ---------------- BuddyBonz ----------------
const BUDDY_LINES = [
  "Hi! I'm BuddyBonz, your new Internet friend! Would you like me to help you search the web?",
  "Did you know? You can make your browsing even better with more toolbars!",
  "Knock knock! Who's there? A pop-up! A pop-up who? A pop-up you can't close!",
  "I noticed you're trying to read a web page. Would you like help with that?",
  "♪ Daisy, Daisy, give me your answer do… ♪",
];
function buddy(line) {
  let b = $(".buddy");
  if (!b) {
    b = document.createElement("div");
    b.className = "buddy";
    b.innerHTML = `${BUDDY_SVG}<div class="bubble" hidden></div>`;
    b.style.right = "40px"; b.style.bottom = "70px";
    document.body.appendChild(b);
    b.querySelector("svg").onclick = () => buddy();
  }
  const bub = $(".bubble", b);
  bub.hidden = false;
  bub.innerHTML = `${esc(line || pick(BUDDY_LINES))}<div class="btns"><button class="xpbtn" data-b="yes">Yes!</button><button class="xpbtn" data-b="more">Tell me more</button><button class="xpbtn" data-b="go">Go away</button></div>`;
  b.classList.remove("bounce"); void b.offsetWidth; b.classList.add("bounce");
  bub.onclick = e => {
    const k = e.target.dataset.b; if (!k) return;
    if (k === "yes") { bub.hidden = true; activeX(EXTRA_BARS.find(x => x.id === "bonzibar")); }
    if (k === "more") buddy(pick(BUDDY_LINES));
    if (k === "go") { bub.innerHTML = "OK! I'll be right here if you need me. :)"; setTimeout(() => (bub.hidden = true), 1800); }
  };
}
