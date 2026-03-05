import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './button'

describe('Button', () => {

  // ─── Rendering ─────────────────────────────────────────────────────────────

  it('renders children correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('renders as a <button> element by default', () => {
    render(<Button>Test</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders with data-testid="button" by default', () => {
    render(<Button>Test</Button>)
    expect(screen.getByTestId('button')).toBeInTheDocument()
  })

  it('renders with a custom data-testid', () => {
    render(<Button data-testid="my-button">Test</Button>)
    expect(screen.getByTestId('my-button')).toBeInTheDocument()
  })

  // ─── Variants ──────────────────────────────────────────────────────────────

  it.each(['primary', 'secondary', 'ghost', 'danger'] as const)(
    'renders variant "%s" without crashing',
    (variant) => {
      render(<Button variant={variant}>{variant}</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    },
  )

  // ─── Sizes ─────────────────────────────────────────────────────────────────

  it.each(['sm', 'md', 'lg'] as const)(
    'renders size "%s" without crashing',
    (size) => {
      render(<Button size={size}>Test</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    },
  )

  // ─── Disabled state ────────────────────────────────────────────────────────

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Test</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
    expect(btn).toHaveAttribute('aria-disabled', 'true')
  })

  it('does not fire onClick when disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button disabled onClick={onClick}>Test</Button>)
    await user.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  // ─── Loading state ─────────────────────────────────────────────────────────

  it('sets aria-busy when loading', () => {
    render(<Button loading>Test</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true')
  })

  it('is disabled when loading', () => {
    render(<Button loading>Test</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('does not fire onClick when loading', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button loading onClick={onClick}>Test</Button>)
    await user.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  // ─── Click handler ─────────────────────────────────────────────────────────

  it('fires onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click</Button>)
    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  // ─── Icons ─────────────────────────────────────────────────────────────────

  it('renders iconBefore when provided', () => {
    render(<Button iconBefore={<span data-testid="icon-before" />}>Test</Button>)
    expect(screen.getByTestId('icon-before')).toBeInTheDocument()
  })

  it('renders iconAfter when provided', () => {
    render(<Button iconAfter={<span data-testid="icon-after" />}>Test</Button>)
    expect(screen.getByTestId('icon-after')).toBeInTheDocument()
  })

  it('hides iconAfter when loading', () => {
    render(<Button loading iconAfter={<span data-testid="icon-after" />}>Test</Button>)
    expect(screen.queryByTestId('icon-after')).not.toBeInTheDocument()
  })

  // ─── Polymorphic ───────────────────────────────────────────────────────────

  it('renders as an <a> tag when as="a"', () => {
    render(<Button as="a" href="/test">Link</Button>)
    expect(screen.getByRole('link')).toBeInTheDocument()
  })

  // ─── Class names ───────────────────────────────────────────────────────────

  it('applies custom className', () => {
    render(<Button className="custom-class">Test</Button>)
    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })

  // ─── Snapshot ──────────────────────────────────────────────────────────────

  it('matches snapshot', () => {
    const { container } = render(<Button variant="primary" size="md">Snapshot</Button>)
    expect(container.firstChild).toMatchSnapshot()
  })
})
