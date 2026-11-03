/**
 * Situe le parcours professionnel avant les projets personnels.
 * Le métier et la durée viennent du même profil que l’accueil pour éviter des informations divergentes.
 */
import type { JSX } from 'react'
import type { PortfolioProfile } from '../types/portfolio'

type ExperienceProps = Readonly<{ profile: PortfolioProfile }>

export default function Experience({ profile }: ExperienceProps): JSX.Element {
  return (
    <section id="experience" className="portfolio-section experience-section" aria-labelledby="experience-title">
      <div className="text-section page-width">
        <h2 id="experience-title" className="section-title">Expérience</h2>
        <article className="experience-copy" aria-labelledby="experience-role-title">
          <p className="eyebrow experience-context">{profile.yearsExperience} ans · Structure de 3 personnes</p>
          <h3 id="experience-role-title">
            {profile.role}
            <span className="experience-role">(Unique développeur Front de la structure)</span>
          </h3>
          <p className="experience-description">
            Pendant {profile.yearsExperience} ans, j’ai été le garant technique des interfaces de l’entreprise.
            {' '}Dans une structure de 3 personnes, j’ai géré le cycle de vie complet des applications,
            de la discussion du besoin client jusqu’à la mise en production, en passant par l’architecture
            React/TypeScript et l’intégration.
          </p>
        </article>
      </div>
    </section>
  )
}
