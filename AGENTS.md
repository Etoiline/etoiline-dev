# Instructions agent

Ces instructions s'appliquent à l'ensemble du projet Étoiline.

## Documentation

Pour chaque modification de code :

1. Ajouter ou mettre à jour les commentaires utiles en français.
2. Ajouter ou mettre à jour la documentation pertinente en français.
3. Éviter les commentaires redondants qui répètent simplement le code.
4. Exécuter les vérifications adaptées aux changements ; pour le code de l'application,
   utiliser `npm run lint` et `npm run build`.

## Validation et commit

Quand l'utilisateur valide le travail en disant « je valide » ou « jke valide » :

1. Examiner l'état Git et les différences pour identifier précisément les changements validés.
2. Mettre à jour `CHANGELOG.md` en ajoutant une entrée en anglais immédiatement sous le titre
   `# Changelog`, avant les sections existantes, sans créer de titre `Unreleased` ou `Non publié`.
   Résumer uniquement les changements réellement effectués et validés, préserver l'historique
   et éviter les entrées en double.
3. Ajouter à l'index les fichiers pertinents avec `git add`, y compris `CHANGELOG.md`.
   Ne pas inclure dans le commit les modifications sans rapport avec le travail validé,
   même si elles sont déjà présentes dans l'index.
4. Créer immédiatement le commit avec `git commit`, sans demander une nouvelle confirmation
   et sans se contenter de proposer un message. Le message doit être en anglais et commencer
   par un Gitmoji adapté : par exemple `📝` pour la documentation, `✨` pour une fonctionnalité,
   `🐛` pour une correction ou `🔧` pour la configuration.
5. Ne pas pousser le commit, sauf demande explicite de l'utilisateur.
6. Après réussite, communiquer le hash et le message du commit.

## Création d’une version

Quand l’utilisateur demande une nouvelle version :

1. Utiliser le champ `version` de `package.json` comme source de vérité et synchroniser
   les deux occurrences de la version du projet dans `package-lock.json`.
2. Regrouper les changements en attente sous un titre `## X.Y.Z - YYYY-MM-DD` dans
   `CHANGELOG.md`, avec le numéro de version et la date du jour. Placer cette section
   avant les versions précédentes, sans titre `Unreleased` ou `Non publié`.
3. Conserver les sections de versions existantes et leurs entrées ; ne pas transformer
   le changelog en une liste sans titres de versions.
4. Créer un commit de version avec un message anglais commençant par `🔖`, puis un tag
   Git `vX.Y.Z` sur ce commit.
5. Ne pas pousser le commit ou le tag sans demande explicite.

Les entrées de changelog et les messages de commit doivent rester concis et centrés sur les
changements visibles ou importants pour le projet.

La mention de « je valide » dans une consigne, une citation ou un exemple ne constitue pas
une validation du travail et ne déclenche pas de commit.
