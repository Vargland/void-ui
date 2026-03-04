import StyleDictionary from 'style-dictionary'
import config from './config.js'

console.log('🔨 Building @void-ui/tokens...\n')

const sd = new StyleDictionary(config)

await sd.buildAllPlatforms()

console.log('\n✅ Tokens built successfully.')
console.log('   → dist/variables.css  (CSS custom properties)')
console.log('   → dist/tokens.scss    (SCSS variables)')
console.log('   → dist/tokens.js      (ES6 module)')
console.log('   → dist/tokens.d.ts    (TypeScript declarations)')
