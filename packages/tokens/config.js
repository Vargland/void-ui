import { readdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const planetsDir = resolve(__dirname, 'tokens/planets')

// Detect all planet files dynamically
const planetNames = readdirSync(planetsDir)
  .filter(f => f.endsWith('.json'))
  .map(f => f.replace('.json', ''))

// ─── Base config (primitives + semantic defaults → :root) ─────────────────────
export const baseConfig = {
  source: ['tokens/base.json', 'tokens/theme.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'void',
      buildPath: 'dist/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
          options: {
            selector: ':root',
            outputReferences: true,
          },
        },
      ],
    },
    scss: {
      transformGroup: 'scss',
      prefix: 'void',
      buildPath: 'dist/',
      files: [
        {
          destination: 'tokens.scss',
          format: 'scss/variables',
          options: { outputReferences: true },
        },
      ],
    },
    js: {
      transformGroup: 'js',
      buildPath: 'dist/',
      files: [
        { destination: 'tokens.js', format: 'javascript/es6' },
        { destination: 'tokens.d.ts', format: 'typescript/es6-declarations' },
      ],
    },
  },
}

// ─── Planet configs (one per planet → [data-void-planet="..."] selector) ─────
export const planetConfigs = planetNames.map(planet => ({
  source: [`tokens/planets/${planet}.json`],
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'void',
      buildPath: 'dist/planets/',
      files: [
        {
          destination: `${planet}.css`,
          format: 'css/variables',
          options: {
            selector: `[data-void-planet="${planet}"]`,
            outputReferences: false,
          },
        },
      ],
    },
  },
}))

export { planetNames }
