/**
 * Vérifie le contrat du formulaire et du serveur avec `npm test`, sans envoi d’e-mail réel.
 * Le serveur reçoit une configuration fictive et une fonction `send` qui remplace l’appel à Brevo.
 * Les tests du client remplacent de la même façon son appel à `/api/contact`.
 * Ces scénarios contrôlent les données et les erreurs ; ils ne prouvent pas qu’une clé,
 * un domaine ou un expéditeur sont correctement configurés sur le compte Brevo de production.
 */
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createContactHandler } from '../server/contact.ts'
import { sendContactMessage } from '../src/lib/contact.ts'

// Des valeurs stables permettent de modifier un seul aspect de la requête dans chaque scénario.
// Le champ leurre reste vide dans le cas valide et la clé factice ne sert qu’au contrôle de présence.
const origin = 'https://etoiline.dev'
const message = { name: 'Camille', email: 'camille@example.com', message: 'Bonjour, parlons de mon projet.', website: '' }
const env = { BREVO_API_KEY: 'test-key-not-a-real-secret' }

// Construire un objet Request ne déclenche aucun réseau : il est transmis directement au gestionnaire testé.
// `options` permet de simuler un autre contexte HTTP, notamment des en-têtes incomplets ou non autorisés.
function request(payload = message, options = {}) {
  return new Request(`${origin}/api/contact`, {
    method: 'POST',
    headers: { origin, 'Content-Type': 'application/json' },
    // Une chaîne est conservée telle quelle pour pouvoir tester aussi un JSON volontairement malformé.
    body: typeof payload === 'string' ? payload : JSON.stringify(payload),
    ...options,
  })
}

test('le serveur envoie un e-mail texte par Brevo au destinataire fixé et permet de répondre au visiteur', async () => {
  let sent
  // Le faux prestataire capture la demande et simule la réponse 201 avec messageId de l’API Brevo.
  const handle = createContactHandler({ env, send: async (url, options) => {
    sent = { url, options, body: JSON.parse(options.body) }
    return Response.json({ messageId: '<email-test@brevo.example>' }, { status: 201 })
  } })

  // Les champs supplémentaires tentent de détourner l’envoi : seul le serveur doit choisir ces adresses.
  const response = await handle(request({
    ...message, name: '  Camille  ', to: 'other@example.com', sender: { email: 'other@example.com' },
  }))
  // Le résultat destiné au navigateur reste minimal ; le contrat Brevo est contrôlé sur la demande interceptée.
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { success: true })
  assert.equal(response.headers.get('Cache-Control'), 'no-store')
  assert.equal(sent.url, 'https://api.brevo.com/v3/smtp/email')
  assert.equal(sent.options.method, 'POST')
  assert.deepEqual(sent.body.to, [{ email: 'contact@etoiline.dev' }])
  assert.deepEqual(sent.body.sender, { name: 'Etoiline', email: 'contact@etoiline.dev' })
  assert.deepEqual(sent.body.replyTo, { email: message.email })
  assert.match(sent.body.textContent, /^Nom : Camille\n/)
  assert.equal(sent.body.htmlContent, undefined)
  assert.equal(sent.options.headers['api-key'], env.BREVO_API_KEY)
  assert.equal(sent.options.headers.Authorization, undefined)
})

test('la configuration serveur peut changer l’expéditeur sans changer le destinataire', async () => {
  let sent
  // Les espaces simulent un copier-coller dans les variables d’environnement et doivent être retirés.
  // CONTACT_FROM configure uniquement l’expéditeur, sans permettre de rediriger les messages reçus.
  const handle = createContactHandler({
    env: { BREVO_API_KEY: `  ${env.BREVO_API_KEY}  `, CONTACT_FROM: '  notifications@etoiline.dev  ' },
    send: async (_url, options) => {
      sent = { headers: options.headers, body: JSON.parse(options.body) }
      return Response.json({ messageId: '<email-test@brevo.example>' }, { status: 201 })
    },
  })

  assert.equal((await handle(request())).status, 200)
  assert.deepEqual(sent.body.sender, { name: 'Etoiline', email: 'notifications@etoiline.dev' })
  assert.deepEqual(sent.body.to, [{ email: 'contact@etoiline.dev' }])
  assert.equal(sent.headers['api-key'], env.BREVO_API_KEY)
})

