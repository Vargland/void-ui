import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './badge'
import { Stack } from '../stack/stack'
import { Typography } from '../typography/typography'
import { ALL_CELESTIAL_BODIES } from '../../helpers/constants/planets'

const meta = {
  title:     'Components/Badge',
  component:  Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'subtle', 'outlined'],
      description: 'Visual style of the badge',
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'Size of the badge',
    },
    tone: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'info'],
      description: 'Semantic color tone',
    },
    planet: {
      control: 'select',
      options: ALL_CELESTIAL_BODIES,
      description: 'Override the planet theme for this component',
    },
    dot:      { control: 'boolean' },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

// ─── Default playground ───────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    children: 'Badge',
    variant:  'solid',
    size:     'md',
    tone:     'default',
    planet:   'mercury',
  },
}

// ─── All planets ──────────────────────────────────────────────────────────────

const tones = ['default', 'success', 'warning', 'error', 'info'] as const

export const PlanetThemes: Story = {
  render: () => (
    <Stack direction="column" gap={3} style={{ padding: '24px' }}>
      {ALL_CELESTIAL_BODIES.map(planet => (
        <Stack
          key={planet}
          direction="row"
          align="center"
          gap={2}
          data-void-planet={planet}
          style={{
            padding:      '12px 20px',
            background:   'var(--void-color-background-surface)',
            borderRadius: 'var(--void-radius-md)',
            border:       '1px solid var(--void-color-border-default)',
            flexWrap:     'nowrap',
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
          {tones.map(tone => (
            <Badge key={tone} tone={tone} variant="solid" size="sm">{tone}</Badge>
          ))}
          <Badge variant="subtle"   tone="info" size="sm">subtle</Badge>
          <Badge variant="outlined" tone="info" size="sm">outlined</Badge>
          <Badge dot tone="success" size="sm" />
          <Badge dot tone="warning" size="sm" />
          <Badge dot tone="error"   size="sm" />
        </Stack>
      ))}
    </Stack>
  ),
  parameters: { layout: 'fullscreen', backgrounds: { default: 'void' } },
}
