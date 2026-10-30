/**
 * Rend une liste sémantique de technologies, stylée comme des badges selon son contexte CSS.
 * Le libellé accessible distingue les compétences générales de la stack d’un projet donné.
 */
import type { JSX } from 'react'

type TechnologyListProps = Readonly<{
  technologies: readonly string[]
  label: string
}>

export default function TechnologyList({ technologies, label }: TechnologyListProps): JSX.Element | null {
  // Ne pas créer une liste vide évite un élément inutile dans la mise en page et la lecture assistée.
  if (technologies.length === 0) return null

  return (
    <ul className="technology-list" aria-label={label}>
      {/* Les libellés servent de clés : une même liste doit donc éviter les doublons de technologie. */}
      {technologies.map((technology) => <li key={technology}>{technology}</li>)}
    </ul>
  )
}
