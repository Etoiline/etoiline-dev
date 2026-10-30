import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const root = document.getElementById('root')
if (!root) throw new Error('Le point de montage du portfolio est introuvable.')

const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Le HTML pré-rendu en production est hydraté ; Vite conserve son rendu habituel en développement.
if (root.firstElementChild) hydrateRoot(root, app)
else createRoot(root).render(app)
