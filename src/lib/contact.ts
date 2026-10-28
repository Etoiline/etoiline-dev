import type { ContactMessage } from '../../shared/contact.ts'

const unavailableMessage = 'L’envoi est indisponible pour le moment. Ton message est conservé ; tu peux réessayer plus tard.'

export async function sendContactMessage(message: ContactMessage, send: typeof fetch = fetch): Promise<void> {
  let response: Response
  try {
    response = await send('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(message),
      signal: AbortSignal.timeout(15_000),
    })
  } catch {
    throw new Error('La connexion a échoué. Ton message est conservé ; tu peux réessayer.')
  }

  if (!response.ok) {
    if (response.status === 429) throw new Error('Trop de tentatives rapprochées. Attends quelques minutes avant de réessayer.')
    if (response.status === 422) throw new Error('Vérifie ton nom, ton adresse e-mail et ton message (10 à 5 000 caractères).')
    throw new Error(unavailableMessage)
  }

  // Une page HTML de repli ou un simple statut 200 ne prouve pas qu’un e-mail a été envoyé.
  const result: unknown = await response.json().catch(() => null)
  if (!result || typeof result !== 'object' || !('success' in result) || result.success !== true) {
    throw new Error(unavailableMessage)
  }
}
