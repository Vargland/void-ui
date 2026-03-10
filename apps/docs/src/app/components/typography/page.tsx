'use client'

import { Typography } from '@open-void-ui/library'
import { DocsLayout } from '@/components/docs-layout'
import { ComponentDemo } from '@/components/component-demo'
import styles from '../component-page.module.css'

export default function TypographyPage() {
  return (
    <DocsLayout>
      <div className={styles.page}>
        <header className={styles.header}>
          <p className={styles.breadcrumb}>Components</p>
          <h1 className={styles.title}>Typography</h1>
          <p className={styles.description}>
            Semantic text rendering with full control over size, weight, color,
            line height, and letter spacing.
          </p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Sizes</h2>
          <ComponentDemo
            title="Scale"
            code={`<Typography size="xs">Extra small — xs</Typography>
<Typography size="sm">Small — sm</Typography>
<Typography size="md">Medium — md (default)</Typography>
<Typography size="lg">Large — lg</Typography>
<Typography size="xl">Extra large — xl</Typography>
<Typography size="2xl">2xl</Typography>
<Typography size="3xl">3xl</Typography>`}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Typography size="xs">Extra small — xs</Typography>
              <Typography size="sm">Small — sm</Typography>
              <Typography size="md">Medium — md (default)</Typography>
              <Typography size="lg">Large — lg</Typography>
              <Typography size="xl">Extra large — xl</Typography>
              <Typography size="2xl">2xl</Typography>
              <Typography size="3xl">3xl</Typography>
            </div>
          </ComponentDemo>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Weights</h2>
          <ComponentDemo
            title="Font weight"
            code={`<Typography weight="regular">Regular</Typography>
<Typography weight="medium">Medium</Typography>
<Typography weight="semibold">Semibold</Typography>
<Typography weight="bold">Bold</Typography>`}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Typography weight="regular">Regular — 400</Typography>
              <Typography weight="medium">Medium — 500</Typography>
              <Typography weight="semibold">Semibold — 600</Typography>
              <Typography weight="bold">Bold — 700</Typography>
            </div>
          </ComponentDemo>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Colors</h2>
          <ComponentDemo
            title="Semantic colors"
            code={`<Typography color="primary">Primary text</Typography>
<Typography color="muted">Muted text</Typography>
<Typography color="accent">Accent text</Typography>`}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Typography color="primary">Primary text</Typography>
              <Typography color="muted">Muted text</Typography>
              <Typography color="accent">Accent text</Typography>
            </div>
          </ComponentDemo>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Polymorphic rendering</h2>
          <ComponentDemo
            title="Semantic HTML via `as` prop"
            code={`<Typography as="h1" size="3xl" weight="bold">Heading 1</Typography>
<Typography as="h2" size="2xl" weight="semibold">Heading 2</Typography>
<Typography as="p">Paragraph</Typography>
<Typography as="label" size="sm">Label</Typography>`}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Typography as="h1" size="3xl" weight="bold">Heading 1</Typography>
              <Typography as="h2" size="2xl" weight="semibold">Heading 2</Typography>
              <Typography as="p">Paragraph</Typography>
              <Typography as="label" size="sm">Label</Typography>
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
                <td><code>as</code></td>
                <td><code>ElementType</code></td>
                <td><code>p</code></td>
                <td>HTML element to render</td>
              </tr>
              <tr>
                <td><code>size</code></td>
                <td><code>xs | sm | md | lg | xl | 2xl | 3xl</code></td>
                <td><code>md</code></td>
                <td>Font size</td>
              </tr>
              <tr>
                <td><code>weight</code></td>
                <td><code>regular | medium | semibold | bold</code></td>
                <td><code>regular</code></td>
                <td>Font weight</td>
              </tr>
              <tr>
                <td><code>color</code></td>
                <td><code>primary | muted | accent</code></td>
                <td><code>primary</code></td>
                <td>Text color</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </DocsLayout>
  )
}
