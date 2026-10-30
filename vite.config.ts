/**
 * Configuration commune au développement et à la compilation des ressources de l’interface.
 * Le pré-rendu réutilise Vite avec des options SSR supplémentaires dans scripts/prerender.mjs.
 * Cette configuration ne crée pas la route /api/contact : celle-ci est prise en charge par Vercel.
 */
import { readFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Seule la version publique du manifeste est injectée dans l’interface et le HTML pré-rendu.
// Le chemin part de ce fichier pour ne pas dépendre du dossier courant de la commande.
const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as { version: string }

// defineConfig fournit le typage et les aides de l’éditeur sans modifier le format des options Vite.
export default defineConfig({
  // Le plugin prend en charge React/TSX et l’actualisation des composants pendant le développement.
  plugins: [react()],
  // JSON.stringify fournit une chaîne JavaScript littérale au remplacement effectué par Vite.
  define: { __APP_VERSION__: JSON.stringify(version) },
})
