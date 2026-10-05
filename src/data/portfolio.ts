// Le nom partagé par l’en-tête et le pied de page conserve une graphie unique.
// Sans e-mail renseigné, le contact mène vers GitHub.
export const portfolio: { name: string; githubUrl: string; email: string | null } = {
  name: 'Etoiline',
  githubUrl: 'https://github.com/Etoiline',
  email: null,
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
]
