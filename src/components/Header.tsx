/**
 * En-tête commun avec l’identité du site et la navigation vers ses sections.
 * Les destinations sont des ancres de la même page, sans changement de route ni appel réseau.
 */
import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import type { JSX } from 'react'
import { StarIcon } from './Icons'

type HeaderProps = Readonly<{ name: string }>

// Ces identifiants suivent les sections de App, Hero, Experience et Stack dans leur ordre de lecture.
const navigationItems = [
  { href: '#experience', label: 'Expérience' },
  { href: '#projets', label: 'Projets' },
  { href: '#stack', label: 'Stack' },
  { href: '#a-propos', label: 'À propos' },
  { href: '#contact', label: 'Contact' },
] as const

export default function Header({ name }: HeaderProps): JSX.Element {
  const reducedMotion = useReducedMotion()
  // La rotation du logo est facultative ; son nom et sa destination restent accessibles sans animation.
  const logoInteraction = reducedMotion ? 'rest' : 'active'

  return (
    <header className="site-header">
      <div className="header-inner page-width">
        {/* Le nom accessible remplace les détails décoratifs de la marque et annonce le retour à l’accueil. */}
        <m.a
          className="brand"
          href="#accueil"
          aria-label={name + ', accueil'}
          initial={false}
          animate="rest"
          whileHover={logoInteraction}
          whileFocus={logoInteraction}
        >
          <m.span className="brand-icon" aria-hidden="true" variants={{ rest: { rotate: 0 }, active: { rotate: 45 } }} transition={{ duration: 0.2, ease: 'easeOut' }}>
            <StarIcon />
          </m.span>
          <span>{name}<span className="brand-period">.</span></span>
        </m.a>
        {/* Chaque lien reçoit le même retour visuel au clavier qu’à la souris. */}
        <nav className="main-nav" aria-label="Navigation principale">
          {navigationItems.map(({ href, label }) => (
            <m.a key={href} href={href} initial={false} animate="rest" whileHover="active" whileFocus="active">
              {label}
              <m.span
                className="nav-underline"
                aria-hidden="true"
                variants={{ rest: { scaleX: 0 }, active: { scaleX: 1 } }}
                // Le repère reste présent au focus, instantanément si les animations sont réduites.
                transition={{ duration: reducedMotion ? 0 : 0.15, ease: 'easeOut' }}
              />
            </m.a>
          ))}
        </nav>
      </div>
    </header>
  )
}
