// Every bar in the rebar. `builtin` bars are IE's own; the rest arrived
// "free" with a screensaver, a codec, a file-sharing client or a smiley pack.
// `respawn` (seconds) is how long it waits before reinstalling itself.
// `bundled` is where the user "agreed" to it.

const srch = (engine, ph, btn = "Search", w = 150) =>
  `<input class="box" data-engine="${engine}" placeholder="${ph}" style="width:${w}px" aria-label="${ph}"><button class="tb" data-act="search" data-engine="${engine}">${I.search.replace('viewBox', 'class="ico" viewBox')}${btn}</button>`;
const btn = (label, act, extra = "", ico = "") =>
  `<button class="tb" data-act="${act}" ${extra}>${ico ? ico.replace("viewBox", 'class="ico" viewBox') : ""}${label}</button>`;
const sep = `<span class="sep"></span>`;

const TOOLBARS = [
  {
    id: "menu", name: "Menu Bar", builtin: true, locked: true,
    render: () => ["File", "Edit", "View", "Favorites", "Tools", "Help"]
      .map(m => `<button class="mi" data-menu="${m}"><u>${m[0]}</u>${m.slice(1)}</button>`).join("")
      + `<span class="brand">provided by Dell</span>`,
    cls: "menubar",
  },
  {
    id: "std", name: "Standard Buttons", builtin: true,
    render: () => `
      <button class="tb big" data-act="back" id="btn-back" aria-label="Back">${I.back}<span>Back</span><span class="dd">▼</span></button>
      <button class="tb big" data-act="fwd" id="btn-fwd" aria-label="Forward">${I.fwd}<span class="dd">▼</span></button>
      <button class="tb" data-act="stop" aria-label="Stop">${I.stop}</button>
      <button class="tb" data-act="refresh" aria-label="Refresh">${I.refresh}</button>
      <button class="tb" data-act="home" aria-label="Home">${I.home}</button>
      ${sep}
      <button class="tb big" data-act="sidebar">${I.search}<span>Search</span></button>
      <button class="tb big" data-act="favmenu">${I.fav}<span>Favorites</span></button>
      <button class="tb big" data-act="media" aria-label="Media">${I.media}</button>
      <button class="tb big" data-act="history" aria-label="History">${I.history}</button>
      ${sep}
      <button class="tb big" data-act="mail" aria-label="Mail">${I.mail}<span class="dd">▼</span></button>
      <button class="tb big" data-act="print" aria-label="Print">${I.print}</button>`,
  },
  {
    id: "addr", name: "Address Bar", builtin: true, cls: "address",
    render: () => `
      <span class="lbl muted">A<u>d</u>dress</span>
      <div class="addrwrap">${I.page.replace("viewBox", 'class="ico" viewBox')}
        <input id="addr" spellcheck="false" autocomplete="off" aria-label="Address">
        <button class="ddbtn" data-act="typed" aria-label="Previously typed addresses">▼</button></div>
      <button class="tb go" data-act="go">${I.go}Go</button>`,
  },
  {
    id: "links", name: "Links", builtin: true,
    render: () => `
      <span class="lbl muted">Links</span>
      ${[["Customize Links", "why"], ["Free Hotmoil", "mail"], ["Windows Media", "media"], ["Kev's Page", "kev"]].map(([l, a]) =>
        a === "kev" ? `<button class="tb" data-go="${KEV_URL}">${I.page.replace("viewBox", 'class="ico" viewBox')}${l}</button>` : btn(l, a, "", I.page)).join("")}
      ${sep}
      ${btn("Cheap Tickets!!", "popup", 'data-pop="winner"', I.globe)}
      ${btn("Casino $500 FREE", "popup", 'data-pop="winner"', I.dice)}
      ${btn("Smileys", "popup", 'data-pop="screensaver"', I.globe)}
      ${btn("Ringtones", "popup", 'data-pop="scare"', I.note)}`,
  },

  // ---------------- the parasites ----------------
  {
    id: "gooble", name: "Gooble Toolbar", respawn: 0,
    bundled: "installed on purpose, the one you actually wanted",
    render: () => `
      <span class="logo"><span style="color:#1f52d6">G</span><span style="color:#d52b1e">o</span><span style="color:#f4b400">o</span><span style="color:#1f52d6">b</span><span style="color:#139a3e">l</span><span style="color:#d52b1e">e</span></span>
      ${srch("gooble", "", "Search Web")}
      <span class="lbl">PageRank</span><span class="meter" title="PageRank 2/10"><i style="width:20%"></i></span>
      ${sep}<span class="lbl" id="gooble-blocked">0 blocked</span>
      ${btn("AutoFill", "say", 'data-msg="AutoFill has entered your name, address and phone number into 14 forms on this page."')}
      ${btn("Options", "say", 'data-msg="There are no options. The toolbar is working as intended."')}`,
  },
  {
    id: "yahooey", name: "Yahooey! Companion", respawn: 45,
    bundled: "Java Runtime Update 5.0 (the checkbox was already ticked)",
    render: () => `
      <span class="logo" style="color:#7b0099;font-style:italic;font-family:Georgia,serif">Yahooey!</span>
      ${srch("yahooey", "", "Search Web")}
      ${sep}
      ${btn("Mail", "popup", 'data-pop="mail"', I.mail)}
      ${btn("My Yahooey!", "say", 'data-msg="My Yahooey! has been personalized. It now shows horoscopes for a sign you are not."')}
      ${btn("Games", "popup", 'data-pop="monkey"', I.dice)}
      ${btn("Personals", "popup", 'data-pop="singles"', I.heart)}
      ${btn("Anti-Spy", "scan", "", I.shield)}
      ${btn("Pop-Up Blocker (0)", "say", 'data-msg="The Yahooey! Pop-Up Blocker is fighting the Gooble Pop-Up Blocker. Neither is winning."')}`,
  },
  {
    id: "msm", name: "MSM Search Toolbar", respawn: 60,
    bundled: "MSM Messenger 7.5 setup",
    render: () => `
      <span class="logo" style="color:#11479e"><span style="color:#f28b00">✿</span> msm</span>
      ${srch("msm", "", "Search", 130)}
      ${btn("Highlight", "highlight", "", I.bolt)}
      ${btn("Messenger (3 online)", "popup", 'data-pop="im"', I.person)}
      ${btn("Hotmoil", "popup", 'data-pop="mail"', I.mail)}
      ${btn("Desktop Search", "say", 'data-msg="Indexing your hard drive… 2% complete. Estimated time remaining: 11 days."')}`,
  },
  {
    id: "jervis", name: "Ask Jervis Toolbar", respawn: 30,
    bundled: "a free version of a popular file-sharing program",
    render: () => `
      <span class="logo" style="color:#b30000">${I.butler.replace("viewBox", 'class="ico" style="width:16px;height:16px;vertical-align:-3px" viewBox')} Ask Jervis</span>
      ${srch("jervis", "Ask me anything, in a question", "Ask!", 190)}
      ${btn("Dictionary", "say", 'data-msg="toolbar (n.): a horizontal strip of buttons that appears whether or not you asked for it."')}
      ${btn("Encyclopedia", "search", 'data-engine="jervis" data-q="what is a toolbar"')}
      ${btn("58°F Cloudy", "say", 'data-msg="It is 58°F and cloudy. It is also 72°F and sunny, according to the HotBarr toolbar below."', I.sun)}
      ${btn("Zip Code Finder", "say", 'data-msg="Your zip code is 90210. (Jervis guessed.)"')}`,
  },
  {
    id: "mws", name: "MyWebSurch · Smiley Centrale", respawn: 12,
    bundled: "“FREE Smileys for Messenger & Email!!” (you clicked one ad, once)",
    render: () => `
      <span class="logo" style="color:#1d5bbf">My<span style="color:#ff7a00">Web</span>Surch</span>
      ${srch("mws", "", "Search", 120)}
      ${sep}<span class="lbl" style="color:#c60;font-weight:bold">Smiley Centrale</span>
      ${Array.from({ length: 8 }, (_, i) => smiley(i)).join("")}
      ${btn("Popular Screensavers", "popup", 'data-pop="screensaver"')}
      ${btn("Cursor Mania", "cursor", "")}
      ${btn("Weather", "say", 'data-msg="Weather feature requires the WeatherBugg toolbar. Installing…"')}`,
  },
  {
    id: "hotbarr", name: "HotBarr", respawn: 20,
    bundled: "a “skin” for your toolbar, which was itself a toolbar",
    render: () => `
      <span class="logo" style="background:linear-gradient(#ffcc00,#e04b1d);-webkit-background-clip:text;background-clip:text;color:transparent;font-style:italic">HotBarr</span>
      ${btn("Skins", "skin", "")}
      <span class="lbl">${I.sun.replace("viewBox", 'class="ico" style="width:14px;height:14px;vertical-align:-3px" viewBox')} 72°F Sunny</span>
      <span class="ticker"><span>*** HOT DEALS *** 50% off ink cartridges *** Refinance NOW at 3.9%!!! *** Free ringtones for your phone *** Lose 30 lbs in 30 days *** You may already be a WINNER *** </span></span>
      ${btn("Shopping", "popup", 'data-pop="winner"', I.cart)}`,
  },
  {
    id: "wbug", name: "WeatherBugg", respawn: 25,
    bundled: "the MyWebSurch “Weather” button",
    render: () => `
      <span class="logo" style="color:#1d7f22">${I.bug.replace("viewBox", 'class="ico" style="width:15px;height:15px;vertical-align:-3px" viewBox')} WeatherBugg</span>
      <span class="lbl"><b>61°F</b> Live from Springfield Elementary</span>
      <button class="tb" data-act="say" data-msg="NATIONAL WEATHER ALERT: A light breeze has been detected somewhere in the continental United States."><b class="blink" style="color:#c00">⚠ WEATHER ALERT (1)</b></button>
      ${btn("5-Day Forecast", "popup", 'data-pop="winner"')}
      <span class="muted">Sponsored by Insta-Loan Direct</span>`,
  },
  {
    id: "aoll", name: "America Offline Toolbar", respawn: 50,
    bundled: "a CD that came in a cereal box (1,025 free hours!)",
    render: () => `
      <span class="logo" style="color:#0b3d91">▲ America Offline</span>
      ${srch("aoll", "", "Search", 110)}
      ${btn("Radio", "radio", "", I.note)}
      ${btn("Buddy List (0)", "popup", 'data-pop="im"', I.person)}
      ${btn("You've Got Mail!", "say", 'data-msg="You have 1 new message: “Re: re: RE: FW: fw: Funny cat!!!!”"', I.mail)}
      ${btn("Keyword", "say", 'data-msg="Please enter your Keyword. Keywords are like web addresses, but worse."')}`,
  },
  {
    id: "zingo", name: "Zingo Search Assistant", respawn: 15,
    bundled: "a codec pack needed to watch one (1) video of a dancing hamster",
    render: () => `
      <span class="logo" style="color:#0a8a8a">zingo</span><span class="muted">Search Assistant</span>
      ${srch("zingo", "", "Zingo!", 110)}
      <span class="pill" style="background:#ffe8a0">Free Games!</span>
      <span class="pill" style="background:#c8f0c8">Free Ringtones!</span>
      <span class="pill" style="background:#f7c8e0">Free Screensavers!</span>
      <span class="muted">This program is FREE because of ads · 1,204 ads shown today</span>`,
  },
  {
    id: "ebuy", name: "eBuy Toolbar", respawn: 70,
    bundled: "you won a PalmPilot for $41 once",
    render: () => `
      <span class="logo"><span style="color:#e53238">e</span><span style="color:#0064d2">B</span><span style="color:#f5af02">u</span><span style="color:#86b817">y</span></span>
      ${srch("ebuy", "", "Search", 110)}
      ${btn("My eBuy", "say", 'data-msg="You are watching 1 item: Pre-owned Tamagotchi (cracked). Ends in 0d 0h 4m."')}
      <span class="lbl blink" style="color:#c00;font-weight:bold">Alert: 3 items ending soon!</span>
      ${btn("Account Guard", "say", 'data-msg="Account Guard: this site is green. Probably. We think."', I.shield)}`,
  },
  {
    id: "alexxa", name: "Alexxa Toolbar", respawn: 90,
    bundled: "“See site info!”, which also sent every URL you visited home",
    render: () => `
      <span class="logo" style="color:#555">alexxa</span>
      <span class="lbl">Traffic Rank: <b id="alexxa-rank">14,203,997</b></span>
      <span class="meter"><i style="width:4%;background:#2c64c8"></i></span>
      ${btn("Related Links ▾", "favmenu", "")}
      ${btn("Info", "say", 'data-msg="People who visited this site also visited: the site you were on before this one."')}`,
  },
  {
    id: "dlboost", name: "DownloadBoost 3000", respawn: 40,
    bundled: "“Speed up your downloads by 300%!” (it did not)",
    render: () => `
      <span class="logo" style="color:#c00;font-style:italic">⚡DownloadBoost<sup>3000</sup></span>
      <span class="lbl">Connection: 56.6 kbps</span>
      <span class="meter"><i style="width:92%;background:#c00"></i></span>
      <b class="blink" style="color:#c00">OPTIMIZE NOW!</b>
      ${btn("Boost!", "boost", "", I.down)}`,
  },
  {
    id: "sidefind", name: "SideFind Search Assistant", respawn: 35, place: "side",
    bundled: "the IE Search button, which now belongs to someone else",
  },
  {
    id: "coolbar", name: "Casino · Music · Shopping · Dating", respawn: 10, place: "bottom",
    bundled: "nothing. Nobody knows where this one came from.",
    render: () => `
      <span class="logo" style="color:#b00">★ SuperPortal</span>
      ${btn("Casino", "popup", 'data-pop="winner"', I.dice)}
      ${btn("Music", "radio", "", I.note)}
      ${btn("Shopping", "popup", 'data-pop="winner"', I.cart)}
      ${btn("Dating", "popup", 'data-pop="singles"', I.heart)}
      ${btn("Travel", "popup", 'data-pop="winner"')}
      ${btn("Pharmacy", "popup", 'data-pop="winner"')}
      <span class="muted">Remove this bar? Visit www.superportal-uninstall.biz (page not found)</span>`,
  },
];

