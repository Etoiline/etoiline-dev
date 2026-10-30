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
  const sending = useRef(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    // Le verrou couvre aussi deux soumissions arrivant avant le prochain rendu React.
    if (sending.current) return

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
      form.reset()
      setState({ status: 'success', message: 'Merci ! Votre message a bien été envoyé.' })
    } catch (error: unknown) {
      // Les champs sont conservés pour permettre un nouvel essai sans réécrire le message.
      setState({ status: 'error', message: error instanceof Error ? error.message : 'L’envoi a échoué. Vous pouvez réessayer.' })
    } finally {
      sending.current = false
    }
  }

  return {
    status: state.status,
    feedback: 'message' in state ? state.message : '',
    isSending: state.status === 'sending',
    handleSubmit,
  }
}
