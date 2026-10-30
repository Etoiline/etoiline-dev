import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import type { HTMLAttributeAnchorTarget, JSX, ReactNode } from 'react'
import { ArrowIcon } from './Icons'

type AnimatedLinkProps = Readonly<{
  href: string
  children: ReactNode
  className?: string
  diagonal?: boolean
  target?: HTMLAttributeAnchorTarget
  rel?: string
}>

export default function AnimatedLink({ children, diagonal = false, ...props }: AnimatedLinkProps): JSX.Element {
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
