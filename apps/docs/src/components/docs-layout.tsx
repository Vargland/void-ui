import { Nav } from './nav'
import styles from './docs-layout.module.css'

export function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <Nav />
      <main className={styles.main}>{children}</main>
    </div>
  )
}
