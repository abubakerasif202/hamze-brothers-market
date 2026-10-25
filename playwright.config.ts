import { defineConfig, devices } from "@playwright/test";

const PORT = 3123;
// The specials design preview only exists in `next dev` (it 404s in production), so it gets its own server.
const DEV_PORT = 3124;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  // Several tests load pages at five widths; give them room when the machine is busy.
  timeout: 45_000,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: { trace: "retain-on-failure", screenshot: "only-on-failure" },
  projects: [
    {
      name: "chromium",
      testIgnore: /specials-preview\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], baseURL: `http://localhost:${PORT}` },
    },
    {
      name: "dev-preview",
      testMatch: /specials-preview\.spec\.ts/,
      // The first requests to `next dev` compile routes and optimise images on demand.
      timeout: 60_000,
      use: { ...devices["Desktop Chrome"], baseURL: `http://localhost:${DEV_PORT}` },
    },
  ],
  webServer: [
    {
      // CI builds in an earlier step, so only serve the existing build there.
      command: process.env.CI ? `pnpm start -p ${PORT}` : `pnpm build && pnpm start -p ${PORT}`,
      url: `http://localhost:${PORT}`,
      reuseExistingServer: !process.env.CI,
      timeout: 300_000,
    },
    {
      command: `pnpm dev -p ${DEV_PORT}`,
      url: `http://localhost:${DEV_PORT}/dev/specials-preview`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
