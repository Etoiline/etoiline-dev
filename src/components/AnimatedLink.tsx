/**
 * Lien partagé dont la flèche accompagne le survol et le focus clavier.
 * L’URL et le contenu restent fournis par l’appelant ; ExternalLink ajoute la politique de nouvel onglet.
 */
import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import type { HTMLAttributeAnchorTarget, JSX, ReactNode } from 'react'
import { ArrowIcon } from './Icons'

type AnimatedLinkProps = Readonly<{
  href: string
  children: ReactNode
  className?: string
  /** Oriente la flèche vers le haut à droite, notamment pour une destination externe. */
  diagonal?: boolean
  target?: HTMLAttributeAnchorTarget
  rel?: string
}>

export default function AnimatedLink({ children, diagonal = false, ...props }: AnimatedLinkProps): JSX.Element {
  // Garder l’état de repos désactive les déplacements lorsque le visiteur réduit les animations.
  const interaction = useReducedMotion() ? 'rest' : 'active'

  // L’état de repos est aussi celui du HTML pré-rendu, sans apparition masquée.
  return (
    <m.a
      {...props}
      initial={false}
      animate="rest"
      whileHover={interaction}
      whileFocus={interaction}
    >
      {children}
      {/* La flèche est décorative : le texte du lien doit suffire à comprendre sa destination. */}
      <m.span
        className="link-arrow"
        aria-hidden="true"
        variants={{ rest: { x: 0, y: 0 }, active: { x: 3, y: diagonal ? -3 : 0 } }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
      >
        <ArrowIcon diagonal={diagonal} />
      </m.span>
    </m.a>
  )
}
