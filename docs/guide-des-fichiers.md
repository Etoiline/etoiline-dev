# Guide des fichiers du portfolio

Ce document accompagne les commentaires français placés dans les sources. Il explique
où intervient chaque fichier, ce qui l’utilise et ce qu’il faut maintenir ensemble.
Les commentaires portent sur les responsabilités, les contrats et les choix utiles
à comprendre ; ils ne changent pas le fonctionnement de l’application.

Les chemins ci-dessous partent de la racine du dépôt. Les fichiers JSON stricts
restent sans commentaire interne, car leur syntaxe ne l’autorise pas. Les fichiers
de verrouillage sont entretenus par leurs gestionnaires de paquets et les images
sont des fichiers binaires ; leur explication se trouve ici.

## Parcours d’une page et d’un message

Pendant `npm run build`, TypeScript vérifie le navigateur et le code Node. Vite
compile ensuite l’interface à partir de `index.html` et de `src/main.tsx`.
`scripts/prerender.mjs` compile `src/entry-server.tsx`, appelle son rendu d’App
et remplit la racine du HTML généré. Le résultat à publier est le dossier `dist/`.

À l’ouverture du site, le navigateur reçoit ce HTML déjà rempli. `src/main.tsx`
le réutilise pour activer les interactions React. `App.tsx` assemble les composants
à partir des textes et des données locales, sans charger le contenu des projets
depuis une autre API.

Une soumission du formulaire suit les responsabilités suivantes :

1. `ContactForm.tsx` fournit les champs et le retour accessible.
2. `useContactForm.ts` lit la saisie, la valide et gère l’état d’envoi.
3. `src/lib/contact.ts` transmet le JSON à `/api/contact`.
4. `api/contact.ts` fournit le point d’entrée reconnu par Vercel.
5. `server/contact.ts` contrôle la requête puis appelle Brevo avec la clé privée.
6. Le client attend une confirmation explicite avant d’effacer les champs.

Le pare-feu Vercel peut interrompre ce parcours avant l’étape 4. Une réponse `429`
indique alors une limitation de fréquence ; le navigateur n’a pas besoin d’un corps
JSON pour afficher son message d’attente. La règle est un réglage du projet hébergé,
distinct des fichiers Git et des tests locaux.

## Documents et gestion du dépôt

### `README.md`

Point de départ pour installer, lancer, personnaliser et déployer le portfolio.
Il décrit aussi le formulaire, les variables privées, les vérifications et les
protections à configurer. Le présent guide développe l’organisation fichier par fichier.

### `AGENTS.md`

Instructions destinées aux agents qui travaillent dans le dépôt : commentaires et
documentation en français, vérifications adaptées et règles de validation, de commit
et de version. Ce fichier n’est pas chargé par le site et ne configure pas Vercel.

### `CHANGELOG.md`

Historique des changements importants pour le projet. Lorsqu’un travail est validé,
son résumé anglais est ajouté en tête avant le commit. Une création de version
regroupe les changements en attente sous une section datée tout en préservant l’historique.

### `.gitignore`

Définit ce que Git doit ignorer lorsqu’un fichier n’est pas encore suivi : dépendances,
résultats de compilation, journaux, réglages locaux et formats courants de secrets.
L’exception `!.env.example` conserve le modèle public. Une exclusion ne retire pas
un fichier déjà indexé et ne supprime pas une valeur présente dans un ancien commit.

### `.env.example`

Modèle public des variables privées du serveur. `BREVO_API_KEY` reste vide ; une vraie
valeur se configure dans Vercel ou dans un `.env.local` ignoré. `CONTACT_FROM` est
facultatif et ne change que l’adresse d’expédition, avec un expéditeur autorisé dans
Brevo. Aucun de ces réglages ne crée un compte ni ne valide un domaine automatiquement.

## Dépendances et outils

### `package.json`

Décrit le projet, sa version, ses dépendances directes et les commandes disponibles.
`type: module` choisit les modules JavaScript ESM. `private: true` empêche une publication
npm involontaire ; ce champ ne rend pas le dépôt GitHub privé.

Les dépendances applicatives sont React, React DOM et Motion. Les outils de développement
comprennent TypeScript, Vite, son plugin React, Oxlint et les déclarations de types.
Les paquets marqués `@types/` fournissent des informations au compilateur, sans ajouter
de composant à l’interface.

