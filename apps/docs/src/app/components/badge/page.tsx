'use client'

import { Badge } from '@open-void-ui/library'
import { DocsLayout } from '@/components/docs-layout'
import { ComponentDemo } from '@/components/component-demo'
import styles from '../component-page.module.css'

export default function BadgePage() {
  return (
    <DocsLayout>
      <div className={styles.page}>
        <header className={styles.header}>
          <p className={styles.breadcrumb}>Components</p>
          <h1 className={styles.title}>Badge</h1>
          <p className={styles.description}>
            Compact status indicators for labels, counts, tags, and state communication.
          </p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Variants</h2>
          <ComponentDemo
            title="Solid"
            description="Filled background. Default variant."
            code={`<Badge variant="solid" tone="neutral">Solid</Badge>
<Badge variant="solid" tone="success">Solid</Badge>
<Badge variant="solid" tone="warning">Solid</Badge>
<Badge variant="solid" tone="danger">Solid</Badge>`}
          >
            <Badge variant="solid" tone="neutral">Neutral</Badge>
            <Badge variant="solid" tone="success">Success</Badge>
            <Badge variant="solid" tone="warning">Warning</Badge>
            <Badge variant="solid" tone="danger">Danger</Badge>
          </ComponentDemo>

          <ComponentDemo
            title="Subtle"
            description="Reduced intensity, transparent background."
            code={`<Badge variant="subtle" tone="neutral">Subtle</Badge>
<Badge variant="subtle" tone="success">Subtle</Badge>
<Badge variant="subtle" tone="warning">Subtle</Badge>
<Badge variant="subtle" tone="danger">Subtle</Badge>`}
          >
            <Badge variant="subtle" tone="neutral">Neutral</Badge>
            <Badge variant="subtle" tone="success">Success</Badge>
            <Badge variant="subtle" tone="warning">Warning</Badge>
            <Badge variant="subtle" tone="danger">Danger</Badge>
          </ComponentDemo>

          <ComponentDemo
            title="Outlined"
            description="Border only, transparent fill."
            code={`<Badge variant="outlined" tone="neutral">Outlined</Badge>
<Badge variant="outlined" tone="success">Outlined</Badge>`}
          >
            <Badge variant="outlined" tone="neutral">Neutral</Badge>
            <Badge variant="outlined" tone="success">Success</Badge>
            <Badge variant="outlined" tone="warning">Warning</Badge>
            <Badge variant="outlined" tone="danger">Danger</Badge>
          </ComponentDemo>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Sizes</h2>
          <ComponentDemo
            title="All sizes"
            code={`<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>`}
          >
            <Badge size="sm">Small</Badge>
            <Badge size="md">Medium</Badge>
            <Badge size="lg">Large</Badge>
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
                <td><code>solid | subtle | outlined</code></td>
                <td><code>solid</code></td>
                <td>Visual style</td>
              </tr>
              <tr>
                <td><code>tone</code></td>
                <td><code>neutral | success | warning | danger</code></td>
                <td><code>neutral</code></td>
                <td>Semantic color</td>
              </tr>
              <tr>
                <td><code>size</code></td>
                <td><code>sm | md | lg</code></td>
                <td><code>md</code></td>
                <td>Badge size</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </DocsLayout>
  )
}
