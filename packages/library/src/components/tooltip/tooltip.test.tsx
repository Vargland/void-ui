import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tooltip } from './tooltip'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function renderTooltip(props?: Partial<React.ComponentProps<typeof Tooltip>>) {
  return render(
    <Tooltip content="Tooltip content" {...props}>
      <button>Trigger</button>
    </Tooltip>,
  )
}

describe('Tooltip', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  // ─── Rendering ─────────────────────────────────────────────────────────────

  it('renders children', () => {
    renderTooltip()
    expect(screen.getByRole('button', { name: 'Trigger' })).toBeInTheDocument()
  })

  it('renders with default data-testid="tooltip"', () => {
    renderTooltip()
    expect(screen.getByTestId('tooltip')).toBeInTheDocument()
  })

  it('renders with a custom data-testid', () => {
    renderTooltip({ 'data-testid': 'my-tooltip' })
    expect(screen.getByTestId('my-tooltip')).toBeInTheDocument()
  })

  it('renders the tooltip bubble in the DOM when not disabled', () => {
    renderTooltip()
    expect(screen.getByRole('tooltip', { hidden: true })).toBeInTheDocument()
  })

  it('tooltip bubble has role="tooltip"', () => {
    renderTooltip()
    expect(screen.getByRole('tooltip', { hidden: true })).toBeInTheDocument()
  })

  it('renders tooltip content text', () => {
    renderTooltip({ content: 'Hello world' })
    expect(screen.getByRole('tooltip', { hidden: true })).toHaveTextContent('Hello world')
  })

  it('renders rich ReactNode content inside tooltip', () => {
    render(
      <Tooltip content={<span data-testid="rich-content">Rich</span>}>
        <button>Trigger</button>
      </Tooltip>,
    )
    expect(screen.getByTestId('rich-content')).toBeInTheDocument()
  })

  // ─── Visibility on hover ──────────────────────────────────────────────────

  it('tooltip is not visible before hover', () => {
    renderTooltip()
    const bubble = screen.getByTestId('tooltip-bubble')

    expect(bubble.className).not.toMatch(/visible/)
  })

  it('shows tooltip after hovering and delay expires', () => {
    renderTooltip({ delay: 300 })
    const trigger = screen.getByTestId('tooltip')

    fireEvent.mouseEnter(trigger)
    act(() => { vi.advanceTimersByTime(300) })
    expect(screen.getByTestId('tooltip-bubble').className).toMatch(/visible/)
  })

  it('does not show tooltip before delay expires', () => {
    renderTooltip({ delay: 300 })
    const trigger = screen.getByTestId('tooltip')

    fireEvent.mouseEnter(trigger)
    act(() => { vi.advanceTimersByTime(100) })
    expect(screen.getByTestId('tooltip-bubble').className).not.toMatch(/visible/)
  })

  it('hides tooltip after mouse leaves', () => {
    renderTooltip({ delay: 0 })
    const trigger = screen.getByTestId('tooltip')

    fireEvent.mouseEnter(trigger)
    act(() => { vi.advanceTimersByTime(0) })
    expect(screen.getByTestId('tooltip-bubble').className).toMatch(/visible/)
    fireEvent.mouseLeave(trigger)
    expect(screen.getByTestId('tooltip-bubble').className).not.toMatch(/visible/)
  })

  // ─── Visibility on focus / blur ───────────────────────────────────────────

  it('shows tooltip on keyboard focus', () => {
    renderTooltip({ delay: 0 })
    const trigger = screen.getByTestId('tooltip')

    fireEvent.focus(trigger)
    act(() => { vi.advanceTimersByTime(0) })
    expect(screen.getByTestId('tooltip-bubble').className).toMatch(/visible/)
  })

  it('hides tooltip on blur', () => {
    renderTooltip({ delay: 0 })
    const trigger = screen.getByTestId('tooltip')

    fireEvent.focus(trigger)
    act(() => { vi.advanceTimersByTime(0) })
    expect(screen.getByTestId('tooltip-bubble').className).toMatch(/visible/)
    fireEvent.blur(trigger)
    expect(screen.getByTestId('tooltip-bubble').className).not.toMatch(/visible/)
  })

  // ─── Disabled ─────────────────────────────────────────────────────────────

  it('does not render tooltip bubble when disabled', () => {
    renderTooltip({ disabled: true })
    expect(screen.queryByRole('tooltip', { hidden: true })).not.toBeInTheDocument()
  })

  it('does not show tooltip on hover when disabled', () => {
    renderTooltip({ disabled: true })
    const trigger = screen.getByTestId('tooltip')

    fireEvent.mouseEnter(trigger)
    act(() => { vi.advanceTimersByTime(500) })
    expect(screen.queryByRole('tooltip', { hidden: true })).not.toBeInTheDocument()
  })

  // ─── aria-describedby ────────────────────────────────────────────────────

  it('sets aria-describedby on trigger when tooltip is visible', () => {
    renderTooltip({ delay: 0 })
    const trigger = screen.getByTestId('tooltip')

    fireEvent.mouseEnter(trigger)
    act(() => { vi.advanceTimersByTime(0) })
    const tooltipId = screen.getByRole('tooltip').id
    const triggerInner = screen.getByRole('button', { name: 'Trigger' }).closest('[aria-describedby]')

    expect(triggerInner).toHaveAttribute('aria-describedby', tooltipId)
  })

  it('removes aria-describedby when tooltip is hidden', () => {
    renderTooltip()
    const triggerInner = screen.getByRole('button', { name: 'Trigger' }).parentElement

    expect(triggerInner).not.toHaveAttribute('aria-describedby')
  })

  // ─── Placement ────────────────────────────────────────────────────────────

  it.each(['top', 'bottom', 'left', 'right'] as const)(
    'applies placement class for "%s"',
    (placement) => {
      renderTooltip({ placement })
      const bubble = screen.getByTestId('tooltip-bubble')

      expect(bubble.className).toMatch(new RegExp(`placement${placement.charAt(0).toUpperCase()}${placement.slice(1)}`))
    },
  )

  it('defaults to top placement', () => {
    renderTooltip()
    const bubble = screen.getByTestId('tooltip-bubble')

    expect(bubble.className).toMatch(/placementTop/)
  })

  // ─── maxWidth ─────────────────────────────────────────────────────────────

  it('applies maxWidth style to tooltip bubble', () => {
    renderTooltip({ maxWidth: 320 })
    const bubble = screen.getByTestId('tooltip-bubble')

    expect(bubble).toHaveStyle({ maxWidth: '320px' })
  })

  // ─── Planet override ──────────────────────────────────────────────────────

  it('wraps in planet scope when planet prop is provided', () => {
    renderTooltip({ planet: 'saturn' })
    expect(screen.getByTestId('tooltip').closest('[data-void-planet="saturn"]')).toBeInTheDocument()
  })

  it('renders without planet wrapper when no planet prop', () => {
    renderTooltip()
    expect(document.querySelector('[data-void-planet]')).toBeNull()
  })

  // ─── className passthrough ────────────────────────────────────────────────

  it('merges custom className onto root element', () => {
    renderTooltip({ className: 'custom-class' })
    expect(screen.getByTestId('tooltip').className).toMatch(/custom-class/)
  })

  // ─── Delay cancellation ───────────────────────────────────────────────────

  it('cancels pending show if mouse leaves before delay expires', () => {
    renderTooltip({ delay: 300 })
    const trigger = screen.getByTestId('tooltip')

    fireEvent.mouseEnter(trigger)
    act(() => { vi.advanceTimersByTime(100) })
    fireEvent.mouseLeave(trigger)
    act(() => { vi.advanceTimersByTime(300) })
    expect(screen.getByTestId('tooltip-bubble').className).not.toMatch(/visible/)
  })
})
