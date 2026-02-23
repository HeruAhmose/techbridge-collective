import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env.CI;
const real = process.env.CHATBASE_E2E_REAL === "1";

export default defineConfig({
  testDir: "./tests",
  timeout: real ? 90_000 : 30_000,
  expect: { timeout: real ? 20_000 : 8_000 },
  retries: isCI ? 1 : 0,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3000",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: isCI ? "PORT=3000 npm run start" : "PORT=3000 npm run dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !isCI,
  },
});
