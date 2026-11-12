import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import type { Locator, Page, Request } from '@playwright/test'

const contactEndpoint = '**/api/contact'
const draft = {
  name: 'Camille',
  email: 'camille@example.com',
  message: 'Bonjour, parlons de mon projet.',
}
const emptyDraft = { name: '', email: '', message: '' }
const expectedBody = { ...draft, website: '' }
const successResponse = { json: { success: true } }
const confirmation = 'Votre message a bien été envoyé.'

async function fillContactForm(page: Page, values: typeof draft = draft) {
  // Une feuille de style vide évite que le chargement du formulaire dépende des polices distantes.
  await page.route('https://fonts.googleapis.com/**', (route) => route.fulfill({ contentType: 'text/css', body: '' }))
  await page.goto('/#contact')

  const contact = page.getByRole('region', { name: 'Contact', exact: true })
  const fields = {
    name: contact.getByLabel('Nom', { exact: true }),
    email: contact.getByLabel('Adresse e-mail', { exact: true }),
    message: contact.getByLabel('Message', { exact: true }),
  }
  await fields.name.fill(values.name)
  await fields.email.fill(values.email)
  await fields.message.fill(values.message)

  return {
    fields,
    submit: contact.getByRole('button', { name: 'Envoyer le message', exact: true }),
    sending: contact.getByRole('button', { name: 'Envoi en cours…', exact: true }),
    feedback: contact.getByRole('status'),
  }
}

async function expectContactValues(fields: Record<keyof typeof draft, Locator>, values: typeof draft) {
  await expect(fields.name).toHaveValue(values.name)
  await expect(fields.email).toHaveValue(values.email)
  await expect(fields.message).toHaveValue(values.message)
}

async function expectFeedbackContrast(feedback: Locator) {
  await expect(feedback).toBeVisible()
  await feedback.scrollIntoViewIfNeeded()

  const rule = 'color-contrast'
  const { passes, violations } = await new AxeBuilder({ page: feedback.page() })
    .include('#contact [role="status"]')
    .withRules([rule])
    .analyze()

  expect(violations).toEqual([])
  // La règle doit s’appliquer au message même si aucune violation n’est relevée.
  expect(passes.map(({ id }) => id)).toContain(rule)
}

async function holdContactResponse(page: Page) {
  // Retenir la réponse permet de vérifier l’attente avant la confirmation, même si le navigateur est rapide.
  const requests: Request[] = []
  const { promise: responseReady, resolve: releaseResponse } = Promise.withResolvers<void>()
  await page.route(contactEndpoint, async (route) => {
    requests.push(route.request())
    await responseReady
    await route.fulfill(successResponse)
  })
  return { requests, releaseResponse }
}

test('confirme l’envoi et vide les champs après la réponse de l’API', { tag: '@cross-browser' }, async ({ page }) => {
  const { releaseResponse } = await holdContactResponse(page)
  const form = await fillContactForm(page)
  try {
    const [request] = await Promise.all([page.waitForRequest(contactEndpoint), form.submit.click()])
    expect(request.method()).toBe('POST')
    expect(request.postDataJSON()).toEqual(expectedBody)
    await expect(form.sending).toBeDisabled()
    await expect(form.feedback).toBeEmpty()
    await expectContactValues(form.fields, draft)
  } finally {
    releaseResponse()
  }

  await expect(form.feedback).toContainText(confirmation)
  await expectContactValues(form.fields, emptyDraft)
  await expect(form.submit).toBeEnabled()
  await expectFeedbackContrast(form.feedback)
})

