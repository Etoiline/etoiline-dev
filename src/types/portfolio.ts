export type ExternalUrl = `https://${string}`

export type PortfolioProfile = Readonly<{
  name: string
  role: string
  yearsExperience: number
  availability: string
}>

export type SkillGroup = Readonly<{
  id: string
  title: string
  description: string
  technologies: readonly string[]
}>

type ProjectImage = Readonly<{
  src: `/${string}`
  alt: string
  width: number
  height: number
}>

type ProjectRepository = Readonly<{
  url: ExternalUrl
  visibility: 'public' | 'private'
}>

type AiContribution = Readonly<{
  title: string
  description: string
}>

export type ProjectCaseStudy = Readonly<{
  situation: string
  task: string
  actions: readonly string[]
  result: string
  timeline: Readonly<{
    start: string
    end: string
    label: string
    description: string
  }>
  aiContributions: readonly AiContribution[]
}>

type ProjectBase = Readonly<{
  id: string
  name: string
  description: string
  url: ExternalUrl
  image?: ProjectImage
  repository?: ProjectRepository
  technologies: readonly string[]
}>

// Une étude de cas exige son récit STAR ; les projets complémentaires restent compacts.
export type Project = ProjectBase & (
  | Readonly<{ presentation: 'case-study'; caseStudy: ProjectCaseStudy }>
  | Readonly<{ presentation: 'overview' }>
)
