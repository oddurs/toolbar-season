// End-to-end tests. `?test` switches off the random ads, pop-ups and
// self-installs, and makes loading instant, so these are repeatable.
import { test, expect } from "@playwright/test";

const title = page => page.locator(".win > .titlebar .ttl");
const band = (page, id) => page.locator(`.band[data-bar="${id}"]`);

async function connect(page) {
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.goto("/?test");
  await page.getByRole("dialog", { name: "Connect Dial-up Connection" }).getByRole("button", { name: "Dial" }).click();
  await expect(title(page)).toContainText("Home Search Portal");
  return errors;
}

test("starts offline, dials in, and lands on the hijacked home page", async ({ page }) => {
  const errors = await connect(page);
  await expect(page.locator(".st-zone")).toHaveText("Internet");
  await expect(page.locator(".rebar .band")).toHaveCount(16);
  expect(errors).toEqual([]);
});

test("Cancel on the dial-up prompt shows the offline page", async ({ page }) => {
  await page.goto("/?test");
  await page.getByRole("dialog", { name: "Connect Dial-up Connection" }).getByRole("button", { name: "Cancel" }).click();
  await expect(page.locator(".cannot h1")).toHaveText("Web page unavailable while offline");
});

test("closing a toolbar removes it and unchecks it in View › Toolbars", async ({ page }) => {
  await connect(page);
  await page.getByRole("button", { name: "Close Yahooey! Companion" }).click();
  await expect(band(page, "yahooey")).toHaveCount(0);
  await page.locator('.mi[data-menu="View"]').click();
  // Clicking (or tapping) an item with a submenu opens it, so this works on phones too.
  await page.locator(".menu .it", { hasText: "Toolbars" }).click();
  const item = page.locator(".menu").last().locator(".it", { hasText: "Yahooey! Companion" });
  await expect(item.locator(".chk")).toHaveCount(0);
});

test("address bar AutoComplete, navigation and Back", async ({ page }) => {
  await connect(page);
  await page.locator("#addr").fill("");
  await page.locator("#addr").pressSequentially("hams");
  await expect(page.locator(".ac-item").first()).toHaveText("http://www.hamsterparty.fake/");
  await expect(page.locator(".ac-item.spons")).toContainText("Search for “hams”");
  await page.locator("#addr").press("ArrowDown");
  await page.locator("#addr").press("Enter");
  await expect(title(page)).toContainText("THE HAMSTER PARTY");
  await page.getByRole("button", { name: "Back" }).click();
  await expect(title(page)).toContainText("Home Search Portal");
});

test("searches from any toolbar land on the installed hijacker", async ({ page }) => {
  await connect(page);
  const box = page.getByLabel("MSM Search Toolbar search");
  await box.fill("toolbars");
  await box.press("Enter");
  await expect(page.locator("#addr")).toHaveValue("http://search.mywebsurch.com/results?q=toolbars");
});

test("unknown sites are hijacked, until the hijackers are gone", async ({ page }) => {
  await connect(page);
  await page.locator("#addr").fill("www.example.com");
  await page.locator("#addr").press("Enter");
  await expect(title(page)).toContainText("Search Results");
});

test("SpyScrub removes every toolbar except the one you chose", async ({ page }) => {
  await connect(page);
  await page.locator('.mi[data-menu="Tools"]').click();
  await page.locator(".menu .it", { hasText: "SpyScrub" }).click();
  const remove = page.getByRole("button", { name: "Remove All" });
  await expect(remove).toBeEnabled({ timeout: 15000 });
  await remove.click();
  // IE's own four bars, plus Gooble.
  await expect(page.locator(".rebar .band")).toHaveCount(5);
  await expect(band(page, "gooble")).toHaveCount(1);
  await expect(page.locator(".st-clean")).toContainText("Toolbar-free for");
});

