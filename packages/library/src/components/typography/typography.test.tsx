import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Typography } from './typography'

describe('Typography', () => {
  // ─── Rendering ──────────────────────────────────────────────────────────────

  it('renders children', () => {
    render(<Typography>Hello</Typography>)

    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('renders as <p> by default', () => {
    render(<Typography>paragraph</Typography>)

    expect(screen.getByTestId('typography').tagName).toBe('P')
  })

  it('renders as custom tag via as prop', () => {
    render(<Typography as="span">span text</Typography>)

    expect(screen.getByTestId('typography').tagName).toBe('SPAN')
  })

  it('renders heading tags', () => {
    (['h1','h2','h3','h4','h5','h6'] as const).forEach(tag => {
      const { unmount } = render(<Typography as={tag}>{tag}</Typography>)

      expect(screen.getByTestId('typography').tagName).toBe(tag.toUpperCase())

      unmount()
    })
  })

  it('renders with default testid', () => {
    render(<Typography>Test</Typography>)

    expect(screen.getByTestId('typography')).toBeInTheDocument()
  })

  it('renders with custom testid', () => {
    render(<Typography data-testid="my-typography">Test</Typography>)

    expect(screen.getByTestId('my-typography')).toBeInTheDocument()
  })

  // ─── Props ──────────────────────────────────────────────────────────────────

  it('applies size class', () => {
    render(<Typography size="xl">Large</Typography>)

    expect(screen.getByTestId('typography').className).toMatch(/size-xl/)
  })

  it('applies color class', () => {
    render(<Typography color="secondary">Secondary</Typography>)

    expect(screen.getByTestId('typography').className).toMatch(/color-secondary/)
  })

  it('applies weight class', () => {
    render(<Typography weight="bold">Bold</Typography>)

    expect(screen.getByTestId('typography').className).toMatch(/weight-bold/)
  })

  it('applies leading class', () => {
    render(<Typography leading="tight">Tight</Typography>)

    expect(screen.getByTestId('typography').className).toMatch(/leading-tight/)
  })

  it('applies tracking class', () => {
    render(<Typography tracking="wide">Wide</Typography>)

    expect(screen.getByTestId('typography').className).toMatch(/tracking-wide/)
  })

  // ─── Modifiers ──────────────────────────────────────────────────────────────

  it('applies truncate class', () => {
    render(<Typography truncate>Truncated</Typography>)

    expect(screen.getByTestId('typography').className).toMatch(/truncate/)
  })

  it('applies uppercase class', () => {
    render(<Typography uppercase>Upper</Typography>)

    expect(screen.getByTestId('typography').className).toMatch(/uppercase/)
  })

  it('applies mono class', () => {
    render(<Typography mono>Mono</Typography>)

    expect(screen.getByTestId('typography').className).toMatch(/mono/)
  })

  // ─── Heading defaults ───────────────────────────────────────────────────────

  it('applies heading default class for h1', () => {
    render(<Typography as="h1">Title</Typography>)

    expect(screen.getByTestId('typography').className).toMatch(/h1/)
  })

  // ─── Planet override ────────────────────────────────────────────────────────

  it('wraps in planet scope when planet prop is provided', () => {
    render(<Typography planet="venus">Venus text</Typography>)

    expect(screen.getByTestId('typography').closest('[data-void-planet="venus"]')).toBeInTheDocument()
  })

  it('renders without wrapper when no planet prop', () => {
    render(<Typography>No planet</Typography>)

    expect(document.querySelector('[data-void-planet]')).toBeNull()
  })

  // ─── className passthrough ───────────────────────────────────────────────────

  it('merges custom className', () => {
    render(<Typography className="custom">Test</Typography>)

    expect(screen.getByTestId('typography').className).toMatch(/custom/)
  })
})
