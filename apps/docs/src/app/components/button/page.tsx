'use client'

import { Button } from '@open-void-ui/library'
import { DocsLayout } from '@/components/docs-layout'
import { ComponentDemo } from '@/components/component-demo'
import styles from '../component-page.module.css'

export default function ButtonPage() {
  return (
    <DocsLayout>
      <div className={styles.page}>
        <header className={styles.header}>
          <p className={styles.breadcrumb}>Components</p>
          <h1 className={styles.title}>Button</h1>
          <p className={styles.description}>
            Trigger actions and navigation. Supports multiple visual variants, sizes,
            loading state, and icon slots.
          </p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Variants</h2>

          <ComponentDemo
            title="Primary"
            description="Main call-to-action. Use sparingly — one primary per section."
            code={`<Button variant="primary">Primary</Button>`}
          >
            <Button variant="primary">Primary</Button>
          </ComponentDemo>

          <ComponentDemo
            title="Secondary"
            description="Supporting action, lower emphasis than primary."
            code={`<Button variant="secondary">Secondary</Button>`}
          >
            <Button variant="secondary">Secondary</Button>
          </ComponentDemo>

          <ComponentDemo
            title="Ghost"
            description="Minimal — no background or border. Use for tertiary actions."
            code={`<Button variant="ghost">Ghost</Button>`}
          >
            <Button variant="ghost">Ghost</Button>
          </ComponentDemo>

          <ComponentDemo
            title="Outlined"
            description="Border visible, transparent background. Use for secondary level actions."
            code={`<Button variant="outlined">Outlined</Button>`}
          >
            <Button variant="outlined">Outlined</Button>
          </ComponentDemo>

          <ComponentDemo
            title="Danger"
            description="Destructive actions. Requires confirmation before use."
            code={`<Button variant="danger">Delete</Button>`}
          >
            <Button variant="danger">Delete</Button>
          </ComponentDemo>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Sizes</h2>
          <ComponentDemo
            title="All sizes"
            description="sm · md (default) · lg"
            code={`<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`}
          >
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </ComponentDemo>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>States</h2>
          <ComponentDemo
            title="Loading"
            description="Disables interaction and shows a spinner."
            code={`<Button variant="primary" loading>Loading…</Button>`}
          >
            <Button variant="primary" loading>Loading…</Button>
          </ComponentDemo>

          <ComponentDemo
            title="Disabled"
            description="Non-interactive state."
            code={`<Button variant="primary" disabled>Disabled</Button>`}
          >
            <Button variant="primary" disabled>Disabled</Button>
          </ComponentDemo>

          <ComponentDemo
            title="Full width"
            description="Expands to fill the container."
            code={`<Button variant="primary" fullWidth>Full width</Button>`}
          >
            <div style={{ width: '100%' }}>
              <Button variant="primary" fullWidth>Full width</Button>
            </div>
          </ComponentDemo>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Props</h2>
          <table className={styles.propsTable}>
            <thead>
              <tr>
                <th>Prop</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>variant</code></td>
                <td><code>primary | secondary | ghost | outlined | danger</code></td>
                <td><code>primary</code></td>
                <td>Visual style</td>
              </tr>
              <tr>
                <td><code>size</code></td>
                <td><code>sm | md | lg</code></td>
                <td><code>md</code></td>
                <td>Size of the button</td>
              </tr>
              <tr>
                <td><code>loading</code></td>
                <td><code>boolean</code></td>
                <td><code>false</code></td>
                <td>Shows spinner, disables interaction</td>
              </tr>
              <tr>
                <td><code>fullWidth</code></td>
                <td><code>boolean</code></td>
                <td><code>false</code></td>
                <td>Expands to fill container</td>
              </tr>
              <tr>
                <td><code>iconBefore</code></td>
                <td><code>ReactNode</code></td>
                <td>—</td>
                <td>Icon placed before label</td>
              </tr>
              <tr>
                <td><code>iconAfter</code></td>
                <td><code>ReactNode</code></td>
                <td>—</td>
                <td>Icon placed after label</td>
              </tr>
              <tr>
                <td><code>as</code></td>
                <td><code>ElementType</code></td>
                <td><code>button</code></td>
                <td>Polymorphic element override</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </DocsLayout>
  )
}
