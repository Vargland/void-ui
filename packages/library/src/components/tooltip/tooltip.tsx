import { useState, useRef, useId, useCallback } from 'react'
import type { TooltipProps } from '../../typings/components/tooltip'
import { cn } from '../../helpers/classnames'
import styles from './tooltip.module.scss'

export function Tooltip({
  content,
  children,
  placement   = 'top',
  delay       = 300,
  disabled    = false,
  maxWidth    = 200,
  planet,
  className,
  'data-testid': testId = 'tooltip',
}: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const timeoutRef            = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tooltipId             = useId()

  const show = useCallback(() => {
    if (disabled) {return}

    timeoutRef.current = setTimeout(() => setVisible(true), delay)
  }, [disabled, delay])

  const hide = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    setVisible(false)
  }, [])

  const placementClass = styles[`placement${placement.charAt(0).toUpperCase()}${placement.slice(1)}`]

  const tooltip = (
    <span
      className={cn(styles.root, className)}
      data-testid={testId}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {/* Trigger — aria-describedby links it to the tooltip */}
      <span
        aria-describedby={!disabled && visible ? tooltipId : undefined}
      >
        {children}
      </span>

      {/* Tooltip bubble */}
      {!disabled && (
        <span
          id={tooltipId}
          role="tooltip"
          data-testid={`${testId}-bubble`}
          className={cn(
            styles.tooltip,
            placementClass,
            visible && styles.visible,
          )}
          style={{ maxWidth }}
          aria-hidden={!visible}
        >
          {/* Arrow caret */}
          <span className={styles.arrow} aria-hidden="true" />

          {content}
        </span>
      )}
    </span>
  )

  if (planet) {
    return <span data-void-planet={planet}>{tooltip}</span>
  }

  return tooltip
}
