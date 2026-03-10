# open-void-ui

Minimal, spatial, dark React component library. CSS custom properties. Zero config.

## Storybook

**[https://void-ui-library-git-main-varglands-projects.vercel.app/?path=/docs/void-ui-introduction--docs](https://void-ui-library-git-main-varglands-projects.vercel.app/?path=/docs/void-ui-introduction--docs)**

## Install

```sh
npm install @open-void-ui/tokens @open-void-ui/library
```

## Usage

```ts
// 1. Import styles in your root layout or _app
import '@open-void-ui/tokens/css'
import '@open-void-ui/library/styles'

// 2. Use components
import { Button, Badge } from '@open-void-ui/library'

export default function App() {
  return (
    <Button variant="primary">Get started</Button>
  )
}
```

## Theming

Apply a planet theme to any container via the `data-void-planet` attribute:

```tsx
<div data-void-planet="mars">
  <Button variant="primary">Mars theme</Button>
</div>
```

Available themes: `mercury` · `venus` · `earth` · `mars` · `jupiter` · `saturn` · `uranus` · `neptune` · `moon` · `europa` · `io` · `nostromo`

## Packages

| Package | Description |
|---|---|
| `@open-void-ui/tokens` | Design tokens — CSS custom properties, SCSS variables |
| `@open-void-ui/library` | React components |

## Development

```sh
npm install
npm run storybook        # Storybook dev server
npm run test             # Run all tests
npm run build:storybook  # Build Storybook static
```
