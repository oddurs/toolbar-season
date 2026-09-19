// Every bar in the rebar. `builtin` bars are IE's own; the rest arrived
// "free" with a screensaver, a codec, a file-sharing client or a smiley pack.
// `respawn` (seconds) is how long a closed bar waits before turning itself
// back on. `bundled` is where the user "agreed" to it.
//
// Third-party bars are plain data: a list of items that Band.svelte renders.
// Text items may be functions so they can read live state.

import { I } from "./icons.js";

const logo = (html, style = "") => ({ t: "logo", html, style });
const search = (engine, { ph = "", label = "Search", w = 150 } = {}) => ({ t: "search", engine, ph, label, w });
const btn = (label, act, arg, icon) => ({ t: "btn", label, act, arg, icon });
const say = (label, msg, icon) => btn(label, "say", msg, icon);
const pop = (label, kind, icon) => btn(label, "popup", kind, icon);
const txt = (html, cls = "lbl") => ({ t: "text", html, cls });
const meter = (pct, color = "#3fa82f") => ({ t: "meter", pct, color });
const ticker = text => ({ t: "ticker", text });
const sep = { t: "sep" };
const smileys = { t: "smileys" };
const icoInline = (svg, size = 16) => svg.replace("viewBox", `class="ico" style="width:${size}px;height:${size}px;vertical-align:-3px" viewBox`);

