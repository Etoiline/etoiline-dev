/**
 * Contrats des données éditoriales affichées par le portfolio.
 * Les composants lisent ces objets sans les modifier ; Readonly exprime cette règle au typage.
 * Ces déclarations disparaissent à la compilation et ne valident pas des données reçues par réseau.
 */
// Les URL externes écrites dans les données doivent annoncer HTTPS ; leur disponibilité n’est pas testée ici.
export type ExternalUrl = `https://${string}`

// Le même profil alimente l’en-tête, l’accueil, le texte de présentation et le pied de page.
export type PortfolioProfile = Readonly<{
  name: string
  role: string
  yearsExperience: number
  availability: string
}>

// Un identifiant stable sert de clé React ; les technologies sont les libellés des badges du groupe.
export type SkillGroup = Readonly<{
  id: string
  title: string
  description: string
  technologies: readonly string[]
}>

// Le chemin part de public/ ; les dimensions réservent la place de la capture avant son chargement.
type ProjectImage = Readonly<{
  src: `/${string}`
  alt: string
  width: number
  height: number
}>

// La visibilité adapte le texte de la fiche ; elle n’accorde aucun accès à un dépôt privé.
type ProjectRepository = Readonly<{
  url: ExternalUrl
  visibility: 'public' | 'private'
}>

// Une contribution décrit l’usage de l’IA et le travail de pilotage ou de validation associé.
type AiContribution = Readonly<{
  title: string
  description: string
}>

/**
 * Récit STAR : situation initiale, tâche à accomplir, actions et résultat obtenu.
 * La chronologie attend des dates ISO YYYY-MM-DD, affichées en français dans l’interface.
 * Les chaînes restent du contenu éditorial : le typage ne vérifie pas leur exactitude historique.
 */
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

// La capture et le dépôt sont facultatifs ; la carte doit rester lisible lorsqu’ils sont absents.
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
// Tester `presentation` permet à TypeScript de savoir si `caseStudy` existe dans cette branche.
export type Project = ProjectBase & (
  | Readonly<{ presentation: 'case-study'; caseStudy: ProjectCaseStudy }>
  | Readonly<{ presentation: 'overview' }>
)
