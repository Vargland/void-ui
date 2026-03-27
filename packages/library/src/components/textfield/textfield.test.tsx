import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { TextField } from './textfield'

describe('TextField', () => {
  // ─── Rendering ──────────────────────────────────────────────────────────────

  it('renders with default testid', () => {
    render(<TextField />)

    expect(screen.getByTestId('textfield')).toBeInTheDocument()
  })

  it('renders native input element', () => {
    render(<TextField />)

    expect(screen.getByTestId('textfield-native')).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(<TextField label="Email" />)

    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('associates label with input via htmlFor/id', () => {
    render(<TextField label="Email" />)
    const label = screen.getByText('Email')
    const input = screen.getByTestId('textfield-native')

    expect(label).toHaveAttribute('for', input.id)
  })

  it('uses provided id', () => {
    render(<TextField id="my-input" label="Field" />)

    expect(screen.getByTestId('textfield-native')).toHaveAttribute('id', 'my-input')
  })

  it('renders hint when provided', () => {
    render(<TextField hint="Enter your email" />)

    expect(screen.getByText('Enter your email')).toBeInTheDocument()
  })

  it('renders error message when error prop is set', () => {
    render(<TextField error="This field is required" />)

    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })

  it('error message overrides hint', () => {
    render(<TextField hint="Some hint" error="Required" />)

    expect(screen.getByText('Required')).toBeInTheDocument()

    expect(screen.queryByText('Some hint')).toBeNull()
  })

  it('renders prefix when provided', () => {
    render(<TextField prefix={<span data-testid="pre">$</span>} />)

    expect(screen.getByTestId('pre')).toBeInTheDocument()
  })

  it('renders suffix when provided', () => {
    render(<TextField suffix={<span data-testid="suf">@</span>} />)

    expect(screen.getByTestId('suf')).toBeInTheDocument()
  })

  // ─── Size ───────────────────────────────────────────────────────────────────

  it('applies md size by default', () => {
    render(<TextField />)

    expect(screen.getByTestId('textfield').className).toMatch(/size-md/)
  })

  it.each(['sm', 'lg'] as const)('applies %s size', (size) => {
    render(<TextField size={size} />)

    expect(screen.getByTestId('textfield').className).toMatch(new RegExp(`size-${size}`))
  })

  // ─── State ──────────────────────────────────────────────────────────────────

  it('applies error state class when error prop is set', () => {
    render(<TextField error="Oops" />)

    expect(screen.getByTestId('textfield').className).toMatch(/state-error/)
  })

  it('sets aria-invalid on native input when error', () => {
    render(<TextField error="Oops" />)

    expect(screen.getByTestId('textfield-native')).toHaveAttribute('aria-invalid', 'true')
  })

  it('error hint has role="alert"', () => {
    render(<TextField error="Bad input" />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it.each(['success', 'warning'] as const)('applies %s state class', (state) => {
    render(<TextField state={state} />)

    expect(screen.getByTestId('textfield').className).toMatch(new RegExp(`state-${state}`))
  })

  // ─── Disabled ───────────────────────────────────────────────────────────────

  it('disables native input when disabled prop is set', () => {
    render(<TextField disabled />)

    expect(screen.getByTestId('textfield-native')).toBeDisabled()
  })

  // ─── fullWidth ───────────────────────────────────────────────────────────────

  it('applies fullWidth class', () => {
    render(<TextField fullWidth />)

    expect(screen.getByTestId('textfield').className).toMatch(/fullWidth/)
  })

  // ─── Compact ─────────────────────────────────────────────────────────────────

  it('applies compact class', () => {
    render(<TextField compact />)

    expect(screen.getByTestId('textfield').className).toMatch(/compact/)
  })

  it('hides label in compact mode', () => {
    render(<TextField compact label="Email" />)

    expect(screen.queryByText('Email')).toBeNull()
  })

  it('hides hint in compact mode', () => {
    render(<TextField compact hint="Some hint" />)

    expect(screen.queryByText('Some hint')).toBeNull()
  })

  it('hides error text in compact mode', () => {
    render(<TextField compact error="Required" />)

    expect(screen.queryByText('Required')).toBeNull()
  })

  it('still applies error state class in compact mode', () => {
    render(<TextField compact error="Required" />)

    expect(screen.getByTestId('textfield').className).toMatch(/state-error/)
  })

  it('does not set aria-describedby in compact mode', () => {
    render(<TextField compact hint="Some hint" />)

    expect(screen.getByTestId('textfield-native')).not.toHaveAttribute('aria-describedby')
  })

  // ─── Interaction ────────────────────────────────────────────────────────────

  it('fires onChange when user types', async () => {
    const onChange = vi.fn()

    render(<TextField onChange={onChange} />)

    await userEvent.type(screen.getByTestId('textfield-native'), 'hello')

    expect(onChange).toHaveBeenCalled()
  })

  // ─── Planet override ────────────────────────────────────────────────────────

  it('wraps in planet scope when planet prop is provided', () => {
    render(<TextField planet="saturn" />)

    expect(screen.getByTestId('textfield').closest('[data-void-planet="saturn"]')).toBeInTheDocument()
  })

  it('renders without wrapper when no planet prop', () => {
    render(<TextField />)

    expect(document.querySelector('[data-void-planet]')).toBeNull()
  })

  // ─── className passthrough ───────────────────────────────────────────────────

  it('merges custom className', () => {
    render(<TextField className="custom" />)

    expect(screen.getByTestId('textfield').className).toMatch(/custom/)
  })
})
