import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { Checkbox } from './checkbox'
import { Stack } from '../stack/stack'
import { Typography } from '../typography/typography'
import { ALL_CELESTIAL_BODIES } from '../../helpers/constants/planets'

const meta = {
  title:     'Components/Checkbox',
  component:  Checkbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the checkbox',
    },
    label: {
      control: 'text',
      description: 'Label displayed next to the checkbox',
    },
    description: {
      control: 'text',
      description: 'Helper text below the label',
    },
    error: {
      control: 'text',
      description: 'Error message',
    },
    indeterminate: { control: 'boolean' },
    disabled:      { control: 'boolean' },
    checked:       { control: 'boolean' },
    planet: {
      control: 'select',
      options: ALL_CELESTIAL_BODIES,
    },
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

// ─── Default playground ───────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    label: 'Accept terms and conditions',
    size:  'md',
  },
}

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <Stack direction="column" gap={4}>
      <Checkbox size="sm" label="Small" defaultChecked />
      <Checkbox size="md" label="Medium" defaultChecked />
      <Checkbox size="lg" label="Large" defaultChecked />
    </Stack>
  ),
}

// ─── States ───────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <Stack direction="column" gap={4}>
      <Checkbox label="Unchecked" />
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="Indeterminate" indeterminate />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Disabled checked" disabled defaultChecked />
    </Stack>
  ),
}

// ─── With description ─────────────────────────────────────────────────────────

export const WithDescription: Story = {
  args: {
    label:       'Send me updates',
    description: 'We will only send relevant product news, no spam.',
    size:        'md',
  },
}

// ─── Error state ──────────────────────────────────────────────────────────────

export const WithError: Story = {
  args: {
    label: 'I agree to the terms',
    error: 'You must accept the terms to continue.',
    size:  'md',
  },
}

// ─── Controlled ───────────────────────────────────────────────────────────────

export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(false)

    return (
      <Stack direction="column" gap={3} align="start">
        <Checkbox
          label={`Controlled — ${checked ? 'checked' : 'unchecked'}`}
          checked={checked}
          onChange={event => setChecked(event.target.checked)}
        />
        <Typography size="xs" color="muted">
          State: {checked ? 'true' : 'false'}
        </Typography>
      </Stack>
    )
  },
}

// ─── Planet themes ────────────────────────────────────────────────────────────

export const PlanetThemes: Story = {
  render: () => (
    <Stack direction="column" gap={4} style={{ padding: '24px' }}>
      {ALL_CELESTIAL_BODIES.map(planet => (
        <Stack
          key={planet}
          direction="row"
          align="center"
          gap={4}
          data-void-planet={planet}
          style={{
            padding:      '16px 20px',
            background:   'var(--void-color-background-surface)',
            borderRadius: 'var(--void-radius-md)',
            border:       '1px solid var(--void-color-border-default)',
          }}
        >
          <Typography
            size="xs"
            color="secondary"
            uppercase
            tracking="wide"
            style={{ width: '72px', flexShrink: 0 }}
          >
            {planet}
          </Typography>
          <Checkbox size="sm" label="Unchecked" />
          <Checkbox size="sm" label="Checked" defaultChecked />
          <Checkbox size="sm" indeterminate label="Indeterminate" />
        </Stack>
      ))}
    </Stack>
  ),
  parameters: { layout: 'fullscreen', backgrounds: { default: 'void' } },
}
