/**
 * Prépare une page déjà remplie pendant `npm run build`, après la compilation Vite.
 * Les visiteurs et les moteurs de recherche reçoivent directement les textes et les liens,
 * sans attendre l’exécution de React dans le navigateur. Cela facilite l’exploration
 * du contenu et peut aider à son indexation.
 * Le navigateur réutilise ensuite ce HTML pour activer les interactions (hydratation).
 * Ce travail a lieu à la compilation ; aucun serveur de rendu n’est nécessaire en production.
 * Le pré-rendu affiche aussi le formulaire, mais l’envoi de ses messages reste assuré
 * par la fonction `/api/contact` : générer ce HTML ne contacte pas Brevo.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { build } from 'vite'

// Les chemins partent du script pour rester corrects quel que soit le dossier depuis lequel il est lancé.
const root = fileURLToPath(new URL('../', import.meta.url))
const output = new URL('../dist/index.html', import.meta.url)

// Le HTML de Vite contient une racine React vide, qui sera remplie avec le contenu du portfolio.
// Si ce repère a changé, on arrête le build pour éviter de publier une page sans pré-rendu.
const placeholder = '<div id="root"></div>'
const html = await readFile(output, 'utf8')
if (!html.includes(placeholder)) throw new Error('Le point d’insertion du pré-rendu est introuvable.')

// Vite transforme le point d’entrée TSX en un module JavaScript que Node peut exécuter.
// Le fichier temporaire reste ignoré par Git ; React est chargé directement par Node.
const renderModule = new URL('../node_modules/.tmp/portfolio-prerender/entry-server.mjs', import.meta.url)
await build({
  root,
  // Le module compilé utilise les dépendances React installées dans le projet, chargées par Node.
  ssr: { external: ['react', 'react-dom'] },
  build: {
    // Le mode SSR produit ici un module pour la compilation, sans démarrer de serveur de production.
    ssr: fileURLToPath(new URL('../src/entry-server.tsx', import.meta.url)),
    outDir: fileURLToPath(new URL('./', renderModule)),
    // Ce build auxiliaire conserve le dossier temporaire et n’y recopie pas les ressources publiques.
    emptyOutDir: false,
    copyPublicDir: false,
    // Le nom doit correspondre au chemin renderModule utilisé ensuite pour importer la fonction render.
    rollupOptions: { output: { entryFileNames: 'entry-server.mjs' } },
  },
})

// Le même composant App fournit le HTML initial et l’interface interactive du navigateur.
// Son premier rendu doit donc fonctionner dans Node, sans dépendre de window ou de document.
const { render } = await import(renderModule.href)
const markup = render()

// Seule la racine React est remplacée : les métadonnées et les ressources compilées sont conservées.
// La fonction de remplacement garde le texte littéral, même s’il contient une séquence spéciale comme "$&".
await writeFile(output, html.replace(placeholder, () => `<div id="root">${markup}</div>`))
console.log('Pré-rendu du portfolio terminé : le contenu est présent dans dist/index.html.')
