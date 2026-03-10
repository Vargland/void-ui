'use client'

import { Divider } from '@open-void-ui/library'
import { DocsLayout } from '@/components/docs-layout'
import { ComponentDemo } from '@/components/component-demo'
import styles from '../component-page.module.css'

export default function DividerPage() {
  return (
    <DocsLayout>
      <div className={styles.page}>
        <header className={styles.header}>
          <p className={styles.breadcrumb}>Components</p>
          <h1 className={styles.title}>Divider</h1>
          <p className={styles.description}>
            Horizontal or vertical rule to visually separate content sections.
            Supports optional label.
          </p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Orientation</h2>
          <ComponentDemo
            title="Horizontal (default)"
            code={`<Divider />`}
          >
            <div style={{ width: '100%' }}>
              <Divider />
            </div>
          </ComponentDemo>

          <ComponentDemo
            title="Vertical"
            code={`<div style={{ display: 'flex', height: 40 }}>
  <span>Left</span>
  <Divider orientation="vertical" />
  <span>Right</span>
</div>`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', height: '40px' }}>
              <span style={{ color: 'var(--void-color-text-muted)', fontSize: '0.875rem' }}>Left</span>
              <Divider orientation="vertical" />
              <span style={{ color: 'var(--void-color-text-muted)', fontSize: '0.875rem' }}>Right</span>
            </div>
          </ComponentDemo>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>With label</h2>
          <ComponentDemo
            title="Labeled divider"
            code={`<Divider label="OR" />
<Divider label="Section" labelAlign="start" />
<Divider label="Section" labelAlign="end" />`}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
              <Divider label="OR" />
              <Divider label="Start" labelAlign="start" />
              <Divider label="End" labelAlign="end" />
            </div>
          </ComponentDemo>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Variants</h2>
          <ComponentDemo
            title="Solid vs Dashed"
            code={`<Divider variant="solid" />
<Divider variant="dashed" />`}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
              <Divider variant="solid" />
              <Divider variant="dashed" />
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
                <td><code>orientation</code></td>
                <td><code>horizontal | vertical</code></td>
                <td><code>horizontal</code></td>
                <td>Layout direction</td>
              </tr>
              <tr>
                <td><code>variant</code></td>
                <td><code>solid | dashed</code></td>
                <td><code>solid</code></td>
                <td>Border style</td>
              </tr>
              <tr>
                <td><code>label</code></td>
                <td><code>string</code></td>
                <td>—</td>
                <td>Text label in center</td>
              </tr>
              <tr>
                <td><code>labelAlign</code></td>
                <td><code>start | center | end</code></td>
                <td><code>center</code></td>
                <td>Label alignment</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </DocsLayout>
  )
}
