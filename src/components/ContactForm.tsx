import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { contactLimits, parseContactMessage } from '../../shared/contact.ts'
import { sendContactMessage } from '../lib/contact'

function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [feedback, setFeedback] = useState('')
  const sending = useRef(false)
  const isSending = status === 'sending'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // Le verrou couvre aussi deux soumissions arrivant avant le prochain rendu React.
    if (sending.current) return

    const form = event.currentTarget
    const data = new FormData(form)
    const message = parseContactMessage(Object.fromEntries(data))
    if (!message) {
      setStatus('error')
      setFeedback('Vérifie ton nom, ton adresse e-mail et ton message (10 à 5 000 caractères).')
      return
    }

    sending.current = true
    setStatus('sending')
    setFeedback('')
    try {
      await sendContactMessage(message)
      form.reset()
      setStatus('success')
      setFeedback('Merci ! Ton message a bien été envoyé.')
    } catch (error) {
      // Les champs sont conservés pour permettre un nouvel essai sans réécrire le message.
      setStatus('error')
      setFeedback(error instanceof Error ? error.message : 'L’envoi a échoué. Tu peux réessayer.')
    } finally {
      sending.current = false
    }
  }

  return (
    <form className="contact-form" method="post" onSubmit={handleSubmit} aria-busy={isSending} aria-describedby="contact-help">
      <p id="contact-help" className="contact-help">Tous les champs sont obligatoires.</p>
      <fieldset disabled={isSending}>
        <legend className="sr-only">Écrire à Etoiline</legend>
        <div className="contact-field">
          <label htmlFor="contact-name">Nom</label>
          <input id="contact-name" name="name" autoComplete="name" required minLength={contactLimits.nameMin} maxLength={contactLimits.nameMax} />
        </div>
        <div className="contact-field">
          <label htmlFor="contact-email">Adresse e-mail</label>
          <input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={contactLimits.emailMax} />
        </div>
        <div className="contact-field">
          <label htmlFor="contact-message">Message</label>
          <textarea id="contact-message" name="message" rows={6} required minLength={contactLimits.messageMin} maxLength={contactLimits.messageMax} />
        </div>
        <div className="contact-honeypot" aria-hidden="true">
          <label htmlFor="contact-website">Laisser ce champ vide</label>
          <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
        <button className="contact-submit" type="submit">{isSending ? 'Envoi en cours…' : 'Envoyer le message'}</button>
      </fieldset>
      <p className="contact-status" data-state={status} role="status" aria-live="polite" aria-atomic="true">{feedback}</p>
    </form>
  )
}

export default ContactForm
