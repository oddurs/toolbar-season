// Accessibility checks with axe-core, across the main states of the app.
// Colour contrast inside the fake 2005 web pages and ads is left as it was
// (it's the point); IE's own interface is held to the rules.
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function violations(page) {
  const r = await new AxeBuilder({ page }).exclude(".page").exclude(".pop-page").exclude(".band:not([data-bar='menu']):not([data-bar='std']):not([data-bar='addr']):not([data-bar='links'])").analyze();
  return r.violations.filter(v => ["critical", "serious"].includes(v.impact)).map(v => `${v.id}: ${v.nodes.map(n => n.target.join(" ")).join(", ")}`);
}

test("no serious accessibility problems in IE's own interface", async ({ page }) => {
  await page.goto("/?test");
  expect(await violations(page), "dial-up prompt").toEqual([]);
  await page.getByRole("button", { name: "Dial" }).click();
  await expect(page.locator(".win > .titlebar .ttl")).toContainText("Home Search Portal");
  expect(await violations(page), "browser window").toEqual([]);

  await page.locator('.mi[data-menu="View"]').click();
  expect(await violations(page), "open menu").toEqual([]);
  await page.keyboard.press("Escape");

  await page.keyboard.press("Alt+KeyT");
  await page.locator(".menu .it", { hasText: "Add or Remove Programs" }).click();
  expect(await violations(page), "Add or Remove Programs").toEqual([]);
  await page.keyboard.press("Escape");

  await page.locator("#addr").fill("");
  await page.locator("#addr").pressSequentially("ham");
  expect(await violations(page), "AutoComplete").toEqual([]);
});
