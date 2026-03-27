import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Table, TableHead, TableBody, TableFooter, TableRow, TableHeader, TableCell } from './table'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function BasicTable() {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Name</TableHeader>
          <TableHeader>Age</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Alice</TableCell>
          <TableCell>30</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Bob</TableCell>
          <TableCell>25</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

describe('Table', () => {

  // ─── Structure ──────────────────────────────────────────────────────────────

  it('renders the table element', () => {
    render(<BasicTable />)

    expect(screen.getByTestId('table')).toBeInTheDocument()
  })

  it('renders thead, tbody sections', () => {
    render(<BasicTable />)

    expect(screen.getByTestId('table-head')).toBeInTheDocument()

    expect(screen.getByTestId('table-body')).toBeInTheDocument()
  })

  it('renders tfoot when TableFooter is used', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Footer</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    )

    expect(screen.getByTestId('table-footer')).toBeInTheDocument()

    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  it('renders all cells with text content', () => {
    render(<BasicTable />)

    expect(screen.getByText('Alice')).toBeInTheDocument()

    expect(screen.getByText('Bob')).toBeInTheDocument()

    expect(screen.getByText('Name')).toBeInTheDocument()

    expect(screen.getByText('Age')).toBeInTheDocument()
  })

  it('renders with default data-testid="table"', () => {
    render(<BasicTable />)

    expect(screen.getByTestId('table')).toBeInTheDocument()
  })

  it('renders with a custom data-testid', () => {
    render(<Table data-testid="my-table"><TableBody><TableRow><TableCell>x</TableCell></TableRow></TableBody></Table>)

    expect(screen.getByTestId('my-table')).toBeInTheDocument()
  })

  // ─── Variants ──────────────────────────────────────────────────────────────

  it.each(['default', 'striped', 'bordered'] as const)(
    'renders variant "%s" without crashing',
    (variant) => {
      render(<Table variant={variant}><TableBody><TableRow><TableCell>x</TableCell></TableRow></TableBody></Table>)

      expect(screen.getByTestId('table')).toBeInTheDocument()
    },
  )

  // ─── Sizes ─────────────────────────────────────────────────────────────────

  it.each(['sm', 'md', 'lg'] as const)(
    'renders size "%s" without crashing',
    (size) => {
      render(<Table size={size}><TableBody><TableRow><TableCell>x</TableCell></TableRow></TableBody></Table>)

      expect(screen.getByTestId('table')).toBeInTheDocument()
    },
  )

  // ─── Hoverable ─────────────────────────────────────────────────────────────

  it('renders with hoverable prop without crashing', () => {
    render(<Table hoverable><TableBody><TableRow><TableCell>x</TableCell></TableRow></TableBody></Table>)

    expect(screen.getByTestId('table')).toBeInTheDocument()
  })

  // ─── Sticky header ──────────────────────────────────────────────────────────

  it('renders with stickyHeader prop without crashing', () => {
    render(
      <Table stickyHeader>
        <TableHead><TableRow><TableHeader>Col</TableHeader></TableRow></TableHead>
        <TableBody><TableRow><TableCell>x</TableCell></TableRow></TableBody>
      </Table>,
    )

    expect(screen.getByTestId('table')).toBeInTheDocument()
  })

  // ─── Row selection ──────────────────────────────────────────────────────────

  it('marks a row as selected via aria-selected', () => {
    render(
      <Table>
        <TableBody>
          <TableRow selected data-testid="selected-row">
            <TableCell>Alice</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )

    expect(screen.getByTestId('selected-row')).toHaveAttribute('aria-selected', 'true')
  })

  it('does not set aria-selected when selected is false', () => {
    render(
      <Table>
        <TableBody>
          <TableRow data-testid="normal-row">
            <TableCell>Bob</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )

    expect(screen.getByTestId('normal-row')).not.toHaveAttribute('aria-selected')
  })

  // ─── Row click ──────────────────────────────────────────────────────────────

  it('calls onClick when a clickable row is clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(
      <Table>
        <TableBody>
          <TableRow onClick={onClick} data-testid="clickable-row">
            <TableCell>Click me</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )

    await user.click(screen.getByTestId('clickable-row'))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  // ─── Sort ───────────────────────────────────────────────────────────────────

  it('renders a sort icon when sortable is true', () => {
    render(
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader sortable data-testid="sort-header">Name</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody><TableRow><TableCell>x</TableCell></TableRow></TableBody>
      </Table>,
    )
    const header = screen.getByTestId('sort-header')

    expect(header.querySelector('svg')).toBeInTheDocument()
  })

  it('calls onSort callback when sortable header is clicked', async () => {
    const user = userEvent.setup()
    const onSort = vi.fn()

    render(
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader sortable onSort={onSort} data-testid="sort-header">Name</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody><TableRow><TableCell>x</TableCell></TableRow></TableBody>
      </Table>,
    )

    await user.click(screen.getByTestId('sort-header'))

    expect(onSort).toHaveBeenCalledTimes(1)
  })

  it('sets aria-sort="ascending" when sortDirection="asc"', () => {
    render(
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader sortable sortDirection="asc" data-testid="sort-header">Name</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody><TableRow><TableCell>x</TableCell></TableRow></TableBody>
      </Table>,
    )

    expect(screen.getByTestId('sort-header')).toHaveAttribute('aria-sort', 'ascending')
  })

  it('sets aria-sort="descending" when sortDirection="desc"', () => {
    render(
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader sortable sortDirection="desc" data-testid="sort-header">Name</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody><TableRow><TableCell>x</TableCell></TableRow></TableBody>
      </Table>,
    )

    expect(screen.getByTestId('sort-header')).toHaveAttribute('aria-sort', 'descending')
  })

  it('sets aria-sort="none" when sortable with no sortDirection', () => {
    render(
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader sortable data-testid="sort-header">Name</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody><TableRow><TableCell>x</TableCell></TableRow></TableBody>
      </Table>,
    )

    expect(screen.getByTestId('sort-header')).toHaveAttribute('aria-sort', 'none')
  })

  // ─── Align ──────────────────────────────────────────────────────────────────

  it.each(['left', 'center', 'right'] as const)(
    'renders TableCell with align="%s" without crashing',
    (align) => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell align={align} data-testid="aligned-cell">value</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      )

      expect(screen.getByTestId('aligned-cell')).toBeInTheDocument()
    },
  )

  it.each(['left', 'center', 'right'] as const)(
    'renders TableHeader with align="%s" without crashing',
    (align) => {
      render(
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader align={align} data-testid="aligned-header">Col</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody><TableRow><TableCell>x</TableCell></TableRow></TableBody>
        </Table>,
      )

      expect(screen.getByTestId('aligned-header')).toBeInTheDocument()
    },
  )

  // ─── Numeric cell ───────────────────────────────────────────────────────────

  it('renders a numeric cell without crashing', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell numeric data-testid="numeric-cell">42</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )

    expect(screen.getByTestId('numeric-cell')).toBeInTheDocument()
  })

  // ─── colSpan ────────────────────────────────────────────────────────────────

  it('forwards colSpan to the cell', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell colSpan={3} data-testid="spanned-cell">Merged</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )

    expect(screen.getByTestId('spanned-cell')).toHaveAttribute('colspan', '3')
  })

  // ─── Planet prop ────────────────────────────────────────────────────────────

  it('wraps the table in a planet scope when planet prop is set', () => {
    render(
      <Table planet="mars" data-testid="planet-table">
        <TableBody><TableRow><TableCell>x</TableCell></TableRow></TableBody>
      </Table>,
    )
    const table = screen.getByTestId('planet-table')
    const wrapper = table.closest('[data-void-planet]')

    expect(wrapper).toHaveAttribute('data-void-planet', 'mars')
  })

  // ─── Custom className ───────────────────────────────────────────────────────

  it('applies custom className to the table element', () => {
    render(
      <Table className="custom-table">
        <TableBody><TableRow><TableCell>x</TableCell></TableRow></TableBody>
      </Table>,
    )

    expect(screen.getByTestId('table')).toHaveClass('custom-table')
  })
})
