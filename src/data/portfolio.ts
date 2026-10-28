// Le nom partagé par l’en-tête et le pied de page conserve une graphie unique.
export const portfolio: { name: string } = {
  name: 'Etoiline',
}

export type Project = {
  id: string
  name: string
  category: string
  description: string
  url: string
  image?: string
  imageAlt?: string
}

// Les captures sont locales pour rendre le portfolio indépendant des sites présentés.
// Un projet sans capture utilise l’aperçu avec son nom, sans dépendre d’une image distante.
export const projects: Project[] = [
  {
    id: 'mouvair',
    name: 'Mouv’Air',
    category: 'Application web',
    description:
      'Choisir quand courir, pédaler ou marcher grâce à la météo et à la qualité de l’air des prochaines 24 heures.',
    url: 'https://mouvair.etoiline.dev',
    image: '/images/mouvair.jpg',
    imageAlt: 'Page d’accueil de Mouv’Air avec son champ de recherche de ville.',
  },
  {
    id: 'crinserein',
    name: 'Crin Serein',
    category: 'Application web',
    description: 'Le carnet de soins de vos chevaux, accessible en ligne.',
    url: 'https://crinserein.etoiline.dev',
    image: '/images/crinserein.jpg',
    imageAlt: 'Page d’accueil de Crin Serein avec un exemple de carnet de soins équins.',
  },
]
