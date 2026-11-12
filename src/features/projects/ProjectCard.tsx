/**
 * Présente un projet : aperçu, résumé, technologies, liens et éventuelle étude de cas.
 * Le composant lit le contrat Project ; seul l’échec de chargement d’une capture crée un état local.
 * Les informations et l’ordre des fiches viennent de data/portfolio.ts, sans récupération réseau de leur contenu.
 */
import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { useState } from 'react'
import type { JSX } from 'react'
import ExternalLink from '../../components/ExternalLink'
import { StarIcon } from '../../components/Icons'
import TechnologyList from '../../components/TechnologyList'
import type { Project } from '../../types/portfolio'
import ProjectCaseStudy from './ProjectCaseStudy'

type ProjectCardProps = Readonly<{ project: Project }>

function ProjectImage({ project }: ProjectCardProps): JSX.Element {
  // Mémoriser l’échec remplace l’image cassée par le visuel de secours au prochain rendu.
  const [imageUnavailable, setImageUnavailable] = useState(false)

  // Une capture absente ou indisponible laisse une entrée identifiable par le nom du projet.
  if (!project.image || imageUnavailable) {
    return <div className="project-placeholder" aria-hidden="true"><StarIcon /><span>{project.name}</span></div>
  }

  // Les dimensions réservent la place ; lazy et async évitent de prioriser une capture encore hors écran.
  // Le variant `active` est transmis par le lien parent lors du survol ou du focus.
  return (
    <m.img
      className="project-image"
      initial={false}
      variants={{ rest: { scale: 1 }, active: { scale: 1.02 } }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      src={project.image.src}
      alt={project.image.alt}
      width={project.image.width}
      height={project.image.height}
      loading="lazy"
      decoding="async"
      ref={(image) => {
        // Le navigateur peut avoir reçu l’erreur sur le HTML pré-rendu avant l’hydratation.
        if (image?.complete && image.naturalWidth === 0) setImageUnavailable(true)
      }}
      onError={() => setImageUnavailable(true)}
    />
  )
}

export default function ProjectCard({ project }: ProjectCardProps): JSX.Element {
  // L’optional chaining prend aussi en charge un projet sans lien de dépôt.
  const isPrivate = project.repository?.visibility === 'private'
  const interaction = useReducedMotion() ? 'rest' : 'active'

  return (
    <article className={'project-card project-card-' + project.presentation} aria-labelledby={project.id + '-title'}>
      <div className="project-row">
        {/* La capture est un lien nommé même quand le visuel de secours est masqué aux lecteurs d’écran. */}
        <m.a className="project-visual-link" href={project.url} target="_blank" rel="noopener noreferrer" aria-label={'Découvrir ' + project.name + ' (nouvel onglet)'} initial={false} animate="rest" whileHover={interaction} whileFocus={interaction}>
          <ProjectImage project={project} />
        </m.a>
        <div className="project-details">
          <h3 id={project.id + '-title'}>{project.name}</h3>
          <p className="project-description">{project.description}</p>
          <TechnologyList technologies={project.technologies} label={'Technologies de ' + project.name} />
          <div className="project-links">
            <ExternalLink href={project.url}>Voir le site<span className="sr-only"> {project.name}</span></ExternalLink>
            {/* La visibilité décrit GitHub ; afficher « privé » ne donne pas accès au code. */}
            {project.repository && (
              <ExternalLink href={project.repository.url}>
                GitHub{isPrivate ? ' (privé)' : ''}<span className="sr-only"> de {project.name}</span>
              </ExternalLink>
            )}
          </div>
          {isPrivate && <p className="repository-note">Dépôt privé. <a href="#contact">Me contacter pour échanger sur le code.</a></p>}
        </div>
      </div>
      {/* Le détail natif garde le récit complet accessible au clavier et sans JavaScript. */}
      {/* Ce test réduit aussi le type Project : caseStudy est alors garanti par TypeScript. */}
      {project.presentation === 'case-study' && (
        <ProjectCaseStudy projectId={project.id} projectName={project.name} study={project.caseStudy} />
      )}
    </article>
  )
}
