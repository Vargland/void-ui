import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Select } from './select'
import type { SelectOption } from '../../typings/components/select'

const PLANETS: SelectOption[] = [
  { value: 'earth', label: 'Earth', description: 'Our home planet' },
  { value: 'mars', label: 'Mars', description: 'The red planet' },
  { value: 'jupiter', label: 'Jupiter', description: 'The largest planet' },
  { value: 'saturn', label: 'Saturn', description: 'The ringed planet' },
  { value: 'neptune', label: 'Neptune', description: 'The ice giant' },
  { value: 'pluto', label: 'Pluto', description: 'Dwarf planet', disabled: true },
]

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  args: {
    options: PLANETS,
    placeholder: 'Select a planet',
    size: 'md',
  },
}

export default meta
type Story = StoryObj<typeof Select>

export const Default: Story = {}

export const WithLabel: Story = {
  args: { label: 'Planet' },
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 320 }}>
      <Select options={PLANETS} placeholder="Small" size="sm" label="Small" />
      <Select options={PLANETS} placeholder="Medium" size="md" label="Medium" />
      <Select options={PLANETS} placeholder="Large" size="lg" label="Large" />
    </div>
  ),
}

export const Searchable: Story = {
  args: { searchable: true, label: 'Search planets' },
}

export const Clearable: Story = {
  args: { defaultValue: 'earth', clearable: true, label: 'Clearable' },
}

export const WithDescription: Story = {
  args: {
    label: 'Home planet',
    description: 'Select the planet where you were born',
  },
}

export const WithError: Story = {
  args: {
    label: 'Planet',
    error: 'Please select a valid planet',
  },
}

export const Disabled: Story = {
  args: { label: 'Planet', disabled: true, defaultValue: 'earth' },
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('earth')

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
        <Select
          options={PLANETS}
          value={value}
          onChange={setValue}
          label="Controlled select"
        />
        <p style={{ margin: 0, fontSize: 14 }}>
          Selected: <strong>{value || '—'}</strong>
        </p>
      </div>
    )
  },
}

export const PlanetThemes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
      {(['earth', 'mars', 'neptune', 'saturn'] as const).map(p => (
        <Select
          key={p}
          options={PLANETS}
          planet={p}
          label={p.charAt(0).toUpperCase() + p.slice(1)}
          style={{ width: 200 }}
        />
      ))}
    </div>
  ),
}
