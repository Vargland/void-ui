import * as React from 'react'
import type { TooltipFixedPos, TooltipProps } from '../../typings/components/tooltip'
import { cn } from '../../helpers/classnames'
import styles from './tooltip.module.scss'

// ─── Constants ────────────────────────────────────────────────────────────────

const FIXED_OFFSET    = 8

const VIEWPORT_MARGIN = 8

const FIXED_TRANSFORM_ORIGIN: Record<NonNullable<TooltipProps['placement']>, string> = {
  top:    'bottom center',
  bottom: 'top center',
  left:   'right center',
  right:  'left center',
}

const FIXED_TRANSFORM: Record<NonNullable<TooltipProps['placement']>, { visible: string; hidden: string }> = {
  top:    { visible: 'translateX(-50%) translateY(-100%) scale(1)', hidden: 'translateX(-50%) translateY(-100%) scale(0.9)' },
  bottom: { visible: 'translateX(-50%) scale(1)',                   hidden: 'translateX(-50%) scale(0.9)'                   },
  left:   { visible: 'translateX(-100%) translateY(-50%) scale(1)', hidden: 'translateX(-100%) translateY(-50%) scale(0.9)' },
  right:  { visible: 'translateY(-50%) scale(1)',                   hidden: 'translateY(-50%) scale(0.9)'                   },
}

// ─── Fixed position calculation ───────────────────────────────────────────────

function calcFixedPos(
  triggerEl: HTMLElement,
  bubbleEl:  HTMLElement | null,
  placement: NonNullable<TooltipProps['placement']>,
): TooltipFixedPos {
  const triggerRect  = triggerEl.getBoundingClientRect()

  const viewportW    = window.innerWidth

  const viewportH    = window.innerHeight

  const bubbleWidth  = bubbleEl?.offsetWidth  ?? 0

  const bubbleHeight = bubbleEl?.offsetHeight ?? 0

  if (placement === 'top' || placement === 'bottom') {
    const rawLeft     = triggerRect.left + triggerRect.width / 2

    const minLeft     = VIEWPORT_MARGIN + bubbleWidth / 2

    const maxLeft     = viewportW - VIEWPORT_MARGIN - bubbleWidth / 2

    const clampedLeft = Math.min(Math.max(rawLeft, minLeft), maxLeft)

    return {
      top:  placement === 'top'
              ? triggerRect.top - FIXED_OFFSET
              : triggerRect.bottom + FIXED_OFFSET,
      left: clampedLeft,
    }
  }

  const rawTop     = triggerRect.top + triggerRect.height / 2

  const minTop     = VIEWPORT_MARGIN + bubbleHeight / 2

  const maxTop     = viewportH - VIEWPORT_MARGIN - bubbleHeight / 2

  const clampedTop = Math.min(Math.max(rawTop, minTop), maxTop)

  return {
    top:  clampedTop,
    left: placement === 'left'
            ? triggerRect.left - FIXED_OFFSET
            : triggerRect.right + FIXED_OFFSET,
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Tooltip({
  children,
  className,
  content,
  'data-testid': testId = 'tooltip',
  delay     = 300,
  disabled  = false,
  maxWidth  = 200,
  placement = 'top',
  planet,
  strategy  = 'absolute',
}: TooltipProps) {
  const [fixedPos, setFixedPos] = React.useState<TooltipFixedPos | null>(null)

  const [visible, setVisible] = React.useState(false)

  const bubbleRef  = React.useRef<HTMLSpanElement>(null)

  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const tooltipId = React.useId()

  const triggerRef = React.useRef<HTMLSpanElement>(null)

  // Clear pending timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const show = React.useCallback(() => {
    if (disabled) {
      return
    }

    timeoutRef.current = setTimeout(() => setVisible(true), delay)
  }, [disabled, delay])

  const hide = React.useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    setVisible(false)

    setFixedPos(null)
  }, [])

  // Recalculate position after render — bubble has real dimensions at this point
  React.useLayoutEffect(() => {
    if (strategy !== 'fixed') {
      return
    }

    if (!visible) {
      return
    }

    if (!triggerRef.current) {
      return
    }

    setFixedPos(calcFixedPos(triggerRef.current, bubbleRef.current, placement))
  }, [strategy, visible, placement])

  // Recalculate on scroll/resize while visible
  React.useEffect(() => {
    if (strategy !== 'fixed') {
      return
    }

    if (!visible) {
      return
    }

    const handleUpdate = () => {
      if (triggerRef.current) {
        setFixedPos(calcFixedPos(triggerRef.current, bubbleRef.current, placement))
      }
    }

    window.addEventListener('scroll', handleUpdate, true)
    window.addEventListener('resize', handleUpdate)

    return () => {
      window.removeEventListener('scroll', handleUpdate, true)
      window.removeEventListener('resize', handleUpdate)
    }
  }, [strategy, visible, placement])

  // ─── Derived values ──────────────────────────────────────────────────────────

  const placementClass = strategy === 'fixed'
    ? null
    : styles[`placement${placement.charAt(0).toUpperCase()}${placement.slice(1)}`]

  const bubbleStyle: React.CSSProperties = { maxWidth }

  if (strategy === 'fixed' && fixedPos) {
    const transforms = FIXED_TRANSFORM[placement]

    bubbleStyle.left            = fixedPos.left
    bubbleStyle.position        = 'fixed'
    bubbleStyle.top             = fixedPos.top
    bubbleStyle.transform       = visible ? transforms.visible : transforms.hidden
    bubbleStyle.transformOrigin = FIXED_TRANSFORM_ORIGIN[placement]
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  const tooltip = (
    <span
      className={cn(styles.root, className)}
      data-testid={testId}
      onBlur={hide}
      onFocus={show}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <span
        ref={triggerRef}
        aria-describedby={!disabled && visible ? tooltipId : undefined}
      >
        {children}
      </span>

      {!disabled && (
        <span
          ref={bubbleRef}
          aria-hidden={!visible}
          className={cn(
            styles.tooltip,
            placementClass,
            visible && styles.visible,
            strategy === 'fixed' && styles.fixed,
          )}
          data-testid={`${testId}-bubble`}
          id={tooltipId}
          role="tooltip"
          style={bubbleStyle}
        >
          <span aria-hidden="true" className={styles.arrow} />

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
