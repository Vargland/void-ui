import * as React from 'react'
import type { TooltipProps } from '../../typings/components/tooltip'
import { cn } from '../../helpers/classnames'
import styles from './tooltip.module.scss'

// ─── Constants ────────────────────────────────────────────────────────────────

const FIXED_OFFSET   = 8  // px gap between trigger edge and bubble
const VIEWPORT_MARGIN = 8  // px min distance from viewport edges

// ─── Position for fixed strategy ─────────────────────────────────────────────

interface FixedPos {
  top:  number
  left: number
}

function calcFixedPos(
  triggerEl: HTMLElement,
  bubbleEl: HTMLElement | null,
  placement: NonNullable<TooltipProps['placement']>,
): FixedPos {
  const r       = triggerEl.getBoundingClientRect()
  const vw      = window.innerWidth
  const bubbleW = bubbleEl?.offsetWidth ?? 0

  switch (placement) {
    case 'top':
    case 'bottom': {
      const rawLeft = r.left + r.width / 2
      const minLeft = VIEWPORT_MARGIN + bubbleW / 2
      const maxLeft = vw - VIEWPORT_MARGIN - bubbleW / 2
      const left    = Math.min(Math.max(rawLeft, minLeft), maxLeft)

      return {
        top:  placement === 'top' ? r.top - FIXED_OFFSET : r.bottom + FIXED_OFFSET,
        left,
      }
    }
    case 'left':
      return { top: r.top + r.height / 2, left: r.left - FIXED_OFFSET }
    case 'right':
      return { top: r.top + r.height / 2, left: r.right + FIXED_OFFSET }
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
  const [visible, setVisible]   = React.useState(false)
  const [fixedPos, setFixedPos] = React.useState<FixedPos | null>(null)
  const timeoutRef              = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const triggerRef              = React.useRef<HTMLSpanElement>(null)
  const bubbleRef               = React.useRef<HTMLSpanElement>(null)
  const tooltipId               = React.useId()

  // Clear pending timeout on unmount to prevent memory leaks
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const show = React.useCallback(() => {
    if (disabled) return

    timeoutRef.current = setTimeout(() => setVisible(true), delay)
  }, [disabled, delay])

  const hide = React.useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setVisible(false)
  }, [])

  // Calculate fixed position after bubble renders (so offsetWidth is available)
  React.useLayoutEffect(() => {
    if (strategy !== 'fixed' || !visible || !triggerRef.current) return

    setFixedPos(calcFixedPos(triggerRef.current, bubbleRef.current, placement))
  }, [strategy, visible, placement])

  // Recalculate on scroll/resize while visible (fixed strategy only)
  React.useEffect(() => {
    if (strategy !== 'fixed' || !visible) return

    const update = () => {
      if (triggerRef.current) {
        setFixedPos(calcFixedPos(triggerRef.current, bubbleRef.current, placement))
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
          ref={bubbleRef}
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
