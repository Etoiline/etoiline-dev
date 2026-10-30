import type { JSX, SVGProps } from 'react'

export function StarIcon(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg {...props} viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false">
      <path d="M16 0 20.1 11.9 32 16 20.1 20.1 16 32 11.9 20.1 0 16 11.9 11.9Z" fill="currentColor" />
    </svg>
  )
}

type ArrowIconProps = SVGProps<SVGSVGElement> & Readonly<{ diagonal?: boolean }>

export function ArrowIcon({ diagonal = false, ...props }: ArrowIconProps): JSX.Element {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
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
