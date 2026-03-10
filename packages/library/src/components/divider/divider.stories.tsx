import type { Meta, StoryObj } from '@storybook/react'
import { Divider } from './divider'
import { Stack } from '../stack/stack'
import { Typography } from '../typography/typography'
import { ALL_CELESTIAL_BODIES } from '../../helpers/constants/planets'

const meta = {
  title:     'Components/Divider',
  component:  Divider,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    variant:     { control: 'select', options: ['solid', 'dashed', 'dotted'] },
    labelAlign:  { control: 'select', options: ['start', 'center', 'end'] },
    flush:       { control: 'boolean' },
    planet:      { control: 'select', options: ALL_CELESTIAL_BODIES },
    label:       { control: 'text' },
  },
} satisfies Meta<typeof Divider>

export default meta
type Story = StoryObj<typeof meta>

// ─── Default playground ───────────────────────────────────────────────────────

export const Default: Story = {
  args: { planet: 'mercury' },
  render: (args) => (
    <Stack data-void-planet={args.planet} style={{ width: '400px' }}>
      <Divider {...args} />
    </Stack>
  ),
}

// ─── All planets ──────────────────────────────────────────────────────────────

export const PlanetThemes: Story = {
  render: () => (
    <Stack direction="column" gap={8} style={{ padding: '32px', minWidth: '560px' }}>
      {ALL_CELESTIAL_BODIES.map(planet => (
        <Stack key={planet} direction="column" gap={3} data-void-planet={planet}>
          <Typography as="h6" color="secondary">{planet}</Typography>
          <Divider />
          <Divider variant="dashed" label={planet} />
          <Divider variant="dotted" label="end" labelAlign="end" />
          <Stack direction="row" align="center" gap={3} style={{ height: '20px' }}>
            <Typography size="sm" color="secondary">item</Typography>
            <Divider orientation="vertical" />
            <Typography size="sm" color="secondary">item</Typography>
            <Divider orientation="vertical" variant="dashed" />
            <Typography size="sm" color="secondary">item</Typography>
          </Stack>
        </Stack>
      ))}
    </Stack>
  ),
  parameters: { layout: 'fullscreen', backgrounds: { default: 'void' } },
}
