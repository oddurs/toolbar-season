// Regenerates public/og.png, the preview image shown when the link is shared.
// Usage: npm run og
import { preview } from "vite";
import { chromium } from "@playwright/test";

const server = await preview({ preview: { port: 4174, strictPort: true } });
const browser = await chromium.launch({ channel: process.env.CI ? undefined : "chrome" });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.goto("http://localhost:4174/?test");
  await page.getByRole("button", { name: "Dial" }).click();
  await page.locator(".win > .titlebar .ttl").filter({ hasText: "Home Search Portal" }).waitFor();
  await page.addStyleTag({ content: ".blink { animation: none !important; } .era, .sound-toggle { display: none; }" });
  await page.waitForTimeout(300);
  await page.screenshot({ path: "public/og.png" });
  console.log("wrote public/og.png");
} finally {
  await browser.close();
  server.httpServer.close();
}