test('ignore une seconde soumission du formulaire pendant l’envoi', async ({ page }) => {
  const { requests, releaseResponse } = await holdContactResponse(page)
  const form = await fillContactForm(page)
  try {
    await Promise.all([
      page.waitForRequest(contactEndpoint),
      form.submit.evaluate((button: HTMLButtonElement) => {
        const contactForm = button.form
        if (!contactForm) throw new Error('Le bouton doit appartenir au formulaire de contact.')
        // Soumettre deux fois dans la même tâche exerce le verrou avant la mise à jour du bouton.
        contactForm.requestSubmit()
        contactForm.requestSubmit()
      }),
    ])
    await expect(form.sending).toBeDisabled()
  } finally {
    releaseResponse()
  }

  await expect(form.feedback).toContainText(confirmation)
  expect(requests).toHaveLength(1)
})

test('garde l’indicateur d’envoi fixe avec les animations réduites', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.clock.install()
  const { releaseResponse } = await holdContactResponse(page)
  const form = await fillContactForm(page)
  try {
    await form.submit.click()
    const spinner = form.sending.locator('.contact-submit-icon')
    await expect(spinner).toBeVisible()
    const initialTransform = await spinner.evaluate((icon) => getComputedStyle(icon).transform)

    // Un demi-tour normal dure 400 ms. L’horloge fait avancer les animations pilotées par JavaScript.
    await page.clock.runFor(400)
    const indicator = await spinner.evaluate((icon) => ({
      transform: getComputedStyle(icon).transform,
      animating: icon.getAnimations().some((animation) => animation.playState === 'running'),
    }))
    expect(indicator).toEqual({ transform: initialTransform, animating: false })
    await expect(form.feedback).toBeEmpty()
  } finally {
    releaseResponse()
  }

  await expect(form.feedback).toContainText(confirmation)
})

test('conserve la saisie après un échec et permet de la renvoyer', async ({ page }) => {
  const requests: Request[] = []
  await page.route(contactEndpoint, async (route) => {
    requests.push(route.request())
    if (requests.length === 1) {
      await route.fulfill({ status: 503 })
      return
    }
    await route.fulfill(successResponse)
  })

  const form = await fillContactForm(page)
  await form.submit.click()
  await expect(form.feedback).toContainText('L’envoi est indisponible')
  await expectContactValues(form.fields, draft)
  await expect(form.submit).toBeEnabled()
  expect(requests).toHaveLength(1)

  await form.submit.click()
  await expect(form.feedback).toContainText(confirmation)
  await expectContactValues(form.fields, emptyDraft)

  expect(requests).toHaveLength(2)
  for (const request of requests) {
    expect(request.method()).toBe('POST')
    expect(request.postDataJSON()).toEqual(expectedBody)
  }
})

test('annonce la limite d’envoi et conserve la saisie après un 429', async ({ page }) => {
  // Un refus du pare-feu peut arriver sans corps JSON.
  await page.route(contactEndpoint, (route) => route.fulfill({
    status: 429,
    contentType: 'text/plain',
    body: 'Too Many Requests',
  }))

  const form = await fillContactForm(page)
  await expect(form.feedback).toBeEmpty()
  await form.submit.click()

  await expect(form.feedback).toContainText('Patientez quelques minutes avant de réessayer.')
  await expectContactValues(form.fields, draft)
  await expect(form.submit).toBeEnabled()
  for (const field of Object.values(form.fields)) await expect(field).toBeEditable()
  await expectFeedbackContrast(form.feedback)
})

test('affiche l’erreur pour un nom de deux espaces et conserve la saisie', async ({ page }) => {
  let apiCalls = 0
  await page.route(contactEndpoint, (route) => {
    apiCalls += 1
    return route.fulfill(successResponse)
  })

  // Le nom satisfait la longueur minimale HTML et devient vide après normalisation.
  const invalidDraft = { ...draft, name: '  ' }
  const form = await fillContactForm(page, invalidDraft)
  await form.submit.click()

  await expect(form.feedback).toContainText('Vérifiez votre nom')
  await expect(form.feedback).toBeVisible()
  await expectContactValues(form.fields, invalidDraft)
  expect(apiCalls).toBe(0)
})
