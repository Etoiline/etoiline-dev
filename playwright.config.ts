import { defineConfig } from '@playwright/test'

const host = '127.0.0.1'
const port = 4173
const baseURL = `http://${host}:${port}`
const crossBrowserTests = /@cross-browser\b/

export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    // Firefox et WebKit rejouent les parcours marqués dans les tests existants.
    { name: 'firefox', use: { browserName: 'firefox' }, grep: crossBrowserTests },
    { name: 'webkit', use: { browserName: 'webkit' }, grep: crossBrowserTests },
  ],
  // Une prévisualisation dédiée évite de tester un autre build déjà servi sur ce port.
  webServer: {
    command: `npm run preview -- --host ${host} --port ${port} --strictPort`,
    url: baseURL,
    reuseExistingServer: false,
  },
})
