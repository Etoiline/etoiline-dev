/**
 * Point d’entrée exécuté par le navigateur à partir de `index.html`.
 * Il rattache l’application à son conteneur et active les interactions React.
 * Le rendu initial destiné à la compilation se trouve dans `entry-server.tsx`.
 */
import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
// Vite traite cet import comme une feuille de style et l’intègre aux ressources du site.
import './index.css'
import App from './App.tsx'

// Un conteneur manquant signale un HTML incompatible : arrêter ici évite un échec silencieux.
const root = document.getElementById('root')
if (!root) throw new Error('Le point de montage du portfolio est introuvable.')

// En développement, StrictMode aide à repérer les effets et rendus qui supportent mal une répétition.
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Le HTML pré-rendu en production est hydraté ; Vite conserve son rendu habituel en développement.
// Hydrater réutilise les éléments existants ; créer une racine remplit le conteneur encore vide.
if (root.firstElementChild) hydrateRoot(root, app)
else createRoot(root).render(app)
