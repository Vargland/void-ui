import type { Meta, StoryObj } from '@storybook/react'
import { Typography } from './typography'
import { Stack } from '../stack/stack'
import { ALL_CELESTIAL_BODIES } from '../../helpers/constants/planets'

const meta = {
  title:     'Components/Typography',
  component:  Typography,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    as: {
      control: 'select',
      options: ['h1','h2','h3','h4','h5','h6','p','span','label'],
      description: 'HTML element to render as',
    },
    size:     { control: 'select', options: ['xs','sm','base','md','lg','xl','2xl','3xl','4xl'] },
    color:    { control: 'select', options: ['primary','secondary','muted','disabled','inverse','accent'] },
    weight:   { control: 'select', options: ['regular','medium','semibold','bold'] },
    leading:  { control: 'select', options: ['none','tight','snug','normal','relaxed'] },
    tracking: { control: 'select', options: ['tighter','tight','normal','wide','wider','widest'] },
    planet:   { control: 'select', options: ALL_CELESTIAL_BODIES },
    truncate:  { control: 'boolean' },
    uppercase: { control: 'boolean' },
    mono:      { control: 'boolean' },
    children:  { control: 'text' },
  },
} satisfies Meta<typeof Typography>

export default meta
type Story = StoryObj<typeof meta>

// ─── Default playground ───────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    as:       'p',
    children: 'The void between stars is not empty.',
    planet:   'mercury',
  },
  render: (args) => (
    <Stack data-void-planet={args.planet as string}>
      <Typography {...args} />
    </Stack>
  ),
}

// ─── Type scale ───────────────────────────────────────────────────────────────

export const TypeScale: Story = {
  render: () => (
    <Stack direction="column" gap={3} data-void-planet="mercury">
      <Typography as="h1">H1 — Display heading</Typography>
      <Typography as="h2">H2 — Section heading</Typography>
      <Typography as="h3">H3 — Subsection</Typography>
      <Typography as="h4">H4 — Card title</Typography>
      <Typography as="h5">H5 — Label heading</Typography>
      <Typography as="h6">H6 — Caption heading</Typography>
      <hr style={{ border: 'none', borderTop: '1px solid var(--void-color-border-subtle)', margin: '4px 0' }} />
      <Typography size="base">Base — Body text. The quick brown fox jumps over the lazy dog.</Typography>
      <Typography size="sm" color="secondary">Small — Secondary body text. Used for descriptions and hints.</Typography>
      <Typography size="xs" color="muted" tracking="wide" uppercase>XS uppercase — Labels, metadata, captions</Typography>
      <Typography size="base" mono color="accent">Mono — Code snippets, technical values, IDs</Typography>
    </Stack>
  ),
  parameters: { backgrounds: { default: 'void' } },
}

// ─── All planets ──────────────────────────────────────────────────────────────

export const PlanetThemes: Story = {
  render: () => (
    <Stack direction="column" gap={6} style={{ padding: '24px', minWidth: '560px' }}>
      {ALL_CELESTIAL_BODIES.map(planet => (
        <Stack key={planet} direction="column" gap={1} data-void-planet={planet}>
          <Typography as="h4">{planet.charAt(0).toUpperCase() + planet.slice(1)}</Typography>
          <Typography color="secondary" size="sm">The surface temperature varies between extremes.</Typography>
          <Typography color="muted" size="xs" tracking="wide" uppercase>system · void-ui · {planet}</Typography>
        </Stack>
      ))}
    </Stack>
  ),
  parameters: { layout: 'fullscreen', backgrounds: { default: 'void' } },
}
