import type { JSX } from 'react'
import ExternalLink from './components/ExternalLink'
import Header from './components/Header'
import Hero from './components/Hero'
import MotionProvider from './components/MotionProvider'
import Stack from './components/Stack'
// Les informations réutilisées sont centralisées pour garder le profil et les fiches cohérents.
import { portfolio, projects, skillGroups } from './data/portfolio'
import ContactForm from './features/contact/ContactForm'
import ProjectCard from './features/projects/ProjectCard'

// L’année est calculée au chargement du module, lors du pré-rendu puis à l’ouverture du site.
// Elle n’est pas actualisée par un minuteur si la page reste ouverte au changement d’année.
const currentYear = new Date().getFullYear()

/**
 * Assemble la page unique du portfolio et fixe l’ordre de lecture de ses sections.
 * Les textes de présentation restent ici ; les cartes et le formulaire ont leurs propres composants.
 * `main.tsx` utilise cet arbre dans le navigateur et `entry-server.tsx` pour produire le HTML pré-rendu.
 * La navigation repose sur les ancres de la page : les identifiants doivent correspondre aux liens de Header.
 */
function App(): JSX.Element {
  // Le contexte d’animation commun couvre aussi l’en-tête et respecte la préférence de mouvements réduits.
  return (
    <MotionProvider>
      {/* Ce premier lien au clavier permet de passer directement au contenu sans parcourir la navigation. */}
      <a className="skip-link" href="#contenu">Aller au contenu</a>
      <Header name={portfolio.name} />

      {/* tabIndex=-1 permet de donner le focus à la cible du lien d’évitement sans ajouter un arrêt de tabulation. */}
      <main id="contenu" tabIndex={-1}>
        {/* Hero fournit le titre principal h1 ; les autres sections utilisent des titres h2. */}
        <Hero profile={portfolio} />

        {/* Chaque section nommée relie son titre visible à aria-labelledby pour les lecteurs d’écran. */}
        <section id="projets" className="portfolio-section projects-section" aria-labelledby="projects-title">
          <div className="page-width">
            <h2 id="projects-title" className="section-title">Projets</h2>
            <div className="project-list">
              {/* L’identifiant du projet conserve la même identité React même si les fiches sont réordonnées. */}
              {projects.map((project) => <ProjectCard project={project} key={project.id} />)}
            </div>
          </div>
        </section>

        {/* Stack fournit déjà sa section et son ancre #stack ; il n’a pas besoin d’une section englobante ici. */}
        <Stack groups={skillGroups} />

        <section id="a-propos" className="portfolio-section about-section" aria-labelledby="about-title">
          <div className="text-section page-width">
            <h2 id="about-title" className="section-title">À propos</h2>
            <div className="about-copy">
              {/* L’expérience reprend la même donnée que l’accueil pour éviter deux valeurs à maintenir. */}
              <p>J’ai {portfolio.yearsExperience} ans d’expérience en développement. Mon terrain : les interfaces web et mobiles avec React, TypeScript et React Native. Mes projets personnels partent de besoins concrets, comme choisir quand sortir ou suivre les soins de ses chevaux.</p>
              <p>Je m’appuie sur l’IA pour explorer une architecture, accélérer l’implémentation et préparer un refactoring. Je définis le besoin, je relis les changements et je vérifie les comportements avec les outils adaptés. La qualité du code reste ma responsabilité.</p>
              <p>Je recherche un <strong>CDI 100 % télétravail</strong> dans une équipe qui construit un produit utile. Je souhaite y apporter une approche concrète : des tâches bien cadrées, des décisions documentées et des livraisons régulières.</p>
              {/* ExternalLink ajoute les protections et l’annonce accessible de l’ouverture dans un nouvel onglet. */}
              <ExternalLink href="https://github.com/Etoiline">Mon profil GitHub</ExternalLink>
            </div>
          </div>
        </section>

        <section id="contact" className="portfolio-section contact-section" aria-labelledby="contact-title">
          <div className="text-section page-width">
            <h2 id="contact-title" className="section-title">Contact</h2>
            <div className="contact-content">
              <p>Vous recrutez un développeur Front-End React / TypeScript ? Présentez-moi votre équipe, votre produit et le poste proposé. Échangeons sur ce que nous pourrions construire ensemble.</p>
              {/* Le formulaire gère la saisie et appelle /api/contact ; la clé et l’envoi Brevo restent côté serveur. */}
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer page-width">
        <div className="footer-info">
          {/* LICENSE précise la portée des droits réservés et conserve les licences des ressources tierces. */}
          <span>© {currentYear} {portfolio.name} — Tous droits réservés</span>
          {/* Vite fournit la version de package.json, commune au HTML pré-rendu et au navigateur. */}
          <span className="site-version">Version {__APP_VERSION__}</span>
        </div>
        {/* L’ancre #accueil est portée par Hero et permet le retour en haut sans recharger la page. */}
        <a className="plain-link" href="#accueil">Retour en haut ↑</a>
      </footer>
    </MotionProvider>
  )
}

export default App
