import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  // Les polices de remplacement permettent d’exécuter les scénarios hors ligne.
  await page.route('https://fonts.googleapis.com/**', (route) => route.fulfill({ contentType: 'text/css', body: '' }))
})

test('respecte les règles axe de libellé et de contraste du texte', async ({ page }) => {
  await page.goto('/')

  const rules = ['label', 'color-contrast']
  const { passes, violations } = await new AxeBuilder({ page }).withRules(rules).analyze()

  expect(violations).toEqual([])
  // Une page vide pourrait renvoyer zéro violation alors qu’aucune des règles ne s’applique.
  expect(passes.map(({ id }) => id)).toEqual(expect.arrayContaining(rules))
})

test('garde le logo fixe au focus et ouvre l’accueil au clavier avec les animations réduites', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.clock.install()
  await page.goto('/')

  const homeLink = page.getByRole('link', { name: 'Etoiline, accueil', exact: true })
  const logo = homeLink.locator('.brand-icon')
  const homeTitle = page.locator('#accueil').getByRole('heading', { level: 1 })
  const restingTransform = await logo.evaluate((element) => getComputedStyle(element).transform)

  // Fixer la position de départ avant de tester le défilement provoqué par le lien.
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }))
  await expect(homeTitle).not.toBeInViewport()
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  await expect(homeLink).toBeFocused()

  // Dépasser les 200 ms de la rotation permet de détecter une animation déclenchée au focus.
  await page.clock.runFor(250)
  await expect(logo).toHaveCSS('transform', restingTransform)

  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#accueil$/)
  await expect(homeTitle).toBeInViewport()
})
