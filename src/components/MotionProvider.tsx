/**
 * Configure Motion une seule fois pour tous les composants descendants de App.
 * Les composants allégés de motion/react-m utilisent les fonctionnalités fournies par LazyMotion.
 */
import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import type { JSX, ReactNode } from 'react'

type MotionProviderProps = Readonly<{ children: ReactNode }>

export default function MotionProvider({ children }: MotionProviderProps): JSX.Element {
  // Le bundle couvre les animations et les gestes de survol, de focus et de pression, sans charger le glisser-déposer.
  return (
    <MotionConfig reducedMotion="user">
      {/* strict signale l’emploi d’un composant Motion complet qui annulerait le bénéfice de ce chargement allégé. */}
      <LazyMotion features={domAnimation} strict>{children}</LazyMotion>
    </MotionConfig>
  )
}
