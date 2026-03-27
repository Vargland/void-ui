import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Stack } from './stack'

describe('Stack', () => {
  it('renders children', () => {
    render(<Stack><span>child</span></Stack>)

    expect(screen.getByText('child')).toBeInTheDocument()
  })

  it('renders as div by default', () => {
    render(<Stack />)

    expect(screen.getByTestId('stack').tagName).toBe('DIV')
  })

  it('renders as custom tag via as prop', () => {
    render(<Stack as="section" />)

    expect(screen.getByTestId('stack').tagName).toBe('SECTION')
  })

  it('applies column direction by default', () => {
    render(<Stack />)

    expect(screen.getByTestId('stack').className).toMatch(/column/)
  })

  it('applies row direction', () => {
    render(<Stack direction="row" />)

    expect(screen.getByTestId('stack').className).toMatch(/row/)
  })

  it('applies gap class', () => {
    render(<Stack gap={4} />)

    expect(screen.getByTestId('stack').className).toMatch(/gap-4/)
  })

  it('applies gap-0 class', () => {
    render(<Stack gap={0} />)

    expect(screen.getByTestId('stack').className).toMatch(/gap-0/)
  })

  it('applies align class', () => {
    render(<Stack align="center" />)

    expect(screen.getByTestId('stack').className).toMatch(/align-center/)
  })

  it('applies justify class', () => {
    render(<Stack justify="space-between" />)

    expect(screen.getByTestId('stack').className).toMatch(/justify-space-between/)
  })

  it('applies wrap class', () => {
    render(<Stack wrap />)

    expect(screen.getByTestId('stack').className).toMatch(/wrap/)
  })

  it('applies full class', () => {
    render(<Stack full />)

    expect(screen.getByTestId('stack').className).toMatch(/full/)
  })

  it('wraps in planet scope when planet prop is provided', () => {
    render(<Stack planet="europa" />)

    expect(screen.getByTestId('stack').closest('[data-void-planet="europa"]')).toBeInTheDocument()
  })

  it('renders without wrapper when no planet prop', () => {
    render(<Stack />)

    expect(document.querySelector('[data-void-planet]')).toBeNull()
  })

  it('merges custom className', () => {
    render(<Stack className="custom" />)

    expect(screen.getByTestId('stack').className).toMatch(/custom/)
  })
})
