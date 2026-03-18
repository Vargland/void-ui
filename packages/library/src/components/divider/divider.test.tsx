import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Divider } from './divider'

describe('Divider', () => {
  it('renders with default testid', () => {
    render(<Divider />)

    expect(screen.getByTestId('divider')).toBeInTheDocument()
  })

  it('renders with role separator', () => {
    render(<Divider />)

    expect(screen.getByRole('separator')).toBeInTheDocument()
  })

  it('renders horizontal by default', () => {
    render(<Divider />)

    expect(screen.getByRole('separator').getAttribute('aria-orientation')).toBe('horizontal')
  })

  it('renders vertical orientation', () => {
    render(<Divider orientation="vertical" />)

    expect(screen.getByRole('separator').className).toMatch(/vertical/)

    expect(screen.getByRole('separator').getAttribute('aria-orientation')).toBe('vertical')
  })

  it('applies solid variant by default', () => {
    render(<Divider />)

    expect(screen.getByRole('separator').className).toMatch(/solid/)
  })

  it('applies dashed variant', () => {
    render(<Divider variant="dashed" />)

    expect(screen.getByRole('separator').className).toMatch(/dashed/)
  })

  it('applies dotted variant', () => {
    render(<Divider variant="dotted" />)

    expect(screen.getByRole('separator').className).toMatch(/dotted/)
  })

  it('renders label when provided', () => {
    render(<Divider label="Section" />)

    expect(screen.getByText('Section')).toBeInTheDocument()
  })

  it('does not render label span when vertical', () => {
    render(<Divider orientation="vertical" label="ignored" />)

    expect(screen.queryByText('ignored')).not.toBeInTheDocument()
  })

  it('applies label-start alignment class', () => {
    render(<Divider label="Start" labelAlign="start" />)

    expect(screen.getByRole('separator').className).toMatch(/label-start/)
  })

  it('applies label-end alignment class', () => {
    render(<Divider label="End" labelAlign="end" />)

    expect(screen.getByRole('separator').className).toMatch(/label-end/)
  })

  it('wraps in planet scope when planet prop is provided', () => {
    render(<Divider planet="neptune" />)

    expect(screen.getByRole('separator').closest('[data-void-planet="neptune"]')).toBeInTheDocument()
  })

  it('merges custom className', () => {
    render(<Divider className="my-divider" />)

    expect(screen.getByRole('separator').className).toMatch(/my-divider/)
  })

  it('applies flush class when flush prop is set', () => {
    render(<Divider flush />)

    expect(screen.getByRole('separator').className).toMatch(/flush/)
  })

  it('does not apply flush class by default', () => {
    render(<Divider />)

    expect(screen.getByRole('separator').className).not.toMatch(/flush/)
  })
})
