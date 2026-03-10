'use client'

import { TextField } from '@open-void-ui/library'
import { DocsLayout } from '@/components/docs-layout'
import { ComponentDemo } from '@/components/component-demo'
import styles from '../component-page.module.css'

export default function TextFieldPage() {
  return (
    <DocsLayout>
      <div className={styles.page}>
        <header className={styles.header}>
          <p className={styles.breadcrumb}>Components</p>
          <h1 className={styles.title}>TextField</h1>
          <p className={styles.description}>
            Text input with label, placeholder, helper text, error state, and icon slot support.
          </p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Default</h2>
          <ComponentDemo
            title="Basic TextField"
            code={`<TextField label="Email" placeholder="you@example.com" />`}
          >
            <div style={{ width: '320px' }}>
              <TextField label="Email" placeholder="you@example.com" />
            </div>
          </ComponentDemo>

          <ComponentDemo
            title="With helper text"
            code={`<TextField
  label="Password"
  type="password"
  helperText="Minimum 8 characters"
/>`}
          >
            <div style={{ width: '320px' }}>
              <TextField label="Password" type="password" helperText="Minimum 8 characters" />
            </div>
          </ComponentDemo>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>States</h2>
          <ComponentDemo
            title="Error state"
            code={`<TextField
  label="Email"
  value="not-an-email"
  state="error"
  helperText="Please enter a valid email address"
/>`}
          >
            <div style={{ width: '320px' }}>
              <TextField
                label="Email"
                defaultValue="not-an-email"
                state="error"
                helperText="Please enter a valid email address"
              />
            </div>
          </ComponentDemo>

          <ComponentDemo
            title="Disabled"
            code={`<TextField label="Username" value="germán" disabled />`}
          >
            <div style={{ width: '320px' }}>
              <TextField label="Username" defaultValue="germán" disabled />
            </div>
          </ComponentDemo>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Sizes</h2>
          <ComponentDemo
            title="sm · md · lg"
            code={`<TextField size="sm" label="Small" placeholder="sm" />
<TextField size="md" label="Medium" placeholder="md" />
<TextField size="lg" label="Large" placeholder="lg" />`}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '320px' }}>
              <TextField size="sm" label="Small" placeholder="sm" />
              <TextField size="md" label="Medium" placeholder="md" />
              <TextField size="lg" label="Large" placeholder="lg" />
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
                <td><code>label</code></td>
                <td><code>string</code></td>
                <td>—</td>
                <td>Field label</td>
              </tr>
              <tr>
                <td><code>helperText</code></td>
                <td><code>string</code></td>
                <td>—</td>
                <td>Helper or error message</td>
              </tr>
              <tr>
                <td><code>state</code></td>
                <td><code>default | error | success</code></td>
                <td><code>default</code></td>
                <td>Visual validation state</td>
              </tr>
              <tr>
                <td><code>size</code></td>
                <td><code>sm | md | lg</code></td>
                <td><code>md</code></td>
                <td>Input size</td>
              </tr>
              <tr>
                <td><code>iconBefore</code></td>
                <td><code>ReactNode</code></td>
                <td>—</td>
                <td>Icon inside input, left</td>
              </tr>
              <tr>
                <td><code>iconAfter</code></td>
                <td><code>ReactNode</code></td>
                <td>—</td>
                <td>Icon inside input, right</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </DocsLayout>
  )
}
