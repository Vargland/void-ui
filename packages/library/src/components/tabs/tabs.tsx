import * as React from 'react'
import type {
  TabsProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
  TabsContextValue,
} from '../../typings/components/tabs'
import { cn } from '../../helpers/classnames'
import styles from './tabs.module.scss'

// ─── Context ──────────────────────────────────────────────────────────────────

const TabsContext = React.createContext<TabsContextValue | null>(null)

function useTabsContext(): TabsContextValue {
  const ctx = React.useContext(TabsContext)

  if (!ctx) {
    throw new Error('Tabs compound components must be used inside <Tabs>.')
  }

  return ctx
}

// ─── Tabs (root) ──────────────────────────────────────────────────────────────

export function Tabs({
  children,
  defaultValue = '',
  value: valueProp,
  onChange,
  variant = 'line',
  size = 'md',
  className,
  'data-testid': testId = 'tabs',
  planet,
}: TabsProps) {
  const idPrefix = React.useId()

  const isControlled = valueProp !== undefined
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const activeValue = isControlled ? valueProp : internalValue

  const setActiveValue = React.useCallback(
    (value: string) => {
      if (!isControlled) {
                           setInternalValue ( value )
                         }

      onChange?.(value)
    },
    [isControlled, onChange],
  )

  const tabs = (
    <TabsContext.Provider value={{ activeValue, setActiveValue, variant, size, idPrefix }}>
      <div
        className={cn(
          styles.root,
          styles[`variant${variant.charAt(0).toUpperCase()}${variant.slice(1)}`],
          styles[`size-${size}`],
          className,
        )}
        data-testid={testId}
      >
        {children}
      </div>
    </TabsContext.Provider>
  )

  if (planet) {
    return <span data-void-planet={planet}>{tabs}</span>
  }

  return tabs
}

// ─── TabsList ─────────────────────────────────────────────────────────────────

export function TabsList({
  children,
  className,
  'aria-label': ariaLabel,
  'data-testid': testId = 'tabs-list',
}: TabsListProps) {
  const listRef = React.useRef<HTMLDivElement>(null)

  const handleKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    const list = listRef.current

    if (!list) {
                 return
               }

    const triggers = Array.from(
      list.querySelectorAll<HTMLButtonElement>(
        '[role="tab"]:not([disabled])',
      ),
    )

    if (triggers.length === 0) {
                                 return
                               }

    const focused = document.activeElement as HTMLButtonElement
    const currentIndex = triggers.indexOf(focused)

    switch (event.key) {
      case 'ArrowRight': {
        event.preventDefault()
        const next = (currentIndex + 1) % triggers.length

        triggers[next]!.focus()
        break
      }
      case 'ArrowLeft': {
        event.preventDefault()
        const prev = (currentIndex - 1 + triggers.length) % triggers.length

        triggers[prev]!.focus()
        break
      }
      case 'Home': {
        event.preventDefault()

        triggers[0]!.focus()
        break
      }
      case 'End': {
        event.preventDefault()

        triggers[triggers.length - 1]!.focus()
        break
      }
    }
  }, [])

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={ariaLabel}
      className={cn(styles.tabsList, className)}
      onKeyDown={handleKeyDown}
      data-testid={testId}
    >
      {children}
    </div>
  )
}

// ─── TabsTrigger ──────────────────────────────────────────────────────────────

export function TabsTrigger({
  value,
  children,
  disabled = false,
  className,
  'data-testid': testId,
}: TabsTriggerProps) {
  const { activeValue, setActiveValue, idPrefix } = useTabsContext()

  const isActive = activeValue === value
  const triggerId = `${idPrefix}-trigger-${value}`
  const panelId = `${idPrefix}-panel-${value}`

  const handleClick = React.useCallback(() => {
    if (!disabled) {
                     setActiveValue ( value )
                   }
  }, [disabled, setActiveValue, value])

  return (
    <button
      id={triggerId}
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={panelId}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      tabIndex={isActive ? 0 : -1}
      onClick={handleClick}
      className={cn(
        styles.trigger,
        isActive && styles.triggerActive,
        disabled && styles.triggerDisabled,
        className,
      )}
      data-testid={testId}
    >
      {children}
    </button>
  )
}

// ─── TabsContent ──────────────────────────────────────────────────────────────

export function TabsContent({
  value,
  children,
  className,
  'data-testid': testId,
}: TabsContentProps) {
  const { activeValue, idPrefix } = useTabsContext()

  const isActive = activeValue === value
  const panelId = `${idPrefix}-panel-${value}`
  const triggerId = `${idPrefix}-trigger-${value}`

  return (
    <div
      id={panelId}
      role="tabpanel"
      aria-labelledby={triggerId}
      hidden={!isActive}
      className={cn(styles.content, className)}
      data-testid={testId}
    >
      {children}
    </div>
  )
}
