import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'

// Le même arbre React fournit le HTML indexable et le point de départ de l’hydratation.
export function render(): string {
  return renderToString(<StrictMode><App /></StrictMode>)
}
