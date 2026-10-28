import { useState } from 'react'
import type { SVGProps } from 'react'
import ContactForm from './components/ContactForm'
import { portfolio, projects } from './data/portfolio'
import type { Project } from './data/portfolio'

const currentYear = new Date().getFullYear()

function StarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <path d="M16 0 20.1 11.9 32 16 20.1 20.1 16 32 11.9 20.1 0 16 11.9 11.9Z" fill="currentColor" />
    </svg>
  )
}

function ArrowIcon({ diagonal = false, ...props }: SVGProps<SVGSVGElement> & { diagonal?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
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

function OrbitArtwork() {
  // L’illustration reste décorative ; elle accompagne le titre sans ajouter de panneau ni de légende.
  return (
    <svg className="hero-artwork" viewBox="0 0 480 460" fill="none" aria-hidden="true">
      <ellipse cx="240" cy="234" rx="195" ry="77" transform="rotate(-35 240 234)" />
      <ellipse cx="240" cy="234" rx="185" ry="126" transform="rotate(35 240 234)" />
      <path className="artwork-shadow" d="m240 111 27 82 77-40-40 77 82 27-82 27 40 77-77-40-27 82-27-82-77 40 40-77-82-27 82-27-40-77 77 40Z" />
      <path className="artwork-star" d="m240 91 27 82 77-40-40 77 82 27-82 27 40 77-77-40-27 82-27-82-77 40 40-77-82-27 82-27-40-77 77 40Z" />
      <path className="artwork-center" d="m240 184 13 40 40 13-40 13-13 40-13-40-40-13 40-13Z" />
      <circle className="artwork-planet" cx="87" cy="335" r="10" />
      <circle className="artwork-small-planet" cx="392" cy="145" r="6" />
    </svg>
  )
}

function ProjectImage({ project }: { project: Project }) {
  const [imageUnavailable, setImageUnavailable] = useState(false)

  // Une capture absente ou indisponible laisse une entrée identifiable par le nom du projet.
  if (!project.image || imageUnavailable) {
    return (
      <div className="project-placeholder" aria-hidden="true">
        <StarIcon />
        <span>{project.name}</span>
      </div>
    )
  }

  return (
    <img
      className="project-image"
      src={project.image}
      alt={project.imageAlt || 'Page d’accueil de ' + project.name}
      width="1265"
      height="712"
      loading="lazy"
      decoding="async"
      onError={() => setImageUnavailable(true)}
    />
  )
}

function App() {
  return (
    <>
      <a className="skip-link" href="#contenu">Aller au contenu</a>
      <header className="site-header">
        <div className="header-inner page-width">
          <a className="brand" href="#accueil" aria-label={portfolio.name + ', accueil'}>
            <StarIcon /><span>{portfolio.name}<span className="brand-period">.</span></span>
          </a>
          <nav className="main-nav" aria-label="Navigation principale">
            <a href="#projets">Projets</a>
            <a href="#a-propos">À propos</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <main id="contenu">
        <section id="accueil" className="hero page-width" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title">Des idées.<br />Du code.<br />Des <span>projets.</span></h1>
            <p className="hero-description">Je développe des applications web. Découvrez mes projets Mouv’Air et Crin Serein.</p>
          </div>
          <OrbitArtwork />
        </section>

        <section id="projets" className="projects-section page-width" aria-labelledby="projects-title">
          <h2 id="projects-title">Mes projets</h2>
          <div className="project-list">
            {projects.map((project) => (
              <article className="project-row" key={project.id} aria-labelledby={project.id + '-title'}>
                <a className="project-visual-link" href={project.url} target="_blank" rel="noopener noreferrer" aria-label={'Découvrir ' + project.name + ' (nouvel onglet)'}>
                  <ProjectImage project={project} />
                </a>
                <div className="project-details">
                  <p className="project-category">{project.category}</p>
                  <h3 id={project.id + '-title'}>{project.name}</h3>
                  <p className="project-description">{project.description}</p>
                  <a className="plain-link project-link" href={project.url} target="_blank" rel="noopener noreferrer">
                    Ouvrir le site <ArrowIcon diagonal /><span className="sr-only"> (nouvel onglet)</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="a-propos" className="text-section page-width" aria-labelledby="about-title">
          <h2 id="about-title">À propos</h2>
          {/* Le récit est regroupé pour occuper une seule colonne à côté du titre. */}
          <div className="about-copy">
            <p>J’ai trois ans d’expérience en développement et je crée des applications web et mobiles avec React et React Native. Côté backend, j’utilise FastAPI. J’ai également utilisé Hugo pour réaliser des sites statiques.</p>
            <p>Mes projets personnels partent de besoins concrets : choisir quand sortir avec Mouv’Air, ou suivre les soins de ses chevaux avec Crin Serein. J’aime transformer ces idées en outils simples et utiles au quotidien.</p>
            <p>J’utilise aussi l’intelligence artificielle comme outil d’aide au développement de mes projets. Mon objectif : proposer des interfaces claires, accessibles et agréables à utiliser. Chaque projet est aussi une occasion d’apprendre et d’améliorer ma façon de développer.</p>
          </div>
        </section>

        <section id="contact" className="text-section contact-section page-width" aria-labelledby="contact-title">
          <h2 id="contact-title">Contact</h2>
          <div className="contact-content">
            <p>Pour parler d’un projet ou simplement échanger, laisse-moi un message.</p>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="site-footer page-width">
        <span>© {currentYear} {portfolio.name}</span>
        <a className="plain-link" href="#accueil">Retour en haut ↑</a>
      </footer>
    </>
  )
}

export default App
