import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { Toast, ToastContainer } from './toast'
import { useToast } from '../../hooks/use-toast'

// ─── Toast component ──────────────────────────────────────────────────────────

describe('Toast', () => {

  // ─── Rendering ──────────────────────────────────────────────────────────────

  it('renders with default testid', () => {
    render(<Toast title="Hello" />)

    expect(screen.getByTestId('toast')).toBeInTheDocument()
  })

  it('renders the title', () => {
    render(<Toast title="Update available" />)

    expect(screen.getByTestId('toast-title')).toHaveTextContent('Update available')
  })

  it('renders the description when provided', () => {
    render(<Toast title="Done" description="Your file was saved." />)

    expect(screen.getByTestId('toast-description')).toHaveTextContent('Your file was saved.')
  })

  it('does not render description when not provided', () => {
    render(<Toast title="Done" />)

    expect(screen.queryByTestId('toast-description')).not.toBeInTheDocument()
  })

  it('renders with role="alert"', () => {
    render(<Toast title="Alert" />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('renders with custom testid', () => {
    render(<Toast title="Hi" data-testid="my-toast" />)

    expect(screen.getByTestId('my-toast')).toBeInTheDocument()
  })

  // ─── Variants ───────────────────────────────────────────────────────────────

  it('applies default variant class by default', () => {
    render(<Toast title="Default" />)

    expect(screen.getByTestId('toast').className).toMatch(/variant-default/)
  })

  it.each(['success', 'error', 'warning', 'info'] as const)(
    'applies %s variant class',
    (variant) => {
      render(<Toast title={variant} variant={variant} />)

      expect(screen.getByTestId('toast').className).toMatch(new RegExp(`variant-${variant}`))
    },
  )

  // ─── Icons ───────────────────────────────────────────────────────────────────

  it('renders success icon for success variant', () => {
    render(<Toast title="Success" variant="success" />)

    expect(screen.getByTestId('toast-icon')).toHaveTextContent('✓')
  })

  it('renders error icon for error variant', () => {
    render(<Toast title="Error" variant="error" />)

    expect(screen.getByTestId('toast-icon')).toHaveTextContent('✗')
  })

  it('renders warning icon for warning variant', () => {
    render(<Toast title="Warning" variant="warning" />)

    expect(screen.getByTestId('toast-icon')).toHaveTextContent('⚠')
  })

  it('renders info icon for info variant', () => {
    render(<Toast title="Info" variant="info" />)

    expect(screen.getByTestId('toast-icon')).toHaveTextContent('ℹ')
  })

  it('does not render icon for default variant', () => {
    render(<Toast title="Default" variant="default" />)

    expect(screen.queryByTestId('toast-icon')).not.toBeInTheDocument()
  })

  // ─── Close button ────────────────────────────────────────────────────────────

  it('renders a close button', () => {
    render(<Toast title="Closeable" />)

    expect(screen.getByTestId('toast-close')).toBeInTheDocument()
  })

  it('close button has correct aria-label', () => {
    render(<Toast title="Closeable" />)

    expect(screen.getByTestId('toast-close')).toHaveAttribute('aria-label', 'Dismiss notification')
  })

  it('calls onClose when close button is clicked', async () => {
    const user    = userEvent.setup()
    const onClose = vi.fn()

    render(<Toast title="Closeable" onClose={onClose} duration={0} />)

    await user.click(screen.getByTestId('toast-close'))

    // onClose fires after the exit animation delay (200ms)
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 250))
    })

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  // ─── Action button ───────────────────────────────────────────────────────────

  it('renders action button when action prop is provided', () => {
    render(<Toast title="With action" action={{ label: 'Undo', onClick: vi.fn() }} />)

    expect(screen.getByTestId('toast-action')).toHaveTextContent('Undo')
  })

  it('does not render action when not provided', () => {
    render(<Toast title="No action" />)

    expect(screen.queryByTestId('toast-action')).not.toBeInTheDocument()
  })

  it('calls action.onClick when action button is clicked', async () => {
    const user     = userEvent.setup()
    const onClick  = vi.fn()

    render(<Toast title="With action" action={{ label: 'Retry', onClick }} />)

    await user.click(screen.getByTestId('toast-action'))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  // ─── Progress bar ────────────────────────────────────────────────────────────

  it('renders progress bar when duration > 0', () => {
    render(<Toast title="Auto" duration={3000} />)

    expect(screen.getByTestId('toast-progress')).toBeInTheDocument()
  })

  it('does not render progress bar when duration is 0', () => {
    render(<Toast title="Permanent" duration={0} />)

    expect(screen.queryByTestId('toast-progress')).not.toBeInTheDocument()
  })

  // ─── Auto-dismiss ────────────────────────────────────────────────────────────

  it('calls onClose after duration elapses', async () => {
    vi.useFakeTimers()
    const onClose = vi.fn()

    render(<Toast title="Auto dismiss" duration={1000} onClose={onClose} />)

    act(() => { vi.advanceTimersByTime(1000) })

    act(() => { vi.advanceTimersByTime(250) })

    expect(onClose).toHaveBeenCalledTimes(1)

    vi.useRealTimers()
  })

  it('does not call onClose when duration is 0', async () => {
    vi.useFakeTimers()
    const onClose = vi.fn()

    render(<Toast title="No auto" duration={0} onClose={onClose} />)

    act(() => { vi.advanceTimersByTime(10000) })

    expect(onClose).not.toHaveBeenCalled()

    vi.useRealTimers()
  })

  // ─── Planet override ─────────────────────────────────────────────────────────

  it('wraps in planet scope when planet prop is provided', () => {
    render(<Toast title="Planet" planet="mars" />)

    expect(screen.getByTestId('toast').closest('[data-void-planet="mars"]')).toBeInTheDocument()
  })

  it('renders without wrapper when no planet prop', () => {
    render(<Toast title="No planet" />)

    expect(document.querySelector('[data-void-planet]')).toBeNull()
  })

  // ─── className passthrough ───────────────────────────────────────────────────

  it('merges custom className', () => {
    render(<Toast title="Styled" className="my-custom" />)

    expect(screen.getByTestId('toast').className).toMatch(/my-custom/)
  })
})

// ─── ToastContainer ───────────────────────────────────────────────────────────

describe('ToastContainer', () => {
  const mockToasts = [
    { id: '1', title: 'First',  variant: 'default' as const, duration: 0 },
    { id: '2', title: 'Second', variant: 'success' as const, duration: 0 },
  ]

  it('renders with default testid', () => {
    render(<ToastContainer toasts={[]} onDismiss={vi.fn()} />)

    expect(screen.getByTestId('toast-container')).toBeInTheDocument()
  })

  it('renders all toasts', () => {
    render(<ToastContainer toasts={mockToasts} onDismiss={vi.fn()} />)

    expect(screen.getByText('First')).toBeInTheDocument()

    expect(screen.getByText('Second')).toBeInTheDocument()
  })

  it('calls onDismiss with the correct toast id when close is clicked', async () => {
    const user      = userEvent.setup()
    const onDismiss = vi.fn()

    render(<ToastContainer toasts={mockToasts} onDismiss={onDismiss} />)
    const closeButtons = screen.getAllByRole('button', { name: /dismiss/i })

    await user.click(closeButtons[0])

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 250))
    })

    expect(onDismiss).toHaveBeenCalledWith('1')
  })

  it.each([
    'top-right',
    'top-left',
    'bottom-right',
    'bottom-left',
    'top-center',
    'bottom-center',
  ] as const)(
    'applies position class for "%s"',
    (position) => {
      render(<ToastContainer toasts={[]} onDismiss={vi.fn()} position={position} />)

      expect(screen.getByTestId('toast-container').className).toMatch(
        new RegExp(`position-${position}`),
      )
    },
  )

  it('applies bottom-right position class by default', () => {
    render(<ToastContainer toasts={[]} onDismiss={vi.fn()} />)

    expect(screen.getByTestId('toast-container').className).toMatch(/position-bottom-right/)
  })

  it('renders empty container when toasts array is empty', () => {
    render(<ToastContainer toasts={[]} onDismiss={vi.fn()} />)
    const container = screen.getByTestId('toast-container')

    expect(container.querySelectorAll('[role="alert"]')).toHaveLength(0)
  })
})

