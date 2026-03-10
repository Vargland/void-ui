'use client'

import { Avatar } from '@open-void-ui/library'
import { DocsLayout } from '@/components/docs-layout'
import { ComponentDemo } from '@/components/component-demo'
import styles from '../component-page.module.css'

export default function AvatarPage() {
  return (
    <DocsLayout>
      <div className={styles.page}>
        <header className={styles.header}>
          <p className={styles.breadcrumb}>Components</p>
          <h1 className={styles.title}>Avatar</h1>
          <p className={styles.description}>
            User representations with image, initials, icon fallback, and online status indicators.
          </p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Sizes</h2>
          <ComponentDemo
            title="All sizes"
            code={`<Avatar size="xs" initials="GR" />
<Avatar size="sm" initials="GR" />
<Avatar size="md" initials="GR" />
<Avatar size="lg" initials="GR" />
<Avatar size="xl" initials="GR" />`}
          >
            <Avatar size="xs" initials="GR" />
            <Avatar size="sm" initials="GR" />
            <Avatar size="md" initials="GR" />
            <Avatar size="lg" initials="GR" />
            <Avatar size="xl" initials="GR" />
          </ComponentDemo>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Shapes</h2>
          <ComponentDemo
            title="Circle vs Square"
            code={`<Avatar shape="circle" initials="GR" />
<Avatar shape="square" initials="GR" />`}
          >
            <Avatar shape="circle" initials="GR" />
            <Avatar shape="square" initials="GR" />
          </ComponentDemo>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Status</h2>
          <ComponentDemo
            title="Online status indicators"
            code={`<Avatar initials="GR" status="online" />
<Avatar initials="GR" status="away" />
<Avatar initials="GR" status="busy" />
<Avatar initials="GR" status="offline" />`}
          >
            <Avatar initials="GR" status="online" />
            <Avatar initials="GR" status="away" />
            <Avatar initials="GR" status="busy" />
            <Avatar initials="GR" status="offline" />
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
                <td><code>initials</code></td>
                <td><code>string</code></td>
                <td>—</td>
                <td>1–2 letter fallback text</td>
              </tr>
              <tr>
                <td><code>src</code></td>
                <td><code>string</code></td>
                <td>—</td>
                <td>Image URL</td>
              </tr>
              <tr>
                <td><code>size</code></td>
                <td><code>xs | sm | md | lg | xl</code></td>
                <td><code>md</code></td>
                <td>Avatar size</td>
              </tr>
              <tr>
                <td><code>shape</code></td>
                <td><code>circle | square</code></td>
                <td><code>circle</code></td>
                <td>Border shape</td>
              </tr>
              <tr>
                <td><code>status</code></td>
                <td><code>online | away | busy | offline</code></td>
                <td>—</td>
                <td>Status badge indicator</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </DocsLayout>
  )
}
