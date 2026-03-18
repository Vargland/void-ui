import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Badge } from './badge'

describe('Badge', () => {
  // ─── Rendering ──────────────────────────────────────────────────────────────

  it('renders children', () => {
    render(<Badge>Active</Badge>)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('renders with default testid', () => {
    render(<Badge>Test</Badge>)
    expect(screen.getByTestId('badge')).toBeInTheDocument()
  })

  it('renders with custom testid', () => {
    render(<Badge data-testid="custom-badge">Test</Badge>)
    expect(screen.getByTestId('custom-badge')).toBeInTheDocument()
  })

  // ─── Variants ───────────────────────────────────────────────────────────────

  it('applies solid variant class by default', () => {
    render(<Badge>Solid</Badge>)
    expect(screen.getByTestId('badge').className).toMatch(/variant-solid/)
  })

  it('applies subtle variant class', () => {
    render(<Badge variant="subtle">Subtle</Badge>)
    expect(screen.getByTestId('badge').className).toMatch(/variant-subtle/)
  })

  it('applies outlined variant class', () => {
    render(<Badge variant="outlined">Outlined</Badge>)
    expect(screen.getByTestId('badge').className).toMatch(/variant-outlined/)
  })

  // ─── Sizes ──────────────────────────────────────────────────────────────────

  it('applies md size class by default', () => {
    render(<Badge>Medium</Badge>)
    expect(screen.getByTestId('badge').className).toMatch(/size-md/)
  })

  it('applies sm size class', () => {
    render(<Badge size="sm">Small</Badge>)
    expect(screen.getByTestId('badge').className).toMatch(/size-sm/)
  })

  // ─── Tones ──────────────────────────────────────────────────────────────────

  it('applies default tone class by default', () => {
    render(<Badge>Default</Badge>)
    expect(screen.getByTestId('badge').className).toMatch(/tone-default/)
  })

  it.each(['success', 'warning', 'error', 'info'] as const)('applies %s tone class', (tone) => {
    render(<Badge tone={tone}>{tone}</Badge>)
    expect(screen.getByTestId('badge').className).toMatch(new RegExp(`tone-${tone}`))
  })

  // ─── Dot mode ───────────────────────────────────────────────────────────────

  it('renders dot mode without children', () => {
    render(<Badge dot data-testid="dot-badge">ignored</Badge>)
    const badge = screen.getByTestId('dot-badge')

    expect(badge.className).toMatch(/dot/)
    expect(badge).toBeEmptyDOMElement()
  })

  // ─── Planet override ────────────────────────────────────────────────────────

  it('wraps in planet scope when planet prop is provided', () => {
    render(<Badge planet="mars">Mars</Badge>)
    const badge = screen.getByTestId('badge')

    expect(badge.closest('[data-void-planet="mars"]')).toBeInTheDocument()
  })

  it('renders without wrapper when no planet prop', () => {
    render(<Badge>No planet</Badge>)
    expect(document.querySelector('[data-void-planet]')).toBeNull()
  })

  // ─── className passthrough ───────────────────────────────────────────────────

  it('merges custom className', () => {
    render(<Badge className="custom">Test</Badge>)
    expect(screen.getByTestId('badge').className).toMatch(/custom/)
  })
})
