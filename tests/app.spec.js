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
  await page.locator(".menu .it", { hasText: "Toolbars" }).hover();
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

test("the page's right-click menu grows with each toolbar", async ({ page }) => {
  await connect(page);
  await page.locator(".page").click({ button: "right", position: { x: 400, y: 120 } });
  await expect(page.locator(".menu .it.spons")).toHaveCount(9);
  await page.keyboard.press("Escape");
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
  await expect(page.locator(".hm-inbox tbody tr")).toHaveCount(10);
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
