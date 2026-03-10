import StyleDictionary from 'style-dictionary'
import { baseConfig, planetConfigs, planetNames } from './config.js'

console.log('🔨 Building @open-void-ui/tokens...\n')

// ─── Base tokens (:root) ──────────────────────────────────────────────────────
const sd = new StyleDictionary(baseConfig)
await sd.buildAllPlatforms()

console.log('   ✓ dist/variables.css  (CSS custom properties → :root)')
console.log('   ✓ dist/tokens.scss    (SCSS variables)')
console.log('   ✓ dist/tokens.js      (ES6 module)')
console.log('   ✓ dist/tokens.d.ts    (TypeScript declarations)')

// ─── Planet tokens ([data-void-planet="..."]) ─────────────────────────────────
console.log('\n🪐 Building planet themes...\n')

for (const [i, config] of planetConfigs.entries()) {
  const planet = planetNames[i]
  const sdPlanet = new StyleDictionary(config)
  await sdPlanet.buildAllPlatforms()
  console.log(`   ✓ dist/planets/${planet}.css`)
}

console.log('\n✅ All tokens built successfully.')
console.log(`   ${planetNames.length} planet themes: ${planetNames.join(', ')}`)
