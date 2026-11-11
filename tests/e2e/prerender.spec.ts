import { expect, test } from '@playwright/test'

// Les assertions portent sur le HTML livré par le build, avant toute hydratation.
test.use({ javaScriptEnabled: false })

test('affiche le portfolio pré-rendu et permet de le parcourir au clavier', async ({ page }) => {
  // Le test peut charger le site même quand le service de polices est indisponible.
  await page.route('https://fonts.googleapis.com/**', (route) => route.fulfill({ contentType: 'text/css', body: '' }))
  await page.goto('/')

  const main = page.getByRole('main')
  await expect(main.getByRole('heading', { level: 1 })).toBeVisible()
  for (const name of ['Expérience', 'Projets personnels', 'Stack', 'À propos', 'Contact']) {
    await expect(main.getByRole('heading', { name, level: 2, exact: true })).toBeVisible()
  }

  const skipLink = page.getByRole('link', { name: 'Aller au contenu', exact: true })
  await page.keyboard.press('Tab')
  await expect(skipLink).toBeFocused()
  await expect(skipLink).toBeInViewport()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#contenu$/)
  await expect(main).toBeFocused()

  const project = main.getByRole('article', { name: 'Mouv’Air', exact: true })
  const summary = project.locator('summary')
  const studyContent = project.getByText('Le besoin', { exact: true })
  await expect(summary).toBeVisible()
  await expect(studyContent).toBeHidden()

  // Suivre l’ordre natif jusqu’au résumé ou à la sortie du contenu principal.
  const focusedInMain = main.locator(':focus')
  const focusedSummary = summary.and(focusedInMain)
  do {
    await page.keyboard.press('Tab')
  } while ((await focusedInMain.count()) > 0 && (await focusedSummary.count()) === 0)

  await expect(summary).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(studyContent).toBeVisible()
})
