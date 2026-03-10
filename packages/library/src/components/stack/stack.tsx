import type { StackProps } from '../../typings/components/stack'
import { cn } from '../../helpers/classnames'
import styles from './stack.module.scss'

export function Stack({
  as: Tag     = 'div',
  direction   = 'column',
  gap,
  align,
  justify,
  wrap        = false,
  full        = false,
  planet,
  children,
  className,
  'data-testid': testId = 'stack',
  ...rest
}: StackProps) {
  const element = (
    <Tag
      data-testid={testId}
      className={cn(
        styles.stack,
        styles[direction],
        gap !== undefined && styles[`gap-${gap}`],
        align   && styles[`align-${align}`],
        justify && styles[`justify-${justify}`],
        wrap && styles.wrap,
        full && styles.full,
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  )

  if (planet) {
    return <div data-void-planet={planet}>{element}</div>
  }

  return element
}
