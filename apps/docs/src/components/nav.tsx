'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './nav.module.css'

const links = [
  { href: '/', label: 'Overview' },
  { href: '/components/button', label: 'Button' },
  { href: '/components/badge', label: 'Badge' },
  { href: '/components/typography', label: 'Typography' },
  { href: '/components/avatar', label: 'Avatar' },
  { href: '/components/divider', label: 'Divider' },
  { href: '/components/stack', label: 'Stack' },
  { href: '/components/spinner', label: 'Spinner' },
  { href: '/components/textfield', label: 'TextField' },
]

export function Nav() {
  const pathname = usePathname()

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>
        <span className={styles.logoIcon}>◈</span>
        <span className={styles.logoText}>open-void-ui</span>
        <span className={styles.logoBadge}>v0.2</span>
      </Link>

      <div className={styles.section}>
        <p className={styles.sectionLabel}>Getting Started</p>
        <Link
          href="/"
          className={`${styles.link} ${pathname === '/' ? styles.active : ''}`}
        >
          Overview
        </Link>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionLabel}>Components</p>
        {links.slice(1).map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`${styles.link} ${pathname === href ? styles.active : ''}`}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className={styles.section}>
        <p className={styles.sectionLabel}>Resources</p>
        <a
          href="https://www.npmjs.com/org/open-void-ui"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          npm ↗
        </a>
        <a
          href="https://github.com/Vargland/void-ui"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          GitHub ↗
        </a>
      </div>
    </nav>
  )
}
