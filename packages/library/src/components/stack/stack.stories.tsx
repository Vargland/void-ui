import type { Meta, StoryObj } from '@storybook/react'
import { Stack } from './stack'
import { Button } from '../button/button'
import { Badge } from '../badge/badge'
import { Avatar } from '../avatar/avatar'
import { Divider } from '../divider/divider'
import { Typography } from '../typography/typography'
import { ALL_CELESTIAL_BODIES } from '../../helpers/constants/planets'

const meta = {
  title:     'Layout/Stack',
  component:  Stack,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    direction: { control: 'select', options: ['row', 'column', 'row-reverse', 'column-reverse'] },
    gap:       { control: 'select', options: [0,1,2,3,4,5,6,8,10,12,16,20,24] },
    align:     { control: 'select', options: ['normal','start','end','center','baseline','stretch'] },
    justify:   { control: 'select', options: ['normal','start','end','center','space-between','space-around','space-evenly','stretch'] },
    wrap:      { control: 'boolean' },
    full:      { control: 'boolean' },
    planet:    { control: 'select', options: ALL_CELESTIAL_BODIES },
  },
} satisfies Meta<typeof Stack>

export default meta
type Story = StoryObj<typeof meta>

// ─── Default playground ───────────────────────────────────────────────────────

export const Default: Story = {
  args: { direction: 'row', gap: 3, align: 'center', planet: 'mercury' },
  render: (args) => (
    <Stack data-void-planet={args.planet as string}>
      <Stack {...args}>
        <Button variant="primary"   size="sm">Action</Button>
        <Button variant="secondary" size="sm">Cancel</Button>
        <Button variant="ghost"     size="sm">More</Button>
      </Stack>
    </Stack>
  ),
}

// ─── Compositions ─────────────────────────────────────────────────────────────

export const PlanetThemes: Story = {
  render: () => (
    <Stack direction="column" gap={6} style={{ padding: '24px' }}>
      {ALL_CELESTIAL_BODIES.map(planet => (
        <Stack key={planet} direction="column" gap={0} data-void-planet={planet}>
          {/* Card-like row */}
          <Stack direction="row" align="center" justify="space-between" gap={4}>
            <Stack direction="row" align="center" gap={3}>
              <Avatar initials={planet.slice(0,2).toUpperCase()} size="sm" status="online" />
              <Stack direction="column" gap={1}>
                <Typography as="h6">{planet.charAt(0).toUpperCase() + planet.slice(1)}</Typography>
                <Typography size="xs" color="muted">system · void-ui</Typography>
              </Stack>
            </Stack>
            <Stack direction="row" align="center" gap={2}>
              <Badge tone="info" variant="subtle" size="sm">{planet}</Badge>
              <Button variant="outlined" size="sm">View</Button>
            </Stack>
          </Stack>
          <Divider />
        </Stack>
      ))}
    </Stack>
  ),
  parameters: { layout: 'fullscreen', backgrounds: { default: 'void' } },
}
