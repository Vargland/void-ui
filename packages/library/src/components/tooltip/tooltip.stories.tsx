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
        <Button size="md" variant="secondary">Hover me</Button>
      </Tooltip>
    </Stack>
  ),
}

// ─── All placements ───────────────────────────────────────────────────────────

export const Placements: Story = {
  render: () => (
    <Stack direction="column" gap={4} style={{ padding: '80px' }}>
      <Stack align="center" direction="row" gap={6} justify="center">
        <Tooltip content="Tooltip on top" placement="top">
          <Button size="sm" variant="secondary">Top</Button>
        </Tooltip>

        <Tooltip content="Tooltip on bottom" placement="bottom">
          <Button size="sm" variant="secondary">Bottom</Button>
        </Tooltip>

        <Tooltip content="Tooltip on left" placement="left">
          <Button size="sm" variant="secondary">Left</Button>
        </Tooltip>

        <Tooltip content="Tooltip on right" placement="right">
          <Button size="sm" variant="secondary">Right</Button>
        </Tooltip>
      </Stack>
    </Stack>
  ),
  parameters: { layout: 'padded' },
}

// ─── With delay ───────────────────────────────────────────────────────────────

export const WithDelay: Story = {
  render: () => (
    <Stack align="center" direction="row" gap={4} style={{ padding: '64px' }}>
      <Tooltip content="No delay (0 ms)" delay={0} placement="top">
        <Button size="sm" variant="secondary">No delay</Button>
      </Tooltip>

      <Tooltip content="Short delay (150 ms)" delay={150} placement="top">
        <Button size="sm" variant="secondary">150 ms</Button>
      </Tooltip>

      <Tooltip content="Default delay (300 ms)" delay={300} placement="top">
        <Button size="sm" variant="secondary">300 ms</Button>
      </Tooltip>

      <Tooltip content="Long delay (800 ms)" delay={800} placement="top">
        <Button size="sm" variant="secondary">800 ms</Button>
      </Tooltip>
    </Stack>
  ),
  parameters: { layout: 'padded' },
}

// ─── Disabled ─────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  render: () => (
    <Stack align="center" direction="row" gap={4} style={{ padding: '64px' }}>
      <Tooltip content="I am enabled" placement="top">
        <Button size="sm" variant="secondary">Enabled tooltip</Button>
      </Tooltip>

      <Tooltip content="You cannot see this" disabled placement="top">
        <Button disabled size="sm" variant="secondary">Disabled tooltip</Button>
      </Tooltip>
    </Stack>
  ),
  parameters: { layout: 'padded' },
}

// ─── With rich content ────────────────────────────────────────────────────────

export const WithRichContent: Story = {
  render: () => (
    <Stack align="center" direction="row" gap={4} style={{ padding: '64px' }}>
      <Tooltip
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
        delay={0}
        maxWidth={240}
        placement="bottom"
      >
        <Button size="md" variant="secondary">Rich content</Button>
      </Tooltip>

      <Tooltip
        content={
          <Stack align="center" direction="row" gap={1}>
            <Badge size="sm" tone="success">Live</Badge>
            <Typography size="xs" style={{ color: 'inherit' }}>Service is operational</Typography>
          </Stack>
        }
        delay={0}
        maxWidth={180}
        placement="top"
      >
        <Button size="md" variant="secondary">Status badge</Button>
      </Tooltip>
    </Stack>
  ),
  parameters: { layout: 'padded' },
}

// ─── On buttons ───────────────────────────────────────────────────────────────

export const OnButtons: Story = {
  render: () => (
    <Stack align="center" direction="row" gap={3} style={{ padding: '64px' }}>
      <Tooltip content="Create a new item" delay={0} placement="top">
        <Button size="md" variant="primary">New</Button>
      </Tooltip>

      <Tooltip content="Edit the selected item" delay={0} placement="top">
        <Button size="md" variant="secondary">Edit</Button>
      </Tooltip>

      <Tooltip content="This action is irreversible" delay={0} placement="top">
        <Button size="md" variant="danger">Delete</Button>
      </Tooltip>

      <Tooltip content="Cannot perform this action" delay={0} disabled placement="top">
        <Button disabled size="md" variant="ghost">Disabled</Button>
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
          align="center"
          data-void-planet={planet}
          direction="row"
          gap={3}
          style={{
            padding:      '16px 20px',
            background:   'var(--void-color-background-surface)',
            borderRadius: 'var(--void-radius-md)',
            border:       '1px solid var(--void-color-border-default)',
          }}
        >
          <Typography
            color="secondary"
            size="xs"
            style={{ width: '72px', flexShrink: 0 }}
            tracking="wide"
            uppercase
          >
            {planet}
          </Typography>

          <Tooltip content="Top tooltip" delay={0} placement="top">
            <Button size="sm" variant="secondary">Top</Button>
          </Tooltip>

          <Tooltip content="Bottom tooltip" delay={0} placement="bottom">
            <Button size="sm" variant="secondary">Bottom</Button>
          </Tooltip>

          <Tooltip content="Right tooltip" delay={0} placement="right">
            <Button size="sm" variant="secondary">Right</Button>
          </Tooltip>
        </Stack>
      ))}
    </Stack>
  ),
  parameters: { layout: 'fullscreen', backgrounds: { default: 'void' } },
}
