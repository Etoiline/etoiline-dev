/**
 * Point d’entrée utilisé par `scripts/prerender.mjs` pendant la compilation.
 * Il transforme App en texte HTML dans Node.js, sans ouvrir de serveur HTTP.
 * Les composants partagés doivent donc pouvoir rendre sans `window` ni `document`.
 */
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'

// Le même arbre React fournit le HTML indexable et le point de départ de l’hydratation.
export function render(): string {
  // Les gestionnaires d’événements seront activés par main.tsx ; ce rendu ne soumet aucun formulaire.
  return renderToString(<StrictMode><App /></StrictMode>)
}
