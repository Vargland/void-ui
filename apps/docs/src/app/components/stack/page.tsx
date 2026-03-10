'use client'

import { Stack, Button } from '@open-void-ui/library'
import { DocsLayout } from '@/components/docs-layout'
import { ComponentDemo } from '@/components/component-demo'
import styles from '../component-page.module.css'

const Box = ({ label }: { label: string }) => (
  <div style={{
    width: 48,
    height: 48,
    background: 'var(--void-color-background-surface)',
    border: '1px solid var(--void-color-border-default)',
    borderRadius: 'var(--void-radius-sm)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    color: 'var(--void-color-text-muted)',
    fontFamily: 'var(--void-font-family-mono)',
    flexShrink: 0,
  }}>
    {label}
  </div>
)

export default function StackPage() {
  return (
    <DocsLayout>
      <div className={styles.page}>
        <header className={styles.header}>
          <p className={styles.breadcrumb}>Components</p>
          <h1 className={styles.title}>Stack</h1>
          <p className={styles.description}>
            Flex layout utility for controlling direction, spacing, alignment,
            and wrapping. Eliminates repetitive flex CSS.
          </p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Direction</h2>
          <ComponentDemo
            title="Row (default)"
            code={`<Stack direction="row" spacing="3">
  <Box />
  <Box />
  <Box />
</Stack>`}
          >
            <Stack direction="row" spacing="3">
              <Box label="1" />
              <Box label="2" />
              <Box label="3" />
            </Stack>
          </ComponentDemo>

          <ComponentDemo
            title="Column"
            code={`<Stack direction="column" spacing="3">
  <Box />
  <Box />
  <Box />
</Stack>`}
          >
            <Stack direction="column" spacing="3">
              <Box label="1" />
              <Box label="2" />
              <Box label="3" />
            </Stack>
          </ComponentDemo>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Spacing</h2>
          <ComponentDemo
            title="Spacing scale"
            code={`<Stack spacing="1">...</Stack>
<Stack spacing="4">...</Stack>
<Stack spacing="8">...</Stack>`}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Stack direction="row" spacing="1">
                <Box label="1" />
                <Box label="2" />
                <Box label="3" />
              </Stack>
              <Stack direction="row" spacing="4">
                <Box label="1" />
                <Box label="2" />
                <Box label="3" />
              </Stack>
              <Stack direction="row" spacing="8">
                <Box label="1" />
                <Box label="2" />
                <Box label="3" />
              </Stack>
            </div>
          </ComponentDemo>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Alignment</h2>
          <ComponentDemo
            title="justify + align"
            code={`<Stack justify="between" align="center">
  <Button size="sm">Cancel</Button>
  <Button variant="primary" size="sm">Save</Button>
</Stack>`}
          >
            <div style={{ width: '100%' }}>
              <Stack justify="between" align="center">
                <Button size="sm">Cancel</Button>
                <Button variant="primary" size="sm">Save</Button>
              </Stack>
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
                <td><code>direction</code></td>
                <td><code>row | column | row-reverse | column-reverse</code></td>
                <td><code>row</code></td>
                <td>Flex direction</td>
              </tr>
              <tr>
                <td><code>spacing</code></td>
                <td><code>1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12</code></td>
                <td><code>4</code></td>
                <td>Gap between children</td>
              </tr>
              <tr>
                <td><code>align</code></td>
                <td><code>start | center | end | stretch | baseline</code></td>
                <td><code>start</code></td>
                <td>align-items</td>
              </tr>
              <tr>
                <td><code>justify</code></td>
                <td><code>start | center | end | between | around | evenly</code></td>
                <td><code>start</code></td>
                <td>justify-content</td>
              </tr>
              <tr>
                <td><code>wrap</code></td>
                <td><code>boolean</code></td>
                <td><code>false</code></td>
                <td>flex-wrap</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </DocsLayout>
  )
}
