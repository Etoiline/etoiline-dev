import { defineConfig } from '@playwright/test'

const host = '127.0.0.1'
const port = 4173
const baseURL = `http://${host}:${port}`

export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL, browserName: 'chromium' },
  // Une prévisualisation dédiée évite de tester un autre build déjà servi sur ce port.
  webServer: {
    command: `npm run preview -- --host ${host} --port ${port} --strictPort`,
    url: baseURL,
    reuseExistingServer: false,
  },
})
