import { defineConfig, devices } from "@playwright/test";

// Chrome, Safari's engine, Firefox, and an iPhone. Locally the Chrome project
// uses your installed Chrome; CI installs Playwright's browsers.
export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:4173",
    viewport: { width: 1280, height: 860 },
  },
  projects: [
    { name: "chromium", use: { browserName: "chromium", channel: process.env.CI ? undefined : "chrome" } },
    { name: "webkit", use: { browserName: "webkit" } },
    { name: "firefox", use: { browserName: "firefox" } },
    { name: "iphone", use: { ...devices["iPhone 13"] } },
  ],
  webServer: {
    command: "npm run build && npx vite preview --port 4173 --strictPort",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
  },
});
