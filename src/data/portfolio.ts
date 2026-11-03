/**
 * Contenu public du portfolio : profil, compétences et projets, sans appel réseau.
 * App et ses composants consomment ces données aussi bien pendant le pré-rendu que dans le navigateur.
 * Modifier ce fichier change les contenus affichés ; les textes de l’accueil et d’App restent dans leurs composants.
 * Les métadonnées de index.html sont distinctes et doivent être actualisées si le positionnement change.
 */
import type { PortfolioProfile, Project, SkillGroup } from '../types/portfolio'

// `satisfies` vérifie le contrat sans perdre les valeurs littérales conservées par `as const`.
export const portfolio = {
  name: 'Etoiline',
  role: 'Développeur Front-End',
  yearsExperience: 3,
  availability: 'CDI · 100 % télétravail',
} as const satisfies PortfolioProfile

// L’ordre des entrées est celui de la section Stack ; les id doivent être uniques et rester stables.
export const skillGroups: readonly SkillGroup[] = [
  {
    id: 'web',
    title: 'Interfaces web',
    description: 'Des composants React et des contrats TypeScript explicites, du chargement aux cas d’erreur.',
    technologies: ['React', 'TypeScript'],
  },
  {
    id: 'mobile',
    title: 'Applications mobiles',
    description: 'La même culture composant pour concevoir des parcours adaptés aux usages mobiles.',
    technologies: ['React Native'],
  },
  {
    id: 'ui',
    title: 'Intégration & accessibilité',
    description: 'Des interfaces responsive, une sémantique HTML claire et une navigation au clavier.',
    technologies: ['Tailwind CSS', 'CSS', 'HTML'],
  },
]

