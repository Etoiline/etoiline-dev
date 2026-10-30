import type { JSX } from 'react'
import ExternalLink from './components/ExternalLink'
import Header from './components/Header'
import Hero from './components/Hero'
import MotionProvider from './components/MotionProvider'
import Stack from './components/Stack'
import { portfolio, projects, skillGroups } from './data/portfolio'
import ContactForm from './features/contact/ContactForm'
import ProjectCard from './features/projects/ProjectCard'

const currentYear = new Date().getFullYear()

function App(): JSX.Element {
  return (
    <MotionProvider>
      <a className="skip-link" href="#contenu">Aller au contenu</a>
      <Header name={portfolio.name} />

      <main id="contenu" tabIndex={-1}>
        <Hero profile={portfolio} />

        <section id="projets" className="portfolio-section projects-section" aria-labelledby="projects-title">
          <div className="page-width">
            <h2 id="projects-title" className="section-title">Projets</h2>
            <div className="project-list">
              {projects.map((project) => <ProjectCard project={project} key={project.id} />)}
            </div>
          </div>
        </section>

        <Stack groups={skillGroups} />

        <section id="a-propos" className="portfolio-section about-section" aria-labelledby="about-title">
          <div className="text-section page-width">
            <h2 id="about-title" className="section-title">À propos</h2>
            <div className="about-copy">
              <p>J’ai {portfolio.yearsExperience} ans d’expérience en développement. Mon terrain : les interfaces web et mobiles avec React, TypeScript et React Native. Mes projets personnels partent de besoins concrets, comme choisir quand sortir ou suivre les soins de ses chevaux.</p>
              <p>Je m’appuie sur l’IA pour explorer une architecture, accélérer l’implémentation et préparer un refactoring. Je définis le besoin, je relis les changements et je vérifie les comportements avec les outils adaptés. La qualité du code reste ma responsabilité.</p>
              <p>Je recherche un <strong>CDI 100 % télétravail</strong> dans une équipe qui construit un produit utile. Je souhaite y apporter une approche concrète : des tâches bien cadrées, des décisions documentées et des livraisons régulières.</p>
              <ExternalLink href="https://github.com/Etoiline">Mon profil GitHub</ExternalLink>
            </div>
          </div>
        </section>

        <section id="contact" className="portfolio-section contact-section" aria-labelledby="contact-title">
          <div className="text-section page-width">
            <h2 id="contact-title" className="section-title">Contact</h2>
            <div className="contact-content">
              <p>Vous recrutez un développeur Front-End React / TypeScript ? Présentez-moi votre équipe, votre produit et le poste proposé. Échangeons sur ce que nous pourrions construire ensemble.</p>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer page-width">
        <span>© {currentYear} {portfolio.name}</span>
        <a className="plain-link" href="#accueil">Retour en haut ↑</a>
      </footer>
    </MotionProvider>
  )
}

export default App
