import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { build } from 'vite'

const root = fileURLToPath(new URL('../', import.meta.url))
const output = new URL('../dist/index.html', import.meta.url)
const placeholder = '<div id="root"></div>'
const html = await readFile(output, 'utf8')
if (!html.includes(placeholder)) throw new Error('Le point d’insertion du pré-rendu est introuvable.')

// Le module de rendu est compilé comme en production, dans un dossier ignoré par Git.
// Node charge ensuite React directement, sans serveur HTTP ni résolution de développement.
const renderModule = new URL('../node_modules/.tmp/portfolio-prerender/entry-server.mjs', import.meta.url)
await build({
  root,
  ssr: { external: ['react', 'react-dom'] },
  build: {
    ssr: fileURLToPath(new URL('../src/entry-server.tsx', import.meta.url)),
    outDir: fileURLToPath(new URL('./', renderModule)),
    emptyOutDir: false,
    copyPublicDir: false,
    rollupOptions: { output: { entryFileNames: 'entry-server.mjs' } },
  },
})

const { render } = await import(renderModule.href)
const markup = render()
await writeFile(output, html.replace(placeholder, () => `<div id="root">${markup}</div>`))
console.log('Pré-rendu du portfolio terminé : le contenu est présent dans dist/index.html.')
