# Etoiline

Portfolio personnel en français, développé avec React, TypeScript strict et Vite.
Il présente un profil Front-End avec trois ans d’expérience, une pratique de React,
TypeScript et React Native, et une recherche de CDI 100 % télétravail.
L’usage de l’IA est associé au cadrage, à la relecture et aux vérifications du code livré.
Il présente les projets d’Etoiline :

- [Mouv’Air](https://mouvair.etoiline.dev), une application pour choisir quand sortir
  selon la météo et la qualité de l’air.
- [Crin Serein](https://crinserein.etoiline.dev), le carnet de soins de vos chevaux,
  accessible en ligne.

## Démarrage

```sh
npm install
npm run dev
```

Ouvrir l’adresse affichée dans le terminal, par défaut http://localhost:5173.

## Commandes

- `npm run dev` : lancer le serveur de développement.
- `npm run lint` : vérifier le code avec Oxlint.
- `npm test` : tester la validation, l’envoi et les erreurs du formulaire avec Node.js 24,
  sans envoyer de vrai e-mail.
- `npm run build` : vérifier TypeScript, compiler les ressources et pré-rendre la page
  dans `dist/index.html` pour rendre le contenu disponible sans JavaScript.
- `npm run preview` : prévisualiser le site compilé.

## Contenu et personnalisation

- `src/data/portfolio.ts` centralise le profil, les compétences et les projets.
- `src/types/portfolio.ts` définit les données en lecture seule, les URL HTTPS,
  les groupes de compétences et les deux présentations de projet.
- Le nom public s’écrit **Etoiline**, avec une majuscule et sans accent. `portfolio.name`
  définit le nom affiché dans l’en-tête et le pied de page ; les métadonnées sont dans `index.html`.
- Le contact passe par le formulaire. L’adresse de réception est définie uniquement
  dans `server/contact.ts` ; elle n’est ni affichée sur la page ni incluse dans le
  JavaScript distribué au navigateur.
- Chaque projet possède un identifiant unique, un nom, une description,
  une URL HTTPS, une liste de technologies et une présentation : `overview` ou
  `case-study`. Cette dernière exige le récit STAR, les contributions IA et la chronologie.
- Le champ facultatif `image` regroupe `src`, `alt`, `width` et `height`. Un dépôt
  facultatif regroupe son URL et sa visibilité. Un dépôt privé est identifié comme tel
  et accompagné d’un accès au contact ; le lien ne promet pas un accès public au code.
- Pour ajouter un projet, ajouter une entrée à la liste et sa capture dans `public/images/`.
  Sans capture, ou si le fichier est indisponible, un aperçu affiche le nom du projet.
- La capture de Mouv’Air, réalisée le 5 octobre 2026, se trouve dans
  `public/images/mouvair.jpg` (1265 × 712 px).
- La capture de Crin Serein, réalisée le 27 octobre 2026, se trouve dans
  `public/images/crinserein.jpg` (1265 × 712 px).
- Les aperçus sont cadrés en haut au ratio 2:1. Leur lien ouvre le site réel.
  Remplacer les captures lorsque les interfaces évoluent.
- Les composants `Hero` et `Stack` se trouvent dans `src/components/`, et la fiche
  `ProjectCard` dans `src/features/projects/`. Les textes de présentation générale
  restent dans `src/App.tsx`, les styles dans `src/index.css`.
- La durée d’expérience et la recherche de poste sont dans `portfolio`. Actualiser
  aussi les métadonnées de `index.html` si ces informations changent.

### Structure éditoriale pour le recrutement

1. **Accueil** : « Front-End React. Du produit, plus vite. », trois ans d’expérience,
   React / TypeScript / React Native, démarche IA et CDI 100 % télétravail.
   Le bouton « Échangeons sur le poste » donne accès au formulaire de contact.
2. **Projets** : un titre unique, puis une capture, une description courte, les
   technologies et les liens de chaque application. Le lien « Voir l’étude de cas »
   déplie le récit STAR, la méthode IA et la chronologie de Mouv’Air comme de Crin Serein.
3. **Stack** : web, mobile et intégration / accessibilité, avec un usage concret
   plutôt qu’une jauge subjective de maîtrise.
4. **À propos** : responsabilité technique, méthode de travail et équipe recherchée.
5. **Contact** : titre direct, puis invitation à présenter une équipe, un produit
   et un poste, sans mention de disponibilité au-dessus du titre.

### Sources et limites de l’étude de cas Mouv’Air

La stack a été vérifiée dans les manifestes et la documentation du projet : React,
TypeScript strict, Vite et CSS côté interface ; FastAPI / Python et Redis côté API ;
Vitest et Testing Library pour les parcours frontend. Tailwind CSS figure parmi
les compétences déclarées du profil, sans être attribué à Mouv’Air.

L’historique Git établit les repères suivants, en heure de Paris :

- Premiers commits frontend `a028117`, backend `3c24084` et documentation `904d35f` :
  le **7 septembre 2026 à 18 h 17**.
- Alignement des types frontend `4e6fe7f` le 8 septembre, suppression des anciens
  contrats `17dc94c` le 9 septembre, tests de parcours `2d9d0f2` le 12 septembre.
- Versions **0.4.0** backend `0592ad5` et frontend `e042878` : le **13 septembre 2026**.

« Une semaine de développement » décrit cet intervalle entre le premier commit et la
v0.4.0. Il ne mesure pas les heures travaillées, la conception antérieure, la date
exacte de mise en production ni un gain de productivité imputable à l’IA. La méthode
IA décrit la pratique déclarée par l’auteur ; aucun pourcentage d’accélération,
trafic ou résultat commercial n’est inventé. Le dépôt frontend est privé au moment
de la vérification ; modifier sa visibilité dans les données s’il devient public.

### Sources et limites de l’étude de cas Crin Serein

La fiche s’appuie sur le code, les manifestes et les README du frontend et de l’API :
React, TypeScript strict, React Router et TanStack Query ; FastAPI / Python et
PostgreSQL ; Vitest et Testing Library. Les exemples techniques concernent les
caches séparés par compte, l’annulation des lectures à la déconnexion, les dialogues
avec restitution du focus et les formulaires qui conservent les brouillons.
Le récit présente les chevaux, les soins, les rappels et les dépenses implémentés.
Le mode démonstration utilise des données fictives ; le dépôt mobile est encore
à initialiser et n’est pas présenté comme une application livrée.

Le premier commit du frontend, `c1f3625`, date du **6 octobre 2026**. La chronologie
affichée utilise deux versions des changelogs locaux : **v0.1.0 le 7 octobre 2026**
et **v0.5.1 le 28 octobre 2026**. « Trois semaines de développement » décrit cet intervalle,
sans mesurer les heures travaillées ni un gain de productivité dû à l’IA.
Le dépôt frontend est privé. Les détails se déplient avec le même composant que
Mouv’Air, sans ajouter de titres ou de blocs au résumé initial de la fiche.

## Formulaire de contact

Le formulaire demande un nom, une adresse e-mail et un message. Il appelle la fonction
Vercel `/api/contact`, qui transmet un e-mail en texte brut à `contact@etoiline.dev`
avec [Resend](https://resend.com/docs/api-reference/emails/send-email).
L’adresse du visiteur est utilisée pour les réponses ; le destinataire reste fixé
côté serveur. Les champs sont conservés en cas d’échec et vidés uniquement après
confirmation du service d’envoi.

Pour activer l’envoi sur Vercel :

1. [Vérifier le domaine `etoiline.dev` dans Resend](https://resend.com/docs/dashboard/domains/introduction)
   avec les enregistrements DNS indiqués par le service, puis créer une clé d’envoi.
2. Ajouter `RESEND_API_KEY` aux variables d’environnement du projet Vercel pour les
   environnements souhaités. `CONTACT_FROM` permet de remplacer l’expéditeur par défaut,
   `Etoiline <contact@etoiline.dev>`, avec une adresse d’un domaine vérifié.
3. Redéployer le projet. Les secrets restent côté serveur et n’utilisent jamais de
   préfixe `VITE_`. Le fichier `.env.example` décrit les variables attendues.

`npm run dev` et `npm run preview` servent l’interface seule. Pour utiliser aussi la
fonction localement, copier `.env.example` dans `.env.local`, renseigner la clé, puis
lancer [`npx vercel dev`](https://vercel.com/docs/cli/dev). Cette commande peut demander
de relier le dossier au projet Vercel existant. Un envoi depuis cet environnement
contacte réellement Resend ; les tests automatisés remplacent ce service.

Le serveur valide les champs, limite les requêtes à 20 Ko, vérifie leur origine et
rejette un champ leurre rempli. Les tentatives identiques utilisent une clé de
déduplication Resend. Le portfolio ne stocke pas les messages en base de données.

### Protection contre le spam et les robots

Le champ leurre filtre les robots simples. La validation des champs et de l’origine
ne suffit pas à empêcher un robot d’appeler directement l’API.
Pour renforcer les protections existantes :

- Configurer une
  [règle de limitation Vercel](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting)
  sur `POST /api/contact`, par exemple cinq requêtes par adresse IP sur dix minutes,
  avec une réponse `429` lorsque la limite est atteinte.
- Ajouter [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
  au formulaire et vérifier son jeton côté serveur avant de contacter Resend.
  Le widget côté navigateur doit être complété par cette validation serveur.

Ces deux protections supplémentaires restent à configurer ; Turnstile n’est pas
encore intégré au code. Le retrait de l’adresse publique réduit son exposition
aux collecteurs d’adresses sur la page.

## Interface et accessibilité

La page conserve la palette ivoire et violette, la typographie sans sérif et
l’illustration vectorielle de l’étoile Etoiline. L’accueil privilégie le positionnement
professionnel et les accès aux projets et au contact. Les sections sont délimitées
par des bandes sur toute la largeur : fond blanc pour Projets, lavande pour Stack
et Contact, ivoire pour À propos. Le contenu conserve les mêmes alignements.
Les titres reprennent les libellés de navigation : **Projets**, **Stack**, **À propos**
et **Contact**. Leur taille, leur graisse, leur couleur violette et un repère vertical
les distinguent des titres de projets. Les espaces entre les blocs s’adaptent à
l’écran, avec 88 px de respiration verticale sur ordinateur et 48 px sur téléphone.
Les fiches projets commencent directement par leur nom et privilégient un résumé compact.
Le récit STAR et la démarche IA se consultent dans un élément HTML `details`, fermé
par défaut. Le contrôle « Voir l’étude de cas » apparaît sans trait de séparation
au-dessus. Son élément `summary` fonctionne au clavier et sans JavaScript ; le
contenu complet reste présent dans le HTML pré-rendu. Les technologies sont affichées
sans encadrés dans les fiches pour alléger leur présentation.
Le libellé de durée est affiché tel qu’il est renseigné, suivi de sa description
dans le même paragraphe, avec les dates juste en dessous.
La mise en page est adaptée aux téléphones dès 320 px, aux tablettes et aux ordinateurs.

Les quatre liens de navigation restent visibles dans l’en-tête sur tous les écrans.
La hauteur de défilement vers les ancres tient compte de l’en-tête fixe.
Un lien d’évitement donne le focus au contenu principal, les liens disposent d’un focus visible,
et le défilement respecte la préférence de réduction des animations.
Les liens externes annoncent leur ouverture dans un nouvel onglet et utilisent
`noopener noreferrer`. Les captures disposent d’un texte alternatif ; l’illustration
décorative est masquée aux lecteurs d’écran.

Les polices DM Sans et Manrope sont chargées depuis Google Fonts avec `display=swap`.
Des polices de remplacement permettent d’afficher le contenu si ce service est indisponible.
Les captures sont locales et chargées à la demande. Aucun site externe n’est embarqué
dans une iframe et aucun formulaire de démonstration n’est affiché.

### Micro-animations

Les micro-animations accompagnent les interactions, sans modifier les titres ni déplacer
les textes pendant la lecture :

- Le menu affiche un soulignement violet au survol et au focus clavier, en 150 ms.
  Le trait reste hors du flux pour ne pas déplacer les liens.
- L’étoile du logo tourne de 45° au survol et au focus clavier, en 200 ms.
- Le bouton principal du Hero et celui du formulaire passent à l’échelle 0,98 pendant
  la pression, avec une transition de 120 ms.
- Pendant l’envoi, le bouton du formulaire affiche un indicateur rotatif. Sa largeur
  minimale et son emplacement d’icône limitent les variations de taille entre les états.
  Après confirmation de réussite, une coche se dessine en 200 ms à côté du message
  accessible ; le texte s’affiche immédiatement, y compris en cas d’erreur.
- Les flèches des liens du Hero et des liens externes se décalent de 3 px au survol
  et au focus clavier, avec une transition de 150 ms.
- Les captures des projets passent de l’échelle 1 à 1,02 en 200 ms. Leur cadre masque
  le débordement pour conserver les dimensions de la mise en page.
- Les études de cas s’ouvrent immédiatement avec le comportement natif de `details`.
  Seul le chevron accompagne leur état avec une rotation CSS de 180 ms ; aucune
  animation d’opacité ne masque le contenu après l’ouverture, pour éviter un scintillement.

`MotionProvider` applique `reducedMotion="user"` et charge les fonctionnalités
`domAnimation` avec `LazyMotion`. Les interactions utilisent les composants
allégés de `motion/react-m`.
`useReducedMotion` désactive les déplacements, la rotation, le zoom et la pression
quand cette préférence est active. Le soulignement et la coche sont alors instantanés,
et l’indicateur d’envoi reste fixe ; la transition CSS du chevron suit la même préférence.
Les effets ne s’activent qu’à l’interaction ou pendant l’envoi du formulaire.
Le contenu reste visible dans le HTML pré-rendu et l’élément `details` garde son
fonctionnement natif sans JavaScript. Aucun texte n’est initialisé avec une opacité nulle.

## Typage et référencement

Les configurations application et serveur activent `strict`,
`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` et `noImplicitReturns`.
Les propriétés des composants et les données éditoriales sont typées en lecture
seule. Une union discriminée impose les données STAR aux études de cas ; une autre
lie les messages du formulaire à ses états de succès ou d’erreur. Les réponses
externes restent validées à l’exécution : TypeScript ne valide pas un JSON réseau.

Après la compilation Vite, `scripts/prerender.mjs` utilise le point d’entrée
`src/entry-server.tsx` pour écrire le contenu React dans `dist/index.html`. Aucun
serveur de rendu n’est nécessaire en production. Le navigateur hydrate ce même
arbre avec `hydrateRoot` ; en développement, le montage utilise `createRoot`.
Les futurs composants doivent donc rendre leur premier affichage sans accès direct
à `window` ou `document` et conserver un rendu initial identique côté navigateur.
Le formulaire requiert JavaScript pour l’envoi ; son pré-rendu n’envoie aucun message.

Le titre, les descriptions de partage, l’URL canonique et les données structurées
`ProfilePage` / `Person` se trouvent dans `index.html`. `public/robots.txt` et
`public/sitemap.xml` utilisent le domaine `https://etoiline.dev/` ; les synchroniser
si le domaine change. Le HTML pré-rendu rend les textes et les liens explorables
sans attendre le rendu JavaScript, conformément aux
[recommandations de Google pour les sites JavaScript](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).
Ces dispositions ne constituent pas une garantie de classement ou un audit WCAG complet.

## Publication

Le contenu de `dist/`, généré par `npm run build`, peut être publié chez un hébergeur
de sites statiques. Sur Vercel, le dossier `api/` fournit aussi la fonction d’envoi
du formulaire ; copier uniquement `dist/` sur un autre hébergeur ne suffit pas à
faire fonctionner l’envoi. La clé Resend doit être configurée sur le serveur.
Les métadonnées se trouvent dans `index.html` et le favicon dans `public/favicon.svg`.
Publier le résultat de `npm run build`, qui inclut le pré-rendu et les fichiers SEO.

## Structure

- `src/App.tsx` : composition des sections, navigation, présentation et contact.
- `src/data/portfolio.ts` : profil, groupes de compétences et projets.
- `src/types/portfolio.ts` : contrats éditoriaux partagés.
- `src/components/` : `Header`, `Hero`, `Stack`, listes de technologies, icônes, liens animés et configuration Motion.
- `src/features/projects/ProjectCard.tsx` : aperçu, capture et liens du projet.
- `src/features/projects/ProjectCaseStudy.tsx` : ouverture native immédiate, récit STAR et contributions IA.
- `src/features/contact/ContactForm.tsx` : champs, indicateur d’envoi et confirmation accessibles.
- `src/features/contact/hooks/useContactForm.ts` : validation, soumission et états du formulaire.
- `src/lib/contact.ts` : appel de l’API depuis le navigateur.
- `shared/contact.ts` : règles de validation communes.
- `api/contact.ts` : entrée de la fonction Vercel.
- `server/contact.ts` : adresse de réception, validation serveur et appel de Resend.
- `tests/contact.test.mjs` : scénarios d’envoi simulés et cas d’erreur.
- `src/main.tsx` : point d’entrée React.
- `src/entry-server.tsx` : rendu React utilisé uniquement à la compilation.
- `scripts/prerender.mjs` : injection du contenu dans le HTML compilé.
- `src/index.css` : styles adaptatifs et accessibilité.
- `public/favicon.svg` : favicon Etoiline.
- `public/images/` : captures locales.
- `public/robots.txt` et `public/sitemap.xml` : exploration de l’URL canonique.
- `index.html` : document HTML et métadonnées.
- `vite.config.ts` : configuration Vite.
- `tsconfig*.json` : configuration TypeScript.

## Versions et historique

Le champ `version` de `package.json` est la source de vérité du numéro de version.
`package-lock.json` reprend ce numéro au niveau racine et dans l’entrée du projet.
Chaque version créée est repérée par un tag Git `vX.Y.Z`.

Le [changelog](CHANGELOG.md) regroupe les changements sous un titre contenant la version
et sa date, au format `## X.Y.Z - YYYY-MM-DD`, comme dans les autres projets.
Les versions les plus récentes apparaissent en premier et l’historique est conservé.

Pour préparer une version, utiliser `npm version X.Y.Z --no-git-tag-version --ignore-scripts`
pour synchroniser les fichiers npm, puis regrouper les changements en attente sous le titre
daté du changelog avant de créer le commit et son tag.
