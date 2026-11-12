import { expect, test } from '@playwright/test'

const captureUrl = '**/images/mouvair.jpg'
const previewName = 'Découvrir Mouv’Air (nouvel onglet)'

test.beforeEach(async ({ page }) => {
  await page.route('https://fonts.googleapis.com/**', (route) => route.fulfill({ contentType: 'text/css', body: '' }))
  await page.route(captureUrl, (route) => route.fulfill({ status: 404 }))
})

test('affiche le visuel de secours de Mouv’Air et ouvre son lien après un 404', async ({ page }) => {
  const failedCapture = page.waitForResponse(captureUrl)
  await page.goto('/')
  const previewLink = page.getByRole('link', { name: previewName, exact: true })
  // Amener la fiche à l’écran déclenche le chargement différé de la capture.
  await previewLink.scrollIntoViewIfNeeded()
  expect((await failedCapture).status()).toBe(404)
  await expect(previewLink.getByText('Mouv’Air', { exact: true })).toBeVisible()
  await expect(previewLink.getByRole('img')).toBeHidden()

  // Le contexte intercepte la première navigation de l’onglet ouvert par le lien.
  const context = page.context()
  const projectUrl = 'https://mouvair.etoiline.dev/'
  await context.route(projectUrl, (route) => route.fulfill({ contentType: 'text/plain', body: 'Mouv’Air' }))
  const [projectTab] = await Promise.all([context.waitForEvent('page'), previewLink.click()])
  await expect(projectTab).toHaveURL(projectUrl)
})

test('remplace la capture de Mouv’Air si elle échoue avant l’hydratation', async ({ page }) => {
  // Retenir le script laisse le navigateur charger la capture depuis le HTML pré-rendu.
  const { promise: scriptsReady, resolve: releaseScripts } = Promise.withResolvers<void>()
  await page.route('**/assets/*.js', async (route) => {
    await scriptsReady
    await route.continue()
  })

  const previewLink = page.getByRole('link', { name: previewName, exact: true })
  const failedCapture = page.waitForResponse(captureUrl)
  try {
    await page.goto('/', { waitUntil: 'commit' })
    await previewLink.scrollIntoViewIfNeeded()
    expect((await failedCapture).status()).toBe(404)
    await expect.poll(() => previewLink.locator('img').evaluate((image: HTMLImageElement) =>
      image.complete && image.naturalWidth === 0)).toBe(true)
  } finally {
    releaseScripts()
  }

  await expect(previewLink.getByText('Mouv’Air', { exact: true })).toBeVisible()
})
