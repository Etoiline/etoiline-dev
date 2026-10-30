import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import type { JSX, ReactNode } from 'react'

type MotionProviderProps = Readonly<{ children: ReactNode }>

export default function MotionProvider({ children }: MotionProviderProps): JSX.Element {
  // Le bundle couvre les animations et les gestes de survol, de focus et de pression, sans charger le glisser-déposer.
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>{children}</LazyMotion>
    </MotionConfig>
  )
}
