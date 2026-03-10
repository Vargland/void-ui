import type { SpinnerProps } from '../../typings/components/spinner'
import { cn } from '../../helpers/classnames'
import styles from './spinner.module.scss'

// ─── Ring SVG ─────────────────────────────────────────────────────────────────

const RING_STROKE: Record<string, number> = {
  xs: 1.5,
  sm: 2,
  md: 2.5,
  lg: 3,
  xl: 3.5,
}

function RingSvg({ size }: { size: string }) {
  const stroke = RING_STROKE[size] ?? 2.5
  const r      = (24 - stroke) / 2          // radius relative to 24×24 viewBox
  const circ   = 2 * Math.PI * r
  const dash   = circ * 0.75                // 75% visible arc

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ width: '100%', height: '100%' }}
    >
      <circle
        className={styles.track}
        cx="12" cy="12"
        r={r}
        strokeWidth={stroke}
      />
      <circle
        className={styles.arc}
        cx="12" cy="12"
        r={r}
        strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`}
        strokeDashoffset={0}
      />
    </svg>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Spinner({
  variant  = 'ring',
  size     = 'md',
  label    = 'Loading…',
  planet,
  className,
  'data-testid': testId = 'spinner',
  ...rest
}: SpinnerProps) {
  const spinner = (
    <span
      data-testid={testId}
      role="status"
      aria-label={label}
      className={cn(
        styles.spinner,
        styles[variant],
        styles[`size-${size}`],
        className,
      )}
      {...rest}
    >
      {variant === 'ring' && <RingSvg size={size} />}

      {variant === 'dots' && (
        <>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </>
      )}

      {variant === 'pulse' && null}

    </span>
  )

  if (planet) {
    return <span data-void-planet={planet}>{spinner}</span>
  }

  return spinner
}
