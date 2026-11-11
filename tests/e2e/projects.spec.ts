import { expect, test } from '@playwright/test'

test('affiche le visuel de secours de Mouv’Air et ouvre son lien après un 404', async ({ page }) => {
  await page.route('https://fonts.googleapis.com/**', (route) => route.fulfill({ contentType: 'text/css', body: '' }))
  let captureRequested = false
  await page.route('**/images/mouvair.jpg', (route) => {
    captureRequested = true
    return route.fulfill({ status: 404 })
  })

  await page.goto('/')
  const project = page.getByRole('article', { name: 'Mouv’Air', exact: true })
  const previewLink = project.getByRole('link', { name: 'Découvrir Mouv’Air (nouvel onglet)', exact: true })
  // Amener la fiche à l’écran déclenche le chargement différé de la capture.
  await previewLink.scrollIntoViewIfNeeded()
  await expect(previewLink.getByText('Mouv’Air', { exact: true })).toBeVisible()
  await expect(previewLink.getByRole('img')).toBeHidden()
  expect(captureRequested).toBe(true)

  // Le contexte intercepte la première navigation de l’onglet ouvert par le lien.
  const context = page.context()
  const projectUrl = 'https://mouvair.etoiline.dev/'
  await context.route(projectUrl, (route) => route.fulfill({ contentType: 'text/plain', body: 'Mouv’Air' }))
  const [projectTab] = await Promise.all([context.waitForEvent('page'), previewLink.click()])
  await expect(projectTab).toHaveURL(projectUrl)
})
