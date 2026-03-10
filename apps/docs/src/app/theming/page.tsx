'use client'

import { Button, Badge, Avatar } from '@open-void-ui/library'
import { DocsLayout } from '@/components/docs-layout'
import styles from './theming.module.css'

const PLANETS = [
  { name: 'mercury', label: 'Mercury', description: 'Sharp and metallic' },
  { name: 'venus',   label: 'Venus',   description: 'Warm amber tones' },
  { name: 'earth',   label: 'Earth',   description: 'Cool blues and greens' },
  { name: 'mars',    label: 'Mars',    description: 'Bold reds and oranges' },
  { name: 'jupiter', label: 'Jupiter', description: 'Deep purples and golds' },
  { name: 'saturn',  label: 'Saturn',  description: 'Muted golden rings' },
  { name: 'uranus',  label: 'Uranus',  description: 'Icy cyan and teal' },
  { name: 'neptune', label: 'Neptune', description: 'Deep ocean blues' },
  { name: 'moon',    label: 'Moon',    description: 'Pale and neutral' },
  { name: 'europa',  label: 'Europa',  description: 'Cracked ice whites' },
  { name: 'io',      label: 'Io',      description: 'Volcanic yellows' },
  { name: 'nostromo',label: 'Nostromo',description: 'Dark industrial — USCSS Nostromo' },
] as const

export default function ThemingPage() {
  return (
    <DocsLayout>
      <div className={styles.page}>
        <header className={styles.header}>
          <p className={styles.breadcrumb}>Getting Started</p>
          <h1 className={styles.title}>Theming</h1>
          <p className={styles.description}>
            void-ui ships 12 planet themes — scoped color overrides via the{' '}
            <code>data-void-planet</code> attribute. Apply any theme to any subtree.
          </p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Usage</h2>
          <div className={styles.codeBlock}>
            <pre>{`// 1. Import the planet CSS
import '@open-void-ui/tokens/css'
import '@open-void-ui/tokens/planets/mars'

// 2. Apply via data attribute
<div data-void-planet="mars">
  <Button variant="primary">Mars themed</Button>
</div>

// 3. Or use the planet prop directly on any component
<Button variant="primary" planet="neptune">Neptune themed</Button>`}</pre>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>All planets</h2>
          <div className={styles.grid}>
            {PLANETS.map(({ name, label, description }) => (
              <div
                key={name}
                className={styles.card}
                data-void-planet={name}
              >
                <div className={styles.cardHeader}>
                  <span className={styles.planetName}>{label}</span>
                  <code className={styles.planetCode}>{name}</code>
                </div>
                <span className={styles.planetDesc}>{description}</span>
                <div className={styles.cardDemo}>
                  <Button variant="primary" size="sm">Primary</Button>
                  <Button variant="secondary" size="sm">Secondary</Button>
                  <Badge tone="default">Default</Badge>
                  <Badge tone="success">Success</Badge>
                  <Avatar initials={label.slice(0, 2).toUpperCase()} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Token override</h2>
          <p className={styles.paragraph}>
            You can also override individual tokens globally or scoped to any element:
          </p>
          <div className={styles.codeBlock}>
            <pre>{`/* Global override */
:root {
  --void-color-action-primary: #7c3aed;
  --void-radius-md: 12px;
}

/* Scoped override */
.my-section {
  --void-color-action-primary: #e11d48;
}`}</pre>
          </div>
        </section>
      </div>
    </DocsLayout>
  )
}