test('les champs invalides et le champ leurre sont rejetés avant tout envoi', async (t) => {
  // Ces cas contournent les contraintes HTML : l’API doit aussi refuser les mauvaises structures,
  // les limites dépassées, une tentative d’injection d’en-tête dans l’e-mail et un champ leurre rempli.
  const invalid = [
    null,
    [],
    { ...message, name: '   ' },
    { ...message, name: 'a'.repeat(101) },
    { ...message, email: 'invalide' },
    { ...message, email: 'camille@example.com\r\nBcc: other@example.com' },
    { ...message, message: 'court' },
    { ...message, message: 'a'.repeat(5001) },
    { ...message, message: 123 },
    { ...message, website: 'https://spam.example.com' },
  ]

  for (const [index, payload] of invalid.entries()) {
    await t.test(`cas invalide ${index + 1}`, async () => {
      // Échouer si send est appelé prouve que le refus intervient avant de consommer le service d’envoi.
      const handle = createContactHandler({ env, send: async () => assert.fail('Aucun envoi attendu') })
      assert.equal((await handle(request(payload))).status, 422)
    })
  }
})

test('les méthodes, origines et formats non autorisés sont refusés', async () => {
  // Les contrôles HTTP doivent bloquer une requête avant la validation métier et avant tout appel à Brevo.
  const handle = createContactHandler({ env, send: async () => assert.fail('Aucun envoi attendu') })
  const getResponse = await handle(new Request(`${origin}/api/contact`))
  assert.equal(getResponse.status, 405)
  assert.equal(getResponse.headers.get('Allow'), 'POST')

  for (const source of ['https://other.example.com', 'null', '']) {
    const response = await handle(request(message, { headers: { origin: source, 'Content-Type': 'application/json' } }))
    assert.equal(response.status, 403)
  }
  assert.equal((await handle(request(message, { headers: { origin, 'Content-Type': 'text/plain' } }))).status, 415)
  // Un format annoncé comme JSON peut malgré tout contenir des données impossibles à décoder.
  assert.equal((await handle(request('{'))).status, 400)
})

test('la taille est limitée même sans Content-Length', async () => {
  // Le premier cas dépasse la limite réelle du flux ; le second permet un refus dès l’en-tête.
  // La taille du corps doit être contrôlée avant les limites propres aux champs du message.
  const handle = createContactHandler({ env, send: async () => assert.fail('Aucun envoi attendu') })
  const largeBody = JSON.stringify({ ...message, message: 'a'.repeat(20_001) })
  assert.equal((await handle(request(largeBody))).status, 413)
  assert.equal((await handle(request(message, {
    headers: { origin, 'Content-Type': 'application/json', 'Content-Length': '30000' },
  }))).status, 413)
})

test('une configuration absente ne produit pas de confirmation trompeuse', async () => {
  // L’existence du formulaire et de la route ne suffit pas à envoyer : une clé absente impose un échec explicite.
  const handle = createContactHandler({ env: {}, send: async () => assert.fail('Aucun envoi attendu') })
  const response = await handle(request())
  assert.equal(response.status, 503)
  assert.equal((await response.json()).success, undefined)
})

