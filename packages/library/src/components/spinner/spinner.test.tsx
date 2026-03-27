import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Spinner } from './spinner'

describe('Spinner', () => {
  // ─── Rendering ──────────────────────────────────────────────────────────────

  it('renders with default testid', () => {
    render(<Spinner />)

    expect(screen.getByTestId('spinner')).toBeInTheDocument()
  })

  it('has role="status"', () => {
    render(<Spinner />)

    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('has default aria-label "Loading…"', () => {
    render(<Spinner />)

    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading…')
  })

  it('accepts custom label', () => {
    render(<Spinner label="Please wait" />)

    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Please wait')
  })

  // ─── Variant ────────────────────────────────────────────────────────────────

  it('applies ring variant by default', () => {
    render(<Spinner />)

    expect(screen.getByTestId('spinner').className).toMatch(/ring/)
  })

  it('applies dots variant', () => {
    render(<Spinner variant="dots" />)

    expect(screen.getByTestId('spinner').className).toMatch(/dots/)
  })

  it('applies pulse variant', () => {
    render(<Spinner variant="pulse" />)

    expect(screen.getByTestId('spinner').className).toMatch(/pulse/)
  })

  it('renders svg for ring variant', () => {
    render(<Spinner variant="ring" />)

    expect(screen.getByTestId('spinner').querySelector('svg')).toBeInTheDocument()
  })

  it('renders 3 dot elements for dots variant', () => {
    render(<Spinner variant="dots" />)
    const dots = screen.getByTestId('spinner').querySelectorAll('[class*="dot"]')

    expect(dots.length).toBe(3)
  })

  // ─── Size ───────────────────────────────────────────────────────────────────

  it('applies md size by default', () => {
    render(<Spinner />)

    expect(screen.getByTestId('spinner').className).toMatch(/size-md/)
  })

  it.each(['xs', 'sm', 'lg', 'xl'] as const)('applies %s size', (size) => {
    render(<Spinner size={size} />)

    expect(screen.getByTestId('spinner').className).toMatch(new RegExp(`size-${size}`))
  })

  // ─── Planet override ────────────────────────────────────────────────────────

  it('wraps in planet scope when planet prop is provided', () => {
    render(<Spinner planet="mars" />)

    expect(screen.getByTestId('spinner').closest('[data-void-planet="mars"]')).toBeInTheDocument()
  })

  it('renders without wrapper when no planet prop', () => {
    render(<Spinner />)

    expect(document.querySelector('[data-void-planet]')).toBeNull()
  })

  // ─── className passthrough ───────────────────────────────────────────────────

  it('merges custom className', () => {
    render(<Spinner className="custom" />)

    expect(screen.getByTestId('spinner').className).toMatch(/custom/)
  })
})
