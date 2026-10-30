/**
 * Déplie le récit STAR et la chronologie d’un projet à partir de ses données éditoriales.
 * details/summary assurent l’ouverture native au clavier, y compris dans le HTML pré-rendu sans JavaScript.
 */
import type { JSX } from 'react'
import { ArrowIcon } from '../../components/Icons'
// L’alias distingue le type des données du composant React qui porte le même nom.
import type { ProjectCaseStudy as CaseStudy } from '../../types/portfolio'

type ProjectCaseStudyProps = Readonly<{ projectId: string; projectName: string; study: CaseStudy }>

// Le fuseau UTC garde les dates ISO identiques au pré-rendu et dans le navigateur.
const timelineDateFormat = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

export default function ProjectCaseStudy({ projectId, projectName, study }: ProjectCaseStudyProps): JSX.Element {
  // L’ouverture native évite de masquer le contenu après son affichage et de provoquer un scintillement.
  return (
    <details className="project-case-study">
      <summary>Voir l’étude de cas<span className="sr-only"> de {projectName}</span><ArrowIcon /></summary>
      <div className="case-study">
        {/* La liste de définitions associe chaque partie du récit à sa réponse avec les éléments dt et dd. */}
        <dl className="case-study-grid">
          <div><dt>Le besoin</dt><dd>{study.situation}</dd></div>
          <div><dt>Mon rôle</dt><dd>{study.task}</dd></div>
          <div>
            <dt>La réalisation</dt>
            <dd><ul>{study.actions.map((action) => <li key={action}>{action}</li>)}</ul></dd>
          </div>
          <div><dt>Le résultat</dt><dd>{study.result}</dd></div>
        </dl>
        {/* Le préfixe de projet garde un identifiant unique quand plusieurs études sont présentes sur la page. */}
        <section className="project-ai" aria-labelledby={projectId + '-ai-title'}>
          <h4 id={projectId + '-ai-title'}>Mon utilisation de l’IA</h4>
          <ol className="ai-steps">
            {study.aiContributions.map((contribution) => (
              <li key={contribution.title}><strong>{contribution.title}</strong><p>{contribution.description}</p></li>
            ))}
          </ol>
        </section>
        <div className="project-result">
          <p><strong className="result-label">{study.timeline.label}</strong>{' '}{study.timeline.description}</p>
          {/* dateTime conserve la date machine ISO ; le contenu visible utilise le format français commun au rendu Node et au navigateur. */}
          <p><time dateTime={study.timeline.start}>{timelineDateFormat.format(new Date(study.timeline.start))}</time> → <time dateTime={study.timeline.end}>{timelineDateFormat.format(new Date(study.timeline.end))}</time></p>
        </div>
      </div>
    </details>
  )
}
