import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function BasicTabs({
  defaultValue = 'tab1',
  value,
  onChange,
  variant,
  size,
  planet,
}: {
  defaultValue?: string
  value?: string
  onChange?: (v: string) => void
  variant?: 'line' | 'solid'
  size?: 'sm' | 'md' | 'lg'
  planet?: string
}) {
  return (
    <Tabs
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
      variant={variant}
      size={size}
      planet={planet as never}
    >
      <TabsList aria-label="Demo tabs">
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3" disabled>Tab 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Content 1</TabsContent>
      <TabsContent value="tab2">Content 2</TabsContent>
      <TabsContent value="tab3">Content 3</TabsContent>
    </Tabs>
  )
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Tabs', () => {

  // ─── Rendering ─────────────────────────────────────────────────────────────

  it('renders without crashing', () => {
    render(<BasicTabs />)

    expect(screen.getByTestId('tabs')).toBeInTheDocument()
  })

  it('renders the tablist', () => {
    render(<BasicTabs />)

    expect(screen.getByRole('tablist')).toBeInTheDocument()
  })

  it('renders all tab triggers', () => {
    render(<BasicTabs />)
    const tabs = screen.getAllByRole('tab')

    expect(tabs).toHaveLength(3)
  })

  it('renders all tab panels', () => {
    render(<BasicTabs />)
    const panels = screen.getAllByRole('tabpanel', { hidden: true })

    expect(panels).toHaveLength(3)
  })

  // ─── Default active tab ────────────────────────────────────────────────────

  it('activates the defaultValue tab on mount', () => {
    render(<BasicTabs defaultValue="tab1" />)

    expect(screen.getByText('Content 1')).not.toHaveAttribute('hidden')

    expect(screen.getByText('Content 2')).toHaveAttribute('hidden')
  })

  it('activates a different defaultValue tab', () => {
    render(<BasicTabs defaultValue="tab2" />)

    expect(screen.getByText('Content 2')).not.toHaveAttribute('hidden')

    expect(screen.getByText('Content 1')).toHaveAttribute('hidden')
  })

  // ─── Click to switch tab ───────────────────────────────────────────────────

  it('switches active tab on trigger click', async () => {
    const user = userEvent.setup()

    render(<BasicTabs />)

    await user.click(screen.getByRole('tab', { name: 'Tab 2' }))

    expect(screen.getByText('Content 2')).not.toHaveAttribute('hidden')

    expect(screen.getByText('Content 1')).toHaveAttribute('hidden')
  })

  it('sets aria-selected=true on the active trigger', async () => {
    const user = userEvent.setup()

    render(<BasicTabs />)

    await user.click(screen.getByRole('tab', { name: 'Tab 2' }))

    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-selected', 'true')

    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'false')
  })

  // ─── Controlled mode ──────────────────────────────────────────────────────

  it('respects controlled value', () => {
    render(<BasicTabs value="tab2" onChange={vi.fn()} />)

    expect(screen.getByText('Content 2')).not.toHaveAttribute('hidden')

    expect(screen.getByText('Content 1')).toHaveAttribute('hidden')
  })

  it('calls onChange with the new value when a trigger is clicked (controlled)', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()

    render(<BasicTabs value="tab1" onChange={onChange} />)

    await user.click(screen.getByRole('tab', { name: 'Tab 2' }))

    expect(onChange).toHaveBeenCalledWith('tab2')

    expect(onChange).toHaveBeenCalledTimes(1)
  })

  // ─── Disabled tab ─────────────────────────────────────────────────────────

  it('does not switch to a disabled tab on click', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()

    render(<BasicTabs onChange={onChange} />)

    await user.click(screen.getByRole('tab', { name: 'Tab 3' }))

    expect(onChange).not.toHaveBeenCalled()

    expect(screen.getByText('Content 1')).not.toHaveAttribute('hidden')
  })

  it('renders a disabled trigger with disabled attribute', () => {
    render(<BasicTabs />)

    expect(screen.getByRole('tab', { name: 'Tab 3' })).toBeDisabled()
  })

  // ─── Keyboard navigation ──────────────────────────────────────────────────

  it('moves focus to the next tab with ArrowRight', async () => {
    const user = userEvent.setup()

    render(<BasicTabs />)

    screen.getByRole('tab', { name: 'Tab 1' }).focus()

    await user.keyboard('{ArrowRight}')

    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveFocus()
  })

  it('moves focus to the previous tab with ArrowLeft', async () => {
    const user = userEvent.setup()

    render(<BasicTabs />)

    screen.getByRole('tab', { name: 'Tab 2' }).focus()

    await user.keyboard('{ArrowLeft}')

    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveFocus()
  })

  it('moves focus to the first tab with Home', async () => {
    const user = userEvent.setup()

    render(<BasicTabs />)

    screen.getByRole('tab', { name: 'Tab 2' }).focus()

    await user.keyboard('{Home}')

    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveFocus()
  })

  it('moves focus to the last enabled tab with End', async () => {
    const user = userEvent.setup()

    render(<BasicTabs />)

    screen.getByRole('tab', { name: 'Tab 1' }).focus()

    await user.keyboard('{End}')

    // Tab 3 is disabled so it is excluded from keyboard navigation
    // the last reachable trigger in the DOM is Tab 2 (enabled), Tab 3 is disabled
    // ArrowRight / End skips disabled, so expect Tab 2
    // Actually our implementation finds triggers via :not([disabled]) so Tab 3 is excluded
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveFocus()
  })

  it('wraps focus from last to first tab with ArrowRight', async () => {
    const user = userEvent.setup()

    render(<BasicTabs />)

    screen.getByRole('tab', { name: 'Tab 2' }).focus()

    await user.keyboard('{ArrowRight}')

    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveFocus()
  })

  // ─── ARIA attributes ──────────────────────────────────────────────────────

  it('links triggers to panels via aria-controls / aria-labelledby', () => {
    render(<BasicTabs />)
    const trigger = screen.getByRole('tab', { name: 'Tab 1' })
    const panel = screen.getByText('Content 1').closest('[role="tabpanel"]')

    expect(trigger).toHaveAttribute('aria-controls', panel?.id)

    expect(panel).toHaveAttribute('aria-labelledby', trigger.id)
  })

  it('sets tablist aria-label', () => {
    render(<BasicTabs />)

    expect(screen.getByRole('tablist')).toHaveAttribute('aria-label', 'Demo tabs')
  })

  // ─── Variant prop ─────────────────────────────────────────────────────────

  it('renders line variant without crashing', () => {
    render(<BasicTabs variant="line" />)

    expect(screen.getByTestId('tabs')).toBeInTheDocument()
  })

  it('renders solid variant without crashing', () => {
    render(<BasicTabs variant="solid" />)

    expect(screen.getByTestId('tabs')).toBeInTheDocument()
  })

  // ─── Size prop ────────────────────────────────────────────────────────────

  it.each(['sm', 'md', 'lg'] as const)(
    'renders size "%s" without crashing',
    (size) => {
      render(<BasicTabs size={size} />)

      expect(screen.getByTestId('tabs')).toBeInTheDocument()
    },
  )

  // ─── Planet prop ──────────────────────────────────────────────────────────

  it('wraps in planet scope when planet prop provided', () => {
    render(<BasicTabs planet="mars" />)
    const wrapper = screen.getByTestId('tabs').closest('[data-void-planet]')

    expect(wrapper).toHaveAttribute('data-void-planet', 'mars')
  })

  // ─── Content visibility ───────────────────────────────────────────────────

  it('keeps inactive panel in the DOM but hidden', () => {
    render(<BasicTabs defaultValue="tab1" />)
    const panel2 = screen.getByText('Content 2').closest('[role="tabpanel"]')

    expect(panel2).toBeInTheDocument()

    expect(panel2).toHaveAttribute('hidden')
  })

  it('custom data-testid is forwarded to root', () => {
    render(
      <Tabs defaultValue="a" data-testid="my-tabs">
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
        </TabsList>
        <TabsContent value="a">A content</TabsContent>
      </Tabs>,
    )

    expect(screen.getByTestId('my-tabs')).toBeInTheDocument()
  })
})
