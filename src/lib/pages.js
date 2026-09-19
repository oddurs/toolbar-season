// The web, circa October 2005: turns a URL into a page component.
import Portal from "../components/pages/Portal.svelte";
import Results from "../components/pages/Results.svelte";
import Kev from "../components/pages/Kev.svelte";
import Forum from "../components/pages/Forum.svelte";
import CannotDisplay from "../components/pages/CannotDisplay.svelte";
import Offline from "../components/pages/Offline.svelte";
import WindowsUpdate from "../components/pages/WindowsUpdate.svelte";
import Synergy from "../components/pages/Synergy.svelte";
import Hamsters from "../components/pages/Hamsters.svelte";
import { hijacker } from "./state.svelte.js";

export const ENGINES = {
  gooble: "search.gooble.com", yahooey: "search.yahooey.com", msm: "search.msm.com",
  jervis: "web.askjervis.com", mws: "search.mywebsurch.com", aoll: "search.americaoffline.com",
  zingo: "search.zingo.biz", ebuy: "search.ebuy.com", starfield: "find.starfield.biz",
  lyricz: "lyrics.lyriczilla.biz", sidefind: "results.sidefind.biz", portal: "www.home-search-portal.biz",
};

// Whatever engine you asked for, the installed hijacker answers.
export function searchUrl(engine, q) {
  const host = ENGINES[hijacker() || engine] || ENGINES.portal;
  return `http://${host}/results?q=${encodeURIComponent(q).replace(/%20/g, "+")}`;
}

// Typed text becomes a URL, or an "autosearch" that a hijacker now owns.
export function normalize(raw, current) {
  const u = raw.trim();
  if (!u) return current;
  if (/^(about:|https?:\/\/)/i.test(u)) return u;
  if (u.startsWith("search:")) return searchUrl("portal", u.slice(7));
  if (/^[\w-]+(\.[\w-]+)+/.test(u)) return "http://" + u + (u.includes("/") ? "" : "/");
  return searchUrl("portal", u);
}

const query = u => decodeURIComponent((u.split("q=")[1] || "").replace(/\+/g, " "));

const ROUTES = [
  { match: u => /^http:\/\/[^/]+\/results\?q=/.test(u), page: Results, title: u => `${query(u)} - Search Results`, props: u => ({ q: query(u), host: u.split("/")[2] }) },
  { match: u => /^http:\/\/(www\.)?home-search-portal\.biz/.test(u), page: Portal, title: "Home Search Portal - Your Start Page for the Internet!!" },
  { match: u => /^http:\/\/(www\.)?geocitiez\.com/.test(u), page: Kev, title: "~*~ KeV's AwEsOmE HoMePaGe ~*~" },
  { match: u => u.startsWith("http://forums.techguyz.fake"), page: Forum, title: "HELP!!! toolbars wont go away - TechGuyz Forums" },
  { match: u => /^http:\/\/(www\.|v5\.)?windowsupdate\.fake/.test(u), page: WindowsUpdate, title: "Microsoft Windows Update" },
  { match: u => /^http:\/\/(www\.)?synergyvision-solutions\.fake/.test(u), page: Synergy, title: "SynergyVision Solutions, Inc. :: Welcome ::" },
  { match: u => /^http:\/\/(www\.)?hamsterparty\.fake/.test(u), page: Hamsters, title: "THE HAMSTER PARTY!!!" },
  { match: u => u === "offline:", page: Offline, title: "Web page unavailable while offline" },
  { match: u => u === "about:blank", page: null, title: "about:blank" },
];

// Unknown sites: IE6 says it can't find them, unless a hijacker is installed,
// in which case you get "helpful" search results instead.
export function resolve(url) {
  let r = ROUTES.find(r => r.match(url));
  if (!r && hijacker() && url.startsWith("http")) {
    url = searchUrl(hijacker(), url.split("/")[2].replace(/^www\./, ""));
    r = ROUTES[0];
  }
  if (!r) return { url, title: "Cannot find server", page: CannotDisplay, props: { url } };
  return {
    url,
    title: typeof r.title === "function" ? r.title(url) : r.title,
    page: r.page,
    props: r.props?.(url) || {},
  };
}
