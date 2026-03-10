import type { Meta, StoryObj } from '@storybook/react'
import { Spinner } from './spinner'
import { Stack } from '../stack/stack'
import { Typography } from '../typography/typography'
import { ALL_CELESTIAL_BODIES } from '../../helpers/constants/planets'

const meta = {
  title:     'Components/Spinner',
  component:  Spinner,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    variant: { control: 'select', options: ['ring', 'dots', 'pulse'] },
    size:    { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    label:   { control: 'text' },
    planet:  { control: 'select', options: ALL_CELESTIAL_BODIES },
  },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

// ─── Default playground ───────────────────────────────────────────────────────

export const Default: Story = {
  args: { variant: 'ring', size: 'md', planet: 'mercury' },
  render: (args) => (
    <Stack data-void-planet={args.planet as string} align="center">
      <Spinner {...args} />
    </Stack>
  ),
}

// ─── Planet themes ────────────────────────────────────────────────────────────

export const PlanetThemes: Story = {
  render: () => (
    <Stack direction="column" gap={6} style={{ padding: '24px' }}>
      {ALL_CELESTIAL_BODIES.map(planet => (
        <Stack key={planet} direction="row" align="center" gap={6} data-void-planet={planet}>
          <Typography
            size="xs"
            color="secondary"
            uppercase
            tracking="wide"
            style={{ width: '72px', flexShrink: 0 }}
          >
            {planet}
          </Typography>

          {/* all variants */}
          <Spinner variant="ring"  size="md" />
          <Spinner variant="dots"  size="md" />
          <Spinner variant="pulse" size="md" />

          {/* size scale (ring) */}
          <Stack direction="row" align="center" gap={3}>
            {(['xs','sm','md','lg','xl'] as const).map(size => (
              <Spinner key={size} variant="ring" size={size} />
            ))}
          </Stack>
        </Stack>
      ))}
    </Stack>
  ),
  parameters: { layout: 'fullscreen', backgrounds: { default: 'void' } },
}
