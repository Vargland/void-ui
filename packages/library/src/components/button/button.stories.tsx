import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button'
import { Stack } from '../stack/stack'
import { Typography } from '../typography/typography'
import { ALL_CELESTIAL_BODIES } from '../../helpers/constants/planets'

const meta = {
  title:     'Components/Button',
  component:  Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'outlined', 'danger'],
      description: 'Visual style of the button',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the button',
    },
    planet: {
      control: 'select',
      options: ALL_CELESTIAL_BODIES,
      description: 'Override the planet theme for this component',
    },
    loading:   { control: 'boolean' },
    disabled:  { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    children:  { control: 'text' },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// ─── Default playground ───────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    children: 'Button',
    variant:  'primary',
    size:     'md',
    planet:   'mercury',
  },
}

// ─── All planets ──────────────────────────────────────────────────────────────

export const PlanetThemes: Story = {
  render: () => (
    <Stack direction="column" gap={4} style={{ padding: '24px' }}>
      {ALL_CELESTIAL_BODIES.map(planet => (
        <Stack
          key={planet}
          direction="row"
          align="center"
          gap={3}
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
          <Button variant="primary"   size="sm">Primary</Button>
          <Button variant="secondary" size="sm">Secondary</Button>
          <Button variant="ghost"     size="sm">Ghost</Button>
          <Button variant="outlined"  size="sm">Outlined</Button>
          <Button variant="danger"    size="sm">Danger</Button>
        </Stack>
      ))}
    </Stack>
  ),
  parameters: { layout: 'fullscreen', backgrounds: { default: 'void' } },
}

export const PlanetPropOverride: Story = {
  render: () => (
    <Stack
      direction="column"
      gap={4}
      data-void-planet="moon"
      style={{ padding: '24px', background: 'var(--void-color-background-base)' }}
    >
      <Typography size="xs" color="secondary">
        VoidProvider: moon — individual buttons override per-planet
      </Typography>
      <Stack direction="row" gap={2} wrap>
        {ALL_CELESTIAL_BODIES.map(planet => (
          <Button key={planet} variant="primary" planet={planet} size="sm">{planet}</Button>
        ))}
      </Stack>
    </Stack>
  ),
  parameters: { layout: 'padded', backgrounds: { default: 'void' } },
}