export const TOOLBARS = [
  { id: "menu", name: "Menu Bar", builtin: true, locked: true, cls: "menubar", component: "menu" },
  { id: "std", name: "Standard Buttons", builtin: true, component: "std" },
  { id: "addr", name: "Address Bar", builtin: true, cls: "address", component: "addr" },
  { id: "links", name: "Links", builtin: true, component: "links" },

  {
    id: "gooble", name: "Gooble Toolbar", respawn: 0, publisher: "Gooble Inc.",
    bundled: "installed on purpose, the one you actually wanted",
    items: s => [
      logo(`<span style="color:#1f52d6">G</span><span style="color:#d52b1e">o</span><span style="color:#f4b400">o</span><span style="color:#1f52d6">b</span><span style="color:#139a3e">l</span><span style="color:#d52b1e">e</span>`),
      search("gooble", { label: "Search Web" }),
      txt("PageRank"), meter(20),
      sep, txt(`${s.blocked} blocked`),
      say("AutoFill", "AutoFill has entered your name, address and phone number into 14 forms on this page."),
      say("Options", "There are no options. The toolbar is working as intended."),
    ],
  },
  {
    id: "yahooey", name: "Yahooey! Companion", respawn: 45,
    bundled: "Java Runtime Update 5.0 (the checkbox was already ticked)",
    items: () => [
      logo("Yahooey!", "color:#7b0099;font-style:italic;font-family:Georgia,serif"),
      search("yahooey", { label: "Search Web" }), sep,
      pop("Mail", "mail", I.mail),
      say("My Yahooey!", "My Yahooey! has been personalized. It now shows horoscopes for a sign you are not."),
      pop("Games", "monkey", I.dice),
      pop("Personals", "singles", I.heart),
      btn("Anti-Spy", "scan", null, I.shield),
      say("Pop-Up Blocker (0)", "The Yahooey! Pop-Up Blocker is fighting the Gooble Pop-Up Blocker. Neither is winning."),
    ],
  },
  {
    id: "msm", name: "MSM Search Toolbar", respawn: 60,
    bundled: "MSM Messenger 7.5 setup",
    items: () => [
      logo(`<span style="color:#f28b00">✿</span> msm`, "color:#11479e"),
      search("msm", { w: 130 }),
      btn("Highlight", "highlight", null, I.bolt),
      pop("Messenger (3 online)", "im", I.person),
      pop("Hotmoil", "mail", I.mail),
      say("Desktop Search", "Indexing your hard drive… 2% complete. Estimated time remaining: 11 days."),
    ],
  },
  {
    id: "jervis", name: "Ask Jervis Toolbar", respawn: 30,
    bundled: "a free version of a popular file-sharing program",
    items: () => [
      logo(`${icoInline(I.butler)} Ask Jervis`, "color:#b30000"),
      search("jervis", { ph: "Ask me anything, in a question", label: "Ask!", w: 190 }),
      say("Dictionary", "toolbar (n.): a horizontal strip of buttons that appears whether or not you asked for it."),
      btn("Encyclopedia", "search", { engine: "jervis", q: "what is a toolbar" }),
      say("58°F Cloudy", "It is 58°F and cloudy. It is also 72°F and sunny, according to the HotBarr toolbar.", I.sun),
      say("Zip Code Finder", "Your zip code is 90210. (Jervis guessed.)"),
    ],
  },
  {
    id: "mws", name: "MyWebSurch · Smiley Centrale", respawn: 12,
    bundled: "“FREE Smileys for Messenger & Email!!” (you clicked one ad, once)",
    items: () => [
      logo(`My<span style="color:#ff7a00">Web</span>Surch`, "color:#1d5bbf"),
      search("mws", { w: 120 }), sep,
      txt(`<b style="color:#c60">Smiley Centrale</b>`),
      smileys,
      pop("Popular Screensavers", "screensaver"),
      btn("Cursor Mania", "cursor"),
      say("Weather", "Weather feature requires the WeatherBugg toolbar. Installing…"),
    ],
  },
  {
    id: "hotbarr", name: "HotBarr", respawn: 20,
    bundled: "a “skin” for your toolbar, which was itself a toolbar",
    items: () => [
      logo("HotBarr", "background:linear-gradient(#ffcc00,#e04b1d);-webkit-background-clip:text;background-clip:text;color:transparent;font-style:italic"),
      btn("Skins", "skin"),
      txt(`${icoInline(I.sun, 14)} 72°F Sunny`),
      ticker("*** HOT DEALS *** 50% off ink cartridges *** Refinance NOW at 3.9%!!! *** Free ringtones for your phone *** Lose 30 lbs in 30 days *** You may already be a WINNER *** "),
      pop("Shopping", "winner", I.cart),
    ],
  },
  {
    id: "wbug", name: "WeatherBugg", respawn: 25,
    bundled: "the MyWebSurch “Weather” button",
    items: () => [
      logo(`${icoInline(I.bug, 15)} WeatherBugg`, "color:#1d7f22"),
      txt("<b>61°F</b> Live from Springfield Elementary"),
      say(`<b class="blink" style="color:#c00">⚠ WEATHER ALERT (1)</b>`, "NATIONAL WEATHER ALERT: A light breeze has been detected somewhere in the continental United States."),
      pop("5-Day Forecast", "winner"),
      txt("Sponsored by Insta-Loan Direct", "muted"),
    ],
  },
  {
    id: "aoll", name: "America Offline Toolbar", respawn: 50,
    bundled: "a CD that came in a cereal box (1,025 free hours!)",
    items: () => [
      logo("▲ America Offline", "color:#0b3d91"),
      search("aoll", { w: 110 }),
      btn("Radio", "radio", null, I.note),
      pop("Buddy List (0)", "im", I.person),
      say("You've Got Mail!", "You have 1 new message: “Re: re: RE: FW: fw: Funny cat!!!!”", I.mail),
      say("Keyword", "Please enter your Keyword. Keywords are like web addresses, but worse."),
    ],
  },
  {
    id: "zingo", name: "Zingo Search Assistant", respawn: 15,
    bundled: "a codec pack needed to watch one (1) video of a dancing hamster",
    items: () => [
      logo("zingo", "color:#0a8a8a"), txt("Search Assistant", "muted"),
      search("zingo", { label: "Zingo!", w: 110 }),
      txt(`<span class="pill" style="background:#ffe8a0">Free Games!</span> <span class="pill" style="background:#c8f0c8">Free Ringtones!</span> <span class="pill" style="background:#f7c8e0">Free Screensavers!</span>`),
      txt("This program is FREE because of ads · 1,204 ads shown today", "muted"),
    ],
  },
  {
    id: "ebuy", name: "eBuy Toolbar", respawn: 70,
    bundled: "you won a PalmPilot for $41 once",
    items: () => [
      logo(`<span style="color:#e53238">e</span><span style="color:#0064d2">B</span><span style="color:#f5af02">u</span><span style="color:#86b817">y</span>`),
      search("ebuy", { w: 110 }),
      say("My eBuy", "You are watching 1 item: Pre-owned Tamagotchi (cracked). Ends in 0d 0h 4m."),
      txt(`<b class="blink" style="color:#c00">Alert: 3 items ending soon!</b>`),
      say("Account Guard", "Account Guard: this site is green. Probably. We think.", I.shield),
    ],
  },
  {
    id: "alexxa", name: "Alexxa Toolbar", respawn: 90,
    bundled: "“See site info!”, which also sent every URL you visited home",
    items: () => [
      logo("alexxa", "color:#555"),
      txt("Traffic Rank: <b>14,203,997</b>"), meter(4, "#2c64c8"),
      btn("Related Links ▾", "favmenu"),
      say("Info", "People who visited this site also visited: the site you were on before this one."),
    ],
  },
  {
    id: "dlboost", name: "DownloadBoost 3000", respawn: 40,
    bundled: "“Speed up your downloads by 300%!” (it did not)",
    items: () => [
      logo("⚡DownloadBoost<sup>3000</sup>", "color:#c00;font-style:italic"),
      txt("Connection: 56.6 kbps"), meter(92, "#c00"),
      txt(`<b class="blink" style="color:#c00">OPTIMIZE NOW!</b>`),
      btn("Boost!", "boost", null, I.down),
    ],
  },
  {
    id: "sidefind", name: "SideFind Search Assistant", respawn: 35, place: "side",
    bundled: "the IE Search button, which now belongs to someone else",
  },
  {
    id: "coolbar", name: "Casino · Music · Shopping · Dating", respawn: 10, place: "bottom",
    bundled: "nothing. Nobody knows where this one came from.",
    items: () => [
      logo("★ SuperPortal", "color:#b00"),
      pop("Casino", "winner", I.dice), btn("Music", "radio", null, I.note),
      pop("Shopping", "winner", I.cart), pop("Dating", "singles", I.heart),
      pop("Travel", "winner"), pop("Pharmacy", "winner"),
      txt("Remove this bar? Visit www.superportal-uninstall.biz (page not found)", "muted"),
    ],
  },
];

