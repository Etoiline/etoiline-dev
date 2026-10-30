import type { JSX } from 'react'

type TechnologyListProps = Readonly<{
  technologies: readonly string[]
  label: string
}>

export default function TechnologyList({ technologies, label }: TechnologyListProps): JSX.Element | null {
  if (technologies.length === 0) return null

  return (
    <ul className="technology-list" aria-label={label}>
      {technologies.map((technology) => <li key={technology}>{technology}</li>)}
    </ul>
  )
}