// Bars that can be offered by an ActiveX prompt later, when the page asks you to "install" something.
const EXTRA_BARS = [
  {
    id: "coupon", name: "CouponCrusher Toolbar", respawn: 20,
    bundled: "the “Yes” button on a dialog whose other button also said Yes",
    render: () => `
      <span class="logo" style="color:#2a8a00">$ CouponCrusher</span>
      <span class="lbl">We found <b>0</b> coupons for this page!</span>
      ${btn("Show Deals", "popup", 'data-pop="winner"', I.cart)}`,
  },
  {
    id: "starfield", name: "StarField Mini Browser", respawn: 20,
    bundled: "a Security Warning you clicked through to make it go away",
    render: () => `
      <span class="logo" style="color:#4b2aa8">✦ StarField</span>
      ${srch("starfield", "", "Find", 100)}
      <span class="muted">Your homepage has been improved.</span>`,
  },
  {
    id: "bonzibar", name: "BuddyBonz Toolbar", respawn: 20,
    bundled: "your new best friend",
    render: () => `
      <span class="logo" style="color:#7b3fb8">BuddyBonz</span>
      ${btn("Tell me a joke", "buddy-joke")}
      ${btn("Sing a song", "buddy-sing", "", I.note)}
      ${btn("Check for updates", "say", 'data-msg="BuddyBonz has updated. BuddyBonz has installed 2 new friends."')}`,
  },
];
