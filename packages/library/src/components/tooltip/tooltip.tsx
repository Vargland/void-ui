import * as React from 'react'
import type { TooltipProps } from '../../typings/components/tooltip'
import { cn } from '../../helpers/classnames'
import styles from './tooltip.module.scss'

// ─── Position for fixed strategy ─────────────────────────────────────────────

interface FixedPos {
  top:  number
  left: number
}

function calcFixedPos(
  triggerEl: HTMLElement,
  placement: NonNullable<TooltipProps['placement']>,
  offset: number,
): FixedPos {
  const r = triggerEl.getBoundingClientRect()

  switch (placement) {
    // top: anchor at the top edge of the trigger, bubble grows upward via translateY(-100%)
    case 'top':
      return { top: r.top - offset, left: r.left + r.width / 2 }
    // bottom: anchor at the bottom edge, bubble grows downward
    case 'bottom':
      return { top: r.bottom + offset, left: r.left + r.width / 2 }
    // left: anchor at the left edge, bubble grows leftward via translateX(-100%)
    case 'left':
      return { top: r.top + r.height / 2, left: r.left - offset }
    // right: anchor at the right edge, bubble grows rightward
    case 'right':
      return { top: r.top + r.height / 2, left: r.right + offset }
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Tooltip({
  content,
  children,
  placement   = 'top',
  delay       = 300,
  disabled    = false,
  maxWidth    = 200,
  strategy    = 'absolute',
  planet,
  className,
  'data-testid': testId = 'tooltip',
}: TooltipProps) {
  const [visible, setVisible]     = React.useState(false)
  const [fixedPos, setFixedPos]   = React.useState<FixedPos | null>(null)
  const timeoutRef                = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const triggerRef                = React.useRef<HTMLSpanElement>(null)
  const tooltipId                 = React.useId()

  const show = React.useCallback(() => {
    if (disabled) return

    if (strategy === 'fixed' && triggerRef.current) {
      setFixedPos(calcFixedPos(triggerRef.current, placement, 8))
    }

    timeoutRef.current = setTimeout(() => setVisible(true), delay)
  }, [disabled, delay, strategy, placement])

  const hide = React.useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setVisible(false)
  }, [])

  // Recalculate on scroll/resize while visible (fixed strategy only)
  React.useEffect(() => {
    if (strategy !== 'fixed' || !visible) return

    const update = () => {
      if (triggerRef.current) {
        setFixedPos(calcFixedPos(triggerRef.current, placement, 8))
      }
    }

    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)

    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [strategy, visible, placement])

  // For fixed strategy, skip the placement class entirely — position is fully inline
  const placementClass = strategy === 'fixed'
    ? null
    : styles[`placement${placement.charAt(0).toUpperCase()}${placement.slice(1)}`]

  // Build inline style for the bubble
  const bubbleStyle: React.CSSProperties = { maxWidth }

  if (strategy === 'fixed' && fixedPos) {
    const isVertical = placement === 'top' || placement === 'bottom'

    bubbleStyle.position        = 'fixed'
    bubbleStyle.top             = fixedPos.top
    bubbleStyle.left            = fixedPos.left
    bubbleStyle.transformOrigin = placement === 'top'    ? 'bottom center'
                                : placement === 'bottom' ? 'top center'
                                : placement === 'left'   ? 'right center'
                                :                         'left center'

    if (placement === 'top') {
      bubbleStyle.transform = visible
        ? 'translateX(-50%) translateY(-100%) scale(1)'
        : 'translateX(-50%) translateY(-100%) scale(0.9)'
    } else if (placement === 'bottom') {
      bubbleStyle.transform = visible ? 'translateX(-50%) scale(1)' : 'translateX(-50%) scale(0.9)'
    } else if (placement === 'left') {
      bubbleStyle.transform = visible
        ? 'translateX(-100%) translateY(-50%) scale(1)'
        : 'translateX(-100%) translateY(-50%) scale(0.9)'
    } else {
      bubbleStyle.transform = visible ? 'translateY(-50%) scale(1)' : 'translateY(-50%) scale(0.9)'
    }
  }

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
        ref={triggerRef}
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
            strategy === 'fixed' && styles.fixed,
          )}
          style={bubbleStyle}
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
