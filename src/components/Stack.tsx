/**
 * Affiche les compétences par domaine à partir des groupes définis dans data/portfolio.ts.
 * La liste de technologies est partagée avec les fiches projet pour garder les mêmes conventions HTML.
 */
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
          {/* Les identifiants viennent des données, afin de rester stables si les groupes changent d’ordre. */}
          {groups.map((group) => (
            <li key={group.id}>
              <h3>{group.title}</h3>
              <p>{group.description}</p>
              <TechnologyList technologies={group.technologies} label={'Compétences : ' + group.title} />
            </li>
          ))}
        </ul>
        {/* Cette précision éditoriale complète les groupes sans les présenter comme une nouvelle catégorie. */}
        <p className="stack-note">Je m’appuie aussi sur FastAPI, PostgreSQL et Docker pour développer le backend de mes projets personnels.</p>
      </div>
    </section>
  )
}