test('les refus, pannes et réponses invalides du prestataire restent des erreurs', async (t) => {
  // Un statut 2xx, un champ id d’un autre contrat ou un refus de doublon ne valent pas un messageId valide.
  // Les détails privés servent de marqueurs pour vérifier qu’ils ne remontent jamais au navigateur.
  const failures = [
    async () => new Response('private-provider-details', { status: 401 }),
    async () => new Response('private-provider-details', { status: 429 }),
    async () => new Response('<html>private-provider-details</html>'),
    async () => Response.json({}),
    async () => Response.json({ id: 'email-test' }),
    async () => Response.json({ messageId: '' }),
    async () => Response.json({ messageId: '   ' }),
    async () => Response.json({ messageId: 123 }),
    async () => Response.json({ code: 'duplicate_parameter', message: 'private-provider-details' }, { status: 400 }),
    async () => { throw new Error('private-provider-details') },
  ]
  for (const [index, send] of failures.entries()) {
    await t.test(`échec prestataire ${index + 1}`, async () => {
      const handle = createContactHandler({ env, send })
      const response = await handle(request())
      assert.equal(response.status, 502)
      const body = await response.text()
      assert.doesNotMatch(body, /private-provider-details|test-key|camille@example.com/)
      assert.doesNotMatch(body, /"success":true/)
    })
  }
})

test('un nouvel essai identique conserve son UUID de déduplication dans le corps Brevo', async () => {
  const keys = []
  const handle = createContactHandler({ env, send: async (_url, options) => {
    keys.push(JSON.parse(options.body).headers.idempotencyKey)
    return Response.json({ messageId: '<email-test@brevo.example>' }, { status: 201 })
  } })
  // Les espaces sont normalisés avant le calcul : ils ne doivent pas produire un second envoi distinct.
  // Un véritable changement de message doit au contraire obtenir un nouvel identifiant.
  await handle(request())
  await handle(request({ ...message, name: '  Camille  ' }))
  await handle(request({ ...message, message: 'Bonjour, voici un autre projet.' }))
  // La clé doit être un UUID (ici version 5), placé à l’endroit attendu par Brevo dans le corps JSON.
  assert.match(keys[0], /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
  assert.equal(keys[0], keys[1])
  assert.notEqual(keys[0], keys[2])
})

test('une prévisualisation Vercel peut soumettre depuis sa propre origine', async () => {
  // Comparer l’origine à l’URL appelée permet de tester un déploiement avant la publication sur le domaine final.
  const preview = 'https://etoiline-preview.vercel.app'
  const handle = createContactHandler({ env, send: async () => Response.json({ messageId: '<email-test@brevo.example>' }, { status: 201 }) })
  const response = await handle(new Request(`${preview}/api/contact`, {
    method: 'POST', headers: { origin: preview, 'Content-Type': 'application/json' }, body: JSON.stringify(message),
  }))
  assert.equal(response.status, 200)
})

test('le client attend une confirmation JSON explicite de la même API', async () => {
  // Le navigateur contacte la route du site ; il n’appelle pas Brevo et ne possède pas sa clé privée.
  await sendContactMessage(message, async (url, options) => {
    assert.equal(url, '/api/contact')
    assert.equal(options.method, 'POST')
    assert.deepEqual(JSON.parse(options.body), message)
    return Response.json({ success: true })
  })

  // Une page HTML de repli peut renvoyer 200 sans avoir traité le formulaire : elle doit rester un échec.
  for (const makeResponse of [
    () => new Response('<html>Portfolio</html>'),
    () => Response.json({ success: false }),
    () => Response.json({}),
    () => new Response('', { status: 503 }),
  ]) {
    await assert.rejects(sendContactMessage(message, async () => makeResponse()), /indisponible/)
  }
})

test('le client explique les limites et les erreurs réseau sans exposer leur détail', async () => {
  // Ces réponses sont celles reçues par le navigateur : 429 peut notamment venir d’une règle Vercel.
  // Le visiteur doit comprendre s’il faut attendre, corriger les champs ou réessayer après une panne.
  await assert.rejects(sendContactMessage(message, async () => new Response('', { status: 429 })), /tentatives rapprochées/)
  await assert.rejects(sendContactMessage(message, async () => new Response('', { status: 422 })), /Vérifiez votre nom/)
  await assert.rejects(sendContactMessage(message, async () => { throw new Error('private-network-error') }), /Votre message est conservé/)
})
