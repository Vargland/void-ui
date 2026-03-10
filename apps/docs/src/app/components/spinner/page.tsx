'use client'

import { Spinner } from '@open-void-ui/library'
import { DocsLayout } from '@/components/docs-layout'
import { ComponentDemo } from '@/components/component-demo'
import styles from '../component-page.module.css'

export default function SpinnerPage() {
  return (
    <DocsLayout>
      <div className={styles.page}>
        <header className={styles.header}>
          <p className={styles.breadcrumb}>Components</p>
          <h1 className={styles.title}>Spinner</h1>
          <p className={styles.description}>
            Loading state indicators. Ring and dot variants in multiple sizes.
          </p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Variants</h2>
          <ComponentDemo
            title="Ring"
            description="Animated circular ring."
            code={`<Spinner variant="ring" />`}
          >
            <Spinner variant="ring" />
          </ComponentDemo>

          <ComponentDemo
            title="Dots"
            description="Three bouncing dots."
            code={`<Spinner variant="dots" />`}
          >
            <Spinner variant="dots" />
          </ComponentDemo>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Sizes</h2>
          <ComponentDemo
            title="All sizes"
            code={`<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />`}
          >
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
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
                <td><code>ring | dots</code></td>
                <td><code>ring</code></td>
                <td>Animation style</td>
              </tr>
              <tr>
                <td><code>size</code></td>
                <td><code>sm | md | lg</code></td>
                <td><code>md</code></td>
                <td>Spinner size</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </DocsLayout>
  )
}