| Commande | Travail effectué |
| --- | --- |
| `npm run dev` | Démarre l’interface Vite avec actualisation de développement ; ne lance pas l’API Vercel. |
| `npm run lint` | Vérifie les règles Oxlint du projet. |
| `npm test` | Exécute les simulations du formulaire avec le moteur de tests Node. |
| `npm run build` | Vérifie les deux projets TypeScript, compile le client et pré-rend le HTML. |
| `npm run preview` | Sert le résultat compilé pour le consulter ; ne reproduit pas la fonction Vercel. |

### `package-lock.json`

Enregistre l’arbre de dépendances résolu par npm, avec versions, origines et empreintes
de contrôle des paquets. Il permet notamment une installation reproductible avec
`npm ci`. Une empreinte `integrity` décrit le contenu d’une archive : elle ne donne
pas accès à un service et ne constitue pas une clé API.

Ne pas ajouter de commentaires ou modifier manuellement les empreintes. Faire évoluer
les dépendances avec npm, puis relire les différences de versions et les vérifications.

### `pnpm-lock.yaml`

Remplit le même rôle pour pnpm, avec sa description des versions et des associations
entre dépendances et dépendances homologues. Il ne remplace pas le fichier de verrouillage
npm. Lors d’une mise à jour, conserver les deux compatibles avec `package.json` et vérifier
que chacun résout une version corrigée des paquets concernés.

Les jonctions créées par pnpm sous Windows doivent être accessibles au processus
TypeScript ; le dépannage correspondant est décrit dans le README.

### `.oxlintrc.json`

Configuration JSON stricte du lint. `$schema` aide l’éditeur à vérifier les options.
Les plugins activent les règles React, TypeScript et Oxc. `react/rules-of-hooks`
traite comme une erreur les appels de hooks incompatibles avec leurs règles.
`react/only-export-components` signale les exports qui gênent l’actualisation des
composants, tout en acceptant les exports de constantes prévus par sa configuration.

### `vite.config.ts`

Options partagées du serveur de développement et du bundler. Le plugin React prend
en charge le TSX et l’actualisation de développement. Le script de pré-rendu charge
aussi Vite en complétant ces options pour produire un module Node temporaire.
Ce fichier ne déclare ni clé Brevo ni serveur de messagerie.

Il lit le champ `version` de `package.json` et le fournit à l’interface via la
constante `__APP_VERSION__`. Seul ce numéro est injecté ; les autres champs du
manifeste ne sont pas importés par les composants React. Le pré-rendu réutilise
la même définition pour afficher la même version avant et après l’hydratation.

### `tsconfig.json`

Projet de coordination utilisé par `tsc -b`. Sa liste `files` vide laisse la sélection
des sources aux deux projets référencés. La compilation vérifie ainsi l’interface
et le code Node avec leurs environnements respectifs.

### `tsconfig.app.json`

Contrôle `src/` avec les API du navigateur, le JSX React et la résolution de modules
du bundler. Les imports de modules partagés sont également suivis. `noEmit` laisse
Vite produire le JavaScript ; le cache du build TypeScript reste dans `node_modules/.tmp/`.

Le typage strict impose de vérifier les propriétés facultatives et les accès indexés.
Les options complémentaires détectent les symboles inutilisés, les retours manquants
et les incohérences de casse des imports. `erasableSyntaxOnly` garde un TypeScript
dont les annotations peuvent être retirées sans générer de constructions supplémentaires.

### `tsconfig.node.json`

Contrôle `api/`, `server/`, `shared/` et `vite.config.ts` avec les déclarations Node.
La résolution `NodeNext` suit les conventions ESM du projet. L’absence de bibliothèque
DOM évite de considérer `document` comme disponible côté serveur. Les exigences
de typage restent alignées avec celles de l’interface.

## HTML, démarrage et composition React

### `index.html`

Document de base contenant la langue, les métadonnées de recherche et de partage,
l’icône et le point d’entrée Vite. Le script JSON-LD décrit la page profil et sa
personne principale ; son contenu doit rester du JSON valide.

La racine `<div id="root"></div>` est le repère exact du pré-rendu. Modifier cette
forme implique d’adapter le script qui la remplace. Les métadonnées ne sont pas
calculées depuis `portfolio.ts` : leurs textes doivent être maintenus séparément.

### `src/main.tsx`

Point d’entrée navigateur. Il charge le CSS, cherche la racine puis y monte App.
Si la racine contient déjà le HTML pré-rendu, `hydrateRoot` le réutilise ; sinon
`createRoot` crée l’interface, comme en développement. `StrictMode` aide à détecter
des problèmes de rendu et d’effets pendant le développement.

