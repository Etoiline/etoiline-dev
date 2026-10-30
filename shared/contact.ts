/**
 * Contrat commun au formulaire React, au client HTTP et au traitement serveur.
 * Ce module ne dépend ni du DOM ni de Brevo : il peut être exécuté dans le navigateur et dans Node.js.
 * Les limites HTML aident la saisie ; cette validation doit aussi être appliquée à toute requête reçue.
 */
// Les longueurs portent sur les chaînes JavaScript, distinctes de la limite en octets du corps HTTP serveur.
export const contactLimits = {
  nameMin: 2,
  nameMax: 100,
  emailMax: 254,
  messageMin: 10,
  messageMax: 5000,
}

// `website` est un champ leurre ; le visiteur ne doit pas le remplir et aucun e-mail ne l’utilise.
export type ContactMessage = {
  name: string
  email: string
  message: string
  website: string
}

// Les mêmes limites s’appliquent au formulaire et au serveur, qui reste l’autorité.
// `unknown` impose de contrôler les types avant d’utiliser un JSON ou les valeurs d’un FormData.
// Un échec renvoie null ; une réussite fournit uniquement les quatre champs attendus, nettoyés aux extrémités.
export function parseContactMessage(value: unknown): ContactMessage | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null

  // Cette assertion donne accès aux propriétés, sans prétendre que leurs valeurs sont déjà des chaînes.
  const fields = value as Record<string, unknown>
  if (typeof fields.name !== 'string' || typeof fields.email !== 'string' || typeof fields.message !== 'string') return null
  if (fields.website !== undefined && typeof fields.website !== 'string') return null

  // Retirer les espaces périphériques évite les messages vides déguisés et stabilise la déduplication serveur.
  const name = fields.name.trim()
  const email = fields.email.trim()
  const message = fields.message.trim()
  const website = fields.website?.trim() || ''

  // Le champ leurre est facultatif pour les visiteurs et doit rester vide.
  if (website || name.length < contactLimits.nameMin || name.length > contactLimits.nameMax) return null
  // Ce contrôle de forme exclut notamment les espaces et retours à la ligne ; il ne prouve pas l’existence de la boîte.
  if (email.length > contactLimits.emailMax || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) return null
  if (message.length < contactLimits.messageMin || message.length > contactLimits.messageMax) return null

  return { name, email, message, website }
}