// Les captures sont locales pour rendre le portfolio indépendant des sites présentés.
// La stack de chaque projet décrit son code réel, indépendamment des compétences générales.
// Chaque id sert aux clés React et aux titres accessibles ; une image référence un fichier de public/.
// `presentation` choisit une fiche compacte ou une fiche accompagnée d’un récit STAR obligatoire.
export const projects: readonly Project[] = [
  {
    id: 'mouvair',
    name: 'Mouv’Air',
    presentation: 'case-study',
    description:
      'Trouver le bon créneau pour courir, pédaler ou marcher en croisant météo et qualité de l’air sur les prochaines 24 heures.',
    url: 'https://mouvair.etoiline.dev',
    repository: { url: 'https://github.com/Etoiline/mouvair-front', visibility: 'private' },
    image: {
      src: '/images/mouvair.jpg',
      alt: 'Page d’accueil de Mouv’Air avec son champ de recherche de ville.',
      width: 1265,
      height: 712,
    },
    technologies: ['React', 'TypeScript strict', 'Vite', 'CSS', 'FastAPI / Python', 'Redis', 'Vitest', 'Testing Library'],
    caseStudy: {
      // Les standards mobiles décrivent l’ergonomie visée par l’interface web, indépendamment de sa stack.
      situation: 'Croiser les prévisions météo et la qualité de l’air pour choisir quand sortir, avec un outil d’aide à la décision calibré sur les standards des applications mobiles.',
      task: 'Concevoir et développer le parcours complet : chercher une ville, choisir une activité et comparer 24 créneaux horaires avec une recommandation compréhensible.',
      actions: [
        'Construire une interface React reliée à une API FastAPI qui agrège les données Open-Meteo, puis l’optimiser pour une expérience cross-platform (Web & Mobile) fluide.',
        'Aligner les contrats TypeScript sur les scores météo, air et globaux ; traiter les données absentes, les fuseaux horaires et les échecs d’actualisation.',
        'Rendre le graphique horaire et les détails interactifs, puis tester les parcours de recherche, de sélection et de réessai avec Vitest et Testing Library.',
      ],
      result: 'Une application accessible en ligne, avec quatre activités, 24 créneaux comparables et des états explicites quand les données sont incomplètes ou anciennes.',
      // Ces dates bornent l’historique Git ; elles ne mesurent ni le temps travaillé ni le gain dû à l’IA.
      timeline: {
        start: '2026-09-07',
        end: '2026-09-13',
        label: 'Une semaine de développement',
        description: 'Du premier commit à la v0.4.0 : interface, API, tests et préparation du déploiement.',
      },
      aiContributions: [
        {
          title: 'Architecture & cadrage',
          description: 'Je pilote l’IA à partir du besoin produit : responsabilités du front et de l’API, règles de score et contrats de données.',
        },
        {
          title: 'Prompts techniques & itérations',
          description: 'Je découpe le travail en demandes ciblées, avec contexte, contraintes et critères de validation, pour avancer fonctionnalité par fonctionnalité.',
        },
        {
          title: 'Typage & refactoring',
          description: 'J’utilise l’IA pour faire évoluer les types et simplifier le code, puis je vérifie les différences, les cas limites et les parcours par les tests et la compilation.',
        },
      ],
    },
  },
  {
    id: 'crinserein',
    name: 'Crin Serein',
    presentation: 'case-study',
    description: 'Un carnet de soins pour suivre ses chevaux, leurs prochaines échéances et leurs dépenses.',
    url: 'https://crinserein.etoiline.dev',
    repository: { url: 'https://github.com/Etoiline/crin-serein-front', visibility: 'private' },
    image: {
      src: '/images/crinserein.jpg',
      alt: 'Page d’accueil de Crin Serein avec un exemple de carnet de soins équins.',
      width: 1265,
      height: 712,
    },
    technologies: ['React', 'TypeScript strict', 'React Router', 'TanStack Query', 'FastAPI / Python', 'PostgreSQL', 'Vitest', 'Testing Library'],
    caseStudy: {
      // Le besoin reste centré sur le propriétaire ; les actions explicitent la protection des données par compte.
      situation: 'Suivre les soins, anticiper les échéances et gérer les dépenses d’un cheval demande de l’organisation. Les propriétaires ont besoin de centraliser ces données critiques dans un espace sécurisé pour garder une vue d’ensemble.',
      task: 'Concevoir et développer un carnet web qui centralise ces informations pour chaque propriétaire, de la connexion à la gestion quotidienne des chevaux.',
      actions: [
        'Organiser les parcours React par fonctionnalités avec React Router et TanStack Query, puis les relier à une API FastAPI et à PostgreSQL.',
        'Gérer les sessions, isoler le cache par compte et annuler les lectures en cours à la déconnexion pour éviter de réafficher les données du compte précédent.',
        'Créer des formulaires en dialogues accessibles avec conservation des brouillons en cas d’erreur, puis tester les parcours de saisie, de filtrage et de navigation.',
      ],
      result: 'Un carnet web conçu comme un MVP SaaS B2C sécurisé pour centraliser la gestion équine : fiches et photos des chevaux, historique des soins, calendrier des rappels et graphiques de dépenses. Son mode démonstration permet d’explorer les parcours avec des données fictives.',
      // Ces jalons proviennent des changelogs ; ils bornent deux versions, pas le temps travaillé.
      timeline: {
        start: '2026-10-07',
        end: '2026-10-28',
        label: 'Trois semaines de développement',
        description: 'Du socle v0.1.0 à la v0.5.1 : compte utilisateur, carnet, soins, rappels et dépenses.',
      },
      aiContributions: [
        {
          title: 'Cadrage par fonctionnalité',
          description: 'Je cadre les demandes à l’IA autour d’un parcours et de ses contrats d’API pour faire évoluer ensemble l’interface, les types et les règles métier.',
        },
        {
          title: 'Cas limites & refactoring',
          description: 'Je m’appuie sur l’IA pour examiner les changements de compte, les réponses réseau tardives et les brouillons de formulaire, puis je relis les modifications proposées.',
        },
        {
          title: 'Validation des parcours',
          description: 'Je vérifie les itérations avec Vitest et Testing Library, le typage strict et les contrôles automatisés de lint et de build.',
        },
      ],
    },
  },
]