// ─── useToast hook ────────────────────────────────────────────────────────────

describe('useToast', () => {

  it('initializes with empty toasts array', () => {
    const { result } = renderHook(() => useToast())

    expect(result.current.toasts).toEqual([])
  })

  it('toast() adds a toast and returns an id', () => {
    const { result } = renderHook(() => useToast())
    let id: string

    act(() => {
      id = result.current.toast('Hello world')
    })

    expect(result.current.toasts).toHaveLength(1)

    expect(result.current.toasts[0].title).toBe('Hello world')

    expect(result.current.toasts[0].variant).toBe('default')

    expect(id!).toBeTruthy()
  })

  it('toast.success() adds a success toast', () => {
    const { result } = renderHook(() => useToast())

    act(() => { result.current.toast.success('Done!') })

    expect(result.current.toasts[0].variant).toBe('success')

    expect(result.current.toasts[0].title).toBe('Done!')
  })

  it('toast.error() adds an error toast', () => {
    const { result } = renderHook(() => useToast())

    act(() => { result.current.toast.error('Something failed') })

    expect(result.current.toasts[0].variant).toBe('error')
  })

  it('toast.warning() adds a warning toast', () => {
    const { result } = renderHook(() => useToast())

    act(() => { result.current.toast.warning('Watch out') })

    expect(result.current.toasts[0].variant).toBe('warning')
  })

  it('toast.info() adds an info toast', () => {
    const { result } = renderHook(() => useToast())

    act(() => { result.current.toast.info('Just so you know') })

    expect(result.current.toasts[0].variant).toBe('info')
  })

  it('toast() with variant option sets the variant', () => {
    const { result } = renderHook(() => useToast())

    act(() => { result.current.toast('Custom', { variant: 'warning' }) })

    expect(result.current.toasts[0].variant).toBe('warning')
  })

  it('toast() with description sets the description', () => {
    const { result } = renderHook(() => useToast())

    act(() => { result.current.toast('Title', { description: 'More info' }) })

    expect(result.current.toasts[0].description).toBe('More info')
  })

  it('dismiss() removes a specific toast', () => {
    const { result } = renderHook(() => useToast())
    let id: string

    act(() => { id = result.current.toast('Remove me') })

    act(() => { result.current.dismiss(id!) })

    expect(result.current.toasts).toHaveLength(0)
  })

  it('dismiss() only removes the targeted toast', () => {
    const { result } = renderHook(() => useToast())
    let id1: string

    act(() => { id1 = result.current.toast('Keep me') })

    act(() => { result.current.toast('Also keep') })

    act(() => { result.current.dismiss(id1!) })

    expect(result.current.toasts).toHaveLength(1)

    expect(result.current.toasts[0].title).toBe('Also keep')
  })

  it('dismissAll() removes all toasts', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.toast('One')

      result.current.toast('Two')

      result.current.toast('Three')
    })

    expect(result.current.toasts).toHaveLength(3)

    act(() => { result.current.dismissAll() })

    expect(result.current.toasts).toHaveLength(0)
  })

  it('each toast has a unique id', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.toast('One')

      result.current.toast('Two')
    })
    const ids = result.current.toasts.map(t => t.id)

    expect(new Set(ids).size).toBe(2)
  })

  it('toast() uses default duration of 5000', () => {
    const { result } = renderHook(() => useToast())

    act(() => { result.current.toast('Hello') })

    expect(result.current.toasts[0].duration).toBe(5000)
  })

  it('toast() respects custom duration', () => {
    const { result } = renderHook(() => useToast())

    act(() => { result.current.toast('Hello', { duration: 0 }) })

    expect(result.current.toasts[0].duration).toBe(0)
  })
})