test("uninstalling goes through the survey and the retention offer", async ({ page }) => {
  await connect(page);
  await page.keyboard.press("Alt+KeyT");
  await page.locator(".menu .it", { hasText: "Add or Remove Programs" }).click();
  await page.locator(".arp-row", { hasText: "Zingo" }).click();
  await page.locator(".arp-row.sel").getByRole("button", { name: "Remove" }).click();
  const wizard = page.getByRole("dialog", { name: "Zingo Search Assistant Uninstall" });
  await wizard.getByRole("button", { name: "Yes" }).click();
  await expect(wizard.getByRole("button", { name: "Next >" })).toBeDisabled();
  await wizard.getByText("I have too many toolbars").click();
  await wizard.getByRole("button", { name: "Next >" }).click();
  await expect(wizard.locator(".xpbtn.def")).toHaveText("Keep Zingo Search Assistant (Recommended)");
  await wizard.getByRole("button", { name: "no thanks, uninstall anyway" }).click();
  await wizard.getByRole("button", { name: "Finish" }).click();
  await expect(band(page, "zingo")).toHaveCount(0);
  await expect(page.locator(".arp-row", { hasText: "Zingo" })).toHaveCount(0);
});

test("the File Download flow installs a toolbar", async ({ page }) => {
  await connect(page);
  await page.locator("#addr").fill("synergyvision-solutions.fake");
  await page.locator("#addr").press("Enter");
  await page.getByRole("button", { name: "[ SKIP INTRO ]" }).click();
  await page.getByRole("button", { name: "Get Flash Player" }).click();
  const ask = page.getByRole("dialog", { name: "File Download - Security Warning" });
  await expect(ask).toContainText("flashplayer7_install_ie.exe");
  await ask.getByRole("button", { name: "Save", exact: true }).click();
  await page.getByRole("dialog", { name: "Download complete" }).getByRole("button", { name: "Run" }).click();
  const warning = page.getByRole("dialog", { name: "Internet Explorer - Security Warning" });
  await expect(warning).toContainText("Unknown Publisher");
  await warning.getByRole("button", { name: "Run", exact: true }).click();
  await expect(band(page, "coupon")).toHaveCount(1);
});

test("the page's right-click menu grows with each toolbar", async ({ page, isMobile }) => {
  test.skip(isMobile, "Phones use a long press; see the next test.");
  await connect(page);
  await page.locator(".page").click({ button: "right", position: { x: 400, y: 120 } });
  await expect(page.locator(".menu .it.spons")).toHaveCount(9);
  await page.keyboard.press("Escape");
});

test("a long press opens the page menu on touch screens", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Touch only.");
  await connect(page);
  const box = await page.locator(".page").boundingBox();
  const at = { clientX: box.x + 60, clientY: box.y + 20, pointerType: "touch", bubbles: true, isPrimary: true };
  await page.locator(".page").dispatchEvent("pointerdown", at);
  await page.waitForTimeout(700);
  await expect(page.locator(".menu .it.spons")).toHaveCount(9);
});

test("menus work from the keyboard", async ({ page }) => {
  await connect(page);
  await page.keyboard.press("Alt+KeyV");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowRight");
  await expect(page.locator(".menu")).toHaveCount(2);
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator(".menu")).toHaveCount(1);
  await page.keyboard.press("Escape");
  await page.keyboard.press("Alt+KeyH");
  await page.keyboard.press("End");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog", { name: "About Internet Explorer" })).toBeVisible();
});

test("Hotmoil asks about nonsecure items and signs in", async ({ page }) => {
  await connect(page);
  await band(page, "links").getByRole("button", { name: "Free Hotmoil" }).click();
  await page.getByRole("dialog", { name: "Security Information" }).getByRole("button", { name: "No" }).click();
  await expect(page.locator(".hm-banner .broken")).toBeVisible();
  await expect(page.locator(".st-lock")).toBeVisible();
  await page.getByRole("button", { name: "Sign In" }).click();
  const remember = page.getByRole("dialog", { name: "AutoComplete" });
  await expect(remember).toContainText("remember this password");
  await remember.getByRole("button", { name: "No" }).click();
  await expect(page.locator(".hm-inbox tbody tr")).toHaveCount(10);
});

