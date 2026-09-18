// The web, circa October 2005, as seen through whatever space is left.

const HOME_URL = "http://www.home-search-portal.biz/?aff=2231&src=hp_hijack";
const KEV_URL = "http://www.geocitiez.com/Area51/Nebula/4417/";
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const ENGINES = {
  gooble: "search.gooble.com", yahooey: "search.yahooey.com", msm: "search.msm.com",
  jervis: "web.askjervis.com", mws: "search.mywebsurch.com", aoll: "search.americaoffline.com",
  zingo: "search.zingo.biz", ebuy: "search.ebuy.com", starfield: "find.starfield.biz",
  sidefind: "results.sidefind.biz", portal: "www.home-search-portal.biz",
};

const PAGES = [
  {
    match: u => u.startsWith("http://www.home-search-portal.biz") && !u.includes("/results"),
    title: "Home Search Portal - Your Start Page for the Internet!!",
    html: () => `
      <div style="background:linear-gradient(#ffe066,#ffb000);padding:8px 12px;border-bottom:3px solid #c00;font-family:Arial,sans-serif">
        <b style="font-size:22px;color:#c00;font-style:italic">Home Search Portal</b>
        <span style="color:#600;font-size:11px"> · Your homepage was <u>automatically upgraded</u> for a better Internet experience!</span>
      </div>
      <div style="padding:10px 12px;font-family:Arial,sans-serif;font-size:12px">
        <form data-portal style="margin:0 0 10px">
          <input name="q" style="width:260px;font-size:13px" aria-label="Search the Internet"> <button>Search the Internet!</button>
        </form>
        <table cellpadding="4" style="border-collapse:collapse;font-size:12px"><tr>
          <td style="border:1px solid #fc0;background:#fffbe0;vertical-align:top">
            <b style="color:#c00">HOT Categories</b><br>
            <a data-go="search:Casino">Online Casino</a> · <a data-go="search:Ringtones">Ringtones</a> · <a data-go="search:Mortgage">Mortgage Rates</a><br>
            <a data-go="search:Smileys">Free Smileys</a> · <a data-go="search:Screensavers">Free Screensavers</a> · <a data-go="search:Dating">Singles</a>
          </td>
          <td style="border:1px solid #9cf;background:#eef6ff;vertical-align:top">
            <b style="color:#036">Popular Searches</b><br>
            <a data-go="search:how to remove toolbars">how to remove toolbars</a><br>
            <a data-go="search:why is my computer slow">why is my computer slow</a><br>
            <a data-go="search:homepage keeps changing">homepage keeps changing</a>
          </td>
          <td style="border:2px dashed #c00;text-align:center;vertical-align:top;cursor:pointer" data-pop="winner">
            <b class="blink" style="color:#c00">CONGRATULATIONS!!</b><br>You are our <b>1,000,000th</b> visitor!<br><u style="color:#00c">Click here to claim</u>
          </td>
        </tr></table>
        <p style="margin:10px 0 4px">Also visit: <a data-go="${KEV_URL}">Kev's Awesome Homepage</a> · <a data-go="http://www.windowsupdate.fake/">Windows Update</a> · <a data-go="about:blank">about:blank</a></p>
        <p style="color:#888;font-size:10px">To change your homepage, go to Tools › Internet Options. (It won't work.) © 2005 Home Search Portal Ltd., a subsidiary of a subsidiary.</p>
      </div>`,
  },
  {
    match: u => /^http:\/\/[^/]+\/(results|search)\?q=/.test(u),
    title: u => `${decodeURIComponent(u.split("q=")[1] || "").replace(/\+/g, " ")} - Search Results`,
    html: u => {
      const host = u.split("/")[2];
      const q = decodeURIComponent((u.split("q=")[1] || "").replace(/\+/g, " "));
      const brand = Object.entries(ENGINES).find(([, h]) => h === host)?.[0] || "portal";
      const sponsor = [
        ["Cheap " + q + " - Compare Prices!", "Find great deals on " + q + ". Shop, compare and save!"],
        [q + " at eBuy", "Looking for " + q + "? Find exactly what you want today."],
        ["FREE " + q + " Download", "100% free, no spyware* (*some spyware)."],
        ["Singles Interested in " + q, "Meet local singles who also searched for " + q + "."],
        ["Remove " + q + " Now - Free Scan", "Your PC may be infected with " + q + ". Run a free scan!"],
      ];
      return `
        <div style="padding:8px 12px;font-family:Arial,sans-serif;font-size:13px">
          <div style="border-bottom:1px solid #36c;padding-bottom:4px;margin-bottom:6px">
            <b style="font-size:18px;color:#36c">${esc(host)}</b>
            <span style="font-size:11px;color:#555"> Results 1 - 10 of about 48,200,000 for <b>${esc(q)}</b>. <i>Search results provided by a different search engine than the one you used.</i></span>
          </div>
          <div style="background:#fff8dc;border:1px solid #f0e0a0;padding:4px 8px;margin-bottom:8px">
            <div style="font-size:10px;color:#888">Sponsored Links</div>
            ${sponsor.map(([t, d], i) => `<div style="margin:5px 0"><a data-pop="${["winner", "winner", "screensaver", "singles", "scare"][i]}"><b>${esc(t)}</b></a><br><span style="font-size:12px">${esc(d)}</span><br><span style="color:#080;font-size:11px">www.${esc(q.toLowerCase().replace(/\W+/g, "")) || "stuff"}-deals${i}.biz</span></div>`).join("")}
          </div>
          <div style="font-size:10px;color:#888">Web Results</div>
          <p style="margin:4px 0"><a data-go="${KEV_URL}"><b>Kev's Homepage</b> - ${esc(q)} and other cool stuff</a><br><span style="font-size:12px">...welcome to my page!!! it has <b>${esc(q)}</b> and also my cats. sign my guestbook...</span></p>
          <p style="margin:4px 0"><a data-go="http://www.${esc(q.toLowerCase().replace(/\W+/g, "")) || "stuff"}.com/">${esc(q)} - Official Site</a><br><span style="font-size:12px">This result was bumped to the bottom by ${esc(brand)} Sponsored Results™.</span></p>
        </div>`;
    },
  },
  {
    match: u => u.startsWith("http://www.geocitiez.com"),
    title: "~*~ KeV's AwEsOmE HoMePaGe ~*~",
    html: () => `
      <div style="background:#000 url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22%3E%3Ccircle cx=%225%22 cy=%227%22 r=%22.8%22 fill=%22white%22/%3E%3Ccircle cx=%2228%22 cy=%2222%22 r=%22.6%22 fill=%22white%22/%3E%3Ccircle cx=%2216%22 cy=%2235%22 r=%221%22 fill=%22yellow%22/%3E%3C/svg%3E');color:#0f0;font-family:'Comic Sans MS','Comic Sans',cursive;text-align:center;padding:10px;min-height:100%;box-sizing:border-box">
        <marquee style="color:#ff0;font-size:20px;font-weight:bold">~*~ WeLcOmE tO kEv'S hOmEpAgE ~*~</marquee>
        <p style="color:#f0f">best viewed in Internet Explorer at 800x600 · <span class="blink" style="color:#f00">UNDER CONSTRUCTION</span></p>
        <p>
          <a data-go="kev:guestbook" style="color:#0ff">Sign My Guestbook!!</a> ·
          <a data-go="kev:cats" style="color:#0ff">My Cats</a> ·
          <a data-go="kev:links" style="color:#0ff">Kool Links</a> ·
          <a data-go="kev:midi" style="color:#0ff">MIDI Jukebox</a>
        </p>
        <p id="kev-out" style="color:#fff;min-height:1.3em"></p>
        <p style="font-family:'Courier New',monospace">You are visitor #
          <span style="background:#222;color:#f00;padding:1px 4px;border:1px inset #555" id="kev-count">004417</span></p>
        <p style="color:#888;font-size:11px">This site is a member of the <a data-go="http://www.webring.fake/" style="color:#0ff">Cool Kids Webring</a> · [<a data-go="http://www.webring.fake/" style="color:#0ff">&lt;&lt; prev</a> | <a data-go="http://www.webring.fake/" style="color:#0ff">next &gt;&gt;</a>]</p>
        <p style="font-size:10px;color:#666">© 1999-2005 kev · last updated: 3 years ago</p>
      </div>`,
  },
  {
    match: u => u === "about:blank",
    title: "about:blank",
    html: () => ``,
  },
];

