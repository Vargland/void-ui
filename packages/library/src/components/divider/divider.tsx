import type { DividerProps } from '../../typings/components/divider'
import { cn } from '../../helpers/classnames'
import styles from './divider.module.scss'

export function Divider({
  orientation = 'horizontal',
  variant     = 'solid',
  label,
  labelAlign  = 'center',
  flush       = false,
  planet,
  className,
  'data-testid': testId = 'divider',
  ...rest
}: DividerProps) {
  const divider = (
    <div
      role="separator"
      aria-orientation={orientation}
      data-testid={testId}
      className={cn(
        styles[orientation],
        styles[variant],
        !!label && labelAlign !== 'center' && styles[`label-${labelAlign}`],
        flush && styles.flush,
        className,
      )}
      {...rest}
    >
      {orientation === 'horizontal' && label && (
        <span>{label}</span>
      )}
    </div>
  )

  if (planet) {
    return <span data-void-planet={planet}>{divider}</span>
  }

  return divider
}