test("Kev's guestbook can be signed, and the spam bot follows", async ({ page }) => {
  await connect(page);
  await band(page, "links").getByRole("button", { name: "Kev's Page" }).click();
  await page.getByRole("button", { name: "Sign My Guestbook!!" }).click();
  await page.getByLabel("Name:").fill("Toolbar Tester");
  await page.getByLabel("Message:").fill("cool site, 10/10");
  await page.getByRole("button", { name: "Sign it!" }).click();
  await expect(page.locator(".gb-entry").first()).toContainText("cool site, 10/10");
  await expect(page.locator(".gb-entry").first()).toContainText("ringtones", { timeout: 6000 });
  // Signatures survive a reload.
  await page.reload();
  await page.getByRole("button", { name: "Dial" }).click();
  await expect(title(page)).toContainText("Home Search Portal");
  await band(page, "links").getByRole("button", { name: "Kev's Page" }).click();
  await page.getByRole("button", { name: "Sign My Guestbook!!" }).click();
  await expect(page.locator(".gb-entry", { hasText: "Toolbar Tester" })).toHaveCount(1);
});

test("Kev's MIDI jukebox has a play button", async ({ page }) => {
  await connect(page);
  await band(page, "links").getByRole("button", { name: "Kev's Page" }).click();
  await page.getByRole("button", { name: "MIDI Jukebox" }).click();
  const player = page.locator(".midi-player");
  await player.getByRole("button", { name: "Play" }).click();
  await expect(player.getByRole("button", { name: "Stop" })).toBeVisible();
  await expect(page.locator(".midi-track i")).toHaveClass(/on/);
});

test("the forum moderator answers your reply", async ({ page }) => {
  await connect(page);
  await page.locator(".portal").getByRole("link", { name: "TechGuyz Forums" }).click();
  await page.getByLabel("Quick Reply").fill("i scanned and they came back");
  await page.getByRole("button", { name: "Post Quick Reply" }).click();
  await expect(page.locator(".forum .body").last()).toContainText("still has", { timeout: 6000 });
});

test("Esc closes the frontmost dialog", async ({ page }) => {
  await connect(page);
  await page.keyboard.press("Alt+KeyH");
  await page.keyboard.press("End");
  await page.keyboard.press("Enter");
  const about = page.getByRole("dialog", { name: "About Internet Explorer" });
  await expect(about).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(about).toHaveCount(0);
});

test("File › Close crashes IE and restores every toolbar", async ({ page }) => {
  await connect(page);
  await page.getByRole("button", { name: "Close Yahooey! Companion" }).click();
  await page.locator('.mi[data-menu="File"]').click();
  await page.locator(".menu .it", { hasText: /^Close/ }).click();
  await page.getByRole("button", { name: "Don't Send" }).click();
  await expect(page.locator(".win")).toBeVisible();
  await expect(page.locator(".infobar")).toContainText("restarted");
});

test.describe("on a phone", () => {
  test.use({ viewport: { width: 420, height: 800 } });

  test("toolbar chevrons list the buttons that don't fit", async ({ page }) => {
    await connect(page);
    await band(page, "std").locator(".chev").click();
    await expect(page.locator(".menu .it")).toContainText(["Favorites", "Media", "History", "Mail", "Print"]);
    const win = await page.locator(".win").boundingBox();
    expect(win.x + win.width).toBeLessThanOrEqual(420);
  });
});