const KEV = {
  guestbook: `Guestbook entry #412: “cool site!!! check out mine” – xXDarkAngelXx. Entry #413: “Buy cheap meds online” – (spam bot)`,
  cats: `Mittens, Mr. Whiskers, and Sir Fluffington III. Images not loaded (bandwidth limit exceeded).`,
  links: `Kool Links: Homestar · Hamster Dance · Zombo · All Your Base. (3 of 4 are 404 now.)`,
  midi: `♪ Now playing: “My Heart Will Go On (Flute Mix).mid” ♪ There is no pause button.`,
};

// Anything we don't know about: IE6 says it can't be displayed, unless a
// search hijacker is installed, in which case it "helpfully" searches instead.
function cannotDisplay(u) {
  return {
    title: "Cannot find server",
    html: `
      <div style="padding:14px 18px;font:11px Tahoma,sans-serif;max-width:560px">
        <div style="display:flex;gap:10px;align-items:center">${I.info.replace("viewBox", 'style="width:32px;height:32px;flex:none" viewBox')}
          <h1 style="font:bold 17px Tahoma,sans-serif;margin:0">The page cannot be displayed</h1></div>
        <p>The page you are looking for is currently unavailable. The Web site might be experiencing technical difficulties, or you may need to adjust your browser settings.</p>
        <hr style="border:0;border-top:1px solid #ccc">
        <p>Please try the following:</p>
        <ul style="padding-left:18px">
          <li>Click the <a data-act="refresh">Refresh</a> button, or try again later.</li>
          <li>If you typed the page address in the Address bar, make sure that it is spelled correctly.</li>
          <li>To check your connection settings, click the <b>Tools</b> menu, and then click <b>Internet Options</b>.</li>
          <li>Click <a data-act="back">Back</a> to try another link.</li>
        </ul>
        <p style="color:#555">Cannot find server or DNS Error<br>Internet Explorer</p>
        <p style="color:#555;font-size:10px">${esc(u)}</p>
      </div>`,
  };
}
