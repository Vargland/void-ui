import Link from 'next/link'
import { DocsLayout } from '@/components/docs-layout'
import styles from './page.module.css'

const components = [
  { name: 'Button', href: '/components/button', description: 'Trigger actions and navigation with consistent styling across variants and sizes.' },
  { name: 'Badge', href: '/components/badge', description: 'Compact status indicators for labels, counts, and state.' },
  { name: 'Typography', href: '/components/typography', description: 'Semantic text rendering with size, weight, color, and spacing control.' },
  { name: 'Avatar', href: '/components/avatar', description: 'User representations with image, initials, icon, and status support.' },
  { name: 'Divider', href: '/components/divider', description: 'Horizontal or vertical rule to separate content sections.' },
  { name: 'Stack', href: '/components/stack', description: 'Flex layout utility for direction, spacing, alignment, and wrapping.' },
  { name: 'Spinner', href: '/components/spinner', description: 'Loading state indicators with ring and dot variants.' },
  { name: 'TextField', href: '/components/textfield', description: 'Text input with label, helper text, error state, and icon support.' },
]

export default function HomePage() {
  return (
    <DocsLayout>
      <div className={styles.page}>
        {/* Hero */}
        <section className={styles.hero}>
          <p className={styles.eyebrow}>open-void-ui v0.2</p>
          <h1 className={styles.headline}>
            Minimal. Spatial. Dark.
          </h1>
          <p className={styles.subheadline}>
            A React component library built on CSS custom properties.
            Zero config, fully typed, token-driven theming.
          </p>
          <div className={styles.heroActions}>
            <Link href="/components/button" className={styles.ctaPrimary}>
              Explore components →
            </Link>
            <a
              href="https://github.com/Vargland/void-ui"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaSecondary}
            >
              GitHub
            </a>
          </div>

          {/* Install snippet */}
          <div className={styles.installBlock}>
            <span className={styles.installPrompt}>$</span>
            <code className={styles.installCode}>
              npm install @open-void-ui/tokens @open-void-ui/library
            </code>
          </div>
        </section>

        {/* Quick start */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Quick start</h2>
          <div className={styles.codeCard}>
            <pre><code>{`// 1. Import styles in your root layout or _app
import '@open-void-ui/tokens/css'
import '@open-void-ui/library/styles'

// 2. Use components
import { Button, Badge } from '@open-void-ui/library'

export default function App() {
  return (
    <Button variant="primary">Get started</Button>
  )
}`}</code></pre>
          </div>
        </section>

        {/* Components grid */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Components</h2>
          <div className={styles.grid}>
            {components.map(({ name, href, description }) => (
              <Link key={href} href={href} className={styles.card}>
                <h3 className={styles.cardTitle}>{name}</h3>
                <p className={styles.cardDescription}>{description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Token theming */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Token-driven theming</h2>
          <p className={styles.sectionText}>
            All components consume <code className={styles.inlineCode}>--void-*</code> CSS custom properties from{' '}
            <code className={styles.inlineCode}>@open-void-ui/tokens</code>.
            Override any token globally or scope a theme to a subtree.
          </p>
          <div className={styles.codeCard}>
            <pre><code>{`/* Override tokens at :root or on any element */
:root {
  --void-color-action-primary: #7c3aed;
  --void-radius-md: 12px;
}

/* Or use a planet theme */
<div data-void-planet="mars">
  <Button>Mars themed</Button>
</div>`}</code></pre>
          </div>
        </section>
      </div>
    </DocsLayout>
  )
}
