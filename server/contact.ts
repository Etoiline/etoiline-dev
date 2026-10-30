/**
 * Transforme une soumission du formulaire en demande d’envoi d’e-mail à Brevo.
 * `api/contact.ts` appelle ce traitement côté serveur pour chaque requête reçue.
 * Le navigateur transmet les champs ; ce module les valide, prépare l’e-mail et
 * renvoie un résultat JSON qui permet au formulaire d’afficher un succès ou une erreur.
 *
 * Le code ne crée pas de compte Brevo et ne configure pas Vercel : l’envoi nécessite
 * une clé API et un expéditeur configurés au préalable. La confirmation de Brevo
 * signifie que la demande a été acceptée, pas que l’e-mail est déjà arrivé en boîte.
 */
import { createHash } from 'node:crypto'
import { parseContactMessage } from '../shared/contact.ts'

// L’adresse de réception reste dans le code serveur pour ne pas être publiée dans le JavaScript du site.
const contactEmail = 'contact@etoiline.dev'

type ContactEnvironment = {
  /** Clé privée de l’API HTTP Brevo, requise à l’exécution ; une clé SMTP ne convient pas. */
  BREVO_API_KEY?: string
  /** Adresse seule d’un expéditeur Brevo ; sans valeur, l’adresse de contact est utilisée. */
  CONTACT_FROM?: string
}

// La configuration et l’appel réseau peuvent être remplacés pour tester sans vrai compte ni envoi.
type ContactOptions = {
  env?: ContactEnvironment
  send?: typeof fetch
}

// Cette limite concerne le corps JSON complet en octets, pas le nombre de caractères du message.
const maxBodyBytes = 20_000

// Une erreur dédiée distingue un dépassement de taille d’un JSON illisible dans la réponse HTTP.
class BodyTooLargeError extends Error {}

/**
 * Produit l’identifiant stable que Brevo utilise pour repérer les demandes identiques.
 * La clé dépend de l’e-mail normalisé, y compris de son expéditeur et de son destinataire.
 * Elle reste identique sur une autre instance Vercel, sans cache ni base de données.
 * SHA-1 fait partie du format UUIDv5 : cet identifiant sert à la déduplication,
 * tandis que l’authentification auprès de Brevo repose sur BREVO_API_KEY.
 */
function createIdempotencyKey(content: string): string {
  // Cet espace de noms propre au portfolio doit rester fixe pour conserver les clés des nouveaux essais.
  const namespace = Buffer.from('8b33c0db8ab54a419d1d2439adf455e3', 'hex')
  const bytes = createHash('sha1').update(namespace).update(content).digest().subarray(0, 16)
  // La version et la variante occupent des bits réservés dans le format UUID.
  bytes.writeUInt8((bytes.readUInt8(6) & 0x0f) | 0x50, 6)
  bytes.writeUInt8((bytes.readUInt8(8) & 0x3f) | 0x80, 8)
  const hex = bytes.toString('hex')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

// Le navigateur reçoit notre contrat de réponse, sans les données brutes de Brevo.
// `no-store` demande aux caches de ne pas conserver le résultat d’une tentative d’envoi.
function reply(status: number, body: { success: true } | { error: string }, headers?: Record<string, string>) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store', ...headers },
  })
}

/**
 * Lit un corps JSON sans accepter plus de données que la limite autorisée.
 * Content-Length peut être absent ou incorrect : chaque segment reçu est aussi mesuré.
 * Le résultat reste `unknown`, car un JSON valide peut contenir autre chose que les champs attendus.
 */
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
        // Arrêter la lecture évite de recevoir et de garder en mémoire le reste d’un corps trop volumineux.
        await reader.cancel()
        throw new BodyTooLargeError()
      }
      chunks.push(value)
    }
  } finally {
    // Le verrou du flux est libéré même si la lecture échoue ou dépasse la limite.
    reader.releaseLock()
  }

  // Décoder après assemblage préserve les caractères UTF-8 répartis entre plusieurs segments.
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

/**
 * Prépare le gestionnaire HTTP sans déclencher d’envoi à ce stade.
 * En production, les dépendances par défaut sont les variables privées et le fetch de Node.js.
 * Les tests injectent leurs propres valeurs pour simuler la configuration et les réponses de Brevo.
 */
