import { createHash } from 'node:crypto'
import { parseContactMessage } from '../shared/contact.ts'

// L’adresse de réception reste dans le code serveur pour ne pas être publiée dans le JavaScript du site.
const contactEmail = 'contact@etoiline.dev'

type ContactEnvironment = {
  RESEND_API_KEY?: string
  CONTACT_FROM?: string
}

type ContactOptions = {
  env?: ContactEnvironment
  send?: typeof fetch
}

const maxBodyBytes = 20_000

class BodyTooLargeError extends Error {}

function reply(status: number, body: { success: true } | { error: string }, headers?: Record<string, string>) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store', ...headers },
  })
}

// La limite porte aussi sur les requêtes sans en-tête Content-Length.
async function readPayload(request: Request): Promise<unknown> {
  if (Number(request.headers.get('content-length')) > maxBodyBytes) throw new BodyTooLargeError()
  const reader = request.body?.getReader()
  if (!reader) throw new Error('Corps absent')

  const chunks: Uint8Array[] = []
  let length = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      length += value.byteLength
      if (length > maxBodyBytes) {
        await reader.cancel()
        throw new BodyTooLargeError()
      }
      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }

  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

export function createContactHandler({ env = process.env, send = fetch }: ContactOptions = {}) {
  return async (request: Request): Promise<Response> => {
    if (request.method !== 'POST') return reply(405, { error: 'Méthode non autorisée.' }, { Allow: 'POST' })

    // Le navigateur soumet uniquement depuis le même domaine, y compris en prévisualisation Vercel.
    if (request.headers.get('origin') !== new URL(request.url).origin) {
      return reply(403, { error: 'Origine non autorisée.' })
    }
    if (request.headers.get('content-type')?.split(';')[0]?.trim() !== 'application/json') {
      return reply(415, { error: 'Format de message non pris en charge.' })
    }

    let payload: unknown
    try {
      payload = await readPayload(request)
    } catch (error) {
      return error instanceof BodyTooLargeError
        ? reply(413, { error: 'Le message est trop volumineux.' })
        : reply(400, { error: 'Le message est illisible.' })
    }

    const message = parseContactMessage(payload)
    if (!message) return reply(422, { error: 'Vérifie les champs du formulaire.' })

    const apiKey = env.RESEND_API_KEY?.trim()
    if (!apiKey) return reply(503, { error: 'L’envoi est temporairement indisponible.' })

    // Le destinataire et l’expéditeur ne proviennent jamais des champs du visiteur.
    const email = {
      from: env.CONTACT_FROM?.trim() || `Etoiline <${contactEmail}>`,
      to: [contactEmail],
      reply_to: message.email,
      subject: '[Etoiline] Nouveau message du portfolio',
      text: `Nom : ${message.name}\nE-mail : ${message.email}\n\n${message.message}`,
    }

    // Un nouvel essai identique réutilise la clé Resend pour éviter les doubles envois.
    const idempotencyKey = createHash('sha256').update(JSON.stringify(email)).digest('hex')
    try {
      const response = await send('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': `contact-${idempotencyKey}`,
        },
        body: JSON.stringify(email),
        signal: AbortSignal.timeout(10_000),
      })

      if (!response.ok) return reply(502, { error: 'Le service d’envoi est indisponible.' })
      const result: unknown = await response.json()
      if (!result || typeof result !== 'object' || !('id' in result) || typeof result.id !== 'string' || !result.id) {
        return reply(502, { error: 'L’envoi n’a pas pu être confirmé.' })
      }
      return reply(200, { success: true })
    } catch {
      // Les erreurs du prestataire ne doivent exposer ni clé ni contenu du message.
      return reply(502, { error: 'Le service d’envoi est indisponible.' })
    }
  }
}
