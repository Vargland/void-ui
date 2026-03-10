import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from './avatar'
import { Stack } from '../stack/stack'
import { Typography } from '../typography/typography'
import { ALL_CELESTIAL_BODIES } from '../../helpers/constants/planets'

const meta = {
  title:     'Components/Avatar',
  component:  Avatar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    size:   { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    shape:  { control: 'select', options: ['circle', 'square'] },
    status: { control: 'select', options: ['online', 'offline', 'busy', 'away'] },
    planet: { control: 'select', options: ALL_CELESTIAL_BODIES },
    src:      { control: 'text' },
    alt:      { control: 'text' },
    initials: { control: 'text' },
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

// ─── Default playground ───────────────────────────────────────────────────────

export const Default: Story = {
  args: { initials: 'VU', size: 'md', shape: 'circle', planet: 'mercury' },
  render: (args) => (
    <Stack data-void-planet={args.planet as string}>
      <Avatar {...args} />
    </Stack>
  ),
}

// ─── All planets ──────────────────────────────────────────────────────────────

const statuses = ['online', 'busy', 'away', 'offline'] as const

export const PlanetThemes: Story = {
  render: () => (
    <Stack direction="column" gap={6} style={{ padding: '24px' }}>
      {ALL_CELESTIAL_BODIES.map(planet => (
        <Stack key={planet} direction="row" align="center" gap={4} data-void-planet={planet}>
          <Typography
            size="xs"
            color="secondary"
            uppercase
            tracking="wide"
            style={{ width: '72px', flexShrink: 0 }}
          >
            {planet}
          </Typography>
          {/* sizes */}
          {(['xs','sm','md','lg','xl'] as const).map(size => (
            <Avatar key={size} size={size} initials={planet.slice(0,2).toUpperCase()} />
          ))}
          {/* square */}
          <Avatar size="md" shape="square" initials={planet.slice(0,2).toUpperCase()} />
          {/* statuses */}
          {statuses.map(status => (
            <Avatar key={status} size="md" initials={planet.slice(0,2).toUpperCase()} status={status} />
          ))}
        </Stack>
      ))}
    </Stack>
  ),
  parameters: { layout: 'fullscreen', backgrounds: { default: 'void' } },
}
