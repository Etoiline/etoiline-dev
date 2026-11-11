import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('respecte les règles axe de libellé et de contraste du texte', async ({ page }) => {
  // Les polices de remplacement permettent d’exécuter le contrôle hors ligne.
  await page.route('https://fonts.googleapis.com/**', (route) => route.fulfill({ contentType: 'text/css', body: '' }))
  await page.goto('/')

  const rules = ['label', 'color-contrast']
  const { passes, violations } = await new AxeBuilder({ page }).withRules(rules).analyze()

  expect(violations).toEqual([])
  // Une page vide pourrait renvoyer zéro violation alors qu’aucune des règles ne s’applique.
  expect(passes.map(({ id }) => id)).toEqual(expect.arrayContaining(rules))
})
