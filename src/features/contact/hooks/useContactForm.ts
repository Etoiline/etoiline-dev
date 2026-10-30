/**
 * Sépare la logique de soumission du balisage de ContactForm.
 * Les valeurs restent dans les champs HTML ; React conserve seulement l’avancement et le retour à afficher.
 * Le parcours est : validation, envoi, puis succès ou erreur, avec un seul envoi en cours dans cette interface.
 */
import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { parseContactMessage } from '../../../../shared/contact.ts'
import { sendContactMessage } from '../../../lib/contact'

// Le message n’existe que pour un résultat, afin d’éviter les combinaisons d’états incohérentes.
type ContactState =
  | Readonly<{ status: 'idle' | 'sending' }>
  | Readonly<{ status: 'success' | 'error'; message: string }>

export function useContactForm() {
  const [state, setState] = useState<ContactState>({ status: 'idle' })
  // La ref change immédiatement sans attendre un rendu ; l’état React sert à mettre l’interface à jour.
  const sending = useRef(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    // React prend en charge l’envoi asynchrone au lieu de laisser le navigateur charger une autre page.
    event.preventDefault()
    // Le verrou couvre aussi deux soumissions arrivant avant le prochain rendu React.
    if (sending.current) return

    // Capturer l’élément avant l’attente permet ensuite de réinitialiser exactement le formulaire soumis.
    // FormData utilise les attributs name des champs, qui doivent correspondre au contrat partagé.
    const form = event.currentTarget
    const message = parseContactMessage(Object.fromEntries(new FormData(form)))
    if (!message) {
      setState({ status: 'error', message: 'Vérifiez votre nom, votre adresse e-mail et votre message (10 à 5 000 caractères).' })
      return
    }

    sending.current = true
    setState({ status: 'sending' })
    try {
      await sendContactMessage(message)
      // Effacer la saisie uniquement après la confirmation explicite de l’API.
      form.reset()
      setState({ status: 'success', message: 'Merci ! Votre message a bien été envoyé.' })
    } catch (error: unknown) {
      // Les champs sont conservés pour permettre un nouvel essai sans réécrire le message.
      setState({ status: 'error', message: error instanceof Error ? error.message : 'L’envoi a échoué. Vous pouvez réessayer.' })
    } finally {
      // Libérer le verrou après toute issue permet une nouvelle soumission après un succès ou un échec.
      sending.current = false
    }
  }

  // Le composant reçoit un état d’affichage simple ; il n’a pas à connaître la validation ni le protocole HTTP.
  return {
    status: state.status,
    feedback: 'message' in state ? state.message : '',
    isSending: state.status === 'sending',
    handleSubmit,
  }
}
