import type { Preview } from '@storybook/react'
import '../src/static/styles/reset.css'
import '@void-ui/tokens/css'

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
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      theme: {
        base: 'dark',
        brandTitle: 'void-ui',
        brandUrl: 'https://github.com/Vargland/void-ui',
      },
    },
  },
}

export default preview
