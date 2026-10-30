import type { JSX } from 'react'
import type { SkillGroup } from '../types/portfolio'
import TechnologyList from './TechnologyList'

type StackProps = Readonly<{ groups: readonly SkillGroup[] }>

export default function Stack({ groups }: StackProps): JSX.Element {
  return (
    <section id="stack" className="portfolio-section stack-section" aria-labelledby="stack-title">
      <div className="page-width">
        <h2 id="stack-title" className="section-title">Stack</h2>
        <ul className="stack-grid">
          {groups.map((group) => (
            <li key={group.id}>
              <h3>{group.title}</h3>
              <p>{group.description}</p>
              <TechnologyList technologies={group.technologies} label={'Compétences : ' + group.title} />
            </li>
          ))}
        </ul>
        <p className="stack-note">Je m’appuie aussi sur FastAPI, PostgreSQL et Docker pour développer le backend de mes projets personnels.</p>
      </div>
    </section>
  )
}
