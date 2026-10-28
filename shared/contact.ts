export const contactLimits = {
  nameMin: 2,
  nameMax: 100,
  emailMax: 254,
  messageMin: 10,
  messageMax: 5000,
}

export type ContactMessage = {
  name: string
  email: string
  message: string
  website: string
}

// Les mêmes limites s’appliquent au formulaire et au serveur, qui reste l’autorité.
export function parseContactMessage(value: unknown): ContactMessage | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null

  const fields = value as Record<string, unknown>
  if (typeof fields.name !== 'string' || typeof fields.email !== 'string' || typeof fields.message !== 'string') return null
  if (fields.website !== undefined && typeof fields.website !== 'string') return null

  const name = fields.name.trim()
  const email = fields.email.trim()
  const message = fields.message.trim()
  const website = (fields.website as string | undefined)?.trim() || ''

  // Le champ leurre est facultatif pour les visiteurs et doit rester vide.
  if (website || name.length < contactLimits.nameMin || name.length > contactLimits.nameMax) return null
  if (email.length > contactLimits.emailMax || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) return null
  if (message.length < contactLimits.messageMin || message.length > contactLimits.messageMax) return null

  return { name, email, message, website }
}
