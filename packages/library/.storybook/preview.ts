import type { Preview } from '@storybook/react'
import { create } from '@storybook/theming/create'
import '../src/static/styles/reset.css'
import '../../../packages/tokens/dist/variables.css'
import '../../../packages/tokens/dist/planets/mercury.css'
import '../../../packages/tokens/dist/planets/venus.css'
import '../../../packages/tokens/dist/planets/earth.css'
import '../../../packages/tokens/dist/planets/moon.css'
import '../../../packages/tokens/dist/planets/mars.css'
import '../../../packages/tokens/dist/planets/jupiter.css'
import '../../../packages/tokens/dist/planets/saturn.css'
import '../../../packages/tokens/dist/planets/europa.css'
import '../../../packages/tokens/dist/planets/uranus.css'
import '../../../packages/tokens/dist/planets/neptune.css'
import '../../../packages/tokens/dist/planets/io.css'
import '../../../packages/tokens/dist/planets/nostromo.css'

const voidTheme = create({
  base:       'dark',
  brandTitle: 'open-void-ui',
  brandUrl:   'https://github.com/Vargland/void-ui',
})

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'void',
      values: [
        { name: 'void',  value: '#0a0a0a' },
        { name: 'dark',  value: '#111111' },
        { name: 'light', value: '#f5f5f5' },
      ],
    },
    controls: {
      matchers: {
        date: /Date$/i,
      },
    },
    docs: {
      theme: voidTheme,
    },
    options: {
      storySort: {
        order: [
          'void-ui',       // Welcome page group (sits first)
          'Layout',        // Stack, etc.
          'Components',    // all component stories
        ],
      },
    },
  },
}

export default preview