// Bars that arrive later: through an ActiveX prompt, or all by themselves.
export const EXTRA_BARS = [
  {
    id: "coupon", name: "CouponCrusher Toolbar", respawn: 20,
    bundled: "the “Yes” button on a dialog whose other button also said Yes",
    items: () => [logo("$ CouponCrusher", "color:#2a8a00"), txt("We found <b>0</b> coupons for this page!"), pop("Show Deals", "winner", I.cart)],
  },
  {
    id: "starfield", name: "StarField Mini Browser", respawn: 20,
    bundled: "a Security Warning you clicked through to make it go away",
    items: () => [logo("✦ StarField", "color:#4b2aa8"), search("starfield", { label: "Find", w: 100 }), txt("Your homepage has been improved.", "muted")],
  },
  {
    id: "bonzibar", name: "BuddyBonz Toolbar", respawn: 20,
    bundled: "your new best friend",
    items: () => [
      logo("BuddyBonz", "color:#7b3fb8"),
      btn("Tell me a joke", "buddyJoke"), btn("Sing a song", "buddySing", null, I.note),
      say("Check for updates", "BuddyBonz has updated. BuddyBonz has installed 2 new friends."),
    ],
  },
  {
    id: "speeddr", name: "PC Speed Doctor", respawn: 25,
    bundled: "a pop-up that said your PC was slow (it was, because of the pop-ups)",
    items: () => [
      logo("+ PC Speed Doctor", "color:#c00"),
      txt(`Your PC is running at <b class="blink" style="color:#c00">34%</b> speed`), meter(34, "#c00"),
      btn("FIX NOW ($29.95)", "scan", null, I.shieldX),
    ],
  },
  {
    id: "lyricz", name: "LyricZilla Toolbar", respawn: 25,
    bundled: "you looked up the words to one pop-punk song",
    items: () => [logo("♪ LyricZilla", "color:#e0306a"), search("lyricz", { ph: "Song or artist", label: "Find Lyrics", w: 120 }), txt("Now playing: nothing. Lyrics found: 0. Ads found: 3.", "muted")],
  },
  {
    id: "peoplepage", name: "PeoplePage Chat Bar", respawn: 25,
    bundled: "a checkbox labelled “Enhance my web experience”",
    items: s => [logo("PeoplePage", "color:#0a7ab8"), txt(`<b>${s.peopleCount}</b> people are on this page right now!`), pop("Chat with them", "im", I.person)],
  },
];

// Offered only when the page is nearly gone. Never auto-installed.
EXTRA_BARS.push({
  id: "screenspace", name: "ScreenSpace Toolbar", respawn: 30, manual: true,
  bundled: "it promised to make more room for web pages",
  items: s => [
    logo("⇕ ScreenSpace", "color:#1d7f22"),
    txt(`Now giving you <b>${Math.max(1, s.viewPct)}%</b> more room!*`),
    txt("*Room not included. Requires ScreenSpace Pro.", "muted"),
  ],
});

export const ALL_BARS = [...TOOLBARS, ...EXTRA_BARS];
export const byId = id => ALL_BARS.find(b => b.id === id);
