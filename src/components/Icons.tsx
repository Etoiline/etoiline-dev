/**
 * Petits pictogrammes SVG réutilisés dans la navigation, les liens et les projets.
 * Ils héritent de la couleur du texte avec currentColor et acceptent les attributs SVG usuels.
 * Ils restent décoratifs : leur lien ou bouton parent doit fournir un libellé compréhensible.
 */
import type { JSX, SVGProps } from 'react'

// Le viewBox définit le repère du dessin ; la taille visible est réglée par le CSS ou les attributs reçus.
export function StarIcon(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg {...props} viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false">
      <path d="M16 0 20.1 11.9 32 16 20.1 20.1 16 32 11.9 20.1 0 16 11.9 11.9Z" fill="currentColor" />
    </svg>
  )
}

// Une seule icône couvre les flèches horizontales et celles des liens externes.
type ArrowIconProps = SVGProps<SVGSVGElement> & Readonly<{ diagonal?: boolean }>

export function ArrowIcon({ diagonal = false, ...props }: ArrowIconProps): JSX.Element {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path
        d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h16m-6-6 6 6-6 6'}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
