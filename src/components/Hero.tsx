import type { JSX } from 'react'
import type { PortfolioProfile } from '../types/portfolio'
import AnimatedLink from './AnimatedLink'

type HeroProps = Readonly<{ profile: PortfolioProfile }>

function OrbitArtwork(): JSX.Element {
  // L’illustration est décorative et ne doit pas interrompre la lecture du positionnement.
  return (
    <svg className="hero-artwork" viewBox="0 0 480 460" fill="none" aria-hidden="true" focusable="false">
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

export default function Hero({ profile }: HeroProps): JSX.Element {
  return (
    <section id="accueil" className="hero page-width" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">{profile.role} · {profile.yearsExperience} ans d’expérience</p>
        <h1 id="hero-title">Front-End React.<br /><span>Du produit, plus vite.</span></h1>
        <p className="hero-description">
          Je développe des applications web et mobiles avec <strong>React, TypeScript et React Native</strong>.
          {' '}L’IA accélère mon delivery ; je garde la main sur l’architecture, le typage et la qualité du code.
        </p>
        <p className="availability"><span aria-hidden="true" />{profile.availability}</p>
        <div className="hero-actions">
          <AnimatedLink className="button-link" href="#contact" pressable>Échangeons sur le poste</AnimatedLink>
          <AnimatedLink className="plain-link" href="#projets">Voir mes projets</AnimatedLink>
        </div>
      </div>
      <OrbitArtwork />
    </section>
  )
}
