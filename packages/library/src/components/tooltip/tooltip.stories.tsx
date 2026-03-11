import type { Meta, StoryObj } from '@storybook/react'
import { Tooltip } from './tooltip'
import { Button } from '../button/button'
import { Stack } from '../stack/stack'
import { Typography } from '../typography/typography'
import { Badge } from '../badge/badge'
import { ALL_CELESTIAL_BODIES } from '../../helpers/constants/planets'

const meta = {
  title:     'Components/Tooltip',
  component:  Tooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Side of the trigger to display the tooltip',
    },
    delay: {
      control: { type: 'number', min: 0, max: 1000, step: 50 },
      description: 'Show delay in milliseconds',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the tooltip entirely',
    },
    maxWidth: {
      control: { type: 'number', min: 80, max: 600, step: 10 },
      description: 'Maximum width of the tooltip in px',
    },
    planet: {
      control: 'select',
      options: ALL_CELESTIAL_BODIES,
      description: 'Override the planet theme for this component',
    },
    content: { control: 'text' },
  },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

// ─── Default playground ───────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    content:   'This is a tooltip',
    placement: 'top',
    delay:     300,
    planet:    'mercury',
  },
  render: (args) => (
    <Stack
      data-void-planet={args.planet as string}
      style={{ padding: '64px' }}
    >
      <Tooltip {...args}>
        <Button variant="secondary" size="md">Hover me</Button>
      </Tooltip>
    </Stack>
  ),
}

// ─── All placements ───────────────────────────────────────────────────────────

export const Placements: Story = {
  render: () => (
    <Stack direction="column" gap={4} style={{ padding: '80px' }}>
      <Stack direction="row" gap={6} align="center" justify="center">
        <Tooltip content="Tooltip on top" placement="top">
          <Button variant="secondary" size="sm">Top</Button>
        </Tooltip>

        <Tooltip content="Tooltip on bottom" placement="bottom">
          <Button variant="secondary" size="sm">Bottom</Button>
        </Tooltip>

        <Tooltip content="Tooltip on left" placement="left">
          <Button variant="secondary" size="sm">Left</Button>
        </Tooltip>

        <Tooltip content="Tooltip on right" placement="right">
          <Button variant="secondary" size="sm">Right</Button>
        </Tooltip>
      </Stack>
    </Stack>
  ),
  parameters: { layout: 'padded' },
}

// ─── With delay ───────────────────────────────────────────────────────────────

export const WithDelay: Story = {
  render: () => (
    <Stack direction="row" gap={4} align="center" style={{ padding: '64px' }}>
      <Tooltip content="No delay (0 ms)" placement="top" delay={0}>
        <Button variant="secondary" size="sm">No delay</Button>
      </Tooltip>

      <Tooltip content="Short delay (150 ms)" placement="top" delay={150}>
        <Button variant="secondary" size="sm">150 ms</Button>
      </Tooltip>

      <Tooltip content="Default delay (300 ms)" placement="top" delay={300}>
        <Button variant="secondary" size="sm">300 ms</Button>
      </Tooltip>

      <Tooltip content="Long delay (800 ms)" placement="top" delay={800}>
        <Button variant="secondary" size="sm">800 ms</Button>
      </Tooltip>
    </Stack>
  ),
  parameters: { layout: 'padded' },
}

// ─── Disabled ─────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  render: () => (
    <Stack direction="row" gap={4} align="center" style={{ padding: '64px' }}>
      <Tooltip content="I am enabled" placement="top">
        <Button variant="secondary" size="sm">Enabled tooltip</Button>
      </Tooltip>

      <Tooltip content="You cannot see this" placement="top" disabled>
        <Button variant="secondary" size="sm" disabled>Disabled tooltip</Button>
      </Tooltip>
    </Stack>
  ),
  parameters: { layout: 'padded' },
}

// ─── With rich content ────────────────────────────────────────────────────────

export const WithRichContent: Story = {
  render: () => (
    <Stack direction="row" gap={4} align="center" style={{ padding: '64px' }}>
      <Tooltip
        placement="bottom"
        maxWidth={240}
        delay={0}
        content={
          <Stack direction="column" gap={1}>
            <Typography size="xs" style={{ fontWeight: 600, color: 'inherit' }}>
              Keyboard shortcut
            </Typography>
            <Typography size="xs" style={{ opacity: 0.8, color: 'inherit' }}>
              Press <kbd style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '3px', padding: '0 4px' }}>Ctrl+K</kbd> to open search
            </Typography>
          </Stack>
        }
      >
        <Button variant="secondary" size="md">Rich content</Button>
      </Tooltip>

      <Tooltip
        placement="top"
        maxWidth={180}
        delay={0}
        content={
          <Stack direction="row" gap={1} align="center">
            <Badge tone="success" size="sm">Live</Badge>
            <Typography size="xs" style={{ color: 'inherit' }}>Service is operational</Typography>
          </Stack>
        }
      >
        <Button variant="secondary" size="md">Status badge</Button>
      </Tooltip>
    </Stack>
  ),
  parameters: { layout: 'padded' },
}

// ─── On buttons ───────────────────────────────────────────────────────────────

export const OnButtons: Story = {
  render: () => (
    <Stack direction="row" gap={3} align="center" style={{ padding: '64px' }}>
      <Tooltip content="Create a new item" placement="top" delay={0}>
        <Button variant="primary" size="md">New</Button>
      </Tooltip>

      <Tooltip content="Edit the selected item" placement="top" delay={0}>
        <Button variant="secondary" size="md">Edit</Button>
      </Tooltip>

      <Tooltip content="This action is irreversible" placement="top" delay={0}>
        <Button variant="danger" size="md">Delete</Button>
      </Tooltip>

      <Tooltip content="Cannot perform this action" placement="top" delay={0} disabled>
        <Button variant="ghost" size="md" disabled>Disabled</Button>
      </Tooltip>
    </Stack>
  ),
  parameters: { layout: 'padded' },
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

          <Tooltip content="Top tooltip" placement="top" delay={0}>
            <Button variant="secondary" size="sm">Top</Button>
          </Tooltip>

          <Tooltip content="Bottom tooltip" placement="bottom" delay={0}>
            <Button variant="secondary" size="sm">Bottom</Button>
          </Tooltip>

          <Tooltip content="Right tooltip" placement="right" delay={0}>
            <Button variant="secondary" size="sm">Right</Button>
          </Tooltip>
        </Stack>
      ))}
    </Stack>
  ),
  parameters: { layout: 'fullscreen', backgrounds: { default: 'void' } },
}