### `src/entry-server.tsx`

Point d’entrée de compilation appelé par le script de pré-rendu. Sa fonction `render`
transforme App en chaîne HTML avec React DOM Server. Elle ne démarre aucun serveur
et ne soumet pas le formulaire. Les composants qu’elle rend doivent fonctionner sans DOM.

### `src/App.tsx`

Assemble l’en-tête, l’accueil, les projets, les compétences, la présentation, le
contact et le pied de page sous le même contexte Motion. Le lien d’évitement donne
accès au contenu principal et les identifiants des sections sont les destinations
de la navigation. Le composant ne porte pas la logique d’envoi des e-mails.

L’année du pied de page est évaluée au chargement du module, pendant le build puis
dans le navigateur. Les textes généraux restent ici ; les informations réutilisées
et les projets proviennent de `src/data/portfolio.ts`.
La version affichée à côté du crédit est fournie par Vite depuis `package.json`.

### `src/vite-env.d.ts`

Déclare le type de `__APP_VERSION__` pour que TypeScript reconnaisse cette constante
dans les composants. Ce fichier de déclarations ne fournit pas de valeur à l’exécution :
Vite effectue le remplacement à partir de sa configuration, pour le client et le pré-rendu.

### `src/index.css`

Feuille globale regroupant les couleurs, les polices, les règles communes et les
styles des composants. Les sélecteurs suivent les `className` du TSX. `.page-width`
aligne le contenu, `.sr-only` masque un texte visuellement sans le retirer de la
lecture assistée et `.skip-link` devient visible au focus clavier.

Les règles de largeur à 1 100, 800 et 600 pixels adaptent progressivement les
marges, la navigation et les grilles. `prefers-reduced-motion` complète les réglages
Motion pour le défilement et les transitions CSS. Les polices sont chargées depuis
Google Fonts avec des familles de secours.

## Données et contrats éditoriaux

### `src/data/portfolio.ts`

Source du profil partagé, des groupes de compétences et des fiches projet. Les
tableaux fixent l’ordre d’affichage ; leurs identifiants doivent rester uniques.
Les chemins d’image commencent à la racine publique, par exemple `/images/mouvair.jpg`.

`presentation: 'case-study'` exige le récit STAR, les contributions IA et la chronologie.
`presentation: 'overview'` permet une fiche compacte. Les jalons de projet décrivent
les sources historiques indiquées, sans mesurer automatiquement le temps travaillé.
Ces données sont publiques et compilées avec l’interface.

### `src/types/portfolio.ts`

Contrats TypeScript des profils, groupes et projets. `Readonly` et les tableaux
en lecture seule expriment que les composants ne modifient pas leur contenu.
L’union discriminée `Project` relie la présentation au contenu exigé pour chaque variante.

`ExternalUrl` attend une chaîne HTTPS et le type de capture attend un chemin public.
Ces contraintes interviennent à la compilation ; elles ne prouvent ni la disponibilité
d’un lien ni la validité de données arbitraires reçues d’un service externe.

## Composants partagés

### `src/components/MotionProvider.tsx`

Fournit la configuration Motion à tous les descendants d’App. `LazyMotion` charge
les fonctionnalités `domAnimation` utilisées par les composants allégés de
`motion/react-m`. Le mode `strict` aide à éviter l’introduction d’un composant
Motion complet dans cet arbre. La préférence de mouvements réduits est respectée.

### `src/components/Header.tsx`

Affiche la marque et les ancres de navigation. Les libellés et destinations sont
centralisés dans `navigationItems` et doivent correspondre aux sections réelles.
Le logo et le soulignement des liens réagissent au focus comme au survol ; les
mouvements sont adaptés à la préférence du visiteur.

### `src/components/Hero.tsx`

Affiche le métier, l’expérience, l’accroche principale et la disponibilité. Il porte
le titre h1 et l’ancre `accueil`. Son illustration SVG est décorative : elle reste
hors de la lecture assistée et ne dépend pas d’une image externe.

### `src/components/Stack.tsx`

Présente les groupes de compétences dans une liste à partir des données reçues.
Chaque groupe possède un titre, une description et une `TechnologyList` contextualisée.
Le composant fournit sa propre section `stack`, directement intégrée dans App.

### `src/components/TechnologyList.tsx`

