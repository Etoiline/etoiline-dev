/**
 * Interface du formulaire : champs, aide de saisie, bouton et retour accessible.
 * Le hook porte la logique d’envoi ; les contraintes HTML reprennent les limites partagées avec le serveur.
 * Aucun identifiant Brevo ni contenu saisi n’est enregistré dans un stockage persistant par ce composant.
 */
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
    // L’état occupé est annoncé aux technologies d’assistance ; l’aide reste associée au formulaire.
    <form className="contact-form" method="post" onSubmit={handleSubmit} aria-busy={isSending} aria-describedby="contact-help">
      <p id="contact-help" className="contact-help">Tous les champs sont obligatoires.</p>
      {/* Le fieldset désactive ensemble la saisie et le bouton pendant l’attente de la réponse. */}
      <fieldset disabled={isSending}>
        <legend className="sr-only">Écrire à Etoiline</legend>
        {/* Les labels utilisent les id pour le focus ; les name fournissent les clés lues par FormData. */}
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
        {/* Ce champ caché et exclu du clavier piège les robots simples ; le serveur exige qu’il reste vide. */}
        <div className="contact-honeypot" aria-hidden="true">
          <label htmlFor="contact-website">Laisser ce champ vide</label>
          <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
        {/* La pression anime le bouton sans modifier sa taille dans la mise en page. */}
        <m.button
          className="contact-submit"
          type="submit"
          initial={false}
          animate={{ scale: 1 }}
          whileTap={{ scale: reducedMotion || isSending ? 1 : 0.98 }}
          transition={{ duration: 0.12, ease: 'easeOut' }}
        >
          <span>{isSending ? 'Envoi en cours…' : 'Envoyer le message'}</span>
          {/* L’indicateur reste visible mais fixe si le visiteur a demandé moins de mouvements. */}
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
      {/* La zone existe dès le premier rendu pour annoncer ses mises à jour ; data-state pilote sa couleur en CSS. */}
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
