import { createContactHandler } from '../server/contact.ts'

// Vercel expose cette fonction sur /api/contact et conserve la clé d’envoi côté serveur.
export default { fetch: createContactHandler() }
