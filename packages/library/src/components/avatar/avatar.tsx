import * as React from 'react'
import type { AvatarProps } from '../../typings/components/avatar'
import { cn } from '../../helpers/classnames'
import styles from './avatar.module.scss'

export function Avatar({
  src,
  alt      = '',
  initials,
  size     = 'md',
  shape    = 'circle',
  status,
  planet,
  className,
  'data-testid': testId = 'avatar',
  ...rest
}: AvatarProps) {
  const [imgError, setImgError] = React.useState(false)
  const showImage = src && !imgError

  const avatar = (
    <span
      data-testid={testId}
      role={!showImage && alt ? 'img' : undefined}
      aria-label={!showImage && alt ? alt : undefined}
      className={cn(
        styles.avatar,
        styles[shape],
        styles[`size-${size}`],
        className,
      )}
      {...rest}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt}
          className={styles.img}
          onError={() => setImgError(true)}
        />
      ) : (
        <span aria-hidden="true">
          {initials ? initials.slice(0, 2).toUpperCase() : '?'}
        </span>
      )}

      {status && (
        <span
          className={cn(styles.status, styles[`status-${status}`])}
          aria-label={status}
          data-testid={`${testId}-status`}
        />
      )}
    </span>
  )

  if (planet) {
    return <span data-void-planet={planet}>{avatar}</span>
  }

  return avatar
}
