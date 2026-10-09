import { defineConfig, devices } from '@playwright/test';

const BASE_URL =
  process.env.BASE_URL ?? 'https://verzel-store.qa-test-verzel-store.workers.dev';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // ambiente compartilhado: sem paralelismo agressivo
  workers: 1,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'api', testMatch: /.*\.api\.spec\.ts/ },
    { name: 'ui', testMatch: /.*\.ui\.spec\.ts/, use: { ...devices['Desktop Chrome'] } },
  ],
});
