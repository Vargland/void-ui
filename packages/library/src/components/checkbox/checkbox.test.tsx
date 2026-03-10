import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox } from './checkbox'

describe('Checkbox', () => {

  // ─── Rendering ─────────────────────────────────────────────────────────────

  it('renders without crashing', () => {
    render(<Checkbox />)
    expect(screen.getByTestId('checkbox')).toBeInTheDocument()
  })

  it('renders with a label', () => {
    render(<Checkbox label="Accept terms" />)
    expect(screen.getByText('Accept terms')).toBeInTheDocument()
  })

  it('renders a description', () => {
    render(<Checkbox label="Subscribe" description="Get weekly updates" />)
    expect(screen.getByText('Get weekly updates')).toBeInTheDocument()
  })

  it('renders an error message instead of description', () => {
    render(<Checkbox label="Subscribe" description="Get weekly updates" error="Required field" />)
    expect(screen.getByText('Required field')).toBeInTheDocument()
    expect(screen.queryByText('Get weekly updates')).not.toBeInTheDocument()
  })

  it('renders with data-testid="checkbox" by default', () => {
    render(<Checkbox />)
    expect(screen.getByTestId('checkbox')).toBeInTheDocument()
  })

  it('renders with a custom data-testid', () => {
    render(<Checkbox data-testid="my-checkbox" />)
    expect(screen.getByTestId('my-checkbox')).toBeInTheDocument()
  })

  // ─── Input type ────────────────────────────────────────────────────────────

  it('renders as type="checkbox"', () => {
    render(<Checkbox />)
    expect(screen.getByTestId('checkbox')).toHaveAttribute('type', 'checkbox')
  })

  // ─── Label association ────────────────────────────────────────────────────

  it('associates label with input via htmlFor/id', () => {
    render(<Checkbox label="Accept" id="my-cb" />)
    const label = screen.getByText('Accept')
    expect(label).toHaveAttribute('for', 'my-cb')
    expect(screen.getByTestId('checkbox')).toHaveAttribute('id', 'my-cb')
  })

  it('generates an id automatically when not provided', () => {
    render(<Checkbox label="Auto ID" />)
    const input = screen.getByTestId('checkbox')
    const id = input.getAttribute('id')
    expect(id).toBeTruthy()
    const label = screen.getByText('Auto ID')
    expect(label).toHaveAttribute('for', id)
  })

  // ─── Sizes ─────────────────────────────────────────────────────────────────

  it.each(['sm', 'md', 'lg'] as const)(
    'renders size "%s" without crashing',
    (size) => {
      render(<Checkbox size={size} label="Test" />)
      expect(screen.getByTestId('checkbox')).toBeInTheDocument()
    },
  )

  // ─── Disabled state ────────────────────────────────────────────────────────

  it('is disabled when disabled prop is true', () => {
    render(<Checkbox disabled />)
    expect(screen.getByTestId('checkbox')).toBeDisabled()
  })

  it('does not fire onChange when disabled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Checkbox disabled onChange={onChange} label="Test" />)
    await user.click(screen.getByText('Test'))
    expect(onChange).not.toHaveBeenCalled()
  })

  // ─── Controlled ────────────────────────────────────────────────────────────

  it('is checked when checked=true', () => {
    render(<Checkbox checked onChange={() => {}} />)
    expect(screen.getByTestId('checkbox')).toBeChecked()
  })

  it('is unchecked when checked=false', () => {
    render(<Checkbox checked={false} onChange={() => {}} />)
    expect(screen.getByTestId('checkbox')).not.toBeChecked()
  })

  it('fires onChange when clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Checkbox label="Click me" onChange={onChange} />)
    await user.click(screen.getByText('Click me'))
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  // ─── Indeterminate ─────────────────────────────────────────────────────────

  it('sets aria-checked="mixed" when indeterminate', () => {
    render(<Checkbox indeterminate />)
    expect(screen.getByTestId('checkbox')).toHaveAttribute('aria-checked', 'mixed')
  })

  // ─── Error state ───────────────────────────────────────────────────────────

  it('sets aria-invalid when error is provided', () => {
    render(<Checkbox error="This field is required" />)
    expect(screen.getByTestId('checkbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('does not set aria-invalid without error', () => {
    render(<Checkbox />)
    expect(screen.getByTestId('checkbox')).not.toHaveAttribute('aria-invalid')
  })

  // ─── aria-describedby ──────────────────────────────────────────────────────

  it('sets aria-describedby when description is provided', () => {
    render(<Checkbox label="Test" description="Helper text" id="cb1" />)
    expect(screen.getByTestId('checkbox')).toHaveAttribute('aria-describedby', 'cb1-hint')
  })

  it('sets aria-describedby when error is provided', () => {
    render(<Checkbox label="Test" error="Error msg" id="cb2" />)
    expect(screen.getByTestId('checkbox')).toHaveAttribute('aria-describedby', 'cb2-hint')
  })
})