export function createContactHandler({ env = process.env, send = fetch }: ContactOptions = {}) {
  return async (request: Request): Promise<Response> => {
    // Cette route reçoit des soumissions POST ; l’ouvrir comme une page dans un navigateur produit un GET.
    if (request.method !== 'POST') return reply(405, { error: 'Méthode non autorisée.' }, { Allow: 'POST' })

    // L’origine doit avoir le même protocole, hôte et port que l’URL appelée, y compris en prévisualisation.
    // Ce contrôle filtre les soumissions d’autres sites, sans empêcher un robot de fabriquer cet en-tête.
    if (request.headers.get('origin') !== new URL(request.url).origin) {
      return reply(403, { error: 'Origine non autorisée.' })
    }
    // Le client React transmet du JSON ; un formulaire encodé autrement n’est pas pris en charge ici.
    if (request.headers.get('content-type')?.split(';')[0]?.trim() !== 'application/json') {
      return reply(415, { error: 'Format de message non pris en charge.' })
    }

    let payload: unknown
    try {
      payload = await readPayload(request)
    } catch (error) {
      // Un corps trop grand reçoit 413 ; un corps absent ou un JSON malformé reçoit 400.
      return error instanceof BodyTooLargeError
        ? reply(413, { error: 'Le message est trop volumineux.' })
        : reply(400, { error: 'Le message est illisible.' })
    }

    // Les règles partagées nettoient les champs et vérifient aussi le champ leurre contre les robots simples.
    // Les contrôles du navigateur peuvent être contournés : cette validation serveur reste obligatoire.
    const message = parseContactMessage(payload)
    if (!message) return reply(422, { error: 'Vérifie les champs du formulaire.' })

    // Une clé absente arrête le traitement avant tout appel réseau, avec une indisponibilité explicite.
    const apiKey = env.BREVO_API_KEY?.trim()
    if (!apiKey) return reply(503, { error: 'L’envoi est temporairement indisponible.' })

    // Le destinataire et l’expéditeur ne proviennent jamais des champs du visiteur.
    // Son adresse est utilisée seulement dans replyTo, pour pouvoir lui répondre depuis la boîte de réception.
    // textContent conserve le message en texte brut, sans interpréter une éventuelle saisie HTML.
    const email = {
      sender: { name: 'Etoiline', email: env.CONTACT_FROM?.trim() || contactEmail },
      to: [{ email: contactEmail }],
      replyTo: { email: message.email },
      subject: '[Etoiline] Nouveau message du portfolio',
      textContent: `Nom : ${message.name}\nE-mail : ${message.email}\n\n${message.message}`,
    }

    // La déduplication se configure dans le corps JSON, parmi les en-têtes de l’e-mail.
    // Ce champ `headers` est distinct des en-têtes HTTP, dont `api-key` authentifie l’appel à Brevo.
    const idempotencyKey = createIdempotencyKey(JSON.stringify(email))
    try {
      const response = await send('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': apiKey,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...email, headers: { idempotencyKey } }),
        // Le client attend au maximum 15 secondes ; cet appel laisse un délai pour lui renvoyer une erreur.
        signal: AbortSignal.timeout(10_000),
      })

      // Un refus de Brevo, notamment un doublon, ne doit pas produire de confirmation de réussite.
      if (!response.ok) return reply(502, { error: 'Le service d’envoi est indisponible.' })
      const result: unknown = await response.json()
      // Un statut HTTP réussi ne suffit pas : on exige aussi l’identifiant de prise en charge de Brevo.
      // Cette validation à l’exécution est nécessaire, car les types ne garantissent pas le JSON d’un service externe.
      if (!result || typeof result !== 'object' || !('messageId' in result) || typeof result.messageId !== 'string' || !result.messageId.trim()) {
        return reply(502, { error: 'L’envoi n’a pas pu être confirmé.' })
      }
      return reply(200, { success: true })
    } catch {
      // Les erreurs du prestataire ne doivent exposer ni clé ni contenu du message.
      return reply(502, { error: 'Le service d’envoi est indisponible.' })
    }
  }
}
