// IE's right-click menu for a page, plus whatever each installed toolbar
// added to it. The more toolbars, the longer the menu.
import { ui, isOn } from "./state.svelte.js";
import { act, alertDlg, doSearch, openDialog, openPop, setBackground } from "./actions.js";

const selection = () => getSelection()?.toString().trim().slice(0, 60) || "";

const INJECTED = [
  ["gooble", () => ({ label: "Gooble Search", fn: () => doSearch("gooble", selection()) })],
  ["yahooey", () => ({ label: "Translate with Yahooey!", fn: () => alertDlg("Translation: “Click here to win a free MP3 player.”") })],
  ["msm", () => ({ label: "Highlight with MSM", fn: act.highlight })],
  ["jervis", () => ({ label: "Ask Jervis about this page", fn: () => doSearch("jervis", selection() || "what is this page") })],
  ["mws", () => ({ label: "Add Smileys to This Page", fn: () => openPop("screensaver") })],
  ["zingo", () => ({ label: "Zingo! Search", fn: () => doSearch("zingo", selection()) })],
  ["ebuy", () => ({ label: "Find This on eBuy", fn: () => doSearch("ebuy", selection()) })],
  ["alexxa", () => ({ label: "Alexxa: Sites Like This", fn: () => alertDlg("Sites like this one: this one.") })],
  ["dlboost", () => ({ label: "Download All Links with DownloadBoost", fn: () => alertDlg("Downloading 212 links at 56.6 kbps. Estimated time: 3 days.", { icon: "warn" }) })],
  ["coupon", () => ({ label: "Find Coupons for This Page", fn: () => openPop("winner") })],
  ["lyricz", () => ({ label: "Find Lyrics for This Page", fn: () => alertDlg("No lyrics found. This page does not rhyme.") })],
  ["bonzibar", () => ({ label: "Ask BuddyBonz", fn: act.buddyJoke })],
];

export function pageMenu() {
  const extra = INJECTED.filter(([id]) => isOn(id)).map(([, item]) => ({ ...item(), spons: true }));
  return [
    { label: "Back", dis: ui.idx <= 0, fn: act.back },
    { label: "Forward", dis: ui.idx >= ui.hist.length - 1, fn: act.fwd },
    "-",
    { label: "Save Background As...", fn: () => alertDlg("Saving requires the <b>SaveIt Pro Toolbar</b>.", { icon: "warn" }) },
    { label: "Set as Background", fn: setBackground },
    { label: "Copy Background" },
    "-",
    { label: "Select All", fn: () => getSelection().selectAllChildren(document.querySelector(".page")) },
    { label: "Paste", dis: true },
    "-",
    { label: "Create Shortcut", fn: () => alertDlg("A shortcut to this page was put on your desktop, next to the other 47 shortcuts.") },
    { label: "Add to Favorites...", fn: () => alertDlg("Added to Favorites. Also added: 4 sponsored favorites you didn't ask for.") },
    { label: "View Source", fn: () => openDialog("source", { html: document.querySelector(".page")?.innerHTML ?? "" }) },
    "-",
    { label: "Print...", fn: act.print },
    { label: "Refresh", fn: act.refresh },
    ...(extra.length ? ["-", ...extra] : []),
    "-",
    { label: "Properties", fn: () => alertDlg(`Address: ${ui.url}<br>Type: HTML Document<br>Connection: Not Encrypted<br>Toolbars watching this page: ${extra.length}`) },
  ];
}
