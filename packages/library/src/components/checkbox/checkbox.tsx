import * as React from 'react'
import type { CheckboxProps } from '../../typings/components/checkbox'
import { cn } from '../../helpers/classnames'
import styles from './checkbox.module.scss'

export function Checkbox({
  label,
  description,
  error,
  size = 'md',
  indeterminate = false,
  disabled,
  checked,
  defaultChecked,
  className,
  id: idProp,
  'data-testid': testId = 'checkbox',
  planet,
  ...rest
}: CheckboxProps) {
  const autoId = React.useId()
  const id = idProp ?? autoId
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  const hasError = Boolean(error)

  const checkbox = (
    <span
      className={cn(
        styles.root,
        styles[`size-${size}`],
        hasError && styles.hasError,
        disabled && styles.disabled,
        className,
      )}
    >
      <span className={styles.control}>
        <input
          ref={inputRef}
          id={id}
          type="checkbox"
          role="checkbox"
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          aria-checked={indeterminate ? 'mixed' : checked}
          aria-invalid={hasError || undefined}
          aria-describedby={
            description || error ? `${id}-hint` : undefined
          }
          data-testid={testId}
          className={styles.input}
          {...rest}
        />
        <span className={styles.box} aria-hidden="true">
          {indeterminate ? (
            <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="2.5" y1="6" x2="9.5" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polyline points="1.5,6 4.5,9.5 10.5,2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      </span>

      {(label || description || error) && (
        <span className={styles.content}>
          {label && (
            <label htmlFor={id} className={styles.label}>
              {label}
            </label>
          )}
          {(description || error) && (
            <span id={`${id}-hint`} className={cn(styles.hint, hasError && styles.hintError)}>
              {error ?? description}
            </span>
          )}
        </span>
      )}
    </span>
  )

  if (planet) {
    return <span data-void-planet={planet}>{checkbox}</span>
  }

  return checkbox
}
