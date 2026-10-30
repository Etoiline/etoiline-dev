/**
 * Point d’entrée du formulaire de contact pour l’hébergement sur Vercel.
 *
 * Vercel associe ce fichier du dossier `api/` à l’URL `/api/contact`.
 * Le formulaire y envoie une requête POST contenant le nom, l’e-mail et le message
 * au format JSON ; il reçoit ensuite une confirmation ou une erreur en JSON.
 * Le gestionnaire renvoie `{ success: true }` après acceptation par Brevo, ou
 * `{ error: ... }` avec un statut HTTP d’erreur si la demande ne peut pas aboutir.
 *
 * Le traitement est délégué à `server/contact.ts` : contrôle de la requête,
 * validation des champs et envoi de l’e-mail avec Brevo. La clé d’envoi et
 * l’adresse du destinataire restent côté serveur, hors du JavaScript du navigateur.
 * L’existence de cette route ne suffit pas à activer l’envoi : BREVO_API_KEY et
 * l’expéditeur doivent être configurés séparément, comme indiqué dans `.env.example`.
 *
 * La propriété `fetch` ci-dessous désigne la fonction appelée par Vercel pour
 * une requête entrante. L’appel réseau sortant vers Brevo se trouve dans le serveur.
 *
 * Cette séparation permet de réutiliser le traitement sur un autre hébergeur
 * compatible avec Node.js, en lui fournissant un point d’entrée adapté.
 * Le serveur Vite seul ne lance pas cette fonction ; `vercel dev` permet de tester
 * localement l’interface et la route ensemble, comme expliqué dans le README.
 * Une règle de limitation du pare-feu Vercel agit en amont : elle peut répondre 429
 * sans exécuter ce module, et sa configuration n’est pas enregistrée dans ce fichier.
 */
import { createContactHandler } from '../server/contact.ts'

// La fabrique prépare le gestionnaire au chargement du module, sans envoyer d’e-mail.
// Vercel appelle ensuite ce gestionnaire pour chaque requête via la propriété `fetch`.
export default { fetch: createContactHandler() }
