import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from './modal'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderModal(props: Partial<Parameters<typeof Modal>[0]> = {}) {
  const defaults = {
    isOpen:  true,
    onClose: vi.fn(),
    title:   'Test Modal',
    ...props,
  }
  return render(<Modal {...defaults} />)
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Modal', () => {

  // ─── Visibility ────────────────────────────────────────────────────────────

  it('renders the dialog when isOpen is true', () => {
    renderModal({ isOpen: true })
    expect(screen.getByTestId('modal')).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    renderModal({ isOpen: false })
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
  })

  it('renders the overlay when open', () => {
    renderModal({ isOpen: true })
    expect(screen.getByTestId('modal-overlay')).toBeInTheDocument()
  })

  // ─── Content ───────────────────────────────────────────────────────────────

  it('renders the title', () => {
    renderModal({ title: 'My Dialog Title' })
    expect(screen.getByText('My Dialog Title')).toBeInTheDocument()
  })

  it('renders children in the body', () => {
    renderModal({ children: <p>Body content here</p> })
    expect(screen.getByText('Body content here')).toBeInTheDocument()
  })

  it('renders footer when provided', () => {
    renderModal({ footer: <button>Confirm</button> })
    expect(screen.getByText('Confirm')).toBeInTheDocument()
    expect(screen.getByTestId('modal-footer')).toBeInTheDocument()
  })

  it('does not render footer when not provided', () => {
    renderModal({ footer: undefined })
    expect(screen.queryByTestId('modal-footer')).not.toBeInTheDocument()
  })

  // ─── Aria attributes ───────────────────────────────────────────────────────

  it('has role="dialog"', () => {
    renderModal()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('has aria-modal="true"', () => {
    renderModal()
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  it('links aria-labelledby to the title element', () => {
    renderModal({ title: 'Labelled Modal' })
    const dialog = screen.getByRole('dialog')
    const labelledById = dialog.getAttribute('aria-labelledby')
    expect(labelledById).toBeTruthy()
    const titleEl = document.getElementById(labelledById!)
    expect(titleEl).toHaveTextContent('Labelled Modal')
  })

  it('links aria-describedby to the description span', () => {
    renderModal({ description: 'This is the description' })
    const dialog = screen.getByRole('dialog')
    const describedById = dialog.getAttribute('aria-describedby')
    expect(describedById).toBeTruthy()
    const descEl = document.getElementById(describedById!)
    expect(descEl).toHaveTextContent('This is the description')
  })

  it('does not set aria-labelledby when title is not provided', () => {
    renderModal({ title: undefined })
    expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-labelledby')
  })

  it('does not set aria-describedby when description is not provided', () => {
    renderModal({ description: undefined })
    expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-describedby')
  })

  // ─── Close on overlay click ────────────────────────────────────────────────

  it('calls onClose when overlay is clicked and closeOnOverlayClick is true', async () => {
    const user     = userEvent.setup()
    const onClose  = vi.fn()
    renderModal({ onClose, closeOnOverlayClick: true })
    await user.click(screen.getByTestId('modal-overlay'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose when overlay is clicked and closeOnOverlayClick is false', async () => {
    const user    = userEvent.setup()
    const onClose = vi.fn()
    renderModal({ onClose, closeOnOverlayClick: false })
    await user.click(screen.getByTestId('modal-overlay'))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('does not call onClose when the dialog itself is clicked', async () => {
    const user    = userEvent.setup()
    const onClose = vi.fn()
    renderModal({ onClose, closeOnOverlayClick: true })
    await user.click(screen.getByRole('dialog'))
    expect(onClose).not.toHaveBeenCalled()
  })

  // ─── Close on Escape ───────────────────────────────────────────────────────

  it('calls onClose when Escape is pressed and closeOnEscape is true', async () => {
    const user    = userEvent.setup()
    const onClose = vi.fn()
    renderModal({ onClose, closeOnEscape: true })
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose when Escape is pressed and closeOnEscape is false', async () => {
    const user    = userEvent.setup()
    const onClose = vi.fn()
    renderModal({ onClose, closeOnEscape: false })
    await user.keyboard('{Escape}')
    expect(onClose).not.toHaveBeenCalled()
  })

  // ─── Close button ──────────────────────────────────────────────────────────

  it('calls onClose when the close button is clicked', async () => {
    const user    = userEvent.setup()
    const onClose = vi.fn()
    renderModal({ onClose, title: 'Dialog' })
    await user.click(screen.getByTestId('modal-close'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('renders the close button with aria-label', () => {
    renderModal({ title: 'Dialog' })
    expect(screen.getByLabelText('Close dialog')).toBeInTheDocument()
  })

  // ─── Body scroll lock ──────────────────────────────────────────────────────

  it('locks body overflow when open', () => {
    renderModal({ isOpen: true })
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('restores body overflow when unmounted', () => {
    document.body.style.overflow = 'auto'
    const { unmount } = renderModal({ isOpen: true })
    unmount()
    expect(document.body.style.overflow).toBe('auto')
  })

  // ─── Sizes ─────────────────────────────────────────────────────────────────

  it.each(['sm', 'md', 'lg', 'full'] as const)(
    'renders size "%s" without crashing',
    (size) => {
      renderModal({ size })
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    },
  )

  it('applies size class to the dialog', () => {
    renderModal({ size: 'lg' })
    expect(screen.getByTestId('modal').className).toMatch(/size-lg/)
  })

  // ─── Default testid ────────────────────────────────────────────────────────

  it('uses default data-testid="modal"', () => {
    renderModal()
    expect(screen.getByTestId('modal')).toBeInTheDocument()
  })

  it('uses custom data-testid', () => {
    renderModal({ 'data-testid': 'confirm-dialog' })
    expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument()
  })

  // ─── Planet prop ───────────────────────────────────────────────────────────

  it('wraps content in planet scope when planet prop is provided', () => {
    renderModal({ planet: 'saturn' })
    expect(
      screen.getByTestId('modal').closest('[data-void-planet="saturn"]'),
    ).toBeInTheDocument()
  })

  it('does not add planet wrapper when planet prop is omitted', () => {
    renderModal({ planet: undefined })
    expect(document.querySelector('[data-void-planet]')).toBeNull()
  })

  // ─── Custom className ──────────────────────────────────────────────────────

  it('applies a custom className to the dialog', () => {
    renderModal({ className: 'my-modal' })
    expect(screen.getByTestId('modal').className).toMatch(/my-modal/)
  })

  // ─── Focus restoration ─────────────────────────────────────────────────────

  it('renders a close button that is focusable', () => {
    renderModal({ title: 'Focusable' })
    const closeBtn = screen.getByTestId('modal-close')
    expect(closeBtn).toBeInTheDocument()
    expect(closeBtn.tagName).toBe('BUTTON')
  })

  // ─── No title → no header ──────────────────────────────────────────────────

  it('does not render header section when title is not provided', () => {
    renderModal({ title: undefined })
    expect(screen.queryByTestId('modal-close')).not.toBeInTheDocument()
  })

  // ─── Body ──────────────────────────────────────────────────────────────────

  it('renders modal body with testid', () => {
    renderModal({ children: <span>Content</span> })
    expect(screen.getByTestId('modal-body')).toBeInTheDocument()
  })
})
