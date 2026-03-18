import { forwardRef } from 'react'
import type {
  TableProps,
  TableHeadProps,
  TableBodyProps,
  TableFooterProps,
  TableRowProps,
  TableHeaderProps,
  TableCellProps,
} from '../../typings/components/table'
import { cn } from '../../helpers/classnames'
import styles from './table.module.scss'

// ─── Sort icon ────────────────────────────────────────────────────────────────

function SortIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M8 3v10M5 6l3-3 3 3M5 10l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Table (root) ─────────────────────────────────────────────────────────────

export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  {
    variant = 'default',
    size = 'md',
    stickyHeader = false,
    hoverable = false,
    planet,
    className,
    'data-testid': testId = 'table',
    children,
    ...rest
  },
  ref,
) {
  const table = (
    <div
      className={cn(
        styles.wrapper,
        stickyHeader && styles.stickyHeader,
        hoverable && styles.hoverable,
      )}
    >
      <table
        ref={ref}
        data-testid={testId}
        className={cn(
          styles.table,
          styles[`variant-${variant}`],
          styles[`size-${size}`],
          className,
        )}
        {...rest}
      >
        {children}
      </table>
    </div>
  )

  if (planet) {
    return <span data-void-planet={planet}>{table}</span>
  }

  return table
})

// ─── TableHead ────────────────────────────────────────────────────────────────

export const TableHead = forwardRef<HTMLTableSectionElement, TableHeadProps>(
  function TableHead(
    { className, 'data-testid': testId = 'table-head', children, ...rest },
    ref,
  ) {
    return (
      <thead
        ref={ref}
        data-testid={testId}
        className={cn(styles.thead, className)}
        {...rest}
      >
        {children}
      </thead>
    )
  },
)

// ─── TableBody ────────────────────────────────────────────────────────────────

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  function TableBody(
    { className, 'data-testid': testId = 'table-body', children, ...rest },
    ref,
  ) {
    return (
      <tbody
        ref={ref}
        data-testid={testId}
        className={cn(styles.tbody, className)}
        {...rest}
      >
        {children}
      </tbody>
    )
  },
)

// ─── TableFooter ──────────────────────────────────────────────────────────────

export const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(
  function TableFooter(
    { className, 'data-testid': testId = 'table-footer', children, ...rest },
    ref,
  ) {
    return (
      <tfoot
        ref={ref}
        data-testid={testId}
        className={cn(styles.tfoot, className)}
        {...rest}
      >
        {children}
      </tfoot>
    )
  },
)

// ─── TableRow ─────────────────────────────────────────────────────────────────

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  function TableRow(
    {
      selected = false,
      onClick,
      className,
      'data-testid': testId = 'table-row',
      children,
      ...rest
    },
    ref,
  ) {
    return (
      <tr
        ref={ref}
        data-testid={testId}
        aria-selected={selected || undefined}
        tabIndex={onClick ? 0 : undefined}
        onClick={onClick}
        className={cn(
          styles.tr,
          selected && styles.trSelected,
          onClick && styles.trClickable,
          className,
        )}
        {...rest}
      >
        {children}
      </tr>
    )
  },
)

// ─── TableHeader (th) ────────────────────────────────────────────────────────

export const TableHeader = forwardRef<HTMLTableCellElement, TableHeaderProps>(
  function TableHeader(
    {
      sortable = false,
      sortDirection = null,
      onSort,
      align = 'left',
      className,
      'data-testid': testId = 'table-header',
      children,
      ...rest
    },
    ref,
  ) {
    return (
      <th
        ref={ref}
        data-testid={testId}
        aria-sort={
          sortDirection === 'asc'
            ? 'ascending'
            : sortDirection === 'desc'
              ? 'descending'
              : sortable
                ? 'none'
                : undefined
        }
        onClick={sortable ? onSort : undefined}
        tabIndex={sortable ? 0 : undefined}
        onKeyDown={
          sortable
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()

                  onSort?.()
                }
              }
            : undefined
        }
        className={cn(
          styles.th,
          sortable && styles.thSortable,
          styles[`align${align.charAt(0).toUpperCase()}${align.slice(1)}`],
          className,
        )}
        {...rest}
      >
        {sortable ? (
          <span className={styles.thContent}>
            {children}
            <span
              className={cn(
                styles.sortIcon,
                sortDirection === 'asc' && styles.sortIconAsc,
                sortDirection === 'desc' && styles.sortIconDesc,
              )}
            >
              <SortIcon />
            </span>
          </span>
        ) : (
          children
        )}
      </th>
    )
  },
)

// ─── TableCell (td) ──────────────────────────────────────────────────────────

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  function TableCell(
    {
      align = 'left',
      numeric = false,
      className,
      'data-testid': testId = 'table-cell',
      children,
      ...rest
    },
    ref,
  ) {
    return (
      <td
        ref={ref}
        data-testid={testId}
        className={cn(
          styles.td,
          numeric && styles.tdNumeric,
          !numeric && styles[`align${align.charAt(0).toUpperCase()}${align.slice(1)}`],
          className,
        )}
        {...rest}
      >
        {children}
      </td>
    )
  },
)
