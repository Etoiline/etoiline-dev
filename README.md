# Etoiline

Portfolio personnel en français, développé avec React, TypeScript et Vite.
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
- `npm run build` : vérifier TypeScript et générer le site statique dans `dist/`.
- `npm run preview` : prévisualiser le site compilé.

## Contenu et personnalisation

- `src/data/portfolio.ts` centralise les projets et le nom public.
- Le nom public s’écrit **Etoiline**, avec une majuscule et sans accent. `portfolio.name`
  définit le nom affiché dans l’en-tête et le pied de page ; les métadonnées sont dans `index.html`.
- Le contact passe par le formulaire. L’adresse de réception est définie uniquement
  dans `server/contact.ts` ; elle n’est ni affichée sur la page ni incluse dans le
  JavaScript distribué au navigateur.
- Chaque projet possède un identifiant unique, un nom, une catégorie, une description
  et une URL. Les champs facultatifs `image` et `imageAlt` définissent sa capture
  et sa description accessible.
- Pour ajouter un projet, ajouter une entrée à la liste et sa capture dans `public/images/`.
  Sans capture, ou si le fichier est indisponible, un aperçu affiche le nom du projet.
- La capture de Mouv’Air, réalisée le 5 octobre 2026, se trouve dans
  `public/images/mouvair.jpg` (1265 × 712 px).
- La capture de Crin Serein, réalisée le 27 octobre 2026, se trouve dans
  `public/images/crinserein.jpg` (1265 × 712 px).
- Les aperçus sont cadrés en haut au ratio 2:1. Leur lien ouvre le site réel.
  Remplacer les captures lorsque les interfaces évoluent.
- Les textes se modifient dans `src/App.tsx` et les styles dans `src/index.css`.
- La section « À propos » présente trois ans d’expérience en développement, les
  technologies React, React Native, FastAPI pour le backend et Hugo, l’utilisation
  de l’IA comme aide au développement, ainsi que les projets personnels Mouv’Air
  et Crin Serein. Actualiser la durée d’expérience lorsque cette présentation évolue.

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

La page reprend une palette ivoire et violette, une typographie sans sérif et une
illustration vectorielle de l’étoile Etoiline. Les projets sont présentés dans une
mise en page ouverte. Les sections À propos et Contact utilisent le même fond.
L’accueil associe le titre « Des idées. Du code. Des projets. », une courte présentation
et l’illustration. L’accès aux sections passe par la navigation de l’en-tête.
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
de sites statiques. Sur Vercel, le dossier `api/` fournit aussi la fonction d’envoi
du formulaire ; copier uniquement `dist/` sur un autre hébergeur ne suffit pas à
faire fonctionner l’envoi. La clé Resend doit être configurée sur le serveur.
Les métadonnées se trouvent dans `index.html` et le favicon dans `public/favicon.svg`.
Ajouter une URL canonique lorsque l’adresse publique définitive du portfolio est fixée.

## Structure

- `src/App.tsx` : sections du portfolio, illustration et captures des projets.
- `src/data/portfolio.ts` : projets et nom public.
- `src/components/ContactForm.tsx` : champs, validation et retours d’envoi accessibles.
- `src/lib/contact.ts` : appel de l’API depuis le navigateur.
- `shared/contact.ts` : règles de validation communes.
- `api/contact.ts` : entrée de la fonction Vercel.
- `server/contact.ts` : adresse de réception, validation serveur et appel de Resend.
- `tests/contact.test.mjs` : scénarios d’envoi simulés et cas d’erreur.
- `src/main.tsx` : point d’entrée React.
- `src/index.css` : styles adaptatifs et accessibilité.
- `public/favicon.svg` : favicon Etoiline.
- `public/images/` : captures locales.
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
