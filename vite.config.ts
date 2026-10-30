/**
 * Configuration commune au développement et à la compilation des ressources de l’interface.
 * Le pré-rendu réutilise Vite avec des options SSR supplémentaires dans scripts/prerender.mjs.
 * Cette configuration ne crée pas la route /api/contact : celle-ci est prise en charge par Vercel.
 */
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// defineConfig fournit le typage et les aides de l’éditeur sans modifier le format des options Vite.
export default defineConfig({
  // Le plugin prend en charge React/TSX et l’actualisation des composants pendant le développement.
  plugins: [react()],
})
