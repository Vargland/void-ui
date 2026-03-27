import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Avatar } from './avatar'

describe('Avatar', () => {
  // ─── Rendering ──────────────────────────────────────────────────────────────

  it('renders with default testid', () => {
    render(<Avatar />)

    expect(screen.getByTestId('avatar')).toBeInTheDocument()
  })

  it('renders initials when no src', () => {
    render(<Avatar initials="GR" />)

    expect(screen.getByText('GR')).toBeInTheDocument()
  })

  it('truncates initials to 2 chars', () => {
    render(<Avatar initials="ABC" />)

    expect(screen.getByText('AB')).toBeInTheDocument()
  })

  it('uppercases initials', () => {
    render(<Avatar initials="gr" />)

    expect(screen.getByText('GR')).toBeInTheDocument()
  })

  it('renders ? fallback when no src and no initials', () => {
    render(<Avatar />)

    expect(screen.getByText('?')).toBeInTheDocument()
  })

  it('renders img when src is provided', () => {
    render(<Avatar src="https://example.com/avatar.jpg" alt="User" />)

    expect(screen.getByTestId('avatar').querySelector('img')).toBeInTheDocument()
  })

  // ─── Shape ──────────────────────────────────────────────────────────────────

  it('applies circle shape by default', () => {
    render(<Avatar />)

    expect(screen.getByTestId('avatar').className).toMatch(/circle/)
  })

  it('applies square shape', () => {
    render(<Avatar shape="square" />)

    expect(screen.getByTestId('avatar').className).toMatch(/square/)
  })

  // ─── Size ───────────────────────────────────────────────────────────────────

  it('applies md size by default', () => {
    render(<Avatar />)

    expect(screen.getByTestId('avatar').className).toMatch(/size-md/)
  })

  it.each(['xs', 'sm', 'lg', 'xl'] as const)('applies %s size', (size) => {
    render(<Avatar size={size} />)

    expect(screen.getByTestId('avatar').className).toMatch(new RegExp(`size-${size}`))
  })

  // ─── Status ─────────────────────────────────────────────────────────────────

  it('renders status indicator when status is provided', () => {
    render(<Avatar status="online" />)

    expect(screen.getByTestId('avatar-status')).toBeInTheDocument()
  })

  it('applies correct status class', () => {
    render(<Avatar status="busy" />)

    expect(screen.getByTestId('avatar-status').className).toMatch(/status-busy/)
  })

  it('does not render status indicator when status is not provided', () => {
    render(<Avatar />)

    expect(screen.queryByTestId('avatar-status')).toBeNull()
  })

  // ─── Planet override ────────────────────────────────────────────────────────

  it('wraps in planet scope when planet prop is provided', () => {
    render(<Avatar planet="io" initials="IO" />)

    expect(screen.getByTestId('avatar').closest('[data-void-planet="io"]')).toBeInTheDocument()
  })

  it('renders without wrapper when no planet prop', () => {
    render(<Avatar />)

    expect(document.querySelector('[data-void-planet]')).toBeNull()
  })

  // ─── className passthrough ───────────────────────────────────────────────────

  it('merges custom className', () => {
    render(<Avatar className="custom" />)

    expect(screen.getByTestId('avatar').className).toMatch(/custom/)
  })
})
