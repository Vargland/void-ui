import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Select } from './select'
import type { SelectOption } from '../../typings/components/select'

const OPTIONS: SelectOption[] = [
  { value: 'earth', label: 'Earth' },
  { value: 'mars', label: 'Mars', description: 'The red planet' },
  { value: 'jupiter', label: 'Jupiter', disabled: true },
  { value: 'saturn', label: 'Saturn' },
]

describe('Select', () => {
  it('renders trigger with placeholder', () => {
    render(<Select options={OPTIONS} placeholder="Pick a planet" />)
    expect(screen.getByRole('combobox')).toHaveTextContent('Pick a planet')
  })

  it('renders label when provided', () => {
    render(<Select options={OPTIONS} label="Planet" />)
    expect(screen.getByText('Planet')).toBeInTheDocument()
  })

  it('opens dropdown on click', async () => {
    const user = userEvent.setup()

    render(<Select options={OPTIONS} />)
    await user.click(screen.getByRole('combobox'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('closes dropdown when option selected', async () => {
    const user = userEvent.setup()

    render(<Select options={OPTIONS} />)
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByText('Earth'))
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('calls onChange with selected value', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()

    render(<Select options={OPTIONS} onChange={onChange} />)
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByText('Earth'))
    expect(onChange).toHaveBeenCalledWith('earth')
  })

  it('shows selected option label in trigger', async () => {
    const user = userEvent.setup()

    render(<Select options={OPTIONS} />)
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByText('Mars'))
    expect(screen.getByRole('combobox')).toHaveTextContent('Mars')
  })

  it('respects controlled value', () => {
    render(<Select options={OPTIONS} value="saturn" onChange={vi.fn()} />)
    expect(screen.getByRole('combobox')).toHaveTextContent('Saturn')
  })

  it('does not select disabled options', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()

    render(<Select options={OPTIONS} onChange={onChange} />)
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByText('Jupiter'))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('is disabled when disabled prop is true', () => {
    render(<Select options={OPTIONS} disabled />)
    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  it('shows error message', () => {
    render(<Select options={OPTIONS} error="Required field" />)
    expect(screen.getByText('Required field')).toBeInTheDocument()
  })

  it('shows description when no error', () => {
    render(<Select options={OPTIONS} description="Choose your planet" />)
    expect(screen.getByText('Choose your planet')).toBeInTheDocument()
  })

  it('error overrides description', () => {
    render(<Select options={OPTIONS} description="Help" error="Error" />)
    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.queryByText('Help')).not.toBeInTheDocument()
  })

  it('renders searchable input when searchable=true', async () => {
    const user = userEvent.setup()

    render(<Select options={OPTIONS} searchable />)
    await user.click(screen.getByRole('combobox'))
    expect(screen.getByPlaceholderText('Search…')).toBeInTheDocument()
  })

  it('filters options by search query', async () => {
    const user = userEvent.setup()

    render(<Select options={OPTIONS} searchable />)
    await user.click(screen.getByRole('combobox'))
    await user.type(screen.getByPlaceholderText('Search…'), 'mar')
    expect(screen.getByText('Mars')).toBeInTheDocument()
    expect(screen.queryByText('Earth')).not.toBeInTheDocument()
  })

  it('shows empty message when no options match', async () => {
    const user = userEvent.setup()

    render(<Select options={OPTIONS} searchable emptyMessage="Nothing here" />)
    await user.click(screen.getByRole('combobox'))
    await user.type(screen.getByPlaceholderText('Search…'), 'zzz')
    expect(screen.getByText('Nothing here')).toBeInTheDocument()
  })

  it('renders clear button when clearable and value selected', () => {
    render(<Select options={OPTIONS} value="earth" clearable onChange={vi.fn()} />)
    expect(screen.getByLabelText('Clear selection')).toBeInTheDocument()
  })

  it('clears value when clear button clicked', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()

    render(<Select options={OPTIONS} value="earth" clearable onChange={onChange} />)
    await user.click(screen.getByLabelText('Clear selection'))
    expect(onChange).toHaveBeenCalledWith('')
  })

  it('closes on Escape key', async () => {
    const user = userEvent.setup()

    render(<Select options={OPTIONS} />)
    await user.click(screen.getByRole('combobox'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('wraps in planet scope when planet prop provided', () => {
    render(<Select options={OPTIONS} planet="mars" data-testid="sel" />)
    const wrapper = screen.getByTestId('sel').closest('[data-void-planet]')

    expect(wrapper).toHaveAttribute('data-void-planet', 'mars')
  })
})
