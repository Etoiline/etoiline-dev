/**
 * Applique la même convention aux liens HTTPS qui ouvrent un nouvel onglet.
 * Il réutilise AnimatedLink pour l’aspect visuel et complète son comportement HTML.
 */
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
    // noopener coupe l’accès à window.opener ; noreferrer supprime l’en-tête Referer vers la destination.
    <AnimatedLink className={className} href={href} target="_blank" rel="noopener noreferrer" diagonal>
      {/* L’annonce complète le lien pour les lecteurs d’écran, sans répéter visuellement son libellé. */}
      {children}<span className="sr-only"> (nouvel onglet)</span>
    </AnimatedLink>
  )
}
