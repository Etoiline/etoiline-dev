# Etoiline

Portfolio personnel en français, développé avec React, TypeScript et Vite.
Il présente les projets d’Etoiline, à commencer par [Mouv’Air](https://mouvair.etoiline.dev),
une application pour choisir quand sortir selon la météo et la qualité de l’air.

## Démarrage

```sh
npm install
npm run dev
```

Ouvrir l’adresse affichée dans le terminal, par défaut http://localhost:5173.

## Commandes

- `npm run dev` : lancer le serveur de développement.
- `npm run lint` : vérifier le code avec Oxlint.
- `npm run build` : vérifier TypeScript et générer le site statique dans `dist/`.
- `npm run preview` : prévisualiser le site compilé.

## Contenu et personnalisation

- `src/data/portfolio.ts` centralise les projets et les coordonnées de contact.
- Le nom public s’écrit **Etoiline**, avec une majuscule et sans accent. `portfolio.name`
  définit le nom affiché dans l’en-tête et le pied de page ; les métadonnées sont dans `index.html`.
- Si `portfolio.email` contient une adresse, le contact ouvre un lien `mailto:`.
  Sinon, il ouvre le profil GitHub d’Etoiline.
- Chaque projet possède un identifiant unique, un nom, une catégorie, une description
  et une URL. Les champs facultatifs `image` et `imageAlt` définissent sa capture
  et sa description accessible.
- Pour ajouter un projet, ajouter une entrée à la liste et sa capture dans `public/images/`.
  Sans capture, ou si le fichier est indisponible, un aperçu affiche le nom du projet.
- La capture de Mouv’Air, réalisée le 5 octobre 2026, se trouve dans
  `public/images/mouvair.jpg` (1265 × 712 px). Les aperçus sont cadrés en haut au ratio 2:1.
  Leur lien ouvre le site réel. Remplacer la capture lorsque l’interface évolue.
- Les textes se modifient dans `src/App.tsx` et les styles dans `src/index.css`.

## Interface et accessibilité

La page reprend une palette ivoire et violette, une typographie sans sérif et une
illustration vectorielle de l’étoile Etoiline. Les projets sont présentés dans une
mise en page ouverte. Les sections À propos et Contact utilisent le même fond.
La mise en page est adaptée aux téléphones dès 320 px, aux tablettes et aux ordinateurs.

Les trois liens de navigation restent visibles dans l’en-tête sur tous les écrans.
La hauteur de défilement vers les ancres tient compte de l’en-tête fixe.
Un lien d’évitement donne accès au contenu, les liens disposent d’un focus visible,
et le défilement respecte la préférence de réduction des animations.
Les liens externes annoncent leur ouverture dans un nouvel onglet et utilisent
`noopener noreferrer`. Les captures disposent d’un texte alternatif ; l’illustration
décorative est masquée aux lecteurs d’écran.

Les polices DM Sans et Manrope sont chargées depuis Google Fonts avec `display=swap`.
Des polices de remplacement permettent d’afficher le contenu si ce service est indisponible.
Les captures sont locales et chargées à la demande. Aucun site externe n’est embarqué
dans une iframe et aucun formulaire de démonstration n’est affiché.

## Publication

Le contenu de `dist/`, généré par `npm run build`, peut être publié chez un hébergeur
de sites statiques. Le portfolio ne nécessite ni serveur applicatif ni clé d’API.
Les métadonnées se trouvent dans `index.html` et le favicon dans `public/favicon.svg`.
Ajouter une URL canonique lorsque l’adresse publique définitive du portfolio est fixée.

## Structure

- `src/App.tsx` : sections du portfolio, illustration et captures des projets.
- `src/data/portfolio.ts` : projets et coordonnées.
- `src/main.tsx` : point d’entrée React.
- `src/index.css` : styles adaptatifs et accessibilité.
- `public/favicon.svg` : favicon Etoiline.
- `public/images/` : captures locales.
- `index.html` : document HTML et métadonnées.
- `vite.config.ts` : configuration Vite.
- `tsconfig*.json` : configuration TypeScript.

## Historique

Voir [CHANGELOG.md](CHANGELOG.md).