Transforme des libellés de technologie en liste HTML. Le CSS les présente en badges
ou en texte selon leur contexte. Une liste vide ne crée aucun élément ; les libellés
doivent être uniques dans un même tableau puisqu’ils servent aussi de clés React.

### `src/components/AnimatedLink.tsx`

Lien générique avec flèche animée au survol et au focus. Il conserve un rendu
initial visible compatible avec le pré-rendu et laisse sa flèche au repos lorsque
les mouvements sont réduits. Ses attributs `target` et `rel` viennent de l’appelant.

### `src/components/ExternalLink.tsx`

Spécialise le lien animé pour les URL externes en nouvel onglet. Il applique
`noopener noreferrer`, oriente la flèche et ajoute une annonce masquée visuellement
pour prévenir de l’ouverture du nouvel onglet. Cette convention évite de réécrire
ces attributs dans chaque lien éditorial.

### `src/components/Icons.tsx`

Fournit l’étoile et la flèche sous forme de SVG. `currentColor` permet au CSS
de leur donner la couleur du texte environnant. Ces pictogrammes sont décoratifs ;
les liens et boutons doivent rester compréhensibles grâce à leur propre libellé.

## Présentation des projets

### `src/features/projects/ProjectCard.tsx`

Compose le résumé d’un projet : capture, nom, description, stack et liens. Une
capture absente ou impossible à charger est remplacée par un visuel portant le nom
du projet. Les dimensions, le chargement différé et le cadrage CSS préservent une
présentation utilisable pendant le chargement.

Un dépôt privé reste présenté comme privé avec un lien de contact ; cette indication
ne contourne pas les permissions GitHub. La variante de présentation décide si
`ProjectCaseStudy` peut être affiché et permet au compilateur de vérifier ses données.

### `src/features/projects/ProjectCaseStudy.tsx`

Présente le récit STAR dans un élément natif `details/summary`, utilisable sans
JavaScript. Le récit emploie une liste de définitions et les contributions IA
une liste ordonnée. Les identifiants accessibles sont préfixés par le projet
pour éviter les collisions entre plusieurs fiches.

Les dates ISO sont affichées en français avec le fuseau UTC pour garder le même
résultat lors du pré-rendu et dans les différents fuseaux des visiteurs.

## Formulaire, validation et e-mail

### `src/features/contact/ContactForm.tsx`

Porte les champs et leurs labels, les limites HTML, le champ leurre et les retours
visuels. Les attributs `name` correspondent aux propriétés du contrat partagé.
Le `fieldset` est désactivé pendant l’envoi et la zone de statut annonce son résultat
aux lecteurs d’écran. Le hook réalise les opérations asynchrones.

### `src/features/contact/hooks/useContactForm.ts`

Gère les états `idle`, `sending`, `success` et `error`. Les champs restent gérés
par le formulaire HTML et sont lus via `FormData` lors de la soumission. Une ref
verrouille immédiatement les doubles soumissions, avant le prochain rendu React.

Le formulaire est effacé uniquement après succès confirmé. Une erreur conserve
la saisie présente dans la page, sans sauvegarde persistante après rechargement.
Le verrou de l’interface ne remplace pas la limitation de fréquence du serveur hébergé.

### `shared/contact.ts`

Définit les longueurs admises et la fonction de validation utilisée des deux côtés.
Elle reçoit une valeur inconnue, contrôle les types, retire les espaces périphériques
et renvoie un message normalisé ou `null`. Les champs supplémentaires ne sont pas
recopiés dans le résultat.

Le champ leurre doit rester vide et l’adresse doit respecter un contrôle de forme.
Ce contrôle ne vérifie pas que la boîte existe. Les longueurs de chaîne sont distinctes
de la taille en octets contrôlée par le serveur sur le corps HTTP complet.

### `src/lib/contact.ts`

Client de `/api/contact` dans le navigateur. Il transmet du JSON avec un délai de
quinze secondes et traduit les erreurs HTTP ou réseau en retours compréhensibles.
Il gère `429` même sans JSON et traite `422` comme un problème de saisie.

Un statut 200 ou une page HTML ne valent pas confirmation : le résultat doit être
un objet JSON contenant `success: true`. Le client ne connaît pas la clé privée
Brevo ni le contrat HTTP de ce prestataire.

### `api/contact.ts`

Adaptateur Vercel de `/api/contact`. Son export fournit le gestionnaire `fetch`
construit par `server/contact.ts`. Créer ce gestionnaire n’envoie aucun e-mail ;
il attend une requête. Le dossier `api/` est une convention d’hébergement et le
traitement peut être réutilisé ailleurs avec un adaptateur correspondant.

