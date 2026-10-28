import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createContactHandler } from '../server/contact.ts'
import { sendContactMessage } from '../src/lib/contact.ts'

const origin = 'https://etoiline.dev'
const message = { name: 'Camille', email: 'camille@example.com', message: 'Bonjour, parlons de mon projet.', website: '' }
const env = { RESEND_API_KEY: 'test-key-not-a-real-secret' }

function request(payload = message, options = {}) {
  return new Request(`${origin}/api/contact`, {
    method: 'POST',
    headers: { origin, 'Content-Type': 'application/json' },
    body: typeof payload === 'string' ? payload : JSON.stringify(payload),
    ...options,
  })
}

test('le serveur envoie au destinataire fixé et permet de répondre au visiteur', async () => {
  let sent
  const handle = createContactHandler({ env, send: async (url, options) => {
    sent = { url, options, body: JSON.parse(options.body) }
    return Response.json({ id: 'email-test' })
  } })

  const response = await handle(request({ ...message, name: '  Camille  ', to: 'other@example.com' }))
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { success: true })
  assert.equal(response.headers.get('Cache-Control'), 'no-store')
  assert.equal(sent.url, 'https://api.resend.com/emails')
  assert.deepEqual(sent.body.to, ['contact@etoiline.dev'])
  assert.equal(sent.body.from, 'Etoiline <contact@etoiline.dev>')
  assert.equal(sent.body.reply_to, message.email)
  assert.match(sent.body.text, /^Nom : Camille\n/)
  assert.equal(sent.body.html, undefined)
  assert.equal(sent.options.headers.Authorization, `Bearer ${env.RESEND_API_KEY}`)
})

test('les champs invalides et le champ leurre sont rejetés avant tout envoi', async (t) => {
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
      const handle = createContactHandler({ env, send: async () => assert.fail('Aucun envoi attendu') })
      assert.equal((await handle(request(payload))).status, 422)
    })
  }
})

test('les méthodes, origines et formats non autorisés sont refusés', async () => {
  const handle = createContactHandler({ env, send: async () => assert.fail('Aucun envoi attendu') })
  const getResponse = await handle(new Request(`${origin}/api/contact`))
  assert.equal(getResponse.status, 405)
  assert.equal(getResponse.headers.get('Allow'), 'POST')

  for (const source of ['https://other.example.com', 'null', '']) {
    const response = await handle(request(message, { headers: { origin: source, 'Content-Type': 'application/json' } }))
    assert.equal(response.status, 403)
  }
  assert.equal((await handle(request(message, { headers: { origin, 'Content-Type': 'text/plain' } }))).status, 415)
  assert.equal((await handle(request('{'))).status, 400)
})

test('la taille est limitée même sans Content-Length', async () => {
  const handle = createContactHandler({ env, send: async () => assert.fail('Aucun envoi attendu') })
  const largeBody = JSON.stringify({ ...message, message: 'a'.repeat(20_001) })
  assert.equal((await handle(request(largeBody))).status, 413)
  assert.equal((await handle(request(message, {
    headers: { origin, 'Content-Type': 'application/json', 'Content-Length': '30000' },
  }))).status, 413)
})

test('une configuration absente ne produit pas de confirmation trompeuse', async () => {
  const handle = createContactHandler({ env: {}, send: async () => assert.fail('Aucun envoi attendu') })
  const response = await handle(request())
  assert.equal(response.status, 503)
  assert.equal((await response.json()).success, undefined)
})

test('les refus, pannes et réponses invalides du prestataire restent des erreurs', async (t) => {
  const failures = [
    async () => new Response('private-provider-details', { status: 401 }),
    async () => new Response('private-provider-details', { status: 429 }),
    async () => new Response('<html>private-provider-details</html>'),
    async () => Response.json({}),
    async () => Response.json({ id: '' }),
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

test('un nouvel essai identique conserve sa clé de déduplication', async () => {
  const keys = []
  const handle = createContactHandler({ env, send: async (_url, options) => {
    keys.push(options.headers['Idempotency-Key'])
    return Response.json({ id: 'email-test' })
  } })
  await handle(request())
  await handle(request())
  await handle(request({ ...message, message: 'Bonjour, voici un autre projet.' }))
  assert.equal(keys[0], keys[1])
  assert.notEqual(keys[0], keys[2])
})

test('une prévisualisation Vercel peut soumettre depuis sa propre origine', async () => {
  const preview = 'https://etoiline-preview.vercel.app'
  const handle = createContactHandler({ env, send: async () => Response.json({ id: 'email-test' }) })
  const response = await handle(new Request(`${preview}/api/contact`, {
    method: 'POST', headers: { origin: preview, 'Content-Type': 'application/json' }, body: JSON.stringify(message),
  }))
  assert.equal(response.status, 200)
})

test('le client attend une confirmation JSON explicite de la même API', async () => {
  await sendContactMessage(message, async (url, options) => {
    assert.equal(url, '/api/contact')
    assert.equal(options.method, 'POST')
    assert.deepEqual(JSON.parse(options.body), message)
    return Response.json({ success: true })
  })

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
  await assert.rejects(sendContactMessage(message, async () => new Response('', { status: 429 })), /tentatives rapprochées/)
  await assert.rejects(sendContactMessage(message, async () => new Response('', { status: 422 })), /Vérifie ton nom/)
  await assert.rejects(sendContactMessage(message, async () => { throw new Error('private-network-error') }), /Ton message est conservé/)
})