test("the window can be dragged and resized", async ({ page, isMobile }) => {
  test.skip(isMobile, "On a phone the window fills the screen and stays put.");
  await connect(page);
  const win = page.locator(".win");
  const before = await win.boundingBox();
  const bar = page.locator(".win > .titlebar .ttl");
  const b = await bar.boundingBox();
  await page.mouse.move(b.x + 40, b.y + 8);
  await page.mouse.down();
  await page.mouse.move(b.x + 40 - 60, b.y + 8 + 40, { steps: 5 });
  await page.mouse.up();
  const moved = await win.boundingBox();
  expect(Math.round(moved.x - before.x)).toBe(-60);
  expect(Math.round(moved.y - before.y)).toBe(40);

  const corner = await page.locator(".rz-se").boundingBox();
  await page.mouse.move(corner.x + 5, corner.y + 5);
  await page.mouse.down();
  await page.mouse.move(corner.x + 5 - 200, corner.y + 5 - 100, { steps: 5 });
  await page.mouse.up();
  const resized = await win.boundingBox();
  expect(Math.round(resized.width)).toBe(Math.round(moved.width) - 200);
  expect(Math.round(resized.height)).toBe(Math.round(moved.height) - 100);

  // Never smaller than the minimum.
  const c2 = await page.locator(".rz-se").boundingBox();
  await page.mouse.move(c2.x + 5, c2.y + 5);
  await page.mouse.down();
  await page.mouse.move(c2.x - 2000, c2.y - 2000, { steps: 3 });
  await page.mouse.up();
  const tiny = await win.boundingBox();
  expect(tiny.width).toBeGreaterThanOrEqual(420);
  expect(tiny.height).toBeGreaterThanOrEqual(320);
});

test("closing IE leaves an icon on the desktop that reopens it", async ({ page }) => {
  await connect(page);
  await expect(page.getByRole("button", { name: /^Internet Explorer/ })).toHaveCount(0);
  await page.locator(".win > .titlebar").getByRole("button", { name: "Close" }).click();
  await expect(page.locator(".win")).toBeHidden();
  const icon = page.getByRole("button", { name: /^Internet Explorer/ });
  await icon.click();
  await expect(icon).toHaveClass(/sel/);
  await icon.dblclick();
  await expect(page.locator(".win")).toBeVisible();
  await expect(title(page)).toContainText("Home Search Portal");
  // IE is the only thing on the desktop.
  await expect(page.locator(".desk-icon")).toHaveCount(1);
});

test("the progress bar fills in whole blocks", async ({ page }) => {
  await connect(page);
  const widths = new Set();
  await page.evaluate(() => {
    window.__w = [];
    const bar = document.querySelector(".st-prog i");
    new MutationObserver(() => window.__w.push(bar.style.width)).observe(bar, { attributes: true });
  });
  await page.locator("#addr").fill("www.hamsterparty.fake");
  await page.locator("#addr").press("Enter");
  await expect(title(page)).toContainText("HAMSTER");
  for (const w of await page.evaluate(() => window.__w)) widths.add(w);
  for (const w of widths) expect(parseInt(w || "0") % 9).toBe(0);
});

test("the collapse ending: every toolbar installed, no room left", async ({ page }) => {
  await connect(page);
  await page.evaluate(() => window.__season.installAll());
  const end = page.getByRole("dialog", { name: "Internet Explorer", exact: true });
  await expect(end).toContainText("There is no room left to display this page.");
  await expect(end.locator(".end-share")).toHaveValue(/I ended up with 21 toolbars and no web page at all\. I never clicked Install once\./);
  await expect(page.locator(".mid")).toHaveClass(/gone/);
  await end.getByRole("button", { name: "Keep browsing" }).click();
  await expect(end).toHaveCount(0);
  await expect(page.locator(".dlg")).toHaveCount(0);
});

test("the clean ending: zero toolbars for a full minute", async ({ page }) => {
  await connect(page);
  await page.evaluate(() => window.__season.removeAll());
  const cert = page.getByRole("dialog", { name: "Certificate of Achievement" });
  await expect(cert).toContainText("Certificate of Toolbar Removal", { timeout: 6000 });
  await expect(cert.locator(".end-stats")).toContainText("Toolbars you uninstalled for good13");
  await expect(cert.locator(".end-share")).toHaveValue(/kept it clean for a full minute/);
});

test("What is this? explains the piece", async ({ page }) => {
  await connect(page);
  await page.getByRole("button", { name: "What is this?" }).click();
  await expect(page.getByRole("dialog", { name: "What is this?" })).toContainText("It ends one of two ways");
});
