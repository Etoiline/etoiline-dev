import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import type { JSX } from 'react'
import { contactLimits } from '../../../shared/contact.ts'
import { ArrowIcon } from '../../components/Icons'
import { useContactForm } from './hooks/useContactForm'

function ContactForm(): JSX.Element {
  const { status, feedback, isSending, handleSubmit } = useContactForm()
  const reducedMotion = useReducedMotion()

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
        <m.button
          className="contact-submit"
          type="submit"
          initial={false}
          animate={{ scale: 1 }}
          whileTap={{ scale: reducedMotion || isSending ? 1 : 0.98 }}
          transition={{ duration: 0.12, ease: 'easeOut' }}
        >
          <span>{isSending ? 'Envoi en cours…' : 'Envoyer le message'}</span>
          {isSending ? (
            <m.svg
              className="contact-submit-icon"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              focusable="false"
              initial={{ rotate: 0 }}
              animate={{ rotate: reducedMotion ? 0 : 360 }}
              transition={{ duration: 0.8, ease: 'linear', repeat: reducedMotion ? 0 : Infinity }}
            >
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" opacity="0.3" />
              <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </m.svg>
          ) : <ArrowIcon className="contact-submit-icon" />}
        </m.button>
      </fieldset>
      <p className="contact-status" data-state={status} role="status" aria-live="polite" aria-atomic="true">
        {status === 'success' && (
          // La coche apparaît uniquement après la réussite de l’envoi ; le texte reste immédiatement lisible.
          <svg className="contact-success-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
            <m.path d="m5 12 4 4 10-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: reducedMotion ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: reducedMotion ? 0 : 0.2, ease: 'easeOut' }} />
          </svg>
        )}
        {feedback}
      </p>
    </form>
  )
}

export default ContactForm
