'use client'

import { useState } from 'react'
import styles from './component-demo.module.css'

interface ComponentDemoProps {
  title: string
  description?: string
  code: string
  children: React.ReactNode
}

export function ComponentDemo({
  title,
  description,
  code,
  children,
}: ComponentDemoProps) {
  const [showCode, setShowCode] = useState(false)

  return (
    <div className={styles.demo}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{title}</h3>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        <button
          className={styles.toggleBtn}
          onClick={() => setShowCode((v) => !v)}
          aria-label={showCode ? 'Hide code' : 'Show code'}
        >
          {showCode ? 'Hide code' : 'Show code'}
        </button>
      </div>

      <div className={styles.preview}>{children}</div>

      {showCode && (
        <div className={styles.codeBlock}>
          <pre>
            <code>{code}</code>
          </pre>
        </div>
      )}
    </div>
  )
}
