/**
 * Client HTTP du formulaire : envoie le message au serveur du site et interprète son résultat.
 * Il ne connaît ni la clé Brevo ni le destinataire final, qui restent dans server/contact.ts.
 * Les tests remplacent `send` pour simuler les réponses sans requête réseau ni e-mail réel.
 */
import type { ContactMessage } from '../../shared/contact.ts'

// Le hook conserve les champs en cas d’échec ; cette conservation ne persiste pas après un rechargement de page.
const unavailableMessage = 'L’envoi est indisponible pour le moment. Votre message est conservé ; vous pouvez réessayer plus tard.'

// La promesse réussit sans valeur : le hook gère ensuite la confirmation et la remise à zéro du formulaire.
export async function sendContactMessage(message: ContactMessage, send: typeof fetch = fetch): Promise<void> {
  let response: Response
  try {
    // Le chemin relatif utilise la même origine en production et sur les prévisualisations Vercel.
    response = await send('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(message),
      // Le délai dépasse les dix secondes laissées au serveur pour obtenir la réponse de Brevo.
      signal: AbortSignal.timeout(15_000),
    })
  } catch {
    // Une erreur réseau ou un délai dépassé devient un message exploitable, sans détails techniques privés.
    throw new Error('La connexion a échoué. Votre message est conservé ; vous pouvez réessayer.')
  }

  if (!response.ok) {
    // Le pare-feu peut renvoyer 429 sans JSON : le statut suffit et évite de dépendre de sa page d’erreur.
    if (response.status === 429) throw new Error('Trop de tentatives rapprochées. Patientez quelques minutes avant de réessayer.')
    if (response.status === 422) throw new Error('Vérifiez votre nom, votre adresse e-mail et votre message (10 à 5 000 caractères).')
    throw new Error(unavailableMessage)
  }

  // Une page HTML de repli ou un simple statut 200 ne prouve pas qu’un e-mail a été envoyé.
  const result: unknown = await response.json().catch(() => null)
  if (!result || typeof result !== 'object' || !('success' in result) || result.success !== true) {
    throw new Error(unavailableMessage)
  }
}