### `server/contact.ts`

Contrôle la méthode POST, l’origine, le type JSON, la taille du corps et les champs
avant de contacter Brevo. La lecture du flux mesure la taille réelle, même si
`Content-Length` est absent ou incorrect. Une origine conforme ne suffit pas à
reconnaître un humain : un robot peut fabriquer cet en-tête.

Le destinataire reste fixe et le visiteur ne choisit pas l’expéditeur. Son adresse
sert au champ de réponse. Le contenu est transmis en texte brut, avec la clé privée
lue depuis l’environnement et un délai de dix secondes pour le prestataire.
Une acceptation n’est confirmée qu’avec un `messageId` non vide ; les détails privés
des erreurs du prestataire ne sont pas renvoyés au navigateur.

L’identifiant de déduplication UUIDv5 dépend du contenu normalisé. Son espace de noms
hexadécimal est public et ne permet aucune authentification. La déduplication de
deux contenus identiques ne bloque pas une série de messages différents ; la règle
de fréquence reste dans le pare-feu Vercel.

### `tests/contact.test.mjs`

Tests Node qui remplacent les appels réseau et utilisent une clé fictive. Ils
vérifient le contrat envoyé à Brevo, les champs rejetés, les limites HTTP, les
erreurs du prestataire, la déduplication et la confirmation attendue par le client.
Les requêtes construites dans les tests sont transmises directement au gestionnaire.

Ces simulations ne créent pas de compte, ne consomment pas de quota Brevo et ne
prouvent pas qu’un e-mail réel sera livré. L’authentification du domaine, les droits
de la clé et la règle de pare-feu nécessitent leur configuration sur les services hébergés.

## Pré-rendu et ressources publiques

### `scripts/prerender.mjs`

Script Node lancé après la compilation client. Il vérifie la racine HTML, compile
le point d’entrée de rendu dans `node_modules/.tmp/portfolio-prerender/`, importe
sa fonction `render` puis remplace uniquement le conteneur React du document final.

Le remplacement conserve les métadonnées et les liens vers les ressources compilées.
Une fonction de remplacement préserve aussi les éventuels caractères spéciaux du
HTML produit. Le script se lance après un nouveau build Vite : le relancer seul
sur un HTML déjà rempli ne retrouve plus le repère vide attendu.

### `public/favicon.svg`

Étoile de marque utilisée comme icône d’onglet, avec son fond ivoire. Le dessin
vectoriel utilise un repère 64 × 64 et reste indépendant du composant React d’icône.
Vite le recopie dans le site compilé ; il ne contient aucun code d’envoi d’e-mail.

### `public/robots.txt`

Autorise l’exploration du site et indique l’adresse du sitemap. Ce sont des consignes
publiques aux robots, pas une règle de contrôle d’accès ni une protection contre le spam.

### `public/sitemap.xml`

Déclare l’unique URL canonique du portfolio pour les moteurs de recherche. Les ancres
internes ne sont pas des pages supplémentaires. Si le domaine change, maintenir
aussi l’URL canonique, les métadonnées et le lien du sitemap dans `robots.txt`.

### `public/images/mouvair.jpg`

Capture locale du projet Mouv’Air, référencée par sa fiche dans `portfolio.ts`.
Le texte alternatif et les dimensions sont décrits dans les données, pas inscrits
comme commentaire dans le fichier JPEG. Une nouvelle capture doit rester publique
et exempte d’informations privées.

### `public/images/crinserein.jpg`

Capture locale du projet Crin Serein avec son interface de démonstration. Elle suit
le même contrat d’image et le même cadrage que Mouv’Air. Le nom de fichier doit rester
aligné avec `image.src` si la ressource est remplacée ou renommée.

### `docs/guide-des-fichiers.md`

Le présent guide complète les commentaires près du code, notamment pour les formats
qui n’acceptent pas de commentaires. Mettre à jour sa description lorsqu’un fichier
change de responsabilité, est ajouté ou disparaît. Il s’agit de documentation et
ce document n’est pas chargé par l’application.

## Fichiers locaux et générés

`node_modules/`, `dist/`, les caches, `.vercel/` et les fichiers locaux ignorés ne
sont pas des sources à commenter ou à modifier manuellement. Leurs rôles et leur
génération sont expliqués ci-dessus. Toute valeur secrète doit rester dans les
variables privées du serveur, jamais dans un fichier publié ni dans un commentaire.
