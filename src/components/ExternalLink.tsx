import type { JSX, ReactNode } from 'react'
import type { ExternalUrl } from '../types/portfolio'
import AnimatedLink from './AnimatedLink'

type ExternalLinkProps = Readonly<{
  href: ExternalUrl
  children: ReactNode
  className?: string
}>

// L’annonce du nouvel onglet et les protections restent identiques sur tous les liens externes.
export default function ExternalLink({ href, children, className = 'plain-link' }: ExternalLinkProps): JSX.Element {
  return (
    <AnimatedLink className={className} href={href} target="_blank" rel="noopener noreferrer" diagonal>
      {children}<span className="sr-only"> (nouvel onglet)</span>
    </AnimatedLink>
  )
}
