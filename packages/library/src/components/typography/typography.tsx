import type { TypographyProps } from '../../typings/components/typography'
import { cn } from '../../helpers/classnames'
import styles from './typography.module.scss'

const HEADING_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])

export function Typography({
  as: Tag = 'p',
  size,
  color,
  weight,
  leading,
  tracking,
  truncate  = false,
  uppercase = false,
  mono      = false,
  planet,
  children,
  className,
  'data-testid': testId = 'typography',
  ...rest
}: TypographyProps) {
  const isHeading = typeof Tag === 'string' && HEADING_TAGS.has(Tag)

  const element = (
    <Tag
      data-testid={testId}
      className={cn(
        styles.typography,
        isHeading && styles[Tag as string],
        size     && styles[`size-${size}`],
        color    && styles[`color-${color}`],
        weight   && styles[`weight-${weight}`],
        leading  && styles[`leading-${leading}`],
        tracking && styles[`tracking-${tracking}`],
        truncate  && styles.truncate,
        uppercase && styles.uppercase,
        mono      && styles.mono,
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  )

  if (planet) {
    return <span data-void-planet={planet}>{element}</span>
  }

  return element
}
