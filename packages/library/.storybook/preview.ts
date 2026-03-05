import type { Preview } from '@storybook/react'
import { create } from '@storybook/theming/create'
import '../src/static/styles/reset.css'
import '@void-ui/tokens/css'

const voidTheme = create({
  base:       'dark',
  brandTitle: 'void-ui',
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
  },
}

export default preview
