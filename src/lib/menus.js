// The menu bar. Items: { label, key, check, dis, spons, fn, items }, or "-" for a separator.
import { ui, isOn } from "./state.svelte.js";
import { act, go, alertDlg, openDialog, openPop, showInfo, popupInfo, crash, toggleBar, toolbarMenu, favoritesMenu, pick } from "./actions.js";

export const MENUS = {
  File: () => [
    { label: "New", items: [{ label: "Window", key: "Ctrl+N", fn: () => openPop(pick(["winner", "screensaver"])) }, { label: "Message" }, { label: "Post" }, { label: "Contact" }, { label: "Internet Call" }] },
    { label: "Open...", key: "Ctrl+O", fn: () => { const u = prompt("Type the Internet address of a document or folder, and Internet Explorer will open it for you.", "http://"); if (u) go(u); } },
    { label: "Edit with Notepad", dis: true },
    { label: "Save", key: "Ctrl+S", dis: true },
    { label: "Save As...", fn: () => alertDlg("Saving this page requires the <b>SaveIt Pro Toolbar</b>.", { icon: "warn" }) },
    "-", { label: "Page Setup..." }, { label: "Print...", key: "Ctrl+P", fn: act.print }, { label: "Print Preview..." },
    "-", { label: "Send", items: [{ label: "Page by E-mail..." }, { label: "Link by E-mail..." }, { label: "Shortcut to Desktop" }] },
    { label: "Import and Export..." }, "-", { label: "Properties" },
    { label: "Work Offline", fn: () => showInfo("You are working offline. The toolbars are not.", null, "info") },
    { label: "Close", fn: crash },
  ],
  Edit: () => [
    { label: "Cut", key: "Ctrl+X", dis: true }, { label: "Copy", key: "Ctrl+C" }, { label: "Paste", key: "Ctrl+V", dis: true }, "-",
    { label: "Select All", key: "Ctrl+A", fn: () => getSelection().selectAllChildren(document.querySelector(".page")) }, "-",
    { label: "Find (on This Page)...", key: "Ctrl+F", fn: act.highlight },
  ],
  View: () => [
    { label: "Toolbars", items: toolbarMenu },
    { label: "Status Bar", check: ui.showStatus, fn: () => (ui.showStatus = !ui.showStatus) },
    { label: "Explorer Bar", items: () => [
      { label: "Search", key: "Ctrl+E", check: ui.sideMode === "search" || (!ui.sideMode && isOn("sidefind")), fn: act.sidebar },
      { label: "Favorites", key: "Ctrl+I" }, { label: "Media" },
      { label: "History", key: "Ctrl+H", check: ui.sideMode === "history", fn: act.history },
      { label: "SideFind", check: isOn("sidefind"), fn: () => toggleBar("sidefind") },
    ] },
    "-",
    { label: "Go To", items: [{ label: "Back", key: "Alt+Left", fn: act.back }, { label: "Forward", key: "Alt+Right", fn: act.fwd }, "-", { label: "Home Page", key: "Alt+Home", fn: act.home }] },
    { label: "Stop", key: "Esc", fn: act.stop }, { label: "Refresh", key: "F5", fn: act.refresh }, "-",
    { label: "Text Size", items: () => ["Largest", "Larger", "Medium", "Smaller", "Smallest"].map((s, i) => { const px = [20, 16, 13, 11, 9][i]; return { label: s, check: ui.textSize === px, fn: () => (ui.textSize = px) }; }) },
    { label: "Encoding", items: [{ label: "Auto-Select" }, { label: "Western European (Windows)", check: true }, { label: "Unicode (UTF-8)" }] },
    "-", { label: "Source", fn: () => openDialog("source", { html: document.querySelector(".page")?.innerHTML ?? "" }) },
    { label: "Privacy Report..." },
    { label: "Full Screen", key: "F11", fn: act.full },
  ],
  Favorites: favoritesMenu,
  Tools: () => [
    { label: "Mail and News", items: [{ label: "Read Mail", fn: act.mail }, { label: "New Message..." }] },
    { label: "Pop-up Blocker", items: [{ label: "Turn Off Pop-up Blocker", fn: () => { popupInfo(); alertDlg("The Pop-up Blocker has been turned off. You will not notice a difference."); } }, { label: "Pop-up Blocker Settings..." }] },
    { label: "Manage Add-ons...", fn: () => openDialog("addons") },
    { label: "Add or Remove Programs...", fn: () => openDialog("arp") },
    { label: "Synchronize..." },
    { label: "Windows Update", fn: () => go("http://v5.windowsupdate.fake/") }, "-",
    { label: "SpyScrub SE Scan...", fn: act.scan },
    { label: "Gooble Toolbar Options", dis: !isOn("gooble") },
    { label: "Messenger" }, { label: "Sun Java Console" }, "-",
    { label: "Internet Options...", fn: () => openDialog("options") },
  ],
  Help: () => [
    { label: "Contents and Index" },
    { label: "Tip of the Day", fn: () => alertDlg("Did you know? You can right-click any toolbar to see how many toolbars you have.") },
    { label: "For Netscape Users", fn: () => alertDlg("Welcome, Netscape user. Your old toolbars have been imported, too.") },
    { label: "Online Support", fn: () => go("http://forums.techguyz.fake/showthread.php?t=41742") },
    { label: "Send Feedback" }, "-",
    { label: "Why are there so many toolbars?", fn: act.why },
    { label: "About Internet Explorer", fn: () => openDialog("about") },
  ],
};
