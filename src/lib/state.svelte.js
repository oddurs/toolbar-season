// One reactive object holds the whole browser. Components read it directly;
// actions.js is the only place that changes it.
import { TOOLBARS, ALL_BARS, byId } from "./toolbars.js";

export const HOME_URL = "http://www.home-search-portal.biz/?aff=2231&src=hp_hijack";
export const KEV_URL = "http://www.geocitiez.com/Area51/Nebula/4417/";
export const HOTMOIL_URL = "https://login.hotmoil.com/ppsecure/post.srf?id=2";
export const INBOX_URL = "http://by12fd.bay12.hotmoil.msm.com/cgi-bin/HoTMaiL";
export const FORUM_URL = "http://forums.techguyz.fake/showthread.php?t=41742";
export const UPDATE_URL = "http://v5.windowsupdate.fake/";
export const SYNERGY_URL = "http://www.synergyvision-solutions.fake/";
export const HAMSTER_URL = "http://www.hamsterparty.fake/";
// Sites IE knows about, for AutoComplete.
export const KNOWN_URLS = [HOME_URL, KEV_URL, FORUM_URL, UPDATE_URL, SYNERGY_URL, HAMSTER_URL, HOTMOIL_URL];

// ?test turns off the random parts (ads, pop-ups, self-installs, tips) and
// makes loading instant, so the end-to-end tests are repeatable.
export const TEST = typeof location !== "undefined" && new URLSearchParams(location.search).has("test");

export const ui = $state({
  order: TOOLBARS.map(b => b.id), // rebar order, including bars not yet installed
  on: Object.fromEntries(TOOLBARS.map(b => [b.id, true])),
  installed: Object.fromEntries(TOOLBARS.map(b => [b.id, true])),
  fresh: {}, // bars that just (re)appeared, for the yellow flash
  skins: {}, // HotBarr skin per band

  home: HOME_URL,
  url: "",
  title: "Microsoft Internet Explorer",
  route: null, // { page, props }
  hist: [],
  idx: -1,
  loading: false,
  progress: 0,
  statusMsg: "Done",

  sideMode: null, // null | "history" | "search"
  showStatus: true,
  full: false,
  max: false,
  min: false,
  crashed: false,
  highlight: false,
  sparkle: false,
  textSize: 13,

  blocked: 0,
  peopleCount: 37,
  kevCount: 4417,
  kevNote: "",
  viewPct: 0,

  connected: false,
  visited: {},
  tip: false, // first-visit balloon
  pageErrors: false,
  errors: [], // script errors on the current page
  hideNonsecure: false,
  certified: false,
  uninstalled: {}, // removed through Add or Remove Programs
  muted: false,
  squeezeOffered: false,
  cleanSince: null, // when the last third-party toolbar went away
  cleanFor: 0,
  bestClean: 0,

  info: null, // { text, icon, action }
  menu: null, // { x, y, items, owner }
  dialogs: [], // { id, kind, props, x, y, z, onClose }
  buddy: null, // { line } once summoned; line null hides the bubble
});

export const isOn = id => !!ui.on[id];
export const isInstalled = id => !!ui.installed[id];
export const bars = () => ui.order.map(byId);
export const adware = () => bars().filter(b => !b.builtin && b.id !== "gooble" && isOn(b.id));
export const hijacker = () => ["mws", "zingo", "sidefind", "starfield"].find(isOn);
export const toolbarCount = () => ALL_BARS.filter(b => !b.builtin && isOn(b.id)).length;
