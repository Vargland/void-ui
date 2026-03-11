import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes, ReactNode } from 'react'
import type { BaseComponentProps } from '../helpers'

// ─── Sort direction ───────────────────────────────────────────────────────────

export type SortDirection = 'asc' | 'desc' | null

// ─── Variant ──────────────────────────────────────────────────────────────────

export type TableVariant = 'default' | 'striped' | 'bordered'

// ─── Size ─────────────────────────────────────────────────────────────────────

export type TableSize = 'sm' | 'md' | 'lg'

// ─── Align ────────────────────────────────────────────────────────────────────

export type TableAlign = 'left' | 'center' | 'right'

// ─── Table (root) ─────────────────────────────────────────────────────────────

export interface TableProps
  extends BaseComponentProps,
    Omit<HTMLAttributes<HTMLTableElement>, 'children'> {
  /** Visual variant of the table */
  variant?: TableVariant
  /** Controls cell padding size */
  size?: TableSize
  /** Makes the thead sticky on scroll */
  stickyHeader?: boolean
  /** Hover highlight on rows */
  hoverable?: boolean
  /** Content of the table */
  children: ReactNode
}

// ─── TableHead ────────────────────────────────────────────────────────────────

export interface TableHeadProps
  extends BaseComponentProps,
    HTMLAttributes<HTMLTableSectionElement> {
  /** Content of the thead */
  children: ReactNode
}

// ─── TableBody ────────────────────────────────────────────────────────────────

export interface TableBodyProps
  extends BaseComponentProps,
    HTMLAttributes<HTMLTableSectionElement> {
  /** Content of the tbody */
  children: ReactNode
}

// ─── TableFooter ──────────────────────────────────────────────────────────────

export interface TableFooterProps
  extends BaseComponentProps,
    HTMLAttributes<HTMLTableSectionElement> {
  /** Content of the tfoot */
  children: ReactNode
}

// ─── TableRow ────────────────────────────────────────────────────────────────

export interface TableRowProps
  extends BaseComponentProps,
    HTMLAttributes<HTMLTableRowElement> {
  /** Highlight row as selected */
  selected?: boolean
  /** Makes the row interactive/clickable */
  onClick?: HTMLAttributes<HTMLTableRowElement>['onClick']
  /** Content of the row */
  children: ReactNode
}

// ─── TableHeader (th) ────────────────────────────────────────────────────────

export interface TableHeaderProps
  extends BaseComponentProps,
    Omit<ThHTMLAttributes<HTMLTableCellElement>, 'align'> {
  /** Show sort affordance icon */
  sortable?: boolean
  /** Current sort direction for this column */
  sortDirection?: SortDirection
  /** Callback when the header is clicked for sorting */
  onSort?: () => void
  /** Text alignment */
  align?: TableAlign
  /** Content of the header cell */
  children?: ReactNode
}

// ─── TableCell (td) ──────────────────────────────────────────────────────────

export interface TableCellProps
  extends BaseComponentProps,
    Omit<TdHTMLAttributes<HTMLTableCellElement>, 'align'> {
  /** Text alignment */
  align?: TableAlign
  /** Right-align and apply monospace font for numeric data */
  numeric?: boolean
  /** Content of the cell */
  children?: ReactNode
}
