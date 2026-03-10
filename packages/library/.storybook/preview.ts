import type { Preview } from '@storybook/react'
import { create } from '@storybook/theming/create'
import '../src/static/styles/reset.css'
import '@open-void-ui/tokens/css'
import '@open-void-ui/tokens/planets/mercury'
import '@open-void-ui/tokens/planets/venus'
import '@open-void-ui/tokens/planets/earth'
import '@open-void-ui/tokens/planets/moon'
import '@open-void-ui/tokens/planets/mars'
import '@open-void-ui/tokens/planets/jupiter'
import '@open-void-ui/tokens/planets/saturn'
import '@open-void-ui/tokens/planets/europa'
import '@open-void-ui/tokens/planets/uranus'
import '@open-void-ui/tokens/planets/neptune'
import '@open-void-ui/tokens/planets/io'
import '@open-void-ui/tokens/planets/nostromo'

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
