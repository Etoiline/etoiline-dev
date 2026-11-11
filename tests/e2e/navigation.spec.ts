import { expect, test } from '@playwright/test'

// La réduction des mouvements rend le défilement immédiat après le clic sur une ancre.
test.use({ viewport: { width: 320, height: 640 }, reducedMotion: 'reduce' })

test('affiche la navigation et atteint la section Contact à 320 px', async ({ page }) => {
  // Les polices de remplacement évitent de dépendre du service de polices externe.
  await page.route('https://fonts.googleapis.com/**', (route) => route.fulfill({ contentType: 'text/css', body: '' }))
  await page.goto('/')

  const header = page.getByRole('banner')
  const navigation = header.getByRole('navigation', { name: 'Navigation principale', exact: true })
  for (const name of ['Expérience', 'Projets', 'Stack', 'À propos', 'Contact']) {
    const link = navigation.getByRole('link', { name, exact: true })
    await expect(link).toBeVisible()
    await expect(link).toBeInViewport({ ratio: 1 })
  }

  const horizontalOverflow = await page.evaluate(() => {
    const { scrollWidth, clientWidth } = document.documentElement
    return scrollWidth - clientWidth
  })
  expect(horizontalOverflow, 'la page doit tenir dans la largeur de la fenêtre').toBe(0)

  await navigation.getByRole('link', { name: 'Contact', exact: true }).click()
  await expect(page).toHaveURL(/#contact$/)

  const contactTitle = page.getByRole('heading', { name: 'Contact', level: 2, exact: true })
  await expect(contactTitle).toBeVisible()
  await expect(contactTitle).toBeInViewport({ ratio: 1 })

  // Un titre dans la fenêtre peut rester masqué par l’en-tête qui accompagne le défilement.
  const headerBottom = await header.evaluate((element) => element.getBoundingClientRect().bottom)
  const titleTop = await contactTitle.evaluate((element) => element.getBoundingClientRect().top)
  expect(titleTop, 'le titre Contact doit apparaître sous l’en-tête').toBeGreaterThanOrEqual(headerBottom)
})
