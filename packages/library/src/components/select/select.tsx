import {
  useState,
  useRef,
  useId,
  useEffect,
  useCallback,
  type KeyboardEvent,
} from 'react'
import type { SelectProps } from '../../typings/components/select'
import { cn } from '../../helpers/classnames'
import styles from './select.module.scss'

// ─── Icons ────────────────────────────────────────────────────────────────────

function ChevronIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ClearIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Select({
  options,
  value: valueProp,
  defaultValue,
  onChange,
  placeholder = 'Select an option',
  label,
  description,
  error,
  size = 'md',
  disabled = false,
  searchable = false,
  clearable = false,
  emptyMessage = 'No options found',
  startIcon,
  className,
  'data-testid': testId = 'select',
  planet,
}: SelectProps) {
  const triggerId = useId()
  const listboxId = useId()

  const [isOpen, setIsOpen] = useState(false)
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')
  const [searchQuery, setSearchQuery] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(0)

  const isControlled = valueProp !== undefined
  const currentValue = isControlled ? valueProp : internalValue

  const triggerRef = useRef<HTMLButtonElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  const hasError = Boolean(error)
  const hintId = `${triggerId}-hint`

  const selectedOption = options.find(o => o.value === currentValue)

  const filteredOptions = searchable && searchQuery
    ? options.filter(o => o.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : options

  // ─── Close on outside click ──────────────────────────────────────────────

  useEffect(() => {
    if (!isOpen) {return}

    function handleClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)

    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen])

  // ─── Focus search when opens ─────────────────────────────────────────────

  useEffect(() => {
    if (isOpen && searchable) {
      setTimeout(() => searchRef.current?.focus(), 0)
    }

    if (isOpen) {
      const idx = filteredOptions.findIndex(o => o.value === currentValue)

      setHighlightedIndex(idx >= 0 ? idx : 0)
    }
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Handlers ────────────────────────────────────────────────────────────

  const selectOption = useCallback((value: string) => {
    if (!isControlled) {setInternalValue(value)}

    onChange?.(value)
    setIsOpen(false)
    setSearchQuery('')
    triggerRef.current?.focus()
  }, [isControlled, onChange])

  const clearSelection = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()

    if (!isControlled) {setInternalValue('')}

    onChange?.('')
  }, [isControlled, onChange])

  const handleTriggerKeyDown = useCallback((e: KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault()
        setIsOpen(prev => !prev)
        break
      case 'ArrowDown':
        e.preventDefault()

        if (!isOpen) {
          setIsOpen(true)
        } else {
          setHighlightedIndex(prev =>
            Math.min(prev + 1, filteredOptions.length - 1)
          )
        }

        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => Math.max(prev - 1, 0))
        break
      case 'Escape':
        setIsOpen(false)
        break
    }
  }, [isOpen, filteredOptions.length])

  const handleListKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev =>
          Math.min(prev + 1, filteredOptions.length - 1)
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => Math.max(prev - 1, 0))
        break
      case 'Enter':
        e.preventDefault()

        if (filteredOptions[highlightedIndex] && !filteredOptions[highlightedIndex].disabled) {
          selectOption(filteredOptions[highlightedIndex].value)
        }

        break
      case 'Escape':
        setIsOpen(false)
        triggerRef.current?.focus()
        break
    }
  }, [filteredOptions, highlightedIndex, selectOption])

  // ─── Render ───────────────────────────────────────────────────────────────

  const select = (
    <div
      ref={rootRef}
      className={cn(styles.root, styles[`size-${size}`], className)}
      data-testid={testId}
    >
      {label && (
        <label htmlFor={triggerId} className={styles.label}>
          {label}
        </label>
      )}

      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-labelledby={label ? undefined : undefined}
        aria-describedby={description || error ? hintId : undefined}
        aria-invalid={hasError || undefined}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(prev => !prev)}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          styles.trigger,
          isOpen && styles.triggerOpen,
          disabled && styles.triggerDisabled,
          hasError && styles.triggerError,
        )}
      >
        {startIcon && <span className={styles.startIcon}>{startIcon}</span>}

        <span className={cn(styles.triggerContent, !selectedOption && styles.placeholder)}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        {clearable && currentValue && !disabled && (
          <span
            role="button"
            onClick={clearSelection}
            className={styles.clearBtn}
            aria-label="Clear selection"
            tabIndex={-1}
            onKeyDown={e => e.key === 'Enter' && clearSelection(e as unknown as React.MouseEvent)}
          >
            <ClearIcon />
          </span>
        )}

        <span className={styles.chevron}>
          <ChevronIcon />
        </span>
      </button>

      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          aria-label={label ?? placeholder}
          className={styles.dropdown}
          onKeyDown={handleListKeyDown}
        >
          {searchable && (
            <div className={styles.searchWrapper}>
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value)
                  setHighlightedIndex(0)
                }}
                placeholder="Search…"
                className={styles.searchInput}
                aria-label="Search options"
              />
            </div>
          )}

          <div className={styles.list}>
            {filteredOptions.length === 0 ? (
              <div className={styles.empty}>{emptyMessage}</div>
            ) : (
              filteredOptions.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={option.value === currentValue}
                  disabled={option.disabled}
                  onClick={() => !option.disabled && selectOption(option.value)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={cn(
                    styles.option,
                    option.value === currentValue && styles.optionSelected,
                    index === highlightedIndex && styles.optionHighlighted,
                    option.disabled && styles.optionDisabled,
                  )}
                >
                  <span className={styles.optionLabel}>{option.label}</span>
                  {option.description && (
                    <span className={styles.optionDescription}>{option.description}</span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {(description || error) && (
        <span id={hintId} className={cn(styles.hint, hasError && styles.hintError)}>
          {error ?? description}
        </span>
      )}
    </div>
  )

  if (planet) {
    return <span data-void-planet={planet}>{select}</span>
  }

  return select
}
