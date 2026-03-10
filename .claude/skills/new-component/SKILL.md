---
name: new-component
description: Scaffold a new void-ui component following all conventions in ARCHITECTURE.md. Usage: /new-component <ComponentName>
---

# New Component Scaffolder

Create a new component for `packages/library` following the void-ui conventions strictly.

## Instructions

The user will provide a component name (e.g. `/new-component Modal` or just "Modal").

Extract the component name from the arguments. Derive:
- `kebab`: kebab-case version (e.g. `modal`)
- `Pascal`: PascalCase version (e.g. `Modal`)
- `props`: name of the props type (e.g. `ModalProps`)

Then create all the following files. Do NOT skip any of them.

### Files to create

**1. `packages/library/src/typings/components/<kebab>s.ts`**
```ts
export interface <Pascal>Props {
  // TODO: define props
  className?: string
}
```

**2. `packages/library/src/components/<kebab>/<kebab>.tsx`**
```tsx
import styles from './<kebab>.module.scss'
import type { <Pascal>Props } from '../../typings/components/<kebab>s'

export function <Pascal>({ className }: <Pascal>Props) {
  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      {/* TODO */}
    </div>
  )
}
```

**3. `packages/library/src/components/<kebab>/<kebab>.module.scss`**
```scss
.root {
  // uses --void-* tokens
}
```

**4. `packages/library/src/components/<kebab>/styles/base.scss`**
```scss
// Base styles for <Pascal>
```

**5. `packages/library/src/components/<kebab>/<kebab>.stories.tsx`**
```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { <Pascal> } from './<kebab>'

const meta: Meta<typeof <Pascal>> = {
  title: 'Components/<Pascal>',
  component: <Pascal>,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof <Pascal>>

export const Default: Story = {}
```

**6. `packages/library/src/components/<kebab>/<kebab>.test.tsx`**
```tsx
import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { <Pascal> } from './<kebab>'

describe('<Pascal>', () => {
  it('renders without crashing', () => {
    const { container } = render(<<Pascal> />)
    expect(container.firstChild).not.toBeNull()
  })
})
```

**7. `packages/library/src/components/<kebab>/docs/<kebab>.mdx`**
```mdx
import { Meta } from '@storybook/blocks'

<Meta title="Components/<Pascal>/Docs" />

# <Pascal>

> TODO: describe the component.
```

**8. `packages/library/src/components/<kebab>/index.ts`**
```ts
export { <Pascal> } from './<kebab>'
export type { <Pascal>Props } from '../../typings/components/<kebab>s'
```

### After creating files

1. Add the export to `packages/library/src/index.ts`:
   ```ts
   export { <Pascal> } from './components/<kebab>'
   export type { <Pascal>Props } from './typings/components/<kebab>s'
   ```

2. Confirm to the user:
   - List all created files
   - Remind them to implement props in `src/typings/components/<kebab>s.ts` first (API-first approach per ARCHITECTURE.md)
   - Suggest running `npm run storybook` to preview
